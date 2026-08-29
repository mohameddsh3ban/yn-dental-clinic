import { motion, type Transition } from 'framer-motion'

/**
 * The temporomandibular joint in sagittal section — the schematic a TMJ surgeon
 * works from. Anterior is left: the articular eminence sits ahead of the fossa,
 * and the condyle rotates in the fossa then translates forward onto the
 * eminence as the jaw opens. The dashed circle is the open position.
 *
 * Drawn entirely in SVG, so it stays crisp at any size and costs no image
 * bytes. Same drawing language as the cephalometric tracing: ink is bone, gold
 * is anything being measured or moved. The temporal bone is filled rather than
 * outlined so it is never ambiguous which side of the line is bone.
 */

const INK = '#14120F'
const GOLD = '#C0A578'

const ease = [0.22, 1, 0.36, 1] as const

/** Lower border of the temporal bone: flat, eminence down, fossa up, tubercle down. */
const TEMPORAL_BORDER =
  'M -20 190 L 166 190 A 26 26 0 0 0 218 190 A 46 46 0 0 1 310 190 A 19 19 0 0 0 348 190 L 500 190'

/** The same border closed off above the viewBox, giving the bone its body. */
const TEMPORAL_BODY = `${TEMPORAL_BORDER} L 500 -30 L -20 -30 Z`

/** Roof of the fossa — the working surface, so it carries the heaviest line. */
const FOSSA_ROOF = 'M 218 190 A 46 46 0 0 1 310 190'

/** Cancellous hatching, clipped to the bone body. */
const HATCH =
  'M 158 118 L 146 148 M 184 116 L 172 146 M 210 112 L 198 142 M 236 110 L 224 140 M 262 110 L 250 140 M 288 112 L 276 142 M 314 116 L 302 146 M 340 118 L 328 148'

const CONDYLE = { cx: 264, cy: 182, r: 30 } as const

/** Where the condyle ends up with the jaw open, translated onto the eminence. */
const CONDYLE_OPEN = { cx: 194, cy: 218, r: 30 } as const

/** Biconcave disc: upper border follows the fossa, lower border cups the head. */
const DISC = 'M 232 160 C 242 140 288 140 298 160 C 288 149 242 149 232 160 Z'

const RAMUS_BODY =
  'M 244 200 C 238 220 238 236 238 254 C 237 288 236 316 236 348 L 300 350 C 300 318 299 288 298 254 C 298 234 296 218 290 200 Z'
const RAMUS_ANTERIOR = 'M 244 200 C 238 220 238 236 238 254 C 237 288 236 316 236 348'
const RAMUS_POSTERIOR = 'M 290 200 C 296 218 298 234 298 254 C 299 288 300 318 300 348'

const LEADERS = [
  'M 348 142 L 292 150',
  'M 348 168 L 300 159',
  'M 348 202 L 294 190',
  'M 322 314 L 302 310',
  'M 152 224 L 186 210',
]

const LABELS: { text: string; x: number; y: number; anchor?: 'start' | 'end' }[] = [
  { text: 'Glenoid fossa', x: 352, y: 142 },
  { text: 'Articular disc', x: 352, y: 172 },
  { text: 'Condyle', x: 352, y: 204 },
  { text: 'Ramus', x: 326, y: 316 },
  { text: 'Articular eminence', x: 148, y: 228, anchor: 'end' },
]

