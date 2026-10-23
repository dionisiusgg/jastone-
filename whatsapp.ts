import { z } from "zod";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285176727488";

export const requestSchema = z.object({
  customer_name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  event_name: z.string().trim().min(2, "Pilih atau isi nama event").max(120),
  product_name: z.string().trim().min(2, "Nama produk wajib diisi").max(160),
  brand: z.string().trim().max(80).optional().or(z.literal("")),
  variant: z.string().trim().max(80).optional().or(z.literal("")),
  quantity: z.coerce
    .number({ invalid_type_error: "Jumlah harus angka" })
    .int("Jumlah harus bilangan bulat")
    .min(1, "Minimal 1")
    .max(99, "Maksimal 99"),
  budget: z
    .union([z.coerce.number().min(0).max(1_000_000_000), z.literal("")])
    .optional(),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type RequestInput = z.infer<typeof requestSchema>;

export function formatRupiah(value: number | null | undefined) {
  if (value == null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildWhatsAppMessage(input: RequestInput) {
  const lines = [
    "Halo JASTONE, saya ingin request jastip:",
    "",
    `Nama: ${input.customer_name}`,
    `Event: ${input.event_name}`,
    `Produk: ${input.product_name}`,
  ];
  if (input.brand) lines.push(`Merek: ${input.brand}`);
  lines.push(`Ukuran/Shade: ${input.variant || "-"}`);
  lines.push(`Jumlah: ${input.quantity}`);
  if (input.budget !== "" && input.budget != null)
    lines.push(`Anggaran: ${formatRupiah(Number(input.budget))}`);
  lines.push(`Catatan: ${input.notes || "-"}`);
  lines.push("", "Terima kasih!");
  return lines.join("\n");
}

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generalWhatsAppUrl(text = "Halo JASTONE, saya ingin bertanya tentang layanan jastip.") {
  return buildWhatsAppUrl(text);
}

export function productWhatsAppUrl(p: {
  name: string;
  brand: string;
  event?: string | null;
}) {
  const msg = [
    "Halo JASTONE, saya tertarik memesan produk ini:",
    "",
    `Produk: ${p.name}`,
    `Merek: ${p.brand}`,
    p.event ? `Event: ${p.event}` : null,
    "Ukuran/Shade: ",
    "Jumlah: 1",
    "Catatan: ",
  ]
    .filter((l) => l !== null)
    .join("\n");
  return buildWhatsAppUrl(msg);
}
