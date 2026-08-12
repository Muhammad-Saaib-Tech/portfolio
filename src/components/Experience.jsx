// Experience — vertical job timeline with collapsible project achievement lists.
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { experience } from '../data/content'
import Heading from './Heading'
import {
  fadeLeftVariants,
  headerVariants,
  revealTransitionFast,
} from '../lib/motion'

function ProjectBlock({ project, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-border bg-bg-elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent-muted/40"
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
          className="mt-1 shrink-0 text-fg-muted"
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
            <ul className="space-y-3 border-t border-border px-5 py-4">
              {project.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="relative pl-4 text-sm leading-relaxed text-fg-muted before:absolute before:left-0 before:top-[0.55em] before:size-1.5 before:rounded-full before:bg-accent"
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

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-20 py-24 sm:py-28"
      aria-labelledby="experience-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-accent">
            Experience
          </p>
          <Heading
            as="h2"
            id="experience-heading"
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Where I've built
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            Enterprise modules and platforms shipped end-to-end — expand each
            project for the full story.
          </p>
        </motion.div>

        <div className="relative mt-12">
          {experience.map((job) => (
            <motion.article
              key={job.id}
              variants={fadeLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="relative pl-8 sm:pl-10"
            >
              {/* Timeline rail */}
              <div
                className="absolute bottom-2 left-1.75 top-2 w-px bg-border sm:left-2.75"
                aria-hidden="true"
              />
              <div
                className="absolute left-0 top-2 flex size-3.75 items-center justify-center rounded-full border-2 border-accent bg-bg sm:left-1 sm:size-4.5"
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
                <p className="mt-1 text-base text-fg-muted">
                  {job.company}
                </p>
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
