import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { ease, useStill } from '@/lib/anim'

/**
 * A statistic that counts up to its value the first time it scrolls into view.
 *
 * The value stays a string end to end — "4.9" keeps its one decimal while it
 * climbs, "170" never grows one — and the settled render is the literal the
 * caller passed, so nothing rounds differently from the copy. Still renders
 * (reduced motion, `?snap=1`) show the final figure at once.
 */
export function CountUp({
  value,
  duration = 1.6,
  className,
}: {
  value: string
  duration?: number
  className?: string
}) {
  const still = useStill()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const target = Number.parseFloat(value)
  const decimals = (value.split('.')[1] ?? '').length
  const animatable = !still && !Number.isNaN(target)
  const [shown, setShown] = useState(animatable ? (0).toFixed(decimals) : value)

  useEffect(() => {
    if (!animatable || !inView) return
    const controls = animate(0, target, {
      duration,
      ease,
      onUpdate: (v) => setShown(v.toFixed(decimals)),
      onComplete: () => setShown(value),
    })
    return () => controls.stop()
  }, [animatable, inView, target, decimals, duration, value])

  return (
    <span ref={ref} className={className}>
      {animatable && !inView ? (0).toFixed(decimals) : shown}
    </span>
  )
}
