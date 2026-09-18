import { describe, expect, it } from 'vitest'
import { emptyGeometry } from '../../src/lib/trassenscout/emptyGeometry'
import type { GeometrySchema } from '../../src/types/geometry'
import {
  buildStaticMapRequestUrl,
  filterRenderableMapGeometry,
  mapImageInputHash,
  mapImageInputHashFromUrl,
  staticMapRequestUrlWithoutKey,
} from './mapImageRequest'
import { maptilerKey } from './mapTiler.const'

function geometry(overrides?: {
  coordinates?: [number, number][]
  variant?: 'Vorzugstrasse' | 'Alternative'
  discarded?: boolean
  extraDiscarded?: boolean
}): GeometrySchema {
  const coordinates = overrides?.coordinates ?? [
    [8, 49],
    [9, 50],
  ]
  const features: GeometrySchema['features'] = [
    {
      type: 'Feature',
      properties: {
        id: 'route-1',
        variant: overrides?.variant ?? 'Vorzugstrasse',
        discarded: overrides?.discarded ?? false,
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [coordinates],
      },
    },
  ]
  if (overrides?.extraDiscarded) {
    features.push({
      type: 'Feature',
      properties: {
        id: 'discarded',
        variant: 'Alternative',
        discarded: true,
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [1, 1],
            [2, 2],
          ],
        ],
      },
    })
  }
  return {
    ...emptyGeometry('test'),
    bbox: [8, 49, 9, 50],
    features,
  }
}

describe('mapImageInputHash', () => {
  it('returns the same hash for the same geometry', () => {
    expect(mapImageInputHash(geometry())).toBe(mapImageInputHash(geometry()))
  })

  it('changes when coordinates change', () => {
    expect(
      mapImageInputHash(
        geometry({
          coordinates: [
            [8, 49],
            [9, 51],
          ],
        }),
      ),
    ).not.toBe(mapImageInputHash(geometry()))
  })

  it('changes when variant changes', () => {
    expect(mapImageInputHash(geometry({ variant: 'Alternative' }))).not.toBe(
      mapImageInputHash(geometry()),
    )
  })

  it('ignores discarded features', () => {
    expect(mapImageInputHash(geometry({ extraDiscarded: true }))).toBe(
      mapImageInputHash(geometry()),
    )
  })

  it('returns null when nothing is drawable', () => {
    expect(mapImageInputHash(emptyGeometry('empty'))).toBeNull()
    expect(mapImageInputHash(geometry({ discarded: true }))).toBeNull()
    expect(filterRenderableMapGeometry(geometry({ discarded: true }))).toBeNull()
  })

  it('does not include the MapTiler key in the hashed payload', () => {
    const url = buildStaticMapRequestUrl(geometry())
    expect(url.searchParams.get('key')).toBe(maptilerKey)
    expect(staticMapRequestUrlWithoutKey(url)).not.toContain(maptilerKey)

    const otherKey = new URL(url.toString())
    otherKey.searchParams.set('key', 'other-key')
    expect(mapImageInputHashFromUrl(url)).toBe(mapImageInputHashFromUrl(otherKey))
    expect(mapImageInputHashFromUrl(url)).toMatch(/^[a-f0-9]{64}$/)
  })
})
