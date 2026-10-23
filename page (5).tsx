import ResourceManager from "@/components/admin/ResourceManager";
import { createClient } from "@/lib/supabase/server";
import { EVENT_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminEvents() {
  const { data } = await createClient().from("events").select("*").order("start_date");
  return (
    <ResourceManager
      table="events"
      title="Event"
      singular="Event"
      slugFrom="name"
      imageFolder="events"
      orderBy={{ column: "start_date" }}
      initialRows={(data ?? []) as any}
      defaults={{ status: "upcoming" }}
      columns={[
        { key: "image_url", label: "Gambar", kind: "image" },
        { key: "name", label: "Nama" },
        { key: "location", label: "Lokasi" },
        { key: "start_date", label: "Mulai", kind: "date" },
        { key: "end_date", label: "Selesai", kind: "date" },
        { key: "status", label: "Status", kind: "select" },
        { key: "is_featured", label: "Unggulan", kind: "bool" },
      ]}
      fields={[
        { name: "name", label: "Nama event", type: "text", required: true },
        { name: "location", label: "Lokasi", type: "text", required: true },
        { name: "start_date", label: "Tanggal mulai", type: "date" },
        { name: "end_date", label: "Tanggal selesai", type: "date" },
        { name: "status", label: "Status pemesanan", type: "select", required: true, options: EVENT_STATUSES },
        { name: "description", label: "Deskripsi", type: "textarea" },
        { name: "image_url", label: "Gambar event", type: "image" },
        { name: "is_featured", label: "Tampilkan sebagai event unggulan", type: "checkbox" },
      ]}
    />
  );
}
