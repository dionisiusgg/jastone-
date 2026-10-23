"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Pesanan" },
  { href: "/admin/products", label: "Produk" },
  { href: "/admin/categories", label: "Kategori" },
  { href: "/admin/events", label: "Event" },
  { href: "/admin/testimonials", label: "Testimoni" },
  { href: "/admin/banners", label: "Banner" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside className="bg-forest-dark text-cream lg:min-h-screen lg:w-60 lg:shrink-0">
      <div className="flex items-center justify-between px-5 py-4 lg:block lg:py-8">
        <Link href="/admin" className="font-serif text-2xl font-bold">
          JAS<span className="text-gold">TONE</span>
          <span className="ml-2 text-xs font-sans font-normal text-cream/50">Admin</span>
        </Link>
        <button onClick={logout} className="text-xs text-gold-light underline lg:hidden">Keluar</button>
      </div>
      <nav aria-label="Menu admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3 lg:pb-0">
        {items.map((i) => {
          const active = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          return (
            <Link
              key={i.href}
              href={i.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-sm transition ${
                active ? "bg-gold text-forest-dark" : "text-cream/80 hover:bg-forest"
              }`}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden px-5 py-8 text-xs text-cream/60 lg:block">
        <p className="truncate">{email}</p>
        <button onClick={logout} className="mt-2 text-gold-light underline">Keluar</button>
        <Link href="/" target="_blank" className="mt-3 block text-cream/70 hover:text-gold">Lihat situs ↗</Link>
      </div>
    </aside>
  );
}
