import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrandLogo } from '@/components/BrandLogo'
import { LanguageToggle } from '@/components/LanguageToggle'
import { WhatsAppIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n'
import { whatsappUrl } from '@/lib/site'
import { navLinks } from '@/lib/nav'

/** Scroll distance before the header condenses into the pill. */
const REVEAL_AT = 180

/**
 * Condensed nav that floats in once the hero header has scrolled away.
 * The header inside the hero stays put — this takes over from it.
 */
export default function FloatingNav() {
  const [pinned, setPinned] = useState(false)
  const { c } = useI18n()

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > REVEAL_AT)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14120F] transition-transform hover:scale-105"
            >
              <BrandLogo alt="" className="h-7 w-7" />
            </a>

            <div className="hidden items-center gap-5 px-1 text-[13px] font-medium text-[#3a352f] md:flex lg:gap-7">
              {navLinks(c).map(([label, href]) => (
                <a key={href} href={href} className="transition-colors hover:text-[#14120F]">
                  {label}
                </a>
              ))}
            </div>

            {/* Compact: the pill is already tight on a phone, and the label
                alone ("العربية" / "English") says what the globe would. */}
            <LanguageToggle compact className="shrink-0 !px-3 !py-1.5 text-[11px]" />

            <a
              href={whatsappUrl(c.site.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#14120F] px-4 py-2 text-[12px] font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
              {c.common.whatsapp}
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
