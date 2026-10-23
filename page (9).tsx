import Image from "next/image";
import Link from "next/link";
import { getBanner, getCategories, getEvents, getProducts, getTestimonials } from "@/lib/data";
import {
  CategoryCard,
  EmptyState,
  EventCard,
  ProductCard,
  SectionHeading,
  TestimonialCard,
} from "@/components/ui";
import { FALLBACK_IMAGE } from "@/lib/format";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

const steps = [
  { n: "01", t: "Pilih event & produk", d: "Telusuri katalog atau kirim request untuk produk incaranmu dari event yang sedang berlangsung." },
  { n: "02", t: "Konfirmasi via WhatsApp", d: "Kami cek ketersediaan, harga, dan fee jasa, lalu kirim rincian sebelum kamu membayar." },
  { n: "03", t: "Kami berburu di lokasi", d: "Tim JASTONE datang langsung, antre, memilih ukuran/shade, dan mengirim foto bukti pembelian." },
  { n: "04", t: "Terima di rumah", d: "Barang dikemas rapi dan dikirim ke alamatmu dengan nomor resi." },
];

export default async function HomePage() {
  const [banner, events, categories, products, testimonials] = await Promise.all([
    getBanner(),
    getEvents({ featured: true }),
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getTestimonials(3),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-dark text-cream">
        <Image
          src={banner?.image_url || FALLBACK_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-35"
        />
        <div className="container-wide py-24 sm:py-36 lg:py-44">
          <p className="eyebrow animate-fadeUp">Personal Shopper · Event & Sale</p>
          <h1 className="mt-5 max-w-4xl animate-fadeUp text-5xl leading-[1.05] sm:text-7xl">
            {banner?.title || "Belanja event tanpa antre"}
          </h1>
          <p className="mt-6 max-w-xl animate-fadeUp text-lg text-cream/80">
            {banner?.subtitle ||
              "Titip sepatu, fashion, tas, makeup, dan skincare dari event besar. Kami yang berburu, kamu terima beres."}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 animate-fadeUp">
            <Link href={banner?.cta_href || "/request"} className="btn-gold">
              {banner?.cta_label || "Request Jastip"}
            </Link>
            <Link href="/events" className="btn border border-cream/40 text-cream hover:bg-cream hover:text-forest">
              Lihat Event
            </Link>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="container-wide pt-24">
        <SectionHeading
          eyebrow="Event Unggulan"
          title="Event yang sedang kami buru"
          subtitle="Pesanan dibuka sebelum event dimulai. Kuota terbatas per event."
          action={{ href: "/events", label: "Semua event" }}
        />
        {events.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada event aktif" text="Event baru akan segera diumumkan. Hubungi kami untuk request khusus." href="/request" cta="Request Jastip" />
        )}
      </section>

      {/* Categories */}
      <section className="container-wide pt-24">
        <SectionHeading eyebrow="Kategori" title="Apa yang bisa dititipkan" />
        {categories.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        ) : (
          <EmptyState title="Kategori belum tersedia" text="Kategori produk akan tampil di sini." />
        )}
      </section>

      {/* Featured products */}
      <section className="container-wide pt-24">
        <SectionHeading
          eyebrow="Produk Pilihan"
          title="Incaran favorit pelanggan"
          action={{ href: "/products", label: "Lihat katalog" }}
        />
        {products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada produk pilihan" text="Produk akan tampil setelah ditambahkan admin." />
        )}
      </section>

      {/* How it works */}
      <section className="mt-24 bg-forest text-cream">
        <div className="container-wide py-20">
          <p className="eyebrow">Cara Kerja</p>
          <h2 className="mt-2 max-w-2xl text-3xl sm:text-4xl">Empat langkah, tanpa perlu datang ke event</h2>
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="border-t border-gold/60 pt-5">
                <span className="font-serif text-4xl text-gold">{s.n}</span>
                <h3 className="mt-3 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-wide pt-24">
        <SectionHeading
          eyebrow="Testimoni"
          title="Kata mereka yang sudah titip"
          action={{ href: "/testimonials", label: "Semua testimoni" }}
        />
        {testimonials.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        ) : (
          <EmptyState title="Belum ada testimoni" text="Jadilah pelanggan pertama kami." />
        )}
      </section>

      {/* CTA */}
      <section className="container-wide pt-24">
        <div className="rounded-3xl bg-gold px-8 py-14 text-center text-forest-dark sm:px-16">
          <h2 className="text-3xl sm:text-5xl">Ada produk yang kamu incar?</h2>
          <p className="mx-auto mt-4 max-w-xl text-forest-dark/80">
            Isi formulir request atau langsung chat kami. Respons biasanya dalam hitungan jam.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/request" className="btn-primary">Isi Formulir Request</Link>
            <a href={generalWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn border border-forest-dark/40 hover:bg-forest-dark hover:text-cream">
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
