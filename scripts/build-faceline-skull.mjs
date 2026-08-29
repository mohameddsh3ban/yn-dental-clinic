/**
 * Builds the "Facial Harmony" hero artwork: a continuous-line face profile with
 * an anatomically aligned skull sitting inside it.
 *
 * Both inputs arrive as opaque renders on near-white paper, so each one has to
 * be keyed to alpha before it can be layered. The line art is keyed by
 * luminance (dark ink stays, paper goes); the skull is keyed the same way but
 * kept as colour, because its ivory-and-gold material is the whole point.
 *
 *   node scripts/build-faceline-skull.mjs [--skull <name>] [key=value ...]
 *
 * Every placement knob is a CLI flag so the composite can be re-aimed against a
 * browser screenshot without editing this file.
 */
import { mkdir, stat, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)

const CFG = {
  line: 'brand/hero-concepts/face-line/hq0-charcoal.png',
  skull: args.skull ?? 'brand/hero-concepts/skull-profile/A-skull-nb.png',
  out: args.out ?? 'brand/hero-concepts/face-line-skull.png',
  // Shipping straight to src/assets keeps the master PNG and the web asset from
  // drifting apart. Pass --webp= to skip it while iterating on placement.
  webp: args.webp ?? 'src/assets/hero/face-line-skull.webp',
  webpWidth: Number(args.webpWidth ?? 1600),
  // Output canvas. The line art is 2336x3504; keep that ratio.
  width: Number(args.width ?? 1600),
  // Skull placement, all as a fraction of the output canvas.
  scale: Number(args.scale ?? 0.62),   // skull height / canvas height
  x: Number(args.x ?? 0.42),           // skull centre x
  y: Number(args.y ?? 0.30),           // skull centre y
  opacity: Number(args.opacity ?? 0.5),
  // A lateral skull render is a touch wider front-to-back than the head outline
  // allows. A few percent of horizontal squash resolves that and is invisible
  // at this opacity; without it the occiput runs off the right edge.
  squash: Number(args.squash ?? 1),
  // How much of its opacity the gold implant keeps back from the global fade.
  gold: Number(args.gold ?? 1.9),
  // The cranium is a large smooth mass that would otherwise out-shout the jaw.
  // Fading it back down to `crownFade` of the base opacity puts the weight on
  // the tooth row and the implant, which is what the section is actually about.
  crownFade: Number(args.crownFade ?? 0.62),
  // Line art ink.
  ink: args.ink ?? '#14120F',
  // Warms the skull toward the cream hero background so it reads as inlay
  // rather than as a photo pasted on top.
  warm: Number(args.warm ?? 0.12),
}

/**
 * Keys a paper render to alpha: ink becomes opaque, paper becomes transparent,
 * and the midtones between them keep their antialiasing.
 *
 * The paper here is cream, not white, so a plain `1 - luma` leaves the whole
 * sheet sitting at roughly 5% alpha. Across a 2:3 canvas that is not a subtle
 * artefact — it renders as a visible tinted rectangle over the hero. So the
 * paper level is measured from the border and the ramp is remapped to put it
 * at exactly zero.
 */
async function keyToAlpha(file, { tint, gamma = 1 }) {
  const img = sharp(file).flatten({ background: '#ffffff' })
  const { width, height } = await img.metadata()
  const raw = await img.raw().toBuffer() // 3 channels after flatten

  const lumaAt = (x, y) => {
    const p = (y * width + x) * 3
    return (0.299 * raw[p] + 0.587 * raw[p + 1] + 0.114 * raw[p + 2]) / 255
  }

  // The border of this artwork is always empty paper, so it is a safe sample.
  // The paper is not flat — it carries a faint gradient and grain — so the
  // brightest border pixel is not low enough to key the darker paper in the
  // middle. Taking a low percentile of the border instead puts the whole sheet
  // under the floor, and real ink is far darker than any of it.
  const border = []
  for (let x = 0; x < width; x += 5) border.push(lumaAt(x, 0), lumaAt(x, height - 1))
  for (let y = 0; y < height; y += 5) border.push(lumaAt(0, y), lumaAt(width - 1, y))
  border.sort((a, b) => a - b)
  const floorLuma = Math.min(border[Math.floor(border.length * 0.05)], 0.999)

  const out = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i++) {
    const p3 = i * 3
    const p4 = i * 4
    const luma = (0.299 * raw[p3] + 0.587 * raw[p3 + 1] + 0.114 * raw[p3 + 2]) / 255
    // Remap so paper lands on 0 and full ink still reaches 1.
    const a = Math.pow(Math.max(0, (floorLuma - luma) / floorLuma), gamma)
    out[p4] = tint[0]
    out[p4 + 1] = tint[1]
    out[p4 + 2] = tint[2]
    out[p4 + 3] = Math.round(Math.min(1, a) * 255)
  }
  console.log(`  line art: paper luma ${floorLuma.toFixed(3)} keyed to zero alpha`)
  return { data: out, width, height }
}

