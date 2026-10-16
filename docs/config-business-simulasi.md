# Konfigurasi Bisnis — Simulasi (Draft)

**Status:** Simulasi awal, belum final. Akan dipindahkan ke `src/config/site.ts` saat Astro siap.
**Tujuan:** Satu sumber kebenaran untuk identitas, kontak, layanan, wilayah, dan navigasi.

---

## 1. Identitas Usaha

| Field | Nilai (simulasi) | Keterangan |
|---|---|---|
| Nama usaha | [ISI NAMA USAHA] | Belum diisi — klien tentukan |
| Model bisnis | Konsultan | Berdasarkan jawaban Q1 |
| Domain | [ISI DOMAIN] | Belum diisi |
| Telepon/WhatsApp | [ISI NOMOR] | Kanal utama (Q8) |
| Email | [ISI EMAIL] | Kanal utama (Q8) |
| Alamat kantor | [ISI ALAMAT] | Jawa (Q5) |
| Jam layanan | [ISI JAM LAYANAN] | Belum diisi |
| Tahun berdiri | [ISI TAHUN] | Belum diisi |

---

## 2. Legalitas & Mitra

| Field | Nilai | Keterangan |
|---|---|---|
| Jenis izin | IUPTLS | Berdasarkan jawaban Q3 |
| Bukti legalitas | Ada, akan diberikan | Q2 — menunggu dokumen |
| SBU | [ISI STATUS] | Belum diverifikasi |
| Mitra LIT | [ISI MITRA] | Belum diisi |
| Afiliasi ESDM/PLN | Tidak ada | Wajib disclaimer |

---

## 3. Layanan

| Layanan | Status | Keterangan |
|---|---|---|
| SLO Tegangan Rendah (TR) | Aktif | Q4 — TR dan TM |
| SLO Tegangan Menengah (TM) | Aktif | Q4 — TR dan TM |
| Pendampingan NIDI | Aktif | Q3 |
| Konsultasi | Aktif | Q8 — WA dan email |

**Wilayah layanan:** Jawa (Q5)
**Batas daya/tegangan:** TR dan TM (Q4)

---

## 4. Kanal Komunikasi

| Kanal | Detail | Status |
|---|---|---|
| WhatsApp | [ISI NOMOR] | Aktif (Q8) |
| Email | [ISI EMAIL] | Aktif (Q8) |
| Formulir online | Belum ada | Q8 — cukup WA & email |

---

## 5. Navigasi (referensi dari struktur-website-slo.md)

1. Beranda
2. Layanan → SLO TR, SLO TM, Pendampingan NIDI
3. Alur & Persyaratan
4. Edukasi & FAQ
5. Tentang & Legalitas
6. Konsultasi (CTA)

---

## 6. Disclaimer Wajib

> Situs ini bukan situs resmi PLN atau Kementerian ESDM. Pemeriksaan dan sertifikasi SLO dilakukan sesuai kewenangan lembaga terkait. Penyedia jasa ini berperan sebagai konsultan pendamping, bukan penerbit SLO.

---

## 7. Catatan Belum Diverifikasi

- [ ] Nama usaha resmi
- [ ] Nomor telepon/WhatsApp pemilik
- [ ] Alamat kantor
- [ ] Dokumen legalitas (SBU, izin, akreditasi LIT)
- [ ] Identitas mitra LIT
- [ ] Jam layanan operasional
- [ ] Harga/estimasi (Q7 — belum ada, perlu dibuatkan)
- [ ] SOP kegagalan inspeksi, pembatalan, refund, komplain (Q11 — perlu dibuatkan)
- [ ] KPI target (Q12 — perlu dibuatkan)