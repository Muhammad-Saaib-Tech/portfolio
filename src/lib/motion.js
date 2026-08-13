// Shared Framer Motion tokens — hover, hero load, modals, cursor (not scroll reveals).
export const ease = [0.22, 1, 0.36, 1]

/** Canonical durations (seconds) — snappier site-wide */
export const duration = {
  fast: 0.28,
  base: 0.4,
  slow: 0.48,
}

/** Canonical stagger gaps */
export const stagger = {
  children: 0.07,
  items: 0.04,
  delay: 0.05,
}

/** Default transition for interactive / hero motion */
export const revealTransition = {
  duration: duration.base,
  ease,
}

export const revealTransitionSlow = {
  duration: duration.slow,
  ease,
}

/** Collapse, chevron, nav indicator */
export const revealTransitionFast = {
  duration: duration.fast,
  ease,
}

/** Ambient loops (glow) — intentional easeInOut, not section reveal */
export const ambientLoop = {
  duration: 10,
  repeat: Infinity,
  ease: 'easeInOut',
}

export const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.children,
      delayChildren: 0.06,
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
