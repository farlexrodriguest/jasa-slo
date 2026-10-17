| Aspek | `jasa-perijinan-haki` | `jasa-perijinan-csms` | Keputusan untuk proyek SLF |
|---|---|---|---|
| Pendekatan konten | Markdown dan frontmatter mengendalikan konten serta susunan block artikel | Markdown dengan `contentBlocks` yang menggunakan tipe dan data block | Gabungkan fleksibilitas frontmatter HAKI dengan model block CSMS yang terstruktur |
| Struktur komponen | Dipisahkan ke dalam direktori `pages`, `home`, `shared`, dan `content` | Komponen block terkonsentrasi di direktori `blocks`, bersama komponen utama situs | Gunakan struktur yang jelas berdasarkan fungsi, tanpa membuat direktori terlalu rumit |
| Variasi komponen | Lebih ringkas, mencakup card, FAQ, CTA, tabel, note, steps, stats, glossary, dan quote | Lebih banyak variasi, mencakup block artikel, layanan, checklist, timeline, serta komponen khusus halaman | Jadikan CSMS sebagai sumber inventaris komponen awal |
| Pengaturan tampilan block | Mendukung pengaturan kelas tertentu melalui frontmatter, dengan kelas bawaan komponen | Menggunakan tipe block dan properti `data` yang ditentukan skema | Pertahankan pengaturan tampilan terkontrol, bukan membebaskan setiap artikel dari konsistensi desain |
| Penyusunan heading | Heading block dapat masuk ke daftar isi secara otomatis | Daftar isi dibentuk dari tipe block tertentu, termasuk section dan struktur artikel | Gabungkan agar heading tetap eksplisit dan daftar isi dibuat otomatis |
| Artikel panjang | Block dapat disusun melalui frontmatter; mendukung komposisi konten yang fleksibel | Memiliki `article-body` dengan section dan subsection, TOC, serta sidebar | Gunakan struktur artikel CSMS, dengan kemampuan mengatur urutan block seperti HAKI |
| Sidebar artikel | Pendekatan komponen dan komposisi konten mendukung pengembangan sidebar | Sudah memiliki rancangan TOC, sidebar sticky, layanan terkait, dan penulis | Jadikan sidebar CSMS sebagai dasar, lalu uji perilakunya pada artikel panjang |
| CTA | CTA WhatsApp dapat ditempatkan pada posisi block dalam artikel | CTA layanan dapat disisipkan di tengah artikel dan diarahkan ke layanan terkait | Gabungkan CTA WhatsApp dan CTA menuju halaman layanan |
| Relasi konten | Memiliki `relatedType` dan `relatedId`, serta pola parent–child untuk konten | Memiliki relasi artikel ke layanan melalui `relatedService` dan algoritma artikel terkait | Gunakan relasi konten eksplisit agar halaman layanan dan artikel saling mendukung |
| Identitas konten | Mendukung `id` numerik dan `ulid` | Mendukung `ulid` dan identitas artikel yang terstruktur | Pertahankan identitas yang konsisten dan tervalidasi |
| Pengembangan komponen | Menambahkan block memerlukan komponen, registry, dan schema | Menambahkan block memerlukan komponen, schema, dan registrasi renderer | Standarkan proses penambahan komponen sejak awal |

| Kelompok | Komponen yang direkomendasikan | Sumber utama |
|---|---|---|
| Konten dasar | Paragraf, daftar, gambar, card, note, quote | HAKI + CSMS |
| Struktur artikel | Article lead, section header, article body | CSMS dengan pola komposisi HAKI |
| Dokumen dan persyaratan | Document list, checklist card, requirement checklist | CSMS |
| Informasi terstruktur | Comparison table, stats, glossary | HAKI + CSMS |
| Prosedur | Steps, numbered steps, process timeline | HAKI + CSMS |
| Interaksi | FAQ, CTA WhatsApp, CTA layanan | HAKI + CSMS |
| Halaman layanan | Service detail, service card grid, service directory | CSMS |
| Navigasi konten | Related articles, latest articles, breadcrumb | HAKI + CSMS |
| Artikel panjang | Article header, TOC, sidebar, author, related service | CSMS |
| Beranda | Hero, ringkasan layanan, artikel terbaru, CTA | CSMS dengan struktur halaman HAKI |

# Perbandingan Repository Rujukan dan Keputusan Arsitektur SLF/PBG

**Target repository:** `arisciwek/jasa-perijinan-slf`  
**Branch kerja:** `docs/corporate-seo-implementation-plan`  
**Tanggal catatan:** 14 Oktober 2026  
**Tujuan:** Mencatat dasar pemilihan pola dari dua repository rujukan sebelum implementasi SLF/PBG.

## 1. Repository yang dibandingkan

