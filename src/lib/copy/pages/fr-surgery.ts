import type { ContentCopy } from './types'

/**
 * French copy for the facial and jaw surgery pages, plus the
 * travelling-patients page. A faithful translation of `en-surgery.ts`: same
 * keys, same number of items, no added claims.
 * `{clinic}`, `{address}` and `{phone}` are filled in `./index.ts`.
 */
export const frSurgery = {
  'maxillofacial-surgery': {
    nav: 'Chirurgie maxillo-faciale',
    blurb: 'Chirurgie des mâchoires, de la face et de la bouche',
    h1: 'Chirurgie orale et maxillo-faciale au Caire, en Égypte',
    metaTitle: 'Chirurgie maxillo-faciale – Le Caire, Égypte | Ozea Dental Clinic',
    metaDescription:
      'Chirurgie orale et maxillo-faciale à Nasr City, au Caire : mâchoires, traumatismes faciaux, ATM, kystes, implants. Planifiée sur imagerie par des spécialistes.',
    eyebrow: 'Chirurgie orale et maxillo-faciale',
    answer:
      'La chirurgie orale et maxillo-faciale est la spécialité chirurgicale qui traite les mâchoires, la face et la bouche : décalages des mâchoires, fractures de la face, articulation de la mâchoire (ATM), dents incluses, kystes et tumeurs des mâchoires, ainsi que la chirurgie osseuse dont dépendent les implants dentaires. Chez {clinic}, à Nasr City, au Caire, elle constitue le cœur de l’activité, sous la direction du Dr Youssef Nasser et du Dr Adham Yehia Zakaria, consultant. Les opérations qui nécessitent un bloc opératoire et une anesthésie générale donnent lieu à une admission dans les hôpitaux partenaires de la clinique.',
    facts: [
      { label: 'Spécialité', value: 'Chirurgie orale et maxillo-faciale' },
      { label: 'Chirurgiens', value: 'Dr Youssef Nasser · Dr Adham Yehia Zakaria' },
      { label: 'Clinique', value: 'Nasr City, Le Caire' },
      { label: 'Interventions au bloc', value: 'Hôpitaux partenaires, sous anesthésie générale' },
    ],
    sections: [
      {
        heading: 'Ce que traite un chirurgien maxillo-facial',
        list: [
          'Décalages des mâchoires — mâchoire inférieure avancée (prognathisme), mâchoire inférieure en retrait, béance et asymétrie du visage (chirurgie orthognathique)',
          'Fractures de la face — mâchoire inférieure, pommette, orbite et mâchoire supérieure',
          'Troubles de l’articulation de la mâchoire — douleurs de l’ATM, claquements, blocages et limitation de l’ouverture',
          'Dents de sagesse incluses et autres extractions chirurgicales',
          'Kystes et tumeurs bénignes des mâchoires, avec biopsie',
          'Implants dentaires, greffes osseuses et sinus lift (comblement sinusien)',
        ],
      },
      {
        heading: 'Ce qui la distingue de la dentisterie générale',
        body: [
          'Le dentiste généraliste prend soin des dents et des gencives. Le chirurgien maxillo-facial est un dentiste qui a poursuivi une formation chirurgicale de troisième cycle portant sur les os, les articulations et les tissus mous de la face, et qui opère aussi bien à l’hôpital qu’à la clinique.',
          'C’est pourquoi les problèmes situés au-delà des dents — une mâchoire trop en retrait, une articulation qui se bloque, une fracture, un kyste dans l’os — sont adressés à cette spécialité plutôt que traités au fauteuil dentaire.',
        ],
      },
      {
        heading: 'À la clinique ou à l’hôpital ?',
        body: [
          'Les consultations, l’étude de l’imagerie, les implants, les dents de sagesse et la plupart des actes de petite chirurgie ont lieu à la clinique de Nasr City, sous anesthésie locale.',
          'La chirurgie correctrice des mâchoires, la réparation des fractures, la chirurgie de l’articulation et tout ce qui nécessite un bloc opératoire et un anesthésiste sont réalisés dans l’un des hôpitaux où le cabinet fait admettre ses patients. Le choix de l’hôpital est convenu avec vous dans le cadre du plan écrit.',
        ],
      },
      {
        heading: 'Quand demander un bilan',
        list: [
          'Vos dents ne se rejoignent pas correctement, ou votre mâchoire vous semble décalée, à la vue ou au ressenti',
          'Votre mâchoire claque, se bloque ou vous fait mal à l’ouverture ou à la mastication',
          'Vous avez subi un traumatisme de la face ou de la mâchoire',
          'Vous présentez un gonflement de la mâchoire ou une anomalie découverte sur une radiographie dentaire',
          'Une dent de sagesse s’infecte à répétition',
          'On vous a dit que vous n’aviez pas assez d’os pour un implant',
        ],
      },
    ],
    steps: [
      { name: 'Consultation', text: 'Vos antécédents, un examen clinique et ce que vous souhaitez changer.' },
      { name: 'Imagerie et mesures', text: 'Des radiographies ou un scanner, et les mesures qui en sont tirées.' },
      { name: 'Plan écrit', text: 'Ce qui est proposé, où l’intervention a lieu et ce qu’implique la convalescence — vous en conservez un exemplaire.' },
      { name: 'Chirurgie et suivi', text: 'L’opération, puis des contrôles programmés jusqu’à cicatrisation complète.' },
    ],
    faqs: [
      {
        q: 'Quelle est la différence entre un dentiste et un chirurgien maxillo-facial ?',
        a: 'Le dentiste soigne les dents et les gencives. Le chirurgien maxillo-facial a suivi une formation chirurgicale complémentaire de troisième cycle et opère les mâchoires, les os de la face, l’articulation de la mâchoire et les tissus mous associés — par exemple la chirurgie correctrice des mâchoires, les fractures de la face, les kystes et les cas implantaires complexes.',
      },
      {
        q: 'Faut-il être adressé par un médecin pour consulter un chirurgien maxillo-facial ?',
        a: 'Non. Vous pouvez réserver une consultation directement sur WhatsApp au {phone}. Les patients adressés par un dentiste ou un orthodontiste, ainsi que les demandes de deuxième avis, sont les bienvenus.',
      },
      {
        q: 'La chirurgie maxillo-faciale se fait-elle toujours sous anesthésie générale ?',
        a: 'Non. Les implants, les dents de sagesse et la plupart des petites interventions se font sous anesthésie locale, à la clinique. Le repositionnement des mâchoires, la réparation des fractures et la chirurgie ouverte de l’articulation sont réalisés à l’hôpital, sous anesthésie générale.',
      },
      {
        q: 'La chirurgie maxillo-faciale laisse-t-elle des cicatrices sur le visage ?',
        a: 'La plupart des opérations des mâchoires se font par des incisions à l’intérieur de la bouche ; il n’y a donc généralement pas de cicatrice visible. Certaines opérations de fractures ou de l’articulation nécessitent une petite incision cutanée, placée autant que possible dans un pli naturel ou le long de la ligne des cheveux.',
      },
      {
        q: 'Où les opérations sont-elles réalisées ?',
        a: 'La petite chirurgie est réalisée chez {clinic}, {address}. Les interventions au bloc opératoire donnent lieu à une admission dans les hôpitaux partenaires indiqués sur ce site, notamment Shifa Hospital, Global Medical City, La Vida Hospital, Nasaaem Hospital et Dar El Oyoun Hospitals.',
      },
      {
        q: 'Comment prendre rendez-vous pour une consultation maxillo-faciale au Caire ?',
        a: 'Écrivez à la clinique sur WhatsApp au {phone}. Si vous avez déjà des radiographies ou un scanner, envoyez-les à l’avance ou apportez-les avec vous. C’est en consultation, à partir de votre propre imagerie, que l’on détermine si une chirurgie vous convient.',
      },
    ],
  },

  'jaw-surgery': {
    nav: 'Chirurgie correctrice des mâchoires',
    blurb: 'Chirurgie orthognathique, pour l’occlusion et l’équilibre du visage',
    h1: 'Chirurgie correctrice des mâchoires (chirurgie orthognathique) au Caire',
    metaTitle: 'Chirurgie de la mâchoire (orthognathique) – Le Caire | Ozea',
    metaDescription:
      'Chirurgie orthognathique des mâchoires au Caire : prognathisme, mâchoire en retrait, béance, asymétrie faciale. Planifiée sur imagerie avec votre orthodontiste.',
    eyebrow: 'Chirurgie orthognathique',
    answer:
      'La chirurgie correctrice des mâchoires, ou chirurgie orthognathique, déplace la mâchoire supérieure, la mâchoire inférieure ou les deux vers une meilleure position. Elle corrige un défaut d’occlusion — la façon dont les dents s’emboîtent — que l’appareil orthodontique seul ne peut pas rétablir, et équilibre le profil du visage. Chez {clinic}, au Caire, elle est planifiée à partir de l’imagerie et de mesures par le Dr Youssef Nasser et le Dr Adham Yehia Zakaria, chirurgiens oraux et maxillo-faciaux, le plus souvent en collaboration avec votre orthodontiste, et réalisée à l’hôpital sous anesthésie générale.',
    facts: [
      { label: 'Anesthésie', value: 'Générale, à l’hôpital' },
      { label: 'Hospitalisation', value: 'Souvent une ou deux nuits' },
      { label: 'Reprise des activités', value: 'En général 2 à 4 semaines' },
      { label: 'Consolidation osseuse', value: 'Environ 6 à 12 semaines' },
    ],
    sections: [
      {
        heading: 'Ce qu’elle corrige',
        list: [
          'Prognathisme — une mâchoire inférieure placée en avant de la mâchoire supérieure',
          'Une mâchoire inférieure ou un menton en retrait, et un surplomb important des dents du haut',
          'Béance — des dents de devant qui ne se touchent pas alors que les dents du fond sont en contact',
          'Asymétrie faciale — une mâchoire ou un menton décentré',
          'Un sourire gingival dû à une mâchoire supérieure trop haute',
          'Certains cas d’apnée obstructive du sommeil liés à la position des mâchoires',
        ],
      },
      {
        heading: 'À qui elle s’adresse',
        body: [
          'Elle s’adresse aux adultes et aux grands adolescents dont la croissance des mâchoires est terminée et dont le problème d’occlusion vient de la position des os plutôt que de celle des dents. L’appareil orthodontique déplace les dents au sein d’une mâchoire ; il ne peut pas déplacer la mâchoire elle-même.',
          'La plupart des patients portent un appareil orthodontique avant l’opération, afin d’aligner les dents en vue de leur nouvelle position, puis pendant une période plus courte après l’opération, pour stabiliser l’occlusion.',
        ],
      },
      {
        heading: 'Convalescence',
        body: [
          'Le gonflement est maximal les premiers jours et se résorbe en deux à trois semaines. Les mâchoires sont maintenues par de petites plaques et vis en titane ; elles ne sont donc généralement pas bloquées par des fils d’acier. De légers élastiques peuvent guider l’occlusion.',
          'Vous suivrez une alimentation liquide, puis molle, pendant plusieurs semaines. Un engourdissement de la lèvre inférieure ou du menton est fréquent au début et disparaît généralement en quelques semaines à quelques mois ; le risque qu’il persiste est abordé avec vous au préalable.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation et imagerie', text: 'Examen clinique, photographies, radiographies ou scanner, et mesures des mâchoires.' },
      { name: 'Planification conjointe', text: 'Un plan établi en accord avec votre orthodontiste, où les déplacements prévus des mâchoires sont consignés par écrit.' },
      { name: 'Chirurgie à l’hôpital', text: 'Sous anesthésie générale, par des incisions à l’intérieur de la bouche.' },
      { name: 'Convalescence et finitions', text: 'Des contrôles pendant la consolidation osseuse, puis les derniers réglages orthodontiques.' },
    ],
    faqs: [
      {
        q: 'La chirurgie de la mâchoire laisse-t-elle des cicatrices visibles ?',
        a: 'En général, non. Les mâchoires sont abordées par des incisions à l’intérieur de la bouche ; il n’y a donc normalement aucune cicatrice sur le visage.',
      },
      {
        q: 'Aurai-je la mâchoire bloquée par des fils après l’opération ?',
        a: 'Rarement. Les os sont fixés par de petites plaques et vis en titane, ce qui vous permet d’ouvrir la bouche peu après l’intervention. De légers élastiques entre les dents du haut et celles du bas sont courants pendant quelques semaines.',
      },
      {
        q: 'Combien de temps dure l’ensemble du traitement orthognathique ?',
        a: 'L’opération n’est qu’une étape d’un plan plus long. En comptant l’orthodontie avant et après, le traitement dure couramment de 18 mois à trois ans environ. L’hospitalisation est souvent d’une ou deux nuits, et la plupart des personnes reprennent le travail ou les études dans un délai de deux à quatre semaines.',
      },
      {
        q: 'Faut-il porter un appareil dentaire avant une chirurgie de la mâchoire ?',
        a: 'Dans la plupart des cas, oui. Le traitement orthodontique aligne les dents pour qu’elles s’emboîtent une fois les mâchoires déplacées. Votre chirurgien et votre orthodontiste le planifient ensemble.',
      },
      {
        q: 'Quels sont les risques de la chirurgie orthognathique ?',
        a: 'Les principaux sont un engourdissement temporaire — et parfois durable — de la lèvre ou du menton, un gonflement, un saignement, une infection et une occlusion nécessitant des ajustements complémentaires. Les risques propres à votre cas vous sont expliqués en consultation, avant toute programmation.',
      },
      {
        q: 'La chirurgie de la mâchoire est-elle uniquement esthétique ?',
        a: 'Non. Son but principal est fonctionnel : la mastication, la parole, le confort de l’articulation de la mâchoire et, dans certains cas, la respiration. La modification du profil du visage découle du repositionnement des mâchoires à leur juste place.',
      },
    ],
  },

  'facial-trauma-surgery': {
    nav: 'Traumatologie faciale et reconstruction',
    blurb: 'Fractures de la mâchoire, de la pommette et de l’orbite',
    h1: 'Traumatologie faciale et chirurgie reconstructrice au Caire',
    metaTitle: 'Fractures et traumatismes de la face – Le Caire | Ozea',
    metaDescription:
      'Traitement des fractures de la face au Caire — mâchoires, pommette, orbite — et reconstruction après traumatisme, par des chirurgiens maxillo-faciaux.',
    eyebrow: 'Traumatologie et reconstruction',
    answer:
      'La chirurgie des traumatismes de la face répare les fractures des os du visage — la mâchoire inférieure (mandibule), la pommette (os zygomatique), la cavité de l’œil (orbite) et la mâchoire supérieure — afin de rétablir l’occlusion, la forme du visage et la position de l’œil. Chez {clinic}, au Caire, les fractures sont évaluées par scanner par le Dr Youssef Nasser et le Dr Adham Yehia Zakaria, chirurgiens oraux et maxillo-faciaux, puis réparées à l’hôpital, le plus souvent à l’aide de petites plaques en titane.',
    facts: [
      { label: 'Bilan', value: 'Examen clinique et scanner' },
      { label: 'Fixation', value: 'Plaques et vis en titane' },
      { label: 'Lieu', value: 'Hôpitaux partenaires' },
      { label: 'Consolidation osseuse', value: 'Environ 6 semaines' },
    ],
    sections: [
      {
        heading: 'Lésions prises en charge',
        list: [
          'Fractures de la mâchoire inférieure, y compris au niveau de l’articulation (condyle)',
          'Fractures de la pommette (os zygomatique)',
          'Fractures de l’orbite, y compris du plancher de l’orbite',
          'Fractures de la mâchoire supérieure et de l’étage moyen de la face',
          'Traumatismes des dents et de l’os qui les porte',
          'Reconstruction secondaire — greffe osseuse et implants pour remplacer les dents perdues lors d’un traumatisme',
        ],
      },
      {
        heading: 'Signes pouvant évoquer la fracture d’un os de la face',
        list: [
          'Des dents qui ne s’emboîtent plus comme avant',
          'Une douleur ou une difficulté à ouvrir la bouche',
          'Un engourdissement de la lèvre, du menton ou de la joue',
          'Une vision double, ou un œil qui paraît enfoncé',
          'Une pommette aplatie ou une modification visible de la forme du visage',
        ],
        body: [
          'Un traumatisme grave — saignement abondant, perte de connaissance, difficulté à respirer ou modification de la vision — relève d’abord d’un service d’urgences hospitalier. La réparation de la fracture est planifiée une fois votre état stabilisé.',
        ],
      },
      {
        heading: 'Comment les fractures sont réparées',
        body: [
          'Certaines fractures non déplacées consolident avec une alimentation molle et une surveillance. Les fractures déplacées sont remises en position et maintenues par de petites plaques et vis en titane, une technique appelée réduction à foyer ouvert avec fixation interne (ostéosynthèse). Dans la mesure du possible, l’os est abordé par la bouche ou par une incision dissimulée dans un pli naturel.',
          'Il est généralement préférable de réparer la fracture au cours des une à deux premières semaines, une fois le gonflement résorbé et avant que les os ne commencent à se souder en mauvaise position.',
        ],
      },
    ],
    steps: [
      { name: 'Bilan', text: 'Examen de l’occlusion, de la sensibilité et des mouvements de l’œil, complété par un scanner.' },
      { name: 'Plan', text: 'Quelles fractures doivent être fixées, par quelle voie d’abord et dans quel hôpital.' },
      { name: 'Réparation', text: 'Sous anesthésie générale ; les os sont repositionnés puis fixés par des plaques.' },
      { name: 'Suivi', text: 'Contrôles de l’occlusion et de la cicatrisation, et remplacement des dents perdues si nécessaire.' },
    ],
    faqs: [
      {
        q: 'Dans quel délai faut-il traiter une fracture de la face ?',
        a: 'Une fois les éventuels soins d’urgence assurés, la plupart des fractures de la face gagnent à être réparées dans un délai d’environ une à deux semaines. Attendre nettement plus longtemps pour une fracture déplacée rend plus difficile le rétablissement de l’occlusion et de la forme d’origine.',
      },
      {
        q: 'Toutes les fractures de la face nécessitent-elles une opération ?',
        a: 'Non. Les fractures stables et non déplacées peuvent consolider avec une alimentation molle et des contrôles réguliers. La chirurgie est conseillée lorsque l’occlusion est modifiée, que l’os est déplacé ou que la position ou les mouvements de l’œil sont touchés.',
      },
      {
        q: 'Les plaques en titane sont-elles retirées par la suite ?',
        a: 'En général, non. Les plaques sont petites, bien tolérées, et sont laissées en place sauf si elles posent un problème, comme une infection, ou si elles sont perceptibles sous la peau.',
      },
      {
        q: 'Peut-on corriger une ancienne fracture mal consolidée ?',
        a: 'Souvent, oui. Une mâchoire ou une pommette consolidée en mauvaise position peut être de nouveau sectionnée puis repositionnée, et l’os ou les dents perdus lors du traumatisme peuvent être reconstruits par des greffes et des implants. Cela nécessite un scanner et un plan individualisé.',
      },
      {
        q: 'Combien de temps dure la convalescence après l’opération d’une fracture de la mâchoire ?',
        a: 'L’os met environ six semaines à se consolider. Prévoyez une alimentation molle pendant cette période ; le gonflement se résorbe en deux à trois semaines et la plupart des personnes reprennent un travail de bureau en une à deux semaines.',
      },
    ],
  },

  'tmj-treatment': {
    nav: 'Traitement de l’ATM',
    blurb: 'Douleurs, claquements et blocages de l’articulation de la mâchoire',
    h1: 'Traitement de l’ATM et chirurgie de l’articulation de la mâchoire au Caire',
    metaTitle: 'Traitement et chirurgie de l’ATM (mâchoire) – Le Caire | Ozea',
    metaDescription:
      'Douleur de l’ATM, claquements ou mâchoire bloquée ? Bilan et traitement au Caire : gouttière, arthrocentèse, arthroscopie, prothèse d’articulation.',
    eyebrow: 'Articulation temporo-mandibulaire',
    answer:
      'L’articulation temporo-mandibulaire (ATM) est la charnière située devant chaque oreille, qui ouvre et ferme la mâchoire. Les troubles de l’ATM provoquent des douleurs, des claquements, des blocages ou une limitation de l’ouverture, et la plupart s’améliorent sans chirurgie. Chez {clinic}, au Caire, ils sont évalués par le Dr Adham Yehia Zakaria, consultant en chirurgie orale et maxillo-faciale, qui a une activité dédiée à l’ATM. Le traitement le moins invasif capable de résoudre le problème est essayé en premier ; l’arthrocentèse, l’arthroscopie ou la chirurgie ouverte de l’articulation sont réservées aux articulations qui n’y répondent pas.',
    facts: [
      { label: 'Traitement de première intention', value: 'Conservateur — sans chirurgie' },
      { label: 'Mini-invasif', value: 'Arthrocentèse, arthroscopie' },
      { label: 'Chirurgie ouverte', value: 'Pour une petite minorité' },
      { label: 'Praticien référent', value: 'Dr Adham Yehia Zakaria' },
    ],
    sections: [
      {
        heading: 'Symptômes d’un trouble de l’ATM',
        list: [
          'Une douleur devant l’oreille, dans les muscles de la mâchoire ou à la tempe',
          'Des claquements, des craquements ou des crissements à l’ouverture de la bouche ou à la mastication',
          'Une mâchoire qui se bloque, ouverte ou fermée, ou qui accroche',
          'Une ouverture de bouche limitée, ou une mâchoire qui dévie d’un côté',
          'Des maux de tête ou des douleurs d’oreille sans problème d’oreille retrouvé',
        ],
      },
      {
        heading: 'Le traitement, étape par étape',
        body: [
          'La plupart des problèmes d’ATM se traitent sans opération : repos et alimentation molle, médicaments anti-inflammatoires, kinésithérapie et exercices de la mâchoire, et une gouttière occlusale portée la nuit si vous serrez ou grincez des dents.',
          'Si la douleur ou le blocage persiste, l’arthrocentèse consiste à laver l’articulation avec un liquide stérile au moyen de deux fines aiguilles. L’arthroscopie va un cran plus loin : elle explore l’intérieur de l’articulation avec une petite caméra et libère les adhérences dans le même temps.',
          'La chirurgie ouverte de l’articulation — repositionner ou retirer un disque abîmé, libérer une articulation soudée (ankylose) ou remplacer l’articulation par une prothèse — est réservée aux articulations présentant des lésions structurelles que les options moins invasives ne peuvent pas corriger.',
        ],
      },
      {
        heading: 'Comment l’articulation est évaluée',
        body: [
          'Le bilan commence par l’articulation elle-même : l’amplitude d’ouverture de la bouche, une éventuelle déviation de la mâchoire, les zones sensibles et les bruits qu’elle produit. L’IRM montre la position du disque ; le scanner montre l’os. Le traitement est choisi à partir de ces constatations plutôt que des seuls symptômes.',
        ],
      },
    ],
    steps: [
      { name: 'Bilan', text: 'Examen de l’articulation et des muscles, et mesure de l’ouverture.' },
      { name: 'Imagerie', text: 'IRM pour le disque, scanner pour l’os, lorsque l’examen le justifie.' },
      { name: 'Le traitement conservateur d’abord', text: 'Gouttière, médicaments et kinésithérapie, avec réévaluation sur plusieurs semaines.' },
      { name: 'Un geste si nécessaire', text: 'Arthrocentèse ou arthroscopie, et chirurgie ouverte uniquement lorsqu’elle est indiquée.' },
    ],
    faqs: [
      {
        q: 'Ma mâchoire claque : est-ce grave ?',
        a: 'Pas toujours. Un claquement sans douleur ni limitation de l’ouverture est fréquent et ne nécessite généralement aucun traitement. Consultez un spécialiste si le claquement s’accompagne de douleurs, de blocages ou d’une bouche qui ne s’ouvre pas complètement.',
      },
      {
        q: 'Faut-il se faire opérer pour un problème d’ATM ?',
        a: 'Probablement pas. La plupart des personnes s’améliorent avec un traitement conservateur. Une minorité a besoin d’un geste mini-invasif comme l’arthrocentèse, et seules quelques-unes nécessitent une chirurgie ouverte de l’articulation.',
      },
      {
        q: 'Qu’est-ce qu’une arthrocentèse de l’ATM ?',
        a: 'C’est un lavage de l’articulation de la mâchoire. Deux fines aiguilles sont placées dans l’articulation et un liquide stérile y circule pour éliminer les débris inflammatoires et libérer un disque bloqué. Le geste se fait sous anesthésie locale ou sous sédation, et vous rentrez chez vous le jour même.',
      },
      {
        q: 'Que faire en cas de mâchoire bloquée ?',
        a: 'Une mâchoire qui, soudainement, ne s’ouvre plus complètement ou ne se referme plus doit être examinée rapidement — idéalement dans les jours qui suivent. Le traitement précoce d’une articulation bloquée est plus simple et plus efficace qu’un traitement entrepris après plusieurs mois.',
      },
      {
        q: 'Une gouttière de nuit guérit-elle les troubles de l’ATM ?',
        a: 'La gouttière ne guérit pas l’articulation, mais elle réduit les contraintes liées au serrement et au grincement des dents et soulage les douleurs musculaires chez de nombreux patients. C’est l’un des éléments du traitement conservateur, aux côtés des exercices et des médicaments.',
      },
      {
        q: 'Quand faut-il une prothèse totale de l’articulation de la mâchoire ?',
        a: 'Rarement — pour les articulations détruites par une arthrite sévère, soudées par une ankylose ou abîmées par une chirurgie ou un traumatisme antérieurs, lorsqu’aucun autre traitement ne peut rétablir le mouvement. L’articulation est remplacée par une prothèse, à l’hôpital, sous anesthésie générale.',
      },
    ],
  },

  'jaw-cysts-and-tumours': {
    nav: 'Kystes et tumeurs bénignes des mâchoires',
    blurb: 'Ablation et biopsie des lésions de la mâchoire',
    h1: 'Ablation des kystes et des tumeurs bénignes des mâchoires au Caire',
    metaTitle: 'Kystes et tumeurs bénignes des mâchoires – Le Caire | Ozea',
    metaDescription:
      'Diagnostic, biopsie et ablation chirurgicale des kystes et tumeurs bénignes des mâchoires au Caire, par des chirurgiens maxillo-faciaux, planifiés sur scanner.',
    eyebrow: 'Kystes et lésions bénignes',
    answer:
      'Un kyste des mâchoires est une poche remplie de liquide qui grossit lentement à l’intérieur de l’os de la mâchoire, souvent autour de la racine d’une dent morte ou d’une dent incluse ; les tumeurs bénignes sont des masses solides qui ne sont pas des cancers. Les uns comme les autres sont le plus souvent découverts sur une radiographie et sont traités par ablation, le tissu retiré étant envoyé au laboratoire pour analyse. Chez {clinic}, au Caire, ils sont évalués par scanner puis retirés par le Dr Youssef Nasser et le Dr Adham Yehia Zakaria, chirurgiens oraux et maxillo-faciaux.',
    facts: [
      { label: 'Diagnostic', value: 'Scanner et biopsie' },
      { label: 'Petits kystes', value: 'Anesthésie locale, à la clinique' },
      { label: 'Lésions volumineuses', value: 'Anesthésie générale, à l’hôpital' },
      { label: 'Suivi', value: 'Contrôles radiographiques pendant que l’os se reforme' },
    ],
    sections: [
      {
        heading: 'Comment ils sont découverts',
        body: [
          'La plupart des kystes des mâchoires sont indolores et sont découverts sur une radiographie dentaire de routine. Les plus volumineux peuvent provoquer un gonflement, rendre des dents mobiles ou les déplacer, s’infecter ou fragiliser la mâchoire.',
          'Toute grosseur, ulcération ou plaque dans la bouche qui n’a pas guéri au bout de deux à trois semaines doit être examinée, et une biopsie réalisée au moindre doute.',
        ],
      },
      {
        heading: 'Comment ils sont traités',
        body: [
          'Un petit kyste est retiré en entier, à travers la gencive, sous anesthésie locale — un geste appelé énucléation — et la cavité se comble d’os nouveau au cours des mois suivants.',
          'Un kyste très volumineux peut d’abord être ouvert et drainé pour qu’il diminue de taille — c’est la marsupialisation, ou décompression — puis retiré dans un second temps, ce qui protège les nerfs et les dents voisins. Certaines tumeurs bénignes ont tendance à récidiver et nécessitent une exérèse plus large et un suivi plus long.',
          'Tout ce qui est retiré est envoyé à un laboratoire d’anatomopathologie. Le résultat confirme le diagnostic et détermine la durée de votre suivi.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation et scanner', text: 'La taille de la lésion et ses rapports avec les dents et les nerfs.' },
      { name: 'Biopsie si nécessaire', text: 'Un petit prélèvement réalisé au préalable si le diagnostic est incertain.' },
      { name: 'Ablation', text: 'À la clinique pour les petites lésions, à l’hôpital pour les plus volumineuses.' },
      { name: 'Anatomopathologie et suivi', text: 'Le résultat du laboratoire, puis des contrôles radiographiques pendant la cicatrisation osseuse.' },
    ],
    faqs: [
      {
        q: 'Un kyste de la mâchoire est-il un cancer ?',
        a: 'Presque jamais. La grande majorité des kystes des mâchoires sont bénins. Le tissu est tout de même analysé en laboratoire après l’ablation, car c’est le seul moyen de confirmer précisément sa nature.',
      },
      {
        q: 'Un kyste de la mâchoire peut-il disparaître tout seul ?',
        a: 'Rarement. Les kystes ont tendance à grossir lentement et sans symptôme. Un petit kyste situé à l’extrémité d’une racine peut parfois guérir après un traitement de canal ; les autres doivent être retirés.',
      },
      {
        q: 'Vais-je perdre des dents lors de l’ablation du kyste ?',
        a: 'Pas nécessairement. Les dents voisines d’un kyste peuvent souvent être conservées, parfois après un traitement de canal. Une dent à l’origine du kyste, ou une dent qui n’a plus d’os autour d’elle, peut devoir être extraite.',
      },
      {
        q: 'L’os se reforme-t-il après l’ablation d’un kyste de la mâchoire ?',
        a: 'Oui. Dans la plupart des cas, la cavité se comble d’os nouveau en six à douze mois. Les pertes de substance très étendues sont parfois greffées, et les dents manquantes peuvent ensuite être remplacées par des implants.',
      },
      {
        q: 'Un kyste de la mâchoire peut-il revenir ?',
        a: 'La plupart ne reviennent pas. Quelques types, comme le kératokyste odontogène, ont une tendance connue à la récidive ; c’est pourquoi des radiographies de contrôle sont programmées après l’ablation.',
      },
    ],
  },

  'wisdom-tooth-removal': {
    nav: 'Extraction des dents de sagesse',
    blurb: 'Extraction chirurgicale des troisièmes molaires incluses',
    h1: 'Extraction des dents de sagesse incluses à Nasr City, au Caire',
    metaTitle: 'Extraction des dents de sagesse – Nasr City, Le Caire | Ozea',
    metaDescription:
      'Extraction chirurgicale des dents de sagesse incluses à Nasr City, au Caire, par un chirurgien maxillo-facial. Radio, anesthésie locale, consignes claires.',
    eyebrow: 'Troisièmes molaires incluses',
    answer:
      'Une dent de sagesse incluse est une troisième molaire qui n’a pas la place de sortir et reste partiellement ou totalement enfouie dans la gencive ou dans l’os. On l’extrait lorsqu’elle provoque des douleurs, des infections à répétition, une carie ou des dégâts sur la dent située devant elle. Chez {clinic}, à Nasr City, au Caire, les dents de sagesse incluses sont évaluées sur radiographie et extraites par le Dr Youssef Nasser, chirurgien oral et maxillo-facial, le plus souvent sous anesthésie locale et en une seule séance.',
    facts: [
      { label: 'Anesthésie', value: 'Locale, dans la plupart des cas' },
      { label: 'Durée de l’intervention', value: 'Souvent moins d’une heure' },
      { label: 'Pic du gonflement', value: '2e–3e jour' },
      { label: 'Rétablissement', value: 'Environ une semaine' },
    ],
    sections: [
      {
        heading: 'Quand une dent de sagesse doit être extraite',
        list: [
          'Infections répétées de la gencive qui recouvre la dent (péricoronarite)',
          'Carie de la dent de sagesse ou de la molaire située devant elle',
          'Formation d’un kyste autour de la dent enfouie',
          'Atteinte de la dent voisine, ou perte osseuse en arrière de celle-ci',
          'Lorsqu’un orthodontiste ou un chirurgien le demande dans le cadre d’un plan plus global',
        ],
        body: [
          'Une dent de sagesse saine, entièrement sortie et accessible au brossage, ou au contraire profondément enfouie et sans aucune conséquence, peut généralement être laissée en place et simplement surveillée.',
        ],
      },
      {
        heading: 'Après l’extraction',
        body: [
          'Attendez-vous à un gonflement et à une raideur qui culminent le deuxième ou le troisième jour et se résorbent en une semaine environ. La douleur est maîtrisée par des antalgiques courants, pris régulièrement les premiers jours.',
          'Pendant les premières 24 heures, évitez les bains de bouche, de cracher, les boissons chaudes et le tabac, afin que le caillot sanguin reste dans l’alvéole. La perte de ce caillot provoque une alvéolite sèche — une douleur lancinante qui débute deux à quatre jours plus tard et se traite facilement à la clinique.',
        ],
      },
    ],
    steps: [
      { name: 'Bilan radiographique', text: 'Une radiographie panoramique, et un scanner si la dent est proche du nerf.' },
      { name: 'Plan et consentement', text: 'En quoi consiste le geste et quels risques concernent votre dent.' },
      { name: 'Extraction', text: 'Sous anesthésie locale ; la gencive est refermée par des fils résorbables.' },
      { name: 'Contrôle', text: 'Une visite de contrôle au bout d’une semaine environ, plus tôt si la douleur augmente.' },
    ],
    faqs: [
      {
        q: 'Faut-il enlever toutes les dents de sagesse ?',
        a: 'Non. Les dents de sagesse entièrement sorties, saines et accessibles au brossage n’ont pas besoin d’être extraites. L’extraction est conseillée lorsqu’une dent provoque une infection, une carie, un kyste ou des dégâts sur la dent voisine.',
      },
      {
        q: 'L’extraction d’une dent de sagesse fait-elle mal ?',
        a: 'L’intervention elle-même se fait sous anesthésie locale : vous sentez une pression, mais pas de douleur. Les douleurs et le gonflement qui suivent durent plusieurs jours et sont soulagés par des antalgiques.',
      },
      {
        q: 'Combien de temps faut-il pour se remettre d’une extraction de dent de sagesse ?',
        a: 'La plupart des personnes reprennent une activité normale en deux à trois jours et ne ressentent plus aucune gêne au bout d’une semaine environ. Les dents incluses du bas demandent plus de temps que celles du haut.',
      },
      {
        q: 'Qu’est-ce qu’une alvéolite sèche ?',
        a: 'C’est une douleur qui débute deux à quatre jours après une extraction, lorsque le caillot sanguin a quitté l’alvéole. Elle est plus fréquente chez les fumeurs et après l’extraction de dents de sagesse inférieures. On la traite en nettoyant l’alvéole et en y plaçant un pansement.',
      },
      {
        q: 'L’extraction d’une dent de sagesse peut-elle toucher un nerf ?',
        a: 'Les dents de sagesse inférieures peuvent se trouver près du nerf qui assure la sensibilité de la lèvre et du menton. Un engourdissement après l’intervention est peu fréquent et généralement temporaire. Lorsque la radiographie montre une racine proche du nerf, un scanner est réalisé pour planifier l’approche la plus sûre.',
      },
      {
        q: 'Peut-on enlever les quatre dents de sagesse en une seule fois ?',
        a: 'Oui, si cela convient à votre cas. Les extraire en une seule séance signifie une seule convalescence ; pour les dents difficiles ou les patients anxieux, cela peut se faire sous sédation ou sous anesthésie générale, à l’hôpital.',
      },
    ],
  },

  'international-patients': {
    nav: 'Venir se faire soigner au Caire',
    blurb: 'Patients extérieurs au Caire et patients venant de l’étranger',
    h1: 'Venir au Caire pour des soins dentaires et maxillo-faciaux',
    metaTitle: 'Venir en Égypte pour des soins dentaires – Le Caire | Ozea',
    metaDescription:
      'Venir au Caire d’un autre gouvernorat ou de l’étranger pour des implants ou une chirurgie de la mâchoire : envoi des radios, visites et rendez-vous chez Ozea.',
    eyebrow: 'Patients extérieurs au Caire',
    answer:
      '{clinic}, à Nasr City, au Caire, soigne des patients qui viennent d’autres gouvernorats d’Égypte et de l’étranger pour des implants dentaires, une réhabilitation d’arcade complète ou une chirurgie maxillo-faciale. Vous pouvez envoyer vos radiographies ou votre scanner à l’avance sur WhatsApp, afin que votre première visite soit consacrée à l’examen et à la planification. Le traitement lui-même, et le fait qu’il vous convienne ou non, se décident lors de cette consultation.',
    facts: [
      { label: 'Premier contact', value: 'WhatsApp, avec vos radiographies' },
      { label: 'Langues', value: 'Arabe et anglais' },
      { label: 'Clinique', value: 'Nasr City, Le Caire' },
      { label: 'Aéroport', value: 'Aéroport international du Caire, à proximité' },
    ],
    sections: [
      {
        heading: 'Avant votre voyage',
        list: [
          'Envoyez sur WhatsApp une radiographie panoramique ou un scanner récents, avec une brève description du problème',
          'Signalez à la clinique vos problèmes de santé et vos traitements, en particulier les anticoagulants et le diabète',
          'Demandez combien de visites votre traitement nécessitera probablement, et à quel intervalle',
          'Apportez votre dossier dentaire antérieur et tout compte rendu hospitalier',
        ],
        body: [
          'L’étude préalable de votre imagerie permet à l’équipe de vous indiquer ce que le traitement impliquera probablement et comment organiser votre séjour. Elle ne remplace pas un examen : le plan définitif est rédigé après votre consultation.',
        ],
      },
      {
        heading: 'Quelle durée prévoir',
        body: [
          'Tout dépend du traitement. Une consultation avec imagerie tient en une visite. Les implants se font généralement par étapes, avec plusieurs mois de cicatrisation entre la pose de l’implant et celle de la dent définitive ; la plupart des patients qui se déplacent font donc deux voyages ou plus.',
          'Après une chirurgie sous anesthésie générale, vous devez rester au Caire jusqu’à ce que votre chirurgien soit satisfait du début de la cicatrisation ; cette durée est précisée dans votre plan écrit. Ne réservez pas votre vol de retour avant qu’elle n’ait été convenue.',
        ],
      },
      {
        heading: 'Se rendre à la clinique',
        body: [
          'La clinique se trouve au {address}, dans le quartier d’Al Golf, à la limite de Nasr City et d’Héliopolis, à un court trajet en voiture de l’aéroport international du Caire. Les opérations qui nécessitent un bloc opératoire sont réalisées dans les hôpitaux où le cabinet fait admettre ses patients.',
        ],
      },
    ],
    steps: [
      { name: 'Envoyez votre imagerie', text: 'Radiographies ou scanner sur WhatsApp, avec vos questions.' },
      { name: 'Consultation au Caire', text: 'Examen clinique, imagerie complémentaire éventuelle et plan écrit.' },
      { name: 'Traitement', text: 'À la clinique, ou à l’hôpital pour les interventions au bloc opératoire.' },
      { name: 'Suivi', text: 'Des contrôles avant votre départ, puis un contact maintenu avec l’équipe.' },
    ],
    faqs: [
      {
        q: 'Puis-je obtenir un plan de traitement avant de partir en Égypte ?',
        a: 'Vous pouvez obtenir un avis préliminaire. Envoyez vos radiographies ou votre scanner sur WhatsApp au {phone} : l’équipe vous indiquera le traitement probable et le nombre de visites à prévoir. Le plan définitif est rédigé après un examen à la clinique.',
      },
      {
        q: 'Combien de voyages faut-il prévoir pour des implants dentaires ?',
        a: 'En général deux ou plus. L’implant est posé lors du premier voyage et la dent définitive est mise en place une fois l’os cicatrisé autour de lui, le plus souvent trois à six mois plus tard. La possibilité de poser une dent provisoire dans l’intervalle dépend de votre cas.',
      },
      {
        q: 'Combien de temps rester au Caire après une chirurgie de la mâchoire ?',
        a: 'Assez longtemps pour que votre chirurgien puisse contrôler le début de la cicatrisation — cette durée est propre à chaque patient et figure dans votre plan avant l’opération. Ne réservez pas votre vol de retour tant qu’elle n’a pas été convenue.',
      },
      {
        q: 'Quelles langues parle-t-on à la clinique ?',
        a: 'Les consultations se déroulent en arabe ou en anglais, et les plans écrits peuvent être fournis dans l’une ou l’autre de ces langues.',
      },
      {
        q: 'Où se trouve la clinique ?',
        a: '{clinic} se trouve au {address}. La clinique est située dans le quartier d’Al Golf, entre Nasr City et Héliopolis, près de l’aéroport international du Caire.',
      },
    ],
  },
} satisfies Partial<Record<string, ContentCopy>>
