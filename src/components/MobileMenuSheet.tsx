import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Phone, X } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { LanguageToggle } from '@/components/LanguageToggle'
import { WhatsAppIcon } from '@/components/icons'
import { ease, press, useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { navLinks } from '@/lib/nav'
import { site, whatsappUrl } from '@/lib/site'

/**
 * The phone navigation: a glass sheet that drops from the top edge with every
 * section link set large enough to hit with a thumb, the language control, and
 * the two ways to make contact.
 *
 * Radix owns the semantics (focus trap, Escape, scroll lock, focus back to the
 * trigger); framer owns the arrival. A tap on a link closes the sheet and lets
 * the anchor do its normal work. The module is loaded on the first tap of the
 * trigger — see `MobileMenu` — so it costs the first paint nothing.
 */
export default function MobileMenuSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { c } = useI18n()
  const still = useStill()
  const whatsapp = whatsappUrl(c.site.whatsappMessage)
  const links = navLinks(c)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: still ? 0 : 0.25 }}
                className="fixed inset-0 z-[70] bg-[#14120F]/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, y: -24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.98 }}
                transition={{ duration: still ? 0 : 0.35, ease }}
                className="fixed inset-x-3 top-3 z-[71] max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[1.75rem] border border-white/70 bg-[#F4F3F0]/95 p-5 text-[#14120F] shadow-[0_30px_80px_-20px_rgba(20,18,15,0.45)] backdrop-blur-xl outline-none sm:inset-x-4 sm:top-4 sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <a
                    href="#top"
                    onClick={() => onOpenChange(false)}
                    aria-label={c.site.name}
                    className="block h-10 w-10 shrink-0"
                  >
                    <BrandLogo alt="" className="h-10 w-10" />
                  </a>
                  <Dialog.Title className="sr-only">{c.common.menu}</Dialog.Title>
                  <div className="flex items-center gap-2">
                    <LanguageToggle compact className="!px-3 !py-2 text-[12px]" />
                    <Dialog.Close asChild>
                      <motion.button
                        type="button"
                        whileTap={still ? undefined : press}
                        aria-label={c.common.closeMenu}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#14120F]/10 bg-white/70 text-[#14120F] transition-colors hover:bg-white"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </Dialog.Close>
                  </div>
                </div>

                <nav aria-label={c.common.siteNav} className="mt-6">
                  <ul className="divide-y divide-[#14120F]/10 border-y border-[#14120F]/10">
                    {links.map(([label, href], i) => (
                      <motion.li
                        key={href}
                        initial={still ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: still ? 0 : 0.35, ease, delay: still ? 0 : 0.08 + i * 0.04 }}
                      >
                        <a
                          href={href}
                          onClick={() => onOpenChange(false)}
                          className="group flex items-center justify-between gap-4 py-3.5 text-[17px] font-medium tracking-[-0.01em] text-[#14120F] transition-colors hover:text-[#3a352f]"
                        >
                          <span className="flex items-baseline gap-3">
                            <span
                              className="text-[10px] font-semibold tabular-nums tracking-[0.14em] text-[#6b6459] transition-colors group-hover:text-[#C0A578]"
                              dir="ltr"
                            >
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="font-display">{label}</span>
                          </span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#6b6459] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-6 flex flex-col gap-3">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-[#14120F] py-4 text-[13px] font-medium text-white transition-transform active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
                    {c.hero.book}
                  </a>
                  <a
                    href={`tel:${site.phones[0].tel}`}
                    dir="ltr"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/60 py-4 text-[13px] font-medium tabular-nums text-[#14120F] transition-colors hover:bg-white active:scale-[0.98]"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {site.phones[0].label}
                  </a>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
