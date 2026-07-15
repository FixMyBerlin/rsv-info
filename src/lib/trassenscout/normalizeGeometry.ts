import { bbox } from '@turf/turf'

import type { GeometrySchema } from '../../types/geometry'
import type { TrassenscoutFeatureCollection } from './fetchProject'

function getLineCoordinates(
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString,
): GeoJSON.Position[][] {
  if (geometry.type === 'MultiLineString') return geometry.coordinates
  return [geometry.coordinates]
}

export function normalizeTrassenscoutGeometry(
  collection: TrassenscoutFeatureCollection,
  pageId: string,
): GeometrySchema {
  const grouped = new Map<
    string,
    {
      type: 'Feature'
      properties: GeometrySchema['features'][number]['properties']
      geometry: GeoJSON.MultiLineString
    }
  >()

  collection.features.forEach((feature, index) => {
    const projectSlug = feature.properties.projectSlug ?? 'unknown'
    const subsectionSlug = feature.properties.subsectionSlug ?? String(index)
    const featureId = `${projectSlug}-${subsectionSlug}`
    const status = feature.properties.status?.trim() ?? ''
    const isVariant = status.toLowerCase() === 'variant'
    const variant = isVariant ? ('Alternative' as const) : ('Vorzugstrasse' as const)
    const groupKey = `${featureId}:${variant}`
    const lines = getLineCoordinates(
      feature.geometry as GeoJSON.LineString | GeoJSON.MultiLineString,
    )

    const existing = grouped.get(groupKey)
    if (existing) {
      existing.geometry.coordinates.push(...lines)
      return
    }

    grouped.set(groupKey, {
      type: 'Feature',
      properties: {
        id: featureId,
        id_rsv: pageId,
        variant,
        discarded: false,
        detail_level: 'approximated',
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [...lines],
      },
    })
  })

  const features = [...grouped.values()]

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
