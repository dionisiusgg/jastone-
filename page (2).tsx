import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function count(table: string, filter?: (q: any) => any) {
  const sb = createClient();
  let q = sb.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [newOrders, orders, products, events, testimonials] = await Promise.all([
    count("order_requests", (q) => q.eq("status", "new")),
    count("order_requests"),
    count("products"),
    count("events"),
    count("testimonials"),
  ]);

  const stats = [
    { label: "Pesanan baru", value: newOrders, href: "/admin/orders", accent: true },
    { label: "Total pesanan", value: orders, href: "/admin/orders" },
    { label: "Produk", value: products, href: "/admin/products" },
    { label: "Event", value: events, href: "/admin/events" },
    { label: "Testimoni", value: testimonials, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-3xl text-forest">Dashboard</h1>
      <p className="mt-2 text-ink/60">Perubahan yang kamu simpan langsung tampil di situs publik.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`rounded-2xl p-6 ring-1 ring-forest/10 transition hover:shadow-lg ${
              s.accent ? "bg-gold text-forest-dark" : "bg-white"
            }`}
          >
            <p className="font-serif text-4xl">{s.value}</p>
            <p className="mt-1 text-sm opacity-70">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
