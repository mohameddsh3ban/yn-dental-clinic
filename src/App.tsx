import { Fragment, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import { LANGS } from '@/lib/copy'
import { CONTACT_PATH, PAGES, SERVICES_PATH } from '@/lib/pages'
import { prefixOf } from '@/lib/paths'
import { PLANNING_PATH } from '@/lib/planning3d'
import { SITE_SUSPENDED } from '@/lib/suspended'
import { useSeo } from '@/lib/useSeo'

// The homepage is what most visits land on; every other route's code is fetched
// when it is needed rather than shipped in the bundle that has to parse before
// the hero can paint. A visitor who lands directly on one of these pages gets
// it pre-rendered in the HTML, with its chunk preloaded from the head.
const HeroDemo = lazy(() => import('./pages/HeroDemo'))
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'))
const ContentPage = lazy(() => import('./pages/ContentPage'))
const ServicesIndex = lazy(() => import('./pages/ServicesIndex'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const Planning3D = lazy(() => import('./pages/Planning3D'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
  // Title, description, canonical, hreflang and structured data follow the
  // route on client-side navigation (the pre-rendered HTML already has them).
  useSeo()

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
          {/* The same routes once per language: English at the root, the
              others under their code (see lib/paths.ts). */}
          {LANGS.map((lang) => {
            const pre = prefixOf(lang)
            return (
              <Fragment key={lang}>
                <Route path={pre || '/'} element={<Home />} />
                <Route path={`${pre}${SERVICES_PATH}`} element={<ServicesIndex />} />
                {PAGES.map((page) => (
                  <Route
                    key={page.id}
                    path={`${pre}${page.path}`}
                    // Keyed, so moving between two treatments is a fresh page
                    // rather than the previous one with its text swapped.
                    element={<ContentPage key={page.id} id={page.id} />}
                  />
                ))}
                <Route path={`${pre}/team/:slug`} element={<DoctorProfile />} />
                <Route path={`${pre}${CONTACT_PATH}`} element={<ContactPage />} />
                <Route path={`${pre}${PLANNING_PATH}`} element={<Planning3D />} />
              </Fragment>
            )
          })}
          {/* Concept sandbox for hero artwork — not linked from the live site
              and marked noindex. */}
          <Route path="/hero-demo" element={<HeroDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
