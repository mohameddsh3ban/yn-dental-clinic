import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'
import { Star } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import type { Copy } from '@/lib/copy'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

/** Each chip carries the ink that clears 4.5:1 on its own fill. */
const avatarChips = [
  'bg-[#C0A578] text-[#14120F]',
  'bg-[#14120F] text-white',
  'bg-[#8f8574] text-[#14120F]',
  'bg-[#2B2723] text-white',
  'bg-[#a78f63] text-[#14120F]',
]

type Quote = Copy['testimonials']['quotes'][number]

/** Latin names reduce to two initials; an Arabic name reads better as one. */
function initials(q: Quote) {
  if (q.lang === 'ar') return q.name.trim()[0]
  return q.name
    .split(' ')
    .map((w) => w[0])
    .join('')
}

/**
 * A quote carries its own language, not the page's. Most of the clinic's
 * patients are from Nasr City and left their review in Egyptian Arabic, so
 * those cards keep the dialect they were written in whichever way the rest of
 * the site is reading — translating them would turn a neighbour into a
 * brochure. `lang` therefore drives the card's direction, its typeface (Inter
 * ships no Arabic glyphs) and its quotation marks.
 */
function QuoteCard({ q, i }: { q: Quote; i: number }) {
  const ar = q.lang === 'ar'
  return (
    // The rail that carries these is pinned LTR so the marquee keeps running one
    // way; each card carries its own reading direction back for its own text.
    <div
      dir={ar ? 'rtl' : 'ltr'}
      lang={ar ? 'ar' : 'en'}
      className={`flex w-[320px] shrink-0 flex-col rounded-[1.5rem] bg-[#F4F3F0] p-6 sm:w-[380px] ${
        ar ? 'font-ar text-right' : 'text-left'
      }`}
    >
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, s) => (
          <Star key={s} className="h-3.5 w-3.5 fill-[#C0A578] text-[#C0A578]" />
        ))}
      </div>
      {/* Arabic sets optically smaller than Latin at the same px and needs more
          leading for its ascenders, so both are nudged up to keep the two card
          types reading at the same weight in one row. */}
      <p
        className={`mt-4 flex-1 text-[#2B2723] ${
          ar ? 'text-[14px] leading-[1.85]' : 'text-[13px] leading-relaxed'
        }`}
      >
        {ar ? `«${q.text}»` : `“${q.text}”`}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${avatarChips[i % avatarChips.length]}`}
        >
          {initials(q)}
        </span>
        <div>
          <p className={`font-semibold text-[#14120F] ${ar ? 'text-[14px]' : 'text-[13px]'}`}>
            {q.name}
          </p>
          <p className={`text-[#6f685c] ${ar ? 'text-[12px]' : 'text-[11px]'}`}>{q.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const { c } = useI18n()
  const quotes = c.testimonials.quotes

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
            <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#6f685c]">
              {c.testimonials.eyebrow} <span className="text-[#C0A578]">/</span>
            </p>
            <h2 className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]">
              {c.testimonials.headlineTop}{' '}
              <span className="text-outline">{c.testimonials.headlineOutlined}</span>
            </h2>
          </div>
          <p className="max-w-[300px] text-[13px] leading-relaxed text-[#7a7367]">
            {c.testimonials.lead}
          </p>
        </motion.div>
      </div>

      {/* Marquee. The track stays LTR in both languages: the animation
          translates the row by a fixed -50%, and letting the row flip would
          send it off screen on the first frame in Arabic. */}
      <div className="marquee-pause relative mt-10 xl:mt-12" dir="ltr">
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
