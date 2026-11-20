import type { PlanningCopy } from './types'

export const planningFr: PlanningCopy = {
  eyebrow: 'La chirurgie maxillo-faciale en 3D',
  h1: "Explorer la chirurgie des mâchoires en 3D",
  lead: "Observez comment les mâchoires se déplacent et où se placent les plaques sur un crâne de démonstration. Choisissez une intervention, puis lancez la séquence ou sélectionnez une étape.",

  viewer: {
    tools: "Outils du modèle",
    zoomIn: "Agrandir",
    zoomOut: "Réduire",
    camera: "Angle de vue",
    angle: "Choisir un angle",
    measurements: "Afficher les mesures",
    stageHint: "Sélectionnez une étape pour y arrêter le modèle.",
    retry: "Réessayer",
    toothHint: "Sélectionnez une dent sur le modèle ou le schéma.",
    exploreHint: "Tournez le crâne pour repérer les éléments nommés.",
    cutHint: "Repérez les lignes tracées sur l’os.",
    moveHint: "Observez le changement de position de l’os.",
    fixHint: "Repérez les plaques qui maintiennent l’os en place.",
    fractureHint: "Repérez les traits de fracture.",
    title: 'Modèle de crâne 3D interactif',
    loading: 'Chargement du modèle',
    error: "Le modèle 3D n'a pas pu être chargé sur cet appareil. Les descriptions ci-dessous couvrent les mêmes interventions.",
    hint: "Faites glisser le modèle sur le côté pour le tourner. Utilisez + ou − pour zoomer.",
    caseList: "Que souhaitez-vous explorer ?",
    play: 'Lire',
    pause: 'Pause',
    replay: 'Rejouer',
    timeline: "Position dans l'intervention",
    stages: { cut: 'Tracer la coupe', move: "Déplacer l'os", fix: 'Fixer par plaques' },
    traumaStages: { cut: 'Repérer les fractures', move: 'Les remettre en place', fix: 'Fixer par plaques' },
    views: { front: 'Face', quarter: 'Trois quarts', left: 'Gauche', right: 'Droite', below: 'Dessous' },
    viewsLabel: 'Vue',
    xray: 'Radio',
    face: 'Visage',
    faceOpacity: 'Opacité du visage',
    teeth: {
      chart: 'Schéma dentaire',
      hint: 'Cliquez sur une dent pour la choisir · glissez pour tourner',
      pick: "Cliquez sur une dent du modèle, ou choisissez-la sur le schéma, puis décidez ce qu'on en fait.",
      implant: 'Implant',
      crown: 'Couronne',
      natural: 'Dent naturelle',
      implants: 'Implants posés',
      crowns: 'Couronnes posées',
      resetAll: 'Rétablir toutes les dents',
      upper: 'supérieure',
      lower: 'inférieure',
      right: 'droite',
      left: 'gauche',
      pattern: '{type} {jaw} {side}',
      types: [
        'incisive centrale',
        'incisive latérale',
        'canine',
        'première prémolaire',
        'deuxième prémolaire',
        'première molaire',
        'deuxième molaire',
        'dent de sagesse',
      ],
    },
    labels: 'Repères',
    layersLabel: 'Calques',
    layers: {
      cranium: 'Crâne',
      maxilla: 'Mâchoire supérieure',
      mandible: 'Mâchoire inférieure',
      teeth: 'Dents',
      hardware: 'Plaques et vis',
    },
    section: 'Ouvrir sur la ligne médiane',
    reset: 'Réinitialiser la vue',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    readout: {
      title: 'Sur ce modèle',
      maxilla: 'Mâchoire supérieure',
      mandible: 'Mâchoire inférieure',
      chin: 'Menton',
      plates: 'Plaques',
      screws: 'Vis',
      advance: 'avancée',
      mm: 'mm',
    },
    landmarks: {
      frontal: 'Os frontal',
      orbit: 'Orbite',
      nasal: 'Os du nez',
      zygoma: 'Pommette',
      maxilla: 'Mâchoire supérieure',
      tmj: 'Articulation de la mâchoire',
      ramus: 'Branche montante',
      angle: 'Angle de la mâchoire',
      mental: 'Trou mentonnier',
      chin: 'Menton',
    },
    related: 'En savoir plus sur ce traitement',
  },

  cases: {
    bimax: {
      name: 'Chirurgie des deux mâchoires',
      tag: 'Mâchoire supérieure · inférieure · menton',
      summary:
        "Les deux mâchoires sont libérées, déplacées ensemble pour que les dents s'emboîtent toujours, puis fixées. Sur ce modèle, chaque mâchoire avance de 5 mm et le menton de 4 mm de plus.",
      points: [
        'Mâchoire supérieure : une coupe horizontale au-dessus des racines, dite de Le Fort I',
        'Mâchoire inférieure : un clivage de chaque côté, qui laisse les articulations en place',
        "Sept petites plaques en titane maintiennent la nouvelle position pendant que l'os consolide",
      ],
      page: 'jaw-surgery',
    },
    lefort: {
      name: 'Mâchoire supérieure',
      tag: 'Ostéotomie de Le Fort I',
      summary:
        "La partie de la mâchoire supérieure qui porte les dents est séparée par une seule coupe horizontale et déplacée d'un bloc — en avant, en arrière, vers le haut ou le bas — puis fixée en quatre points.",
      points: [
        'La coupe passe au-dessus des racines, du bord du nez jusque derrière la dernière molaire',
        'Deux plaques près du nez et deux sur les piliers des pommettes portent la charge',
        "Réalisée par l'intérieur de la bouche, elle ne laisse en général aucune cicatrice sur le visage",
      ],
      page: 'jaw-surgery',
    },
    bsso: {
      name: 'Mâchoire inférieure',
      tag: 'Clivage sagittal bilatéral',
      summary:
        'La mâchoire inférieure est fendue dans sa longueur de chaque côté, derrière les dents. La partie qui porte les dents glisse en avant ou en arrière, tandis que les deux articulations restent dans leur logement.',
      points: [
        "Le clivage laisse deux larges surfaces d'os en contact, ce qui permet la consolidation",
        'Une plaque de chaque côté franchit la marche',
        'Le nerf de la lèvre et du menton traverse cet os, et la coupe est planifiée autour de lui',
      ],
      page: 'jaw-surgery',
    },
    genio: {
      name: 'Menton',
      tag: 'Génioplastie de glissement',
      summary:
        "Le bord inférieur du menton est détaché sous les racines des dents et glissé à sa nouvelle place. On déplace votre propre os, sans ajouter d'implant.",
      points: [
        'La coupe reste sous les racines et sous les orifices du nerf de chaque côté',
        'Une seule plaque à décrochement maintient le menton à la distance prévue',
        'Souvent associée à la chirurgie des mâchoires, parfois réalisée seule',
      ],
      page: 'jaw-surgery',
    },
    trauma: {
      name: 'Fractures du visage',
      tag: 'Pommette et mâchoire inférieure',
      summary:
        'Une pommette cassée et une mâchoire inférieure cassée en deux endroits — un tableau fréquent après un choc sur le côté du visage. Chaque fragment est remis à sa place et maintenu par des plaques.',
      points: [
        "La pommette est fixée au sourcil, au rebord de l'orbite et au pilier",
        "Deux plaques à l'avant de la mâchoire et une à l'angle rétablissent l'occlusion",
        "Le but est de retrouver l'anatomie d'avant l'accident",
      ],
      page: 'facial-trauma-surgery',
    },
    teeth: {
      name: 'Implants et couronnes',
      tag: 'Votre choix, dent par dent',
      summary:
        "Choisissez une dent et décidez de son sort, comme un praticien parcourt une bouche. Un implant remplace la dent entière, racine comprise ; une couronne recouvre une dent qui reste en place.",
      points: [
        "Implant : la dent est retirée, un implant en titane est placé dans l'os, puis un pilier et une couronne en céramique",
        'Couronne : votre dent est légèrement réduite puis coiffée de céramique',
        "Activez le mode radio pour voir l'implant dans l'os, à côté des racines naturelles",
      ],
      page: 'dental-implants',
    },
    explore: {
      name: 'Vue libre',
      tag: 'Le crâne intact',
      summary:
        "Le crâne entier, sans aucune coupe. Tournez-le, affichez les repères, regardez à travers l'os jusqu'aux racines des dents, ou ouvrez-le sur la ligne médiane.",
      points: [
        "Le mode radio rend l'os translucide et laisse les dents pleines",
        "Les calques masquent le crâne, l'une des mâchoires ou les dents",
        "Le visage pose une peau translucide sur l'os, pour voir le profil changer",
      ],
    },
  },

  note: "Il s'agit d'un modèle de référence d'une anatomie normale, pas d'un patient. Les déplacements et la position des plaques sont donnés à titre d'illustration. Votre propre traitement est planifié à partir de votre examen et de vos propres images.",

  process: {
    eyebrow: "Du scanner au bloc opératoire",
    headline: 'Comment un plan est',
    outlined: 'établi',
    lead: "Le modèle ci-dessus donne l'idée ; voici la séquence que suit un cas réel.",
    steps: [
      { name: 'Examen et scanner', text: "L'occlusion, le visage et les articulations sont examinés, et un scanner montre l'os en trois dimensions." },
      { name: 'Mesures', text: 'Le chirurgien mesure où se trouvent les mâchoires et où elles doivent être, en millimètres.' },
      { name: 'Un plan écrit', text: "Les coupes, les déplacements et la fixation sont décidés avant l'intervention, et vous sont expliqués." },
      { name: "Chirurgie à l'hôpital", text: "Le plan est réalisé sous anesthésie générale, et l'os est fixé par des plaques et des vis en titane." },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    headline: 'À propos du',
    outlined: 'modèle',
    items: [
      {
        q: "S'agit-il d'un vrai patient ?",
        a: "Non. C'est un modèle de référence d'un crâne adulte normal, utilisé pour expliquer les interventions. Votre plan est établi à partir de votre propre examen et de votre scanner.",
      },
      {
        q: 'Ma mâchoire sera-t-elle déplacée de la même distance que sur le modèle ?',
        a: "Pas nécessairement. Les 5 mm et 4 mm montrés ici sont des exemples. Chaque déplacement est mesuré pour chaque patient et, pour une correction des mâchoires, convenu avec votre orthodontiste.",
      },
      {
        q: 'Les plaques en titane sont-elles retirées plus tard ?',
        a: 'En général non. Les plaques sont petites, bien tolérées, et sont laissées en place sauf si elles posent un problème.',
      },
      {
        q: 'Y aura-t-il des cicatrices sur mon visage ?',
        a: "La plupart des opérations des mâchoires se font par des incisions à l'intérieur de la bouche, donc sans cicatrice visible en général. Certaines fractures nécessitent une petite incision cutanée, placée dans un pli naturel lorsque c'est possible.",
      },
    ],
  },

  cta: {
    headline: 'Vous avez des images ou un plan écrit ? Posez votre question.',
    body: "Si vous avez des images ou un plan de traitement écrit, vous pouvez les partager sur WhatsApp avant de venir à la clinique. Le chirurgien peut préciser les informations utiles à la discussion ; un diagnostic et un plan de traitement nécessitent un examen et vos propres images.",
    button: 'Poser une question sur WhatsApp',
    topic: 'a jaw or facial concern',
    message: 'Bonjour Ozea, j’ai une question sur la mâchoire ou le visage. Quelles informations puis-je vous transmettre ?',
  },

  credit: 'Anatomie du crâne adaptée de « Human Male Skull » de Ruslan Gadzhiev (CC BY 4.0). Visage adapté de « Male Head Base mesh » de DEGUIDER (CC BY 4.0). Ostéotomies, plaques et animation par Ozea.',
}
