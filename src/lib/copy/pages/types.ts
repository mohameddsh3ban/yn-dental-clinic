/**
 * The shape of the long-form pages: the treatment pages under `/services`, the
 * maxillofacial pillar page and the travelling-patients page.
 *
 * Each page is written to be quoted. The `answer` is a self-contained
 * paragraph that says what the thing is, who does it and where — the passage a
 * search engine lifts into a snippet and an AI assistant lifts into an answer.
 * `facts` are the three or four numbers people actually search for, and `faqs`
 * are phrased the way a patient types them.
 *
 * COPY REVIEW: the clinical content is general patient information written to
 * be conservative — typical ranges, no prices, no promised results. Have each
 * treating doctor read the pages that carry their name, in both languages,
 * then set `MEDICAL_REVIEW` in `lib/pages.ts` so the pages can say so.
 */
export const PAGE_IDS = [
  'maxillofacial-surgery',
  'jaw-surgery',
  'facial-trauma-surgery',
  'tmj-treatment',
  'jaw-cysts-and-tumours',
  'wisdom-tooth-removal',
  'bone-grafting-sinus-lift',
  'dental-implants',
  'full-arch-implants',
  'veneers',
  'dental-crowns',
  'root-canal-treatment',
  'teeth-whitening',
  'international-patients',
] as const

export type PageId = (typeof PAGE_IDS)[number]

export type Faq = { q: string; a: string }

export type ContentCopy = {
  /** Short name for cards, breadcrumbs and "related" links. */
  nav: string
  /** One line under the name on a card. */
  blurb: string
  h1: string
  metaTitle: string
  metaDescription: string
  eyebrow: string
  /** The direct answer: what it is, who performs it, where. 2–3 sentences. */
  answer: string
  facts: { label: string; value: string }[]
  sections: { heading: string; body?: string[]; list?: string[] }[]
  /** How a case proceeds, in order. */
  steps?: { name: string; text: string }[]
  faqs: Faq[]
}

export type PagesCopy = {
  ui: {
    home: string
    services: string
    breadcrumb: string
    atAGlance: string
    stepsEyebrow: string
    stepsHeadline: string
    stepsOutlined: string
    faqEyebrow: string
    faqHeadline: string
    faqOutlined: string
    surgeonsEyebrow: string
    surgeonsHeadline: string
    viewProfile: string
    relatedEyebrow: string
    relatedHeadline: string
    allServices: string
    book: string
    bookAria: string
    whatsappMessage: string
    disclaimer: string
    reviewedBy: string
    readMore: string
    /** Label for the language menu. */
    language: string
    /**
     * Shown beside the booking button. Empty where the page language is one
     * the clinic consults in; the French and Russian sites use it to say that
     * consultations are held in English or Arabic.
     */
    consultNote: string
    servicesCta: string
    contactCta: string
  }
  homeFaq: {
    eyebrow: string
    headlineTop: string
    headlineOutlined: string
    lead: string
    items: Faq[]
  }
  servicesIndex: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    h1: string
    lead: string
    groups: { surgery: string; implants: string; dental: string }
    groupLeads: { surgery: string; implants: string; dental: string }
  }
  contact: {
    metaTitle: string
    metaDescription: string
    eyebrow: string
    h1: string
    lead: string
  }
  notFound: {
    metaTitle: string
    eyebrow: string
    h1: string
    body: string
    home: string
  }
  content: Record<PageId, ContentCopy>
}
