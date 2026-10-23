import ResourceManager from "@/components/admin/ResourceManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCategories() {
  const { data } = await createClient().from("categories").select("*").order("sort_order");
  return (
    <ResourceManager
      table="categories"
      title="Kategori"
      singular="Kategori"
      slugFrom="name"
      imageFolder="categories"
      orderBy={{ column: "sort_order" }}
      initialRows={(data ?? []) as any}
      columns={[
        { key: "image_url", label: "Gambar", kind: "image" },
        { key: "name", label: "Nama" },
        { key: "sort_order", label: "Urutan" },
      ]}
      fields={[
        { name: "name", label: "Nama kategori", type: "text", required: true },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "sort_order", label: "Urutan tampil", type: "number" },
        { name: "image_url", label: "Gambar", type: "image" },
      ]}
    />
  );
}
