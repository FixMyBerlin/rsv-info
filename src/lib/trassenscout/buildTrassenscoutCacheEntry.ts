import { aggregateApiFields } from './aggregateApiFields'
import type { TrassenscoutCacheEntry } from './cacheSchema'
import { fetchAndMergeTrassenscoutProjects, fetchTrassenscoutProject } from './fetchProject'
import { RSV_D_PROJECT_SLUG, type GeometrySourceWithData } from './geometrySource'
import { normalizeTrassenscoutGeometry } from './normalizeGeometry'

export async function buildTrassenscoutCacheEntry(
  slug: string,
  geometrySource: GeometrySourceWithData,
  syncedAt: string = new Date().toISOString(),
): Promise<TrassenscoutCacheEntry> {
  if (geometrySource.discriminant === 'projects') {
    const rawCollection = await fetchAndMergeTrassenscoutProjects(geometrySource.value)
    const geometry = normalizeTrassenscoutGeometry(rawCollection, slug)
    const apiFields = aggregateApiFields(rawCollection.features)

    return {
      syncedAt,
      geometrySource: 'projects',
      projectSlugs: geometrySource.value,
      geometry,
      apiFields,
    }
  }

  const selected = new Set(geometrySource.value)
  const rawCollection = await fetchTrassenscoutProject(RSV_D_PROJECT_SLUG)
  const filteredCollection = {
    type: 'FeatureCollection' as const,
    features: rawCollection.features.filter((feature) => {
      const subsectionSlug = feature.properties.subsectionSlug?.trim()
      return subsectionSlug !== undefined && selected.has(subsectionSlug)
    }),
  }
  const geometry = normalizeTrassenscoutGeometry(filteredCollection, slug)
  const apiFields = aggregateApiFields(filteredCollection.features)

  return {
    syncedAt,
    geometrySource: 'rsv-d',
    projectSlugs: [RSV_D_PROJECT_SLUG],
    subsectionSlugs: [...geometrySource.value].sort((a, b) => a.localeCompare(b, 'de')),
    geometry,
    apiFields,
  }
}
