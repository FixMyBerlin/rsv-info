import { trassenscoutApiBaseUrl, trassenscoutProjectApiUrl } from './apiUrl'

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

async function fetchProjectFromBase(
  slug: string,
  baseUrl: string,
): Promise<TrassenscoutFeatureCollection> {
  const res = await fetch(trassenscoutProjectApiUrl(slug, baseUrl))
  if (!res.ok) {
    throw new Error(
      `Trassenscout fetch failed for "${slug}" at ${baseUrl}: ${res.status} ${res.statusText}`,
    )
  }
  return (await res.json()) as TrassenscoutFeatureCollection
}

export async function fetchTrassenscoutProject(
  slug: string,
  options?: { bypassCache?: boolean },
): Promise<TrassenscoutFeatureCollection> {
  if (!options?.bypassCache) {
    const cached = fetchCache.get(slug)
    if (cached) return cached
  }

  const data = await fetchProjectFromBase(slug, trassenscoutApiBaseUrl())

  fetchCache.set(slug, data)
  return data
}

export async function fetchAndMergeTrassenscoutProjects(
  slugs: string[],
): Promise<TrassenscoutFeatureCollection> {
  const collections = await Promise.all(slugs.map((slug) => fetchTrassenscoutProject(slug)))
  return {
    type: 'FeatureCollection',
    features: collections.flatMap((collection) => collection.features),
  }
}
