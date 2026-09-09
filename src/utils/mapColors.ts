import type { GeometrySchema } from 'src/types/geometry'

export const mapColors = {
  main: '#34D399',
  side: '#CBDC65',
  discarded: '#5B5C5D',
}

export const mapPaint = {
  routeLineWidth: 4,
  corridorLineWidth: 18,
  corridorLineOpacity: 0.4,
  areaFillOpacity: 0.35,
  areaOutlineWidth: 2,
}

export const segmentColor = (properties: GeometrySchema['features'][number]['properties']) => {
  if (properties.discarded) return mapColors.discarded
  if (properties.variant === 'Vorzugstrasse') return mapColors.main
  return mapColors.side
}
