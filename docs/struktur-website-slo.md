# Struktur Website Jasa SLO — Draft untuk Review

**Proyek:** jasa-slo  
**Tanggal:** 17 Oktober 2026  
**Status:** Draft arsitektur informasi; belum disetujui untuk implementasi  
**Rujukan:** `docs/riset-domain-slo-esdm.md` dan `docs/brief-struktur-astro.md`

> **Batas dokumen:** hanya struktur website, navigasi, hierarki informasi, sitemap, dan tujuan halaman. **Tidak mencakup struktur folder Astro, komponen teknis, framework styling, maupun kode.** Struktur Astro akan mengikuti petunjuk terpisah dari pemilik proyek.

## 1. Tujuan website

Website membantu calon pelanggan memahami SLO, NIDI, tahapan, persyaratan, dan cakupan jasa yang **benar-benar tersedia**, lalu menghubungi penyedia layanan melalui kanal resmi. Website tidak boleh menyiratkan bahwa penyedia jasa adalah PLN, Kementerian ESDM, atau penerbit SLO bila kewenangannya tidak demikian.

### Kebutuhan pengunjung
- **Saya belum paham:** apa beda SLO dan NIDI?
- **Saya mau mengurus:** apa persyaratan dan tahapannya?
- **Saya ingin memastikan:** siapa penyedia jasa, apa legalitasnya, dan siapa pihak penerbit?
- **Saya ingin bertanya:** bagaimana menghubungi petugas dan memperoleh estimasi?

### Sasaran bisnis (hipotesis)
- Prospek konsultasi yang relevan, bukan sekadar klik WhatsApp.
- Mengurangi pertanyaan berulang dengan edukasi yang benar.
- Membangun kepercayaan lewat transparansi peran dan proses.

## 2. Struktur navigasi utama

| Urutan | Menu | Tujuan | Status |
|---|---|---|---|
| 1 | Beranda | Ringkasan nilai, proses, layanan, dan kontak | Disarankan |
| 2 | Layanan | Pintu masuk ke layanan yang terverifikasi | Bersyarat |
| 3 | Alur & Persyaratan | Tahapan pengurusan dan dokumen | Disarankan |
| 4 | Edukasi & FAQ | Artikel, istilah, dasar hukum, biaya | Disarankan |
| 5 | Tentang & Legalitas | Identitas usaha, peran, dan batas kewenangan | Wajib |
| 6 | Konsultasi | CTA ke kanal komunikasi terverifikasi | Bersyarat |

**Dropdown Layanan (usulan):**
- Pengurusan/Pendampingan SLO Tegangan Rendah — hanya bila sesuai legalitas dan ruang lingkup mitra.
- Pendampingan NIDI — hanya bila proses dan penanggung jawabnya jelas.
- Pasang Baru / Tambah Daya — **jangan ditampilkan sebagai layanan aktif** sebelum klien membuktikan cakupan operasionalnya; informasi umum dapat dimuat sebagai artikel edukasi.

**Perilaku navigasi:** desktop dan mobile harus memiliki urutan informasi konsisten, menu mudah dioperasikan dengan keyboard, label jelas, dan CTA tidak mengganggu akses konten.

## 3. Sitemap konseptual

