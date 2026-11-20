// Everything a page says about itself in <head>: title, description,
// canonical, hreflang alternates, Open Graph and the JSON-LD graph.
//
// One function, `getSeo(pathname)`, is the single source for all of it. The
// build calls it for every route and writes the result into that route's
// pre-rendered HTML; the browser calls it on client-side navigation to keep
// the live document in step (`lib/useSeo.ts`). Nothing here touches the DOM.
//
// STRUCTURED DATA REVIEW: only facts the site already states are published —
// name, address, phones, doctors, treatments, hospital admission. Opening
// hours, map coordinates, prices and review ratings are deliberately absent
// until the clinic confirms them; see `CLINIC_FACTS` below.

import { DIR, LANG_META, LANGS, fill, type Lang } from '@/lib/copy'
import { getBundle } from '@/lib/copy/bundle'
import type { Faq } from '@/lib/copy/pages/types'
import { CONTACT_PATH, MEDICAL_REVIEW, PAGES, SERVICES_PATH, type PageMeta } from '@/lib/pages'
import { SITE_URL, absolute, langOf, localize, stripLang } from '@/lib/paths'
import { PLANNING_MODEL, PLANNING_PATH, planningMeta } from '@/lib/planning3d'
import { site } from '@/lib/site'
import { doctorFrom, doctorSlugs } from '@/lib/team'

/**
 * Facts for the structured data that are not on the site yet. Fill these in
 * once the clinic confirms them and they are published automatically:
 *
 *   openingHours — schema.org form, e.g. ['Sa-Th 12:00-22:00']. The site
 *     currently displays "Every day · 24/7"; that is not repeated here until
 *     someone confirms it is literally true.
 *   geo — the pin from Google Maps, e.g. { latitude: 30.08, longitude: 31.33 }.
 */
export const CLINIC_FACTS: {
  openingHours: readonly string[] | null
  geo: { latitude: number; longitude: number } | null
} = {
  openingHours: null,
  geo: null,
}

const SHARE_IMAGE = `${SITE_URL}/brand/ozea-share.jpg`
const LOGO = `${SITE_URL}/brand/ozea-mark.png`
const CLINIC_ID = `${SITE_URL}/#clinic`
const WEBSITE_ID = `${SITE_URL}/#website`

const NAME_EN = 'Ozea Dental Clinic'
const NAME_AR = 'عيادة Ozea لطب الأسنان'
/** The name the practice is listed under on Google Maps. */
const MAPS_NAME = 'Dr. Youssef Nasser Dental Implant and Maxillofacial Surgery'

const PLACE: Record<Lang, { locality: string; region: string; country: string }> = {
  en: { locality: 'Nasr City', region: 'Cairo', country: 'Egypt' },
  ar: { locality: 'مدينة نصر', region: 'القاهرة', country: 'مصر' },
  fr: { locality: 'Nasr City', region: 'Le Caire', country: 'Égypte' },
  ru: { locality: 'Наср-Сити', region: 'Каир', country: 'Египет' },
}

type Json = Record<string, unknown>

export type Seo = {
  lang: Lang
  dir: 'ltr' | 'rtl'
  title: string
  description: string
  canonical: string
  /** Empty for pages that should not be indexed. */
  alternates: { hreflang: string; href: string }[]
  robots: string
  ogType: 'website' | 'profile' | 'article'
  ogImage: string
  ogLocale: string
  ogLocaleAlternates: string[]
  jsonLd: Json | null
  /** Only the homepage paints the hero drawing, so only it preloads it. */
  isHome: boolean
  indexable: boolean
}

type Resolved =
  | { type: 'home' }
  | { type: 'services' }
  | { type: 'contact' }
  | { type: 'planning3d' }
  | { type: 'content'; meta: PageMeta }
  | { type: 'doctor'; slug: string }
  | { type: 'missing' }

function resolve(path: string): Resolved {
  if (path === '/') return { type: 'home' }
  if (path === SERVICES_PATH) return { type: 'services' }
  if (path === CONTACT_PATH) return { type: 'contact' }
  if (path === PLANNING_PATH) return { type: 'planning3d' }

  const meta = PAGES.find((p) => p.path === path)
  if (meta) return { type: 'content', meta }

  const team = /^\/team\/([^/]+)$/.exec(path)
  if (team && (doctorSlugs as readonly string[]).includes(team[1])) {
    return { type: 'doctor', slug: team[1] }
  }

  return { type: 'missing' }
}

