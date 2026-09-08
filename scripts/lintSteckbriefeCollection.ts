import fs from 'node:fs/promises'
import path from 'node:path'

const allowedFile = path.join('src', 'lib', 'steckbrief', 'getSteckbriefTeasers.ts')
const directLoad = /get(?:Collection|Entry)\(\s*['"]steckbriefe['"]/

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)))
      continue
    }
    if (/\.(ts|tsx|astro)$/.test(entry.name)) files.push(fullPath)
  }
  return files
}

const hits: string[] = []
for (const file of await walk('src')) {
  if (file === allowedFile) continue
  const source = await fs.readFile(file, 'utf8')
  if (directLoad.test(source)) hits.push(file)
}

if (hits.length > 0) {
  console.error(
    'Load Steckbriefe with getPublishedSteckbriefe() so visibility: hidden stays unpublished:\n' +
      hits.map((file) => `  ${file}`).join('\n'),
  )
  process.exit(1)
}