```text
Beranda /
├── Layanan /layanan/
│   ├── SLO Tegangan Rendah /layanan/slo-tr/
│   └── Pendampingan NIDI /layanan/nidi/
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

### 4.5 Alur & Persyaratan (`/alur-dan-persyaratan/`)
- Pemilihan skenario: instalasi baru, sudah terpasang tetapi belum memiliki dokumen, atau kebutuhan lain.
- Langkah konseptual: instalasi → identitas instalasi/NIDI → permohonan SLO → pemeriksaan/pengujian → tindak lanjut → proses sertifikasi sesuai kewenangan.
- Checklist dokumen berdasarkan skenario, dengan penanda bahwa syarat final ditentukan oleh pihak berwenang.
- Penjelasan apa yang terjadi jika dokumen kurang atau instalasi perlu perbaikan.
- Tautan ke kanal resmi terkait dan bantuan konsultasi.

### 4.6 Edukasi & FAQ (`/edukasi/`)
**Kelompok topik:**
- Dasar: SLO, NIDI, LIT, DJK, PLN.
- Proses: persyaratan, inspeksi, pasang baru, tambah daya.
- Biaya: komponen biaya dan perbedaan biaya sertifikasi, jasa pendampingan, serta biaya PLN.
- Regulasi: ringkasan dengan tautan sumber resmi dan tanggal tinjauan.
- Keselamatan: pentingnya inspeksi dan instalasi yang memenuhi ketentuan.

**Artikel detail:** judul jelas, ringkasan, tanggal pembaruan, sumber primer, tautan layanan terkait, dan FAQ bila relevan. Hindari artikel SEO duplikatif berdasarkan kota tanpa cakupan layanan nyata.

### 4.7 Tentang & Legalitas (`/tentang-kami/`)
- Nama dan identitas badan usaha (setelah diverifikasi).
- Model bisnis yang sebenarnya: pendamping, kontraktor, LIT, atau kombinasi yang dibuktikan.
- Dokumen legal dan cakupan kewenangan yang boleh dipublikasikan.
- Identitas/ruang lingkup mitra bila ada persetujuan.
- Wilayah layanan aktual.
- Pernyataan tidak berafiliasi dengan PLN/ESDM kecuali ada bukti resmi.

### 4.8 Kontak (`/kontak/`)
- Kanal WhatsApp/telepon/email resmi yang sudah dikonfirmasi.
- Jam respons, wilayah layanan, dan ekspektasi tindak lanjut.
- Panduan tidak mengirim KTP/NIK atau dokumen sensitif melalui formulir publik sebelum kebijakan data disiapkan.

### 4.9 Kebijakan Privasi dan Syarat & Ketentuan
- **Privasi:** tujuan dan dasar pemrosesan, data yang dikumpulkan, pihak penerima, retensi, keamanan, serta cara menghubungi pengelola data.
- **Ketentuan:** cakupan layanan, batas tanggung jawab, proses pemeriksaan, pemisahan biaya jasa dan biaya pihak lain, komplain, pembatalan, dan refund bila relevan.
- Kedua halaman wajib ditinjau berdasarkan operasi aktual dan ketentuan hukum yang berlaku sebelum pengumpulan data pribadi.

## 5. Struktur footer

- Identitas dan kontak penyedia jasa yang terverifikasi.
- Tautan: Beranda, Layanan, Alur & Persyaratan, Edukasi, Tentang, Kontak.
- Tautan hukum: Kebijakan Privasi, Syarat & Ketentuan.
- Disclaimer yang disesuaikan dengan legalitas: “Situs ini bukan situs resmi PLN atau Kementerian ESDM. Pemeriksaan dan sertifikasi SLO dilakukan sesuai kewenangan lembaga terkait.”
- Tahun hak cipta dan nama usaha **setelah identitas dipastikan**.

## 6. Aturan konten dan konversi

1. **Tidak mengaku sebagai penerbit SLO** tanpa dasar kewenangan.
2. **Tidak menyatakan afiliasi PLN/ESDM** tanpa bukti.
3. **Tidak menjanjikan sertifikat instan atau pasti lolos**; inspeksi dan perbaikan tetap mungkin diperlukan.
4. **Tidak menampilkan tarif sebagai tarif resmi** tanpa verifikasi dasar dan tanggal berlaku.
5. **Tidak menyebut estimasi waktu sebagai jaminan** tanpa SOP dan pengecualian yang disetujui.
6. **CTA “Cek Kelayakan”** hanya boleh berarti pemeriksaan administratif awal, bukan penilaian teknis atau sertifikasi.
7. **Minimasi data:** tahap kontak awal cukup informasi non-sensitif yang diperlukan; proses dokumen membutuhkan kontrol keamanan tersendiri.
8. **Tidak membuat halaman layanan kosong** atau halaman kota yang tidak benar-benar terlayani.

## 7. Pertanyaan yang harus diputuskan sebelum final

- Apakah badan usaha klien merupakan LIT, instalatir/kontraktor, atau pendamping administrasi?
- Layanan mana yang dapat dibuktikan dan dioperasikan sekarang?
- Apakah fokus pelanggan hanya rumah tangga/TR atau termasuk bisnis dan industri?
- Wilayah layanan aktual?
- Apakah harga dipublikasikan, hanya estimasi, atau berdasarkan konsultasi?
- Siapa pemilik nomor WhatsApp dan siapa petugas penanggung jawab?
- Apakah dibutuhkan formulir online, atau cukup tautan konsultasi?
- Dokumen legal dan mitra mana yang diizinkan tampil publik?

## 8. Keputusan tahap ini

**Disusun:** arsitektur informasi website, navigasi, sitemap, tujuan halaman, dan aturan publikasi.

**Belum diputuskan:** struktur folder Astro, komponen, CMS, backend, styling, integrasi, implementasi, dan deployment.

**Gate:** review pemilik proyek → klarifikasi bisnis/legalitas → persetujuan struktur website → baru menerima petunjuk struktur Astro. Tidak ada kode yang dibuat berdasarkan dokumen ini.
