import { z } from 'astro/zod'

const positionSchema = z.array(z.number()).min(2).max(2)

const multiLineStringGeometrySchema = z.object({
  type: z.literal('MultiLineString'),
  coordinates: z.array(z.array(positionSchema).min(2)),
})

const multiPolygonGeometrySchema = z.object({
  type: z.literal('MultiPolygon'),
  coordinates: z.array(z.array(z.array(positionSchema).min(4))),
})

export const geometryFeaturePropertiesSchema = z.object({
  id: z.string(),
  detail_level: z.enum(['exact', 'rough', 'corridor', 'approximated']).optional(),
  state: z.enum(['idea', 'agreement_process', 'planning', 'in_progress', 'done']).optional(),
  id_rsv: z.string().optional(),
  planning_phase: z.any().optional(),
  variant: z.enum(['Vorzugstrasse', 'Alternative']),
  discarded: z.boolean(),
  length: z.number().optional(),
  'description:planning_phase': z.union([z.string(), z.null()]).optional(),
})

export const geometryFeatureSchema = z.object({
  type: z.literal('Feature'),
  id: z.union([z.number(), z.string()]).optional(),
  properties: geometryFeaturePropertiesSchema,
  geometry: z.discriminatedUnion('type', [
    multiLineStringGeometrySchema,
    multiPolygonGeometrySchema,
  ]),
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
