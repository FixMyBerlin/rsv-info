import { bbox } from '@turf/bbox'
import type { GeometryFeature, GeometryKind, GeometrySchema } from '../../types/geometry'
import { isCorridorStatus } from '../../utils/geometryKind'
import type { TrassenscoutFeatureCollection } from './fetchProject'

function getLineCoordinates(geometry: GeoJSON.LineString | GeoJSON.MultiLineString) {
  if (geometry.type === 'MultiLineString') return geometry.coordinates
  return [geometry.coordinates]
}

function getPolygonCoordinates(geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon) {
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  return [geometry.coordinates]
}

function getVariant(status: string | null | undefined) {
  const normalized = status?.trim().toLowerCase() ?? ''
  return normalized === 'variant' ? 'Alternative' : 'Vorzugstrasse'
}

function detailLevelForKind(kind: GeometryKind): GeometryFeature['properties']['detail_level'] {
  if (kind === 'corridor') return 'corridor'
  if (kind === 'area') return 'area'
  return 'approximated'
}

function addLineFeature(
  grouped: Map<string, GeometryFeature>,
  groupKey: string,
  featureId: string,
  pageId: string,
  variant: GeometryFeature['properties']['variant'],
  kind: Extract<GeometryKind, 'route' | 'corridor'>,
  lines: GeoJSON.Position[][],
) {
  const existing = grouped.get(groupKey)
  if (existing?.geometry.type === 'MultiLineString') {
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
      kind,
      detail_level: detailLevelForKind(kind),
    },
    geometry: {
      type: 'MultiLineString',
      coordinates: [...lines],
    },
  })
}

function addAreaFeature(
  grouped: Map<string, GeometryFeature>,
  groupKey: string,
  featureId: string,
  pageId: string,
  variant: GeometryFeature['properties']['variant'],
  polygons: GeoJSON.Position[][][],
) {
  const existing = grouped.get(groupKey)
  if (existing?.geometry.type === 'MultiPolygon') {
    existing.geometry.coordinates.push(...polygons)
    return
  }

  grouped.set(groupKey, {
    type: 'Feature',
    properties: {
      id: featureId,
      id_rsv: pageId,
      variant,
      discarded: false,
      kind: 'area',
      detail_level: 'area',
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [...polygons],
    },
  })
}

export function normalizeTrassenscoutGeometry(
  collection: TrassenscoutFeatureCollection,
  pageId: string,
) {
  const grouped = new Map<string, GeometryFeature>()

  collection.features.forEach((feature, index) => {
    const projectSlug = feature.properties.projectSlug ?? 'unknown'
    const subsectionSlug = feature.properties.subsectionSlug ?? String(index)
    const featureId = `${projectSlug}-${subsectionSlug}`
    const variant = getVariant(feature.properties.status)
    const geometry = feature.geometry

    switch (geometry.type) {
      case 'LineString':
      case 'MultiLineString': {
        const kind = isCorridorStatus(feature.properties.status) ? 'corridor' : 'route'
        const groupKey = `${featureId}:${variant}:${kind}`
        addLineFeature(
          grouped,
          groupKey,
          `${groupKey}`,
          pageId,
          variant,
          kind,
          getLineCoordinates(geometry),
        )
        return
      }
      case 'Polygon':
      case 'MultiPolygon': {
        const groupKey = `${featureId}:${variant}:area`
        addAreaFeature(
          grouped,
          groupKey,
          `${groupKey}`,
          pageId,
          variant,
          getPolygonCoordinates(geometry),
        )
        return
      }
    }
  })

  const features = [...grouped.values()]
  const bounds = bbox({
    type: 'FeatureCollection',
    features: features as GeoJSON.Feature[],
  })

  return {
    id: pageId,
    type: 'FeatureCollection',
    features,
    bbox: bounds as GeometrySchema['bbox'],
  } satisfies GeometrySchema
}
