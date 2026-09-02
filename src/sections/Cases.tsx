import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CaseLightbox } from '@/components/CaseLightbox'
import { CompareSlider, type CompareSliderHandle } from '@/components/CompareSlider'
import { SmoothImage } from '@/components/SmoothImage'
import { WhatsAppIcon } from '@/components/icons'
import { ease, press, reveal, snap, spring, useStill, viewportOnce, wipe } from '@/lib/anim'
import { CASE_GROUPS, COMPARE, caseImage, useCases, type CaseGroup } from '@/lib/cases'
import { useI18n } from '@/lib/i18n'
import { whatsappUrl } from '@/lib/site'
import { cn } from '@/lib/utils'

/** The cursor label's spring: quick to follow, no overshoot to speak of. */
const CURSOR_SPRING = { stiffness: 420, damping: 38, mass: 0.6 }

/**
 * Cases: the clinic's own clinical photographs.
 *
 * The section is set on ink — a viewing room rather than a sheet of paper —
 * because tissue and porcelain read truer against dark than against white, and
 * because it is the one place on the page where the photograph, not the type,
 * is the content.
 *
 * Three parts: the featured before/after under one draggable divider; a set of
 * filter chips; and the grid, every tile of which opens the same full-screen
 * viewer. Filtering re-flows the grid rather than re-rendering it, so a tile
 * that survives the filter slides to its new place and one that does not fades
 * out where it stood.
 */
