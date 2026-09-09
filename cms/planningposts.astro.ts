import { defineCollection } from 'astro:content'
import { basePath } from './planningposts.keystatic'
import { postsSchema } from './posts.astro'
import { loader } from './utils/loader'

export const astroPlanningpostsDefinition = defineCollection({
  loader: loader(basePath, 'mdx', '**/[^_]*.{md,mdx}'),
  schema: postsSchema,
})
