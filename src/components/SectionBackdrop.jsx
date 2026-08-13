// Decorative section backdrop — pure CSS/SVG patterns, aria-hidden, no layout impact.
const VARIANTS = {
  diagonal: 'section-pattern-diagonal',
  dots: 'section-pattern-dots',
  radial: 'section-pattern-radial',
  circuit: 'section-pattern-circuit',
}

/**
 * @param {{ variant: 'diagonal' | 'dots' | 'radial' | 'circuit' }} props
 */
export default function SectionBackdrop({ variant }) {
  const patternClass = VARIANTS[variant]
  if (!patternClass) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className={`absolute inset-0 ${patternClass}`} />
    </div>
  )
}
