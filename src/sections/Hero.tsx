import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Globe, Instagram, MapPin, Phone } from 'lucide-react'
import { flat, snap } from '@/lib/anim'
import { BrandLockup } from '@/components/BrandLogo'
import { navLinks } from '@/lib/nav'
import { WhatsAppIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n'
import { site, whatsappUrl } from '@/lib/site'
import faceLine from '@/assets/hero/face-line.webp'
import portrait620 from '@/assets/doctor-surgeon-620.webp'
import portrait1200 from '@/assets/doctor-surgeon-1200.webp'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay: 0.15 + i * 0.1 },
  }),
}

/** What the practice operates on — the answer to "do you do my operation?". */
const SCOPE = [
  ['Orthognathic Surgery', 'Corrective jaw alignment'],
  ['Facial Trauma & Reconstruction', 'Mandible, orbit and zygoma'],
  ['Temporomandibular Joint', 'TMJ pain, clicking and locking'],
  ['Impacted Third Molars', 'Surgical wisdom-tooth removal'],
  ['Cysts & Benign Lesions', 'Excision and biopsy'],
  ['Bone Grafting & Sinus Lift', 'Preparing the site for implants'],
  ['Dental Implants', 'Single unit to full arch'],
] as const

const RAIL = [
  'Consultation',
  'Imaging & measurement',
  'Written surgical plan',
  'Surgery & follow-up',
] as const

/**
 * The face line sits where the cephalometric tracing did — pushed left out of
 * the portrait column so it bleeds behind the middle of the card, and cropped
 * by the card's rounded edge.
 */
const FACE_LINE_PLACEMENT =
  'pointer-events-none absolute left-[-30%] top-1/2 hidden h-[430px] w-auto -translate-y-1/2 md:block lg:left-[-28%] lg:h-[500px] xl:left-[-32%] xl:h-[560px] 2xl:left-[-30%] 2xl:h-[640px]'

/** Softens the crop at the base of the cut-out portrait into the card. */
const PORTRAIT_MASK =
  'linear-gradient(to bottom, #000 56%, rgba(0,0,0,0.55) 76%, rgba(0,0,0,0.12) 92%, transparent 100%)'

