import type { Copy, Lang } from '@/lib/copy'
import type { PagesCopy } from './pages/types'

/**
 * Everything written in one language: the homepage/section copy and the
 * long-form page copy.
 *
 * Each language is a separate chunk. With four languages, shipping all of them
 * in the main bundle would add more JavaScript than the whole below-the-fold
 * page; this way a visitor fetches one. The build pre-renders every page with
 * its language already in the HTML and adds a `modulepreload` for the matching
 * chunk, so the request starts with the document rather than after the app
 * has booted.
 */
export type Bundle = { site: Copy; pages: PagesCopy }

const loaders: Record<Lang, () => Promise<{ default: Bundle }>> = {
  en: () => import('./bundles/en'),
  ar: () => import('./bundles/ar'),
  fr: () => import('./bundles/fr'),
  ru: () => import('./bundles/ru'),
}

const ready = new Map<Lang, Bundle>()
const pending = new Map<Lang, Promise<Bundle>>()

/** Starts (or joins) the download. The same promise is returned every time. */
export function loadBundle(lang: Lang): Promise<Bundle> {
  let promise = pending.get(lang)
  if (!promise) {
    promise = loaders[lang]().then((m) => {
      ready.set(lang, m.default)
      return m.default
    })
    pending.set(lang, promise)
  }
  return promise
}

/** The bundle if it has already arrived. */
export function peekBundle(lang: Lang): Bundle | undefined {
  return ready.get(lang)
}

/** For code that runs after the language is known to be loaded. */
export function getBundle(lang: Lang): Bundle {
  const bundle = ready.get(lang)
  if (!bundle) throw new Error(`Language bundle "${lang}" used before it was loaded`)
  return bundle
}
