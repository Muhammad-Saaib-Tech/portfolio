// PresentationMode — continuous glide through portfolio sections.
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { usePresentation } from '../context/PresentationContext'
import { ease } from '../lib/motion'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Contact from './Contact'

/** Total seconds for Hero → Contact continuous flow (tune here) */
export const FLOW_PACE_SECONDS = 20

const SWIPE_THRESHOLD = 56

const SLIDE_COMPONENTS = [
  { id: 'home', label: 'Intro', Component: Hero, condensed: false },
  { id: 'about', label: 'About', Component: About, condensed: false },
  { id: 'skills', label: 'Skills', Component: Skills, condensed: true },
  { id: 'experience', label: 'Experience', Component: Experience, condensed: true },
  { id: 'projects', label: 'Projects', Component: Projects, condensed: true },
  { id: 'education', label: 'Education', Component: Education, condensed: false },
  { id: 'contact', label: 'Contact', Component: Contact, condensed: false },
]

function sectionWeight(index, total) {
  if (total <= 1) return 1
  return index / (total - 1)
}

function FlowSection({ index, progress, children }) {
  const opacity = useTransform(progress, (p) => {
    const dist = Math.abs(p - index)
    if (dist >= 1) return 0.15
    return 0.15 + (1 - dist) * 0.85
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

function ManualSlide({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
      className="flex min-h-dvh w-full items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </motion.div>
  )
}

export default function PresentationMode() {
  const { isActive, index: startIndex, slides, exit, goTo } = usePresentation()
  const reduceMotion = useReducedMotion()

  const [viewportH, setViewportH] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 800,
  )
  const [manualIndex, setManualIndex] = useState(0)
  const [displayProgress, setDisplayProgress] = useState(0)

  const progress = useMotionValue(0)
  const flowRef = useRef(null)
  const touchStart = useRef(null)

  const slideCount = SLIDE_COMPONENTS.length
  const maxIndex = slideCount - 1

  const syncDisplayProgress = useCallback(() => {
    setDisplayProgress(progress.get())
  }, [progress])

  const stopFlow = useCallback(() => {
    if (flowRef.current) {
      flowRef.current.stop()
      flowRef.current = null
    }
  }, [])

  const resumeFlowFrom = useCallback(
    (fromIndex) => {
      stopFlow()
      if (reduceMotion) return

      const clamped = Math.max(0, Math.min(maxIndex, fromIndex))
      const remaining = maxIndex - clamped
      if (remaining <= 0) return

      const duration = (remaining / maxIndex) * FLOW_PACE_SECONDS

      flowRef.current = animate(progress, maxIndex, {
        duration,
        ease: 'linear',
        onUpdate: syncDisplayProgress,
      })
    },
    [maxIndex, progress, reduceMotion, stopFlow, syncDisplayProgress],
  )

  const glideTo = useCallback(
    (targetIndex, { resume = true } = {}) => {
      const clamped = Math.max(0, Math.min(maxIndex, targetIndex))
      stopFlow()

      if (reduceMotion) {
        setManualIndex(clamped)
        goTo(clamped)
        return
      }

      flowRef.current = animate(progress, clamped, {
        duration: 0.65,
        ease,
        onUpdate: syncDisplayProgress,
        onComplete: () => {
          flowRef.current = null
          goTo(clamped)
          if (resume) resumeFlowFrom(clamped)
        },
      })
    },
    [
      goTo,
      maxIndex,
      progress,
      reduceMotion,
      resumeFlowFrom,
      stopFlow,
      syncDisplayProgress,
    ],
  )

  const goNext = useCallback(() => {
    const current = reduceMotion
      ? manualIndex
      : Math.round(progress.get())
    if (current >= maxIndex) return
    glideTo(current + 1)
  }, [glideTo, manualIndex, maxIndex, progress, reduceMotion])

  const goPrev = useCallback(() => {
    const current = reduceMotion
      ? manualIndex
      : Math.round(progress.get())
    if (current <= 0) return
    glideTo(current - 1)
  }, [glideTo, manualIndex, progress, reduceMotion])

  const jumpTo = useCallback(
    (i) => {
      glideTo(i)
    },
    [glideTo],
  )

  const handleExit = useCallback(() => {
    stopFlow()
    const current = reduceMotion
      ? manualIndex
      : Math.round(progress.get())
    goTo(current)
    exit()
  }, [exit, goTo, manualIndex, progress, reduceMotion, stopFlow])

  // Init flow on enter
  useEffect(() => {
    if (!isActive) {
      stopFlow()
      return undefined
    }

    const h = window.innerHeight
    setViewportH(h)

    const start = Math.max(0, Math.min(maxIndex, startIndex))
    progress.set(start)
    setDisplayProgress(start)
    setManualIndex(start)
    goTo(start)

    if (reduceMotion) return undefined

    resumeFlowFrom(start)

    return () => stopFlow()
  }, [
    isActive,
    startIndex,
    maxIndex,
    progress,
    goTo,
    reduceMotion,
    resumeFlowFrom,
    stopFlow,
  ])

  // Viewport resize
  useEffect(() => {
    if (!isActive) return undefined
    const onResize = () => setViewportH(window.innerHeight)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isActive])

  // Lock body scroll
  useEffect(() => {
    if (!isActive) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isActive])

  // Keyboard
  useEffect(() => {
    if (!isActive) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (document.querySelector('[data-project-dialog]')) return
        e.preventDefault()
        handleExit()
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, handleExit, goNext, goPrev])

  const trackY = useTransform(progress, (p) => -p * viewportH)

  const activeIndex = reduceMotion
    ? manualIndex
    : Math.round(displayProgress)

  const overallProgress = reduceMotion
    ? manualIndex / maxIndex
    : sectionWeight(displayProgress, maxIndex)

  if (!isActive) return null

  const onTouchStart = (e) => {
    const t = e.changedTouches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e) => {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) goNext()
    else goPrev()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-bg text-fg"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation mode"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={handleExit}
        aria-label="Exit presentation mode"
        className="absolute right-3 top-3 z-30 inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent sm:right-5 sm:top-4"
      >
        <X size={20} strokeWidth={1.75} />
      </button>

      <button
        type="button"
        onClick={goPrev}
        disabled={activeIndex <= 0}
        aria-label="Previous section"
        className="group absolute inset-y-0 left-0 z-20 flex w-10 items-center justify-center sm:w-14 disabled:pointer-events-none"
      >
        <span className="inline-flex size-10 items-center justify-center rounded-md text-fg-muted opacity-40 transition group-hover:bg-accent-muted group-hover:text-accent group-hover:opacity-100 group-disabled:opacity-0 sm:opacity-50">
          <ChevronLeft size={22} strokeWidth={1.75} />
        </span>
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={activeIndex >= maxIndex}
        aria-label="Next section"
        className="group absolute inset-y-0 right-0 z-20 flex w-10 items-center justify-center sm:w-14 disabled:pointer-events-none"
      >
        <span className="inline-flex size-10 items-center justify-center rounded-md text-fg-muted opacity-40 transition group-hover:bg-accent-muted group-hover:text-accent group-hover:opacity-100 group-disabled:opacity-0 sm:opacity-50">
          <ChevronRight size={22} strokeWidth={1.75} />
        </span>
      </button>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        {reduceMotion ? (
          <AnimatePresence mode="wait" initial={false}>
            <ManualSlide key={SLIDE_COMPONENTS[activeIndex].id}>
              {(() => {
                const slide = SLIDE_COMPONENTS[activeIndex]
                const { Component } = slide
                return (
                  <Component
                    presentation
                    condensed={slide.condensed}
                    flowMode
                    introReady
                  />
                )
              })()}
            </ManualSlide>
          </AnimatePresence>
        ) : (
          <motion.div
            className="relative w-full will-change-transform"
            style={{ y: trackY, height: viewportH * slideCount }}
          >
            {SLIDE_COMPONENTS.map((slide, i) => {
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
        )}
      </div>

      <div className="relative z-30 shrink-0 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <div
          className="mx-auto mb-3 h-0.5 max-w-md overflow-hidden rounded-full bg-fg-muted/20"
          aria-hidden="true"
        >
          <div
            className="h-full origin-left rounded-full bg-accent transition-transform duration-150 ease-linear will-change-transform"
            style={{ transform: `scaleX(${overallProgress})` }}
          />
        </div>

        <ol className="flex items-center justify-center gap-2" aria-label="Presentation progress">
          {slides.map((s, i) => {
            const active = i === activeIndex
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`Go to ${s.label}`}
                  aria-current={active ? 'true' : undefined}
                  className={`block rounded-full transition-all duration-200 ${
                    active
                      ? 'h-2 w-6 bg-accent'
                      : 'size-2 bg-fg-muted/40 hover:bg-fg-muted/70'
                  }`}
                />
              </li>
            )
          })}
        </ol>
        <span className="sr-only">
          Section {activeIndex + 1} of {slideCount}: {slides[activeIndex]?.label}
        </span>
      </div>

      <p
        className="pointer-events-none absolute left-4 top-4 z-20 hidden text-[11px] font-medium uppercase tracking-[0.18em] text-fg-muted sm:block"
        aria-hidden="true"
      >
        {slides[activeIndex]?.label}
      </p>
    </div>
  )
}
