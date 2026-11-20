import type { ContentCopy } from './types'

/**
 * Facial and jaw surgery pages, plus the travelling-patients page.
 * `{clinic}`, `{address}` and `{phone}` are filled in `./index.ts`.
 */
export const enSurgery = {
  'maxillofacial-surgery': {
    nav: 'Maxillofacial surgery',
    blurb: 'Surgery of the jaws, the face and the mouth',
    h1: 'Oral and maxillofacial surgery in Cairo, Egypt',
    metaTitle: 'Maxillofacial Surgery in Cairo, Egypt | Ozea Dental Clinic',
    metaDescription:
      'Oral and maxillofacial surgery in Nasr City, Cairo: corrective jaw surgery, facial trauma, TMJ, cysts and implants, planned from imaging by specialist surgeons.',
    eyebrow: 'Oral & maxillofacial surgery',
    answer:
      'Oral and maxillofacial surgery is the surgical specialty that treats the jaws, the face and the mouth: jaw misalignment, facial fractures, the jaw joint (TMJ), impacted teeth, cysts and tumours of the jaws, and the bone work that dental implants depend on. At {clinic} in Nasr City, Cairo, it is the core of the practice, led by Dr. Youssef Nasser and consultant Dr. Adham Yehia Zakaria. Operations that need a theatre and a general anaesthetic are admitted through the clinic’s affiliated hospitals.',
    facts: [
      { label: 'Specialty', value: 'Oral & maxillofacial surgery' },
      { label: 'Surgeons', value: 'Dr. Youssef Nasser · Dr. Adham Yehia Zakaria' },
      { label: 'Clinic', value: 'Nasr City, Cairo' },
      { label: 'Theatre cases', value: 'Affiliated hospitals, under general anaesthesia' },
    ],
    sections: [
      {
        heading: 'What a maxillofacial surgeon treats',
        list: [
          'Jaw misalignment — underbite, receding lower jaw, open bite and facial asymmetry (orthognathic surgery)',
          'Facial fractures — the lower jaw, the cheekbone, the eye socket and the upper jaw',
          'Jaw joint disorders — TMJ pain, clicking, locking and limited opening',
          'Impacted wisdom teeth and other surgical extractions',
          'Cysts and benign tumours of the jaws, with biopsy',
          'Dental implants, bone grafting and sinus lifts',
        ],
      },
      {
        heading: 'How it differs from general dentistry',
        body: [
          'A general dentist looks after teeth and gums. A maxillofacial surgeon is a dentist who has gone on to postgraduate surgical training in the bones, joints and soft tissues of the face, and who operates in hospital as well as in the clinic.',
          'That is why problems that sit behind the teeth — a jaw that is too far back, a joint that locks, a fracture, a cyst inside the bone — are referred to this specialty rather than treated at the dental chair.',
        ],
      },
      {
        heading: 'Clinic or hospital?',
        body: [
          'Consultations, imaging review, implants, wisdom teeth and most minor surgery take place at the clinic in Nasr City under local anaesthetic.',
          'Corrective jaw surgery, fracture repair, joint surgery and anything else that needs a theatre and an anaesthetist is carried out in one of the hospitals the practice admits to. Which hospital is agreed with you as part of the written plan.',
        ],
      },
      {
        heading: 'When to ask for an assessment',
        list: [
          'Your teeth do not meet properly, or your jaw looks or feels out of line',
          'Your jaw clicks, locks, or hurts when you open or chew',
          'You have had an injury to the face or jaw',
          'You have a swelling in the jaw or a finding on a dental X-ray',
          'A wisdom tooth keeps getting infected',
          'You were told there is not enough bone for an implant',
        ],
      },
    ],
    steps: [
      { name: 'Consultation', text: 'Your history, an examination, and what you want to change.' },
      { name: 'Imaging and measurement', text: 'X-rays or a CT scan, and measurements taken from them.' },
      { name: 'Written plan', text: 'What is proposed, where it is done, and what recovery involves — you keep a copy.' },
      { name: 'Surgery and follow-up', text: 'The operation, then scheduled reviews until healing is complete.' },
    ],
    faqs: [
      {
        q: 'What is the difference between a dentist and a maxillofacial surgeon?',
        a: 'A dentist treats teeth and gums. A maxillofacial surgeon has additional postgraduate surgical training and operates on the jaws, facial bones, jaw joint and related soft tissues — for example corrective jaw surgery, facial fractures, cysts and complex implant cases.',
      },
      {
        q: 'Do I need a referral to see a maxillofacial surgeon?',
        a: 'No. You can book a consultation directly on WhatsApp at {phone}. Referrals from dentists and orthodontists, and requests for a second opinion, are welcome.',
      },
      {
        q: 'Is maxillofacial surgery always done under general anaesthesia?',
        a: 'No. Implants, wisdom teeth and most minor procedures are done under local anaesthetic at the clinic. Jaw repositioning, fracture repair and open joint surgery are done in hospital under general anaesthesia.',
      },
      {
        q: 'Will surgery leave scars on my face?',
        a: 'Most jaw operations are done through incisions inside the mouth, so there is usually no visible scar. Some fracture and joint operations need a small skin incision, which is placed in a natural crease or along the hairline where possible.',
      },
      {
        q: 'Where are operations performed?',
        a: 'Minor surgery is done at {clinic}, {address}. Theatre cases are admitted through the affiliated hospitals listed on this site, including Shifa Hospital, Global Medical City, La Vida Hospital, Nasaaem Hospital and Dar El Oyoun Hospitals.',
      },
      {
        q: 'How do I book a maxillofacial consultation in Cairo?',
        a: 'Message the clinic on WhatsApp at {phone}. If you already have X-rays or a CT scan, send them ahead or bring them with you. Suitability for surgery is decided at the consultation, from your own imaging.',
      },
    ],
  },

  'jaw-surgery': {
    nav: 'Corrective jaw surgery',
    blurb: 'Orthognathic surgery for bite and facial balance',
    h1: 'Corrective jaw surgery (orthognathic surgery) in Cairo',
    metaTitle: 'Corrective Jaw Surgery in Cairo — Orthognathic | Ozea',
    metaDescription:
      'Orthognathic (corrective jaw) surgery in Cairo for underbite, receding jaw, open bite and facial asymmetry. Planned from imaging with your orthodontist.',
    eyebrow: 'Orthognathic surgery',
    answer:
      'Corrective jaw surgery, or orthognathic surgery, moves the upper jaw, the lower jaw or both into a better position. It corrects a bite that braces alone cannot fix and balances the facial profile. At {clinic} in Cairo it is planned from imaging and measurements by oral and maxillofacial surgeons Dr. Youssef Nasser and Dr. Adham Yehia Zakaria, usually together with your orthodontist, and carried out in hospital under general anaesthesia.',
    facts: [
      { label: 'Anaesthesia', value: 'General, in hospital' },
      { label: 'Hospital stay', value: 'Often one or two nights' },
      { label: 'Back to routine', value: 'Usually 2–4 weeks' },
      { label: 'Bone healing', value: 'About 6–12 weeks' },
    ],
    sections: [
      {
        heading: 'What it corrects',
        list: [
          'Underbite — a lower jaw that sits ahead of the upper',
          'A receding lower jaw or chin, and a large overjet',
          'Open bite — front teeth that do not meet when the back teeth do',
          'Facial asymmetry — a jaw or chin that sits off-centre',
          'A gummy smile caused by a long upper jaw',
          'Some cases of obstructive sleep apnoea linked to jaw position',
        ],
      },
      {
        heading: 'Who it is for',
        body: [
          'It is for adults and older teenagers whose jaws have finished growing and whose bite problem comes from the position of the bones rather than the teeth. Braces move teeth within a jaw; they cannot move the jaw itself.',
          'Most patients wear braces before the operation to line the teeth up for their new position, and for a shorter period afterwards to settle the bite.',
        ],
      },
      {
        heading: 'Recovery',
        body: [
          'Swelling is greatest in the first few days and settles over two to three weeks. The jaws are held with small titanium plates and screws, so they are not usually wired shut; light elastic bands may guide the bite.',
          'You will be on a liquid, then soft, diet for several weeks. Numbness of the lower lip or chin is common at first and usually recovers over weeks to months; the chance of it lasting is discussed with you beforehand.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation and imaging', text: 'Examination, photographs, X-rays or a CT scan, and measurements of the jaws.' },
      { name: 'Joint planning', text: 'A plan agreed with your orthodontist, with the intended jaw movements written down.' },
      { name: 'Surgery in hospital', text: 'Under general anaesthesia, through incisions inside the mouth.' },
      { name: 'Recovery and finishing', text: 'Reviews as the bone heals, then final orthodontic adjustment.' },
    ],
    faqs: [
      {
        q: 'Will I have visible scars after jaw surgery?',
        a: 'Usually not. The jaws are reached through incisions inside the mouth, so there are normally no scars on the face.',
      },
      {
        q: 'Will my jaws be wired shut?',
        a: 'Rarely. The bones are fixed with small titanium plates and screws, which lets you open your mouth soon after surgery. Light elastics between the upper and lower teeth are common for a few weeks.',
      },
      {
        q: 'How long does the whole treatment take?',
        a: 'The operation is one stage of a longer plan. Including braces before and after, treatment commonly takes around 18 months to three years. The hospital stay is often one or two nights and most people return to work or study within two to four weeks.',
      },
      {
        q: 'Do I need braces before jaw surgery?',
        a: 'In most cases, yes. Orthodontic treatment lines the teeth up so that they fit together once the jaws are moved. Your surgeon and orthodontist plan it together.',
      },
      {
        q: 'What are the risks of orthognathic surgery?',
        a: 'The main ones are temporary — and occasionally lasting — numbness of the lip or chin, swelling, bleeding, infection, and a bite that needs further adjustment. Your own risks are explained at consultation, before anything is scheduled.',
      },
      {
        q: 'Is jaw surgery only cosmetic?',
        a: 'No. Its main purpose is function: chewing, speech, jaw-joint comfort and, in some cases, breathing. The change in facial profile follows from putting the jaws where they belong.',
      },
    ],
  },

  'facial-trauma-surgery': {
    nav: 'Facial trauma & reconstruction',
    blurb: 'Fractures of the jaw, cheekbone and eye socket',
    h1: 'Facial trauma and reconstructive surgery in Cairo',
    metaTitle: 'Facial Fracture & Trauma Surgery in Cairo | Ozea',
    metaDescription:
      'Treatment of facial fractures in Cairo — lower jaw, cheekbone, eye socket and upper jaw — and reconstruction after injury, by maxillofacial surgeons.',
    eyebrow: 'Trauma & reconstruction',
    answer:
      'Facial trauma surgery repairs fractures of the facial bones — the lower jaw (mandible), the cheekbone (zygoma), the eye socket (orbit) and the upper jaw — so that the bite, the shape of the face and the position of the eye are restored. At {clinic} in Cairo, fractures are assessed with a CT scan by oral and maxillofacial surgeons Dr. Youssef Nasser and Dr. Adham Yehia Zakaria and repaired in hospital, usually with small titanium plates.',
    facts: [
      { label: 'Assessment', value: 'Examination and CT scan' },
      { label: 'Fixation', value: 'Titanium plates and screws' },
      { label: 'Where', value: 'Affiliated hospitals' },
      { label: 'Bone healing', value: 'About 6 weeks' },
    ],
    sections: [
      {
        heading: 'Injuries treated',
        list: [
          'Fractures of the lower jaw, including the joint (condyle)',
          'Cheekbone (zygoma) fractures',
          'Eye-socket (orbital) fractures, including the orbital floor',
          'Upper-jaw and mid-face fractures',
          'Injuries to the teeth and the bone that holds them',
          'Later reconstruction — bone grafting and implants to replace teeth lost in an injury',
        ],
      },
      {
        heading: 'Signs a facial bone may be broken',
        list: [
          'Teeth that no longer meet the way they did',
          'Pain or difficulty opening the mouth',
          'Numbness of the lip, chin or cheek',
          'Double vision, or an eye that looks sunken',
          'A flattened cheek or visible change in the shape of the face',
        ],
        body: [
          'A serious injury — heavy bleeding, loss of consciousness, difficulty breathing or a change in vision — needs a hospital emergency department first. Fracture repair is planned once you are stable.',
        ],
      },
      {
        heading: 'How fractures are repaired',
        body: [
          'Some fractures that have not moved heal with a soft diet and review. Displaced fractures are put back in position and held with small titanium plates and screws, a method called open reduction and internal fixation. Where possible the bone is reached through the mouth or through an incision hidden in a natural crease.',
          'Repair is usually best done within the first one to two weeks, once swelling has settled and before the bones begin to unite in the wrong position.',
        ],
      },
    ],
    steps: [
      { name: 'Assessment', text: 'Examination of the bite, sensation and eye movement, with a CT scan.' },
      { name: 'Plan', text: 'Which fractures need fixing, through which approach, and in which hospital.' },
      { name: 'Repair', text: 'Under general anaesthesia; the bones are repositioned and plated.' },
      { name: 'Follow-up', text: 'Reviews of the bite and healing, and replacement of lost teeth if needed.' },
    ],
    faqs: [
      {
        q: 'How soon should a facial fracture be treated?',
        a: 'After any emergency care, most facial fractures are best repaired within about one to two weeks. Leaving a displaced fracture much longer makes it harder to restore the original bite and shape.',
      },
      {
        q: 'Do all facial fractures need surgery?',
        a: 'No. Fractures that are stable and have not moved can heal with a soft diet and regular review. Surgery is advised when the bite is altered, the bone is displaced, or eye position or movement is affected.',
      },
      {
        q: 'Are the titanium plates removed later?',
        a: 'Usually not. The plates are small, well tolerated and are left in place unless they cause a problem such as infection or can be felt under the skin.',
      },
      {
        q: 'Can an old fracture that healed badly be corrected?',
        a: 'Often, yes. A jaw or cheekbone that united in the wrong position can be re-cut and repositioned, and bone or teeth lost in the injury can be rebuilt with grafts and implants. It needs a CT scan and an individual plan.',
      },
      {
        q: 'How long is recovery after a jaw fracture repair?',
        a: 'Bone takes about six weeks to unite. Expect a soft diet for that period; swelling settles within two to three weeks and most people return to desk work within one to two weeks.',
      },
    ],
  },

  'tmj-treatment': {
    nav: 'TMJ treatment',
    blurb: 'Jaw-joint pain, clicking and locking',
    h1: 'TMJ treatment and jaw-joint surgery in Cairo',
    metaTitle: 'TMJ Treatment & Jaw Joint Surgery in Cairo | Ozea',
    metaDescription:
      'TMJ pain, clicking or a locked jaw? Assessment and treatment in Cairo, from splints and arthrocentesis to arthroscopy and joint replacement.',
    eyebrow: 'Temporomandibular joint',
    answer:
      'The temporomandibular joint (TMJ) is the hinge in front of each ear that opens and closes the jaw. TMJ disorders cause pain, clicking, locking or limited opening, and most improve without surgery. At {clinic} in Cairo, they are assessed by Dr. Adham Yehia Zakaria, a consultant oral and maxillofacial surgeon with a dedicated TMJ practice. The least invasive treatment that can solve the problem is tried first, and arthrocentesis, arthroscopy or open joint surgery are kept for joints that do not respond.',
    facts: [
      { label: 'First-line treatment', value: 'Conservative — no surgery' },
      { label: 'Minimally invasive', value: 'Arthrocentesis, arthroscopy' },
      { label: 'Open surgery', value: 'For a small minority' },
      { label: 'Lead clinician', value: 'Dr. Adham Yehia Zakaria' },
    ],
    sections: [
      {
        heading: 'Symptoms of a TMJ disorder',
        list: [
          'Pain in front of the ear, in the jaw muscles or at the temple',
          'Clicking, popping or grating when you open or chew',
          'A jaw that locks open or closed, or catches',
          'Limited mouth opening, or a jaw that swings to one side',
          'Headaches or ear ache with no ear problem found',
        ],
      },
      {
        heading: 'Treatment, step by step',
        body: [
          'Most TMJ problems are treated without an operation: rest and a soft diet, anti-inflammatory medication, physiotherapy and jaw exercises, and a bite splint worn at night if you clench or grind.',
          'If pain or locking persists, arthrocentesis washes the joint out with sterile fluid through two fine needles. Arthroscopy goes one step further and looks inside the joint with a small camera, releasing adhesions at the same time.',
          'Open joint surgery — repositioning or removing a damaged disc, releasing a fused joint (ankylosis), or replacing the joint with a prosthesis — is reserved for joints with structural damage that the less invasive options cannot correct.',
        ],
      },
      {
        heading: 'How the joint is assessed',
        body: [
          'Assessment starts at the joint itself: how far the mouth opens, whether the jaw deviates, where it is tender and what sounds it makes. An MRI shows the position of the disc; a CT scan shows the bone. Treatment is chosen from those findings rather than from symptoms alone.',
        ],
      },
    ],
    steps: [
      { name: 'Assessment', text: 'Examination of the joint and muscles, and measurement of opening.' },
      { name: 'Imaging', text: 'MRI for the disc, CT for the bone, when the examination calls for it.' },
      { name: 'Conservative care first', text: 'Splint, medication and physiotherapy, reviewed over several weeks.' },
      { name: 'Procedure if needed', text: 'Arthrocentesis or arthroscopy, and open surgery only where indicated.' },
    ],
    faqs: [
      {
        q: 'Is a clicking jaw a problem?',
        a: 'Not always. A click with no pain and no limit to opening is common and usually needs no treatment. See a specialist if the click comes with pain, locking, or a mouth that will not open fully.',
      },
      {
        q: 'Will I need surgery for TMJ?',
        a: 'Probably not. Most people improve with conservative treatment. A minority need a minimally invasive procedure such as arthrocentesis, and only a few need open joint surgery.',
      },
      {
        q: 'What is arthrocentesis?',
        a: 'It is a wash-out of the jaw joint. Two fine needles are placed in the joint and sterile fluid is flushed through to remove inflammatory debris and free a stuck disc. It is done under local anaesthetic or sedation and you go home the same day.',
      },
      {
        q: 'What should I do if my jaw is locked?',
        a: 'A jaw that suddenly will not open fully, or will not close, should be assessed promptly — ideally within days. Early treatment of a locked joint is simpler and more successful than treatment after months.',
      },
      {
        q: 'Does a night guard cure TMJ?',
        a: 'A splint does not cure the joint, but it reduces the load from clenching and grinding and relieves muscle pain in many patients. It is one part of conservative treatment, alongside exercises and medication.',
      },
      {
        q: 'When is total jaw-joint replacement needed?',
        a: 'Rarely — for joints destroyed by severe arthritis, fused by ankylosis, or damaged by previous surgery or injury, when other treatment cannot restore movement. The joint is replaced with a prosthesis in hospital under general anaesthesia.',
      },
    ],
  },

  'jaw-cysts-and-tumours': {
    nav: 'Jaw cysts & benign tumours',
    blurb: 'Removal and biopsy of lesions in the jaw',
    h1: 'Jaw cyst and benign tumour removal in Cairo',
    metaTitle: 'Jaw Cyst & Benign Tumour Removal in Cairo | Ozea',
    metaDescription:
      'Diagnosis, biopsy and surgical removal of jaw cysts and benign tumours in Cairo by maxillofacial surgeons, planned from a CT scan.',
    eyebrow: 'Cysts & benign lesions',
    answer:
      'A jaw cyst is a fluid-filled sac that grows slowly inside the jawbone, often around the root of a dead tooth or an impacted tooth; benign tumours are solid growths that are not cancer. Both are usually found on an X-ray and are treated by removing them and sending the tissue for laboratory examination. At {clinic} in Cairo, they are assessed with a CT scan and removed by oral and maxillofacial surgeons Dr. Youssef Nasser and Dr. Adham Yehia Zakaria.',
    facts: [
      { label: 'Diagnosis', value: 'CT scan and biopsy' },
      { label: 'Small cysts', value: 'Local anaesthetic, at the clinic' },
      { label: 'Large lesions', value: 'General anaesthesia, in hospital' },
      { label: 'Follow-up', value: 'X-ray reviews as bone refills' },
    ],
    sections: [
      {
        heading: 'How they are found',
        body: [
          'Most jaw cysts cause no pain and are discovered on a routine dental X-ray. Larger ones can cause a swelling, loosen or shift teeth, become infected, or weaken the jaw.',
          'Any lump, ulcer or patch in the mouth that has not healed after two to three weeks should be examined, and a biopsy taken if there is any doubt.',
        ],
      },
      {
        heading: 'How they are treated',
        body: [
          'A small cyst is removed whole through the gum under local anaesthetic, a procedure called enucleation, and the cavity fills with new bone over the following months.',
          'A very large cyst may first be opened and drained to let it shrink — marsupialisation or decompression — and removed later, which protects nearby nerves and teeth. Some benign tumours have a tendency to return and need a wider removal and longer follow-up.',
          'Whatever is removed is sent to a pathology laboratory. The result confirms the diagnosis and decides how long you need to be followed up.',
        ],
      },
    ],
    steps: [
      { name: 'Consultation and CT scan', text: 'The size of the lesion and its relation to teeth and nerves.' },
      { name: 'Biopsy where needed', text: 'A small sample taken first if the diagnosis is uncertain.' },
      { name: 'Removal', text: 'At the clinic for small lesions, in hospital for large ones.' },
      { name: 'Pathology and review', text: 'The laboratory result, then X-ray checks as the bone heals.' },
    ],
    faqs: [
      {
        q: 'Is a jaw cyst cancer?',
        a: 'Almost always no. The great majority of jaw cysts are benign. The tissue is still examined in a laboratory after removal, because that is the only way to confirm exactly what it is.',
      },
      {
        q: 'Can a jaw cyst go away on its own?',
        a: 'Rarely. Cysts tend to enlarge slowly and silently. A small cyst at the tip of a root can sometimes heal after root canal treatment; others need to be removed.',
      },
      {
        q: 'Will I lose teeth when the cyst is removed?',
        a: 'Not necessarily. Teeth next to a cyst can often be kept, sometimes after root canal treatment. A tooth that caused the cyst, or one with no bone left around it, may need to come out.',
      },
      {
        q: 'Does the bone grow back afterwards?',
        a: 'Yes. In most cases the cavity fills with new bone over six to twelve months. Very large defects are sometimes grafted, and missing teeth can later be replaced with implants.',
      },
      {
        q: 'Can a cyst come back?',
        a: 'Most do not. A few types, such as the odontogenic keratocyst, have a known tendency to recur, which is why follow-up X-rays are scheduled after removal.',
      },
    ],
  },

  'wisdom-tooth-removal': {
    nav: 'Wisdom tooth removal',
    blurb: 'Surgical removal of impacted third molars',
    h1: 'Impacted wisdom tooth removal in Nasr City, Cairo',
    metaTitle: 'Wisdom Tooth Removal in Nasr City, Cairo | Ozea',
    metaDescription:
      'Surgical removal of impacted wisdom teeth in Nasr City, Cairo by an oral and maxillofacial surgeon. X-ray assessment, local anaesthetic, clear aftercare.',
    eyebrow: 'Impacted third molars',
    answer:
      'An impacted wisdom tooth is a third molar that has no room to come through and stays partly or fully buried in the gum or bone. It is removed when it causes pain, repeated infection, decay or damage to the tooth in front. At {clinic} in Nasr City, Cairo, impacted wisdom teeth are assessed on X-ray and removed by oral and maxillofacial surgeon Dr. Youssef Nasser, usually under local anaesthetic in a single visit.',
    facts: [
      { label: 'Anaesthesia', value: 'Local, in most cases' },
      { label: 'Procedure time', value: 'Often under an hour' },
      { label: 'Swelling peaks', value: 'Day 2–3' },
      { label: 'Recovery', value: 'About one week' },
    ],
    sections: [
      {
        heading: 'When a wisdom tooth should come out',
        list: [
          'Repeated infection of the gum over the tooth (pericoronitis)',
          'Decay in the wisdom tooth or the molar in front of it',
          'A cyst forming around the buried tooth',
          'Damage to, or bone loss behind, the neighbouring tooth',
          'When an orthodontist or surgeon asks for it as part of a wider plan',
        ],
        body: [
          'A wisdom tooth that is healthy, fully through and cleanable, or one that is deeply buried and causing nothing, can usually be left and kept under review.',
        ],
      },
      {
        heading: 'After the extraction',
        body: [
          'Expect swelling and stiffness that peak on the second or third day and settle within about a week. Pain is controlled with ordinary painkillers taken regularly for the first few days.',
          'For the first 24 hours avoid rinsing, spitting, hot drinks and smoking, so the blood clot stays in the socket. Losing that clot causes a dry socket — a throbbing pain that starts two to four days later and is easily treated at the clinic.',
        ],
      },
    ],
    steps: [
      { name: 'X-ray assessment', text: 'A panoramic X-ray, and a CT scan if the tooth lies close to the nerve.' },
      { name: 'Plan and consent', text: 'What is involved and the risks that apply to your tooth.' },
      { name: 'Removal', text: 'Under local anaesthetic; the gum is closed with dissolving stitches.' },
      { name: 'Review', text: 'A check after about a week, sooner if pain increases.' },
    ],
    faqs: [
      {
        q: 'Do all wisdom teeth need to be removed?',
        a: 'No. Wisdom teeth that have come through fully, are healthy and can be cleaned do not need removing. Removal is advised when a tooth causes infection, decay, a cyst or damage to the next tooth.',
      },
      {
        q: 'Does wisdom tooth removal hurt?',
        a: 'The procedure itself is done under local anaesthetic, so you feel pressure but not pain. Soreness and swelling afterwards last several days and are managed with painkillers.',
      },
      {
        q: 'How long does it take to recover?',
        a: 'Most people are back to normal activity in two to three days and fully comfortable within about a week. Lower impacted teeth take longer than upper ones.',
      },
      {
        q: 'What is a dry socket?',
        a: 'It is pain that starts two to four days after an extraction when the blood clot is lost from the socket. It is more common in smokers and after lower wisdom teeth. It is treated by cleaning the socket and placing a dressing.',
      },
      {
        q: 'Is there a risk to the nerve?',
        a: 'Lower wisdom teeth can lie close to the nerve that gives feeling to the lip and chin. Numbness afterwards is uncommon and usually temporary. When the X-ray shows the root near the nerve, a CT scan is taken to plan the safest approach.',
      },
      {
        q: 'Can I have all four wisdom teeth removed at once?',
        a: 'Yes, if it suits your case. Removing them in one session means one recovery; for difficult teeth or anxious patients this can be done under sedation or general anaesthesia in hospital.',
      },
    ],
  },

  'international-patients': {
    nav: 'Travelling for treatment',
    blurb: 'Patients from outside Cairo and from abroad',
    h1: 'Travelling to Cairo for dental and maxillofacial treatment',
    metaTitle: 'Dental & Maxillofacial Treatment in Egypt for Visitors | Ozea',
    metaDescription:
      'Coming to Cairo from another governorate or from abroad for implants or jaw surgery? How to send your X-rays, plan your visits and book at Ozea Dental Clinic.',
    eyebrow: 'Patients from outside Cairo',
    answer:
      '{clinic} in Nasr City, Cairo, treats patients who travel from other Egyptian governorates and from abroad for dental implants, full-arch rehabilitation and maxillofacial surgery. You can send your X-rays or CT scan ahead on WhatsApp so that your first visit is used for examination and planning. The treatment itself, and whether you are suitable for it, is decided at that consultation.',
    facts: [
      { label: 'First contact', value: 'WhatsApp, with your X-rays' },
      { label: 'Languages', value: 'Arabic and English' },
      { label: 'Clinic', value: 'Nasr City, Cairo' },
      { label: 'Airport', value: 'Cairo International, nearby' },
    ],
    sections: [
      {
        heading: 'Before you travel',
        list: [
          'Send a recent panoramic X-ray or CT scan and a short description of the problem on WhatsApp',
          'Tell the clinic about medical conditions and medication, especially blood thinners and diabetes',
          'Ask how many visits your treatment is likely to need, and how far apart',
          'Bring previous dental records and any hospital reports with you',
        ],
        body: [
          'Looking at your imaging in advance lets the team tell you what is likely to be involved and how to plan your stay. It does not replace an examination: the final plan is written after you have been seen.',
        ],
      },
      {
        heading: 'How long to plan for',
        body: [
          'It depends on the treatment. A consultation with imaging takes one visit. Implants are usually done in stages, with months of healing between placing the implant and fitting the final tooth, so most travelling patients make two or more trips.',
          'After surgery under general anaesthesia you should stay in Cairo until your surgeon is satisfied with early healing; how long is set out in your written plan. Do not book a flight home before that has been agreed.',
        ],
      },
      {
        heading: 'Getting to the clinic',
        body: [
          'The clinic is at {address}, in the Al Golf district on the border of Nasr City and Heliopolis, a short drive from Cairo International Airport. Operations that need a theatre are performed in the hospitals the practice admits to.',
        ],
      },
    ],
    steps: [
      { name: 'Send your imaging', text: 'X-rays or a CT scan on WhatsApp, with your questions.' },
      { name: 'Consultation in Cairo', text: 'Examination, any further imaging, and a written plan.' },
      { name: 'Treatment', text: 'At the clinic, or in hospital for theatre cases.' },
      { name: 'Follow-up', text: 'Reviews before you travel, and contact with the team afterwards.' },
    ],
    faqs: [
      {
        q: 'Can I get a treatment plan before I travel to Egypt?',
        a: 'You can get a preliminary opinion. Send your X-rays or CT scan on WhatsApp at {phone} and the team will tell you what treatment is likely and how many visits to expect. The definitive plan is written after an examination at the clinic.',
      },
      {
        q: 'How many trips do dental implants need?',
        a: 'Usually two or more. The implant is placed on the first trip and the final tooth is fitted after the bone has healed around it, typically three to six months later. Whether a temporary tooth can be fitted in the meantime depends on your case.',
      },
      {
        q: 'How long should I stay in Cairo after jaw surgery?',
        a: 'Long enough for your surgeon to review early healing — this is individual and is written into your plan before the operation. Do not book your return flight until it has been agreed.',
      },
      {
        q: 'Which languages does the clinic work in?',
        a: 'Consultations are held in Arabic or English, and written plans can be provided in either language.',
      },
      {
        q: 'Where is the clinic?',
        a: '{clinic} is at {address}. It is in the Al Golf district, between Nasr City and Heliopolis, close to Cairo International Airport.',
      },
    ],
  },
} satisfies Partial<Record<string, ContentCopy>>
