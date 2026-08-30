import { Globe } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

/**
 * One button, two languages. It is labelled with the language it switches TO —
 * "العربية" on the English site, "English" on the Arabic one — which is the only
 * label a visitor who cannot read the current page can still act on. That is
 * also why it is never hidden on a phone: a visitor who lands on the wrong
 * language should not have to scroll to find the way out of it.
 *
 * The globe drops below `sm`, where the header row is brand + this + WhatsApp
 * and the label alone already says what the icon would.
 */
export function LanguageToggle({
  className = '',
  compact = false,
}: {
  className?: string
  /** Drops the globe at every width, for the floating pill. */
  compact?: boolean
}) {
  const { c, toggle, lang } = useI18n()

  return (
    <button
      type="button"
      onClick={toggle}
      lang={lang === 'en' ? 'ar' : 'en'}
      // The accessible name has to start with the visible label, otherwise a
      // speech-control user reading the button ("العربية") addresses a name
      // that does not contain it.
      aria-label={`${c.common.otherLanguage} — ${c.common.switchTo}`}
      title={c.common.switchTo}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border border-[#14120F]/10 bg-white/70 px-3 py-2 text-[12px] font-medium text-[#14120F] backdrop-blur transition-colors hover:border-[#14120F]/25 hover:bg-white sm:px-4 ${className}`}
    >
      {!compact && <Globe aria-hidden className="hidden h-3.5 w-3.5 shrink-0 sm:block" />}
      {c.common.otherLanguage}
    </button>
  )
}
