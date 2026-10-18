#!/usr/bin/env node
// Pemeriksaan lintas berkas; validasi tipe frontmatter tetap dilakukan oleh Astro/Zod saat build.
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const errors = [];
const records = new Map();
const allUlids = new Map();
const allImages = new Map();

// Regex validasi format
const ULID_REGEX = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function markdownFiles(dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...await markdownFiles(path));
      else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
    }
  } catch (e) { /* ignore missing dirs */ }
  return files;
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp('^' + key + ':\\s*(.*?)\\s*$', 'm'));
  if (!match) return undefined;
  const value = match[1].trim();
  return value.replace(/^["']|["']$/g, '');
}

// Ekstrak array ID (untuk relatedArticles)
function arrayIds(frontmatter, key) {
  const match = frontmatter.match(new RegExp('^' + key + ':\\s*\\[(.*?)\\]', 'm'));
  if (!match) return [];
  return match[1].split(',').map(s => s.trim()).filter(Boolean).map(Number);
}

// 1. Parsing Tahap Awal (Integritas Dasar & Gambar)
for (const collection of collections) {
  const dir = join(root, collection);
  const items = [];
  const seenId = new Map();
  const seenSlug = new Map();
  
  const files = await markdownFiles(dir);
  for (const path of files) {
    const source = await readFile(path, 'utf8');
    const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    const file = relative(process.cwd(), path).replace(/\\/g, '/');
    if (!match) { errors.push(file + ': frontmatter YAML tidak ditemukan'); continue; }
    
    const frontmatter = match[1];
    const id = Number(scalar(frontmatter, 'id'));
    const slug = scalar(frontmatter, 'slug');
    const ulid = scalar(frontmatter, 'ulid');
    const image = scalar(frontmatter, 'image');
    const imageAlt = scalar(frontmatter, 'imageAlt');
    const section = scalar(frontmatter, 'section');
    const relatedType = scalar(frontmatter, 'relatedType');
    const relatedId = scalar(frontmatter, 'relatedId') ? Number(scalar(frontmatter, 'relatedId')) : undefined;
    const relatedArticles = arrayIds(frontmatter, 'relatedArticles');

    // Validasi ID & Slug
    if (isNaN(id)) errors.push(file + ': field "id" wajib berupa integer');
    if (!slug) errors.push(file + ': field "slug" wajib diisi');
    else if (!SLUG_REGEX.test(slug)) errors.push(file + ': format slug "' + slug + '" tidak valid (wajib kebab-case)');

    for (const [label, value, seen] of [['id', id, seenId], ['slug', slug, seenSlug]]) {
      if (value === undefined || (label === 'id' && isNaN(value))) continue;
      if (seen.has(value)) errors.push(file + ': duplikasi ' + label + ' ' + value + ' dengan ' + seen.get(value));
      else seen.set(value, file);
    }

    // Validasi ULID
    if (!ulid) errors.push(file + ': wajib memiliki field "ulid"');
    else if (!ULID_REGEX.test(ulid)) errors.push(file + ': format ULID "' + ulid + '" tidak valid');
    
    if (ulid && allUlids.has(ulid)) errors.push(file + ': ULID duplikat dengan ' + allUlids.get(ulid));
    else if (ulid) allUlids.set(ulid, file);

    // Validasi Gambar (Keunikan & Fisik)
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

    items.push({ file, id, slug, relatedType, relatedId, relatedArticles });
  }
  records.set(collection, items);
}

// 2. Parsing Tahap Lanjut (Relasi Antar Koleksi)
const articleIds = new Set(records.get('articles').map(a => a.id));

for (const [collection, items] of records) {
  for (const item of items) {
    // Validasi relatedType/relatedId berpasangan
    if ((item.relatedType === undefined) !== (item.relatedId === undefined)) {
      errors.push(item.file + ': relatedType dan relatedId harus ditulis berpasangan');
    }

    // Validasi target relasi service/page/article
    if (item.relatedType && item.relatedId !== undefined) {
      const targetCol = { service: 'services', page: 'pages', article: 'articles' }[item.relatedType];
      if (!targetCol) {
        errors.push(item.file + ': relatedType "' + item.relatedType + '" tidak valid');
      } else {
        const exists = records.get(targetCol).some(row => row.id === item.relatedId);
        if (!exists) errors.push(item.file + ': relasi tidak ditemukan: ' + item.relatedType + ' #' + item.relatedId);
      }
    }

    // Validasi relatedArticles (OTOMASI BARU)
    if (item.relatedArticles.length > 0) {
      for (const refId of item.relatedArticles) {
        if (!articleIds.has(refId)) {
          errors.push(item.file + ': relatedArticles merujuk ke ID artikel yang tidak ada: #' + refId);
        }
        if (refId === item.id) {
          errors.push(item.file + ': relatedArticles tidak boleh merujuk ke ID sendiri: #' + refId);
        }
      }
    }
  }
}

if (errors.length) {
  console.error('Validasi konten gagal (SWE Quality Gate):\n' + errors.map(e => ' - ' + e).join('\n'));
  process.exit(1);
} else {
  console.log('Validasi SWE Berhasil: ' + 
    [...records.values()].reduce((sum, items) => sum + items.length, 0) + ' dokumen, ' +
    allUlids.size + ' ULID valid, ' + 
    allImages.size + ' gambar unik terverifikasi.');
}
