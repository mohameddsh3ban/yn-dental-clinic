/**
 * Brand and print guide, three A4 pages, no bleed — this one is read, not cut.
 *
 * It exists so a printer, a signmaker or the next designer can do the job without
 * asking: which file, which ink, how small, how much air, what stock. Every
 * number on these pages is measured off the artwork or taken from
 * `brand-kit/clinic.json`. The CMYK builds are labelled as what they are — an
 * un-profiled conversion — because a guide that implies a colour proof it cannot
 * deliver is worse than one that says "match to a draw-down".
 */
import { logo, stackedLockup, wordmark } from '../parts.mjs'
import { COLOR, MIN_SIZE, rgbToCmyk } from '../tokens.mjs'

const abs = (x, y, w, h) =>
  `position:absolute;left:${x}mm;top:${y}mm;width:${w}mm${h ? `;height:${h}mm` : ''}`

const PALETTE = [
  ['Surgical Ink', COLOR.ink, 'Headlines, the card front, both document headers.'],
  ['Warm Gold', COLOR.gold, 'The mark, rules, bands. The only accent, and rationed.'],
  ['Measured Gold', COLOR.goldCool, 'Screen measurement accent. Not used in print.'],
  ['Ink Secondary', COLOR.inkSoft, 'Subheadings and secondary names.'],
  ['Body Ink', COLOR.bodyInk, 'Running copy on paper.'],
  ['Micro Ink', COLOR.microInk, 'Labels, logistics, captions.'],
  ['Sand', COLOR.sand, 'Ground tint. Screen ground, print panels.'],
  ['Paper', COLOR.paper, 'The card reverse and the prescription footer band.'],
]

const MISUSE = [
  'Do not re-draw, re-trace or re-weight the linework. Every file is cut from brand/logo/*.svg.',
  'Do not set OZEA without its tracking, and never in another face. Cinzel, 0.34 em, is the logotype.',
  'Do not put the gold mark on a mid-tone. It is gold on ink, ink on paper, or white on ink.',
  'Do not stretch, rotate, outline, emboss in software, or add a drop shadow.',
  'Do not place the mark inside another ring, badge or frame — it already has its own.',
  'Do not print the gold as a tint of black or as a screened yellow. It is a solid build or a foil.',
]

const STOCK = [
  ['Business card', '90 × 50 mm', '3 mm', '350–400 gsm uncoated, soft-touch or matt laminate'],
  ['Prescription A5', '148 × 210 mm', '3 mm', '90–100 gsm uncoated offset, padded 50 leaves, glued head'],
  ['Letterhead A4', '210 × 297 mm', '3 mm', '100–120 gsm uncoated offset'],
  ['Brand guide', '210 × 297 mm', 'none', 'Digital, or 120 gsm for a desk copy'],
]

const swatch = (name, hex, note) => {
  const { c, m, y, k } = rgbToCmyk(hex)
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `<div style="display:flex;gap:4mm;align-items:flex-start;margin-bottom:4.4mm">
  <div style="width:22mm;height:14mm;background:${hex};border:.2mm solid rgba(20,18,15,.12);flex:none"></div>
  <div style="flex:1">
    <div class="t-display" style="font-size:8.4pt;font-weight:500;line-height:1.1">${name}</div>
    <div class="t-body num" style="margin-top:.9mm;font-size:6pt;line-height:1.45;color:${COLOR.bodyInk}">
      ${hex} · RGB ${r} ${g} ${b} · CMYK ${c} ${m} ${y} ${k}</div>
    <div class="t-body" style="margin-top:.6mm;font-size:6pt;line-height:1.4;color:${COLOR.microInk}">${note}</div>
  </div>
</div>`
}

const heading = (text, y) =>
  `<div class="abs label" style="${abs(15, y, 180)};font-size:6pt;letter-spacing:.2em;
    color:${COLOR.microInk}">${text}</div>
   <div class="abs rule" style="${abs(15, y + 3.4, 180, 0.25)}"></div>`

