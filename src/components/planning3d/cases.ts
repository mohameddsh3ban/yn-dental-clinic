// What each case in the planning viewer shows. Shared by the React shell (for
// its readouts) and the WebGL scene (for what moves), and free of three.js so
// the page can be rendered on the server.

export type CaseId = 'explore' | 'bimax' | 'lefort' | 'bsso' | 'genio' | 'trauma' | 'teeth'
/** What has been done to one tooth. */
export type ToothWork = 'natural' | 'implant' | 'crown'
export type ViewId = 'front' | 'left' | 'right' | 'quarter' | 'below'
export type LayerId = 'cranium' | 'maxilla' | 'mandible' | 'teeth' | 'hardware'
export type Move = 'maxilla' | 'mandible' | 'chin'

export const CASE_IDS: readonly CaseId[] = ['bimax', 'lefort', 'bsso', 'genio', 'trauma', 'teeth', 'explore']

/**
 * The tooth chart, as a dentist reads it: the patient's right is on the left.
 * Numbers are FDI — quadrant, then position counted from the midline.
 */
export const CHART: { upper: readonly number[]; lower: readonly number[] } = {
  upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
}
export const VIEW_IDS: readonly ViewId[] = ['front', 'quarter', 'left', 'right', 'below']
export const LAYER_IDS: readonly LayerId[] = ['cranium', 'maxilla', 'mandible', 'teeth', 'hardware']

export const LANDMARK_KEYS = [
  'frontal',
  'orbit',
  'nasal',
  'zygoma',
  'maxilla',
  'tmj',
  'ramus',
  'angle',
  'mental',
  'chin',
] as const
export type LandmarkKey = (typeof LANDMARK_KEYS)[number]

type V3 = [number, number, number]

export type CaseSpec = {
  set: 'ortho' | 'trauma'
  /** Which jaws this operation moves. */
  moves: readonly Move[]
  /** Plate groups fitted at the end. */
  plates: readonly string[]
  /** Segments whose cut outline is drawn. */
  lines: readonly string[]
  /** Where the camera looks, from which direction, and from how far (cm). */
  target: V3
  dir: V3
  dist: number
  /** Whether there is anything to play. */
  timeline: boolean
}

export const CASES: Record<CaseId, CaseSpec> = {
  explore: {
    set: 'ortho',
    moves: [],
    plates: [],
    lines: [],
    target: [0, 1.7, 0.4],
    dir: [0.62, 0.1, 0.78],
    dist: 54,
    timeline: false,
  },
  bimax: {
    set: 'ortho',
    moves: ['maxilla', 'mandible', 'chin'],
    plates: ['lefort', 'bsso', 'genio'],
    lines: ['maxilla', 'mand_prox_L', 'mand_prox_R', 'chin'],
    target: [0.2, -1.9, 2.6],
    dir: [0.66, 0.08, 0.75],
    dist: 35,
    timeline: true,
  },
  lefort: {
    set: 'ortho',
    moves: ['maxilla'],
    plates: ['lefort'],
    lines: ['maxilla'],
    target: [0.2, -0.3, 4.2],
    dir: [0.5, 0.1, 0.86],
    dist: 24,
    timeline: true,
  },
  bsso: {
    set: 'ortho',
    moves: ['mandible'],
    plates: ['bsso'],
    lines: ['mand_prox_L', 'mand_prox_R'],
    target: [2.2, -3.3, 2.4],
    dir: [0.88, 0.04, 0.47],
    dist: 26,
    timeline: true,
  },
  genio: {
    set: 'ortho',
    moves: ['chin'],
    plates: ['genio'],
    lines: ['chin'],
    target: [0, -5.0, 5.2],
    dir: [0.5, -0.1, 0.86],
    dist: 20,
    timeline: true,
  },
  teeth: {
    set: 'ortho',
    moves: [],
    plates: [],
    lines: [],
    target: [0, -2.9, 5.0],
    dir: [0.44, 0.04, 0.9],
    dist: 21,
    timeline: false,
  },
  trauma: {
    set: 'trauma',
    moves: [],
    plates: ['trauma'],
    lines: ['frag_R', 'frag_L', 'zygoma'],
    target: [0.6, -1.4, 2.8],
    dir: [0.6, 0.08, 0.8],
    dist: 34,
    timeline: true,
  },
}

/** The planned movements on the reference model, in millimetres. */
export const MOVE_MM: Record<Move, number> = { maxilla: 5, mandible: 5, chin: 4 }

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Where the timeline's three phases begin: mark, move, fix. */
export const PHASE_MARKS = [0, 0.22, 0.62] as const

/**
 * The timeline, split into its three phases, each 0–1: the cut is marked, the
 * bone is moved (or a fracture brought back), the plates are fitted.
 */
export function phases(_id: CaseId, p: number): { cut: number; move: number; fix: number } {
  return {
    cut: clamp01(p / PHASE_MARKS[1]),
    move: clamp01((p - PHASE_MARKS[1]) / (PHASE_MARKS[2] - PHASE_MARKS[1])),
    fix: clamp01((p - PHASE_MARKS[2]) / (1 - PHASE_MARKS[2])),
  }
}

/** One plate's own 0–1 within the fixing phase: they go on one after another. */
export function plateProgress(fix: number, index: number, count: number): number {
  if (count <= 1) return clamp01(fix)
  const span = 0.42
  const start = (index / (count - 1)) * (1 - span)
  return clamp01((fix - start) / span)
}

/** Screws per plate, for the readout. */
export const SCREWS_PER_PLATE = 4

/** How many plates each group contributes. */
export const PLATE_COUNT: Record<string, number> = { lefort: 4, bsso: 2, genio: 1, trauma: 6 }
