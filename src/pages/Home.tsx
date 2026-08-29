import { useEffect } from 'react'
import HeroFacial from '@/sections/HeroFacial'
import Services from '@/sections/Services'
import About from '@/sections/About'
import Hospitals from '@/sections/Hospitals'
import Testimonials from '@/sections/Testimonials'
import Location from '@/sections/Location'
import Footer from '@/sections/Footer'
import FloatingNav from '@/components/FloatingNav'
import { useI18n } from '@/lib/i18n'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

export default function Home() {
  const { c } = useI18n()
  useDocumentMeta(c.meta.title, c.meta.description)

  // Deep-link support: honor #section anchors once the SPA has mounted
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash)
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'instant' as ScrollBehavior }))
    }
  }, [])

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <FloatingNav />
      <HeroFacial />
      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        <Services />
        <About />
        <Hospitals />
        <Testimonials />
        <Location />
        <Footer />
      </main>
    </div>
  )
}
