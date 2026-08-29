/**
 * Grafts the implant from a generated candidate onto the client's own artwork.
 *
 * Every candidate re-rendered the whole picture — measured drift of 3-5 levels
 * everywhere, not just at the tooth — and the brief was one small change, not a
 * new drawing. So the master stays exactly as the client sent it and only a
 * feathered window around the implant is taken from the candidate. Outside that
 * window the output is identical to the master by construction.
 *
 *   node scripts/patch-implant.mjs [key=value ...]
 */
import sharp from 'sharp'

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)
const num = (k, d) => Number(args[k] ?? d)

const CFG = {
  master: args.master ?? 'brand/hero-concepts/faceline-v2/NORTHSTAR.png',
  patch: args.patch ?? 'brand/hero-concepts/faceline-v2/E3-plain-4k.png',
  out: args.out ?? 'brand/hero-concepts/faceline-v2/NORTHSTAR-implant.png',
  /** Window around the implant, as fractions of the master.
   *
   *  Deliberately tight. A window wide enough to include the candidate's crown
   *  also included its upper molars, which it had drawn slightly larger than the
   *  master's — visibly changing teeth that were not meant to change. Cutting
   *  just below the bite line grafts the screw alone and leaves every tooth as
   *  the client drew it: the master's own molar then reads as the crown standing
   *  on the implant, which is how an implant illustration reads anyway. */
  x0: num('x0', 0.32),
  x1: num('x1', 0.418),
  y0: num('y0', 0.518),
  y1: num('y1', 0.606),
  /** Feather width, as a fraction of the window. */
  feather: num('feather', 0.1),
}

const master = sharp(CFG.master).removeAlpha()
const { width: W, height: H } = await master.metadata()

// The candidate comes back at its own resolution; put it on the master's grid.
const cand = await sharp(CFG.patch).resize({ width: W, height: H, fit: 'fill' }).removeAlpha().toBuffer()

// Where is the implant? Gold is the only warm-hued thing in a grey drawing.
const probe = await sharp(cand).raw().toBuffer()
let gx0 = W,
  gx1 = 0,
  gy0 = H,
  gy1 = 0,
  gold = 0,
  cx = 0,
  cy = 0
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const p = (y * W + x) * 3
    const r = probe[p],
      g = probe[p + 1],
      b = probe[p + 2]
    if (r - b > 26 && r > 120 && r < 245 && g > b) {
      gold++
      cx += x
      cy += y
      if (x < gx0) gx0 = x
      if (x > gx1) gx1 = x
      if (y < gy0) gy0 = y
      if (y > gy1) gy1 = y
    }
  }
}
if (!gold) throw new Error('no gold found in the candidate — wrong file?')
console.log(
  `gold ${gold}px  bbox x ${(gx0 / W).toFixed(3)}-${(gx1 / W).toFixed(3)} y ${(gy0 / H).toFixed(3)}-${(gy1 / H).toFixed(3)}`,
  ` centroid ${(cx / gold / W).toFixed(4)},${(cy / gold / H).toFixed(4)}`,
)

const box = {
  left: Math.round(CFG.x0 * W),
  top: Math.round(CFG.y0 * H),
  width: Math.round((CFG.x1 - CFG.x0) * W),
  height: Math.round((CFG.y1 - CFG.y0) * H),
}
const fx = Math.max(2, Math.round(box.width * CFG.feather))
const fy = Math.max(2, Math.round(box.height * CFG.feather))

// A window of the candidate, its edges ramped to transparent so the graft has
// no hard boundary against the master's own bone. The ramp is computed in raw
// pixels rather than as an SVG mask: SVG masks are LUMINANCE masks, so a
// gradient that varies only stop-opacity is black-on-black and erases the whole
// graft — which is exactly what the first attempt did.
const win = await sharp(cand).extract(box).raw().toBuffer()
const rgba = Buffer.alloc(box.width * box.height * 4)
const ramp1 = (i, n, f) => Math.min(1, Math.min(i, n - 1 - i) / f)
for (let y = 0; y < box.height; y++) {
  for (let x = 0; x < box.width; x++) {
    const src = (y * box.width + x) * 3
    const dst = (y * box.width + x) * 4
    const a = ramp1(x, box.width, fx) * ramp1(y, box.height, fy)
    rgba[dst] = win[src]
    rgba[dst + 1] = win[src + 1]
    rgba[dst + 2] = win[src + 2]
    rgba[dst + 3] = Math.round(255 * a)
  }
}
const graft = await sharp(rgba, { raw: { width: box.width, height: box.height, channels: 4 } })
  .png()
  .toBuffer()

await master
  .composite([{ input: graft, left: box.left, top: box.top }])
  .png({ compressionLevel: 9 })
  .toFile(CFG.out)

// Prove the claim: outside the window nothing moved.
const a = await sharp(CFG.master).removeAlpha().raw().toBuffer()
const b = await sharp(CFG.out).removeAlpha().raw().toBuffer()
let outside = 0
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (x >= box.left && x < box.left + box.width && y >= box.top && y < box.top + box.height) continue
    const p = (y * W + x) * 3
    if (a[p] !== b[p] || a[p + 1] !== b[p + 1] || a[p + 2] !== b[p + 2]) outside++
  }
}
let landed = 0
for (let y = box.top; y < box.top + box.height; y++) {
  for (let x = box.left; x < box.left + box.width; x++) {
    const p = (y * W + x) * 3
    if (b[p] - b[p + 2] > 45 && b[p] > 140) landed++
  }
}
console.log(`window ${box.width}x${box.height} at ${box.left},${box.top}`)
console.log(`pixels changed outside the window: ${outside}`)
console.log(`gold pixels inside the window after the graft: ${landed}`)
if (!landed) throw new Error('the graft landed no gold — the implant did not transfer')
console.log(CFG.out)
