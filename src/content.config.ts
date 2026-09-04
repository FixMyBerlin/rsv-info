import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection, type SchemaContext } from 'astro:content'

import { geometrySourceSchema } from './lib/trassenscout/geometrySourceSchema'
import { steckbriefeLoader } from './loaders/steckbriefeLoader'
import { geometrySchema } from './types/geometry'

const postsSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    subTitle: z.string().optional(),
    type: z.string(),
    teaserText: z.string(),
    date: z.coerce.date(),
    preview: z.boolean(),
    order: z.number(),
    teaserImage: image(),
    imageCopyright: z.string(),
    showOnHome: z.boolean().optional(),
    uploads: z.array(z.any()).optional(),
  })

const planningposts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/planningposts' }),
  schema: postsSchema,
})

const communicationposts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/communicationposts' }),
  schema: postsSchema,
})

const steckbriefe = defineCollection({
  loader: steckbriefeLoader(),
  schema: z.object({
    visibility: z.enum(['visible', 'hidden']).default('visible'),
    slug: z.string(),
    title: z.string(),
    ref: z.string().optional(),
    state: z.enum(['idea', 'agreement_process', 'planning', 'in_progress', 'done']),
    fromCity: z.string().optional(),
    fromFederalState: z.string().optional(),
    toCity: z.string().optional(),
    toFederalState: z.string().optional(),
    lengthKm: z.number().optional(),
    stand: z.string().optional(),
    lastCheckedDate: z.string().optional(),
    sourceUrl: z.url().optional(),
    website: z.url().optional(),
    stakeholders: z
      .array(
        z.object({
          name: z.string(),
          roles: z.array(z.enum(['authority', 'communication', 'construction_company'])),
        }),
      )
      .optional(),
    geometrySource: geometrySourceSchema,
    showOnHome: z.boolean(),
    order: z.number(),
    geometry: geometrySchema,
    apiFields: z.object({
      operator: z.string().optional(),
      status: z.string().optional(),
      estimatedCompletionDate: z.string().optional(),
    }),
  }),
})

export const collections = {
  planningposts,
  communicationposts,
  steckbriefe,
}
