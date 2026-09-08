import { defineCollection } from 'astro:content'
import { basePath } from './communicationposts.keystatic'
import { postsSchema } from './posts.astro'
import { loader } from './utils/loader'

export const astroCommunicationpostsDefinition = defineCollection({
  loader: loader(basePath, 'mdx', '**/[^_]*.{md,mdx}'),
  schema: postsSchema,
})
