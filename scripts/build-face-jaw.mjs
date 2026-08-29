/**
 * Builds the "Facial Harmony" hero artwork, v2.
 *
 * Two renders come in. The PLATE is the beauty line drawing on its own: it owns
 * every line in the final image and is never modified. The ANATOMY render is
 * that same drawing handed back by an edit model with a jaw drawn into it, so
 * the jaw arrives already fitted to the drawn face — which is the one thing a
 * compositor cannot do for itself.
 *
 * What this script does is take only the *difference* between the two renders —
 * the bone, the teeth and the implant — mask it to the inside of the drawn
 * silhouette, and lay the plate's own line work back over the top at full
 * strength. So the outline is the plate's, pixel for pixel, and the anatomy can
 * never cross it.
 *
 *   node scripts/build-face-jaw.mjs [key=value ...]
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
  plate: args.plate ?? 'brand/hero-concepts/faceline-v2/D2-plate-4k.png',
  anatomy: args.anatomy ?? 'brand/hero-concepts/faceline-v2/D1-c2-4k.png',
  out: args.out ?? 'brand/hero-concepts/face-jaw-v2.png',
  preview: args.preview ?? 'brand/hero-concepts/faceline-v2/_preview.png',
  webp: args.webp ?? 'src/assets/hero/face-jaw.webp',
  width: num('width', 2200),
  webpWidth: num('webpWidth', 1500),

  // Anatomy keying. Measured, not guessed: the bone in the render sits only
  // 8-15 levels off the paper while the paper's own grain stays inside 2, so
  // the deadzone goes just above the grain and the ramp is narrow.
  dead: num('dead', 0.012), // 3/255
  span: num('span', 0.026), // full alpha by ~10/255
  bone: num('bone', 0.86), // global strength of the anatomy layer
  gold: num('gold', 1.15), // the implant keeps more of itself than bone does
  // The render's bone is a whisper away from its paper. Pushing that deviation
  // further from paper is what turns it into readable ivory instead of a stain.
  contrast: num('contrast', 2.6),
  warm: num('warm', 0.1), // pulls the bone toward the hero's cream

  // How hard the plate's own ink is subtracted from the anatomy layer, so no
  // line is ever drawn twice at slightly different positions.
  inkSub: num('inkSub', 1.5),
  inkBlur: num('inkBlur', 2.2),

  // The jaw window, as fractions of the canvas. Everything outside it is paper
  // by definition, which is what keeps the edit model's stray marks and its own
  // paper tint out of the composite.
  jawX0: num('jawX0', 0.1),
  jawX1: num('jawX1', 0.72),
  jawY1: num('jawY1', 0.6),
  jawFeather: num('jawFeather', 0.035),
  // The maxilla in the render climbs up into the cheek. This fades the anatomy
  // out above a slanted ceiling — lower at the front of the face, higher back
  // at the ear so the condyle survives.
  ceilFront: num('ceilFront', 0.36),
  ceilEar: num('ceilEar', 0.315),
  ceilFade: num('ceilFade', 0.05),
  // The lips are drawn lines, not silhouette, so the containment mask does not
  // stop the tooth row from marching out through them. This does: the front of
  // the anatomy stops just behind the inner surface of the drawn lip.
  frontX: num('frontX', 0.215),
  frontFade: num('frontFade', 0.014),

  // Silhouette containment.
  inset: num('inset', 0.006), // erode the interior by this fraction of width
  inkOn: num('inkOn', 0.16), // darkness that counts as a drawn line

  // The plate's line is a hairline at print size and would thin to nothing at
  // web width, so it is given back some weight here.
  lineGain: num('lineGain', 1.35),
  // Paper grain reads as very faint ink, and a gamma on the line alpha would
  // amplify exactly that. So anything under lineDead is paper, full stop.
  lineDead: num('lineDead', 0.085),
  lineTop: num('lineTop', 0.62),

  // The shipped crop. The master keeps the whole drawing; the hero wants head
  // and neck only — the shoulder is dead space in a layout that puts copy in
  // the corners, and it pushes the head too small to carry the frame.
  cropX0: num('cropX0', 0.1),
  cropX1: num('cropX1', 0.95),
  cropY0: num('cropY0', 0.015),
  cropY1: num('cropY1', 0.78),
  // The neck is cut by the crop, so it is dissolved into the paper over this
  // fraction of the crop rather than ending on a hard horizontal edge.
  fadeBottom: num('fadeBottom', 0.1),
  ink: args.ink ?? '#171512',
}

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v)
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0))
  return t * t * (3 - 2 * t)
}

/** Loads a render at the working width as flat RGB plus its own paper colour. */
async function load(file, width) {
  const img = sharp(file).resize({ width }).flatten({ background: '#ffffff' })
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info

  // These renders are overwhelmingly empty paper, so a high percentile of the
  // whole sheet IS the paper — measured per channel, because the paper is a
  // warm cream and not grey. The border is not usable as the sample: the neck
  // line runs off the bottom edge and drags the estimate dark.
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
  return { data, w, h, channels, paper }
}

