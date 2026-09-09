import { z } from 'astro/zod'
import { defineCollection } from 'astro:content'
import { parseGeometrySource } from '../src/lib/trassenscout/geometrySource'
import { geometrySourceSchema } from '../src/lib/trassenscout/geometrySourceSchema'
import {
  basePath,
  stakeholderRoleEnumAndOrder,
  stateEnumAndOrder,
  visibilityEnumAndOrder,
} from './steckbriefe.keystatic'
import { loader } from './utils/loader'
import { yamlDateString } from './utils/yamlDateString'

export const astroSteckbriefeDefinition = defineCollection({
  loader: loader(basePath, 'mdx', '**/index.mdx'),
  schema: z.object({
    visibility: z.enum(visibilityEnumAndOrder).default('visible'),
    slug: z.string().optional(),
    title: z.string(),
    ref: z.string().optional(),
    state: z.enum(stateEnumAndOrder),
    fromCity: z.string().optional(),
    fromFederalState: z.string().optional(),
    toCity: z.string().optional(),
    toFederalState: z.string().optional(),
    lengthKm: z.number().optional(),
    stand: yamlDateString,
    lastCheckedDate: yamlDateString,
    sourceUrl: z.url().optional(),
    website: z.url().optional(),
    stakeholders: z
      .array(
        z.object({
          name: z.string(),
          roles: z.array(z.enum(stakeholderRoleEnumAndOrder)),
        }),
      )
      .optional(),
    geometrySource: z.preprocess(parseGeometrySource, geometrySourceSchema),
    showOnHome: z.boolean().default(false),
    order: z.number().default(0),
  }),
})
