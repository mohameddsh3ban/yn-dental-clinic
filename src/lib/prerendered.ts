import { snap } from '@/lib/anim'

/**
 * Whether the browser should adopt the pre-rendered page (hydrate) or draw it
 * again from scratch. Read once, at module load, before React touches the DOM.
 *
 * Every page arrives pre-rendered in production, and normally it is hydrated:
 * the HTML that is already on screen is kept and React attaches to it.
 *
 * Three cases render from scratch instead, because the pre-rendered markup is
 * not what the visitor should get:
 *
 *   - `vite dev`, where #root is empty;
 *   - the 404 document — one HTML file served for every unknown URL in every
 *     language, marked `data-render="client"`;
 *   - a visitor who asked for reduced motion, or a `?snap=1` capture. The HTML
 *     is rendered with every entrance in its starting state (faded out, waiting
 *     to animate in). For these two the page must simply be there, settled,
 *     with nothing waiting on an animation or a scroll position — which is what
 *     a fresh client render with `initial={false}` gives them.
 */
const root = typeof document === 'undefined' ? null : document.getElementById('root')

const prerendered = !!root && root.hasChildNodes() && root.dataset.render !== 'client'

const reducedMotion =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const HYDRATE = prerendered && !snap && !reducedMotion
