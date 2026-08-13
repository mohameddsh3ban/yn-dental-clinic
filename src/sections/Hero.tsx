import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Globe, Instagram, MapPin } from 'lucide-react'
import implant from '@/assets/implant.png'
import { flat } from '@/lib/anim'
import { BrandLockup } from '@/components/BrandLogo'
import { navLinks } from '@/lib/nav'
import { WhatsAppIcon } from '@/components/icons'
import { site } from '@/lib/site'

const ease = [0.22, 1, 0.36, 1] as const

const today = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
})

const socials: { label: string; href: string; Icon: ComponentType<{ className?: string }> }[] = [
  { label: 'Instagram', href: site.instagram, Icon: Instagram },
  { label: 'WhatsApp', href: site.whatsapp, Icon: WhatsAppIcon },
  { label: 'Google Maps', href: site.maps.link, Icon: MapPin },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: 0.15 + i * 0.12 },
  }),
}

function Chip({
  title,
  className,
  delay,
}: {
  title: string
  className: string
  delay: number
}) {
  return (
    <motion.div
      initial={typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('snap') ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.7, ease },
        y: { delay, duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      className={`glass-chip pointer-events-none absolute z-30 hidden items-center gap-2.5 rounded-full py-2.5 pl-3.5 pr-5 sm:flex ${className}`}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C0A578]" />
      <span className="whitespace-nowrap text-[11px] font-medium text-[#2B2723]">{title}</span>
    </motion.div>
  )
}

