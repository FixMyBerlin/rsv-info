import type { GeometrySchema } from '../../src/types/geometry'
import type { Feature } from 'maplibre-gl'

const pkg = require('@googlemaps/polyline-codec')
const turf = require('@turf/turf')
const fs = require('fs')
const path = require('path')
const { segmentColor } = require('./mapColors.js')
const { maptilerBaseUrl, maptilerKey } = require('./mapTiler.const.js')
const { encode } = pkg
const { simplify } = turf

const outputDir = path.resolve('public/rsv-map-images')
const steckbriefeDir = path.resolve('src/data/steckbriefe')

// @ts-expect-error
const buildPaths = ({ properties, geometry: { coordinates } }: Feature) => {
  const paint = { width: 5, stroke: segmentColor(properties) }
  // @ts-expect-error
  const paintArr = Object.keys(paint).map((key) => `${key}:${paint[key]}`)

  return (
    coordinates
      // @ts-expect-error
      .map((linestring) => encode(linestring.map((position) => [...position].reverse())))
      // @ts-expect-error
      .map((polyline) => [...paintArr, `enc:${polyline}`].join('|'))
  )
}

type StaticMapRequestParams = {
  features: GeometrySchema['features']
  bbox: GeometrySchema['bbox']
}

const staticMapRequest = (
  { features, bbox }: StaticMapRequestParams,
  [width, height]: [number, number],
) => {
  const dims = `${width / 2}x${height / 2}@2x.png`
  const url = new URL(`${maptilerBaseUrl}/static/${bbox.toString()}/${dims}`)
  url.searchParams.append('key', maptilerKey)
  url.searchParams.append('attribution', '0')
  features.forEach((feature) => {
    // @ts-expect-error
    buildPaths(feature).forEach((path: string) => {
      url.searchParams.append('path', path)
    })
  })
  return url
}

function loadGeometryFromCache(slug: string): GeometrySchema | null {
  const { loadTrassenscoutCacheSync } = require('../../src/lib/trassenscout/loadTrassenscoutCache')
  const cache = loadTrassenscoutCacheSync(slug)
  return cache?.geometry ?? null
}

const processSteckbrief = async (slug: string) => {
  try {
    const data = loadGeometryFromCache(slug)
    if (!data) {
      console.log(`Skipping ${slug}: no checked-in Trassenscout cache`)
      return false
    }

    const filteredData = {
      ...data,
      features: data.features.filter((feature) => !feature.properties.discarded),
    }

    if (filteredData.features.length === 0) {
      console.log(`Skipping ${slug}: no map features`)
      return false
    }

    let url = staticMapRequest(filteredData, [1920, 1920]).toString()
    let tolerance = 0.000001

    while (url.length > 8192) {
      const simplified = simplify(filteredData, { tolerance, highQuality: true })
      url = staticMapRequest(simplified, [1920, 1920]).toString()
      tolerance *= 2
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const outputFilePath = path.resolve(outputDir, `${slug}.png`)
    fs.writeFileSync(outputFilePath, buffer)

    console.log(`Image saved to ${outputFilePath}`)
    return true
  } catch (error) {
    console.error(`Error processing ${slug}:`, error)
    return false
  }
}

const processFiles = async () => {
  const slugs = fs
    .readdirSync(steckbriefeDir, { withFileTypes: true })
    .filter((entry: { isDirectory: () => boolean }) => entry.isDirectory())
    .map((entry: { name: string }) => entry.name)

  const results = await Promise.all(slugs.map((slug: string) => processSteckbrief(slug)))
  const count = results.filter(Boolean).length
  console.log(`${count} images (from ${slugs.length} steckbriefe) have been saved`)
}

processFiles()
