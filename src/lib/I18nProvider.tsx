import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { DIR, dictionaries, fill, type Lang } from '@/lib/copy'
import { I18nContext, type I18n } from '@/lib/i18n'

const STORAGE_KEY = 'ozea.lang'

/** A stored choice wins; otherwise an Arabic browser gets Arabic. */
function initialLang(): Lang {
  if (typeof window === 'undefined') return 'en'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'ar') return stored

  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const dir = DIR[lang]

  // `dir` on <html> is what flips every logical margin, padding and inset in
  // the stylesheet, so it has to be the single switch — no component sets its
  // own direction except the hero artwork, which is pinned to the drawing.
  // `lang` drives the Arabic typography block in index.css.
  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.dir = dir
  }, [lang, dir])

  // The title and the description are deliberately NOT set here: a provider's
  // effect runs after its children's, so writing them from this level would
  // overwrite whatever page had just set its own. Each page owns its own with
  // `useDocumentMeta`, reading the same dictionary.

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private mode or a blocked store: the choice still holds for this visit.
    }
  }, [])

  const value = useMemo<I18n>(
    () => ({
      lang,
      dir,
      rtl: dir === 'rtl',
      c: dictionaries[lang],
      setLang,
      toggle: () => setLang(lang === 'en' ? 'ar' : 'en'),
      t: (template, values) => (values ? fill(template, values) : template),
    }),
    [lang, dir, setLang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
