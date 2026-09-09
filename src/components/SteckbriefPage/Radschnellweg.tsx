import { NuqsAdapter } from 'nuqs/adapters/react'
import type { ReactNode } from 'react'
import { LayoutSteckbrief } from 'src/layouts/LayoutSteckbrief'
import type { PublishedSteckbriefData } from 'src/types/steckbrief'
import { SteckbriefPage } from './SteckbriefPage'

type Props = {
  steckbrief: PublishedSteckbriefData
  children?: ReactNode
}

export const Radschnellweg = ({ steckbrief, children }: Props) => {
  return (
    <NuqsAdapter>
      <LayoutSteckbrief>
        <SteckbriefPage steckbrief={steckbrief} description={children} />
      </LayoutSteckbrief>
    </NuqsAdapter>
  )
}
