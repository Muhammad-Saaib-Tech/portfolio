// ParallaxLayer — subtle Y-shift for decorative backgrounds only (GPU transform).
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * @param {object} props
 * @param {React.RefObject} props.scrollRef — section that drives progress
 * @param {number} [props.distance=48] — max px shift as section scrolls
 * @param {[string, string]} [props.offset] — useScroll offset pair
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export default function ParallaxLayer({
  scrollRef,
  distance = 48,
  offset = ['start start', 'end start'],
  className = '',
  children,
}) {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset,
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, distance],
  )

  return (
    <motion.div
      className={`will-change-transform ${className}`.trim()}
      style={{ y }}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  )
}
