#!/usr/bin/env node
// Pemeriksaan lintas berkas; validasi tipe frontmatter tetap dilakukan oleh Astro/Zod saat build.
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// `join()`/`relative()` hanya menerima string, jadi URL harus diubah dulu.
const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const errors = [];
const records = new Map();
const allUlids = new Map();
const allImages = new Map();

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

// Hanya membaca metadata skalar tingkat atas; struktur YAML lengkap divalidasi Astro/Zod.
function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp('^' + key + ':\\s*(.*?)\\s*$', 'm'));
  if (!match) return undefined;
  const value = match[1].trim();
  return value.replace(/^["']|["']$/g, '');
}

for (const collection of collections) {
  const dir = join(root, collection);
  const items = [];
  const seenId = new Map();
  const seenSlug = new Map();
  for (const path of await markdownFiles(dir)) {
    const source = await readFile(path, 'utf8');
    const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    const file = relative(process.cwd(), path).replace(/\\/g, '/');
    if (!match) { errors.push(file + ': frontmatter YAML tidak ditemukan'); continue; }
    const frontmatter = match[1];
    const id = Number(scalar(frontmatter, 'id'));
    const slug = scalar(frontmatter, 'slug');
    const ulid = scalar(frontmatter, 'ulid');
    const relatedType = scalar(frontmatter, 'relatedType');
    const relatedIdRaw = scalar(frontmatter, 'relatedId');
    const relatedId = relatedIdRaw === undefined ? undefined : Number(relatedIdRaw);
    const image = scalar(frontmatter, 'image');
    const imageAlt = scalar(frontmatter, 'imageAlt');
    const section = scalar(frontmatter, 'section');

    for (const [label, value, seen] of [['id', id, seenId], ['slug', slug, seenSlug]]) {
      if (value === undefined || (label === 'id' && !Number.isInteger(value))) continue;
      if (seen.has(value)) errors.push(file + ': duplikasi ' + label + ' ' + value + ' dengan ' + seen.get(value));
      else seen.set(value, file);
    }

    // Validasi kewajiban, ketersediaan fisik, dan keunikan gambar
    const isImageMandatory = collection === 'articles' || collection === 'services' || (collection === 'pages' && section === 'panduan');
    if (isImageMandatory) {
      if (!image) errors.push(file + ': wajib memiliki field "image"');
      if (!imageAlt) errors.push(file + ': wajib memiliki field "imageAlt"');
    }

    if (image) {
      const cleanPath = image.startsWith('/') ? image.slice(1) : image;
      const physicalPath = join(process.cwd(), 'public', cleanPath);
      if (!existsSync(physicalPath)) {
        errors.push(file + ': berkas gambar ' + image + ' tidak ditemukan di public/');
      }
      if (allImages.has(image)) {
        errors.push(file + ': gambar ' + image + ' duplikat dengan ' + allImages.get(image));
      } else {
        allImages.set(image, file);
      }
    }

    items.push({ file, id, slug, ulid, relatedType, relatedId });
  }
  records.set(collection, items);
}

for (const [collection, items] of records) {
  for (const item of items) {
    if (item.ulid) {
      if (allUlids.has(item.ulid)) errors.push(item.file + ': ULID duplikat dengan ' + allUlids.get(item.ulid));
      else allUlids.set(item.ulid, item.file);
    }
    if (collection === 'articles' || collection === 'pages') {
      if ((item.relatedType === undefined) !== (item.relatedId === undefined))
        errors.push(item.file + ': relatedType dan relatedId harus ditulis berpasangan');
      if (item.relatedType && item.relatedId !== undefined) {
        const target = { service: 'services', page: 'pages', article: 'articles' }[item.relatedType];
        if (!target || !records.get(target).some(row => row.id === item.relatedId))
          errors.push(item.file + ': relasi tidak ditemukan: ' + item.relatedType + ' #' + item.relatedId);
      }
    }
  }
}

if (errors.length) {
  console.error('Validasi konten gagal:\n' + errors.map(e => ' - ' + e).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Validasi metadata & gambar lintas berkas berhasil (' +
    [...records.values()].reduce((sum, items) => sum + items.length, 0) + ' dokumen, ' +
    allImages.size + ' gambar unik terverifikasi).');
}
