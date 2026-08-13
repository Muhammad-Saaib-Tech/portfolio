// Experience — vertical job timeline with collapsible project achievement lists.
import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { experience } from '../data/content'
import Heading from './Heading'
import {
  getRevealProps,
  headerVariants,
  revealTransitionFast,
  scrollVariants,
  scrollViewport,
  timelineEntryVariants,
} from '../lib/motion'

function ProjectBlock({ project, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-border bg-bg-elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex min-h-11 w-full items-start justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-accent-muted/40 sm:gap-4 sm:px-5"
      >
        <div className="min-w-0">
          <h4 className="font-display text-base font-semibold tracking-tight text-fg sm:text-lg">
            {project.name}
          </h4>
          {project.subtitle ? (
            <p className="mt-1 text-sm text-accent">{project.subtitle}</p>
          ) : null}
          <p className="mt-1 text-xs text-fg-muted">
            {open ? 'Hide details' : `${project.bullets.length} highlights — expand`}
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={revealTransitionFast}
          className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center text-fg-muted"
        >
          <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={revealTransitionFast}
            className="overflow-hidden"
          >
            <ul className="space-y-3 border-t border-border px-4 py-4 sm:px-5">
              {project.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-4 text-pretty text-sm leading-relaxed text-fg-muted before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-accent"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ExperienceCondensed() {
  return (
    <>
      <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-accent">
        Experience
      </p>
      <Heading
        as="h2"
        className="text-2xl font-bold tracking-tight text-fg sm:text-3xl"
      >
        Where I've built
      </Heading>

      <div className="mt-6 space-y-5">
        {experience.map((job) => (
          <article
            key={job.id}
            className="rounded-lg border border-border bg-bg-elevated p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h3 className="font-display text-base font-semibold text-fg sm:text-lg">
                {job.role}
              </h3>
              <span className="text-xs font-medium text-accent sm:text-sm">
                {job.period}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-fg-muted">{job.company}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-fg-muted">
              <MapPin size={12} className="text-accent" strokeWidth={1.75} />
              {job.location}
            </p>

            <ul className="mt-3 space-y-3">
              {job.projects.map((project) => (
                <li
                  key={project.name}
                  className="border-t border-border pt-3 first:border-0 first:pt-0"
                >
                  <h4 className="text-sm font-semibold text-fg">{project.name}</h4>
                  {project.subtitle ? (
                    <p className="text-xs text-accent">{project.subtitle}</p>
                  ) : null}
                  <ul className="mt-1.5 space-y-1">
                    {project.bullets.slice(0, 2).map((bullet) => (
                      <li
                        key={bullet}
                        className="relative pl-3 text-xs leading-snug text-fg-muted before:absolute before:left-0 before:top-[0.45em] before:size-1 before:rounded-full before:bg-accent"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </>
  )
}

function TimelineRail({ trackRef, reduceMotion }) {
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.85', 'end 0.35'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (reduceMotion) {
    return (
      <div
        className="absolute bottom-2 left-[0.4375rem] top-2 w-px bg-border sm:left-2.75"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className="absolute bottom-2 left-[0.4375rem] top-2 w-px overflow-hidden sm:left-2.75"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-border/40" />
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top bg-accent/70"
        style={{ scaleY }}
      />
    </div>
  )
}

export default function Experience({
  presentation = false,
  condensed = false,
  flowMode = false,
}) {
  const reduceMotion = useReducedMotion()
  const skipMotion = flowMode
  const trackRef = useRef(null)

  if (presentation && condensed) {
    return (
      <section className="relative w-full py-6 sm:py-8" aria-label="Experience">
        <ExperienceCondensed />
      </section>
    )
  }

  const headerV = skipMotion
    ? undefined
    : scrollVariants(headerVariants, reduceMotion)
  const entryV = skipMotion
    ? undefined
    : scrollVariants(timelineEntryVariants, reduceMotion)

  return (
    <section
      id={presentation ? undefined : 'experience'}
      className={`relative ${
        presentation ? 'w-full py-16 sm:py-20' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={headerV}
          initial={skipMotion ? false : 'hidden'}
          {...(skipMotion ? {} : getRevealProps(presentation, scrollViewport))}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Experience
          </p>
          <Heading
            as="h2"
            id={presentation ? undefined : 'experience-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Where I've built
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            Enterprise modules and platforms shipped end-to-end — expand each
            project for the full story.
          </p>
        </motion.div>

        <div ref={trackRef} className="relative mt-12">
          {!skipMotion && !presentation ? (
            <TimelineRail trackRef={trackRef} reduceMotion={reduceMotion} />
          ) : (
            <div
              className="absolute bottom-2 left-[0.4375rem] top-2 w-px bg-border sm:left-2.75"
              aria-hidden="true"
            />
          )}

          {experience.map((job, jobIndex) => (
            <motion.article
              key={job.id}
              variants={entryV}
              initial={skipMotion ? false : 'hidden'}
              {...(skipMotion
                ? {}
                : getRevealProps(presentation, {
                    ...scrollViewport,
                    amount: 0.15,
                  }))}
              transition={
                skipMotion || reduceMotion
                  ? undefined
                  : { delay: jobIndex * 0.1 }
              }
              className="relative min-w-0 pl-7 sm:pl-10"
            >
              <div
                className="absolute left-0 top-2 flex size-3.5 items-center justify-center rounded-full border-2 border-accent bg-bg sm:left-1 sm:size-4.5"
                aria-hidden="true"
              >
                <span className="size-1.5 rounded-full bg-accent sm:size-2" />
              </div>

              <header className="mb-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                    {job.role}
                  </h3>
                  <span className="text-sm font-medium text-accent">{job.period}</span>
                </div>
                <p className="mt-1 text-base text-fg-muted">{job.company}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-fg-muted">
                  <MapPin size={14} className="text-accent" strokeWidth={1.75} />
                  {job.location}
                </p>
              </header>

              <div className="space-y-4">
                {job.projects.map((project) => (
                  <ProjectBlock key={project.name} project={project} />
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
