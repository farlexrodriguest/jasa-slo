#!/usr/bin/env node
// Validasi pubDate/updatedDate untuk seluruh berkas konten (termasuk draft).
// Aturan:
//   1. Format wajib UTC tanpa milisekon: YYYY-MM-DDTHH:mm:ssZ.
//   2. updatedDate tidak boleh lebih awal dari pubDate.
//   3. updatedDate tidak boleh sama dengan pubDate.
//   4. Setiap nilai pubDate dan updatedDate harus unik secara global lintas
//      koleksi — dua konten tidak mungkin disubmit pada detik yang sama.
// Draft ikut diperiksa supaya masalah tertangkap sebelum diterbitkan.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// `join()`/`relative()` hanya menerima string, jadi URL harus diubah dulu.
const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const errors = [];
const records = [];

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp('^' + key + ':\\s*(.*?)\\s*$', 'm'));
  if (!match) return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

for (const collection of collections) {
  for (const path of await markdownFiles(join(root, collection))) {
    const source = await readFile(path, 'utf8');
    const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    const file = relative(process.cwd(), path);
    if (!match) { errors.push(file + ': frontmatter YAML tidak ditemukan'); continue; }

    const frontmatter = match[1];
    const pubDate = scalar(frontmatter, 'pubDate');
    const updatedDate = scalar(frontmatter, 'updatedDate');

    for (const [label, value] of [['pubDate', pubDate], ['updatedDate', updatedDate]]) {
      if (value === undefined) errors.push(file + ': ' + label + ' tidak ditemukan');
      else if (!timestampPattern.test(value))
        errors.push(file + ': ' + label + ' harus UTC tanpa milisekon (YYYY-MM-DDTHH:mm:ssZ), ditemukan "' + value + '"');
    }

    if (pubDate && updatedDate) {
      if (updatedDate < pubDate)
        errors.push(file + ': updatedDate (' + updatedDate + ') tidak boleh lebih awal dari pubDate (' + pubDate + ')');
      else if (updatedDate === pubDate)
        errors.push(file + ': updatedDate tidak boleh sama dengan pubDate (' + pubDate + ')');
    }

    records.push({ file, pubDate, updatedDate });
  }
}

const seenTimestamps = new Map();
for (const record of records) {
  for (const label of ['pubDate', 'updatedDate']) {
    const value = record[label];
    if (!value) continue;
    const previous = seenTimestamps.get(value);
    if (previous) {
      errors.push(value + ': ' + label + ' ' + record.file + ' duplikat dengan ' + previous.label + ' ' + previous.file);
    } else {
      seenTimestamps.set(value, { file: record.file, label });
    }
  }
}

if (errors.length) {
  console.error('Validasi tanggal konten gagal:\n' + errors.map((error) => ' - ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Validasi tanggal konten berhasil (' + records.length +
    ' dokumen memakai timestamp UTC tanpa milisekon dan unik).');
}
