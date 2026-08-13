import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const PresentationContext = createContext(null)

export const PRESENTATION_SLIDES = [
  { id: 'home', label: 'Intro' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

function resolveStartIndex() {
  let best = 0
  let bestScore = -Infinity
  PRESENTATION_SLIDES.forEach((slide, index) => {
    const el = document.getElementById(slide.id)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const visible =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
    if (visible > bestScore) {
      bestScore = visible
      best = index
    }
  })
  return best
}

export function PresentationProvider({ children }) {
  const [isActive, setIsActive] = useState(false)
  const [index, setIndex] = useState(0)

  const start = useCallback(() => {
    setIndex(resolveStartIndex())
    setIsActive(true)
  }, [])

  const exit = useCallback(() => {
    const slide = PRESENTATION_SLIDES[index]
    setIsActive(false)
    requestAnimationFrame(() => {
      const el = document.getElementById(slide?.id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [index])

  const goTo = useCallback((nextIndex) => {
    setIndex((current) => {
      const clamped = Math.max(0, Math.min(PRESENTATION_SLIDES.length - 1, nextIndex))
      return clamped === current ? current : clamped
    })
  }, [])

  const next = useCallback(() => {
    setIndex((current) => Math.min(PRESENTATION_SLIDES.length - 1, current + 1))
  }, [])

  const prev = useCallback(() => {
    setIndex((current) => Math.max(0, current - 1))
  }, [])

  const value = useMemo(
    () => ({
      isActive,
      index,
      slides: PRESENTATION_SLIDES,
      start,
      exit,
      goTo,
      next,
      prev,
    }),
    [isActive, index, start, exit, goTo, next, prev],
  )

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  )
}

export function usePresentation() {
  const ctx = useContext(PresentationContext)
  if (!ctx) {
    throw new Error('usePresentation must be used within PresentationProvider')
  }
  return ctx
}
