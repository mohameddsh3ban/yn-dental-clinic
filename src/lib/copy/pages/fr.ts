import type { PagesCopy } from './types'
import { frSurgery } from './fr-surgery'
import { frDental } from './fr-dental'

/**
 * French copy for everything beyond the homepage sections: page labels, the
 * homepage FAQ, the services hub, the contact page and the long-form pages.
 * Typed against `PagesCopy`, so a missing page or key fails the build.
 * `{clinic}`, `{address}` and `{phone}` are filled in `./index.ts`.
 *
 * The clinic consults in Arabic and English only: `ui.whatsappMessage` stays
 * in English so the staff can read it, and `ui.consultNote` says so beside
 * the booking button.
 */
export const pagesFr: PagesCopy = {
  ui: {
    home: 'Accueil',
    services: 'Soins',
    breadcrumb: 'Fil d’Ariane',
    atAGlance: 'En bref',
    stepsEyebrow: 'Les étapes',
    stepsHeadline: 'Comment se déroule',
    stepsOutlined: 'la prise en charge',
    faqEyebrow: 'Questions',
    faqHeadline: 'Ce que les patients',
    faqOutlined: 'demandent',
    surgeonsEyebrow: 'Qui vous soigne',
    surgeonsHeadline: 'Les praticiens pour ce traitement',
    viewProfile: 'Voir le profil',
    relatedEyebrow: 'À voir aussi',
    relatedHeadline: 'Traitements associés',
    allServices: 'Tous les soins',
    book: 'Écrire sur WhatsApp',
    bookAria: 'Poser une question sur WhatsApp concernant {topic}',
    // Left in English on purpose: the clinic's staff must be able to read it.
    whatsappMessage: "Hello {clinic}, I have a question about {topic}.",
    disclaimer:
      'Cette page fournit une information générale et non un diagnostic. Seule la consultation, à partir de votre propre examen et de votre imagerie, permet de déterminer si une intervention vous convient. Les résultats et la récupération varient d’une personne à l’autre.',
    reviewedBy: 'Relecture médicale : {name} · {date}',
    readMore: 'En savoir plus',
    language: 'Langue',
    consultNote: 'Les consultations se déroulent en anglais ou en arabe.',
    servicesCta: 'Voir tous les traitements',
    contactCta: 'Contact et accès',
  },

  homeFaq: {
    eyebrow: 'Questions',
    headlineTop: 'Avant de prendre',
    headlineOutlined: 'rendez-vous',
    lead: 'Ce que les patients demandent le plus souvent avant une première visite.',
    items: [
      {
        q: 'Où se trouve Ozea Dental Clinic ?',
        a: '{clinic} se trouve au {address}, dans le quartier d’Al Golf, entre Nasr City et Héliopolis, au Caire, en Égypte.',
      },
      {
        q: 'Comment prendre rendez-vous ?',
        a: 'Écrivez à la clinique sur WhatsApp au {phone}, ou appelez ce même numéro. Si vous disposez de radiographies récentes ou d’un scanner, envoyez-les à l’avance ou apportez-les avec vous.',
      },
      {
        q: 'Quels soins propose la clinique ?',
        a: 'Les implants dentaires et la réhabilitation d’arcade complète sur implants ; la chirurgie orale et maxillo-faciale, notamment la chirurgie correctrice des mâchoires, les fractures de la face, l’articulation de la mâchoire (ATM), les dents de sagesse et les kystes des mâchoires ; et la dentisterie esthétique et restauratrice — facettes, couronnes, traitement de canal et blanchiment.',
      },
      {
        q: 'Qui sont les praticiens de la clinique ?',
        a: 'Dr Youssef Nasser, chirurgien oral et maxillo-facial (implants et chirurgie des mâchoires) ; Dr Adham Yehia Zakaria, consultant en chirurgie orale et maxillo-faciale et enseignant à l’Université du Caire (ATM et chirurgie maxillo-faciale) ; et Dr Sara Sameh, dentiste en esthétique et restauration dentaires (facettes et design du sourire).',
      },
      {
        q: 'Les interventions ont-elles lieu à la clinique ou à l’hôpital ?',
        a: 'Les soins dentaires courants, les implants et la petite chirurgie sont réalisés à la clinique, sous anesthésie locale. Les opérations qui nécessitent un bloc opératoire et une anesthésie générale — chirurgie correctrice des mâchoires, réparation de fractures, chirurgie de l’articulation — donnent lieu à une admission dans les hôpitaux partenaires de la clinique.',
      },
      {
        q: 'Puis-je venir pour un deuxième avis ?',
        a: 'Oui. Les patients adressés par un confrère et les demandes de deuxième avis sont les bienvenus. Apportez vos radiographies et scanners existants, ainsi que tout plan de traitement qui vous a été remis.',
      },
      {
        q: 'Comment le traitement est-il planifié ?',
        a: 'Chaque prise en charge commence par une consultation et une imagerie. Vous recevez ensuite un plan écrit, que vous conservez, qui détaille ce qui est proposé avant toute programmation.',
      },
      {
        q: 'Soignez-vous des patients qui ne vivent pas au Caire ou qui viennent de l’étranger ?',
        a: 'Oui. Vous pouvez envoyer vos radiographies sur WhatsApp avant votre voyage, afin que votre première visite soit consacrée à l’examen et à la planification. Les consultations se déroulent en arabe ou en anglais.',
      },
    ],
  },

  servicesIndex: {
    metaTitle: 'Soins dentaires et maxillo-faciaux, Le Caire | Ozea Dental Clinic',
    metaDescription:
      'Tous les soins d’Ozea Dental Clinic à Nasr City, au Caire : chirurgie maxillo-faciale et des mâchoires, ATM, implants, facettes, couronnes, canal, blanchiment.',
    eyebrow: 'Nos soins',
    h1: 'Soins dentaires et maxillo-faciaux au Caire',
    lead:
      '{clinic}, à Nasr City, au Caire, réunit sous un même toit la chirurgie orale et maxillo-faciale, l’implantologie et la dentisterie esthétique. Chaque traitement ci-dessous a sa propre page : en quoi il consiste, à qui il s’adresse, comment se déroule la prise en charge et les questions que posent les patients.',
    groups: {
      surgery: 'Chirurgie de la face et des mâchoires',
      implants: 'Implants dentaires',
      dental: 'Dentisterie esthétique et restauratrice',
    },
    groupLeads: {
      surgery:
        'La chirurgie orale et maxillo-faciale — les mâchoires, les os de la face et l’articulation de la mâchoire — avec des interventions au bloc opératoire réalisées dans les hôpitaux partenaires.',
      implants:
        'De la dent unitaire à l’arcade complète fixe, avec une planification à partir d’un scanner et une greffe osseuse lorsqu’elle est nécessaire.',
      dental:
        'Des soins esthétiques et restaurateurs conservateurs, qui préservent autant de dent naturelle que le résultat le permet.',
    },
  },

  contact: {
    metaTitle: 'Contact et accès — Ozea Dental Clinic, Nasr City, Le Caire',
    metaDescription:
      'Ozea Dental Clinic, 6 Mahmoud Ammar, Al Golf, Nasr City, Le Caire. Prenez rendez-vous sur WhatsApp, appelez la clinique ou obtenez l’itinéraire sur Google Maps.',
    eyebrow: 'Contact',
    h1: 'Contacter Ozea Dental Clinic à Nasr City, au Caire',
    lead:
      'La clinique se trouve au {address}. Le moyen le plus rapide de prendre rendez-vous est d’envoyer un message WhatsApp au {phone} ; vous pouvez aussi appeler ce même numéro.',
  },

  notFound: {
    metaTitle: 'Page introuvable | Ozea Dental Clinic',
    eyebrow: 'Erreur 404',
    h1: 'Cette page n’existe pas',
    body: 'L’adresse a peut-être changé, ou le lien qui vous a conduit ici n’est plus à jour.',
    home: 'Retour à l’accueil',
  },

  content: { ...frSurgery, ...frDental },
}
