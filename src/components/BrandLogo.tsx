import { useI18n } from '@/lib/i18n'
import logoFull from '@/assets/logo-full.png'
import logoMark from '@/assets/logo-mark.png'

/**
 * Ozea Dental Clinic logo artwork.
 *
 * - `full` the complete lockup: tooth crown with the monogram, the horizon
 *   rule, the engraved DENTAL CLINIC line and the implant threads.
 * - `mark` the crown, monogram and rule only — for small placements such as
 *   the header badge.
 *
 * Both files are gold on transparency, so they need a dark surface behind them.
 * Master artwork and a dark-background share image live in `public/brand/`.
 */
const ART = {
  full: { src: logoFull, width: 1390, height: 1200 },
  mark: { src: logoMark, width: 512, height: 512 },
} as const

export function BrandLogo({
  variant = 'mark',
  className,
  alt,
}: {
  variant?: 'mark' | 'full'
  className?: string
  alt?: string
}) {
  const { c } = useI18n()
  const art = ART[variant]

  return (
    <img
      src={art.src}
      width={art.width}
      height={art.height}
      alt={alt ?? c.site.name}
      decoding="async"
      loading={variant === 'full' ? 'lazy' : 'eager'}
      className={className}
    />
  )
}

/** Badge + wordmark lockup used in the header. */
export function BrandLockup({ className }: { className?: string }) {
  const { c } = useI18n()

  return (
    <a href="#top" className={`flex items-center gap-3 ${className ?? ''}`} aria-label={c.site.name}>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14120F]">
        <BrandLogo alt="" className="h-10 w-10" />
      </span>
      <span className="leading-none">
        {/* The wordmark stays Latin in both languages and keeps its drawn
            tracking. It is set inline rather than as a utility because the
            Arabic stylesheet zeroes letter-spacing across the document — that
            is right for Arabic type and wrong for a logotype. */}
        <span
          lang="en"
          dir="ltr"
          style={{ letterSpacing: '0.12em' }}
          className="font-display block text-xl font-semibold text-[#14120F]"
        >
          {c.site.short}
        </span>
        <span className="font-engraved mt-1 block text-[8px] uppercase tracking-[0.3em] text-[#8a8172]">
          {c.site.dentalClinic}
        </span>
      </span>
    </a>
  )
}
