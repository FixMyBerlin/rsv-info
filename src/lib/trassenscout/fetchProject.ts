import { z } from 'astro/zod'
import { trassenscoutApiBaseUrl, trassenscoutProjectApiUrl } from './apiUrl'

const apiPositionSchema = z.array(z.number()).min(2)

const apiGeometrySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('LineString'),
    coordinates: z.array(apiPositionSchema),
  }),
  z.object({
    type: z.literal('MultiLineString'),
    coordinates: z.array(z.array(apiPositionSchema)),
  }),
  z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(apiPositionSchema)),
  }),
  z.object({
    type: z.literal('MultiPolygon'),
    coordinates: z.array(z.array(z.array(apiPositionSchema))),
  }),
])

const trassenscoutFeatureSchema = z.object({
  type: z.literal('Feature'),
  properties: z.object({
    subsectionSlug: z.string().optional(),
    projectSlug: z.string().optional(),
    operator: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    estimatedCompletionDateString: z.string().nullable().optional(),
  }),
  geometry: apiGeometrySchema,
})

const trassenscoutFeatureCollectionSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(trassenscoutFeatureSchema),
})

export type TrassenscoutFeatureCollection = z.infer<typeof trassenscoutFeatureCollectionSchema>

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

  const parsed = trassenscoutFeatureCollectionSchema.safeParse(await res.json())
  if (!parsed.success) {
    throw new Error(
      `Trassenscout fetch returned invalid FeatureCollection for "${slug}" at ${baseUrl}: ${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data
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
