import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { LANG_META, LANGS } from '@/lib/copy'
import { loadBundle } from '@/lib/copy/bundle'
import { useI18n } from '@/lib/i18n'
import { usePagesCopy } from '@/lib/pages'

/**
 * The language menu. The trigger is a globe — the one mark a visitor who
 * cannot read the current page still recognises — beside the current language;
 * the menu lists every language under its own name, in its own script.
 *
 * Each entry is a real link to the same page in that language. The list stays
 * in the document while the menu is closed (hidden, not unmounted), so the
 * pre-rendered HTML of every page carries crawlable links to its translations.
 *
 * It is never dropped on a phone: someone who lands on the wrong language
 * should not have to scroll to find the way out of it.
 */
export function LanguageToggle({
  className = '',
  compact = false,
}: {
  className?: string
  /** Always shows the short code, for the floating pill and the phone menu. */
  compact?: boolean
}) {
  const { lang, pathIn } = useI18n()
  const { ui } = usePagesCopy()
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  // A page carries several of these (hero, floating pill, phone menu).
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    // Each language's copy is its own chunk; fetch them while the visitor is
    // choosing, so the switch itself is instant.
    for (const l of LANGS) void loadBundle(l)

    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const current = LANG_META[lang]

  return (
    <div ref={root} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        // The accessible name has to start with the visible label, otherwise a
        // speech-control user reading the button addresses a name that does
        // not contain it.
        aria-label={`${compact ? current.short : current.label} — ${ui.language}`}
        title={ui.language}
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#14120F]/10 bg-white/70 px-3 py-2 text-[12px] font-medium text-[#14120F] backdrop-blur transition-colors hover:border-[#14120F]/25 hover:bg-white sm:gap-2 sm:px-4 ${className}`}
      >
        <Globe aria-hidden className="h-3.5 w-3.5 shrink-0" />
        {compact ? (
          <span>{current.short}</span>
        ) : (
          <>
            {/* The full name only where the header has room for it: below
                `xl` the nav row is already at its limit. */}
            <span className="xl:hidden">{current.short}</span>
            <span className="max-xl:hidden">{current.label}</span>
          </>
        )}
        <ChevronDown
          aria-hidden
          className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <ul
        id={menuId}
        hidden={!open}
        aria-label={ui.language}
        className="absolute end-0 top-full z-[80] mt-2 min-w-[168px] rounded-2xl border border-[#14120F]/10 bg-white p-1.5 text-start shadow-[0_24px_60px_-20px_rgba(20,18,15,0.45)]"
      >
        {LANGS.map((l) => {
          const active = l === lang
          return (
            <li key={l}>
              <Link
                to={pathIn(l)}
                hrefLang={LANG_META[l].hreflang}
                lang={l}
                aria-current={active ? 'true' : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors hover:bg-[#F4F3F0] ${
                  l === 'ar' ? 'font-ar' : ''
                } ${active ? 'text-[#14120F]' : 'text-[#5f584d]'}`}
              >
                {LANG_META[l].label}
                {active && <Check aria-hidden className="h-3.5 w-3.5 text-[#C0A578]" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
