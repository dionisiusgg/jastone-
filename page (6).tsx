import ResourceManager from "@/components/admin/ResourceManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const sb = createClient();
  const [{ data: rows }, { data: cats }, { data: evs }] = await Promise.all([
    sb.from("products").select("*").order("created_at", { ascending: false }),
    sb.from("categories").select("id,name").order("sort_order"),
    sb.from("events").select("id,name").order("start_date"),
  ]);

  return (
    <ResourceManager
      table="products"
      title="Produk"
      singular="Produk"
      slugFrom="name"
      imageFolder="products"
      orderBy={{ column: "created_at", ascending: false }}
      initialRows={(rows ?? []) as any}
      defaults={{ is_active: true }}
      columns={[
        { key: "image_url", label: "Foto", kind: "image" },
        { key: "name", label: "Nama" },
        { key: "brand", label: "Merek" },
        { key: "reference_price", label: "Harga", kind: "money" },
        { key: "category_id", label: "Kategori", kind: "select" },
        { key: "is_featured", label: "Pilihan", kind: "bool" },
        { key: "is_active", label: "Aktif", kind: "bool" },
      ]}
      fields={[
        { name: "name", label: "Nama produk", type: "text", required: true },
        { name: "brand", label: "Merek", type: "text", required: true },
        {
          name: "category_id",
          label: "Kategori",
          type: "select",
          options: (cats ?? []).map((c) => ({ value: c.id, label: c.name })),
        },
        {
          name: "event_id",
          label: "Event",
          type: "select",
          options: (evs ?? []).map((e) => ({ value: e.id, label: e.name })),
        },
        { name: "reference_price", label: "Harga referensi (Rp)", type: "number", required: true },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "image_url", label: "Foto produk", type: "image" },
        { name: "is_featured", label: "Tampilkan sebagai produk pilihan", type: "checkbox" },
        { name: "is_active", label: "Aktif (tampil di katalog)", type: "checkbox" },
      ]}
    />
  );
}
