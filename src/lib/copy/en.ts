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
    hours: { days: 'Mon – Sat', time: '09:00 – 16:00' },
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
  },

  nav: {
    home: 'Home',
    services: 'Our Services',
    clinic: 'Our Clinic',
    hospitals: 'Hospitals',
    location: 'Location',
    contact: 'Contact',
    team: 'Our Surgeons',
    testimonials: 'Testimonials',
  },

  hero: {
    eyebrow: 'Oral & Maxillofacial Surgery',
    headlineTop: 'Restoring facial',
    headlineOutlined: 'harmony',
    lead:
      'Jaw position, bite and profile are planned as one thing, because a face is read as one thing — never as parts. Every plan starts from imaging and measurement.',
    book: 'Book appointment',
    bookAria: 'Book an appointment with {doctor} on WhatsApp',
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
      { title: 'Restoration', tag: 'Reconstructive' },
      { title: 'Endo treatments', tag: 'Root canal' },
    ],
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
    imageAlt: '{clinic} — dentist treating a relaxed patient',
    facts: { clinic: 'Clinic', hours: 'Hours', referrals: 'Referrals' },
    referralsValue: 'Second opinions welcome',
    surgicalTeam: 'Surgical team',
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
    whatOperates: 'What {name}',
    operatesOn: 'operates on',
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
    'adham-yehia-zakaria': {
      name: 'Dr. Adham Yehia Zakaria',
      role: 'TMJ & Maxillofacial Surgery',
      title: 'Consultant, Oral & Maxillofacial Surgery',
      specialty: 'Temporomandibular Joint · Oral & Maxillofacial Surgery',
      credentials: ['MSc', 'PhD', 'Consultant', 'Lecturer — Cairo University'],
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
