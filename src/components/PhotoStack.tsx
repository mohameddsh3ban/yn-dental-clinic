import { useEffect, useState, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * A short deck of photographs that deals itself.
 *
 * Two cards sit on the same square of layout, one in front and one peeking out
 * behind it. Every few seconds the front card lifts, swings aside and drops to
 * the back while the card behind comes forward — the pair keep leapfrogging for
 * as long as the section is on screen.
 *
 * The swap is one animation per card, not a crossfade: each card animates to
 * the pose its new depth calls for, and the z-order flips at 42% of the way
 * through, by which point the outgoing card has swung far enough clear that the
 * change of stacking reads as it passing behind rather than as a pop.
 *
 * Cards hold still for anyone who asked for less motion (and for `?snap=1`
 * screenshots); the dots below are then the only way through the deck, which is
 * why they are real buttons rather than indicators.
 *
 * Every offset below is a percentage of the card rather than a pixel count, and
 * the component reserves the room the fan needs as its own padding. Both follow
 * from the same requirement: a card that swings out further than its column is
 * wide gives the whole page a horizontal scrollbar on a phone.
 */

const ease = [0.22, 1, 0.36, 1] as const

/** `x`/`y` as a share of the card, so the fan scales with the column. */
const pc = (n: number) => `${n}%`

/** Seconds one swap takes. */
const SWAP = 0.95
/** Milliseconds a card holds the front before the next swap. */
const HOLD = 3800

export type StackPhoto = {
  src: string
  alt: string
}

/**
 * Pose per depth. `null` as the first keyframe means "wherever this card is
 * now", so one variant covers a card arriving from either direction. `mirror`
 * is -1 in Arabic: the deck fans towards the reading edge, not away from it.
 */
const pose = {
  front: (mirror: number) => ({
    x: [null, pc(mirror * 2), '0%'],
    y: [null, '3%', '0%'],
    rotate: [null, mirror * -3.2, mirror * -1.6],
    scale: [null, 0.97, 1],
    zIndex: 2,
  }),
  back: (mirror: number) => ({
    x: [null, pc(mirror * 8), pc(mirror * 7)],
    y: [null, '-4%', '6%'],
    rotate: [null, mirror * 7, mirror * 5.2],
    scale: [null, 1.03, 0.94],
    zIndex: 1,
  }),
}

/** Where a card rests once the swap is over — used when motion is off. */
const rest = {
  front: (mirror: number) => ({
    x: '0%',
    y: '0%',
    rotate: mirror * -1.6,
    scale: 1,
    zIndex: 2,
  }),
  back: (mirror: number) => ({
    x: pc(mirror * 7),
    y: '6%',
    rotate: mirror * 5.2,
    scale: 0.94,
    zIndex: 1,
  }),
}

export function PhotoStack({
  photos,
  className,
  dotAria,
  corner,
}: {
  photos: readonly StackPhoto[]
  className?: string
  /** `'Show photo {n}'` — the label on each dot. */
  dotAria: string
  /** Pinned to the front card's bottom corner, and never rotated with it. */
  corner?: ReactNode
}) {
  const { rtl, t } = useI18n()
  const reduced = useReducedMotion()
  const still = snap || !!reduced

  const [front, setFront] = useState(0)
  const [paused, setPaused] = useState(false)
  const mirror = rtl ? -1 : 1

  useEffect(() => {
    if (still || paused || photos.length < 2) return
    const id = setInterval(() => setFront((f) => (f + 1) % photos.length), HOLD)
    return () => clearInterval(id)
  }, [still, paused, photos.length])

  return (
    // The padding is the room the fan swings through: nothing a card does
    // during a swap reaches outside this box.
    <div className={cn('select-none ps-[7%] pe-[18%] pt-[11%] pb-[2%]', className)}>
      <div
        className="relative aspect-[4/5] w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {photos.map((photo, i) => {
          const depth = (i - front + photos.length) % photos.length
          const isFront = depth === 0
          const target = still
            ? rest[isFront ? 'front' : 'back'](mirror)
            : pose[isFront ? 'front' : 'back'](mirror)

          return (
            <motion.div
              key={photo.src}
              // No entrance animation: a card's first pose is its resting one,
              // so `initial={false}` lands it there instead of dealing it in.
              initial={false}
              animate={target}
              transition={{
                duration: still ? 0 : SWAP,
                ease,
                // Flip the stacking mid-flight rather than at either end.
                zIndex: { duration: 0, delay: still ? 0 : SWAP * 0.42 },
              }}
              style={{ transformOrigin: '50% 82%' }}
              className="absolute inset-0 overflow-hidden rounded-[1.5rem] bg-[#14120F] shadow-[0_34px_70px_-34px_rgba(20,18,15,0.55)] ring-1 ring-inset ring-white/12"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              {/* The card behind sits back in the light as well as in space. */}
              <motion.div
                aria-hidden
                initial={false}
                animate={{ opacity: isFront ? 0 : 0.3 }}
                transition={{ duration: still ? 0 : SWAP, ease }}
                className="absolute inset-0 bg-[#14120F]"
              />
            </motion.div>
          )
        })}

        {corner ? <div className="absolute bottom-3 -start-4 z-10">{corner}</div> : null}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setFront(i)}
            aria-label={t(dotAria, { n: String(i + 1) })}
            aria-current={i === front}
            className="group py-2"
          >
            <span
              className={cn(
                'block h-[3px] rounded-full transition-all duration-500',
                i === front
                  ? 'w-9 bg-[#C0A578]'
                  : 'w-4 bg-[#14120F]/20 group-hover:bg-[#14120F]/40',
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
