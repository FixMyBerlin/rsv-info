import { createReader } from '@keystatic/core/reader'

import keystaticConfig from '../../../keystatic.config'

export type SteckbriefRef = {
  slug: string
  trassenscoutProjectSlugs: string[]
}

export async function listSteckbriefe(cwd = process.cwd()): Promise<SteckbriefRef[]> {
  const reader = createReader(cwd, keystaticConfig)
  const entries = await reader.collections.steckbriefe.all()

  return entries.map(({ slug, entry }) => ({
    slug: entry.slug ?? slug,
    trassenscoutProjectSlugs: (entry.trassenscoutProjectSlugs ?? []).filter(Boolean),
  }))
}
