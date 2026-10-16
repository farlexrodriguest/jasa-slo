# Tree Website Jasa SLO — V2 (Untuk Review)

**Status:** Draft / belum disetujui untuk implementasi  
**Rujukan:** `docs/struktur-website-slo.md`, `docs/riset-domain-slo-esdm.md`, `docs/rencana-arsitektur-astro.md`  
**Tujuan:** mendokumentasikan usulan hierarki website, **bukan** struktur direktori Astro atau daftar layanan yang sudah terverifikasi.

## Tree lengkap (usulan)

```text
jasa-slo/
│
├── /                              Beranda
│
├── /layanan/                      Semua Layanan
│   │
│   ├── /layanan/slo/              Sertifikat Laik Operasi
│   │   ├── /layanan/slo/tegangan-rendah/
│   │   │   └── SLO Tegangan Rendah (TR)
│   │   ├── /layanan/slo/tegangan-menengah/
│   │   │   └── SLO Tegangan Menengah (TM)
│   │   ├── /layanan/slo/tegangan-tinggi/
│   │   │   └── SLO Tegangan Tinggi (TT)
│   │   ├── /layanan/slo/tegangan-ekstra-tinggi/
│   │   │   └── SLO Tegangan Ekstra Tinggi (TET)
│   │   ├── /layanan/slo/pembangkit/
│   │   │   └── SLO Instalasi Pembangkit
│   │   ├── /layanan/slo/transmisi/
│   │   │   └── SLO Instalasi Transmisi
│   │   └── /layanan/slo/distribusi/
│   │       └── SLO Instalasi Distribusi
│   │
│   ├── /layanan/nidi/
│   │   └── Pendampingan NIDI
│   ├── /layanan/pasang-baru/
│   │   └── Pendampingan Pasang Baru Listrik
│   ├── /layanan/tambah-daya/
│   │   └── Pendampingan Tambah Daya Listrik
│   └── /layanan/konsultasi/
│       └── Konsultasi Kebutuhan Sertifikasi
│
├── /alur-dan-persyaratan/
│   ├── /alur-dan-persyaratan/slo/
│   ├── /alur-dan-persyaratan/nidi/
│   ├── /alur-dan-persyaratan/dokumen/
│   └── /alur-dan-persyaratan/biaya/
│
├── /edukasi/
│   ├── /edukasi/slo/
│   ├── /edukasi/nidi/
│   ├── /edukasi/instalasi-listrik/
│   ├── /edukasi/regulasi/
│   ├── /edukasi/faq/
│   └── /edukasi/[slug]/
│
├── /tentang-kami/
│   ├── /tentang-kami/profil/
│   ├── /tentang-kami/legalitas/
│   └── /tentang-kami/wilayah-layanan/
│
├── /kontak/
├── /kebijakan-privasi/
└── /syarat-ketentuan/
```

## Navigasi utama (usulan)

| Menu | Isi / tujuan |
| --- | --- |
| Beranda | Ringkasan layanan, alur, edukasi, CTA |
| Layanan | SLO, NIDI, pasang baru, tambah daya, konsultasi |
| Alur & Persyaratan | Proses, dokumen, biaya |
| Edukasi & FAQ | Artikel, panduan, regulasi |
| Tentang Kami | Profil, legalitas, wilayah |
| Konsultasi | Kontak dan kanal komunikasi yang telah diverifikasi |

Subkategori TR/TM/TT/TET, pembangkit, transmisi, dan distribusi tidak perlu seluruhnya ditampilkan pada navigasi tingkat pertama.

## Catatan review penting

1. **Dua dimensi klasifikasi.** Tingkat tegangan (TR/TM/TT/TET) dan jenis instalasi (pemanfaatan/pembangkit/transmisi/distribusi) bukan satu hierarki tunggal. Rute di atas masih kandidat; perlu ditentukan taksonomi utama dan relasi lintas-kategori agar tidak terjadi konten duplikat atau klasifikasi teknis yang menyesatkan.
2. **Verifikasi layanan.** Keberadaan URL pada draft **tidak berarti** layanan tersedia, perusahaan berwenang menerbitkan SLO, atau mitra LIT memiliki cakupan inspeksi tersebut. Semua kategori memerlukan verifikasi bisnis, legalitas, dan cakupan mitra sebelum publikasi sebagai layanan.
3. **Pasang baru/tambah daya.** Ini terkait proses PLN; jangan mengklaim menggantikan kanal resmi PLN. Tampilkan sebagai pendampingan hanya bila layanan benar-benar ada.
4. **Biaya.** Bedakan biaya sertifikasi/inspeksi, jasa pendampingan, pekerjaan instalasi, dan biaya PLN. Jangan menyajikan harga sebagai tarif resmi tanpa sumber dan tanggal berlaku.
5. **Konten SEO.** Hindari halaman tipis, duplikatif, atau halaman wilayah tanpa operasi nyata. Artikel edukasi dapat memuat topik yang belum merupakan layanan aktif.
6. **Hubungan dengan draft V1.** Dokumen ini memperluas kandidat layanan dari `docs/struktur-website-slo.md`; tidak otomatis menggantikan keputusan yang sudah dibuat di sana.

## Keputusan yang masih menunggu review

- Apakah klasifikasi utama SLO mengikuti **jenis instalasi** atau **tingkat tegangan**?
- Jenis layanan dan tingkat tegangan mana yang benar-benar dapat dilayani?
- Apakah kategori pembangkit, transmisi, dan distribusi merupakan layanan atau topik edukasi?
- Apakah struktur URL detail SLO ini disetujui atau perlu disederhanakan?

**Gate:** persetujuan pemilik proyek dan verifikasi cakupan/otorisasi → finalisasi sitemap → pemetaan ke Astro → implementasi. Belum ada perubahan kode.
