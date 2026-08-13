import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { profile } from '../data/content'
import Heading from './Heading'
import Magnetic from './Magnetic'
import ParallaxLayer from './ParallaxLayer'
import HeroVisual from './HeroVisual'
import { ENABLE_HERO_STARFIELD } from '../config/features'
import {
  ambientLoop,
  heroContainerVariants,
  heroItemVariants,
} from '../lib/motion'

const StarfieldBackground = lazy(() => import('./StarfieldBackground'))

const MOBILE_MAX_WIDTH = 768
const MIN_CPU_CORES = 4

/**
 * Always-on CSS mesh — the background when starfield is skipped (mobile / reduced-motion / low-end).
 * Also sits under the starfield on desktop so there is never an empty Hero.
 */
function HeroMeshBackground({ withGlow = true }) {
  return (
    <>
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-fg)_7%,transparent),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_70%,color-mix(in_srgb,var(--color-fg-muted)_8%,transparent),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_10%_80%,color-mix(in_srgb,var(--color-fg)_5%,transparent),transparent_45%)]"
        aria-hidden="true"
      />
      <div
        className="hero-grid absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
        aria-hidden="true"
      />
      {withGlow ? (
        <div
          className="absolute left-1/2 top-[28%] h-105 w-105 -translate-x-1/2 rounded-full bg-fg/5 blur-[100px]"
          aria-hidden="true"
        />
      ) : null}
    </>
  )
}

function useStarfieldEligible() {
  const reduceMotion = useReducedMotion()
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    let timeoutId = 0

    const evaluate = () => {
      if (!ENABLE_HERO_STARFIELD) {
        setEligible(false)
        return
      }
      if (reduceMotion) {
        setEligible(false)
        return
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setEligible(false)
        return
      }
      if (window.innerWidth < MOBILE_MAX_WIDTH) {
        setEligible(false)
        return
      }
      const cores = navigator.hardwareConcurrency
      if (typeof cores === 'number' && cores > 0 && cores < MIN_CPU_CORES) {
        setEligible(false)
        return
      }
      setEligible(true)
    }

    const onResize = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(evaluate, 150)
    }

    evaluate()
    window.addEventListener('resize', onResize)
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionMq.addEventListener('change', evaluate)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('resize', onResize)
      motionMq.removeEventListener('change', evaluate)
    }
  }, [reduceMotion])

  return eligible
}

export default function Hero({ introReady = true, presentation = false, tourActive = true }) {
  const sectionRef = useRef(null)
  const starfieldEligible = useStarfieldEligible()
  const showStarfield = starfieldEligible && !presentation
  const ready = Boolean(introReady && tourActive)

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'home'}
      data-starfield={showStarfield ? 'active' : 'fallback'}
      className={`relative flex items-center overflow-hidden ${
        presentation ? 'min-h-full py-10' : 'min-h-dvh'
      }`}
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 z-0 bg-bg" />

        {/* Always render CSS mesh — never leave Hero without a background */}
        <div className="absolute inset-0 z-0">
          <HeroMeshBackground withGlow={!showStarfield} />
        </div>

        {/* Desktop-only decorative parallax glow (extra depth; mesh already present) */}
        {showStarfield ? (
          <ParallaxLayer
            scrollRef={sectionRef}
            distance={72}
            className="absolute inset-0 z-1"
          >
            <motion.div
              className="absolute left-1/2 top-[28%] h-105 w-105 -translate-x-1/2 rounded-full bg-fg/5 blur-[100px]"
              animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
              transition={ambientLoop}
            />
          </ParallaxLayer>
        ) : null}

        {/* Three.js starfield only when eligible — sits above mesh, below content */}
        {showStarfield ? (
          <Suspense fallback={null}>
            <StarfieldBackground />
          </Suspense>
        ) : null}
      </div>

      <div
        className={`relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-5 sm:gap-10 sm:px-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:gap-x-20 xl:gap-x-24 ${
          presentation
            ? 'pb-10 pt-6 sm:pb-12 sm:pt-8 lg:pb-14 lg:pt-10'
            : 'pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32'
        }`}
      >
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate={ready ? 'visible' : 'hidden'}
          className="relative z-20 min-w-0 w-full"
        >
          <motion.p
            variants={heroItemVariants}
            className="mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted sm:mb-5"
          >
            <MapPin size={15} className="shrink-0 text-accent" strokeWidth={1.75} />
            {profile.location}
          </motion.p>

          <Heading
            as={motion.h1}
            variants={heroItemVariants}
            className="max-w-[16ch] text-[clamp(1.75rem,1.1rem+4.2vw,3rem)] font-extrabold leading-[1.12] tracking-tight wrap-break-word text-fg"
          >
            {profile.name}
          </Heading>

          <motion.h2
            variants={heroItemVariants}
            className="mt-3 font-display text-[clamp(1.15rem,0.9rem+1.8vw,1.85rem)] font-semibold tracking-tight text-accent sm:mt-4"
          >
            {profile.title}
          </motion.h2>

          <motion.p
            variants={heroItemVariants}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:mt-6 sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={heroItemVariants}
            className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#contact"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover sm:w-auto"
              >
                Get in touch
              </a>
            </Magnetic>
            <Magnetic className="w-full sm:w-auto">
              <a
                href="#projects"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent sm:w-auto"
              >
                View projects
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <div className="relative z-20 flex min-w-0 w-full items-center justify-center lg:justify-end">
          <HeroVisual introReady={ready} />
        </div>
      </div>
    </section>
  )
}
