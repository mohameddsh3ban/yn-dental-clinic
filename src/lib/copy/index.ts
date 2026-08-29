import { en, type Copy } from './en'
import { ar } from './ar'

export type Lang = 'en' | 'ar'

export type { Copy }

export const LANGS: readonly Lang[] = ['en', 'ar']

export const dictionaries: Record<Lang, Copy> = { en, ar }

/** Which way each language reads. Drives `<html dir>` and every logical margin. */
export const DIR: Record<Lang, 'ltr' | 'rtl'> = { en: 'ltr', ar: 'rtl' }

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
