import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    period: z.string().optional(),
    description: z.string(),
    highlights: z.array(z.string()).default([]),
    image: z.string(),
    technologies: z.array(z.string()),
    visibility: z.enum(['public', 'enterprise']).default('public'),
    links: z
      .object({
        github: z.string().url().optional(),
        live: z.string().url().optional(),
        label: z.string().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
})

export const collections = { projects }
