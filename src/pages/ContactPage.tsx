import { motion } from 'framer-motion'
import { useStill } from '@/lib/anim'
import { Breadcrumbs, SubpageHeader } from '@/components/SubpageHeader'
import Location from '@/sections/Location'
import Faq from '@/sections/Faq'
import Footer from '@/sections/Footer'
import { useI18n } from '@/lib/i18n'
import { usePagesCopy } from '@/lib/pages'
import { whatsappUrl } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.1 } },
}

/**
 * Address, phone, hours and directions on a page of their own. The homepage
 * already carries the Location section; this gives "where is the clinic" and
 * "how do I book" a URL that can be linked, shared and indexed.
 */
export default function ContactPage() {
  const { c } = useI18n()
  const { ui, contact } = usePagesCopy()
  const still = useStill()

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <div className="p-3 sm:p-4 xl:p-6">
        <section className="hero-gradient relative overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem]">
          <SubpageHeader whatsapp={whatsappUrl(c.site.whatsappMessage)} />

          <motion.div
            variants={fadeUp}
            initial={still ? false : 'hidden'}
            animate="show"
            className="relative z-10 mx-auto w-full max-w-[1760px] px-5 pb-12 pt-8 sm:px-8 xl:px-14 xl:pb-16 xl:pt-12 2xl:px-20"
          >
            <Breadcrumbs trail={[{ label: ui.home, to: '/' }, { label: contact.eyebrow }]} />

            <p className="mt-7 flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
              <span aria-hidden className="me-3 inline-block h-px w-5 bg-[#C0A578]" />
              {contact.eyebrow}
            </p>
            <h1 className="font-display mt-4 max-w-[22ch] text-[clamp(1.95rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[#14120F]">
              {contact.h1}
            </h1>
            <p className="mt-6 max-w-[64ch] text-[15px] leading-[1.7] text-[#3a352f] xl:text-[16px]">
              {contact.lead}
            </p>
            {ui.consultNote && <p className="mt-4 text-[12px] text-[#6b6459]">{ui.consultNote}</p>}
          </motion.div>
        </section>
      </div>

      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        <Location />
        <Faq />
        <Footer />
      </main>
    </div>
  )
}
