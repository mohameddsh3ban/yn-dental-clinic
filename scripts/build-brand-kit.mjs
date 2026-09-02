/**
 * Builds the Ozea print and brand kit: logo files in every variant a supplier
 * asks for, and press-ready PDFs of the card, the prescription pad, the
 * letterhead and the brand guide.
 *
 * Run: node scripts/build-brand-kit.mjs [card|prescription|letterhead|guide]
 *
 * Everything is derived. `brand-kit/clinic.json` holds the words and numbers,
 * `brand/logo/*.svg` holds the curves, and nothing in `brand-kit/` is edited by
 * hand — so a changed phone number is one edit and one command, not a hunt
 * through five layouts.
 *
 * The numbers in `clinic.json` are checked against `src/lib/site.ts` before
 * anything renders. A card with a number the website no longer uses is worse
 * than no card, and it is the one error nobody catches by looking at a proof.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { buildLogos } from './brand-kit/logos.mjs'
import { fontFaces, htmlDocument } from './brand-kit/css.mjs'
import { pack } from './brand-kit/pack.mjs'
import { preflight } from './brand-kit/preflight.mjs'
import { finalizePdf, htmlToPdf, htmlToPng, imposeCards, marksProof } from './brand-kit/render.mjs'
import { SHEETS, pageSize } from './brand-kit/tokens.mjs'
import { cardSheets } from './brand-kit/artboards/card.mjs'
import { prescriptionSheets } from './brand-kit/artboards/prescription.mjs'
import { letterheadSheets } from './brand-kit/artboards/letterhead.mjs'
import { guideSheets } from './brand-kit/artboards/guide.mjs'

const OUT = 'brand-kit'
const DIRS = ['build', 'print', 'preview', 'logos', 'data']

/**
 * Fails the build if the printed numbers and links have drifted from the site.
 *
 * Regex rather than an import: `site.ts` is TypeScript with path aliases, and a
 * loader for it here would be more machinery than the check is worth. The probe
 * is the point — it either finds every value verbatim or it stops the build.
 */
async function verifyAgainstSite(data) {
  const site = await readFile('src/lib/site.ts', 'utf8')
  const missing = []

  for (const phone of data.phones) {
    if (!site.includes(`'${phone.tel}'`)) missing.push(`phone ${phone.tel}`)
    if (!site.includes(`'${phone.label}'`)) missing.push(`phone label ${phone.label}`)
  }
  if (!site.includes(data.instagram.url)) missing.push(`instagram ${data.instagram.url}`)
  if (!site.includes(data.maps.url)) missing.push(`maps ${data.maps.url}`)

  if (missing.length) {
    throw new Error(
      `brand-kit/clinic.json disagrees with src/lib/site.ts:\n  - ${missing.join('\n  - ')}\n` +
        'Reconcile them before printing anything.',
    )
  }
  return `contact data matches src/lib/site.ts (${data.phones.length} numbers, instagram, maps)`
}

/** The WhatsApp deep link, built the same way `src/lib/site.ts` builds it. */
const whatsappUrl = (data, lang) =>
  `https://wa.me/${data.phones[0].tel.replace(/\D/g, '')}` +
  `?text=${encodeURIComponent(data.whatsappMessage[lang])}`

/**
 * The same conversation without the pre-filled opener — this is what the printed
 * QR codes carry.
 *
 * The message-bearing link needs 49 QR modules; at 13 mm on a card that is
 * 0.27 mm a module, under what a phone camera reliably reads on uncoated stock.
 * The bare number needs 25 modules — 0.52 mm — and opens the same chat. The long
 * form stays in `data/links.txt`, where it costs nothing.
 */
const whatsappShort = (data) => `https://wa.me/${data.phones[0].tel.replace(/\D/g, '')}`

/** One printed piece: sheets in, PDF plus proof plus previews out. */
async function buildDoc({ name, title, sheet, sheets, stamp }) {
  const page = pageSize(sheet)
  const paths = {
    html: `${OUT}/build/${name}.html`,
    pdf: `${OUT}/print/${name}.pdf`,
    proof: `${OUT}/print/${name}-proof-with-marks.pdf`,
  }

  await writeFile(
    paths.html,
    await htmlDocument({
      title,
      pageMm: page,
      body: sheets.map((s) => s.html).join('\n'),
    }),
  )

  await htmlToPdf(paths.html, paths.pdf)
  await finalizePdf(paths.pdf, {
    trim: sheet.trim,
    bleed: sheet.bleed,
    title: `${title} — ${stamp}`,
  })
  if (sheet.bleed > 0) {
    await marksProof(paths.pdf, paths.proof, {
      trim: sheet.trim,
      bleed: sheet.bleed,
      label: title,
    })
  }

  // Previews carry the trim and safe-area guides; the print PDFs never do.
  for (const s of sheets) {
    const previewHtml = `${OUT}/build/${name}--${s.id}.html`
    await writeFile(
      previewHtml,
      await htmlDocument({ title: `${title} — ${s.id}`, pageMm: page, body: s.html, guides: true }),
    )
    await htmlToPng(previewHtml, `${OUT}/preview/${name}--${s.id}.png`, {
      widthMm: page[0],
      heightMm: page[1],
      scale: 4,
    })
  }

  return paths
}

