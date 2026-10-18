/**
 * Menghitung estimasi waktu baca dalam menit berdasarkan jumlah kata.
 * Rata-rata kecepatan baca orang dewasa: 200-250 kata per menit.
 */
export function readingTime(blocks: any[]): number {
  if (!blocks || !Array.isArray(blocks)) return 0;
  
  let totalText = '';
  
  blocks.forEach(block => {
    // Ekstrak teks dari blok 'section'
    if (block.component === 'section' && block.content) {
      block.content.forEach((item: any) => {
        if (item.type === 'p' && item.text) totalText += ' ' + item.text;
        if (item.type === 'list' && item.items) totalText += ' ' + item.items.join(' ');
      });
    }
    // Ekstrak teks dari blok 'note'
    if (block.component === 'note' && block.text) totalText += ' ' + block.text;
    // Ekstrak teks dari blok 'card' (body nested blocks)
    if (block.component === 'card' && block.body) {
      // Rekursif jika perlu, tapi untuk sekarang cukup surface level
    }
  });

  const words = totalText.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 225); // Menggunakan standar 225 wpm
  
  return minutes > 0 ? minutes : 1;
}
