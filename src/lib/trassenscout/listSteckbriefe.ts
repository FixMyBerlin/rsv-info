import fs from 'node:fs/promises'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

const STECKBRIEFE_DIR = 'src/data/steckbriefe'

export type SteckbriefRef = {
  slug: string
  trassenscoutProjectSlugs: string[]
}

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  return parseYaml(match[1]) as Record<string, unknown>
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
      const trassenscoutProjectSlugs = Array.isArray(frontmatter.trassenscoutProjectSlugs)
        ? frontmatter.trassenscoutProjectSlugs.filter(
            (value): value is string => typeof value === 'string' && value.length > 0,
          )
        : []

      result.push({ slug, trassenscoutProjectSlugs })
    } catch {
      // skip entries without readable index.mdx
    }
  }

  return result
}
