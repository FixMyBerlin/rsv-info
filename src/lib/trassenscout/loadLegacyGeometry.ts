import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'

import type { GeometrySchema } from '../../types/geometry'

const execFileAsync = promisify(execFile)

function idToGeometryFilename(pageId: string): string {
  return `${pageId.replace(/-/g, '_')}.json`
}

async function readLegacyGeometryFile(filePath: string): Promise<GeometrySchema | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw) as GeometrySchema
  } catch {
    return null
  }
}

async function readLegacyGeometryFromGit(
  pageId: string,
  gitRef = 'HEAD',
): Promise<GeometrySchema | null> {
  const gitPath = `src/content/geometries/${idToGeometryFilename(pageId)}`
  try {
    const { stdout } = await execFileAsync('git', ['show', `${gitRef}:${gitPath}`], {
      cwd: process.cwd(),
      maxBuffer: 50 * 1024 * 1024,
    })
    return JSON.parse(stdout) as GeometrySchema
  } catch {
    return null
  }
}

/** Loads legacy GeoJSON from disk or git (when files were removed from the working tree). */
export async function loadLegacyGeometry(
  pageId: string,
  options?: { gitRef?: string },
): Promise<GeometrySchema | null> {
  const filePath = path.join(process.cwd(), 'src/content/geometries', idToGeometryFilename(pageId))
  const fromDisk = await readLegacyGeometryFile(filePath)
  if (fromDisk) return fromDisk

  return readLegacyGeometryFromGit(pageId, options?.gitRef)
}
