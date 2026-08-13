import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { ArrowUpRight, Clock, Instagram, MapPin, Phone } from 'lucide-react'
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

export default function Location() {
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
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
            Visit us <span className="text-[#C0A578]">/</span>
          </p>
          <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
            Find us in <span className="text-outline">Nasr City</span>
          </h2>
        </div>
        <p className="max-w-[320px] text-[13px] leading-relaxed text-[#7a7367]">
          Easy to reach from Al Golf and Heliopolis — message us on WhatsApp and
          we'll hold a slot that fits your day.
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9184]">
                Clinic address
              </p>
              <a
                href={site.maps.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-2 inline-flex items-start gap-1.5 text-[14px] font-medium leading-relaxed text-[#14120F] transition-colors hover:text-[#C0A578]"
              >
                <span>
                  {site.address.street}
                  <br />
                  {site.address.city}
                </span>
                <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9a9184] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14120F]/5 text-[#14120F]">
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9184]">
                Opening hours
              </p>
              <p className="mt-2 text-[14px] font-medium text-[#14120F]">
                {site.hours.days} · {site.hours.time}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14120F]/5 text-[#14120F]">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9184]">
                Call the clinic
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {site.phones.map((p) => (
                  <a
                    key={p.tel}
                    href={`tel:${p.tel}`}
                    dir="ltr"
                    className="text-[14px] font-medium text-[#14120F] transition-colors hover:text-[#C0A578]"
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a9184]">
                Follow the clinic
              </p>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[14px] font-medium text-[#14120F] transition-colors hover:text-[#C0A578]"
              >
                {site.instagramHandle}
              </a>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3 border-t border-[#14120F]/10 pt-6">
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#14120F] py-3.5 pl-5 pr-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
              Chat on WhatsApp
            </a>
            <a
              href={site.maps.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/70 px-5 py-3.5 text-[13px] font-medium text-[#14120F] transition-colors hover:bg-white"
            >
              Get directions
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
          <iframe
            title={`${site.name} on Google Maps`}
            src={site.maps.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[340px] w-full border-0 sm:h-[420px] lg:h-full lg:min-h-[520px]"
          />
        </motion.div>
      </div>
    </section>
  )
}
