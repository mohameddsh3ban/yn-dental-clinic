import { DEFAULT_LANG, LANGS, type Lang } from '@/lib/copy'

/**
 * URL scheme: English lives at the root, every other language under its code.
 *
 *   /                      /ar                    /fr            /ru
 *   /services/<slug>       /ar/services/<slug>    …
 *   /team/<slug>           /ar/team/<slug>        …
 *
 * The language is read from the URL and nowhere else, so each language is a
 * real, linkable, indexable page — a search engine cannot crawl a preference
 * kept in localStorage. No trailing slashes: Cloudflare Pages serves
 * `ar/services/x.html` at `/ar/services/x` and redirects the slashed form.
 */
export const SITE_URL = 'https://ozeamaxillofacialclinic.com'

const PREFIXED = LANGS.filter((l) => l !== DEFAULT_LANG)

export function prefixOf(lang: Lang): string {
  return lang === DEFAULT_LANG ? '' : `/${lang}`
}

export function langOf(pathname: string): Lang {
  const first = pathname.split('/')[1]
  return PREFIXED.find((l) => l === first) ?? DEFAULT_LANG
}

/** The path with any language prefix removed — always starts with `/`. */
export function stripLang(pathname: string): string {
  const lang = langOf(pathname)
  if (lang === DEFAULT_LANG) return pathname || '/'
  const rest = pathname.slice(prefixOf(lang).length)
  return rest === '' ? '/' : rest
}

/**
 * `localize('/team/x', 'ar')` → `/ar/team/x`. Accepts a hash or query on the
 * end (`/#team` → `/ar#team`), and leaves bare anchors (`#top`) alone.
 */
export function localize(to: string, lang: Lang): string {
  if (!to.startsWith('/')) return to
  if (lang === DEFAULT_LANG) return to

  const cut = to.search(/[?#]/)
  const path = cut === -1 ? to : to.slice(0, cut)
  const tail = cut === -1 ? '' : to.slice(cut)
  return `${prefixOf(lang)}${path === '/' ? '' : path}${tail}`
}

/** The same page in another language. */
export function inLang(pathname: string, lang: Lang): string {
  return localize(stripLang(pathname), lang)
}

/** Absolute URL for canonical, hreflang, Open Graph and structured data. */
export function absolute(path: string): string {
  return `${SITE_URL}${path}`
}
