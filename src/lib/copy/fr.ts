import { en, type Copy } from './en'

/**
 * French copy. Typed as `Copy`, so it cannot drift out of sync with `en.ts` —
 * a missing or misspelled key is a build error.
 *
 * Conventions used throughout:
 * - Formal «vous», clinical but warm register; nothing is claimed here that
 *   the English does not claim.
 * - Typographic apostrophe (’) inside strings, never a raw one, so the
 *   single-quoted strings cannot break.
 * - The brand stays «Ozea Dental Clinic»; doctors are «Dr Prénom Nom» (no full
 *   stop). The profile page takes the first two words of a name, so every name
 *   must start with "Dr <first name>".
 * - The clinic's staff read English and Arabic, not French: every
 *   `whatsappMessage` is reused from the English so they can read what a
 *   patient sends. Patient quotes and hospital names are reused as well.
 * - Split headlines are concatenated in a fixed order by the sections (see the
 *   components); each sequence below reads as one French phrase in that order.
 *
 * COPY REVIEW: a faithful translation of the English, not new claims. Have the
 * doctors read their own blocks before launch, same as the English.
 */
export const fr: Copy = {
  meta: {
    title: 'Chirurgie maxillo-faciale, implants, Le Caire | Ozea Dental Clinic',
    description:
      'Consultez le Dr Youssef Nasser chez Ozea Dental Clinic, à Nasr City, au Caire : chirurgie de la mâchoire, implants ou deuxième avis. Tarifs sur WhatsApp.',
  },

  site: {
    name: 'Ozea Dental Clinic',
    short: 'Ozea',
    doctor: 'Dr Youssef Nasser',
    specialty: 'Implants dentaires et chirurgie maxillo-faciale',
    dentalClinic: 'Clinique dentaire',
    address: {
      street: '6 Mahmoud Ammar, Al Golf',
      city: 'Nasr City, gouvernorat du Caire',
      short: 'Nasr City, Le Caire',
    },
    hours: { days: 'Tous les jours', time: '24 h/24' },
    // Left in English on purpose: the clinic's staff must be able to read it.
    whatsappMessage: en.site.whatsappMessage,
  },

  common: {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    googleMaps: 'Google Maps',
    otherLanguage: 'English',
    switchTo: 'Changer de langue',
    mainNav: 'Navigation principale',
    siteNav: 'Navigation du site',
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    backToTop: 'Retour en haut de page',
  },

  nav: {
    home: 'Accueil',
    services: 'Nos soins',
    cases: 'Cas cliniques',
    clinic: 'Notre clinique',
    hospitals: 'Hôpitaux',
    location: 'Accès',
    contact: 'Contact',
    team: 'Notre équipe',
    testimonials: 'Témoignages',
  },

  hero: {
    eyebrow: 'Ozea Dental Clinic · Nasr City, Le Caire',
    // Kept short on purpose: the hero column is fixed-width on desktop and a
    // longer headline pushes the buttons into the caption below them.
    headlineTop: 'Chirurgie maxillaire',
    headlineOutlined: 'et implants',
    lead:
      'On vous a conseillé une chirurgie de la mâchoire ? Apportez vos examens d’imagerie ou votre courrier médical au Dr Youssef Nasser. Voyez avec lui le sens des résultats, les options adaptées à votre cas et ce que chacune impliquerait.',
    book: 'Écrire sur WhatsApp',
    bookAria: 'Écrire sur WhatsApp au cabinet du {doctor}',
    railLabel: 'Votre consultation',
    rail: ['Vos inquiétudes', 'Examen', 'Options', 'Prochaines étapes'],
    figureAlt:
      'Dessin au trait d’un visage de profil laissant voir le crâne, les mâchoires et les deux arcades dentaires, avec un implant dentaire doré au niveau d’une molaire inférieure',
    annotations: { implant: 'Site implantaire', tmj: 'Articulation · ATM' },
    today: 'Aujourd’hui',
    open: 'Ouvert',
    clinic: 'Clinique',
    metaBlurb:
      'Un deuxième avis est le bienvenu. Si vous avez déjà un plan de traitement, apportez-le, ainsi que vos questions.',
    illustrationNote:
      'Illustration — dessin schématique au trait ; ce n’est ni une image de patient ni un résultat prévu.',
    planningGateway: {
      navLabel: 'Planification 3D',
      eyebrow: 'Studio de planification interactif',
      title: 'Explorez votre mâchoire en 3D',
      description: 'Couronne sur implant · repositionnement des mâchoires et du menton · fractures du visage · anatomie',
      action: 'Entrer dans le studio 3D',
      figureAlt: 'Profil de visage illustré avec l’anatomie de la mâchoire visible, représentant le studio de planification 3D interactif d’Ozea',
    },
    stats: [
      { value: '170', unit: '+', label: 'Interventions\nréalisées' },
      { value: '85', unit: '%', label: 'Patients\nsatisfaits' },
    ],
  },

  services: {
    eyebrow: 'Nos soins',
    headlineTop: 'Explorez les soins',
    headlineBottom: 'des dents',
    headlineOutlined: 'et des mâchoires',
    lead:
      'Remplacer une dent manquante, sauver une dent abîmée et traiter un problème de mâchoire sont des décisions différentes. Parcourez les traitements ci-dessous pour trouver celui dont vous souhaitez discuter.',
    reviews: 'Avis',
    reviewsBlurb:
      'Découvrez les avis de patients ravis de leur expérience de soins dentaires, rassurante et satisfaisante.',
    previous: 'Soins précédents',
    next: 'Soins suivants',
    railLabel: 'Soins',
    items: [
      { title: 'Soins esthétiques', tag: 'Esthétique' },
      { title: 'Couronnes dentaires', tag: 'Restauration' },
      { title: 'Facettes dentaires', tag: 'Cosmétique' },
      { title: 'Facettes en composite', tag: 'Une seule séance' },
      { title: 'Implants dentaires', tag: 'Chirurgie' },
      { title: 'Maxillo-facial et reconstruction', tag: 'Reconstruction' },
      { title: 'Soins endodontiques', tag: 'Traitement de canal' },
      { title: 'Chirurgies de l’ATM', tag: 'Articulation de la mâchoire' },
    ],
  },

  cases: {
    eyebrow: 'Cas cliniques',
    headlineTop: 'Avant et',
    headlineOutlined: 'après',
    lead:
      'À quoi ressemble une couronne avant sa pose ? Comment des facettes transforment-elles les dents de devant ? Parcourez les photographies des cas d’Ozea, y compris le travail au laboratoire et au fauteuil.',
    compare: {
      label: 'Cas à la une',
      title: 'Facettes en céramique, dents de devant du haut',
      body:
        'D’anciennes restaurations dont la teinte s’était altérée, sur les dents de devant du haut, remplacées par des facettes en céramique. Faites glisser la poignée sur la photographie pour comparer les deux.',
      before: 'Avant',
      after: 'Après',
      handleAria: 'Comparer avant et après',
      hint: 'Faites glisser pour comparer',
    },
    filters: {
      all: 'Tous',
      implants: 'Implants et arcade complète',
      restorative: 'Couronnes et facettes',
      lab: 'Travail de laboratoire',
    },
    filterAria: 'Filtrer les cas',
    // Tile titles are single-line and truncated: kept about as short as the English.
    items: {
      'full-arch-both': {
        title: 'Bridges fixes complets, deux mâchoires',
        note: 'Sur implants · vue avec écarteur',
      },
      'upper-arch-fixed': {
        title: 'Bridge fixe complet supérieur',
        note: 'Face aux dents naturelles inférieures',
      },
      'upper-arch-closeup': {
        title: 'Bridge complet supérieur, détail',
        note: 'Contour gingival et forme des dents',
      },
      'full-mouth-smile': {
        title: 'Réhabilitation complète de la bouche',
        note: 'Sourire final · les deux arcades',
      },
      'smile-portrait': {
        title: 'Restaurations antérieures, sourire final',
        note: 'Dents de devant du haut',
      },
      'anterior-crowns-retractor': {
        title: 'Couronnes céramiques antérieures',
        note: 'Vue avec écarteur, à la pose',
      },
      'anterior-crowns-smile': {
        title: 'Couronnes antérieures du haut, sourire',
        note: 'Ligne du sourire à la pose',
      },
      'lab-master-cast': {
        title: 'Couronnes céramiques, maître-modèle',
        note: 'Étape de laboratoire · avant la pose',
      },
    },
    open: 'Ouvrir le cas {n} : {title}',
    close: 'Fermer',
    previous: 'Cas précédent',
    next: 'Cas suivant',
    counter: '{n} sur {total}',
    view: 'Voir',
    disclaimer:
      'Photographies cliniques de patients traités chez {clinic}. Les résultats varient d’une personne à l’autre ; seule la consultation permet de déterminer si une intervention vous convient.',
    cta: 'Parler de votre cas',
    ctaBlurb:
      'Apportez votre radiographie ou une photographie en consultation, ou envoyez-la à l’avance sur WhatsApp.',
  },

  about: {
    eyebrow: 'À propos',
    headlineTop: 'Qui vous rencontrerez',
    headlineOutlined: 'à la',
    headlineTail: 'clinique',
    lead:
      'Si votre dentiste vous a adressé à nous, apportez son courrier. Si vous venez pour un deuxième avis, apportez votre plan de traitement actuel. Dans les deux cas, l’équipe dispose ainsi d’un point de départ pour la discussion.',
    visitUs: 'Nous rendre visite',
    yearsValue: '15',
    yearsLabel: 'Années d’expertise tout en douceur',
    imageAlts: [
      '{clinic} — deux chirurgiens du cabinet opérant au bloc opératoire',
      '{clinic} — un chirurgien opérant sous la lampe du bloc opératoire',
    ],
    imageDotAria: 'Afficher la photo {n}',
    facts: { clinic: 'Clinique', hours: 'Horaires', referrals: 'Patients adressés' },
    referralsValue: 'Deuxièmes avis bienvenus',
    surgicalTeam: 'Équipe soignante',
    profileAria: '{name} — {title}, profil complet',
    stats: [
      { value: '98', suffix: '%', label: 'Taux de satisfaction' },
      { value: '20', suffix: 'K', label: 'Sourires transformés' },
      { value: '4.9', suffix: '', label: 'Note des patients' },
    ],
  },

  hospitals: {
    eyebrow: 'Hôpitaux partenaires',
    headlineTop: 'Où nous',
    headlineOutlined: 'opérons',
    lead:
      'Les soins dentaires courants se font à la clinique. Les cas chirurgicaux — chirurgie orthognathique, reconstruction après un traumatisme, tout ce qui nécessite un bloc opératoire et un anesthésiste — sont admis dans ces hôpitaux.',
    // Hospital names are proper nouns: reused from the English unchanged.
    items: en.hospitals.items,
  },

  testimonials: {
    eyebrow: 'Témoignages',
    headlineTop: 'Des sourires qui',
    headlineOutlined: 'parlent',
    lead: 'Les patients racontent leurs visites avec leurs propres mots.',
    // Patient quotes are never translated: reused in their original language.
    quotes: en.testimonials.quotes,
  },

  location: {
    eyebrow: 'Nous rendre visite',
    headlineTop: 'Retrouvez-nous à',
    headlineOutlined: 'Nasr City',
    lead:
      'La clinique se trouve au 6 Mahmoud Ammar, à Al Golf, Nasr City. Ouvrez la carte pour obtenir l’itinéraire, ou écrivez à la clinique pour confirmer un horaire avant de vous déplacer.',
    addressLabel: 'Adresse de la clinique',
    hoursLabel: 'Horaires d’ouverture',
    phoneLabel: 'Appeler la clinique',
    socialLabel: 'Suivre la clinique',
    chat: 'Discuter sur WhatsApp',
    directions: 'Obtenir l’itinéraire',
    mapTitle: '{clinic} sur Google Maps',
    mapLoad: 'Afficher la carte',
    mapNotice: 'Le chargement de la carte dépose des cookies Google sur votre appareil.',
  },

  footer: {
    eyebrow: 'Rendez-vous',
    headlineTop: 'Qu’est-ce qui vous amène',
    headlineAccent: 'chez Ozea ?',
    lead:
      'Dites-nous si votre demande concerne une dent manquante, un problème de mâchoire ou un deuxième avis. Vous pouvez, dans le même message, vous renseigner sur le tarif de la consultation et les horaires disponibles.',
    book: 'Écrire à Ozea sur WhatsApp',
    brandBlurb: '{doctor} · {specialty}. Al Golf, Nasr City, Le Caire.',
    explore: 'Explorer',
    visitUs: 'Nous rendre visite',
    rights: '© 2026 {clinic}. Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions de soins',
  },

  profile: {
    ourTeam: 'Notre équipe',
    allTeam: 'Toute l’équipe',
    discuss: 'Parler de votre cas',
    discussAria: 'Parler de votre cas avec {name} sur WhatsApp',
    call: 'Appeler le {phone}',
    hours: 'Horaires',
    clinic: 'Clinique',
    scope: 'Champ d’exercice',
    cvEyebrow: 'Curriculum vitae',
    cvHeadline: 'Qualifications, fonction et',
    cvOutlined: 'domaine de prédilection',
    alsoInTeam: 'Également dans l’équipe',
    anotherOpinion: 'Un autre avis, la même clinique',
    docTitle: '{name} — {title} | {clinic}',
    docDescription: '{name}, {title} chez {clinic}. {lead}',
    // Left in English on purpose: the clinic's staff must be able to read it.
    whatsappMessage: en.profile.whatsappMessage,
  },

  team: {
    'youssef-nasser': {
      name: 'Dr Youssef Nasser',
      role: 'Implants et chirurgie maxillo-faciale',
      title: 'Chirurgien oral et maxillo-facial',
      specialty: 'Implants dentaires et chirurgie maxillo-faciale',
      credentials: ['Chirurgie orale et maxillo-faciale', 'Implants dentaires'],
      scopeLead: 'Ce que le {name}',
      scopeVerb: 'opère',
      lead:
        'Chirurgie de la face et des mâchoires — de l’implant unitaire à la réhabilitation d’une arcade complète et à la chirurgie correctrice des mâchoires.',
      intro:
        'Chaque prise en charge commence par l’imagerie, un plan écrit et une discussion franche sur ce que l’intervention implique réellement — avant toute programmation. L’indication chirurgicale se décide en consultation, jamais par téléphone.',
      focus: [
        { name: 'Chirurgie orthognathique', descriptor: 'Correction de l’alignement des mâchoires' },
        {
          name: 'Traumatologie faciale et reconstruction',
          descriptor: 'Mandibule, orbite et os zygomatique',
        },
        {
          name: 'Articulation temporo-mandibulaire',
          descriptor: 'Douleurs, claquements et blocages de l’ATM',
        },
        {
          name: 'Troisièmes molaires incluses',
          descriptor: 'Extraction chirurgicale des dents de sagesse',
        },
        { name: 'Kystes et lésions bénignes', descriptor: 'Exérèse et biopsie' },
        {
          name: 'Greffe osseuse et sinus lift',
          descriptor: 'Préparation du site avant les implants',
        },
        { name: 'Implants dentaires', descriptor: 'De l’implant unitaire à l’arcade complète' },
      ],
      cv: [
        {
          heading: 'Exercice',
          items: [
            'Chirurgie orale et maxillo-faciale chez Ozea Dental Clinic, Nasr City, Le Caire',
            'Implantologie — de l’implant unitaire à la réhabilitation d’une arcade complète',
            'Quinze ans et plus de pratique clinique',
          ],
        },
        {
          heading: 'Déroulement d’une prise en charge',
          items: [
            'Consultation',
            'Imagerie et mesures',
            'Plan chirurgical écrit',
            'Chirurgie et suivi',
          ],
        },
        {
          heading: 'Approche',
          items: [
            'L’imagerie et les mesures avant la rédaction de tout plan',
            'Un plan chirurgical écrit dont vous conservez un exemplaire',
            'Patients adressés et deuxièmes avis bienvenus',
          ],
        },
      ],
      visualCaption:
        'Tracé céphalométrique de profil — le schéma sur lequel le chirurgien des mâchoires prend ses mesures. Illustration : ce n’est ni une image de patient ni un résultat prévu.',
    },
    'sara-sameh': {
      name: 'Dr Sara Sameh',
      role: 'Esthétique et facettes',
      title: 'Dentiste en esthétique et restauration dentaires',
      specialty: 'Dentisterie esthétique · Facettes',
      credentials: ['Dentisterie esthétique', 'Facettes', 'Design du sourire'],
      scopeLead: 'Ce que la {name}',
      scopeVerb: 'soigne',
      lead:
        'Dentisterie esthétique et restauratrice — design du sourire, facettes et soins conservateurs qui permettent à une dent naturelle de le rester.',
      intro:
        'Un sourire se planifie avant toute préparation des dents. La teinte, la forme et les proportions sont d’abord convenues avec vous — photographies, mesures et une maquette (mock-up) que vous pouvez voir et modifier — et l’option qui retire le moins de tissu dentaire est toujours proposée.',
      focus: [
        { name: 'Facettes en porcelaine', descriptor: 'Forme, teinte et proportions' },
        { name: 'Bonding en composite', descriptor: 'Remodelage sans passer par le laboratoire' },
        {
          name: 'Design du sourire',
          descriptor: 'Planifié et prévisualisé avant toute préparation',
        },
        { name: 'Couronnes et onlays', descriptor: 'Restaurer une dent cassée ou usée' },
        {
          name: 'Blanchiment dentaire',
          descriptor: 'À la clinique et à domicile sous supervision',
        },
        {
          name: 'Obturations esthétiques',
          descriptor: 'De la teinte de la dent, peu invasives',
        },
        { name: 'Remodelage gingival', descriptor: 'Équilibrer le cadre qui entoure les dents' },
      ],
      cv: [
        {
          heading: 'Exercice',
          items: [
            'Dentisterie esthétique et restauratrice chez Ozea Dental Clinic, Nasr City, Le Caire',
            'Facettes, bonding et cas complets de design du sourire',
            'Restauration conservatrice des dents usées, ébréchées ou à la teinte altérée',
          ],
        },
        {
          heading: 'Déroulement d’une prise en charge',
          items: [
            'Consultation et photographies',
            'Accord sur la teinte, la forme et les proportions',
            'Maquette (mock-up) que vous voyez avant toute préparation',
            'Pose et suivi',
          ],
        },
        {
          heading: 'Approche',
          items: [
            'Ne retirer que le minimum de tissu dentaire compatible avec le résultat',
            'Aucune préparation avant l’accord écrit sur le projet',
            'Patients adressés et deuxièmes avis bienvenus',
          ],
        },
      ],
      visualCaption:
        'Préparation pour facette, vue en coupe — réduction de l’émail, limite de préparation et facette en place. Illustration : ce n’est ni une image de patient ni un résultat prévu.',
    },
    'adham-yehia-zakaria': {
      name: 'Dr Adham Yehia Zakaria',
      role: 'ATM et chirurgie maxillo-faciale',
      title: 'Consultant en chirurgie orale et maxillo-faciale',
      specialty: 'Articulation temporo-mandibulaire · Chirurgie orale et maxillo-faciale',
      credentials: ['Master (MSc)', 'Doctorat (PhD)', 'Consultant', 'Enseignant — Université du Caire'],
      scopeLead: 'Ce que le {name}',
      scopeVerb: 'opère',
      lead:
        'Consultant en chirurgie orale et maxillo-faciale, avec une activité dédiée à l’articulation temporo-mandibulaire, et enseignant à l’Université du Caire.',
      intro:
        'Une mâchoire qui claque, se bloque ou fait mal à l’ouverture, c’est un problème d’articulation avant d’être un problème de dents. Le bilan commence par l’articulation elle-même — son amplitude d’ouverture, sa déviation, ce que montre l’imagerie — et l’option la moins invasive capable de résoudre le problème est essayée en premier.',
      focus: [
        {
          name: 'Chirurgie de l’articulation temporo-mandibulaire',
          descriptor: 'Déplacement du disque, blocages et douleurs articulaires',
        },
        {
          name: 'Arthrocentèse et arthroscopie',
          descriptor: 'Lavage et exploration mini-invasifs de l’articulation',
        },
        {
          name: 'Ankylose et luxation',
          descriptor: 'Une mâchoire qui ne s’ouvre plus, ou qui ne reste pas en place',
        },
        {
          name: 'Remplacement total de l’articulation',
          descriptor: 'Une prothèse d’articulation temporo-mandibulaire',
        },
        { name: 'Chirurgie orthognathique', descriptor: 'Correction de l’alignement des mâchoires' },
        {
          name: 'Traumatologie faciale et reconstruction',
          descriptor: 'Mandibule, orbite et os zygomatique',
        },
        { name: 'Kystes et lésions bénignes', descriptor: 'Exérèse et biopsie' },
        {
          name: 'Implants dentaires et greffe osseuse',
          descriptor: 'Préparation du site et restauration',
        },
      ],
      cv: [
        {
          heading: 'Qualifications',
          items: [
            'Master (MSc) — Chirurgie orale et maxillo-faciale',
            'Doctorat (PhD) — Chirurgie orale et maxillo-faciale',
            'Consultant en chirurgie orale et maxillo-faciale',
          ],
        },
        {
          heading: 'Activité universitaire',
          items: [
            'Enseignant, Université du Caire',
            'Enseignement et encadrement en chirurgie orale et maxillo-faciale',
          ],
        },
        {
          heading: 'Domaine de prédilection',
          items: [
            'Troubles de l’articulation temporo-mandibulaire et chirurgie de l’ATM',
            'Traitements mini-invasifs, conservateurs de l’articulation, avant toute chirurgie ouverte',
            'Planification orthodontique et chirurgicale combinée pour l’alignement des mâchoires',
          ],
        },
      ],
      visualCaption:
        'L’articulation temporo-mandibulaire en coupe — condyle, disque et fosse, avec la rotation et la translation qui ouvrent la mâchoire. Illustration : ce n’est pas une image de patient.',
    },
  },
}
