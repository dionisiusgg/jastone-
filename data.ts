import { createClient } from "@/lib/supabase/server";
import type {
  Banner,
  Category,
  JastipEvent,
  Product,
  Testimonial,
} from "@/lib/types";

// Semua query dibungkus agar halaman publik tidak crash bila DB belum siap.
async function safe<T>(fn: () => PromiseLike<{ data: T | null; error: unknown }>, fallback: T): Promise<T> {
  try {
    const { data, error } = await fn();
    if (error) {
      console.error("[supabase]", error);
      return fallback;
    }
    return data ?? fallback;
  } catch (e) {
    console.error("[supabase]", e);
    return fallback;
  }
}

const PRODUCT_SELECT = "*, categories(name, slug), events(name, slug)";

export async function getCategories() {
  const sb = createClient();
  return safe<Category[]>(
    () => sb.from("categories").select("*").order("sort_order"),
    []
  );
}

export async function getEvents(opts?: { featured?: boolean }) {
  const sb = createClient();
  return safe<JastipEvent[]>(() => {
    let q = sb.from("events").select("*").order("start_date", { ascending: true });
    if (opts?.featured) q = q.eq("is_featured", true).neq("status", "closed");
    return q;
  }, []);
}

export async function getProducts(opts?: {
  categorySlug?: string;
  eventSlug?: string;
  featured?: boolean;
  limit?: number;
}) {
  const sb = createClient();
  return safe<Product[]>(async () => {
    let q = sb
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (opts?.featured) q = q.eq("is_featured", true);
    if (opts?.limit) q = q.limit(opts.limit);

    if (opts?.categorySlug) {
      const { data: cat } = await sb
        .from("categories")
        .select("id")
        .eq("slug", opts.categorySlug)
        .maybeSingle();
      if (!cat) return { data: [], error: null };
      q = q.eq("category_id", cat.id);
    }
    if (opts?.eventSlug) {
      const { data: ev } = await sb
        .from("events")
        .select("id")
        .eq("slug", opts.eventSlug)
        .maybeSingle();
      if (!ev) return { data: [], error: null };
      q = q.eq("event_id", ev.id);
    }
    return q as unknown as PromiseLike<{ data: Product[] | null; error: unknown }>;
  }, []);
}

export async function getTestimonials(limit?: number) {
  const sb = createClient();
  return safe<Testimonial[]>(() => {
    let q = sb
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    return q;
  }, []);
}

export async function getBanner() {
  const sb = createClient();
  const list = await safe<Banner[]>(
    () =>
      sb
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .limit(1),
    []
  );
  return list[0] ?? null;
}