/** Per-pixel darkness relative to paper: paper is 0, black is 1. */
function darkness({ data, w, h, channels, paper }) {
  const paperLuma = (0.299 * paper[0] + 0.587 * paper[1] + 0.114 * paper[2]) / 255
  const d = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const p = i * channels
    const luma = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255
    d[i] = clamp((paperLuma - luma) / Math.max(paperLuma, 0.05))
  }
  return d
}

/** Box blur, used to make the ink subtraction forgiving of a pixel or two of
 * drift between the two renders. */
function blur(src, w, h, radius) {
  const r = Math.max(1, Math.round(radius))
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const at = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
  for (let y = 0; y < h; y++) {
    let sum = 0
    for (let x = -r; x <= r; x++) sum += src[y * w + at(x, 0, w - 1)]
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = sum / (2 * r + 1)
      sum += src[y * w + at(x + r + 1, 0, w - 1)] - src[y * w + at(x - r, 0, w - 1)]
    }
  }
  for (let x = 0; x < w; x++) {
    let sum = 0
    for (let y = -r; y <= r; y++) sum += tmp[at(y, 0, h - 1) * w + x]
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / (2 * r + 1)
      sum += tmp[at(y + r + 1, 0, h - 1) * w + x] - tmp[at(y - r, 0, h - 1) * w + x]
    }
  }
  return out
}

/**
 * The inside of the drawn figure. A flood from the frame edge is the obvious
 * way to get this and the wrong one here: the neck and the shoulder run off the
 * bottom and right edges, so the flood walks up the neck and fills the head.
 * Instead a pixel counts as interior when there is drawn line on all four sides
 * of it along its own row and column, which is exactly true of the jaw region
 * and needs no closed contour.
 */
function interior(dark, w, h, inkOn, insetPx) {
  const ink = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) if (dark[i] > inkOn) ink[i] = 1

  const inside = new Float32Array(w * h)
  const left = new Uint8Array(w * h)
  const right = new Uint8Array(w * h)
  for (let y = 0; y < h; y++) {
    let seen = 0
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      left[i] = seen
      if (ink[i]) seen = 1
    }
    seen = 0
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x
      right[i] = seen
      if (ink[i]) seen = 1
    }
  }
  for (let x = 0; x < w; x++) {
    let up = 0
    const col = new Uint8Array(h)
    for (let y = 0; y < h; y++) {
      const i = y * w + x
      col[y] = up
      if (ink[i]) up = 1
    }
    let down = 0
    for (let y = h - 1; y >= 0; y--) {
      const i = y * w + x
      inside[i] = col[y] && down && left[i] && right[i] ? 1 : 0
      if (ink[i]) down = 1
    }
  }

  // Inside, minus a margin, so the anatomy always stops short of the contour.
  const soft = blur(inside, w, h, insetPx)
  const out = new Float32Array(w * h)
  for (let i = 0; i < w * h; i++) out[i] = smooth(0.5, 0.9, soft[i])
  return out
}

