/**
 * Pembangkit skema schema.org (JSON-LD) untuk Jasa SLO.
 *
 * Setiap builder mengembalikan objek JSON-LD mentah; render lewat
 * komponen `src/components/seo/JsonLd.astro`. Parameter `base` adalah
 * origin absolut tanpa garis miring (mis. "https://jasa-slo.com");
 * di route ambil dari `Astro.site?.href ?? Astro.url.origin`.
 */
import { site } from '../config/site';

const root = (base: string) => base.replace(/\/+$/, '');
const abs = (base: string, path: string) => new URL(path, root(base) + '/').href;

/** Organisasi/badan usaha — referensi @id dipakai sebagai provider/publisher. */
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

/** WebSite — untuk halaman beranda. */
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
 * Service — halaman `/layanan/<slug>/`.
 * `serviceType` diisi dari `serviceGroup` koleksi services.
 */
export function serviceSchema(opts: {
  base: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  serviceType?: string;
}) {
  const url = `${root(opts.base)}/layanan/${opts.slug}/`;
  return {
    '@type': 'Service',
    '@id': url,
    name: opts.title,
    description: opts.description,
    url,
    ...(opts.image ? { image: abs(opts.base, opts.image) } : {}),
    ...(opts.serviceType ? { serviceType: opts.serviceType } : {}),
    provider: organizationSchema(opts.base),
    areaServed: site.regions,
    inLanguage: 'id',
  };
}

/**
 * Article — halaman `/artikel/<slug>/` dan `/panduan/<slug>/`.
 * Relasi `relatedType: service` / `relatedId` dirakit di route menjadi
 * `about` berupa objek Service (@id + name + url) agar terhubung eksplisit.
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
  about?: { name: string; url: string };
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    image: abs(opts.base, opts.image ?? '/images/logo-jasa-slo.svg'),
    datePublished: opts.pubDate.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    dateModified: opts.updatedDate.toISOString().replace(/\.\d{3}Z$/, 'Z'),
    author: { '@type': 'Organization', name: opts.author ?? 'Redaksi' },
    publisher: organizationSchema(opts.base),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(opts.articleSection ? { articleSection: opts.articleSection } : {}),
    ...(opts.about
      ? {
          about: {
            '@type': 'Service',
            '@id': opts.about.url,
            name: opts.about.name,
            url: opts.about.url,
          },
        }
      : {}),
    inLanguage: 'id',
  };
}

/** WebPage — halaman statis `/tentang-kami/`, `/kontak/`, dst. */
export function webPageSchema(opts: {
  base: string;
  path: string;
  title: string;
  description: string;
  dateModified?: Date;
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: opts.title,
    description: opts.description,
    ...(opts.dateModified
      ? { dateModified: opts.dateModified.toISOString().replace(/\.\d{3}Z$/, 'Z') }
      : {}),
    inLanguage: 'id',
    isPartOf: { '@id': `${root(opts.base)}/#website` },
  };
}

/** CollectionPage — halaman indeks `/artikel/`, `/panduan/`, `/layanan/`. */
export function collectionPageSchema(opts: {
  base: string;
  path: string;
  title: string;
  description: string;
  items: { name: string; url: string }[];
}) {
  const url = `${root(opts.base)}${opts.path}`;
  return {
    '@type': 'CollectionPage',
    '@id': url,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'id',
    isPartOf: { '@id': `${root(opts.base)}/#website` },
    ...(opts.items.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: opts.items.length,
            itemListElement: opts.items.map((item, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }
      : {}),
  };
}
