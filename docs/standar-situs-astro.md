# Blueprint Arsitektur Situs Astro (`jasa-slo`)

Dokumen ini adalah standar operasional final untuk membangun atau mengembangkan situs dengan arsitektur **Frontmatter-only** dan **Block-based**. Jangan menyimpang dari aturan ini untuk menjaga integritas gerbang validasi.

## 1. Filosofi Konten: "Data as Content"
Situs ini tidak menggunakan body Markdown untuk menyimpan informasi utama.
- **Koleksi `articles` & `services`**: Wajib memiliki body kosong. Seluruh konten harus berada di dalam field `blocks` di frontmatter.
- **Koleksi `pages`**: Diizinkan memiliki body Markdown (dirender lewat `<Content />`) hanya setelah seluruh `blocks` di frontmatter selesai dirender.
- **Registry Blok**: Semua komponen konten wajib didaftarkan di `src/components/blocks.ts` dan dirender melalui dispatcher `src/components/blocks/BlockRenderer.astro`.

## 2. Struktur Data & Konfigurasi Global
Dilarang menulis teks literal (hardcoded string) di dalam komponen.
- **`src/config/site.ts`**: Sumber tunggal data bisnis (Telepon, Alamat Terstruktur, Identitas Legal). Digunakan oleh UI dan JSON-LD secara bersamaan.
- **`src/config/ui.ts`**: Sumber tunggal label antarmuka (mis. "Baca artikel", "Diperbarui", "Estimasi baca").
- **`src/config/navigation.ts`**: Struktur tunggal untuk menu header, footer, dan tombol CTA global.

## 3. SEO & JSON-LD Graph (Deteksi Maksimal)
Situs menggunakan sistem graph yang saling terhubung untuk validasi Google tanpa error/warning.
- **Injeksi @context**: Dilakukan secara sentral oleh `src/components/seo/JsonLd.astro`. Satu node menghasilkan objek, banyak node menghasilkan `@graph`.
- **Node Wajib (Sitewide)**: `BaseLayout.astro` wajib memancarkan `Organization`, `WebSite`, `WebPage`, dan `BreadcrumbList` pada setiap halaman.
- **Koneksi @id**: Setiap node wajib memiliki `@id` unik (mis. `#organization`, `#webpage`, `#article`) untuk memungkinkan referensi silang antar node (mis. `Article.publisher` merujuk ke `#organization`).

## 4. Keamanan Tipe (Schema & Validation)
- **Skema Zod**: Blok konten wajib didefinisikan menggunakan `z.discriminatedUnion('component', [...])` di `src/content.config.ts` untuk menjamin integritas struktur frontmatter.
- **Identitas Unik**: Setiap entri wajib memiliki `id` (integer urut per koleksi) dan `ulid` (26 karakter unik global).
- **Gerbang 7 Lapis (`npm run validate`)**: Wajib lulus seluruh pemeriksaan sebelum push:
  1. `content`: Cek fisik gambar, keunikan ID/Slug/ULID, dan relasi.
  2. `frontmatter`: Cek integritas delimiter YAML.
  3. `dates`: Cek keunikan global timestamp UTC ISO.
  4. `typecheck`: `astro sync && tsc --noEmit`.
  5. `build`: Verifikasi render statis.
  6. `output`: Memastikan seluruh heading blok ter-render di HTML.
  7. `img-alt`: Verifikasi atribut alt pada seluruh gambar hasil build.

## 5. Standar Aset Gambar
- **Keunikan Mutlak**: Dilarang keras menggunakan satu file gambar untuk dua halaman berbeda. Setiap halaman wajib memiliki gambar unik.
- **Alur Kerja**: SVG (Sumber) -> Render WebP (Produksi) via `sharp` (1200x760, kualitas 82).
- **Lokasi**: Folder terpisah berdasarkan jenis konten (`/images/artikel/` atau `/images/panduan/`).

## 6. Standar Timestamp
- **Format**: UTC ISO tanpa milisekon (`YYYY-MM-DDTHH:mm:ssZ`).
- **Unik Global**: Tidak boleh ada dua timestamp yang sama (termasuk detik) di seluruh repositori lintas koleksi.
- **Logika**: `updatedDate` wajib lebih besar dari `pubDate` dan wajib diperbarui hanya jika isi blok konten berubah secara substansial.
