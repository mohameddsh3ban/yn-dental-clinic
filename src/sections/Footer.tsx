import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { ArrowRight, Instagram, MapPin, Phone } from 'lucide-react'
import implant from '@/assets/implant.png'
import { BrandLogo } from '@/components/BrandLogo'
import { WhatsAppIcon } from '@/components/icons'
import { site } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

const socials: { label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: 'Instagram', href: site.instagram, Icon: Instagram },
  { label: 'WhatsApp', href: site.whatsapp, Icon: WhatsAppIcon },
  { label: 'Google Maps', href: site.maps.link, Icon: MapPin },
]

export default function Footer() {
  return (
    <section id="contact" className="relative overflow-hidden rounded-[1.75rem] bg-[#14120F] xl:rounded-[2.25rem]">
      {/* Glow + watermark */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[50%] w-[70%] -translate-x-1/2 rounded-full bg-[#C0A578]/20 blur-3xl" />
      <div
        aria-hidden
        className="font-display pointer-events-none absolute -bottom-[6vw] left-1/2 select-none whitespace-nowrap text-[24vw] font-semibold leading-none tracking-tighter text-white/[0.04] max-lg:hidden"
      >
        {site.short}
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
            Ready when you are <span className="text-[#CFC8BC]">/</span>
          </p>
          <h2 className="font-display mx-auto mt-5 max-w-[820px] text-[clamp(2.2rem,5.5vw,4.6rem)] font-medium uppercase leading-[1.03] tracking-tight text-white">
            Your best smile starts with{' '}
            <span className="text-[#C0A578]">one visit</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[420px] text-[14px] leading-relaxed text-white/60">
            Same-week appointments, transparent pricing, and a team that treats
            you like a person — not a chart number.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-full bg-white py-4 pl-6 pr-6 text-[13px] font-semibold text-[#14120F] transition-transform hover:scale-[1.04]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#1f7a4d]" />
              Book on WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

        {/* Floating implant */}
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
            <BrandLogo variant="full" className="h-32 w-auto" />
            <p className="mt-5 max-w-[280px] text-[12px] leading-relaxed text-white/50">
              {site.doctor} — {site.specialty}. Modern dentistry with gentle
              care, delivered calmly on every single visit.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Explore</p>
            <ul className="mt-4 space-y-2.5 text-[13px] text-white/70">
              {[
                ['Home', '#top'],
                ['Our Services', '#services'],
                ['Our Clinic', '#about'],
                ['Testimonials', '#testimonials'],
                ['Location', '#location'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">Visit us</p>
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
                    {site.address.street}
                    <br />
                    {site.address.city}
                  </span>
                </a>
              </li>
              <li>
                {site.hours.days} · {site.hours.time}
              </li>
              {site.phones.map((p) => (
                <li key={p.tel}>
                  <a
                    href={`tel:${p.tel}`}
                    dir="ltr"
                    className="flex items-center gap-2 transition-colors hover:text-white"
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
                  className="flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Instagram className="h-3.5 w-3.5 text-white/40" /> {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-start gap-3 md:flex-col">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                <s.Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-white/40">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#top" className="transition-colors hover:text-white/70">Privacy Policy</a>
            <a href="#top" className="transition-colors hover:text-white/70">Terms of Care</a>
          </div>
        </div>
      </footer>
    </section>
  )
}
