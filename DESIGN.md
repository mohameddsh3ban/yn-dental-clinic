---
name: Ozea Dental Clinic
description: A warm, paper-light surgical planning surface — ink linework, sand ground, gold reserved for measurement.
colors:
  ink: "#14120F"
  ink-secondary: "#3a352f"
  text-body: "#5f584d"
  text-micro: "#6b6459"
  sand: "#CFC8BC"
  paper-high: "#F4F3F0"
  paper-mid: "#e3dcd0"
  paper-low: "#d9d1c2"
  surface-white: "#ffffff"
  gold: "#C0A578"
  gold-warm: "#C9AC7C"
typography:
  display:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "clamp(2.15rem, 4.8vw, 3.4rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  display-2xl:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "3.9rem"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.02em"
    notes: "Hero h1 only, at the 2xl breakpoint and up. The display clamp tops out at 3.4rem, which under-fills the hero card past 1536px."
  headline:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "clamp(1.9rem, 4.2vw, 3.4rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  title-lg:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "Inter Tight, Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  control:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  control-sm:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
  label-xs:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "10px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.2em"
  engraved:
    fontFamily: "Cinzel, Georgia, serif"
    fontSize: "8px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.3em"
  # Arabic. One face covers every step above when <html lang="ar">: Inter,
  # Inter Tight and Cinzel carry no Arabic glyphs, and IBM Plex Sans Arabic is
  # the closest match to Inter in weight, x-height and counter shape, so the
  # two languages read as one design rather than two. The size and weight
  # steps are unchanged; only the family swaps. Arabic also drops uppercase
  # (the script has no case) and all positive letterSpacing (it is cursive —
  # tracking pulls the joins apart). See the html[lang='ar'] block in
  # src/index.css.
  arabic:
    fontFamily: "IBM Plex Sans Arabic, Segoe UI, Tahoma, sans-serif"
    fontWeight: [300, 400, 500, 600]
    textTransform: "none"
    letterSpacing: "normal"
rounded:
  pill: "9999px"
  card: "1.75rem"
  card-lg: "2.25rem"
  tile: "1.5rem"
  control: "0.625rem"
spacing:
  inset-sm: "12px"
  inset-md: "16px"
  inset-lg: "24px"
  gutter: "32px"
  section-sm: "24px"
  section-md: "40px"
  section-lg: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "16px 24px 16px 28px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.6)"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  button-ghost-hover:
    backgroundColor: "{colors.ink}"
    textColor: "#ffffff"
  chip-glass:
    backgroundColor: "rgba(255,255,255,0.55)"
    textColor: "#2B2723"
    rounded: "{rounded.pill}"
    padding: "10px 20px 10px 14px"
  card-surface:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  register-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "0px"
    height: "52px"
---

# Design System: Ozea Dental Clinic

## Overview

**Creative North Star: "The Planning Room"**

The surface is a lit planning table, not a brochure. Warm paper light pools where the eye should
land; everything sits on a sand ground with generous inset, as though a sheet has been laid on a
larger board. The system's whole personality comes from one restraint: this is a surgical practice,
so the interface behaves like a document a professional would trust — flat, ruled, precisely
lettered — rather than like a clinic advertisement.

Density is low and deliberate. Content is separated by hairlines rather than boxes, and by air
rather than borders. Ink appears at several alphas rather than several colors, which is what makes
a page with almost no color still read as designed. Gold is the only accent and it is rationed: it
marks a measurement, a state, or a separator, never decoration.

Motion exists to introduce, then stops. Nothing loops, nothing breathes, nothing bobs. A planning
document does not animate itself, and a hovering human is uncanny in a way that undoes the
authority the rest of the system is building.

**Key Characteristics:**

- Warm sand ground with a rounded inset card as the primary spatial unit
- Ink at graded alphas instead of a multi-color palette
- Hairline rules and ruled registers as the main separator vocabulary
- Gold used only for measurement, state, and separators
- Large tight display type against small wide-tracked labels
- No shadows at rest; depth comes from light pooling and layering
- Entrance motion only, zero infinite loops

## Colors

A near-monochrome warm-neutral field: one ink, one metal, and a graded paper ground that darkens as
it falls.