/** A logo variant tile: the artwork on its intended ground, with its filename. */
const variantTile = (svg, { x, y, w, ground, caption, file, markMm }) =>
  `<div class="abs" style="${abs(x, y, w, 30)};background:${ground};
    display:flex;align-items:center;justify-content:center;
    ${ground === '#FFFFFF' ? `border:.2mm solid rgba(20,18,15,.12);` : ''}">
    ${logo(svg, { w: markMm })}
  </div>
  <div class="abs" style="${abs(x, y + 31.5, w)}">
    <div class="t-display" style="font-size:6.6pt;font-weight:500;line-height:1.2">${caption}</div>
    <div class="t-body" style="margin-top:.7mm;font-size:5.4pt;line-height:1.3;color:${COLOR.microInk}">
      logos/svg/${file}.svg</div>
  </div>`

/** Running foot: which document this is, and which page of it. */
const pageFoot = (n, total, stamp) =>
  `<div class="abs" style="${abs(15, 283, 180)};display:flex;justify-content:space-between;
    font-size:5.2pt;color:${COLOR.microInk}">
    <span class="t-body">Ozea Dental Clinic — brand and print kit · ${stamp}</span>
    <span class="t-body num">${n} / ${total}</span>
  </div>`

export async function guideSheets({ data, logos, stamp }) {
  const cover = `<section class="sheet ink-field">
  <div class="abs" style="${abs(15, 66, 180)};display:flex;justify-content:center">
    ${stackedLockup(logos['ozea-mark-gold'], { markMm: 46, ozeaPt: 24, microPt: 7.5, tone: 'dark', gapMm: 7 })}
  </div>
  <div class="abs" style="${abs(15, 170, 180)};text-align:center">
    <div class="t-display" style="font-size:13pt;font-weight:300;letter-spacing:.02em;color:#EFE7D8">
      Brand &amp; Print Kit</div>
    <div class="label" style="margin-top:4mm;font-size:6pt;color:${COLOR.gold}">
      ${data.doctor.name.en} · ${data.doctor.specialty.en}</div>
    <div class="t-ar" style="margin-top:2.6mm;font-size:7.6pt;color:rgba(239,231,216,.7)">
      ${data.doctor.name.ar} · ${data.doctor.specialty.ar}</div>
  </div>
  <div class="abs" style="${abs(15, 262, 180)};text-align:center">
    <div class="t-body num" style="font-size:5.8pt;line-height:1.6;color:rgba(239,231,216,.55)">
      ${data.address.street.en}, ${data.address.city.en} · ${data.phones.map((p) => p.label).join(' · ')}</div>
    <div class="t-body num" style="margin-top:1.4mm;font-size:5.4pt;color:rgba(239,231,216,.4)">
      Issued ${stamp} · generated by scripts/build-brand-kit.mjs</div>
  </div>
</section>`

  const clearSpaceMm = 26
  const pad = clearSpaceMm / 4

  const logoPage = `<section class="sheet" style="background:#fff">
  <div class="abs" style="${abs(15, 15, 180)}">
    <div class="t-display" style="font-size:16pt;font-weight:300;line-height:1.1">The mark</div>
    <div class="t-body" style="margin-top:3mm;font-size:8pt;line-height:1.5;color:${COLOR.bodyInk};max-width:130mm">
      A left-facing profile in gold monoline inside a gold ring: the skull read through the cheek,
      the tooth rows meeting on the bite plane, and an implant seated in a lower molar. The mark and
      the hero illustration on the website are the same face drawn twice — once in line, once in wash.
    </div>
  </div>

  ${heading('Variants', 48)}
  ${variantTile(logos['ozea-mark-on-ink'], { x: 15, y: 56, w: 42, ground: COLOR.ink, markMm: 24, caption: 'Gold on ink', file: 'ozea-mark-on-ink' })}
  ${variantTile(logos['ozea-mark-ink'], { x: 61, y: 56, w: 42, ground: '#FFFFFF', markMm: 24, caption: 'Ink on paper', file: 'ozea-mark-ink' })}
  ${variantTile(logos['ozea-mark-white'], { x: 107, y: 56, w: 42, ground: COLOR.ink, markMm: 24, caption: 'White on ink', file: 'ozea-mark-white' })}
  ${variantTile(logos['ozea-mark-tile-ink'], { x: 153, y: 56, w: 42, ground: COLOR.paper, markMm: 26, caption: 'Avatar tile', file: 'ozea-mark-tile-ink' })}

  ${heading('Clear space and minimum size', 104)}
  <div class="abs" style="${abs(15, 112, 60, 46)};display:flex;align-items:center;justify-content:center;
    background:${COLOR.paper}">
    <div style="padding:${pad}mm;outline:.25mm dashed ${COLOR.gold};outline-offset:0">
      ${logo(logos['ozea-mark-ink'], { w: clearSpaceMm })}
    </div>
  </div>
  <div class="abs" style="${abs(82, 112, 113)}">
    <div class="t-body" style="font-size:7.4pt;line-height:1.55;color:${COLOR.bodyInk}">
      <b style="font-weight:600">Clear space.</b> ${MIN_SIZE.clearSpace} Nothing crosses it — no type,
      no rule, no photograph edge.
    </div>
    <div class="t-body" style="margin-top:3.4mm;font-size:7.4pt;line-height:1.55;color:${COLOR.bodyInk}">
      <b style="font-weight:600">Minimum size.</b> Medallion ${MIN_SIZE.markWidthMm} mm wide;
      stacked lockup ${MIN_SIZE.lockupWidthMm} mm wide. Below those the 2.4 pt monoline fills in on
      uncoated stock and the engraved DENTAL CLINIC line closes up. For anything smaller — a stamp
      die, embroidery, a favicon — use the thickened master, <span class="num">ozea-icon-*</span>.
    </div>
    <div class="t-body" style="margin-top:3.4mm;font-size:7.4pt;line-height:1.55;color:${COLOR.bodyInk}">
      <b style="font-weight:600">Foil and emboss.</b> The ring and the linework can be foiled from the
      same vector. Specify a metallic gold from the Pantone Metallics range and approve a physical
      draw-down on the actual stock — a metallic cannot be judged from a screen or a CMYK proof.
    </div>
  </div>

  ${heading('The logotype', 166)}
  <div class="abs" style="${abs(15, 174, 70)}">
    ${wordmark({ w: 62, ozeaPt: 22, microPt: 6.4, tone: 'light' })}
  </div>
  <div class="abs" style="${abs(96, 174, 99)}">
    <div class="t-body" style="font-size:7.4pt;line-height:1.55;color:${COLOR.bodyInk}">
      Cinzel, weight 500, tracked 0.34 em, with the first letter indented by the same amount so the
      block stays optically centred. DENTAL CLINIC sits below at 0.42 em. The engraved rule is drawn,
      not bordered: at logo scale a border plus positioned diamonds drifts by a fraction and reads as
      a printing fault. Cinzel is used for the logotype and for nothing else.
    </div>
  </div>

  ${heading('Do not', 212)}
  <div class="abs" style="${abs(15, 220, 180)}">
    ${MISUSE.map(
      (line) =>
        `<div style="display:flex;gap:3mm;margin-bottom:2.6mm">
      <div style="width:2.4mm;height:2.4mm;margin-top:1.1mm;flex:none;background:${COLOR.gold}"></div>
      <div class="t-body" style="font-size:7.2pt;line-height:1.45;color:${COLOR.bodyInk}">${line}</div>
    </div>`,
    ).join('\n')}
  </div>
  ${pageFoot(2, 3, stamp)}
</section>`

  const specPage = `<section class="sheet" style="background:#fff">
  ${heading('Palette', 15)}
  <div class="abs" style="${abs(15, 23, 88)}">${PALETTE.slice(0, 4).map((p) => swatch(...p)).join('')}</div>
  <div class="abs" style="${abs(107, 23, 88)}">${PALETTE.slice(4).map((p) => swatch(...p)).join('')}</div>
  <div class="abs" style="${abs(15, 110, 180)}">
    <div class="t-body" style="font-size:6.6pt;line-height:1.5;color:${COLOR.microInk}">
      CMYK values above are an un-profiled conversion. They are a starting point for a job sheet, not
      a colour proof: ask the printer to convert with the house profile, and approve a wet or digital
      proof on the actual stock. The gold in particular goes muddy if it is built as a screened
      yellow — it wants a solid build or a foil.
    </div>
  </div>

  ${heading('Type', 130)}
  <div class="abs" style="${abs(15, 138, 180)}">
    <div style="display:flex;gap:6mm;align-items:baseline;margin-bottom:5mm">
      <div class="label" style="width:42mm;font-size:5.4pt;flex:none">Cinzel 500 · logotype only</div>
      <div class="t-engraved" style="font-size:15pt;letter-spacing:.3em">OZEA</div>
    </div>
    <div style="display:flex;gap:6mm;align-items:baseline;margin-bottom:5mm">
      <div class="label" style="width:42mm;font-size:5.4pt;flex:none">Inter Tight 500 · names</div>
      <div class="t-display" style="font-size:14pt;font-weight:500">${data.doctor.name.en}</div>
    </div>
    <div style="display:flex;gap:6mm;align-items:baseline;margin-bottom:5mm">
      <div class="label" style="width:42mm;font-size:5.4pt;flex:none">Inter 400/500 · data, labels</div>
      <div class="t-body num" style="font-size:10pt">${data.phones[0].label} · ${data.hours.days.en} ${data.hours.time}</div>
    </div>
    <div style="display:flex;gap:6mm;align-items:baseline">
      <div class="label" style="width:42mm;font-size:5.4pt;flex:none">IBM Plex Sans Arabic · Arabic</div>
      <div class="t-ar" style="font-size:12pt">${data.doctor.name.ar} · ${data.doctor.specialty.ar}</div>
    </div>
    <div class="t-body" style="margin-top:5mm;font-size:6.6pt;line-height:1.5;color:${COLOR.microInk}">
      All four faces are open licence (SIL OFL) and are embedded in every PDF in this kit, so a
      printer needs nothing installed. Arabic sets in Plex with Western digits, the way Egyptian
      clinics quote numbers and the only way a phone number stays aligned.
    </div>
  </div>

  ${heading('Print specification', 214)}
  <div class="abs" style="${abs(15, 222, 180)}">
    <div style="display:flex;font-size:5.4pt" class="label">
      <div style="width:44mm">Piece</div><div style="width:30mm">Trim</div>
      <div style="width:18mm">Bleed</div><div style="flex:1">Stock and finishing</div>
    </div>
    <div class="rule" style="margin:1.6mm 0;height:.25mm"></div>
    ${STOCK.map(
      ([piece, trim, bleed, stock]) =>
        `<div style="display:flex;font-size:6.8pt;line-height:1.5;padding:.9mm 0;
      border-bottom:.2mm solid #E3DCD0">
      <div style="width:44mm;font-weight:500">${piece}</div>
      <div style="width:30mm" class="num">${trim}</div>
      <div style="width:18mm" class="num">${bleed}</div>
      <div style="flex:1;color:${COLOR.bodyInk}">${stock}</div>
    </div>`,
    ).join('\n')}
    <div class="t-body" style="margin-top:3.4mm;font-size:6.6pt;line-height:1.5;color:${COLOR.microInk}">
      Every PDF carries an exact TrimBox and BleedBox, so cut to the TrimBox and ignore the page edge.
      Files are RGB with embedded fonts and live vector artwork; convert to the house CMYK profile at
      output. A <span class="num">*-proof-with-marks.pdf</span> of each piece shows the cut, and
      <span class="num">ozea-business-card-a4-10up.pdf</span> gangs ten cards on A4 for a digital
      press, long-edge duplex.
    </div>
  </div>
  ${pageFoot(3, 3, stamp)}
  ${pageFoot(3, 3, stamp)}
</section>`

  return [
    { id: 'cover', html: cover },
    { id: 'logo', html: logoPage },
    { id: 'spec', html: specPage },
  ]
}
