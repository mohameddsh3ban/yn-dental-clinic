/**
 * Prepares the client-supplied hero artwork for the web.
 *
 * Unlike `build-face-jaw.mjs`, nothing here is composited: the master already
 * carries the line drawing and the anatomy in one image, and the client picked
 * it as the reference. So this script only does what shipping it requires —
 * lift the paper to transparency so the art sits on the hero's cream gradient
 * instead of on a white rectangle, crop to the head, dissolve the bottom edge,
 * and write the webp.
 *
 * The paper is keyed by DISTANCE from the paper colour, not by darkness: the
 * bone in this drawing is lighter and duller than the ink but not darker than
 * the sheet, so a luminance key would drop the whole skull and keep only the
 * outline.
 *
 *   node scripts/prep-hero-face.mjs [key=value ...]
 */
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)
const num = (k, d) => Number(args[k] ?? d)

const CFG = {
  src: args.src ?? 'brand/hero-concepts/faceline-v2/NORTHSTAR-implant.png',
  out: args.out ?? 'brand/hero-concepts/hero-face.png',
  webp: args.webp ?? 'src/assets/hero/hero-face.webp',
  preview: args.preview ?? 'brand/hero-concepts/previews/hero-face-art.png',
  width: num('width', 2200),
  // The figure renders at most ~490px wide, so 1200 already covers a 2x
  // display. The ghost anatomy is all soft gradient, which webp pays dearly
  // for: at 1500/q90 this asset was 712KB, which is no size for an LCP image.
  webpWidth: num('webpWidth', 1200),
  webpQuality: num('webpQuality', 80),
  // The alpha channel is the expensive half of this asset — one big soft ramp,
  // which sharp encodes at quality 100 unless told otherwise. Measured on this
  // image: 450KB at alphaQuality 100, 215KB at 60. Colour quality barely moves
  // it (450KB -> 420KB from q82 to q68), so the saving all comes from here.
  alphaQuality: num('alphaQuality', 65),

  // Keying. Measured, not guessed — see the printed diff report.
  dead: num('dead', 0.02), // paper grain lives under this
  span: num('span', 0.07), // full alpha by dead+span
  // The ghost anatomy sits a few levels off the paper. Pushing that deviation
  // further from paper keeps it readable once the sheet behind it is gone.
  contrast: num('contrast', 1.35),
  // Ink is keyed on its own ramp so the outline stays at full strength while
  // the anatomy stays a whisper.
  inkOn: num('inkOn', 0.3),

  // Shipped crop, as fractions of the master.
  cropX0: num('cropX0', 0.06),
  cropX1: num('cropX1', 1),
  cropY0: num('cropY0', 0.09),
  cropY1: num('cropY1', 0.86),
  fadeBottom: num('fadeBottom', 0.09),
}

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

const W = CFG.width
const img = sharp(CFG.src).resize({ width: W }).flatten({ background: '#ffffff' })
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
const { width: w, height: h, channels } = info

// The sheet is most of the image, so a high percentile per channel IS the paper.
const cols = [[], [], []]
for (let y = 0; y < h; y += 3) {
  for (let x = 0; x < w; x += 3) {
    const p = (y * w + x) * channels
    for (let c = 0; c < 3; c++) cols[c].push(data[p + c])
  }
}
const paper = cols.map((c) => {
  c.sort((a, b) => a - b)
  return c[Math.floor(c.length * 0.8)]
})

