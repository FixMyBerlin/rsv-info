import type { CollectionEntry } from 'astro:content'
import type { SteckbriefTeaser } from '../../types/steckbrief'

export type SteckbriefCollectionEntry = CollectionEntry<'steckbriefe'>

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
    staticMap: `/rsv-map-images/${entry.data.slug}.png`,
  }))
}

export function getSteckbriefDisplayTitle(entry: SteckbriefCollectionEntry['data']): string {
  if (entry.ref && Number.isNaN(parseFloat(entry.ref))) {
    return `${entry.ref}: ${entry.title}`
  }
  return entry.title
}
