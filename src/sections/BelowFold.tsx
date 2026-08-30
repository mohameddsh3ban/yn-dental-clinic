import Services from '@/sections/Services'
import About from '@/sections/About'
import Hospitals from '@/sections/Hospitals'
import Testimonials from '@/sections/Testimonials'
import Location from '@/sections/Location'
import Footer from '@/sections/Footer'

/**
 * Everything on the homepage below the hero, in one lazily-loaded chunk. It is
 * a single module rather than six so the split costs one request, not six.
 */
export default function BelowFold() {
  return (
    <main className="space-y-3 px-3 pb-3 sm:space-y-4 sm:px-4 sm:pb-4 xl:space-y-6 xl:px-6 xl:pb-6">
      <Services />
      <About />
      <Hospitals />
      <Testimonials />
      <Location />
      <Footer />
    </main>
  )
}
