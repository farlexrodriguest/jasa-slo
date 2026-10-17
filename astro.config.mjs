// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/alur-dan-persyaratan/': '/panduan/alur-dan-persyaratan/',
    '/edukasi/': '/artikel/',
    '/edukasi/[slug]/': '/artikel/[slug]/',
    '/articles/': '/artikel/',
    '/articles/[slug]/': '/artikel/[slug]/',
  },
  vite: {
    plugins: [tailwindcss()]
  }
});