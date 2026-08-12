import fs from 'node:fs/promises'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

import {
  emptyGeometrySource,
  hasGeometryConfig,
  parseGeometrySource,
  type GeometrySource,
} from './geometrySource'

const STECKBRIEFE_DIR = 'src/data/steckbriefe'

export type SteckbriefRef = {
  slug: string
  geometrySource: GeometrySource
}

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  return parseYaml(match[1]) as Record<string, unknown>
}

function geometrySourceFromFrontmatter(frontmatter: Record<string, unknown>): GeometrySource {
  if ('geometrySource' in frontmatter) {
    return parseGeometrySource(frontmatter.geometrySource)
  }

  // Legacy: flat trassenscoutProjectSlugs array
  if (Array.isArray(frontmatter.trassenscoutProjectSlugs)) {
    const value = frontmatter.trassenscoutProjectSlugs.filter(
      (item): item is string => typeof item === 'string' && item.length > 0,
    )
    if (value.length === 0) return emptyGeometrySource()
    return { discriminant: 'projects', value }
  }

  return emptyGeometrySource()
}

export async function listSteckbriefe(cwd = process.cwd()): Promise<SteckbriefRef[]> {
  const dir = path.join(cwd, STECKBRIEFE_DIR)
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const result: SteckbriefRef[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const mdxPath = path.join(dir, entry.name, 'index.mdx')
    try {
      const content = await fs.readFile(mdxPath, 'utf8')
      const frontmatter = parseFrontmatter(content)
      const slug =
        typeof frontmatter.slug === 'string' && frontmatter.slug.length > 0
          ? frontmatter.slug
          : entry.name

      result.push({
        slug,
        geometrySource: geometrySourceFromFrontmatter(frontmatter),
      })
    } catch {
      // skip entries without readable index.mdx
    }
  }

  return result
}

export function listSteckbriefeWithGeometry(steckbriefe: SteckbriefRef[]): SteckbriefRef[] {
  return steckbriefe.filter((entry) => hasGeometryConfig(entry.geometrySource))
}

export function findDuplicateRsvDSubsections(steckbriefe: SteckbriefRef[]): Map<string, string[]> {
  const owners = new Map<string, string[]>()

  for (const entry of steckbriefe) {
    if (entry.geometrySource.discriminant !== 'rsv-d') continue
    for (const subsectionSlug of entry.geometrySource.value) {
      const existing = owners.get(subsectionSlug) ?? []
      existing.push(entry.slug)
      owners.set(subsectionSlug, existing)
    }
  }

  const duplicates = new Map<string, string[]>()
  for (const [subsectionSlug, slugs] of owners) {
    if (slugs.length > 1) {
      duplicates.set(subsectionSlug, slugs)
    }
  }
  return duplicates
}
