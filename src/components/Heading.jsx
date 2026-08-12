// Heading — section/hero title with italic first-letter signature in Syne.
export default function Heading({
  as: Tag = 'h2',
  children,
  className = '',
  ...props
}) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const firstLetter = text.charAt(0)
  const remainder = text.slice(1)

  return (
    <Tag className={`font-display ${className}`.trim()} {...props}>
      {firstLetter ? <span className="italic">{firstLetter}</span> : null}
      {remainder}
    </Tag>
  )
}
