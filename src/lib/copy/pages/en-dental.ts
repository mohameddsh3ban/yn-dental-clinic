import type { ContentCopy } from './types'

/**
 * Implant, restorative and cosmetic pages.
 * `{clinic}`, `{address}` and `{phone}` are filled in `./index.ts`.
 */
export const enDental = {
  'dental-implants': {
    nav: 'Dental implants',
    blurb: 'Replacing one tooth, several, or a full arch',
    h1: 'Dental implants in Nasr City, Cairo',
    metaTitle: 'Dental Implants in Nasr City, Cairo | Ozea Dental Clinic',
    metaDescription:
      'Dental implants in Nasr City, Cairo, placed by an oral and maxillofacial surgeon. CT-based planning, a written plan you keep, single tooth to full arch.',
    eyebrow: 'Implantology',
    answer:
      'A dental implant is a small titanium post placed in the jawbone to replace the root of a missing tooth; a crown, a bridge or a full set of teeth is then fixed on top. At {clinic} in Nasr City, Cairo, implants are planned from a CT scan and placed by Dr. Youssef Nasser, an oral and maxillofacial surgeon, usually under local anaesthetic. The bone takes about three to six months to bond with the implant before the final tooth is fitted.',
    facts: [
      { label: 'Replaces', value: 'One tooth, several, or a full arch' },
      { label: 'Anaesthesia', value: 'Local, in most cases' },
      { label: 'Bone healing', value: 'Usually 3–6 months' },
      { label: 'Surgeon', value: 'Dr. Youssef Nasser' },
    ],
    sections: [
      {
        heading: 'Who implants are for',
        body: [
          'Implants suit adults who have lost one or more teeth and want a fixed replacement that does not rely on the neighbouring teeth, or who want a loose denture held firmly in place.',
          'You need healthy gums and enough bone to hold the implant. Where bone has shrunk after an extraction, it can often be rebuilt first with a bone graft or a sinus lift. Smoking and poorly controlled diabetes slow healing and raise the chance of failure, so they are discussed before anything is planned.',
        ],
      },
      {
        heading: 'Why a surgeon and a CT scan',
        body: [
          'An implant has to sit in bone, clear of the nerve in the lower jaw and the sinus above the upper back teeth. A CT scan shows the height and width of bone in three dimensions, so the size and position of each implant are decided before surgery rather than during it.',
          'Complex cases — thin bone, sites close to the nerve or sinus, failed earlier implants, full-arch reconstruction — are routine work for a maxillofacial surgeon.',
        ],
      },
      {
        heading: 'What to expect afterwards',
        body: [
          'Mild swelling and soreness for a few days are normal and are controlled with ordinary painkillers. Keep to soft food on that side, keep the area clean as instructed, and avoid smoking while it heals.',
          'With daily cleaning and regular check-ups an implant can last for decades. The crown on top takes the wear and may need replacing over time.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation and CT scan', text: 'Examination, medical history, and three-dimensional imaging of the bone.' },
      { name: 'Written plan', text: 'How many implants, where, any grafting needed, and the timeline.' },
      { name: 'Placement', text: 'The implant is placed under local anaesthetic, usually in under an hour per site.' },
      { name: 'Healing', text: 'Three to six months for the bone to bond with the implant.' },
      { name: 'Final tooth', text: 'An impression or scan, then the crown or bridge is fitted.' },
    ],
    faqs: [
      {
        q: 'Is getting a dental implant painful?',
        a: 'Placement is done under local anaesthetic, so you should feel pressure but not pain. Most people describe the days afterwards as less sore than a tooth extraction, managed with ordinary painkillers.',
      },
      {
        q: 'How long do dental implants last?',
        a: 'With good cleaning and regular check-ups, implants commonly last 20 years or more; long-term studies report that well over 90% are still in place after ten years. The crown may need replacing sooner because it takes the wear.',
      },
      {
        q: 'How long does the whole implant process take?',
        a: 'Typically three to six months from placement to the final tooth, because the bone needs time to bond with the implant. It takes longer if a bone graft is needed first.',
      },
      {
        q: 'Can I have an implant if I do not have enough bone?',
        a: 'Often, yes. Bone can be rebuilt with a graft, or with a sinus lift in the upper back jaw, either before or at the same time as the implant. A CT scan shows which is needed.',
      },
      {
        q: 'Can I get a tooth on the same day as the implant?',
        a: 'In selected cases a temporary tooth can be fixed the same day, mainly for front teeth and full-arch cases with good bone. Whether it is safe for you is decided from your CT scan.',
      },
      {
        q: 'How much do dental implants cost in Cairo?',
        a: 'It depends on the number of implants, the implant system, whether bone grafting is needed and the type of tooth fitted on top. You are given the fee at consultation, once your scan has been reviewed and before anything is scheduled.',
      },
      {
        q: 'How do I book an implant consultation?',
        a: 'Message {clinic} on WhatsApp at {phone}. Bring any recent X-rays, or send them ahead.',
      },
    ],
  },

  'full-arch-implants': {
    nav: 'Full-arch implants',
    blurb: 'A fixed set of teeth on four to six implants',
    h1: 'Full-arch dental implants in Cairo',
    metaTitle: 'Full-Arch Dental Implants in Cairo — Fixed Teeth | Ozea',
    metaDescription:
      'Full-arch implant rehabilitation in Cairo: a fixed bridge on four to six implants for a jaw with no teeth or failing teeth. CT-planned by a maxillofacial surgeon.',
    eyebrow: 'Full-arch rehabilitation',
    answer:
      'Full-arch implant treatment replaces all the teeth in one jaw with a fixed bridge supported by four to six implants, an approach often called All-on-4 or All-on-6. It is for people who have lost all or most of their teeth, or whose remaining teeth cannot be saved. At {clinic} in Cairo, full-arch cases are planned from a CT scan and carried out by oral and maxillofacial surgeon Dr. Youssef Nasser.',
    facts: [
      { label: 'Implants per jaw', value: 'Usually 4 to 6' },
      { label: 'Result', value: 'A fixed bridge — not removable' },
      { label: 'Temporary teeth', value: 'Often fitted within days' },
      { label: 'Final bridge', value: 'After 3–6 months of healing' },
    ],
    sections: [
      {
        heading: 'Who it is for',
        list: [
          'People with no teeth in one or both jaws',
          'People whose remaining teeth are loose or failing from gum disease or decay',
          'Denture wearers who want teeth that stay in',
          'People who would otherwise need an implant for every missing tooth',
        ],
      },
      {
        heading: 'How it works',
        body: [
          'Four to six implants are placed where the bone is strongest, sometimes at an angle to avoid the sinus or the nerve and to reduce the need for grafting. Any failing teeth are removed at the same visit.',
          'Where the implants are stable enough, a fixed temporary bridge is attached within a few days so you are not left without teeth. Once the bone has healed, the temporary is replaced with the final bridge, made to the shape and shade agreed with you.',
        ],
      },
      {
        heading: 'Living with a full-arch bridge',
        body: [
          'The bridge is fixed in place and is only removed by the dentist. It is cleaned every day underneath with a water flosser or special brushes, and checked professionally at regular intervals.',
          'A soft diet is needed while the implants heal. After the final bridge is fitted, most people eat normally.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation and CT scan', text: 'Bone, bite and smile line assessed; options explained.' },
      { name: 'Written plan', text: 'Number and position of implants, type of bridge, timeline.' },
      { name: 'Surgery', text: 'Extractions if needed and implant placement in one session.' },
      { name: 'Temporary bridge', text: 'Fixed teeth for the healing period, where stability allows.' },
      { name: 'Final bridge', text: 'Fitted after three to six months, then regular maintenance.' },
    ],
    faqs: [
      {
        q: 'What is the difference between All-on-4 and All-on-6?',
        a: 'The number of implants supporting the bridge. Four are enough in many lower jaws and in upper jaws with good bone; six spread the load further and are often chosen for the upper jaw or for softer bone. The choice is made from your CT scan.',
      },
      {
        q: 'Will I be without teeth during healing?',
        a: 'Usually not. When the implants are stable on the day of surgery, a fixed temporary bridge is attached within a few days. If the bone is too soft for that, a removable temporary is worn until the implants have healed.',
      },
      {
        q: 'Is a full-arch bridge better than a denture?',
        a: 'It is fixed, does not cover the palate, does not move when you eat or speak, and helps preserve the jawbone. It needs surgery, enough bone and a higher budget, and it must be cleaned carefully every day.',
      },
      {
        q: 'How long does a full-arch implant bridge last?',
        a: 'The implants can last for decades with good care. The bridge is subject to wear; teeth on it can chip and may need repair or replacement after ten to fifteen years, depending on the material.',
      },
      {
        q: 'Can it be done under general anaesthesia?',
        a: 'Yes. Most cases are done under local anaesthetic, with or without sedation. Longer cases, both jaws at once, or anxious patients can be treated under general anaesthesia in hospital.',
      },
    ],
  },

  'bone-grafting-sinus-lift': {
    nav: 'Bone grafting & sinus lift',
    blurb: 'Rebuilding bone so an implant can be placed',
    h1: 'Bone grafting and sinus lift for dental implants in Cairo',
    metaTitle: 'Bone Grafting & Sinus Lift in Cairo | Ozea Dental Clinic',
    metaDescription:
      'Not enough bone for an implant? Bone grafting and sinus lift surgery in Cairo, planned from a CT scan by an oral and maxillofacial surgeon.',
    eyebrow: 'Preparing the implant site',
    answer:
      'Bone grafting rebuilds jawbone that has shrunk after a tooth was lost, so that an implant has enough bone to hold it. A sinus lift is a bone graft placed under the floor of the sinus above the upper back teeth. At {clinic} in Cairo, both are planned from a CT scan and performed by oral and maxillofacial surgeon Dr. Youssef Nasser, often at the same visit as the implant.',
    facts: [
      { label: 'Purpose', value: 'Enough bone to hold an implant' },
      { label: 'Anaesthesia', value: 'Local, in most cases' },
      { label: 'Graft healing', value: 'About 4–9 months' },
      { label: 'Planned from', value: 'A CT scan' },
    ],
    sections: [
      {
        heading: 'Why bone is lost',
        body: [
          'Jawbone is kept in place by the teeth it supports. After an extraction the bone around the socket shrinks, most of it in the first year. Gum disease, infection, injury and long-term denture wear cause further loss.',
          'In the upper back jaw the sinus also enlarges downward once teeth are lost, leaving only a thin layer of bone beneath it.',
        ],
      },
      {
        heading: 'Types of graft',
        list: [
          'Socket preservation — graft material placed at the time of extraction to hold the ridge',
          'Guided bone regeneration — graft and a membrane to widen or heighten a thin ridge',
          'Sinus lift — bone added under the sinus membrane, through the side of the jaw or through the implant site',
          'Block graft — a piece of your own bone, used for larger defects',
        ],
        body: [
          'The graft may be your own bone, processed donor or animal-derived bone, or a synthetic substitute. Which is used, and why, is set out in your written plan.',
        ],
      },
      {
        heading: 'Recovery',
        body: [
          'Swelling and bruising for several days are normal. After a sinus lift you should avoid blowing your nose, and sneeze with your mouth open, for about two weeks.',
          'The graft matures into bone over four to nine months. Small grafts are often placed at the same time as the implant; larger ones are left to heal first.',
        ],
      },
    ],
    steps: [
      { name: 'CT scan', text: 'Measures the height and width of bone at each implant site.' },
      { name: 'Written plan', text: 'Whether a graft is needed, which type, and when the implant follows.' },
      { name: 'Grafting', text: 'Under local anaesthetic, with or without the implant in the same visit.' },
      { name: 'Healing and implant', text: 'A follow-up scan confirms new bone before the next stage.' },
    ],
    faqs: [
      {
        q: 'How do I know if I need a bone graft?',
        a: 'From a CT scan. It measures the bone at the implant site in three dimensions. If there is not enough height or width to surround an implant, a graft is recommended.',
      },
      {
        q: 'Is a sinus lift a major operation?',
        a: 'No. It is a routine procedure for a maxillofacial surgeon, done under local anaesthetic and usually taking under an hour. You go home the same day.',
      },
      {
        q: 'Where does the graft material come from?',
        a: 'From your own jaw, from processed donor or bovine bone, or from a synthetic substitute. All are established options; the choice depends on the size of the defect and is explained before treatment.',
      },
      {
        q: 'Can the implant be placed at the same time as the graft?',
        a: 'Often, when there is enough existing bone to hold the implant steady. If not, the graft is left to heal for four to nine months and the implant is placed afterwards.',
      },
      {
        q: 'Is bone grafting painful?',
        a: 'It is done under local anaesthetic. Afterwards, expect swelling and soreness for several days, usually well controlled with ordinary painkillers.',
      },
    ],
  },

  veneers: {
    nav: 'Veneers & smile design',
    blurb: 'Porcelain and composite veneers, planned first',
    h1: 'Dental veneers and smile design in Nasr City, Cairo',
    metaTitle: 'Dental Veneers & Smile Design in Cairo | Ozea Dental Clinic',
    metaDescription:
      'Porcelain and composite veneers in Nasr City, Cairo. Shade and shape agreed on a mock-up before any preparation, removing as little tooth as possible.',
    eyebrow: 'Cosmetic dentistry',
    answer:
      'A veneer is a thin shell of ceramic or composite bonded to the front of a tooth to change its colour, shape or alignment. At {clinic} in Nasr City, Cairo, veneers and smile-design cases are carried out by Dr. Sara Sameh, a cosmetic and restorative dentist. Shade, shape and proportion are agreed with you on a mock-up before any tooth is prepared, and the option that removes the least tooth structure is always considered first.',
    facts: [
      { label: 'Porcelain veneers', value: 'Usually 2–3 visits' },
      { label: 'Composite veneers', value: 'Often a single visit' },
      { label: 'Typical lifespan', value: 'Porcelain 10–15 yrs · composite 5–7' },
      { label: 'Dentist', value: 'Dr. Sara Sameh' },
    ],
    sections: [
      {
        heading: 'Porcelain or composite?',
        body: [
          'Porcelain (ceramic) veneers are made in a laboratory from an impression or scan. They hold their colour and gloss, resist staining and typically last ten to fifteen years. A thin layer of enamel — usually a fraction of a millimetre — is removed so they sit flush, which makes them irreversible.',
          'Composite veneers are sculpted directly on the tooth in tooth-coloured resin, usually in one visit and often with no drilling. They cost less and can be repaired easily, but they stain and wear sooner.',
        ],
      },
      {
        heading: 'What veneers can change',
        list: [
          'Discoloured teeth that do not respond to whitening',
          'Chipped, worn or uneven edges',
          'Small gaps and mild crowding',
          'Teeth that are too small or irregular in shape',
          'Older fillings or restorations that have changed colour',
        ],
      },
      {
        heading: 'When veneers are not the answer',
        body: [
          'Gum disease and decay have to be treated first. Heavy grinding, a bite with little enamel left, or teeth that are badly out of line may be better served by a night guard, orthodontics or crowns. If whitening or bonding alone would give you what you want, you will be told so.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation and photographs', text: 'What you want to change, and what is achievable.' },
      { name: 'Design and mock-up', text: 'Shade, shape and proportion previewed on your own teeth.' },
      { name: 'Preparation', text: 'Minimal reduction, an impression or scan, and temporaries.' },
      { name: 'Fit and follow-up', text: 'Veneers bonded, bite checked, and a review visit.' },
    ],
    faqs: [
      {
        q: 'How long do veneers last?',
        a: 'Porcelain veneers typically last ten to fifteen years and often longer with good care. Composite veneers usually last five to seven years before they need polishing, repair or replacement.',
      },
      {
        q: 'Do veneers damage your teeth?',
        a: 'Porcelain veneers require a thin layer of enamel to be removed, so the tooth will always need a veneer or similar covering afterwards. Done conservatively on healthy teeth, the tooth underneath remains sound. Composite veneers often need no enamel removed.',
      },
      {
        q: 'Are veneers painful?',
        a: 'Preparation is done under local anaesthetic and is not painful. Some sensitivity to hot and cold for a few days afterwards is common and settles.',
      },
      {
        q: 'What is the difference between veneers and crowns?',
        a: 'A veneer covers only the front surface of a tooth and is mainly cosmetic. A crown covers the whole tooth and is used when the tooth is broken, heavily filled or root-treated and needs strengthening.',
      },
      {
        q: 'Can I see the result before committing?',
        a: 'Yes. A mock-up is placed over your own teeth so you can see and adjust the proposed shape before any tooth is prepared. Nothing is prepared until the design is agreed.',
      },
      {
        q: 'Do veneers stain?',
        a: 'Porcelain is highly resistant to staining. Composite picks up stain from coffee, tea and smoking over time and benefits from periodic polishing.',
      },
    ],
  },

  'dental-crowns': {
    nav: 'Dental crowns',
    blurb: 'Restoring a broken, worn or root-treated tooth',
    h1: 'Dental crowns in Nasr City, Cairo',
    metaTitle: 'Dental Crowns in Nasr City, Cairo — Zirconia & Ceramic | Ozea',
    metaDescription:
      'Zirconia and ceramic crowns in Nasr City, Cairo, to restore broken, heavily filled or root-treated teeth. Shade-matched, usually fitted in two visits.',
    eyebrow: 'Restorative dentistry',
    answer:
      'A dental crown is a cap that covers the whole visible part of a tooth to restore its shape, strength and appearance. It is used for teeth that are broken, heavily filled, worn or root-treated, and it is also the visible part of a dental implant. At {clinic} in Nasr City, Cairo, crowns are made in ceramic or zirconia, matched to the shade of your own teeth and usually fitted in two visits.',
    facts: [
      { label: 'Visits', value: 'Usually two' },
      { label: 'Materials', value: 'Zirconia, all-ceramic, porcelain-on-metal' },
      { label: 'Typical lifespan', value: '10–15 years or more' },
      { label: 'Anaesthesia', value: 'Local' },
    ],
    sections: [
      {
        heading: 'When a crown is needed',
        list: [
          'A tooth with a large filling and little natural structure left',
          'A cracked or broken tooth',
          'A back tooth after root canal treatment',
          'A tooth worn down by grinding or acid',
          'On top of a dental implant, or as the support for a bridge',
        ],
      },
      {
        heading: 'Choosing the material',
        body: [
          'Zirconia is very strong and suits back teeth and people who grind. All-ceramic crowns such as lithium disilicate are the most lifelike and are usually chosen for front teeth. Porcelain fused to metal is a long-established option that remains useful in some situations.',
          'The choice depends on where the tooth is, how much space there is and how hard you bite — it is explained before the tooth is prepared.',
        ],
      },
      {
        heading: 'Looking after a crown',
        body: [
          'A crown cannot decay, but the tooth underneath can, at the edge where the crown meets the gum. Brush and clean between the teeth as normal and attend regular check-ups. If you grind your teeth at night, a guard protects the crown and the teeth opposite it.',
        ],
      },
    ],
    steps: [
      { name: 'Assessment', text: 'Examination and X-ray to check the root and surrounding bone.' },
      { name: 'Preparation', text: 'The tooth is shaped, an impression or scan taken, a temporary fitted.' },
      { name: 'Laboratory', text: 'The crown is made to the agreed shade and shape.' },
      { name: 'Fitting', text: 'The crown is tried, adjusted and cemented.' },
    ],
    faqs: [
      {
        q: 'How long does a dental crown last?',
        a: 'Commonly ten to fifteen years, and often longer with good oral hygiene and regular check-ups. Crowns fail mainly from decay at the edge or from fracture under heavy grinding.',
      },
      {
        q: 'Does a tooth need a root canal before a crown?',
        a: 'Not necessarily. A tooth with a healthy nerve can be crowned as it is. Root canal treatment is only needed first if the nerve is inflamed, infected or exposed.',
      },
      {
        q: 'Is getting a crown painful?',
        a: 'The tooth is numbed with local anaesthetic, so preparation is comfortable. Mild sensitivity or tenderness of the gum for a few days afterwards is normal.',
      },
      {
        q: 'Which is better, zirconia or porcelain?',
        a: 'Neither is better in every case. Zirconia is stronger and suits back teeth; all-ceramic crowns are more translucent and suit front teeth. Many crowns combine a strong core with a lifelike surface.',
      },
      {
        q: 'Crown or veneer — which do I need?',
        a: 'A veneer covers only the front of a healthy tooth to change its appearance. A crown covers the entire tooth and is chosen when the tooth is weak, broken or root-treated.',
      },
    ],
  },

  'root-canal-treatment': {
    nav: 'Root canal treatment',
    blurb: 'Saving a tooth with an infected or inflamed nerve',
    h1: 'Root canal treatment in Nasr City, Cairo',
    metaTitle: 'Root Canal Treatment in Nasr City, Cairo | Ozea Dental Clinic',
    metaDescription:
      'Root canal (endodontic) treatment in Nasr City, Cairo, to relieve toothache and save an infected tooth. Local anaesthetic, usually one or two visits.',
    eyebrow: 'Endodontics',
    answer:
      'Root canal treatment removes inflamed or infected pulp — the nerve and blood supply — from inside a tooth, cleans and disinfects the root canals and seals them. It relieves the pain and saves a tooth that would otherwise have to be extracted. At {clinic} in Nasr City, Cairo, it is carried out under local anaesthetic, usually in one or two visits, and the tooth is then restored with a filling or a crown.',
    facts: [
      { label: 'Visits', value: 'Usually one or two' },
      { label: 'Anaesthesia', value: 'Local' },
      { label: 'Afterwards', value: 'A crown, on most back teeth' },
      { label: 'Aim', value: 'To keep your natural tooth' },
    ],
    sections: [
      {
        heading: 'Signs you may need a root canal',
        list: [
          'Toothache that lingers after hot or cold, or comes on by itself',
          'Pain that wakes you at night',
          'Pain on biting, or a tooth that feels raised',
          'A swelling or small boil on the gum near the tooth',
          'A tooth that has turned darker after an injury',
        ],
        body: [
          'Some infected teeth cause no pain at all and are found on an X-ray. Antibiotics can settle a swelling for a while but do not clear the infection inside the tooth.',
        ],
      },
      {
        heading: 'What happens during treatment',
        body: [
          'The tooth is numbed and isolated. A small opening is made through the biting surface, the canals are located, measured, cleaned and shaped, then disinfected and filled with a sealing material.',
          'A tooth that has had a root canal is more brittle than a living one. Back teeth are usually protected with a crown afterwards so they do not fracture.',
        ],
      },
    ],
    steps: [
      { name: 'Diagnosis', text: 'Examination, tests and an X-ray to confirm which tooth and why.' },
      { name: 'Cleaning and shaping', text: 'Under local anaesthetic; the canals are cleaned and disinfected.' },
      { name: 'Filling the canals', text: 'The canals are sealed, in the same visit or a second one.' },
      { name: 'Restoration', text: 'A permanent filling or a crown to protect the tooth.' },
    ],
    faqs: [
      {
        q: 'Is root canal treatment painful?',
        a: 'With modern local anaesthetic it should feel much like having a filling. The treatment removes the source of the pain; the tooth may be tender to bite on for a few days afterwards.',
      },
      {
        q: 'How many visits does a root canal take?',
        a: 'Usually one or two, each of about an hour. Teeth with several canals, or with an active infection, are more likely to need the second visit.',
      },
      {
        q: 'Is it better to extract the tooth instead?',
        a: 'Keeping your own tooth is usually the better option when it can be restored. Extraction leaves a gap that then needs an implant or a bridge to prevent the neighbouring teeth drifting.',
      },
      {
        q: 'Do I need a crown after a root canal?',
        a: 'For most back teeth, yes — a crown protects the tooth from fracturing. Front teeth with little damage can often be restored with a filling alone.',
      },
      {
        q: 'How long does a root-treated tooth last?',
        a: 'Properly treated and restored, it can last as long as your other teeth. Success depends on the canals being thoroughly cleaned and the tooth being well sealed afterwards.',
      },
      {
        q: 'Can antibiotics cure a tooth infection?',
        a: 'No. They can reduce swelling and stop an infection spreading, but they cannot reach the dead tissue inside the tooth. The infection returns unless the tooth is root-treated or removed.',
      },
    ],
  },

  'teeth-whitening': {
    nav: 'Teeth whitening',
    blurb: 'In-clinic and supervised home whitening',
    h1: 'Professional teeth whitening in Nasr City, Cairo',
    metaTitle: 'Teeth Whitening in Nasr City, Cairo | Ozea Dental Clinic',
    metaDescription:
      'Professional teeth whitening in Nasr City, Cairo — in-clinic and dentist-supervised home whitening, after an examination to check it is right for you.',
    eyebrow: 'Cosmetic dentistry',
    answer:
      'Professional teeth whitening lightens the natural colour of the teeth using a peroxide gel, either applied in the clinic in about an hour or worn at home in custom-made trays under a dentist’s supervision. At {clinic} in Nasr City, Cairo, whitening is provided by Dr. Sara Sameh after an examination to check that your teeth and gums are healthy and that whitening will give the change you want.',
    facts: [
      { label: 'In-clinic session', value: 'About an hour' },
      { label: 'Home whitening', value: 'Usually 1–2 weeks' },
      { label: 'Results last', value: 'About 1–3 years' },
      { label: 'Dentist', value: 'Dr. Sara Sameh' },
    ],
    sections: [
      {
        heading: 'In-clinic or at home',
        body: [
          'In-clinic whitening uses a stronger gel applied by the dentist with the gums protected, and gives a visible change in one visit.',
          'Home whitening uses a milder gel in trays made to fit your teeth, worn daily for one to two weeks. It is gentler, easier to top up later, and often gives the most even result. The two are frequently combined.',
        ],
      },
      {
        heading: 'What whitening cannot do',
        body: [
          'Whitening works on natural enamel only. Crowns, veneers and fillings do not change colour, so visible ones may need replacing afterwards to match.',
          'Grey or banded discolouration, such as that caused by some medicines taken in childhood, responds poorly. A single dark tooth after an injury usually needs a different treatment. In those cases bonding or veneers are discussed instead.',
        ],
      },
      {
        heading: 'Is it safe?',
        body: [
          'Used as directed by a dentist, whitening does not damage enamel. Temporary sensitivity to cold and mild gum irritation are the common side effects, and they settle within a few days. Decay and gum disease are treated first, and whitening is not carried out during pregnancy.',
        ],
      },
    ],
    steps: [
      { name: 'Examination', text: 'Teeth and gums checked; the cause of the discolouration identified.' },
      { name: 'Shade record', text: 'Your starting shade is recorded so the change can be measured.' },
      { name: 'Whitening', text: 'In the clinic, at home in custom trays, or both.' },
      { name: 'Review', text: 'The result is checked, with advice on keeping it.' },
    ],
    faqs: [
      {
        q: 'How long does teeth whitening last?',
        a: 'Typically one to three years, depending on diet and smoking. Coffee, tea, red wine and tobacco bring stain back sooner; an occasional top-up with home trays maintains the shade.',
      },
      {
        q: 'Does whitening damage enamel?',
        a: 'No, not when it is prescribed and supervised by a dentist. The gel lightens pigments within the tooth without removing enamel.',
      },
      {
        q: 'Will whitening make my teeth sensitive?',
        a: 'Some sensitivity to cold during and shortly after treatment is common and temporary. A desensitising toothpaste and spacing out the sessions usually control it.',
      },
      {
        q: 'Does whitening work on crowns, veneers or fillings?',
        a: 'No. Only natural tooth structure changes colour. Restorations that show when you smile may need replacing afterwards to match the new shade.',
      },
      {
        q: 'Whitening or veneers — which should I choose?',
        a: 'If the shape of your teeth is fine and only the colour bothers you, whitening is the conservative choice. Veneers are considered when the shape, the edges or a discolouration that will not bleach also need to change.',
      },
    ],
  },
} satisfies Partial<Record<string, ContentCopy>>
