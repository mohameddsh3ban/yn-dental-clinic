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
  pages/Home.tsx        Single route, composes all sections
  sections/             Hero, Services, About, Testimonials, Location, Footer
  components/           BrandLogo, FloatingNav, icons
  components/ui/        shadcn/ui primitives
  lib/site.ts           Clinic identity + contact details (single source of truth)
  lib/nav.ts            Section anchors for the floating nav
  lib/anim.ts           Shared Framer Motion variants
  assets/               Photography and logo bitmaps imported by the bundler
brand/                  Source brand artwork (not shipped in the bundle)
public/                 favicon, _redirects, _headers, static brand files
```

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
