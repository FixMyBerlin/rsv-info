import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
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

export function trassenscoutCacheBodyEquals(existingRaw: string, nextRaw: string): boolean {
  const stripSyncedAt = (json: string) => json.replace(/"syncedAt": "[^"]+"/, '"syncedAt": ""')
  return stripSyncedAt(existingRaw) === stripSyncedAt(nextRaw)
}

function formatTrassenscoutCacheFile(filePath: string, cwd = process.cwd()): void {
  const result = spawnSync('bunx', ['oxfmt', '-c', 'oxfmt.config.mjs', filePath], {
    cwd,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || `oxfmt failed for ${filePath}`)
  }
}

async function formatTrassenscoutCacheRaw(
  raw: string,
  slug: string,
  cwd: string,
  tag: string,
): Promise<string> {
  const filePath = getTrassenscoutCachePath(slug, cwd)
  const tempPath = path.join(path.dirname(filePath), `.${slug}.${tag}.json`)

  await fsPromises.writeFile(tempPath, raw, 'utf8')

  try {
    formatTrassenscoutCacheFile(tempPath, cwd)
    return await fsPromises.readFile(tempPath, 'utf8')
  } finally {
    await fsPromises.unlink(tempPath).catch(() => {})
  }
}

export async function formatSerializedTrassenscoutCache(
  entry: TrassenscoutCacheEntry,
  slug: string,
  cwd = process.cwd(),
): Promise<string> {
  return formatTrassenscoutCacheRaw(serializeTrassenscoutCache(entry), slug, cwd, 'format-check')
}

export async function formatExistingTrassenscoutCache(
  raw: string,
  slug: string,
  cwd = process.cwd(),
): Promise<string> {
  return formatTrassenscoutCacheRaw(raw, slug, cwd, 'format-existing')
}
