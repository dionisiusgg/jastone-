import Image from "next/image";
import Link from "next/link";
import type { Category, JastipEvent, Product, Testimonial } from "@/lib/types";
import { EVENT_STATUSES } from "@/lib/types";
import { FALLBACK_IMAGE, formatDateRange } from "@/lib/format";
import { formatRupiah, productWhatsAppUrl } from "@/lib/whatsapp";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl text-forest sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-ink/70">{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className="text-sm font-medium text-forest underline decoration-gold underline-offset-8 hover:text-gold">
          {action.label} →
        </Link>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <section className="bg-forest text-cream">
      <div className="container-wide py-16 sm:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl">{title}</h1>
        {subtitle && <p className="mt-5 max-w-2xl text-cream/75">{subtitle}</p>}
      </div>
    </section>
  );
}

export function EmptyState({ title, text, href, cta }: { title: string; text: string; href?: string; cta?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-forest/25 bg-white/60 px-6 py-14 text-center">
      <p className="font-serif text-xl text-forest">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">{text}</p>
      {href && cta && (
        <Link href={href} className="btn-outline mt-6">
          {cta}
        </Link>
      )}
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-forest/10 transition duration-500 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
        <Image
          src={product.image_url || FALLBACK_IMAGE}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {product.categories?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-forest">
            {product.categories.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-gold">{product.brand}</p>
        <h3 className="mt-1 text-lg text-forest">{product.name}</h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm text-ink/65">{product.description}</p>
        )}
        {product.events?.name && (
          <p className="mt-2 text-xs text-ink/50">Event: {product.events.name}</p>
        )}
        <div className="mt-auto pt-5">
          <p className="text-xs text-ink/50">Harga referensi</p>
          <p className="font-serif text-xl text-forest">{formatRupiah(product.reference_price)}</p>
          <a
            href={productWhatsAppUrl({
              name: product.name,
              brand: product.brand,
              event: product.events?.name,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 w-full"
          >
            Pesan via WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: JastipEvent }) {
  const status = EVENT_STATUSES.find((s) => s.value === event.status)?.label ?? event.status;
  const badge =
    event.status === "open"
      ? "bg-gold text-forest-dark"
      : event.status === "upcoming"
        ? "bg-cream text-forest"
        : "bg-ink/70 text-cream";
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-forest/10 transition duration-500 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image_url || FALLBACK_IMAGE}
          alt={event.name}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${badge}`}>
          {status}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl text-forest">{event.name}</h3>
        <p className="mt-2 text-sm text-gold">{formatDateRange(event.start_date, event.end_date)}</p>
        <p className="text-sm text-ink/60">{event.location}</p>
        {event.description && <p className="mt-3 line-clamp-3 text-sm text-ink/70">{event.description}</p>}
        <div className="mt-5 flex gap-3">
          {event.status !== "closed" ? (
            <Link href={`/request?event=${encodeURIComponent(event.name)}`} className="btn-primary !px-5 !py-2.5">
              Titip di event ini
            </Link>
          ) : (
            <span className="text-sm text-ink/50">Pemesanan ditutup</span>
          )}
          <Link href={`/products?event=${event.slug}`} className="btn-outline !px-5 !py-2.5">
            Lihat produk
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
    >
      <Image
        src={category.image_url || FALLBACK_IMAGE}
        alt=""
        fill
        sizes="(min-width:1024px) 20vw, (min-width:640px) 33vw, 50vw"
        className="object-cover transition duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/20 to-transparent" />
      <div className="absolute bottom-0 p-5 text-cream">
        <h3 className="text-xl">{category.name}</h3>
        <span className="text-xs uppercase tracking-widest text-gold-light">Lihat koleksi →</span>
      </div>
    </Link>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold" role="img" aria-label={`${rating} dari 5 bintang`}>
      {"★".repeat(rating)}
      <span className="text-gold/25">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-white p-7 shadow-sm ring-1 ring-forest/10">
      <Stars rating={t.rating} />
      <blockquote className="mt-4 flex-1 text-ink/80">“{t.content}”</blockquote>
      <figcaption className="mt-5 font-serif text-forest">{t.customer_name}</figcaption>
    </figure>
  );
}
