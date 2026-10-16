# Brief Permintaan Pembuatan Dokumentasi Struktur Website & File Astro

**Proyek:** jasa-slo  
**Tanggal:** 17 Oktober 2026  
**Status:** Menunggu Eksekusi  

---

## Deskripsi Tugas

Mohon buatkan dokumen spesifikasi/draf bernama `docs/struktur-website-slo.md` yang memuat perancangan **struktur file project Astro 5** dan **navigasi/menu website** berdasarkan hasil riset domain SLO ESDM (`docs/riset-domain-slo-esdm.md`).

---

## Persyaratan Isi Dokumen

### 1. Struktur Navigasi & Menu Website
- **Header / Navigation Bar:**
  - Beranda
  - Layanan (Dropdown: Pengurusan SLO TR, Pendampingan NIDI, Tambah Daya / Pasang Baru)
  - Alur & Persyaratan (Langkah SI UJANG GATRIK, Checklist Dokumen)
  - Edukasi / FAQ (Perbedaan NIDI vs SLO, Dasar Hukum, Simulasi Biaya)
  - Tentang & Legalitas (Peran Usaha, Disclaimer Afiliasi ESDM/PLN)
  - CTA Utama (Konsultasi WhatsApp / Cek Kelayakan)
- **Footer Navigation:**
  - Link Layanan & Navigasi Utama
  - Disclaimer Legalitas (Bukan penerbit langsung SLO / Bukan PLN / Tanpa Afiliasi ESDM)
  - Kebijakan Privasi & Syarat Ketentuan

### 2. Arsitektur File & Folder Astro 5
- Pola folder `src/` standar Astro:
  - `src/pages/` (Routing halaman static/SSR)
  - `src/components/` (UI components: Header, Footer, Hero, ServiceCard, FAQAccordion, Disclaimer)
  - `src/layouts/` (Layout.astro, BaseLayout.astro)
  - `src/content/` (Astro Content Collections untuk FAQ, Artikel Edukasi, Layanan)
  - `src/styles/` (Tailwind CSS / global styles)

### 3. Pemetaan Halaman (Sitemap Blueprint)
- `/` (Beranda)
- `/layanan/slo-tr`
- `/layanan/nidi`
- `/layanan/pasang-baru-tambah-daya`
- `/alur-dan-persyaratan`
- `/edukasi/` & `/edukasi/[slug]`
- `/tentang-kami`
- `/kebijakan-privasi`

---

## Instruksi Lanjutan
Setelah dokumen `docs/struktur-website-slo.md` dibuat, beritahu untuk dilakukan review ulang sebelum masuk ke tahap eksekusi.
