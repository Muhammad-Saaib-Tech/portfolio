// Magnetic — subtle cursor-attracted wrapper for primary CTAs (desktop only).
import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

const MAX_OFFSET = 8

function canUseMagnetic() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(hover: hover)').matches
  )
}

export default function Magnetic({ children, className = '' }) {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const ref = useRef(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 280, damping: 22, mass: 0.35 })
  const y = useSpring(rawY, { stiffness: 280, damping: 22, mass: 0.35 })

  useEffect(() => {
    if (reduceMotion) {
      setEnabled(false)
      return undefined
    }

    const update = () => setEnabled(canUseMagnetic())
    update()

    const fineMq = window.matchMedia('(pointer: fine)')
    const hoverMq = window.matchMedia('(hover: hover)')
    fineMq.addEventListener('change', update)
    hoverMq.addEventListener('change', update)
    return () => {
      fineMq.removeEventListener('change', update)
      hoverMq.removeEventListener('change', update)
    }
  }, [reduceMotion])

  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const onMove = (e) => {
    if (!enabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    rawX.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dx * 0.22)))
    rawY.set(Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, dy * 0.22)))
  }

  if (!enabled) {
    return <span className={`inline-flex ${className}`.trim()}>{children}</span>
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-flex will-change-transform ${className}`.trim()}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
