/**
 * Turns the single-page build into one real HTML file per page.
 *
 * `vite build` leaves `dist/index.html` with an empty <div id="root"> — fine
 * for a browser, invisible to anything that does not run JavaScript, which
 * includes most AI crawlers and a good share of search-engine fetches. This
 * script renders every route in every language at build time and writes:
 *
 *   dist/index.html, dist/ar.html, dist/services/dental-implants.html, …
 *     the page's own content inside #root, its own <title>, description,
 *     canonical, hreflang alternates and JSON-LD, the right <html lang dir>,
 *     and modulepreloads for the chunks that page needs
 *   dist/404.html        served by Cloudflare Pages with a real 404 status
 *   dist/sitemap.xml     every page, with its translations as alternates
 *   dist/llms.txt        a short, linked description of the site for LLMs
 *   dist/llms-full*.txt  the full text of every page, one file per language
 *
 * Files are flat (`ar.html`, not `ar/index.html`) so Cloudflare Pages serves
 * them at URLs with no trailing slash, matching the canonicals.
 *
 * Run by `npm run build`, after the client build and the SSR build:
 *   node scripts/prerender.mjs
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = path.resolve('dist')
const SSR = path.resolve('dist-ssr')

const server = await import(pathToFileURL(path.join(SSR, 'entry-server.js')).href)
const {
  render,
  ready,
  getSeo,
  renderHead,
  indexablePaths,
  getBundle,
  localize,
  absolute,
  LANGS,
  LANG_META,
  SITE_URL,
  PAGES,
  SERVICES_PATH,
  PLANNING_PATH,
  planningMeta,
  CONTACT_PATH,
  doctorSlugs,
  doctorFrom,
  site,
} = server

await ready()

const template = await readFile(path.join(DIST, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(path.join(DIST, '.vite', 'manifest.json'), 'utf8'))

// ---------------------------------------------------------------------------
// Chunks to preload per page
// ---------------------------------------------------------------------------

const entry = Object.values(manifest).find((m) => m.isEntry)

/** A chunk and everything it statically imports, minus what the entry already loads. */
function chunkFiles(key, seen = new Set()) {
  const item = manifest[key]
  if (!item || item === entry || seen.has(key)) return []
  seen.add(key)
  return [item.file, ...(item.imports ?? []).flatMap((k) => chunkFiles(k, seen))]
}

function routeChunks(stripped) {
  if (stripped === '/') return ['src/sections/BelowFold.tsx', 'src/components/PageChrome.tsx']
  if (stripped === SERVICES_PATH) return ['src/pages/ServicesIndex.tsx']
  if (stripped === CONTACT_PATH) return ['src/pages/ContactPage.tsx']
  if (stripped === PLANNING_PATH) return ['src/pages/Planning3D.tsx']
  if (stripped.startsWith('/team/')) return ['src/pages/DoctorProfile.tsx']
  if (PAGES.some((p) => p.path === stripped)) return ['src/pages/ContentPage.tsx']
  return ['src/pages/NotFound.tsx']
}

