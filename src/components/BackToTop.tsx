import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { ease, press, useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'

/** Scroll distance, in viewports, before the button appears. */
const SHOW_AFTER = 1.5

/**
 * A glass button in the trailing bottom corner that returns the reader to the
 * hero. It arrives once the hero and the first section are behind them and
 * leaves the same way it came.
 */
export default function BackToTop() {
  const { c } = useI18n()
  const still = useStill()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      setShown(window.scrollY > window.innerHeight * SHOW_AFTER)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <AnimatePresence>
      {shown && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: still ? 'auto' : 'smooth' })}
          aria-label={c.common.backToTop}
          title={c.common.backToTop}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileTap={press}
          transition={{ duration: still ? 0 : 0.3, ease }}
          className="glass-chip fixed bottom-5 end-5 z-40 flex h-11 w-11 items-center justify-center rounded-full text-[#14120F] transition-colors hover:bg-white sm:bottom-6 sm:end-6"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
