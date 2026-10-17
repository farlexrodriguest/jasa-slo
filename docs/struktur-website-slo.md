# Struktur Website Jasa SLO

**Proyek:** jasa-slo  
**Tanggal:** 17 Oktober 2026  
**Status:** Arsitektur informasi disetujui; siap untuk pemetaan Astro  
**Rujukan:** `docs/riset-domain-slo-esdm.md`, `docs/brief-struktur-astro.md`, `docs/config-business-simulasi.md`, dan `docs/sop-operasional-layanan.md`

> **Batas dokumen:** Struktur website, navigasi, hierarki informasi, sitemap, dan tujuan halaman. Implementasi teknis mengikuti `docs/rencana-arsitektur-astro.md`.

## 1. Tujuan website

Website membantu calon pelanggan memahami SLO (TR/TM), NIDI, dan IUPTLS, serta tahapan, persyaratan, dan cakupan jasa yang tersedia di wilayah Jawa, lalu menghubungi penyedia layanan melalui WhatsApp/Email.

### Kebutuhan pengunjung
- **Apa itu SLO, NIDI, IUPTLS?** Perbedaan dan kegunaannya.
- **Bagaimana cara mengurusnya?** Persyaratan dan alur di wilayah Jawa.
- **Siapa penyedia jasanya?** Konsultan pendamping (bukan penerbit langsung).
- **Berapa biayanya?** Estimasi berdasarkan konsultasi.

## 2. Struktur navigasi utama

| Urutan | Menu | Tujuan |
|---|---|---|
| 1 | Beranda | Ringkasan nilai, proses, layanan, dan kontak |
| 2 | Layanan | Dropdown: SLO TR, SLO TM, NIDI, IUPTLS |
| 3 | Alur & Persyaratan | Tahapan pengurusan dan checklist dokumen |
| 4 | Edukasi & FAQ | Artikel, dasar hukum, standar keselamatan |
| 5 | Tentang & Legalitas | Identitas usaha sebagai Konsultan, peran, dan batas kewenangan |
| 6 | Konsultasi | CTA ke WhatsApp / Email |

## 3. Sitemap Konseptual

```text
Beranda /
├── Layanan /layanan/
│   ├── SLO Tegangan Rendah /layanan/slo-tr/
│   ├── SLO Tegangan Menengah /layanan/slo-tm/
│   ├── Pendampingan NIDI /layanan/nidi/
│   ├── Layanan IUPTLS /layanan/iuptls/
│   ├── Pengujian Panel Cubicle /layanan/uji-panel-cubicle/
│   └── Pengujian Trafo Listrik /layanan/uji-trafo/
├── Alur & Persyaratan /alur-dan-persyaratan/
├── Edukasi & FAQ /edukasi/
│   └── Detail Artikel /edukasi/[slug]/
├── Tentang & Legalitas /tentang-kami/
├── Kontak /kontak/
├── Kebijakan Privasi /kebijakan-privasi/
└── Syarat & Ketentuan /syarat-ketentuan/
```

**Rute kandidat yang ditahan:** `/layanan/pasang-baru-tambah-daya/`. Jangan diterbitkan sebelum layanan dan batas tanggung jawabnya diverifikasi.

Sitemap di atas merupakan rancangan informasi, **bukan** instruksi membuat file atau route Astro saat ini.

## 4. Struktur konten per halaman

### 4.1 Beranda (`/`)
1. **Hero:** apa bantuan yang diberikan, untuk siapa, dan CTA konsultasi.
2. **Penjelasan singkat:** SLO vs NIDI; tautan ke edukasi.
3. **Layanan:** kartu hanya untuk layanan yang terverifikasi.
4. **Alur ringkas:** konsultasi → pemeriksaan kelengkapan → proses oleh pihak berwenang → hasil dan tindak lanjut. Jangan menjanjikan kelulusan otomatis.
5. **Persyaratan awal:** contoh data yang dibutuhkan, tanpa meminta data sensitif secara prematur.
6. **Transparansi peran:** penyedia pendampingan vs instalatir vs LIT vs PLN.
7. **FAQ pilihan:** pertanyaan yang paling sering menghambat pelanggan.
8. **CTA akhir:** kanal resmi, jam layanan jika diketahui.

