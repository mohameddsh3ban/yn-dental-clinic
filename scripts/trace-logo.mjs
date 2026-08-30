/**
 * Traces the drawn logo master into the vector masters the rest of the pipeline
 * builds on. One-time conversion — run it only when the drawing itself changes.
 *
 *   npm i -D potrace && node scripts/trace-logo.mjs
 *
 * `potrace` is not a project dependency: nothing in the app build needs it, and
 * it drags in an image stack for the sake of a file that changes once a year.
 * The SVGs it produces are committed, and `scripts/build-logo.mjs` derives every
 * shipped raster from those.
 *
 * Two things about the input matter. Tracers key on tone, and the drawing is a
 * hairline gold on near-black: traced as it stands, the ground becomes one huge
 * filled shape and every stroke comes back as a hole in it. So the gold coverage
 * is read out of the luminance and repainted black on white first, and the gold
 * is put back as a fill on the result. And potrace winds holes the opposite way
 * from their enclosing shape, so every path it emits must keep
 * `fill-rule="evenodd"` — without it the ring, the letter O and every tooth fill
 * in solid.
 */
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
let potrace
try {
  potrace = require('potrace')
} catch {
  console.error('potrace is not installed. Run: npm i -D potrace')
  process.exit(1)
}

const MASTER = 'brand/logo/ozea-lockup-master.png'
const OUT = 'brand/logo'
const TMP = 'brand/logo/.trace'

const GOLD = '#C9AC7C'
const INK = '#14120F'
const INK_RGB = { r: 20, g: 18, b: 15 }
const GOLD_RGB = { r: 201, g: 172, b: 124 }

/** Trace resolution. Above this the curves stop improving and the file grows. */
const TRACE_WIDTH = 2000
/**
 * Fidelity against file size, swept against the master: `turdSize` 3 with
 * `optTolerance` 0.35 costs 5% more error than the finest trace and saves a
 * third of the bytes; past 0.6 the eyelashes start to soften.
 */
const TRACE = { turdSize: 3, alphaMax: 1, optTolerance: 0.35 }
/**
 * How much to fatten the strokes for the icon, in the master's own units. The
 * mark is drawn in hairlines: at 32px they fall below one pixel and grey out, so
 * the favicon reads as a smudge in a ring. Stroking the filled outlines in their
 * own colour thickens every line from both sides at once.
 */
const ICON_STROKE = 7

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b
const LO = lum(INK_RGB.r, INK_RGB.g, INK_RGB.b)
const HI = lum(GOLD_RGB.r, GOLD_RGB.g, GOLD_RGB.b)

/** The gold coverage of a source, painted black on white for the tracer. */
async function inverted(src, out, gain = 1.35) {
  const meta = await sharp(src).metadata()
  const width = TRACE_WIDTH
  const height = Math.round((meta.height / meta.width) * width)
  const { data } = await sharp(src)
    .flatten({ background: INK_RGB })
    .resize(width, height)
    .raw()
    .toBuffer({ resolveWithObject: true })

  const px = Buffer.alloc(width * height)
  for (let i = 0; i < width * height; i++) {
    const t = ((lum(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) - LO) / (HI - LO)) * gain
    px[i] = Math.round(255 * (1 - Math.min(1, Math.max(0, t))))
  }
  await sharp(px, { raw: { width, height, channels: 1 } }).png().toFile(out)
  return { width, height }
}

function trace(file) {
  return new Promise((resolve, reject) => {
    potrace.trace(
      file,
      { threshold: 128, optCurve: true, turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY, ...TRACE },
      (err, svg) => (err ? reject(err) : resolve(svg)),
    )
  })
}

/** One decimal is a twentieth of a pixel at the trace resolution. */
const tighten = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(+Number(n).toFixed(1)))

/** Bounding box of the on-curve points — enough to size an artboard. */
function bbox(d) {
  const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number)
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (let i = 0; i + 1 < n.length; i += 2) {
    if (n[i] < x0) x0 = n[i]
    if (n[i] > x1) x1 = n[i]
    if (n[i + 1] < y0) y0 = n[i + 1]
    if (n[i + 1] > y1) y1 = n[i + 1]
  }
  return { x0, y0, x1, y1 }
}

