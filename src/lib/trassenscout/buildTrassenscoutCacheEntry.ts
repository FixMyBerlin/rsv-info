import { aggregateApiFields } from './aggregateApiFields'
import type { TrassenscoutCacheEntry } from './cacheSchema'
import { fetchAndMergeTrassenscoutProjects } from './fetchProject'
import { normalizeTrassenscoutGeometry } from './normalizeGeometry'

export async function buildTrassenscoutCacheEntry(
  slug: string,
  projectSlugs: string[],
  syncedAt: string = new Date().toISOString(),
): Promise<TrassenscoutCacheEntry> {
  const rawCollection = await fetchAndMergeTrassenscoutProjects(projectSlugs)
  const geometry = normalizeTrassenscoutGeometry(rawCollection, slug)
  const apiFields = aggregateApiFields(rawCollection.features)

  return {
    syncedAt,
    projectSlugs,
    geometry,
    apiFields,
  }
}
