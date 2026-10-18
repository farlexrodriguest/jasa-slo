# AGENTS.md

Panduan wajib untuk agen/AI yang bekerja di repo ini. Semua perintah dan aturan di
bawah sudah diverifikasi terhadap kondisi repo saat ini.

## Ringkasan proyek

- Situs statis **Astro 7** (Astro 7.4.0) + **Tailwind CSS v4** untuk jasa konsultan
  SLO (bahasa Indonesia). Hasil build di `dist/` (gitignored).
- Konten berada di `src/content/` (Markdown, **seluruh data di frontmatter**) dengan
  schema Zod di `src/content.config.ts`.
- Identitas/ kontak bisnis: `src/config/site.ts`. Label UI bersama: `src/config/ui.ts`.
  Navigasi: `src/config/navigation.ts`.
- ⚠️ `src/config/site.ts` masih berisi **DATA SIMULASI** (nama badan usaha, telepon,
  alamat, NPWP/NIB). Ganti dengan data sebenarnya sebelum situs dipublikasikan.

## Perintah

- `npm run validate` — **gerbang lengkap**, wajib lulus sebelum tugas dianggap selesai.
  Urutan: `validate:content` → `validate:frontmatter` → `typecheck` → `build` → `validate:output` → `validate:img-alt`.
- `npm run build` — hanya `astro build`, tanpa pemeriksaan tambahan.
- `npm run dev` — server pengembangan.
- `npm run preview` — pratinjau hasil build.
- Gunakan **npm** (ada `package-lock.json`); jangan ganti ke pnpm/yarn.
- Node `>=22.22.0` (lihat `engines` di `package.json`).
- Belum ada CI (`.github/workflows`) maupun git hook (`.githooks`), jadi validasi
  harus dijalankan lokal sebelum commit.

Catatan type-check: proyek memakai **TypeScript 7** dengan `tsc --noEmit`. `tsc`
**hanya memeriksa berkas `.ts`**, tidak memeriksa `frontmatter`/`<script>` pada
berkas `.astro`. `tsconfig.json` menyertakan `.astro/types.d.ts` sementara `.astro/`
di-gitignore, karena itu `typecheck` menjalankan `astro sync` lebih dulu. Jangan
mengandalkan type-check untuk kesalahan props/tipe di dalam `.astro`; andalkan
`npm run validate` untuk menangkap kesalahan data.

## Gerbang validasi (6 lapis)

1. **`validate:content`** (`scripts/validate-content.mjs`) — pemeriksaan lintas berkas:
   duplikasi `id` dan `slug` di dalam satu koleksi, **duplikasi `ulid` lintas semua
   koleksi**, serta kelengkapan pasangan `relatedType`/`relatedId` beserta keberadaan
   target relasinya.
2. **`validate:frontmatter`** (`scripts/validate-frontmatter.mjs`) — frontmatter wajib
   dibuka pada baris pertama dan ditutup **tepat satu kali**. Delimiter `---` yang
   berlebih/nyasar ditolak. Body ditolak untuk koleksi `articles` dan `services`
   (rutenya hanya merender `blocks`), tetapi **diizinkan** untuk `pages` (rutenya
   merender `<Content />`).
3. **`typecheck`** — `astro sync && tsc --noEmit`.
4. **`build`** — render seluruh halaman.
5. **`validate:output`** (`scripts/validate-content-output.mjs`) — setiap dokumen
   terbit (draft dilewati) harus benar-benar merender seluruh `heading`/`title`
   bloknya pada rute yang sesuai. Halaman dengan `section` yang tidak ditangani rute
   mana pun juga ditolak.
6. **`validate:img-alt`** (`scripts/validate-image-alt.mjs`) — setiap `<img>` pada
   `dist` wajib punya atribut `alt`, dan `src` tidak boleh kosong atau berisi markup
   (mis. SVG mentah yang merusak HTML dan menyembunyikan atribut setelahnya).
   `alt=""` diizinkan karena itu cara standar (WCAG) menandai gambar dekoratif.

Alasan lapis 2 dan 5 ada: `blocks` pada `src/content.config.ts` diakhiri `.default([])`,
sehingga blok yang hilang/terpotong **tidak** membuat build gagal — halaman hanya
terbit kosong tanpa peringatan. Karena itu jangan mengandalkan Zod untuk hal ini.
Lapis 6 melengkapi: alt yang hilang juga tidak menggagalkan build, hanya hasil render
yang menunjukkan masalahnya.

## Aksesibilitas gambar

- Sumber gambar di `dist` harus berupa URL/path aset (mis. `/images/...svg`), bukan
  markup SVG yang ditempel sebagai string; markup seperti itu merusak HTML.
- `alt=""` hanya untuk gambar dekoratif (mis. di dalam tautan/kartu yang sudah punya
  teks). Gambar bermakna wajib mengisi alt.
- `page-header` menerima `image` **dan** `imageAlt` sebagai opsional (tidak bisa
  dijadikan "wajib berpasangan" karena `contentBlocks` adalah `z.discriminatedUnion`
  dan anggotanya tidak bisa diberi `.refine()`). Jika `image` diisi tanpa `imageAlt`,
  `<img>` akan terbit tanpa `alt` dan **ditolak `validate:img-alt`** — jadi lapis inilah
  yang menjaga pasangan tersebut.
