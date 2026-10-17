import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const utcDate = z.coerce.date();
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Gunakan slug kebab-case');
const ulid = z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/, 'ULID tidak valid');
const dated = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine((data: any) => data.updatedDate >= data.pubDate, {
    path: ['updatedDate'],
    message: 'updatedDate tidak boleh sebelum pubDate',
  });

/** Identitas bersama untuk seluruh konten (ikuti pola konsultan-slf). */
const sharedIdentity = {
  id: z.number().int().positive(),
  ulid,
  title: z.string().min(1),
  description: z.string().min(1),
  draft: z.boolean().default(false),
  image: z.string().optional(),
  socialImage: z.string().optional(),
};

const contentBlocks = z
  .array(z.object({ component: z.string().min(1) }).passthrough())
  .default([]);

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: dated(z.object({
    ...sharedIdentity,
    type: z.literal('article'),
    slug,
    pubDate: utcDate,
    updatedDate: utcDate,
    author: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedType: z.enum(['service', 'page', 'article']).optional(),
    relatedId: z.number().int().positive().optional(),
    relatedArticles: z.array(z.number().int().positive()).default([]),
    blocks: contentBlocks,
  })),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: dated(z.object({
    ...sharedIdentity,
    type: z.literal('page'),
    slug,
    pubDate: utcDate,
    updatedDate: utcDate,
    eyebrow: z.string().optional(),
    section: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    order: z.number().int().default(0),
    showCta: z.boolean().default(true),
    canonical: z.string().optional(),
    noindex: z.boolean().default(false),
    blocks: contentBlocks,
  })),
});

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: dated(z.object({
    ...sharedIdentity,
    type: z.literal('service'),
    slug,
    pubDate: utcDate,
    updatedDate: utcDate,
    serviceGroup: z.string(),
    order: z.number().int().default(0),
    status: z.enum(['active', 'inactive']).default('active'),
    eyebrow: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(),
    blocks: contentBlocks,
  })),
});

export const collections = { articles, services, pages };
