import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import cosmeticArch from '@/assets/services/cosmetic-arch.webp'
import jawArch from '@/assets/services/jaw-arch.webp'
import veneerShells from '@/assets/services/veneer-shells.webp'
import compositeLayers from '@/assets/services/composite-layers.webp'
import jawPlate from '@/assets/services/jaw-plate.webp'
import endoMolar from '@/assets/services/endo-molar.webp'
import { useI18n } from '@/lib/i18n'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

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
  jawArch,
  veneerShells,
  compositeLayers,
  jawPlate,
  endoMolar,
]

const avatarColors = ['bg-[#C0A578]', 'bg-[#14120F]', 'bg-[#8f8574]', 'bg-[#2B2723]']

export default function Services() {
  const { c, rtl } = useI18n()
  const rail = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  /**
   * Which arrows are live. A rail that fits its cards has neither.
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
  }, [])

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
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
            {c.services.eyebrow} <span className="text-[#C0A578]">/</span>
          </p>
          <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
            {c.services.headlineTop}
            <br />
            {c.services.headlineBottom}{' '}
            <span className="text-outline">{c.services.headlineOutlined}</span>
          </h2>
        </motion.div>
        <motion.p
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-[380px] text-[14px] leading-relaxed text-[#7a7367] lg:justify-self-end"
        >
          {c.services.lead}
        </motion.p>
      </div>

      {/* Body */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr] xl:mt-16">
        {/* Leading meta column */}
        <motion.div
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-row items-center justify-between gap-6 lg:flex-col lg:items-start lg:justify-start"
        >
          <div>
            <div className="flex -space-x-3 rtl:space-x-reverse">
              {['SM', 'JK', 'AL', 'RW'].map((n, i) => (
                <span
                  key={n}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white ${avatarColors[i]}`}
                >
                  {n}
                </span>
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#F4F3F0] text-[11px] font-semibold text-[#14120F]">
                +
              </span>
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[#14120F]">
              <span dir="ltr" className="inline-block tabular-nums">
                750<span className="text-[#C0A578]">+</span>
              </span>
              <span className="ms-1.5 text-[12px] font-normal text-[#9a9184]">
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
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd6ca] text-[#14120F] transition-colors hover:bg-[#14120F] hover:text-white disabled:pointer-events-none disabled:opacity-35"
            >
              <Back className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label={c.services.next}
              aria-controls="services-rail"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14120F] text-white transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-35"
            >
              <Forward className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Cards — one rail, scrolled by the arrows above */}
        <motion.div
          variants={reveal}
          custom={2}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="min-w-0"
        >
          <div
            id="services-rail"
            ref={rail}
            onScroll={measure}
            role="group"
            aria-label={c.services.railLabel}
            tabIndex={0}
            className="rail-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#14120F]"
          >
            {c.services.items.map((s, i) => {
              return (
                <a
                  key={s.title}
                  data-card
                  href="#contact"
                  className="hero-gradient group relative aspect-[4/5] w-[248px] shrink-0 snap-start overflow-hidden rounded-[1.5rem] sm:w-[290px] xl:w-[310px]"
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
                    <h3 className="font-display max-w-[60%] text-[19px] font-medium leading-tight text-white">
                      {s.title}
                    </h3>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-[#14120F]">
                      <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
