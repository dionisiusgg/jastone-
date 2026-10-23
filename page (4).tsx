import ResourceManager from "@/components/admin/ResourceManager";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminTestimonials() {
  const { data } = await createClient().from("testimonials").select("*").order("created_at", { ascending: false });
  return (
    <ResourceManager
      table="testimonials"
      title="Testimoni"
      singular="Testimoni"
      imageFolder="testimonials"
      orderBy={{ column: "created_at", ascending: false }}
      initialRows={(data ?? []) as any}
      defaults={{ is_published: true, rating: 5 }}
      columns={[
        { key: "customer_name", label: "Pelanggan" },
        { key: "content", label: "Isi" },
        { key: "rating", label: "Rating" },
        { key: "is_published", label: "Tayang", kind: "bool" },
      ]}
      fields={[
        { name: "customer_name", label: "Nama pelanggan", type: "text", required: true },
        { name: "rating", label: "Rating", type: "rating" },
        { name: "content", label: "Isi testimoni", type: "textarea", required: true },
        { name: "is_published", label: "Tayangkan di situs", type: "checkbox" },
      ]}
    />
  );
}
