export function formatDateRange(start: string | null, end: string | null) {
  const fmt = (d: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(d));
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `Mulai ${fmt(start)}`;
  return "Jadwal menyusul";
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";
