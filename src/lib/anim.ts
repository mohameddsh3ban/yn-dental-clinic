import { useReducedMotion } from 'framer-motion'

// Test/screenshot helpers: ?snap=1 renders final animation states instantly,
// ?flat=1 relaxes viewport-height sizing (used for full-page captures).
export const snap =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('snap')

export const flat =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('flat')

/**
 * The one easing curve the site moves on. Every entrance, hover and swap uses
 * it, which is most of why the page reads as one hand rather than a kit.
 */
export const ease = [0.22, 1, 0.36, 1] as const

/**
 * True when nothing should move on its own: the visitor asked for reduced
 * motion, or the page is being captured with `?snap=1`. Components read this
 * once and render their settled state — the reduced render must be pixel-
 * identical to the animated one after it lands.
 */
export function useStill(): boolean {
  const reduced = useReducedMotion()
  return snap || !!reduced
}

/** The viewport trigger every below-the-fold reveal shares. */
export const viewportOnce = { once: true, margin: '-60px' } as const

/**
 * The standard entrance: a short rise and a fade, staggered by `custom`.
 * `initial={snap ? false : 'hidden'}` on the element keeps captures settled.
 */
export const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

/**
 * A headline entrance: the type is wiped upward out of a clip rather than faded,
 * so it arrives the way a ruled line is drawn — present, then complete. The clip
 * overshoots the box on three sides so an outlined word's stroke and any
 * descender are never trimmed mid-flight.
 */
export const wipe = {
  hidden: { clipPath: 'inset(-12% -6% 100% -6%)', y: 14 },
  show: (i: number = 0) => ({
    clipPath: 'inset(-12% -6% -12% -6%)',
    y: 0,
    transition: { duration: 0.95, ease, delay: i * 0.1 },
  }),
}

/**
 * A hairline that draws itself from its start edge — the gold eyebrow rule and
 * the separators under a section header.
 */
export const rule = {
  hidden: { scaleX: 0 },
  show: (i: number = 0) => ({
    scaleX: 1,
    transition: { duration: 0.8, ease, delay: 0.15 + i * 0.1 },
  }),
}

/** The spring interactive elements settle on — knobs, dots, cursor labels. */
export const spring = { type: 'spring', stiffness: 380, damping: 34, mass: 0.7 } as const

/** Press feedback for anything that is a button: a small, quick sink. */
export const press = { scale: 0.97 } as const
