// Contact — footer with email/phone/LinkedIn icon links and CV download CTA.
import { motion } from 'framer-motion'
import { Mail, Phone, Download } from 'lucide-react'
import { profile, languages } from '../data/content'
import Heading from './Heading'
import Magnetic from './Magnetic'
import { headerVariants, revealTransitionSlow, stagger } from '../lib/motion'

function LinkedInIcon({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.82-2.05 3.75-2.05 4.01 0 4.75 2.64 4.75 6.07V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V23h-4V8.5z" />
    </svg>
  )
}

const blockVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...revealTransitionSlow, delay: stagger.delay },
  },
}

const contactLinks = [
  {
    id: 'email',
    label: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
  },
  {
    id: 'phone',
    label: profile.phone,
    href: `tel:${profile.phoneHref}`,
    icon: Phone,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: profile.linkedin,
    icon: LinkedInIcon,
  },
]

export default function Contact() {
  const year = new Date().getFullYear()

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 border-t border-border pt-24 sm:pt-28"
      aria-labelledby="contact-heading"
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
            Contact
          </p>
          <Heading
            as="h2"
            id="contact-heading"
            className="text-3xl font-bold tracking-tight text-fg sm:text-4xl"
          >
            Let's work together
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
            Open to full-stack .NET roles, consulting, and collaboration —
            reach out anytime.
          </p>
        </motion.div>

        <motion.div
          variants={blockVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <ul className="flex flex-col gap-3">
            {contactLinks.map(({ id, label, href, icon: Icon }) => (
              <li key={id}>
                <a
                  href={href}
                  target={id === 'linkedin' ? '_blank' : undefined}
                  rel={id === 'linkedin' ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center gap-3 rounded-md py-1 text-fg-muted transition duration-300 hover:text-accent"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition duration-300 group-hover:border-accent/50 group-hover:bg-accent-muted group-hover:text-accent group-hover:shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]">
                    <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium sm:text-base">{label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* CV served from public/assets/cv.pdf */}
          <Magnetic>
            <a
              href={profile.cvUrl}
              download
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-on-accent transition-colors hover:bg-accent-hover"
            >
              <Download size={16} strokeWidth={2} aria-hidden="true" />
              Download CV
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <footer className="mt-20 border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-sm text-fg-muted sm:flex-row sm:items-center sm:gap-4 sm:px-8">
          <p>
            © {year} {profile.name}
          </p>
          <ul
            className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-fg-muted/80"
            aria-label="Languages"
          >
            {languages.map((lang, i) => (
              <li key={lang.name} className="inline-flex items-center gap-x-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                <span>
                  {lang.name} — {lang.level}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs">Full-Stack .NET Developer · Islamabad</p>
        </div>
      </footer>
    </section>
  )
}
