import { z } from 'astro/zod'

import { geometrySchema } from '../../types/geometry'

export const steckbriefApiFieldsSchema = z.object({
  operator: z.string().optional(),
  status: z.string().optional(),
  estimatedCompletionDate: z.string().optional(),
})

export const trassenscoutCacheSchema = z.object({
  syncedAt: z.string(),
  geometrySource: z.enum(['projects', 'rsv-d']).optional(),
  projectSlugs: z.array(z.string()),
  subsectionSlugs: z.array(z.string()).optional(),
  geometry: geometrySchema,
  apiFields: steckbriefApiFieldsSchema,
})

export type TrassenscoutCacheEntry = z.infer<typeof trassenscoutCacheSchema>