### Primary

- **Surgical Ink** (`#14120F`): Headlines, the primary button mass, the mandible line in the
  cephalometric tracing, the logo badge. It is the only true dark in the system and it is used
  sparingly enough that any solid block of it reads as an action.

### Secondary

- **Measured Gold** (`#C0A578`): The measurement accent. Reference planes and landmark dots in the
  tracing, the eyebrow rule, the name-plate rule, register index numerals on hover, the ticks on the
  procedure rail, and `/` separators. **Never a fill, never a background, never a headline color.**
- **Warm Gold** (`#C9AC7C`): Reserved exclusively for the WhatsApp glyph sitting inside an ink pill,
  where the cooler gold would go muddy.

### Neutral

- **Sand** (`#CFC8BC`): The page ground the inset cards sit on, and the last stop of the hero
  gradient.
- **High Paper** (`#F4F3F0`), **Mid Paper** (`#e3dcd0`), **Low Paper** (`#d9d1c2`): The three stops
  of the 165° hero gradient, running light at the top-left to sand at the bottom-right.
- **White** (`#ffffff`): Section cards below the hero (Services and its siblings), which read as
  fresh sheets laid over the sand.
- **Ink Secondary** (`#3a352f`): Nav links, subheadlines, register procedure names.
- **Body Ink** (`#5f584d`): Running body copy and the eyebrow.
- **Micro Ink** (`#6b6459`): Labels, descriptors, logistics, numerals, captions.

### Named Rules

**The Six Golds Rule.** Gold appears in exactly six kinds of position: the eyebrow rule, the
name-plate rule, the tracing's measurement marks, the register index numeral on hover, the procedure
rail's ticks, and `/` separators. A seventh use is a defect, not a flourish.

**The Contrast Floor Rule.** Nothing informational goes lighter than Micro Ink (`#6b6459`), and
contrast is always checked against the darkest band the text can sit over (`#d9d1c2`) — never the
lightest. The legacy values `#7a7367` and `#9a9184` fail WCAG AA on this ground and are being
retired.

## Typography

**Display Font:** Inter Tight (with Inter, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)
**Label/Engraved Font:** Cinzel (with Georgia, serif) — logo wordmark only

**Character:** The pairing splits by role rather than by size. Inter Tight carries anything that is
a **name** — the headline, procedure names, the surgeon's name — set large, tight, and negative-
tracked. Inter carries anything that is **data** — labels, descriptors, numerals, logistics — set
small, wide-tracked, and often uppercase. The tension between those two treatments is the type
system; there is no third voice.

### Hierarchy

- **Display** (500, `clamp(2.15rem, 4.8vw, 3.4rem)`, 1.04, `-0.02em`): The page `h1` only. Sets as
  exactly two lines at every width; the line count is load-bearing for the mobile fold budget.
- **Headline** (500, `clamp(1.9rem, 4.2vw, 3.4rem)`, 1.04, uppercase): Section headings below the
  hero.
- **Title** (500, 15–17px, `-0.01em`): Register procedure names, the surgeon's name plate, card
  titles.
- **Body** (400, 14–15px, 1.65, max ~44ch): Running paragraphs.
- **Label** (500, 10–11px, `0.16em`–`0.2em`, usually uppercase): Eyebrows, scope labels, rail steps,
  the footer band, specialty lines.
- **Engraved** (400, 8px, `0.3em`, uppercase): The "DENTAL CLINIC" line inside the logo lockup, and
  nowhere else.

### The Ramp

Eight literal steps are in use and no others: **10, 11, 12, 13, 14, 15, 16, 17px**, plus the two
clamped display sizes. Their division of labour is strict — 10 and 11 are wide-tracked uppercase
labels, 12 and 13 are interface controls (nav links, header buttons, call-to-action labels), 14 and
15 are running prose, 16 and 17 are names set in Inter Tight. A ninth step is drift; use the nearest
existing one.

### Named Rules

**The One Outline Rule.** Exactly one word per page carries the `.text-outline` stroke treatment.
Two outlined words in one composition is what makes a headline read as generic.

**The Tabular Numeral Rule.** Every numeral a reader might compare or dial — phone numbers, hours,
register indices, rail steps — is set `tabular-nums`, so columns of figures align on a straight
left edge without importing a monospace family.

