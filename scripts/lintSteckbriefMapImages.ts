import fs from 'node:fs'
import path from 'node:path'
import { hasMapGeometry } from '../src/lib/trassenscout/emptyGeometry'
import { loadTrassenscoutCacheSync } from '../src/lib/trassenscout/loadTrassenscoutCache'

const cacheDir = path.resolve('src/data/trassenscout')
const mapImageDir = path.resolve('public/rsv-map-images')

const missing: string[] = []

for (const file of fs.readdirSync(cacheDir)) {
  if (!file.endsWith('.json')) continue

  const slug = file.replace(/\.json$/, '')
  const cache = loadTrassenscoutCacheSync(slug)
  if (!cache || !hasMapGeometry(cache.geometry)) continue

  if (!fs.existsSync(path.join(mapImageDir, `${slug}.png`))) {
    missing.push(slug)
  }
}

if (missing.length === 0) process.exit(0)

console.error(
  `Missing public/rsv-map-images/<slug>.png for ${missing.length} Steckbrief(e) that have Trassenscout geometry:\n` +
    missing.map((slug) => `  ${slug}`).join('\n') +
    '\n\nRun `bun run generate:map-images` (or `bun run trassenscout:sync`).\n' +
    'That script is not part of `astro build`. It runs on Netlify via `build:netlify`, in the weekly Trassenscout workflow, and when you run it locally.',
)
process.exit(1)