/** Every indexable path, without a language prefix. Drives the pre-render and the sitemap. */
export function indexablePaths(): string[] {
  return [
    '/',
    SERVICES_PATH,
    ...PAGES.map((p) => p.path),
    PLANNING_PATH,
    ...doctorSlugs.map((slug) => `/team/${slug}`),
    CONTACT_PATH,
  ]
}

function url(path: string, lang: Lang): string {
  return absolute(localize(path, lang))
}

/**
 * Search results show roughly 155–160 characters of a description. Anything
 * longer is cut at a word and closed with an ellipsis here, rather than
 * mid-word by the search engine.
 */
function clamp(text: string, max = 160): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

/** A phone number as it was typed, without the direction marks added for display. */
function plain(text: string): string {
  return text.replace(/[⁦-⁩‎‏]/g, '')
}

// ---------------------------------------------------------------------------
// Nodes
// ---------------------------------------------------------------------------

function clinicNode(lang: Lang, full: boolean): Json {
  const { site: c, pages: p } = getBundle(lang)
  const place = PLACE[lang]

  const node: Json = {
    '@type': ['Dentist', 'MedicalClinic'],
    '@id': CLINIC_ID,
    name: c.site.name,
    alternateName: [NAME_EN, NAME_AR, MAPS_NAME].filter((n) => n !== c.site.name),
    url: url('/', lang),
    image: SHARE_IMAGE,
    logo: LOGO,
    telephone: site.phones[0].tel,
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.site.address.street,
      addressLocality: place.locality,
      addressRegion: place.region,
      postalCode: '4451421',
      addressCountry: 'EG',
    },
    hasMap: site.maps.link,
  }

  if (CLINIC_FACTS.geo) node.geo = { '@type': 'GeoCoordinates', ...CLINIC_FACTS.geo }
  if (CLINIC_FACTS.openingHours) node.openingHours = CLINIC_FACTS.openingHours

  if (!full) return node

  return {
    ...node,
    description: c.meta.description,
    medicalSpecialty: 'https://schema.org/Dentistry',
    knowsAbout: PAGES.filter((m) => m.kind !== 'info').map((m) => p.content[m.id].nav),
    sameAs: [site.instagram, site.maps.link],
    availableLanguage: ['Arabic', 'English'],
    areaServed: [
      { '@type': 'City', name: place.region },
      { '@type': 'Country', name: place.country },
    ],
    contactPoint: site.phones.map((phone, i) => ({
      '@type': 'ContactPoint',
      telephone: phone.tel,
      contactType: i === 0 ? 'appointments (WhatsApp)' : 'appointments',
      availableLanguage: ['Arabic', 'English'],
      areaServed: 'EG',
    })),
    employee: doctorSlugs.map((slug) => ({ '@id': personId(slug) })),
    availableService: PAGES.filter((m) => m.kind === 'procedure').map((m) => ({
      '@type': 'MedicalProcedure',
      name: p.content[m.id].nav,
      url: url(m.path, lang),
    })),
  }
}

function websiteNode(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: NAME_EN,
    inLanguage: LANGS.map((l) => LANG_META[l].hreflang),
    publisher: { '@id': CLINIC_ID },
  }
}

function personId(slug: string): string {
  return `${SITE_URL}/team/${slug}#person`
}

function personNode(slug: string, lang: Lang): Json | null {
  const doctor = doctorFrom(slug, getBundle(lang).site)
  if (!doctor) return null

  const portrait = doctor.portrait.hero
  const image = typeof portrait === 'string' ? portrait : portrait?.[0]

  return {
    '@type': 'Person',
    '@id': personId(slug),
    name: doctor.name,
    jobTitle: doctor.title,
    description: doctor.lead,
    url: url(`/team/${slug}`, lang),
    ...(image ? { image: absolute(image) } : {}),
    worksFor: { '@id': CLINIC_ID },
    knowsAbout: doctor.focus.map((f) => f.name),
  }
}

function breadcrumbNode(pageUrl: string, trail: { name: string; item: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }
}

function faqNode(pageUrl: string, faqs: readonly Faq[]): Json {
  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: plain(faq.a) },
    })),
  }
}

