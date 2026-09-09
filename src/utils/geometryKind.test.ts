import type { GeometryFeature } from 'src/types/geometry'
import { describe, expect, it } from 'vitest'
import {
  geometryKind,
  geometryKindFromSource,
  isCorridorStatus,
  presentLegendKinds,
  sortFeaturesForMap,
} from './geometryKind'

function feature(overrides: {
  geometryType?: 'MultiLineString' | 'MultiPolygon'
  kind?: GeometryFeature['properties']['kind']
  detail_level?: GeometryFeature['properties']['detail_level']
  variant?: GeometryFeature['properties']['variant']
  discarded?: boolean
}): GeometryFeature {
  const geometryType = overrides.geometryType ?? 'MultiLineString'
  return {
    type: 'Feature',
    properties: {
      id: 'test',
      variant: overrides.variant ?? 'Vorzugstrasse',
      discarded: overrides.discarded ?? false,
      kind: overrides.kind,
      detail_level: overrides.detail_level,
    },
    geometry:
      geometryType === 'MultiPolygon'
        ? {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [0, 0],
                  [1, 0],
                  [1, 1],
                  [0, 1],
                  [0, 0],
                ],
              ],
            ],
          }
        : {
            type: 'MultiLineString',
            coordinates: [
              [
                [0, 0],
                [1, 1],
              ],
            ],
          },
  }
}

describe('isCorridorStatus', () => {
  it('matches korridor and corridor, ignoring case', () => {
    expect(isCorridorStatus('Korridor')).toBe(true)
    expect(isCorridorStatus('corridor')).toBe(true)
    expect(isCorridorStatus('variant')).toBe(false)
    expect(isCorridorStatus(null)).toBe(false)
  })
})

describe('geometryKindFromSource', () => {
  it('treats polygons as areas', () => {
    expect(geometryKindFromSource({ geometryType: 'Polygon' })).toBe('area')
    expect(geometryKindFromSource({ geometryType: 'MultiPolygon', status: 'Korridor' })).toBe(
      'area',
    )
  })

  it('treats lines with corridor status as corridors', () => {
    expect(geometryKindFromSource({ geometryType: 'LineString', status: 'Korridor' })).toBe(
      'corridor',
    )
    expect(geometryKindFromSource({ geometryType: 'LineString' })).toBe('route')
  })
})

describe('geometryKind', () => {
  it('always treats polygons as areas, even with legacy corridor detail_level', () => {
    expect(geometryKind(feature({ geometryType: 'MultiPolygon', detail_level: 'corridor' }))).toBe(
      'area',
    )
  })

  it('uses kind, then legacy detail_level, for lines', () => {
    expect(geometryKind(feature({ kind: 'corridor' }))).toBe('corridor')
    expect(geometryKind(feature({ detail_level: 'corridor' }))).toBe('corridor')
    expect(geometryKind(feature({ detail_level: 'approximated' }))).toBe('route')
  })
})

describe('presentLegendKinds', () => {
  it('only includes kinds that are present and not discarded', () => {
    expect(
      presentLegendKinds([
        feature({ variant: 'Vorzugstrasse' }),
        feature({ geometryType: 'MultiPolygon' }),
        feature({ kind: 'corridor', discarded: true }),
      ]),
    ).toEqual({
      vorzugstrasse: true,
      variante: false,
      korridor: false,
      flaeche: true,
    })
  })
})

describe('sortFeaturesForMap', () => {
  it('draws areas under corridors under routes', () => {
    const sorted = sortFeaturesForMap([
      feature({ kind: 'route' }),
      feature({ geometryType: 'MultiPolygon' }),
      feature({ kind: 'corridor' }),
    ])
    expect(sorted.map(geometryKind)).toEqual(['area', 'corridor', 'route'])
  })
})
