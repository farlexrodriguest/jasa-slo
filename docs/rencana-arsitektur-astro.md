# Rencana Arsitektur Astro — Jasa SLO

Status: **Disetujui; Siap Implementasi**  
Referensi: https://github.com/skyforgged/konsultan-slf  
Target: repository `farlexrodriguest/jasa-slo`

## Tujuan dan prinsip

Menggunakan pola arsitektur Astro dari `konsultan-slf`. Struktur website (halaman dan navigasi) mengikuti `docs/struktur-website-slo.md`. Utamakan situs statis, performa, SEO, konten yang mudah dirawat, serta validasi otomatis.

## Dasar yang dipertahankan dari referensi

- Astro + TypeScript, static build, Markdown dan Astro Content Collections.
- Skema Zod untuk `articles`, `pages`, dan `services`.
- Blok konten terstruktur (FAQ, CTA, tabel, langkah, checklist, gambar, dan sebagainya) dengan renderer yang dapat digunakan ulang.
- Identitas konten stabil (ID dan ULID) serta relasi konten.
- Pemeriksaan build: `astro check`, internal link, SEO output, published content; canonical, metadata sosial, sitemap, robots, dan structured data.
- Konfigurasi URL produksi yang eksplisit; jangan membiarkan domain placeholder masuk ke build produksi.

Temuan tersebut didasarkan pada pemeriksaan `README.md`, `package.json`, `astro.config.mjs`, dan `src/content.config.ts` referensi pada 17 Oktober 2026. Belum merupakan audit menyeluruh atas seluruh direktori.

## Penyesuaian dan peningkatan

1. **Modularisasi schema (prioritas tinggi).** Pisahkan skema bersama, SEO, blok konten, dan koleksi. `src/content.config.ts` menjadi titik registrasi ringkas. Hindari membuat satu berkas raksasa.
2. **Standarisasi metadata SEO (tinggi).** Gunakan skema bersama untuk judul SEO, deskripsi, canonical, noindex, social image, dan aturan metadata per jenis konten. Pastikan nilai default dan override jelas.
3. **Integritas relasi konten (tinggi).** Validasi keunikan slug/ID/ULID, referensi artikel-layanan-halaman, dan larangan tautan ke draft/nonaktif bila tidak disengaja. Gunakan validasi lintas-koleksi di script terpisah jika Zod per-entry tidak cukup.
4. **Penyederhanaan blok (sedang).** Audit komponen tumpang tindih seperti `stats`/`stats-grid` dan `table`/`comparison-table`. Gabungkan hanya bila perilakunya memang sama; pertahankan variasi yang memiliki fungsi berbeda.
5. **Konfigurasi bisnis terpusat (sedang).** Nama usaha, kontak/WhatsApp, alamat, jam layanan, sosial, navigasi, CTA default, dan identitas SEO tidak diulang dalam banyak berkas.
6. **Kualitas dan CI (sedang).** Jalankan typecheck, build, validasi tautan, SEO, dan konten di pull request. Tambahkan pengujian unit untuk utilitas penting dan smoke test untuk rute utama bila dibutuhkan.
7. **Kebutuhan jasa SLO (tinggi).** Model layanan dan artikel mengikuti kebutuhan nyata jasa SLO, bukan menyalin kategori SLF/PBG. Definisikan hubungan layanan ↔ artikel panduan, FAQ, syarat, proses, dan wilayah layanan berdasarkan struktur website yang disetujui.

## Struktur direktori usulan (konseptual)

```text
src/
├── content.config.ts
├── schemas/
│   ├── common.ts
│   ├── seo.ts
│   ├── blocks/
│   │   ├── index.ts
│   │   ├── content.ts
│   │   ├── layout.ts
│   │   ├── marketing.ts
│   │   └── service.ts
│   └── collections/
│       ├── articles.ts
│       ├── pages.ts
│       └── services.ts
├── content/
│   ├── articles/
│   ├── pages/
│   └── services/
├── components/
│   ├── blocks/
│   ├── layout/
│   └── ui/
├── layouts/
├── pages/
├── lib/
└── config/
    ├── site.ts
    └── navigation.ts
scripts/
docs/
```

Nama dan pembagian direktori ini belum final; cocokkan dengan konvensi referensi dan kebutuhan website sebelum implementasi. `src/pages/` adalah rute Astro, sedangkan `src/content/pages/` berisi data halaman, bukan rute.

## Tahapan kerja dan kriteria penerimaan

1. **Audit lanjutan:** tinjau `src/pages/`, `src/layouts/`, `src/components/`, renderer blok, `scripts/`, konfigurasi CI, dan deploy di referensi. Tandai fitur yang sudah ada agar tidak diduplikasi.
2. **Pemetaan:** cocokkan seluruh halaman website jasa SLO dengan rute, koleksi, blok, metadata, dan navigasi. Jangan mengubah struktur website diam-diam.
3. **Keputusan desain:** sepakati skema, naming, validasi relasi, konfigurasi bisnis, dan komponen sebelum coding.
4. **Implementasi bertahap:** fondasi → konten dan blok → rute/layout → SEO dan validasi → CI/deployment.
5. **Verifikasi:** semua rute yang direncanakan dapat dibuild; tidak ada broken internal link; konten draft tidak terbit; metadata SEO dan domain produksi benar; perubahan terdokumentasi.

## Batasan

- Tidak perlu CMS, database, SSR, atau framework frontend tambahan tanpa kebutuhan yang teruji.
- Jangan menyalin konten, identitas merek, atau kategori layanan SLF/PBG ke jasa SLO.
- Dokumen ini adalah **rencana**, bukan klaim bahwa fitur-fitur tersebut telah diterapkan.