const DESC =
  'A left-facing profile drawn in gold monoline inside a gold ring: the skull read through the cheek, the upper and lower tooth rows meeting on the bite plane, and a gold dental implant seated in a lower molar.'

const doc = (viewBox, desc, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="ozea-t ozea-d">
  <title id="ozea-t">Ozea Dental Clinic</title>
  <desc id="ozea-d">${desc}</desc>
${body}
</svg>
`

await mkdir(TMP, { recursive: true })

// The mark is cut from the lockup master rather than traced separately, so the
// medallion in the badge and the medallion in the lockup are the same curves.
const RING = { cx: 869.5, cy: 866.5, r: 781.5 }
const BLEED = 26
const side = Math.round((RING.r + BLEED) * 2)
await sharp(MASTER)
  .extract({
    left: Math.round(RING.cx - side / 2),
    top: Math.round(RING.cy - side / 2),
    width: side,
    height: side,
  })
  .png()
  .toFile(`${TMP}/mark.png`)

await inverted(`${TMP}/mark.png`, `${TMP}/mark-bw.png`)
await inverted(MASTER, `${TMP}/lockup-bw.png`)

const markD = tighten((await trace(`${TMP}/mark-bw.png`)).match(/ d="([^"]+)"/)[1])
const lockD = tighten((await trace(`${TMP}/lockup-bw.png`)).match(/ d="([^"]+)"/)[1])

// The artboard is the ring, not the traced bitmap: the ink ground has to stop
// exactly where the gold ring stops, or it shows as a rim outside it on a light
// surface. The disc is pulled three units inside the ring's outer edge so the
// two meet under the stroke instead of leaving an antialiased seam.
const mb = bbox(markD)
const cx = +((mb.x0 + mb.x1) / 2).toFixed(1)
const cy = +((mb.y0 + mb.y1) / 2).toFixed(1)
const R = +((mb.x1 - mb.x0) / 2).toFixed(1)
const markBox = [cx - R - 2, cy - R - 2, R * 2 + 4, R * 2 + 4].map((n) => n.toFixed(1)).join(' ')
const disc = `  <circle cx="${cx}" cy="${cy}" r="${(R - 3).toFixed(1)}" fill="${INK}"/>`

await writeFile(
  `${OUT}/ozea-mark.svg`,
  doc(markBox, DESC, `${disc}\n  <path fill="${GOLD}" fill-rule="evenodd" d="${markD}"/>`),
)

// Art only, inheriting its colour — for placing straight onto a dark surface.
await writeFile(
  `${OUT}/ozea-mark-gold.svg`,
  doc(markBox, DESC, `  <path fill="currentColor" fill-rule="evenodd" d="${markD}"/>`),
)

await writeFile(
  `${OUT}/ozea-icon.svg`,
  doc(
    markBox,
    DESC,
    `${disc}\n  <path fill="${GOLD}" fill-rule="evenodd" stroke="${GOLD}" stroke-width="${ICON_STROKE}" stroke-linejoin="round" d="${markD}"/>`,
  ),
)

const lb = bbox(lockD)
const pad = 6
const lockBox = [lb.x0 - pad, lb.y0 - pad, lb.x1 - lb.x0 + pad * 2, lb.y1 - lb.y0 + pad * 2]
  .map((n) => n.toFixed(1))
  .join(' ')
// The lockup is a handoff file — print, decks, e-mail signatures — so it carries
// the gold rather than inheriting it. `ozea-mark-gold.svg` is the one meant to
// be inlined and re-tinted; a `color` set on this root would block that.
await writeFile(
  `${OUT}/ozea-lockup.svg`,
  doc(
    lockBox,
    `${DESC} Below it an engraved rule and the wordmark OZEA over DENTAL CLINIC.`,
    `  <path fill="${GOLD}" fill-rule="evenodd" d="${lockD}"/>`,
  ),
)

for (const f of ['ozea-mark.svg', 'ozea-mark-gold.svg', 'ozea-icon.svg', 'ozea-lockup.svg']) {
  const kb = ((await readFile(`${OUT}/${f}`)).length / 1024).toFixed(0)
  console.log(`${f.padEnd(22)} ${kb}KB`)
}
