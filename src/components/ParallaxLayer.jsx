// ParallaxLayer — subtle Y-shift for decorative backgrounds only (GPU transform).
// Disabled below tablet (md) and when prefers-reduced-motion — mobile scroll-linked
// animations are often janky on real devices.
import { useEffect, useState } from 'react'
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
  const [allowParallax, setAllowParallax] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setAllowParallax(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const enabled = allowParallax && !reduceMotion

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset,
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    enabled ? [0, distance] : [0, 0],
  )

  return (
    <motion.div
      className={`${enabled ? 'will-change-transform ' : ''}${className}`.trim()}
      style={enabled ? { y } : undefined}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  )
}
