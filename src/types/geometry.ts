import { z } from 'astro/zod'

export const geometryFeatureSchema = z.object({
  type: z.literal('Feature'),
  id: z.union([z.number(), z.string()]).optional(),
  properties: z.object({
    id: z.string(),
    detail_level: z.enum(['exact', 'rough', 'corridor', 'approximated']).optional(),
    state: z.enum(['idea', 'agreement_process', 'planning', 'in_progress', 'done']).optional(),
    id_rsv: z.string().optional(),
    planning_phase: z.any().optional(),
    variant: z.enum(['Vorzugstrasse', 'Alternative']),
    discarded: z.boolean(),
    length: z.number().optional(),
    'description:planning_phase': z.union([z.string(), z.null()]).optional(),
  }),
  geometry: z.object({
    type: z.literal('MultiLineString'),
    coordinates: z.array(z.array(z.array(z.number()).min(2).max(2)).min(2)),
  }),
  bbox: z.array(z.number()).min(4).max(4).optional(),
})

export const geometrySchema = z.object({
  id: z.string(),
  crs: z
    .object({
      type: z.literal('name').optional(),
      properties: z.any().optional(),
    })
    .optional(),
  type: z.literal('FeatureCollection'),
  features: z.array(geometryFeatureSchema),
  bbox: z.array(z.number()).min(4).max(4),
})

export type GeometrySchema = z.infer<typeof geometrySchema>
export type GeometryFeature = z.infer<typeof geometryFeatureSchema>
