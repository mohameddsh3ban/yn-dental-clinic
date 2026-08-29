import { Link } from 'react-router'
import HeroFacial from '@/sections/HeroFacial'

/**
 * Review surface for the face-led hero. The concept picker that used to live
 * here is gone along with the exploratory jaw renders it switched between: the
 * artwork is settled — it is the client's own drawing, prepared for the web by
 * `npm run build:hero-art`.
 */
export default function HeroDemo() {
  return (
    <div className="min-h-screen bg-[#CFC8BC]">
      <div className="mx-auto flex max-w-[1760px] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-6 pt-5 sm:px-10">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
          Hero review — the reference face line with the skull read through it
        </p>
        <Link
          to="/"
          className="text-[12px] font-medium text-[#3a352f] underline underline-offset-4 transition-colors hover:text-[#14120F]"
        >
          Back to the live site
        </Link>
      </div>

      <HeroFacial />
    </div>
  )
}
