import {
  trassenscoutApiBaseUrl,
  trassenscoutProjectApiUrl,
  trassenscoutStagingApiBaseUrl,
} from './apiUrl'
import { RSV_D_PROJECT_SLUG } from './geometrySource'

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
): Promise<TrassenscoutFeatureCollection> {
  const cached = fetchCache.get(slug)
  if (cached) return cached

  const primaryBase = trassenscoutApiBaseUrl()
  let data = await fetchProjectFromBase(slug, primaryBase)

  // Until production `rsv-d` is populated, fall back to staging when prod returns an empty collection.
  if (
    slug === RSV_D_PROJECT_SLUG &&
    data.features.length === 0 &&
    primaryBase !== trassenscoutStagingApiBaseUrl()
  ) {
    console.warn(
      `Trassenscout "${slug}" empty at ${primaryBase}; falling back to ${trassenscoutStagingApiBaseUrl()}`,
    )
    data = await fetchProjectFromBase(slug, trassenscoutStagingApiBaseUrl())
  }

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
