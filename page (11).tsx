import type { Metadata } from "next";
import { getEvents } from "@/lib/data";
import { EmptyState, EventCard, PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Events",
  description: "Daftar event aktif dan mendatang: Grand Outlet, beauty event, brand sale, dan pameran besar.",
};
export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();
  const active = events.filter((e) => e.status === "open");
  const upcoming = events.filter((e) => e.status === "upcoming");
  const closed = events.filter((e) => e.status === "closed");

  const Group = ({ title, list }: { title: string; list: typeof events }) =>
    list.length ? (
      <section className="mt-14 first:mt-0">
        <h2 className="mb-6 text-2xl text-forest">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </section>
    ) : null;

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Event & sale yang bisa kamu titipi"
        subtitle="Pilih event, lalu kirim daftar produk incaranmu. Kami yang datang dan berburu."
      />
      <div className="container-wide py-16">
        {events.length ? (
          <>
            <Group title="Open Order" list={active} />
            <Group title="Segera Hadir" list={upcoming} />
            <Group title="Sudah Ditutup" list={closed} />
          </>
        ) : (
          <EmptyState title="Belum ada event" text="Event akan ditampilkan setelah ditambahkan oleh admin." href="/request" cta="Request Jastip" />
        )}
      </div>
    </>
  );
}