export default function Hero() {
  const snap =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('snap')
  const init = snap ? false : 'hidden'

  return (
    <div className={flat ? 'bg-[#CFC8BC] p-3 sm:p-4 xl:p-6' : 'min-h-screen bg-[#CFC8BC] p-3 sm:p-4 xl:p-6'}>
      <div className={flat ? 'hero-gradient relative flex flex-col overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem]' : 'hero-gradient relative flex min-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] sm:min-h-[calc(100vh-2rem)] xl:min-h-[max(calc(100vh-3rem),820px)] xl:rounded-[2.25rem]'}>
        {/* Watermark */}
        <div
          aria-hidden
          className="font-display pointer-events-none absolute -bottom-[7vw] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap text-[26vw] font-semibold leading-none tracking-tighter text-white/20 xl:text-[24vw]"
        >
          {site.short}
        </div>

        {/* Soft glow behind implant */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[55%] w-[70%] -translate-x-1/2 -translate-y-1/3 rounded-full bg-white/40 blur-3xl md:w-[45%]" />

        {/* Nav */}
        <motion.header
          variants={fadeUp}
          initial={init}
          animate="show"
          className="relative z-40 flex items-center justify-between px-5 pt-6 sm:px-8 xl:px-14 xl:pt-9 2xl:px-16"
        >
          <BrandLockup />
          <nav aria-label="Main" className="hidden items-center gap-8 text-[13px] font-medium text-[#3a352f] md:flex">
            {navLinks.map(([item, href]) => (
              <a
                key={item}
                href={href}
                className="transition-colors hover:text-[#14120F]"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[12px] font-medium text-[#14120F] shadow-sm backdrop-blur sm:flex">
              <Globe className="h-3.5 w-3.5" /> EN
            </button>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#14120F] px-5 py-2.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
              WhatsApp
            </a>
          </div>
        </motion.header>

        {/* Content: stacked on mobile (implant after CTA), 2-col grid on tablet, absolute on desktop */}
        <div className="relative z-10 flex flex-1 flex-col gap-14 px-5 pb-16 pt-12 sm:px-8 md:grid md:grid-cols-2 md:gap-x-8 md:pt-14 xl:contents">
          {/* Left: badge + headline + copy + CTA */}
          <div className="order-1 md:col-start-1 md:row-start-1 xl:absolute xl:left-14 xl:top-[140px] xl:z-30 xl:max-w-[520px] 2xl:left-20">
              <motion.div
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={1}
                className="inline-flex items-center gap-2.5 rounded-full bg-white/70 py-2 pl-3 pr-4 shadow-sm backdrop-blur"
              >
                <span className="h-2 w-2 rounded-full bg-[#C0A578]" />
                <span className="text-[12px] font-medium text-[#3a352f]">Trusted Dental Care</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={2}
                className="font-display mt-6 text-[clamp(2.75rem,6vw,5.4rem)] font-medium leading-[1.02] tracking-tight text-[#14120F]"
              >
                Exceptional
                <br />
                <span className="text-outline">Dental</span> Care
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={3}
                className="mt-6 max-w-[340px] text-[14px] leading-relaxed text-[#7a7367]"
              >
                We combine gentle care and clinical precision to make sure every
                visit leaves you smiling with confidence.
              </motion.p>

              <motion.div variants={fadeUp} initial={init} animate="show" custom={4}>
                <a
                  href="#contact"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#14120F] py-4 pl-7 pr-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.03]"
                >
                  Book Appointment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </div>

            {/* Right: meta + headline + socials */}
            <div className="order-3 md:order-2 md:col-start-2 md:row-start-1 md:max-w-[320px] md:justify-self-end md:text-right xl:absolute xl:right-14 xl:top-[130px] xl:z-30 xl:max-w-none 2xl:right-20">
              <motion.div variants={fadeUp} initial={init} animate="show" custom={2}>
                <p className="text-[12px] font-medium text-[#3a352f]">{today}</p>
                <p className="mt-1 text-[12px] text-[#7a7367]">We're Open Clinic</p>
                <p className="text-[12px] text-[#7a7367]">{site.hours.time}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-[#7a7367] md:justify-end">
                  <MapPin className="h-3.5 w-3.5" /> {site.address.short}
                </p>
              </motion.div>

              <motion.h2
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={3}
                className="font-display mt-10 text-[clamp(2.2rem,4.6vw,4.2rem)] font-medium leading-[1.05] tracking-tight text-[#14120F] md:mt-12"
              >
                &amp; Straight
                <br />
                <span className="text-outline-thin">Smile</span>
              </motion.h2>

              <motion.div
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={4}
                className="mt-8 flex gap-3 md:justify-end"
              >
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/40 text-[#3a352f] backdrop-blur transition-colors hover:bg-white/70"
                  >
                    <s.Icon className="h-4 w-4" />
                  </a>
                ))}
              </motion.div>
            </div>

          {/* Implant + orbit + chips */}
          <div className="relative z-20 order-2 mx-auto w-fit md:order-3 md:col-span-2 xl:absolute xl:bottom-0 xl:left-1/2 xl:h-[56%] xl:-translate-x-1/2">
            <svg
              viewBox="0 0 640 220"
              className="pointer-events-none absolute -bottom-6 left-1/2 hidden w-[640px] -translate-x-1/2 xl:block"
              fill="none"
            >
              <ellipse cx="320" cy="120" rx="300" ry="86" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
              <circle cx="620" cy="120" r="5" fill="rgba(255,255,255,0.9)" />
              <circle cx="620" cy="120" r="10" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
            </svg>
            <motion.img
              src={implant}
              alt="Ceramic dental implant"
              initial={snap ? false : { opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: [0, -14, 0], scale: 1 }}
              transition={{
                opacity: { duration: 1, ease, delay: 0.35 },
                scale: { duration: 1, ease, delay: 0.35 },
                y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.4 },
              }}
              className="relative z-20 h-[300px] object-contain drop-shadow-[0_35px_45px_rgba(20,18,15,0.35)] sm:h-[380px] md:h-[440px] xl:h-full"
            />
            <Chip title="Root Canal Treatment" className="right-full top-[44%] mr-3 xl:mr-5" delay={1.2} />
            <Chip title="Dental Check-Up" className="left-full top-[32%] ml-3 xl:ml-5" delay={1.5} />
          </div>

          {/* Stats: centered row on mobile/tablet, corner-anchored on desktop */}
          <div className="order-4 flex flex-col gap-10 sm:flex-row sm:flex-wrap sm:items-start sm:justify-center sm:gap-x-16 md:col-span-2 xl:contents">
            <motion.div
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={5}
              className="xl:absolute xl:bottom-[90px] xl:left-14 xl:z-30 2xl:left-20"
            >
              <p className="font-display text-[40px] font-medium leading-none tracking-tight text-[#14120F]">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#14120F] align-middle" />
                827<span className="text-[#C0A578]">+</span>
              </p>
              <p className="mt-3 max-w-[210px] text-[12px] leading-relaxed text-[#7a7367]">
                Transform your smile quickly and with our exceptional services.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={6}
              className="flex gap-14 sm:gap-16 xl:absolute xl:bottom-[90px] xl:right-14 xl:z-30 xl:flex-col xl:gap-9 xl:text-right 2xl:right-20"
            >
              <div>
                <p className="font-display text-[40px] font-medium leading-none tracking-tight text-[#14120F]">
                  170<span className="text-[#C0A578]">+</span>
                </p>
                <p className="mt-2 text-[12px] text-[#7a7367]">
                  Performed
                  <br />
                  surgeries
                </p>
              </div>
              <div>
                <p className="font-display text-[40px] font-medium leading-none tracking-tight text-[#14120F]">
                  85<span className="text-[#C0A578]">%</span>
                </p>
                <p className="mt-2 text-[12px] text-[#7a7367]">
                  Satisfied
                  <br />
                  Clients
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