### 4.2 Indeks Layanan (`/layanan/`)
- Ringkasan cakupan dan segmentasi.
- Perbandingan kebutuhan: SLO, NIDI, pasang baru/tambah daya (yang terakhir sebagai panduan, bukan janji layanan).
- Tautan ke halaman layanan yang sudah lolos verifikasi.
- Disclaimer batas kewenangan.

### 4.3 SLO Tegangan Rendah (`/layanan/slo-tr/`)
- Pengertian dan kegunaan SLO TR.
- Siapa yang membutuhkan dan batas jenis instalasi yang dilayani.
- Hubungan dengan NIDI.
- Tahapan dan peran LIT yang berwenang.
- Dokumen dan prasyarat kondisional.
- Faktor biaya dan waktu; **tanpa harga/SLA pasti** sampai diverifikasi.
- Kemungkinan inspeksi tidak lulus dan kebutuhan perbaikan.
- FAQ serta CTA konsultasi.

### 4.4 Pendampingan NIDI (`/layanan/nidi/`)
- Pengertian NIDI dan perbedaannya dari SLO.
- Siapa yang dapat melakukan pencatatan/pendaftaran sesuai ketentuan.
- Dokumen/data instalasi yang diperlukan.
- Tahapan pendampingan, batas layanan, dan kemungkinan koreksi data.
- CTA konsultasi.

### 4.5 SLO Tegangan Menengah (`/layanan/slo-tm/`)
- Pengertian dan kegunaan SLO TM untuk industri/komersial.
- Persyaratan teknis dan dokumen khusus tegangan menengah.
- Alur inspeksi dan koordinasi dengan pihak berwenang.
- CTA konsultasi.

### 4.6 Layanan IUPTLS (`/layanan/iuptls/`)
- Pengertian IUPTLS (Izin Usaha Penyediaan Tenaga Listrik untuk Kepentingan Sendiri).
- Siapa yang wajib memiliki IUPTLS.
- Persyaratan dan tahapan pengurusan izin.
- Hubungan IUPTLS dengan SLO.
- CTA konsultasi.

### 4.7 Alur & Persyaratan (`/alur-dan-persyaratan/`)
- Pemilihan skenario: instalasi baru, sudah terpasang tetapi belum memiliki dokumen, atau kebutuhan lain.
- Langkah konseptual: instalasi → identitas instalasi/NIDI → permohonan SLO → pemeriksaan/pengujian → tindak lanjut → proses sertifikasi sesuai kewenangan.
- Checklist dokumen berdasarkan skenario, dengan penanda bahwa syarat final ditentukan oleh pihak berwenang.
- Penjelasan apa yang terjadi jika dokumen kurang atau instalasi perlu perbaikan.
- Tautan ke kanal resmi terkait dan bantuan konsultasi.

### 4.8 Edukasi & FAQ (`/edukasi/`)
**Kelompok topik:**
- Dasar: SLO (TR/TM), NIDI, IUPTLS, LIT, DJK, PLN.
- Proses: persyaratan, inspeksi, pasang baru, tambah daya.
- Biaya: komponen biaya dan perbedaan biaya sertifikasi, jasa pendampingan, serta biaya PLN.
- Regulasi: ringkasan dengan tautan sumber resmi dan tanggal tinjauan.
- Keselamatan: pentingnya inspeksi dan instalasi yang memenuhi ketentuan.

**Artikel detail:** judul jelas, ringkasan, tanggal pembaruan, sumber primer, tautan layanan terkait, dan FAQ bila relevan. Hindari artikel SEO duplikatif berdasarkan kota tanpa cakupan layanan nyata.

### 4.9 Tentang & Legalitas (`/tentang-kami/`)
- Nama dan identitas badan usaha (Konsultan).
- Model bisnis: Pendamping administrasi dan teknis.
- Dokumen legal dan cakupan kewenangan (menyusul).
- Wilayah layanan aktual: Jawa.
- Pernyataan tidak berafiliasi dengan PLN/ESDM kecuali ada bukti resmi.