1. [jasa-perijinan-haki](https://github.com/arisciwek/jasa-perijinan-haki)
2. [jasa-perijinan-csms](https://github.com/arisciwek/jasa-perijinan-csms)

Perbandingan ini mengacu pada dokumentasi README dan struktur repository yang dapat diakses saat penyusunan dokumen. Ini adalah evaluasi arsitektur untuk menentukan arah proyek, bukan klaim bahwa seluruh implementasi internal kedua repo telah diaudit baris demi baris.

## 2. Ringkasan keputusan

**Keputusan utama: gunakan pola konten-first dari repository HAKI sebagai fondasi, lalu pilih komponen dan pola UX/SEO dari CSMS secara selektif. Jangan menyalin seluruh arsitektur atau seluruh daftar blok salah satu repository.**

Alasan utamanya adalah kebutuhan proyek SLF/PBG: isi halaman dan artikel harus dapat disusun dari Markdown/frontmatter; setiap komponen visual yang berbeda tetap mempunyai file komponen sendiri; urutan blok ditentukan oleh data konten; dan halaman indeks perlu menampilkan artikel terbaru serta artikel terkait secara dinamis.

## 3. Perbandingan

| Aspek | Repository HAKI | Repository CSMS | Keputusan untuk SLF/PBG |
|---|---|---|---|
| Orientasi utama | Arsitektur konten Markdown/frontmatter dengan komponen visual terpisah | Situs layanan dan artikel dengan banyak blok terstruktur serta halaman khusus | Gabungkan pola konten HAKI dengan pengalaman layanan/editorial CSMS |
| Konten artikel | File artikel Markdown; urutan `blocks` menentukan urutan tampilan; body Markdown dapat digunakan bersama blok | File artikel Markdown dengan `contentBlocks`; setiap item menggunakan `id`, `type`, dan `data` | Markdown/frontmatter menjadi sumber data utama |
| Kontrak blok | `blocks: [{ component, ...props }]` | `contentBlocks: [{ id, type, data }]` | Gunakan **satu kontrak** yang dipilih secara eksplisit; rekomendasi awal `blocks` + `component` agar nama komponen dan props mudah dibaca di frontmatter |
| Pemisahan komponen | Dokumentasi menyebut setiap komponen visual berada di file `.astro` terpisah | Memiliki direktori blok dengan beragam komponen khusus | Pertahankan satu file `.astro` per komponen visual yang berbeda |
| Skema konten | `src/content.config.ts` memvalidasi frontmatter dan kontrak block | `src/content/config.ts` dan `src/content/block-schema.ts` mendefinisikan skema konten/blok | Terapkan validasi ketat; sesuaikan dengan versi Astro yang benar-benar digunakan di target |
| Registry/renderer | Registry `src/components/blocks.ts` | Blok dirender melalui pola komponen bertipe | Buat registry/renderer eksplisit, dengan error build yang jelas untuk blok yang tidak dikenal |
| Jumlah blok | Katalog lebih ringkas dan umum, contohnya card, FAQ, CTA, table, note, steps, stats, glossary, quote | README mendokumentasikan 33 jenis blok untuk artikel, halaman depan, dan layanan | Ambil kebutuhan yang benar-benar diperlukan; jangan membuat 33 blok hanya karena tersedia di CSMS |
| Komposisi halaman | Beranda, halaman, layanan, dan artikel dibangun dari koleksi konten serta komponen terpisah | Memiliki layouts, halaman route khusus, dan halaman layanan/artikel yang lebih eksplisit | Gunakan komponen/layout yang sesuai untuk tipe halaman; data isi tetap dipisahkan |
| Relasi konten | README menjelaskan relasi `relatedType` + `relatedId`, serta parent dapat menampilkan child terbaru melalui query | Artikel memiliki field seperti `relatedService` dan utilitas untuk artikel terkait | Pilih satu model relasi yang konsisten dan tervalidasi; jangan mencampur ID, slug, dan field relasi tanpa aturan |
| Artikel terbaru/terkait | Menekankan query konten terbaru pada parent | Memiliki komponen RelatedArticles dan algoritme terkait | Terapkan daftar artikel terbaru dan terkait yang berasal dari koleksi, bukan daftar statis manual |
| Daftar isi artikel | README menyebut block dengan heading otomatis masuk TOC; block tanpa heading tidak masuk | Memiliki banyak blok artikel terstruktur; pola TOC harus diverifikasi di implementasi | TOC dihasilkan dari heading yang benar-benar dirender; ID anchor harus stabil dan unik |
| SEO | Memakai tanggal konten sebagai sumber `lastmod` sitemap dan pola metadata terstruktur | README mencantumkan komponen SEO metadata, structured data, dan skrip sitemap | Gabungkan metadata terpusat dan pengelolaan tanggal konten; verifikasi output build |
| Cocok untuk | Fondasi konten yang mudah diatur dari frontmatter | Referensi untuk variasi blok, halaman layanan, CTA tengah artikel, dan UX editorial | HAKI sebagai fondasi; CSMS sebagai katalog referensi pola yang dipilih |

## 4. Kekuatan dan hal yang perlu diwaspadai

### 4.1 Repository HAKI

**Yang diadopsi:**
- Konten halaman, layanan, dan artikel berada dalam file Markdown masing-masing.
- Frontmatter mengendalikan urutan dan properti blok.
- Komponen visual dipisah dalam file `.astro`.
- Skema memvalidasi konten dan kontrak blok.
- Metadata kategori/penulis dan konfigurasi bisnis dipisahkan dari konten.
- Relasi konten dapat digunakan untuk menghasilkan daftar child/terbaru.

**Yang perlu diperiksa sebelum menyalin pola:**
- Perilaku blok tidak dikenal: README menyatakan komponen yang tidak terdaftar dilewati saat build. Untuk SLF/PBG, keputusan yang lebih aman adalah membuat build gagal dengan pesan jelas agar kesalahan konten tidak tersembunyi.
- Pastikan skema dan nama field sesuai dengan kebutuhan konten SLF/PBG.
- Pastikan model relasi tidak menyebabkan ID ganda atau link yang tidak valid.
- Jangan mengadopsi detail implementasi sebelum memeriksa kode aktual dan versi dependensinya.

### 4.2 Repository CSMS

**Yang diadopsi secara selektif:**
- Ragam blok yang memenuhi kebutuhan nyata halaman layanan dan artikel.
- Pola CTA yang bisa muncul di tengah artikel, bukan hanya di akhir.
- Komponen SEO metadata dan structured data sebagai referensi.
- Komponen artikel terkait dan algoritme relasi sebagai bahan evaluasi.
- Pola daftar layanan, checklist, daftar dokumen, langkah proses, callout, dan tabel perbandingan.
- Struktur halaman artikel dan listing/pagination bila sesuai kebutuhan konten SLF/PBG.

**Yang tidak disalin secara otomatis:**
- Seluruh 33 blok hanya karena tersedia.
- Struktur `contentBlocks/type/data` bersamaan dengan kontrak blok lain.
- Halaman khusus CSMS, elemen CSMS, istilah, data, dan komponen domain yang tidak relevan.
- Statistik, testimoni, atau klaim komersial tanpa bukti.
- Algoritme artikel terkait tanpa memeriksa apakah hasilnya masuk akal dan relevan.

## 5. Kontrak konten yang dipilih

Rekomendasi awal untuk konten berbasis blok:

```yaml
---
title: "Persiapan Dokumen SLF"
description: "Panduan awal untuk menyiapkan informasi dan dokumen terkait SLF."
blocks:
  - component: section
    id: pengertian
    heading: "Apa yang Perlu Dipahami?"
    body:
      - type: paragraph
        text: "Penjelasan awal..."
  - component: document-list
    id: dokumen-awal
    heading: "Dokumen yang Perlu Ditelaah"
    items:
      - title: "Dokumen bangunan"
        description: "Daftar awal yang perlu diperiksa sesuai kondisi bangunan."
  - component: cta
    heading: "Konsultasikan Kebutuhan Anda"
    text: "Sampaikan kondisi bangunan untuk menentukan langkah berikutnya."
    href: "/contact"
---
```

Contoh di atas bersifat ilustratif. Nama field dan bentuk final perlu dicocokkan dengan skema dan komponen yang akan dibuat.

Aturan yang dipilih:

1. **Satu field utama:** `blocks`, bukan mencampur `blocks` dan `contentBlocks` untuk fungsi yang sama.
2. **Satu penentu jenis komponen:** `component`, bukan campuran `type` dan `component` pada tingkat blok teratas.
3. **Props mudah dibaca:** properti komponen diletakkan langsung di item blok, kecuali ada alasan teknis yang kuat untuk membungkusnya.
4. **Komponen terpisah:** satu komponen visual dengan tanggung jawab jelas berada pada file `.astro` sendiri.
5. **Heading sebagai blok tersendiri bila diperlukan:** jangan memaksa semua section memakai satu komponen card serbaguna. Heading H2 dan H3 dapat menjadi komponen/struktur terpisah sehingga urutan dan tingkat heading jelas.
6. **Semantik heading:** gunakan H2 untuk section utama dan H3 untuk subbagian; jangan menentukan level heading hanya berdasarkan ukuran visual.
7. **Validasi:** nama komponen, properti, ID anchor, relasi, dan data wajib divalidasi.
8. **Kesalahan tegas:** komponen yang tidak dikenal atau data tidak valid harus menggagalkan build dengan pesan yang dapat ditindaklanjuti.
9. **Konten campuran:** dukung Markdown body dan blok frontmatter hanya bila pola tersebut dibutuhkan dan aturan urutannya jelas. Hindari dua sumber yang sama-sama mendefinisikan konten section yang sama.
10. **ID dan relasi:** tetapkan apakah relasi menggunakan ID atau slug; jangan mencampurnya tanpa kontrak eksplisit.

## 6. Komponen yang direkomendasikan untuk SLF/PBG

Mulai dari blok yang diperlukan untuk membuat satu halaman layanan dan satu artikel representatif:

- `hero` atau intro halaman.
- `section-heading` untuk heading dan pengantar section jika memang dibutuhkan.
- `paragraph` / body teks.
- `content-card` untuk ringkasan informasi.
- `document-list` atau `checklist`.
- `steps` untuk proses.
- `info-callout` untuk catatan dan batasan.
- `comparison-table` bila ada perbandingan yang valid.
- `faq`.
- `cta`.
- `article-card`.
- `latest-articles`.
- `related-articles`.
- `service-card-grid`.
- `table-of-contents` dan layout sidebar artikel bila diperlukan.

Komponen seperti statistik, testimoni, quote, glossary, timeline, atau visualisasi lain ditambahkan hanya jika ada konten nyata dan kasus penggunaan yang jelas. Daftar ini bukan target kuota.

## 7. Relasi halaman dan artikel

Untuk menghindari beranda dan halaman layanan menjadi statis:

- Beranda mengambil artikel terbaru dari koleksi artikel berdasarkan tanggal yang valid.
- Halaman layanan dapat menampilkan artikel yang terhubung ke layanan tersebut.
- Artikel dapat menunjuk ke satu layanan utama dan beberapa artikel terkait bila diperlukan.
- Relasi harus diperiksa saat build agar tidak menghasilkan link mati.
- Jika belum ada artikel terkait, tampilkan fallback yang disengaja atau jangan render bagian tersebut.
- Jangan memakai daftar artikel terbaru yang ditulis manual dalam frontmatter halaman jika koleksi artikel sudah menjadi sumber data utama.

Model relasi final perlu memilih satu sumber kebenaran—misalnya slug layanan pada artikel—dan membangun query/helper dari field tersebut. Keputusan final dibuat setelah audit kode target.

## 8. Sticky sidebar dan daftar isi

Masalah sticky sidebar tidak diselesaikan hanya dengan menambah `position: sticky`. Implementasi perlu diperiksa pada layout nyata:

- Periksa ancestor dengan `overflow`, `transform`, containment, dan tinggi terbatas.
- Tentukan offset terhadap header yang sticky/fixed.
- Pastikan kolom sidebar tidak lebih tinggi dari viewport tanpa strategi scroll yang sesuai.
- Periksa perilaku pada breakpoint desktop dan mobile.
- Pastikan TOC hanya menautkan heading yang benar-benar ada.
- Uji anchor, fokus keyboard, dan layout artikel panjang di browser.

Penerimaan fitur berdasarkan hasil uji visual/fungsional, bukan hanya keberadaan aturan CSS.

## 9. Urutan penerapan keputusan

1. Audit kondisi aktual repository SLF/PBG, versi Astro, skema, routes, dan komponen yang telah ada.
2. Cocokkan kebutuhan dengan kontrak `blocks + component` dan model relasi konten.
3. Tulis skema dan dokumentasikan contoh frontmatter yang valid.
4. Implementasikan renderer dan beberapa blok inti.
5. Buat satu halaman layanan dan satu artikel panjang sebagai proof of concept.
6. Validasi artikel terbaru, artikel terkait, TOC, sticky sidebar, SEO metadata, dan build produksi.
7. Review hasil sebelum memperluas ke komponen atau artikel lain.

## 10. Referensi

- [Repository HAKI](https://github.com/arisciwek/jasa-perijinan-haki)
- [README HAKI](https://github.com/arisciwek/jasa-perijinan-haki/blob/main/README.md)
- [Content schema HAKI](https://github.com/arisciwek/jasa-perijinan-haki/blob/main/src/content.config.ts)
- [Repository CSMS](https://github.com/arisciwek/jasa-perijinan-csms)
- [README CSMS](https://github.com/arisciwek/jasa-perijinan-csms/blob/main/README.md)
- [Content schema CSMS](https://github.com/arisciwek/jasa-perijinan-csms/blob/main/src/content/config.ts)
- [Block schema CSMS](https://github.com/arisciwek/jasa-perijinan-csms/blob/main/src/content/block-schema.ts)

## 11. Batasan dokumen

Dokumen ini mencatat pilihan arsitektur dan rencana adopsi berdasarkan dokumentasi repository yang dirujuk. Ia tidak menyatakan bahwa komponen atau fitur tersebut telah diterapkan di repository SLF/PBG. Sebelum perubahan kode, audit terhadap kondisi aktual target tetap wajib dilakukan.
