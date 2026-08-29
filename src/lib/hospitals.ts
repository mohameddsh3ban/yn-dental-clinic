// The hospitals the practice admits surgical cases to.
//
// Same split as `team.ts`: this module holds only what does not change with
// language — the slug, the artwork, and whether that artwork is a keyed logo
// or a photograph of the building. Every word comes from `lib/copy`, keyed by
// the same slug, so an Arabic visitor reads the hospital's own Arabic name
// rather than a transliteration.
//
// COPY REVIEW: nothing here claims a branch, an address or a partnership the
// supplied artwork does not itself show. Have the clinic confirm the list.

import { useI18n } from '@/lib/i18n'
import type { Copy } from '@/lib/copy'
import shifa from '@/assets/hospitals/shifa.webp'
import globalMedicalCity from '@/assets/hospitals/global-medical-city.webp'
import laVida from '@/assets/hospitals/la-vida.webp'
import nasaaem from '@/assets/hospitals/nasaaem.webp'
import rofayda from '@/assets/hospitals/rofayda.webp'
import darElOyoun from '@/assets/hospitals/dar-el-oyoun.webp'

export type HospitalSlug = keyof Copy['hospitals']['items']

type HospitalMeta = {
  slug: HospitalSlug
  /** 4:3 card art from `npm run build:hospital-art`. */
  img: string
  /**
   * True when the art is a lockup keyed to alpha rather than a photograph.
   * A logo sits ON the card's ground with room around it; a building fills the
   * frame. Stretching either one the other way reads as a mistake.
   */
  logo?: boolean
}

/** Structure plus the translated copy for the active language. */
export type Hospital = HospitalMeta & Copy['hospitals']['items'][HospitalSlug]

const HOSPITALS: readonly HospitalMeta[] = [
  { slug: 'shifa', img: shifa, logo: true },
  { slug: 'global-medical-city', img: globalMedicalCity },
  { slug: 'la-vida', img: laVida },
  { slug: 'nasaaem', img: nasaaem },
  { slug: 'rofayda', img: rofayda },
  { slug: 'dar-el-oyoun', img: darElOyoun, logo: true },
]

/** The hospitals in the visitor's language. */
export function useHospitals(): readonly Hospital[] {
  const { c } = useI18n()
  return HOSPITALS.map((meta) => ({ ...meta, ...c.hospitals.items[meta.slug] }))
}
