import type { Copy } from './en'

export type Lang = 'en' | 'ar' | 'fr' | 'ru'

export type { Copy }

/** In menu order. English is the default and lives at the root of the site. */
export const LANGS: readonly Lang[] = ['en', 'ar', 'fr', 'ru']

export const DEFAULT_LANG: Lang = 'en'

// The dictionaries themselves are not imported here. Each language is its own
// chunk, loaded on demand through `./bundle.ts`, so a visitor downloads the
// copy for the language they are reading and not the other three.

/** Which way each language reads. Drives `<html dir>` and every logical margin. */
export const DIR: Record<Lang, 'ltr' | 'rtl'> = { en: 'ltr', ar: 'rtl', fr: 'ltr', ru: 'ltr' }

/**
 * What the rest of the site needs to know about a language that is not copy:
 * its name in its own script (a visitor who cannot read the current page can
 * still find theirs), the hreflang code, and the Open Graph locale.
 *
 * The hreflang codes carry no region on purpose: the Arabic pages are for
 * Arabic speakers in Egypt and the Gulf alike, the French and Russian ones for
 * French and Russian speakers anywhere.
 */
export const LANG_META: Record<
  Lang,
  { label: string; short: string; hreflang: string; ogLocale: string }
> = {
  en: { label: 'English', short: 'EN', hreflang: 'en', ogLocale: 'en_US' },
  ar: { label: 'العربية', short: 'عربي', hreflang: 'ar', ogLocale: 'ar_EG' },
  fr: { label: 'Français', short: 'FR', hreflang: 'fr', ogLocale: 'fr_FR' },
  ru: { label: 'Русский', short: 'RU', hreflang: 'ru', ogLocale: 'ru_RU' },
}

/**
 * The clinic consults in Arabic and English. A French or Russian visitor's
 * pre-filled WhatsApp message is therefore written in English, so whoever
 * picks it up at the clinic can read it.
 */
export const STAFF_LANG: Record<Lang, Lang> = { en: 'en', ar: 'ar', fr: 'en', ru: 'en' }

/**
 * `fill('Book with {doctor}', { doctor: 'Dr. X' })`.
 *
 * Placeholders rather than string concatenation, because Arabic reorders the
 * sentence around the name — "an appointment with X" and "مع X موعدًا" do not
 * split at the same point.
 */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  )
}
