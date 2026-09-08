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

export function emptyGeometrySource() {
  return { discriminant: 'none', value: null } satisfies GeometrySourceNone
}

export function hasGeometryConfig(source: GeometrySource) {
  switch (source.discriminant) {
    case 'none':
      return false
    case 'projects':
    case 'rsv-d':
      return source.value.length > 0
  }
}

export function parseGeometrySource(raw: unknown) {
  const parsed = geometrySourceSchema.safeParse(raw)
  if (!parsed.success) return emptyGeometrySource()
  return parsed.data
}
