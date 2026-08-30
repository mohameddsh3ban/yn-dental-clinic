/**
 * Turns the operating-theatre masters into the About section's card stack art.
 *
 * The stack shows one portrait card at a time, so every master has to leave the
 * same 4:5 rectangle. Both arrive portrait but at different ratios (3:4 and
 * roughly 9:16), and neither subject sits in the middle of its frame — the two
 * surgeons in `surgery-team` are high in the frame, and `surgery-theatre` has a
 * theatre lamp filling the top third above its subject. `focusY` is the vertical
 * centre of the crop window as a fraction of the master, which is how each one
 * keeps its subject rather than its ceiling.
 *
 *   node scripts/prep-about-art.mjs
 */
import { mkdir, stat } from 'node:fs/promises'
import sharp from 'sharp'

const SRC = 'brand/hero-concepts/aboutimages'
const OUT = 'src/assets/about'
const WIDTH = 1200
const HEIGHT = Math.round((WIDTH * 5) / 4)

const SOURCES = [
  /** Two surgeons over the field — heads sit in the upper half. */
  { name: 'surgery-team', focusY: 0.46 },
  /** Full-length in theatre — the lamp above the subject is worth keeping. */
  { name: 'surgery-theatre', focusY: 0.40 },
]

/** Centre a `WIDTH:HEIGHT` window on `focusY`, clamped inside the master. */
function window_(master, focusY) {
  const byWidth = Math.round((master.width * HEIGHT) / WIDTH)
  const height = Math.min(byWidth, master.height)
  const width = height === byWidth ? master.width : Math.round((height * WIDTH) / HEIGHT)
  const top = Math.max(0, Math.min(master.height - height, Math.round(master.height * focusY - height / 2)))
  const left = Math.max(0, Math.round((master.width - width) / 2))
  return { left, top, width, height }
}

await mkdir(OUT, { recursive: true })

for (const source of SOURCES) {
  const file = `${OUT}/${source.name}.webp`
  const master = sharp(`${SRC}/${source.name}.jpeg`)
  const meta = await master.metadata()

  await sharp(`${SRC}/${source.name}.jpeg`)
    .extract(window_(meta, source.focusY))
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .modulate({ saturation: 0.96 })
    .webp({ quality: 82 })
    .toFile(file)

  const { size } = await stat(file)
  console.log(`${file}  ${WIDTH}x${HEIGHT}  ${(size / 1024).toFixed(0)} kB`)
}
