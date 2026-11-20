/**
 * Prepares the homepage hero artwork: the sculpted profile with the jaw, both
 * tooth rows and a gold implant read through the cheek.
 *
 * The master is a cut-out on a transparent ground with the whole head in
 * frame. This crops it to the figure (plus a little air), dissolves the cut
 * edge of the bust into the page so there is no hard line where the neck
 * ends, and writes the three widths the hero's `srcSet` asks for.
 *
 *   node scripts/prep-hero-profile.mjs <cutout.png>
 *
 * Writes brand/hero-concepts/hero-profile.png (the cropped, faded master) and
 * public/hero/hero-profile-{400,640,960}.webp. The hero is the LCP element, so
 * the files live in `public/` under stable names that index.html can preload.
 * It prints the overlay box to copy into `ART` in sections/HeroFacial.tsx.
 */
import sharp from 'sharp'

const src = process.argv[2]
if (!src) {
  console.error('usage: node scripts/prep-hero-profile.mjs <cutout.png>')
  process.exit(1)
}

/** Air kept around the figure, as a share of its own width. */
const PAD = 0.035
/** The bust dissolves over this share of the height, from the bottom up. */
const FADE = 0.16
/** Height is capped at this multiple of the width. */
const MAX_ASPECT = 1.28
const WIDTHS = [400, 640, 960]

const whole = sharp(src).ensureAlpha()
const meta = await whole.metadata()
const raw = await whole.raw().toBuffer()

// Bounding box of everything that is not (nearly) transparent.
let x0 = meta.width, y0 = meta.height, x1 = 0, y1 = 0
for (let y = 0; y < meta.height; y++) {
  for (let x = 0; x < meta.width; x++) {
    if (raw[(y * meta.width + x) * 4 + 3] > 24) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
}
const pad = Math.round((x1 - x0) * PAD)
const left = Math.max(0, x0 - pad)
const top = Math.max(0, y0 - pad)
const w = Math.min(meta.width, x1 + pad) - left
// The shoulders are trimmed: the hero wants the head large, not the bust whole.
const h = Math.min(Math.min(meta.height, y1) - top, Math.round(w * MAX_ASPECT))

const data = await sharp(raw, { raw: { width: meta.width, height: meta.height, channels: 4 } })
  .extract({ left, top, width: w, height: h })
  .raw()
  .toBuffer()

const from = Math.round(h * (1 - FADE))
for (let y = from; y < h; y++) {
  const k = Math.pow(1 - (y - from) / (h - from), 1.5)
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4 + 3
    data[i] = Math.round(data[i] * k)
  }
}

const base = sharp(data, { raw: { width: w, height: h, channels: 4 } })
await base.clone().png({ compressionLevel: 9 }).toFile('brand/hero-concepts/hero-profile.png')

for (const width of WIDTHS) {
  const info = await base
    .clone()
    .resize(width)
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toFile(`public/hero/hero-profile-${width}.webp`)
  console.log(`hero-profile-${width}.webp  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} kB`)
}
console.log(`overlay box: 1000 × ${Math.round((1000 * h) / w)}  (ART.vw × ART.vh in sections/HeroFacial.tsx)`)