/**
 * The skull render is a lit object, not ink, so keying it by darkness would eat
 * its highlights. A global brightness threshold does not work either: this
 * backdrop sits at 245-253 and the brightest bone sits in the same band.
 *
 * So the backdrop is found by flood-filling inward from the border. Only pixels
 * that are bright AND reachable from the edge are removed, which keeps bright
 * highlights in the middle of the skull fully opaque. The resulting hard matte
 * is then feathered by one pass so the cut edge stays smooth.
 */
async function keyBackdrop(file, { tolerance = 12, warm = 0, opacity = 1, gold = 1 }) {
  const img = sharp(file).flatten({ background: '#ffffff' })
  const { width, height } = await img.metadata()
  const raw = await img.raw().toBuffer() // 3 channels after flatten

  const n = width * height
  const bg = new Uint8Array(n) // 1 = backdrop
  const stack = []

  const seedLuma = (() => {
    // Average the four corners: the backdrop is uniform, the skull never is.
    const at = (x, y) => {
      const p = (y * width + x) * 3
      return (raw[p] + raw[p + 1] + raw[p + 2]) / 3
    }
    return (at(0, 0) + at(width - 1, 0) + at(0, height - 1) + at(width - 1, height - 1)) / 4
  })()

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const i = y * width + x
    if (bg[i]) return
    const p = i * 3
    const luma = (raw[p] + raw[p + 1] + raw[p + 2]) / 3
    if (Math.abs(luma - seedLuma) > tolerance) return
    bg[i] = 1
    stack.push(i)
  }

  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }
  while (stack.length) {
    const i = stack.pop()
    const x = i % width
    const y = (i - x) / width
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  // One 3x3 box pass turns the hard matte into a soft one-pixel edge.
  const alpha = new Float32Array(n)
  for (let i = 0; i < n; i++) alpha[i] = bg[i] ? 0 : 1
  const soft = new Float32Array(n)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0
      let count = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
          sum += alpha[ny * width + nx]
          count++
        }
      }
      soft[y * width + x] = sum / count
    }
  }

  // Bone sits below ~0.2 saturation and the gold implant above ~0.35, so
  // saturation alone separates them. The gold is the brand accent and the whole
  // reason this jaw was chosen, so it is held back from both the fade and the
  // cream wash that the bone gets.
  const smoothstep = (edge0, edge1, x) => {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
  }

  const out = Buffer.alloc(n * 4)
  for (let i = 0; i < n; i++) {
    const p3 = i * 3
    const p4 = i * 4
    let r = raw[p3]
    let g = raw[p3 + 1]
    let b = raw[p3 + 2]

    const mx = Math.max(r, g, b)
    const mn = Math.min(r, g, b)
    const sat = mx === 0 ? 0 : (mx - mn) / mx
    // Saturation alone also catches deep shadow crevices, which then darken into
    // brown blobs. The polished implant is saturated AND bright, so gate on both.
    const isGold = smoothstep(0.3, 0.5, sat) * smoothstep(95, 135, mx)

    const warmLocal = warm * (1 - isGold)
    if (warmLocal > 0) {
      r = Math.round(r * (1 - warmLocal) + 0xe8 * warmLocal)
      g = Math.round(g * (1 - warmLocal) + 0xdc * warmLocal)
      b = Math.round(b * (1 - warmLocal) + 0xc8 * warmLocal)
    }

    const a = soft[i] * opacity * (1 + (gold - 1) * isGold)
    out[p4] = r
    out[p4 + 1] = g
    out[p4 + 2] = b
    out[p4 + 3] = Math.round(Math.max(0, Math.min(1, a)) * 255)
  }
  return { data: out, width, height }
}

const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16))

