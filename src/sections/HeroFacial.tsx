import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Instagram, MapPin, Phone } from 'lucide-react'
import { BrandLockup } from '@/components/BrandLogo'
import { LanguageToggle } from '@/components/LanguageToggle'
import { WhatsAppIcon } from '@/components/icons'
import { flat, snap } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { navLinks } from '@/lib/nav'
import { site, whatsappUrl } from '@/lib/site'

/**
 * The face-led hero: the client's own line drawing of a profile with the skull,
 * the jaws and the tooth rows read through it.
 *
 * The artwork is the composition. Copy is anchored to the corners of the card
 * rather than set in a column beside the figure, so the drawing keeps the
 * middle of the frame and the gaze — which runs toward the headline — is never
 * crossed by text. Two leader lines label the anatomy from measured coordinates
 * in the artwork itself; see ANNOTATIONS.
 *
 * RTL: the copy column and the clinic meta swap sides with the document
 * direction, because they are anchored with logical insets (`start-`/`end-`).
 * The figure has to swap with them or the gaze would run out of the frame
 * instead of into the headline, so the whole artwork block is mirrored with a
 * single `rtl:-scale-x-100`. It keeps `dir="ltr"` inside: the leader lines are
 * measured in the artwork's own pixels, and mirroring the box rather than
 * re-deriving the coordinates is what keeps every label on its own landmark.
 * The two label texts are counter-flipped so they still read left to right.
 */

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    // Kept deliberately short: every element still fading in is viewport area
    // that is not finished yet, and the hero is what Speed Index measures. The
    // stagger still reads at these numbers; the last item settles at ~0.8s
    // instead of ~1.3s.
    transition: { duration: 0.5, ease, delay: 0.06 + i * 0.055 },
  }),
}

/**
 * The artwork's own geometry, measured off the master render rather than
 * eyeballed against a screenshot: the gold implant's centroid, the condyle, the
 * occlusal plane and the gonial angle, as fractions of the asset box. The
 * overlay is drawn in the same box, so a leader line lands on the anatomy at
 * every width without a single magic offset.
 */
const ART = {
  /** The shipped crop is 2068 × 2617, so 1000 × 1265 in overlay units — printed
   *  by `npm run build:hero-art`, re-run it after changing the crop. */
  vw: 1000,
  vh: 1265,
  /** Mandibular condyle, under the zygomatic arch in front of the ear canal. */
  condyle: { x: 578, y: 576 },
  /** The gold implant at the lower first molar. Printed by
   *  `npm run build:hero-art`, which measures it in the shipped crop — do not
   *  nudge it by eye. */
  implant: { x: 354, y: 775 },
  /** Top of the implant, where the crown meets the bite line. */
  implantHead: { x: 354, y: 748 },
} as const

/**
 * Both labels sit behind the head, on the side the gaze runs away from — the
 * side a leader line can cross without fighting the artwork. Both lines run
 * past the edge of the artwork box, which is why the overlay is
 * `overflow-visible`: the back of the head fills that edge of the frame, and a
 * label set inside it would sit on top of the skull. Coordinates are in the
 * artwork's own space and never change; RTL mirrors the box around them.
 *
 * `key` indexes the translated label in `copy.hero.annotations`.
 */
const ANNOTATIONS = [
  {
    key: 'implant',
    dot: ART.implantHead,
    elbow: { x: 742, y: 700 },
    end: { x: 1012, y: 700 },
  },
  {
    key: 'tmj',
    dot: ART.condyle,
    elbow: { x: 830, y: 512 },
    end: { x: 1012, y: 512 },
  },
] as const

const socials = [
  { key: 'instagram', href: site.instagram, Icon: Instagram },
  { key: 'whatsapp', href: '', Icon: WhatsAppIcon },
  { key: 'googleMaps', href: site.maps.link, Icon: MapPin },
] as const

/** Fixed pixel heights at every breakpoint — a percentage height collapses to
 * nothing in a relaxed-height capture. */
/**
 * The hero drawing is the LCP element, so it is served from `public/` rather
 * than imported: index.html preloads it by a stable URL before the bundle is
 * parsed, and the `srcSet`/`sizes` here must stay in step with the
 * `imagesrcset`/`imagesizes` on that preload link or the browser fetches the
 * artwork twice.
 */
