import { motion, type Transition } from 'framer-motion'

/**
 * Lateral cephalometric tracing — the schematic a jaw surgeon works from.
 * Drawn entirely in SVG: the profile faces left, so the card's rounded right
 * edge crops the occiput while the mandible and condyle stay inboard.
 */

const INK = '#14120F'
const GOLD = '#C0A578'

/** Landmark dots. Halo on the three planes-defining points. */
const LANDMARKS: { id: string; x: number; y: number; halo?: boolean }[] = [
  { id: 'S', x: 330, y: 196, halo: true },
  { id: 'N', x: 190, y: 178 },
  { id: 'Or', x: 212, y: 238 },
  { id: 'Po', x: 352, y: 242 },
  { id: 'ANS', x: 178, y: 264 },
  { id: 'A', x: 182, y: 290 },
  { id: 'B', x: 172, y: 360 },
  { id: 'Pog', x: 166, y: 386 },
  { id: 'Me', x: 180, y: 412, halo: true },
  { id: 'Go', x: 338, y: 388, halo: true },
  { id: 'Co', x: 350, y: 250 },
]

const LABELS: { text: string; x: number; y: number }[] = [
  { text: 'S', x: 342, y: 190 },
  { text: 'N', x: 172, y: 172 },
  { text: 'Go', x: 348, y: 396 },
  { text: 'Me', x: 172, y: 428 },
  { text: 'Pog', x: 132, y: 384 },
]

const PLANES: { id: string; d: string }[] = [
  { id: 'frankfort', d: 'M 60 234 L 470 244' },
  { id: 'sn', d: 'M 130 170 L 400 205' },
  { id: 'occlusal', d: 'M 150 318 L 330 330' },
  { id: 'mandibular', d: 'M 96 416 L 400 384' },
]

const SOFT_TISSUE =
  'M 316 82 C 268 62 218 84 200 132 C 192 152 190 166 190 178 C 186 196 156 218 132 240 C 124 248 132 254 146 256 C 158 258 170 258 174 264 C 178 272 158 282 156 292 C 155 300 164 302 168 306 C 172 310 154 316 152 326 C 150 336 172 342 176 350 C 180 358 152 364 152 380 C 152 394 162 402 176 408 C 214 420 258 426 292 438'

const POSTERIOR =
  'M 316 82 C 356 96 384 140 386 196 C 388 250 372 300 362 344 C 356 372 352 400 350 430 C 348 470 348 520 350 560'

/**
 * Condylion → posterior ramus border → gonion → lower border of the body →
 * menton → symphysis → alveolar crest → anterior ramus border → coronoid tip →
 * sigmoid notch → back to condylion.
 */
const MANDIBLE =
  'M 348 252 C 347 300 342 350 336 384 C 332 398 318 408 296 414 C 262 422 216 420 188 408 C 178 403 172 396 171 386 C 170 376 171 366 174 358 C 200 352 246 350 282 349 C 292 344 298 331 302 316 C 314 322 324 318 332 306 C 340 292 346 272 348 252 Z'

const ease = [0.22, 1, 0.36, 1] as const

/** SVG scale animates about the viewBox origin unless the box is pinned. */
const dotOrigin = { transformBox: 'fill-box', transformOrigin: 'center' } as const

/** Default placement: bleeding off the left of the hero portrait card. */
const HERO_PLACEMENT =
  'pointer-events-none absolute left-[-30%] top-1/2 hidden h-[430px] -translate-y-1/2 md:block lg:left-[-28%] lg:h-[500px] xl:left-[-32%] xl:h-[560px] 2xl:left-[-30%] 2xl:h-[640px]'