export default function TmjDiagram({
  still,
  className,
}: {
  still: boolean
  className?: string
}) {
  const draw = (duration: number, delay: number) =>
    still
      ? { initial: false as const, animate: { pathLength: 1 }, transition: { duration: 0 } }
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration, delay, ease } as Transition,
        }

  const fade = (duration: number, delay: number) =>
    still
      ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration, delay, ease } as Transition,
        }

  return (
    <svg
      viewBox="0 0 480 400"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="tmj-title tmj-desc"
      focusable="false"
      className={className ?? 'h-auto w-full'}
    >
      <title id="tmj-title">Sagittal section of the temporomandibular joint</title>
      <desc id="tmj-desc">
        A schematic side view of the jaw joint: the condyle of the mandible seated in the glenoid
        fossa of the temporal bone with the articular disc between them, the articular eminence
        ahead of it, and the rotation and forward translation that together open the jaw — the
        dashed outline marking where the condyle sits with the jaw open. It is not a patient image
        and not a predicted result.
      </desc>

      <defs>
        <marker
          id="tmj-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill={GOLD} />
        </marker>

        {/* The ramus runs out of the frame, so it fades instead of being cut off. */}
        <linearGradient id="tmj-ramus-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="55%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="tmj-ramus-mask">
          <rect width="480" height="400" fill="url(#tmj-ramus-fade)" />
        </mask>

        {/* Keeps the bone from reading as a grey rectangle with hard edges. */}
        <radialGradient id="tmj-bone-fade" cx="55%" cy="52%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="58%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="tmj-bone-mask">
          <rect width="480" height="400" fill="url(#tmj-bone-fade)" />
        </mask>

        <clipPath id="tmj-bone-clip">
          <path d={TEMPORAL_BODY} />
        </clipPath>
      </defs>

      {/* Temporal bone */}
      <g mask="url(#tmj-bone-mask)">
        <motion.path d={TEMPORAL_BODY} fill="rgba(20,18,15,0.05)" {...fade(1, 0.2)} />
        <motion.g clipPath="url(#tmj-bone-clip)" {...fade(0.9, 0.9)}>
          <path d={HATCH} stroke={INK} strokeOpacity="0.09" strokeWidth="1" />
        </motion.g>
        <motion.path
          d={TEMPORAL_BORDER}
          stroke={INK}
          strokeOpacity="0.5"
          strokeWidth="1.8"
          {...draw(1.7, 0.3)}
        />
      </g>
      <motion.path
        d={FOSSA_ROOF}
        stroke={INK}
        strokeOpacity="0.75"
        strokeWidth="2.6"
        strokeLinecap="round"
        {...draw(0.8, 0.95)}
      />

      {/* Mandible — ramus first, the head drawn over the join */}
      <g mask="url(#tmj-ramus-mask)">
        <motion.path d={RAMUS_BODY} fill="rgba(20,18,15,0.05)" {...fade(0.9, 1.3)} />
        <motion.path
          d={RAMUS_ANTERIOR}
          stroke={INK}
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeLinecap="round"
          {...draw(1, 1.15)}
        />
        <motion.path
          d={RAMUS_POSTERIOR}
          stroke={INK}
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeLinecap="round"
          {...draw(1, 1.25)}
        />
      </g>
      <motion.circle
        cx={CONDYLE.cx}
        cy={CONDYLE.cy}
        r={CONDYLE.r}
        fill="rgba(20,18,15,0.05)"
        stroke={INK}
        strokeOpacity="0.7"
        strokeWidth="2.2"
        {...draw(1, 1.05)}
      />

      {/* Articular disc — the part that displaces, so the one filled gold shape */}
      <motion.path
        d={DISC}
        fill={GOLD}
        fillOpacity="0.32"
        stroke={GOLD}
        strokeWidth="1.4"
        strokeOpacity="0.95"
        {...fade(0.7, 1.5)}
      />

      {/* Movement */}
      <motion.g {...fade(0.7, 1.8)}>
        <circle
          cx={CONDYLE_OPEN.cx}
          cy={CONDYLE_OPEN.cy}
          r={CONDYLE_OPEN.r}
          stroke={GOLD}
          strokeWidth="1.2"
          strokeDasharray="4 5"
          strokeOpacity="0.5"
        />
        <path
          d="M 240 202 C 226 210 212 216 200 224"
          stroke={GOLD}
          strokeWidth="1.4"
          strokeDasharray="6 4"
          strokeOpacity="0.9"
          markerEnd="url(#tmj-arrow)"
        />
        <path
          d="M 302 196 A 40 40 0 0 1 278 220"
          stroke={GOLD}
          strokeWidth="1.4"
          strokeOpacity="0.9"
          markerEnd="url(#tmj-arrow)"
        />
        <circle cx={CONDYLE.cx} cy={CONDYLE.cy} r="3.5" fill={GOLD} />
        <path d="M 196 288 L 200 250" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
      </motion.g>

      {/* Leaders and labels */}
      <motion.g {...fade(0.6, 2)}>
        {LEADERS.map((d) => (
          <path key={d} d={d} stroke={INK} strokeOpacity="0.22" strokeWidth="1" />
        ))}
      </motion.g>

      <motion.g aria-hidden="true" {...fade(0.6, 2.05)}>
        <text
          x="46"
          y="96"
          fontSize="9.5"
          letterSpacing="1.8"
          fontFamily="Inter, sans-serif"
          fill={INK}
          fillOpacity="0.3"
        >
          TEMPORAL BONE
        </text>
        {LABELS.map((l) => (
          <text
            key={l.text}
            x={l.x}
            y={l.y}
            textAnchor={l.anchor ?? 'start'}
            fontSize="10"
            letterSpacing="1.1"
            fontFamily="Inter, sans-serif"
            fill="#6b6459"
            fillOpacity="0.95"
          >
            {l.text}
          </text>
        ))}
        <text
          x="88"
          y="300"
          fontSize="9.5"
          letterSpacing="1.6"
          fontFamily="Inter, sans-serif"
          fill={GOLD}
        >
          TRANSLATION — JAW OPEN
        </text>
        <text
          x="308"
          y="230"
          fontSize="9.5"
          letterSpacing="1.6"
          fontFamily="Inter, sans-serif"
          fill={GOLD}
        >
          ROTATION
        </text>
      </motion.g>
    </svg>
  )
}
