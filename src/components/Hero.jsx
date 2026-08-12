import { useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { profile } from '../data/content'
import Heading from './Heading'
import Magnetic from './Magnetic'
import ParallaxLayer from './ParallaxLayer'
import HeroVisual from './HeroVisual'
import {
  ambientLoop,
  duration,
  heroContainerVariants,
  heroItemVariants,
  revealTransition,
  scrollCueLoop,
  stagger,
} from '../lib/motion'

export default function Hero({ introReady = true }) {
  const sectionRef = useRef(null)
  const titleWords = profile.title.split(' ')

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-dvh items-center overflow-hidden"
      aria-label="Introduction"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-bg" />

        <ParallaxLayer scrollRef={sectionRef} distance={56} className="absolute inset-x-0 -top-16 -bottom-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-fg)_7%,transparent),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_85%_70%,color-mix(in_srgb,var(--color-fg-muted)_8%,transparent),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_10%_80%,color-mix(in_srgb,var(--color-fg)_5%,transparent),transparent_45%)]" />
        </ParallaxLayer>

        <ParallaxLayer scrollRef={sectionRef} distance={32} className="absolute inset-x-0 -top-12 -bottom-12">
          <div className="hero-grid absolute inset-0 opacity-[0.35] dark:opacity-[0.22]" />
        </ParallaxLayer>

        <ParallaxLayer scrollRef={sectionRef} distance={72} className="absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-[28%] h-105 w-105 -translate-x-1/2 rounded-full bg-fg/5 blur-[100px]"
            animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.08, 1] }}
            transition={ambientLoop}
          />
        </ParallaxLayer>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-24 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:gap-x-20 xl:gap-x-24">
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate={introReady ? 'visible' : 'hidden'}
          className="relative z-20 min-w-0 w-full"
        >
          <motion.p
            variants={heroItemVariants}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-fg-muted"
          >
            <MapPin size={15} className="text-accent" strokeWidth={1.75} />
            {profile.location}
          </motion.p>

          <Heading
            as={motion.h1}
            variants={heroItemVariants}
            className="max-w-[16ch] text-[2.2rem] font-extrabold leading-[1.12] tracking-tight text-fg sm:text-[2.45rem] lg:text-[2.55rem] xl:text-[3rem]"
          >
            {profile.name}
          </Heading>

          <motion.h2
            variants={heroItemVariants}
            className="mt-4 flex flex-wrap gap-x-2.5 font-display text-[clamp(1.25rem,3.5vw,1.85rem)] font-semibold tracking-tight text-accent"
            aria-label={profile.title}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{
                  delay: introReady ? duration.base + i * stagger.items : 0,
                  ...revealTransition,
                }}
                className="inline-block"
              >
                {i === 0 ? (
                  <Heading as="span" className="font-semibold tracking-tight">
                    {word}
                  </Heading>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.h2>

          <motion.p
            variants={heroItemVariants}
            className="mt-6 max-w-xl text-balance text-base leading-relaxed text-fg-muted sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div variants={heroItemVariants} className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
              >
                Get in touch
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent hover:text-accent"
              >
                View projects
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <div className="flex min-w-0 w-full items-center justify-center lg:justify-end">
          <HeroVisual introReady={introReady} />
        </div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: introReady ? 1 : 0 }}
        transition={{
          delay: introReady ? 1.2 : 0,
          ...revealTransition,
          duration: duration.slow,
        }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-fg-muted transition-colors hover:text-accent"
        aria-label="Scroll to about section"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em]">Scroll</span>
        <motion.span
          className="block h-8 w-px origin-top bg-accent"
          animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          transition={scrollCueLoop}
        />
      </motion.a>
    </section>
  )
}
