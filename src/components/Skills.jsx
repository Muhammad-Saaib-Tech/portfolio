// Skills — category panels with icon headers and staggered skill chip tags.
import { motion } from 'framer-motion'
import { Server, Layout, Database, Container } from 'lucide-react'
import { skills } from '../data/content'
import Heading from './Heading'
import {
  headerVariants,
  panelVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '../lib/motion'

const categoryIcons = {
  Backend: Server,
  Frontend: Layout,
  Databases: Database,
  'DevOps / Tools': Container,
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-20 py-24 sm:py-28"
      aria-labelledby="skills-heading"
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
            Skills
          </p>
          <Heading
            as="h2"
            id="skills-heading"
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Tools I ship with
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            A focused stack for building secure APIs, rich front-ends, and
            reliable data platforms — end to end.
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 grid gap-5 sm:grid-cols-2"
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {skills.map((group) => {
            const Icon = categoryIcons[group.category] ?? Server

            return (
              <motion.li
                key={group.category}
                variants={panelVariants}
                className="group rounded-lg border border-border bg-bg-elevated p-6 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] sm:p-7"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-bg text-accent transition-colors group-hover:border-accent/40 group-hover:bg-accent-muted">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-fg">
                    {group.category}
                  </h3>
                </div>

                <ul className="flex flex-wrap gap-2.5" aria-label={`${group.category} skills`}>
                  {group.items.map((skill) => (
                    <motion.li key={skill} variants={staggerItemVariants}>
                      <span className="inline-flex items-center rounded-full border border-border bg-bg px-3.5 py-1.5 text-sm font-medium text-fg transition duration-300 hover:scale-105 hover:border-accent/50 hover:bg-accent-muted hover:text-accent hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]">
                        {skill}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.li>
            )
          })}
        </motion.ul>
      </div>
    </section>
  )
}
