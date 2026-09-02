/**
 * Turns the kit's HTML artboards into print files.
 *
 * Headless Chrome does the typesetting and writes a real vector PDF — text stays
 * text, the logo stays curves, and the fonts are embedded. pdf-lib then does the
 * three things Chrome cannot: stamp an exact TrimBox and BleedBox so a press
 * knows where to cut, write the document metadata, and impose the card onto a
 * gang sheet with crop marks.
 *
 * Chrome quantises the paper size to whole device pixels, so its MediaBox lands
 * within about 0.15 mm of the requested sheet. That error is left alone on
 * purpose: the TrimBox written here is exact and centred, and the trim is the
 * only dimension a guillotine ever sees.
 */
import { execFile } from 'node:child_process'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { PDFDocument, rgb } from 'pdf-lib'
import { mm } from './tokens.mjs'

const run = promisify(execFile)

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

let chromeCache
async function chrome() {
  if (chromeCache) return chromeCache
  for (const candidate of CHROME_CANDIDATES) {
    try {
      await access(candidate)
      chromeCache = candidate
      return candidate
    } catch {
      /* try the next candidate */
    }
  }
  throw new Error(
    `No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary. Looked in: ${CHROME_CANDIDATES.join(', ')}`,
  )
}

const fileUrl = (p) => `file:///${p.replace(/\\/g, '/').replace(/^\/+/, '')}`

const BASE_FLAGS = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=4000',
]

/**
 * Runs Chrome and insists it actually wrote the file.
 *
 * Chrome exits 0 when a render fails — a bad output path, an unwritable
 * directory, a crashed renderer all look like success from the shell — so the
 * only trustworthy check is that the artefact exists and is not empty.
 */
async function chromeWrite(args, outPath, what) {
  const absolute = resolve(outPath)
  let stderr = ''
  try {
    ;({ stderr } = await run(await chrome(), [...BASE_FLAGS, ...args(absolute)]))
  } catch (error) {
    throw new Error(`Chrome failed rendering ${what}: ${error.stderr || error.message}`)
  }
  const size = await stat(absolute)
    .then((s) => s.size)
    .catch(() => 0)
  if (size === 0) {
    throw new Error(`Chrome wrote nothing for ${what} (${absolute}). Chrome said: ${stderr.trim()}`)
  }
  return absolute
}

/** Renders one HTML file to a single vector PDF, page size taken from `@page`. */
export async function htmlToPdf(htmlPath, pdfPath) {
  return chromeWrite(
    (out) => ['--no-pdf-header-footer', `--print-to-pdf=${out}`, fileUrl(resolve(htmlPath))],
    pdfPath,
    `PDF of ${htmlPath}`,
  )
}

/** Renders one artboard to a preview PNG at `scale` times its physical size. */
export async function htmlToPng(htmlPath, pngPath, { widthMm, heightMm, scale = 4 }) {
  const px = (v) => Math.round((v / 25.4) * 96)
  return chromeWrite(
    (out) => [
      `--force-device-scale-factor=${scale}`,
      `--window-size=${px(widthMm)},${px(heightMm)}`,
      `--screenshot=${out}`,
      fileUrl(resolve(htmlPath)),
    ],
    pngPath,
    `preview of ${htmlPath}`,
  )
}

/**
 * Stamps trim and bleed boxes and document metadata onto a rendered PDF.
 *
 * The TrimBox is centred inside whatever MediaBox Chrome produced, so the cut
 * lands on the nominal trim size even though the sheet itself is a fraction off.
 */
export async function finalizePdf(pdfPath, { trim, bleed, title, subject }) {
  const doc = await PDFDocument.load(await readFile(pdfPath))

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize()
    // A TrimBox may not fall outside the MediaBox. On a no-bleed piece Chrome's
    // sheet is a fraction under nominal, so the nominal trim would be illegal —
    // there the trim simply is the page.
    const box =
      bleed > 0
        ? [(width - mm(trim[0])) / 2, (height - mm(trim[1])) / 2, mm(trim[0]), mm(trim[1])]
        : [0, 0, width, height]
    page.setBleedBox(0, 0, width, height)
    page.setTrimBox(...box)
    page.setArtBox(...box)
  }

  doc.setTitle(title)
  doc.setSubject(subject ?? `Trim ${trim[0]}x${trim[1]} mm, ${bleed} mm bleed`)
  doc.setAuthor('Ozea Dental Clinic')
  doc.setCreator('Ozea brand kit - scripts/build-brand-kit.mjs')
  doc.setProducer('Chromium print-to-PDF + pdf-lib')
  doc.setKeywords(['Ozea Dental Clinic', 'print', `${trim[0]}x${trim[1]}mm`])

  await writeFile(pdfPath, await doc.save())
  return pdfPath
}

