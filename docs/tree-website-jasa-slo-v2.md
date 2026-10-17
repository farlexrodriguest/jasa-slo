# Tree Website Jasa SLO — V2

**Status:** Disetujui untuk implementasi  
**Rujukan:** `docs/struktur-website-slo.md`, `docs/config-business-simulasi.md`, `docs/sop-operasional-layanan.md`

## Tree Lengkap

```text
jasa-slo/
│
├── /                              Beranda
│
├── /layanan/                      Semua Layanan
│   ├── /layanan/slo-tr/           SLO Tegangan Rendah
│   ├── /layanan/slo-tm/           SLO Tegangan Menengah
│   ├── /layanan/nidi/             Pendampingan NIDI
│   ├── /layanan/iuptls/           Layanan IUPTLS
│   ├── /layanan/uji-panel-cubicle/ Pengujian Panel Cubicle
│   └── /layanan/uji-trafo/        Pengujian Trafo Listrik
│
├── /alur-dan-persyaratan/         Tahapan & Checklist
│
├── /edukasi/                      Edukasi & FAQ
│   └── /edukasi/[slug]/           Artikel Detail
│
├── /tentang-kami/                 Profil & Legalitas
│
├── /kontak/                       Halaman Kontak
├── /kebijakan-privasi/            Privacy Policy (15 thn retensi)
└── /syarat-ketentuan/             Terms & Conditions (SOP)
```

## Navigasi Utama

| Menu | Isi / Tujuan |
| --- | --- |
| Beranda | Ringkasan layanan, alur, edukasi, CTA |
| Layanan | Dropdown: SLO TR, SLO TM, NIDI, IUPTLS |
| Alur & Persyaratan | Proses dan checklist dokumen |
| Edukasi & FAQ | Artikel dan panduan regulasi |
| Tentang Kami | Profil konsultan dan wilayah Jawa |
| Konsultasi | CTA WhatsApp / Email |

## Catatan Implementasi

1. **Klasifikasi SLO:** Fokus pada TR dan TM sesuai otoritas konsultan.
2. **Verifikasi Layanan:** Layanan IUPTLS ditambahkan sebagai layanan utama baru.
3. **Wilayah:** Pembatasan operasional di wilayah Jawa.
4. **Biaya:** Menggunakan sistem konsultasi langsung via WA/Email, tidak menampilkan tabel harga statis untuk menjaga akurasi.
5. **Kebijakan:** Mengintegrasikan SOP pembatalan, refund, dan retensi data 15 tahun.
