import { fetchTrassenscoutProject } from './fetchProject'
import { RSV_D_PROJECT_SLUG } from './geometrySource'
import { getRsvDSubsectionOwners, listSteckbriefe } from './listSteckbriefe'

export type RsvDSubsectionOption = {
  slug: string
  label: string
}

export type RsvDSubsectionsResponse = {
  syncedAt: string
  projectSlug: typeof RSV_D_PROJECT_SLUG
  subsections: RsvDSubsectionOption[]
  subsectionOwners: Record<string, string[]>
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

  const steckbriefe = await listSteckbriefe()
  const owners = getRsvDSubsectionOwners(steckbriefe)
  // Only subsections claimed by more than one Steckbrief (true conflicts).
  const subsectionOwners = Object.fromEntries([...owners].filter(([, slugs]) => slugs.length > 1))

  return {
    syncedAt,
    projectSlug: RSV_D_PROJECT_SLUG,
    subsections,
    subsectionOwners,
  }
}
