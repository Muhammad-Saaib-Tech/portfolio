// PresentationMode — 3D circular gallery of portfolio sections.
import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePresentation } from '../context/PresentationContext'
import CircularGallery from './CircularGallery'

export default function PresentationMode() {
  const { isActive, exit } = usePresentation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isActive) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        exit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isActive, exit])

  if (!isActive) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-bg text-fg"
      role="dialog"
      aria-modal="true"
      aria-label="Presentation mode"
    >
      <button
        type="button"
        onClick={() => exit()}
        aria-label="Exit presentation mode"
        className="absolute right-3 top-3 z-30 inline-flex size-11 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-accent-muted hover:text-accent sm:right-5 sm:top-4"
      >
        <X size={20} strokeWidth={1.75} />
      </button>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-2 pt-14 sm:px-8 sm:pt-16">
        <p className="mb-1 text-sm font-medium uppercase tracking-[0.18em] text-accent">
          Presentation
        </p>
        <h2 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          Explore the portfolio
        </h2>
        <p className="mt-2 text-center text-sm text-fg-muted">
          Click a section to explore
          {!reduceMotion ? ' · Drag or swipe to spin · ← → to nudge' : null}
        </p>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden py-4">
        <CircularGallery
          reduceMotion={Boolean(reduceMotion)}
          onSelect={(sectionId) => exit(sectionId)}
        />
      </div>
    </div>
  )
}
