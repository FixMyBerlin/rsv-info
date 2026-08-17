import type { TrassenscoutFeatureCollection } from './fetchProject'

/** Unique, German-sorted RSV-D `subsectionSlug` values from a Trassenscout FeatureCollection. */
export function rsvDSubsectionSlugsFromCollection(
  collection: TrassenscoutFeatureCollection,
): string[] {
  const slugs = new Set<string>()
  for (const feature of collection.features) {
    const subsectionSlug = feature.properties.subsectionSlug?.trim()
    if (subsectionSlug) {
      slugs.add(subsectionSlug)
    }
  }
  return [...slugs].sort((a, b) => a.localeCompare(b, 'de'))
}

/** Keep only features whose `subsectionSlug` is in `selected`. */
export function filterCollectionByRsvDSubsections(
  collection: TrassenscoutFeatureCollection,
  selected: Iterable<string>,
): TrassenscoutFeatureCollection {
  const selectedSet = selected instanceof Set ? selected : new Set(selected)
  return {
    type: 'FeatureCollection',
    features: collection.features.filter((feature) => {
      const subsectionSlug = feature.properties.subsectionSlug?.trim()
      return subsectionSlug !== undefined && selectedSet.has(subsectionSlug)
    }),
  }
}
