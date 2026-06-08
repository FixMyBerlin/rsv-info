import fs from 'node:fs'
import path from 'node:path'

import { parse as parseYaml } from 'yaml'

const STECKBRIEFE_DIR = 'src/data/steckbriefe'

export type SteckbriefYamlRef = {
  slug: string
  trassenscoutProjectSlugs: string[]
}

export function listSteckbriefeFromYaml(cwd = process.cwd()): SteckbriefYamlRef[] {
  const steckbriefeDir = path.join(cwd, STECKBRIEFE_DIR)
  const slugs = fs
    .readdirSync(steckbriefeDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)

  return slugs.map((slug) => {
    const indexPath = path.join(steckbriefeDir, slug, 'index.yaml')
    const entry = parseYaml(fs.readFileSync(indexPath, 'utf8')) as {
      trassenscoutProjectSlugs?: string[]
    }
    const trassenscoutProjectSlugs = (entry.trassenscoutProjectSlugs ?? []).filter(Boolean)

    return { slug, trassenscoutProjectSlugs }
  })
}
