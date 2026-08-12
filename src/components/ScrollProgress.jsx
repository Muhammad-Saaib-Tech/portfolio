// ScrollProgress — thin accent bar tracking page scroll with spring smoothing.
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

export default function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 500 : 120,
    damping: reduceMotion ? 50 : 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-80 h-0.5 origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
