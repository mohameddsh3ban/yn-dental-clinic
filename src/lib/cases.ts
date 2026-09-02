// The clinical case photographs and the before/after pair.
//
// Same split as `hospitals.ts` and `team.ts`: this module holds only what does
// not change with language — which file, at which sizes, in which filter group.
// Every word comes from `lib/copy`, keyed by the same slug.
//
// The images themselves are cut from the masters in `brand/cases/` by
// `npm run build:case-art`, which also writes `assets/cases/manifest.ts` with
// each derivative's pixel size and an inline blurred preview.
//
// COPY REVIEW: every caption names the procedure the photograph shows and
// nothing more — no patient, no date, no claim about the outcome. Have the
// clinic confirm each caption and the patients' consent before launch.

import { useI18n } from '@/lib/i18n'
import type { Copy } from '@/lib/copy'
import { CASE_ART } from '@/assets/cases/manifest'

export type CaseSlug = keyof Copy['cases']['items']

/** Which filter chip a photograph answers to. */
export type CaseGroup = 'implants' | 'restorative' | 'lab'

/** One shipped photograph: two widths, the intrinsic size, and its preview. */
export type CaseImage = {
  /** The larger derivative — the master's own width. */
  src: string
  /** `640w` and the master width, for `srcset`. */
  srcSet: string
  width: number
  height: number
  /** ~24px WebP as a data URI, painted behind the photograph while it loads. */
  blur: string
}

type CaseMeta = {
  slug: CaseSlug
  group: CaseGroup
  /**
   * How much of the grid a tile takes. `tall` is a portrait frame over two
   * rows; `wide` runs the full width of the three-column grid. Unset is one
   * landscape cell.
   */
  span?: 'tall' | 'wide'
}

/** Structure plus the translated copy for the active language. */
export type Case = CaseMeta & Copy['cases']['items'][CaseSlug] & { image: CaseImage }

/**
 * Every WebP under `assets/cases`, keyed by file name. Vite resolves the glob
 * at build time, so adding a photograph is a matter of re-running the prep
 * script and adding its slug below — no import line per file.
 */
const FILES = import.meta.glob<string>('@/assets/cases/*.webp', {
  eager: true,
  import: 'default',
})

function file(name: string): string {
  const hit = Object.entries(FILES).find(([path]) => path.endsWith(`/${name}.webp`))
  if (!hit) throw new Error(`cases: missing artwork ${name}.webp — run npm run build:case-art`)
  return hit[1]
}

type ArtName = keyof typeof CASE_ART

export function caseImage(name: ArtName): CaseImage {
  const art = CASE_ART[name]
  const lg = file(`${name}-lg`)
  const sm = file(`${name}-sm`)
  return {
    src: lg,
    srcSet: `${sm} ${art.sm.width}w, ${lg} ${art.lg.width}w`,
    width: art.width,
    height: art.height,
    blur: art.blur,
  }
}

/**
 * The gallery, in reading order.
 *
 * The order and the spans are chosen together so the three-column grid closes
 * with no empty cell: the two portraits stand at either edge of the first two
 * rows with a landscape between them, three landscapes fill the third row, and
 * the detail shot runs the full width of the last. Five single cells, two
 * double, one triple — twelve cells, four rows, nothing missing.
 */
const CASES: readonly CaseMeta[] = [
  { slug: 'smile-portrait', group: 'restorative', span: 'tall' },
  { slug: 'full-arch-both', group: 'implants' },
  { slug: 'lab-master-cast', group: 'lab', span: 'tall' },
  { slug: 'upper-arch-fixed', group: 'implants' },
  { slug: 'anterior-crowns-retractor', group: 'restorative' },
  { slug: 'full-mouth-smile', group: 'implants' },
  { slug: 'anterior-crowns-smile', group: 'restorative' },
  { slug: 'upper-arch-closeup', group: 'implants', span: 'wide' },
]

/** The featured before/after: the one composite, split at its seam. */
export const COMPARE = {
  before: 'veneers-before',
  after: 'veneers-after',
} as const satisfies Record<'before' | 'after', ArtName>

/** The gallery in the visitor's language. */
export function useCases(): readonly Case[] {
  const { c } = useI18n()
  return CASES.map((meta) => ({
    ...meta,
    ...c.cases.items[meta.slug],
    image: caseImage(meta.slug),
  }))
}

/** The chips, in the order they are offered. `all` first. */
export const CASE_GROUPS: readonly (CaseGroup | 'all')[] = ['all', 'implants', 'restorative', 'lab']
