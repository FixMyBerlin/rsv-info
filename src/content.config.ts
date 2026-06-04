import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'
import { steckbriefeLoader } from './loaders/steckbriefeLoader'
import { geometrySchema } from './types/geometry'

const postsSchema = ({ image }: { image: (config?: unknown) => z.ZodTypeAny }) =>
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
    sourceUrl: z.string().optional(),
    website: z.string().optional(),
    stakeholders: z
      .array(
        z.object({
          name: z.string(),
          roles: z.array(z.enum(['authority', 'communication', 'construction_company'])),
        }),
      )
      .optional(),
    trassenscoutProjectSlugs: z.array(z.string()),
    showOnHome: z.boolean(),
    order: z.number(),
    description: z.unknown().optional(),
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
