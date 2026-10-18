import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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

const contentBlocks = z.array(
  z.discriminatedUnion('component', [
    z.object({
      component: z.literal('section'),
      id: z.string().optional(),
      heading: z.string().optional(),
      content: z.array(
        z.discriminatedUnion('type', [
          z.object({ type: z.literal('p'), text: z.string().min(1) }),
          z.object({
            type: z.literal('list'),
            ordered: z.boolean().default(false),
            items: z.array(z.string().min(1)).min(1),
          }),
        ])
      ).default([]),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('note'),
      id: z.string().optional(),
      variant: z.enum(['info', 'success', 'warning', 'danger']).optional(),
      title: z.string().optional(),
      text: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('faq'),
      id: z.string().optional(),
      heading: z.string().optional(),
      items: z.array(
        z.object({
          question: z.string().min(1),
          answer: z.string().min(1),
        })
      ).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('process-timeline'),
      id: z.string().optional(),
      title: z.string().optional(),
      steps: z.array(
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        })
      ).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('checklist-card'),
      id: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      items: z.array(
        z.object({
          label: z.string().min(1),
        })
      ).min(1),
      note: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('home-hero'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      headingLead: z.string().optional(),
      headingHighlight: z.string().optional(),
      intro: z.string().optional(),
      primaryLabel: z.string().optional(),
      primaryHref: z.string().optional(),
      secondaryLabel: z.string().optional(),
      secondaryHref: z.string().optional(),
      sideEyebrow: z.string().optional(),
      sideNote: z.string().optional(),
      sideFootEyebrow: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('home-services'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      items: z.array(
        z.object({
          number: z.string().optional(),
          title: z.string().optional(),
          text: z.string().optional(),
          href: z.string().optional(),
        })
      ).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('home-process'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      headingHighlight: z.string().optional(),
      steps: z.array(
        z.object({
          number: z.string().optional(),
          title: z.string().min(1),
        })
      ).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('home-cta'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      ctaLabel: z.string().optional(),
      ctaHref: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('home-latest'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      ctaLabel: z.string().optional(),
      ctaHref: z.string().optional(),
      /** Jumlah item gabungan (artikel + panduan) yang ditampilkan. */
      limit: z.number().int().positive().default(3),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('card'),
      id: z.string().optional(),
      heading: z.string().min(1),
      icon: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
      body: z.array(z.any()).default([]),
    }),
    z.object({
      component: z.literal('cta'),
      id: z.string().optional(),
      heading: z.string().optional(),
      icon: z.string().optional(),
      message: z.string().min(1),
      button: z.string().optional(),
      href: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('table'),
      id: z.string().optional(),
      heading: z.string().optional(),
      icon: z.string().optional(),
      head: z.array(z.string()).min(1),
      rows: z.array(z.array(z.string())).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('steps'),
      id: z.string().optional(),
      heading: z.string().min(1),
      icon: z.string().optional(),
      items: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('stats'),
      id: z.string().optional(),
      heading: z.string().optional(),
      icon: z.string().optional(),
      items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('glossary'),
      id: z.string().optional(),
      heading: z.string().min(1),
      icon: z.string().optional(),
      items: z.array(z.object({ term: z.string().min(1), definition: z.string().min(1) })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('quote'),
      id: z.string().optional(),
      text: z.string().min(1),
      source: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('comparison-table'),
      id: z.string().optional(),
      title: z.string().min(1),
      intro: z.string().optional(),
      headers: z.array(z.string().min(1)).min(1),
      rows: z.array(z.array(z.string()).min(1)).min(1),
      note: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('document-list'),
      id: z.string().optional(),
      title: z.string().min(1),
      intro: z.string().optional(),
      items: z.array(z.object({ name: z.string().min(1), purpose: z.string().optional(), mandatory: z.boolean().optional() })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('image-panel'),
      id: z.string().optional(),
      src: z.string().min(1),
      alt: z.string().min(1),
      caption: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('feature-card-grid'),
      id: z.string().optional(),
      title: z.string().optional(),
      items: z.array(z.object({ title: z.string().min(1), description: z.string().optional(), points: z.array(z.string()).default([]) })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('stats-grid'),
      id: z.string().optional(),
      items: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('source-links'),
      id: z.string().optional(),
      intro: z.string().optional(),
      items: z.array(z.object({ label: z.string().min(1), url: z.string().min(1), description: z.string().optional() })).min(1),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('contact'),
      id: z.string().optional(),
      title: z.string().optional(),
      intro: z.string().optional(),
      hoursTitle: z.string().optional(),
      hours: z.array(z.string()).optional(),
      formTitle: z.string().optional(),
      serviceOptions: z.array(z.string()).optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('contact-panel'),
      id: z.string().optional(),
      title: z.string().min(1),
      intro: z.string().optional(),
      hoursTitle: z.string().optional(),
      hours: z.array(z.string()).optional(),
      formTitle: z.string().optional(),
      serviceOptions: z.array(z.string()).optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('page-header'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().min(1),
      intro: z.string().optional(),
      image: z.string().optional(),
      imageAlt: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('service-list'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      variant: z.string().optional(),
      columns: z.number().int().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('article-list'),
      id: z.string().optional(),
      mode: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      limit: z.number().int().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
    z.object({
      component: z.literal('not-found'),
      id: z.string().optional(),
      eyebrow: z.string().optional(),
      heading: z.string().min(1),
      message: z.string().min(1),
      image: z.string().optional(),
      homeCta: z.string().optional(),
      servicesCta: z.string().optional(),
      articlesCta: z.string().optional(),
      class: z.record(z.string(), z.string()).optional(),
    }),
  ])
).default([]);

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
    relatedType: z.enum(['service', 'page', 'article']).optional(),
    relatedId: z.number().int().positive().optional(),
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
