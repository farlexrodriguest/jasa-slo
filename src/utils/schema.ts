/**
 * Pembangkit skema schema.org (JSON-LD) untuk Jasa SLO.
 *
 * Setiap builder mengembalikan satu node JSON-LD mentah (tanpa `@context`);
 * injeksi `@context` dilakukan sentral di `src/components/seo/JsonLd.astro`
 * (JSON-LD tanpa `@context` tidak valid dan diabaikan Google).
 *
 * Parameter `base` adalah origin absolut tanpa garis miring
 * (mis. "https://jasa-slo.com"); di route ambil dari
 * `Astro.site?.href ?? Astro.url.origin`.
 *
 * Pemakaian di BaseLayout (setiap halaman):
 * - organizationSchema + webSiteSchema → node sitewide (#organization, #website)
 * - webPageSchema                      → WebPage halaman berjalan (…#webpage)
 * - breadcrumbSchema                   → BreadcrumbList dari pathname
 *
 * Route menambahkan tipe utama halaman (Service/Article/CollectionPage) plus
 * node pendukung (FAQPage, ItemList, service terkait) lewat prop `jsonLd`.
 * Node saling terhubung lewat referensi @id: …#webpage, …#service,
 * …#article, …#faq, …#itemlist, #organization, #website.
 */
import { site } from '../config/site';

const root = (base: string) => base.replace(/\/+$/, '');
const abs = (base: string, path: string) => new URL(path, root(base) + '/').href;
const iso = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');

/** Organisasi/badan usaha — referensi @id dipakai sebagai provider/publisher/about. */
export function organizationSchema(base: string) {
  const b = root(base);
  return {
    '@type': 'Organization',
    '@id': `${b}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: `${b}/`,
    logo: abs(base, '/images/logo-jasa-slo.svg'),
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.contact.address,
    },
    sameAs: [site.social.instagram, site.social.linkedin],
  };
}

/** WebSite — node sitewide, dirujuk setiap WebPage via isPartOf. */
export function webSiteSchema(base: string) {
  const b = root(base);
  return {
    '@type': 'WebSite',
    '@id': `${b}/#website`,
    url: `${b}/`,
    name: site.name,
    inLanguage: 'id',
    publisher: { '@id': `${b}/#organization` },
  };
}

/**
 * Service — halaman `/layanan/<slug>/` dan node terkait di artikel/panduan.
 * `serviceType` diisi dari `serviceGroup` koleksi services.
 * @id memakai sufiks `#service` agar dirujuk Article.about dan WebPage.mainEntity.
 */
export function serviceSchema(opts: {
  base: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  serviceType?: string;
}) {
  const b = root(opts.base);
  const url = `${b}/layanan/${opts.slug}/`;
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: opts.title,
    description: opts.description,
    url,
    ...(opts.image ? { image: abs(opts.base, opts.image) } : {}),
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: { '@id': `${b}/#organization` },
    areaServed: site.regions,
    inLanguage: 'id',
  };
}

/**
 * Article — halaman `/artikel/<slug>/` dan `/panduan/<slug>/`.
 * `mainEntityOfPage` merujuk WebPage (…#webpage) yang dirakit BaseLayout;
 * `about` merujuk node Service (…#service) yang dirakit route di graph yang sama.
 */
export function articleSchema(opts: {
  base: string;
  path: string; // mis. "/artikel/apa-itu-slo/"
  title: string;
  description: string;
  image?: string;
  pubDate: Date;
  updatedDate: Date;
  author?: string;
  articleSection?: string;
  /** URL halaman layanan terkait (tanpa sufiks @id). */
  about?: { url: string };
}) {
  const b = root(opts.base);
  const url = `${b}${opts.path}`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: opts.title,
    description: opts.description,
    image: abs(opts.base, opts.image ?? '/images/logo-jasa-slo.svg'),
    datePublished: iso(opts.pubDate),
    dateModified: iso(opts.updatedDate),
    author: { '@type': 'Organization', name: opts.author ?? 'Redaksi' },
    publisher: { '@id': `${b}/#organization` },
    mainEntityOfPage: { '@id': `${url}#webpage` },
    ...(opts.articleSection ? { articleSection: opts.articleSection } : {}),
    ...(opts.about ? { about: { '@id': `${opts.about.url}#service` } } : {}),
    inLanguage: 'id',
  };
}

