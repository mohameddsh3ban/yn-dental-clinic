import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ease, useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import type { CaseImage } from '@/lib/cases'
import { cn } from '@/lib/utils'

/**
 * A before/after photograph pair under one draggable divider.
 *
 * The "after" photograph fills the frame; the "before" sits on top of it and is
 * clipped to the start side of the divider, so dragging the handle across the
 * face uncovers the result underneath. Both are the same photograph of the same
 * smile at the same scale, which is what makes the wipe read as time passing
 * rather than as two pictures.
 *
 * The control is a real `<input type="range">` laid invisibly over the whole
 * frame: it gives the divider mouse, touch, pen and keyboard for free, along
 * with a slider role and a value a screen reader can announce, and pressing
 * anywhere on the photograph moves the divider there. The visible handle just
 * follows its value on a short spring.
 *
 * On first sight the divider makes one small excursion and returns, which is
 * the whole tutorial; it stops the moment the visitor takes hold, and never
 * plays for anyone who asked for less motion.
 */

export type CompareSliderHandle = {
  /** Move the divider to `percent` of the way across, from the start edge. */
  moveTo: (percent: number) => void
}

type Labels = {
  before: string
  after: string
  /** Accessible name of the slider control. */
  handle: string
  /** The one-line hint shown until the visitor takes hold. */
  hint: string
}

const REST = 50
const NUDGE = 64

export const CompareSlider = forwardRef<
  CompareSliderHandle,
  {
    before: CaseImage
    after: CaseImage
    labels: Labels
    sizes: string
    className?: string
  }
>(function CompareSlider({ before, after, labels, sizes, className }, ref) {
  const { rtl } = useI18n()
  const still = useStill()
  const frame = useRef<HTMLDivElement>(null)
  const inView = useInView(frame, { once: true, margin: '-20%' })

  const raw = useMotionValue(REST)
  const sprung = useSpring(raw, { stiffness: 320, damping: 36, mass: 0.6 })
  const pos = still ? raw : sprung

  const [value, setValue] = useState(REST)
  const [held, setHeld] = useState(false)
  const tour = useRef<AnimationPlaybackControls | null>(null)

  const take = () => {
    tour.current?.stop()
    if (!held) setHeld(true)
  }

  const set = (percent: number) => {
    const p = Math.min(100, Math.max(0, percent))
    raw.set(p)
    setValue(p)
  }

  useImperativeHandle(ref, () => ({
    moveTo: (percent) => {
      take()
      set(percent)
    },
  }))

  // The one-time excursion that shows the divider can move.
  useEffect(() => {
    if (!inView || still || held) return
    tour.current = animate(raw, [REST, NUDGE, REST], {
      duration: 1.9,
      delay: 0.5,
      ease,
      times: [0, 0.5, 1],
    })
    return () => tour.current?.stop()
  }, [inView, still, held, raw])

  // The "before" layer is clipped to whatever lies between the start edge and
  // the divider. In Arabic the start edge is on the right.
  const clipPath = useTransform(pos, (p) =>
    rtl ? `inset(0 0 0 ${100 - p}%)` : `inset(0 ${100 - p}% 0 0)`,
  )
  const inset = useTransform(pos, (p) => `${p}%`)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => set(Number(e.target.value))

  return (
    <div
      ref={frame}
      className={cn(
        'group relative select-none overflow-hidden rounded-[1.5rem] bg-[#14120F]',
        className,
      )}
      style={{ aspectRatio: `${after.width} / ${after.height}` }}
    >
      <img
        src={after.src}
        srcSet={after.srcSet}
        sizes={sizes}
        width={after.width}
        height={after.height}
        alt={labels.after}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <motion.img
        src={before.src}
        srcSet={before.srcSet}
        sizes={sizes}
        width={before.width}
        height={before.height}
        alt={labels.before}
        loading="lazy"
        decoding="async"
        draggable={false}
        style={{ clipPath }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Divider and handle. Positioned from the start edge so the same value
          lands on the same photograph in either language. */}
      <motion.div
        aria-hidden
        style={rtl ? { right: inset } : { left: inset }}
        className="pointer-events-none absolute inset-y-0 z-10 w-0"
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/90 shadow-[0_0_0_1px_rgba(20,18,15,0.25)]" />
        <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/75 text-[#14120F] shadow-[0_8px_30px_rgba(20,18,15,0.35)] backdrop-blur transition-[transform,box-shadow] duration-300 ease-out group-hover:scale-105 group-active:scale-95 group-focus-within:shadow-[0_0_0_3px_#C0A578,0_8px_30px_rgba(20,18,15,0.35)]">
          <ChevronLeft className="-me-0.5 h-4 w-4" />
          <ChevronRight className="-ms-0.5 h-4 w-4" />
        </span>
      </motion.div>

      <span className="glass-chip pointer-events-none absolute start-4 top-4 z-10 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#14120F]">
        {labels.before}
      </span>
      <span className="pointer-events-none absolute end-4 top-4 z-10 rounded-full bg-[#14120F]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
        {labels.after}
      </span>

      <AnimatePresence>
        {!held && (
          <motion.span
            aria-hidden
            initial={still ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: still ? 0 : 0.4, ease, delay: still ? 0 : 1.2 }}
            className="glass-chip pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#14120F]"
          >
            {labels.hint}
          </motion.span>
        )}
      </AnimatePresence>

      {/* The control. Invisible, full-frame, and the only thing that receives
          the pointer — everything above is `pointer-events-none`. */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={onChange}
        onPointerDown={take}
        onKeyDown={take}
        aria-label={labels.handle}
        aria-valuetext={`${Math.round(value)}% ${labels.before}`}
        className="compare-range absolute inset-0 z-20 m-0 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 outline-none"
      />
    </div>
  )
})
