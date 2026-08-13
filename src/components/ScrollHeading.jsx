// Section heading with optional GSAP word-stagger reveal. Always takes a plain string.
import { useRef } from 'react'
import { useGsapScroll, SECTION_START, SECTION_END } from '../hooks/useGsapScroll'

/**
 * @param {{
 *   text: string,
 *   as?: string,
 *   id?: string,
 *   className?: string,
 *   animateWords?: boolean,
 *   enabled?: boolean,
 * }} props
 */
export default function ScrollHeading({
  text,
  as: Tag = 'h2',
  id,
  className = '',
  animateWords = true,
  enabled = true,
}) {
  const ref = useRef(null)
  const safeText = typeof text === 'string' ? text : ''
  const words = safeText.trim() ? safeText.trim().split(/\s+/) : []

  useGsapScroll(
    ref,
    ({ scrubReveal, reduced }) => {
      if (!animateWords || !words.length) return
      const wordEls = ref.current?.querySelectorAll('[data-word]')
      if (!wordEls?.length) return

      if (reduced) {
        scrubReveal(wordEls, { y: 12, stagger: 0.04, duration: 0.32 }, {
          trigger: ref.current,
          start: 'top 88%',
          once: true,
        })
        return
      }

      scrubReveal(wordEls, { y: 16, stagger: 0.035 }, {
        trigger: ref.current,
        start: SECTION_START,
        end: SECTION_END,
      })
    },
    [safeText, animateWords],
    { enabled: enabled && animateWords && words.length > 0 },
  )

  // Plain string path — italic first letter (matches site Heading signature)
  if (!animateWords || words.length === 0) {
    const first = safeText.charAt(0)
    const rest = safeText.slice(1)
    return (
      <Tag id={id} className={`font-display ${className}`.trim()}>
        {first ? <span className="italic">{first}</span> : null}
        {rest}
      </Tag>
    )
  }

  return (
    <Tag
      ref={ref}
      id={id}
      className={`font-display ${className}`.trim()}
      aria-label={safeText}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block">
          <span data-word data-gsap-reveal className="inline-block will-change-transform">
            {i === 0 ? (
              <>
                <span className="italic">{word.charAt(0)}</span>
                {word.slice(1)}
              </>
            ) : (
              word
            )}
          </span>
          {i < words.length - 1 ? '\u00A0' : null}
        </span>
      ))}
    </Tag>
  )
}
