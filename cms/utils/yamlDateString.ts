import { z } from 'astro/zod'

export const yamlDateString = z
  .union([z.string(), z.date()])
  .optional()
  .transform((value) => {
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return value
  })
