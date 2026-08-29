/** Overlays a labelled percentage grid on an image, so landmark coordinates can
 * be read off a single look and fed straight to the compositor. */
import sharp from 'sharp'

const [file, out, wArg] = process.argv.slice(2)
const W = Number(wArg ?? 900)

const base = sharp(file).resize({ width: W })
const meta = await base.metadata()
const H = Math.round((meta.height / meta.width) * W)

const lines = []
for (let p = 0; p <= 100; p += 5) {
  const x = (p / 100) * W
  const y = (p / 100) * H
  const major = p % 25 === 0
  const col = major ? 'rgba(200,20,20,0.55)' : 'rgba(30,90,200,0.28)'
  const wd = major ? 1.6 : 0.8
  lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${col}" stroke-width="${wd}"/>`)
  lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${col}" stroke-width="${wd}"/>`)
  lines.push(
    `<text x="${x + 2}" y="12" font-family="monospace" font-size="11" fill="#c81414">${p}</text>`,
  )
  lines.push(
    `<text x="2" y="${y - 2}" font-family="monospace" font-size="11" fill="#c81414">${p}</text>`,
  )
}

const svg = Buffer.from(`<svg width="${W}" height="${H}">${lines.join('')}</svg>`)
await sharp(await base.toBuffer())
  .composite([{ input: svg }])
  .png()
  .toFile(out)
console.log(`${out} ${W}x${H}`)
