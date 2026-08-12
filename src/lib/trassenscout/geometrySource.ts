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
  if (!raw || typeof raw !== 'object') {
    return emptyGeometrySource()
  }

  const record = raw as Record<string, unknown>
  const discriminant = record.discriminant

  if (discriminant === 'projects') {
    const value = Array.isArray(record.value)
      ? record.value.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : []
    return { discriminant: 'projects', value }
  }

  if (discriminant === 'rsv-d') {
    const value = Array.isArray(record.value)
      ? record.value.filter((item): item is string => typeof item === 'string' && item.length > 0)
      : []
    return { discriminant: 'rsv-d', value }
  }

  if (discriminant === 'none') {
    return emptyGeometrySource()
  }

  // Legacy frontmatter during migration / partial reads
  return emptyGeometrySource()
}
