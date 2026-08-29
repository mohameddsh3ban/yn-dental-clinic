# Team portraits — source files

Drop each doctor's raw photo here, named after their slug in `src/lib/team.ts`:

- `youssef-nasser.jpg`
- `adham-yehia-zakaria.jpg`

Then run:

    node scripts/prepare-team-portraits.mjs

That writes `public/team/<slug>-620.webp` and `<slug>-1200.webp` — a 4:5 crop with
the same tone treatment as the hero portrait. Until a file exists, the team card
and the profile page fall back to an engraved monogram, so the site never breaks.

A leading underscore marks reference material that should not be processed.
