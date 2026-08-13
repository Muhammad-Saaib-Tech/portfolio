// Shared ScrollTrigger helpers — content stays in the DOM; GSAP only tweaks opacity/transform.
import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, registerGsap } from '../lib/gsapSetup'

registerGsap()

/** Ensure targets are fully visible (safety if a trigger never runs or is killed mid-way). */
export function revealTargets(targets) {
  if (!targets || (targets.length !== undefined && targets.length === 0)) return
  gsap.set(targets, { clearProps: 'opacity,visibility,transform,filter' })
}

/**
 * Run a ScrollTrigger setup inside gsap.context + matchMedia.
 * Always reverts on unmount (kills triggers, restores inline styles → CSS defaults = visible).
 *
 * @param {React.RefObject<HTMLElement|null>} scopeRef
 * @param {(ctx: { gsap: typeof gsap, ScrollTrigger: typeof ScrollTrigger, reduced: boolean, isMobile: boolean }) => void} setup
 * @param {unknown[]} [deps]
 * @param {{ enabled?: boolean }} [options] — set enabled:false for IntroTour presentation clones
 */
export function useGsapScroll(scopeRef, setup, deps = [], { enabled = true } = {}) {
  useLayoutEffect(() => {
    if (!enabled) return undefined
    const root = scopeRef.current
    if (!root) return undefined

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
          setup({
            gsap,
            ScrollTrigger,
            reduced: Boolean(reduceMotion),
            isMobile: Boolean(isMobile),
            root,
          })
        },
      )
    }, root)

    // Failsafe: restore content that is on-screen but stuck near-invisible
    const failsafe = window.setTimeout(() => {
      const marked = root.querySelectorAll('[data-gsap-reveal]')
      marked.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const onScreen =
          rect.bottom > 40 && rect.top < window.innerHeight * 0.92
        const op = Number(window.getComputedStyle(el).opacity)
        if (onScreen && op < 0.08) {
          gsap.set(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            clearProps: 'transform',
          })
        }
      })
    }, 3500)

    return () => {
      window.clearTimeout(failsafe)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls deps
  }, [enabled, ...deps])
}

/** Default scrub feel — slightly smoothed, not 1:1 raw */
export const SCRUB = 0.65

/** Shared start/end for section enters */
export const SECTION_START = 'top 80%'
export const SECTION_END = 'top 35%'
