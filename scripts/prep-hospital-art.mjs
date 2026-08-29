/**
 * Turns the hospital masters into affiliation-card artwork.
 *
 * The masters arrive as two different things: four photographs of a building
 * and two logos sitting on paper (one of them a screenshot, complete with a
 * transparency checkerboard and the viewer's own dark chrome down each side).
 * The cards need them to read as one set, so:
 *
 *   photo -> 4:3 crop, webp
 *   logo  -> paper keyed to alpha, trimmed to the mark, centred in a 4:3 frame
 *
 * which lets the card paint its own ground behind a logo and lets a photograph
 * fill the same rectangle edge to edge.
 *
 *   node scripts/prep-hospital-art.mjs
 */
import { mkdir, stat } from 'node:fs/promises'
import sharp from 'sharp'

const SRC = 'brand/hospitals'
const OUT = 'src/assets/hospitals'
const WIDTH = 1200
const HEIGHT = Math.round((WIDTH * 3) / 4)
/** Fraction of the frame a keyed logo is allowed to fill. */
const FILL = 0.74

/**
 * `crop` is a fraction of the master, applied before anything else — it is how
 * the screenshot chrome and the stray page heading under the Shifa lockup come
 * off. `position` picks what survives the 4:3 cover crop on a photograph whose
 * subject is not centred.
 */
const SOURCES = [
  { name: 'shifa', kind: 'logo', crop: { top: 0.02, bottom: 0.24 } },
  { name: 'dar-el-oyoun', kind: 'logo', crop: { left: 0.02, right: 0.02, bottom: 0.06 } },
  { name: 'global-medical-city', kind: 'photo', position: 'centre' },
  { name: 'la-vida', kind: 'photo', position: 'centre' },
  { name: 'nasaaem', kind: 'photo', position: 'centre' },
  { name: 'rofayda', kind: 'photo', position: 'top' },
]

/** Fractional crop -> pixel extract box. */
function box({ crop = {} }, w, h) {
  const left = Math.round(w * (crop.left ?? 0))
  const top = Math.round(h * (crop.top ?? 0))
  return {
    left,
    top,
    width: w - left - Math.round(w * (crop.right ?? 0)),
    height: h - top - Math.round(h * (crop.bottom ?? 0)),
  }
}

await mkdir(OUT, { recursive: true })

for (const source of SOURCES) {
  const file = `${OUT}/${source.name}.webp`
  const master = sharp(`${SRC}/${source.name}.jpeg`)
  const { width: mw, height: mh } = await master.metadata()
  const cropped = sharp(`${SRC}/${source.name}.jpeg`).extract(box(source, mw, mh))

  if (source.kind === 'photo') {
    await cropped
      .resize({ width: WIDTH, height: HEIGHT, fit: 'cover', position: source.position })
      .webp({ quality: 80, effort: 6 })
      .toFile(file)
  } else {
    const { data, info } = await cropped.raw().toBuffer({ resolveWithObject: true })
    const { width: w, height: h, channels } = info

    // Key by distance from white. The threshold has to clear 239 as well as
    // 255: the Dar El Oyoun master is a screenshot of a transparent PNG, so its
    // "empty" pixels alternate between those two as a checkerboard.
    const rgba = Buffer.alloc(w * h * 4)
    let x0 = w
    let x1 = 0
    let y0 = h
    let y1 = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const p = (y * w + x) * channels
        const q = (y * w + x) * 4
        let diff = 0
        for (let c = 0; c < 3; c++) diff = Math.max(diff, (255 - data[p + c]) / 255)
        // Ramp rather than a hard cut, so the lockup keeps its antialiasing.
        const a = Math.min(1, Math.max(0, (diff - 0.09) / 0.06))
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

    const mark = { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }

    // Crop and scale in one pipeline: a raw buffer carries no format, so the
    // intermediate would need its raw metadata handed back a second time.
    const { data: scaled, info: meta } = await sharp(rgba, {
      raw: { width: w, height: h, channels: 4 },
    })
      .extract(mark)
      .resize({
        width: Math.round(WIDTH * FILL),
        height: Math.round(HEIGHT * FILL),
        fit: 'inside',
      })
      .png()
      .toBuffer({ resolveWithObject: true })

    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: scaled,
          left: Math.round((WIDTH - meta.width) / 2),
          top: Math.round((HEIGHT - meta.height) / 2),
        },
      ])
      .webp({ quality: 88, alphaQuality: 80, effort: 6 })
      .toFile(file)

    console.log(`${source.name}: mark ${mark.width}x${mark.height} of ${w}x${h}`)
  }

  const bytes = (await stat(file)).size
  console.log(`${source.name}: ${source.kind} -> ${file} ${WIDTH}x${HEIGHT} ${(bytes / 1024).toFixed(0)}KB`)
}
