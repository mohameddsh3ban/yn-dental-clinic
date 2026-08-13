import { useEffect } from 'react'
import Hero from '@/sections/Hero'
import Services from '@/sections/Services'
import About from '@/sections/About'
import Testimonials from '@/sections/Testimonials'
import Location from '@/sections/Location'
import Footer from '@/sections/Footer'
import FloatingNav from '@/components/FloatingNav'

export default function Home() {
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
      <Hero />
      <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
        <Services />
        <About />
        <Testimonials />
        <Location />
        <Footer />
      </main>
    </div>
  )
}