export default function Cases() {
  const { c, t } = useI18n()
  const still = useStill()
  const cases = useCases()
  const whatsapp = whatsappUrl(c.site.whatsappMessage)

  const [group, setGroup] = useState<CaseGroup | 'all'>('all')
  const [open, setOpen] = useState<number | null>(null)
  /** The tile that opened the viewer, so focus can come back to it. */
  const opener = useRef<HTMLButtonElement | null>(null)
  const visible = useMemo(
    () => (group === 'all' ? cases : cases.filter((k) => k.group === group)),
    [cases, group],
  )
  const counts = useMemo(() => {
    const tally: Record<CaseGroup | 'all', number> = { all: cases.length, implants: 0, restorative: 0, lab: 0 }
    for (const k of cases) tally[k.group] += 1
    return tally
  }, [cases])

  const before = useMemo(() => caseImage(COMPARE.before), [])
  const after = useMemo(() => caseImage(COMPARE.after), [])
  const compare = useRef<CompareSliderHandle>(null)

  /** Numbering runs across the whole section: the featured pair is 01. */
  const total = cases.length + 1
  const numeral = (n: number) => String(n).padStart(2, '0')

  // The "View" label that rides with a mouse pointer over the grid. Touch
  // pointers never see it — a finger already is the cursor.
  const stage = useRef<HTMLDivElement>(null)
  const cx = useMotionValue(0)
  const cy = useMotionValue(0)
  const sx = useSpring(cx, CURSOR_SPRING)
  const sy = useSpring(cy, CURSOR_SPRING)
  const [hovering, setHovering] = useState(false)

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !stage.current) return
    const box = stage.current.getBoundingClientRect()
    cx.set(e.clientX - box.left)
    cy.set(e.clientY - box.top)
    if (!hovering) setHovering(true)
  }

  return (
    <section
      id="cases"
      aria-labelledby="cases-heading"
      className="relative overflow-hidden rounded-[1.75rem] bg-[#14120F] p-6 text-white sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
    >
      {/* One pool of light behind the featured pair, so the room has a lamp. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] start-[10%] h-[55%] w-[55%] rounded-full bg-[#C0A578]/[0.09] blur-3xl"
      />

      {/* Header */}
      <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/50">
            {c.cases.eyebrow} <span className="text-[#C0A578]">/</span>{' '}
            <span className="tabular-nums" dir="ltr">
              01–{numeral(total)}
            </span>
          </p>
          <motion.h2
            id="cases-heading"
            variants={wipe}
            className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-white"
          >
            {c.cases.headlineTop}{' '}
            <span className="text-outline-light">{c.cases.headlineOutlined}</span>
          </motion.h2>
        </motion.div>
        <motion.p
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-[380px] text-[14px] leading-relaxed text-white/60 lg:justify-self-end"
        >
          {c.cases.lead}
        </motion.p>
      </div>

      {/* Featured before/after */}
      <div className="relative mt-12 grid gap-5 lg:grid-cols-[1.35fr_1fr] xl:mt-16 xl:gap-8">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="min-w-0"
        >
          <CompareSlider
            ref={compare}
            before={before}
            after={after}
            sizes="(min-width: 1024px) 58vw, 100vw"
            labels={{
              before: c.cases.compare.before,
              after: c.cases.compare.after,
              handle: c.cases.compare.handleAria,
              hint: c.cases.compare.hint,
            }}
            className="ring-1 ring-inset ring-white/10"
          />
        </motion.div>

        <motion.div
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="flex flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 sm:p-8"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
            {c.cases.compare.label} <span className="text-[#C0A578]">/</span>{' '}
            <span className="tabular-nums" dir="ltr">
              01
            </span>
          </p>
          <h3 className="font-display mt-4 text-[17px] font-medium leading-[1.3] tracking-[-0.01em] text-white">
            {c.cases.compare.title}
          </h3>
          <p className="mt-4 text-[14px] leading-relaxed text-white/65">{c.cases.compare.body}</p>

          {/* Two thumbnails that steer the divider — a second way in for anyone
              who would rather tap than drag. */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-6">
            {(
              [
                [c.cases.compare.before, before, 100],
                [c.cases.compare.after, after, 0],
              ] as const
            ).map(([label, image, target]) => (
              <motion.button
                key={label}
                type="button"
                whileTap={still ? undefined : press}
                onClick={() => compare.current?.moveTo(target)}
                className="group/thumb relative overflow-hidden rounded-[1rem] text-start ring-1 ring-inset ring-white/10 transition-shadow hover:ring-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <SmoothImage
                  src={image.src}
                  srcSet={image.srcSet}
                  sizes="(min-width: 1024px) 14vw, 40vw"
                  width={image.width}
                  height={image.height}
                  alt=""
                  blur={image.blur}
                  loading="lazy"
                  decoding="async"
                  frameClassName="aspect-[16/10] w-full"
                  className="transition-transform duration-700 ease-out group-hover/thumb:scale-[1.05]"
                />
                <span className="absolute inset-x-2 bottom-2 rounded-full bg-[#14120F]/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                  {label}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <p className="text-[12px] leading-relaxed text-white/50">{c.cases.ctaBlurb}</p>
            <motion.a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={still ? undefined : press}
              className="group mt-4 inline-flex items-center gap-3 rounded-full bg-white py-3.5 ps-5 pe-6 text-[13px] font-semibold text-[#14120F] transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#1f7a4d]" />
              {c.cases.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        variants={reveal}
        initial={snap ? false : 'hidden'}
        whileInView="show"
        viewport={viewportOnce}
        role="group"
        aria-label={c.cases.filterAria}
        className="relative mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-6 xl:mt-16"
      >
        <LayoutGroup id="cases-filter">
          {CASE_GROUPS.map((g) => {
            const active = g === group
            return (
              <button
                key={g}
                type="button"
                aria-pressed={active}
                onClick={() => setGroup(g)}
                className={cn(
                  'relative rounded-full px-4 py-2 text-[12px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                  active ? 'text-[#14120F]' : 'text-white/65 hover:text-white',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="cases-filter-pill"
                    transition={still ? { duration: 0 } : spring}
                    className="absolute inset-0 rounded-full bg-white"
                  />
                )}
                <span className="relative z-10">
                  {c.cases.filters[g]}{' '}
                  <span
                    className={cn(
                      'ms-1 tabular-nums',
                      active ? 'text-[#14120F]/50' : 'text-[#C0A578]',
                    )}
                    dir="ltr"
                  >
                    {counts[g]}
                  </span>
                </span>
              </button>
            )
          })}
        </LayoutGroup>
      </motion.div>

      {/* Grid */}
      <div
        ref={stage}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setHovering(false)}
        className="relative mt-6"
      >
        <motion.ul
          layout
          transition={{ duration: still ? 0 : 0.5, ease }}
          className="grid grid-cols-2 gap-3 [grid-auto-flow:dense] sm:gap-4 md:grid-cols-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((k) => {
              const i = cases.indexOf(k)
              const tall = k.span === 'tall'
              const wide = k.span === 'wide'
              return (
                <motion.li
                  key={k.slug}
                  layout
                  initial={still ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: still ? 0 : 0.45, ease }}
                  className={cn('min-w-0', tall && 'row-span-2', wide && 'md:col-span-3')}
                >
                  <motion.button
                    type="button"
                    whileTap={still ? undefined : press}
                    onClick={(e) => {
                      opener.current = e.currentTarget
                      setOpen(i)
                    }}
                    aria-label={t(c.cases.open, { n: numeral(i + 2), title: k.title })}
                    className="group relative block h-full w-full overflow-hidden rounded-[1.25rem] bg-white/5 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <SmoothImage
                      src={k.image.src}
                      srcSet={k.image.srcSet}
                      sizes={wide ? '(min-width: 768px) 92vw, 46vw' : '(min-width: 768px) 30vw, 46vw'}
                      width={k.image.width}
                      height={k.image.height}
                      alt={k.title}
                      blur={k.image.blur}
                      loading="lazy"
                      decoding="async"
                      // A tall frame fills its two rows when the grid gives it
                      // a height, and falls back to its own ratio when it is
                      // the only tile left after a filter.
                      frameClassName={cn(
                        'w-full',
                        tall ? 'h-full aspect-[3/4]' : wide ? 'aspect-[3/2] md:aspect-[21/9]' : 'aspect-[3/2]',
                      )}
                      className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14120F]/85 via-[#14120F]/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

                    <span
                      className="absolute start-3 top-3 text-[10px] font-semibold tabular-nums tracking-[0.14em] text-[#C0A578] sm:start-4 sm:top-4"
                      dir="ltr"
                    >
                      {numeral(i + 2)}
                    </span>

                    <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                      <div className="min-w-0 transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                        <p className="font-display truncate text-[13px] font-medium leading-tight text-white sm:text-[15px]">
                          {k.title}
                        </p>
                        <p className="mt-1 hidden truncate text-[10px] font-medium uppercase tracking-[0.14em] text-white/60 sm:block">
                          {k.note}
                        </p>
                      </div>
                      <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-[#14120F] sm:flex">
                        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                      </span>
                    </div>
                  </motion.button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </motion.ul>

        {/* Cursor label — mouse only, and never while the viewer is open. */}
        <AnimatePresence>
          {hovering && open === null && (
            <motion.span
              aria-hidden
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden [@media(pointer:fine)]:block"
            >
              <span className="block -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#14120F] shadow-[0_8px_30px_rgba(20,18,15,0.35)]">
                {c.cases.view}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="relative mt-10 border-t border-white/10 pt-6">
        <p className="max-w-[640px] text-[11px] leading-relaxed text-white/50">
          {t(c.cases.disclaimer, { clinic: c.site.name })}
        </p>
      </div>

      <CaseLightbox
        cases={cases}
        index={open}
        onChange={setOpen}
        onClose={() => setOpen(null)}
        numberOffset={1}
        numberTotal={total}
        returnFocusTo={() => opener.current}
      />
    </section>
  )
}
