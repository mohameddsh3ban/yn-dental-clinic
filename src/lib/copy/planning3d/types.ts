import type { CaseId, LandmarkKey, LayerId, ViewId } from '@/components/planning3d/cases'
import type { PageId } from '@/lib/copy/pages/types'

/**
 * Copy for the interactive 3D page. It lives beside, not inside, the long-form
 * `PagesCopy`: the page is one of a kind, and its words ship in its own chunk.
 *
 * COPY REVIEW: the model is a reference skull, not a patient, and the page
 * says so. The text describes the operations in general terms and makes no
 * claim about equipment or results. Arabic, French and Russian were written
 * alongside the English and want a read by a native-speaking clinician.
 */
export type PlanningCopy = {
  eyebrow: string
  h1: string
  lead: string
  viewer: {
    tools: string
    zoomIn: string
    zoomOut: string
    camera: string
    angle: string
    measurements: string
    stageHint: string
    retry: string
    toothHint: string
    exploreHint: string
    cutHint: string
    moveHint: string
    fixHint: string
    fractureHint: string
    title: string
    loading: string
    error: string
    hint: string
    caseList: string
    play: string
    pause: string
    replay: string
    timeline: string
    stages: { cut: string; move: string; fix: string }
    traumaStages: { cut: string; move: string; fix: string }
    views: Record<ViewId, string>
    viewsLabel: string
    xray: string
    /** Toggle for the translucent face over the bone. */
    face: string
    faceOpacity: string
    /** The implants-and-crowns case: pick a tooth, choose what is done to it. */
    teeth: {
      chart: string
      hint: string
      pick: string
      implant: string
      crown: string
      natural: string
      implants: string
      crowns: string
      resetAll: string
      upper: string
      lower: string
      right: string
      left: string
      /** How a tooth is named, from `{jaw}`, `{side}` and `{type}`. */
      pattern: string
      /** The eight teeth of a quadrant, from the midline back. */
      types: string[]
    }
    labels: string
    layersLabel: string
    layers: Record<LayerId, string>
    section: string
    reset: string
    fullscreen: string
    exitFullscreen: string
    readout: {
      title: string
      maxilla: string
      mandible: string
      chin: string
      plates: string
      screws: string
      advance: string
      mm: string
    }
    landmarks: Record<LandmarkKey, string>
    related: string
  }
  cases: Record<
    CaseId,
    {
      name: string
      tag: string
      summary: string
      points: string[]
      /** The treatment page that covers this operation. */
      page?: PageId
    }
  >
  note: string
  process: {
    eyebrow: string
    headline: string
    outlined: string
    lead: string
    steps: { name: string; text: string }[]
  }
  faq: { eyebrow: string; headline: string; outlined: string; items: { q: string; a: string }[] }
  cta: { headline: string; body: string; button: string; topic: string; message: string }
  credit: string
}

/** The few strings other pages and <head> need; kept out of the page chunk. */
export type PlanningMeta = {
  nav: string
  blurb: string
  metaTitle: string
  metaDescription: string
}
