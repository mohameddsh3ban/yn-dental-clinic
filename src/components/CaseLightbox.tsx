import { useCallback, useEffect, useState, type KeyboardEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { ease, press, useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import type { Case } from '@/lib/cases'

/**
 * The full-screen viewer for a case photograph.
 *
 * Radix supplies the dialog semantics — focus trap, Escape, scroll lock, and
 * focus returning to the card that opened it — and framer supplies the motion:
 * the room fades up, and each photograph slides in from the side it was
 * summoned from. Arrow keys and a horizontal swipe step through the set; both
 * are mirrored in Arabic so "forward" is always further into the reading
 * order.
 *
 * `index` is the position in `cases`, or null when closed. The neighbours of
 * the open photograph are fetched ahead so a step never shows a blank frame.
 */
export function CaseLightbox({
  cases,
  index,
  onChange,
  onClose,
  numberOffset = 0,
  numberTotal = cases.length,
  returnFocusTo,
}: {
  cases: readonly Case[]
  index: number | null
  onChange: (index: number) => void
  onClose: () => void
  /**
   * The counter reads in the section's own numbering: the grid tiles start at
   * 02 because the featured pair is 01, so the viewer says "02 of 09" for the
   * first tile rather than restarting at one.
   */
  numberOffset?: number
  numberTotal?: number
  /**
   * Where focus goes when the viewer closes. The tiles open it from state, not
   * from a Radix trigger, so Radix has nothing to return focus to on its own.
   */
  returnFocusTo?: () => HTMLElement | null
}) {
  const { c, t, rtl } = useI18n()
  const still = useStill()
  const total = cases.length
  const open = index !== null
  /** +1 is "further into the set"; drives which side the next frame enters from. */
  const [direction, setDirection] = useState<1 | -1>(1)

  const step = useCallback(
    (d: 1 | -1) => {
      if (index === null) return
      setDirection(d)
      onChange((index + d + total) % total)
    },
    [index, onChange, total],
  )

  useEffect(() => {
    if (index === null) return
    for (const i of [index + 1, index - 1]) {
      const img = new Image()
      img.src = cases[(i + total) % total].image.src
    }
  }, [index, cases, total])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') step(rtl ? -1 : 1)
    else if (e.key === 'ArrowLeft') step(rtl ? 1 : -1)
    else return
    e.preventDefault()
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const throwX = info.offset.x + info.velocity.x * 0.2
    if (Math.abs(throwX) < 60) return
    // A swipe towards the start edge asks for the next photograph.
    const physical: 1 | -1 = throwX < 0 ? 1 : -1
    step(rtl ? ((-physical) as 1 | -1) : physical)
  }

  const current = index === null ? null : cases[index]
  /** Physical sign of "forward": leftwards in Arabic. */
  const sign = rtl ? -1 : 1
  const Back = rtl ? ArrowRight : ArrowLeft
  const Forward = rtl ? ArrowLeft : ArrowRight

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && current && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: still ? 0 : 0.3 }}
                className="fixed inset-0 z-[70] bg-[#14120F]/90 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              onCloseAutoFocus={(e) => {
                const target = returnFocusTo?.()
                if (!target) return
                e.preventDefault()
                target.focus({ preventScroll: true })
              }}
            >
              <motion.div
                onKeyDown={onKeyDown}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: still ? 0 : 0.35, ease }}
                className="fixed inset-0 z-[71] flex flex-col p-3 text-white outline-none sm:p-5"
              >
                {/* Top bar */}
                <div className="flex items-center justify-between gap-4">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/60"
                    aria-live="polite"
                  >
                    {c.cases.eyebrow} <span className="text-[#C0A578]">/</span>{' '}
                    <span className="tabular-nums" dir="ltr">
                      {t(c.cases.counter, {
                        n: String(index! + 1 + numberOffset).padStart(2, '0'),
                        total: String(numberTotal).padStart(2, '0'),
                      })}
                    </span>
                  </p>
                  <Dialog.Close asChild>
                    <motion.button
                      type="button"
                      whileTap={still ? undefined : press}
                      aria-label={c.cases.close}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </Dialog.Close>
                </div>

                {/* Stage */}
                <div className="relative flex min-h-0 flex-1 items-center justify-center py-4 sm:py-6">
                  <AnimatePresence mode="popLayout" initial={false} custom={direction * sign}>
                    <motion.img
                      key={current.slug}
                      custom={direction * sign}
                      variants={{
                        enter: (d: number) => ({ opacity: 0, x: 48 * d }),
                        centre: { opacity: 1, x: 0 },
                        exit: (d: number) => ({ opacity: 0, x: -48 * d }),
                      }}
                      initial="enter"
                      animate="centre"
                      exit="exit"
                      transition={{ duration: still ? 0 : 0.4, ease }}
                      drag={still ? false : 'x'}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.12}
                      dragSnapToOrigin
                      onDragEnd={onDragEnd}
                      src={current.image.src}
                      srcSet={current.image.srcSet}
                      sizes="100vw"
                      width={current.image.width}
                      height={current.image.height}
                      alt={current.title}
                      draggable={false}
                      className="max-h-full max-w-full cursor-grab select-none rounded-[1.25rem] object-contain shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] active:cursor-grabbing"
                    />
                  </AnimatePresence>

                  {/* Side arrows, from tablet up; on a phone the pair below
                      the caption is easier to reach with a thumb. */}
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={c.cases.previous}
                    className="absolute start-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#14120F]/40 text-white/80 backdrop-blur transition-colors hover:bg-white hover:text-[#14120F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex"
                  >
                    <Back className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={c.cases.next}
                    className="absolute end-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#14120F]/40 text-white/80 backdrop-blur transition-colors hover:bg-white hover:text-[#14120F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:flex"
                  >
                    <Forward className="h-4 w-4" />
                  </button>
                </div>

                {/* Caption */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="min-w-0">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={current.slug}
                        initial={still ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: still ? 0 : 0.25, ease }}
                      >
                        <Dialog.Title className="font-display text-[17px] font-medium leading-tight tracking-[-0.01em] text-white">
                          {current.title}
                        </Dialog.Title>
                        <Dialog.Description className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">
                          {current.note}
                        </Dialog.Description>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  <div className="flex gap-2 md:hidden">
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      aria-label={c.cases.previous}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:bg-white hover:text-[#14120F]"
                    >
                      <Back className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      aria-label={c.cases.next}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14120F] transition-transform active:scale-95"
                    >
                      <Forward className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
