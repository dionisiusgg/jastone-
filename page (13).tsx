import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getEvents, getProducts } from "@/lib/data";
import { EmptyState, PageHero, ProductCard } from "@/components/ui";

export const metadata: Metadata = {
  title: "Katalog Produk",
  description: "Katalog sepatu, fashion, tas & aksesori, makeup, dan skincare yang bisa dititipkan.",
};
export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; event?: string };
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const event = typeof searchParams.event === "string" ? searchParams.event : undefined;

  const [categories, events, products] = await Promise.all([
    getCategories(),
    getEvents(),
    getProducts({ categorySlug: category, eventSlug: event }),
  ]);

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm transition ${
      active ? "border-forest bg-forest text-cream" : "border-forest/25 text-forest hover:border-forest"
    }`;
  const href = (c?: string, e?: string) => {
    const p = new URLSearchParams();
    if (c) p.set("category", c);
    if (e) p.set("event", e);
    const qs = p.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Koleksi yang bisa kami belikan"
        subtitle="Harga referensi bersifat perkiraan dan dapat berbeda saat pembelian di event."
      />
      <div className="container-wide py-12">
        <div className="flex flex-wrap gap-2" aria-label="Filter kategori">
          <Link href={href(undefined, event)} className={chip(!category)}>Semua</Link>
          {categories.map((c) => (
            <Link key={c.id} href={href(c.slug, event)} className={chip(category === c.slug)} aria-current={category === c.slug ? "true" : undefined}>
              {c.name}
            </Link>
          ))}
        </div>
        {events.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Filter event">
            <Link href={href(category)} className={chip(!event)}>Semua event</Link>
            {events.map((e) => (
              <Link key={e.id} href={href(category, e.slug)} className={chip(event === e.slug)}>
                {e.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          {products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Produk tidak ditemukan"
              text="Belum ada produk untuk filter ini. Kamu tetap bisa request produk apa pun lewat formulir."
              href="/request"
              cta="Request Jastip"
            />
          )}
        </div>
      </div>
    </>
  );
}
