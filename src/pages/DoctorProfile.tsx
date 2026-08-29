import { Link, Navigate, useParams } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { snap } from '@/lib/anim'
import { BrandLogo } from '@/components/BrandLogo'
import { DoctorPortrait } from '@/components/DoctorPortrait'
import { LanguageToggle } from '@/components/LanguageToggle'
import { WhatsAppIcon } from '@/components/icons'
import Footer from '@/sections/Footer'
import { doctorSlugs, useDoctor, useDoctors } from '@/lib/team'
import { useI18n } from '@/lib/i18n'
import { useDocumentMeta } from '@/lib/useDocumentMeta'
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

/** Softens the crop at the base of a cut-out portrait into the card. */
const PORTRAIT_MASK =
  'linear-gradient(to bottom, #000 58%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.12) 93%, transparent 100%)'

export default function DoctorProfile() {
  const { slug } = useParams()
  const { c, t } = useI18n()
  const doctors = useDoctors()
  const doctor = useDoctor(slug)
  const reduced = useReducedMotion()
  const still = snap || !!reduced
  const init = still ? false : 'hidden'

  // Per-profile title and description. Both hooks run unconditionally — an
  // unknown slug still renders a redirect below, and a hook cannot sit behind
  // that early return.
  useDocumentMeta(
    doctor
      ? t(c.profile.docTitle, { name: doctor.name, title: doctor.title, clinic: c.site.name })
      : c.meta.title,
    doctor
      ? t(c.profile.docDescription, {
          name: doctor.name,
          title: doctor.title,
          clinic: c.site.name,
          lead: doctor.lead,
        })
      : c.meta.description,
  )

  // Unknown slug: send the visitor to the team band rather than a dead end.
  if (!doctor) return <Navigate to="/#team" replace />

  const index = doctorSlugs.indexOf(doctor.slug) + 1
  const others = doctors.filter((d) => d.slug !== doctor.slug)
  const whatsapp = whatsappUrl(
    t(c.profile.whatsappMessage, { name: doctor.name, clinic: c.site.name }),
  )

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <div className="p-3 sm:p-4 xl:p-6">
        <section className="hero-gradient relative overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem]">
          {/* Light pooled where the portrait lands */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(56%_54%_at_72%_44%,rgba(255,255,255,0.82),rgba(255,255,255,0)_70%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 hidden grid-cols-12 px-14 xl:grid 2xl:px-20"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="border-s border-white/30 last:border-e" />
            ))}
          </div>

          {/* Header */}
          <header className="relative z-20 flex items-center justify-between gap-4 px-5 pt-6 sm:px-8 xl:px-14 xl:pt-9 2xl:px-20">
            <Link to="/" className="flex items-center gap-3" aria-label={c.site.name}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14120F]">
                <BrandLogo alt="" className="h-9 w-9" />
              </span>
              <span className="leading-none">
                <span
                  lang="en"
                  dir="ltr"
                  style={{ letterSpacing: '0.12em' }}
                  className="font-display block text-lg font-semibold text-[#14120F]"
                >
                  {c.site.short}
                </span>
                <span className="font-engraved mt-1 block text-[8px] uppercase tracking-[0.3em] text-[#8a8172]">
                  {c.site.dentalClinic}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <Link
                to="/#team"
                className="hidden items-center gap-2 rounded-full border border-[#14120F]/15 bg-white/70 px-4 py-2 text-[12px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white sm:inline-flex"
              >
                <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
                {c.profile.allTeam}
              </Link>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#14120F] px-5 py-2.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.03]"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
                {c.common.whatsapp}
              </a>
            </div>
          </header>

          {/* Identity */}
          <div className="relative z-10 mx-auto grid w-full max-w-[1760px] gap-y-8 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-10 lg:items-end xl:px-14 xl:pb-14 xl:pt-12 2xl:px-20">
            <motion.div variants={fadeUp} initial={init} animate="show">
              <p className="flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
                <span aria-hidden className="me-3 inline-block h-px w-5 bg-[#C0A578]" />
                {c.profile.ourTeam} <span className="mx-2 text-[#C0A578]">/</span>
                <span dir="ltr" className="tabular-nums">
                  {String(index).padStart(2, '0')}–{String(doctors.length).padStart(2, '0')}
                </span>
              </p>

              <h1 className="font-display mt-5 text-[clamp(1.95rem,4.6vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.02em] text-[#14120F]">
                {doctor.name}
              </h1>

              <p className="mt-4 text-[13px] font-medium text-[#3a352f] sm:text-[15px]">
                {doctor.title}
              </p>
              <span aria-hidden className="mt-4 inline-block h-px w-10 bg-[#C0A578]" />
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#5f584d]">
                {doctor.specialty}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2">
                {doctor.credentials.map((c) => (
                  <li
                    key={c}
                    className="glass-chip rounded-full px-3.5 py-1.5 text-[11px] font-medium text-[#3a352f]"
                  >
                    {c}
                  </li>
                ))}
              </ul>

              <p className="mt-7 max-w-[46ch] text-[14px] leading-[1.65] text-[#5f584d] xl:text-[15px]">
                {doctor.lead}
              </p>

              <div className="mt-8 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(c.profile.discussAria, { name: doctor.name })}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#14120F] py-4 ps-7 pe-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
                  {c.profile.discuss}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </a>
                <a
                  href={`tel:${site.phones[0].tel}`}
                  dir="ltr"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/60 px-6 py-4 text-[13px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white sm:w-auto"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="tabular-nums">
                    {t(c.profile.call, { phone: site.phones[0].label })}
                  </span>
                </a>
              </div>

              <dl className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-[#14120F]/10 pt-5 text-[11px] text-[#6b6459]">
                <div className="flex min-w-0 items-center gap-2">
                  <dt className="sr-only">{c.profile.clinic}</dt>
                  <dd className="min-w-0">
                    <a
                      href={site.maps.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {c.site.address.street} — {c.site.address.short}
                    </a>
                  </dd>
                </div>
                <span aria-hidden className="text-[#C0A578]">
                  /
                </span>
                <div className="flex items-center gap-2">
                  <dt className="uppercase tracking-[0.16em]">{c.profile.hours}</dt>
                  <dd className="tabular-nums">
                    {c.site.hours.days} ·{' '}
                    <span dir="ltr" className="inline-block">
                      {c.site.hours.time}
                    </span>
                  </dd>
                </div>
              </dl>
            </motion.div>

            {/* Portrait */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial={init}
              animate="show"
              className="relative mx-auto w-full max-w-[440px] lg:max-w-none"
            >
              {doctor.portrait.cutout ? (
                <DoctorPortrait
                  src={doctor.portrait.hero}
                  alt={`${doctor.name} — ${doctor.title}`}
                  initials={doctor.initials}
                  loading="eager"
                  style={{
                    maskImage: PORTRAIT_MASK,
                    WebkitMaskImage: PORTRAIT_MASK,
                    filter: 'contrast(1.04) saturate(0.93)',
                  }}
                  className="relative z-10 mx-auto block h-[300px] w-auto object-contain object-bottom sm:h-[380px] lg:h-[460px] xl:h-[520px]"
                  monogramClassName="mx-auto flex h-[300px] w-full rounded-[1.5rem] sm:h-[380px] lg:h-[460px] xl:h-[520px]"
                />
              ) : (
                <div className="relative z-10 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/50 p-2 backdrop-blur">
                  <DoctorPortrait
                    src={doctor.portrait.hero}
                    alt={`${doctor.name} — ${doctor.title}`}
                    initials={doctor.initials}
                    loading="eager"
                    style={{ filter: 'contrast(1.03) saturate(0.94)' }}
                    className="aspect-[4/5] w-full rounded-[1.15rem] object-cover object-top"
                    monogramClassName="aspect-[4/5] w-full rounded-[1.15rem]"
                  />
                </div>
              )}

              <p className="relative z-10 mt-4 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b6459] lg:text-start">
                {doctor.name} <span className="text-[#C0A578]">/</span> {c.site.name}
              </p>
            </motion.div>
          </div>
        </section>
      </div>

      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        {/* Scope of practice */}
        <section
          aria-labelledby="focus-heading"
          className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
        >
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <motion.div
              variants={fadeUp}
              initial={snap ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
                {c.profile.scope} <span className="text-[#C0A578]">/</span>{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  01–{String(doctor.focus.length).padStart(2, '0')}
                </span>
              </p>
              <h2
                id="focus-heading"
                className="font-display mt-4 text-[clamp(1.7rem,3.8vw,3rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]"
              >
                {t(c.profile.whatOperates, {
                  name: doctor.name.split(' ').slice(0, 2).join(' '),
                })}{' '}
                <span className="text-outline">{c.profile.operatesOn}</span>
              </h2>
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={1}
              initial={snap ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="max-w-[400px] text-[14px] leading-relaxed text-[#7a7367] lg:justify-self-end"
            >
              {doctor.intro}
            </motion.p>
          </div>

          <ul className="mt-10 border-t border-[#14120F]/10 md:grid md:grid-cols-2 md:gap-x-10 xl:mt-14">
            {doctor.focus.map(({ name, descriptor }, i) => (
              <motion.li
                key={name}
                variants={fadeUp}
                custom={i * 0.4}
                initial={snap ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="group border-b border-[#14120F]/10"
              >
                <div className="flex min-h-[56px] flex-col justify-center gap-x-4 py-3 xl:flex-row xl:items-baseline xl:py-4">
                  <span className="flex items-baseline gap-3">
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#6b6459] transition-colors group-hover:text-[#C0A578]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-[#3a352f] transition-colors group-hover:text-[#14120F] xl:text-[16px]">
                      {name}
                    </span>
                  </span>
                  <span className="ms-[26px] text-[11px] leading-snug text-[#6b6459] xl:ms-auto xl:max-w-[52%] xl:text-end">
                    {descriptor}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </section>

        {/* Curriculum vitae */}
        <section
          aria-labelledby="cv-heading"
          className="hero-gradient rounded-[1.75rem] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
        >
          <motion.div
            variants={fadeUp}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
              {c.profile.cvEyebrow} <span className="text-[#C0A578]">/</span>
            </p>
            <h2
              id="cv-heading"
              className="font-display mt-4 max-w-[760px] text-[clamp(1.7rem,3.8vw,3rem)] font-medium uppercase leading-[1.05] tracking-tight text-[#14120F]"
            >
              {c.profile.cvHeadline}{' '}
              <span className="text-outline">{c.profile.cvOutlined}</span>
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-8 border-t border-[#14120F]/10 pt-8 md:grid-cols-3 md:gap-10 xl:mt-14">
            {doctor.cv.map((block, i) => (
              <motion.div
                key={block.heading}
                variants={fadeUp}
                custom={i}
                initial={snap ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-50px' }}
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
                  <span className="tabular-nums text-[#C0A578]">
                    {String(i + 1).padStart(2, '0')}
                  </span>{' '}
                  {block.heading}
                </p>
                <ul className="mt-4 space-y-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[13px] leading-relaxed text-[#3a352f]">
                      <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 bg-[#C0A578]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* The rest of the team */}
        {others.length > 0 && (
          <section
            aria-labelledby="others-heading"
            className="rounded-[1.75rem] bg-[#14120F] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
          >
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/40">
              {c.profile.alsoInTeam} <span className="text-[#C0A578]">/</span>
            </p>
            <h2
              id="others-heading"
              className="font-display mt-4 text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium uppercase leading-[1.05] tracking-tight text-white"
            >
              {c.profile.anotherOpinion}
            </h2>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to={`/team/${o.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/15 p-3 transition-colors hover:border-white/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  <DoctorPortrait
                    src={o.portrait.card}
                    alt={`${o.name} — ${o.title}`}
                    initials={o.initials}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover object-top"
                    monogramClassName="h-16 w-16 shrink-0 rounded-xl"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-white">
                      {o.name}
                    </span>
                    <span className="mt-1 block text-[11px] text-white/50">{o.role}</span>
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/70 transition-colors group-hover:bg-white group-hover:text-[#14120F]">
                    <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Footer />
      </main>
    </div>
  )
}
