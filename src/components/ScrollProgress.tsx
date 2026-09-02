import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

/**
 * A gold hairline along the top edge that grows with the scroll position.
 *
 * It is a measurement of where the reader is, which is the one job gold is
 * allowed on this site. It is invisible at the very top so the hero header
 * keeps its clean edge, and it trails the scroll on a short spring so a flick
 * reads as a line being drawn rather than a bar jumping.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 })
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1])

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, opacity }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[#C0A578] rtl:origin-right"
    />
  )
}
