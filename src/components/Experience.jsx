// Experience — GSAP pin + scrubbed timeline draw (pin disabled on mobile).
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { experience } from '../data/content'
import ScrollHeading from './ScrollHeading'
import { revealTransitionFast } from '../lib/motion'
import { useGsapScroll, SCRUB, REVEAL_EASE, scrubReveal, revealTargets } from '../hooks/useGsapScroll'

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
      <ScrollHeading
        text="Where I've built"
        className="text-2xl font-bold tracking-tight text-fg sm:text-3xl"
        animateWords={false}
        enabled={false}
      />

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

export default function Experience({
  presentation = false,
  condensed = false,
}) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const gsapEnabled = !presentation

  useGsapScroll(
    sectionRef,
    ({ gsap, reduced, isMobile, root }) => {
      const header = root.querySelector('[data-exp-header]')
      const track = trackRef.current
      const line = root.querySelector('[data-exp-line]')
      const entries = root.querySelectorAll('[data-exp-entry]')

      const showEntries = () => {
        revealTargets(entries)
        if (line) gsap.set(line, { scaleY: 1, clearProps: 'transform' })
      }

      if (reduced) {
        scrubReveal([header, ...entries], { y: 16, stagger: 0.08, duration: 0.35 }, {
          trigger: header || root,
          start: 'top 88%',
          once: true,
        })
        if (line) gsap.set(line, { scaleY: 1 })
        return
      }

      if (header) {
        scrubReveal(header, { y: 22 }, {
          trigger: header,
          start: 'top 85%',
          end: 'top 58%',
        })
      }

      if (!track || !entries.length) return

      const safety = {
        onRefresh(self) {
          if (self.scroll() >= self.end || self.progress >= 0.98) {
            self.animation?.progress(1)
            showEntries()
          }
        },
        onLeave() {
          showEntries()
        },
      }

      if (isMobile) {
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: REVEAL_EASE,
              immediateRender: false,
              scrollTrigger: {
                trigger: track,
                start: 'top 80%',
                end: 'bottom 58%',
                scrub: SCRUB,
                invalidateOnRefresh: true,
                markers: false,
                ...safety,
              },
            },
          )
        }
        scrubReveal(entries, { y: 20, stagger: 0.08 }, {
          trigger: entries[0],
          start: 'top 90%',
          end: 'top 55%',
        })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: 'top 22%',
          end: '+=42%',
          pin: true,
          scrub: SCRUB,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false,
          fastScrollEnd: true,
          ...safety,
        },
      })

      if (line) {
        tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: REVEAL_EASE, immediateRender: false }, 0)
      }

      tl.fromTo(
        entries,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: REVEAL_EASE, stagger: 0.1, immediateRender: false },
        0.02,
      )
    },
    [],
    { enabled: gsapEnabled },
  )

  if (presentation && condensed) {
    return (
      <section className="relative w-full py-6 sm:py-8" aria-label="Experience">
        <ExperienceCondensed />
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id={presentation ? undefined : 'experience'}
      className={`relative ${
        presentation ? 'w-full py-16 sm:py-20' : 'scroll-mt-20 py-24 sm:py-28'
      }`}
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div data-exp-header data-gsap-reveal className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Experience
          </p>
          <ScrollHeading
            text="Where I've built"
            id={presentation ? undefined : 'experience-heading'}
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            enabled={gsapEnabled}
          />
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            Enterprise modules and platforms shipped end-to-end — expand each
            project for the full story.
          </p>
        </div>

        <div ref={trackRef} className="relative mt-12">
          <div
            className="absolute bottom-2 left-[0.4375rem] top-2 w-px overflow-hidden sm:left-2.75"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-border/40" />
            <div
              data-exp-line
              data-gsap-reveal
              className="absolute inset-x-0 top-0 h-full origin-top bg-accent/70"
              style={{ transform: 'scaleY(1)' }}
            />
          </div>

          {experience.map((job) => (
            <article
              key={job.id}
              data-exp-entry
              data-gsap-reveal
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
