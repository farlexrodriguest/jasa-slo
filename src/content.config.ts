import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date().optional(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    id: z.number().int().positive(),
    ulid: z.string().length(26),
    type: z.literal('service'),
    slug: z.string().min(1),
    title: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    description: z.string(),
    serviceGroup: z.string(),
    order: z.number().int().default(0),
    draft: z.boolean().default(false),
    status: z.enum(['active', 'inactive']).default('active'),
    eyebrow: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(),
    socialImage: z.string().optional(),
    blocks: z.array(z.object({ component: z.string() }).passthrough()).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { articles, services, pages };
