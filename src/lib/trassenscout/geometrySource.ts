import { geometrySourceSchema } from './geometrySourceSchema'

export const RSV_D_PROJECT_SLUG = 'rsv-d'

export type GeometrySourceNone = {
  discriminant: 'none'
  value: null
}

export type GeometrySourceProjects = {
  discriminant: 'projects'
  value: string[]
}

export type GeometrySourceRsvD = {
  discriminant: 'rsv-d'
  value: string[]
}

export type GeometrySource = GeometrySourceNone | GeometrySourceProjects | GeometrySourceRsvD

export type GeometrySourceWithData = GeometrySourceProjects | GeometrySourceRsvD

export function emptyGeometrySource(): GeometrySourceNone {
  return { discriminant: 'none', value: null }
}

export function hasGeometryConfig(source: GeometrySource): boolean {
  if (source.discriminant === 'none') return false
  return source.value.length > 0
}

export function parseGeometrySource(raw: unknown): GeometrySource {
  const parsed = geometrySourceSchema.safeParse(raw)
  if (!parsed.success) return emptyGeometrySource()
  return parsed.data
}
