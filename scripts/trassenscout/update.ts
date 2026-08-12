import fs from 'node:fs/promises'
import path from 'node:path'

import { buildTrassenscoutCacheEntry } from '../../src/lib/trassenscout/buildTrassenscoutCacheEntry'
import { trassenscoutCacheSchema } from '../../src/lib/trassenscout/cacheSchema'
import {
  hasGeometryConfig,
  type GeometrySourceWithData,
} from '../../src/lib/trassenscout/geometrySource'
import {
  formatExistingTrassenscoutCache,
  formatSerializedTrassenscoutCache,
  getTrassenscoutCachePath,
  trassenscoutCacheBodyEquals,
  TRASSENSCOUT_CACHE_DIR,
} from '../../src/lib/trassenscout/loadTrassenscoutCache'
import { listSteckbriefe, listSteckbriefeWithGeometry } from '../../src/lib/trassenscout/listSteckbriefe'

async function ensureCacheDir(cwd: string) {
  await fs.mkdir(path.join(cwd, TRASSENSCOUT_CACHE_DIR), { recursive: true })
}

async function pruneOrphanCacheFiles(cwd: string, activeSlugs: Set<string>): Promise<number> {
  const cacheDir = path.join(cwd, TRASSENSCOUT_CACHE_DIR)
  let entries: string[]
  try {
    entries = await fs.readdir(cacheDir)
  } catch {
    return 0
  }

  let removed = 0
  for (const file of entries) {
    if (!file.endsWith('.json')) continue
    const slug = file.replace(/\.json$/, '')
    if (!activeSlugs.has(slug)) {
      const filePath = path.join(cacheDir, file)
      await fs.unlink(filePath)
      console.log(`  REMOVED orphan cache ${filePath}`)
      removed += 1
    }
  }

  return removed
}

function describeGeometrySource(source: GeometrySourceWithData): string {
  if (source.discriminant === 'projects') {
    return `projects: ${source.value.join(', ')}`
  }
  return `rsv-d: ${source.value.join(', ')}`
}

async function main() {
  const cwd = process.cwd()
  console.log('STARTING trassenscout/update')

  await ensureCacheDir(cwd)

  const steckbriefe = await listSteckbriefe(cwd)
  const withGeometry = listSteckbriefeWithGeometry(steckbriefe)
  const activeSlugs = new Set(withGeometry.map((entry) => entry.slug))
  const failures: string[] = []
  let updated = 0

  for (const { slug, geometrySource } of withGeometry) {
    if (!hasGeometryConfig(geometrySource) || geometrySource.discriminant === 'none') continue
    const filePath = getTrassenscoutCachePath(slug, cwd)
    try {
      console.log(`  FETCHING ${slug} (${describeGeometrySource(geometrySource)})`)
      const entry = await buildTrassenscoutCacheEntry(slug, geometrySource)
      trassenscoutCacheSchema.parse(entry)

      const formattedNext = await formatSerializedTrassenscoutCache(entry, slug, cwd)

      let existingRaw: string | undefined
      try {
        existingRaw = await fs.readFile(filePath, 'utf8')
      } catch {
        existingRaw = undefined
      }

      const formattedExisting = existingRaw
        ? await formatExistingTrassenscoutCache(existingRaw, slug, cwd)
        : undefined

      if (formattedExisting && trassenscoutCacheBodyEquals(formattedExisting, formattedNext)) {
        console.log(`  SKIPPED ${filePath} (unchanged)`)
      } else {
        await fs.writeFile(filePath, formattedNext, 'utf8')
        console.log(`  WRITING ${filePath}`)
        updated += 1
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`  ERROR ${slug}: ${message}`)
      failures.push(slug)
    }
  }

  await pruneOrphanCacheFiles(cwd, activeSlugs)

  console.log(
    `DONE: ${updated} cache file(s) written (${withGeometry.length} steckbriefe with Trassenscout geometry)`,
  )

  if (failures.length > 0) {
    console.error(`FAILED (${failures.length}): ${failures.join(', ')}`)
    if (updated === 0) {
      process.exit(1)
    }
    console.warn('Continuing with partial Trassenscout sync (successful entries were written).')
  }
}

main()
