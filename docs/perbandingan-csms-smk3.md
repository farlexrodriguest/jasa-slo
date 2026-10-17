# Perbandingan workflow CSMS, SMK3-ISO, dan Konsultan SLF

**Tujuan:** mengambil praktik yang bermanfaat dari dua repositori referensi tanpa menyalin kompleksitas atau risiko yang tidak diperlukan.

> Ini adalah audit snapshot berdasarkan berkas pada branch default yang diperiksa pada 17 Oktober 2026. Daftar workflow dapat berubah setelah tanggal tersebut.

## 1. Temuan workflow yang benar-benar terlihat

### Jasa Perijinan CSMS
Repositori: https://github.com/arisciwek/jasa-perijinan-csms

- Menggunakan Astro 3, TypeScript, Tailwind CSS, dan konten Markdown.
- Memiliki pola relasi artikel–layanan melalui ID layanan, serta script sitemap yang dijalankan saat build.
- Direktori .github/workflows tidak ditemukan pada branch default saat diperiksa. Jadi, jangan menganggap repo ini memiliki GitHub Actions CI hanya berdasarkan dokumentasi build.
- Pedoman proyek menekankan build sukses, perubahan non-destruktif, dan penggunaan ulang komponen.

**Yang layak diadopsi:** hubungan artikel–layanan yang eksplisit, komponen reusable, dan build yang mudah dipahami.

### Jasa SMK3-ISO
Repositori: https://github.com/arisciwek/jasa-smk3-iso

- Menggunakan Astro 7 dan pengelolaan konten/data yang lebih terstruktur.
- Pada .github/workflows terdapat workflow untuk membuat dan memperbarui artikel serta halaman jasa SMK3/ISO secara terjadwal atau manual. Workflow konten memakai secret API, memiliki izin tulis ke repositori, lalu melakukan commit dan push.
- Build juga memiliki langkah pembaruan sitemap lastmod dan validasi keluaran SEO melalui script package.
- Dokumentasinya lebih rinci untuk SEO, structured data, aset SVG, aksesibilitas, dan perilaku navigasi.

**Yang layak diadopsi:** validasi otomatis yang jelas, pemeriksaan hasil build, dan aturan teknis yang terdokumentasi.

**Yang tidak boleh ditiru mentah-mentah:** otomasi AI yang langsung menulis dan mendorong konten ke branch utama. Pola ini memiliki risiko salah fakta, konten generik, perubahan tak diinginkan, dan penggunaan kredensial dengan izin tulis. Untuk Konsultan SLF, konten otomatis sebaiknya tetap melalui validasi ketat dan peninjauan sebelum dipublikasikan.

### Konsultan SLF
Repositori: https://github.com/skyforgged/konsultan-slf

- .github/workflows/build.yml menjalankan CI pada pull request dan push ke main: checkout, setup Node.js 22, npm ci, lalu npm run build.
- Hook .githooks/pre-commit yang dibuat proyek adalah otomasi lokal; ia berbeda dari GitHub Actions dan perlu diaktifkan di setiap clone melalui npm run hooks:install.
- Script pembaruan updatedDate membantu menjaga metadata konten, tetapi bukan pengganti CI. CI perlu memastikan hasil akhirnya tetap valid.

## 2. Perbandingan dan keputusan

| Aspek | CSMS | SMK3-ISO | Keputusan untuk Konsultan SLF |
|---|---|---|---|
| Relasi artikel–layanan | Relasi berbasis ID | Data dan komponen terstruktur | Pertahankan relasi berbasis ID yang tervalidasi |
| CI build | Workflow tidak ditemukan saat diperiksa | Build dan validasi SEO dijalankan melalui script proyek; workflow konten terjadwal juga ada | Pertahankan CI build pada PR dan push |
| Validasi SEO hasil build | Sitemap dibangkitkan saat build | Pembaruan sitemap dan validasi SEO | Perluas validasi output secara bertahap |
| Otomasi konten | Lebih manual | Workflow AI membuat/memperbarui konten dan push | Jangan auto-publish tanpa pemeriksaan |
| Kompleksitas | Relatif sederhana | Lebih banyak otomasi dan aturan | Tambah otomasi hanya jika ada manfaat dan tes yang jelas |
| Aset dan aksesibilitas | Pedoman dasar | Pedoman lebih rinci | Adopsi standar aset kontekstual dan audit aksesibilitas |
| Kualitas konten massal | Tetap perlu audit | Risiko duplikasi/generik tetap ada | Utamakan akurasi, manfaat, dan keunikan halaman |

