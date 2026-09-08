import { describe, expect, it } from 'vitest'
import type { TrassenscoutFeatureCollection } from './fetchProject'
import { normalizeTrassenscoutGeometry } from './normalizeGeometry'

const collection: TrassenscoutFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { subsectionSlug: 'route-a', projectSlug: 'p' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { subsectionSlug: 'corridor-a', projectSlug: 'p', status: 'Korridor' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [2, 2],
          [3, 3],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { subsectionSlug: 'area-a', projectSlug: 'p' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
            [0, 0],
          ],
        ],
      },
    },
  ],
}

describe('normalizeTrassenscoutGeometry', () => {
  it('tags line, corridor-status line, and polygon features separately', () => {
    const result = normalizeTrassenscoutGeometry(collection, 'page')
    const kinds = result.features.map((feature) => [
      feature.properties.id,
      feature.properties.kind,
      feature.geometry.type,
    ])
    expect(kinds).toEqual([
      ['p-route-a:Vorzugstrasse:route', 'route', 'MultiLineString'],
      ['p-corridor-a:Vorzugstrasse:corridor', 'corridor', 'MultiLineString'],
      ['p-area-a:Vorzugstrasse:area', 'area', 'MultiPolygon'],
    ])
  })
})
