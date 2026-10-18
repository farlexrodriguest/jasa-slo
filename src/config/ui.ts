/**
 * Label antarmuka Jasa SLO.
 * Identitas dan kontak bisnis dikelola terpisah di config/site.ts.
 */
export const ui = {
  locale: 'id-ID',
  services: {
    readMore: 'Pelajari layanan',
    emptyList: 'Belum ada layanan yang ditampilkan.',
  },
  article: {
    readMore: 'Baca artikel',
    updatedLabel: 'Diperbarui',
    latestEyebrow: 'Wawasan ketenagalistrikan',
    latestHeading: 'Artikel dan panduan terbaru',
    latestDescription: 'Informasi untuk memahami instalasi, dokumen, dan proses terkait.',
    allArticlesLink: 'Lihat semua artikel',
    relatedHeading: 'Artikel terkait',
    relatedHeadingAlt: 'Artikel Terkait',
    relatedServiceHeading: 'Layanan terkait',
    empty: 'Belum ada artikel tersedia.',
    emptyList: 'Belum ada artikel tersedia.',
  },
  guide: {
    readMore: 'Baca panduan',
    eyebrow: 'Panduan',
    emptyList: 'Belum ada panduan tersedia.',
  },
  blocks: {
    checklistRequiredLabel: 'Diperlukan',
    documentMandatoryLabel: 'Wajib',
    noteDefaultTitles: {
      info: 'Informasi',
      success: 'Catatan',
      warning: 'Perlu diperhatikan',
      danger: 'Peringatan',
    },
  },
  dialog: {
    ariaLabel: 'Dialog',
    closeLabel: 'Tutup',
    menuLabel: 'Menu',
  },
  imagePanel: {
    ariaLabel: 'Ilustrasi layanan',
  },
  stats: {
    ariaLabel: 'Ringkasan statistik',
  },
  contact: {
    channelsHeading: 'Hubungi kami',
    whatsappLabel: 'WhatsApp',
    whatsappCta: 'Konsultasi via WhatsApp',
    phoneLabel: 'Telepon',
    addressHeading: 'Alamat',
    whatsappMessage: {
      header: 'Halo, saya ingin berkonsultasi mengenai layanan Jasa SLO.',
      name: 'Nama',
      company: 'Perusahaan',
      phone: 'Nomor telepon',
      service: 'Layanan',
      message: 'Pesan',
    },
    fields: {
      name: { label: 'Nama lengkap', placeholder: 'Nama Anda' },
      company: { label: 'Perusahaan / instansi', placeholder: 'Nama perusahaan atau instansi' },
      phone: { label: 'Nomor WhatsApp', placeholder: '08xxxxxxxxxx' },
      service: { label: 'Layanan yang dibutuhkan' },
      message: { label: 'Kebutuhan Anda', placeholder: 'Jelaskan jenis instalasi dan kebutuhan Anda' },
    },
    submitLabel: 'Kirim melalui WhatsApp',
    disclaimer: 'Informasi yang Anda isi digunakan untuk menyusun pesan konsultasi melalui WhatsApp.',
  },
} as const;
