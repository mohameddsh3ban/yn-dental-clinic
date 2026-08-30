/**
 * Turns the object renders into service-card artwork.
 *
 * The masters are objects on white paper; the cards are 4:5 objects on the
 * brand gradient. So each render has its paper removed, is trimmed to the
 * object's own bounding box, and is written into a 4:5 frame.
 *
 * The paper is removed by a FLOOD FILL from the border, not by a brightness
 * threshold. These subjects are white enamel casting white contact shadows on
 * white paper: a threshold either leaves a pale halo where the shadow met the
 * paper, or eats the enamel it cannot tell apart from it. A flood fill removes
 * only white that is CONNECTED to the edge of the frame, so enamel inside the
 * silhouette survives and the shadow goes out with the paper it sits on.
 *
 *   node scripts/prep-service-art.mjs
 */
import { mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import sharp from 'sharp'

const OUT = process.argv.find((a) => a.startsWith('out='))?.split('=')[1] ?? 'src/assets/services'
const WIDTH = 900 // cards render ~310px wide, so this covers 2x
const HEIGHT = Math.round((WIDTH * 5) / 4)
/** Fraction of the frame an object may fill. Width is allowed more than height:
 *  an arch of teeth is very wide and very short, and fitting it by height alone
 *  leaves a sliver floating in a portrait card. */
const FILL_W = 0.96
const FILL_H = 0.84

const SOURCES = [
  'jaw-solid',
  'jaw-plate',
  'jaw-ghost',
  'jaw-arch',
  'jaw-annotated',
  'endo-molar',
  'cosmetic-arch',
  'veneer-shells',
  'composite-layers',
  'tmj-prosthesis',
  'crown-seat',
]

/** How close to white still counts as paper, 0-1.
 *
 *  Keep this LOW. The tempting move is to raise it until the renders' soft
 *  contact shadows disappear, but ivory bone measures only about 0.07 from
 *  white: at 0.14 the flood treated the mandible itself as paper and ate a
 *  vertical slice out of the jaw wherever the bone reached the frame edge.
 *  Shadows are dealt with at the source instead — see scripts/gen-noshadow.sh.
 *  Override for a one-off with `paper=0.09`. */
const PAPER = Number(
  process.argv.find((a) => a.startsWith('paper='))?.split('=')[1] ?? 0.05,
)
/** Boundary softening, in pixels, so the cut edge is not aliased. */
const FEATHER = 2

/** How wide a leak the flood is allowed to squeeze through, in pixels.
 *
 *  A specular highlight on enamel can be as white as the paper and touch the
 *  silhouette, giving the flood a one-pixel doorway into the object — which is
 *  how a bite went missing from a molar and the bone block came out with torn
 *  edges. An opening on the OUTSIDE mask (erode, then dilate by the same
 *  amount) closes any intrusion narrower than twice this and leaves the large
 *  paper region exactly where it was. */
const SEAL = Number(process.argv.find((a) => a.startsWith('seal='))?.split('=')[1] ?? 4)

/** Sources rendered on a GREY ground, with the cut-off between ground and
 *  object as a fraction of white.
 *
 *  A tolerance around the sampled corner colour does not work here: studio grey
 *  vignettes from corner to centre by more than any safe tolerance, and the
 *  flood stops early, leaving the whole rectangle behind. What is reliable is
 *  that the object is BRIGHTER than its ground, so the rule becomes a
 *  luminance cut half way between the two — which also swallows the shadow,
 *  since a shadow is darker still. */
const GREY_GROUND = {}

/** Sources that need a tighter cut than the default.
 *
 *  The crown subject is white ceramic beside white enamel on white paper. At
 *  0.05 a bright flank of the neighbouring molar measured as paper and the
 *  flood ate a wedge out of it; a grey ground and a luminance cut both failed
 *  worse (a studio grey vignettes past any tolerance, and ivory bone sits too
 *  close to the cut). What works is the opposite move: take only what is truly
 *  paper and leave the faint rim, which is invisible against a cream card. */
const PAPER_BY_SOURCE = {}

/** Sources that are NOT keyed at all, and are composited by the card instead.
 *
 *  The crown subject defeats every colour key: its enamel highlights are pure
 *  255 white and they touch the silhouette, so the flood always has a doorway
 *  and always takes a bite out of a molar. Lower thresholds, a grey ground and
 *  a luminance cut each failed differently. These are written on their own
 *  white paper and the card removes the white with `mix-blend-mode: multiply`,
 *  which cannot damage the object because it never decides where its edge is. */
const ON_WHITE = new Set([])

/** One erosion/dilation step over a binary mask, 4-connected. */
function morph(mask, w, h, grow) {
  const out = new Uint8Array(mask.length)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const self = mask[i]
      // Erosion clears a pixel whose neighbour is empty; dilation fills a pixel
      // whose neighbour is set. Off-canvas counts as paper, so the sheet is not
      // eroded away from the frame edge inward.
      let neighbour = grow ? 0 : 1
      const at = (xx, yy) => (xx < 0 || yy < 0 || xx >= w || yy >= h ? 1 : mask[yy * w + xx])
      const n = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)]
      neighbour = grow ? (n.some(Boolean) ? 1 : 0) : (n.every(Boolean) ? 1 : 0)
      out[i] = grow ? (self || neighbour ? 1 : 0) : self && neighbour ? 1 : 0
    }
  }
  return out
}