/** The two faces a page sets first, per script. Only files that exist are preloaded. */
const FONT_PRELOADS = {
  ar: ['ibm-plex-sans-arabic-arabic-400.woff2', 'ibm-plex-sans-arabic-arabic-500.woff2'],
  ru: ['inter-tight-cyrillic-300-700.woff2', 'inter-cyrillic-300-600.woff2'],
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

function block(html, name, replacement) {
  const pattern = new RegExp(`<!--${name}-->[\\s\\S]*?<!--/${name}-->`)
  if (!pattern.test(html)) throw new Error(`index.html is missing the <!--${name}--> block`)
  return html.replace(pattern, () => replacement)
}

async function page(pathname, { stripped, clientOnly = false } = {}) {
  const seo = getSeo(pathname)
  const body = await render(pathname)

  let html = template
  html = html.replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${seo.lang}" dir="${seo.dir}">`)
  html = block(html, 'seo', renderHead(seo))

  // Only the homepage paints the hero artwork; preloading it elsewhere is a
  // wasted high-priority request.
  if (!seo.isHome) html = block(html, 'home', '')

  const fonts = (FONT_PRELOADS[seo.lang] ?? []).filter((f) =>
    existsSync(path.join(DIST, 'fonts', f)),
  )
  if (fonts.length) {
    html = block(
      html,
      'fonts',
      fonts
        .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/fonts/${f}" crossorigin />`)
        .join('\n    '),
    )
  }

  const chunks = [
    ...chunkFiles(`src/lib/copy/bundles/${seo.lang}.ts`),
    ...routeChunks(stripped ?? pathname).flatMap((k) => chunkFiles(k)),
  ]
  const preloads = [...new Set(chunks)]
    .filter((f) => f.endsWith('.js'))
    .map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`)
    .join('\n    ')
  html = html.replace('</head>', `  ${preloads}\n  </head>`)

  if (!html.includes('<div id="root"></div>')) throw new Error('index.html has no empty #root')
  html = html.replace(
    '<div id="root"></div>',
    () => `<div id="root"${clientOnly ? ' data-render="client"' : ''}>${body}</div>`,
  )

  return html
}

async function write(file, contents) {
  const target = path.join(DIST, file)
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, contents)
}

const fileFor = (pathname) => (pathname === '/' ? 'index.html' : `${pathname.slice(1)}.html`)

const paths = indexablePaths()
let count = 0

for (const lang of LANGS) {
  for (const stripped of paths) {
    const pathname = localize(stripped, lang)
    await write(fileFor(pathname), await page(pathname, { stripped }))
    count++
  }
}

// One 404 document for every unknown URL; the app re-renders it in the right
// language on arrival, so it is not hydrated (see lib/prerendered.ts).
await write('404.html', await page('/404', { clientOnly: true }))
await write('hero-demo.html', await page('/hero-demo', { clientOnly: true }))

// ---------------------------------------------------------------------------
// sitemap.xml
// ---------------------------------------------------------------------------

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...LANGS.flatMap((lang) =>
    paths.map((stripped) =>
      [
        '  <url>',
        `    <loc>${absolute(localize(stripped, lang))}</loc>`,
        ...LANGS.map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${LANG_META[l].hreflang}" href="${absolute(localize(stripped, l))}" />`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${absolute(stripped)}" />`,
        '  </url>',
      ].join('\n'),
    ),
  ),
  '</urlset>',
  '',
].join('\n')

await write('sitemap.xml', sitemap)

// ---------------------------------------------------------------------------
// llms.txt and llms-full*.txt
// ---------------------------------------------------------------------------

/** Display-only direction marks have no business in plain text. */
const plain = (s) => s.replace(/[⁦-⁩‎‏]/g, '')

function fullText(lang) {
  const { site: c, pages: p } = getBundle(lang)
  const u = (stripped) => absolute(localize(stripped, lang))
  const out = []

  out.push(`# ${c.site.name}`, '', `> ${c.meta.description}`, '')
  out.push(
    `- ${c.location.addressLabel}: ${c.site.address.street}, ${c.site.address.city}`,
    `- ${c.location.phoneLabel}: ${site.phones.map((ph) => ph.label).join(' / ')} (WhatsApp: ${site.phones[0].label})`,
    `- Google Maps: ${site.maps.link}`,
    `- Instagram: ${site.instagram}`,
    `- URL: ${u('/')}`,
    '',
  )

  out.push(`## ${p.homeFaq.eyebrow}`, '')
  for (const faq of p.homeFaq.items) out.push(`### ${faq.q}`, '', faq.a, '')

  const studio = planningMeta[lang]
  out.push(`## ${studio.nav}`, '', u(PLANNING_PATH), '', studio.blurb, '')

  out.push(`## ${c.nav.team}`, '')
  for (const slug of doctorSlugs) {
    const d = doctorFrom(slug, c)
    out.push(`### ${d.name} — ${d.title}`, '', `${u(`/team/${slug}`)}`, '', d.lead, '', d.intro, '')
    out.push(...d.focus.map((f) => `- ${f.name}: ${f.descriptor}`), '')
    for (const blockItem of d.cv) {
      out.push(`**${blockItem.heading}**`, '', ...blockItem.items.map((i) => `- ${i}`), '')
    }
  }

  for (const meta of PAGES) {
    const page = p.content[meta.id]
    out.push('---', '', `## ${page.h1}`, '', u(meta.path), '', page.answer, '')
    out.push(...page.facts.map((f) => `- ${f.label}: ${f.value}`), '')
    for (const section of page.sections) {
      out.push(`### ${section.heading}`, '')
      if (section.list) out.push(...section.list.map((i) => `- ${i}`), '')
      for (const paragraph of section.body ?? []) out.push(paragraph, '')
    }
    if (page.steps?.length) {
      out.push(`### ${p.ui.stepsHeadline} ${p.ui.stepsOutlined}`, '')
      out.push(...page.steps.map((s, i) => `${i + 1}. ${s.name} — ${s.text}`), '')
    }
    out.push(`### ${p.ui.faqHeadline} ${p.ui.faqOutlined}`, '')
    for (const faq of page.faqs) out.push(`**${faq.q}**`, '', faq.a, '')
  }

  out.push('---', '', p.ui.disclaimer, '')
  return plain(out.join('\n'))
}

