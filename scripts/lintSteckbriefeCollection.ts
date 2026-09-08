import { Glob } from 'bun'

const allowedFile = 'src/lib/steckbrief/getSteckbriefTeasers.ts'
const directLoad = /get(?:Collection|Entry)\(\s*['"]steckbriefe['"]/
const clientValueImport =
  /^import\s+(?!type\s)[^;]*from\s+['"]src\/lib\/steckbrief\/getSteckbriefTeasers['"]/m

const hits: string[] = []
const clientHits: string[] = []

for await (const file of new Glob('src/**/*.{ts,tsx,astro}').scan('.')) {
  if (file === allowedFile) continue
  const source = await Bun.file(file).text()
  if (directLoad.test(source)) hits.push(file)
  if (file.endsWith('.tsx') && clientValueImport.test(source)) clientHits.push(file)
}

if (hits.length > 0) {
  console.error(
    'Load Steckbriefe with getPublishedSteckbriefe() so visibility: hidden stays unpublished:\n' +
      hits.map((file) => `  ${file}`).join('\n'),
  )
}

if (clientHits.length > 0) {
  console.error(
    'Do not import getSteckbriefTeasers from client components; it loads astro:content:\n' +
      clientHits.map((file) => `  ${file}`).join('\n'),
  )
}

if (hits.length > 0 || clientHits.length > 0) process.exit(1)
