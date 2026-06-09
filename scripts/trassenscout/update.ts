import fs from 'node:fs/promises'
import path from 'node:path'

import { buildTrassenscoutCacheEntry } from '../../src/lib/trassenscout/buildTrassenscoutCacheEntry'
import { trassenscoutCacheSchema } from '../../src/lib/trassenscout/cacheSchema'
import {
  getTrassenscoutCachePath,
  serializeTrassenscoutCache,
  TRASSENSCOUT_CACHE_DIR,
} from '../../src/lib/trassenscout/loadTrassenscoutCache'
import { listSteckbriefe } from '../../src/lib/trassenscout/listSteckbriefe'

async function ensureCacheDir(cwd: string) {
  await fs.mkdir(path.join(cwd, TRASSENSCOUT_CACHE_DIR), { recursive: true })
}

async function pruneOrphanCacheFiles(cwd: string, activeSlugs: Set<string>) {
  const cacheDir = path.join(cwd, TRASSENSCOUT_CACHE_DIR)
  let entries: string[]
  try {
    entries = await fs.readdir(cacheDir)
  } catch {
    return
  }

  for (const file of entries) {
    if (!file.endsWith('.json')) continue
    const slug = file.replace(/\.json$/, '')
    if (!activeSlugs.has(slug)) {
      const filePath = path.join(cacheDir, file)
      await fs.unlink(filePath)
      console.log(`  REMOVED orphan cache ${filePath}`)
    }
  }
}

async function main() {
  const cwd = process.cwd()
  console.log('STARTING trassenscout/update')

  await ensureCacheDir(cwd)

  const steckbriefe = await listSteckbriefe(cwd)
  const withSlugs = steckbriefe.filter((entry) => entry.trassenscoutProjectSlugs.length > 0)
  const activeSlugs = new Set(withSlugs.map((entry) => entry.slug))
  const failures: string[] = []
  let updated = 0

  for (const { slug, trassenscoutProjectSlugs } of withSlugs) {
    const filePath = getTrassenscoutCachePath(slug, cwd)
    try {
      console.log(`  FETCHING ${slug} (${trassenscoutProjectSlugs.join(', ')})`)
      const entry = await buildTrassenscoutCacheEntry(slug, trassenscoutProjectSlugs)
      trassenscoutCacheSchema.parse(entry)
      await fs.writeFile(filePath, serializeTrassenscoutCache(entry), 'utf8')
      console.log(`  WRITING ${filePath}`)
      updated += 1
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`  ERROR ${slug}: ${message}`)
      failures.push(slug)
    }
  }

  await pruneOrphanCacheFiles(cwd, activeSlugs)

  console.log(
    `DONE: ${updated} cache file(s) written (${withSlugs.length} steckbriefe with Trassenscout slugs)`,
  )

  if (failures.length > 0) {
    console.error(`FAILED: ${failures.join(', ')}`)
    process.exit(1)
  }
}

main()
