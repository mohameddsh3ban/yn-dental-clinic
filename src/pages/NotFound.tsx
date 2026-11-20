import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { SubpageHeader } from '@/components/SubpageHeader'
import Footer from '@/sections/Footer'
import { useI18n } from '@/lib/i18n'
import { SERVICES_PATH, usePagesCopy } from '@/lib/pages'
import { whatsappUrl } from '@/lib/site'

/**
 * The page for an address that does not exist. It is pre-rendered to
 * `404.html`, which Cloudflare Pages serves with a real 404 status — before
 * this, every unknown URL answered 200 with the homepage, which search engines
 * treat as an endless supply of duplicate pages.
 */
export default function NotFound() {
  const { c, path } = useI18n()
  const { ui, notFound } = usePagesCopy()

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <div className="p-3 sm:p-4 xl:p-6">
        <section className="hero-gradient relative overflow-hidden rounded-[1.75rem] xl:rounded-[2.25rem]">
          <SubpageHeader whatsapp={whatsappUrl(c.site.whatsappMessage)} />

          <div className="relative z-10 mx-auto w-full max-w-[1760px] px-5 pb-16 pt-12 sm:px-8 xl:px-14 xl:pb-24 xl:pt-20 2xl:px-20">
            <p className="flex items-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">
              <span aria-hidden className="me-3 inline-block h-px w-5 bg-[#C0A578]" />
              {notFound.eyebrow}
            </p>
            <h1 className="font-display mt-4 max-w-[18ch] text-[clamp(1.95rem,4.4vw,3.4rem)] font-medium leading-[1.06] tracking-[-0.02em] text-[#14120F]">
              {notFound.h1}
            </h1>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.7] text-[#3a352f]">
              {notFound.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={path('/')}
                className="group inline-flex items-center gap-3 rounded-full bg-[#14120F] py-4 ps-7 pe-6 text-[13px] font-medium text-white transition-transform hover:scale-[1.02]"
              >
                {notFound.home}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </Link>
              <Link
                to={path(SERVICES_PATH)}
                className="inline-flex items-center rounded-full border border-[#14120F]/15 bg-white/60 px-6 py-4 text-[13px] font-medium text-[#14120F] backdrop-blur transition-colors hover:bg-[#14120F] hover:text-white"
              >
                {ui.allServices}
              </Link>
            </div>
          </div>
        </section>
      </div>

      <main className="px-3 pb-3 sm:px-4 sm:pb-4 xl:px-6 xl:pb-6">
        <Footer />
      </main>
    </div>
  )
}
