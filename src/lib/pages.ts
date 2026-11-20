// The long-form pages: where each one lives, what illustrates it, who treats
// it and what it links to. Same split as `team.ts` — structure here, every
// word in `lib/copy/pages`, keyed by the same id.
//
// This list is also what the build pre-renders and what the sitemap, the
// structured data and `llms.txt` are generated from, so adding a page is:
//   1. add its id to `PAGE_IDS` (copy/pages/types.ts) — the build then fails
//      until both languages have copy for it;
//   2. add an entry below.

import { useI18n } from '@/lib/i18n'
import type { ContentCopy, PageId, PagesCopy } from '@/lib/copy/pages/types'
import type { DoctorSlug } from '@/lib/team'
import cosmeticArch from '@/assets/services/cosmetic-arch.webp'
import crownSeat from '@/assets/services/crown-seat.webp'
import jawArch from '@/assets/services/jaw-arch.webp'
import veneerShells from '@/assets/services/veneer-shells.webp'
import compositeLayers from '@/assets/services/composite-layers.webp'
import jawPlate from '@/assets/services/jaw-plate.webp'
import jawSolid from '@/assets/services/jaw-solid.webp'
import jawGhost from '@/assets/services/jaw-ghost.webp'
import jawAnnotated from '@/assets/services/jaw-annotated.webp'
import endoMolar from '@/assets/services/endo-molar.webp'
import tmjProsthesis from '@/assets/services/tmj-prosthesis.webp'
import implant from '@/assets/implant.webp'

export type PageGroup = 'surgery' | 'implants' | 'dental'

export type PageMeta = {
  id: PageId
  /** English path; the Arabic one is the same under `/ar`. */
  path: string
  /**
   * `procedure` pages describe one treatment and are marked up as a
   * MedicalProcedure; `pillar` is the specialty overview; `info` is not
   * clinical at all.
   */
  kind: 'procedure' | 'pillar' | 'info'
  /** Which band of the services hub lists it. `info` pages are in none. */
  group?: PageGroup
  art: string
  /** The clinicians named on the page, linked to their profiles. */
  doctors: readonly DoctorSlug[]
  related: readonly PageId[]
}

/**
 * Set once the treating doctors have read their pages, e.g.
 * `{ date: '2026-12-01' }`. The pages then show a "medically reviewed" line
 * and say so in their structured data. Left null, neither is claimed.
 */
export const MEDICAL_REVIEW: { date: string } | null = null