**The Cinzel Containment Rule.** Cinzel is the logo's voice, not the interface's. At 10px beside
Inter numerals it reads as a rendering fault; inside an Inter Tight line it reads as a family clash.
It never enters the page body.

## Layout

The spatial unit is a **rounded card inset from the page edge**: `p-3` at mobile, `p-4` from 640px,
`p-6` from 1280px, with the card itself at `1.75rem` radius (`2.25rem` from 1280px). Sections below
the hero repeat the same card language on white, separated by the same inset used as a gutter.

The hero runs a **twelve-column grid** from 1280px (`grid-cols-12`, 32px gutters, two rows) split
4 / 4 / 4: copy column, scope register, figure. Below 1280px it collapses to two columns and three
rows, and below 768px to a single column with explicit `order` on every child — the portrait must
sit between the headline and the calls to action, because a face is the fastest-decoded trust signal
and it has to be above the fold.

Content is capped at `max-w-[1760px]` and centred, so at 1920–2560px the headline, register, and
portrait stay one composition rather than drifting to opposite edges of the viewport.

Twelve white hairlines at 30% opacity sit behind the hero content on the same twelve-column grid,
visible only from 1280px where the gutters align. Misaligned structural rules are worse than none.

Vertical rhythm inside a section runs on a small set of steps: 32px between grid rows, 40px before a
rail, 20px before a band, and hairline rules at every seam.

### Named Rules

**The No Horizontal Scroll Rule.** No element in any section may scroll sideways, and the document
must satisfy `scrollWidth === clientWidth` at 320, 375, 414, 480, 640, 768, 1024, 1280, 1440, 1920
and 2560. A list that runs off the right edge of a phone is a list of unread items.

**The Fixed Height Rule.** Figures use fixed pixel heights at every breakpoint, never percentages.
A percentage-height figure silently collapses to zero in a relaxed-height capture.

## Elevation & Depth

The system is **flat at rest and has no shadow vocabulary for surfaces**. Depth is built three other
ways: tonal layering (a lighter card on a darker sand ground), light pooling (a large soft radial
wash placed where the eye should land rather than in a corner), and physical overlap (the surgeon's
shoulder crossing in front of the cephalometric tracing so the man and the plan share one space
instead of sitting in adjacent boxes).

The two shadows that do exist are attached to objects, not surfaces: a diffuse ambient glow under
glass chips, and a long soft drop under a cut-out figure so it stands on the ground rather than
floating over it.

### Shadow Vocabulary

- **Chip ambient** (`box-shadow: 0 8px 30px rgba(20,18,15,0.10)`): Under translucent glass chips
  only.
- **Figure ground** (`filter: drop-shadow(0 35px 45px rgba(20,18,15,0.35))`): Under a cut-out
  photographic figure.

### Masking

Cut-out photography is dissolved into the ground with a `mask-image` gradient rather than a border,
a fade overlay, or a scrim rectangle. The stops in those gradients (`#000`, `rgba(0,0,0,0.55)`,
`transparent`) are **alpha data, not palette colors** — in a mask, black means opaque and transparent
means hidden, and neither value is ever painted. Do not substitute palette tokens there; it would
change the mask's meaning, not its color.

### Named Rules

**The Flat Surface Rule.** Cards, rows, registers, and bands never take a shadow. If a surface needs
separating, it takes a hairline or a tonal shift, not elevation.

## Shapes

Two radii and nothing between them: **fully round** for anything interactive (every button, chip,
badge, and social control is a pill or a circle) and **generously rounded** for surfaces (`1.75rem`
cards, `1.5rem` tiles). The contrast between pill controls and soft-cornered sheets is the form
language; a mid-radius rectangle belongs to neither and is not used.

Separation is drawn, not boxed. Rules are hairlines at 10–16% ink, or white at 30% when they are
structural rather than semantic. Registers are ruled tables with a top rule and a rule under every
row, and the final rule is left hanging rather than closed — a cut edge reads as continuation.

The one non-geometric form in the system is the cephalometric tracing: single-weight open curves,
the mandible at the heaviest stroke because the bone is the subject, everything else stepped down in
alpha behind it.

