import implant from '@/assets/implant.png'
import faceLineSkull from '@/assets/hero/face-line-skull.webp'
import jawPlate from '@/assets/hero/jaw-plate.webp'
import jawGhost from '@/assets/hero/jaw-ghost.webp'
import jawAnnotated from '@/assets/hero/jaw-annotated.webp'
import jawSolid from '@/assets/hero/jaw-solid.webp'
import jawArch from '@/assets/hero/jaw-arch.webp'

export type HeroArtKey =
  | 'faceline'
  | 'plate'
  | 'ghost'
  | 'annotated'
  | 'solid'
  | 'arch'
  | 'implant'

export type HeroChip = {
  title: string
  /** Placement relative to the artwork's own box. */
  pos: string
  delay: number
}

/**
 * The headline moves with the artwork. A jaw carrying a reconstruction plate
 * asks for surgical language; the original crown does not.
 */
export type HeroCopy = {
  badge: string
  titleTop: string
  /** Rendered as outlined type, the way the live hero treats "Dental". */
  titleOutline: string
  titleTail: string
  lead: string
  asideTop: string
  asideOutline: string
}

export type HeroArt = {
  key: HeroArtKey
  name: string
  /** One line on why this direction exists, shown in the demo picker. */
  note: string
  src: string
  alt: string
  /** Desktop placement of the artwork inside the hero card. */
  wrap: string
  /** Responsive sizing of the artwork itself. */
  img: string
  /** Tuned to how heavy each object reads against the cream gradient. */
  shadow: string
  /** The thin elliptical orbit line only suits objects standing upright. */
  orbit: boolean
  chips: HeroChip[]
  copy: HeroCopy
}

/**
 * Every jaw render shares one 3:2 canvas, so they can share one placement.
 * Chips are then positioned as percentages of that canvas — anchoring them to
 * its outer edges instead would push them into the headline and the stats.
 */
const jawWrap =
  'xl:absolute xl:bottom-[9%] xl:left-1/2 xl:w-[50vw] xl:max-w-[860px] xl:-translate-x-1/2'
const jawImg = 'w-[min(94vw,540px)] md:w-[620px] xl:w-full object-contain'

