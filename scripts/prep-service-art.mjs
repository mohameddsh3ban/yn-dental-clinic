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

await mkdir(OUT, { recursive: true })

for (const name of SOURCES) {
  const src = `brand/hero-concepts/${name}.png`
  const { data, info } = await sharp(src)
    .flatten({ background: '#ffffff' })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info
  const paper = PAPER

  const isPaper = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) {
    const p = i * channels
    let diff = 0
    for (let c = 0; c < 3; c++) diff = Math.max(diff, (255 - data[p + c]) / 255)
    if (diff <= paper) isPaper[i] = 1
  }

  // Flood the paper inward from every edge. Anything white but enclosed by the
  // object — enamel, a highlight, the gap inside an arch — is never reached.
  const outside = new Uint8Array(w * h)
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
    `${name}: paper<=${paper}  object ${box.width}x${box.height} -> ${meta.width}x${meta.height} in ${WIDTH}x${HEIGHT}, ${(bytes / 1024).toFixed(0)}KB`,
  )
}
