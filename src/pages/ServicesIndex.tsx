import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { reveal, snap, useStill, viewportOnce } from '@/lib/anim'
import { Breadcrumbs, SubpageHeader } from '@/components/SubpageHeader'
import Footer from '@/sections/Footer'
import { useI18n } from '@/lib/i18n'
import { CONTACT_PATH, GROUPS, PAGES, pageMeta, usePagesCopy } from '@/lib/pages'
import { PLANNING_PATH, planningMeta } from '@/lib/planning3d'
import { whatsappUrl } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.1 } },
}

/**
 * The services hub: every treatment page, grouped the way the practice is —
 * surgery, implants, cosmetic and restorative. It is the page the homepage and
 * every footer link to, so each treatment is two clicks from anywhere.
 */
export default function ServicesIndex() {
  const { c, p, path, lang } = useI18n()
  const { ui, servicesIndex: copy } = usePagesCopy()
  const content = p.content
  const still = useStill()

  const pillar = pageMeta('maxillofacial-surgery')
  const travel = pageMeta('international-patients')

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
            <Breadcrumbs trail={[{ label: ui.home, to: '/' }, { label: ui.services }]} />

            <p className="mt-7 flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
              <span aria-hidden className="me-3 inline-block h-px w-5 bg-[#C0A578]" />
              {copy.eyebrow}
            </p>
            <h1 className="font-display mt-4 max-w-[22ch] text-[clamp(1.95rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[#14120F]">
              {copy.h1}
            </h1>
            <p className="mt-6 max-w-[70ch] text-[15px] leading-[1.7] text-[#3a352f] xl:text-[16px]">
              {copy.lead}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[pillar, travel].map((meta) => (
                <Link
                  key={meta.id}
                  to={path(meta.path)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#14120F]/15 bg-white/60 px-5 py-3 text-[12px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white"
                >
                  {content[meta.id].nav}
                  <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                </Link>
              ))}
              <Link
                to={path(PLANNING_PATH)}
                className="inline-flex items-center gap-2 rounded-full border border-[#14120F]/15 bg-white/60 px-5 py-3 text-[12px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white"
              >
                {planningMeta[lang].nav}
                <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </Link>
              <Link
                to={path(CONTACT_PATH)}
                className="inline-flex items-center gap-2 rounded-full border border-[#14120F]/15 bg-white/60 px-5 py-3 text-[12px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white"
              >
                {ui.contactCta}
                <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>

      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        {GROUPS.map((group, g) => {
          const items = PAGES.filter((p) => p.group === group)
          return (
            <section
              key={group}
              aria-labelledby={`group-${group}`}
              className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
            >
              <motion.div
                variants={reveal}
                initial={snap ? false : 'hidden'}
                whileInView="show"
                viewport={viewportOnce}
                className="grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-end"
              >
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
                    <span dir="ltr" className="inline-block tabular-nums">
                      {String(g + 1).padStart(2, '0')}
                    </span>{' '}
                    <span className="text-[#C0A578]">/</span>{' '}
                    <span dir="ltr" className="inline-block tabular-nums">
                      {String(items.length).padStart(2, '0')}
                    </span>
                  </p>
                  <h2
                    id={`group-${group}`}
                    className="font-display mt-4 text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]"
                  >
                    {copy.groups[group]}
                  </h2>
                </div>
                <p className="max-w-[440px] text-[14px] leading-relaxed text-[#7a7367] lg:justify-self-end">
                  {copy.groupLeads[group]}
                </p>
              </motion.div>

              <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((meta, i) => (
                  <motion.li
                    key={meta.id}
                    variants={reveal}
                    custom={i * 0.5}
                    initial={snap ? false : 'hidden'}
                    whileInView="show"
                    viewport={viewportOnce}
                  >
                    <Link
                      to={path(meta.path)}
                      className="hero-gradient group flex h-full items-center gap-4 rounded-[1.5rem] p-4 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14120F]"
                    >
                      <img
                        src={meta.art}
                        alt=""
                        width={96}
                        height={120}
                        loading="lazy"
                        decoding="async"
                        className="h-24 w-20 shrink-0 object-contain drop-shadow-[0_10px_16px_rgba(20,18,15,0.2)]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="font-display block text-[16px] font-medium leading-tight text-[#14120F]">
                          {content[meta.id].nav}
                        </span>
                        <span className="mt-2 block text-[12px] leading-relaxed text-[#5f584d]">
                          {content[meta.id].blurb}
                        </span>
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#14120F]/15 text-[#14120F] transition-colors group-hover:bg-[#14120F] group-hover:text-white">
                        <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </section>
          )
        })}

        <Footer />
      </main>
    </div>
  )
}
