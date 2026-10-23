import type { Metadata } from "next";
import { getTestimonials } from "@/lib/data";
import { EmptyState, PageHero, SectionHeading, TestimonialCard } from "@/components/ui";

export const metadata: Metadata = {
  title: "Testimoni & FAQ",
  description: "Ulasan pelanggan JASTONE dan pertanyaan yang sering diajukan.",
};
export const dynamic = "force-dynamic";

const faqs = [
  { q: "Bagaimana cara memesan?", a: "Isi formulir Request Jastip atau pilih produk dari katalog. Setelah itu WhatsApp terbuka dengan pesan otomatis yang tinggal kamu kirim." },
  { q: "Berapa fee jasa?", a: "Fee ditentukan per produk dan dijelaskan di awal sebelum kamu membayar. Tidak ada biaya tersembunyi." },
  { q: "Kapan saya membayar?", a: "Setelah kami mengonfirmasi ketersediaan dan rincian harga, dan kamu menyetujuinya." },
  { q: "Bagaimana jika barang habis?", a: "Kami langsung mengabari, menawarkan alternatif, atau mengembalikan dana sesuai kesepakatan." },
  { q: "Apakah harga di katalog pasti?", a: "Harga di katalog adalah referensi. Harga final mengikuti harga di event saat pembelian." },
  { q: "Apakah bisa titip produk yang tidak ada di katalog?", a: "Bisa. Gunakan formulir Request Jastip dan tulis produk yang kamu incar dari event yang tersedia." },
  { q: "Berapa lama pengiriman?", a: "Barang dikirim setelah event berakhir atau setelah pembelian selesai. Estimasi tergantung ekspedisi dan lokasi tujuan." },
];

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <>
      <PageHero eyebrow="Testimoni & FAQ" title="Dipercaya para pemburu sale" />
      <div className="container-wide py-16">
        <SectionHeading eyebrow="Testimoni" title="Ulasan pelanggan" />
        {testimonials.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada testimoni" text="Ulasan pelanggan akan tampil di sini." />
        )}

        <div className="mt-20 max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Pertanyaan umum" />
          <div className="divide-y divide-forest/15 border-y border-forest/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-serif text-lg text-forest">
                  {f.q}
                  <span className="ml-4 text-gold transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
