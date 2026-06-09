import type { GeometrySchema } from '../../types/geometry'
import { hasMapGeometry } from '../trassenscout/emptyGeometry'

export const STECKBRIEF_MAP_FALLBACK_IMAGE = '/rsv-map-images/fallback.png'

export function getSteckbriefStaticMapImage(slug: string, geometry: GeometrySchema): string {
  if (hasMapGeometry(geometry)) {
    return `/rsv-map-images/${slug}.png`
  }
  return STECKBRIEF_MAP_FALLBACK_IMAGE
}
