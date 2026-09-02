/**
 * Business card, 90 × 50 mm — the European/Egyptian standard, not the US 3.5 × 2".
 *
 * Front is the identity and nothing else: the medallion and the logotype on the
 * brand's ink, with a gold band running off the bottom edge so the sheet has one
 * element that proves the bleed was honoured. Back carries every checkable fact
 * — two numbers, the handle, the street, the hours — and a QR that opens the
 * same WhatsApp chat the site's button opens, carrying the short form of the link
 * so the modules stay large enough to scan off paper.
 *
 * Nothing on either face is a claim. No credential, no statistic, no strapline:
 * PRODUCT.md records that none have been supplied, and a card is the last place
 * to invent one.
 */
import { block, guides, logo, qr, stackedLockup } from '../parts.mjs'
import { COLOR } from '../tokens.mjs'

const abs = (x, y, w, h) =>
  `position:absolute;left:${x}mm;top:${y}mm;width:${w}mm${h ? `;height:${h}mm` : ''}`

export async function cardSheets({ data, logos, sheet, page, whatsappUrl }) {
  const [wa, second] = data.phones
  const bookQr = await qr(whatsappUrl, { size: 13, dark: COLOR.ink, ground: COLOR.paper, label: 'card WhatsApp QR' })

  const front = `<section class="sheet ink-field">
  <!-- Gold band, run off three edges. Visible band after trim: 2 mm. -->
  <div class="abs" style="left:0;top:51mm;width:96mm;height:5mm;background:${COLOR.gold}"></div>
  <div class="abs" style="${abs(3, 3, 90, 48)};display:flex;align-items:center;justify-content:center">
    ${stackedLockup(logos['ozea-mark-gold'], { markMm: 19, ozeaPt: 11, microPt: 3.6, tone: 'dark', gapMm: 3.2 })}
  </div>
  ${guides({ page, trim: sheet.trim, safe: sheet.safe })}
</section>`

  const back = `<section class="sheet paper-field">
  <div class="abs" style="${abs(7, 6.6, 11)}">${logo(logos['ozea-mark-on-ink'], { w: 11 })}</div>

  <div class="abs" style="${abs(21, 7, 36)}">
    <div class="t-display" style="font-size:9.6pt;font-weight:500;line-height:1.05;
      letter-spacing:.005em;color:${COLOR.ink}">${data.doctor.name.en}</div>
    <div class="label" style="margin-top:1.5mm;font-size:4.5pt;line-height:1.5">
      ${data.doctor.specialty.en}</div>
  </div>

  <div class="abs t-ar" style="${abs(59, 6.6, 30)};text-align:right">
    <div style="font-size:8.4pt;font-weight:500;line-height:1.15;color:${COLOR.ink}">
      ${data.doctor.name.ar}</div>
    <div style="margin-top:1.2mm;font-size:5.2pt;font-weight:400;line-height:1.45;
      color:${COLOR.microInk}">${data.doctor.specialty.ar}</div>
  </div>

  <div class="abs rule" style="${abs(7, 21.4, 82, 0.25)}"></div>

  <!-- Which number takes WhatsApp is its own label rather than a tag beside the
       digits: a recipient reading a card should not have to work out which of
       two numbers the app is on. -->
  <div class="abs" style="${abs(7, 24.6, 33)}">
    ${block({ label: data.labels.whatsapp.en, lines: [{ text: wa.label, pt: 6.8 }] })}
    <div style="margin-top:2.4mm">
      ${block({ label: data.labels.phone.en, lines: [{ text: second.label, pt: 6.8 }] })}
    </div>
    <div style="margin-top:2.4mm">
      ${block({ label: data.labels.instagram.en, lines: [{ text: data.instagram.handle, pt: 6.2 }] })}
    </div>
  </div>

  <div class="abs" style="${abs(44, 24.6, 30)}">
    ${block({
      label: data.labels.clinic.en,
      lines: [
        { text: data.address.street.en, pt: 6.1 },
        { text: data.address.short.en, pt: 6.1, quiet: true },
        { text: data.address.street.ar, pt: 5.4, ar: true, quiet: true },
      ],
    })}
    <div style="margin-top:2.4mm">
      ${block({
        label: data.labels.hours.en,
        lines: [{ text: `${data.hours.days.en} · ${data.hours.time}`, pt: 6.1 }],
      })}
    </div>
  </div>

  <div class="abs" style="${abs(76, 26, 13)}">
    ${bookQr}
    <div class="label" style="margin-top:1.1mm;font-size:3.8pt;line-height:1.25;letter-spacing:.02em;
      text-align:center">${data.labels.scanWhatsapp.en}</div>
  </div>

  ${guides({ page, trim: sheet.trim, safe: sheet.safe })}
</section>`

  return [
    { id: 'front', html: front },
    { id: 'back', html: back },
  ]
}
