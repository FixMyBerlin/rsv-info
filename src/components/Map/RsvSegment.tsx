import type { FillLayerSpecification, LineLayerSpecification } from 'maplibre-gl'
import { Layer, Source } from 'react-map-gl/maplibre'
import type { GeometryFeature } from 'src/types/geometry'
import { segmentColor } from 'src/utils/mapColors'

type Props = {
  feature: GeometryFeature
  selected?: number
}

const FILL_OPACITY = 0.35

export const RSVSegment = ({ feature }: Props) => {
  const { id } = feature.properties
  const color = segmentColor(feature.properties)
  const geojson = feature as GeoJSON.Feature

  if (feature.geometry.type === 'MultiPolygon') {
    const fillPaint: FillLayerSpecification['paint'] = {
      'fill-color': color,
      'fill-opacity': FILL_OPACITY,
    }
    const outlinePaint: LineLayerSpecification['paint'] = {
      'line-color': color,
      'line-width': 2,
    }

    return (
      <Source id={id} type="geojson" data={geojson}>
        <Layer id={`${id}-fill`} type="fill" paint={fillPaint} beforeId="park-label" />
        <Layer id={`${id}-outline`} type="line" paint={outlinePaint} beforeId="park-label" />
      </Source>
    )
  }

  const layout: LineLayerSpecification['layout'] = {
    'line-cap': 'round',
    'line-join': 'round',
  }
  const paint: LineLayerSpecification['paint'] = {
    'line-color': color,
    'line-width': 4,
  }

  return (
    <Source id={id} type="geojson" data={geojson}>
      <Layer id={id} type="line" layout={layout} paint={paint} beforeId="park-label" />
    </Source>
  )
}
