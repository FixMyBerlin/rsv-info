import { z } from 'astro/zod'
import type { SchemaContext } from 'astro:content'
import { blogTypeEnumAndOrder } from './posts.keystatic'

export const postsSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    subTitle: z.string().optional(),
    type: z.enum(blogTypeEnumAndOrder),
    teaserText: z.string(),
    date: z.coerce.date(),
    preview: z.boolean(),
    order: z.number(),
    teaserImage: image(),
    imageCopyright: z.string(),
    showOnHome: z.boolean().optional(),
    uploads: z.array(z.any()).optional(),
  })
