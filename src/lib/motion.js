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

/** Canonical scroll-trigger viewport for normal page scrolling */
export const scrollViewport = { once: true, amount: 0.2 }

/** Opacity-only fallback when prefers-reduced-motion is on */
export const simpleFadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.fast, ease },
  },
}

/**
 * whileInView vs forced animate for tour / presentation overlays.
 * @param {boolean} presentation
 * @param {{ once?: boolean, amount?: number }} [viewport]
 * @param {boolean} [active=true] — tour slides stay hidden until near the playhead
 */
export function getRevealProps(presentation, viewport = scrollViewport, active = true) {
  if (presentation) {
    return { initial: 'hidden', animate: active ? 'visible' : 'hidden' }
  }
  return { initial: 'hidden', whileInView: 'visible', viewport }
}

/** Pick full scroll variants or reduced-motion fade */
export function scrollVariants(full, reduceMotion) {
  return reduceMotion ? simpleFadeVariants : full
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

/** Panel with nested chip stagger (Skills) — scale-up on scroll */
export const panelVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.base,
      ease,
      staggerChildren: stagger.items,
      delayChildren: 0.1,
    },
  },
}

/** Skills chip stagger inside a panel */
export const skillChipVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransitionFast,
  },
}

/** Skills grid container — row-by-row panel stagger */
export const skillsGridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: stagger.delay,
    },
  },
}

/** Projects card pop (scale from 90%) */
export const projectPopVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: revealTransition,
  },
}

/** Diagonal-ish stagger for a 3-col project grid */
export function projectCardDelay(index, cols = 3) {
  const row = Math.floor(index / cols)
  const col = index % cols
  return (row + col) * 0.08
}

/** Experience timeline entry — slide up */
export const timelineEntryVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
}

/** Education subtle 3D tilt-in */
export const educationTiltVariants = {
  hidden: { opacity: 0, rotateX: 8, y: 16 },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: duration.base, ease },
  },
}

/** Contact link / CTA spring from below */
export const contactSpringVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 28, mass: 0.7 },
  },
}

export const contactStaggerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
}

/** About dual-column scroll leads */
export const aboutLeftVariants = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease },
  },
}

export const aboutRightVariants = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease, delay: 0.12 },
  },
}

/** Clip-path wipe (left → right) — About bio, Education */
export const clipWipeVariants = {
  hidden: {
    opacity: 0.35,
    clipPath: 'inset(0 100% 0 0)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: duration.slow, ease },
  },
}

export const clipWipeUpVariants = {
  hidden: {
    opacity: 0.35,
    clipPath: 'inset(100% 0 0 0)',
  },
  visible: {
    opacity: 1,
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: duration.base, ease },
  },
}

/** Masked window reveal + scale settle — Skills / Projects */
export const maskScaleVariants = {
  hidden: {
    opacity: 0.4,
    scale: 1.05,
    clipPath: 'inset(8% 8% 8% 8%)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: duration.base,
      ease,
      staggerChildren: stagger.items,
      delayChildren: 0.08,
    },
  },
}

/** 3D perspective tilt — About IDE / Experience entries */
export const tiltInRightVariants = {
  hidden: {
    opacity: 0,
    rotateY: 14,
    rotateX: 4,
    z: -24,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    z: 0,
    transition: { duration: duration.slow, ease },
  },
}

export const tiltInLeftVariants = {
  hidden: {
    opacity: 0,
    rotateY: -14,
    rotateX: 4,
    z: -24,
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    z: 0,
    transition: { duration: duration.slow, ease },
  },
}

export const tiltInUpVariants = {
  hidden: {
    opacity: 0,
    rotateX: 12,
    y: 20,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: duration.base, ease },
  },
}

/** Slightly snappier creative reveals for IntroTour overlay */
export const tourClipWipeVariants = {
  hidden: { opacity: 0.35, clipPath: 'inset(0 100% 0 0)' },
  visible: {
    opacity: 1,
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.45, ease },
  },
}

export const tourMaskScaleVariants = {
  hidden: { opacity: 0.4, scale: 1.05, clipPath: 'inset(8% 8% 8% 8%)' },
  visible: {
    opacity: 1,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 0.45, ease, staggerChildren: 0.05, delayChildren: 0.04 },
  },
}

export const tourTiltVariants = {
  hidden: { opacity: 0, rotateY: 12, rotateX: 4 },
  visible: {
    opacity: 1,
    rotateY: 0,
    rotateX: 0,
    transition: { duration: 0.45, ease },
  },
}
