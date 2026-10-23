export default function Loading() {
  return (
    <div className="container-wide py-24" role="status" aria-label="Memuat">
      <div className="h-10 w-64 animate-pulse rounded bg-forest/10" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-forest/10" />
        ))}
      </div>
    </div>
  );
}