- Blok `card` memakai `body: z.array(z.any())`, sehingga isi kartu (termasuk gambar)
  **melewati schema**. Untuk kasus seperti ini, `validate:img-alt` adalah satu-satunya
  penjaga; jangan mengandalkan Zod.

## Struktur berkas konten (WAJIB)

Seluruh data harus berada **di dalam frontmatter**. Body Markdown hanya dirender pada
rute halaman (`/[slug]` dan `/panduan/[slug]`), tidak pada artikel/layanan.

1. Berkas `.md` wajib dibuka dengan `---` dan memiliki tepat satu delimiter pembuka
   serta satu penutup.
2. Jangan menulis konten di body untuk artikel/layanan. Pindahkan ke `blocks`.
3. Jangan menambahkan baris `---` di dalam frontmatter; delimiter tambahan memotong
   frontmatter dan membuang seluruh `blocks` sehingga artikel terbit tanpa isi.
4. Pastikan setiap `heading`/`title` blok yang ditulis benar-benar muncul di halaman
   hasil build (dijaga oleh `validate:output`).

## Koleksi & field

Semua koleksi memakai `loader: glob` dan berbagi `sharedIdentity`
(`id`, `ulid`, `title`, `description`, `draft`, `image`, `socialImage`).

- `articles` (`src/content/articles/`): `type: article`, `slug`, `pubDate`,
  `updatedDate`, `category`, `tags`, `relatedType`/`relatedId`, `relatedArticles`,
  `blocks`.
- `pages` (`src/content/pages/`): `type: page`, `slug`, `pubDate`, `updatedDate`,
  `eyebrow`, `section` (kebab-case, opsional), `order`, `showCta`, `canonical`,
  `noindex`, `relatedType`/`relatedId`, `blocks`.
- `services` (`src/content/services/`): `type: service`, `slug`, `pubDate`,
  `updatedDate`, `serviceGroup`, `order`, `status`, `eyebrow`, `image`, `imageAlt`,
  `blocks`.

Aturan field:

- `id` bilangan bulat positif dan unik per koleksi; `ulid` harus cocok
  `^[0-7][0-9A-HJKMNP-TV-Z]{25}$` (tepat 26 karakter) dan unik lintas koleksi.
- `slug` wajib kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
- `pubDate`/`updatedDate` bertipe tanggal; schema menolak `updatedDate` sebelum
  `pubDate`. Jangan ubah `pubDate` saat memperbarui konten lama, dan ubah
  `updatedDate` hanya bila konten benar-benar berubah.
- Pasangan `relatedType`/`relatedId` harus lengkap dan targetnya harus ada
  (diperiksa `validate:content`). `relatedArticles` merujuk `id` artikel dan
  dirender oleh `ArticleRelatedList`, tetapi **belum** diperiksa otomatis — pastikan
  id-nya benar secara manual.
- `draft: true` → dokumen tidak dibangun dan tidak diperiksa `validate:output`.
- Nilai blok yang valid ada di `contentBlocks` (`src/content.config.ts`), komponen
  rendernya dipetakan di `src/components/blocks.ts` (28 komponen).

## Peta rute

| Rute | Sumber |
| --- | --- |
| `/` | `pages` dengan `slug: home` |
| `/<slug>/` | `pages` tanpa `section` (selain `home`) |
| `/panduan/<slug>/` | `pages` dengan `section: panduan` |
| `/panduan/`, `/artikel/`, `/layanan/` | halaman indeks |
| `/artikel/<slug>/` | `articles` |
| `/layanan/<slug>/` | `services` |

Redirect di `astro.config.mjs`: `/alur-dan-persyaratan/` → `/panduan/alur-dan-persyaratan/`,
`/edukasi/` → `/artikel/`, `/articles/` → `/artikel/`.

Halaman `pages` dengan `section` **selain** `panduan` tidak dibangun oleh rute mana pun
dan akan ditolak oleh `validate:output`.

## Theme vs data

Konvensi saat ini: data konten di frontmatter; label UI bersama di `src/config/ui.ts`;
identitas bisnis di `src/config/site.ts`; navigasi di `src/config/navigation.ts`.

Repo ini **belum** seketat konsultan-slf: beberapa layout masih memuat teks literal
(mis. `src/components/shared/PageLayout.astro`). Saat menyentuh komponen, jangan
menambah teks literal baru — ambil dari props/frontmatter atau taruh label bersama di
`src/config/ui.ts`. Mengganti teks seharusnya berarti mengubah data, bukan komponen.

## Menambah / mengubah konten

1. Buat/ubah entri `.md` pada koleksi yang tepat dengan frontmatter lengkap
   (`id` dan `ulid` unik).
2. Susun `blocks` memakai komponen yang terdaftar di `src/components/blocks.ts`.
3. Jalankan `npm run validate` dan pastikan kelima lapis lulus.

## Batasan

- Jangan mengubah `slug`, `id`, `ulid`, atau URL tanpa alasan teknis nyata; petakan
  dampaknya ke relasi `relatedType`/`relatedId` dan `relatedArticles`.
- Berkas `.md` di `docs/` dan `README.md` bukan konten terbit — tidak discan loader
  dan tidak divalidasi. Jangan menaruh konten situs di sana.
- Jangan mengklaim pemeriksaan lulus jika belum menjalankannya.
