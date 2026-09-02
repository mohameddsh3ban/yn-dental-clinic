/**
 * Cuts every logo file in the brand kit from the three vector masters in
 * `brand/logo/`.
 *
 * The kit ships more variants than the website needs, because print asks
 * questions a screen never does: what goes on a one-colour rubber stamp, what a
 * foil die is cut from, what survives a fax, what a supplier pastes into a
 * signage layout. Each variant is the same curves in a different ink, so none of
 * them can drift from the site's mark.
 *
 * Masters:
 * - `ozea-mark-gold.svg`  the medallion, single colour, transparent ground
 * - `ozea-lockup.svg`     medallion + engraved rule + OZEA + DENTAL CLINIC
 * - `ozea-icon.svg`       the medallion with thickened linework, for small sizes
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { COLOR } from './tokens.mjs'

const SRC = 'brand/logo'

/**
 * Which token in each master carries the artwork colour, and — where the master
 * ships with its own ink ground — which one carries that.
 *
 * `markDisc` is the same curves as `mark` with the ink disc behind them. It is a
 * separate master rather than a rectangle drawn here because the ground belongs
 * inside the ring: a square of ink behind the medallion is a different mark.
 */
const MASTERS = {
  mark: { file: 'ozea-mark-gold.svg', art: 'currentColor' },
  markDisc: { file: 'ozea-mark.svg', art: '#C9AC7C', ground: '#14120F' },
  lockup: { file: 'ozea-lockup.svg', art: '#C9AC7C' },
  icon: { file: 'ozea-icon.svg', art: '#C9AC7C', ground: '#14120F' },
}

const INKS = {
  gold: COLOR.gold,
  ink: COLOR.ink,
  white: COLOR.white,
}

/** PNG edge lengths shipped for every variant. */
const PNG_SIZES = [256, 512, 1024, 2048, 4096]

/** Print rasters, for suppliers who will not take a vector. */
const PRINT_RASTERS = [
  { dpi: 300, widthMm: 60 },
  { dpi: 600, widthMm: 60 },
]

const viewBoxOf = (svg) => svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number)

/**
 * Loads a master and asserts its colour token is actually present.
 *
 * Without the assertion a renamed fill in the master would silently produce a
 * folder of correctly-named files that are all still gold — the failure mode
 * that only shows up on a printed sheet.
 */
async function loadMaster(key) {
  const spec = MASTERS[key]
  const svg = await readFile(`${SRC}/${spec.file}`, 'utf8')
  for (const token of [spec.art, spec.ground].filter(Boolean)) {
    if (!svg.includes(token)) {
      throw new Error(`${spec.file}: colour token ${token} is gone — logos.mjs needs updating`)
    }
  }
  return { ...spec, svg }
}

/**
 * Repaints a master. `ground: null` drops the master's own ink field, which is
 * what every transparent variant wants.
 */
function paint(master, { art, ground = null }) {
  let svg = master.svg.replaceAll(master.art, art)
  if (master.ground) svg = svg.replaceAll(master.ground, ground ?? 'none')
  return svg
}

/**
 * Puts the artwork on its own ink field, padded, for avatars and stickers.
 *
 * The rect goes in after `</desc>` so the accessible name still comes first in
 * document order; SVG paints in document order, so the ground still lands
 * behind the linework.
 */
function onGround(svg, { ground, padRatio, round = false }) {
  const [x, y, w, h] = viewBoxOf(svg)
  const pad = Math.max(w, h) * padRatio
  const box = [x - pad, y - pad, w + pad * 2, h + pad * 2]
  const r = round ? ` rx="${(box[2] * 0.18).toFixed(1)}"` : ''
  const rect = `<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}"${r} fill="${ground}"/>`
  return svg
    .replace(/viewBox="[^"]+"/, `viewBox="${box.map((n) => +n.toFixed(1)).join(' ')}"`)
    .replace('</desc>', `</desc>\n  ${rect}`)
}

/** Rasterises an SVG string at a pixel width, preserving its aspect ratio. */
async function raster(svg, width) {
  const [, , vw, vh] = viewBoxOf(svg)
  return sharp(Buffer.from(svg), { density: (72 * width) / vw })
    .resize({ width, height: Math.round((vh / vw) * width) })
}

/**
 * Builds the whole logo folder and returns the SVG strings, so the artboards can
 * inline the same markup they just wrote to disk instead of re-deriving it.
 */
export async function buildLogos(outDir) {
  await mkdir(`${outDir}/svg`, { recursive: true })
  await mkdir(`${outDir}/png`, { recursive: true })
  await mkdir(`${outDir}/print`, { recursive: true })

  const masters = {}
  for (const key of Object.keys(MASTERS)) masters[key] = await loadMaster(key)

  /** name → svg string, for every file the kit ships. */
  const set = {}

  for (const shape of ['mark', 'lockup', 'icon']) {
    for (const [inkName, color] of Object.entries(INKS)) {
      set[`ozea-${shape}-${inkName}`] = paint(masters[shape], { art: color })
    }
  }

  // Gold on the brand's ink, the way the mark is meant to be seen. The medallion
  // and the icon carry their own disc; the lockup gets a padded ink field, since
  // the type below the ring has to sit on something.
  set['ozea-mark-on-ink'] = paint(masters.markDisc, { art: COLOR.gold, ground: COLOR.ink })
  set['ozea-icon-on-ink'] = paint(masters.icon, { art: COLOR.gold, ground: COLOR.ink })
  set['ozea-lockup-on-ink'] = onGround(paint(masters.lockup, { art: COLOR.gold }), {
    ground: COLOR.ink,
    padRatio: 0.1,
  })

  // Squared, rounded ink tile: profile pictures, stickers, embroidery files.
  // Cut from the thickened icon, because a tile is always used small.
  set['ozea-mark-tile-ink'] = onGround(paint(masters.icon, { art: COLOR.gold }), {
    ground: COLOR.ink,
    padRatio: 0.19,
    round: true,
  })

  const written = { svg: [], png: [], print: [] }

  for (const [name, svg] of Object.entries(set)) {
    await writeFile(`${outDir}/svg/${name}.svg`, svg)
    written.svg.push(`${name}.svg`)

    for (const size of PNG_SIZES) {
      const file = `${outDir}/png/${name}-${size}.png`
      await (await raster(svg, size)).png({ compressionLevel: 9 }).toFile(file)
      written.png.push(`${name}-${size}.png`)
    }
  }

  // Print rasters only for the two shapes a supplier ever asks for.
  for (const name of ['ozea-mark-on-ink', 'ozea-mark-ink', 'ozea-lockup-on-ink', 'ozea-lockup-ink']) {
    for (const { dpi, widthMm } of PRINT_RASTERS) {
      const px = Math.round((widthMm / 25.4) * dpi)
      const base = `${outDir}/print/${name}-${widthMm}mm-${dpi}dpi`
      const img = await raster(set[name], px)
      await img.clone().withMetadata({ density: dpi }).png().toFile(`${base}.png`)
      await img
        .clone()
        .withMetadata({ density: dpi })
        .tiff({ compression: 'lzw' })
        .toFile(`${base}.tif`)
      written.print.push(`${name}-${widthMm}mm-${dpi}dpi.{png,tif}`)
    }
  }

  return { set, written }
}
