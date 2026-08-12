import { bbox } from '@turf/turf'

import type { GeometryFeature, GeometrySchema } from '../../types/geometry'
import type { TrassenscoutFeatureCollection } from './fetchProject'

function getLineCoordinates(
  geometry: GeoJSON.LineString | GeoJSON.MultiLineString,
): GeoJSON.Position[][] {
  if (geometry.type === 'MultiLineString') return geometry.coordinates
  return [geometry.coordinates]
}

function getPolygonCoordinates(
  geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): GeoJSON.Position[][][] {
  if (geometry.type === 'MultiPolygon') return geometry.coordinates
  return [geometry.coordinates]
}

function getVariant(status: string | null | undefined): GeometryFeature['properties']['variant'] {
  const normalized = status?.trim().toLowerCase() ?? ''
  return normalized === 'variant' ? 'Alternative' : 'Vorzugstrasse'
}

function addLineFeature(
  grouped: Map<string, GeometryFeature>,
  groupKey: string,
  featureId: string,
  pageId: string,
  variant: GeometryFeature['properties']['variant'],
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
      detail_level: 'approximated',
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
      detail_level: 'corridor',
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
): GeometrySchema {
  const grouped = new Map<string, GeometryFeature>()

  collection.features.forEach((feature, index) => {
    const projectSlug = feature.properties.projectSlug ?? 'unknown'
    const subsectionSlug = feature.properties.subsectionSlug ?? String(index)
    const featureId = `${projectSlug}-${subsectionSlug}`
    const variant = getVariant(feature.properties.status)
    const geometry = feature.geometry

    if (geometry.type === 'LineString' || geometry.type === 'MultiLineString') {
      const groupKey = `${featureId}:${variant}:line`
      addLineFeature(
        grouped,
        groupKey,
        `${groupKey}`,
        pageId,
        variant,
        getLineCoordinates(geometry),
      )
      return
    }

    if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
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

    throw new Error(
      `Unsupported geometry type "${geometry.type}" for ${featureId} (expected LineString, MultiLineString, Polygon, or MultiPolygon)`,
    )
  })

  const features = [...grouped.values()]

  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: features as GeoJSON.Feature[],
  }

  const bounds = bbox(featureCollection)

  return {
    id: pageId,
    type: 'FeatureCollection',
    features,
    bbox: bounds,
  }
}
