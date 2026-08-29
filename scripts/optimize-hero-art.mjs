/**
 * Turns the full-resolution hero concept renders into web-ready WebP.
 *
 * The cutouts arrive as ~4 MB transparent PNGs, which is far too heavy for a
 * hero image. Framing is deliberately left alone: every concept keeps the same
 * 3:2 canvas so the demo page can position chips by percentage and have them
 * land in the same place for each option.
 *
 *   node scripts/optimize-hero-art.mjs
 */
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = 'brand/hero-concepts'
const OUTPUT_DIR = 'src/assets/hero'
const MAX_WIDTH = 1600
const QUALITY = 88

await mkdir(OUTPUT_DIR, { recursive: true })

// A leading underscore marks reference renders that are archived but not shipped.
const sources = (await readdir(SOURCE_DIR)).filter(
  (name) => name.endsWith('.png') && !name.startsWith('_'),
)
if (sources.length === 0) {
  throw new Error(`No PNG concepts found in ${SOURCE_DIR}`)
}

for (const name of sources) {
  const from = join(SOURCE_DIR, name)
  const to = join(OUTPUT_DIR, `${parse(name).name}.webp`)

  await sharp(from)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY, alphaQuality: 100, effort: 6 })
    .toFile(to)

  const before = (await stat(from)).size
  const after = (await stat(to)).size
  const saved = Math.round((1 - after / before) * 100)
  console.log(
    `${name} -> ${parse(to).base}  ${(before / 1e6).toFixed(2)} MB -> ${(after / 1e3).toFixed(0)} KB (-${saved}%)`,
  )
}
