/**
 * Turns raw team photography into the two web-ready portraits each profile uses.
 *
 * Drop the source photo in `brand/team/` named after the doctor's slug in
 * `src/lib/team.ts` — for example `brand/team/adham-yehia-zakaria.jpg` — then:
 *
 *   node scripts/prepare-team-portraits.mjs
 *
 * Outputs land in `public/team/<slug>-620.webp` and `<slug>-1200.webp`, which is
 * exactly what the team card and the profile hero ask for. Until a file exists
 * the site falls back to the monogram, so running this is safe at any time and
 * never breaks the build.
 *
 * The tone treatment (slightly lifted contrast, slightly pulled saturation)
 * matches the surgeon portrait already used in the hero, so a new face does not
 * read as a different photo shoot.
 */
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SOURCE_DIR = 'brand/team'
const OUTPUT_DIR = 'public/team'
const QUALITY = 88

/** 4:5 portrait, the aspect the card and the profile hero are laid out for. */
const SIZES = [
  { width: 620, height: 775 },
  { width: 1200, height: 1500 },
]

/** 4:5 again, as a ratio, for the native-resolution fallback render. */
const ASPECT = 4 / 5

/**
 * Largest 4:5 box a source can fill without being enlarged. A phone snap or a
 * profile-picture crop is often smaller than 620px, and upscaling it would look
 * worse than the original while still taking priority over it in the source
 * chain — so those sources get a native-size render instead.
 */
function nativeBox(meta) {
  const width = Math.min(meta.width, Math.round(meta.height * ASPECT))
  return { width, height: Math.round(width / ASPECT) }
}

await mkdir(OUTPUT_DIR, { recursive: true })

let sources = []
try {
  sources = (await readdir(SOURCE_DIR)).filter((name) =>
    /\.(jpe?g|png|webp)$/i.test(name) && !name.startsWith('_'),
  )
} catch {
  await mkdir(SOURCE_DIR, { recursive: true })
}

if (sources.length === 0) {
  console.log(
    `No portraits found in ${SOURCE_DIR}. Drop <slug>.jpg files there (slugs are in src/lib/team.ts) and run again.`,
  )
  process.exit(0)
}

/** One 4:5 render, tone-matched to the surgeon portrait in the hero. */
async function render(from, to, width, height) {
  await sharp(from)
    // `north` keeps the head in frame when a photo is cropped to 4:5.
    .resize({ width, height, fit: 'cover', position: 'north' })
    .modulate({ saturation: 0.94 })
    .linear(1.04, -6)
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(to)

  return (await stat(to)).size
}

for (const name of sources) {
  const from = join(SOURCE_DIR, name)
  const slug = parse(name).name
  const meta = await sharp(from).metadata()

  // Sizes the source can fill honestly. Anything larger is skipped rather than
  // upscaled, because a blurry -1200 would outrank a sharp original.
  const affordable = SIZES.filter((s) => meta.width >= s.width && meta.height >= s.height)

  for (const { width, height } of affordable) {
    const file = `${slug}-${width}.webp`
    const bytes = await render(from, join(OUTPUT_DIR, file), width, height)
    console.log(`${name} -> ${file}  ${(bytes / 1e3).toFixed(0)} KB`)
  }

  // Native-resolution render: the sharpest honest 4:5 crop this source allows.
  // It sits below the sized pair in the chain and above the raw drop-in file.
  const box = nativeBox(meta)
  const file = `${slug}.webp`
  const bytes = await render(from, join(OUTPUT_DIR, file), box.width, box.height)
  console.log(
    `${name} -> ${file}  ${box.width}x${box.height}  ${(bytes / 1e3).toFixed(0)} KB` +
      (affordable.length < SIZES.length
        ? `  (source is ${meta.width}x${meta.height}; larger sizes skipped rather than upscaled)`
        : ''),
  )
}
