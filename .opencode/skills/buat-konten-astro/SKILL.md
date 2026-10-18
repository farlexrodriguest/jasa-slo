---
name: buat-konten-astro
description: Gunakan saat membuat atau menambah konten baru (artikel atau panduan) di koleksi konten Astro (src/content/). Pemicu meliputi "buat artikel", "tambah artikel baru", "buat panduan", "tambah konten", "tulis artikel tentang", "tulis panduan tentang", atau setiap permintaan menambah berkas konten Markdown di src/content/.
---

# Skill: buat-konten-astro

Skill ini memandu proses pembuatan dan penambahan konten baru (Artikel atau Panduan) pada proyek Astro ini sesuai standar kualitas, aturan SEO, dan 7 lapis gerbang validasi repo (`npm run validate`).

---

## 1. Klasifikasi Jenis Konten

Sebelum membuat berkas, tentukan jenis kontennya:

- **Artikel (`articles`)** — `src/content/articles/<slug>.md`
  - Konten penjelas konsep, definisi, standar, atau regulasi ringkas (mis. *"Apa itu SLO?"*, *"Siapa yang Berwenang Menerbitkan SLO?"*).
  - Body Markdown **wajib kosong**; seluruh isi disusun di `blocks`.
  - Gambar ditaruh di `public/images/artikel/<slug>.webp` (dan `.svg` sumber).

- **Panduan (`pages` dengan `section: panduan`)** — `src/content/pages/<slug>.md`
  - Konten alur, tahapan, persyaratan, atau panduan pelaksanaan regulasi/proses (mis. *"Persiapan Pengujian Trafo"*, *"Panduan Lengkap Pengurusan SLO"*).
  - Body Markdown diizinkan (rute merender `<Content />` setelah `blocks`).
  - Gambar ditaruh di `public/images/panduan/<slug>.webp` (dan `.svg` sumber).

---

## 2. Aturan Frontmatter & Field Wajib

 Set berkas `.md` dibuka baris pertama dengan `---` dan ditutup **tepat satu kali**. Dilarang keras menambah `---` di dalam frontmatter.

### Tabel Spesifikasi Field

| Field | Tipe | Aturan |
| --- | --- | --- |
| `id` | Integer | Positif, unik per koleksi. Naik +1 dari ID tertinggi koleksi tersebut. |
| `ulid` | String | Exactly 26 karakter Crockford `^[0-7][0-9A-HJKMNP-TV-Z]{25}$`. **Unik lintas semua koleksi**. |
| `type` | String | `"article"` (untuk artikel) atau `"page"` (untuk panduan). |
| `slug` | String | Kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). Nama berkas `.md` **wajib sama** dengan slug. |
| `title` | String | Judul konten. |
| `description` | String | Ringkasan 1–2 kalimat untuk meta, kartu, dan JSON-LD. |
| `pubDate` | UTC ISO | Tanggal terbit: `YYYY-MM-DDTHH:mm:ssZ` (tanpa ms, bukan `T00:00:00Z`). **Unik global**. |
| `updatedDate` | UTC ISO | Tanggal pembaruan: `YYYY-MM-DDTHH:mm:ssZ`. **Unik global** & `updatedDate > pubDate`. |
| `draft` | Boolean | `false` untuk terbit. |
| `category` | String | Kategori (mis. `Regulasi`, `Pengetahuan`, `Standar`, `SLO`, `NIDI`). Khusus `articles`. |
| `tags` | Array | Array kata kunci pendek (mis. `['slo', 'regulasi']`). Khusus `articles`. |
| `author` | String | `"Redaksi"` (khusus `articles`). |
| `section` | String | `"panduan"` (khusus `pages` jenis panduan). |
| `order` | Integer | Urutan tampilan (khusus `pages`). |
| `showCta` | Boolean | `true` (khusus `pages`). |
| `canonical` | String | Path kanonik, mis. `"/panduan/<slug>/"` (khusus `pages`). |
| `image` | String | Path gambar, mis. `"/images/artikel/<slug>.webp"` atau `"/images/panduan/<slug>.webp"`. **Wajib unik & berkas fisik harus ada di `public/`**. |
| `imageAlt` | String | Deskripsi teks alternatif gambar. **Wajib ada jika `image` diisi**. |
| `relatedType` | String | `"service"` (atau `"article"` / `"page"`). Wajib berpasangan dengan `relatedId`. |
| `relatedId` | Integer | ID target relasi yang benar-benar ada di koleksi target (mis. Service ID 101–106). |
| `relatedArticles`| Array | Array ID artikel terkait, mis. `[1, 4]` (khusus `articles`). |
| `blocks` | Array | Array blok konten yang valid (lihat daftar komponen di `src/components/blocks.ts`). |

