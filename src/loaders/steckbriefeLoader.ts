import { createReader } from '@keystatic/core/reader'
import type { Loader } from 'astro/loaders'

import keystaticConfig from '../../keystatic.config'
import { emptyGeometry } from '../lib/trassenscout/emptyGeometry'
import { loadTrassenscoutCacheSync } from '../lib/trassenscout/loadTrassenscoutCache'
import type { ProgressState, SteckbriefApiFields } from '../types/steckbrief'

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
        let apiFields: SteckbriefApiFields = {}

        if (hasTrassenscoutSlugs) {
          const cache = loadTrassenscoutCacheSync(slug)
          if (cache) {
            resolvedGeometry = cache.geometry
            apiFields = cache.apiFields
          } else {
            logger.warn(
              `No checked-in Trassenscout cache for "${slug}" — run bun run trassenscout:sync`,
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
