import { Glob } from 'bun'

const allowedFile = 'src/lib/steckbrief/getSteckbriefTeasers.ts'
const directLoad = /get(?:Collection|Entry)\(\s*['"]steckbriefe['"]/

const hits: string[] = []

for await (const file of new Glob('src/**/*.{ts,tsx,astro}').scan('.')) {
  if (file === allowedFile) continue
  const source = await Bun.file(file).text()
  if (directLoad.test(source)) hits.push(file)
}

if (hits.length > 0) {
  console.error(
    'Load Steckbriefe with getPublishedSteckbriefe() so visibility: hidden stays unpublished:\n' +
      hits.map((file) => `  ${file}`).join('\n'),
  )
  process.exit(1)
}
