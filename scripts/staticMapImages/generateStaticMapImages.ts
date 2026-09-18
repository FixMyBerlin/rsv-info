import fs from 'node:fs'
import path from 'node:path'
import { emptyGeometry, hasMapGeometry } from '../../src/lib/trassenscout/emptyGeometry'
import { loadTrassenscoutCacheSync } from '../../src/lib/trassenscout/loadTrassenscoutCache'
import {
  buildStaticMapRequestUrl,
  filterRenderableMapGeometry,
  hashSidecarPath,
  mapImageInputHashFromUrl,
} from './mapImageRequest'

const outputDir = path.resolve('public/rsv-map-images')
const steckbriefeDir = path.resolve('src/data/steckbriefe')
const FALLBACK_FILENAME = 'fallback.png'

async function fetchMapImage(url: string): Promise<Buffer> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

function readExistingHash(pngPath: string) {
  const sidecar = hashSidecarPath(pngPath)
  if (!fs.existsSync(pngPath) || !fs.existsSync(sidecar)) return null
  return fs.readFileSync(sidecar, 'utf8').trim()
}

function writePngAndHash(pngPath: string, buffer: Buffer, hash: string) {
  fs.writeFileSync(pngPath, buffer)
  fs.writeFileSync(hashSidecarPath(pngPath), `${hash}\n`)
}

type ProcessResult = 'saved' | 'unchanged' | 'skipped' | 'error'

async function writeOrSkipImage(
  pngPath: string,
  url: URL,
  logLabel: string,
): Promise<Exclude<ProcessResult, 'skipped' | 'error'>> {
  const hash = mapImageInputHashFromUrl(url)
  if (readExistingHash(pngPath) === hash) {
    console.log(`Unchanged ${logLabel}`)
    return 'unchanged'
  }

  const buffer = await fetchMapImage(url.toString())
  writePngAndHash(pngPath, buffer, hash)
  console.log(`Image saved to ${pngPath}`)
  return 'saved'
}

async function writeFallbackImage(): Promise<Exclude<ProcessResult, 'skipped'>> {
  try {
    const empty = emptyGeometry('_fallback')
    const url = buildStaticMapRequestUrl(empty)
    return await writeOrSkipImage(
      path.resolve(outputDir, FALLBACK_FILENAME),
      url,
      FALLBACK_FILENAME,
    )
  } catch (error) {
    console.error(`Error processing ${FALLBACK_FILENAME}:`, error)
    return 'error'
  }
}

const MAP_IMAGE_CONCURRENCY = 4

async function mapPool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>) {
  const results: R[] = Array.from({ length: items.length })
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await fn(items[index])
    }
  }

  const workerCount = Math.min(concurrency, items.length)
  await Promise.all(Array.from({ length: workerCount }, () => worker()))
  return results
}

const processSteckbrief = async (slug: string): Promise<ProcessResult> => {
  try {
    const cache = loadTrassenscoutCacheSync(slug)
    const data = cache?.geometry ?? null
    const renderable = data && hasMapGeometry(data) ? filterRenderableMapGeometry(data) : null
    if (!renderable) {
      console.log(`Skipping ${slug}: no Trassenscout geometry`)
      return 'skipped'
    }

    const url = buildStaticMapRequestUrl(renderable)
    return await writeOrSkipImage(path.resolve(outputDir, `${slug}.png`), url, slug)
  } catch (error) {
    console.error(`Error processing ${slug}:`, error)
    return 'error'
  }
}

function unlinkIfExists(filePath: string) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

function pruneStaleMapImages(activeSlugs: Set<string>, slugsWithoutGeometry: Set<string>) {
  if (!fs.existsSync(outputDir)) return

  for (const file of fs.readdirSync(outputDir)) {
    if (file === FALLBACK_FILENAME || file === hashSidecarPath(FALLBACK_FILENAME)) continue

    if (file.endsWith('.sha256')) {
      const pngName = file.replace(/\.sha256$/, '.png')
      if (!fs.existsSync(path.join(outputDir, pngName))) {
        unlinkIfExists(path.join(outputDir, file))
        console.log(`Removed orphan map image hash ${file}`)
      }
      continue
    }

    if (!file.endsWith('.png')) continue

    const slug = file.replace(/\.png$/, '')
    if (!activeSlugs.has(slug) || slugsWithoutGeometry.has(slug)) {
      const pngPath = path.resolve(outputDir, file)
      unlinkIfExists(pngPath)
      unlinkIfExists(hashSidecarPath(pngPath))
      console.log(`Removed stale map image ${pngPath}`)
    }
  }
}

const processFiles = async () => {
  fs.mkdirSync(outputDir, { recursive: true })

  const slugs = fs
    .readdirSync(steckbriefeDir, { withFileTypes: true })
    .filter((entry: { isDirectory: () => boolean }) => entry.isDirectory())
    .map((entry: { name: string }) => entry.name)

  const fallbackResult = await writeFallbackImage()

  const results = await mapPool(slugs, MAP_IMAGE_CONCURRENCY, processSteckbrief)
  const slugsWithoutGeometry = new Set<string>(
    slugs.filter((_: string, index: number) => results[index] === 'skipped'),
  )
  pruneStaleMapImages(new Set<string>(slugs), slugsWithoutGeometry)

  const saved = results.filter((result) => result === 'saved').length
  const unchanged = results.filter((result) => result === 'unchanged').length
  const failed = results.filter((result) => result === 'error').length
  const skipped = slugsWithoutGeometry.size
  const fallbackNote =
    fallbackResult === 'saved'
      ? ', fallback saved'
      : fallbackResult === 'unchanged'
        ? ', fallback unchanged'
        : fallbackResult === 'error'
          ? ', fallback failed (existing image kept)'
          : ''
  console.log(
    `${saved} route map image(s) saved, ${unchanged} unchanged, ${skipped} steckbrief(e) use fallback${fallbackNote}` +
      (failed ? `, ${failed} failed (existing images kept)` : ''),
  )
}

processFiles()
