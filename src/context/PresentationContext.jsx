import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const PresentationContext = createContext(null)

export const PRESENTATION_SLIDES = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function PresentationProvider({ children }) {
  const [isActive, setIsActive] = useState(false)

  const start = useCallback(() => {
    setIsActive(true)
  }, [])

  const exit = useCallback((sectionId) => {
    setIsActive(false)
    requestAnimationFrame(() => {
      const id = sectionId || 'about'
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
    })
  }, [])

  const value = useMemo(
    () => ({
      isActive,
      slides: PRESENTATION_SLIDES,
      start,
      exit,
    }),
    [isActive, start, exit],
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