const HERO_ART = {
  src: '/hero/hero-face-900.webp',
  srcSet:
    '/hero/hero-face-400.webp 400w, /hero/hero-face-600.webp 600w, /hero/hero-face-900.webp 900w',
  sizes: '(min-width: 1536px) 466px, (min-width: 768px) 395px, (min-width: 640px) 332px, 269px',
} as const

const FIGURE_HEIGHT = 'h-[340px] sm:h-[420px] md:h-[500px] xl:h-[500px] 2xl:h-[590px]'

export default function HeroFacial() {
  const { c, t, lang } = useI18n()
  const reduced = useReducedMotion()
  const still = snap || reduced
  const init = still ? false : 'hidden'
  const whatsapp = whatsappUrl(c.site.whatsappMessage)
  const today = new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  })
  /** The overlay draws itself once and is then still. */
  const draw = (delay: number) =>
    still
      ? { pathLength: 1, opacity: 1 }
      : {
          pathLength: 1,
          opacity: 1,
          transition: { pathLength: { duration: 0.9, delay, ease }, opacity: { duration: 0.2, delay } },
        }

  return (
    <section
      id="hero"
      aria-labelledby="hero-h1"
      className="bg-[#CFC8BC] p-3 sm:p-4 xl:p-6"
    >
      <div
        className={`hero-canvas relative flex flex-col overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem] ${
          flat
            ? ''
            : 'min-h-[calc(100vh-1.5rem)] sm:min-h-[calc(100vh-2rem)] xl:min-h-[max(calc(100vh-3rem),860px)] 2xl:min-h-[max(calc(100vh-3rem),920px)]'
        }`}
      >
        <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 z-0" />

        {/* Twelve hairlines on the content grid — Swiss structure, almost free */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden grid-cols-12 px-14 xl:grid 2xl:px-20"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="border-s border-white/30 last:border-e" />
          ))}
        </div>

        {/* Wordmark, held far back so it reads as paper rather than as type */}
        <div
          aria-hidden
          className="font-display pointer-events-none absolute -bottom-[6vw] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap text-[26vw] font-semibold leading-none tracking-tighter text-white/[0.16] xl:text-[21vw]"
        >
          {c.site.short}
        </div>

        {/* Nav */}
        <motion.header
          variants={fadeUp}
          initial={init}
          animate="show"
          className="relative z-40 flex items-center justify-between px-6 pt-6 sm:px-10 xl:px-14 xl:pt-9 2xl:px-20"
        >
          <BrandLockup />
          <nav
            aria-label={c.common.mainNav}
            className="hidden items-center gap-8 text-[13px] font-medium text-[#3a352f] lg:flex"
          >
            {navLinks(c).map(([item, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-[#14120F]">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={c.common.whatsapp}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#14120F] px-3 py-2.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.02] sm:px-5"
            >
              <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
              {/* The word is dropped on a phone: the language toggle now shares
                  this row, and a full-width WhatsApp CTA sits right below it. */}
              <span className="max-sm:hidden">{c.common.whatsapp}</span>
            </a>
          </div>
        </motion.header>

        {/* Below 1280px this is ordinary stacked flow; from 1280px it becomes
            the positioned box every block anchors to — capped at 1760px and
            centred, so a 2560px viewport keeps one composition instead of
            pushing the copy and the meta to opposite edges. */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1760px] flex-1 flex-col gap-10 px-6 pb-10 pt-10 sm:px-10 md:gap-12 xl:absolute xl:inset-0 xl:block xl:p-0">
          {/* Copy column. `contents` below 1280px lets the figure sit between the
              headline and the actions, because a face is the fastest-decoded
              trust signal and has to be above the fold on a phone. From 1280px
              the wrapper becomes the anchored leading column again. */}
          <div className="contents xl:absolute xl:start-14 xl:top-[168px] xl:z-30 xl:block xl:max-w-[360px] 2xl:start-20 2xl:top-[178px] 2xl:max-w-[460px]">
            <div className="order-1">
              <motion.p
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={1}
                className="flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]"
              >
                <span aria-hidden className="me-3 inline-block h-px w-6 bg-[#C0A578]" />
                {c.hero.eyebrow}
              </motion.p>

              <motion.h1
                id="hero-h1"
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={2}
                className="font-display mt-5 text-[clamp(2.15rem,4.8vw,3.4rem)] font-medium leading-[1.04] tracking-[-0.02em] text-[#14120F]"
              >
                {c.hero.headlineTop}
                <br />
                <span className="text-outline">{c.hero.headlineOutlined}</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={3}
                className="mt-6 max-w-[44ch] text-[14px] leading-[1.65] text-[#5f584d] xl:text-[15px]"
              >
                {c.hero.lead}
              </motion.p>
            </div>

            <div className="order-3">
              <motion.div
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={4}
                className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center xl:mt-8 xl:flex-col xl:items-stretch 2xl:flex-row 2xl:items-center"
              >
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(c.hero.bookAria, { doctor: c.site.doctor })}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#14120F] py-4 ps-7 pe-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.02] min-[480px]:w-auto"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#C9AC7C]" />
                  {c.hero.book}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </a>
                <a
                  href={`tel:${site.phones[0].tel}`}
                  dir="ltr"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[#14120F]/15 bg-white/60 px-6 py-4 text-[13px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white min-[480px]:w-auto"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="tabular-nums">{site.phones[0].label}</span>
                </a>
              </motion.div>

              <motion.ol
                variants={fadeUp}
                initial={init}
                animate="show"
                custom={5}
                aria-label={c.hero.railLabel}
                className="mt-8 grid max-w-[440px] grid-cols-2 gap-x-6 gap-y-5 border-t border-[#14120F]/10 pt-5 sm:grid-cols-4 sm:gap-x-4 xl:hidden 2xl:mt-10 2xl:grid 2xl:grid-cols-4"
              >
                {c.hero.rail.map((step, i) => (
                  <li key={step} className="relative">
                    {/* The tick belongs to the rule above the rail, so it only
                        appears where the rail is a single row under that rule. */}
                    <span
                      aria-hidden
                      className="absolute -top-[23px] start-0 hidden h-1 w-1 bg-[#C0A578] sm:block xl:hidden 2xl:block"
                    />
                    <span className="text-[10px] font-medium tabular-nums tracking-[0.2em] text-[#6b6459]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-1 block text-[10px] font-medium uppercase leading-snug tracking-[0.16em] text-[#6b6459]">
                      {step}
                    </span>
                  </li>
                ))}
              </motion.ol>
            </div>
          </div>

          {/* Figure. `start-[56%]` mirrors the offset with the document
              direction so the drawing stays on the side away from the copy;
              `dir="ltr"` inside keeps the leader lines pinned to the anatomy
              they were measured against. */}
          <div className="relative order-2 mx-auto w-fit xl:absolute xl:bottom-[126px] xl:start-[56%] xl:z-20 xl:-translate-x-1/2 xl:rtl:translate-x-1/2 2xl:bottom-[140px] 2xl:start-[52%]">
            <div className="relative rtl:-scale-x-100" dir="ltr">
              <motion.img
                src={HERO_ART.src}
                srcSet={HERO_ART.srcSet}
                sizes={HERO_ART.sizes}
                width={900}
                height={1139}
                alt={c.hero.figureAlt}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                // Transform only, and no delay: this is the LCP element, and
                // Chrome does not count an element as painted while it is
                // still at `opacity: 0`. Fading it in cost ~1.1s of LCP for an
                // effect the settle already reads as.
                initial={still ? false : { y: 26, scale: 1.012 }}
                animate={{ y: 0, scale: 1 }}
                transition={{ duration: still ? 0 : 0.9, ease }}
                className={`relative z-20 w-auto object-contain ${FIGURE_HEIGHT}`}
              />

              {/* Measurement marks and leader lines, in the artwork's own box */}
              <svg
                aria-hidden
                viewBox={`0 0 ${ART.vw} ${ART.vh}`}
                fill="none"
                className="pointer-events-none absolute inset-0 z-30 hidden h-full w-full overflow-visible lg:block"
              >
                {ANNOTATIONS.map((note, i) => (
                  <g key={note.key}>
                    <motion.polyline
                      points={`${note.dot.x},${note.dot.y} ${note.elbow.x},${note.elbow.y} ${note.end.x},${note.end.y}`}
                      stroke="#C0A578"
                      strokeWidth="1.6"
                      initial={still ? false : { pathLength: 0, opacity: 0 }}
                      animate={draw(1.3 + i * 0.18)}
                    />
                    <motion.circle
                      cx={note.dot.x}
                      cy={note.dot.y}
                      r="6"
                      fill="#C0A578"
                      initial={still ? false : { opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: still ? 0 : 0.3, delay: still ? 0 : 1.3 + i * 0.18 },
                      }}
                    />
                  </g>
                ))}
              </svg>

              {/* Labels are real text, not SVG: crisper, and translatable */}
              {ANNOTATIONS.map((note, i) => (
                <motion.p
                  key={note.key}
                  initial={still ? false : { opacity: 0, x: -6 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: still ? 0 : 0.5,
                      delay: still ? 0 : 1.45 + i * 0.18,
                      ease,
                    },
                  }}
                  style={{
                    left: `${(note.end.x / ART.vw) * 100}%`,
                    top: `${(note.end.y / ART.vh) * 100}%`,
                  }}
                  className="pointer-events-none absolute z-30 hidden -translate-y-1/2 whitespace-nowrap px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b6459] lg:block"
                >
                  {/* The flip lives on a plain span, not on the motion.p: framer
                      writes an inline transform for the entrance and an inline
                      style beats a utility class, so the label would come back
                      mirrored. */}
                  <span className="inline-block rtl:-scale-x-100">
                    {c.hero.annotations[note.key]}
                  </span>
                </motion.p>
              ))}
            </div>
          </div>

          {/* Clinic meta */}
          <div className="order-4 xl:absolute xl:end-14 xl:top-[172px] xl:z-30 xl:w-[240px] xl:text-end 2xl:end-20">
            <motion.dl
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={2}
              className="grid grid-cols-2 gap-y-3 text-[12px] xl:block xl:space-y-3"
            >
              <div className="xl:border-b xl:border-[#14120F]/10 xl:pb-3">
                <dt className="sr-only">{c.hero.today}</dt>
                <dd className="font-medium tabular-nums text-[#3a352f]">{today}</dd>
              </div>
              <div className="xl:border-b xl:border-[#14120F]/10 xl:pb-3">
                <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b6459]">
                  {c.hero.open}
                </dt>
                <dd className="tabular-nums text-[#5f584d]">
                  {c.site.hours.days} <span className="text-[#C0A578]">/</span>{' '}
                  <span dir="ltr" className="inline-block">
                    {c.site.hours.time}
                  </span>
                </dd>
              </div>
              <div className="col-span-2 xl:col-auto">
                <dt className="sr-only">{c.hero.clinic}</dt>
                <dd>
                  <a
                    href={site.maps.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#5f584d] hover:text-[#14120F] xl:justify-end"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {c.site.address.short}
                  </a>
                </dd>
              </div>
            </motion.dl>

            <motion.p
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={3}
              className="mt-8 max-w-[26ch] text-[13px] leading-[1.6] text-[#5f584d] xl:ms-auto xl:mt-10"
            >
              {c.hero.metaBlurb}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial={init}
              animate="show"
              custom={4}
              className="mt-6 flex gap-3 xl:mt-8 xl:justify-end"
            >
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.key === 'whatsapp' ? whatsapp : s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.common[s.key]}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#14120F]/10 bg-white/50 text-[#3a352f] backdrop-blur transition-colors hover:bg-white/80"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Name plate, schematic caption and the counts */}
          <motion.div
            variants={fadeUp}
            initial={init}
            animate="show"
            custom={5}
            className="order-5 flex flex-col gap-6 border-t border-[#14120F]/10 pt-5 md:flex-row md:items-end md:justify-between md:gap-10 xl:absolute xl:inset-x-14 xl:bottom-9 xl:z-30 2xl:inset-x-20"
          >
            <div>
              <p className="font-display text-[17px] font-medium tracking-[-0.01em] text-[#14120F]">
                {c.site.doctor}
              </p>
              <span aria-hidden className="my-2 block h-px w-7 bg-[#C0A578]" />
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6b6459]">
                {c.site.specialty}
              </p>
              <p className="mt-3 max-w-[34ch] text-[10px] leading-[1.6] text-[#6b6459]">
                {c.hero.illustrationNote}
              </p>
            </div>

            <dl className="flex flex-wrap items-start gap-x-10 gap-y-6 sm:gap-x-14">
              {c.hero.stats.map((stat) => (
                <div key={stat.label} className="min-w-[92px]">
                  {/* The documented headline step, not a bespoke numeral size:
                      the ramp has eight literal steps and no ninth. */}
                  <dd
                    dir="ltr"
                    className="font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium leading-none tracking-[-0.02em] tabular-nums text-[#14120F] rtl:text-end"
                  >
                    {stat.value}
                    <span className="text-[#14120F]/30">{stat.unit}</span>
                  </dd>
                  <dt className="mt-2 whitespace-pre-line text-[11px] leading-snug text-[#6b6459]">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
