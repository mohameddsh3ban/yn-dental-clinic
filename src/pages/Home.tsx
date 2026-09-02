import { lazy, Suspense, useEffect, useState } from 'react'
import HeroFacial from '@/sections/HeroFacial'
import { useI18n } from '@/lib/i18n'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

/**
 * Only the hero is above the fold, and it is the page's LCP element. Every
 * other section — and the page chrome (floating nav, scroll hairline, back to
 * top), none of which appears until the hero has scrolled away — is split out so the browser parses and commits the hero
 * on its own first. The rest arrives in a second chunk that is requested as
 * soon as this module renders, which on any real connection lands well before
 * a visitor has scrolled to it.
 */
const PageChrome = lazy(() => import('@/components/PageChrome'))
const BelowFold = lazy(() => import('@/sections/BelowFold'))

export default function Home() {
  const { c } = useI18n()
  useDocumentMeta(c.meta.title, c.meta.description)

  // Hold the rest of the page back until the hero has actually been painted.
  // Committing ~800 more nodes in the same frame makes the browser style and
  // lay all of them out before it can paint the hero drawing, which is the
  // page's largest contentful paint. Two frames later nobody has scrolled yet.
  const [belowFold, setBelowFold] = useState(false)
  useEffect(() => {
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setBelowFold(true))
    })
    return () => {
      cancelAnimationFrame(first)
      if (second) cancelAnimationFrame(second)
    }
  }, [])

  // Deep-link support: honor #section anchors once the SPA has mounted. The
  // target may live in the split chunk, so keep looking for it across a few
  // frames rather than giving up on the first miss.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    let frame = 0
    let tries = 0

    const find = () => {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
        return
      }
      // ~2s at 60fps, then stop: the anchor does not exist on this page.
      if (tries++ < 120) frame = requestAnimationFrame(find)
    }

    frame = requestAnimationFrame(find)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div id="top" className="bg-[#CFC8BC]">
      <Suspense fallback={null}>
        <PageChrome />
      </Suspense>
      <HeroFacial />
      {belowFold && (
        <Suspense fallback={null}>
          <BelowFold />
        </Suspense>
      )}
    </div>
  )
}
