import { useState } from 'react'
import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { ArrowUpRight, Clock, Instagram, MapPin, Phone } from 'lucide-react'
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

export default function Location() {
  const { c, t } = useI18n()
  const whatsapp = whatsappUrl(c.site.whatsappMessage)

  // The Google embed sets third-party cookies the moment it loads, so it stays
  // behind a click. Visitors who only want the address never pay for it — the
  // address, the hours and a directions link are all on the panel beside it.
  const [mapLoaded, setMapLoaded] = useState(false)

  return (
    <section
      id="location"
      className="hero-gradient rounded-[1.75rem] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
    >
      <motion.div
        variants={reveal}
        initial={snap ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
            {c.location.eyebrow} <span className="text-[#C0A578]">/</span>
          </p>
          <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
            {c.location.headlineTop}{' '}
            <span className="text-outline">{c.location.headlineOutlined}</span>
          </h2>
        </div>
        <p className="max-w-[320px] text-[13px] leading-relaxed text-[#7a7367]">
          {c.location.lead}
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.25fr] xl:mt-14 xl:gap-8">
        {/* Details */}
        <motion.div
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col gap-6 rounded-[1.5rem] border border-white/70 bg-white/60 p-6 backdrop-blur sm:p-8"
        >
          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14120F] text-[#C9AC7C]">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f685c]">
                {c.location.addressLabel}
              </p>
              <a
                href={site.maps.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-2 inline-flex items-start gap-1.5 text-[14px] font-medium leading-relaxed text-[#14120F] transition-colors hover:text-[#C0A578]"
              >
                <span>
                  {c.site.address.street}
                  <br />
                  {c.site.address.city}
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6f685c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14120F]/5 text-[#14120F]">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f685c]">
                {c.location.hoursLabel}
              </p>
              <p className="mt-2 text-[14px] font-medium text-[#14120F]">
                {c.site.hours.days} ·{' '}
                <span dir="ltr" className="inline-block tabular-nums">
                  {c.site.hours.time}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14120F]/5 text-[#14120F]">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f685c]">
                {c.location.phoneLabel}
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {site.phones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    dir="ltr"
                    className="text-[14px] font-medium text-[#14120F] transition-colors hover:text-[#C0A578] rtl:text-end"
                  >
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14120F]/5 text-[#14120F]">
              <Instagram className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6f685c]">
                {c.location.socialLabel}
              </p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="mt-2 inline-block text-[14px] font-medium text-[#14120F] transition-colors hover:text-[#C0A578]"
              >
                {site.instagramHandle}
              </a>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3 border-t border-[#14120F]/10 pt-6">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#14120F] py-3.5 ps-5 pe-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
              {c.location.chat}
            </a>
            <a
              href={site.maps.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/70 px-5 py-3.5 text-[13px] font-medium text-[#14120F] transition-colors hover:bg-white"
            >
              {c.location.directions}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
            </a>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          variants={reveal}
          custom={2}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/60 shadow-[0_18px_50px_rgba(20,18,15,0.14)]"
        >
          {mapLoaded ? (
            <iframe
              title={t(c.location.mapTitle, { clinic: c.site.name })}
              src={site.maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[340px] w-full border-0 sm:h-[420px] lg:h-full lg:min-h-[520px]"
            />
          ) : (
            <button
              type="button"
              onClick={() => setMapLoaded(true)}
              className="hero-gradient flex h-[340px] w-full flex-col items-center justify-center gap-4 px-6 text-center transition-colors hover:brightness-[1.02] sm:h-[420px] lg:h-full lg:min-h-[520px]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#14120F] text-[#C9AC7C]">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="font-display text-[18px] font-medium uppercase tracking-tight text-[#14120F]">
                {c.location.mapLoad}
              </span>
              <span className="max-w-[280px] text-[12px] leading-relaxed text-[#6f685c]">
                {c.site.address.street} · {c.site.address.city}
              </span>
              <span className="max-w-[280px] text-[11px] leading-relaxed text-[#6f685c]">
                {c.location.mapNotice}
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
