import ResourceManager from "@/components/admin/ResourceManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminBanners() {
  const { data } = await createClient().from("banners").select("*").order("sort_order");
  return (
    <ResourceManager
      table="banners"
      title="Banner Hero"
      singular="Banner"
      imageFolder="banners"
      orderBy={{ column: "sort_order" }}
      initialRows={(data ?? []) as any}
      defaults={{ is_active: true }}
      columns={[
        { key: "image_url", label: "Gambar", kind: "image" },
        { key: "title", label: "Judul" },
        { key: "sort_order", label: "Urutan" },
        { key: "is_active", label: "Aktif", kind: "bool" },
      ]}
      fields={[
        { name: "title", label: "Judul", type: "text", required: true },
        { name: "subtitle", label: "Subjudul", type: "textarea" },
        { name: "cta_label", label: "Teks tombol", type: "text" },
        { name: "cta_href", label: "Tautan tombol", type: "text", hint: "Contoh: /request atau /events" },
        { name: "sort_order", label: "Urutan (terkecil tampil di beranda)", type: "number" },
        { name: "image_url", label: "Gambar latar", type: "image" },
        { name: "is_active", label: "Aktif", type: "checkbox" },
      ]}
    />
  );
}