await mkdir(OUT, { recursive: true })

for (const name of SOURCES) {
  // A cut-out from Higgsfield's matting model, if one has been made. It decides
  // the object's edge from shape rather than colour, which is the one thing the
  // flood fill below cannot do: white enamel highlights touch the silhouette on
  // several of these subjects, and every colour rule either bit into the object
  // or left its paper behind. `npm run cut:service-art` produces these.
  const cut = `brand/hero-concepts/cut/${name}.png`
  if (existsSync(cut)) {
    const { data: px, info: pi } = await sharp(cut).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    let ax0 = pi.width, ax1 = 0, ay0 = pi.height, ay1 = 0
    for (let y = 0; y < pi.height; y++) {
      for (let x = 0; x < pi.width; x++) {
        if (px[(y * pi.width + x) * 4 + 3] > 24) {
          if (x < ax0) ax0 = x
          if (x > ax1) ax1 = x
          if (y < ay0) ay0 = y
          if (y > ay1) ay1 = y
        }
      }
    }
    const bb = { left: ax0, top: ay0, width: ax1 - ax0 + 1, height: ay1 - ay0 + 1 }
    const { data: fitted, info: fi } = await sharp(cut)
      .extract(bb)
      .resize({ width: Math.round(WIDTH * FILL_W), height: Math.round(HEIGHT * FILL_H), fit: 'inside' })
      .png()
      .toBuffer({ resolveWithObject: true })
    const file = `${OUT}/${name}.webp`
    await sharp({
      create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([
        { input: fitted, left: Math.round((WIDTH - fi.width) / 2), top: Math.round((HEIGHT - fi.height) / 2) },
      ])
      .webp({ quality: 86, alphaQuality: 70, effort: 6 })
      .toFile(file)
    const kb = ((await stat(file)).size / 1024).toFixed(0)
    console.log(`${name}: matted cut-out  object ${bb.width}x${bb.height} -> ${fi.width}x${fi.height} in ${WIDTH}x${HEIGHT}, ${kb}KB`)
    continue
  }

  const src = `brand/hero-concepts/${name}.png`
  const { data, info } = await sharp(src)
    .flatten({ background: '#ffffff' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info
  const paper = PAPER_BY_SOURCE[name] ?? PAPER

  // The ground is whatever colour the corners are, not necessarily white.
  // White enamel against white paper cannot be separated by colour distance at
  // all — a flank of a molar measured under 0.05 from the sheet and the flood
  // walked straight into it — so those subjects are rendered on a light grey
  // ground instead. Sampling the corners keys both kinds with one rule.
  const corner = (x, y) => {
    const p = (y * w + x) * channels
    return [data[p], data[p + 1], data[p + 2]]
  }
  const corners = [corner(2, 2), corner(w - 3, 2), corner(2, h - 3), corner(w - 3, h - 3)]
  const ground = [0, 1, 2].map((c) => {
    const vals = corners.map((k) => k[c]).sort((a, b) => a - b)
    return Math.round((vals[1] + vals[2]) / 2)
  })

  if (ON_WHITE.has(name)) {
    // Bounding box only — a loose threshold is safe here because nothing is
    // being removed, it just decides where to crop.
    let bx0 = w, bx1 = 0, by0 = h, by1 = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = (y * w + x) * channels
        let d = 0
        for (let c = 0; c < 3; c++) d = Math.max(d, (255 - data[p + c]) / 255)
        if (d > 0.06) {
          if (x < bx0) bx0 = x
          if (x > bx1) bx1 = x
          if (y < by0) by0 = y
          if (y > by1) by1 = y
        }
      }
    }
    const bb = { left: bx0, top: by0, width: bx1 - bx0 + 1, height: by1 - by0 + 1 }
    const { data: fitted, info: fi } = await sharp(src)
      .extract(bb)
      .resize({ width: Math.round(WIDTH * FILL_W), height: Math.round(HEIGHT * FILL_H), fit: 'inside' })
      .png()
      .toBuffer({ resolveWithObject: true })
    const file = `${OUT}/${name}.webp`
    await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: '#ffffff' } })
      .composite([
        { input: fitted, left: Math.round((WIDTH - fi.width) / 2), top: Math.round((HEIGHT - fi.height) / 2) },
      ])
      .webp({ quality: 88, effort: 6 })
      .toFile(file)
    const kb = ((await stat(file)).size / 1024).toFixed(0)
    console.log(`${name}: on white (card multiplies)  object ${bb.width}x${bb.height} -> ${fi.width}x${fi.height} in ${WIDTH}x${HEIGHT}, ${kb}KB`)
    continue
  }

  const greyCut = GREY_GROUND[name]
  const isPaper = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const p = i * channels
    if (greyCut !== undefined) {
      const luma = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255
      if (luma < greyCut) isPaper[i] = 1
      continue
    }
    let diff = 0
    for (let c = 0; c < 3; c++) diff = Math.max(diff, Math.abs(data[p + c] - ground[c]) / 255)
    if (diff <= paper) isPaper[i] = 1
  }

  // Flood the paper inward from every edge. Anything white but enclosed by the
  // object — enamel, a highlight, the gap inside an arch — is never reached.
  let outside = new Uint8Array(w * h)
  const queue = new Int32Array(w * h)
  let head = 0
  let tail = 0
  const push = (i) => {
    if (!outside[i] && isPaper[i]) {
      outside[i] = 1
      queue[tail++] = i
    }
  }
  for (let x = 0; x < w; x++) {
    push(x)
    push((h - 1) * w + x)
  }
  for (let y = 0; y < h; y++) {
    push(y * w)
    push(y * w + w - 1)
  }
  while (head < tail) {
    const i = queue[head++]
    const x = i % w
    const y = (i / w) | 0
    if (x > 0) push(i - 1)
    if (x < w - 1) push(i + 1)
    if (y > 0) push(i - w)
    if (y < h - 1) push(i + w)
  }

  // Seal the leaks before the mask is used for anything.
  let sealed = outside
  for (let i = 0; i < SEAL; i++) sealed = morph(sealed, w, h, false)
  for (let i = 0; i < SEAL; i++) sealed = morph(sealed, w, h, true)
  let reclaimed = 0
  for (let i = 0; i < outside.length; i++) if (outside[i] && !sealed[i]) reclaimed++
  outside = sealed

  const rgba = Buffer.alloc(w * h * 4)
  let x0 = w,
    x1 = 0,
    y0 = h,
    y1 = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      let a = outside[i] ? 0 : 1
      if (a === 1) {
        // Soften by distance to the nearest removed pixel.
        let near = FEATHER + 1
        for (let dy = -FEATHER; dy <= FEATHER; dy++) {
          const yy = y + dy
          if (yy < 0 || yy >= h) continue
          for (let dx = -FEATHER; dx <= FEATHER; dx++) {
            const xx = x + dx
            if (xx < 0 || xx >= w) continue
            if (outside[yy * w + xx]) {
              const d = Math.hypot(dx, dy)
              if (d < near) near = d
            }
          }
        }
        if (near <= FEATHER) a = near / (FEATHER + 1)
      }
      const p = i * channels
      const q = i * 4
      rgba[q] = data[p]
      rgba[q + 1] = data[p + 1]
      rgba[q + 2] = data[p + 2]
      rgba[q + 3] = Math.round(a * 255)
      if (a > 0.35) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }

  const box = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }

  // Crop and scale in one pipeline: a raw buffer carries no format, so handing
  // the intermediate back to sharp on its own would need the raw metadata
  // again. Fit inside rather than cover — these read as objects, and a cropped
  // tooth reads as a mistake.
  const { data: scaled, info: meta } = await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .extract(box)
    .resize({
      width: Math.round(WIDTH * FILL_W),
      height: Math.round(HEIGHT * FILL_H),
      fit: 'inside',
    })
    .png()
    .toBuffer({ resolveWithObject: true })

  const file = `${OUT}/${name}.webp`
  await sharp({
    create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: scaled,
        left: Math.round((WIDTH - meta.width) / 2),
        top: Math.round((HEIGHT - meta.height) / 2),
      },
    ])
    .webp({ quality: 86, alphaQuality: 70, effort: 6 })
    .toFile(file)

  const bytes = (await stat(file)).size
  console.log(
    `${name}: ground rgb(${ground.join(',')}) ${greyCut !== undefined ? `luma<${greyCut}` : `paper<=${paper}`}  object ${box.width}x${box.height} -> ${meta.width}x${meta.height} in ${WIDTH}x${HEIGHT}, ${(bytes / 1024).toFixed(0)}KB` +
      (reclaimed ? `  (sealed ${reclaimed}px of leaks)` : ''),
  )
}
