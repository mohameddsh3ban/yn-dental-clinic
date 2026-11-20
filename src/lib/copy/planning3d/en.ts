import type { PlanningCopy } from './types'

export const planningEn: PlanningCopy = {
  eyebrow: 'Maxillofacial surgery in 3D',
  h1: "Explore jaw surgery in 3D",
  lead: "Use a reference skull to see how the jaws move and where plates fit. Choose a procedure, then play its sequence or jump to a step.",

  viewer: {
    tools: "Model tools",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    camera: "Camera angle",
    angle: "Choose an angle",
    measurements: "View measurements",
    stageHint: "Choose a step to hold the model there.",
    retry: "Try again",
    toothHint: "Select a tooth on the model or in the chart.",
    exploreHint: "Turn the skull to see the named landmarks.",
    cutHint: "Start with the marked lines on the bone.",
    moveHint: "Watch how the bone changes position.",
    fixHint: "Look for the plates that hold the bone in place.",
    fractureHint: "Look for the marked fracture lines.",
    title: 'Interactive 3D skull model',
    loading: 'Loading the model',
    error: 'The 3D model could not be loaded on this device. The descriptions below cover the same operations.',
    hint: "Drag sideways to turn the model. Use + or − to zoom.",
    caseList: "Choose what to explore",
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
    timeline: 'Position in the operation',
    stages: { cut: 'Mark the cut', move: 'Move the bone', fix: 'Fix with plates' },
    traumaStages: { cut: 'Find the fractures', move: 'Bring them back', fix: 'Fix with plates' },
    views: { front: 'Front', quarter: 'Three-quarter', left: 'Left', right: 'Right', below: 'Below' },
    viewsLabel: 'View',
    xray: 'X-ray',
    face: 'Face',
    faceOpacity: 'Face opacity',
    teeth: {
      chart: 'Tooth chart',
      hint: 'Click a tooth to choose · drag to turn',
      pick: 'Click any tooth on the model, or pick it on the chart, then choose what to do with it.',
      implant: 'Implant',
      crown: 'Crown',
      natural: 'Natural tooth',
      implants: 'Implants placed',
      crowns: 'Crowns fitted',
      resetAll: 'Restore every tooth',
      upper: 'upper',
      lower: 'lower',
      right: 'right',
      left: 'left',
      pattern: '{jaw} {side} {type}',
      types: [
        'central incisor',
        'lateral incisor',
        'canine',
        'first premolar',
        'second premolar',
        'first molar',
        'second molar',
        'wisdom tooth',
      ],
    },
    labels: 'Labels',
    layersLabel: 'Layers',
    layers: {
      cranium: 'Skull',
      maxilla: 'Upper jaw',
      mandible: 'Lower jaw',
      teeth: 'Teeth',
      hardware: 'Plates and screws',
    },
    section: 'Open at the midline',
    reset: 'Reset the view',
    fullscreen: 'Full screen',
    exitFullscreen: 'Leave full screen',
    readout: {
      title: 'On this model',
      maxilla: 'Upper jaw',
      mandible: 'Lower jaw',
      chin: 'Chin',
      plates: 'Plates',
      screws: 'Screws',
      advance: 'forward',
      mm: 'mm',
    },
    landmarks: {
      frontal: 'Frontal bone',
      orbit: 'Eye socket',
      nasal: 'Nasal bones',
      zygoma: 'Cheekbone',
      maxilla: 'Upper jaw',
      tmj: 'Jaw joint',
      ramus: 'Ramus',
      angle: 'Angle of the jaw',
      mental: 'Mental nerve opening',
      chin: 'Chin',
    },
    related: 'Read about this treatment',
  },

  cases: {
    bimax: {
      name: 'Double-jaw surgery',
      tag: 'Upper jaw · lower jaw · chin',
      summary:
        'Both jaws are freed, moved together so the bite still meets, and fixed. On this model each jaw comes forward 5 mm and the chin a further 4 mm.',
      points: [
        'Upper jaw: one level cut above the tooth roots, called a Le Fort I',
        'Lower jaw: a split on each side that leaves the jaw joints where they are',
        'Seven small titanium plates hold the new position while the bone heals',
      ],
      page: 'jaw-surgery',
    },
    lefort: {
      name: 'Upper jaw',
      tag: 'Le Fort I osteotomy',
      summary:
        'The tooth-bearing part of the upper jaw is separated with a single level cut and moved as one piece — forward, back, up or down — then fixed at four points.',
      points: [
        'The cut runs above the tooth roots, from beside the nose to behind the last molar',
        'Two plates beside the nose and two on the cheekbone buttresses carry the load',
        'Done from inside the mouth, so there is usually no scar on the face',
      ],
      page: 'jaw-surgery',
    },
    bsso: {
      name: 'Lower jaw',
      tag: 'Bilateral sagittal split',
      summary:
        'The lower jaw is split lengthwise on each side, behind the teeth. The tooth-bearing part slides forward or back while both jaw joints stay in their sockets.',
      points: [
        'The split leaves two broad faces of bone in contact, which is what lets it heal',
        'One plate on each side bridges the step',
        'The nerve to the lip and chin runs through this bone, and the cut is planned around it',
      ],
      page: 'jaw-surgery',
    },
    genio: {
      name: 'Chin',
      tag: 'Sliding genioplasty',
      summary:
        'The lower edge of the chin is cut free below the tooth roots and slid to its new position. It moves your own bone rather than adding an implant.',
      points: [
        'The cut stays below the roots and below the nerve openings on each side',
        'A single stepped plate holds the chin at the planned distance',
        'Often combined with jaw surgery, sometimes done on its own',
      ],
      page: 'jaw-surgery',
    },
    trauma: {
      name: 'Facial fractures',
      tag: 'Cheekbone and lower jaw',
      summary:
        'A broken cheekbone and a lower jaw broken in two places — a common pattern after a blow to the side of the face. Each fragment is brought back to where it belongs and held with plates.',
      points: [
        'The cheekbone is fixed at the brow, the rim of the eye socket and the buttress',
        'Two plates at the front of the jaw and one at the angle restore the bite',
        'The aim is the anatomy you had before the injury',
      ],
      page: 'facial-trauma-surgery',
    },
    teeth: {
      name: 'Implants and crowns',
      tag: 'Your choice, tooth by tooth',
      summary:
        'Pick any tooth and decide what happens to it, the way a clinician works through a mouth. An implant replaces the whole tooth, root included; a crown covers a tooth that stays.',
      points: [
        'Implant: the tooth comes out, a titanium implant goes into the bone, then an abutment and a ceramic crown',
        'Crown: your own tooth is reduced slightly and capped with ceramic',
        'Switch on X-ray to see the implant sitting in the bone beside the natural roots',
      ],
      page: 'dental-implants',
    },
    explore: {
      name: 'Free view',
      tag: 'The intact skull',
      summary:
        'The whole skull, with nothing cut. Turn it, switch on the labels, look through the bone to the tooth roots, or open it at the midline.',
      points: [
        'X-ray makes the bone translucent and leaves the teeth solid',
        'Layers hide the skull, either jaw or the teeth',
        'Face lays a translucent skin over the bone, so you can watch the profile change',
      ],
    },
  },

  note: 'This is a reference model of normal anatomy, not a patient. The movements and plate positions are illustrative. Your own treatment is planned from your examination and your own scans.',

  process: {
    eyebrow: 'From scan to theatre',
    headline: 'How a plan is',
    outlined: 'made',
    lead: 'The model above is the idea; this is the sequence a real case follows.',
    steps: [
      { name: 'Examination and CT scan', text: 'The bite, the face and the jaw joints are examined, and a CT scan shows the bone in three dimensions.' },
      { name: 'Measurement', text: 'The surgeon measures where the jaws are and where they need to be, in millimetres.' },
      { name: 'A written plan', text: 'The cuts, the movements and the fixation are decided before the operation, and explained to you.' },
      { name: 'Surgery in hospital', text: 'The plan is carried out under general anaesthesia, and the bone is fixed with titanium plates and screws.' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    headline: 'About the',
    outlined: 'model',
    items: [
      {
        q: 'Is this a real patient?',
        a: 'No. It is a reference model of a normal adult skull, used to explain the operations. A plan for you is made from your own examination and CT scan.',
      },
      {
        q: 'Will my jaw move the same distance as the model?',
        a: 'Not necessarily. The 5 mm and 4 mm shown here are examples. Every movement is measured for the individual patient, and for jaw correction it is agreed with your orthodontist.',
      },
      {
        q: 'Are the titanium plates removed later?',
        a: 'Usually not. The plates are small, well tolerated and are left in place unless they cause a problem.',
      },
      {
        q: 'Will there be scars on my face?',
        a: 'Most jaw operations are done through incisions inside the mouth, so there is usually no visible scar. Some fracture operations need a small skin incision, placed in a natural crease where possible.',
      },
    ],
  },

  cta: {
    headline: 'Have a scan or written plan? Ask a question.',
    body: 'If you have imaging or a written treatment plan, you can share it on WhatsApp before coming to the clinic. A surgeon can explain what information may be useful for the conversation; a diagnosis and treatment plan need an examination and your own imaging.',
    button: 'Ask on WhatsApp',
    topic: 'a jaw or facial concern',
    message: 'Hello Ozea, I have a question about a jaw or facial concern. What information would be useful to share?',
  },

  credit: 'Skull anatomy adapted from "Human Male Skull" by Ruslan Gadzhiev (CC BY 4.0). Face adapted from "Male Head Base mesh" by DEGUIDER (CC BY 4.0). Osteotomies, plates and animation by Ozea.',
}
