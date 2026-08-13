// Lightweight text scramble — cycles glyphs briefly before settling on the real string.
import { useEffect, useRef, useState } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

/**
 * @param {string} text
 * @param {{ active?: boolean, durationMs?: number, reduceMotion?: boolean }} options
 */
export function useTextScramble(text, { active = true, durationMs = 520, reduceMotion = false } = {}) {
  const [display, setDisplay] = useState(reduceMotion || !active ? text : '')
  const frameRef = useRef(0)
  const startRef = useRef(0)

  useEffect(() => {
    if (reduceMotion || !active) {
      setDisplay(text)
      return undefined
    }

    setDisplay('')
    startRef.current = performance.now()
    const chars = text.split('')

    const tick = (now) => {
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / durationMs)
      // Ease-out progress so late characters settle sooner
      const progress = 1 - (1 - t) ** 2
      const revealCount = Math.floor(progress * chars.length)

      const next = chars
        .map((ch, i) => {
          if (ch === ' ') return ' '
          if (i < revealCount) return ch
          return randomGlyph()
        })
        .join('')

      setDisplay(next)

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text, active, durationMs, reduceMotion])

  return display
}