const W = CFG.width
const plate = await load(CFG.plate, W)
const H = plate.h
// Both renders come from the same drawing but not from the same model, so their
// aspect can differ by a fraction of a percent. Forcing the anatomy into the
// plate's exact box lands closer than letting its height float.
const anat = await load(CFG.anatomy, W)
if (anat.h !== H) {
  const fixed = await sharp(CFG.anatomy)
    .resize({ width: W, height: H, fit: 'fill' })
    .flatten({ background: '#ffffff' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  anat.data = fixed.data
  anat.h = H
  anat.channels = fixed.info.channels
}

const dPlate = darkness(plate)
const inkMask = blur(dPlate, W, H, CFG.inkBlur)
const inside = interior(dPlate, W, H, CFG.inkOn, Math.max(1, CFG.inset * W))

const out = Buffer.alloc(W * H * 4)
const inkRGB = [
  parseInt(CFG.ink.slice(1, 3), 16),
  parseInt(CFG.ink.slice(3, 5), 16),
  parseInt(CFG.ink.slice(5, 7), 16),
]

for (let y = 0; y < H; y++) {
  const fy = y / H
  for (let x = 0; x < W; x++) {
    const i = y * W + x
    const fx = x / W

    // --- anatomy layer ------------------------------------------------------
    const p = i * anat.channels
    let diff = 0
    for (let c = 0; c < 3; c++) {
      diff = Math.max(diff, Math.abs(anat.data[p + c] - anat.paper[c]) / 255)
    }
    let a = smooth(CFG.dead, CFG.dead + CFG.span, diff)

    // Anything the plate already draws is the plate's job, not the anatomy's.
    a *= clamp(1 - inkMask[i] * CFG.inkSub)
    a *= inside[i]

    // Jaw window, soft on every side.
    const f = CFG.jawFeather
    a *=
      smooth(CFG.jawX0 - f, CFG.jawX0 + f, fx) *
      smooth(CFG.jawX1 + f, CFG.jawX1 - f, fx) *
      smooth(CFG.jawY1 + f, CFG.jawY1 - f, fy)
    a *= smooth(CFG.frontX - CFG.frontFade, CFG.frontX + CFG.frontFade, fx)
    // Slanted ceiling: the cheek goes, the condyle stays.
    const span = CFG.jawX1 - CFG.jawX0
    const ceil = CFG.ceilFront + ((fx - CFG.jawX0) / span) * (CFG.ceilEar - CFG.ceilFront)
    a *= smooth(ceil - CFG.ceilFade, ceil + CFG.ceilFade, fy)

    // Amplified away from the render's own paper, so the bone reads as ivory.
    let r = anat.paper[0] + (anat.data[p] - anat.paper[0]) * CFG.contrast
    let g = anat.paper[1] + (anat.data[p + 1] - anat.paper[1]) * CFG.contrast
    let b = anat.paper[2] + (anat.data[p + 2] - anat.paper[2]) * CFG.contrast
    // The implant is the only saturated warm thing in the render, so it can be
    // told from bone by chroma alone and held back from the global fade.
    const chroma = (r - b) / 255
    const goldness = smooth(0.06, 0.16, chroma)
    a = clamp(a * CFG.bone * (1 + goldness * (CFG.gold - 1)))
    // Warm the bone toward the cream the hero sits on.
    r += CFG.warm * (8 - goldness * 8)
    g -= CFG.warm * 2
    b -= CFG.warm * (14 - goldness * 10)

    // --- line layer, over the top, at full strength --------------------------
    const lineA = Math.pow(
      clamp((dPlate[i] - CFG.lineDead) / (CFG.lineTop - CFG.lineDead)),
      1 / CFG.lineGain,
    )
    const outA = a + lineA * (1 - a)
    const q = i * 4
    if (outA <= 0.0015) {
      out[q] = out[q + 1] = out[q + 2] = out[q + 3] = 0
      continue
    }
    const wl = lineA
    const wa = a * (1 - lineA)
    out[q] = clamp((inkRGB[0] * wl + r * wa) / outA, 0, 255)
    out[q + 1] = clamp((inkRGB[1] * wl + g * wa) / outA, 0, 255)
    out[q + 2] = clamp((inkRGB[2] * wl + b * wa) / outA, 0, 255)
    out[q + 3] = Math.round(outA * 255)
  }
}

const art = sharp(out, { raw: { width: W, height: H, channels: 4 } })
await art.clone().png({ compressionLevel: 9 }).toFile(CFG.out)

// --- the shipped crop -------------------------------------------------------
const crop = {
  left: Math.round(CFG.cropX0 * W),
  top: Math.round(CFG.cropY0 * H),
  width: Math.round((CFG.cropX1 - CFG.cropX0) * W),
  height: Math.round((CFG.cropY1 - CFG.cropY0) * H),
}
let shippedBuf = await art.clone().extract(crop).png().toBuffer()
if (CFG.fadeBottom > 0) {
  const fadeTop = ((1 - CFG.fadeBottom) * 100).toFixed(2)
  // dest-in keeps the artwork only where this ramp has alpha, so the neck runs
  // out into the paper instead of stopping on the crop edge.
  const ramp = Buffer.from(
    `<svg width="${crop.width}" height="${crop.height}"><defs>
       <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
         <stop offset="${fadeTop}%" stop-color="#fff" stop-opacity="1"/>
         <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
       </linearGradient></defs>
     <rect width="${crop.width}" height="${crop.height}" fill="url(#f)"/></svg>`,
  )
  shippedBuf = await sharp(shippedBuf)
    .composite([{ input: ramp, blend: 'dest-in' }])
    .png()
    .toBuffer()
}
const shipped = sharp(shippedBuf)
if (CFG.webp !== 'none') {
  await shipped.clone().resize({ width: CFG.webpWidth }).webp({ quality: 88 }).toFile(CFG.webp)
}

// The overlay in the hero is drawn in the shipped crop's coordinates, so the
// landmarks measured on the master have to be remapped. Printed rather than
// imported, because the hero should not read a build artefact at runtime.
const spanX = CFG.cropX1 - CFG.cropX0
const spanY = CFG.cropY1 - CFG.cropY0
const mapX = (fx) => +(((fx - CFG.cropX0) / spanX) * 1000).toFixed(0)
const mapY = (fy) => +(((fy - CFG.cropY0) / spanY) * (1000 / (crop.width / crop.height))).toFixed(0)
console.log(
  'overlay box  ',
  `1000 x ${Math.round(1000 / (crop.width / crop.height))}`,
  `(crop ${crop.width}x${crop.height})`,
)
console.log('implant      ', mapX(0.4213), mapY(0.4555))
console.log('condyle      ', mapX(0.585), mapY(0.352))
console.log('occlusal y   ', mapY(0.4535), 'x', mapX(0.205), mapX(0.69))
console.log('gonion       ', mapX(0.575), mapY(0.533))

// A preview on the hero's own cream, because alpha art judged on white lies.
if (CFG.preview !== 'none') {
  const meta = await shipped.clone().metadata()
  const bg = Buffer.from(
    `<svg width="${meta.width}" height="${meta.height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FBF8F3"/><stop offset="0.55" stop-color="#F0EAE0"/>
      <stop offset="1" stop-color="#E3DACB"/></linearGradient></defs>
      <rect width="${meta.width}" height="${meta.height}" fill="url(#g)"/></svg>`,
  )
  await sharp(bg)
    .composite([{ input: shippedBuf }])
    .png()
    .toFile(CFG.preview)
}

await writeFile(CFG.out.replace(/\.png$/, '.json'), JSON.stringify(CFG, null, 2) + '\n')
console.log(`${CFG.out} ${W}x${H}`)
