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
  stagger,
} from '../lib/motion'

export default function Hero({ introReady = true, presentation = false }) {
  const sectionRef = useRef(null)
  const titleWords = profile.title.split(' ')

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'home'}
      className={`relative flex items-center overflow-hidden ${
        presentation ? 'min-h-full py-10' : 'min-h-dvh'
      }`}
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
          animate={introReady || presentation ? 'visible' : 'hidden'}
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
            className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-display text-[clamp(1.15rem,0.9rem+1.8vw,1.85rem)] font-semibold tracking-tight text-accent sm:mt-4 sm:gap-x-2.5"
            aria-label={profile.title}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={
                  introReady || presentation
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 16 }
                }
                transition={{
                  delay:
                    introReady || presentation
                      ? duration.base + i * stagger.items
                      : 0,
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

        <div className="flex min-w-0 w-full items-center justify-center lg:justify-end">
          <HeroVisual introReady={introReady || presentation} />
        </div>
      </div>
    </section>
  )
}
