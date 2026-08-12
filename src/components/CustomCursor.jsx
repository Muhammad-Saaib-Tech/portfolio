// CustomCursor — spring-lagged accent dot with hover ring; desktop pointer only.
import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { ease } from '../lib/motion'

const HOVER_SELECTOR =
  'a, button, [role="button"], label[for], input[type="submit"], .cursor-grow'

function canUseCustomCursor() {
  if (typeof window === 'undefined') return false
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const canHover = window.matchMedia('(hover: hover)').matches
  return finePointer && canHover
}

export default function CustomCursor() {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const springConfig = { stiffness: 320, damping: 28, mass: 0.4 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (reduceMotion) {
      setEnabled(false)
      return undefined
    }

    const updateEnabled = () => setEnabled(canUseCustomCursor())
    updateEnabled()

    const fineMq = window.matchMedia('(pointer: fine)')
    const hoverMq = window.matchMedia('(hover: hover)')
    fineMq.addEventListener('change', updateEnabled)
    hoverMq.addEventListener('change', updateEnabled)

    return () => {
      fineMq.removeEventListener('change', updateEnabled)
      hoverMq.removeEventListener('change', updateEnabled)
    }
  }, [reduceMotion])

  useEffect(() => {
    const root = document.documentElement
    if (enabled) root.classList.add('has-custom-cursor')
    else root.classList.remove('has-custom-cursor')
    return () => root.classList.remove('has-custom-cursor')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return undefined

    const onMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    const onOver = (e) => {
      const target = e.target
      if (!(target instanceof Element)) {
        setHovering(false)
        return
      }
      setHovering(Boolean(target.closest(HOVER_SELECTOR)))
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 will-change-transform"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="relative size-10"
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2, ease }}
        >
          {/* Outer ring — scales up on interactive hover */}
          <motion.span
            className="absolute inset-0 rounded-full border border-accent"
            animate={{
              scale: hovering ? 1 : 0.4,
              opacity: hovering ? 0.85 : 0.3,
            }}
            transition={{ duration: 0.28, ease }}
          />
          {/* Core dot */}
          <motion.span
            className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            animate={{
              scale: hovering ? 0.7 : 1,
              opacity: hovering ? 1 : 0.95,
            }}
            transition={{ duration: 0.28, ease }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
