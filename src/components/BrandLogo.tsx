import { useI18n } from '@/lib/i18n'
import logoMark from '@/assets/logo-mark.svg'

/**
 * Ozea Dental Clinic logo artwork.
 *
 * The mark is a gold medallion on the brand's ink: the hero's own profile drawn
 * in monoline — closed eye, brow, nose, lips, jaw, ear and neck — with the
 * skull read through the cheek, the tooth rows meeting on the bite plane and
 * the gold implant seated in a lower molar. The logo and the hero are the same
 * face drawn twice, once in wash and once in line.
 *
 * The disc carries its own ink ground, so it needs no plate behind it and holds
 * its contrast on the sand header and the dark footer alike. It ships as SVG:
 * one file covers the 36px floating-nav badge and the 200px footer lockup at
 * every pixel ratio, and it is the same set of curves the print files are cut
 * from.
 *
 * - `mark` the medallion on its own — header badge, floating nav, favicon.
 * - `full` the stacked lockup: medallion, engraved rule, OZEA, DENTAL CLINIC.
 *   The type is live rather than baked into the image, so it stays crisp at any
 *   size, is readable to a screen reader, and localises with the rest of the
 *   page. The drawn lockup in `public/brand/` is for print and share cards,
 *   where live type is not an option.
 *
 * Every shipped file is cut from one master by `scripts/build-logo.mjs`.
 */
/** The engraved face, held inline so no locale stylesheet can reassign it. */
const WORDMARK_FACE = "'Cinzel', Georgia, 'Times New Roman', serif"

const MARK = { src: logoMark, width: 512, height: 512 } as const

export function BrandLogo({
  variant = 'mark',
  className,
  alt,
  tone = 'light',
}: {
  variant?: 'mark' | 'full'
  className?: string
  alt?: string
  /** Which surface the lockup sits on — decides the type colour. */
  tone?: 'light' | 'dark'
}) {
  const { c } = useI18n()

  const disc = (
    <img
      src={MARK.src}
      width={MARK.width}
      height={MARK.height}
      alt={variant === 'full' ? '' : (alt ?? c.site.name)}
      decoding="async"
      loading={variant === 'full' ? 'lazy' : 'eager'}
      className={variant === 'full' ? 'block h-auto w-full' : className}
    />
  )

  if (variant === 'mark') return disc

  return (
    <span className={`flex flex-col items-center ${className ?? ''}`}>
      <span className="block w-[76%]">{disc}</span>
      <BrandWordmark tone={tone} className="mt-4 w-full" />
    </span>
  )
}

/**
 * The engraved rule and the two lines of type, without the disc.
 *
 * The rule is drawn rather than bordered so the two lozenges sit exactly on its
 * ends at any width; a border plus absolutely positioned diamonds drifts by a
 * subpixel and reads as a printing fault at logo scale.
 */
export function BrandWordmark({
  tone = 'light',
  className,
}: {
  tone?: 'light' | 'dark'
  className?: string
}) {
  const { c } = useI18n()
  const ink = tone === 'dark' ? '#EFE7D8' : '#14120F'
  // 0.55 alpha put the engraved line at 4.4:1 on the dark badge — a rounding
  // error short of AA at this size. 0.62 clears it at 5.2:1 and looks the same.
  const quiet = tone === 'dark' ? 'rgba(239,231,216,0.62)' : '#8a8172'

  return (
    <span className={`block text-center ${className ?? ''}`}>
      <svg
        viewBox="0 0 200 6"
        aria-hidden
        className="block h-[6px] w-full"
        preserveAspectRatio="none"
      >
        <path d="M6 3H194" stroke="#C9AC7C" strokeWidth="0.7" />
        <path d="M3 3 5.4 0.6 7.8 3 5.4 5.4Z M192.2 3 194.6 0.6 197 3 194.6 5.4Z" fill="#C9AC7C" />
      </svg>
      <span
        lang="en"
        dir="ltr"
        // The face and the tracking are set inline, not by utility, because the
        // Arabic stylesheet reassigns both across the document: it zeroes
        // letter-spacing and swaps `.font-engraved` and anything marked
        // `lang="en"` to another family. That is right for running text and
        // wrong for a logotype, which is the same four letters in both
        // languages and has to be drawn the same way in both.
        style={{ fontFamily: WORDMARK_FACE, letterSpacing: '0.34em', color: ink }}
        className="mt-3 block indent-[0.34em] text-[1.55em] leading-none"
      >
        {c.site.short.toUpperCase()}
      </span>
      <span
        style={{ letterSpacing: '0.42em', color: quiet }}
        className="font-engraved mt-2 block indent-[0.42em] text-[0.48em] uppercase leading-none"
      >
        {c.site.dentalClinic}
      </span>
    </span>
  )
}

/** Badge + wordmark lockup used in the header. */
export function BrandLockup({ className }: { className?: string }) {
  const { c } = useI18n()

  return (
    // No `aria-label`: the name is spelled out inside the link ("Ozea" +
    // "Dental Clinic"), and an aria-label that words it differently would
    // override visible text a speech-control user reads out loud.
    <a href="#top" className={`flex items-center gap-3 ${className ?? ''}`}>
      <BrandLogo alt="" className="h-12 w-12 shrink-0" />
      <span className="leading-none">
        <span
          lang="en"
          dir="ltr"
          // Inline for the same reason as in `BrandWordmark`: the Arabic
          // stylesheet would otherwise reset the logotype's face and tracking.
          style={{ fontFamily: WORDMARK_FACE, letterSpacing: '0.22em' }}
          className="block indent-[0.22em] text-lg text-[#14120F]"
        >
          {c.site.short.toUpperCase()}
        </span>
        <span className="font-engraved mt-1.5 block indent-[0.3em] text-[8px] uppercase tracking-[0.3em] text-[#8a8172]">
          {c.site.dentalClinic}
        </span>
      </span>
    </a>
  )
}
