export const TRASSENSCOUT_API_BASE_URL = 'https://trassenscout.de'

type TrassenscoutFeature = {
  type: 'Feature'
  properties: {
    subsectionSlug?: string
    projectSlug?: string
    operator?: string | null
    estimatedCompletionDateString?: string | null
    status?: string | null
  }
  geometry: GeoJSON.Geometry
}

export type TrassenscoutFeatureCollection = {
  type: 'FeatureCollection'
  features: TrassenscoutFeature[]
}

const fetchCache = new Map<string, TrassenscoutFeatureCollection>()

export async function fetchTrassenscoutProject(
  slug: string,
  baseUrl: string,
): Promise<TrassenscoutFeatureCollection> {
  const cacheKey = `${baseUrl}/${slug}`
  const cached = fetchCache.get(cacheKey)
  if (cached) return cached

  const res = await fetch(`${baseUrl}/api/projects/${slug}.json`)
  if (!res.ok) {
    throw new Error(`Trassenscout fetch failed for "${slug}": ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as TrassenscoutFeatureCollection
  fetchCache.set(cacheKey, data)
  return data
}

export async function fetchAndMergeTrassenscoutProjects(
  slugs: string[],
  baseUrl: string = TRASSENSCOUT_API_BASE_URL,
): Promise<TrassenscoutFeatureCollection> {
  const collections = await Promise.all(
    slugs.map((slug) => fetchTrassenscoutProject(slug, baseUrl)),
  )
  return {
    type: 'FeatureCollection',
    features: collections.flatMap((collection) => collection.features),
  }
}
