import type { KeyboardEvent } from 'react'
import { CHART, type ToothWork } from './cases'

// The chart is drawn the way a dentist draws it: both arches seen from the
// biting surface, the patient's right on the viewer's left, every tooth at its
// own width — narrow incisors at the front, broad molars at the back.

/** Width along the arch and depth across it, per tooth from the midline back. */
const WIDTH = [8.6, 6.8, 7.8, 7.2, 6.8, 10.2, 9.8, 8.6]
const DEPTH = [6.8, 6.8, 8.2, 8.8, 9.0, 10.6, 10.4, 9.6]
const GAP = 0.55
/** Half-width and depth of the arch's centre line, in chart units. */
const A = 40
const B = 56

type Slot = { x: number; y: number; angle: number; w: number; d: number }

/** Eight teeth of one quadrant, spaced by arc length so neighbours just touch. */
const QUADRANT: Slot[] = (() => {
  const steps = 600
  const table: { s: number; th: number }[] = [{ s: 0, th: 0 }]
  let px = 0
  let py = 0
  let s = 0
  for (let i = 1; i <= steps; i++) {
    const th = ((Math.PI / 2) * i) / steps
    const x = A * Math.sin(th)
    const y = B * (1 - Math.cos(th))
    s += Math.hypot(x - px, y - py)
    px = x
    py = y
    table.push({ s, th })
  }
  const at = (target: number) => {
    const hit = table.find((row) => row.s >= target) ?? table[table.length - 1]
    return hit.th
  }
  const out: Slot[] = []
  let run = GAP / 2
  for (let i = 0; i < 8; i++) {
    const th = at(run + WIDTH[i] / 2)
    out.push({
      x: A * Math.sin(th),
      y: B * (1 - Math.cos(th)),
      angle: (Math.atan2(B * Math.sin(th), A * Math.cos(th)) * 180) / Math.PI,
      w: WIDTH[i] - GAP,
      d: DEPTH[i],
    })
    run += WIDTH[i]
  }
  return out
})()

const CX = 50
const UPPER_Y = 7
const LOWER_Y = 121

function slotFor(id: number): Slot {
  const quadrant = Math.floor(id / 10)
  const base = QUADRANT[(id % 10) - 1]
  const left = quadrant === 2 || quadrant === 3 // the patient's left, drawn on the right
  const upper = quadrant <= 2
  const x = CX + (left ? base.x : -base.x)
  const y = upper ? UPPER_Y + base.y : LOWER_Y - base.y
  const angle = (left ? 1 : -1) * (upper ? 1 : -1) * base.angle
  return { ...base, x, y, angle }
}

export function ToothChart({
  work,
  selected,
  onSelect,
  name,
  labels,
}: {
  work: Record<number, ToothWork>
  selected: number | null
  onSelect: (id: number | null) => void
  name: (id: number) => string
  labels: { chart: string; upper: string; lower: string; right: string; left: string }
}) {
  const tooth = (id: number) => {
    const slot = slotFor(id)
    const state = work[id] ?? 'natural'
    const on = selected === id
    const place = id % 10
    const fill = state === 'implant' ? '#14120F' : state === 'crown' ? '#F7ECD6' : '#FFFFFF'
    const stroke = on ? '#14120F' : state === 'crown' ? '#C0A578' : state === 'implant' ? '#14120F' : 'rgba(20,18,15,0.28)'
    const toggle = () => onSelect(on ? null : id)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle()
      }
    }
    return (
      <g
        key={id}
        role="button"
        tabIndex={0}
        aria-pressed={on}
        aria-label={`${name(id)} · ${id}`}
        onClick={toggle}
        onKeyDown={onKey}
        className="plan-tooth cursor-pointer outline-none"
      >
        <title>{`${name(id)} · ${id}`}</title>
        <g transform={`translate(${slot.x} ${slot.y}) rotate(${slot.angle})`}>
          {/* a generous, invisible target for a thumb */}
          <rect x={-slot.w / 2 - 0.3} y={-slot.d / 2 - 2.6} width={slot.w + 0.6} height={slot.d + 5.2} fill="transparent" />
          {on && (
            <rect
              x={-slot.w / 2 - 1.3}
              y={-slot.d / 2 - 1.3}
              width={slot.w + 2.6}
              height={slot.d + 2.6}
              rx={place >= 6 ? 3.8 : 3.4}
              fill="none"
              stroke="#C0A578"
              strokeWidth={0.9}
            />
          )}
          <rect
            className="plan-tooth-body"
            x={-slot.w / 2}
            y={-slot.d / 2}
            width={slot.w}
            height={slot.d}
            rx={place >= 6 ? 2.7 : place >= 4 ? 3 : 2.5}
            fill={fill}
            stroke={stroke}
            strokeWidth={on ? 1.1 : state === 'crown' ? 1 : 0.6}
          />
          {/* the fissure of a molar, the ridge of a premolar: enough to read as a tooth */}
          {state !== 'implant' && place >= 6 && (
            <path
              d={`M ${-slot.w * 0.24} 0 H ${slot.w * 0.24} M 0 ${-slot.d * 0.22} V ${slot.d * 0.22}`}
              stroke="rgba(20,18,15,0.16)"
              strokeWidth={0.5}
              strokeLinecap="round"
              fill="none"
            />
          )}
          {state === 'implant' && <circle r={Math.min(slot.w, slot.d) * 0.2} fill="none" stroke="#C0A578" strokeWidth={0.7} />}
        </g>
      </g>
    )
  }

  const number = (id: number) => {
    const slot = slotFor(id)
    const upper = id < 30
    // numbers sit outside the arch, along the normal
    const rad = ((slot.angle + (upper ? -90 : 90)) * Math.PI) / 180
    const reach = slot.d / 2 + 3.6
    return (
      <text
        key={id}
        x={slot.x + Math.cos(rad) * reach}
        y={slot.y + Math.sin(rad) * reach}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={3.1}
        fontWeight={selected === id ? 700 : 500}
        fill={selected === id ? '#14120F' : '#6b6459'}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {id}
      </text>
    )
  }

  const all = [...CHART.upper, ...CHART.lower]
  const caption = { fontSize: 3, fontWeight: 500, fill: '#6b6459', letterSpacing: '0.12em' } as const

  return (
    // Always left to right: a chart shows the patient's right on the left.
    <svg viewBox="-8 -4 116 136" role="group" aria-label={labels.chart} className="mx-auto block w-full max-w-[380px] select-none" direction="ltr">
      <text x={CX} y={41} textAnchor="middle" {...caption}>
        {labels.upper.toUpperCase()}
      </text>
      <text x={CX} y={89} textAnchor="middle" {...caption}>
        {labels.lower.toUpperCase()}
      </text>
      <line x1={CX} y1={47} x2={CX} y2={81} stroke="rgba(20,18,15,0.12)" strokeWidth={0.4} strokeDasharray="1.2 1.6" />
      <text x={CX - 9} y={65} textAnchor="end" {...caption}>
        {labels.right.toUpperCase()}
      </text>
      <text x={CX + 9} y={65} textAnchor="start" {...caption}>
        {labels.left.toUpperCase()}
      </text>
      {all.map(number)}
      {all.map(tooth)}
    </svg>
  )
}
