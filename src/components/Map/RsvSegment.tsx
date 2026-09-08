import type { FillLayerSpecification, LineLayerSpecification } from 'maplibre-gl'
import { Layer, Source } from 'react-map-gl/maplibre'
import type { GeometryFeature } from 'src/types/geometry'
import { geometryKind } from 'src/utils/geometryKind'
import { mapPaint, segmentColor } from 'src/utils/mapColors'

type Props = {
  feature: GeometryFeature
}

export const RSVSegment = ({ feature }: Props) => {
  const { id } = feature.properties
  const color = segmentColor(feature.properties)
  const geojson = feature as GeoJSON.Feature
  const kind = geometryKind(feature)

  if (kind === 'area') {
    const fillPaint: FillLayerSpecification['paint'] = {
      'fill-color': color,
      'fill-opacity': mapPaint.areaFillOpacity,
    }
    const outlinePaint: LineLayerSpecification['paint'] = {
      'line-color': color,
      'line-width': mapPaint.areaOutlineWidth,
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
  const paint: LineLayerSpecification['paint'] =
    kind === 'corridor'
      ? {
          'line-color': color,
          'line-width': mapPaint.corridorLineWidth,
          'line-opacity': mapPaint.corridorLineOpacity,
        }
      : {
          'line-color': color,
          'line-width': mapPaint.routeLineWidth,
        }

  return (
    <Source id={id} type="geojson" data={geojson}>
      <Layer id={id} type="line" layout={layout} paint={paint} beforeId="park-label" />
    </Source>
  )
}
