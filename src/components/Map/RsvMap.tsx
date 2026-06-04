import { OptIn } from '@components/CookieConsent/OptIn'
import { getOptInCookie } from '@components/CookieConsent/storage'
import { clsx } from 'clsx'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { navHeightClasssName } from 'src/layouts/navigation/Navigation'
import { hasMapGeometry } from 'src/lib/trassenscout/emptyGeometry'
import type { GeometrySchema } from 'src/types/geometry'
import { Attribution } from './Attribution'
import { DynamicMap } from './DynamicMap'
import { Legend } from './Legend'

type Props = {
  slug: string
  geometry: GeometrySchema
}

export const RSVMap: React.FC<Props> = ({ slug, geometry }) => {
  const filteredGeometry = {
    ...geometry,
    features: geometry.features.filter((feature) => !feature.properties.discarded),
  }
  const showMap = hasMapGeometry(geometry)
  const [consent, setConsent] = useState<boolean | null>(true)
  useEffect(() => setConsent(getOptInCookie()))
  return (
    <div className="relative max-h-full max-w-full bg-[#F9FAFC]">
      {showMap && consent === null && (
        <div className="absolute bottom-16 z-20 mx-2 translate-y-1 md:mx-5">
          <OptIn setConsent={setConsent} />
        </div>
      )}

      {showMap ? (
        <>
          <div className="absolute right-0 bottom-0 left-0 z-10">
            <div className="mr-2 mb-2 translate-x-1 translate-y-1 text-xs">
              <Attribution />
            </div>
            <Legend />
          </div>

          <div className={clsx(navHeightClasssName, 'hidden lg:block')} />
          {consent && <DynamicMap geometry={filteredGeometry} />}
          <img src={`/rsv-map-images/${slug}.png`} alt="Statische Karte" />
        </>
      ) : (
        <div className="flex h-full min-h-[280px] items-center justify-center px-6 text-center text-sm text-slate-500">
          Karte folgt, sobald die Trasse in Trassenscout hinterlegt ist.
        </div>
      )}
    </div>
  )
}
