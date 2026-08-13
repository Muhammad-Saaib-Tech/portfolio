// PresentationMode — full-screen slide walkthrough of portfolio sections.
import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { usePresentation } from '../context/PresentationContext'
import { duration, ease } from '../lib/motion'
import Hero from './Hero'
import About from './About'
import Skills from './Skills'
import Experience from './Experience'
import Projects from './Projects'
import Education from './Education'
import Contact from './Contact'

const AUTO_ADVANCE_MS = 7000
const SWIPE_THRESHOLD = 56

const SLIDE_COMPONENTS = {
  home: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  education: Education,
  contact: Contact,
}

export default function PresentationMode() {
  const { isActive, index, slides, exit, goTo, next, prev } = usePresentation()
  const reduceMotion = useReducedMotion()
  const touchStart = useRef(null)

  const goNext = useCallback(() => {
    if (index >= slides.length - 1) return
    next()
  }, [index, slides.length, next])

  const goPrev = useCallback(() => {
    if (index <= 0) return
    prev()
  }, [index, prev])

  const jumpTo = useCallback(
    (i) => {
      goTo(i)
    },
    [goTo],
  )

  // Lock body scroll while presenting
  useEffect(() => {
    if (!isActive) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isActive])

  // Keyboard: arrows navigate, Escape exits
  useEffect(() => {
    if (!isActive) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (document.querySelector('[data-project-dialog]')) return
        e.preventDefault()
        exit()
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
  }, [isActive, exit, goNext, goPrev])

  // Auto-advance — resets after manual nav; disabled for reduced motion
  useEffect(() => {
    if (!isActive || reduceMotion) return undefined
    if (index >= slides.length - 1) return undefined

    const timer = window.setTimeout(() => {
      next()
    }, AUTO_ADVANCE_MS)

    return () => window.clearTimeout(timer)
  }, [isActive, index, slides.length, next, reduceMotion])

  if (!isActive) return null

  const slide = slides[index]
  const Slide = SLIDE_COMPONENTS[slide.id]
  const isFirst = index === 0
  const isLast = index === slides.length - 1

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
      className="fixed inset-0 z-[100] flex flex-col bg-bg text-fg"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation mode"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Exit */}
      <button
        type="button"
        onClick={exit}
        aria-label="Exit presentation mode"
        className="absolute right-3 top-3 z-30 inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent sm:right-5 sm:top-4"
      >
        <X size={20} strokeWidth={1.75} />
      </button>

      {/* Edge arrows — subtle, stronger on hover */}
      <button
        type="button"
        onClick={goPrev}
        disabled={isFirst}
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
        disabled={isLast}
        aria-label="Next section"
        className="group absolute inset-y-0 right-0 z-20 flex w-10 items-center justify-center sm:w-14 disabled:pointer-events-none"
      >
        <span className="inline-flex size-10 items-center justify-center rounded-md text-fg-muted opacity-40 transition group-hover:bg-accent-muted group-hover:text-accent group-hover:opacity-100 group-disabled:opacity-0 sm:opacity-50">
          <ChevronRight size={22} strokeWidth={1.75} />
        </span>
      </button>

      {/* Slides */}
      <div className="relative min-h-0 flex-1 overflow-hidden px-8 sm:px-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 18 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -12 }
            }
            transition={{
              duration: reduceMotion ? duration.fast : duration.base,
              ease,
            }}
            className="absolute inset-0 overflow-y-auto overscroll-contain"
          >
            <div className="mx-auto flex min-h-full max-w-6xl items-start">
              <Slide presentation introReady />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="relative z-30 flex shrink-0 items-center justify-center gap-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <ol className="flex items-center gap-2" aria-label="Presentation progress">
          {slides.map((s, i) => {
            const active = i === index
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`Go to ${s.label}`}
                  aria-current={active ? 'true' : undefined}
                  className={`block rounded-full transition-all duration-300 ${
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
          Slide {index + 1} of {slides.length}: {slide.label}
        </span>
      </div>

      {/* Thin auto-advance progress (hidden when reduced motion) */}
      {!reduceMotion && !isLast ? (
        <motion.div
          key={`progress-${slide.id}-${index}`}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-0.5 origin-left bg-accent/70"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
          style={{ transformOrigin: 'left' }}
        />
      ) : null}

      {/* Visually quiet label */}
      <p
        className="pointer-events-none absolute left-4 top-4 z-20 hidden text-[11px] font-medium uppercase tracking-[0.18em] text-fg-muted sm:block"
        aria-hidden="true"
      >
        {slide.label}
      </p>
    </div>
  )
}
