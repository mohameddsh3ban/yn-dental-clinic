import { fill, type Copy, type Lang } from '@/lib/copy'
import { site } from '@/lib/site'
import type { PagesCopy } from './types'

/**
 * The page copy mentions the clinic's name, address and WhatsApp number in
 * running text — in FAQ answers above all, which are also published as
 * structured data. They are written as `{clinic}`, `{address}` and `{phone}`
 * and filled here from the same sources the rest of the site reads, so a
 * changed number is changed once.
 *
 * `{topic}`, `{name}` and `{date}` are left alone: those are filled per page,
 * at render.
 */
function deepFill<T>(value: T, values: Record<string, string>): T {
  if (typeof value === 'string') return fill(value, values) as T
  if (Array.isArray(value)) return value.map((v) => deepFill(v, values)) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepFill(v, values)]),
    ) as T
  }
  return value
}

export function resolvePages(raw: PagesCopy, c: Copy, lang: Lang): PagesCopy {
  const phone = site.phones[0].label
  return deepFill(raw, {
    clinic: c.site.name,
    // Arabic has its own comma.
    address: `${c.site.address.street}${lang === 'ar' ? '، ' : ', '}${c.site.address.city}`,
    // A phone number inside right-to-left text is reordered group by group
    // unless it is isolated as a left-to-right run.
    phone: lang === 'ar' ? `\u2066${phone}\u2069` : phone,
  })
}
