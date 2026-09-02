import { useRef, type ComponentType } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLocation } from 'react-router'
import { ease, reveal, snap, useStill, viewportOnce, wipe } from '@/lib/anim'
import { ArrowRight, Instagram, MapPin, Phone } from 'lucide-react'
import implant from '@/assets/implant.webp'
import { BrandLogo } from '@/components/BrandLogo'
import { WhatsAppIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n'
import { site, whatsappUrl } from '@/lib/site'

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
  const still = useStill()
  const whatsapp = whatsappUrl(c.site.whatsappMessage)

  // Scroll-linked depth. As the section travels through the viewport the two
  // implants drift 24px in opposite directions and the watermark lags 40px, so
  // the decoration sits on a different plane from the type. Transform only, and
  // when nothing should move the elements get no inline style at all.
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const implantRiseY = useTransform(scrollYProgress, [0, 1], [24, -24])
  const implantSinkY = useTransform(scrollYProgress, [0, 1], [-24, 24])
  const watermarkY = useTransform(scrollYProgress, [0, 1], [-40, 40])

  const socials: Social[] = [
    { key: 'instagram', href: site.instagram, Icon: Instagram },
    { key: 'whatsapp', href: whatsapp, Icon: WhatsAppIcon },
    { key: 'googleMaps', href: site.maps.link, Icon: MapPin },
  ]

  const sitemap: [label: string, href: string][] = [
    [c.nav.home, '#top'],
    [c.nav.services, '#services'],
    [c.nav.cases, '#cases'],
    [c.nav.clinic, '#about'],
    [c.nav.team, '#team'],
    [c.nav.hospitals, '#hospitals'],
    [c.nav.testimonials, '#testimonials'],
    [c.nav.location, '#location'],
  ]

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden rounded-[1.75rem] bg-[#14120F] xl:rounded-[2.25rem]"
    >
      {/* Glow + watermark */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[50%] w-[70%] -translate-x-1/2 rounded-full bg-[#C0A578]/20 blur-3xl" />
      <motion.div
        aria-hidden
        style={still ? undefined : { y: watermarkY }}
        className="font-display pointer-events-none absolute -bottom-[7vw] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[28vw] font-semibold leading-none tracking-tighter text-white/[0.04] lg:-bottom-[6vw] lg:translate-x-0 lg:text-[24vw]"
      >
        {c.site.short}
      </motion.div>

      {/* CTA */}
      <div className="relative px-6 pb-14 pt-14 text-center sm:px-10 sm:pt-20 xl:px-14 xl:pt-24">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-white/50">
            {c.footer.eyebrow} <span className="text-[#CFC8BC]">/</span>
          </p>
          <motion.h2
            variants={wipe}
            className="font-display mx-auto mt-5 max-w-[820px] text-[clamp(2.2rem,5.5vw,4.6rem)] font-medium uppercase leading-[1.03] tracking-tight text-white"
          >
            {c.footer.headlineTop}{' '}
            <span className="text-[#C0A578]">{c.footer.headlineAccent}</span>
          </motion.h2>
          <p className="mx-auto mt-6 max-w-[420px] text-[14px] leading-relaxed text-white/60">
            {c.footer.lead}
          </p>
          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-[13px] font-semibold text-[#14120F] transition-transform hover:scale-[1.04] active:scale-[0.97] sm:justify-start"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#1f7a4d]" />
              {c.footer.book}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </a>
            {/* Two numbers side by side on a phone: at 12px the label plus its
                icon clears a half column at 360px, and stacking them made the
                call-to-action three rows tall. */}
            <div className="grid grid-cols-1 gap-2.5 min-[360px]:grid-cols-2 sm:contents">
              {site.phones.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  dir="ltr"
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 px-2 py-3.5 text-[12px] font-medium text-white/80 transition-[transform,color,border-color] hover:border-white/50 hover:text-white active:scale-[0.97] sm:gap-2.5 sm:px-6 sm:py-4 sm:text-[13px]"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="tabular-nums">{p.label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Floating implant. Decorative and symmetric — a pair, one per edge,
            so it needs no direction of its own. The Tailwind tilt shares the
            `transform` framer writes to, so the same rotation is restated in
            the motion style whenever a scroll-linked y is applied. */}
        <motion.img
          src={implant}
          alt=""
          aria-hidden
          initial={snap ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          style={still ? undefined : { y: implantRiseY, rotate: -12 }}
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
          style={still ? undefined : { y: implantSinkY, rotate: 12 }}
          className="pointer-events-none absolute -right-10 bottom-0 hidden h-[340px] rotate-12 object-contain opacity-90 drop-shadow-[0_25px_40px_rgba(0,0,0,0.45)] xl:block 2xl:right-4"
        />
      </div>

      {/* Footer */}
      <footer className="relative border-t border-white/10 px-6 py-10 sm:px-10 xl:px-14 2xl:px-16">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-10">
          <div>
            <BrandLogo variant="full" tone="dark" className="w-[150px] sm:w-[196px]" />
            <p className="mt-5 max-w-[280px] text-[12px] leading-relaxed text-white/50">
              {t(c.footer.brandBlurb, { doctor: c.site.doctor, specialty: c.site.specialty })}
            </p>
          </div>

          <div className="border-t border-white/10 pt-8 md:border-0 md:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              {c.footer.explore}
            </p>
            {/* Eight links, one per line, ran the phone footer 250px longer
                than it needed to be — two columns until the sidebar layout
                takes over at md. */}
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px] text-white/70 md:grid-cols-1">
              {sitemap.map(([label, href]) => (
                <li key={href}>
                  <a
                    href={`${home}${href}`}
                    className="relative transition-colors after:absolute after:-bottom-0.5 after:start-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white/60 after:transition-transform after:duration-300 hover:text-white hover:after:scale-x-100 rtl:after:origin-right"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/10 pt-8 md:border-0 md:pt-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
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
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/60" />
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
                    <Phone className="h-3.5 w-3.5 text-white/60" /> {p.label}
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
                  <Instagram className="h-3.5 w-3.5 text-white/60" /> {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 pt-8 md:items-start md:border-0 md:pt-0 md:flex-col">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.common[s.key]}
                title={c.common[s.key]}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-[color,border-color,transform] hover:-translate-y-0.5 hover:border-white/50 hover:text-white active:scale-[0.97]"
              >
                <s.Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 pe-14 text-[11px] text-white/60 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:pe-0">
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
