import { getCollection, type CollectionEntry } from 'astro:content'
import type { GeometrySchema } from '../../types/geometry'
import type { SteckbriefApiFields, SteckbriefTeaser } from '../../types/steckbrief'
import { emptyGeometry } from '../trassenscout/emptyGeometry'
import { loadTrassenscoutCacheSync } from '../trassenscout/loadTrassenscoutCache'
import { getSteckbriefStaticMapImage } from './staticMapImage'

type SteckbriefEditorialEntry = CollectionEntry<'steckbriefe'>

export type SteckbriefCollectionEntry = Omit<SteckbriefEditorialEntry, 'data'> & {
  data: SteckbriefEditorialEntry['data'] & {
    slug: string
    geometry: GeometrySchema
    apiFields: SteckbriefApiFields
  }
}

export function isVisibleSteckbrief(entry: SteckbriefEditorialEntry): boolean {
  return entry.data.visibility !== 'hidden'
}

/** Site pages must use this so `visibility: hidden` never gets a route or list card. */
export async function getPublishedSteckbriefe(): Promise<SteckbriefCollectionEntry[]> {
  const entries = await getCollection('steckbriefe', isVisibleSteckbrief)

  return entries.map((entry) => {
    const slug = entry.data.slug ?? entry.id
    const trassenscout = loadTrassenscoutCacheSync(slug)
    return {
      ...entry,
      data: {
        ...entry.data,
        slug,
        geometry: trassenscout?.geometry ?? emptyGeometry(slug),
        apiFields: trassenscout?.apiFields ?? {},
      },
    }
  })
}

export type FederalStateFilterOption = {
  state: string
  count: number
  path: string
}

function federalStateSlug(state: string): string {
  return state
    .toLocaleLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

export function getFederalStateFilterData(
  entries: SteckbriefCollectionEntry[],
): FederalStateFilterOption[] {
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
    .map((state) => ({
      state,
      count: stateCount[state],
      path: `/steckbriefe/${federalStateSlug(state)}`,
    }))

  return [{ state: 'Alle anzeigen', count: entries.length, path: '/steckbriefe' }, ...options]
}

export function getSteckbriefTeasers(entries: SteckbriefCollectionEntry[]): SteckbriefTeaser[] {
  return entries.map((entry) => ({
    slug: entry.data.slug,
    title: entry.data.title,
    ref: entry.data.ref,
    state: entry.data.state,
    staticMap: getSteckbriefStaticMapImage(entry.data.slug, entry.data.geometry),
  }))
}

export function getSteckbriefDisplayTitle(entry: SteckbriefCollectionEntry['data']): string {
  if (entry.ref && Number.isNaN(parseFloat(entry.ref))) {
    return `${entry.ref}: ${entry.title}`
  }
  return entry.title
}
