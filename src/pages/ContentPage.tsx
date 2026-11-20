import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react'
import { reveal, snap, useStill, viewportOnce } from '@/lib/anim'
import { DoctorPortrait } from '@/components/DoctorPortrait'
import { Breadcrumbs, SubpageHeader, type Crumb } from '@/components/SubpageHeader'
import { WhatsAppIcon } from '@/components/icons'
import Footer from '@/sections/Footer'
import { STAFF_LANG } from '@/lib/copy'
import type { PageId } from '@/lib/copy/pages/types'
import { useI18n } from '@/lib/i18n'
import {
  MEDICAL_REVIEW,
  SERVICES_PATH,
  TOPIC_EN,
  pageMeta,
  usePage,
  usePagesCopy,
} from '@/lib/pages'
import { useDoctors } from '@/lib/team'
import { site, whatsappUrl } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: 0.1 + i * 0.09 },
  }),
}

const card = 'rounded-[1.75rem] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16'
const eyebrow = 'text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]'
const h2 =
  'font-display mt-4 text-[clamp(1.7rem,3.8vw,3rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]'

/**
 * One long-form page: a treatment, the maxillofacial overview, or the
 * travelling-patients page. All of them are the same document — a direct
 * answer, the facts, the detail, the process, who treats it, the questions —
 * because that is the order a patient reads in and the structure a search
 * engine or an AI assistant can lift a passage out of.
 *
 * The page is laid out by `lib/pages.ts` and worded by `lib/copy/pages`; the
 * structured data for it is built from the same two in `lib/seo.ts`.
 */
