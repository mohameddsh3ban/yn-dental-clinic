import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { press, useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * The sheet is fetched on the first tap, never before: the trigger is in the
 * hero header, which is the page's first paint, and a dialog nobody has asked
 * for yet has no business in that bundle.
 */
const MobileMenuSheet = lazy(() => import('@/components/MobileMenuSheet'))

/**
 * The hamburger and the sheet it opens. Shown wherever the full link row does
 * not fit; the caller decides the breakpoint with `className`.
 */
export function MobileMenu({ className }: { className?: string }) {
  const { c } = useI18n()
  const still = useStill()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  return (
    <>
      <motion.button
        type="button"
        whileTap={still ? undefined : press}
        onClick={() => {
          setMounted(true)
          setOpen(true)
        }}
        aria-label={c.common.menu}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#14120F]/10 bg-white/70 text-[#14120F] backdrop-blur transition-colors hover:border-[#14120F]/25 hover:bg-white',
          className,
        )}
      >
        <Menu className="h-4 w-4" />
      </motion.button>
      {mounted && (
        <Suspense fallback={null}>
          <MobileMenuSheet open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  )
}
