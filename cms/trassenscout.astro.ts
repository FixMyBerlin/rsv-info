import { defineCollection } from 'astro:content'
import { trassenscoutCacheSchema } from '../src/lib/trassenscout/cacheSchema'
import { loader } from './utils/loader'

export const basePath = 'src/data/trassenscout'

export const astroTrassenscoutDefinition = defineCollection({
  loader: loader(basePath, 'json'),
  schema: trassenscoutCacheSchema,
})
