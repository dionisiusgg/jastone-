"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/products", label: "Katalog" },
  { href: "/about", label: "Tentang" },
  { href: "/testimonials", label: "Testimoni & FAQ" },
  { href: "/contact", label: "Kontak" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-forest/10 bg-cream/90 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-forest">
          JAS<span className="text-gold">TONE</span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-8 lg:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition hover:text-gold ${
                  active ? "font-medium text-forest underline decoration-gold underline-offset-8" : "text-forest/70"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/request" className="btn-primary hidden !py-2 sm:inline-flex">
            Request Jastip
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-forest lg:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Navigasi mobile" className="border-t border-forest/10 bg-cream lg:hidden">
          <div className="container-wide flex flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-forest/5 py-3 text-forest"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/request" onClick={() => setOpen(false)} className="btn-primary mt-4">
              Request Jastip
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