## Components

### Buttons

- **Shape:** Full pill (`9999px`) at every size.
- **Primary:** Solid Surgical Ink with white text, ~16px vertical padding, a leading glyph in Warm
  Gold and a trailing arrow. The only saturated dark mass on a hero, which is what makes it findable
  without a color.
- **Hover / Focus:** `scale(1.02)` over 200ms on the primary; the trailing arrow slides 4px right.
  No color change — the mass is already maximal.
- **Ghost / Secondary:** 60% white on a 15% ink hairline with backdrop blur, inverting to solid ink
  with white text on hover. Used for the telephone action, which is a first-class path, not a text
  link.
- **Sizing:** Full width below 480px, auto width above. Rendered height ≈52px, comfortably over the
  44px touch minimum.

### Chips

- **Style:** `rgba(255,255,255,0.55)` with a 75% white hairline, 14px backdrop blur, and the chip
  ambient shadow. Text at 11px in near-ink.
- **State:** Static labels only. Chips in this system are not filters and never carry selection.

### Cards / Containers

- **Corner Style:** `1.75rem`, rising to `2.25rem` from 1280px.
- **Background:** White for content sections; the 165° paper gradient for the hero.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** None. Cards separate from the ground tonally.
- **Internal Padding:** 24px at mobile, 40px from 640px, 56px from 1280px.

### Navigation

- **Style:** Plain 13px medium links in Ink Secondary, 32px apart, darkening to full ink on hover.
  No underline, no pill, no active-state fill.
- **In-hero header:** Logo lockup left, links centred, language control and WhatsApp pill right.
  Links appear from 1024px only — below that there is not room for the lockup and five links, and
  crowding them is worse than hiding them.
- **Floating nav:** After 180px of scroll the header condenses into a centred glass pill carrying
  the logo badge, the links, and the WhatsApp action.

### Scope Register (signature component)

A ruled, numbered table of the practice's surgical scope. Each row is a 52px minimum-height band
with a two-digit tabular index, a procedure name in Inter Tight, and a lower-case descriptor. At
1280px and above the descriptor is pushed to the right edge on the same baseline; below that it
stacks under the name. Rows respond to hover with color only — the index turns gold and the name
turns full ink — never with translation, underline, or background.

### Cephalometric Tracing (signature component)

A lateral planning diagram drawn entirely in SVG on a 520×680 viewBox: soft-tissue profile facing
left, the mandible as a separate closed path at the heaviest stroke, maxilla, four dashed gold
reference planes, eleven gold landmark dots, TMJ rings, and a gonial-angle arc. It draws itself once
on entrance and is then completely still. It carries a visible caption identifying it as a schematic
rather than a patient image, and that caption is not optional.

## Do's and Don'ts

### Do:

- **Do** keep gold to the six enumerated positions, and treat a seventh as a defect to be removed.
- **Do** express hierarchy through ink alpha (`0.72` / `0.44` / `0.30` / `0.10`) before reaching for
  a second color.
- **Do** set every comparable numeral in `tabular-nums`.
- **Do** give figures fixed pixel heights at every breakpoint.
- **Do** separate content with hairlines and air rather than boxes and shadows.
- **Do** make `prefers-reduced-motion` and `?snap=1` render the complete interface — the reduced
  render must be pixel-identical to the settled animated one.
- **Do** caption any anatomical illustration as a schematic, never as a patient image or a predicted
  result.

### Don't:

- **Don't** add an infinite animation of any kind — no float, bob, pulse, marquee, carousel, or
  breathing halo — to a surface that carries clinical authority.
- **Don't** use `#7a7367` or `#9a9184` for informational text; both fail AA on this ground.
- **Don't** outline more than one word per page.
- **Don't** put Cinzel anywhere outside the logo lockup.
- **Don't** give a surface a shadow. Depth comes from tone, light, and overlap.
- **Don't** introduce a mid-radius rectangle; controls are pills and surfaces are soft cards.
- **Don't** let any list scroll horizontally on a phone.
- **Don't** display a statistic, credential, rating, or testimonial that is not substantiated —
  the absence is recorded in PRODUCT.md deliberately.
