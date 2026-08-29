import type { Copy } from '@/lib/copy'

/**
 * Shared by the in-hero header and the floating pill nav.
 *
 * One entry per destination. The surgeons are no longer a section of their own —
 * they sit as badges inside About — so "Our Team" and "Our Clinic" would have
 * pointed a visitor at the same place. The `#team` anchor still exists on that
 * badge row for deep links, and the footer keeps a fuller sitemap.
 */
export function navLinks(c: Copy): readonly (readonly [label: string, href: string])[] {
  return [
    [c.nav.home, '#top'],
    [c.nav.services, '#services'],
    [c.nav.clinic, '#about'],
    [c.nav.hospitals, '#hospitals'],
    [c.nav.location, '#location'],
    [c.nav.contact, '#contact'],
  ] as const
}
