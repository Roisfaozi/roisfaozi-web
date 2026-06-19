import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    technologies: z.array(z.string()),
    links: z.object({
      github: z.string().optional(),
      live: z.string().url().optional(),
    }),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
})

export const collections = { projects }
