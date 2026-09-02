// The clinical team and the /team/:slug profiles.
//
// This module holds only what does not change with language: the slug, the
// monogram, which schematic illustrates the doctor, and where the portraits
// live. Every word — name, title, credentials, CV, scope of practice — comes
// from `lib/copy`, keyed by the same slug, so the Arabic profile is a real
// translation rather than an English page with an Arabic header.
//
// COPY REVIEW: every clinical credential in `lib/copy` is either supplied by
// the clinic or already published elsewhere on this site. Nothing invents
// dates, institutions, case numbers or publications. Have each doctor confirm
// their own block, in both languages, before launch.

import { useI18n } from '@/lib/i18n'
import type { Copy } from '@/lib/copy'

export type DoctorSlug = keyof Copy['team']

/** A titled list on the profile page — qualifications, academic post, interests. */
export type CvBlock = Copy['team'][DoctorSlug]['cv'][number]

/** Procedure name + one-line descriptor, same shape the hero scope list uses. */
export type FocusItem = Copy['team'][DoctorSlug]['focus'][number]

type DoctorMeta = {
  slug: DoctorSlug
  /** Monogram shown while a portrait is missing or fails to load. */
  initials: string
  /** Which schematic illustrates this doctor's work. */
  visual: 'ceph' | 'tmj' | 'veneer'
  portrait: {
    /** Square-ish crop for the team card. */
    card?: string | readonly string[]
    /** Tall portrait for the profile hero. A list is tried in order. */
    hero?: string | readonly string[]
    /** Cutouts sit straight on the gradient; framed photos get a rounded card. */
    cutout?: boolean
  }
}

/** Structure plus the translated copy for the active language. */
export type Doctor = DoctorMeta & Copy['team'][DoctorSlug]

const TEAM: readonly DoctorMeta[] = [
  {
    slug: 'youssef-nasser',
    initials: 'YN',
    visual: 'ceph',
    // Sources are tried in order, same as Adham below: the optimised pair that
    // scripts/prepare-team-portraits.mjs writes from brand/team/youssef-nasser.jpg,
    // then a raw drop-in in public/team/. No -1200 entry: the supplied original is
    // 1142px wide, so the script writes the native 1142x1428 crop instead of
    // upscaling, and listing a file that cannot exist would 404 on every profile
    // view. Add it back when a larger original arrives.
    portrait: {
      card: [
        '/team/youssef-nasser-620.webp',
        '/team/youssef-nasser.webp',
        '/team/youssef-nasser.jpg',
        '/team/youssef-nasser.jpeg',
        '/team/youssef-nasser.png',
      ],
      hero: [
        '/team/youssef-nasser.webp',
        '/team/youssef-nasser.jpg',
        '/team/youssef-nasser.jpeg',
        '/team/youssef-nasser.png',
      ],
    },
  },
  {
    slug: 'adham-yehia-zakaria',
    initials: 'AZ',
    visual: 'tmj',
    // Sources are tried in order: the optimised pair that
    // scripts/prepare-team-portraits.mjs writes, then the raw photo dropped
    // straight into public/team/ with no build step. If none resolve, the card
    // and the profile fall back to the engraved monogram.
    portrait: {
      card: [
        '/team/adham-yehia-zakaria-620.webp',
        '/team/adham-yehia-zakaria.webp',
        '/team/adham-yehia-zakaria.jpg',
        '/team/adham-yehia-zakaria.jpeg',
        '/team/adham-yehia-zakaria.png',
      ],
      hero: [
        '/team/adham-yehia-zakaria-1200.webp',
        '/team/adham-yehia-zakaria.webp',
        '/team/adham-yehia-zakaria.jpg',
        '/team/adham-yehia-zakaria.jpeg',
        '/team/adham-yehia-zakaria.png',
      ],
    },
  },
  {
    slug: 'sara-sameh',
    initials: 'SS',
    visual: 'veneer',
    // Same source chain as the surgeons above. The supplied original is
    // 385x513, so scripts/prepare-team-portraits.mjs writes only the native
    // 385x481 crop — no -620 or -1200 entry, because listing a file the script
    // cannot produce would 404 on every card and profile view. Add the sized
    // entries back when a larger original arrives.
    portrait: {
      card: [
        '/team/sara-sameh.webp',
        '/team/sara-sameh.jpg',
        '/team/sara-sameh.jpeg',
        '/team/sara-sameh.png',
      ],
      hero: [
        '/team/sara-sameh.webp',
        '/team/sara-sameh.jpg',
        '/team/sara-sameh.jpeg',
        '/team/sara-sameh.png',
      ],
    },
  },
]

/** The slugs, in display order — safe to read outside React. */
export const doctorSlugs: readonly DoctorSlug[] = TEAM.map((d) => d.slug)

function merge(meta: DoctorMeta, copy: Copy): Doctor {
  return { ...meta, ...copy.team[meta.slug] }
}

/** The team in the visitor's language. */
export function useDoctors(): readonly Doctor[] {
  const { c } = useI18n()
  return TEAM.map((meta) => merge(meta, c))
}

/** One doctor in the visitor's language, or undefined for an unknown slug. */
export function useDoctor(slug: string | undefined): Doctor | undefined {
  const { c } = useI18n()
  const meta = TEAM.find((d) => d.slug === slug)
  return meta && merge(meta, c)
}