export const PAGES: readonly PageMeta[] = [
  {
    id: 'maxillofacial-surgery',
    path: '/maxillofacial-surgery',
    kind: 'pillar',
    art: jawAnnotated,
    doctors: ['youssef-nasser', 'adham-yehia-zakaria'],
    related: ['jaw-surgery', 'facial-trauma-surgery', 'tmj-treatment', 'jaw-cysts-and-tumours'],
  },
  {
    id: 'jaw-surgery',
    path: '/services/jaw-surgery',
    kind: 'procedure',
    group: 'surgery',
    art: jawSolid,
    doctors: ['youssef-nasser', 'adham-yehia-zakaria'],
    related: ['maxillofacial-surgery', 'tmj-treatment', 'facial-trauma-surgery'],
  },
  {
    id: 'facial-trauma-surgery',
    path: '/services/facial-trauma-surgery',
    kind: 'procedure',
    group: 'surgery',
    art: jawPlate,
    doctors: ['youssef-nasser', 'adham-yehia-zakaria'],
    related: ['maxillofacial-surgery', 'jaw-surgery', 'dental-implants'],
  },
  {
    id: 'tmj-treatment',
    path: '/services/tmj-treatment',
    kind: 'procedure',
    group: 'surgery',
    art: tmjProsthesis,
    doctors: ['adham-yehia-zakaria', 'youssef-nasser'],
    related: ['maxillofacial-surgery', 'jaw-surgery', 'wisdom-tooth-removal'],
  },
  {
    id: 'jaw-cysts-and-tumours',
    path: '/services/jaw-cysts-and-tumours',
    kind: 'procedure',
    group: 'surgery',
    art: jawGhost,
    doctors: ['youssef-nasser', 'adham-yehia-zakaria'],
    related: ['maxillofacial-surgery', 'wisdom-tooth-removal', 'bone-grafting-sinus-lift'],
  },
  {
    id: 'wisdom-tooth-removal',
    path: '/services/wisdom-tooth-removal',
    kind: 'procedure',
    group: 'surgery',
    art: jawAnnotated,
    doctors: ['youssef-nasser'],
    related: ['jaw-cysts-and-tumours', 'dental-implants', 'root-canal-treatment'],
  },
  {
    id: 'dental-implants',
    path: '/services/dental-implants',
    kind: 'procedure',
    group: 'implants',
    art: jawArch,
    doctors: ['youssef-nasser'],
    related: ['full-arch-implants', 'bone-grafting-sinus-lift', 'dental-crowns'],
  },
  {
    id: 'full-arch-implants',
    path: '/services/full-arch-implants',
    kind: 'procedure',
    group: 'implants',
    art: cosmeticArch,
    doctors: ['youssef-nasser'],
    related: ['dental-implants', 'bone-grafting-sinus-lift', 'international-patients'],
  },
  {
    id: 'bone-grafting-sinus-lift',
    path: '/services/bone-grafting-sinus-lift',
    kind: 'procedure',
    group: 'implants',
    art: implant,
    doctors: ['youssef-nasser'],
    related: ['dental-implants', 'full-arch-implants', 'jaw-cysts-and-tumours'],
  },
  {
    id: 'veneers',
    path: '/services/veneers',
    kind: 'procedure',
    group: 'dental',
    art: veneerShells,
    doctors: ['sara-sameh'],
    related: ['teeth-whitening', 'dental-crowns', 'full-arch-implants'],
  },
  {
    id: 'dental-crowns',
    path: '/services/dental-crowns',
    kind: 'procedure',
    group: 'dental',
    art: crownSeat,
    doctors: ['sara-sameh'],
    related: ['veneers', 'root-canal-treatment', 'dental-implants'],
  },
  {
    id: 'root-canal-treatment',
    path: '/services/root-canal-treatment',
    kind: 'procedure',
    group: 'dental',
    art: endoMolar,
    doctors: [],
    related: ['dental-crowns', 'dental-implants', 'wisdom-tooth-removal'],
  },
  {
    id: 'teeth-whitening',
    path: '/services/teeth-whitening',
    kind: 'procedure',
    group: 'dental',
    art: compositeLayers,
    doctors: ['sara-sameh'],
    related: ['veneers', 'dental-crowns', 'root-canal-treatment'],
  },
  {
    id: 'international-patients',
    path: '/international-patients',
    kind: 'info',
    art: jawSolid,
    doctors: ['youssef-nasser', 'adham-yehia-zakaria', 'sara-sameh'],
    related: ['maxillofacial-surgery', 'full-arch-implants', 'jaw-surgery'],
  },
]

export const SERVICES_PATH = '/services'
export const CONTACT_PATH = '/contact'

export const GROUPS: readonly PageGroup[] = ['surgery', 'implants', 'dental']

export function pageMeta(id: PageId): PageMeta {
  const meta = PAGES.find((p) => p.id === id)
  if (!meta) throw new Error(`Unknown page: ${id}`)
  return meta
}

export type ContentPage = PageMeta & ContentCopy

/** One page in the visitor's language. */
export function usePage(id: PageId): ContentPage {
  const { p } = useI18n()
  return { ...pageMeta(id), ...p.content[id] }
}

/** The page-level strings (labels, hubs, FAQ) in the visitor's language. */
export function usePagesCopy(): PagesCopy {
  return useI18n().p
}

/**
 * The homepage service cards, index for index with `copy.services.items`, each
 * pointing at the page that covers it.
 */
export const HOME_CARD_PAGES: readonly PageId[] = [
  'veneers',
  'dental-crowns',
  'veneers',
  'veneers',
  'dental-implants',
  'maxillofacial-surgery',
  'root-canal-treatment',
  'tmj-treatment',
]

/**
 * English names for the pre-filled WhatsApp message. The clinic reads Arabic
 * and English, so a French or Russian visitor's message names the treatment in
 * English (see `STAFF_LANG`).
 */
export const TOPIC_EN: Record<PageId, string> = {
  'maxillofacial-surgery': 'maxillofacial surgery',
  'jaw-surgery': 'corrective jaw surgery',
  'facial-trauma-surgery': 'facial trauma surgery',
  'tmj-treatment': 'TMJ treatment',
  'jaw-cysts-and-tumours': 'a jaw cyst or lesion',
  'wisdom-tooth-removal': 'wisdom tooth removal',
  'bone-grafting-sinus-lift': 'bone grafting / sinus lift',
  'dental-implants': 'dental implants',
  'full-arch-implants': 'full-arch implants',
  veneers: 'veneers',
  'dental-crowns': 'dental crowns',
  'root-canal-treatment': 'root canal treatment',
  'teeth-whitening': 'teeth whitening',
  'international-patients': 'travelling to Cairo for treatment',
}
