/* eslint-disable react-refresh/only-export-components -- build-time entry; it is never hot-reloaded */
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router'
import { MotionConfig } from 'framer-motion'
import App from './App'
import { I18nProvider } from '@/lib/I18nProvider'
import { LANGS } from '@/lib/copy'
import { loadBundle } from '@/lib/copy/bundle'

/**
 * Build-time entry: renders one URL to the HTML that goes inside #root.
 * `scripts/prerender.mjs` calls it for every route in every language.
 *
 * `prerender` waits for every lazy chunk and suspended boundary,
 * so the output is the whole page — hero, sections, footer — and carries the
 * markers `hydrateRoot` needs to adopt it in the browser.
 */
export async function render(url: string): Promise<string> {
  await Promise.all(LANGS.map(loadBundle))

  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <I18nProvider>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </I18nProvider>
      </StaticRouter>
    </StrictMode>,
  )

  return new Response(prelude).text()
}

export async function ready(): Promise<void> {
  await Promise.all(LANGS.map(loadBundle))
}

export { LANGS, LANG_META } from '@/lib/copy'
export { getBundle } from '@/lib/copy/bundle'
export { SITE_URL, absolute, langOf, localize } from '@/lib/paths'
export { getSeo, indexablePaths, renderHead } from '@/lib/seo'
export { CONTACT_PATH, PAGES, SERVICES_PATH } from '@/lib/pages'
export { PLANNING_PATH, planningMeta } from '@/lib/planning3d'
export { doctorSlugs, doctorFrom } from '@/lib/team'
export { site } from '@/lib/site'
