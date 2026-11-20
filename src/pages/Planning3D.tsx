import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { reveal, snap, useStill, viewportOnce, wipe } from '@/lib/anim'
import { Breadcrumbs, SubpageHeader } from '@/components/SubpageHeader'
import { WhatsAppIcon } from '@/components/icons'
import { PlanningViewer } from '@/components/planning3d/PlanningViewer'
import { FaceAdvice, FaceAdviceLink, type FaceAdviceTopic } from '@/components/planning3d/FaceAdvice'
import Footer from '@/sections/Footer'
import { STAFF_LANG } from '@/lib/copy'
import { planningCopy } from '@/lib/copy/planning3d'
import { planningMeta } from '@/lib/copy/planning3d/meta'
import { useI18n } from '@/lib/i18n'
import { SERVICES_PATH, pageMeta, usePagesCopy } from '@/lib/pages'
import { whatsappUrl } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: 0.1 + i * 0.09 },
  }),
}

const card = 'rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16'
const eyebrow = 'text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]'
const h2 =
  'font-display mt-4 text-[clamp(1.7rem,3.8vw,3rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]'

const RELATED = ['maxillofacial-surgery', 'jaw-surgery', 'facial-trauma-surgery', 'tmj-treatment'] as const
const implantShortcut = {
  en: 'See inside a dental implant',
  ar: 'شاهد أجزاء زرعة الأسنان',
  fr: 'Voir les pièces d’un implant dentaire',
  ru: 'Рассмотреть части зубного имплантата',
}
const scanCredit = {
  en: 'Ozea fitted the photographic face model to this teaching skull.',
  ar: 'واءمت عيادة أوزيا نموذج الوجه المصوّر مع هذه الجمجمة التعليمية.',
  fr: 'Ozea a ajusté le visage issu du scan à ce crâne pédagogique.',
  ru: 'Ozea адаптировала фотоскан лица к этой учебной модели черепа.',
}

/**
 * The interactive 3D page: a reference skull the visitor can turn and operate
 * on, then the plain-text account of how a real plan is made. The viewer is
 * the hero; everything a crawler or a screen reader needs is in the text
 * around it, which is rendered on the server like any other page.
 */
