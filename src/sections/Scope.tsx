import { motion } from 'framer-motion'
import { snap } from '@/lib/anim'

const ease = [0.22, 1, 0.36, 1] as const

const reveal = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease, delay: i * 0.1 },
  }),
}

/**
 * What the practice operates on — the answer to "do you do my operation?".
 *
 * This register used to live in the hero. It moved out when the hero became the
 * face drawing, because it is the only place on the site that names the surgical
 * work: the services section covers general dentistry (cleaning, checkups,
 * veneers), so without this list a patient looking for jaw surgery or trauma
 * reconstruction would find nothing that says the clinic does it.
 */
const SCOPE = [
  ['Orthognathic Surgery', 'Corrective jaw alignment'],
  ['Facial Trauma & Reconstruction', 'Mandible, orbit and zygoma'],
  ['Temporomandibular Joint', 'TMJ pain, clicking and locking'],
  ['Impacted Third Molars', 'Surgical wisdom-tooth removal'],
  ['Cysts & Benign Lesions', 'Excision and biopsy'],
  ['Bone Grafting & Sinus Lift', 'Preparing the site for implants'],
  ['Dental Implants', 'Single unit to full arch'],
] as const

export default function Scope() {
  return (
    <section
      id="scope"
      aria-labelledby="scope-heading"
      className="rounded-[1.75rem] bg-white p-6 sm:p-10 xl:rounded-[2.25rem] xl:p-14 2xl:p-16"
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <motion.div
          variants={reveal}
          initial={snap ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#9a9184]">
            Scope of practice <span className="text-[#C0A578]">/</span>{' '}
            <span className="tabular-nums">01–07</span>
          </p>
          <h2
            id="scope-heading"
            className="font-display mt-4 text-[clamp(1.9rem,4.2vw,3.4rem)] font-medium uppercase leading-[1.04] tracking-tight text-[#14120F]"
          >
            What we
            <br />
            <span className="text-outline">operate</span> on
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
          Oral and maxillofacial surgery, planned from imaging and measurement.
          Every case starts with a consultation and a written plan you keep —
          including the cases we refer on.
        </motion.p>
      </div>

      <ul className="mt-10 border-t border-[#14120F]/10 md:grid md:grid-cols-2 md:gap-x-12 xl:mt-14">
        {SCOPE.map(([name, descriptor], i) => (
          <motion.li
            key={name}
            initial={snap ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: snap ? 0 : 0.5, delay: snap ? 0 : i * 0.045, ease }}
            className="group border-b border-[#14120F]/10"
          >
            <div className="flex min-h-[56px] flex-col justify-center gap-x-4 py-3 lg:flex-row lg:items-baseline lg:py-4">
              <span className="flex items-baseline gap-3">
                <span className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-[#9a9184] transition-colors group-hover:text-[#C0A578]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-[15px] font-medium tracking-[-0.01em] text-[#3a352f] transition-colors group-hover:text-[#14120F] xl:text-[17px]">
                  {name}
                </span>
              </span>
              <span className="ml-[26px] text-[11px] leading-snug text-[#7a7367] lg:ml-auto lg:max-w-[52%] lg:text-right xl:text-[12px]">
                {descriptor}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
