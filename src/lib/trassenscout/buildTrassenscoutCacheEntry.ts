import { aggregateApiFields } from './aggregateApiFields'
import type { TrassenscoutCacheEntry } from './cacheSchema'
import { fetchAndMergeTrassenscoutProjects, fetchTrassenscoutProject } from './fetchProject'
import { RSV_D_PROJECT_SLUG, type GeometrySourceWithData } from './geometrySource'
import { normalizeTrassenscoutGeometry } from './normalizeGeometry'
import { filterCollectionByRsvDSubsections } from './rsvDSubsections'

export async function buildTrassenscoutCacheEntry(
  slug: string,
  geometrySource: GeometrySourceWithData,
  syncedAt: string = new Date().toISOString(),
) {
  switch (geometrySource.discriminant) {
    case 'projects': {
      const rawCollection = await fetchAndMergeTrassenscoutProjects(geometrySource.value)
      const geometry = normalizeTrassenscoutGeometry(rawCollection, slug)
      const apiFields = aggregateApiFields(rawCollection.features)

      return {
        syncedAt,
        geometrySource: 'projects',
        projectSlugs: geometrySource.value,
        geometry,
        apiFields,
      } satisfies TrassenscoutCacheEntry
    }
    case 'rsv-d': {
      const rawCollection = await fetchTrassenscoutProject(RSV_D_PROJECT_SLUG)
      const filteredCollection = filterCollectionByRsvDSubsections(
        rawCollection,
        geometrySource.value,
      )
      const geometry = normalizeTrassenscoutGeometry(filteredCollection, slug)
      const apiFields = aggregateApiFields(filteredCollection.features)

      return {
        syncedAt,
        geometrySource: 'rsv-d',
        projectSlugs: [RSV_D_PROJECT_SLUG],
        subsectionSlugs: [...geometrySource.value].sort((a, b) => a.localeCompare(b, 'de')),
        geometry,
        apiFields,
      } satisfies TrassenscoutCacheEntry
    }
  }
}
