import type { GeometrySchema } from '../../types/geometry'

/** Default bounds (Germany) when no route geometry is available. */
const EMPTY_MAP_BBOX: GeometrySchema['bbox'] = [5.866315, 47.270111, 15.041932, 55.099161]

export function emptyGeometry(pageId: string): GeometrySchema {
  return {
    id: pageId,
    type: 'FeatureCollection',
    features: [],
    bbox: EMPTY_MAP_BBOX,
  }
}

export function hasMapGeometry(geometry: GeometrySchema): boolean {
  return geometry.features.some((feature) => !feature.properties.discarded)
}
