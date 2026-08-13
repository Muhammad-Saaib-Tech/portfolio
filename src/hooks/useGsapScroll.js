// Shared ScrollTrigger helpers — content stays in the DOM; GSAP only tweaks opacity/transform.
import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '../lib/gsapSetup'

registerGsap()

export const SCRUB = 0.38
export const SECTION_START = 'top 85%'
export const SECTION_END = 'top 55%'
export const REVEAL_EASE = 'power2.out'

function toArray(targets) {
  return gsap.utils.toArray(targets).filter(Boolean)
}

function isOnScreen(el) {
  const r = el.getBoundingClientRect()
  return r.bottom > 48 && r.top < window.innerHeight - 24
}

/** Restore natural visibility — used when a trigger fails or is already past. */
export function revealTargets(targets) {
  const elements = toArray(targets)
  if (!elements.length) return
  gsap.set(elements, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    clearProps: 'transform',
  })
}

/**
 * Scrubbed (or once) reveal that cannot leave content stuck hidden.
 * Uses fromTo + onRefresh viewport checks instead of gsap.from() (which
 * immediately writes opacity:0 even if the trigger never runs).
 */
export function scrubReveal(targets, fromVars = {}, stConfig = {}) {
  const elements = toArray(targets)
  if (!elements.length) return null

  const {
    y = 22,
    x = 0,
    scale,
    stagger,
    ease = REVEAL_EASE,
    duration = 0.4,
  } = fromVars

  const {
    trigger = elements[0],
    start = SECTION_START,
    end = SECTION_END,
    scrub = SCRUB,
    once = false,
    ...restST
  } = stConfig

  const from = { opacity: 0, y, x }
  if (scale != null) from.scale = scale

  const show = () => revealTargets(elements)

  try {
    if (!trigger || typeof ScrollTrigger.create !== 'function') {
      show()
      return null
    }

    const tween = gsap.fromTo(elements, from, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      ease,
      duration,
      stagger,
      immediateRender: false,
      overwrite: 'auto',
    })

    const st = ScrollTrigger.create({
      trigger,
      start,
      end,
      scrub: once ? false : scrub,
      once,
      animation: tween,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
      markers: false,
      ...restST,
      onRefresh(self) {
        restST.onRefresh?.(self)
        const scrolledPast = self.scroll() >= self.end
        const inView = elements.some(isOnScreen)
        if (scrolledPast || self.progress >= 0.98) {
          tween.progress(1)
          show()
          return
        }
        if (inView && self.progress < 0.08) {
          tween.progress(1)
          show()
        }
      },
      onLeave(self) {
        restST.onLeave?.(self)
        if (self.progress >= 0.98) show()
      },
    })

    return st
  } catch (err) {
    console.warn('ScrollTrigger reveal skipped; showing content', err)
    show()
    return null
  }
}

function watchStuckReveals(root) {
  const marked = () => root.querySelectorAll('[data-gsap-reveal]')

  const rescue = () => {
    marked().forEach((el) => {
      if (!isOnScreen(el)) return
      if (Number(window.getComputedStyle(el).opacity) < 0.12) {
        revealTargets(el)
      }
    })
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target
        const prev = el._gsapRescueTimer
        if (prev) window.clearTimeout(prev)
        if (!entry.isIntersecting) return
        // Wait briefly so a working scrub can start; only rescue if still invisible
        el._gsapRescueTimer = window.setTimeout(() => {
          if (Number(window.getComputedStyle(el).opacity) < 0.12 && isOnScreen(el)) {
            revealTargets(el)
          }
        }, 450)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
  )

  marked().forEach((el) => io.observe(el))

  const onRefresh = () => rescue()
  ScrollTrigger.addEventListener('refresh', onRefresh)

  const kick = window.setTimeout(rescue, 1200)

  return () => {
    window.clearTimeout(kick)
    marked().forEach((el) => {
      if (el._gsapRescueTimer) window.clearTimeout(el._gsapRescueTimer)
    })
    io.disconnect()
    ScrollTrigger.removeEventListener('refresh', onRefresh)
  }
}

/**
 * Run a ScrollTrigger setup inside gsap.context + matchMedia.
 * Always reverts on unmount (kills triggers, restores inline styles → CSS defaults = visible).
 */
export function useGsapScroll(scopeRef, setup, deps = [], { enabled = true } = {}) {
  useLayoutEffect(() => {
    if (!enabled) return undefined
    const root = scopeRef.current
    if (!root) return undefined

    let unwatch = () => {}

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        {
          isMobile: '(max-width: 767px)',
          isDesktop: '(min-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
          allowMotion: '(prefers-reduced-motion: no-preference)',
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions
          try {
            setup({
              gsap,
              ScrollTrigger,
              scrubReveal,
              reduced: Boolean(reduceMotion),
              isMobile: Boolean(isMobile),
              root,
            })
          } catch (err) {
            console.warn('Section scroll animation failed; showing content', err)
            revealTargets(root.querySelectorAll('[data-gsap-reveal]'))
          }
        },
      )
    }, root)

    unwatch = watchStuckReveals(root)

    const refresh = () => ScrollTrigger.refresh()
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(refresh)
    })
    window.addEventListener('load', refresh)
    const fontsReady = document.fonts?.ready?.then(refresh)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('load', refresh)
      unwatch()
      ctx.revert()
      void fontsReady
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls deps
  }, [enabled, ...deps])
}
