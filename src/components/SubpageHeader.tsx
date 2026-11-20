import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { BrandLogo } from '@/components/BrandLogo'
import { LanguageToggle } from '@/components/LanguageToggle'
import { WhatsAppIcon } from '@/components/icons'
import { useI18n } from '@/lib/i18n'
import { usePagesCopy } from '@/lib/pages'
import { PLANNING_PATH } from '@/lib/planning3d'

/**
 * The header row every page other than the homepage opens with: the lockup
 * (home), the language menu and the WhatsApp line. Same row the doctor
 * profiles use, so the inner pages read as one family.
 */
export function SubpageHeader({ whatsapp, children }: { whatsapp: string; children?: ReactNode }) {
  const { c, path } = useI18n()

  return (
    <header className="relative z-20 flex items-center justify-between gap-2 px-3 pt-6 min-[360px]:px-5 sm:gap-4 sm:px-8 xl:px-14 xl:pt-9 2xl:px-20">
      <Link to={path('/')} className="flex items-center gap-3" aria-label={c.site.name}>
        <BrandLogo alt="" className="h-11 w-11 shrink-0" />
        <span className="leading-none max-[359px]:hidden">
          <span
            lang="en"
            dir="ltr"
            style={{ letterSpacing: '0.12em' }}
            className="font-display block text-lg font-semibold text-[#14120F]"
          >
            {c.site.short}
          </span>
          <span className="font-engraved mt-1 block text-[8px] uppercase tracking-[0.3em] text-[#8a8172]">
            {c.site.dentalClinic}
          </span>
        </span>
      </Link>

      <nav aria-label={c.common.mainNav} className="flex items-center gap-1.5 sm:gap-3">
        <Link
          to={path(PLANNING_PATH)}
          aria-label={c.hero.planningGateway.navLabel}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border border-[#14120F]/15 bg-white/45 px-2.5 text-xs font-medium text-[#14120F] transition-colors hover:border-[#14120F]/35 hover:bg-white/70 sm:px-4"
        >
          <span aria-hidden className="sm:hidden" dir="ltr">3D</span>
          <span className="hidden sm:inline">{c.hero.planningGateway.navLabel}</span>
        </Link>
        <LanguageToggle />
        {children}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={c.common.whatsapp}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#14120F] px-2.5 py-2.5 text-[12px] font-medium text-white transition-transform hover:scale-[1.03] sm:px-5"
        >
          <WhatsAppIcon className="h-3.5 w-3.5 text-[#C9AC7C]" />
          <span className="max-sm:hidden">{c.common.whatsapp}</span>
        </a>
      </nav>
    </header>
  )
}

export type Crumb = { label: string; to?: string }

/**
 * A visible breadcrumb trail. The same trail is published as BreadcrumbList
 * structured data from `lib/seo.ts`; the two are built from the same paths.
 */
export function Breadcrumbs({ trail }: { trail: readonly Crumb[] }) {
  const { path } = useI18n()
  const { ui } = usePagesCopy()

  return (
    <nav aria-label={ui.breadcrumb}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#5f584d]">
        {trail.map((crumb, i) => (
          <Fragment key={crumb.label}>
            {i > 0 && (
              <li aria-hidden className="text-[#C0A578]">
                /
              </li>
            )}
            <li>
              {crumb.to ? (
                <Link to={path(crumb.to)} className="transition-colors hover:text-[#14120F]">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-[#14120F]">
                  {crumb.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}