export default function ContentPage({ id }: { id: PageId }) {
  const { t, lang, p, path } = useI18n()
  const { ui } = usePagesCopy()
  const page = usePage(id)
  const allDoctors = useDoctors()
  const still = useStill()
  const init = still ? false : 'hidden'

  const doctors = page.doctors
    .map((slug) => allDoctors.find((d) => d.slug === slug))
    .filter((d) => d !== undefined)

  // The message is written in a language the clinic reads: the French and
  // Russian copy keeps `whatsappMessage` in English, and names the treatment
  // in English to match (see STAFF_LANG).
  const whatsapp = whatsappUrl(
    t(ui.whatsappMessage, { topic: STAFF_LANG[lang] === lang ? page.nav : TOPIC_EN[id] }),
  )

  const trail: Crumb[] = [
    { label: ui.home, to: '/' },
    ...(page.kind === 'procedure' ? [{ label: ui.services, to: SERVICES_PATH }] : []),
    { label: page.nav },
  ]

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <div className="p-3 sm:p-4 xl:p-6">
        <section className="hero-gradient relative overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(56%_54%_at_72%_44%,rgba(255,255,255,0.82),rgba(255,255,255,0)_70%)]"
          />

          <SubpageHeader whatsapp={whatsapp} />

          <div className="relative z-10 mx-auto grid w-full max-w-[1760px] gap-y-10 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-x-12 xl:px-14 xl:pb-14 xl:pt-12 2xl:px-20">
            <motion.div variants={fadeUp} initial={init} animate="show">
              <Breadcrumbs trail={trail} />

              <p className="mt-7 flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
                <span aria-hidden className="me-3 inline-block h-px w-5 bg-[#C0A578]" />
                {page.eyebrow}
              </p>

              <h1 className="font-display mt-4 max-w-[20ch] text-[clamp(1.95rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[#14120F]">
                {page.h1}
              </h1>

              {/* The direct answer. It is written to stand on its own: what the
                  treatment is, who performs it and where. */}
              <p
                data-answer
                className="mt-6 max-w-[62ch] text-[15px] leading-[1.7] text-[#3a352f] xl:text-[16px]"
              >
                {page.answer}
              </p>

              <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(ui.bookAria, { topic: page.nav })}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#14120F] py-4 ps-7 pe-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
                  {ui.book}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </a>
                <a
                  href={`tel:${site.phones[0].tel}`}
                  dir="ltr"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/60 px-6 py-4 text-[13px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white sm:w-auto"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="tabular-nums">{site.phones[0].label}</span>
                </a>
              </div>

              {ui.consultNote && (
                <p className="mt-4 text-[12px] text-[#6b6459]">{ui.consultNote}</p>
              )}
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={1}
              initial={init}
              animate="show"
              className="relative mx-auto w-full max-w-[420px] lg:max-w-none"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/45 backdrop-blur">
                <img
                  src={page.art}
                  alt=""
                  width={620}
                  height={775}
                  decoding="async"
                  className="aspect-[4/5] w-full object-contain p-8 drop-shadow-[0_18px_28px_rgba(20,18,15,0.22)]"
                />
              </div>
            </motion.div>
          </div>

          {/* At a glance */}
          <motion.dl
            variants={fadeUp}
            custom={2}
            initial={init}
            animate="show"
            aria-label={ui.atAGlance}
            className="relative z-10 mx-auto grid w-full max-w-[1760px] gap-px overflow-hidden border-t border-[#14120F]/10 bg-[#14120F]/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {page.facts.map((fact) => (
              <div key={fact.label} className="bg-[#EFEBE3] px-5 py-5 sm:px-8 xl:px-10 xl:py-6">
                <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6f685c]">
                  {fact.label}
                </dt>
                <dd className="font-display mt-2 text-[15px] font-medium leading-snug text-[#14120F] xl:text-[16px]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </section>
      </div>

      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        {/* The detail */}
        <article className={`${card} bg-white`}>
          <div className="divide-y divide-[#14120F]/10">
            {page.sections.map((section, i) => (
              <motion.section
                key={section.heading}
                variants={reveal}
                initial={snap ? false : 'hidden'}
                whileInView="show"
                viewport={viewportOnce}
                className="grid gap-5 py-8 first:pt-0 last:pb-0 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 xl:py-10"
              >
                <h2 className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium leading-[1.15] tracking-[-0.01em] text-[#14120F]">
                  <span className="me-3 text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#C0A578]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {section.heading}
                </h2>
                <div className="max-w-[68ch] space-y-4 text-[14px] leading-[1.75] text-[#3a352f] xl:text-[15px]">
                  {section.list && (
                    <ul className="space-y-2.5">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden className="mt-[10px] h-1 w-1 shrink-0 bg-[#C0A578]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </motion.section>
            ))}
          </div>
        </article>

        {/* The process */}
        {page.steps && page.steps.length > 0 && (
          <section aria-labelledby="steps-heading" className={`${card} hero-gradient`}>
            <motion.div
              variants={reveal}
              initial={snap ? false : 'hidden'}
              whileInView="show"
              viewport={viewportOnce}
            >
              <p className={eyebrow}>
                {ui.stepsEyebrow} <span className="text-[#C0A578]">/</span>{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  01–{String(page.steps.length).padStart(2, '0')}
                </span>
              </p>
              <h2 id="steps-heading" className={h2}>
                {ui.stepsHeadline} <span className="text-outline">{ui.stepsOutlined}</span>
              </h2>
            </motion.div>

            <ol className="mt-10 grid gap-8 border-t border-[#14120F]/10 pt-8 sm:grid-cols-2 lg:grid-cols-4 xl:mt-14">
              {page.steps.map((step, i) => (
                <motion.li
                  key={step.name}
                  variants={reveal}
                  custom={i}
                  initial={snap ? false : 'hidden'}
                  whileInView="show"
                  viewport={viewportOnce}
                >
                  <p className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#C0A578]">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display mt-3 text-[16px] font-medium text-[#14120F]">
                    {step.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#5f584d]">{step.text}</p>
                </motion.li>
              ))}
            </ol>
          </section>
        )}

        {/* Who treats it */}
        {doctors.length > 0 && (
          <section aria-labelledby="clinicians-heading" className={`${card} bg-white`}>
            <p className={eyebrow}>
              {ui.surgeonsEyebrow} <span className="text-[#C0A578]">/</span>
            </p>
            <h2
              id="clinicians-heading"
              className="font-display mt-4 text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]"
            >
              {ui.surgeonsHeadline}
            </h2>

            <ul className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {doctors.map((d) => (
                <li key={d.slug}>
                  <Link
                    to={path(`/team/${d.slug}`)}
                    className="group flex h-full items-center gap-4 rounded-2xl border border-[#14120F]/10 p-3 transition-colors hover:border-[#C0A578]/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14120F]"
                  >
                    <DoctorPortrait
                      src={d.portrait.card}
                      alt={`${d.name} — ${d.title}`}
                      initials={d.initials}
                      className="h-20 w-20 shrink-0 rounded-xl object-cover object-top"
                      monogramClassName="h-20 w-20 shrink-0 rounded-xl"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="font-display block text-[15px] font-semibold text-[#14120F]">
                        {d.name}
                      </span>
                      <span className="mt-1 block text-[12px] leading-snug text-[#5f584d]">
                        {d.title}
                      </span>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#6f685c] transition-colors group-hover:text-[#14120F]">
                        {ui.viewProfile}
                        <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Questions. Every answer is on the page, open — nothing is hidden
            behind a click, so the whole exchange can be read, searched and
            quoted. The same pairs are published as FAQPage structured data. */}
        <section aria-labelledby="faq-heading" className={`${card} bg-white`}>
          <p className={eyebrow}>
            {ui.faqEyebrow} <span className="text-[#C0A578]">/</span>{' '}
            <span dir="ltr" className="inline-block tabular-nums">
              {String(page.faqs.length).padStart(2, '0')}
            </span>
          </p>
          <h2 id="faq-heading" className={h2}>
            {ui.faqHeadline} <span className="text-outline">{ui.faqOutlined}</span>
          </h2>

          <dl className="mt-10 border-t border-[#14120F]/10 xl:mt-14">
            {page.faqs.map((faq) => (
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

          <p className="mt-8 max-w-[80ch] text-[12px] leading-relaxed text-[#6b6459]">
            {ui.disclaimer}
          </p>
          {MEDICAL_REVIEW && doctors[0] && (
            <p className="mt-3 text-[12px] font-medium text-[#3a352f]">
              {t(ui.reviewedBy, { name: doctors[0].name, date: MEDICAL_REVIEW.date })}
            </p>
          )}
        </section>

        {/* Related */}
        <section aria-labelledby="related-heading" className={`${card} bg-[#14120F]`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/40">
                {ui.relatedEyebrow} <span className="text-[#C0A578]">/</span>
              </p>
              <h2
                id="related-heading"
                className="font-display mt-4 text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium uppercase leading-[1.05] tracking-tight text-white"
              >
                {ui.relatedHeadline}
              </h2>
            </div>
            <Link
              to={path(SERVICES_PATH)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-white hover:text-[#14120F]"
            >
              {ui.allServices}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          <ul className="mt-9 grid gap-4 md:grid-cols-3">
            {page.related.map((relatedId) => {
              const related = p.content[relatedId]
              return (
                <li key={relatedId}>
                  <Link
                    to={path(pageMeta(relatedId).path)}
                    className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-white/15 p-5 transition-colors hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                  >
                    <span>
                      <span className="font-display block text-[15px] font-medium text-white">
                        {related.nav}
                      </span>
                      <span className="mt-2 block text-[12px] leading-relaxed text-white/50">
                        {related.blurb}
                      </span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors group-hover:bg-white group-hover:text-[#14120F]">
                      <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <Footer />
      </main>
    </div>
  )
}
