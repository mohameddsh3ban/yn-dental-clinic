import type { ContentCopy } from './types'

/**
 * French copy for the implant, restorative and cosmetic pages. A faithful
 * translation of `en-dental.ts`: same keys, same number of items, no added
 * claims.
 * `{clinic}`, `{address}` and `{phone}` are filled in `./index.ts`.
 */
export const frDental = {
  'dental-implants': {
    nav: 'Implants dentaires',
    blurb: 'Remplacer une dent, plusieurs dents ou une arcade complète',
    h1: 'Implants dentaires à Nasr City, au Caire',
    metaTitle: 'Implants dentaires à Nasr City, Le Caire | Ozea Dental Clinic',
    metaDescription:
      'Implants dentaires à Nasr City, au Caire, posés par un chirurgien maxillo-facial. Planification sur scanner, plan écrit remis, d’une dent à l’arcade complète.',
    eyebrow: 'Implantologie',
    answer:
      'Un implant dentaire est une petite vis en titane placée dans l’os de la mâchoire pour remplacer la racine d’une dent manquante ; on y fixe ensuite une couronne, un bridge ou une arcade complète de dents. Chez {clinic}, à Nasr City, au Caire, les implants sont planifiés à partir d’un scanner et posés par le Dr Youssef Nasser, chirurgien oral et maxillo-facial, le plus souvent sous anesthésie locale. L’os met environ trois à six mois à se souder à l’implant avant la pose de la dent définitive.',
    facts: [
      { label: 'Remplace', value: 'Une dent, plusieurs dents ou une arcade complète' },
      { label: 'Anesthésie', value: 'Locale, dans la plupart des cas' },
      { label: 'Cicatrisation osseuse', value: 'En général 3 à 6 mois' },
      { label: 'Chirurgien', value: 'Dr Youssef Nasser' },
    ],
    sections: [
      {
        heading: 'À qui s’adressent les implants',
        body: [
          'Les implants conviennent aux adultes qui ont perdu une ou plusieurs dents et souhaitent un remplacement fixe qui ne s’appuie pas sur les dents voisines, ou qui veulent qu’une prothèse amovible instable soit maintenue fermement en place.',
          'Il faut des gencives saines et suffisamment d’os pour maintenir l’implant. Lorsque l’os s’est résorbé après une extraction, il peut souvent être reconstruit au préalable par une greffe osseuse ou un sinus lift (comblement sinusien). Le tabac et un diabète mal équilibré ralentissent la cicatrisation et augmentent le risque d’échec ; ils sont donc abordés avant toute planification.',
        ],
      },
      {
        heading: 'Pourquoi un chirurgien et un scanner',
        body: [
          'Un implant doit être logé dans l’os, à distance du nerf de la mâchoire inférieure et du sinus situé au-dessus des dents du fond de la mâchoire supérieure. Le scanner montre la hauteur et la largeur de l’os en trois dimensions ; la taille et la position de chaque implant sont ainsi décidées avant l’intervention, et non pendant.',
          'Les cas complexes — os mince, sites proches du nerf ou du sinus, échec d’implants antérieurs, reconstruction d’une arcade complète — font partie du travail courant d’un chirurgien maxillo-facial.',
        ],
      },
      {
        heading: 'À quoi s’attendre ensuite',
        body: [
          'Un léger gonflement et une sensibilité pendant quelques jours sont normaux et se maîtrisent avec des antalgiques courants. Privilégiez une alimentation molle de ce côté, gardez la zone propre selon les consignes reçues et évitez de fumer pendant la cicatrisation.',
          'Avec un nettoyage quotidien et des contrôles réguliers, un implant peut durer des décennies. La couronne qui le surmonte subit l’usure et peut devoir être remplacée avec le temps.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation et scanner', text: 'Examen clinique, antécédents médicaux et imagerie de l’os en trois dimensions.' },
      { name: 'Plan écrit', text: 'Le nombre d’implants, leur emplacement, les greffes éventuellement nécessaires et le calendrier.' },
      { name: 'Pose', text: 'L’implant est posé sous anesthésie locale, généralement en moins d’une heure par site.' },
      { name: 'Cicatrisation', text: 'Trois à six mois pour que l’os se soude à l’implant.' },
      { name: 'Dent définitive', text: 'Une empreinte ou un scan numérique, puis la pose de la couronne ou du bridge.' },
    ],
    faqs: [
      {
        q: 'La pose d’un implant dentaire est-elle douloureuse ?',
        a: 'La pose se fait sous anesthésie locale : vous devriez sentir une pression, mais pas de douleur. La plupart des personnes décrivent les jours suivants comme moins douloureux qu’après une extraction dentaire, la gêne étant soulagée par des antalgiques courants.',
      },
      {
        q: 'Quelle est la durée de vie d’un implant dentaire ?',
        a: 'Avec une bonne hygiène et des contrôles réguliers, les implants durent couramment 20 ans ou plus ; les études à long terme rapportent que bien plus de 90 % d’entre eux sont toujours en place après dix ans. La couronne peut devoir être remplacée plus tôt, car c’est elle qui subit l’usure.',
      },
      {
        q: 'Combien de temps dure un traitement implantaire complet ?',
        a: 'Le plus souvent, trois à six mois entre la pose et la dent définitive, car l’os a besoin de temps pour se souder à l’implant. Le délai est plus long si une greffe osseuse est nécessaire au préalable.',
      },
      {
        q: 'Peut-on poser un implant dentaire quand on n’a pas assez d’os ?',
        a: 'Souvent, oui. L’os peut être reconstruit par une greffe, ou par un sinus lift (comblement sinusien) au fond de la mâchoire supérieure, avant la pose de l’implant ou en même temps. Le scanner montre quelle solution est nécessaire.',
      },
      {
        q: 'Peut-on avoir une dent le jour même de la pose de l’implant ?',
        a: 'Dans certains cas bien sélectionnés, une dent provisoire peut être fixée le jour même, principalement pour les dents de devant et les arcades complètes lorsque l’os est de bonne qualité. C’est votre scanner qui permet de décider si cela est sûr dans votre cas.',
      },
      {
        q: 'Quel est le prix d’un implant dentaire au Caire ?',
        a: 'Il dépend du nombre d’implants, du système implantaire, de la nécessité éventuelle d’une greffe osseuse et du type de dent fixée dessus. Les honoraires vous sont communiqués en consultation, une fois votre scanner étudié et avant toute programmation.',
      },
      {
        q: 'Comment prendre rendez-vous pour une consultation d’implantologie ?',
        a: 'Écrivez à {clinic} sur WhatsApp au {phone}. Apportez vos radiographies récentes, ou envoyez-les à l’avance.',
      },
    ],
  },

  'full-arch-implants': {
    nav: 'Arcade complète sur implants',
    blurb: 'Des dents fixes sur quatre à six implants',
    h1: 'Implants dentaires pour arcade complète au Caire',
    metaTitle: 'Arcade complète sur implants, dents fixes – Le Caire | Ozea',
    metaDescription:
      'Bridge fixe d’arcade complète sur 4 à 6 implants au Caire, pour mâchoire édentée ou dents condamnées. Planifié sur scanner par un chirurgien maxillo-facial.',
    eyebrow: 'Réhabilitation d’arcade complète',
    answer:
      'Le traitement d’une arcade complète sur implants remplace toutes les dents d’une mâchoire par un bridge fixe soutenu par quatre à six implants, une approche souvent appelée All-on-4 ou All-on-6. Il s’adresse aux personnes qui ont perdu toutes leurs dents ou la plupart d’entre elles, ou dont les dents restantes ne peuvent pas être sauvées. Chez {clinic}, au Caire, les réhabilitations d’arcade complète sont planifiées à partir d’un scanner et réalisées par le Dr Youssef Nasser, chirurgien oral et maxillo-facial.',
    facts: [
      { label: 'Implants par mâchoire', value: 'En général 4 à 6' },
      { label: 'Résultat', value: 'Un bridge fixe — non amovible' },
      { label: 'Dents provisoires', value: 'Souvent posées en quelques jours' },
      { label: 'Bridge définitif', value: 'Après 3 à 6 mois de cicatrisation' },
    ],
    sections: [
      {
        heading: 'À qui il s’adresse',
        list: [
          'Les personnes qui n’ont plus aucune dent sur une mâchoire ou sur les deux',
          'Les personnes dont les dents restantes sont mobiles ou condamnées par une maladie des gencives ou par des caries',
          'Les porteurs de prothèse amovible (dentier) qui veulent des dents qui restent en place',
          'Les personnes à qui il faudrait, sinon, un implant pour chaque dent manquante',
        ],
      },
      {
        heading: 'Comment cela fonctionne',
        body: [
          'Quatre à six implants sont posés là où l’os est le plus solide, parfois inclinés pour éviter le sinus ou le nerf et limiter le recours à une greffe. Les dents condamnées sont extraites lors de la même séance.',
          'Lorsque les implants sont suffisamment stables, un bridge provisoire fixe est mis en place en quelques jours, afin que vous ne restiez pas sans dents. Une fois l’os cicatrisé, le provisoire est remplacé par le bridge définitif, réalisé selon la forme et la teinte convenues avec vous.',
        ],
      },
      {
        heading: 'Vivre avec un bridge complet',
        body: [
          'Le bridge est fixé en place et seul le dentiste peut le retirer. Il se nettoie chaque jour par-dessous, à l’aide d’un jet dentaire (hydropulseur) ou de brossettes spéciales, et fait l’objet de contrôles professionnels à intervalles réguliers.',
          'Une alimentation molle est nécessaire pendant la cicatrisation des implants. Une fois le bridge définitif posé, la plupart des personnes mangent normalement.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation et scanner', text: 'Évaluation de l’os, de l’occlusion et de la ligne du sourire ; explication des options.' },
      { name: 'Plan écrit', text: 'Nombre et position des implants, type de bridge, calendrier.' },
      { name: 'Chirurgie', text: 'Extractions si nécessaire et pose des implants en une seule séance.' },
      { name: 'Bridge provisoire', text: 'Des dents fixes pendant la période de cicatrisation, lorsque la stabilité le permet.' },
      { name: 'Bridge définitif', text: 'Posé après trois à six mois, puis entretien régulier.' },
    ],
    faqs: [
      {
        q: 'Quelle est la différence entre All-on-4 et All-on-6 ?',
        a: 'Le nombre d’implants qui soutiennent le bridge. Quatre suffisent pour de nombreuses mâchoires inférieures et pour les mâchoires supérieures dont l’os est de bonne qualité ; six répartissent davantage les charges et sont souvent retenus pour la mâchoire supérieure ou pour un os moins dense. Le choix se fait à partir de votre scanner.',
      },
      {
        q: 'Vais-je rester sans dents pendant la cicatrisation des implants ?',
        a: 'En général, non. Lorsque les implants sont stables le jour de l’intervention, un bridge provisoire fixe est mis en place en quelques jours. Si l’os est trop peu dense pour cela, une prothèse provisoire amovible est portée jusqu’à la cicatrisation des implants.',
      },
      {
        q: 'Un bridge complet sur implants est-il préférable à un dentier ?',
        a: 'Il est fixe, ne recouvre pas le palais, ne bouge pas lorsque vous mangez ou parlez et contribue à préserver l’os de la mâchoire. Il nécessite une chirurgie, suffisamment d’os et un budget plus élevé, et doit être nettoyé soigneusement chaque jour.',
      },
      {
        q: 'Quelle est la durée de vie d’un bridge complet sur implants ?',
        a: 'Bien entretenus, les implants peuvent durer des décennies. Le bridge, lui, est soumis à l’usure ; ses dents peuvent s’ébrécher et nécessiter une réparation ou un remplacement au bout de dix à quinze ans, selon le matériau.',
      },
      {
        q: 'La pose peut-elle se faire sous anesthésie générale ?',
        a: 'Oui. La plupart des interventions se font sous anesthésie locale, avec ou sans sédation. Les interventions plus longues, le traitement des deux mâchoires en une fois ou les patients anxieux peuvent être pris en charge sous anesthésie générale, à l’hôpital.',
      },
    ],
  },

  'bone-grafting-sinus-lift': {
    nav: 'Greffe osseuse et sinus lift',
    blurb: 'Reconstruire l’os pour permettre la pose d’un implant',
    h1: 'Greffe osseuse et sinus lift pour implants dentaires au Caire',
    metaTitle: 'Greffe osseuse et sinus lift – Le Caire | Ozea Dental Clinic',
    metaDescription:
      'Pas assez d’os pour un implant ? Greffe osseuse et sinus lift (comblement sinusien) au Caire, planifiés sur scanner par un chirurgien oral et maxillo-facial.',
    eyebrow: 'Préparation du site implantaire',
    answer:
      'La greffe osseuse reconstruit l’os de la mâchoire qui s’est résorbé après la perte d’une dent, afin que l’implant dispose d’assez d’os pour être maintenu. Le sinus lift, ou comblement sinusien, est une greffe osseuse placée sous le plancher du sinus, au-dessus des dents du fond de la mâchoire supérieure. Chez {clinic}, au Caire, les deux sont planifiés à partir d’un scanner et réalisés par le Dr Youssef Nasser, chirurgien oral et maxillo-facial, souvent lors de la même séance que la pose de l’implant.',
    facts: [
      { label: 'Objectif', value: 'Assez d’os pour maintenir un implant' },
      { label: 'Anesthésie', value: 'Locale, dans la plupart des cas' },
      { label: 'Cicatrisation de la greffe', value: 'Environ 4 à 9 mois' },
      { label: 'Planification', value: 'À partir d’un scanner' },
    ],
    sections: [
      {
        heading: 'Pourquoi l’os se perd',
        body: [
          'L’os de la mâchoire est maintenu par les dents qu’il porte. Après une extraction, l’os qui entoure l’alvéole se résorbe, pour l’essentiel au cours de la première année. Les maladies des gencives, les infections, les traumatismes et le port prolongé d’une prothèse amovible aggravent cette perte.',
          'Au fond de la mâchoire supérieure, le sinus s’étend en outre vers le bas après la perte des dents, ne laissant sous lui qu’une fine couche d’os.',
        ],
      },
      {
        heading: 'Les types de greffe',
        list: [
          'Préservation alvéolaire — un matériau de greffe placé au moment de l’extraction pour conserver la crête osseuse',
          'Régénération osseuse guidée — une greffe et une membrane pour élargir ou rehausser une crête mince',
          'Sinus lift (comblement sinusien) — de l’os ajouté sous la membrane du sinus, par le côté de la mâchoire ou par le site de l’implant',
          'Greffe en bloc — un fragment de votre propre os, utilisé pour les pertes osseuses plus importantes',
        ],
        body: [
          'Le greffon peut être votre propre os, un os traité provenant d’un donneur ou d’origine animale, ou un substitut synthétique. Le matériau retenu, et la raison de ce choix, sont précisés dans votre plan écrit.',
        ],
      },
      {
        heading: 'Suites opératoires',
        body: [
          'Un gonflement et des ecchymoses pendant plusieurs jours sont normaux. Après un sinus lift, évitez de vous moucher et éternuez la bouche ouverte pendant environ deux semaines.',
          'La greffe se transforme en os en quatre à neuf mois. Les petites greffes sont souvent réalisées en même temps que la pose de l’implant ; les plus importantes sont d’abord laissées à cicatriser.',
        ],
      },
    ],
    steps: [
      { name: 'Scanner', text: 'Il mesure la hauteur et la largeur de l’os à chaque site implantaire.' },
      { name: 'Plan écrit', text: 'La nécessité ou non d’une greffe, son type, et le moment où l’implant sera posé.' },
      { name: 'Greffe', text: 'Sous anesthésie locale, avec ou sans pose de l’implant lors de la même séance.' },
      { name: 'Cicatrisation et implant', text: 'Un scanner de contrôle confirme la formation d’os nouveau avant l’étape suivante.' },
    ],
    faqs: [
      {
        q: 'Comment savoir si j’ai besoin d’une greffe osseuse dentaire ?',
        a: 'Grâce à un scanner. Il mesure l’os au niveau du site implantaire en trois dimensions. Si la hauteur ou la largeur ne suffit pas à entourer un implant, une greffe est recommandée.',
      },
      {
        q: 'Le sinus lift est-il une opération lourde ?',
        a: 'Non. C’est une intervention courante pour un chirurgien maxillo-facial, réalisée sous anesthésie locale et qui dure généralement moins d’une heure. Vous rentrez chez vous le jour même.',
      },
      {
        q: 'D’où vient l’os utilisé pour une greffe osseuse dentaire ?',
        a: 'De votre propre mâchoire, d’un os traité provenant d’un donneur ou d’origine bovine, ou d’un substitut synthétique. Toutes ces options sont éprouvées ; le choix dépend de l’étendue de la perte osseuse et vous est expliqué avant le traitement.',
      },
      {
        q: 'Peut-on poser l’implant en même temps que la greffe osseuse ?',
        a: 'Souvent, lorsque l’os existant suffit à stabiliser l’implant. Dans le cas contraire, on laisse la greffe cicatriser pendant quatre à neuf mois, puis l’implant est posé.',
      },
      {
        q: 'La greffe osseuse dentaire est-elle douloureuse ?',
        a: 'Elle se fait sous anesthésie locale. Ensuite, attendez-vous à un gonflement et à des douleurs pendant plusieurs jours, généralement bien maîtrisés par des antalgiques courants.',
      },
    ],
  },

  veneers: {
    nav: 'Facettes et design du sourire',
    blurb: 'Facettes en porcelaine et en composite, planifiées au préalable',
    h1: 'Facettes dentaires et design du sourire à Nasr City, au Caire',
    metaTitle: 'Facettes dentaires, design du sourire – Le Caire | Ozea',
    metaDescription:
      'Facettes en porcelaine et en composite à Nasr City, au Caire. Teinte et forme validées sur maquette avant toute préparation, en retirant un minimum de dent.',
    eyebrow: 'Dentisterie esthétique',
    answer:
      'Une facette est une fine coque en céramique ou en composite collée sur la face avant d’une dent pour en modifier la couleur, la forme ou l’alignement. Chez {clinic}, à Nasr City, au Caire, les facettes et les projets de design du sourire sont réalisés par la Dr Sara Sameh, dentiste en esthétique et restauration dentaires. La teinte, la forme et les proportions sont convenues avec vous sur une maquette (mock-up) avant toute préparation d’une dent, et l’option qui retire le moins de tissu dentaire est toujours envisagée en premier.',
    facts: [
      { label: 'Facettes en porcelaine', value: 'En général 2 à 3 séances' },
      { label: 'Facettes en composite', value: 'Souvent une seule séance' },
      { label: 'Durée de vie habituelle', value: 'Porcelaine 10–15 ans · composite 5–7' },
      { label: 'Dentiste', value: 'Dr Sara Sameh' },
    ],
    sections: [
      {
        heading: 'Porcelaine ou composite ?',
        body: [
          'Les facettes en porcelaine (céramique) sont fabriquées en laboratoire à partir d’une empreinte ou d’un scan numérique. Elles conservent leur couleur et leur brillant, résistent aux taches et durent habituellement dix à quinze ans. Une fine couche d’émail — généralement une fraction de millimètre — est retirée pour qu’elles s’ajustent sans surépaisseur, ce qui les rend irréversibles.',
          'Les facettes en composite sont sculptées directement sur la dent, dans une résine de la teinte de la dent, le plus souvent en une séance et souvent sans fraisage. Elles coûtent moins cher et se réparent facilement, mais se tachent et s’usent plus vite.',
        ],
      },
      {
        heading: 'Ce que les facettes peuvent changer',
        list: [
          'Des dents à la teinte altérée qui ne réagissent pas au blanchiment',
          'Des bords ébréchés, usés ou irréguliers',
          'De petits espaces entre les dents et un léger chevauchement',
          'Des dents trop petites ou de forme irrégulière',
          'D’anciennes obturations ou restaurations qui ont changé de couleur',
        ],
      },
      {
        heading: 'Quand les facettes ne sont pas la solution',
        body: [
          'Les maladies des gencives et les caries doivent être traitées d’abord. Un grincement de dents important, des dents auxquelles il reste peu d’émail ou des dents très mal alignées relèvent parfois plutôt d’une gouttière de nuit, de l’orthodontie ou de couronnes. Si un blanchiment ou un simple bonding (composite collé) suffisait à vous donner ce que vous recherchez, on vous le dira.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation et photographies', text: 'Ce que vous souhaitez changer, et ce qui est réalisable.' },
      { name: 'Projet et maquette', text: 'La teinte, la forme et les proportions prévisualisées sur vos propres dents.' },
      { name: 'Préparation', text: 'Une réduction minimale, une empreinte ou un scan numérique, et des facettes provisoires.' },
      { name: 'Pose et suivi', text: 'Collage des facettes, vérification de l’occlusion et visite de contrôle.' },
    ],
    faqs: [
      {
        q: 'Quelle est la durée de vie des facettes dentaires ?',
        a: 'Les facettes en porcelaine durent habituellement dix à quinze ans, et souvent davantage si elles sont bien entretenues. Les facettes en composite durent généralement cinq à sept ans avant de nécessiter un polissage, une réparation ou un remplacement.',
      },
      {
        q: 'Les facettes dentaires abîment-elles les dents ?',
        a: 'Les facettes en porcelaine exigent le retrait d’une fine couche d’émail ; la dent aura donc toujours besoin, par la suite, d’une facette ou d’un recouvrement équivalent. Lorsque la préparation est conservatrice et réalisée sur des dents saines, la dent sous-jacente reste saine. Les facettes en composite ne nécessitent souvent aucun retrait d’émail.',
      },
      {
        q: 'La pose de facettes dentaires est-elle douloureuse ?',
        a: 'La préparation se fait sous anesthésie locale et n’est pas douloureuse. Une certaine sensibilité au chaud et au froid pendant quelques jours est fréquente, puis disparaît.',
      },
      {
        q: 'Quelle est la différence entre une facette et une couronne ?',
        a: 'Une facette ne recouvre que la face avant de la dent et répond surtout à un objectif esthétique. Une couronne recouvre toute la dent et s’utilise lorsque celle-ci est cassée, largement obturée ou dévitalisée et doit être renforcée.',
      },
      {
        q: 'Peut-on voir le résultat des facettes avant de se décider ?',
        a: 'Oui. Une maquette (mock-up) est placée sur vos propres dents pour que vous puissiez voir et ajuster la forme proposée avant toute préparation d’une dent. Rien n’est préparé tant que le projet n’est pas validé.',
      },
      {
        q: 'Les facettes dentaires se tachent-elles ?',
        a: 'La porcelaine résiste très bien aux taches. Le composite, lui, se colore avec le temps au contact du café, du thé et du tabac, et gagne à être poli périodiquement.',
      },
    ],
  },

  'dental-crowns': {
    nav: 'Couronnes dentaires',
    blurb: 'Restaurer une dent cassée, usée ou dévitalisée',
    h1: 'Couronnes dentaires à Nasr City, au Caire',
    metaTitle: 'Couronne dentaire zircone, céramique – Nasr City, Le Caire | Ozea',
    metaDescription:
      'Couronnes en zircone et en céramique à Nasr City, au Caire, pour dents cassées, très obturées ou dévitalisées. Teinte assortie, en deux séances en général.',
    eyebrow: 'Dentisterie restauratrice',
    answer:
      'Une couronne dentaire est une coiffe qui recouvre toute la partie visible d’une dent pour lui rendre sa forme, sa solidité et son aspect. Elle s’utilise pour les dents cassées, largement obturées, usées ou dévitalisées, et constitue aussi la partie visible d’un implant dentaire. Chez {clinic}, à Nasr City, au Caire, les couronnes sont réalisées en céramique ou en zircone, assorties à la teinte de vos propres dents et généralement posées en deux séances.',
    facts: [
      { label: 'Séances', value: 'En général deux' },
      { label: 'Matériaux', value: 'Zircone, tout céramique, céramo-métallique' },
      { label: 'Durée de vie habituelle', value: '10 à 15 ans ou plus' },
      { label: 'Anesthésie', value: 'Locale' },
    ],
    sections: [
      {
        heading: 'Quand une couronne est nécessaire',
        list: [
          'Une dent portant une obturation volumineuse et dont il reste peu de tissu naturel',
          'Une dent fissurée ou cassée',
          'Une dent du fond après un traitement de canal',
          'Une dent usée par le grincement ou par l’acidité',
          'Sur un implant dentaire, ou comme pilier d’un bridge',
        ],
      },
      {
        heading: 'Le choix du matériau',
        body: [
          'La zircone est très résistante et convient aux dents du fond et aux personnes qui grincent des dents. Les couronnes tout céramique, comme celles en disilicate de lithium, sont les plus naturelles d’aspect et sont généralement retenues pour les dents de devant. La couronne céramo-métallique est une solution éprouvée de longue date, qui reste utile dans certaines situations.',
          'Le choix dépend de l’emplacement de la dent, de l’espace disponible et de la force de votre morsure — il vous est expliqué avant la préparation de la dent.',
        ],
      },
      {
        heading: 'Entretenir une couronne',
        body: [
          'Une couronne ne peut pas se carier, mais la dent qu’elle recouvre le peut, au niveau du bord où la couronne rejoint la gencive. Brossez-vous les dents et nettoyez les espaces interdentaires comme d’habitude, et venez régulièrement en contrôle. Si vous grincez des dents la nuit, une gouttière protège la couronne et les dents qui lui font face.',
        ],
      },
    ],
    steps: [
      { name: 'Bilan', text: 'Examen clinique et radiographie pour vérifier la racine et l’os qui l’entoure.' },
      { name: 'Préparation', text: 'La dent est taillée, une empreinte ou un scan numérique est réalisé, une couronne provisoire est posée.' },
      { name: 'Laboratoire', text: 'La couronne est fabriquée selon la teinte et la forme convenues.' },
      { name: 'Pose', text: 'La couronne est essayée, ajustée puis scellée.' },
    ],
    faqs: [
      {
        q: 'Quelle est la durée de vie d’une couronne dentaire ?',
        a: 'Couramment dix à quinze ans, et souvent davantage avec une bonne hygiène bucco-dentaire et des contrôles réguliers. Les échecs tiennent surtout à une carie au niveau du bord de la couronne ou à une fracture sous l’effet d’un grincement de dents important.',
      },
      {
        q: 'Faut-il dévitaliser une dent avant de poser une couronne ?',
        a: 'Pas nécessairement. Une dent dont le nerf est sain peut être couronnée telle quelle. Un traitement de canal (dévitalisation) n’est nécessaire au préalable que si le nerf est enflammé, infecté ou exposé.',
      },
      {
        q: 'La pose d’une couronne dentaire est-elle douloureuse ?',
        a: 'La dent est insensibilisée par une anesthésie locale ; la préparation se déroule donc confortablement. Une légère sensibilité, ou une gencive un peu douloureuse pendant quelques jours, est normale.',
      },
      {
        q: 'Couronne en zircone ou en céramique : laquelle est la meilleure ?',
        a: 'Aucune n’est meilleure dans tous les cas. La zircone est plus résistante et convient aux dents du fond ; les couronnes tout céramique sont plus translucides et conviennent aux dents de devant. De nombreuses couronnes associent une armature résistante à une surface d’aspect naturel.',
      },
      {
        q: 'Couronne ou facette : que me faut-il ?',
        a: 'Une facette ne recouvre que la face avant d’une dent saine, pour en modifier l’aspect. Une couronne recouvre la dent entière et est retenue lorsque la dent est fragilisée, cassée ou dévitalisée.',
      },
    ],
  },

  'root-canal-treatment': {
    nav: 'Traitement de canal',
    blurb: 'Sauver une dent dont le nerf est infecté ou enflammé',
    h1: 'Traitement de canal (dévitalisation) à Nasr City, au Caire',
    metaTitle: 'Traitement de canal, dévitalisation – Nasr City, Le Caire | Ozea',
    metaDescription:
      'Traitement de canal (endodontie) à Nasr City, au Caire, pour soulager le mal de dents et sauver une dent infectée. Anesthésie locale, souvent 1 ou 2 séances.',
    eyebrow: 'Endodontie',
    answer:
      'Le traitement de canal, ou dévitalisation, consiste à retirer la pulpe enflammée ou infectée — le nerf et les vaisseaux sanguins — de l’intérieur d’une dent, puis à nettoyer, désinfecter et obturer les canaux de la racine. Il soulage la douleur et sauve une dent qui, sans cela, devrait être extraite. Chez {clinic}, à Nasr City, au Caire, il est réalisé sous anesthésie locale, généralement en une ou deux séances, et la dent est ensuite restaurée par une obturation ou une couronne.',
    facts: [
      { label: 'Séances', value: 'En général une ou deux' },
      { label: 'Anesthésie', value: 'Locale' },
      { label: 'Ensuite', value: 'Une couronne, sur la plupart des dents du fond' },
      { label: 'Objectif', value: 'Conserver votre dent naturelle' },
    ],
    sections: [
      {
        heading: 'Signes pouvant indiquer la nécessité d’un traitement de canal',
        list: [
          'Une douleur dentaire qui persiste après le chaud ou le froid, ou qui survient spontanément',
          'Une douleur qui vous réveille la nuit',
          'Une douleur à la morsure, ou une dent qui semble plus haute que les autres',
          'Un gonflement ou un petit bouton sur la gencive près de la dent',
          'Une dent qui a foncé après un choc',
        ],
        body: [
          'Certaines dents infectées ne provoquent aucune douleur et sont découvertes sur une radiographie. Les antibiotiques peuvent calmer un gonflement pendant un temps, mais n’éliminent pas l’infection à l’intérieur de la dent.',
        ],
      },
      {
        heading: 'Comment se déroule le traitement',
        body: [
          'La dent est anesthésiée et isolée. Une petite ouverture est pratiquée à travers la face de mastication ; les canaux sont repérés, mesurés, nettoyés et mis en forme, puis désinfectés et obturés à l’aide d’un matériau de scellement.',
          'Une dent qui a subi un traitement de canal est plus fragile qu’une dent vivante. Les dents du fond sont généralement protégées ensuite par une couronne, afin d’éviter qu’elles ne se fracturent.',
        ],
      },
    ],
    steps: [
      { name: 'Diagnostic', text: 'Examen clinique, tests et radiographie pour confirmer quelle dent est en cause, et pourquoi.' },
      { name: 'Nettoyage et mise en forme', text: 'Sous anesthésie locale ; les canaux sont nettoyés et désinfectés.' },
      { name: 'Obturation des canaux', text: 'Les canaux sont obturés, lors de la même séance ou d’une seconde.' },
      { name: 'Restauration', text: 'Une obturation définitive ou une couronne pour protéger la dent.' },
    ],
    faqs: [
      {
        q: 'Une dévitalisation fait-elle mal ?',
        a: 'Avec les anesthésies locales modernes, la sensation devrait être proche de celle d’un soin de carie classique. Le traitement supprime la source de la douleur ; la dent peut rester sensible à la morsure pendant quelques jours.',
      },
      {
        q: 'Combien de séances faut-il pour un traitement de canal ?',
        a: 'En général une ou deux, d’environ une heure chacune. Les dents à plusieurs canaux, ou présentant une infection active, ont plus de chances de nécessiter la seconde séance.',
      },
      {
        q: 'Vaut-il mieux dévitaliser ou arracher la dent ?',
        a: 'Conserver votre propre dent est généralement la meilleure option lorsqu’elle peut être restaurée. L’extraction laisse un espace qu’il faut ensuite combler par un implant ou un bridge, pour éviter que les dents voisines ne se déplacent.',
      },
      {
        q: 'Faut-il une couronne après une dévitalisation ?',
        a: 'Pour la plupart des dents du fond, oui — la couronne protège la dent du risque de fracture. Les dents de devant peu abîmées peuvent souvent être restaurées par une simple obturation.',
      },
      {
        q: 'Combien de temps dure une dent dévitalisée ?',
        a: 'Correctement traitée et restaurée, elle peut durer aussi longtemps que vos autres dents. Le succès dépend du nettoyage minutieux des canaux et de la bonne étanchéité de la dent par la suite.',
      },
      {
        q: 'Les antibiotiques peuvent-ils guérir une infection dentaire ?',
        a: 'Non. Ils peuvent réduire le gonflement et empêcher l’infection de s’étendre, mais ils n’atteignent pas le tissu mort à l’intérieur de la dent. L’infection revient, à moins que la dent ne soit dévitalisée ou extraite.',
      },
    ],
  },

  'teeth-whitening': {
    nav: 'Blanchiment dentaire',
    blurb: 'Blanchiment à la clinique et à domicile sous supervision',
    h1: 'Blanchiment dentaire professionnel à Nasr City, au Caire',
    metaTitle: 'Blanchiment dentaire à Nasr City, Le Caire | Ozea Dental Clinic',
    metaDescription:
      'Blanchiment dentaire professionnel à Nasr City, au Caire : à la clinique ou à domicile sous contrôle du dentiste, après un examen vérifiant qu’il vous convient.',
    eyebrow: 'Dentisterie esthétique',
    answer:
      'Le blanchiment dentaire professionnel éclaircit la couleur naturelle des dents à l’aide d’un gel au peroxyde, soit appliqué à la clinique en une heure environ, soit porté à domicile dans des gouttières sur mesure, sous la supervision d’un dentiste. Chez {clinic}, à Nasr City, au Caire, le blanchiment est réalisé par la Dr Sara Sameh, après un examen visant à vérifier que vos dents et vos gencives sont saines et que le blanchiment apportera le changement que vous souhaitez.',
    facts: [
      { label: 'Séance à la clinique', value: 'Environ une heure' },
      { label: 'Blanchiment à domicile', value: 'En général 1 à 2 semaines' },
      { label: 'Durée du résultat', value: 'Environ 1 à 3 ans' },
      { label: 'Dentiste', value: 'Dr Sara Sameh' },
    ],
    sections: [
      {
        heading: 'À la clinique ou à domicile',
        body: [
          'Le blanchiment à la clinique utilise un gel plus concentré, appliqué par le dentiste après protection des gencives, et donne un changement visible en une séance.',
          'Le blanchiment à domicile utilise un gel moins concentré, dans des gouttières fabriquées aux dimensions de vos dents et portées chaque jour pendant une à deux semaines. Il est plus doux, plus facile à entretenir par la suite et donne souvent le résultat le plus homogène. Les deux méthodes sont fréquemment associées.',
        ],
      },
      {
        heading: 'Ce que le blanchiment ne peut pas faire',
        body: [
          'Le blanchiment n’agit que sur l’émail naturel. Les couronnes, les facettes et les obturations ne changent pas de couleur ; celles qui sont visibles peuvent donc devoir être remplacées ensuite pour s’harmoniser avec la nouvelle teinte.',
          'Les colorations grises ou en bandes, comme celles que provoquent certains médicaments pris pendant l’enfance, répondent mal au blanchiment. Une dent isolée devenue sombre après un choc nécessite généralement un autre traitement. Dans ces cas, on envisage plutôt un bonding ou des facettes.',
        ],
      },
      {
        heading: 'Est-ce sans danger ?',
        body: [
          'Utilisé selon les indications d’un dentiste, le blanchiment n’abîme pas l’émail. Une sensibilité passagère au froid et une légère irritation des gencives sont les effets secondaires courants ; ils disparaissent en quelques jours. Les caries et les maladies des gencives sont traitées au préalable, et le blanchiment n’est pas pratiqué pendant la grossesse.',
        ],
      },
    ],
    steps: [
      { name: 'Examen', text: 'Contrôle des dents et des gencives ; identification de la cause de la coloration.' },
      { name: 'Relevé de teinte', text: 'Votre teinte de départ est enregistrée afin de pouvoir mesurer le changement.' },
      { name: 'Blanchiment', text: 'À la clinique, à domicile dans des gouttières sur mesure, ou les deux.' },
      { name: 'Contrôle', text: 'Le résultat est vérifié, avec des conseils pour le conserver.' },
    ],
    faqs: [
      {
        q: 'Combien de temps dure un blanchiment dentaire ?',
        a: 'Habituellement un à trois ans, selon l’alimentation et le tabagisme. Le café, le thé, le vin rouge et le tabac font revenir les colorations plus vite ; une séance d’entretien occasionnelle avec les gouttières à domicile permet de conserver la teinte.',
      },
      {
        q: 'Le blanchiment dentaire abîme-t-il l’émail ?',
        a: 'Non, pas lorsqu’il est prescrit et supervisé par un dentiste. Le gel éclaircit les pigments présents dans la dent sans retirer d’émail.',
      },
      {
        q: 'Le blanchiment rend-il les dents sensibles ?',
        a: 'Une certaine sensibilité au froid pendant le traitement et peu après est fréquente et passagère. Un dentifrice désensibilisant et l’espacement des séances suffisent généralement à la maîtriser.',
      },
      {
        q: 'Le blanchiment agit-il sur les couronnes, les facettes ou les plombages ?',
        a: 'Non. Seul le tissu dentaire naturel change de couleur. Les restaurations visibles lorsque vous souriez peuvent devoir être remplacées ensuite pour s’accorder à la nouvelle teinte.',
      },
      {
        q: 'Blanchiment ou facettes : que choisir ?',
        a: 'Si la forme de vos dents vous convient et que seule la couleur vous gêne, le blanchiment est le choix conservateur. Les facettes sont envisagées lorsqu’il faut aussi modifier la forme, les bords ou une coloration qui ne s’éclaircit pas.',
      },
    ],
  },
} satisfies Partial<Record<string, ContentCopy>>
