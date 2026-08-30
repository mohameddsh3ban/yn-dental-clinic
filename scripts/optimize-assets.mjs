/**
 * Resizes the shipped image derivatives down to the sizes the layout actually
 * paints them at (2x the CSS box, no more), and re-encodes the two remaining
 * PNGs as WebP.
 *
 * Everything under `src/assets/{services,about,hospitals}` is itself generated
 * from the masters in `brand/` by the `prep-*` scripts, so downscaling in place
 * is reversible: re-run the prep script, then this one.
 *
 * The hero drawing goes to `public/hero/` instead, in three widths, because it
 * is the LCP element and index.html has to be able to preload it by a stable
 * URL before the bundle has been parsed.
 *
 * Run: node scripts/optimize-assets.mjs
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const WEBP = { quality: 82, effort: 6 }

async function shrinkDir(dir, width) {
  for (const file of await readdir(dir)) {
    if (!file.endsWith('.webp')) continue
    const p = path.join(dir, file)
    // Read through a buffer: on Windows sharp keeps the source file open, and
    // writing back to a path it is still reading fails with UNKNOWN.
    const input = await readFile(p)
    const before = input.length
    const meta = await sharp(input).metadata()
    if (meta.width <= width) {
      console.log(`  = ${file} already ${meta.width}px`)
      continue
    }
    const out = await sharp(input).resize({ width, withoutEnlargement: true }).webp(WEBP).toBuffer()
    await writeFile(p, out)
    console.log(
      `  ↓ ${file} ${meta.width}px → ${width}px, ${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`,
    )
  }
}

async function toWebp(src, dest, width) {
  const input = await readFile(src)
  const before = input.length
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ ...WEBP, alphaQuality: 90 })
    .toFile(dest)
  console.log(
    `  → ${path.basename(dest)} ${info.width}x${info.height}, ${(before / 1024).toFixed(0)}KB → ${(info.size / 1024).toFixed(0)}KB`,
  )
}

console.log('services (cards paint at ~280px):')
await shrinkDir('src/assets/services', 560)

console.log('about (photo stack paints at ~452px):')
await shrinkDir('src/assets/about', 904)

console.log('hospitals (cards paint at ~360px):')
await shrinkDir('src/assets/hospitals', 800)

console.log('hero (LCP element, preloaded from public/):')
await mkdir('public/hero', { recursive: true })
for (const w of [400, 600, 900]) {
  await toWebp('src/assets/hero/hero-face.webp', `public/hero/hero-face-${w}.webp`, w)
}

// The logo marks are not resized here: `scripts/build-logo.mjs` cuts them from
// the hero master at the size each placement needs and writes the WebP itself.
console.log('decoration:')
await toWebp('src/assets/implant.png', 'src/assets/implant.webp', 400)
