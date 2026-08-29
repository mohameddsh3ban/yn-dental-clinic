import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import HeroDemo from './pages/HeroDemo'
import DoctorProfile from './pages/DoctorProfile'

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
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:slug" element={<DoctorProfile />} />
        {/* Concept sandbox for hero artwork — not linked from the live site. */}
        <Route path="/hero-demo" element={<HeroDemo />} />
      </Routes>
    </>
  )
}
