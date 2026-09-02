import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { reveal, snap, viewportOnce, wipe } from '@/lib/anim'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import cosmeticArch from '@/assets/services/cosmetic-arch.webp'
import crownSeat from '@/assets/services/crown-seat.webp'
import jawArch from '@/assets/services/jaw-arch.webp'
import veneerShells from '@/assets/services/veneer-shells.webp'
import compositeLayers from '@/assets/services/composite-layers.webp'
import jawPlate from '@/assets/services/jaw-plate.webp'
import endoMolar from '@/assets/services/endo-molar.webp'
import tmjProsthesis from '@/assets/services/tmj-prosthesis.webp'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** A mouse pull has to travel this far before it stops counting as a click. */
const DRAG_THRESHOLD = 6

/**
 * Every card is the same thing: an ivory-and-gold object, cut from its paper by
 * `npm run build:service-art`, floating on the brand gradient under one scrim.
 * The chairside photographs that used to sit in three of these slots were the
 * odd ones out, so they were replaced with renders of their own subject.
 *
 * The list is parallel to `copy.services.items`, index for index: the title and
 * the tag are translated, the render is not.
 */
const ART: readonly string[] = [
  cosmeticArch,
  crownSeat,
  veneerShells,
  compositeLayers,
  jawArch,
  jawPlate,
  endoMolar,
  tmjProsthesis,
]

/** Each chip carries the ink that clears 4.5:1 on its own fill. */
const avatarChips = [
  'bg-[#C0A578] text-[#14120F]',
  'bg-[#14120F] text-white',
  'bg-[#8f8574] text-[#14120F]',
  'bg-[#2B2723] text-white',
]

/**
 * The avatar chips overlap by 12px at rest and ease apart to 4px when the row
 * is hovered. Logical margins keep the overlap on the trailing side in either
 * direction, so there is nothing to reverse for Arabic.
 */
const chipShift = 'transition-[margin] duration-300 ease-out -ms-3 group-hover/avatars:-ms-1'

