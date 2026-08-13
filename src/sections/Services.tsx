import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import cleaning from '@/assets/service-cleaning.jpg'
import checkup from '@/assets/service-checkup.jpg'
import veneers from '@/assets/service-veneers.jpg'
import implant from '@/assets/implant.png'
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

const services = [
  { title: 'Teeth Cleaning', tag: 'Hygiene', img: cleaning },
  { title: 'Dental Checkups', tag: 'Preventive', img: checkup },
  { title: 'Dental Veneers', tag: 'Cosmetic', img: veneers },
]

const avatarColors = ['bg-[#C0A578]', 'bg-[#14120F]', 'bg-[#8f8574]', 'bg-[#2B2723]']

export default function Services() {
  return (
    <section id="services" className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16">
      {/* Header */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
            Our Services <span className="text-[#C0A578]">/</span>
          </p>
          <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
            Discover our signature
            <br />
            dental <span className="text-outline">services</span>
          </h2>
        </motion.div>
        <motion.p
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-[380px] text-[14px] leading-relaxed text-[#7a7367] lg:justify-self-end"
        >
          Experience modern dental care delivered with comfort, precision, and
          attention to detail — in a calm, welcoming environment designed to
          make every visit stress-free.
        </motion.p>
      </div>

      {/* Body */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr] xl:mt-16">
        {/* Left meta column */}
        <motion.div
          variants={reveal}
          custom={1}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-row items-center justify-between gap-6 lg:flex-col lg:items-start lg:justify-start"
        >
          <div>
            <div className="flex -space-x-3">
              {['SM', 'JK', 'AL', 'RW'].map((n, i) => (
                <span
                  key={n}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white ${avatarColors[i]}`}
                >
                  {n}
                </span>
              ))}
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#F4F3F0] text-[11px] font-semibold text-[#14120F]">
                +
              </span>
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[#14120F]">
              750<span className="text-[#C0A578]">+</span>
              <span className="ml-1.5 text-[12px] font-normal text-[#9a9184]">Reviews</span>
            </p>
            <p className="mt-3 hidden max-w-[200px] text-[12px] leading-relaxed text-[#7a7367] lg:block">
              Discover delighted patient reviews about their comforting and
              satisfying dental care experience.
            </p>
          </div>
          <div className="flex gap-3 lg:mt-auto lg:pt-10">
            <button
              aria-label="Previous services"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd6ca] text-[#14120F] transition-colors hover:bg-[#14120F] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              aria-label="Next services"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14120F] text-white transition-transform hover:scale-105"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((s, i) => (
            <motion.a
              key={s.title}
              href="#contact"
              variants={reveal}
              custom={2 + i}
              initial={snap ? false : 'hidden'}
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#F4F3F0]"
            >
              <img
                src={s.img}
                alt={s.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14120F]/70 via-[#14120F]/10 to-transparent" />
              <span className="glass-chip absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-semibold text-[#14120F]">
                {s.tag}
              </span>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
                <h3 className="font-display max-w-[60%] text-[19px] font-medium leading-tight text-white">
                  {s.title}
                </h3>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors duration-300 group-hover:bg-white group-hover:text-[#14120F]">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </motion.a>
          ))}

          {/* Implants card — brand object on gradient */}
          <motion.a
            href="#contact"
            variants={reveal}
            custom={5}
            initial={snap ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="hero-gradient group relative aspect-[4/5] overflow-hidden rounded-[1.5rem]"
          >
            <div
              aria-hidden
              className="font-display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[7rem] font-semibold leading-none tracking-tighter text-white/25"
            >
              {site.short}
            </div>
            <img
              src={implant}
              alt="Dental implants"
              className="absolute left-1/2 top-1/2 h-[72%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_20px_30px_rgba(20,18,15,0.35)] transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            <span className="glass-chip absolute left-4 top-4 rounded-full px-3 py-1.5 text-[10px] font-semibold text-[#14120F]">
              Surgical
            </span>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between">
              <h3 className="font-display max-w-[60%] text-[19px] font-medium leading-tight text-[#14120F]">
                Implants
              </h3>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14120F]/10 text-[#14120F] backdrop-blur transition-colors duration-300 group-hover:bg-[#14120F] group-hover:text-white">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
