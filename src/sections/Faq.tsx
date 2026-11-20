import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { reveal, snap, viewportOnce, wipe } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { SERVICES_PATH, usePagesCopy } from '@/lib/pages'

/**
 * The questions people ask before a first visit — where, how to book, who
 * treats what, clinic or hospital. Every answer is open on the page rather
 * than behind an accordion: it is short, and text that is simply there is text
 * a search engine or an assistant can quote. The same pairs are published as
 * FAQPage structured data from `lib/seo.ts`.
 */
export default function Faq() {
  const { path } = useI18n()
  const { ui, homeFaq } = usePagesCopy()

  return (
    <section
      id="faq"
      aria-labelledby="home-faq-heading"
      className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
    >
      <motion.div
        variants={reveal}
        initial={snap ? false : 'hidden'}
        whileInView="show"
        viewport={viewportOnce}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
            {homeFaq.eyebrow} <span className="text-[#C0A578]">/</span>{' '}
            <span dir="ltr" className="inline-block tabular-nums">
              {String(homeFaq.items.length).padStart(2, '0')}
            </span>
          </p>
          <motion.h2
            id="home-faq-heading"
            variants={wipe}
            className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]"
          >
            {homeFaq.headlineTop} <span className="text-outline">{homeFaq.headlineOutlined}</span>
          </motion.h2>
        </div>
        <p className="max-w-[320px] text-[13px] leading-relaxed text-[#7a7367]">{homeFaq.lead}</p>
      </motion.div>

      <dl className="mt-10 border-t border-[#14120F]/10 xl:mt-14">
        {homeFaq.items.map((faq) => (
          <div
            key={faq.q}
            className="grid gap-3 border-b border-[#14120F]/10 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 xl:py-7"
          >
            <dt>
              <h3 className="font-display text-[16px] font-medium leading-snug text-[#14120F] xl:text-[17px]">
                {faq.q}
              </h3>
            </dt>
            <dd className="max-w-[68ch] text-[14px] leading-[1.75] text-[#3a352f] xl:text-[15px]">
              {faq.a}
            </dd>
          </div>
        ))}
      </dl>

      <Link
        to={path(SERVICES_PATH)}
        className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#14120F]/15 px-5 py-3 text-[12px] font-medium text-[#14120F] transition-colors hover:bg-[#14120F] hover:text-white"
      >
        {ui.servicesCta}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
      </Link>
    </section>
  )
}
