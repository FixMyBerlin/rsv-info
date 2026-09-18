import { createHash } from 'node:crypto'
import { encode } from '@googlemaps/polyline-codec'
import simplify from '@turf/simplify'
import type { GeometryFeature, GeometrySchema } from '../../src/types/geometry'
import { geometryKind, sortFeaturesForMap } from '../../src/utils/geometryKind'
import { mapPaint, segmentColor } from '../../src/utils/mapColors'
import { maptilerBaseUrl, maptilerKey } from './mapTiler.const'

export const MAP_IMAGE_INPUT_HASH_VERSION = 'v1'
export const STATIC_MAP_PIXEL_SIZE: [number, number] = [1920, 1920]
export const STATIC_MAP_MAX_URL_LENGTH = 8192

type StaticMapRequestParams = {
  features: GeometrySchema['features']
  bbox: GeometrySchema['bbox']
}

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function buildLinePaths(feature: GeometryFeature): string[] {
  if (feature.geometry.type !== 'MultiLineString') return []

  const kind = geometryKind(feature)
  const color = segmentColor(feature.properties)
  const isCorridor = kind === 'corridor'
  const stroke = isCorridor ? hexToRgba(color, mapPaint.corridorLineOpacity) : color
  const paint = {
    width: isCorridor ? mapPaint.corridorLineWidth : mapPaint.routeLineWidth,
    stroke,
    fill: 'none',
  }
  const paintArr = Object.keys(paint).map((key) => `${key}:${paint[key as keyof typeof paint]}`)

  return feature.geometry.coordinates
    .map((linestring) => encode(linestring.map((position) => [...position].reverse())))
    .map((polyline) => [...paintArr, `enc:${polyline}`].join('|'))
}

function buildPolygonPaths(feature: GeometryFeature): string[] {
  if (feature.geometry.type !== 'MultiPolygon') return []

  const stroke = segmentColor(feature.properties)
  const fill = hexToRgba(stroke, mapPaint.areaFillOpacity)
  const paint = { width: mapPaint.areaOutlineWidth, stroke, fill }
  const paintArr = Object.keys(paint).map((key) => `${key}:${paint[key as keyof typeof paint]}`)

  return feature.geometry.coordinates.flatMap((polygon) =>
    polygon.map((ring) => {
      const coordinates = ring.map(([lng, lat]) => `${lng},${lat}`).join('|')
      return [...paintArr, coordinates].join('|')
    }),
  )
}

function buildPaths(feature: GeometryFeature): string[] {
  if (feature.geometry.type === 'MultiPolygon') {
    return buildPolygonPaths(feature)
  }
  return buildLinePaths(feature)
}

export function staticMapRequest(
  { features, bbox }: StaticMapRequestParams,
  [width, height]: [number, number],
) {
  const dims = `${width / 2}x${height / 2}@2x.png`
  const url = new URL(`${maptilerBaseUrl}/static/${bbox.toString()}/${dims}`)
  url.searchParams.append('key', maptilerKey)
  url.searchParams.append('attribution', '0')
  sortFeaturesForMap(features).forEach((feature) => {
    buildPaths(feature).forEach((path) => {
      url.searchParams.append('path', path)
    })
  })
  return url
}

export function filterRenderableMapGeometry(geometry: GeometrySchema): GeometrySchema | null {
  const features = geometry.features.filter((feature) => !feature.properties.discarded)
  if (features.length === 0) return null
  return { ...geometry, features }
}

export function buildStaticMapRequestUrl(geometry: StaticMapRequestParams): URL {
  let data: StaticMapRequestParams = geometry
  let url = staticMapRequest(data, STATIC_MAP_PIXEL_SIZE)
  let tolerance = 0.000001

  while (url.toString().length > STATIC_MAP_MAX_URL_LENGTH) {
    data = simplify(data as GeometrySchema, { tolerance, highQuality: true }) as GeometrySchema
    url = staticMapRequest(data, STATIC_MAP_PIXEL_SIZE)
    tolerance *= 2
  }

  return url
}

export function staticMapRequestUrlWithoutKey(url: URL): string {
  const copy = new URL(url.toString())
  copy.searchParams.delete('key')
  return copy.toString()
}

export function mapImageInputHashFromUrl(url: URL): string {
  return createHash('sha256')
    .update(`${MAP_IMAGE_INPUT_HASH_VERSION}\n${staticMapRequestUrlWithoutKey(url)}`)
    .digest('hex')
}

export function mapImageInputHash(geometry: GeometrySchema): string | null {
  const renderable = filterRenderableMapGeometry(geometry)
  if (!renderable) return null
  return mapImageInputHashFromUrl(buildStaticMapRequestUrl(renderable))
}

export function hashSidecarPath(pngPath: string) {
  return pngPath.replace(/\.png$/i, '.sha256')
}