/**
 * WebPage — dirakit BaseLayout untuk SEMUA halaman (satu node per URL).
 * @id memakai sufiks `#webpage` agar dirujuk Article.mainEntityOfPage;
 * `mainEntity` dirujuk ke tipe utama halaman bila diberikan.
 */
export function webPageSchema(opts: {
  base: string;
  url: string; // URL kanonik absolut halaman
  title: string;
  description: string;
  datePublished?: Date;
  dateModified?: Date;
  mainEntityId?: string;
}) {
  const b = root(opts.base);
  return {
    '@type': 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'id',
    isPartOf: { '@id': `${b}/#website` },
    about: { '@id': `${b}/#organization` },
    ...(opts.datePublished ? { datePublished: iso(opts.datePublished) } : {}),
    ...(opts.dateModified ? { dateModified: iso(opts.dateModified) } : {}),
    ...(opts.mainEntityId ? { mainEntity: { '@id': opts.mainEntityId } } : {}),
  };
}

/**
 * CollectionPage — halaman indeks `/artikel/`, `/panduan/`, `/layanan/`.
 * ItemList dirakit terpisah lewat itemListSchema (node top-level agar
 * terdeteksi validator) lalu dirujuk di sini lewat mainEntity.
 */
export function collectionPageSchema(opts: {
  base: string;
  path: string;
  title: string;
  description: string;
  hasItems?: boolean;
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'CollectionPage',
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'id',
    isPartOf: { '@id': `${root(opts.base)}/#website` },
    ...(opts.hasItems ? { mainEntity: { '@id': `${url}#itemlist` } } : {}),
  };
}

/** ItemList — daftar entri halaman indeks atau artikel terkait (node top-level). */
export function itemListSchema(opts: {
  base: string;
  path: string;
  name?: string;
  items: { name: string; url: string }[];
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'ItemList',
    '@id': `${url}#itemlist`,
    ...(opts.name ? { name: opts.name } : {}),
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** Ambil item blok `faq` pertama dari daftar blok konten (bila ada). */
export function faqFromBlocks(blocks: unknown): { question: string; answer: string }[] {
  if (!Array.isArray(blocks)) return [];
  const faq = (
    blocks as { component?: string; items?: { question?: unknown; answer?: unknown }[] }[]
  ).find((block) => block?.component === 'faq');
  if (!Array.isArray(faq?.items)) return [];
  return faq.items
    .filter(
      (item): item is { question: string; answer: string } =>
        typeof item?.question === 'string' &&
        item.question.length > 0 &&
        typeof item?.answer === 'string' &&
        item.answer.length > 0,
    )
    .map((item) => ({ question: item.question, answer: item.answer }));
}

/** FAQPage — dari blok `faq` pada halaman panduan/layanan/statik. */
export function faqPageSchema(opts: {
  base: string;
  path: string;
  items: { question: string; answer: string }[];
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: opts.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

const breadcrumbLabels: Record<string, string> = {
  layanan: 'Layanan',
  panduan: 'Panduan',
  artikel: 'Artikel',
  'tentang-kami': 'Tentang Kami',
  kontak: 'Kontak',
  'kebijakan-privasi': 'Kebijakan Privasi',
  'syarat-ketentuan': 'Syarat & Ketentuan',
};

/**
 * BreadcrumbList — dirakit BaseLayout dari pathname; butir terakhir
 * memakai judul halaman bila tersedia (Beranda > kategori > judul).
 */
export function breadcrumbSchema(base: string, pathname: string, title?: string) {
  const b = root(base);
  const segments = pathname.split('/').filter(Boolean);
  const elements = segments.map((segment, i) => {
    const isLast = i === segments.length - 1;
    const fallback =
      breadcrumbLabels[segment] ??
      segment.replace(/-/g, ' ').replace(/\b\p{L}/gu, (c) => c.toUpperCase());
    return {
      '@type': 'ListItem',
      position: i + 2,
      name: isLast && title ? title : fallback,
      item: `${b}/${segments.slice(0, i + 1).join('/')}/`,
    };
  });
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: `${b}/` },
      ...elements,
    ],
  };
}