---

## 3. Aturan Aset Gambar (WAJIB Unik & Auto-Generate)

1. **Dilarang berbagi gambar**: Setiap halaman wajib memiliki file gambar unik.
2. **Spesifikasi Ilustrasi SVG**:
   - `viewBox="0 0 1200 760"` (rasio 1200x760).
   - Palet warna brand: Espresso `#2a1a0e`, Moka Pekat `#583520`, Cokelat `#76543c`, Cream `#fef3e2`, Aksen Oranye `#d4621a` & `#f4ae52`.
   - Pola elemen: Background gradient + pola grid + elemen geometris (lingkaran, segel, dokumen, petir, atau trafo/panel) + sudut bingkai L.
3. **Penyimpanan**:
   - Artikel → `public/images/artikel/<slug>.svg` & `.webp`
   - Panduan → `public/images/panduan/<slug>.svg` & `.webp`
4. **Prosedur Render ke WebP (pakai `sharp`)**:
   Tulis file SVG terlebih dahulu, lalu jalankan snippet Node.js berikut di terminal:
   ```bash
   node -e "
   const sharp = require('sharp');
   sharp('public/images/<jenis>/<slug>.svg', { density: 96 })
     .resize(1200, 760)
     .webp({ quality: 82 })
     .toFile('public/images/<jenis>/<slug>.webp')
     .then(info => console.log('WebP Generated:', info.width + 'x' + info.height, info.size + 'B'));
   "
   ```

---

## 4. Penyusunan Blok Konten (`blocks`)

Gunakan hanya komponen yang terdaftar di `src/components/blocks.ts`:
- `section`: Blok utama teks paragraf (`type: "p"`) dan/atau daftar (`type: "list"`).
- `note`: Catatan/peringatan (`variant: "info" | "warning" | "danger" | "success"`).
- `source-links`: Tautan rujukan/sumber resmi.
- **Catatan**: Artikel tidak menggunakan blok `faq`. Blok `faq` hanya untuk panduan/layanan/tentang-kami jika diperlukan.

---

## 5. Langkah Kerja Pembuatan Konten

1. **Riset & Perencanaan**:
   - Tentukan jenis (Artikel / Panduan), judul, dan slug.
   - Cek ID, ULID, dan timestamp terbaru di repo agar tidak terjadi bentrokan.
2. **Buat Gambar Unik**:
   - Buat SVG di `public/images/<jenis>/<slug>.svg` dengan tema warna brand (espresso `#2a1a0e`, cream `#fef3e2`, aksen `#d4621a` / `#f4ae52`).
   - Render ke `.webp` memakai `sharp` atau Node.js script.
3. **Tulis Berkas Markdown**:
   - Tulis `src/content/<koleksi>/<slug>.md` dengan frontmatter lengkap & valid.
4. **Jalankan Gerbang Validasi**:
   - Jalankan `npm run validate` di terminal.
   - Pastikan **ketujuh lapis lulus**: `validate:content` → `validate:frontmatter` → `validate:dates` → `typecheck` → `build` → `validate:output` → `validate:img-alt`.
5. **Verifikasi Build & Render**:
   - Pastikan halaman baru ter-build di `dist/` dan JSON-LD ter-generate lengkap dengan `@context`.