export default function Services() {
  const { c, rtl } = useI18n()
  const rail = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  /** How far along the rail the reader is, 0-1; drawn as the hairline's fill. */
  const progress = useMotionValue(0)

  // Drag-to-scroll, mouse only. A finger already pulls the rail natively and a
  // wheel or the arrow keys still work; this gives the mouse the same grab a
  // trackpad has. `drag` holds the live gesture; `dragged` outlives it by one
  // click, so a pull that happened to end on a card does not open it.
  const drag = useRef<{ startX: number; scrollLeft: number } | null>(null)
  const dragged = useRef(false)
  const [isDragging, setIsDragging] = useState(false)

  /**
   * Which arrows are live, whether there is anywhere to go, and how far along
   * the reader is. A rail that fits its cards has none of the three.
   *
   * `scrollLeft` counts down from 0 into negative numbers in an RTL container,
   * so the distance travelled is its magnitude, not its value — comparing the
   * raw number against 0 would report "at the end" the moment an Arabic
   * visitor arrived.
   */
  const measure = useCallback(() => {
    const el = rail.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const travelled = Math.abs(el.scrollLeft)
    setAtStart(travelled <= 2)
    setAtEnd(travelled >= max - 2)
    setHasOverflow(max > 2)
    progress.set(max > 0 ? Math.min(1, travelled / max) : 0)
  }, [progress])

  useEffect(() => {
    measure()
    const el = rail.current
    if (!el) return
    // Card widths are breakpoint-dependent, so the ends move when the window
    // does; ResizeObserver catches that without a resize listener per card.
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure])

  /**
   * One card plus one gap per press, so a press always lands on a card edge.
   * `direction` is in reading order — 1 is "further into the rail" — and is
   * turned into a physical sign here.
   */
  const page = (direction: 1 | -1) => {
    const el = rail.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const gap = 20
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8
    el.scrollBy({ left: direction * step * (rtl ? -1 : 1), behavior: snap ? 'auto' : 'smooth' })
    // An instant scroll can land before the scroll event that would re-enable
    // the other arrow, which leaves a live rail with a dead control.
    requestAnimationFrame(measure)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const el = rail.current
    if (e.pointerType !== 'mouse' || e.button !== 0 || !el) return
    if (el.scrollWidth - el.clientWidth <= 2) return
    drag.current = { startX: e.clientX, scrollLeft: el.scrollLeft }
    dragged.current = false
    setIsDragging(true)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = rail.current
    const gesture = drag.current
    if (!el || !gesture) return
    const dx = e.clientX - gesture.startX
    if (Math.abs(dx) > DRAG_THRESHOLD && !dragged.current) {
      dragged.current = true
      // From here on it is a pull, not a press: keep receiving the pointer even
      // once the hand overshoots the rail's box. Capturing only now, past the
      // threshold, leaves a plain click's target untouched.
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    // The same sign works in both directions: content follows the hand, and
    // in RTL that means scrollLeft going further negative.
    el.scrollLeft = gesture.scrollLeft - dx
  }

  const endDrag = () => {
    if (!drag.current) return
    drag.current = null
    setIsDragging(false)
    // The click that follows a release fires in this same task; by the next
    // frame it has either been swallowed or never came, so the flag can clear
    // rather than lie in wait for a keyboard activation.
    requestAnimationFrame(() => {
      dragged.current = false
    })
  }

  /** A card that was pulled, not pressed, is not a navigation. */
  const onCardClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!dragged.current) return
    e.preventDefault()
    dragged.current = false
  }

  /** Mid-pull, the browser would otherwise lift the link or its render out of the rail. */
  const onDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (drag.current) e.preventDefault()
  }

  /** The arrow that means "back" points at the start of the line, either way. */
  const Back = rtl ? ArrowRight : ArrowLeft
  const Forward = rtl ? ArrowLeft : ArrowRight

  return (
    <section id="services" className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16">
      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
            {c.services.eyebrow} <span className="text-[#C0A578]">/</span>
          </p>
          <motion.h2
            variants={wipe}
            className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]"
          >
            {c.services.headlineTop}
            <br />
            {c.services.headlineBottom}{' '}
            <span className="text-outline">{c.services.headlineOutlined}</span>
          </motion.h2>
        </motion.div>
        <motion.p
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-[380px] text-[14px] leading-relaxed text-[#7a7367] lg:justify-self-end"
        >
          {c.services.lead}
        </motion.p>
      </div>

      {/* Body */}
      {/* `minmax(0,1fr)`: an `auto` track would grow to the meta row's min-content
          (avatars plus arrows, ~276px) and push a 320px phone into sideways
          scroll; capped, the row wraps instead. */}
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[240px_1fr] xl:mt-16">
        {/* Leading meta column */}
        <motion.div
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-row flex-wrap items-center justify-between gap-6 lg:flex-col lg:items-start lg:justify-start"
        >
          <div>
            <div className="group/avatars flex">
              {['SM', 'JK', 'AL', 'RW'].map((n, i) => (
                <span
                  key={n}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold',
                    // The first chip anchors the row; only the ones behind it overlap.
                    i > 0 && chipShift,
                    avatarChips[i],
                  )}
                >
                  {n}
                </span>
              ))}
              <span
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#F4F3F0] text-[11px] font-semibold text-[#14120F]',
                  chipShift,
                )}
              >
                +
              </span>
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[#14120F]">
              <span dir="ltr" className="inline-block tabular-nums">
                750<span className="text-[#C0A578]">+</span>
              </span>
              <span className="ms-1.5 text-[12px] font-normal text-[#6f685c]">
                {c.services.reviews}
              </span>
            </p>
            <p className="mt-3 hidden max-w-[200px] text-[12px] leading-relaxed text-[#7a7367] lg:block">
              {c.services.reviewsBlurb}
            </p>
          </div>
          <div className="flex gap-3 lg:mt-auto lg:pt-10">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label={c.services.previous}
              aria-controls="services-rail"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd6ca] text-[#14120F] transition-[transform,color,background-color] hover:bg-[#14120F] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-35"
            >
              <Back className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label={c.services.next}
              aria-controls="services-rail"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14120F] text-white transition-transform hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-35"
            >
              <Forward className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Cards — one rail, scrolled by the arrows above, a wheel, a finger, or a mouse pull */}
        <motion.div
          variants={reveal}
          custom={2}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="min-w-0"
        >
          <div
            id="services-rail"
            ref={rail}
            onScroll={measure}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={endDrag}
            onDragStart={onDragStart}
            role="group"
            aria-label={c.services.railLabel}
            tabIndex={0}
            className={cn(
              'rail-scroll flex gap-5 overflow-x-auto pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14120F]',
              // Snapping is lifted for the length of a pull so the rail follows
              // the hand rather than the nearest card edge, and re-snaps the
              // moment it is let go. Browsers re-snap every programmatic
              // scrollLeft write, which would otherwise make the pull stutter.
              isDragging ? 'snap-none' : 'snap-x snap-mandatory',
              hasOverflow && 'cursor-grab',
              isDragging && 'cursor-grabbing select-none [&>a]:cursor-grabbing',
            )}
          >
            {c.services.items.map((s, i) => {
              return (
                <a
                  key={s.title}
                  data-card
                  href="#contact"
                  onClick={onCardClick}
                  className="hero-gradient group relative aspect-[4/5] w-[248px] shrink-0 snap-start overflow-hidden rounded-[1.5rem] transition-transform active:scale-[0.98] sm:w-[290px] xl:w-[310px]"
                >
                  <div
                    aria-hidden
                    className="font-display pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[3.4rem] font-semibold leading-none tracking-tighter text-white/25 sm:text-[4rem]"
                  >
                    {c.site.short}
                  </div>

                  <img
                    src={ART[i]}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain px-5 pb-16 pt-8 drop-shadow-[0_18px_28px_rgba(20,18,15,0.22)] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />

                  {/* One scrim on every card, so every title is white on the same
                      base. It has to be this strong: the renders sit on pale
                      cream, where a white title over bare gradient is about
                      1.5:1.

                      Opacity steps must be ones Tailwind actually generates: an
                      off-scale value like /92 silently produces no CSS at all. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14120F]/90 via-[#14120F]/30 to-transparent" />

                  <span className="glass-chip absolute start-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-semibold text-[#14120F]">
                    {s.tag}
                  </span>
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                    {/* The width cap lives on the wrapper: a percentage max-width
                        on the heading would resolve against this shrink-to-fit
                        box, not the row. */}
                    <div className="max-w-[60%] transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                      <h3 className="font-display text-[19px] font-medium leading-tight text-white">
                        {s.title}
                      </h3>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-[#14120F]">
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Where the reader is along the rail. It is a measurement, which is
              the one job gold has on this page, and it only appears once there
              is somewhere to go. */}
          <div
            aria-hidden
            className={cn(
              'mt-4 h-px w-full overflow-hidden bg-[#14120F]/10 transition-opacity duration-300',
              hasOverflow ? 'opacity-100' : 'opacity-0',
            )}
          >
            <motion.div
              style={{ scaleX: progress }}
              className="h-full w-full origin-left bg-[#C0A578] rtl:origin-right"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