### 4.10 Kontak (`/kontak/`)
- Kanal WhatsApp/email resmi.
- Jam respons (KPI < 15 menit), wilayah layanan (Jawa), dan ekspektasi tindak lanjut.
- Panduan tidak mengirim KTP/NIK atau dokumen sensitif melalui formulir publik sebelum kebijakan data disiapkan.

### 4.11 Kebijakan Privasi dan Syarat & Ketentuan
- **Privasi:** tujuan dan dasar pemrosesan, data yang dikumpulkan, pihak penerima, retensi (15 tahun), keamanan, serta cara menghubungi pengelola data.
- **Ketentuan:** cakupan layanan, batas tanggung jawab, proses pemeriksaan, pemisahan biaya jasa dan biaya pihak lain, komplain, pembatalan, dan refund sesuai SOP.
- Kedua halaman wajib ditinjau berdasarkan operasi aktual dan ketentuan hukum yang berlaku sebelum pengumpulan data pribadi.

## 5. Struktur footer

- Identitas dan kontak penyedia jasa yang terverifikasi.
- Tautan: Beranda, Layanan, Panduan, Artikel, Tentang, Kontak.
- Tautan hukum: Kebijakan Privasi, Syarat & Ketentuan.
- Disclaimer yang disesuaikan dengan legalitas: “Situs ini bukan situs resmi PLN atau Kementerian ESDM. Pemeriksaan dan sertifikasi SLO dilakukan sesuai kewenangan lembaga terkait.”
- Tahun hak cipta dan nama usaha **setelah identitas dipastikan**.

### 5.1 Implementasi footer

- Footer dirender otomatis oleh `src/layouts/BaseLayout.astro`, sehingga setiap halaman memperoleh footer tanpa perlu memanggilnya satu per satu. Halaman redirect statis (`/alur-dan-persyaratan/`, `/articles/`, `/edukasi/`) memang tidak memuat footer karena hanya berisi meta refresh.
- Sumber data footer: menu dari `src/config/navigation.ts`, nama badan usaha dari `site.legalName`, copy eyebrow/tagline dari `site.footer`, dan nota hukum dari `site.disclaimer` sebagai satu-satunya sumber.
- Seluruh nilai identitas di `src/config/site.ts` masih **data simulasi** (nama badan usaha, telepon, alamat, nomor legal) dan wajib diganti dengan data resmi sebelum publikasi.

## 6. Aturan konten dan konversi

1. **Tidak mengaku sebagai penerbit SLO** tanpa dasar kewenangan.
2. **Tidak menyatakan afiliasi PLN/ESDM** tanpa bukti.
3. **Tidak menjanjikan sertifikat instan atau pasti lolos**; inspeksi dan perbaikan tetap mungkin diperlukan.
4. **Tidak menampilkan tarif sebagai tarif resmi** tanpa verifikasi dasar dan tanggal berlaku.
5. **Tidak menyebut estimasi waktu sebagai jaminan** tanpa SOP dan pengecualian yang disetujui.
6. **CTA “Cek Kelayakan”** hanya boleh berarti pemeriksaan administratif awal, bukan penilaian teknis atau sertifikasi.
7. **Minimasi data:** tahap kontak awal cukup informasi non-sensitif yang diperlukan; proses dokumen membutuhkan kontrol keamanan tersendiri.
8. **Tidak membuat halaman layanan kosong** atau halaman kota yang tidak benar-benar terlayani.

## 7. Status Keputusan

- **Badan usaha:** Konsultan pendamping (bukan LIT/Kontraktor).
- **Layanan aktif:** SLO TR, SLO TM, NIDI, IUPTLS.
- **Wilayah layanan:** Jawa.
- **Harga:** Berdasarkan konsultasi (tidak dipublikasikan statis).
- **Kontak:** WhatsApp dan Email.
- **SOP & KPI:** Disetujui (17 Okt 2026).

## 8. Langkah Berikutnya

1. **Pemetaan ke Astro:** Sesuai `docs/rencana-arsitektur-astro.md`.
2. **Implementasi content collections:** Skema untuk layanan, artikel, dan halaman.
3. **Pembuatan komponen UI:** Header, Footer, Hero, ServiceCard, FAQ, dll.
4. **Setup CI/CD & Validasi.**
