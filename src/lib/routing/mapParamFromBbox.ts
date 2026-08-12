import type { MapParam } from './mapParam'

type BBox2d = [number, number, number, number]

/** Approximate zoom/lat/lng from a bbox when the interactive map is unavailable. */
export const mapParamFromBbox = (bbox: BBox2d): MapParam => {
  const [west, south, east, north] = bbox
  const lat = (south + north) / 2
  const lng = (west + east) / 2

  const latSpan = Math.max(north - south, 0.0001)
  const lngSpan = Math.max(east - west, 0.0001)
  const maxSpan = Math.max(latSpan, lngSpan)
  const zoom = Math.max(5, Math.min(16, Math.log2(360 / maxSpan) - 0.5))

  return { zoom, lat, lng }
}
