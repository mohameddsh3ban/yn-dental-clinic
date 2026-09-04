import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import { SITE_SUSPENDED } from '@/lib/suspended'

// The homepage is what every visit lands on; the other two routes are reached
// by a click, so their code is fetched then rather than shipped in the bundle
// that has to parse before the hero can paint.
const HeroDemo = lazy(() => import('./pages/HeroDemo'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'))

/**
 * A client-side route change keeps the old scroll position, which lands a
 * doctor profile halfway down the page. Anchored links keep their own
 * behaviour — the page being navigated to handles the hash.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

export default function App() {
  // While the site is suspended every URL — including a bookmarked doctor
  // profile — resolves to the suspended homepage, so no page is reachable
  // around the notice.
  if (SITE_SUSPENDED) {
    return (
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    )
  }

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team/:slug" element={<DoctorProfile />} />
          {/* Concept sandbox for hero artwork — not linked from the live site. */}
          <Route path="/hero-demo" element={<HeroDemo />} />
        </Routes>
      </Suspense>
    </>
  )
}
