import { selectLinkStyle } from './styles'

type Props = {
  tel?: `+${string}`
  className?: string
  subject?: string
  body?: string
  children: React.ReactNode
}

export const TelLink = ({ tel, className, subject, body, children }: Props) => {
  const params = [
    subject && `subject=${encodeURIComponent(subject)}`,
    body && `body=${encodeURIComponent(body)}`,
  ].filter(Boolean)

  const href = `tel:${tel || children}${params && `?${params.join('&')}`}`

  return (
    <a href={href} className={selectLinkStyle(undefined, className)}>
      {children}
    </a>
  )
}
