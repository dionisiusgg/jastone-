import Link from "next/link";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest-dark text-cream">
      <div className="container-wide grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-serif text-3xl font-bold">
            JAS<span className="text-gold">TONE</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/70">
            Personal shopper untuk event, sale, dan pameran besar. Kamu pilih produknya, kami yang
            berburu dan mengirimkannya ke rumahmu.
          </p>
          <a
            href={generalWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-6"
          >
            Chat WhatsApp
          </a>
        </div>
        <div>
          <p className="eyebrow">Jelajahi</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link className="hover:text-gold" href="/events">Events</Link></li>
            <li><Link className="hover:text-gold" href="/products">Katalog Produk</Link></li>
            <li><Link className="hover:text-gold" href="/request">Request Jastip</Link></li>
            <li><Link className="hover:text-gold" href="/about">Tentang Kami</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Bantuan</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li><Link className="hover:text-gold" href="/testimonials">Testimoni & FAQ</Link></li>
            <li><Link className="hover:text-gold" href="/contact">Kontak</Link></li>
            <li>WhatsApp: 0851-7672-7488</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} JASTONE. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
