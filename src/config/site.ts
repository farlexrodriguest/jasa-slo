/**
 * Identitas dan data bisnis Jasa SLO.
 *
 * ⚠️  DATA SIMULASI — seluruh nilai identitas di bawah ini (nama badan usaha,
 * nomor telepon, alamat, tautan, dan nomor legal) adalah DATA CONTOH yang
 * direkayasa untuk keperluan pengembangan dan pengujian tahap berikutnya.
 * Bukan data resmi. Ganti dengan data sebenarnya sebelum situs dipublikasikan.
 *
 * Sumber kebenaran konten layanan & artikel adalah content collection
 * (src/content/**), bukan array `services` di bawah ini — array tersebut
 * disimpan hanya sebagai cadangan/ringkasan.
 */
export const site = {
  // ── Identitas ──────────────────────────────────────────────────────────
  name: "Jasa SLO", // nama merek (simulasi)
  legalName: "PT Jasa Slo Nusantara", // badan usaha legal (simulasi)
  model: "Konsultan",
  foundedYear: 2019, // simulasi
  domain: "jasa-slo.com", // simulasi

  // ── Kontak ─────────────────────────────────────────────────────────────
  contact: {
    whatsapp: "+6281234567890", // simulasi
    whatsappDisplay: "+62 812-3456-7890", // simulasi
    phone: "+622155501234", // simulasi — telepon kantor (non-WA)
    phoneDisplay: "(021) 5550-1234", // simulasi
    email: "info@jasa-slo.com", // simulasi
    address:
      "Gedung Nusantara Energi, Jl. Kramat Raya No. 88, Senen, Jakarta Pusat, DKI Jakarta 10450", // simulasi
    mapUrl: "https://maps.google.com/?q=Jl.+Kramat+Raya+No.+88+Jakarta+Pusat", // simulasi
  },

  // ── Media sosial ───────────────────────────────────────────────────────
  social: {
    instagram: "https://instagram.com/jasaslo", // simulasi
    linkedin: "https://linkedin.com/company/jasaslo", // simulasi
  },

  // ── Identitas legal ────────────────────────────────────────────────────
  legal: {
    npwp: "01.234.567.8-901.000", // simulasi
    nib: "9120001234567", // simulasi
  },

  // ── Copy footer (simulasi) ─────────────────────────────────────────────
  // Sumber tunggal copy footer; `disclaimer` di bawah dipakai sebagai nota hukum.
  footer: {
    eyebrow: "Informasi & pendampingan kelistrikan",
    tagline: "Langkah yang jelas dimulai dari informasi yang tepat.",
  },

  // ── Ringkasan layanan (cadangan; sumber utama = content collection) ────
  services: [
    { id: "slo-tr", name: "SLO Tegangan Rendah", active: true },
    { id: "slo-tm", name: "SLO Tegangan Menengah", active: true },
    { id: "nidi", name: "Pendampingan NIDI", active: true },
    { id: "iuptls", name: "Layanan IUPTLS", active: true },
    { id: "uji-panel-cubicle", name: "Pengujian Panel Cubicle", active: true },
    { id: "uji-trafo", name: "Pengujian Trafo Listrik", active: true },
  ],
  regions: ["Jawa"],
  disclaimer:
    "Situs ini bukan situs resmi PLN atau Kementerian ESDM. Pemeriksaan dan sertifikasi SLO dilakukan sesuai kewenangan lembaga terkait. Penyedia jasa ini berperan sebagai konsultan pendamping, bukan penerbit SLO.",
};

/** Nama yang ditampilkan sebagai badan usaha: pakai legalName bila ada. */
export const legalDisplayName = site.legalName || site.name;
