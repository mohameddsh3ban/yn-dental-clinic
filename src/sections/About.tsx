import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { reveal, snap, viewportOnce, wipe } from '@/lib/anim'
import { ArrowUpRight } from 'lucide-react'
import surgeryTeam from '@/assets/about/surgery-team.webp'
import surgeryTheatre from '@/assets/about/surgery-theatre.webp'
import { CountUp } from '@/components/CountUp'
import { DoctorPortrait } from '@/components/DoctorPortrait'
import { useDoctors } from '@/lib/team'
import { useI18n } from '@/lib/i18n'
import { PhotoStack } from '@/components/PhotoStack'

export default function About() {
  const { c, t } = useI18n()
  const doctors = useDoctors()

  const photos = [surgeryTeam, surgeryTheatre].map((src, i) => ({
    src,
    alt: t(c.about.imageAlts[i], { clinic: c.site.name }),
  }))

  return (
    <section id="about" className="hero-gradient rounded-[1.75rem] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16">
      {/* `minmax(0,1fr)`: a grid track defaults to `auto`, which grows to the
          widest unbreakable word inside it — and "COMPASSIONATE" at the
          headline size is wider than a 320px phone. Capping the track lets the
          headline hyphenate instead of the page scrolling sideways. */}
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Photographs. Two theatre shots that keep swapping places, rather
            than the single stock chairside picture this section used to run. */}
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[520px]"
        >
          <PhotoStack
            photos={photos}
            dotAria={c.about.imageDotAria}
            corner={
              // The chip now sits on a photograph rather than on the
              // section ground, so it needs a more opaque pane than the
              // 55% white `.glass-chip` gives — the label is unreadable
              // against scrubs at that strength.
              <div className="glass-chip rounded-2xl bg-white/85 px-5 py-4">
                <p
                  dir="ltr"
                  className="font-display text-[26px] font-medium leading-none text-[#14120F] rtl:text-end"
                >
                  {c.about.yearsValue}
                  <span className="text-[#C0A578]">+</span>
                </p>
                <p className="mt-1.5 text-[11px] text-[#5f594f]">{c.about.yearsLabel}</p>
              </div>
            }
          />
        </motion.div>

        {/* Copy */}
        <div>
          <motion.div
            variants={reveal}
            custom={1}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
          >
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
              {c.about.eyebrow} {c.site.short} <span className="text-[#C0A578]">/</span>
            </p>
            {/* The headline wipes up out of its clip while the block around it
                rises; it inherits 'hidden'/'show' from the parent above. */}
            <motion.h2
              variants={wipe}
              className="font-display mt-4 break-words text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F] [hyphens:auto]"
            >
              {c.about.headlineTop}{' '}
              <span className="text-outline">{c.about.headlineOutlined}</span>{' '}
              {c.about.headlineTail}
            </motion.h2>
            <p className="mt-6 max-w-[440px] text-[14px] leading-relaxed text-[#7a7367]">
              {c.about.lead}
            </p>
            {/* "Visit us" promises an address and directions, so it goes to the
                map section rather than the contact block it used to point at. */}
            <a
              href="#location"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#14120F]/15 bg-white/60 py-3.5 ps-6 pe-5 text-[13px] font-medium text-[#14120F] backdrop-blur transition-[transform,background-color,color] hover:bg-[#14120F] hover:text-white active:scale-[0.97]"
            >
              {c.about.visitUs}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
            </a>
          </motion.div>

          {/* Quick facts. The surgeons follow as badges, so there is no
              "surgical team: 2 consultant surgeons" row here — the two names
              state that themselves. Each fact rises on its own beat; the
              children inherit the parent's 'hidden'/'show'. */}
          <motion.dl
            variants={reveal}
            custom={2}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            className="mt-10 grid gap-x-8 gap-y-5 border-t border-[#14120F]/10 pt-6 sm:grid-cols-2"
          >
            {[
              [c.about.facts.clinic, `${c.site.address.street}, ${c.site.address.short}`],
              [c.about.facts.hours, `${c.site.hours.days} · ${c.site.hours.time}`],
              [c.about.facts.referrals, c.about.referralsValue],
            ].map(([term, value], i) => (
              <motion.div key={term} variants={reveal} custom={i}>
                <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
                  {term}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-snug text-[#3a352f]">{value}</dd>
              </motion.div>
            ))}
          </motion.dl>

          {/* The surgical team, in place of the standalone team band that used to
              sit below this section. Each badge is still a link to the full
              profile — that is the only route to a surgeon's qualifications and
              scope of practice, and the nav's team link lands on this #team. */}
          <motion.div
            id="team"
            variants={reveal}
            custom={3}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            className="mt-8 border-t border-[#14120F]/10 pt-6"
          >
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
              {c.about.surgicalTeam} <span className="text-[#C0A578]">/</span>{' '}
              <span className="tabular-nums">{String(doctors.length).padStart(2, '0')}</span>
            </p>

            <ul className="mt-4 flex flex-wrap gap-3">
              {doctors.map((d) => (
                <li key={d.slug} className="w-full min-w-0 sm:w-auto">
                  <Link
                    to={`/team/${d.slug}`}
                    aria-label={t(c.about.profileAria, { name: d.name, title: d.title })}
                    className="group flex w-full max-w-full items-center gap-3 rounded-full border border-[#14120F]/10 bg-white/55 py-1.5 ps-1.5 pe-4 backdrop-blur transition-[transform,background-color,border-color] hover:border-[#C0A578]/60 hover:bg-white/85 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14120F]"
                  >
                    <DoctorPortrait
                      src={d.portrait.card}
                      alt={`${d.name} — ${d.title}`}
                      initials={d.initials}
                      className="h-11 w-11 shrink-0 rounded-full object-cover object-[50%_14%] transition-transform duration-500 group-hover:scale-105"
                      monogramClassName="h-11 w-11 shrink-0 rounded-full text-[11px] transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="min-w-0">
                      <span className="font-display block truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-[#14120F]">
                        {d.name}
                      </span>
                      <span className="mt-1 block truncate text-[10px] font-medium uppercase tracking-[0.14em] text-[#6f685c]">
                        {d.role}
                      </span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#6b6459] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Stats. Each figure counts up from zero the first time it is seen;
          CountUp renders the settled literal under reduced motion and ?snap=1. */}
      <div className="mt-16 grid gap-8 border-t border-[#14120F]/10 pt-10 sm:grid-cols-3 xl:mt-20">
        {c.about.stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={reveal}
            custom={i}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="flex items-baseline gap-4 sm:flex-col sm:gap-2"
          >
            <p
              dir="ltr"
              className="font-display text-[clamp(2.6rem,4vw,3.6rem)] font-medium leading-none tracking-tight tabular-nums text-[#14120F] rtl:text-end"
            >
              <CountUp value={s.value} />
              <span className="text-[#C0A578]">{s.suffix}</span>
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#6f685c]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