export default function Planning3D() {
  const { lang, path, p } = useI18n()
  const { ui } = usePagesCopy()
  const copy = planningCopy[lang]
  const meta = planningMeta[lang]
  const still = useStill()
  const init = still ? false : 'hidden'
  const [guideRequest, setGuideRequest] = useState<{ topic: FaceAdviceTopic | 'implant' } | null>(null)
  useEffect(() => {
    const openLinkedImplant = () => {
      if (window.location.hash === '#implant') setGuideRequest({ topic: 'implant' })
    }
    openLinkedImplant()
    window.addEventListener('hashchange', openLinkedImplant)
    return () => window.removeEventListener('hashchange', openLinkedImplant)
  }, [])

  // The clinic reads Arabic and English, so French/Russian use the matching
  // staff-facing copy. This page asks a question; it does not imply booking.
  const staff = STAFF_LANG[lang]
  const whatsapp = whatsappUrl(staff === lang ? copy.cta.message : planningCopy[staff].cta.message)

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <div className="p-3 sm:p-4 xl:p-6">
        <section className="hero-gradient relative overflow-clip rounded-[1.75rem] xl:rounded-[2.25rem]">
          <SubpageHeader whatsapp={whatsapp} />

          <div className="relative z-10 mx-auto w-full max-w-[1760px] px-3 pb-5 pt-4 sm:px-8 sm:pt-8 xl:px-14 xl:pb-10 xl:pt-10 2xl:px-20">
            <motion.div
              variants={fadeUp}
              initial={init}
              animate="show"
              className="grid gap-x-12 gap-y-3 sm:gap-y-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
            >
              <div>
                <Breadcrumbs
                  trail={[
                    { label: ui.home, to: '/' },
                    { label: ui.services, to: SERVICES_PATH },
                    { label: meta.nav },
                  ]}
                />
                <p className="mt-4 flex sm:mt-7 items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
                  <span aria-hidden className="me-3 inline-block h-px w-5 bg-[#C0A578]" />
                  {copy.eyebrow}
                </p>
                <h1 className="font-display mt-4 max-w-[18ch] text-[clamp(1.95rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[#14120F]">
                  {copy.h1}
                </h1>
              </div>
              <p data-answer className="max-w-[58ch] text-[15px] leading-[1.7] text-[#3a352f] xl:text-[16px]">
                {copy.lead}
              </p>
              <div className="flex flex-wrap gap-x-5 text-[13px] font-medium text-[#3a352f] lg:col-start-2">
                <FaceAdviceLink lang={lang} />
                <button type="button" aria-controls="planning-viewer" onClick={() => setGuideRequest({ topic: 'implant' })} className="inline-flex min-h-11 items-center gap-1.5 text-start underline decoration-[#C0A578] underline-offset-4">
                  {implantShortcut[lang]}
                  <ArrowRight aria-hidden className="h-3.5 w-3.5 rtl:rotate-180" />
                </button>
              </div>
            </motion.div>

            <div className="mt-4 sm:mt-8 xl:mt-10">
              <PlanningViewer copy={copy} guideRequest={guideRequest} />
              <noscript>
                <figure className="rounded-2xl bg-[#f4efe7] p-5">
                  <img src="/models/previews/studio-skull.webp" alt={copy.viewer.title} width="756" height="544" className="mx-auto w-full max-w-lg rounded-xl" />
                  <figcaption className="mt-3 text-center text-sm text-[#514b41]">
                    {{ en: 'Reference skull for double-jaw surgery. The guide below explains profile, bite and facial asymmetry.', ar: 'نموذج توضيحي لجراحة الفكين. يشرح الدليل أدناه شكل الوجه من الجانب وإطباق الأسنان وعدم تماثل الوجه.', fr: 'Crâne de référence pour la chirurgie des mâchoires. Le guide ci-dessous présente le profil, l’occlusion et l’asymétrie du visage.', ru: 'Модель черепа для иллюстрации операции на обеих челюстях. Ниже можно прочитать о профиле, прикусе и асимметрии лица.' }[lang]}
                  </figcaption>
                </figure>
              </noscript>
            </div>

            <p className="mt-5 max-w-[92ch] text-[12px] leading-relaxed text-[#6b6459]">{copy.note}</p>
          </div>
        </section>
      </div>

      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        <FaceAdvice lang={lang} path={path} onSelect={(topic) => setGuideRequest({ topic })} />

        {/* How a real plan is made */}
        <section aria-labelledby="plan-process" className={card}>
          <motion.div
            variants={reveal}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className={eyebrow}>
                {copy.process.eyebrow} <span className="text-[#C0A578]">/</span>{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  {String(copy.process.steps.length).padStart(2, '0')}
                </span>
              </p>
              <motion.h2 id="plan-process" variants={wipe} className={h2}>
                {copy.process.headline} <span className="text-outline">{copy.process.outlined}</span>
              </motion.h2>
            </div>
            <p className="max-w-[340px] text-[13px] leading-relaxed text-[#6b6459]">{copy.process.lead}</p>
          </motion.div>

          <ol className="mt-10 grid gap-x-8 border-t border-[#14120F]/10 sm:grid-cols-2 xl:mt-14 xl:grid-cols-4">
            {copy.process.steps.map((step, i) => (
              <motion.li
                key={step.name}
                variants={reveal}
                custom={i * 0.6}
                initial={snap ? false : 'hidden'}
                whileInView="show"
                viewport={viewportOnce}
                className="border-b border-[#14120F]/10 py-6 xl:border-b-0 xl:py-8"
              >
                <span dir="ltr" className="text-[11px] font-medium tabular-nums tracking-[0.18em] text-[#6b6459]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-3 text-[17px] font-medium leading-snug text-[#14120F]">{step.name}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#5f584d]">{step.text}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* Questions */}
        <section aria-labelledby="plan-faq" className={card}>
          <motion.div variants={reveal} initial={snap ? false : 'hidden'} whileInView="show" viewport={viewportOnce}>
            <p className={eyebrow}>
              {copy.faq.eyebrow} <span className="text-[#C0A578]">/</span>{' '}
              <span dir="ltr" className="inline-block tabular-nums">
                {String(copy.faq.items.length).padStart(2, '0')}
              </span>
            </p>
            <motion.h2 id="plan-faq" variants={wipe} className={h2}>
              {copy.faq.headline} <span className="text-outline">{copy.faq.outlined}</span>
            </motion.h2>
          </motion.div>

          <dl className="mt-10 border-t border-[#14120F]/10 xl:mt-14">
            {copy.faq.items.map((faq) => (
              <div
                key={faq.q}
                className="grid gap-3 border-b border-[#14120F]/10 py-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 xl:py-7"
              >
                <dt>
                  <h3 className="font-display text-[16px] font-medium leading-snug text-[#14120F] xl:text-[17px]">
                    {faq.q}
                  </h3>
                </dt>
                <dd className="max-w-[68ch] text-[14px] leading-[1.7] text-[#5f584d]">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Next step */}
        <section className="hero-gradient rounded-[1.75rem] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <h2 className="font-display max-w-[20ch] text-[clamp(1.7rem,3.8vw,3rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[#14120F]">
                {copy.cta.headline}
              </h2>
              <p className="mt-5 max-w-[56ch] text-[15px] leading-[1.7] text-[#3a352f]">{copy.cta.body}</p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#14120F] py-4 pe-6 ps-7 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] sm:w-auto"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
                {copy.cta.button}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
              {ui.consultNote && <p className="mt-4 text-[12px] text-[#6b6459]">{ui.consultNote}</p>}
            </div>

            <nav aria-label={ui.relatedHeadline}>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">{ui.relatedHeadline}</p>
              <ul className="mt-3 border-t border-[#14120F]/10">
                {RELATED.map((id) => (
                  <li key={id} className="border-b border-[#14120F]/10">
                    <Link
                      to={path(pageMeta(id).path)}
                      className="group flex items-center justify-between gap-4 py-3.5 text-[15px] font-medium text-[#14120F]"
                    >
                      {p.content[id].nav}
                      <ArrowUpRight className="h-4 w-4 text-[#6b6459] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-10 space-y-1 text-[11px] leading-relaxed text-[#6b6459]">
            <p>{copy.credit}</p>
            <p>{scanCredit[lang]}{' '}
              <a href="https://github.com/mrdoob/three.js/tree/r180/examples/models/gltf/LeePerrySmith" className="underline">Infinite, 3D Head Scan · Lee Perry-Smith / Infinite-Realities</a>
              {' · '}<a href="https://creativecommons.org/licenses/by/3.0/" className="underline">CC BY 3.0</a>
            </p>
          </div>
        </section>

        <Footer ctaOverride={{ label: copy.cta.button, whatsapp }} />
      </main>
    </div>
  )
}
