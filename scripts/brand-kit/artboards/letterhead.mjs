/**
 * Letterhead, A4 (210 × 297 mm).
 *
 * The header carries the identity and the surgeon; the footer carries the
 * logistics; everything between them is deliberately empty, because that band is
 * the only part of a letterhead that does any work. Body copy typed into it
 * clears the safe area at 18 mm on both sides and stops 12 mm above the footer
 * rule.
 *
 * Referral letters and written surgical plans are what this sheet exists for —
 * PRODUCT.md records that the practice takes referrals and gives the patient a
 * written plan to keep.
 */
import { block, guides, inlineLockup, qr } from '../parts.mjs'
import { COLOR } from '../tokens.mjs'

export async function letterheadSheets({ data, logos, sheet, page, whatsappUrl }) {
  const [pw] = page
  const abs = (x, y, w, h) =>
    `position:absolute;left:${x}mm;top:${y}mm;width:${w}mm${h ? `;height:${h}mm` : ''}`
  const bookQr = await qr(whatsappUrl, { size: 12, dark: COLOR.ink, ground: '#fff', label: 'letterhead WhatsApp QR' })

  const html = `<section class="sheet" style="background:#fff">

  <div class="abs ink-field" style="left:0;top:0;width:${pw}mm;height:46mm"></div>
  <div class="abs" style="left:0;top:46mm;width:${pw}mm;height:.7mm;background:${COLOR.gold}"></div>

  <div class="abs" style="${abs(18, 14, 70)}">
    ${inlineLockup(logos['ozea-mark-gold'], { markMm: 19, ozeaPt: 11.5, microPt: 3.8, tone: 'dark' })}
  </div>

  <div class="abs" style="${abs(106, 14, 88)};text-align:right">
    <div class="t-display" style="font-size:10.5pt;font-weight:500;line-height:1.1;color:#EFE7D8">
      ${data.doctor.name.en}</div>
    <div class="label" style="margin-top:1.5mm;font-size:5.6pt;line-height:1.3;color:${COLOR.gold}">
      ${data.doctor.specialty.en}</div>
    <div class="t-ar" style="margin-top:2.4mm;font-size:7.4pt;line-height:1.25;color:rgba(239,231,216,.82)">
      ${data.doctor.name.ar}</div>
    <div class="t-ar" style="margin-top:.8mm;font-size:5.6pt;line-height:1.35;color:rgba(239,231,216,.6)">
      ${data.doctor.specialty.ar}</div>
  </div>

  <!-- The letter area. Kept empty on purpose: 18 mm side margins, first
       baseline at 62 mm, last line clear of the footer rule at 260 mm. -->

  <!-- Footer rule at 268 mm: the letter area above it ends at 260 mm, and every
       column below finishes inside the 15 mm safe margin. -->
  <div class="abs rule" style="${abs(18, 268, 180, 0.25)}"></div>

  <div class="abs" style="${abs(18, 272, 56)}">
    ${block({
      label: data.labels.clinic.en,
      labelPt: 4.6,
      lines: [
        { text: data.address.street.en, pt: 6.4 },
        { text: data.address.city.en, pt: 6.4, quiet: true },
        { text: `${data.address.street.ar} · ${data.address.short.ar}`, pt: 5.6, ar: true, quiet: true },
      ],
    })}
  </div>

  <div class="abs" style="${abs(80, 272, 48)}">
    ${block({
      label: `${data.labels.phone.en} · ${data.labels.whatsapp.en}`,
      labelPt: 4.6,
      lines: data.phones.map((p) => ({ text: p.label, pt: 6.4 })),
    })}
  </div>

  <div class="abs" style="${abs(134, 272, 44)}">
    ${block({
      label: data.labels.hours.en,
      labelPt: 4.6,
      lines: [{ text: `${data.hours.days.en} · ${data.hours.time}`, pt: 6.4 }],
    })}
    <div style="margin-top:2mm">
      ${block({
        label: data.labels.instagram.en,
        labelPt: 4.6,
        lines: [{ text: data.instagram.handle, pt: 6 }],
      })}
    </div>
  </div>

  <div class="abs" style="${abs(186, 271, 12)}">
    ${bookQr}
    <div class="label" style="margin-top:1mm;font-size:3.6pt;line-height:1.15;letter-spacing:.02em;
      text-align:center">${data.labels.scanWhatsapp.en}</div>
  </div>

  <div class="abs" style="left:0;top:298mm;width:${pw}mm;height:5mm;background:${COLOR.gold}"></div>

  ${guides({ page, trim: sheet.trim, safe: sheet.safe })}
</section>`

  return [{ id: 'sheet', html }]
}
