import { motion, useReducedMotion } from 'framer-motion'
import { duration, ease, getRevealProps, simpleFadeVariants } from '../lib/motion'

const wordContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.04 },
  },
}

const wordItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.fast, ease },
  },
}

const charContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.018, delayChildren: 0.02 },
  },
}

const charItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease },
  },
}

/**
 * Staggered word or character reveal for headings.
 * Reduced-motion → simple opacity fade of the full string.
 */
export default function WordReveal({
  text,
  className = '',
  presentation = false,
  active = true,
  mode = 'words',
}) {
  const reduceMotion = useReducedMotion()
  const words = String(text).split(' ')
  const chars = Array.from(String(text))

  if (reduceMotion) {
    return (
      <motion.span
        className={className}
        variants={simpleFadeVariants}
        {...getRevealProps(presentation, undefined, active)}
      >
        {text}
      </motion.span>
    )
  }

  if (mode === 'chars') {
    return (
      <motion.span
        className={`inline ${className}`}
        variants={charContainer}
        {...getRevealProps(presentation, undefined, active)}
        aria-label={text}
      >
        {chars.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            variants={charItem}
            className="inline-block"
            aria-hidden="true"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </motion.span>
    )
  }

  return (
    <motion.span
      className={`inline ${className}`}
      variants={wordContainer}
      {...getRevealProps(presentation, undefined, active)}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          variants={wordItem}
          className="inline-block"
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : null}
        </motion.span>
      ))}
    </motion.span>
  )
}
