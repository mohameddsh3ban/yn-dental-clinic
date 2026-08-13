import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { ArrowUpRight } from 'lucide-react'
import clinic from '@/assets/about-clinic.jpg'
import doctor1 from '@/assets/doctor-1.jpg'
import doctor2 from '@/assets/doctor-2.jpg'
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

const stats = [
  { value: '98', suffix: '%', label: 'Satisfaction rate' },
  { value: '50', suffix: 'K', label: 'Smiles transformed' },
  { value: '4.9', suffix: '', label: 'Customer rating' },
]

const doctors = [
  { name: site.doctor, role: 'Implants & Maxillofacial Surgery', img: doctor1 },
  { name: 'Clinical Care Team', role: 'Hygiene · Cosmetic · Aftercare', img: doctor2 },
]

export default function About() {
  return (
    <section id="about" className="hero-gradient rounded-[1.75rem] p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Image */}
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[1.5rem]">
            <img
              src={clinic}
              alt={`${site.name} — dentist treating a relaxed patient`}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
            />
          </div>
          <div className="glass-chip absolute -bottom-5 left-5 rounded-2xl px-5 py-4 sm:left-8">
            <p className="font-display text-[26px] font-medium leading-none text-[#14120F]">
              15<span className="text-[#C0A578]">+</span>
            </p>
            <p className="mt-1.5 text-[11px] text-[#7a7367]">Years of gentle expertise</p>
          </div>
        </motion.div>

        {/* Copy */}
        <div>
          <motion.div
            variants={reveal}
            custom={1}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
              About {site.short} <span className="text-[#C0A578]">/</span>
            </p>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
              Excellence in dentistry with{' '}
              <span className="text-outline">compassionate</span> care
            </h2>
            <p className="mt-6 max-w-[440px] text-[14px] leading-relaxed text-[#7a7367]">
              Every treatment plan is built around you — your comfort, your
              schedule, your goals. Our clinicians combine leading technology
              with a genuinely gentle chairside manner.
            </p>
            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full border border-[#14120F]/15 bg-white/60 py-3.5 pl-6 pr-5 text-[13px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white"
            >
              Read more
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          {/* Doctors */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {doctors.map((d, i) => (
              <motion.div
                key={d.name}
                variants={reveal}
                custom={2 + i}
                initial={snap ? false : 'hidden'}
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                className="group flex items-center gap-4 rounded-2xl border border-white/70 bg-white/60 p-3 backdrop-blur transition-shadow hover:shadow-[0_12px_36px_rgba(20,18,15,0.22)]"
              >
                <img
                  src={d.img}
                  alt={d.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#14120F]">{d.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#9a9184]">{d.role}</p>
                </div>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#14120F]/5 text-[#14120F] transition-colors group-hover:bg-[#14120F] group-hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid gap-8 border-t border-[#14120F]/10 pt-10 sm:grid-cols-3 xl:mt-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={reveal}
            custom={i}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="flex items-baseline gap-4 sm:flex-col sm:gap-2"
          >
            <p className="font-display text-[clamp(2.6rem,4vw,3.6rem)] font-medium leading-none tracking-tight text-[#14120F]">
              {s.value}
              <span className="text-[#C0A578]">{s.suffix}</span>
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#9a9184]">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
