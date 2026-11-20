import { z } from 'zod'
import { CASE_IDS, LAYER_IDS, VIEW_IDS } from './cases'

// Only reproducible teaching-model settings belong in the URL.
const unit = z.number().min(0).max(1)
const coordinate = z.number().min(-10000).max(10000)
const vector = z.tuple([coordinate, coordinate, coordinate])
const toothId = z.number().int().refine((n) => /^[1-4][1-8]$/.test(String(n)))
const camera = z.object({ target: vector, eye: vector }).refine(({ eye, target }) =>
  Math.hypot(...eye.map((v, i) => v - target[i])) > 0.001)
const schema = z.object({
  version: z.literal(1),
  procedure: z.enum(CASE_IDS),
  phase: unit,
  camera,
  angle: z.enum(VIEW_IDS).nullable(),
  xray: z.boolean(),
  face: z.boolean(),
  opacity: unit.min(0.1),
  labels: z.boolean(),
  hidden: z.array(z.enum(LAYER_IDS)).max(LAYER_IDS.length),
  section: unit,
  teeth: z.array(z.tuple([toothId, z.enum(['implant', 'crown'])])).max(32),
  selected: toothId.nullable(),
  exploded: unit.nullable(),
  detail: z.enum(['crown', 'abutment', 'fixture']).nullable().optional(),
  rotation: z.number().min(-180).max(180).optional(),
})
export type SharedView = z.infer<typeof schema>
export type CameraPose = SharedView['camera']

export function viewUrl(location: URL, view: SharedView) {
  const url = new URL(location.pathname, location.origin)
  url.hash = 'view=' + btoa(JSON.stringify(view)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return url.href
}

export function readView(hash: string): SharedView | null {
  if (!hash.startsWith('#view=') || hash.length > 4096) return null
  try {
    const encoded = hash.slice(6).replace(/-/g, '+').replace(/_/g, '/')
    const result = schema.safeParse(JSON.parse(atob(encoded)))
    return result.success ? result.data : null
  } catch {
    return null
  }
}