export default function CephalometricTracing({
  still,
  className,
}: {
  still: boolean
  /** Overrides the hero placement so the tracing can also sit inside a card. */
  className?: string
}) {
  /** When still, every path renders complete with no transition. */
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
      viewBox="0 0 520 680"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="ceph-title ceph-desc"
      focusable="false"
      className={className ?? HERO_PLACEMENT}
    >
      <title id="ceph-title">
        Lateral cephalometric tracing of a facial profile and mandible
      </title>
      <desc id="ceph-desc">
        A schematic side-view planning diagram showing the soft-tissue facial profile, the
        mandible drawn as a separate bone with its condyle at the temporomandibular joint, and
        the reference planes used to measure jaw position. It is not a patient image and not a
        predicted result.
      </desc>

      <defs>
        <pattern id="ceph-minor" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" stroke="rgba(20,18,15,0.05)" strokeWidth="1" fill="none" />
        </pattern>
        <pattern id="ceph-major" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M120 0H0V120" stroke="rgba(20,18,15,0.085)" strokeWidth="1" fill="none" />
        </pattern>
        <radialGradient id="ceph-fade" cx="52%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="72%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="ceph-mask">
          <rect width="520" height="680" fill="url(#ceph-fade)" />
        </mask>
      </defs>

      {/* Grid, faded off at the edges so it reads as a viewing field, not graph paper */}
      <motion.g mask="url(#ceph-mask)" {...fade(0.9, 0.25)}>
        <rect width="520" height="680" fill="url(#ceph-minor)" />
        <rect width="520" height="680" fill="url(#ceph-major)" />
      </motion.g>

      {/* Soft-tissue profile */}
      <motion.path
        d={SOFT_TISSUE}
        stroke={INK}
        strokeOpacity="0.44"
        strokeWidth="1.8"
        strokeLinecap="round"
        {...draw(2, 0.5)}
      />
      <motion.path
        d={POSTERIOR}
        stroke={INK}
        strokeOpacity="0.44"
        strokeWidth="1.8"
        strokeLinecap="round"
        {...draw(1.2, 0.8)}
      />

      {/* Mandible — the heaviest line on the canvas, because the bone is the subject */}
      <motion.path
        d={MANDIBLE}
        stroke={INK}
        strokeOpacity="0.66"
        strokeWidth="2.1"
        strokeLinejoin="round"
        fill="none"
        {...draw(1.4, 0.9)}
      />

      {/* Maxilla */}
      <motion.path
        d="M 190 272 L 288 276"
        stroke={INK}
        strokeOpacity="0.3"
        strokeWidth="1.3"
        {...draw(0.8, 1.4)}
      />
      <motion.path
        d="M 190 272 C 186 282 184 290 182 300"
        stroke={INK}
        strokeOpacity="0.3"
        strokeWidth="1.3"
        {...draw(0.8, 1.4)}
      />

      {/* Reference planes — gold means measurement here and nothing else */}
      {PLANES.map((p, i) => (
        <motion.path
          key={p.id}
          d={p.d}
          stroke={GOLD}
          strokeWidth="1"
          strokeDasharray="5 4"
          strokeOpacity="0.55"
          {...draw(0.7, 1.6 + i * 0.08)}
        />
      ))}

      {/* Landmarks */}
      {LANDMARKS.map((l, i) => (
        <g key={l.id}>
          {l.halo && (
            <motion.circle
              cx={l.x}
              cy={l.y}
              r="9"
              fill="none"
              stroke={INK}
              strokeOpacity="0.22"
              strokeWidth="1"
              {...fade(0.5, 1.95 + i * 0.055)}
            />
          )}
          <motion.circle
            cx={l.x}
            cy={l.y}
            r="3.5"
            fill={GOLD}
            style={dotOrigin}
            initial={still ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              still
                ? { duration: 0 }
                : { type: 'spring', stiffness: 320, damping: 22, delay: 1.8 + i * 0.055 }
            }
          />
        </g>
      ))}

      {/* Temporomandibular joint + gonial angle construction */}
      <motion.g {...fade(0.6, 2.15)}>
        <circle cx="350" cy="250" r="9" stroke={GOLD} strokeWidth="1.25" strokeOpacity="0.85" />
        <circle
          cx="350"
          cy="250"
          r="16"
          stroke={GOLD}
          strokeWidth="1"
          strokeDasharray="3 4"
          strokeOpacity="0.5"
        />
        {/* Gonial angle: mandibular plane swept round to the ramus border */}
        <path d="M 294 400 A 46 46 0 0 0 341 342" stroke={GOLD} strokeWidth="1" strokeOpacity="0.6" />
      </motion.g>

      <motion.g aria-hidden="true" {...fade(0.6, 2.15)}>
        {LABELS.map((l) => (
          <text
            key={l.text}
            x={l.x}
            y={l.y}
            fontSize="10"
            letterSpacing="1.4"
            fontFamily="Inter, sans-serif"
            fill="#6b6459"
            fillOpacity="0.9"
          >
            {l.text}
          </text>
        ))}
      </motion.g>
    </svg>
  )
}
