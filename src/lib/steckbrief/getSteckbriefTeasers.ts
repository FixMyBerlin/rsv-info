import { getCollection, type CollectionEntry } from 'astro:content'
import type { GeometrySchema } from '../../types/geometry'
import type {
  FederalStateFilterOption,
  SteckbriefApiFields,
  SteckbriefTeaser,
} from '../../types/steckbrief'
import { emptyGeometry } from '../trassenscout/emptyGeometry'
import { getSteckbriefStaticMapImage } from './staticMapImage'

type SteckbriefEditorialEntry = CollectionEntry<'steckbriefe'>

export type SteckbriefCollectionEntry = Omit<SteckbriefEditorialEntry, 'data'> & {
  data: SteckbriefEditorialEntry['data'] & {
    slug: string
    geometry: GeometrySchema
    apiFields: SteckbriefApiFields
    staticMap: string
  }
}

export function isVisibleSteckbrief(entry: SteckbriefEditorialEntry) {
  return entry.data.visibility !== 'hidden'
}

/** Do not call `getCollection('steckbriefe')` from pages. Hidden entries (`visibility: hidden`) must not get a route or list card. */
export async function getPublishedSteckbriefe() {
  const [entries, caches] = await Promise.all([
    getCollection('steckbriefe', isVisibleSteckbrief),
    getCollection('trassenscout'),
  ])
  const cacheBySlug = new Map(caches.map((cache) => [cache.id, cache.data]))

  return entries.map((entry) => {
    const slug = entry.data.slug ?? entry.id
    const trassenscout = cacheBySlug.get(slug)
    const geometry = trassenscout?.geometry ?? emptyGeometry(slug)
    return {
      ...entry,
      data: {
        ...entry.data,
        slug,
        geometry,
        apiFields: trassenscout?.apiFields ?? {},
        staticMap: getSteckbriefStaticMapImage(slug, geometry),
      },
    } satisfies SteckbriefCollectionEntry
  })
}

function federalStateSlug(state: string) {
  return state
    .toLocaleLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

export function getFederalStateFilterData(entries: SteckbriefCollectionEntry[]) {
  const stateCount: Record<string, number> = {}

  const addState = (state?: string) => {
    if (!state) return
    stateCount[state] ||= 0
    stateCount[state] += 1
  }

  for (const entry of entries) {
    addState(entry.data.fromFederalState)
    if (entry.data.toFederalState !== entry.data.fromFederalState) {
      addState(entry.data.toFederalState)
    }
  }

  const options = Object.keys(stateCount)
    .sort()
    .map(
      (state) =>
        ({
          state,
          count: stateCount[state],
          path: `/steckbriefe/${federalStateSlug(state)}`,
        }) satisfies FederalStateFilterOption,
    )

  return [{ state: 'Alle anzeigen', count: entries.length, path: '/steckbriefe' }, ...options]
}

export function getSteckbriefTeasers(entries: SteckbriefCollectionEntry[]) {
  return entries.map(
    (entry) =>
      ({
        slug: entry.data.slug,
        title: entry.data.title,
        ref: entry.data.ref,
        state: entry.data.state,
        staticMap: entry.data.staticMap,
      }) satisfies SteckbriefTeaser,
  )
}
