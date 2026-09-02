import { motion } from 'framer-motion'
import { reveal, snap, spring, useStill, viewportOnce, wipe } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { useHospitals } from '@/lib/hospitals'

const ARABIC = /[؀-ۿ]/

/**
 * A hospital's own name and its second-language line are always in opposite
 * scripts, so on both editions of the site one of the two is the minority
 * script and the page's global typography is wrong for it: in English, Inter
 * has no Arabic glyphs and the eyebrow tracking pulls the joins apart; in
 * Arabic, the `html[lang='ar']` rules would put Plex on a Latin name. Marking
 * each string with the script it is actually in fixes both directions — and is
 * what a screen reader needs to pronounce it anyway.
 */
function script(text: string) {
  const arabic = ARABIC.test(text)
  return {
    lang: arabic ? 'ar' : 'en',
    className: arabic ? 'font-ar normal-case tracking-normal' : '',
  }
}

/**
 * The hospitals surgery is carried out in.
 *
 * A patient reading "orthognathic surgery" or "facial trauma" on this site has
 * a question the clinic address cannot answer — those cases are not done in a
 * dental chair. This says where they are done, so it sits with the surgical
 * claims rather than beside the map.
 */
export default function Hospitals() {
  const { c } = useI18n()
  const still = useStill()
  const hospitals = useHospitals()

  return (
    <section
      id="hospitals"
      aria-labelledby="hospitals-heading"
      className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
            {c.hospitals.eyebrow} <span className="text-[#C0A578]">/</span>{' '}
            <span className="tabular-nums" dir="ltr">
              01–{String(hospitals.length).padStart(2, '0')}
            </span>
          </p>
          <motion.h2
            id="hospitals-heading"
            variants={wipe}
            className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]"
          >
            {c.hospitals.headlineTop}
            <br />
            <span className="text-outline">{c.hospitals.headlineOutlined}</span>
          </motion.h2>
        </motion.div>
        <motion.p
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-[380px] text-[14px] leading-relaxed text-[#7a7367] lg:justify-self-end"
        >
          {c.hospitals.lead}
        </motion.p>
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:mt-16">
        {hospitals.map((h, i) => (
          <motion.li
            key={h.slug}
            variants={reveal}
            // Stagger by column, so a row lands together rather than the sixth
            // card arriving half a second after the first.
            custom={i % 3}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            whileHover={still ? undefined : { y: -4, transition: spring }}
            className="group overflow-hidden rounded-[1.25rem] border border-[#14120F]/10 bg-[#FAF9F7] transition-colors will-change-transform hover:border-[#C0A578]/60"
          >
            <div className={h.logo ? 'hero-gradient relative overflow-hidden' : 'relative overflow-hidden'}>
              <img
                src={h.img}
                alt={h.name}
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                className={
                  h.logo
                    ? 'aspect-[4/3] w-full object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-[1.04]'
                    : 'aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]'
                }
              />
              {!h.logo && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#14120F]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              )}
            </div>

            <div className="flex items-baseline justify-between gap-4 border-t border-[#14120F]/10 px-5 py-4">
              <div className="min-w-0">
                <p
                  lang={script(h.name).lang}
                  className={`font-display truncate text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#14120F] ${script(h.name).className}`}
                >
                  {h.name}
                </p>
                <p
                  lang={script(h.note).lang}
                  className={`mt-1.5 truncate text-[11px] font-medium uppercase tracking-[0.14em] text-[#6f685c] ${script(h.note).className}`}
                >
                  {h.note}
                </p>
              </div>
              <span
                className="shrink-0 text-[11px] tabular-nums text-[#C0A578] opacity-70 transition-opacity group-hover:opacity-100"
                dir="ltr"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
