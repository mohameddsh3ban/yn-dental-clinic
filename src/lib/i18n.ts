import { createContext, useContext } from 'react'
import type { Copy, Lang } from '@/lib/copy'

/**
 * The language context and the hook that reads it.
 *
 * The provider lives in `I18nProvider.tsx`, not here: a module that exports
 * both a component and a plain function is not a valid fast-refresh boundary,
 * and Vite would drop the whole tree's state on every edit to a dictionary.
 * Components import `useI18n` from here; only `main.tsx` needs the provider.
 */
export type I18n = {
  lang: Lang
  dir: 'ltr' | 'rtl'
  /** True when the page reads right to left — used to mirror scroll maths. */
  rtl: boolean
  /** The whole dictionary for the active language. */
  c: Copy
  setLang: (next: Lang) => void
  toggle: () => void
  /** `t(c.hero.bookAria, { doctor })` — fills `{name}` placeholders. */
  t: (template: string, values?: Record<string, string>) => string
}

export const I18nContext = createContext<I18n | null>(null)

export function useI18n(): I18n {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

export type { Lang }
