/**
 * Print tokens for the Ozea brand kit.
 *
 * The screen palette lives in `DESIGN.md` and `src/index.css`. This file is the
 * print half of the same system: the same hex values, plus the things only a
 * press needs — trim and bleed geometry, a naive CMYK build for each colour, and
 * the minimum sizes below which the mark loses its linework.
 *
 * CMYK values here are an un-profiled conversion, useful for specifying a job
 * and useless as a colour proof. See brand-kit/README.md.
 */

/** Brand colours, screen-accurate. Every printed piece pulls from here. */
export const COLOR = {
  ink: '#14120F',
  inkSoft: '#3A352F',
  gold: '#C9AC7C',
  goldCool: '#C0A578',
  bodyInk: '#5F584D',
  microInk: '#6B6459',
  sand: '#CFC8BC',
  paper: '#F4F3F0',
  white: '#FFFFFF',
}

/**
 * Naive RGB→CMYK, no ICC profile involved.
 *
 * A press converts with a profile (Coated FOGRA39, or whatever the house uses)
 * and will land somewhere else — warmer or duller depending on stock. These
 * numbers exist so a job sheet can carry a build at all, and so the printer has
 * a starting point to match a proof against, not so anyone matches a screen.
 */
export function rgbToCmyk(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  const f = (v) => Math.round(((1 - v - k) / (1 - k)) * 100)
  return { c: f(r), m: f(g), y: f(b), k: Math.round(k * 100) }
}

/** mm → PDF points. The only unit conversion the whole kit needs. */
export const mm = (v) => (v * 72) / 25.4

/**
 * Sheet geometry. `trim` is what the guillotine cuts to; `bleed` is how far the
 * artwork runs past it; `safe` is how far type stays inside the cut.
 *
 * Business card at 90×50 mm: the Egyptian/European standard, not the US 3.5×2".
 * Prescription and letterhead at A5/A4 for the same reason.
 */
export const SHEETS = {
  card: { trim: [90, 50], bleed: 3, safe: 4, pages: ['front', 'back'] },
  prescription: { trim: [148, 210], bleed: 3, safe: 8, pages: ['sheet'] },
  letterhead: { trim: [210, 297], bleed: 3, safe: 15, pages: ['sheet'] },
  guide: { trim: [210, 297], bleed: 0, safe: 15, pages: ['p1', 'p2', 'p3'] },
}

/** Page size including bleed, in mm. */
export const pageSize = (sheet) => [
  sheet.trim[0] + sheet.bleed * 2,
  sheet.trim[1] + sheet.bleed * 2,
]

/**
 * Reproduction floors, measured off the artwork rather than guessed: below
 * these the 2.4 pt monoline in the mark fills in on uncoated stock and the
 * engraved DENTAL CLINIC line closes up.
 */
export const MIN_SIZE = {
  markWidthMm: 9,
  lockupWidthMm: 22,
  clearSpace: 'One quarter of the mark’s diameter on all four sides.',
}
