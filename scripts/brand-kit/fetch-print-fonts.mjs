/**
 * Fetches single-weight (static) font files for the print kit.
 *
 * The website ships variable fonts, which is right for the web and wrong here:
 * Chrome cannot subset a variable instance into a PDF, so it falls back to Type3
 * fonts — every glyph re-drawn as a little vector procedure. Type3 prints, but
 * the text is not searchable or copyable, the file is several times larger, and
 * prepress preflight flags it. Static instances embed as TrueType (`FontFile2`)
 * and behave like fonts.
 *
 * The Google Fonts v1 CSS endpoint still serves static per-weight instances,
 * which is why it is used here rather than the v2 `wght@` form.
 *
 * Run: node scripts/brand-kit/fetch-print-fonts.mjs
 * Then: node scripts/build-brand-kit.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises'

const OUT = 'brand-kit/fonts'

/** Only the faces the printed pieces actually set, and only Latin. */
const WANTED = [
  { family: 'Cinzel', slug: 'cinzel', weights: [400, 500] },
  { family: 'Inter', slug: 'inter', weights: [400, 500, 600] },
  { family: 'Inter Tight', slug: 'inter-tight', weights: [300, 500] },
]

// Latin only. Nothing in the kit sets a character outside the Latin subset, and
// each extra subset added about 90 KB of base64 to every artboard.
const SUBSETS = ['latin']

// A UA that advertises woff2 but not variable-font support, so the endpoint
// answers with static instances.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/** Splits the returned CSS into `{ subset, weight, url }` rows. */
function parseFaces(css) {
  const rows = []
  const re = /\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g
  for (const [, subset, body] of css.matchAll(re)) {
    const weight = Number(body.match(/font-weight:\s*(\d+)/)?.[1])
    const url = body.match(/url\(([^)]+)\)/)?.[1]
    if (subset && weight && url) rows.push({ subset, weight, url })
  }
  return rows
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const written = []

  for (const { family, slug, weights } of WANTED) {
    const query = `${family.replace(/ /g, '+')}:${weights.join(',')}`
    const res = await fetch(`https://fonts.googleapis.com/css?family=${query}&display=block`, {
      headers: { 'User-Agent': UA },
    })
    if (!res.ok) throw new Error(`${family}: Google Fonts answered ${res.status}`)

    const faces = parseFaces(await res.text()).filter(
      (f) => SUBSETS.includes(f.subset) && weights.includes(f.weight),
    )
    const missing = weights.filter((w) => !faces.some((f) => f.weight === w && f.subset === 'latin'))
    if (missing.length) throw new Error(`${family}: no latin face for weight ${missing.join(', ')}`)

    for (const face of faces) {
      const file = `${slug}-${face.subset}-${face.weight}.woff2`
      const body = Buffer.from(await (await fetch(face.url)).arrayBuffer())
      await writeFile(`${OUT}/${file}`, body)
      written.push(`${file} (${(body.length / 1024).toFixed(0)} KB)`)
    }
  }

  console.log(`✓ ${written.length} static faces in ${OUT}/`)
  for (const line of written) console.log(`   ${line}`)
}

await main()
