import { createReader } from '@keystatic/core/reader'
import type { Loader } from 'astro/loaders'

import keystaticConfig from '../../keystatic.config'
import { aggregateApiFields } from '../lib/trassenscout/aggregateApiFields'
import { emptyGeometry } from '../lib/trassenscout/emptyGeometry'
import { fetchAndMergeTrassenscoutProjects } from '../lib/trassenscout/fetchProject'
import { normalizeTrassenscoutGeometry } from '../lib/trassenscout/normalizeGeometry'
import type { ProgressState } from '../types/steckbrief'

export function steckbriefeLoader(): Loader {
  return {
    name: 'steckbriefe-loader',
    load: async ({ store, logger }) => {
      const reader = createReader(process.cwd(), keystaticConfig)
      const entries = await reader.collections.steckbriefe.all()

      logger.info(`Loading ${entries.length} steckbriefe from Keystatic`)

      for (const { slug, entry } of entries) {
        const description = entry.description ? await entry.description() : undefined
        const trassenscoutProjectSlugs = entry.trassenscoutProjectSlugs ?? []
        const hasTrassenscoutSlugs = trassenscoutProjectSlugs.length > 0

        let resolvedGeometry = emptyGeometry(slug)
        let apiFields: Record<string, never> | ReturnType<typeof aggregateApiFields> = {}

        if (hasTrassenscoutSlugs) {
          try {
            const rawCollection = await fetchAndMergeTrassenscoutProjects([
              ...trassenscoutProjectSlugs,
            ])
            resolvedGeometry = normalizeTrassenscoutGeometry(rawCollection, slug)
            apiFields = aggregateApiFields(rawCollection.features)
          } catch (error) {
            logger.warn(
              `Trassenscout fetch failed for "${slug}": ${error instanceof Error ? error.message : error}`,
            )
          }
        }

        store.set({
          id: slug,
          data: {
            slug,
            title: entry.title,
            ref: entry.ref ?? undefined,
            state: entry.state as ProgressState,
            fromCity: entry.fromCity ?? undefined,
            fromFederalState: entry.fromFederalState ?? undefined,
            toCity: entry.toCity ?? undefined,
            toFederalState: entry.toFederalState ?? undefined,
            lengthKm: entry.lengthKm ?? undefined,
            stand: entry.stand ?? undefined,
            lastCheckedDate: entry.lastCheckedDate ?? undefined,
            sourceUrl: entry.sourceUrl ?? undefined,
            website: entry.website ?? undefined,
            stakeholders: entry.stakeholders ?? [],
            trassenscoutProjectSlugs,
            showOnHome: entry.showOnHome ?? false,
            order: entry.order ?? 0,
            description,
            geometry: resolvedGeometry,
            apiFields,
          },
        })
      }
    },
  }
}
