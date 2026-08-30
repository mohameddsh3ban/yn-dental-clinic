/**
 * Builds every shipped Ozea logo file from the vector masters in `brand/logo/`.
 *
 * The mark is the hero's own profile drawn in monoline — closed eye, brow, nose,
 * lips, jaw, ear and neck — with the skull read through the cheek, the two tooth
 * rows meeting on the bite plane and the gold implant seated in a lower molar,
 * held in a gold ring on the brand's ink. The logo and the hero are the same
 * face drawn twice: once in wash for the hero, once in line for the mark.
 *
 * The vector masters are traced from the drawing by `scripts/trace-logo.mjs`,
 * which runs once per revision of the artwork. Everything here derives from
 * them, so the badge, the favicon, the share card and the print lockup cannot
 * drift apart.
 *
 * Run: node scripts/build-logo.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const SRC = 'brand/logo'
const GOLD = '#C9AC7C'
const INK = { r: 20, g: 18, b: 15 }

/**
 * Renders an SVG master at a given pixel width.
 *
 * `density` is how sharp sizes an SVG that carries only a viewBox: the document
 * is treated as 72dpi user units, so the scale has to be worked out from the
 * viewBox rather than passed as a width. Anything painted with `currentColor` is
 * resolved here — a rasteriser has no cascade to inherit from.
 */
async function render(file, width) {
  const svg = await readFile(`${SRC}/${file}`, 'utf8')
  const [, , vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)
  return sharp(Buffer.from(svg.replaceAll('currentColor', GOLD)), {
    density: (72 * width) / vw,
  })
    .resize({ width, height: Math.round((vh / vw) * width) })
    .png()
    .toBuffer()
}

const copy = async (from, to) => writeFile(to, await readFile(`${SRC}/${from}`))

await mkdir('public/brand', { recursive: true })

// The app ships the vector: one file covers the 36px floating-nav badge and the
// 200px footer lockup at every pixel ratio, and it is the same set of curves the
// print files are cut from.
await copy('ozea-mark.svg', 'src/assets/logo-mark.svg')
await copy('ozea-mark.svg', 'public/brand/ozea-mark.svg')
await copy('ozea-mark-gold.svg', 'public/brand/ozea-mark-gold.svg')
await copy('ozea-lockup.svg', 'public/brand/ozea-lockup.svg')
await copy('ozea-icon.svg', 'public/favicon.svg')

// Raster fallbacks, for the places a vector is not an option: mail clients, the
// crawlers' share cards, and browsers that still want a PNG favicon.
await writeFile('public/brand/ozea-mark.png', await render('ozea-mark.svg', 1024))
await writeFile('public/brand/ozea-lockup.png', await render('ozea-lockup.svg', 1200))

// Icons come from the thickened master. Squared onto ink rather than left
// transparent: a PNG favicon with transparent corners shows the browser's own
// chrome through them, which reads as a chipped coin.
const icon = async (size) =>
  sharp({ create: { width: size, height: size, channels: 4, background: INK } })
    .composite([{ input: await render('ozea-icon.svg', size) }])
    .png()
    .toBuffer()

await writeFile('public/favicon.png', await icon(256))
await writeFile('public/apple-touch-icon.png', await icon(180))

// Share card: the lockup centred on ink, at the ratio the crawlers want.
const card = { w: 1200, h: 630 }
const lockup = await render('ozea-lockup.svg', 340)
const meta = await sharp(lockup).metadata()
await sharp({ create: { width: card.w, height: card.h, channels: 4, background: INK } })
  .composite([
    {
      input: lockup,
      left: Math.round((card.w - meta.width) / 2),
      top: Math.round((card.h - meta.height) / 2),
    },
  ])
  .jpeg({ quality: 90 })
  .toFile('public/brand/ozea-share.jpg')

console.log('logo built — vector mark, lockup, icons, share card')
