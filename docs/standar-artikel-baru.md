# Standar Membuat Artikel Baru (koleksi `articles`)

Dokumen ini merangkum aturan menambah artikel baru di `src/content/articles/`.
Sumber utama aturan: `AGENTS.md` (gerbang validasi 7 lapis) + pola 6 artikel
eksisting. Baca ulang dokumen ini sebelum membuat artikel berikutnya.

## 1. Struktur berkas & frontmatter

- Satu artikel = satu berkas `.md` di `src/content/articles/`, **nama berkas = slug**.
- Frontmatter wajib dibuka pada **baris pertama** dan ditutup **tepat satu kali**.
  Dilarang menambah baris `---` di dalam frontmatter (delimiter ekstra memotong
  frontmatter dan membuang `blocks` — halaman terbit kosong tanpa peringatan).
- **Body Markdown dibiarkan kosong** — rute artikel hanya merender `blocks`;
  seluruh konten artikel ditulis sebagai blok di frontmatter.

## Field wajib (urutan mengikuti artikel eksisting)

| Field          | Aturan |
| ---            | --- |
| `id`           | Integer positif, unik per koleksi; naik 1 dari nilai terbesar saat ini. |
| `ulid`         | 26 karakter, pola `^[0-7][0-9A-HJKMNP-TV-Z]{25}$` (Crockford), **unik lintas semua koleksi**. Pola berjalan: `01K7R000000000000000000NNN` — pastikan tidak bentrok dengan `pages`/`services`. |
| `type`         | `"article"` (tetap). |
| `slug`         | Kebab-case (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), unik; nama berkas sama dengan slug. |
| `title`        | Bebas, sesuai konteks layanan; tidak boleh duplikat judul yang ada. |
| `description`  | Ringkasan 1–2 kalimat (dipakai meta description, kartu, dan JSON-LD). |
| `draft`        | `false` untuk terbit. |
| `category`     | Kelompok yang sudah dipakai (mis. Pengetahuan, Standar, Regulasi) agar konsisten. |
| `image`        | `/images/artikel/<slug>.webp` — **nama berkas gambar = slug judul**. |
| `imageAlt`     | **Wajib terisi** bila `image` terisi (pasangan ini dijaga `validate:img-alt`). |
| `author`       | `"Redaksi"`. |
| `tags`         | Array kata kunci pendek. |
| `pubDate` / `updatedDate` | Lihat aturan tanggal di bawah. |
| `relatedType` / `relatedId` | Pasangan lengkap, target harus ada (`relatedType: "service"` + id service: slo-tr 101, slo-tm 102, nidi 103, iuptls 104, uji-panel-cubicle 105, uji-trafo 106). |
| `relatedArticles` | Array `id` artikel eksisting; **belum divalidasi otomatis** — cek manual. |

## Gambar (WAJIB unik)

- Setiap halaman wajib gambar unik — **dilarang berbagi gambar** antar halaman.
  Perlu ilustrasi mirip? Buat varian baru (ubah sudut/elemen/warna aksen).
- Buat SVG sumber di `public/images/artikel/<slug>.svg`, lalu render ke
  `public/images/artikel/<slug>.webp` (pola 6 artikel lain). Frontmatter
  memakai path `.webp`; SVG hanya arsip sumber.
- `alt=""` hanya untuk gambar dekoratif; gambar hero artikel bermakna → isi `imageAlt`.

## Tanggal (`validate:dates`)

- Format UTC tanpa milisekon: `YYYY-MM-DDTHH:mm:ssZ` (contoh `2026-10-18T15:05:21Z`).
- **Unik global** lintas semua koleksi (`articles`, `pages`, `services`) termasuk
  draft — dua konten tidak boleh memakai timestamp yang sama. Sebelum menulis,
  cek kandidat timestamp terhadap seluruh frontmatter yang ada.
- Dilarang `T00:00:00Z`; jam/detik bervariasi; `updatedDate` > `pubDate`.
- Jangan ubah `pubDate` artikel lama; `updatedDate` hanya bila isi benar-benar berubah.

## Blok konten

- Hanya komponen yang terdaftar di `src/components/blocks.ts` (28 komponen).
  Yang lazim untuk artikel: `section`, `note`, `stats`, `table`, `source-links`.
- Artikel **tidak memakai blok `faq`** (konsisten dengan 6 artikel eksisting;
  `faq` hanya di panduan/layanan/tentang-kami).
- Setiap `heading`/`title` blok harus benar-benar ter-render di rutenya
  (`validate:output` menolak bila tidak).
- Setiap `section` blok diberi `id` anchor kecil-kebab unik dalam halaman.

## JSON-LD (otomatis — tidak perlu tindakan)

- Rute `/artikel/<slug>/` otomatis merakit Article + node Service terkait +
  ItemList artikel terkait + breadcrumb; `about` mengikuti `relatedType`/`relatedId`.
- Memastikan `relatedId` benar berarti schema `about: Service` juga benar.

## Gerbang validasi

`npm run validate` (7 lapis) wajib lulus sebelum dianggap selesai:
content → frontmatter → dates → typecheck → build → output → img-alt.
Lalu commit (satu commit: `feat: artikel baru <slug>`) dan push setelah disetujui.

## Checklist cepat

1. Tentukan judul bebas sesuai konteks layanan → slug kebab-case.
2. Buat SVG sumber + WebP unik (`public/images/artikel/<slug>.webp`).
3. Tulis frontmatter lengkap (tabel di atas), cek keunikan `id`, `ulid`, slug, 2 timestamp.
4. Susun `blocks` (komponen terdaftar), body tetap kosong.
5. `npm run validate` — pastikan 7 lapis lulus.
6. Setelah disetujui: commit `feat: artikel baru <slug>` + push.

## Usulan artikel berikutnya (belum dibuat)

- **Judul**: Siapa yang Berwenang Menerbitkan SLO?
- **Slug**: `siapa-berwenang-menerbitkan-slo`
- **Kategori**: Regulasi · **tags**: slo, regulasi, lembaga-inspeksi, pln
- **Isi**: peran pemilik instalasi, konsultan pendamping, lembaga inspeksi
  (kewenangan pengujian), dan PLN/pemerintah dalam proses SLO — konsisten
  dengan disclaimer situs (konsultan berperan pendamping, bukan penerbit).
- **relatedType/relatedId**: service / 101 (slo-tr) · **relatedArticles**: [1, 4]
  (Apa itu SLO? = id 1; Perbedaan SLO, NIDI, dan IUPTLS — cek id di saat eksekusi).
- **image/imageAlt**: SVG+WebP baru bertema lambang kewenangan/otoritas
  (mis. stempel + simbol listrik), alt menjelaskan ilustrasi.