const out = Buffer.alloc(w * h * 4)
const hist = new Array(12).fill(0)
for (let i = 0; i < w * h; i++) {
  const p = i * channels
  let diff = 0
  for (let c = 0; c < 3; c++) diff = Math.max(diff, Math.abs(data[p + c] - paper[c]) / 255)
  hist[Math.min(11, Math.floor(diff * 40))]++

  const a = smooth(CFG.dead, CFG.dead + CFG.span, diff)
  const q = i * 4
  if (a <= 0.002) {
    out[q] = out[q + 1] = out[q + 2] = out[q + 3] = 0
    continue
  }
  // Ink keeps its own colour; the anatomy is pushed away from paper so it does
  // not wash out once the sheet is transparent.
  const isInk = diff > CFG.inkOn
  const k = isInk ? 1 : CFG.contrast
  out[q] = clamp(paper[0] + (data[p] - paper[0]) * k, 0, 255)
  out[q + 1] = clamp(paper[1] + (data[p + 1] - paper[1]) * k, 0, 255)
  out[q + 2] = clamp(paper[2] + (data[p + 2] - paper[2]) * k, 0, 255)
  out[q + 3] = Math.round(a * 255)
}

const art = sharp(out, { raw: { width: w, height: h, channels: 4 } })
await art.clone().png({ compressionLevel: 9 }).toFile(CFG.out)

const crop = {
  left: Math.round(CFG.cropX0 * w),
  top: Math.round(CFG.cropY0 * h),
  width: Math.round((CFG.cropX1 - CFG.cropX0) * w),
  height: Math.round((CFG.cropY1 - CFG.cropY0) * h),
}
let shipped = await art.clone().extract(crop).png().toBuffer()
if (CFG.fadeBottom > 0) {
  const fadeTop = ((1 - CFG.fadeBottom) * 100).toFixed(2)
  const ramp = Buffer.from(
    `<svg width="${crop.width}" height="${crop.height}"><defs>
       <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
         <stop offset="${fadeTop}%" stop-color="#fff" stop-opacity="1"/>
         <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
       </linearGradient></defs>
     <rect width="${crop.width}" height="${crop.height}" fill="url(#f)"/></svg>`,
  )
  shipped = await sharp(shipped)
    .composite([{ input: ramp, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

await sharp(shipped)
  .resize({ width: CFG.webpWidth })
  .webp({ quality: CFG.webpQuality, alphaQuality: CFG.alphaQuality, effort: 6 })
  .toFile(CFG.webp)

const bg = Buffer.from(
  `<svg width="${crop.width}" height="${crop.height}"><defs>
     <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stop-color="#F4F3F0"/><stop offset="0.42" stop-color="#e3dcd0"/>
       <stop offset="0.74" stop-color="#d9d1c2"/><stop offset="1" stop-color="#CFC8BC"/>
     </linearGradient></defs>
   <rect width="${crop.width}" height="${crop.height}" fill="url(#g)"/></svg>`,
)
await sharp(bg).composite([{ input: shipped }]).png().toFile(CFG.preview)

await writeFile(CFG.out.replace(/\.png$/, '.json'), JSON.stringify(CFG, null, 2) + '\n')

const px = w * h
console.log('paper', paper, `master ${w}x${h}`)
console.log(
  'diff histogram (per 6.4/255 bucket):',
  hist.map((n) => ((100 * n) / px).toFixed(1) + '%').join(' '),
)
const vh = Math.round((1000 * crop.height) / crop.width)
{
  const { data: sd, info: si } = await sharp(shipped).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  let n = 0,
    sx = 0,
    sy = 0,
    y0 = si.height
  for (let y = 0; y < si.height; y++) {
    for (let x = 0; x < si.width; x++) {
      const p = (y * si.width + x) * 3
      // The gold implant is the only saturated warm thing in a grey drawing.
      if (sd[p] - sd[p + 2] > 45 && sd[p] > 140 && sd[p + 1] > sd[p + 2]) {
        n++
        sx += x
        sy += y
        if (y < y0) y0 = y
      }
    }
  }
  console.log(
    n
      ? `implant: ${n}px, centroid ${Math.round((1000 * sx) / n / si.width)},${Math.round((vh * sy) / n / si.height)} — head at y ${Math.round((vh * y0) / si.height)} (overlay units)`
      : 'implant: none found in the shipped crop',
  )
}
console.log(`crop ${crop.width}x${crop.height}  overlay box 1000 x ${vh}`)
console.log(CFG.webp)
