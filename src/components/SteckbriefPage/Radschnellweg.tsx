import { clsx } from 'clsx'

import { InfoIcon } from '@assets/general/tsx/InfoIcon'
import { useState } from 'react'
import { LayoutSteckbrief } from 'src/layouts/LayoutSteckbrief'
import type { SteckbriefCollectionEntry } from 'src/lib/steckbrief/getSteckbriefTeasers'
import { getSteckbriefDisplayTitle } from 'src/lib/steckbrief/getSteckbriefTeasers'
import { SteckbriefPage } from './SteckbriefPage'
import { SteckbriefUpdateInfo } from './SteckbriefPageUpdateInfo'

type Props = {
  steckbrief: SteckbriefCollectionEntry['data']
}

export const Radschnellweg: React.FC<Props> = ({ steckbrief }) => {
  const name =
    getSteckbriefDisplayTitle(steckbrief) || `${steckbrief.fromCity} - ${steckbrief.toCity}`

  const [overlay, setOverlay] = useState<boolean>(false)
  const closeIfOpen = () => {
    if (overlay) {
      setOverlay(false)
    }
  }
  return (
    <div>
      <div
        aria-haspopup="dialog"
        aria-hidden="true"
        onKeyDown={closeIfOpen}
        onClick={closeIfOpen}
        className={clsx(overlay && 'fixed top-0 right-0 bottom-0 left-0 blur-[2px]')}
      >
        {overlay && (
          <div className="fixed top-0 right-0 bottom-0 left-0 z-50 min-h-full min-w-full bg-gray-300/30" />
        )}
        <LayoutSteckbrief>
          <SteckbriefPage steckbrief={steckbrief} setOverlay={setOverlay} />
        </LayoutSteckbrief>
      </div>
      <div className="fixed right-4 bottom-4 h-36 w-96">
        {overlay && <SteckbriefUpdateInfo setOverlay={setOverlay} name={name} />}
        <button
          type="button"
          className="absolute right-3 bottom-3"
          onClick={() => setOverlay(true)}
        >
          <InfoIcon />
        </button>
      </div>
    </div>
  )
}
