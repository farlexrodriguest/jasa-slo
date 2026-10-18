// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jasa-slo.com',
  integrations: [sitemap()],
  redirects: {
    '/alur-dan-persyaratan/': '/panduan/alur-dan-persyaratan/',
    '/edukasi/': '/artikel/',
    '/articles/': '/artikel/',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});