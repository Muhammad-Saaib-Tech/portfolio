// Shared Framer Motion tokens — one easing curve and timing scale site-wide.
export const ease = [0.22, 1, 0.36, 1]

/** Canonical durations (seconds) */
export const duration = {
  fast: 0.35,
  base: 0.55,
  slow: 0.65,
}

/** Canonical stagger gaps */
export const stagger = {
  children: 0.1,
  items: 0.06,
  delay: 0.08,
}

/** Default transition for section reveals */
export const revealTransition = {
  duration: duration.base,
  ease,
}

/** Slightly longer for primary column / hero items */
export const revealTransitionSlow = {
  duration: duration.slow,
  ease,
}

/** Collapse, chevron, nav indicator */
export const revealTransitionFast = {
  duration: duration.fast,
  ease,
}

export const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

export const fadeLeftVariants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: revealTransitionSlow,
  },
}

export const fadeRightVariants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...revealTransitionSlow, delay: stagger.delay },
  },
}

export const staggerContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.children,
      delayChildren: stagger.delay,
    },
  },
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransitionFast,
  },
}

/** Ambient loops (glow) — intentional easeInOut, not section reveal */
export const ambientLoop = {
  duration: 10,
  repeat: Infinity,
  ease: 'easeInOut',
}

/** whileInView vs forced animate for Presentation Mode */
export function getRevealProps(presentation, viewport = { once: true, amount: 0.25 }) {
  if (presentation) {
    return { initial: 'hidden', animate: 'visible' }
  }
  return { initial: 'hidden', whileInView: 'visible', viewport }
}

/** Presentation-mode theatrical variants (site ease, more travel) */
export const presentFadeLeft = {
  hidden: { opacity: 0, x: -64 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow + 0.1, ease },
  },
}

export const presentFadeRight = {
  hidden: { opacity: 0, x: 64 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.slow + 0.1, ease, delay: 0.12 },
  },
}

export const presentScaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: revealTransition,
  },
}

export const presentPopItem = {
  hidden: { opacity: 0, scale: 0.88, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: revealTransitionFast,
  },
}

export const presentTimelineItem = {
  hidden: { opacity: 0, x: -28, y: 12 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: revealTransition,
  },
}

export const presentSpringItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 },
  },
}

export const presentStaggerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
}

export const presentSimpleFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast, ease },
  },
}

export const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.children,
      delayChildren: 0.12,
    },
  },
}

export const heroItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransitionSlow,
  },
}

/** Panel with nested chip stagger (Skills) */
export const panelVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...revealTransition,
      staggerChildren: stagger.items,
      delayChildren: 0.12,
    },
  },
}
