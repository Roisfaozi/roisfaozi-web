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

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['en', 'id']),
    translationKey: z.string(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    readingTime: z.string(),
    readingMinutes: z.number().default(8),
    category: z.string().default('Backend Engineering'),
    tags: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
})

export const collections = { projects, blog }
