import { bbox } from '@turf/turf'

import type { GeometrySchema } from '../../types/geometry'
import type { TrassenscoutFeatureCollection } from './fetchProject'

function lineStringToMultiLineString(
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString,
): GeoJSON.MultiLineString {
  if (geometry.type === 'MultiLineString') return geometry
  return {
    type: 'MultiLineString',
    coordinates: [geometry.coordinates],
  }
}

export function normalizeTrassenscoutGeometry(
  collection: TrassenscoutFeatureCollection,
  pageId: string,
): GeometrySchema {
  const features = collection.features.map((feature, index) => {
    const projectSlug = feature.properties.projectSlug ?? 'unknown'
    const subsectionSlug = feature.properties.subsectionSlug ?? String(index)
    const featureId = `${projectSlug}-${subsectionSlug}`
    const status = feature.properties.status?.trim() ?? ''
    const isVariant = status.toLowerCase() === 'variant'

    return {
      type: 'Feature' as const,
      properties: {
        id: featureId,
        id_rsv: pageId,
        variant: isVariant ? ('Alternative' as const) : ('Vorzugstrasse' as const),
        discarded: false,
        detail_level: 'approximated' as const,
      },
      geometry: lineStringToMultiLineString(
        feature.geometry as GeoJSON.LineString | GeoJSON.MultiLineString,
      ),
    }
  })

  const featureCollection: GeoJSON.FeatureCollection<GeoJSON.MultiLineString> = {
    type: 'FeatureCollection',
    features,
  }

  const bounds = bbox(featureCollection)

  return {
    id: pageId,
    type: 'FeatureCollection',
    features,
    bbox: bounds,
  }
}
