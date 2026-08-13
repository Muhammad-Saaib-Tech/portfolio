import { useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { about, profile } from '../data/content'
import Heading from './Heading'
import ParallaxLayer from './ParallaxLayer'
import {
  aboutLeftVariants,
  aboutRightVariants,
  getRevealProps,
  scrollVariants,
  scrollViewport,
  staggerContainerVariants,
  staggerItemVariants,
  simpleFadeVariants,
} from '../lib/motion'

const stackPreview = ['.NET Core', 'Angular', 'Blazor', 'PostgreSQL', 'RabbitMQ']

function CodeEditorCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-elevated">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-fg-muted/35" />
          <span className="size-2.5 rounded-full bg-fg-muted/35" />
          <span className="size-2.5 rounded-full bg-accent/80" />
        </div>
        <div className="flex min-w-0 flex-1 items-center">
          <span className="truncate rounded-t-md border border-b-0 border-border bg-bg px-3 py-1 font-mono text-[11px] text-fg-muted">
            developer.json
          </span>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-fg-muted sm:inline">
          UTF-8
        </span>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,color-mix(in_srgb,var(--color-fg-muted)_8%,transparent),transparent_60%)]"
          aria-hidden="true"
        />
        <pre className="relative max-w-full overflow-x-auto overscroll-x-contain p-4 font-mono text-[12px] leading-6 sm:p-6 sm:text-sm sm:leading-7">
          <code className="block min-w-0 whitespace-pre-wrap wrap-break-word text-fg sm:whitespace-pre sm:break-normal">
            <span className="text-fg-muted">{'{'}</span>
            {'\n'}
            <LineIndent />
            <Key>"name"</Key>
            <Punct>: </Punct>
            <Str>"{profile.name}"</Str>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"role"</Key>
            <Punct>: </Punct>
            <Str>"{profile.title}"</Str>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"location"</Key>
            <Punct>: </Punct>
            <Str>"{profile.location}"</Str>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"stack"</Key>
            <Punct>: [</Punct>
            {'\n'}
            {stackPreview.map((tech, i) => (
              <span key={tech}>
                <LineIndent depth={2} />
                <Str>"{tech}"</Str>
                {i < stackPreview.length - 1 ? <Punct>,</Punct> : null}
                {'\n'}
              </span>
            ))}
            <LineIndent />
            <span className="text-fg-muted">]</span>
            <Punct>,</Punct>
            {'\n'}
            <LineIndent />
            <Key>"focus"</Key>
            <Punct>: </Punct>
            <Str>"scalable · secure · performant"</Str>
            {'\n'}
            <span className="text-fg-muted">{'}'}</span>
          </code>
        </pre>

        <div className="flex items-center justify-between border-t border-border bg-bg/60 px-4 py-2 font-mono text-[10px] text-fg-muted">
          <span className="text-accent">● JSON</span>
          <span>Ln 12, Col 2</span>
        </div>
      </div>
    </div>
  )
}

function LineIndent({ depth = 1 }) {
  return <span>{'  '.repeat(depth)}</span>
}

function Key({ children }) {
  return <span className="text-accent">{children}</span>
}

function Str({ children }) {
  return <span className="text-fg">{children}</span>
}

function Punct({ children }) {
  return <span className="text-fg-muted">{children}</span>
}

export default function About({
  presentation = false,
  condensed = false,
  flowMode = false,
}) {
  const sectionRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const skipMotion = flowMode
  void condensed

  const leftVariants = skipMotion
    ? undefined
    : scrollVariants(aboutLeftVariants, reduceMotion)
  const rightVariants = skipMotion
    ? undefined
    : scrollVariants(aboutRightVariants, reduceMotion)
  const chipVariants = skipMotion
    ? undefined
    : scrollVariants(staggerItemVariants, reduceMotion)

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'about'}
      className={`relative overflow-hidden ${
        presentation ? 'w-full py-8 sm:py-10' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={leftVariants}
            initial={skipMotion ? false : 'hidden'}
            {...(skipMotion
              ? {}
              : getRevealProps(presentation, scrollViewport))}
            className="min-w-0"
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
              About
            </p>
            <Heading
              as="h2"
              id={presentation ? undefined : 'about-heading'}
              className="text-[clamp(1.75rem,1.4rem+1.5vw,2.25rem)] font-bold tracking-tight text-fg sm:text-4xl"
            >
              Building systems that last
            </Heading>
            <p className="mt-6 text-pretty text-base leading-relaxed text-fg-muted sm:text-lg">
              {about.bio}
            </p>

            <motion.ul
              className="mt-8 flex flex-wrap gap-2.5"
              variants={
                skipMotion
                  ? undefined
                  : reduceMotion
                    ? simpleFadeVariants
                    : staggerContainerVariants
              }
              initial={skipMotion ? false : 'hidden'}
              {...(skipMotion
                ? {}
                : getRevealProps(presentation, scrollViewport))}
              aria-label="Core technologies"
            >
              {about.techBadges.map((badge) => (
                <motion.li key={badge.name} variants={chipVariants}>
                  <span className="inline-flex min-h-9 items-center rounded-full border border-border bg-bg-elevated px-3.5 py-1.5 text-sm font-medium text-fg transition duration-300 hover:border-accent/50 hover:bg-accent-muted hover:text-accent hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] [@media(hover:hover)]:hover:scale-105">
                    {badge.label}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div
            variants={rightVariants}
            initial={skipMotion ? false : 'hidden'}
            {...(skipMotion
              ? {}
              : getRevealProps(presentation, scrollViewport))}
            className="relative min-w-0"
          >
            {!presentation ? (
              <ParallaxLayer
                scrollRef={sectionRef}
                distance={36}
                offset={['start end', 'end start']}
                className="pointer-events-none absolute -inset-8"
              >
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-fg-muted)_12%,transparent),transparent_70%)] blur-2xl" />
              </ParallaxLayer>
            ) : (
              <div
                className="pointer-events-none absolute -inset-8 rounded-2xl bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-fg-muted)_12%,transparent),transparent_70%)] blur-2xl"
                aria-hidden="true"
              />
            )}
            <div className="relative">
              <CodeEditorCard />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
