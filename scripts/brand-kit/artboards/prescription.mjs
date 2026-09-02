/**
 * Prescription sheet, A5 (148 × 210 mm) — the size Egyptian pads are cut to, so
 * a local printer can pad and glue it without a custom knife.
 *
 * One layout serves both languages. Every horizontal position goes through
 * `mirror`, so the Arabic sheet is the English sheet reflected rather than a
 * second layout that has to be kept in step: the header block, the field rules,
 * the signature and the footer columns all land in the mirrored place, which is
 * where a right-to-left reader looks for them.
 *
 * What is deliberately absent: any registration or licence number. PRODUCT.md
 * records that none has been supplied, and `clinic.json` carries `license: null`.
 * Fill that field in and the labelled rule appears on both sheets.
 */
import { block, field, guides, inlineLockup, qr } from '../parts.mjs'
import { COLOR } from '../tokens.mjs'

/** Rules for the written area: pitch chosen for a clinician's hand, not for type. */
const RULE_PITCH = 9
const RULE_TOP = 98
const RULE_BOTTOM = 172

export async function prescriptionSheets({ data, logos, sheet, page, whatsappUrl, lang }) {
  const rtl = lang === 'ar'
  const t = (key) => data.labels[key][lang]
  const [pw] = page

  /** Left edge of a block, reflected for the Arabic sheet. */
  const mirror = (x, w) => (rtl ? pw - x - w : x)
  const abs = (x, y, w, h) =>
    `position:absolute;left:${mirror(x, w)}mm;top:${y}mm;width:${w}mm${h ? `;height:${h}mm` : ''}`
  const align = rtl ? 'right' : 'left'
  const alignEnd = rtl ? 'left' : 'right'

  const bookQr = await qr(whatsappUrl, { size: 11, dark: COLOR.ink, ground: COLOR.paper, label: 'prescription WhatsApp QR' })
  const mapsQr = await qr(data.maps.url, { size: 11, dark: COLOR.ink, ground: COLOR.paper, label: 'prescription Maps QR' })

  const rules = []
  for (let y = RULE_TOP; y <= RULE_BOTTOM; y += RULE_PITCH) {
    rules.push(`<div class="abs rule-quiet" style="${abs(11, y, 132, 0.2)}"></div>`)
  }

  const licenceRow = data.doctor.license
    ? `<div style="margin-top:1.4mm;font-size:5.6pt;line-height:1.2;color:rgba(239,231,216,.72)">
         ${data.doctor.licenseLabel[lang]} ${data.doctor.license}</div>`
    : ''

  const html = `<section class="sheet" ${rtl ? 'dir="rtl"' : ''} style="background:#fff">

  <!-- Header: full-bleed ink, with the gold hairline that separates it from the
       writing surface run off both side edges. -->
  <div class="abs ink-field" style="left:0;top:0;width:${pw}mm;height:45mm"></div>
  <div class="abs" style="left:0;top:45mm;width:${pw}mm;height:.8mm;background:${COLOR.gold}"></div>

  <div class="abs" style="${abs(11, 12.5, 62)}">
    ${inlineLockup(logos['ozea-mark-gold'], { markMm: 20, ozeaPt: 12, microPt: 4, tone: 'dark', gapMm: 4 })}
  </div>

  <div class="abs" style="${abs(76, 13.5, 61)};text-align:${alignEnd}">
    <div class="${rtl ? 't-ar' : 't-display'}" style="font-size:11pt;font-weight:500;line-height:1.15;
      color:#EFE7D8">${data.doctor.name[lang]}</div>
    <div class="${rtl ? 't-ar' : 't-body'}" style="margin-top:1.6mm;font-size:6pt;line-height:1.35;
      letter-spacing:${rtl ? '0' : '.05em'};color:${COLOR.gold}">${data.doctor.specialty[lang]}</div>
    <div class="${rtl ? 't-display' : 't-ar'}" dir="${rtl ? 'ltr' : 'rtl'}"
      style="margin-top:2.6mm;font-size:7.4pt;line-height:1.3;unicode-bidi:isolate;
      color:rgba(239,231,216,.82)">${data.doctor.name[rtl ? 'en' : 'ar']}</div>
    <div class="${rtl ? 't-body' : 't-ar'}" dir="${rtl ? 'ltr' : 'rtl'}"
      style="margin-top:.9mm;font-size:5.6pt;line-height:1.35;unicode-bidi:isolate;
      color:rgba(239,231,216,.62)">${data.doctor.specialty[rtl ? 'en' : 'ar']}</div>
    ${licenceRow}
  </div>

  <!-- Patient row. Two lines of fields, ruled rather than boxed: a box has to be
       written inside, a rule can be written over. -->
  <div class="abs" style="${abs(11, 57, 88)}">${field({ label: t('patient'), w: 88, ar: rtl })}</div>
  <div class="abs" style="${abs(103, 57, 16)}">${field({ label: t('age'), w: 16, ar: rtl })}</div>
  <div class="abs" style="${abs(125, 57, 18)}">${field({ label: t('sex'), w: 18, ar: rtl })}</div>

  <div class="abs" style="${abs(11, 69, 40)}">${field({ label: t('date'), w: 40, ar: rtl })}</div>
  <div class="abs" style="${abs(55, 69, 40)}">${field({ label: t('fileNo'), w: 40, ar: rtl })}</div>
  <div class="abs" style="${abs(99, 69, 44)}">${field({ label: t('diagnosis'), w: 44, ar: rtl })}</div>

  <div class="abs rule" style="${abs(11, 81, 132, 0.25)}"></div>

  <!-- The prescribing mark. Set in the logotype face so the sheet has one
       engraved element below the header, with the word beneath it rather than
       beside it — beside it, the gap reads as a missing field. -->
  <div class="abs" style="${abs(13, 85, 26)};text-align:${align}">
    <div class="t-engraved" style="font-size:20pt;line-height:1;font-weight:500;color:${COLOR.gold}">Rx</div>
    <div class="label ${rtl ? 't-ar' : ''}" style="margin-top:1.4mm;font-size:4.8pt;line-height:1;
      letter-spacing:${rtl ? '0' : '.16em'}">${t('prescription')}</div>
  </div>

  ${rules.join('\n  ')}

  <div class="abs" style="${abs(11, 180, 50)}">${field({ label: t('followUp'), w: 50, ar: rtl })}</div>
  <div class="abs" style="${abs(91, 180, 52)}">${field({ label: t('signature'), w: 52, ar: rtl })}</div>

  <!-- Footer: paper-tinted band run off the foot, gold rule on top. It starts at
       186 mm so all four columns finish inside the 8 mm safe margin — a pad is
       guillotined and glued at the head, and a foot that runs to the cut loses
       the bottom line of type on the outer leaves. -->
  <div class="abs paper-field" style="left:0;top:186mm;width:${pw}mm;height:30mm"></div>
  <div class="abs rule" style="left:0;top:186mm;width:${pw}mm;height:.3mm"></div>

  <div class="abs" style="${abs(11, 189.5, 44)};text-align:${align}">
    ${block({
      label: t('clinic'),
      labelPt: 4.4,
      lines: [
        { text: data.address.street[lang], pt: 6, ar: rtl },
        { text: data.address.city[lang], pt: 6, ar: rtl, quiet: true },
        { text: data.address.street[rtl ? 'en' : 'ar'], pt: 5.2, ar: !rtl, quiet: true },
      ],
    })}
  </div>

  <div class="abs" style="${abs(59, 189.5, 34)};text-align:${align}">
    ${block({
      label: `${t('phone')} · ${t('whatsapp')}`,
      labelPt: 4.4,
      lines: data.phones.map((p) => ({ text: p.label, pt: 6.2 })),
    })}
  </div>

  <div class="abs" style="${abs(97, 189.5, 22)};text-align:${align}">
    ${block({
      label: t('hours'),
      labelPt: 4.4,
      lines: [
        { text: data.hours.days[lang], pt: 5.8, ar: rtl },
        { text: data.hours.time, pt: 5.8 },
      ],
    })}
    <div style="margin-top:1.6mm">
      ${block({
        label: t('instagram'),
        labelPt: 4.4,
        lines: [{ text: data.instagram.handle, pt: 5.4 }],
      })}
    </div>
  </div>

  <div class="abs" style="${abs(119, 189.5, 24)};display:flex;gap:2mm;direction:ltr">
    <div style="width:11mm;text-align:center">
      ${bookQr}
      <div class="label ${rtl ? 't-ar' : ''}" style="margin-top:.8mm;font-size:3.4pt;line-height:1.15;
        letter-spacing:0">${t('scanWhatsapp')}</div>
    </div>
    <div style="width:11mm;text-align:center">
      ${mapsQr}
      <div class="label ${rtl ? 't-ar' : ''}" style="margin-top:.8mm;font-size:3.4pt;line-height:1.15;
        letter-spacing:0">${t('scanMaps')}</div>
    </div>
  </div>

  ${guides({ page, trim: sheet.trim, safe: sheet.safe })}
</section>`

  return [{ id: lang, html }]
}
