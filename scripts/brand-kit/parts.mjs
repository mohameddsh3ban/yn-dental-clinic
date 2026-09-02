/**
 * The fragments every printed piece is assembled from.
 *
 * The wordmark is set in live Cinzel with the engraved rule drawn in SVG — the
 * same construction the site uses in `src/components/BrandLogo.tsx`, so the card
 * and the header cannot drift. The medallion is the traced vector, inlined, so
 * the PDF carries curves and not a raster.
 */
import QRCode from 'qrcode'
import { COLOR } from './tokens.mjs'

/** Inlines a logo SVG at a physical width. */
export function logo(svg, { w, className = '', style = '' }) {
  const sized = svg.replace(
    /<svg /,
    `<svg style="display:block;width:${w}mm;height:auto" `,
  )
  return `<div class="${className}" style="${style}">${sized}</div>`
}

/**
 * The printed module size below which a phone camera starts failing.
 *
 * A QR is only as good as one black square: 0.3 mm is the usual floor quoted for
 * offset on uncoated stock, and dot gain on a soft-touch laminate eats into it.
 * The encoded string is what controls this — a 13 mm code holding a URL with a
 * pre-filled message needs 49 modules (0.27 mm each) where the bare number needs
 * 25 (0.52 mm). Hence the short links on the printed pieces.
 */
const MIN_MODULE_MM = 0.3

/**
 * A QR code as vector paths, coloured for the ground it sits on.
 *
 * Error correction is M: enough to survive a fold or a thumbprint, without the
 * module count that makes a small code unscannable. The white backing square the
 * encoder emits is replaced with the actual paper colour so the code does not
 * print as a white patch on a tinted panel.
 *
 * Throws if the modules would print smaller than they can be read. A QR that
 * does not scan is worse than no QR — nobody notices until the cards are printed.
 */
