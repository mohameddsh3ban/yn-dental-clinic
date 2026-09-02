/**
 * The stylesheet every artboard shares.
 *
 * Two rules govern everything here. Sizes are in millimetres, because that is
 * what a press works in and because CSS lays mm out at fractional pixel
 * precision — only the paper size gets quantised, and `render.mjs` corrects for
 * that. Type sizes are in points, for the same reason.
 *
 * Fonts are inlined as base64 rather than linked, so a built artboard is a
 * single file that renders identically on a machine that has never seen this
 * repository — which is what gets emailed to a printer when something needs
 * changing at 11pm.
 */
import { access, readFile } from 'node:fs/promises'
import { COLOR } from './tokens.mjs'

/**
 * Where the typesetting faces come from.
 *
 * `brand-kit/fonts/` holds single-weight Latin instances fetched by
 * `fetch-print-fonts.mjs`. They are preferred over the website's variable fonts
 * in `public/fonts/`: the printed pieces use five fixed weights, and a static
 * instance is the exact drawing of that weight rather than an interpolation of
 * it. If the folder is missing the build still runs off the site's fonts, so a
 * machine with no network can still produce every file.
 */
const KIT_DIR = 'brand-kit/fonts'
const SITE_DIR = 'public/fonts'

/**
 * Ranges wide enough for every string the kit sets, and no wider.
 *
 * Latin-ext is not declared at all: nothing in the kit sets a character outside
 * these two ranges, and each unused subset added about 90 KB of base64 to every
 * artboard.
 */
const RANGE = {
  latin: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+2000-206F, U+20AC, U+2122, U+2212',
  arabic: 'U+0600-06FF, U+0750-077F, U+200C-200E, U+2010-2011, U+FB50-FDFF, U+FE70-FEFC',
}

/** family, css weight, static file, variable fallback, unicode range. */
const FACES = [
  ['Cinzel', '400', 'cinzel-latin-400.woff2', 'cinzel-latin-400-500.woff2', RANGE.latin],
  ['Cinzel', '500', 'cinzel-latin-500.woff2', 'cinzel-latin-400-500.woff2', RANGE.latin],
  ['Inter', '400', 'inter-latin-400.woff2', 'inter-latin-300-600.woff2', RANGE.latin],
  ['Inter', '500', 'inter-latin-500.woff2', 'inter-latin-300-600.woff2', RANGE.latin],
  ['Inter', '600', 'inter-latin-600.woff2', 'inter-latin-300-600.woff2', RANGE.latin],
  ['InterTight', '300', 'inter-tight-latin-300.woff2', 'inter-tight-latin-300-700.woff2', RANGE.latin],
  ['InterTight', '500', 'inter-tight-latin-500.woff2', 'inter-tight-latin-300-700.woff2', RANGE.latin],
  // The Arabic faces are already one file per weight on the site, so there is
  // nothing to fetch and nothing to choose.
  ...[300, 400, 500, 600].flatMap((w) => [
    ['PlexAr', String(w), null, `ibm-plex-sans-arabic-arabic-${w}.woff2`, RANGE.arabic],
    ['PlexAr', String(w), null, `ibm-plex-sans-arabic-latin-${w}.woff2`, RANGE.latin],
  ]),
]

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  )

let fontCache

/**
 * Every @font-face the kit needs, with the woff2 payload inlined.
 *
 * Returns the CSS and which source each family came from, so the build can say
 * so out loud rather than leaving it to be discovered in a PDF.
 */
export async function fontFaces() {
  if (fontCache) return fontCache

  const sources = new Set()
  const blocks = await Promise.all(
    FACES.map(async ([family, weight, staticFile, fallbackFile, range]) => {
      const kitPath = staticFile && `${KIT_DIR}/${staticFile}`
      const useKit = kitPath && (await exists(kitPath))
      const path = useKit ? kitPath : `${SITE_DIR}/${fallbackFile}`
      sources.add(useKit ? 'static (brand-kit/fonts)' : 'variable (public/fonts)')
      const data = (await readFile(path)).toString('base64')
      return [
        '@font-face{',
        `font-family:'${family}';font-style:normal;font-weight:${weight};font-display:block;`,
        `src:url(data:font/woff2;base64,${data}) format('woff2');`,
        `unicode-range:${range}}`,
      ].join('')
    }),
  )

  fontCache = { css: blocks.join('\n'), sources: [...sources] }
  return fontCache
}

/**
 * Layout and type primitives.
 *
 * `print-color-adjust: exact` is set on the root and inherited: without it a
 * headless render drops every background, and an ink-field card prints as a
 * white card with gold type on it.
 */
export const BASE_CSS = `
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
html,body{background:#fff}
body{font-family:'Inter',system-ui,sans-serif;font-weight:400;color:${COLOR.ink};
  -webkit-font-smoothing:antialiased}

/* One artboard. Every child positions against its top-left corner in mm. */
.sheet{position:relative;overflow:hidden;background:#fff;break-inside:avoid}
.sheet + .sheet{break-before:page;page-break-before:always}
.abs{position:absolute}

/* Faces. InterTight for names and headings, Inter for data, Cinzel for the
   logotype only, PlexAr for every Arabic string. */
.t-display{font-family:'InterTight',system-ui,sans-serif}
.t-body{font-family:'Inter',system-ui,sans-serif}
.t-engraved{font-family:'Cinzel',Georgia,serif}
.t-ar{font-family:'PlexAr','Inter',sans-serif;direction:rtl;unicode-bidi:isolate}

/* A label is always uppercase, tracked, and quiet; a value never is. */
.label{font-family:'Inter',sans-serif;font-weight:500;text-transform:uppercase;
  letter-spacing:.14em;color:${COLOR.microInk}}
.value{font-weight:400;color:${COLOR.ink};font-variant-numeric:tabular-nums}
.num{font-variant-numeric:tabular-nums;letter-spacing:.01em}

.rule{background:${COLOR.gold}}
.rule-quiet{background:#E3DCD0}
.ink-field{background:${COLOR.ink};color:#EFE7D8}
.paper-field{background:${COLOR.paper}}

/* Preview-only guides. Never present in a print PDF: the build renders the
   guide variant to PNG and the clean variant to PDF, from the same markup. */
body[data-guides] .guide-trim{outline:.2mm dashed #E0007A;outline-offset:0}
body[data-guides] .guide-safe{outline:.2mm dashed #00A0C6}
.guide-trim,.guide-safe{pointer-events:none}
`

/** Wraps one or more artboards into a printable document. */
export async function htmlDocument({ title, pageMm, css = '', body, guides = false }) {
  const { css: faces } = await fontFaces()
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${title}</title>
<style>
${faces}
@page{size:${pageMm[0]}mm ${pageMm[1]}mm;margin:0}
html,body{width:${pageMm[0]}mm}
.sheet{width:${pageMm[0]}mm;height:${pageMm[1]}mm}
${BASE_CSS}
${css}
</style></head>
<body${guides ? ' data-guides' : ''}>
${body}
</body></html>`
}
