export const navigation = {
  header: [
    { label: "Beranda", href: "/" },
    {
      label: "Layanan",
      children: [
        { label: "SLO Tegangan Rendah", href: "/layanan/slo-tr" },
        { label: "SLO Tegangan Menengah", href: "/layanan/slo-tm" },
        { label: "Pendampingan NIDI", href: "/layanan/nidi" },
        { label: "Layanan IUPTLS", href: "/layanan/iuptls" },
      ],
    },
    { label: "Alur & Persyaratan", href: "/alur-dan-persyaratan" },
    { label: "Edukasi & FAQ", href: "/edukasi" },
    { label: "Tentang & Legalitas", href: "/tentang-kami" },
  ],
  footer: {
    links: [
      { label: "Kebijakan Privasi", href: "/kebijakan-privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat-ketentuan" },
    ],
  },
  cta: { label: "Konsultasi WhatsApp", href: "https://wa.me/6281234567890" },
};
