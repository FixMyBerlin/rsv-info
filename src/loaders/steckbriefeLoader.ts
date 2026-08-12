import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { createReader } from '@keystatic/core/reader'
import type { Loader } from 'astro/loaders'

import keystaticConfig from '../../keystatic.config'
import { emptyGeometry } from '../lib/trassenscout/emptyGeometry'
import {
  emptyGeometrySource,
  hasGeometryConfig,
  parseGeometrySource,
  type GeometrySource,
} from '../lib/trassenscout/geometrySource'
import { loadTrassenscoutCacheSync } from '../lib/trassenscout/loadTrassenscoutCache'
import type { SteckbriefApiFields } from '../types/steckbrief'

const STECKBRIEFE_DIR = 'src/data/steckbriefe'

function geometrySourceFromEntry(entry: {
  geometrySource?: unknown
  trassenscoutProjectSlugs?: unknown
}): GeometrySource {
  if (entry.geometrySource !== undefined) {
    return parseGeometrySource(entry.geometrySource)
  }

  if (Array.isArray(entry.trassenscoutProjectSlugs)) {
    const value = entry.trassenscoutProjectSlugs.filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    )
    if (value.length === 0) return emptyGeometrySource()
    return { discriminant: 'projects', value }
  }

  return emptyGeometrySource()
}

export function steckbriefeLoader(): Loader {
  return {
    name: 'steckbriefe-loader',
    load: async ({ store, parseData, generateDigest, logger, config }) => {
      const root = fileURLToPath(config.root)
      const reader = createReader(root, keystaticConfig)
      const entries = await reader.collections.steckbriefe.all()

      let published = 0

      for (const { slug, entry } of entries) {
        const entrySlug = entry.slug ?? slug
        const visibility = entry.visibility ?? 'visible'

        if (visibility === 'hidden') continue

        const filePathRel = `${STECKBRIEFE_DIR}/${slug}/index.mdx`
        const filePathAbs = path.join(root, filePathRel)

        let content: string
        try {
          content = await readFile(filePathAbs, 'utf8')
        } catch {
          logger.warn(`No index.mdx for "${slug}"`)
          continue
        }

        const geometrySource = geometrySourceFromEntry(entry)
        const hasTrassenscoutGeometry = hasGeometryConfig(geometrySource)

        let resolvedGeometry = emptyGeometry(entrySlug)
        let apiFields: SteckbriefApiFields = {}

        if (hasTrassenscoutGeometry) {
          const cache = loadTrassenscoutCacheSync(entrySlug)
          if (cache) {
            resolvedGeometry = cache.geometry
            apiFields = cache.apiFields
          } else {
            logger.warn(
              `No checked-in Trassenscout cache for "${entrySlug}" — run bun run trassenscout:sync`,
            )
          }
        }

        const parsedData = await parseData({
          id: entrySlug,
          data: {
            visibility,
            slug: entrySlug,
            title: entry.title,
            ref: entry.ref ?? undefined,
            state: entry.state,
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
            geometrySource,
            showOnHome: entry.showOnHome ?? false,
            order: entry.order ?? 0,
            geometry: resolvedGeometry,
            apiFields,
          },
          filePath: filePathAbs,
        })

        store.set({
          id: entrySlug,
          data: parsedData,
          filePath: filePathRel,
          digest: generateDigest({
            content,
            geometry: resolvedGeometry,
            apiFields,
          }),
        })
        published += 1
      }

      logger.info(
        `Loaded ${entries.length} steckbriefe from Keystatic, published ${published} visible`,
      )
    },
  }
}
