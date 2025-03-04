import { menuLinkStyles, selectedMenuLinkStyles } from '@components/links/styles'

type Props = { currentPage: string; name: string; to: string }

export const NavigationMenuItemDesktop = ({ currentPage, name, to }: Props) => {
  const active = currentPage.startsWith(to)

  return (
    <a href={to} className={active ? selectedMenuLinkStyles : menuLinkStyles}>
      {name}
    </a>
  )
}
