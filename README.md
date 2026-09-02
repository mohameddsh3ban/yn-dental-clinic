# Ozea Dental Clinic — Dr. Youssef Nasser

Landing page for **Ozea Dental Clinic** (Dr. Youssef Nasser — dental implants and
maxillofacial surgery, Nasr City, Cairo). Single-page React site with a
WhatsApp-first booking flow, service overview, testimonials, and an embedded
Google Maps location card.

**Live:** https://dryoussefnasser.devstudiocraft.com

## Stack

| Layer    | Choice |
|----------|--------|
| Build    | Vite 7 |
| UI       | React 19 + TypeScript |
| Styling  | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| Motion   | Framer Motion |
| Routing  | React Router 7 |
| Hosting  | Cloudflare Pages |

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production bundle locally
npm run lint
```

Node.js 20 or newer.

## Project layout

```
src/
  pages/Home.tsx        Landing page: hero first, everything else in one lazy chunk
  pages/DoctorProfile   /team/:slug surgeon profiles
  sections/             HeroFacial, Services, Cases, About, Hospitals, Testimonials, Location, Footer
  components/           BrandLogo, FloatingNav + MobileMenu, CompareSlider, CaseLightbox,
                        SmoothImage, CountUp, ScrollProgress, BackToTop, icons
  components/ui/        shadcn/ui primitives (scaffolding, excluded from the Tailwind scan)
  lib/site.ts           Clinic identity + contact details (single source of truth)
  lib/copy/             English and Arabic dictionaries — every visible word
  lib/nav.ts            Section anchors shared by the header, the pill nav and the phone menu
  lib/cases.ts          Case photographs: files, sizes, filter groups
  lib/anim.ts           Shared Framer Motion vocabulary (ease, reveal, wipe, press, useStill)
  assets/               Photography and logo bitmaps imported by the bundler
brand/                  Source artwork and photo masters (not shipped in the bundle)
public/                 favicon, fonts, _redirects, _headers, static brand files
```

### Case photographs

Drop new masters in `brand/cases/`, add them to `scripts/prep-case-art.mjs` and to the
list in `src/lib/cases.ts`, then run `npm run build:case-art`. The script writes two
widths of WebP plus a typed manifest with each image's size and blurred preview; the
captions live in `src/lib/copy/{en,ar}.ts` under `cases.items`, keyed by slug.

### Editing clinic details

Phone numbers, WhatsApp link, address, opening hours, Instagram handle, and the
Google Maps link/embed all live in [`src/lib/site.ts`](src/lib/site.ts). Change
them there — every section reads from that module.

## Deployment

Cloudflare Pages, direct upload from a local build:

```bash
npm run build
npx wrangler pages deploy dist --project-name=dryoussefnasser
```

`public/_redirects` rewrites every path to `index.html` so client-side routes and
`#section` deep links resolve. `public/_headers` sets immutable caching on
fingerprinted assets plus baseline security headers.