/** A crop mark set: eight short rules that stop short of the trim corners. */
function cropMarks(page, { x, y, w, h, offset = mm(1), len = mm(4) }) {
  const line = (a, b, c, d) =>
    page.drawLine({
      start: { x: a, y: b },
      end: { x: c, y: d },
      thickness: 0.25,
      color: rgb(0, 0, 0),
    })
  for (const cx of [x, x + w]) {
    const dir = cx === x ? -1 : 1
    for (const cy of [y, y + h]) line(cx + dir * offset, cy, cx + dir * (offset + len), cy)
  }
  for (const cy of [y, y + h]) {
    const dir = cy === y ? -1 : 1
    for (const cx of [x, x + w]) line(cx, cy + dir * offset, cx, cy + dir * (offset + len))
  }
}

/**
 * A proof sheet: the piece centred on a larger page with crop marks and a
 * caption, so the cut can be approved before a press is booked.
 */
export async function marksProof(pdfPath, outPath, { trim, bleed, label }) {
  const src = await readFile(pdfPath)
  const source = await PDFDocument.load(src)
  const out = await PDFDocument.create()
  const slug = mm(12)

  for (let i = 0; i < source.getPageCount(); i++) {
    const [embedded] = await out.embedPdf(src, [i])
    const page = out.addPage([embedded.width + slug * 2, embedded.height + slug * 2 + mm(6)])
    page.drawPage(embedded, { x: slug, y: slug + mm(6) })

    const inset = [(embedded.width - mm(trim[0])) / 2, (embedded.height - mm(trim[1])) / 2]
    cropMarks(page, {
      x: slug + inset[0],
      y: slug + mm(6) + inset[1],
      w: mm(trim[0]),
      h: mm(trim[1]),
    })
    page.drawText(
      `${label} - page ${i + 1}/${source.getPageCount()} - trim ${trim[0]}x${trim[1]} mm, ${bleed} mm bleed - marks show the cut`,
      { x: slug, y: mm(4), size: 6, color: rgb(0.35, 0.33, 0.3) },
    )
  }

  await writeFile(outPath, await out.save())
  return outPath
}

/**
 * Ganged A4 sheet of the two-sided card, for a digital press or a copy shop.
 *
 * Two columns with a 6 mm gutter, five rows stacked bleed-to-bleed. Every cut
 * line is marked in a margin or in the gutter — nothing is marked inside a
 * bleed, where the mark would print and then be cut away. Page 2 mirrors the
 * columns so a long-edge duplex flip registers back to front.
 */
export async function imposeCards(cardPdfPath, outPath, { trim, bleed, cols = 2, rows = 5 }) {
  const src = await readFile(cardPdfPath)
  const source = await PDFDocument.load(src)
  if (source.getPageCount() < 2) throw new Error('imposeCards expects a two-page card PDF')

  const out = await PDFDocument.create()
  const [front, back] = await out.embedPdf(src, [0, 1])
  const sheet = { w: mm(210), h: mm(297) }
  const card = { w: front.width, h: front.height }
  const gutter = mm(6)

  const gridW = cols * card.w + (cols - 1) * gutter
  const gridH = rows * card.h
  if (gridW > sheet.w || gridH > sheet.h) {
    throw new Error(`${cols}x${rows} cards do not fit on A4 at this size`)
  }
  const originX = (sheet.w - gridW) / 2
  const originY = (sheet.h - gridH) / 2
  const inset = [(card.w - mm(trim[0])) / 2, (card.h - mm(trim[1])) / 2]

  for (const [side, embedded] of [
    ['front', front],
    ['back', back],
  ]) {
    const page = out.addPage([sheet.w, sheet.h])
    const cuts = { x: new Set(), y: new Set() }

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const gridX = originX + col * (card.w + gutter)
        // Long-edge duplex turns the sheet about its vertical axis, so the backs
        // run in the opposite column order or every card gets the wrong reverse.
        const x = side === 'front' ? gridX : sheet.w - gridX - card.w
        const y = originY + row * card.h
        page.drawPage(embedded, { x, y })
        cuts.x.add(x + inset[0])
        cuts.x.add(x + inset[0] + mm(trim[0]))
        cuts.y.add(y + inset[1])
        cuts.y.add(y + inset[1] + mm(trim[1]))
      }
    }

    const rule = (a, b, c, d) =>
      page.drawLine({
        start: { x: a, y: b },
        end: { x: c, y: d },
        thickness: 0.25,
        color: rgb(0, 0, 0),
      })

    for (const x of cuts.x) {
      rule(x, mm(2), x, mm(6))
      rule(x, sheet.h - mm(2), x, sheet.h - mm(6))
    }
    for (const y of cuts.y) {
      rule(mm(1), y, mm(5), y)
      rule(sheet.w - mm(1), y, sheet.w - mm(5), y)
      const gx = originX + card.w
      rule(gx + mm(1), y, gx + gutter - mm(1), y)
    }

    page.drawText(
      `Ozea business card - ${side} - ${cols}x${rows} up on A4 - trim ${trim[0]}x${trim[1]} mm, ${bleed} mm bleed - long-edge duplex`,
      { x: mm(8), y: mm(3.2), size: 5.5, color: rgb(0.4, 0.38, 0.35) },
    )
  }

  out.setTitle('Ozea business card - A4 imposition')
  out.setAuthor('Ozea Dental Clinic')
  await mkdir(outPath.split(/[\\/]/).slice(0, -1).join('/'), { recursive: true })
  await writeFile(outPath, await out.save())
  return outPath
}
