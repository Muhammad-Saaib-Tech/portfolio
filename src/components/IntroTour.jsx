// IntroTour — one-time session auto-play through portfolio sections after PageLoader.
// Continuous floating glide; scroll / Tab / arrows hand control to normal browsing.
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { ease } from '../lib/motion'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Contact from './Contact'

/** Total seconds for Hero → Contact continuous flow */
export const TOUR_PACE_SECONDS = 20

const SESSION_KEY = 'mz-portfolio-tour-seen'

const TOUR_SLIDES = [
  { id: 'home', Component: Hero, condensed: false },
  { id: 'about', Component: About, condensed: false },
  { id: 'skills', Component: Skills, condensed: true },
  { id: 'experience', Component: Experience, condensed: true },
  { id: 'projects', Component: Projects, condensed: true },
  { id: 'education', Component: Education, condensed: false },
  { id: 'contact', Component: Contact, condensed: false },
]

export function hasSeenTour() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function markTourSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function shouldSkipTourForDeepLink() {
  if (typeof window === 'undefined') return false
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash || hash === 'home') return false
  return TOUR_SLIDES.some((s) => s.id === hash)
}

function FlowSection({ index, progress, children }) {
  const opacity = useTransform(progress, (p) => {
    const dist = Math.abs(p - index)
    if (dist >= 1) return 0.12
    return 0.12 + (1 - dist) * 0.88
  })
  const scale = useTransform(progress, (p) => {
    const dist = Math.min(Math.abs(p - index), 1)
    return 1 - dist * 0.04
  })
  const driftY = useTransform(progress, (p) => (p - index) * -18)

  return (
    <motion.div
      style={{ opacity, scale, y: driftY }}
      className="flex min-h-dvh w-full items-center will-change-transform"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </motion.div>
  )
}

/**
 * @param {{ active: boolean, onFinish: (sectionId: string) => void }} props
 */
export default function IntroTour({ active, onFinish }) {
  const reduceMotion = useReducedMotion()
  const [viewportH, setViewportH] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )
  const progress = useMotionValue(0)
  const flowRef = useRef(null)
  const finishedRef = useRef(false)
  const progressSnapshot = useRef(0)

  const slideCount = TOUR_SLIDES.length
  const maxIndex = slideCount - 1

  const finish = useCallback(
    (sectionId) => {
      if (finishedRef.current) return
      finishedRef.current = true
      if (flowRef.current) {
        flowRef.current.stop()
        flowRef.current = null
      }
      markTourSeen()
      onFinish(sectionId)
    },
    [onFinish],
  )

  const sectionFromProgress = useCallback(() => {
    const idx = Math.max(
      0,
      Math.min(maxIndex, Math.round(progressSnapshot.current)),
    )
    return TOUR_SLIDES[idx]?.id ?? 'home'
  }, [maxIndex])

  // Lock body scroll while touring
  useEffect(() => {
    if (!active) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])

  // Viewport height
  useEffect(() => {
    if (!active) return undefined
    const onResize = () => setViewportH(window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  // Start continuous flow
  useEffect(() => {
    if (!active || reduceMotion) return undefined

    finishedRef.current = false
    progress.set(0)
    progressSnapshot.current = 0

    flowRef.current = animate(progress, maxIndex, {
      duration: TOUR_PACE_SECONDS,
      ease: 'linear',
      onUpdate: (v) => {
        progressSnapshot.current = v
      },
      onComplete: () => {
        finish('contact')
      },
    })

    return () => {
      if (flowRef.current) {
        flowRef.current.stop()
        flowRef.current = null
      }
    }
  }, [active, finish, maxIndex, progress, reduceMotion])

  // Interrupt: wheel / touch / keyboard
  useEffect(() => {
    if (!active) return undefined

    const interrupt = () => {
      finish(sectionFromProgress())
    }

    const onWheel = (e) => {
      e.preventDefault()
      interrupt()
    }
    const onTouch = () => {
      interrupt()
    }
    const onKey = (e) => {
      const keys = [
        'Tab',
        'ArrowDown',
        'ArrowUp',
        'ArrowLeft',
        'ArrowRight',
        'PageDown',
        'PageUp',
        'Home',
        'End',
        ' ',
        'Spacebar',
        'Escape',
      ]
      if (keys.includes(e.key)) {
        e.preventDefault()
        interrupt()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouch, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouch)
      window.removeEventListener('keydown', onKey)
    }
  }, [active, finish, sectionFromProgress])

  const trackY = useTransform(progress, (p) => -p * viewportH)
  const progressScale = useTransform(progress, [0, maxIndex], [0, 1])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[90] overflow-hidden bg-bg text-fg"
      role="presentation"
      aria-hidden="true"
    >
      <motion.div
        className="relative w-full will-change-transform"
        style={{ y: trackY, height: viewportH * slideCount }}
      >
        {TOUR_SLIDES.map((slide, i) => {
          const { Component } = slide
          return (
            <div
              key={slide.id}
              className="absolute left-0 right-0"
              style={{ top: i * viewportH, height: viewportH }}
            >
              <FlowSection index={i} progress={progress}>
                <Component
                  presentation
                  condensed={slide.condensed}
                  flowMode
                  introReady
                />
              </FlowSection>
            </div>
          )
        })}
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left bg-accent/60"
        style={{ scaleX: progressScale }}
        aria-hidden="true"
      />
    </div>
  )
}
