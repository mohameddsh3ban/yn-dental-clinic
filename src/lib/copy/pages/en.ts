import type { PagesCopy } from './types'
import { enSurgery } from './en-surgery'
import { enDental } from './en-dental'

/**
 * English copy for everything beyond the homepage sections: page labels, the
 * homepage FAQ, the services hub, the contact page and the long-form pages.
 * Every other language is typed against `PagesCopy`, so a missing page or key
 * fails the build. `{clinic}`, `{address}` and `{phone}` are filled in
 * `./index.ts`.
 */
export const pagesEn: PagesCopy = {
  ui: {
    home: 'Home',
    services: 'Services',
    breadcrumb: 'Breadcrumb',
    atAGlance: 'At a glance',
    stepsEyebrow: 'The process',
    stepsHeadline: 'How a case',
    stepsOutlined: 'proceeds',
    faqEyebrow: 'Questions',
    faqHeadline: 'What patients',
    faqOutlined: 'ask',
    surgeonsEyebrow: 'Who treats you',
    surgeonsHeadline: 'The clinicians for this treatment',
    viewProfile: 'View profile',
    relatedEyebrow: 'Related',
    relatedHeadline: 'Related treatments',
    allServices: 'All services',
    book: 'Ask on WhatsApp',
    bookAria: 'Ask Ozea about {topic} on WhatsApp',
    whatsappMessage: "Hello {clinic}, I have a question about {topic}.",
    disclaimer:
      'This page is general information, not a diagnosis. Suitability for any procedure is decided at consultation, from your own examination and imaging. Results and recovery vary from person to person.',
    reviewedBy: 'Medically reviewed by {name} · {date}',
    readMore: 'Read more',
    language: 'Language',
    consultNote: '',
    servicesCta: 'See all treatments',
    contactCta: 'Contact and directions',
  },

  homeFaq: {
    eyebrow: 'Questions',
    headlineTop: 'Before you',
    headlineOutlined: 'book',
    lead: 'The things patients ask most often before a first visit.',
    items: [
      {
        q: 'Where is Ozea Dental Clinic?',
        a: '{clinic} is at {address}, in the Al Golf district between Nasr City and Heliopolis, Cairo, Egypt.',
      },
      {
        q: 'How do I book an appointment?',
        a: 'Message the clinic on WhatsApp at {phone}, or call the same number. If you have recent X-rays or a CT scan, send them ahead or bring them with you.',
      },
      {
        q: 'What does the clinic treat?',
        a: 'Dental implants and full-arch implant rehabilitation; oral and maxillofacial surgery, including corrective jaw surgery, facial fractures, the jaw joint (TMJ), wisdom teeth and jaw cysts; and cosmetic and restorative dentistry — veneers, crowns, root canal treatment and whitening.',
      },
      {
        q: 'Who are the doctors?',
        a: 'Dr. Youssef Nasser, oral and maxillofacial surgeon (implants and jaw surgery); Dr. Adham Yehia Zakaria, consultant oral and maxillofacial surgeon and lecturer at Cairo University (TMJ and maxillofacial surgery); and Dr. Sara Sameh, cosmetic and restorative dentist (veneers and smile design).',
      },
      {
        q: 'Is surgery done at the clinic or in a hospital?',
        a: 'Day-to-day dentistry, implants and minor surgery are done at the clinic under local anaesthetic. Operations that need a theatre and a general anaesthetic — corrective jaw surgery, fracture repair, joint surgery — are admitted through the clinic’s affiliated hospitals.',
      },
      {
        q: 'Can I come for a second opinion?',
        a: 'Yes. Referrals and second opinions are welcome. Bring your existing X-rays, scans and any treatment plan you have been given.',
      },
      {
        q: 'How is treatment planned?',
        a: 'Every case starts with a consultation and imaging. You then receive a written plan, which you keep, setting out what is proposed before anything is scheduled.',
      },
      {
        q: 'Do you treat patients from outside Cairo or from abroad?',
        a: 'Yes. You can send your X-rays on WhatsApp before travelling so your first visit is used for examination and planning. Consultations are held in Arabic or English.',
      },
    ],
  },

  servicesIndex: {
    metaTitle: 'Dental & Maxillofacial Services in Cairo | Ozea Dental Clinic',
    metaDescription:
      'All treatments at Ozea Dental Clinic, Nasr City, Cairo: maxillofacial and jaw surgery, TMJ, dental implants, veneers, crowns, root canal and whitening.',
    eyebrow: 'Our services',
    h1: 'Dental and maxillofacial treatments in Cairo',
    lead:
      '{clinic} in Nasr City, Cairo, brings oral and maxillofacial surgery, implantology and cosmetic dentistry under one roof. Each treatment below has its own page: what it is, who it is for, how a case proceeds and the questions patients ask.',
    groups: {
      surgery: 'Facial and jaw surgery',
      implants: 'Dental implants',
      dental: 'Cosmetic and restorative dentistry',
    },
    groupLeads: {
      surgery:
        'Oral and maxillofacial surgery — the jaws, the facial bones and the jaw joint — with theatre cases performed in affiliated hospitals.',
      implants:
        'From a single tooth to a full fixed arch, planned from a CT scan, with bone grafting where it is needed.',
      dental:
        'Conservative cosmetic and restorative work that keeps as much natural tooth as the result allows.',
    },
  },

  contact: {
    metaTitle: 'Contact & Location — Ozea Dental Clinic, Nasr City, Cairo',
    metaDescription:
      'Ozea Dental Clinic, 6 Mahmoud Ammar, Al Golf, Nasr City, Cairo. Book on WhatsApp, call the clinic, or get directions on Google Maps.',
    eyebrow: 'Contact',
    h1: 'Contact Ozea Dental Clinic in Nasr City, Cairo',
    lead:
      'The clinic is at {address}. The quickest way to book is a WhatsApp message to {phone}; you can also call the same number.',
  },

  notFound: {
    metaTitle: 'Page not found | Ozea Dental Clinic',
    eyebrow: 'Error 404',
    h1: 'This page does not exist',
    body: 'The address may have changed, or the link that brought you here is out of date.',
    home: 'Back to the homepage',
  },

  content: { ...enSurgery, ...enDental },
}
