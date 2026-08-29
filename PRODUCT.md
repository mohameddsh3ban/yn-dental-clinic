# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a prospective patient in Nasr City and greater Cairo who is facing, or investigating,
a surgical procedure of the jaws or face — corrective jaw surgery, a facial fracture, TMJ pain,
impacted third molars, a cyst, bone grafting, or implants. They usually arrive already worried,
often after being told by another dentist that they need surgery, and they are trying to answer
two questions quickly: does this surgeon perform my specific operation, and can I talk to someone
today. They are on a phone, and WhatsApp is how they expect to make contact.

Secondary: a referring general dental practitioner deciding whether to send a case. They judge the
practice on scope of practice stated plainly, not on marketing language.

## Product Purpose

A single-page site for Ozea Dental Clinic that establishes, within a few seconds, that this is an
oral and maxillofacial surgical practice led by a named surgeon — not a general or cosmetic dental
clinic — and converts that recognition into one WhatsApp conversation or one phone call. Success is
a qualified enquiry from someone whose procedure is genuinely within scope.

## Positioning

A named surgeon and a stated scope of practice, presented without outcome claims, patient imagery,
or statistics. The practice competes on being legible and checkable: the operations it performs are
listed, the logistics are verifiable public record, and nothing on the page asserts a result.

## Operating Context

- Booking runs entirely through WhatsApp (`site.whatsapp` deep link) and two published phone lines.
  There is no booking form, no backend, and no scheduling system.
- Clinic: 6 Mahmoud Ammar, Al Golf, Nasr City, Cairo Governorate. Consulting hours Mon – Sat,
  09:00 – 16:00.
- Public records the site points at and must stay consistent with: the Google Maps place listing
  and the Instagram account `@dr.youssefnasser_`.
- The clinic accepts referrals from other practitioners and provides second opinions. Confirmed by
  the owner, 2026-08-27.
- The practice leads with maxillofacial surgery. Implants are part of the scope but not the headline
  service. Confirmed by the owner, 2026-08-27.
- Built as a static bundle and deployed to Cloudflare Pages.

## Capabilities and Constraints

- Stack in place: Vite 7, React 19, TypeScript, Tailwind CSS 3, framer-motion, react-router 7,
  shadcn/ui primitives. No backend, no CMS, no analytics.
- Routes: `/` (the landing page) and `/hero-demo`, a concept sandbox not linked from the live site.
- English only. The `EN` control in the header is currently decorative — no i18n and no RTL support
  exists, and nothing on the site may depend on a language toggle working.
- Two query flags exist for capture and testing and must keep working: `?snap=1` renders every
  animation in its final state, `?flat=1` relaxes viewport-height sizing.
- Must render without horizontal overflow from 320px to 2560px.
- Undecided: whether the stated WhatsApp reply window (Mon – Sat, 09:00 – 16:00) reflects real
  response behaviour, and who answers that line. Until confirmed, no copy may claim who replies.

## Brand Commitments

- Name: **Ozea Dental Clinic**, renamed from "YN Dental Clinic" on 2026-08-27. The wordmark reads
  "Ozea" over an engraved "DENTAL CLINIC" line.
- Surgeon: **Dr. Youssef Nasser**. Specialty string, used verbatim: "Dental Implants & Maxillofacial
  Surgery".
- Palette in use: ink `#14120F`, warm sand `#CFC8BC`, gold accent `#C0A578` / `#C9AC7C`.
- Type in use: Inter Tight (display), Inter (text), Cinzel (logo wordmark only).
- Open item: the logo raster artwork still contains a **YN monogram** inside the tooth crown, in
  `src/assets/logo-*.png`, `public/favicon.png`, and `public/brand/`. It contradicts the new name and
  needs regenerated artwork.

## Evidence on Hand

- Real photography of the surgeon: `brand/doctor/yn-01-studio-scrubs.png` (studio portrait, black
  scrubs, surgical loupes — the hero uses a background-removed derivative at
  `src/assets/doctor-surgeon-1200.webp` and `-620.webp`), plus `yn-02-blazer`, `yn-03-thobe`,
  `yn-05-face-studio`, `yn-06-face-thobe`. `yn-04-clinic-mirror` is a phone selfie and is not
  publication-grade.
- Generic clinical and service photography in `src/assets/` and `brand/generated/`.
- **Absences future work must not fabricate:** there is no patient photography, no before/after
  imagery, no radiograph, CT, or 3D render, and no consented case material of any kind. Any
  anatomical illustration must be drawn in code and labelled as a schematic, not a patient image.
- **No verified credentials.** No syndicate registration number, degree, fellowship, board
  certification, hospital affiliation, or award has been supplied. Confirmed by the owner on
  2026-08-27 that nothing beyond the specialty string should appear. Nothing else may be displayed.
- **No verified statistics.** The figures that previously appeared on the page — "827+",
  "170+ performed surgeries", "85% satisfied clients" — are unsubstantiated and were removed. Two
  further contradictory sets still live in `src/sections/About.tsx` (98% satisfaction, 50K smiles,
  4.9 rating, 15+ years) and `src/sections/Services.tsx` (750+ reviews). None may be reintroduced.

## Product Principles

1. **Say the operation, don't sell the outcome.** Naming what the practice operates on is always
   truthful and is what the visitor came for. Promising a result is neither.
2. **Every claim on the page must be checkable.** An address that resolves, an account that exists,
   a number that answers. If a fact cannot be verified by a reader, it does not ship.
3. **A named human before a list.** The surgeon is the product; anonymous clinic language is not.
4. **The visitor is anxious, not shopping.** Calm, plain, specific. No urgency devices, no
   superlatives, no cosmetic-dentistry vocabulary.
5. **Nothing is fabricated to fill a slot.** A missing credential, statistic, or testimonial stays
   missing and is recorded as missing.

## Accessibility & Inclusion

- Body and micro text must clear WCAG AA against the darkest band of the sand gradient (`#d9d1c2`).
  `#7a7367` and `#9a9184`, used throughout the older sections, fail that test; `#5f584d` and
  `#6b6459` are the replacements.
- `prefers-reduced-motion` must render the complete interface — no content may be motion-gated.
- Known gap: below `lg` the site has no navigation affordance beyond the WhatsApp button. There is
  no hamburger menu.
