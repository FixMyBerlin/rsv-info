import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'astro/zod'
import { parse as parseYaml } from 'yaml'
import {
  emptyGeometrySource,
  hasGeometryConfig,
  parseGeometrySource,
  type GeometrySource,
} from './geometrySource'

const STECKBRIEFE_DIR = 'src/data/steckbriefe'

const steckbriefFrontmatterSchema = z.object({
  slug: z.string().min(1).optional(),
  visibility: z.enum(['visible', 'hidden']).optional(),
  geometrySource: z.unknown().optional(),
})

export type SteckbriefFrontmatter = z.infer<typeof steckbriefFrontmatterSchema>

export type SteckbriefRef = {
  slug: string
  geometrySource: GeometrySource
}

export function parseSteckbriefFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const empty: SteckbriefFrontmatter = {}
  if (!match) return empty
  const parsed = steckbriefFrontmatterSchema.safeParse(parseYaml(match[1]))
  return parsed.success ? parsed.data : empty
}

export function parseSteckbriefVisibility(frontmatter: SteckbriefFrontmatter) {
  return frontmatter.visibility === 'hidden' ? 'hidden' : 'visible'
}

function geometrySourceFromFrontmatter(frontmatter: SteckbriefFrontmatter) {
  if (frontmatter.geometrySource !== undefined) {
    return parseGeometrySource(frontmatter.geometrySource)
  }

  return emptyGeometrySource()
}

export async function listSteckbriefe(cwd = process.cwd()) {
  const dir = path.join(cwd, STECKBRIEFE_DIR)
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const result: SteckbriefRef[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const mdxPath = path.join(dir, entry.name, 'index.mdx')
    try {
      const content = await fs.readFile(mdxPath, 'utf8')
      const frontmatter = parseSteckbriefFrontmatter(content)
      const slug = frontmatter.slug ?? entry.name

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

export function listSteckbriefeWithGeometry(steckbriefe: SteckbriefRef[]) {
  return steckbriefe.filter((entry) => hasGeometryConfig(entry.geometrySource))
}
