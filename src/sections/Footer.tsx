import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router'
import { snap } from '@/lib/anim'
import { ArrowRight, Instagram, MapPin, Phone } from 'lucide-react'
import implant from '@/assets/implant.png'
import { BrandLogo } from '@/components/BrandLogo'
import { WhatsAppIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n'
import { site, whatsappUrl } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

type Social = {
  key: 'instagram' | 'whatsapp' | 'googleMaps'
  href: string
  Icon: ComponentType<{ className?: string }>
}

export default function Footer() {
  // The footer is shared with the doctor profiles, where a bare "#services"
  // points at nothing. Off the homepage the section links become "/#services".
  const { pathname } = useLocation()
  const home = pathname === '/' ? '' : '/'
  const { c, t } = useI18n()
  const whatsapp = whatsappUrl(c.site.whatsappMessage)

  const socials: Social[] = [
    { key: 'instagram', href: site.instagram, Icon: Instagram },
    { key: 'whatsapp', href: whatsapp, Icon: WhatsAppIcon },
    { key: 'googleMaps', href: site.maps.link, Icon: MapPin },
  ]

  const sitemap: [label: string, href: string][] = [
    [c.nav.home, '#top'],
    [c.nav.services, '#services'],
    [c.nav.clinic, '#about'],
    [c.nav.team, '#team'],
    [c.nav.hospitals, '#hospitals'],
    [c.nav.testimonials, '#testimonials'],
    [c.nav.location, '#location'],
  ]

  return (
    <section id="contact" className="relative overflow-hidden rounded-[1.75rem] bg-[#14120F] xl:rounded-[2.25rem]">
      {/* Glow + watermark */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[50%] w-[70%] -translate-x-1/2 rounded-full bg-[#C0A578]/20 blur-3xl" />
      <div
        aria-hidden
        className="font-display pointer-events-none absolute -bottom-[6vw] left-1/2 select-none whitespace-nowrap text-[24vw] font-semibold leading-none tracking-tighter text-white/[0.04] max-lg:hidden"
      >
        {c.site.short}
      </div>

      {/* CTA */}
      <div className="relative px-6 pb-14 pt-14 text-center sm:px-10 sm:pt-20 xl:px-14 xl:pt-24">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/50">
            {c.footer.eyebrow} <span className="text-[#CFC8BC]">/</span>
          </p>
          <h2 className="font-display mx-auto mt-5 max-w-[820px] text-[clamp(2.2rem,5.5vw,4.6rem)] font-medium uppercase leading-[1.03] tracking-tight text-white">
            {c.footer.headlineTop}{' '}
            <span className="text-[#C0A578]">{c.footer.headlineAccent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[420px] text-[14px] leading-relaxed text-white/60">
            {c.footer.lead}
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[13px] font-semibold text-[#14120F] transition-transform hover:scale-[1.04]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#1f7a4d]" />
              {c.footer.book}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
            {site.phones.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                dir="ltr"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/20 px-6 py-4 text-[13px] font-medium text-white/80 transition-colors hover:border-white/50 hover:text-white"
              >
                <Phone className="h-4 w-4" /> {p.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Floating implant. Decorative and symmetric — a pair, one per edge,
            so it needs no direction of its own. */}
        <motion.img
          src={implant}
          alt=""
          aria-hidden
          initial={snap ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="pointer-events-none absolute -left-10 bottom-0 hidden h-[340px] -rotate-12 object-contain opacity-90 drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)] xl:block 2xl:left-4"
        />
        <motion.img
          src={implant}
          alt=""
          aria-hidden
          initial={snap ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
          className="pointer-events-none absolute -right-10 bottom-0 hidden h-[340px] rotate-12 object-contain opacity-90 drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)] xl:block 2xl:right-4"
        />
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 px-6 py-10 sm:px-10 xl:px-14 2xl:px-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div>
            <BrandLogo variant="full" className="h-32 w-auto" alt={c.site.name} />
            <p className="mt-5 max-w-[280px] text-[12px] leading-relaxed text-white/50">
              {t(c.footer.brandBlurb, { doctor: c.site.doctor, specialty: c.site.specialty })}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              {c.footer.explore}
            </p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
              {sitemap.map(([label, href]) => (
                <li key={href}>
                  <a href={`${home}${href}`} className="transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              {c.footer.visitUs}
            </p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
              <li>
                <a
                  href={site.maps.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 transition-colors hover:text-white"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/40" />
                  <span>
                    {c.site.address.street}
                    <br />
                    {c.site.address.city}
                  </span>
                </a>
              </li>
              <li>
                {c.site.hours.days} ·{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  {c.site.hours.time}
                </span>
              </li>
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    dir="ltr"
                    className="flex items-center gap-2 transition-colors hover:text-white rtl:justify-end"
                  >
                    <Phone className="h-3.5 w-3.5 text-white/40" /> {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="flex items-center gap-2 transition-colors hover:text-white rtl:justify-end"
                >
                  <Instagram className="h-3.5 w-3.5 text-white/40" /> {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 md:flex-col">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.common[s.key]}
                title={c.common[s.key]}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                <s.Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/40">
          <p>{t(c.footer.rights, { clinic: c.site.name })}</p>
          <div className="flex gap-6">
            <a href={`${home}#top`} className="transition-colors hover:text-white/70">
              {c.footer.privacy}
            </a>
            <a href={`${home}#top`} className="transition-colors hover:text-white/70">
              {c.footer.terms}
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
