#!/usr/bin/env node
// Memastikan setiap dokumen terbit benar-benar merender isinya pada hasil build.
// Kasus yang dicegah: `blocks` ada di frontmatter tetapi tidak muncul di halaman
// (mis. karena perubahan layout/blok), sehingga halaman terbit tanpa isi.
//
// Peta rute dist mengikuti src/pages:
//   articles  -> /artikel/<slug>/
//   services  -> /layanan/<slug>/
//   pages     -> section "panduan" ? /panduan/<slug>/ : (slug "home" ? / : /<slug>/)
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const distRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const renderedBody = { articles: false, pages: true, services: false };
const errors = [];
let checked = 0;
let skipped = 0;

try {
  await stat(distRoot);
} catch {
  console.error('Pemeriksaan isi hasil build gagal: direktori "dist" tidak ada. Jalankan build terlebih dahulu.');
  process.exit(1);
}

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

const unquote = (value) => {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
};

const scalars = (frontmatter) => {
  const value = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([a-zA-Z]+):\s*(.*?)\s*$/);
    if (match) value[match[1]] = unquote(match[2]);
  }
  return value;
};

const markers = (frontmatter, pattern) => {
  const found = [];
  for (const match of frontmatter.matchAll(pattern)) {
    const value = unquote(match[1]);
    if (value && !found.includes(value)) found.push(value);
  }
  return found;
};

const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');

function outputFile(collection, data) {
  if (collection === 'articles') return join(distRoot, 'artikel', data.slug, 'index.html');
  if (collection === 'services') return join(distRoot, 'layanan', data.slug, 'index.html');
  if (data.slug === 'home') return join(distRoot, 'index.html');
  if (data.section === 'panduan') return join(distRoot, 'panduan', data.slug, 'index.html');
  return join(distRoot, data.slug, 'index.html');
}

for (const collection of collections) {
  for (const file of await markdownFiles(join(root, collection))) {
    const label = relative(process.cwd(), file).split(sep).join('/');
    const frontmatter = (await readFile(file, 'utf8')).match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const data = scalars(frontmatter);

    if (data.draft === 'true') {
      skipped++;
      continue;
    }

    if (collection === 'pages' && data.section && data.section !== 'panduan') {
      errors.push(label + ': section "' + data.section + '" tidak ditangani rute mana pun, halaman tidak akan pernah dibangun');
      continue;
    }

    const target = outputFile(collection, data);
    const targetLabel = relative(process.cwd(), target).split(sep).join('/');

    let html;
    try {
      html = await readFile(target, 'utf8');
    } catch {
      errors.push(label + ': halaman terbit tidak ditemukan di "' + targetLabel + '"');
      continue;
    }

    checked++;
    const text = visibleText(html);
    const headings = markers(frontmatter, /^\s+(?:heading|title):\s*(.+?)\s*$/gm);
    const paragraphs = markers(frontmatter, /^\s+text:\s*(.+?)\s*$/gm);
    const expected = headings.length > 0 ? headings : paragraphs;

    if (expected.length === 0 && !renderedBody[collection]) {
      errors.push(label + ': tidak ada penanda isi (heading/title/teks paragraf) di frontmatter blocks; periksa struktur frontmatter');
      continue;
    }

    const missing = expected.filter((marker) => !text.includes(marker));
    if (missing.length > 0) {
      const kind = headings.length > 0 ? 'heading/title blok' : 'teks paragraf blok';
      errors.push(
        label + ': ' + missing.length + ' dari ' + expected.length + ' ' + kind + ' tidak muncul di ' + targetLabel + ', ' +
        'mis. ' + missing.slice(0, 3).map((item) => '"' + item + '"').join(', ') +
        '. Dokumen terbit tanpa seluruh isinya',
      );
    }
  }
}

if (errors.length) {
  console.error('Pemeriksaan isi hasil build gagal: ' + errors.length + ' masalah dari ' + checked + ' dokumen terbit.\n');
  console.error(errors.map((error) => ' - ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    'Pemeriksaan isi hasil build berhasil (' + checked + ' dokumen terbit' +
    (skipped > 0 ? ', ' + skipped + ' draft dilewati' : '') + ').',
  );
}
