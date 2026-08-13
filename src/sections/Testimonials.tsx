import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { Star } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

const quotes = [
  {
    text: 'The calmest dental visit of my life. Everything was explained before it happened — zero surprises, zero pain.',
    name: 'Sophie M.',
    role: 'Veneers patient',
  },
  {
    text: 'Booked online at 9am, seen by lunch. The team is warm, the clinic is spotless, and my smile has never looked better.',
    name: 'Daniel K.',
    role: 'Implant patient',
  },
  {
    text: 'I used to dread the dentist. Dr. Youssef and his team changed that completely — gentle, patient, and genuinely kind people.',
    name: 'Amara L.',
    role: 'Check-up regular',
  },
  {
    text: 'My whitening results were instant and natural. They talked me out of overdoing it. That honesty earned a client for life.',
    name: 'Robert W.',
    role: 'Whitening patient',
  },
  {
    text: 'Two implants, both painless, both perfect. The aftercare calls afterwards were a lovely, unexpected touch.',
    name: 'Elena R.',
    role: 'Implant patient',
  },
]

const avatarColors = ['bg-[#C0A578]', 'bg-[#14120F]', 'bg-[#8f8574]', 'bg-[#2B2723]', 'bg-[#a78f63]']

function QuoteCard({ q, i }: { q: (typeof quotes)[number]; i: number }) {
  return (
    <div className="flex w-[320px] shrink-0 flex-col rounded-[1.5rem] bg-[#F4F3F0] p-6 sm:w-[380px]">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="h-3.5 w-3.5 fill-[#C0A578] text-[#C0A578]" />
        ))}
      </div>
      <p className="mt-4 flex-1 text-[13px] leading-relaxed text-[#2B2723]">“{q.text}”</p>
      <div className="mt-6 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold text-white ${avatarColors[i % avatarColors.length]}`}
        >
          {q.name.split(' ').map((w) => w[0]).join('')}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#14120F]">{q.name}</p>
          <p className="text-[11px] text-[#9a9184]">{q.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="overflow-hidden rounded-[1.75rem] bg-white py-10 sm:py-14 xl:rounded-[2.25rem] xl:py-16">
      <div className="px-6 sm:px-10 xl:px-14 2xl:px-16">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
              Testimonials <span className="text-[#C0A578]">/</span>
            </p>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
              Smiles that <span className="text-outline">speak</span>
            </h2>
          </div>
          <p className="max-w-[300px] text-[13px] leading-relaxed text-[#7a7367]">
            Real words from real patients — the reason 9 out of 10 new clients
            arrive on a friend's recommendation.
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="marquee-pause relative mt-10 xl:mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
        <div className="animate-marquee flex w-max gap-5 px-5">
          {[...quotes, ...quotes].map((q, i) => (
            <QuoteCard key={i} q={q} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
