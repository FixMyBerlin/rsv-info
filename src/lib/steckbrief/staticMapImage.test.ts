import { describe, expect, it } from 'vitest'
import type { GeometrySchema } from '../../types/geometry'
import { emptyGeometry } from '../trassenscout/emptyGeometry'
import { getSteckbriefStaticMapImage, STECKBRIEF_MAP_FALLBACK_IMAGE } from './staticMapImage'

const geometryWithRoute = {
  ...emptyGeometry('with-route'),
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'route-1',
        variant: 'Vorzugstrasse',
        discarded: false,
      },
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [8, 49],
            [9, 50],
          ],
        ],
      },
    },
  ],
} satisfies GeometrySchema

describe('getSteckbriefStaticMapImage', () => {
  it('uses the Germany overview when there is no route geometry', () => {
    expect(getSteckbriefStaticMapImage('1-hamburg', emptyGeometry('1-hamburg'))).toBe(
      STECKBRIEF_MAP_FALLBACK_IMAGE,
    )
  })

  it('uses the slug PNG when the route has map geometry', () => {
    expect(getSteckbriefStaticMapImage('1-hamburg', geometryWithRoute)).toBe(
      '/rsv-map-images/1-hamburg.png',
    )
  })
})
