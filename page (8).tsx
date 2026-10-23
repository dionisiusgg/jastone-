import type { Metadata } from "next";
import { getEvents } from "@/lib/data";
import RequestForm from "@/components/RequestForm";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Request Jastip",
  description: "Isi formulir request jastip dan kirim langsung ke WhatsApp JASTONE.",
};
export const dynamic = "force-dynamic";

export default async function RequestPage({
  searchParams,
}: {
  searchParams: { event?: string };
}) {
  const events = await getEvents();
  const open = events.filter((e) => e.status !== "closed").map((e) => e.name);
  const defaultEvent = typeof searchParams.event === "string" ? searchParams.event.slice(0, 120) : "";

  return (
    <>
      <PageHero
        eyebrow="Request Jastip"
        title="Ceritakan apa yang kamu incar"
        subtitle="Isi detail produk, kami cek ketersediaan dan kirim rincian harga lewat WhatsApp."
      />
      <div className="container-wide max-w-3xl py-16">
        <RequestForm eventNames={open} defaultEvent={defaultEvent} />
      </div>
    </>
  );
}
