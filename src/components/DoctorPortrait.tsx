import { useState } from 'react'

/**
 * Portrait with a source chain and a monogram fallback.
 *
 * Team photography arrives at different times to the code, so a missing or
 * broken file must not leave a hole in the layout. `src` may be a single URL or
 * a list tried in order — optimised WebP first, then the raw drop-in file — and
 * once every candidate has failed it degrades to an engraved monogram.
 */
export function DoctorPortrait({
  src,
  alt,
  initials,
  className,
  monogramClassName,
  loading = 'lazy',
  style,
}: {
  /** One URL, or candidates tried in order until one loads. */
  src?: string | readonly string[]
  alt: string
  initials: string
  /** Applied to the <img>. */
  className?: string
  /** Applied to the monogram fallback, which fills its parent. */
  monogramClassName?: string
  loading?: 'lazy' | 'eager'
  style?: React.CSSProperties
}) {
  const candidates = src === undefined ? [] : typeof src === 'string' ? [src] : src
  const [attempt, setAttempt] = useState(0)
  const current = candidates[attempt]

  if (current === undefined) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-[linear-gradient(150deg,#EFEBE4_0%,#DED6C8_58%,#CFC8BC_100%)] ${
          monogramClassName ?? className ?? ''
        }`}
      >
        <span className="font-engraved text-[clamp(1.25rem,3.2vw,2.75rem)] uppercase tracking-[0.18em] text-[#14120F]/45">
          {initials}
        </span>
      </span>
    )
  }

  return (
    <img
      // Remounts on failure so the browser actually re-requests the next source.
      key={current}
      src={current}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setAttempt((i) => i + 1)}
      className={className}
      style={style}
    />
  )
}
