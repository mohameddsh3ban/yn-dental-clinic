/** Tiles a set of renders into one labelled sheet, so a round can be judged in
 * a single look instead of one file at a time. */
import sharp from 'sharp'
import { basename } from 'node:path'

const args = process.argv.slice(2)
const out = args.shift()
const cols = Number(args.shift())
const cell = Number(args.shift())
const files = args

const rows = Math.ceil(files.length / cols)
const pad = 8
const label = 34
const cellH = cell + label

const tiles = await Promise.all(
  files.map(async (f, i) => {
    const img = await sharp(f)
      .resize({ width: cell - pad * 2, height: cell - pad * 2, fit: 'contain', background: '#ffffff' })
      .toBuffer()
    const name = basename(f).replace(/\.(png|webp|jpg)$/, '')
    const text = await sharp({
      text: { text: `<span foreground="#111" size="17pt">${i + 1}. ${name}</span>`, rgba: true, dpi: 96 },
    })
      .png()
      .toBuffer()
    return { img, text, x: (i % cols) * cell, y: Math.floor(i / cols) * cellH }
  }),
)

await sharp({
  create: { width: cols * cell, height: rows * cellH, channels: 3, background: '#f2f0ec' },
})
  .composite(
    tiles.flatMap((t) => [
      { input: t.img, left: t.x + pad, top: t.y + pad },
      { input: t.text, left: t.x + pad, top: t.y + cell },
    ]),
  )
  .png()
  .toFile(out)
console.log(out)