export async function qr(text, { size, dark = COLOR.ink, ground = 'none', label = 'QR' }) {
  const svg = await QRCode.toString(text, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
  })

  const modules = Number(svg.match(/viewBox="0 0 (\d+)/)[1])
  const moduleMm = size / modules
  if (moduleMm < MIN_MODULE_MM) {
    throw new Error(
      `${label}: ${modules}×${modules} modules at ${size} mm is ${moduleMm.toFixed(3)} mm per ` +
        `module, under the ${MIN_MODULE_MM} mm floor. Shorten the encoded string or enlarge the code.`,
    )
  }

  return svg
    .replace('<svg ', `<svg style="display:block;width:${size}mm;height:${size}mm" `)
    .replace('fill="#ffffff"', `fill="${ground}"`)
    .replace('stroke="#000000"', `stroke="${dark}"`)
}

/** The engraved rule with its two end lozenges, drawn so the ends always meet. */
export function engravedRule({ w, color = COLOR.gold, heightMm = 0.9 }) {
  return `<svg viewBox="0 0 200 6" preserveAspectRatio="none" aria-hidden="true"
  style="display:block;width:${w}mm;height:${heightMm}mm">
  <path d="M6 3H194" stroke="${color}" stroke-width=".7"/>
  <path d="M3 3 5.4 .6 7.8 3 5.4 5.4Z M192.2 3 194.6 .6 197 3 194.6 5.4Z" fill="${color}"/>
</svg>`
}

/**
 * OZEA over DENTAL CLINIC, with the engraved rule above.
 *
 * Tracking is the whole logotype here: at 0.34em the four letters read as an
 * engraving, at 0 they read as a word set in a serif. It is specified in em so
 * it holds at every size the kit prints it.
 */
export function wordmark({ w, ozeaPt, microPt, tone = 'dark' }) {
  const ink = tone === 'dark' ? '#EFE7D8' : COLOR.ink
  const quiet = tone === 'dark' ? 'rgba(239,231,216,.72)' : '#8A8172'
  return `<div style="width:${w}mm;text-align:center">
  ${engravedRule({ w })}
  <div class="t-engraved" style="margin-top:${ozeaPt * 0.13}pt;font-weight:500;
    font-size:${ozeaPt}pt;line-height:1;letter-spacing:.34em;text-indent:.34em;color:${ink}">OZEA</div>
  <div class="t-body" style="margin-top:${microPt * 0.7}pt;font-size:${microPt}pt;line-height:1;
    letter-spacing:.42em;text-indent:.42em;text-transform:uppercase;color:${quiet}">Dental Clinic</div>
</div>`
}

/** Medallion above the wordmark — the stacked lockup, for a card face or cover. */
export function stackedLockup(markSvg, { markMm, ozeaPt, microPt, tone = 'dark', gapMm = 3 }) {
  return `<div style="display:flex;flex-direction:column;align-items:center">
  ${logo(markSvg, { w: markMm })}
  <div style="margin-top:${gapMm}mm">${wordmark({ w: markMm * 1.35, ozeaPt, microPt, tone })}</div>
</div>`
}

/** Medallion beside the wordmark — the horizontal lockup, for a document header. */
export function inlineLockup(markSvg, { markMm, ozeaPt, microPt, tone = 'dark', gapMm = 4 }) {
  const ink = tone === 'dark' ? '#EFE7D8' : COLOR.ink
  const quiet = tone === 'dark' ? 'rgba(239,231,216,.72)' : '#8A8172'
  return `<div style="display:flex;align-items:center;gap:${gapMm}mm">
  ${logo(markSvg, { w: markMm })}
  <div>
    <div class="t-engraved" style="font-weight:500;font-size:${ozeaPt}pt;line-height:1;
      letter-spacing:.3em;text-indent:.3em;color:${ink}">OZEA</div>
    <div class="t-body" style="margin-top:${microPt * 0.9}pt;font-size:${microPt}pt;line-height:1;
      letter-spacing:.36em;text-indent:.36em;text-transform:uppercase;color:${quiet}">Dental Clinic</div>
  </div>
</div>`
}

/**
 * A labelled data block: quiet tracked label over one or more values.
 *
 * Every non-Arabic line is marked `dir="ltr"` and bidi-isolated. Without it a
 * phone number set inside the Arabic sheet's right-to-left flow prints as
 * "9460 979 106 20+" — the digit groups are neutral, so the paragraph direction
 * reorders them. Same for the opening hours, the Instagram handle and any Latin
 * address line. It is the one bilingual bug that looks like a design choice
 * until someone dials it.
 */
export function block({ label, lines, labelPt = 4.6, valuePt = 6.4, tone = 'light', gapMm = 1 }) {
  const labelColor = tone === 'dark' ? 'rgba(201,172,124,.9)' : COLOR.microInk
  const valueColor = tone === 'dark' ? '#EFE7D8' : COLOR.ink
  const rows = lines
    .filter(Boolean)
    .map(
      (line) =>
        `<div class="${line.ar ? 't-ar' : 't-body'} num" ${line.ar ? '' : 'dir="ltr"'}
      style="font-size:${line.pt ?? valuePt}pt;line-height:1.35;${line.ar ? '' : 'unicode-bidi:isolate;'}
      color:${line.quiet ? (tone === 'dark' ? 'rgba(239,231,216,.7)' : COLOR.bodyInk) : valueColor}">${line.text}</div>`,
    )
    .join('\n')
  return `<div>
  <div class="label" style="font-size:${labelPt}pt;line-height:1;color:${labelColor}">${label}</div>
  <div style="margin-top:${gapMm}mm">${rows}</div>
</div>`
}

/**
 * A form field: a label and the rule that is written on.
 *
 * The rule is a background rather than a border-bottom so it can sit a fixed
 * distance below the baseline instead of hugging the line box, which is what
 * makes a row of fields of different widths look like one ruled line.
 */
export function field({ label, w, labelPt = 5, ruleColor = '#C8BFAE', ar = false, gapMm = 1.2 }) {
  return `<div style="width:${w}mm">
  <div class="label ${ar ? 't-ar' : ''}" style="font-size:${labelPt}pt;line-height:1;
    ${ar ? 'text-align:right;letter-spacing:0;' : ''}">${label}</div>
  <div style="margin-top:${gapMm}mm;height:.25mm;background:${ruleColor}"></div>
</div>`
}

/** Trim and safe-area outlines, drawn only into the preview renders. */
export function guides({ page, trim, safe }) {
  const bleed = (page[0] - trim[0]) / 2
  return `<div class="abs guide-trim" style="left:${bleed}mm;top:${bleed}mm;width:${trim[0]}mm;height:${trim[1]}mm"></div>
<div class="abs guide-safe" style="left:${bleed + safe}mm;top:${bleed + safe}mm;
  width:${trim[0] - safe * 2}mm;height:${trim[1] - safe * 2}mm"></div>`
}
