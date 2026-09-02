import { useEffect } from 'react'
import { useI18n } from '@/lib/i18n'
import { PAY_CONTACT_URL } from '@/lib/suspended'

/**
 * The notice shown over the blurred hero while the site is suspended.
 *
 * Its copy lives here rather than in `lib/copy` on purpose: the dictionaries
 * describe the clinic, and this is a temporary operational message that should
 * leave with the switch that turns it on.
 */
const COPY = {
  en: {
    eyebrow: 'Service notice',
    title: 'Site suspended',
    body: 'This website is temporarily offline because the server subscription has not been paid. Once the outstanding balance is settled, the site is restored immediately with all of its content intact.',
    cta: 'Pay to restore',
  },
  ar: {
    eyebrow: 'إشعار خدمة',
    title: 'الموقع موقوف',
    body: 'هذا الموقع متوقف مؤقتًا لعدم سداد اشتراك الخادم. بمجرد سداد المبلغ المستحق يعود الموقع للعمل فورًا بكامل محتواه.',
    cta: 'ادفع لاستعادة الموقع',
  },
} as const

export default function SuspendedNotice() {
  const { lang } = useI18n()
  const t = COPY[lang]

  // Nothing behind the notice is meant to be reachable, so the page itself
  // must not scroll while it is up.
  useEffect(() => {
    const { body, documentElement: root } = document
    const previous = { body: body.style.overflow, root: root.style.overflow }
    body.style.overflow = 'hidden'
    root.style.overflow = 'hidden'
    return () => {
      body.style.overflow = previous.body
      root.style.overflow = previous.root
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="suspended-title"
      aria-describedby="suspended-body"
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#14120F]/55 px-5 py-10 backdrop-blur-[2px]"
    >
      <div className="w-full max-w-[30rem] rounded-[1.75rem] bg-[#F4F1EB] p-8 text-center shadow-[0_30px_80px_-20px_rgba(20,18,15,0.6)] ring-1 ring-[#14120F]/10 sm:p-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#14120F]/5 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#6b6459]">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#C0A578]" />
          {t.eyebrow}
        </span>

        <h1
          id="suspended-title"
          className="mt-5 font-['Inter_Tight',Inter,sans-serif] text-3xl font-semibold leading-tight text-[#14120F] sm:text-[2.1rem]"
        >
          {t.title}
        </h1>

        <p id="suspended-body" className="mt-4 text-[0.95rem] leading-relaxed text-[#5f584d]">
          {t.body}
        </p>

        {PAY_CONTACT_URL && (
          <a
            href={PAY_CONTACT_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[#14120F] px-7 py-3 text-sm font-medium text-[#F4F1EB] transition-colors hover:bg-[#3a352f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C0A578]"
          >
            {t.cta}
          </a>
        )}
      </div>
    </div>
  )
}
