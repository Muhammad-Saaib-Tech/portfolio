import { useReducedMotion } from 'framer-motion'
import { useTextScramble } from '../hooks/useTextScramble'

/**
 * Decodes into `text` with a brief character scramble. Reduced-motion → final text immediately.
 */
export default function TextScramble({
  text,
  active = true,
  durationMs = 520,
  className = '',
  as: Tag = 'span',
  'aria-label': ariaLabel,
}) {
  const reduceMotion = useReducedMotion()
  const display = useTextScramble(text, {
    active,
    durationMs,
    reduceMotion: Boolean(reduceMotion),
  })

  return (
    <Tag className={className} aria-label={ariaLabel || text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}
