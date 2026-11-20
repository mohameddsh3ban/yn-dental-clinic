import { lazy, Suspense, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import * as Popover from '@radix-ui/react-popover'
import * as Switch from '@radix-ui/react-switch'
import {
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ScanLine,
  SlidersHorizontal,
  Tag,
  User,
  X,
} from 'lucide-react'
import { useStill } from '@/lib/anim'
import { useI18n } from '@/lib/i18n'
import { pageMeta } from '@/lib/pages'
import type { PlanningCopy } from '@/lib/copy/planning3d/types'
import {
  CASES,
  CASE_IDS,
  CHART,
  LANDMARK_KEYS,
  LAYER_IDS,
  MOVE_MM,
  PHASE_MARKS,
  PLATE_COUNT,
  SCREWS_PER_PLATE,
  VIEW_IDS,
  phases,
  plateProgress,
  type CaseId,
  type LayerId,
  type Move,
  type ToothWork,
  type ViewId,
} from './cases'
import type { LabelPoint, Viewer } from './scene'
import type { ImplantPart } from './implantStudyScene'
import { ToothChart } from './ToothChart'
import { ModelPicker } from './ModelPicker'
import { WhatsAppIcon } from '@/components/icons'
import { whatsappUrl } from '@/lib/site'
import { readView, viewUrl, type SharedView } from './sharedView'

const ImplantStudy = lazy(() => import('./ImplantStudy').then((m) => ({ default: m.ImplantStudy })))
type GuideRequest = { topic: 'profile' | 'bite' | 'asymmetry' | 'implant' }
type PlanningViewerProps = { copy: PlanningCopy; guideRequest?: GuideRequest | null }
const studyLabels = {
  en: { open: 'Explore the implant in 3D', close: 'Back to the skull', share: 'Share this view on WhatsApp', ask: 'Ask Ozea about this view', message: 'Could you explain this view of the teaching model?' },
  ar: { open: 'استكشف أجزاء الزرعة', close: 'ارجع لنموذج الجمجمة', share: 'شارك هذا المنظر على واتساب', ask: 'اسأل العيادة عن هذا المنظر', message: 'ممكن تشرحوا لي الجزء ده على النموذج التوضيحي؟' },
  fr: { open: 'Explorer l’implant en 3D', close: 'Revenir au crâne', share: 'Partager cette vue sur WhatsApp', ask: 'Demander à Ozea', message: 'Pourriez-vous expliquer cette vue du modèle pédagogique ?' },
  ru: { open: 'Рассмотреть имплантат в 3D', close: 'Вернуться к черепу', share: 'Поделиться видом в WhatsApp', ask: 'Спросить клинику об этом виде', message: 'Объясните, пожалуйста, что видно на этой учебной модели.' },
}

/** One run of the timeline, start to finish. */
const PLAY_MS = 9000
/** The timeline is redrawn at most this often while it plays. */
const PLAY_STEP_MS = 1000 / 61

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const spring = { type: 'spring', stiffness: 420, damping: 36, mass: 0.7 } as const

type Status = 'loading' | 'ready' | 'error'

// Everything that floats over the canvas is opaque-ish white, never a backdrop
// blur: a blur there would be recomputed on every frame the model turns.
const float = 'border border-[#14120F]/10 bg-white/[0.93]'
const focus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#14120F]'

/** One icon in the tool dock: a label that appears beside it, and its key. */
function ToolButton({
  label,
  shortcut,
  pressed,
  onClick,
  children,
  className = '',
}: {
  label: string
  shortcut?: string
  pressed?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      aria-keyshortcuts={shortcut}
      onClick={onClick}
      className={`group relative grid h-11 w-11 place-items-center rounded-[10px] text-[#3a352f] transition-[background-color,color,transform] sm:h-10 sm:w-10 duration-150 hover:bg-[#14120F]/[0.07] active:scale-[0.93] aria-pressed:bg-[#14120F] aria-pressed:text-white ${focus} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute end-full top-1/2 z-10 me-2.5 flex -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-lg bg-[#14120F] px-2.5 py-1.5 text-[11px] font-medium text-white opacity-0 transition-opacity delay-200 duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:hidden"
      >
        {label}
        {shortcut && (
          <kbd dir="ltr" className="rounded bg-white/15 px-1.5 py-px font-sans text-[10px] uppercase">
            {shortcut}
          </kbd>
        )}
      </span>
    </button>
  )
}

/** A row in the display popover: a name and a switch. */
function SwitchRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center justify-between gap-4 text-[13px] text-[#3a352f]">
      {label}
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className={`relative h-[22px] w-[38px] shrink-0 rounded-full bg-[#14120F]/20 transition-colors data-[state=checked]:bg-[#14120F] ${focus}`}
      >
        <Switch.Thumb className="block h-[18px] w-[18px] translate-x-[2px] rounded-full bg-white transition-transform data-[state=checked]:translate-x-[18px] rtl:-translate-x-[2px] rtl:data-[state=checked]:-translate-x-[18px]" />
      </Switch.Root>
    </label>
  )
}

/**
 * The planning table: a skull the visitor can turn, a set of operations, and
 * one transport bar that runs each of them — mark the cut, move the bone, fix
 * it. One case hands the choice over instead: pick any tooth and decide what
 * is done to it.
 *
 * It is laid out like an application rather than a page section: procedures
 * across the top, the model in the middle with its tools floating over it, an
 * inspector beside it. Everything renders on the server as an empty stage with
 * its controls; the WebGL scene (`./scene`) is fetched and started in an
 * effect, so three.js is loaded only by visitors who open this page.
 */
export function PlanningViewer({ copy, guideRequest }: PlanningViewerProps) {
  const still = useStill()
  const { lang } = useI18n()
  return <PlanningTable key={lang + String(still)} copy={copy} still={still} guideRequest={guideRequest} />
}

function PlanningTable({ copy, still, guideRequest }: PlanningViewerProps & { still: boolean }) {
  const { path, p, t, c, lang } = useI18n()
  const v = copy.viewer

  const wrap = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const implantEntry = useRef<HTMLButtonElement>(null)
  const implantBack = useRef<HTMLButtonElement>(null)
  const viewer = useRef<Viewer | null>(null)
  const labelEls = useRef(new Map<string, HTMLSpanElement>())
  const progressRef = useRef(0)
  /** True while the pointer or the focus is inside the viewer: keys act then. */
  const engaged = useRef(false)

  const [status, setStatus] = useState<Status>('loading')
  const [loaded, setLoaded] = useState(0)
  const [caseId, setCaseId] = useState<CaseId>('bimax')
  const [progress, setProgressState] = useState(0)
  const [comparing, setComparing] = useState(false)
  const compareHeld = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [xray, setXray] = useState(false)
  const [labels, setLabels] = useState(false)
  const [face, setFace] = useState(false)
  const [faceOpacity, setFaceOpacity] = useState(1)
  const [layers, setLayers] = useState<Record<LayerId, boolean>>({
    cranium: true,
    maxilla: true,
    mandible: true,
    teeth: true,
    hardware: true,
  })
  const [section, setSection] = useState(0)
  const [full, setFull] = useState(false)
  const [cameraView, setCameraView] = useState<ViewId | ''>('')
  const [attempt, setAttempt] = useState(0)
  const [canExpand, setCanExpand] = useState(false)
  const [touched, setTouched] = useState(false)
  const [work, setWork] = useState<Record<number, ToothWork>>({})
  const [tooth, setTooth] = useState<number | null>(null)
  const ready = status === 'ready'
  const [exploded, setExploded] = useState<number | null>(null)
  const [detail, setDetail] = useState<ImplantPart | null>(null)
  const [implantRotation, setImplantRotation] = useState(0)
  const study = studyLabels[lang]

  const spec = CASES[caseId]
  const text = copy.cases[caseId]

  const setProgress = useCallback((value: number) => {
    const next = Math.min(1, Math.max(0, value))
    progressRef.current = next
    setProgressState(next)
    if (!compareHeld.current) viewer.current?.setProgress(next)
  }, [])

  const selectTooth = useCallback((id: number | null) => {
    setExploded(null)
    setDetail(null)
    setImplantRotation(0)
    setTooth(id)
    viewer.current?.setSelectedTooth(id)
  }, [])

  // ---- start the scene -----------------------------------------------------

  const caseAtStart = useRef(caseId)
  const restoreShared = useCallback((saved: SharedView, scene: Viewer) => {
    const visible = Object.fromEntries(LAYER_IDS.map((layer) => [layer, !saved.hidden.includes(layer)])) as Record<LayerId, boolean>
    setPlaying(false)
    compareHeld.current = false
    setComparing(false)
    caseAtStart.current = saved.procedure
    setCaseId(saved.procedure)
    scene.setCase(saved.procedure, true)
    setProgress(saved.phase)
    setLayers(visible)
    for (const layer of LAYER_IDS) scene.setLayer(layer, visible[layer])
    setXray(saved.xray)
    scene.setXray(saved.xray)
    setFace(saved.face)
    scene.setFace(saved.face)
    setFaceOpacity(saved.opacity)
    scene.setFaceOpacity(saved.opacity)
    setLabels(saved.labels)
    scene.setLabels(saved.labels)
    setSection(saved.section)
    scene.setSection(saved.section)
    const treatments = Object.fromEntries(saved.teeth)
    setWork(treatments)
    for (const id of [...CHART.upper, ...CHART.lower]) scene.setTooth(id, treatments[id] ?? 'natural', true)
    selectTooth(saved.selected)
    if (saved.procedure === 'teeth' && saved.selected !== null) {
      setExploded(saved.exploded)
      setDetail(saved.detail ?? null)
      setImplantRotation(saved.rotation ?? 0)
    }
    setCameraView(saved.angle ?? '')
    scene.restoreCamera(saved.camera)
    setTouched(true)
  }, [selectTooth, setProgress])

  useEffect(() => {
    const onHashChange = () => {
      const saved = readView(window.location.hash)
      if (saved && viewer.current) restoreShared(saved, viewer.current)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [restoreShared])

  function prepareShare(link: HTMLAnchorElement, clinic: boolean) {
    if (!viewer.current) return
    const teeth: SharedView['teeth'] = []
    for (const [id, kind] of Object.entries(work)) {
      if (kind !== 'natural') teeth.push([Number(id), kind])
    }
    const url = viewUrl(new URL(window.location.href), {
      version: 1, procedure: caseId, phase: compareHeld.current ? 0 : progressRef.current, camera: viewer.current.captureCamera(),
      angle: cameraView || null, xray, face, labels, opacity: faceOpacity,
      hidden: LAYER_IDS.filter((id) => !layers[id]), section, teeth, selected: tooth, exploded,
      detail: exploded === null ? null : detail, rotation: exploded === null ? 0 : implantRotation,
    })
    const message = clinic ? (lang === 'ar' ? study.message : studyLabels.en.message) : text.name
    const body = message + '\n' + url
    link.href = clinic ? whatsappUrl(body) : 'https://wa.me/?text=' + encodeURIComponent(body)
  }

  function shareLink(clinic: boolean) {
    return {
      onFocus: (event: React.FocusEvent<HTMLAnchorElement>) => prepareShare(event.currentTarget, clinic),
      onPointerDown: (event: React.PointerEvent<HTMLAnchorElement>) => prepareShare(event.currentTarget, clinic),
      onContextMenu: (event: React.MouseEvent<HTMLAnchorElement>) => prepareShare(event.currentTarget, clinic),
      onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
        setPlaying(false)
        prepareShare(event.currentTarget, clinic)
      },
    }
  }

  function showImplant(open: boolean) {
    if (open) {
      selectTooth(tooth ?? 46)
      setExploded(1)
    } else {
      setExploded(null)
    }
    requestAnimationFrame(() => {
      const next = open ? implantBack : implantEntry
      next.current?.focus({ preventScroll: true })
      wrap.current?.scrollIntoView({ behavior: still ? 'instant' : 'smooth', block: 'start' })
    })
  }
  const labelText = v.title
  useEffect(() => {
    const el = host.current
    if (!el) return
    let alive = true
    let made: Viewer | null = null

    const onLabels = (points: LabelPoint[]) => {
      for (const point of points) {
        const node = labelEls.current.get(point.key)
        if (!node) continue
        node.style.opacity = point.visible ? '1' : '0'
        node.style.transform = `translate3d(${point.x.toFixed(1)}px, ${point.y.toFixed(1)}px, 0)`
      }
    }

    import('./scene')
      .then((m) =>
        m.createViewer({
          host: el,
          label: labelText,
          still,
          onProgress: (f) => alive && setLoaded(f),
          onLabels,
          onInteract: () => {
            if (!alive) return
            setCameraView('')
            setTouched(true)
          },
          onPickTooth: (id) => alive && selectTooth(id),
        }),
      )
      .then((created) => {
        if (!alive) {
          created.dispose()
          return
        }
        made = created
        viewer.current = created
        created.setCase(caseAtStart.current, true)
        created.setLabels(caseAtStart.current === 'explore')
        created.setProgress(progressRef.current)
        const shared = readView(window.location.hash)
        if (shared) {
          restoreShared(shared, created)
          requestAnimationFrame(() => wrap.current?.scrollIntoView({ block: 'start' }))
        }
        setStatus('ready')
      })
      .catch(() => {
        if (!alive) return
        const shared = readView(window.location.hash)
        if (shared?.procedure === 'teeth' && shared.selected && shared.exploded !== null) {
          setCaseId('teeth')
          selectTooth(shared.selected)
          setExploded(shared.exploded)
          requestAnimationFrame(() => wrap.current?.scrollIntoView({ block: 'start' }))
        }
        setStatus('error')
      })

    return () => {
      alive = false
      viewer.current = null
      made?.dispose()
    }
  }, [still, labelText, selectTooth, attempt, restoreShared])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const step = (now: number) => {
      // A 240 Hz screen would otherwise re-render the panel four times as
      // often as anyone can see.
      if (now - last >= PLAY_STEP_MS - 1) {
        const next = Math.min(1, progressRef.current + (now - last) / PLAY_MS)
        last = now
        setProgress(next)
        if (next >= 1) {
          setPlaying(false)
          return
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [playing, setProgress])

  useEffect(() => {
    setCanExpand(Boolean(document.fullscreenEnabled && wrap.current?.requestFullscreen))
    const onChange = () => {
      const on = document.fullscreenElement === wrap.current
      setFull(on)
      viewer.current?.setImmersive(on)
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  // ---- actions -------------------------------------------------------------

  const endCompare = useCallback(() => {
    if (!compareHeld.current) return
    compareHeld.current = false
    setComparing(false)
    viewer.current?.setProgress(progressRef.current)
  }, [])

  useEffect(() => {
    window.addEventListener('blur', endCompare)
    return () => window.removeEventListener('blur', endCompare)
  }, [endCompare])

  function startCompare() {
    if (compareHeld.current) return
    compareHeld.current = true
    setPlaying(false)
    setComparing(true)
    viewer.current?.setProgress(0)
  }

  function choose(id: CaseId) {
    endCompare()
    if (id === caseId) return
    caseAtStart.current = id
    setCameraView('')
    setCaseId(id)
    viewer.current?.setCase(id)
    setProgress(0)
    setPlaying(false)
    if (id === 'explore' && !labels) toggleLabels(true)
    if (id !== 'teeth') selectTooth(null)
  }

  useEffect(() => {
    const scene = viewer.current
    if (status === 'loading' || !guideRequest) return
    const topic = guideRequest.topic
    if (topic === 'implant') {
      endCompare()
      setPlaying(false)
      caseAtStart.current = 'teeth'
      setCaseId('teeth')
      scene?.setCase('teeth', true)
      setCameraView('')
      setProgress(0)
      selectTooth(46)
      setExploded(1)
      requestAnimationFrame(() => {
        implantBack.current?.focus({ preventScroll: true })
        wrap.current?.scrollIntoView({ behavior: still ? 'instant' : 'smooth', block: 'start' })
      })
      return
    }
    if (!scene) return
    const id = topic === 'profile' ? 'genio' : topic === 'bite' ? 'bimax' : 'explore'
    const angle = topic === 'profile' ? 'left' : topic === 'bite' ? 'right' : 'front'
    endCompare()
    setPlaying(false)
    selectTooth(null)
    setCaseId(id)
    caseAtStart.current = id
    setXray(false)
    scene.setXray(false)
    setSection(0)
    scene.setSection(0)
    const all = { cranium: true, maxilla: true, mandible: true, teeth: true, hardware: true }
    setLayers(all)
    for (const layer of LAYER_IDS) scene.setLayer(layer, true)
    setFace(topic === 'profile')
    scene.setFace(topic === 'profile')
    changeFaceOpacity(1)
    scene.setCase(id, true)
    setCameraView(angle)
    scene.setView(angle)
    setLabels(topic === 'asymmetry')
    scene.setLabels(topic === 'asymmetry')
    setProgress(0)
    wrap.current?.scrollIntoView({ behavior: still ? 'instant' : 'smooth', block: 'start' })
  }, [guideRequest, status, endCompare, selectTooth, setProgress, still])

  function togglePlay() {
    if (!spec.timeline) return
    if (playing) return setPlaying(false)
    if (progressRef.current >= 1) setProgress(0)
    setPlaying(true)
  }

  function scrub(to: number) {
    setPlaying(false)
    setProgress(to)
  }

  function toggleXray() {
    const next = !xray
    setXray(next)
    viewer.current?.setXray(next)
  }

  function toggleFace() {
    const next = !face
    setFace(next)
    viewer.current?.setFace(next)
  }

  function changeFaceOpacity(value: number) {
    setFaceOpacity(value)
    viewer.current?.setFaceOpacity(value)
  }

  function toggleLabels(force?: boolean) {
    const next = force ?? !labels
    setLabels(next)
    viewer.current?.setLabels(next)
  }

  function toggleLayer(id: LayerId) {
    const next = { ...layers, [id]: !layers[id] }
    setLayers(next)
    viewer.current?.setLayer(id, next[id])
  }

  function changeSection(value: number) {
    setSection(value)
    viewer.current?.setSection(value)
  }

  function view(id: ViewId) {
    setCameraView(id)
    viewer.current?.setView(id)
  }

  function resetView() {
    viewer.current?.reset()
    setCameraView('')
  }

  async function toggleFull() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await wrap.current?.requestFullscreen?.()
    } catch {
      setCanExpand(false)
    }
  }

  function treat(id: number, next: ToothWork) {
    setWork((now) => ({ ...now, [id]: next }))
    viewer.current?.setTooth(id, next)
  }

  function resetTeeth() {
    for (const id of Object.keys(work)) viewer.current?.setTooth(Number(id), 'natural')
    setWork({})
  }

  // On a phone the tabs scroll sideways; keep the chosen one in view.
  const tabs = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const on = tabs.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    const row = tabs.current
    if (!on || !row) return
    const a = on.getBoundingClientRect()
    const b = row.getBoundingClientRect()
    row.scrollBy({ left: a.left + a.width / 2 - (b.left + b.width / 2), behavior: still ? 'auto' : 'smooth' })
  }, [caseId, still])

  // ---- keyboard ------------------------------------------------------------
  // Keys act only while the pointer or the focus is inside the viewer, and
  // never while something is being typed or a slider is being moved.

  const keys = useRef<(event: KeyboardEvent) => void>(() => {})
  keys.current = (event) => {
    if (exploded !== null || !ready || event.metaKey || event.ctrlKey || event.altKey) return
    if (compareHeld.current || (!engaged.current && !full)) return
    const el = event.target as HTMLElement | null
    const tag = el?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return
    const key = event.key.toLowerCase()
    const onButton = tag === 'BUTTON' || tag === 'A'
    let handled = true
    if (key === ' ' && !onButton) togglePlay()
    else if (key === 'arrowright' && spec.timeline) scrub(progressRef.current + 0.03)
    else if (key === 'arrowleft' && spec.timeline) scrub(progressRef.current - 0.03)
    else if (key === 'x') toggleXray()
    else if (key === 'f') toggleFace()
    else if (key === 'l' && caseId === 'explore') toggleLabels()
    else if (key === 'r' || key === '0') resetView()
    else if (key === '+' || key === '=') viewer.current?.zoom(1 / 1.2)
    else if (key === '-') viewer.current?.zoom(1.2)
    else if (key === 'escape' && tooth !== null) selectTooth(null)
    else if (/^[1-7]$/.test(key)) choose(CASE_IDS[Number(key) - 1])
    else handled = false
    if (handled) event.preventDefault()
  }
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => keys.current(event)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ---- readouts ------------------------------------------------------------

  const phase = phases(caseId, comparing ? 0 : progress)
  const moved = ease(phase.move)
  const plateTotal = spec.plates.reduce((n, g) => n + (PLATE_COUNT[g] ?? 0), 0)
  let platesOn = 0
  let screwsOn = 0
  for (let i = 0; i < plateTotal; i++) {
    const at = plateProgress(phase.fix, i, plateTotal)
    if (at >= 0.45) platesOn++
    for (let j = 0; j < SCREWS_PER_PLATE; j++) if ((at - 0.36 - j * 0.09) / 0.34 >= 1) screwsOn++
  }
  const stage = phase.fix > 0 ? 2 : phase.move > 0 ? 1 : 0
  const stageNames = spec.set === 'trauma' ? v.traumaStages : v.stages
  const stageList = [stageNames.cut, stageNames.move, stageNames.fix]
  const stageHint =
    stage === 0 ? (spec.set === 'trauma' ? v.fractureHint : v.cutHint) : stage === 1 ? v.moveHint : v.fixHint
  const moveLabel: Record<Move, string> = {
    maxilla: v.readout.maxilla,
    mandible: v.readout.mandible,
    chin: v.readout.chin,
  }
  const showLabels = labels && caseId === 'explore'

  // ---- teeth ---------------------------------------------------------------

  const tv = v.teeth
  function toothName(id: number) {
    const quadrant = Math.floor(id / 10)
    const name = t(tv.pattern, {
      jaw: quadrant <= 2 ? tv.upper : tv.lower,
      side: quadrant === 1 || quadrant === 4 ? tv.right : tv.left,
      type: tv.types[(id % 10) - 1] ?? '',
    })
    return name.charAt(0).toUpperCase() + name.slice(1)
  }
  const implants = Object.values(work).filter((w) => w === 'implant').length
  const crowns = Object.values(work).filter((w) => w === 'crown').length
  const selectedWork: ToothWork = tooth === null ? 'natural' : (work[tooth] ?? 'natural')

  /** Implant, crown or natural, for the selected tooth. */
  const treatments =
    tooth !== null && (
      <div className="flex rounded-xl bg-[#14120F]/[0.07] p-1">
        {(['implant', 'crown', 'natural'] as const).map((kind) => (
          <button
            key={kind}
            type="button"
            aria-pressed={selectedWork === kind}
            onClick={() => treat(tooth, kind)}
            className={`relative min-h-11 flex-1 rounded-[9px] px-3 text-[13px] font-medium transition-colors sm:min-h-9 sm:text-[12px] ${focus} ${
              selectedWork === kind ? 'text-white' : 'text-[#3a352f] hover:text-[#14120F]'
            }`}
          >
            {selectedWork === kind && (
              <motion.span layoutId="planning-treatment" transition={spring} className="absolute inset-0 rounded-[9px] bg-[#14120F]" />
            )}
            <span className="relative whitespace-nowrap">{tv[kind]}</span>
          </button>
        ))}
      </div>
    )

  // ---- the live part of the inspector ---------------------------------------
  // The numbers that move with the timeline, or the tooth chart. On a phone
  // they sit directly under the pinned model; on a desktop, in the side panel.

  const hasLive = spec.timeline || caseId === 'teeth'
  const live = (
    <>
              {spec.timeline && (
                <dl aria-label={v.readout.title} className="grid grid-cols-2 gap-2">
                  {spec.moves.map((m) => (
                    <div key={m} className="rounded-xl bg-white p-3 ring-1 ring-[#14120F]/10">
                      <dt className="text-[11px] leading-tight text-[#6b6459]">
                        {moveLabel[m]} · {v.readout.advance}
                      </dt>
                      <dd dir="ltr" className="font-display mt-1.5 text-[22px] font-medium leading-none tabular-nums text-[#14120F] rtl:text-end">
                        {(MOVE_MM[m] * moved).toFixed(1)}
                        <span className="ms-1 text-[11px] font-normal text-[#6b6459]">{v.readout.mm}</span>
                      </dd>
                    </div>
                  ))}
                  <div className="rounded-xl bg-white p-3 ring-1 ring-[#14120F]/10">
                    <dt className="text-[11px] leading-tight text-[#6b6459]">{v.readout.plates}</dt>
                    <dd dir="ltr" className="font-display mt-1.5 text-[22px] font-medium leading-none tabular-nums text-[#14120F] rtl:text-end">
                      {platesOn}
                      <span className="text-[13px] font-normal text-[#6b6459]"> / {plateTotal}</span>
                    </dd>
                  </div>
                  <div className="rounded-xl bg-white p-3 ring-1 ring-[#14120F]/10">
                    <dt className="text-[11px] leading-tight text-[#6b6459]">{v.readout.screws}</dt>
                    <dd dir="ltr" className="font-display mt-1.5 text-[22px] font-medium leading-none tabular-nums text-[#14120F] rtl:text-end">
                      {screwsOn}
                      <span className="text-[13px] font-normal text-[#6b6459]"> / {plateTotal * SCREWS_PER_PLATE}</span>
                    </dd>
                  </div>
                </dl>
              )}

              {caseId === 'teeth' && (
                <div>
                  <div className="rounded-2xl bg-white p-2 ring-1 ring-[#14120F]/10 sm:p-3">
                    <ToothChart
                      work={work}
                      selected={tooth}
                      onSelect={selectTooth}
                      name={toothName}
                      labels={{
                        chart: tv.chart,
                        upper: v.layers.maxilla,
                        lower: v.layers.mandible,
                        right: tv.right,
                        left: tv.left,
                      }}
                    />
                  </div>

                  <details className="mt-2 rounded-xl border border-[#d4ccbf] bg-white text-sm sm:hidden">
                    <summary className="min-h-11 cursor-pointer px-3 py-3 font-medium">{{ en: 'Choose by tooth number', ar: 'اختر السن برقمها', fr: 'Choisir par numéro de dent', ru: 'Выбрать зуб по номеру' }[lang]}</summary>
                    <div className="space-y-3 px-3 pb-3">
                      {(['upper', 'lower'] as const).map(arch => (
                        <div key={arch}>
                          <p className="mb-1 text-xs text-[#635b50]">{arch === 'upper' ? v.layers.maxilla : v.layers.mandible}</p>
                          <div className="grid grid-cols-4 gap-1" dir="ltr">
                            {CHART[arch].map(id => (
                              <button type="button" key={id} aria-label={`${toothName(id)} (${id})`} aria-pressed={tooth === id} onClick={event => {
                                selectTooth(id)
                                const details = event.currentTarget.closest('details')
                                if (details) {
                                  details.open = false
                                  details.querySelector('summary')?.focus({ preventScroll: true })
                                }
                              }} className="min-h-11 rounded-md bg-[#f5f2ec] tabular-nums aria-pressed:bg-[#272d2f] aria-pressed:text-white">{id}</button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>

                  <dl className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-white p-3 ring-1 ring-[#14120F]/10">
                      <dt className="text-[11px] leading-tight text-[#6b6459]">{tv.implants}</dt>
                      <dd dir="ltr" className="font-display mt-1.5 text-[22px] font-medium leading-none tabular-nums text-[#14120F] rtl:text-end">
                        {implants}
                      </dd>
                    </div>
                    <div className="rounded-xl bg-white p-3 ring-1 ring-[#14120F]/10">
                      <dt className="text-[11px] leading-tight text-[#6b6459]">{tv.crowns}</dt>
                      <dd dir="ltr" className="font-display mt-1.5 text-[22px] font-medium leading-none tabular-nums text-[#14120F] rtl:text-end">
                        {crowns}
                      </dd>
                    </div>
                  </dl>
                  {implants + crowns > 0 && (
                    <button
                      type="button"
                      onClick={resetTeeth}
                      className={`mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-[12px] font-medium text-[#14120F] underline decoration-[#14120F]/25 underline-offset-4 hover:decoration-[#14120F] ${focus}`}
                    >
                      <RotateCcw size={13} />
                      {tv.resetAll}
                    </button>
                  )}
                </div>
              )}
    </>
  )

  // ---- the display popover -------------------------------------------------

  const display = (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={v.tools}
          className={`group relative grid h-11 w-11 place-items-center rounded-[10px] text-[#3a352f] transition-[background-color,transform] sm:h-10 sm:w-10 duration-150 hover:bg-[#14120F]/[0.07] active:scale-[0.93] data-[state=open]:bg-[#14120F] data-[state=open]:text-white ${focus}`}
        >
          <SlidersHorizontal size={17} />
        </button>
      </Popover.Trigger>
      <Popover.Portal container={full ? wrap.current : undefined}>
        <Popover.Content
          side="left"
          align="start"
          sideOffset={10}
          collisionPadding={12}
          className="z-[80] max-h-[calc(100dvh-24px)] w-[min(18rem,calc(100vw-24px))] overflow-y-auto overscroll-contain rounded-2xl border border-[#14120F]/12 bg-[#fbf9f4] p-4 text-[#14120F] shadow-[0_18px_50px_-12px_rgba(20,18,15,0.35)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >

          <div className="mt-2 grid grid-cols-2 gap-2 sm:hidden">
            <button type="button" onClick={() => viewer.current?.zoom(1 / 1.2)} className={`flex min-h-11 items-center justify-center gap-1 rounded-lg border border-[#14120F]/15 text-xs ${focus}`}><Plus size={14} />{v.zoomIn}</button>
            <button type="button" onClick={() => viewer.current?.zoom(1.2)} className={`flex min-h-11 items-center justify-center gap-1 rounded-lg border border-[#14120F]/15 text-xs ${focus}`}><Minus size={14} />{v.zoomOut}</button>
          </div>

          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#6b6459]">{v.layersLabel}</p>
          <div className="mt-1 divide-y divide-[#14120F]/10">
            {LAYER_IDS.map((id) => (
              <SwitchRow key={id} label={v.layers[id]} checked={layers[id]} onChange={() => toggleLayer(id)} />
            ))}
          </div>

          <div className="planning-controls mt-3 space-y-2 border-t border-[#14120F]/10 pt-3">
            <label className={`block text-[12px] text-[#3a352f] ${face ? '' : 'opacity-45'}`}>
              {v.faceOpacity}
              <input
                type="range"
                min={10}
                max={100}
                disabled={!face}
                value={Math.round(faceOpacity * 100)}
                onChange={(e) => changeFaceOpacity(Number(e.target.value) / 100)}
                dir="ltr"
                style={{ '--p': `${((faceOpacity - 0.1) / 0.9) * 100}%` } as CSSProperties}
                className="plan-range plan-range--bar mt-1 w-full"
              />
            </label>
            <label className="block text-[12px] text-[#3a352f]">
              {v.section}
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(section * 100)}
                onChange={(e) => changeSection(Number(e.target.value) / 100)}
                dir="ltr"
                style={{ '--p': `${section * 100}%` } as CSSProperties}
                className="plan-range plan-range--bar mt-1 w-full"
              />
            </label>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )

  // ---- the transport bar ---------------------------------------------------

  const transport = spec.timeline && (
    <div className="planning-controls flex items-center gap-3">
      <button
        type="button"
        onClick={togglePlay}
        disabled={!ready}
        aria-label={playing ? v.pause : progress >= 1 ? v.replay : v.play}
        aria-keyshortcuts="Space"
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#14120F] text-white transition-transform duration-150 hover:scale-105 sm:h-11 sm:w-11 active:scale-95 disabled:opacity-40 ${focus}`}
      >
        {playing ? <Pause size={16} /> : progress >= 1 ? <RotateCcw size={16} /> : <Play size={16} className="translate-x-px rtl:-translate-x-px rtl:-scale-x-100" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="relative">
          <input
            type="range"
            min={0}
            max={1000}
            value={Math.round(progress * 1000)}
            disabled={!ready}
            onChange={(e) => scrub(Number(e.target.value) / 1000)}
            aria-label={v.timeline}
            aria-valuetext={stageList[stage]}
            style={{ '--p': `${progress * 100}%` } as CSSProperties}
            className="plan-range plan-range--bar relative z-[1] block w-full rtl:[--track-direction:to_left]"
          />
          {/* chapter marks, where the second and third steps begin */}
          {[PHASE_MARKS[1], PHASE_MARKS[2]].map((at) => (
            <span
              key={at}
              aria-hidden
              style={{ insetInlineStart: `${at * 100}%` }}
              className="pointer-events-none absolute top-1/2 h-2.5 w-[2px] -translate-y-1/2 rounded bg-[#faf8f3]"
            />
          ))}
        </div>
        <div
          className="grid max-sm:!grid-cols-3"
          style={{ gridTemplateColumns: `${PHASE_MARKS[1] * 100}% ${(PHASE_MARKS[2] - PHASE_MARKS[1]) * 100}% 1fr` }}
        >
          {stageList.map((name, i) => (
            <button
              key={name}
              type="button"
              aria-current={i === stage ? 'step' : undefined}
              onClick={() => scrub([0, PHASE_MARKS[1] + 0.001, PHASE_MARKS[2] + 0.001][i])}
              className={`rounded py-1.5 pe-1 text-start text-[11px] font-medium leading-tight transition-colors sm:truncate sm:uppercase sm:tracking-[0.12em] ${focus} ${
                i === stage ? 'text-[#14120F]' : 'text-[#6b6459] hover:text-[#14120F]'
              }`}
            >
              <span dir="ltr" className="me-1.5 tabular-nums text-[#C0A578]">
                {i + 1}
              </span>
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div
      ref={wrap}
      id="planning-viewer"
      onPointerEnter={() => (engaged.current = true)}
      onPointerLeave={() => (engaged.current = false)}
      onFocus={() => (engaged.current = true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) engaged.current = false
      }}
      className={full ? 'hero-gradient flex h-full w-full flex-col gap-3 overflow-y-auto p-3 sm:p-5' : 'relative flex flex-col gap-3'}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="sm:hidden">
        <ModelPicker label={v.caseList} value={caseId} placeholder={v.caseList} container={full ? wrap.current : undefined}
          options={CASE_IDS.map(id => ({ id, title: copy.cases[id].name, image: `/models/previews/${id}.webp` }))} onChange={choose} />
      </div>
      {/* On wider screens the same choices fit in a row. */}
      <div
        ref={tabs}
        role="tablist"
        aria-label={v.caseList}
        className="hidden sm:flex snap-x gap-1 overflow-x-auto overscroll-x-contain rounded-2xl bg-[#14120F]/[0.07] p-1 [scrollbar-width:none] max-xl:[mask-image:linear-gradient(to_right,#000_86%,transparent)] rtl:max-xl:[mask-image:linear-gradient(to_left,#000_86%,transparent)] [&::-webkit-scrollbar]:hidden"
      >
        {CASE_IDS.map((id, i) => {
          const on = id === caseId
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={on}
              aria-keyshortcuts={String(i + 1)}
              onClick={() => choose(id)}
              className={`relative flex shrink-0 select-none snap-start items-center gap-2.5 rounded-xl py-1.5 pe-4 ps-1.5 text-[13px] font-medium transition-colors xl:flex-1 xl:justify-center ${focus} ${
                on ? 'text-[#14120F]' : 'text-[#5f584d] hover:text-[#14120F]'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="planning-case"
                  transition={spring}
                  className="absolute inset-0 rounded-xl bg-white ring-1 ring-[#14120F]/10"
                />
              )}
              <img
                src={`/models/previews/${id}.webp`}
                alt=""
                width="44"
                height="38"
                className={`relative h-9 w-10 rounded-lg object-cover transition-opacity ${on ? '' : 'opacity-70'}`}
              />
              <span className="relative whitespace-nowrap">{copy.cases[id].name}</span>
            </button>
          )
        })}
      </div>

      <div className={`grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(290px,340px)] ${full ? 'min-h-0 flex-1' : ''}`}>
        <div className={`flex min-w-0 flex-col gap-3 ${full ? 'min-h-0' : ''}`}>
          {/* Stage */}
          {caseId === 'teeth' && exploded !== null && tooth !== null && (
            <div className="min-w-0 space-y-2">
              <button ref={implantBack} type="button" onClick={() => showImplant(false)} className={`min-h-11 rounded-xl bg-white px-4 text-sm font-medium ${focus}`}>{study.close}</button>
              <Suspense fallback={<p role="status">{v.loading}</p>}>
                <ImplantStudy tooth={tooth} lang={lang} amount={exploded} part={detail} onPart={setDetail} onChange={setExploded} rotation={implantRotation} onRotate={setImplantRotation} />
              </Suspense>
            </div>
          )}
          <div
            data-studio-stage
            role="region"
            aria-label={v.title}
            tabIndex={-1}
            style={exploded !== null ? { display: 'none' } : { viewTransitionName: 'ozea-planning-studio' }}
            className={`relative overflow-hidden rounded-[1.5rem] border border-[#14120F]/10 bg-[radial-gradient(ellipse_at_50%_38%,#fffdf8,#e4dccf)] ${
              full
                ? 'min-h-[280px] flex-1'
                : 'h-[clamp(270px,46svh,430px)] max-lg:sticky max-lg:top-2 max-lg:z-20 sm:h-[clamp(360px,54svh,620px)] lg:h-auto lg:min-h-[clamp(400px,64svh,740px)] lg:flex-1'
            }`}
          >
            <div ref={host} className="absolute inset-0" />

            {/* Anatomical labels, positioned by the scene when the view changes */}
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              {LANDMARK_KEYS.map((key) => (
                <span
                  key={key}
                  ref={(node) => {
                    if (node) labelEls.current.set(key, node)
                    else labelEls.current.delete(key)
                  }}
                  style={{ opacity: 0 }}
                  className={`absolute left-0 top-0 flex items-center ${showLabels ? '' : '!opacity-0'}`}
                >
                  <span className="-ms-[3px] -mt-[3px] block h-[7px] w-[7px] rounded-full bg-[#C0A578] ring-2 ring-white/80" />
                  <span className="-mt-[3px] ms-1.5 block h-px w-4 bg-[#14120F]/45" />
                  <span className="-mt-[3px] ms-1.5 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-medium text-[#14120F]">
                    {v.landmarks[key]}
                  </span>
                </span>
              ))}
            </div>

            {ready && (
              <>
                <div className="absolute start-2.5 top-2.5 max-w-[calc(100%-5.5rem)]">
                  <ModelPicker label={v.camera} value={cameraView} placeholder={v.angle} compact container={full ? wrap.current : undefined}
                    options={VIEW_IDS.map(id => ({ id, title: v.views[id], image: `/models/previews/angles/${caseId}-${id}.webp` }))} onChange={view} />
                </div>

                {/* Tool dock */}
                <div className="absolute end-3 top-3 flex flex-col gap-2">
                  <div className={`flex flex-col gap-0.5 rounded-[14px] p-1 ${float}`}>
                    <ToolButton label={v.xray} shortcut="X" pressed={xray} onClick={toggleXray}>
                      <ScanLine size={17} />
                    </ToolButton>
                    <ToolButton label={v.face} shortcut="F" pressed={face} onClick={toggleFace}>
                      <User size={17} />
                    </ToolButton>
                    {caseId === 'explore' && (
                      <ToolButton label={v.labels} shortcut="L" pressed={labels} onClick={() => toggleLabels()}>
                        <Tag size={17} />
                      </ToolButton>
                    )}
                    {display}
                  </div>
                  <div className={`flex flex-col gap-0.5 rounded-[14px] p-1 ${float}`}>
                    <ToolButton label={v.zoomIn} shortcut="+" onClick={() => viewer.current?.zoom(1 / 1.2)} className="max-sm:hidden">
                      <Plus size={17} />
                    </ToolButton>
                    <ToolButton label={v.zoomOut} shortcut="−" onClick={() => viewer.current?.zoom(1.2)} className="max-sm:hidden">
                      <Minus size={17} />
                    </ToolButton>
                    <ToolButton label={v.reset} shortcut="R" onClick={resetView}>
                      <RotateCcw size={16} />
                    </ToolButton>
                    {canExpand && (
                      <ToolButton label={full ? v.exitFullscreen : v.fullscreen} onClick={toggleFull}>
                        {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                      </ToolButton>
                    )}
                  </div>
                </div>

                {/* What to do, until the model has been touched */}
                <AnimatePresence>
                  {!touched && caseId !== 'teeth' && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`pointer-events-none absolute bottom-3 start-3 max-w-[calc(100%-5rem)] rounded-full px-3.5 py-2 text-[12px] text-[#3a352f] ${float}`}
                    >
                      {v.hint}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* The selected tooth, and what can be done to it */}
                <AnimatePresence>
                  {caseId === 'teeth' && (
                    <motion.div
                      key={tooth === null ? 'hint' : 'tooth'}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.22 }}
                      className={`absolute inset-x-3 bottom-3 mx-auto w-fit max-w-[calc(100%-1.5rem)] rounded-2xl p-2 ${float}`}
                    >
                      {tooth === null ? (
                        <p className="px-2 py-1 text-[12px] text-[#3a352f]">{v.toothHint}</p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <p aria-live="polite" className="ps-2 text-[13px] font-medium text-[#14120F]">
                            {toothName(tooth)} <bdi className="tabular-nums text-[#6b6459]">· {tooth}</bdi>
                          </p>
                          <div className="min-w-[15rem] flex-1">{treatments}</div>
                          <button
                            type="button"
                            aria-label={c.cases.close}
                            aria-keyshortcuts="Escape"
                            onClick={() => selectTooth(null)}
                            className={`grid h-9 w-9 place-items-center rounded-lg text-[#5f584d] hover:bg-[#14120F]/[0.07] ${focus}`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {!ready && (
              <div className="absolute inset-0 grid place-items-center p-4 text-center">
                <img src="/models/previews/studio-skull.webp" alt="" width="756" height="544"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
                {status === 'loading' ? (
                  <div role="status" className="relative w-48 self-end rounded-xl bg-[#fffdf9]/95 px-4 py-3 shadow-sm">
                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#6b6459]">{v.loading}</p>
                    <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-[#14120F]/12">
                      <div
                        className="h-full origin-left rounded-full bg-[#14120F] transition-transform duration-300 rtl:origin-right"
                        style={{ transform: `scaleX(${Math.max(0.04, loaded)})` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-2xl bg-[#fffdf9]/95 p-4 shadow-sm">
                    <p role="alert" className="max-w-[44ch] text-[14px] leading-relaxed text-[#3a352f]">
                      {v.error}
                    </p>
                    <button
                      type="button"
                      className={`mt-4 rounded-full bg-[#14120F] px-5 py-2.5 text-[13px] font-medium text-white ${focus}`}
                      onClick={() => {
                        setLoaded(0)
                        setStatus('loading')
                        setAttempt((n) => n + 1)
                      }}
                    >
                      {v.retry}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transport */}
          {ready && face && caseId !== 'teeth' && <div role="group" aria-label={v.faceOpacity} className="flex flex-wrap items-center gap-1 rounded-xl border border-[#d5ccbe] bg-[#faf8f3] p-1 text-[13px] font-medium">
            <button type="button" aria-pressed={faceOpacity === 1} onClick={() => changeFaceOpacity(1)} className="min-h-11 flex-1 rounded-lg px-3 aria-pressed:bg-[#292c2c] aria-pressed:text-white">
              {{ en: 'Skin surface', ar: 'سطح الوجه', fr: 'Surface du visage', ru: 'Поверхность лица' }[lang]}
            </button>
            <button type="button" aria-pressed={faceOpacity < 1} onClick={() => changeFaceOpacity(0.42)} className="min-h-11 flex-1 rounded-lg px-3 aria-pressed:bg-[#292c2c] aria-pressed:text-white">
              {{ en: 'See the bone beneath', ar: 'شاهد العظام تحت الجلد', fr: 'Voir les os sous la peau', ru: 'Посмотреть кости' }[lang]}
            </button>
          </div>}
          {caseId === 'teeth' && status !== 'loading' && exploded === null && (
            <button ref={implantEntry} type="button" className={`min-h-12 rounded-xl bg-[#29251f] px-4 text-sm font-semibold text-white ${focus}`} onClick={() => showImplant(true)}>{study.open}</button>
          )}
          {transport && (
            <div className="rounded-2xl border border-[#14120F]/10 bg-[#faf8f3] px-3 py-2.5 sm:px-4">
              {transport}
              {spec.timeline && (
                <button type="button" aria-pressed={comparing} disabled={!ready || progress <= 0}
                  onPointerDown={(event) => {
                    if (event.button !== 0) return
                    event.currentTarget.setPointerCapture(event.pointerId)
                    startCompare()
                  }}
                  onPointerUp={endCompare} onPointerCancel={endCompare} onLostPointerCapture={endCompare} onBlur={endCompare}
                  onContextMenu={(event) => event.preventDefault()}
                  onKeyDown={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); startCompare() }
                  }}
                  onKeyUp={(event) => {
                    if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); endCompare() }
                  }}
                  onClick={(event) => { if (event.detail === 0) { if (compareHeld.current) endCompare(); else startCompare() } }}
                  className="mt-2 min-h-11 w-full touch-none select-none rounded-xl border border-[#c8b99e] bg-[#f4efe6] px-3 text-sm font-medium text-[#30291d] disabled:opacity-50 aria-pressed:bg-[#30291d] aria-pressed:text-white">
                  {comparing
                    ? { en: 'Starting position · release to return', ar: 'الوضع الأول · ارفع إصبعك للرجوع', fr: 'Position initiale · relâchez pour revenir', ru: 'Исходное положение · отпустите для возврата' }[lang]
                    : { en: 'Hold to see the starting position', ar: 'اضغط مطوّلًا لرؤية الوضع الأول', fr: 'Maintenez pour voir la position initiale', ru: 'Удерживайте, чтобы увидеть исходное положение' }[lang]}
                </button>
              )}
              <p className="mt-1 ps-[3.75rem] text-[12px] leading-snug text-[#5f584d] sm:ps-14" aria-live="polite">
                {stageHint}
              </p>
            </div>
          )}

          {ready && <div className="flex flex-wrap gap-2">
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" {...shareLink(false)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#b6a98f] bg-white px-4 text-[13px] font-semibold text-[#28251f]"><WhatsAppIcon className="h-4 w-4" />{study.share}</a>
            <a href={whatsappUrl(lang === 'ar' ? study.message : studyLabels.en.message)} target="_blank" rel="noopener noreferrer" {...shareLink(true)}
              className="inline-flex min-h-11 items-center rounded-xl px-3 text-[13px] font-medium underline underline-offset-4">{study.ask}</a>
          </div>}
          {hasLive && exploded === null && !full && <div className="flex flex-col gap-3 lg:hidden">{live}</div>}
        </div>

        {/* Inspector */}
        <aside className="flex min-w-0 flex-col rounded-[1.5rem] border border-[#14120F]/10 bg-[#faf8f3] p-5 xl:p-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={caseId}
              initial={still ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={still ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5f584d]">{text.tag}</p>
              <h2 className="font-display mt-2.5 text-[clamp(1.4rem,2.4vw,1.85rem)] font-medium leading-[1.08] tracking-[-0.01em] text-[#14120F]">
                {text.name}
              </h2>
              <p className="mt-3 text-[14px] leading-[1.6] text-[#3a352f]">{text.summary}</p>
              </div>

              {hasLive && <div className="flex flex-col gap-5 max-lg:hidden">{live}</div>}

              {caseId === 'explore' && <p className="text-[13px] leading-[1.55] text-[#5f584d]">{v.exploreHint}</p>}

              <ul className="space-y-2.5 border-t border-[#14120F]/10 pt-5">
                {text.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[13px] leading-[1.55] text-[#5f584d]">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-[#C0A578]" />
                    {point}
                  </li>
                ))}
              </ul>

              {text.page && (
                <Link
                  to={path(pageMeta(text.page).path)}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 text-[13px] font-medium text-[#14120F] ring-1 ring-[#14120F]/10 transition-colors hover:bg-[#14120F] hover:text-white ${focus}`}
                >
                  <span>
                    <span className="block text-[11px] font-normal opacity-70">{v.related}</span>
                    {p.content[text.page].nav}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 rtl:-scale-x-100" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </aside>
      </div>
    </div>
  )
}
