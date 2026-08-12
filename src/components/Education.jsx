// Education — degree card with institution details and coursework tags.
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { education } from '../data/content'
import Heading from './Heading'
import { fadeUpVariants, headerVariants } from '../lib/motion'

export default function Education() {
  return (
    <section
      id="education"
      className="relative scroll-mt-20 py-24 sm:py-28"
      aria-labelledby="education-heading"
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
            Education
          </p>
          <Heading
            as="h2"
            id="education-heading"
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Academic foundation
          </Heading>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 max-w-3xl rounded-lg border border-border bg-bg-elevated p-6 transition duration-300 hover:border-accent/40 hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] sm:p-8"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md border border-border bg-bg text-accent">
              <GraduationCap size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
                  {education.degree}
                </h3>
                <span className="text-sm font-medium text-accent">{education.period}</span>
              </div>
              <p className="mt-1 text-sm text-fg-muted">{education.major}</p>
              <p className="mt-2 text-base text-fg">{education.institution}</p>

              <div className="mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-fg-muted">
                  Coursework
                </p>
                <ul className="flex flex-wrap gap-2.5" aria-label="Coursework">
                  {education.coursework.map((course) => (
                    <li key={course}>
                      <span className="inline-flex min-h-9 items-center rounded-full border border-border bg-bg px-3.5 py-1.5 text-sm font-medium text-fg transition duration-300 hover:border-accent/50 hover:bg-accent-muted hover:text-accent hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)] [@media(hover:hover)]:hover:scale-105">
                        {course}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
