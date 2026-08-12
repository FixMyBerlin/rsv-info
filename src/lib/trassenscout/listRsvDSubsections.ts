import { fetchTrassenscoutProject } from './fetchProject'
import { RSV_D_PROJECT_SLUG } from './geometrySource'

export type RsvDSubsectionOption = {
  slug: string
  label: string
}

export type RsvDSubsectionsResponse = {
  syncedAt: string
  projectSlug: typeof RSV_D_PROJECT_SLUG
  subsections: RsvDSubsectionOption[]
}

export async function listRsvDSubsections(
  syncedAt: string = new Date().toISOString(),
): Promise<RsvDSubsectionsResponse> {
  const collection = await fetchTrassenscoutProject(RSV_D_PROJECT_SLUG)
  const slugs = new Set<string>()

  for (const feature of collection.features) {
    const subsectionSlug = feature.properties.subsectionSlug?.trim()
    if (subsectionSlug) {
      slugs.add(subsectionSlug)
    }
  }

  const subsections = [...slugs]
    .sort((a, b) => a.localeCompare(b, 'de'))
    .map((slug) => ({ slug, label: slug }))

  return {
    syncedAt,
    projectSlug: RSV_D_PROJECT_SLUG,
    subsections,
  }
}
