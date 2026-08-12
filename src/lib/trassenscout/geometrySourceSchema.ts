import { z } from 'astro/zod'

export const geometrySourceSchema = z.discriminatedUnion('discriminant', [
  z.object({
    discriminant: z.literal('none'),
    value: z.null(),
  }),
  z.object({
    discriminant: z.literal('projects'),
    value: z.array(z.string()),
  }),
  z.object({
    discriminant: z.literal('rsv-d'),
    value: z.array(z.string()),
  }),
])
