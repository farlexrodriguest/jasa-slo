/**
 * Resolusi relasi layanan.
 *
 * Artikel menunjuk layanan lewat `relatedType`/`relatedId` (pola konsultan-slf).
 * Satu resolusi ini dipakai bersama oleh footer (tagline kontekstual) dan CTA
 * layanan di halaman artikel, sehingga keduanya selalu sejalan.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Cari layanan aktif yang ditunjuk `relatedType`/`relatedId`.
 * Mengembalikan `null` bila relasi tidak ada, bukan bertipe `service`, atau
 * layanan tidak ditemukan / masih draft / tidak aktif.
 */
export async function relatedService(
  relatedType?: string,
  relatedId?: number,
): Promise<CollectionEntry<'services'> | null> {
  if (relatedType !== 'service' || !relatedId) return null;
  const services = await getCollection('services');
  return (
    services.find(
      (s) => s.data.id === relatedId && !s.data.draft && s.data.status === 'active',
    ) ?? null
  );
}
