// PageLoader — one-time-per-session "MZ" intro overlay before Hero entrance.
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/content'
import { duration, ease, revealTransition } from '../lib/motion'

const SESSION_KEY = 'mz-portfolio-intro-seen'

function hasSeenIntro() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export default function PageLoader({ onComplete }) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => !hasSeenIntro())
  const doneRef = useRef(false)

  const complete = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    markIntroSeen()
    onComplete?.()
  }, [onComplete])

  useEffect(() => {
    // Already shown this session — unlock Hero immediately
    if (hasSeenIntro()) {
      setVisible(false)
      complete()
      return undefined
    }

    // Accessibility: skip decorative intro
    if (reduceMotion) {
      setVisible(false)
      complete()
      return undefined
    }

    const hold = window.setTimeout(() => setVisible(false), 480)
    return () => window.clearTimeout(hold)
  }, [reduceMotion, complete])

  return (
    <AnimatePresence onExitComplete={complete}>
      {visible && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-120 flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.base, ease }}
          aria-hidden="true"
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={revealTransition}
          >
            <span className="font-display text-5xl font-extrabold tracking-tight text-accent sm:text-6xl">
              <span className="italic">{profile.shortName.charAt(0)}</span>
              {profile.shortName.slice(1)}
            </span>
            <span className="block h-px w-10 bg-accent/50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