const fullFile = (lang) => (lang === 'en' ? 'llms-full.txt' : `llms-full-${lang}.txt`)

for (const lang of LANGS) await write(fullFile(lang), fullText(lang))

{
  const { site: c, pages: p } = getBundle('en')
  const out = []
  out.push(`# ${c.site.name}`, '', `> ${c.meta.description}`, '')
  out.push(
    `${c.site.name} is a dental and oral & maxillofacial surgery practice at ${c.site.address.street}, ${c.site.address.city}, Egypt. ` +
      'It provides dental implants and full-arch rehabilitation, corrective jaw surgery, facial trauma surgery, TMJ treatment, ' +
      'removal of impacted teeth and jaw cysts, and cosmetic and restorative dentistry. Theatre cases are performed in affiliated hospitals. ' +
      `For appointment enquiries, contact the clinic on WhatsApp at ${site.phones[0].label}. Consultations are held in Arabic and English; ` +
      'the site is published in English, Arabic, French and Russian.',
    '',
  )

  out.push('## Clinic', '')
  out.push(
    `- [Homepage](${SITE_URL}/): overview, cases, team, hospital affiliations, location`,
    `- [${planningMeta.en.nav}](${absolute(PLANNING_PATH)}): ${planningMeta.en.blurb} See jaw movements, compare views and explore the parts of a dental implant.`,
    `- [${p.contact.eyebrow} and location](${absolute(CONTACT_PATH)}): address, phone, WhatsApp, directions`,
    `- [${p.content['international-patients'].nav}](${absolute('/international-patients')}): ${p.content['international-patients'].blurb}`,
    '',
  )

  out.push('## Treatments', '')
  out.push(`- [All services](${absolute(SERVICES_PATH)}): every treatment page, grouped`)
  for (const meta of PAGES.filter((m) => m.kind !== 'info')) {
    const page = p.content[meta.id]
    out.push(`- [${page.nav}](${absolute(meta.path)}): ${page.blurb}`)
  }
  out.push('')

  out.push('## Doctors', '')
  for (const slug of doctorSlugs) {
    const d = doctorFrom(slug, c)
    out.push(`- [${d.name}](${absolute(`/team/${slug}`)}): ${d.title}. ${d.lead}`)
  }
  out.push('')

  out.push('## Full text', '')
  for (const lang of LANGS) {
    out.push(`- [Full site text — ${LANG_META[lang].label}](${SITE_URL}/${fullFile(lang)})`)
  }
  out.push('')

  out.push('## Other languages', '')
  for (const lang of LANGS.filter((l) => l !== 'en')) {
    out.push(`- [${LANG_META[lang].label}](${absolute(localize('/', lang))})`)
  }
  out.push('')

  await write('llms.txt', plain(out.join('\n')))
}

// The manifest was only needed to work out the preloads; it is not a public file.
await rm(path.join(DIST, '.vite'), { recursive: true, force: true })

console.log(
  `prerendered ${count} pages (${paths.length} routes × ${LANGS.length} languages) + 404, sitemap.xml, llms.txt`,
)