export const heroArtList: HeroArt[] = [
  {
    key: 'faceline',
    name: 'Face Line',
    note: 'The continuous line of the logo, with the skull and the implanted jaw read through it.',
    src: faceLineSkull,
    alt: 'Continuous line drawing of a face in profile with the skull and a gold-implanted lower jaw shown inside it',
    // The drawing bleeds to its own frame edges, so it is sized to sit fully
    // inside the card. Displayed well below the asset's 1600px native width,
    // which keeps the stroke crisp instead of upscaled and soft.
    wrap: 'xl:absolute xl:bottom-[5%] xl:left-1/2 xl:h-[74%] xl:-translate-x-1/2',
    img: 'h-[300px] sm:h-[380px] md:h-[440px] xl:h-full w-auto object-contain',
    shadow: '',
    orbit: false,
    chips: [],
    copy: {
      badge: 'Oral & Maxillofacial',
      titleTop: 'Restoring',
      titleOutline: 'Facial',
      titleTail: 'Harmony',
      lead: 'Jaw position, profile and bite are planned together, because a face is read as one thing — never as parts.',
      asideTop: '& Natural',
      asideOutline: 'Proportion',
    },
  },
  {
    key: 'plate',
    name: 'Reconstruction Plate',
    note: 'The surgery the clinic actually performs, shot like a luxury object.',
    src: jawPlate,
    alt: 'Translucent lower jaw model fitted with a gold maxillofacial reconstruction plate',
    wrap: jawWrap,
    img: jawImg,
    shadow: 'drop-shadow-[0_30px_45px_rgba(20,18,15,0.22)]',
    orbit: false,
    chips: [
      { title: 'Titanium Reconstruction Plate', pos: 'left-[22%] top-[6%]', delay: 1.2 },
      { title: 'Facial Trauma Repair', pos: 'right-[2%] top-[76%]', delay: 1.5 },
    ],
    copy: {
      badge: 'Maxillofacial Surgery',
      titleTop: 'Reconstructive',
      titleOutline: 'Jaw',
      titleTail: 'Surgery',
      lead: 'Titanium reconstruction planned in 3D and fitted to the millimetre, so form and function come back together.',
      asideTop: '& Restored',
      asideOutline: 'Function',
    },
  },
  {
    key: 'ghost',
    name: 'CT Planning',
    note: 'Real bone dissolving into the scan it was planned from.',
    src: jawGhost,
    alt: 'Lower jaw render transitioning from bone into a gold CT-scan wireframe around a dental implant',
    wrap: jawWrap,
    img: jawImg,
    shadow: 'drop-shadow-[0_30px_45px_rgba(20,18,15,0.20)]',
    orbit: false,
    chips: [
      { title: 'CT Bone Mapping', pos: 'left-[26%] top-[4%]', delay: 1.2 },
      { title: 'Nerve-Safe Placement', pos: 'right-[3%] top-[84%]', delay: 1.5 },
    ],
    copy: {
      badge: 'Digitally Planned',
      titleTop: 'Precision',
      titleOutline: 'Implant',
      titleTail: 'Planning',
      lead: 'Every implant is placed from a CT-guided plan. We know your bone before we ever touch it.',
      asideTop: '& Predictable',
      asideOutline: 'Results',
    },
  },
  {
    key: 'annotated',
    name: 'Measured',
    note: 'Gold leader lines end in bare dots, so the labels stay real text — crisp and translatable.',
    src: jawAnnotated,
    alt: 'Annotated lower jaw render showing bone height and width at a planned implant site',
    wrap: jawWrap,
    img: jawImg,
    shadow: 'drop-shadow-[0_26px_40px_rgba(20,18,15,0.16)]',
    orbit: false,
    chips: [
      { title: 'Crown Position', pos: 'left-[58%] top-[30%]', delay: 1.2 },
      { title: 'Bone Height & Width', pos: 'right-[73%] top-[86%]', delay: 1.45 },
      { title: 'Implant Zone', pos: 'left-[65%] top-[86%]', delay: 1.7 },
    ],
    copy: {
      badge: 'Assessed First',
      titleTop: 'Measured',
      titleOutline: 'Before',
      titleTail: 'Placed',
      lead: 'Bone height, bone width and nerve position are assessed before an implant is ever planned.',
      asideTop: '& Safer',
      asideOutline: 'Surgery',
    },
  },
  {
    key: 'solid',
    name: 'Anatomy',
    note: 'The safest read: ivory bone, one gold implant, no interpretation needed.',
    src: jawSolid,
    alt: 'Lower jawbone model with a gold dental implant supporting a ceramic crown',
    wrap: jawWrap,
    img: jawImg,
    shadow: 'drop-shadow-[0_32px_45px_rgba(20,18,15,0.26)]',
    orbit: false,
    chips: [
      { title: 'Dental Implants', pos: 'left-[21%] top-[6%]', delay: 1.2 },
      { title: 'Bone Grafting', pos: 'right-[2%] top-[26%]', delay: 1.5 },
    ],
    copy: {
      badge: 'Trusted Dental Care',
      titleTop: 'Exceptional',
      titleOutline: 'Implant',
      titleTail: 'Care',
      lead: 'We combine surgical precision and gentle care to make sure every visit leaves you smiling with confidence.',
      asideTop: '& Straight',
      asideOutline: 'Smile',
    },
  },
  {
    key: 'arch',
    name: 'Full Arch',
    note: 'Lightest, most jewellery-like read — closest in feel to the current hero.',
    src: jawArch,
    alt: 'Floating lower dental arch with two gold implant fixtures',
    wrap: jawWrap,
    img: jawImg,
    shadow: 'drop-shadow-[0_34px_48px_rgba(20,18,15,0.22)]',
    orbit: false,
    chips: [
      { title: 'Full-Arch Restoration', pos: 'left-[23%] top-[8%]', delay: 1.2 },
      { title: 'Immediate Loading', pos: 'right-[2%] top-[28%]', delay: 1.5 },
    ],
    copy: {
      badge: 'Fixed Teeth in a Day',
      titleTop: 'A Full',
      titleOutline: 'Arch',
      titleTail: 'Restored',
      lead: 'Fixed teeth on implants — planned, placed and loaded by one surgical team, under one roof.',
      asideTop: '& Lasting',
      asideOutline: 'Comfort',
    },
  },
  {
    key: 'implant',
    name: 'Current Hero',
    note: 'What is live today, kept here as the baseline to judge the rest against.',
    src: implant,
    alt: 'Ceramic dental implant',
    wrap: 'xl:absolute xl:bottom-0 xl:left-1/2 xl:h-[56%] xl:-translate-x-1/2',
    img: 'h-[300px] sm:h-[380px] md:h-[440px] xl:h-full object-contain',
    shadow: 'drop-shadow-[0_35px_45px_rgba(20,18,15,0.35)]',
    orbit: true,
    chips: [
      { title: 'Root Canal Treatment', pos: 'right-full top-[44%] mr-3 xl:mr-5', delay: 1.2 },
      { title: 'Dental Check-Up', pos: 'left-full top-[32%] ml-3 xl:ml-5', delay: 1.5 },
    ],
    copy: {
      badge: 'Trusted Dental Care',
      titleTop: 'Exceptional',
      titleOutline: 'Dental',
      titleTail: 'Care',
      lead: 'We combine gentle care and clinical precision to make sure every visit leaves you smiling with confidence.',
      asideTop: '& Straight',
      asideOutline: 'Smile',
    },
  },
]

export const defaultHeroArtKey: HeroArtKey = 'plate'

export function getHeroArt(key: string | null | undefined): HeroArt {
  return (
    heroArtList.find((art) => art.key === key) ??
    heroArtList.find((art) => art.key === defaultHeroArtKey)!
  )
}
