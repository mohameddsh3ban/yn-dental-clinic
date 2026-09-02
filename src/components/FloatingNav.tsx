import { useEffect, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { BrandLogo } from '@/components/BrandLogo'
import { LanguageToggle } from '@/components/LanguageToggle'
import { MobileMenu } from '@/components/MobileMenu'
import { WhatsAppIcon } from '@/components/icons'
import { press, spring, useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { whatsappUrl } from '@/lib/site'
import { navLinks, sectionOf } from '@/lib/nav'

/** Scroll distance before the header condenses into the pill. */
const REVEAL_AT = 180

/**
 * Which section is under the reader.
 *
 * A thin band a little above the middle of the viewport is the probe: the
 * section crossing it is the one the nav marks. The sections live in a chunk
 * that arrives after the hero has painted, so the observer keeps looking for
 * any it has not found yet for a few seconds rather than giving up on the
 * first miss.
 */
function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-38% 0px -56% 0px', threshold: 0 },
    )

    const seen = new Set<string>()
    let frame = 0
    let tries = 0
    const look = () => {
      for (const id of ids) {
        if (seen.has(id)) continue
        const el = document.getElementById(id)
        if (!el) continue
        seen.add(id)
        io.observe(el)
      }
      // ~3s at 60fps, then stop looking for anything still missing.
      if (seen.size < ids.length && tries++ < 180) frame = requestAnimationFrame(look)
    }
    look()

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
    }
    // The list is derived from the dictionary and never changes shape.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return active
}

/**
 * Condensed nav that floats in once the hero header has scrolled away.
 * The header inside the hero stays put — this takes over from it.
 */
export default function FloatingNav() {
  const [pinned, setPinned] = useState(false)
  const { c } = useI18n()
  const still = useStill()
  const links = navLinks(c)
  const active = useActiveSection(links.map(([, href]) => sectionOf(href)))

  useEffect(() => {
    // Reading `scrollY` straight out of the scroll handler forces a layout on
    // every event while the animated pill is mid-flight. Deferring the read to
    // the next frame — one at a time — puts it after style recalculation
    // instead of in front of it.
    let frame = 0

    const measure = () => {
      frame = 0
      setPinned(window.scrollY > REVEAL_AT)
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
      {pinned && (
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4"
        >
          <nav
            aria-label={c.common.siteNav}
            className="glass-chip flex items-center gap-2 rounded-full px-2 py-2 sm:gap-4 sm:ps-3"
          >
            <a
              href="#top"
              aria-label={c.site.name}
              className="block h-9 w-9 shrink-0 transition-transform hover:scale-105 active:scale-95"
            >
              <BrandLogo alt="" className="h-9 w-9" />
            </a>

            {/* The link row, with a gold point under whichever section is under
                the reader. The point slides between links rather than blinking
                from one to the next. */}
            <LayoutGroup id="floating-nav">
              <div className="hidden items-center gap-5 px-1 text-[13px] font-medium text-[#3a352f] md:flex lg:gap-7">
                {links.map(([label, href]) => {
                  const current = sectionOf(href) === active
                  return (
                    <a
                      key={href}
                      href={href}
                      aria-current={current ? 'location' : undefined}
                      className={`relative py-1 transition-colors hover:text-[#14120F] ${
                        current ? 'text-[#14120F]' : ''
                      }`}
                    >
                      {label}
                      {current && (
                        <motion.span
                          aria-hidden
                          layoutId="floating-nav-point"
                          transition={still ? { duration: 0 } : spring}
                          className="absolute -bottom-0.5 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#C0A578]"
                        />
                      )}
                    </a>
                  )
                })}
              </div>
            </LayoutGroup>

            {/* Compact: the pill is already tight on a phone, and the label
                alone ("العربية" / "English") says what the globe would. */}
            <LanguageToggle compact className="shrink-0 !px-3 !py-1.5 text-[11px]" />

            <motion.a
              href={whatsappUrl(c.site.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={still ? undefined : press}
              className="inline-flex items-center gap-2 rounded-full bg-[#14120F] px-4 py-2 text-[12px] font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
              {c.common.whatsapp}
            </motion.a>

            {/* Below `md` the link row is gone, so the menu takes its place. */}
            <MobileMenu className="md:hidden" />
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
