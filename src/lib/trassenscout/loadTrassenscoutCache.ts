import fs from 'node:fs'
import path from 'node:path'

import { type TrassenscoutCacheEntry, trassenscoutCacheSchema } from './cacheSchema'

export const TRASSENSCOUT_CACHE_DIR = 'src/data/trassenscout'

export function getTrassenscoutCachePath(slug: string, cwd = process.cwd()): string {
  return path.join(cwd, TRASSENSCOUT_CACHE_DIR, `${slug}.json`)
}

export function loadTrassenscoutCacheSync(
  slug: string,
  cwd = process.cwd(),
): TrassenscoutCacheEntry | null {
  const filePath = getTrassenscoutCachePath(slug, cwd)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    return trassenscoutCacheSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}

export function serializeTrassenscoutCache(entry: TrassenscoutCacheEntry): string {
  return `${JSON.stringify(entry, null, 2)}\n`
}
