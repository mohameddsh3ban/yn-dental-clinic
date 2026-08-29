# public/team

Web-ready team portraits are served from here.

Two ways to add a doctor's photo (slugs come from `src/lib/team.ts`):

1. Optimised (preferred) — put the raw photo in `brand/team/<slug>.jpg` and run
   `node scripts/prepare-team-portraits.mjs`. That writes `<slug>-620.webp` and
   `<slug>-1200.webp` here, 4:5 crop, tone-matched to the hero portrait.

2. Drop-in — save the photo straight here as `<slug>.jpg` (or .jpeg/.png). It
   shows up with no build step; the component tries the WebP pair first and
   falls back to this file.

With neither present, the card and the profile render an engraved monogram, so
the site is never broken by a missing portrait.
