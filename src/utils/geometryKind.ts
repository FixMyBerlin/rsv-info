import type { GeometryFeature, GeometryKind } from 'src/types/geometry'

const CORRIDOR_STATUSES = new Set(['corridor', 'korridor'])

const DRAW_ORDER: Record<GeometryKind, number> = {
  area: 0,
  corridor: 1,
  route: 2,
}

export function isCorridorStatus(status: string | null | undefined) {
  return CORRIDOR_STATUSES.has(status?.trim().toLowerCase() ?? '')
}

export function geometryKindFromSource(args: {
  geometryType: GeoJSON.Geometry['type']
  status?: string | null
}): GeometryKind {
  if (args.geometryType === 'Polygon' || args.geometryType === 'MultiPolygon') return 'area'
  if (isCorridorStatus(args.status)) return 'corridor'
  return 'route'
}

/** Resolve kind for cached and freshly normalized features. Polygons are always areas. */
export function geometryKind(feature: GeometryFeature): GeometryKind {
  if (feature.geometry.type === 'MultiPolygon') return 'area'
  if (feature.properties.kind) return feature.properties.kind
  if (feature.properties.detail_level === 'corridor') return 'corridor'
  return 'route'
}

export function sortFeaturesForMap(features: GeometryFeature[]) {
  return [...features].sort((a, b) => DRAW_ORDER[geometryKind(a)] - DRAW_ORDER[geometryKind(b)])
}

export function presentLegendKinds(features: GeometryFeature[]) {
  const kinds = {
    vorzugstrasse: false,
    variante: false,
    korridor: false,
    flaeche: false,
  }

  for (const feature of features) {
    if (feature.properties.discarded) continue
    const kind = geometryKind(feature)
    if (kind === 'area') kinds.flaeche = true
    else if (kind === 'corridor') kinds.korridor = true
    else if (feature.properties.variant === 'Alternative') kinds.variante = true
    else kinds.vorzugstrasse = true
  }

  return kinds
}
