import { use, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { DIR, fill, type Lang } from '@/lib/copy'
import { loadBundle, peekBundle } from '@/lib/copy/bundle'
import { I18nContext, type I18n } from '@/lib/i18n'
import { inLang, langOf, localize } from '@/lib/paths'

/**
 * The language is the URL: `/…` is English, `/ar/…` is Arabic, and so on (see
 * `lib/paths.ts`). It used to be a localStorage preference, which meant the
 * Arabic site had no address — nothing could link to it and no search engine
 * could index it. Reading it from the path also lets the build pre-render each
 * language to its own HTML file.
 *
 * Has to sit inside the router, since it reads the location.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const lang = langOf(pathname)
  const dir = DIR[lang]

  // Each language is its own chunk. `main.tsx` loads the one for the landing
  // URL before the first render, so this is synchronous on arrival; switching
  // language suspends for the moment it takes the next chunk to arrive (the
  // language menu starts that download as soon as it is opened).
  const bundle = peekBundle(lang) ?? use(loadBundle(lang))

  // `dir` on <html> is what flips every logical margin, padding and inset in
  // the stylesheet, so it has to be the single switch — no component sets its
  // own direction except the hero artwork, which is pinned to the drawing.
  // `lang` drives the Arabic typography block in index.css. The pre-rendered
  // HTML already carries both; this keeps them right across client navigation.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
  }, [lang, dir])

  const setLang = useCallback(
    (next: Lang) => {
      if (next !== lang) navigate(inLang(pathname, next))
    },
    [lang, pathname, navigate],
  )

  const value = useMemo<I18n>(
    () => ({
      lang,
      dir,
      rtl: dir === 'rtl',
      c: bundle.site,
      p: bundle.pages,
      setLang,
      t: (template, values) => (values ? fill(template, values) : template),
      path: (to) => localize(to, lang),
      pathIn: (next) => inLang(pathname, next),
    }),
    [lang, dir, bundle, setLang, pathname],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