**Kesimpulan:** SMK3-ISO memiliki pola otomasi yang lebih luas, tetapi itu tidak otomatis berarti semua workflow-nya lebih baik. Untuk proyek Konsultan SLF, pilihan terbaik adalah menggabungkan validasi teknis yang disiplin dengan arsitektur sederhana dan kontrol editorial yang ketat.

## 3. Workflow target Konsultan SLF

1. **Edit sumber** — ubah Markdown, data, komponen, atau aset di lokasi sumber; jangan mengedit hasil build sebagai sumber utama.
2. **Validasi lokal** — periksa frontmatter/schema, tanggal, tautan internal, keberadaan aset, metadata SEO, canonical, dan konsistensi relasi artikel–layanan.
3. **Metadata yang terkontrol** — perbarui updatedDate hanya untuk konten yang benar-benar berubah dan halaman listing yang memang terdampak; jangan mengubah tanggal hanya karena build.
4. **CI pada pull request dan push** — jalankan instalasi bersih dan build produksi; tambahkan checker khusus bila pemeriksaan tersebut belum tercakup oleh npm run build.
5. **Verifikasi hasil build** — pastikan rute yang dihasilkan, tautan internal, sitemap, canonical, metadata sosial, structured data, dan aset benar-benar tersedia pada output.
6. **Commit terukur** — satu tujuan per commit, pesan jelas, tanpa memasukkan output build ke Git kecuali ada alasan arsitektural yang disengaja.
7. **Audit kualitas bertahap** — tambah pemeriksaan duplikasi/kualitas konten, aksesibilitas, dan regresi UI berdasarkan risiko, bukan sekadar menambah jumlah workflow.

## 4. Prioritas implementasi

### Wajib
- Build produksi di CI.
- Pemeriksaan tautan internal dan aset.
- Validasi SEO pada output HTML, termasuk canonical, metadata sosial, structured data, dan sitemap.
- Validasi skema/frontmatter dan relasi konten.
- Pemeriksaan hasil yang gagal dengan exit code non-zero jika menemukan masalah penting.

### Otomatis, dengan batas yang jelas
- Pembaruan updatedDate saat konten berubah.
- Pengurutan artikel berdasarkan pubDate, bukan tanggal pembaruan.
- Pembangkitan sitemap dan pemeriksaan output.

### Bertahap
- Deteksi konten yang terlalu mirip.
- Audit aksesibilitas dan regresi UI.
- Pemeriksaan tautan eksternal dan validasi konten faktual yang sesuai sumber.

### Hindari
- Timestamp berubah pada setiap build.
- Membuat halaman massal dengan isi hampir sama.
- Workflow AI yang langsung mempublikasikan konten tanpa review.
- Memberi izin tulis repositori ke workflow yang tidak memerlukannya.
- Menyimpan output build ke Git tanpa kebutuhan yang jelas.

## 5. Catatan audit dan batasan

- Pemeriksaan ini membandingkan berkas konfigurasi, dokumentasi, script build, dan daftar workflow yang tersedia di branch default; ini bukan audit keamanan penuh terhadap semua workflow, secrets, atau riwayat eksekusi.
- Pada CSMS, endpoint direktori workflow tidak ditemukan saat pemeriksaan; hal itu menunjukkan tidak ada direktori tersebut pada branch default yang diperiksa, bukan bukti bahwa repo tidak pernah menggunakan CI eksternal.
- Pada Konsultan SLF, CI yang teridentifikasi menjalankan npm run build. Jangan menganggap semua checker yang disebut dalam rekomendasi sudah tersedia; periksa script yang benar-benar ada sebelum menandai setiap pemeriksaan sebagai terpenuhi.
- Catatan ini adalah rekomendasi teknis untuk tahap development, bukan pernyataan bahwa situs sudah siap produksi.

**Rekomendasi akhir:** pertahankan workflow build Konsultan SLF, perkuat pemeriksaan output secara terukur, dan jangan mengadopsi publikasi konten AI otomatis ke main. Sasaran utamanya adalah kualitas yang dapat diverifikasi dan pengembangan yang konsisten, bukan jumlah workflow terbanyak.