function webPageNode(
  type: string,
  pageUrl: string,
  lang: Lang,
  title: string,
  description: string,
  extra: Json = {},
): Json {
  return {
    '@type': type,
    '@id': `${pageUrl}#webpage`,
    url: pageUrl,
    name: title,
    description,
    inLanguage: LANG_META[lang].hreflang,
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': CLINIC_ID },
    primaryImageOfPage: SHARE_IMAGE,
    ...extra,
  }
}

function graph(nodes: (Json | null)[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes.filter((n) => n !== null) }
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export function getSeo(pathname: string): Seo {
  const lang = langOf(pathname)
  const path = stripLang(pathname.replace(/\/+$/, '') || '/')
  const { site: c, pages: p } = getBundle(lang)
  const found = resolve(path)
  const pageUrl = url(path, lang)
  const homeCrumb = { name: p.ui.home, item: url('/', lang) }

  let title = c.meta.title
  let description = c.meta.description
  let ogType: Seo['ogType'] = 'website'
  let jsonLd: Json | null = null

  switch (found.type) {
    case 'home': {
      jsonLd = graph([
        clinicNode(lang, true),
        websiteNode(),
        webPageNode('WebPage', pageUrl, lang, title, description, {
          about: { '@id': CLINIC_ID },
        }),
        ...doctorSlugs.map((slug) => personNode(slug, lang)),
        faqNode(pageUrl, p.homeFaq.items),
      ])
      break
    }

    case 'services': {
      title = p.servicesIndex.metaTitle
      description = p.servicesIndex.metaDescription
      const listed = PAGES.filter((m) => m.group)
      jsonLd = graph([
        clinicNode(lang, false),
        webPageNode('CollectionPage', pageUrl, lang, title, description, {
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: listed.map((m, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.content[m.id].nav,
              url: url(m.path, lang),
            })),
          },
        }),
        breadcrumbNode(pageUrl, [homeCrumb, { name: p.ui.services, item: pageUrl }]),
      ])
      break
    }

    case 'contact': {
      title = p.contact.metaTitle
      description = p.contact.metaDescription
      jsonLd = graph([
        clinicNode(lang, true),
        webPageNode('ContactPage', pageUrl, lang, title, description, {
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          mainEntity: { '@id': CLINIC_ID },
        }),
        breadcrumbNode(pageUrl, [homeCrumb, { name: p.contact.eyebrow, item: pageUrl }]),
      ])
      break
    }

    case 'planning3d': {
      // The interactive 3D page (pages/Planning3D.tsx). Its words live in
      // lib/copy/planning3d; only the title and description are needed here.
      const meta3d = planningMeta[lang]
      title = meta3d.metaTitle
      description = meta3d.metaDescription
      jsonLd = graph([
        clinicNode(lang, false),
        webPageNode('MedicalWebPage', pageUrl, lang, title, description, {
          headline: meta3d.nav,
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          about: { '@id': CLINIC_ID },
          audience: { '@type': 'MedicalAudience', audienceType: 'Patient' },
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['[data-answer]'] },
          mainEntity: { '@id': `${pageUrl}#model` },
        }),
        {
          '@type': '3DModel',
          '@id': `${pageUrl}#model`,
          name: meta3d.nav,
          description: meta3d.blurb,
          encoding: [
            {
              '@type': 'MediaObject',
              contentUrl: absolute(PLANNING_MODEL),
              encodingFormat: 'model/gltf-binary',
            },
          ],
          creditText: 'Skull anatomy adapted from "Human Male Skull" by Ruslan Gadzhiev, CC BY 4.0',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        breadcrumbNode(pageUrl, [
          homeCrumb,
          { name: p.ui.services, item: url(SERVICES_PATH, lang) },
          { name: meta3d.nav, item: pageUrl },
        ]),
      ])
      break
    }

    case 'content': {
      const { meta } = found
      const copy = p.content[meta.id]
      title = copy.metaTitle
      description = copy.metaDescription
      ogType = 'article'

      const clinical = meta.kind !== 'info'
      const procedureId = `${pageUrl}#procedure`
      const reviewer = meta.doctors[0]

      const trail = [
        homeCrumb,
        ...(meta.kind === 'procedure'
          ? [{ name: p.ui.services, item: url(SERVICES_PATH, lang) }]
          : []),
        { name: copy.nav, item: pageUrl },
      ]

      jsonLd = graph([
        clinicNode(lang, false),
        webPageNode(clinical ? 'MedicalWebPage' : 'WebPage', pageUrl, lang, title, description, {
          headline: copy.h1,
          breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
          about: meta.kind === 'procedure' ? { '@id': procedureId } : { '@id': CLINIC_ID },
          // The opening paragraph is the passage written to be read out.
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['[data-answer]'] },
          ...(clinical
            ? { audience: { '@type': 'MedicalAudience', audienceType: 'Patient' } }
            : {}),
          ...(clinical && MEDICAL_REVIEW && reviewer
            ? { lastReviewed: MEDICAL_REVIEW.date, reviewedBy: { '@id': personId(reviewer) } }
            : {}),
        }),
        meta.kind === 'procedure'
          ? {
              '@type': 'MedicalProcedure',
              '@id': procedureId,
              name: copy.nav,
              alternateName: copy.h1,
              description: copy.answer,
              url: pageUrl,
              ...(copy.steps
                ? { howPerformed: copy.steps.map((s) => `${s.name}: ${s.text}`).join(' ') }
                : {}),
            }
          : null,
        ...meta.doctors.map((slug) => personNode(slug, lang)),
        faqNode(pageUrl, copy.faqs),
        breadcrumbNode(pageUrl, trail),
      ])
      break
    }

    case 'doctor': {
      const doctor = doctorFrom(found.slug, c)
      if (doctor) {
        title = fill(c.profile.docTitle, {
          name: doctor.name,
          title: doctor.title,
          clinic: c.site.name,
        })
        // A long name and a long job title push the clinic name past what a
        // search result shows; fall back to the short brand, then to none.
        if (title.length > 65) title = `${doctor.name} — ${doctor.title} | ${c.site.short}`
        if (title.length > 70) title = `${doctor.name} — ${doctor.title}`
        description = fill(c.profile.docDescription, {
          name: doctor.name,
          title: doctor.title,
          clinic: c.site.name,
          lead: doctor.lead,
        })
        ogType = 'profile'
        jsonLd = graph([
          clinicNode(lang, false),
          webPageNode('ProfilePage', pageUrl, lang, title, description, {
            breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
            mainEntity: { '@id': personId(found.slug) },
          }),
          personNode(found.slug, lang),
          breadcrumbNode(pageUrl, [homeCrumb, { name: doctor.name, item: pageUrl }]),
        ])
      }
      break
    }

    case 'missing': {
      title = p.notFound.metaTitle
      description = p.notFound.body
      break
    }
  }

  const indexable = found.type !== 'missing'

  description = clamp(plain(description))

  return {
    lang,
    dir: DIR[lang],
    title,
    description,
    canonical: pageUrl,
    alternates: indexable
      ? [
          ...LANGS.map((l) => ({ hreflang: LANG_META[l].hreflang, href: url(path, l) })),
          { hreflang: 'x-default', href: url(path, 'en') },
        ]
      : [],
    robots: indexable
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'noindex, follow',
    ogType,
    ogImage: SHARE_IMAGE,
    ogLocale: LANG_META[lang].ogLocale,
    ogLocaleAlternates: LANGS.filter((l) => l !== lang).map((l) => LANG_META[l].ogLocale),
    jsonLd,
    isHome: found.type === 'home',
    indexable,
  }
}

// ---------------------------------------------------------------------------
// Rendering to <head> markup (build time)
// ---------------------------------------------------------------------------

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** JSON-LD is inside a <script>, so the only thing to neutralise is `<`. */
export function jsonLdText(data: Json): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** The managed block of <head>, between the `seo` markers in index.html. */
export function renderHead(seo: Seo): string {
  const lines = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${seo.robots}" />`,
    `<link rel="canonical" href="${seo.canonical}" />`,
    ...seo.alternates.map(
      (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`,
    ),
    `<meta property="og:site_name" content="${esc(getBundle(seo.lang).site.site.name)}" />`,
    `<meta property="og:type" content="${seo.ogType}" />`,
    `<meta property="og:url" content="${seo.canonical}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:image" content="${seo.ogImage}" />`,
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    ...seo.ogLocaleAlternates.map(
      (l) => `<meta property="og:locale:alternate" content="${l}" />`,
    ),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${seo.ogImage}" />`,
    ...(seo.jsonLd
      ? [`<script type="application/ld+json" data-seo>${jsonLdText(seo.jsonLd)}</script>`]
      : []),
  ]
  return lines.join('\n    ')
}
