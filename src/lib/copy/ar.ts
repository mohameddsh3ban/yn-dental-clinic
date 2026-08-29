import type { Copy } from './en'

/**
 * Arabic copy. Typed as `Copy`, so it cannot drift out of sync with `en.ts` —
 * a missing or misspelled key is a build error.
 *
 * Conventions used throughout:
 * - Modern Standard Arabic, clinical register — the same plain, non-salesy tone
 *   the English carries. Nothing is claimed here that the English does not.
 * - Western digits everywhere (٠١٢ would break the tabular-nums alignment the
 *   stat blocks and the phone numbers rely on, and Egyptian clinics quote
 *   numbers this way anyway).
 * - Latin brand and product names stay Latin: Ozea, WhatsApp, Instagram.
 *
 * COPY REVIEW: the clinical wording is a faithful translation of the English
 * that the clinic already approved, not new claims. Have the doctors read their
 * own blocks before launch, same as the English.
 */
export const ar: Copy = {
  meta: {
    title: 'عيادة Ozea لطب الأسنان — د. يوسف ناصر',
    description:
      'عيادة Ozea لطب الأسنان — د. يوسف ناصر، زراعة الأسنان وجراحة الوجه والفكين في مدينة نصر، القاهرة. احجز عبر WhatsApp.',
  },

  site: {
    name: 'عيادة Ozea لطب الأسنان',
    short: 'Ozea',
    doctor: 'د. يوسف ناصر',
    specialty: 'زراعة الأسنان وجراحة الوجه والفكين',
    dentalClinic: 'عيادة أسنان',
    address: {
      street: '6 محمود عمار، الجولف',
      city: 'مدينة نصر، محافظة القاهرة',
      short: 'مدينة نصر، القاهرة',
    },
    hours: { days: 'الإثنين – السبت', time: '09:00 – 16:00' },
    whatsappMessage: 'مرحبًا د. يوسف ناصر، أود حجز موعد في عيادة Ozea لطب الأسنان.',
  },

  common: {
    whatsapp: 'WhatsApp',
    instagram: 'Instagram',
    googleMaps: 'خرائط Google',
    otherLanguage: 'English',
    switchTo: 'التحويل إلى الإنجليزية',
    mainNav: 'التنقل الرئيسي',
    siteNav: 'تنقل الموقع',
  },

  nav: {
    home: 'الرئيسية',
    services: 'خدماتنا',
    clinic: 'عن العيادة',
    hospitals: 'المستشفيات',
    location: 'الموقع',
    contact: 'تواصل معنا',
    team: 'فريق الجراحين',
    testimonials: 'آراء المرضى',
  },

  hero: {
    eyebrow: 'جراحة الفم والوجه والفكين',
    headlineTop: 'استعادة تناغم',
    headlineOutlined: 'الوجه',
    lead:
      'وضع الفك والإطباق وملامح الجانب تُخطَّط كوحدة واحدة، لأن الوجه يُقرأ كوحدة واحدة — لا كأجزاء. كل خطة تبدأ من الأشعة والقياس.',
    book: 'احجز موعدًا',
    bookAria: 'احجز موعدًا مع {doctor} عبر WhatsApp',
    railLabel: 'كيف تسير الحالة',
    rail: ['الكشف', 'الأشعة', 'خطة مكتوبة', 'الجراحة'],
    figureAlt:
      'رسم خطي لوجه من الجانب تظهر من خلاله الجمجمة والفكان وصفَّا الأسنان، مع زرعة سنية ذهبية عند ضرس سفلي',
    annotations: { implant: 'موضع الزرعة', tmj: 'مفصل الفك · TMJ' },
    today: 'اليوم',
    open: 'مواعيد العمل',
    clinic: 'العيادة',
    metaBlurb:
      'الزراعة وجراحة تقويم الفكين والجراحة الترميمية، مخطَّطة من أشعة مقطعية ومن خطة مكتوبة تحتفظ بنسخة منها.',
    illustrationNote: 'رسم توضيحي تخطيطي — ليس صورة مريض وليس نتيجة متوقَّعة.',
    stats: [
      { value: '170', unit: '+', label: 'عملية\nجراحية' },
      { value: '85', unit: '%', label: 'رضا\nالمرضى' },
    ],
  },

  services: {
    eyebrow: 'خدماتنا',
    headlineTop: 'تعرَّف على خدماتنا',
    headlineBottom: 'المميزة في طب',
    headlineOutlined: 'الأسنان',
    lead:
      'رعاية أسنان حديثة تُقدَّم براحة ودقة واهتمام بالتفاصيل — في بيئة هادئة ومريحة تجعل كل زيارة خالية من التوتر.',
    reviews: 'تقييمًا',
    reviewsBlurb: 'اقرأ آراء المرضى عن تجربتهم المريحة والمُرضية في رعاية الأسنان.',
    previous: 'الخدمات السابقة',
    next: 'الخدمات التالية',
    railLabel: 'الخدمات',
    items: [
      { title: 'إجراءات تجميلية', tag: 'تجميل' },
      { title: 'تيجان الأسنان', tag: 'ترميم' },
      { title: 'عدسات الأسنان', tag: 'تجميل' },
      { title: 'عدسات الكومبوزيت', tag: 'زيارة واحدة' },
      { title: 'إعادة التأهيل', tag: 'ترميم شامل' },
      { title: 'علاج العصب', tag: 'حشو جذور' },
    ],
  },

  about: {
    eyebrow: 'عن',
    headlineTop: 'تميُّز في طب الأسنان مع',
    headlineOutlined: 'رعاية',
    headlineTail: 'إنسانية',
    lead:
      'كل خطة علاج تُبنى حولك أنت — راحتك، ووقتك، وما تريد الوصول إليه. يجمع أطباؤنا بين أحدث التقنيات وأسلوب لطيف حقًا على كرسي العلاج.',
    visitUs: 'زُر العيادة',
    yearsValue: '15',
    yearsLabel: 'عامًا من الخبرة اللطيفة',
    imageAlt: '{clinic} — طبيب أسنان يعالج مريضًا مطمئنًا',
    facts: { clinic: 'العيادة', hours: 'المواعيد', referrals: 'التحويلات' },
    referralsValue: 'نرحّب بالرأي الطبي الثاني',
    surgicalTeam: 'فريق الجراحين',
    profileAria: '{name} — {title}، الملف الكامل',
    stats: [
      { value: '98', suffix: '%', label: 'نسبة الرضا' },
      { value: '50', suffix: 'K', label: 'ابتسامة تغيَّرت' },
      { value: '4.9', suffix: '', label: 'تقييم المرضى' },
    ],
  },

  hospitals: {
    eyebrow: 'المستشفيات',
    headlineTop: 'أين',
    headlineOutlined: 'نُجري الجراحات',
    lead:
      'علاج الأسنان اليومي يتم داخل العيادة، أما الحالات الجراحية — جراحات تقويم الفكين وإصلاح إصابات الوجه وكل ما يحتاج غرفة عمليات وتخديرًا — فتُجرى في هذه المستشفيات.',
    items: {
      'shifa': { name: 'مستشفى شفا', note: 'Shifa Hospital' },
      'global-medical-city': { name: 'جلوبال ميديكال سيتي', note: 'Al-Azhar' },
      'la-vida': { name: 'مستشفى لافيدا', note: 'La Vida Hospital' },
      'nasaaem': { name: 'مستشفى نسائم', note: 'Nasaaem Hospital' },
      'rofayda': { name: 'روفيدا للولادة', note: 'Rofayda Maternity' },
      'dar-el-oyoun': { name: 'مستشفيات دار العيون', note: 'Dar El Oyoun' },
    },
  },

  testimonials: {
    eyebrow: 'آراء المرضى',
    headlineTop: 'ابتسامات',
    headlineOutlined: 'تتحدث',
    lead: 'كلمات حقيقية من مرضى حقيقيين — والسبب أن 9 من كل 10 مرضى جدد يأتون بترشيح من صديق.',
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
    eyebrow: 'زُر العيادة',
    headlineTop: 'تجدنا في',
    headlineOutlined: 'مدينة نصر',
    lead:
      'سهلة الوصول من الجولف ومصر الجديدة — راسلنا على WhatsApp ونحجز لك موعدًا يناسب يومك.',
    addressLabel: 'عنوان العيادة',
    hoursLabel: 'مواعيد العمل',
    phoneLabel: 'اتصل بالعيادة',
    socialLabel: 'تابع العيادة',
    chat: 'تواصل عبر WhatsApp',
    directions: 'الحصول على الاتجاهات',
    mapTitle: '{clinic} على خرائط Google',
  },

  footer: {
    eyebrow: 'جاهزون حين تكون',
    headlineTop: 'أفضل ابتسامة لك تبدأ من',
    headlineAccent: 'زيارة واحدة',
    lead:
      'مواعيد خلال نفس الأسبوع، وأسعار واضحة، وفريق يعاملك كإنسان — لا كرقم في ملف.',
    book: 'احجز عبر WhatsApp',
    brandBlurb:
      '{doctor} — {specialty}. طب أسنان حديث برعاية لطيفة، يُقدَّم بهدوء في كل زيارة.',
    explore: 'تصفَّح',
    visitUs: 'زُر العيادة',
    rights: '© 2026 {clinic}. جميع الحقوق محفوظة.',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الرعاية',
  },

  profile: {
    ourTeam: 'فريقنا',
    allTeam: 'كل الفريق',
    discuss: 'ناقش حالتك',
    discussAria: 'ناقش حالتك مع {name} عبر WhatsApp',
    call: 'اتصل بـ {phone}',
    hours: 'المواعيد',
    clinic: 'العيادة',
    scope: 'نطاق الممارسة',
    whatOperates: 'ما يجريه {name}',
    operatesOn: 'من جراحات',
    cvEyebrow: 'السيرة الذاتية',
    cvHeadline: 'المؤهلات والمنصب و',
    cvOutlined: 'الاهتمام الخاص',
    alsoInTeam: 'أيضًا في الفريق',
    anotherOpinion: 'رأي آخر، في العيادة نفسها',
    docTitle: '{name} — {title} | {clinic}',
    docDescription: '{name}، {title} في {clinic}. {lead}',
    whatsappMessage: 'مرحبًا، أود حجز استشارة مع {name} في {clinic}.',
  },

  team: {
    'youssef-nasser': {
      name: 'د. يوسف ناصر',
      role: 'الزراعة وجراحة الوجه والفكين',
      title: 'جرّاح الفم والوجه والفكين',
      specialty: 'زراعة الأسنان وجراحة الوجه والفكين',
      credentials: ['جراحة الفم والوجه والفكين', 'زراعة الأسنان', 'خبرة أكثر من 15 عامًا'],
      lead:
        'جراحة الوجه والفكين — من زرعة واحدة إلى إعادة تأهيل الفك كاملًا وجراحة تقويم الفكين.',
      intro:
        'كل حالة تبدأ بالأشعة، ثم خطة مكتوبة، ثم حديث صريح عمّا تتضمنه الجراحة فعليًا — قبل تحديد أي موعد. صلاحية الحالة للجراحة تُقرَّر في الكشف، ولا تُقرَّر عبر الهاتف أبدًا.',
      focus: [
        { name: 'جراحة تقويم الفكين', descriptor: 'تصحيح انطباق الفكين' },
        { name: 'إصابات الوجه وترميمها', descriptor: 'الفك السفلي والحجاج وعظم الوجنة' },
        { name: 'المفصل الفكي الصدغي', descriptor: 'ألم المفصل وطقطقته وانغلاقه' },
        { name: 'ضروس العقل المنطمرة', descriptor: 'الخلع الجراحي لضرس العقل' },
        { name: 'الأكياس والآفات الحميدة', descriptor: 'الاستئصال وأخذ العينة' },
        { name: 'ترقيع العظم ورفع الجيب', descriptor: 'تهيئة الموضع للزراعة' },
        { name: 'زراعة الأسنان', descriptor: 'من زرعة واحدة إلى الفك الكامل' },
      ],
      cv: [
        {
          heading: 'الممارسة',
          items: [
            'جراحة الفم والوجه والفكين في عيادة Ozea لطب الأسنان، مدينة نصر، القاهرة',
            'الزراعة — من زرعة واحدة إلى إعادة تأهيل الفك كاملًا',
            'خمسة عشر عامًا وأكثر من الممارسة الإكلينيكية',
          ],
        },
        {
          heading: 'كيف تسير الحالة',
          items: ['الكشف', 'الأشعة والقياس', 'خطة جراحية مكتوبة', 'الجراحة والمتابعة'],
        },
        {
          heading: 'المنهج',
          items: [
            'الأشعة والقياس قبل كتابة أي خطة',
            'خطة جراحية مكتوبة تحتفظ بنسخة منها',
            'نرحّب بالتحويلات والرأي الطبي الثاني',
          ],
        },
      ],
      visualCaption:
        'رسم سيفالومتري جانبي — التخطيط الذي يقيس منه جرّاح الفكين. رسم توضيحي، ليس صورة مريض وليس نتيجة متوقَّعة.',
    },
    'adham-yehia-zakaria': {
      name: 'د. أدهم يحيى زكريا',
      role: 'مفصل الفك وجراحة الوجه والفكين',
      title: 'استشاري جراحة الفم والوجه والفكين',
      specialty: 'المفصل الفكي الصدغي · جراحة الفم والوجه والفكين',
      credentials: ['ماجستير', 'دكتوراه', 'استشاري', 'مدرّس — جامعة القاهرة'],
      lead:
        'استشاري جراحة الفم والوجه والفكين، بممارسة مخصَّصة للمفصل الفكي الصدغي، ومدرّس بجامعة القاهرة.',
      intro:
        'الفك الذي يُطقطق أو ينغلق أو يؤلم عند الفتح هو مشكلة مفصل قبل أن يكون مشكلة سنّ. التقييم يبدأ من المفصل نفسه — مدى الفتح، واتجاه الانحراف، وما تُظهره الأشعة — ويُجرَّب أولًا أقل الخيارات تدخُّلًا مما يمكن أن يحل المشكلة.',
      focus: [
        { name: 'جراحة المفصل الفكي الصدغي', descriptor: 'إزاحة القرص والانغلاق وألم المفصل' },
        { name: 'غسل المفصل وتنظيره', descriptor: 'غسل وفحص المفصل بأقل تدخُّل جراحي' },
        { name: 'التصلُّب والخلع المتكرر', descriptor: 'فك لا يفتح، أو لا يثبت في مكانه' },
        { name: 'جراحة تقويم الفكين', descriptor: 'تصحيح انطباق الفكين' },
        { name: 'إصابات الوجه وترميمها', descriptor: 'الفك السفلي والحجاج وعظم الوجنة' },
        { name: 'الأكياس والآفات الحميدة', descriptor: 'الاستئصال وأخذ العينة' },
        { name: 'زراعة الأسنان وترقيع العظم', descriptor: 'تهيئة الموضع والترميم' },
      ],
      cv: [
        {
          heading: 'المؤهلات',
          items: [
            'ماجستير — جراحة الفم والوجه والفكين',
            'دكتوراه — جراحة الفم والوجه والفكين',
            'استشاري جراحة الفم والوجه والفكين',
          ],
        },
        {
          heading: 'الأكاديمي',
          items: [
            'مدرّس بجامعة القاهرة',
            'التدريس والإشراف في جراحة الفم والوجه والفكين',
          ],
        },
        {
          heading: 'الاهتمام الخاص',
          items: [
            'اضطرابات المفصل الفكي الصدغي وجراحته',
            'علاج محافظ على المفصل وبأقل تدخُّل قبل الجراحة المفتوحة',
            'تخطيط مشترك بين التقويم والجراحة لانطباق الفكين',
          ],
        },
      ],
      visualCaption:
        'المفصل الفكي الصدغي في مقطع — اللقمة والقرص والحفرة، مع الدوران والانزلاق اللذين يفتحان الفك. رسم توضيحي، ليس صورة مريض.',
    },
  },
}
