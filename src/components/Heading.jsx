// Heading — section/hero title with italic first-letter signature in Syne.
// Always expects a plain string (or number). Never pass React elements as children.
export default function Heading({
  as: Tag = 'h2',
  children,
  className = '',
  ...props
}) {
  const text =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : ''

  if (!text && children != null && typeof children !== 'string') {
    // Defensive: never String(object) → "[object Object]"
    console.warn('Heading expected a string child; received', typeof children)
  }

  const firstLetter = text.charAt(0)
  const remainder = text.slice(1)

  return (
    <Tag className={`font-display ${className}`.trim()} {...props}>
      {firstLetter ? <span className="italic">{firstLetter}</span> : null}
      {remainder}
    </Tag>
  )
}
