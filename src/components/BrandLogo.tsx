import { site } from '@/lib/site'
import logoFull from '@/assets/logo-full.png'
import logoMark from '@/assets/logo-mark.png'

/**
 * YN Dental Clinic logo artwork.
 *
 * - `full` the complete lockup: tooth crown with the YN monogram, the horizon
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
  alt = site.name,
}: {
  variant?: 'mark' | 'full'
  className?: string
  alt?: string
}) {
  const art = ART[variant]

  return (
    <img
      src={art.src}
      width={art.width}
      height={art.height}
      alt={alt}
      decoding="async"
      loading={variant === 'full' ? 'lazy' : 'eager'}
      className={className}
    />
  )
}

/** Badge + wordmark lockup used in the header. */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <a href="#top" className={`flex items-center gap-3 ${className ?? ''}`} aria-label={site.name}>
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#14120F]">
        <BrandLogo alt="" className="h-10 w-10" />
      </span>
      <span className="leading-none">
        <span className="font-display block text-xl font-semibold tracking-[0.12em] text-[#14120F]">
          {site.short}
        </span>
        <span className="font-engraved mt-1 block text-[8px] uppercase tracking-[0.3em] text-[#8a8172]">
          Dental Clinic
        </span>
      </span>
    </a>
  )
}