/** A vCard, so the card's data can be handed over without retyping it. */
function vcard(data) {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.doctor.name.en}`,
    'N:Nasser;Youssef;;Dr.;',
    `ORG:${data.brand.name.en}`,
    `TITLE:${data.doctor.specialty.en}`,
    ...data.phones.map((p) => `TEL;TYPE=WORK,VOICE:${p.tel}`),
    `ADR;TYPE=WORK:;;${data.address.street.en};${data.address.city.en};;;Egypt`,
    `URL:${data.instagram.url}`,
    `URL:${data.maps.url}`,
    `NOTE:${data.hours.days.en} ${data.hours.time}`,
    'END:VCARD',
    '',
  ].join('\r\n')
}

async function main() {
  const only = process.argv[2]
  const data = JSON.parse(await readFile(`${OUT}/clinic.json`, 'utf8'))
  const stamp = new Date().toISOString().slice(0, 10)

  const verified = await verifyAgainstSite(data)
  console.log(`✓ ${verified}`)

  for (const dir of DIRS) await mkdir(`${OUT}/${dir}`, { recursive: true })

  const { sources } = await fontFaces()
  console.log(`✓ fonts: ${sources.join(', ')}`)

  const { set: logos, written } = await buildLogos(`${OUT}/logos`)
  console.log(
    `✓ logos: ${written.svg.length} SVG, ${written.png.length} PNG, ${written.print.length} print rasters`,
  )

  const context = { data, logos, whatsappUrl: whatsappShort(data), stamp }

  const docs = [
    {
      name: 'ozea-business-card',
      title: 'Ozea Dental Clinic — business card',
      sheet: SHEETS.card,
      make: cardSheets,
    },
    {
      name: 'ozea-prescription-a5-en',
      title: 'Ozea Dental Clinic — prescription A5 (English)',
      sheet: SHEETS.prescription,
      make: (ctx) => prescriptionSheets({ ...ctx, lang: 'en' }),
    },
    {
      name: 'ozea-prescription-a5-ar',
      title: 'Ozea Dental Clinic — prescription A5 (Arabic)',
      sheet: SHEETS.prescription,
      make: (ctx) => prescriptionSheets({ ...ctx, lang: 'ar' }),
    },
    {
      name: 'ozea-letterhead-a4',
      title: 'Ozea Dental Clinic — letterhead A4',
      sheet: SHEETS.letterhead,
      make: letterheadSheets,
    },
    {
      name: 'ozea-brand-guide',
      title: 'Ozea Dental Clinic — brand and print guide',
      sheet: SHEETS.guide,
      make: guideSheets,
    },
  ].filter((d) => !only || d.name.includes(only))

  for (const doc of docs) {
    const page = pageSize(doc.sheet)
    const sheets = await doc.make({ ...context, sheet: doc.sheet, page })
    await buildDoc({ ...doc, sheets, stamp })
    console.log(`✓ ${doc.name}: ${sheets.length} page(s), trim ${doc.sheet.trim.join('×')} mm`)
  }

  if (docs.some((d) => d.name === 'ozea-business-card')) {
    await imposeCards(`${OUT}/print/ozea-business-card.pdf`, `${OUT}/print/ozea-business-card-a4-10up.pdf`, {
      trim: SHEETS.card.trim,
      bleed: SHEETS.card.bleed,
    })
    console.log('✓ ozea-business-card-a4-10up: 10 cards per A4, long-edge duplex')
  }

  // Read the PDFs back and say what is in them. A build that only reports what
  // it intended to do is the failure mode this whole kit has to avoid.
  if (!only) {
    const { reports } = await preflight(`${OUT}/print`, { stamp })
    console.log(`✓ preflight: ${reports.length} PDFs read back — brand-kit/print/PREFLIGHT.txt`)
  }

  await writeFile(`${OUT}/data/ozea-dr-youssef-nasser.vcf`, vcard(data))
  await writeFile(
    `${OUT}/data/links.txt`,
    [
      `WhatsApp, printed QR codes:  ${whatsappShort(data)}`,
      `WhatsApp, English opener:    ${whatsappUrl(data, 'en')}`,
      `WhatsApp, Arabic opener:     ${whatsappUrl(data, 'ar')}`,
      `Google Maps:                 ${data.maps.url}`,
      `Instagram:                   ${data.instagram.url}`,
      '',
    ].join('\n'),
  )
  console.log('✓ data: vCard + links')

  // Pack last, so both archives contain everything this run produced.
  if (!only) {
    const { full, printOnly } = await pack({ stamp })
    const mb = (b) => `${(b / 1024 / 1024).toFixed(1)} MB`
    console.log(`✓ ${full.file}: ${full.count} files, ${mb(full.bytes)}`)
    console.log(`✓ ${printOnly.file}: ${printOnly.count} files, ${mb(printOnly.bytes)}`)
  }
}

await main()
