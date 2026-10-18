#!/usr/bin/env node
// Memastikan struktur frontmatter utuh dan tidak ada data yang jatuh ke body.
// Kasus yang dicegah: delimiter "---" nyasar di tengah frontmatter membuat seluruh
// key (termasuk "blocks") terbaca sebagai body, sehingga halaman terbit tanpa isi.
//
// Catatan rute: /artikel/[slug] dan /layanan/[slug] hanya merender `blocks`,
// sedangkan /[slug] dan /panduan/[slug] juga merender `<Content />`. Karena itu
// body hanya dilarang pada koleksi articles dan services.
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/content/', import.meta.url));
const collections = ['articles', 'pages', 'services'];
const bodyIsRendered = { articles: false, pages: true, services: false };
const keyFrontmatter = /^(?:id|slug|ulid|type|title|description|pubDate|updatedDate|draft|image|socialImage|category|tags|section|order|relatedType|relatedId|relatedArticles|blocks):\s/m;
const errors = [];
let checked = 0;

async function markdownFiles(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

for (const collection of collections) {
  for (const file of await markdownFiles(join(root, collection))) {
    checked++;
    const label = relative(process.cwd(), file).split(sep).join('/');
    const lines = (await readFile(file, 'utf8')).split(/\r?\n/);

    if (lines[0]?.trim() !== '---') {
      errors.push(label + ': baris pertama harus "---" (frontmatter wajib berada di awal berkas)');
      continue;
    }

    const delimiters = [];
    lines.forEach((line, index) => {
      if (/^---\s*$/.test(line)) delimiters.push(index);
    });

    if (delimiters.length < 2) {
      errors.push(label + ': frontmatter tidak ditutup; tambahkan baris "---" penutup');
      continue;
    }

    if (delimiters.length > 2) {
      errors.push(
        label + ': ditemukan ' + delimiters.length + ' baris "---" pada baris ' +
        delimiters.map((index) => index + 1).join(', ') +
        '; frontmatter hanya boleh dibuka dan ditutup sekali. Hapus delimiter berlebih setelah baris ' +
        (delimiters[1] + 1) + ' dan pindahkan isinya ke dalam frontmatter',
      );
      continue;
    }

    const body = lines.slice(delimiters[1] + 1).join('\n').trim();

    if (!body) continue;

    if (bodyIsRendered[collection]) continue;

    const truncated = keyFrontmatter.test(body);
    errors.push(
      label + ': ada konten setelah frontmatter penutup (mulai baris ' + (delimiters[1] + 2) + ')' +
      (truncated
        ? '. Isi tersebut tampak seperti frontmatter yang terpotong (mis. key "blocks:" atau "title:"), sehingga seluruh data blok tidak akan dirender'
        : '. Rute ' + collection + ' tidak merender body Markdown, jadi konten ini tidak akan muncul di situs; pindahkan ke frontmatter atau hapus body'),
    );
  }
}

if (errors.length) {
  console.error('Pemeriksaan integritas frontmatter gagal: ' + errors.length + ' masalah dari ' + checked + ' dokumen.\n');
  console.error(errors.map((error) => ' - ' + error).join('\n'));
  process.exitCode = 1;
} else {
  console.log('Pemeriksaan integritas frontmatter berhasil (' + checked + ' dokumen).');
}
