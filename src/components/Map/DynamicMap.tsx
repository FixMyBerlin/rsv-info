import { bbox, bboxPolygon, square, transformScale } from '@turf/turf'
import maplibregl from 'maplibre-gl'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import Map, {
  FullscreenControl,
  NavigationControl,
  type ViewStateChangeEvent,
} from 'react-map-gl/maplibre'
import { useMapParam } from 'src/lib/routing/useMapParam'
import type { GeometrySchema } from 'src/types/geometry'
import { maptilerBaseUrl, maptilerKey } from 'src/utils/mapTiler.const'

import { RSVSegment } from './RsvSegment'

type BBox2d = [number, number, number, number]

type Props = {
  geometry: GeometrySchema
}

export const DynamicMap = ({ geometry }: Props) => {
  const { mapParam, setMapParam } = useMapParam()

  // the factor by which the bbox is scaled to the viewport
  const scaleFactor = 4
  const bboxView = geometry.bbox
    ? bbox(transformScale(bboxPolygon(square(geometry.bbox as BBox2d)), scaleFactor))
    : undefined

  const [selected] = useState(undefined)

  const [isScreenHorizontal, setIsScreenHorizontal] = useState(false)

  useEffect(() => {
    // reminder: hard coded breakpoint lg tailwind css - has to be changed if tailwind.config.ts is changed
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)')
    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setIsScreenHorizontal(matches)
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  const initialViewState = mapParam
    ? {
        longitude: mapParam.lng,
        latitude: mapParam.lat,
        zoom: mapParam.zoom,
      }
    : {
        bounds: geometry.bbox as BBox2d,
        fitBoundsOptions: {
          padding: 20,
        },
      }

  return (
    <div className="relative h-full w-full">
      <Map
        initialViewState={initialViewState}
        mapLib={maplibregl}
        mapStyle={`${maptilerBaseUrl}/style.json?key=${maptilerKey}`}
        maxBounds={bboxView as BBox2d}
        attributionControl={false}
        scrollZoom={isScreenHorizontal}
        onMoveEnd={(event: ViewStateChangeEvent) => {
          const { latitude, longitude, zoom } = event.viewState
          void setMapParam({ zoom, lat: latitude, lng: longitude }, { history: 'replace' })
        }}
        interactiveLayerIds={geometry.features.flatMap(({ properties, geometry: geom }) =>
          geom.type === 'MultiPolygon'
            ? [`${properties.id}-fill`, `${properties.id}-outline`]
            : [properties.id],
        )}
      >
        <FullscreenControl style={{ background: '#D9D9D9' }} />
        {geometry.features.map((feature, index) => (
          <RSVSegment
            key={`${feature.properties.id}-${feature.geometry.type}-${index}`}
            feature={feature}
            selected={selected}
          />
        ))}
        <NavigationControl showCompass={false} />
      </Map>
    </div>
  )
}
