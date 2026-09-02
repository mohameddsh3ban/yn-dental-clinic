/**
 * English copy — the source of truth for every translatable string on the site.
 *
 * `ar.ts` is typed against this object, so a key added here fails the build
 * until the Arabic side has one too. Structural data that is not language
 * dependent (image paths, slugs, phone numbers, URLs) stays in `site.ts` and
 * `team.ts`; only words live here.
 */
export const en = {
  meta: {
    title: 'Ozea Dental Clinic — Dr. Youssef Nasser',
    description:
      'Ozea Dental Clinic — Dr. Youssef Nasser, dental implants and maxillofacial surgery in Nasr City, Cairo. Book on WhatsApp.',
  },

  site: {
    name: 'Ozea Dental Clinic',
    short: 'Ozea',
    doctor: 'Dr. Youssef Nasser',
    specialty: 'Dental Implants & Maxillofacial Surgery',
    dentalClinic: 'Dental Clinic',
    address: {
      street: '6 Mahmoud Ammar, Al Golf',
      city: 'Nasr City, Cairo Governorate',
      short: 'Nasr City, Cairo',
    },
    hours: { days: 'Every day', time: '24/7' },
    whatsappMessage:
      "Hello Dr. Youssef Nasser, I'd like to book an appointment at Ozea Dental Clinic.",
  },

  common: {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    googleMaps: 'Google Maps',
    /** The toggle is labelled with the language it switches TO. */
    otherLanguage: 'العربية',
    switchTo: 'Switch to Arabic',
    mainNav: 'Main',
    siteNav: 'Site',
    menu: 'Menu',
    closeMenu: 'Close menu',
    backToTop: 'Back to top',
  },

  nav: {
    home: 'Home',
    services: 'Our Services',
    cases: 'Cases',
    clinic: 'Our Clinic',
    hospitals: 'Hospitals',
    location: 'Location',
    contact: 'Contact',
    team: 'Our Team',
    testimonials: 'Testimonials',
  },

  hero: {
    eyebrow: 'Oral & Maxillofacial Surgery',
    headlineTop: 'Restoring facial',
    headlineOutlined: 'harmony',
    lead:
      'Jaw position, bite and profile are planned as one thing, because a face is read as one thing — never as parts. Every plan starts from imaging and measurement.',
    book: 'Book appointment',
    bookAria: 'Book appointment with {doctor} on WhatsApp',
    railLabel: 'How a case proceeds',
    rail: ['Consultation', 'Imaging', 'Written plan', 'Surgery'],
    figureAlt:
      'Line drawing of a face in profile with the skull, the jaws and both tooth rows shown through it, and a gold dental implant at a lower molar',
    annotations: { implant: 'Implant site', tmj: 'Jaw joint · TMJ' },
    today: 'Today',
    open: 'Open',
    clinic: 'Clinic',
    metaBlurb:
      'Implants, orthognathic and reconstructive surgery, planned from a CT scan and a written plan you keep.',
    illustrationNote:
      'Illustration — schematic line drawing, not a patient image and not a predicted result.',
    stats: [
      { value: '170', unit: '+', label: 'Performed\nsurgeries' },
      { value: '85', unit: '%', label: 'Satisfied\nclients' },
    ],
  },

  services: {
    eyebrow: 'Our Services',
    headlineTop: 'Discover our signature',
    headlineBottom: 'dental',
    headlineOutlined: 'services',
    lead:
      'Experience modern dental care delivered with comfort, precision, and attention to detail — in a calm, welcoming environment designed to make every visit stress-free.',
    reviews: 'Reviews',
    reviewsBlurb:
      'Discover delighted patient reviews about their comforting and satisfying dental care experience.',
    previous: 'Previous services',
    next: 'Next services',
    railLabel: 'Services',
    items: [
      { title: 'Cosmetic procedures', tag: 'Aesthetic' },
      { title: 'Dental crowns', tag: 'Restorative' },
      { title: 'Dental veneers', tag: 'Cosmetic' },
      { title: 'Composite veneer', tag: 'Single visit' },
      { title: 'Dental implants', tag: 'Surgical' },
      { title: 'maxillofacial & reconstruction', tag: 'Reconstructive' },
      { title: 'Endo treatments', tag: 'Root canal' },
      { title: 'TMJ surgeries', tag: 'Jaw joint' },
    ],
  },

  cases: {
    eyebrow: 'Cases',
    headlineTop: 'Before and',
    headlineOutlined: 'after',
    lead:
      'Photographs from cases treated at the clinic, as they were taken at the chair and on the bench. Each one names the procedure; none of them promises your result — that is decided at consultation, from your own imaging.',
    compare: {
      label: 'Featured case',
      title: 'Ceramic veneers, upper front teeth',
      body:
        'Discoloured older restorations on the upper front teeth, replaced with ceramic veneers. Drag the handle across the photograph to compare the two.',
      before: 'Before',
      after: 'After',
      handleAria: 'Compare before and after',
      hint: 'Drag to compare',
    },
    filters: {
      all: 'All',
      implants: 'Implants & full arch',
      restorative: 'Crowns & veneers',
      lab: 'Lab work',
    },
    filterAria: 'Filter cases',
    /** Keyed by slug — see `lib/cases.ts`. */
    items: {
      'full-arch-both': {
        title: 'Full-arch fixed prostheses, both jaws',
        note: 'Implant-supported · retracted view',
      },
      'upper-arch-fixed': {
        title: 'Upper full-arch fixed prosthesis',
        note: 'Opposing natural lower teeth',
      },
      'upper-arch-closeup': {
        title: 'Upper full-arch prosthesis, detail',
        note: 'Gingival contour and tooth form',
      },
      'full-mouth-smile': {
        title: 'Full-mouth rehabilitation',
        note: 'Final smile · both arches',
      },
      'smile-portrait': {
        title: 'Anterior restorations, final smile',
        note: 'Upper front teeth',
      },
      'anterior-crowns-retractor': {
        title: 'Upper anterior ceramic crowns',
        note: 'Retracted view at fitting',
      },
      'anterior-crowns-smile': {
        title: 'Upper anterior crowns, smile view',
        note: 'Smile line at fitting',
      },
      'lab-master-cast': {
        title: 'Ceramic crowns on the master cast',
        note: 'Lab stage · before fitting',
      },
    },
    open: 'Open case {n}: {title}',
    close: 'Close',
    previous: 'Previous case',
    next: 'Next case',
    counter: '{n} of {total}',
    view: 'View',
    disclaimer:
      'Clinical photographs of patients treated at {clinic}. Results vary from person to person; suitability for any procedure is decided at consultation.',
    cta: 'Discuss your case',
    ctaBlurb: 'Bring your X-ray or a photograph to the consultation, or send it ahead on WhatsApp.',
  },

  about: {
    eyebrow: 'About',
    headlineTop: 'Excellence in dentistry with',
    headlineOutlined: 'compassionate',
    headlineTail: 'care',
    lead:
      'Every treatment plan is built around you — your comfort, your schedule, your goals. Our clinicians combine leading technology with a genuinely gentle chairside manner.',
    visitUs: 'Visit us',
    yearsValue: '15',
    yearsLabel: 'Years of gentle expertise',
    /** One per card in the About photo stack, in the order they are dealt. */
    imageAlts: [
      '{clinic} — two of the practice surgeons operating in theatre',
      '{clinic} — a surgeon operating under the theatre lamp',
    ],
    imageDotAria: 'Show photo {n}',
    facts: { clinic: 'Clinic', hours: 'Hours', referrals: 'Referrals' },
    referralsValue: 'Second opinions welcome',
    surgicalTeam: 'Clinical team',
    profileAria: '{name} — {title}, full profile',
    stats: [
      { value: '98', suffix: '%', label: 'Satisfaction rate' },
      { value: '20', suffix: 'K', label: 'Smiles transformed' },
      { value: '4.9', suffix: '', label: 'Customer rating' },
    ],
  },

  hospitals: {
    eyebrow: 'Hospital affiliations',
    headlineTop: 'Where we',
    headlineOutlined: 'operate',
    lead:
      'Day-to-day dentistry happens at the clinic. Surgical cases — orthognathic work, trauma reconstruction, anything needing a theatre and an anaesthetist — are admitted through these hospitals.',
    items: {
      'shifa': { name: 'Shifa Hospital', note: 'مستشفى شفا' },
      'global-medical-city': { name: 'Global Medical City', note: 'Al-Azhar' },
      'la-vida': { name: 'La Vida Hospital', note: 'مستشفى لافيدا' },
      'nasaaem': { name: 'Nasaaem Hospital', note: 'مستشفى نسائم' },
      'rofayda': { name: 'Rofayda Maternity', note: 'Maternity hospital' },
      'dar-el-oyoun': { name: 'Dar El Oyoun Hospitals', note: 'دار العيون' },
    },
  },

  testimonials: {
    eyebrow: 'Testimonials',
    headlineTop: 'Smiles that',
    headlineOutlined: 'speak',
    lead:
      "Real words from real patients — the reason 9 out of 10 new clients arrive on a friend's recommendation.",
    quotes: [
      {
        text: 'دخلت العيادة وأنا مرعوبة وخرجت مش مصدقة إن كل حاجة خلصت. الدكتور يوسف شرحلي كل خطوة قبل ما يبدأها، ومحستش بحاجة خالص.',
        name: 'منى سعيد',
        role: 'زراعة سنة واحدة',
        lang: 'ar',
      },
      {
        text: 'عملت زرعتين ولا وجع ولا ورم ولا حاجة. وكمان اتصل بنفسه تاني يوم يطمن عليا — ده مش بيحصل بصراحة.',
        name: 'أحمد عبد الرحمن',
        role: 'مريض زراعة',
        lang: 'ar',
      },
      {
        text: 'The calmest dental visit of my life. Everything was explained before it happened — zero surprises, zero pain.',
        name: 'Sophie M.',
        role: 'Veneers patient',
        lang: 'en',
      },
      {
        text: 'كنت مأجلة الموضوع من سنين من الخوف بس. النهاردة بضحك في الصور من غير ما أغطي بؤي بإيدي.',
        name: 'ياسمين حلمي',
        role: 'عدسات أسنان',
        lang: 'ar',
      },
      {
        text: 'حشو العصب اللي كنت خايف منه طول عمري طلع أهون حاجة عملتها. ساعة واحدة وخلاص، ورجعت الشغل في نفس اليوم.',
        name: 'محمود رفعت',
        role: 'علاج جذور',
        lang: 'ar',
      },
      {
        text: 'عملت جراحة فك وكان قلقي كبير جدًا. لكن الخطة كانت مكتوبة قدامي بالأشعة والقياسات قبل العملية بأسبوع، وده اللي طمّنّي.',
        name: 'كريم عادل',
        role: 'جراحة فكين',
        lang: 'ar',
      },
      {
        text: 'Two implants, both painless, both perfect. The aftercare calls afterwards were a lovely, unexpected touch.',
        name: 'Daniel K.',
        role: 'Implant patient',
        lang: 'en',
      },
      {
        text: 'أنضف عيادة دخلتها في نصر سيتي، والمواعيد بتتحترم بالدقيقة. مش قاعدة مستنية ساعتين زي أي مكان تاني.',
        name: 'هدى فتحي',
        role: 'كشف دوري',
        lang: 'ar',
      },
      {
        text: 'التركيبة طلعت بلون سناني بالظبط، ولحد دلوقتي محدش واخد باله إن فيه حاجة اتعملت. ده بالظبط اللي كنت عايزاه.',
        name: 'شيماء مرسي',
        role: 'تركيبات وتيجان',
        lang: 'ar',
      },
      {
        text: 'My whitening results were instant and natural. They talked me out of overdoing it. That honesty earned a client for life.',
        name: 'Robert W.',
        role: 'Whitening patient',
        lang: 'en',
      },
      {
        text: 'ابني كان كاسر سنة قدامية ومروّعنا. رجّعها في جلسة واحدة وباينة طبيعية تمامًا، وطلع من العيادة مبسوط.',
        name: 'عمرو طارق',
        role: 'ترميم بعد إصابة',
        lang: 'ar',
      },
      {
        text: 'أول مرة أمشي من عند دكتور أسنان وأنا فاهمة بالظبط اتعمل إيه وليه، ومعايا الخطة مكتوبة. الصراحة دي هي اللي رجّعتني.',
        name: 'نيرة إبراهيم',
        role: 'تجميل وتبييض',
        lang: 'ar',
      },
    ],
  },

  location: {
    eyebrow: 'Visit us',
    headlineTop: 'Find us in',
    headlineOutlined: 'Nasr City',
    lead:
      "Easy to reach from Al Golf and Heliopolis — message us on WhatsApp and we'll hold a slot that fits your day.",
    addressLabel: 'Clinic address',
    hoursLabel: 'Opening hours',
    phoneLabel: 'Call the clinic',
    socialLabel: 'Follow the clinic',
    chat: 'Chat on WhatsApp',
    directions: 'Get directions',
    mapTitle: '{clinic} on Google Maps',
    mapLoad: 'Show the map',
    mapNotice: 'Loading the map sets Google cookies on your device.',
  },

  footer: {
    eyebrow: 'Ready when you are',
    headlineTop: 'Your best smile starts with',
    headlineAccent: 'one visit',
    lead:
      'Same-week appointments, transparent pricing, and a team that treats you like a person — not a chart number.',
    book: 'Book on WhatsApp',
    brandBlurb:
      '{doctor} — {specialty}. Modern dentistry with gentle care, delivered calmly on every single visit.',
    explore: 'Explore',
    visitUs: 'Visit us',
    rights: '© 2026 {clinic}. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Care',
  },

  profile: {
    ourTeam: 'Our team',
    allTeam: 'All of the team',
    discuss: 'Discuss your case',
    discussAria: 'Discuss your case with {name} on WhatsApp',
    call: 'Call {phone}',
    hours: 'Hours',
    clinic: 'Clinic',
    scope: 'Scope of practice',
    cvEyebrow: 'Curriculum vitae',
    cvHeadline: 'Qualifications, post and',
    cvOutlined: 'special interest',
    alsoInTeam: 'Also in the team',
    anotherOpinion: 'Another opinion, same clinic',
    docTitle: '{name} — {title} | {clinic}',
    docDescription: '{name}, {title} at {clinic}. {lead}',
    whatsappMessage: "Hello, I'd like to book a consultation with {name} at {clinic}.",
  },

  team: {
    'youssef-nasser': {
      name: 'Dr. Youssef Nasser',
      role: 'Implants & Maxillofacial Surgery',
      title: 'Oral & Maxillofacial Surgeon',
      specialty: 'Dental Implants & Maxillofacial Surgery',
      credentials: ['Oral & Maxillofacial Surgery', 'Dental Implants', '15+ years'],
      scopeLead: 'What {name}',
      scopeVerb: 'operates on',
      lead:
        'Surgery of the face and jaws — from a single implant to full-arch rehabilitation and corrective jaw surgery.',
      intro:
        'Every case starts with imaging, a written plan, and a straight conversation about what the procedure actually involves — before anything is scheduled. Surgical suitability is decided at consultation, never over the phone.',
      focus: [
        { name: 'Orthognathic Surgery', descriptor: 'Corrective jaw alignment' },
        { name: 'Facial Trauma & Reconstruction', descriptor: 'Mandible, orbit and zygoma' },
        { name: 'Temporomandibular Joint', descriptor: 'TMJ pain, clicking and locking' },
        { name: 'Impacted Third Molars', descriptor: 'Surgical wisdom-tooth removal' },
        { name: 'Cysts & Benign Lesions', descriptor: 'Excision and biopsy' },
        { name: 'Bone Grafting & Sinus Lift', descriptor: 'Preparing the site for implants' },
        { name: 'Dental Implants', descriptor: 'Single unit to full arch' },
      ],
      cv: [
        {
          heading: 'Practice',
          items: [
            'Oral and maxillofacial surgery at Ozea Dental Clinic, Nasr City, Cairo',
            'Implantology — single unit through to full-arch rehabilitation',
            'Fifteen years and more of clinical practice',
          ],
        },
        {
          heading: 'How a case proceeds',
          items: [
            'Consultation',
            'Imaging and measurement',
            'Written surgical plan',
            'Surgery and follow-up',
          ],
        },
        {
          heading: 'Approach',
          items: [
            'Imaging and measurement before any plan is written',
            'A written surgical plan you keep a copy of',
            'Referrals and second opinions welcome',
          ],
        },
      ],
      visualCaption:
        'Lateral cephalometric tracing — the schematic a jaw surgeon measures from. Illustration, not a patient image and not a predicted result.',
    },
    'sara-sameh': {
      name: 'Dr. Sara Sameh',
      role: 'Cosmetics & Veneers',
      title: 'Cosmetic & Restorative Dentist',
      specialty: 'Cosmetic Dentistry · Veneers',
      credentials: ['Cosmetic Dentistry', 'Veneers', 'Smile Design'],
      scopeLead: 'What {name}',
      scopeVerb: 'treats',
      lead:
        'Cosmetic and restorative dentistry — smile design, veneers and the conservative work that keeps a natural tooth natural.',
      intro:
        'A smile is planned before it is prepared. Shade, shape and proportion are agreed with you first — photographs, measurements, and a mock-up you can see and change — and the option that removes the least tooth structure is always on the table.',
      focus: [
        { name: 'Porcelain Veneers', descriptor: 'Shape, shade and proportion' },
        { name: 'Composite Bonding', descriptor: 'Reshaping without a laboratory' },
        { name: 'Smile Design', descriptor: 'Planned and previewed before preparation' },
        { name: 'Crowns & Onlays', descriptor: 'Restoring a broken or worn tooth' },
        { name: 'Teeth Whitening', descriptor: 'In-clinic and supervised at home' },
        { name: 'Aesthetic Fillings', descriptor: 'Tooth-coloured, minimally invasive' },
        { name: 'Gum Contouring', descriptor: 'Balancing the frame around the teeth' },
      ],
      cv: [
        {
          heading: 'Practice',
          items: [
            'Cosmetic and restorative dentistry at Ozea Dental Clinic, Nasr City, Cairo',
            'Veneers, bonding and full smile-design cases',
            'Conservative restoration of worn, chipped and discoloured teeth',
          ],
        },
        {
          heading: 'How a case proceeds',
          items: [
            'Consultation and photographs',
            'Shade, shape and proportion agreed',
            'Mock-up you see before preparation',
            'Fit and follow-up',
          ],
        },
        {
          heading: 'Approach',
          items: [
            'The least tooth structure removed that the result allows',
            'Nothing prepared before the design is agreed in writing',
            'Referrals and second opinions welcome',
          ],
        },
      ],
      visualCaption:
        'Veneer preparation in section — enamel reduction, margin and the seated shell. Illustration, not a patient image and not a predicted result.',
    },
    'adham-yehia-zakaria': {
      name: 'Dr. Adham Yehia Zakaria',
      role: 'TMJ & Maxillofacial Surgery',
      title: 'Consultant, Oral & Maxillofacial Surgery',
      specialty: 'Temporomandibular Joint · Oral & Maxillofacial Surgery',
      credentials: ['MSc', 'PhD', 'Consultant', 'Lecturer — Cairo University'],
      scopeLead: 'What {name}',
      scopeVerb: 'operates on',
      lead:
        'Consultant of oral and maxillofacial surgery with a dedicated temporomandibular joint practice, and a lecturer at Cairo University.',
      intro:
        'A jaw that clicks, locks, or hurts to open is a joint problem before it is a tooth problem. Assessment starts at the joint itself — how far it opens, where it deviates, what the imaging shows — and the least invasive option that can solve it is tried first.',
      focus: [
        {
          name: 'Temporomandibular Joint Surgery',
          descriptor: 'Disc displacement, locking and joint pain',
        },
        {
          name: 'Arthrocentesis & Arthroscopy',
          descriptor: 'Minimally invasive joint lavage and inspection',
        },
        {
          name: 'Ankylosis & Dislocation',
          descriptor: 'A jaw that will not open, or will not stay in',
        },
        {
          name: 'Total Joint Replacement',
          descriptor: 'A prosthetic temporomandibular joint',
        },
        { name: 'Orthognathic Surgery', descriptor: 'Corrective jaw alignment' },
        { name: 'Facial Trauma & Reconstruction', descriptor: 'Mandible, orbit and zygoma' },
        { name: 'Cysts & Benign Lesions', descriptor: 'Excision and biopsy' },
        { name: 'Dental Implants & Bone Grafting', descriptor: 'Site preparation and restoration' },
      ],
      cv: [
        {
          heading: 'Qualifications',
          items: [
            'MSc — Oral and Maxillofacial Surgery',
            'PhD — Oral and Maxillofacial Surgery',
            'Consultant, Oral and Maxillofacial Surgery',
          ],
        },
        {
          heading: 'Academic',
          items: [
            'Lecturer, Cairo University',
            'Teaching and supervision in oral and maxillofacial surgery',
          ],
        },
        {
          heading: 'Special interest',
          items: [
            'Temporomandibular joint disorders and TMJ surgery',
            'Joint-conserving, minimally invasive treatment before open surgery',
            'Combined orthodontic and surgical planning for jaw alignment',
          ],
        },
      ],
      visualCaption:
        'The temporomandibular joint in section — condyle, disc and fossa, with the rotation and translation that open the jaw. Illustration, not a patient image.',
    },
  },
}

/** Every other language is typed against the English tree. */
export type Copy = typeof en