const line = await keyToAlpha(CFG.line, { tint: hex(CFG.ink), gamma: 0.85 })
// sharp's composite() has no opacity option, so the fade is baked into alpha here.
const skull = await keyBackdrop(CFG.skull, { warm: CFG.warm, opacity: CFG.opacity, gold: CFG.gold, tolerance: Number(args.tolerance ?? 12) })

const W = CFG.width
const H = Math.round((W * line.height) / line.width)

const linePng = await sharp(line.data, {
  raw: { width: line.width, height: line.height, channels: 4 },
})
  .resize({ width: W, height: H })
  .png()
  .toBuffer()

/**
 * Crops to the bone itself. sharp's trim() would include the soft contact
 * shadow, which is many hundreds of pixels of near-transparent alpha and would
 * silently shrink the skull relative to the face. Measuring the bbox of solidly
 * opaque pixels instead makes `scale` mean crown-to-menton, so the placement
 * numbers stay comparable across candidates.
 */
function solidBounds(rgba, width, height, cutoff = 0.5) {
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  const a = Math.round(cutoff * 255)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (rgba[(y * width + x) * 4 + 3] < a) continue
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

// The cutoff is relative to CFG.opacity, which is already baked into alpha —
// an absolute 0.5 would find nothing at all once the skull is faded past half.
const bounds = solidBounds(skull.data, skull.width, skull.height, 0.5 * CFG.opacity)
if (bounds.width <= 0 || bounds.height <= 0) {
  throw new Error('no solid skull pixels found — check the backdrop key tolerance')
}
const skullCropped = await sharp(skull.data, {
  raw: { width: skull.width, height: skull.height, channels: 4 },
})
  .extract(bounds)
  .png()
  .toBuffer()

/**
 * Ramps alpha vertically across the cropped skull: `crownFade` of the base
 * opacity at the vertex, full opacity from the occlusal plane down.
 */
async function fadeCrown(buffer, amount) {
  if (amount >= 1) return buffer
  const img = sharp(buffer).ensureAlpha()
  const { width, height } = await img.metadata()
  const raw = await img.raw().toBuffer()
  for (let y = 0; y < height; y++) {
    const t = Math.min(1, y / (height * 0.62)) // 1.0 by the tooth row
    const k = amount + (1 - amount) * t * t
    for (let x = 0; x < width; x++) {
      const p = (y * width + x) * 4 + 3
      raw[p] = Math.round(raw[p] * k)
    }
  }
  return sharp(raw, { raw: { width, height, channels: 4 } }).png().toBuffer()
}

const skullFaded = await fadeCrown(skullCropped, CFG.crownFade)

const skullH = Math.round(H * CFG.scale)
const skullPng = await sharp(skullFaded)
  .resize({
    height: skullH,
    width: Math.round((bounds.width / bounds.height) * skullH * CFG.squash),
    fit: 'fill',
  })
  .png()
  .toBuffer()

const skullMeta = await sharp(skullPng).metadata()
const left = Math.round(W * CFG.x - skullMeta.width / 2)
const top = Math.round(H * CFG.y - skullMeta.height / 2)

await mkdir('brand/hero-concepts', { recursive: true })
await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([
    { input: skullPng, left, top },
    { input: linePng, left: 0, top: 0 },
  ])
  .png()
  .toFile(CFG.out)

if (CFG.webp) {
  await sharp(CFG.out)
    .resize({ width: CFG.webpWidth, withoutEnlargement: true })
    .webp({ quality: Number(args.webpQuality ?? 82), alphaQuality: 90, effort: 6 })
    .toFile(CFG.webp)
  const { size } = await stat(CFG.webp)
  console.log(`  ${CFG.webp}  ${(size / 1e3).toFixed(0)} KB`)
}

await writeFile(CFG.out.replace(/\.png$/, '.json'), JSON.stringify(CFG, null, 2))
console.log(
  `${CFG.out}  ${W}x${H}
` +
    `  bone bbox in source ${bounds.width}x${bounds.height} at ${bounds.left},${bounds.top}
` +
    `  placed ${skullMeta.width}x${skullMeta.height} at ${left},${top}` +
    `  (crown y=${(top / H).toFixed(3)}, menton y=${((top + skullMeta.height) / H).toFixed(3)},` +
    ` front x=${(left / W).toFixed(3)}, back x=${((left + skullMeta.width) / W).toFixed(3)})`,
)
