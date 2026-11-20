import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getSeo, jsonLdText } from '@/lib/seo'

function setMeta(selector: string, content: string) {
  document.head.querySelector(selector)?.setAttribute('content', content)
}

/**
 * Keeps <head> in step with the route during client-side navigation.
 *
 * Every page arrives pre-rendered with the right head already in the HTML —
 * that is what a crawler reads. This hook only matters after a visitor clicks
 * through to another page without a reload: the title, description,
 * canonical, hreflang links and structured data are rewritten from the same
 * `getSeo` the build used, so a shared link or a rendered crawl of the live
 * document never describes the previous page.
 */
export function useSeo() {
  const { pathname } = useLocation()

  useEffect(() => {
    const seo = getSeo(pathname)
    const head = document.head

    document.title = seo.title
    setMeta('meta[name="description"]', seo.description)
    setMeta('meta[name="robots"]', seo.robots)
    setMeta('meta[property="og:url"]', seo.canonical)
    setMeta('meta[property="og:title"]', seo.title)
    setMeta('meta[property="og:description"]', seo.description)
    setMeta('meta[property="og:type"]', seo.ogType)
    setMeta('meta[property="og:locale"]', seo.ogLocale)
    setMeta('meta[name="twitter:title"]', seo.title)
    setMeta('meta[name="twitter:description"]', seo.description)
    head.querySelector('link[rel="canonical"]')?.setAttribute('href', seo.canonical)

    head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove())
    for (const alt of seo.alternates) {
      const link = document.createElement('link')
      link.rel = 'alternate'
      link.hreflang = alt.hreflang
      link.href = alt.href
      head.appendChild(link)
    }

    head.querySelectorAll('script[data-seo]').forEach((el) => el.remove())
    if (seo.jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.seo = ''
      script.textContent = jsonLdText(seo.jsonLd)
      head.appendChild(script)
    }
  }, [pathname])
}
