import { trassenscoutProjectApiUrl } from './apiUrl'

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
): Promise<TrassenscoutFeatureCollection> {
  const cached = fetchCache.get(slug)
  if (cached) return cached

  const res = await fetch(trassenscoutProjectApiUrl(slug))
  if (!res.ok) {
    throw new Error(`Trassenscout fetch failed for "${slug}": ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as TrassenscoutFeatureCollection
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