export default function Hero() {
  // Superseded by HeroFacial, kept for reference and not routed to. It reads
  // the clinic's name, address and hours from the dictionary so it stays
  // consistent with the live site, but its own prose is still English only —
  // there is no point translating a hero no visitor reaches. Translate it here
  // if it is ever brought back.
  const { c } = useI18n()
  const whatsapp = whatsappUrl(c.site.whatsappMessage)
  const reduced = useReducedMotion()
  const still = snap || reduced
  const init = still ? false : 'hidden'

  return (
    <section
      id="hero"
      aria-labelledby="hero-h1"
      className={flat ? 'bg-[#CFC8BC] p-3 sm:p-4 xl:p-6' : 'min-h-screen bg-[#CFC8BC] p-3 sm:p-4 xl:p-6'}
    >
      <div
        className={`hero-gradient relative flex flex-col overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem] ${
          flat
            ? ''
            : 'min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] xl:min-h-[max(calc(100vh-3rem),820px)] 2xl:min-h-[max(calc(100vh-3rem),880px)]'
        }`}
      >
        {/* Light pooled where the eye should land, not in the corner */}
        <motion.div
          aria-hidden
          initial={still ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: still ? 0 : 1.4, delay: still ? 0 : 0.1, ease }}
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(56%_52%_at_70%_46%,rgba(255,255,255,0.84),rgba(255,255,255,0)_70%)]"
        />

        {/* Twelve hairlines on the content grid — Swiss structure, almost free */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden grid-cols-12 px-14 xl:grid 2xl:px-20"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="border-l border-white/30 last:border-r" />
          ))}
        </div>

        {/* Nav */}
        <motion.header
          variants={fadeUp}
          initial={init}
          animate="show"
          className="relative z-40 flex items-center justify-between px-5 pt-6 sm:px-8 xl:px-14 xl:pt-9 2xl:px-20"
        >
          <BrandLockup />
          <nav
            aria-label="Main"
            className="hidden items-center gap-8 text-[13px] font-medium text-[#3a352f] lg:flex"
          >
            {navLinks(c).map(([item, href]) => (
              <a key={item} href={href} className="transition-colors hover:text-[#14120F]">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[12px] font-medium text-[#14120F] shadow-sm backdrop-blur sm:flex">
              <Globe className="h-3.5 w-3.5" /> EN
            </button>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#14120F] px-5 py-2.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.03]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
              WhatsApp
            </a>
          </div>
        </motion.header>

        <div className="relative z-10 mx-auto flex w-full max-w-[1760px] flex-1 flex-col px-5 pb-8 sm:px-8 xl:px-14 xl:pb-8 2xl:px-20">
          <div className="grid flex-1 gap-y-8 pt-8 md:grid-cols-2 md:gap-x-8 xl:grid-cols-12 xl:grid-rows-[auto_1fr] xl:items-start xl:gap-x-8 xl:gap-y-6 xl:pt-10">
            {/* Headline block */}
            <motion.div
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={1}
              className="order-1 md:col-start-1 md:row-start-1 xl:col-span-4 xl:col-start-1 xl:row-start-1 xl:self-end"
            >
              <p className="flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
                <span aria-hidden className="mr-3 inline-block h-px w-5 bg-[#C0A578]" />
                Oral &amp; Maxillofacial Surgery
              </p>

              <h1
                id="hero-h1"
                className="font-display mt-5 text-[clamp(2.15rem,4.8vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-[#14120F] 2xl:text-[3.9rem]"
              >
                Surgery of the
                <br />
                face and{' '}
                <span className="text-outline-thin sm:text-outline xl:[-webkit-text-stroke-width:2px]">
                  jaws.
                </span>
              </h1>

              <p className="mt-5 text-[13px] font-medium text-[#3a352f] sm:text-[15px]">
                {c.site.doctor} — {c.site.name}, {c.site.address.short}.
              </p>
            </motion.div>

            {/* Surgeon + tracing */}
            <div className="relative order-2 md:col-start-2 md:row-start-1 md:row-span-2 md:self-end xl:order-3 xl:col-span-4 xl:col-start-9 xl:row-start-1 xl:row-span-2 xl:self-end">
              <div className="relative mx-auto w-full max-w-[420px] md:max-w-none">
                {/* Backdrop profile behind the surgeon. Held well back in
                    opacity so it reads as a watermark, not a second subject
                    competing with the portrait. */}
                <motion.img
                  src={faceLine}
                  alt=""
                  aria-hidden
                  width={1200}
                  height={1800}
                  loading="lazy"
                  decoding="async"
                  initial={still ? false : { opacity: 0 }}
                  animate={{ opacity: 0.16 }}
                  transition={{ duration: still ? 0 : 1.2, delay: still ? 0 : 0.25, ease }}
                  className={FACE_LINE_PLACEMENT}
                />

                <motion.img
                  src={portrait620}
                  srcSet={`${portrait620} 506w, ${portrait1200} 980w`}
                  sizes="(min-width:1280px) 460px, (min-width:1024px) 440px, (min-width:768px) 376px, (min-width:640px) 245px, 196px"
                  width={980}
                  height={1200}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  alt="Dr. Youssef Nasser, oral and maxillofacial surgeon, in surgical scrubs with surgical loupes"
                  initial={still ? false : { opacity: 0, y: 32, scale: 1.015 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: still ? 0 : 1.05, delay: still ? 0 : 0.3, ease }}
                  style={{
                    maskImage: PORTRAIT_MASK,
                    WebkitMaskImage: PORTRAIT_MASK,
                    filter: 'contrast(1.04) saturate(0.93)',
                  }}
                  className="relative z-10 mx-auto block h-[240px] w-auto object-contain object-bottom sm:h-[300px] md:h-[440px] lg:h-[470px] xl:mr-[-2%] xl:h-[490px] 2xl:h-[560px]"
                />

                <motion.div
                  variants={fadeUp}
                  initial={init}
                  animate="show"
                  custom={2}
                  className="absolute inset-x-0 bottom-0 z-20 pb-1 pt-12 text-center md:pl-2 md:text-left"
                >
                  <p className="font-display text-[17px] font-medium tracking-[-0.01em] text-[#14120F]">
                    {c.site.doctor}
                  </p>
                  <span aria-hidden className="my-2 inline-block h-px w-7 bg-[#C0A578]" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#5f584d]">
                    {c.site.specialty}
                  </p>
                </motion.div>
              </div>

              <p className="mt-3 hidden text-[10px] leading-snug text-[#6b6459] md:block">
                Illustration — decorative line drawing, not a patient image and not a predicted
                result.
              </p>
            </div>

            {/* Copy + actions */}
            <motion.div
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={3}
              className="order-3 md:col-start-1 md:row-start-2 xl:col-span-4 xl:col-start-1 xl:row-start-2 xl:self-start"
            >
              <p className="hidden max-w-[44ch] text-[14px] leading-[1.65] text-[#5f584d] sm:block xl:text-[15px]">
                Every case starts with imaging, a written plan, and a straight conversation about
                what the procedure actually involves — before anything is scheduled.
              </p>

              <div className="mt-7 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Discuss your case with ${c.site.doctor} on WhatsApp`}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#14120F] py-4 pl-7 pr-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] sm:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
                  Discuss your case
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href={`tel:${site.phones[0].tel}`}
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/60 px-6 py-4 text-[13px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white sm:w-auto"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="tabular-nums">Call {site.phones[0].label}</span>
                </a>
              </div>

              <p className="mt-4 max-w-[40ch] text-[11px] leading-[1.6] text-[#6b6459]">
                Surgical suitability is decided at consultation. WhatsApp replies{' '}
                <span className="tabular-nums">
                  {c.site.hours.days}, {c.site.hours.time}
                </span>
                .
              </p>
            </motion.div>

            {/* Scope of practice */}
            <motion.section
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={5}
              aria-labelledby="scope-label"
              className="order-4 md:col-span-2 md:row-start-3 xl:col-span-4 xl:col-start-5 xl:row-start-1 xl:row-span-2 xl:self-center"
            >
              <p
                id="scope-label"
                className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6b6459]"
              >
                Scope of practice <span className="text-[#C0A578]">/</span>{' '}
                <span className="tabular-nums">01–07</span>
              </p>

              <ul className="mt-4 border-t border-[#14120F]/10 md:grid md:grid-cols-2 md:gap-x-8 xl:block">
                {SCOPE.map(([name, descriptor], i) => (
                  <motion.li
                    key={name}
                    initial={still ? false : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: still ? 0 : 0.5,
                      delay: still ? 0 : 0.75 + i * 0.045,
                      ease,
                    }}
                    className="group border-b border-[#14120F]/10"
                  >
                    <div className="flex min-h-[52px] flex-col justify-center gap-x-4 py-2.5 xl:flex-row xl:items-baseline xl:py-4">
                      <span className="flex items-baseline gap-3">
                        <span className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#6b6459] transition-colors group-hover:text-[#C0A578]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-[#3a352f] transition-colors group-hover:text-[#14120F] xl:text-[16px]">
                          {name}
                        </span>
                      </span>
                      <span className="ml-[26px] text-[11px] leading-snug text-[#6b6459] xl:ml-auto xl:max-w-[46%] xl:text-right">
                        {descriptor}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* How a case proceeds */}
          <motion.ol
            variants={fadeUp}
            initial={init}
            animate="show"
            custom={6}
            aria-label="How a case proceeds"
            className="relative mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[#14120F]/10 pt-5 sm:grid-cols-4 xl:mt-9"
          >
            {RAIL.map((step, i) => (
              <li key={step} className="relative">
                <motion.span
                  aria-hidden
                  initial={still ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: still ? 0 : 0.4,
                    delay: still ? 0 : 0.95 + i * 0.06,
                    ease,
                  }}
                  className="absolute -top-[23px] left-0 h-1 w-1 bg-[#C0A578]"
                />
                <span className="text-[10px] font-medium tabular-nums tracking-[0.2em] text-[#6b6459]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-[#6b6459]">
                  {step}
                </span>
              </li>
            ))}
          </motion.ol>

          {/* Checkable public record */}
          <motion.div
            variants={fadeUp}
            initial={init}
            animate="show"
            custom={6}
            className="mt-5 flex flex-col gap-3 border-t border-[#14120F]/10 pt-4 text-[11px] text-[#6b6459] lg:flex-row lg:items-center lg:justify-between"
          >
            <p>Referrals and second opinions welcome.</p>

            <dl className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex min-w-0 items-center gap-2">
                <dt className="sr-only">Clinic</dt>
                <dd className="min-w-0">
                  <a
                    href={site.maps.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {c.site.address.street} — {c.site.address.city}
                  </a>
                </dd>
              </div>

              <span aria-hidden className="text-[#C0A578]">
                /
              </span>

              <div className="flex items-center gap-2">
                <dt className="uppercase tracking-[0.16em]">Hours</dt>
                <dd className="tabular-nums">
                  {c.site.hours.days} · {c.site.hours.time}
                </dd>
              </div>

              <span aria-hidden className="text-[#C0A578]">
                /
              </span>

              <div className="flex items-center gap-2">
                <dt className="uppercase tracking-[0.16em]">Second line</dt>
                <dd>
                  <a href={`tel:${site.phones[1].tel}`} className="tabular-nums hover:underline">
                    {site.phones[1].label}
                  </a>
                </dd>
              </div>

              <span aria-hidden className="text-[#C0A578]">
                /
              </span>

              <div className="flex items-center gap-2">
                <dt className="sr-only">Instagram</dt>
                <dd>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    {site.instagramHandle}
                  </a>
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
