"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ORDER_STATUSES, type OrderRequest, type OrderStatus } from "@/lib/types";
import { formatRupiah } from "@/lib/whatsapp";

export default function OrdersManager({ initialRows }: { initialRows: OrderRequest[] }) {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const sb = useMemo(() => createClient(), []);

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  async function setStatus(id: string, status: OrderStatus) {
    setError(null);
    const { error } = await sb.from("order_requests").update({ status }).eq("id", id);
    if (error) return setError(error.message);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  async function remove(id: string) {
    if (!window.confirm("Hapus pesanan ini?")) return;
    const { error } = await sb.from("order_requests").delete().eq("id", id);
    if (error) return setError(error.message);
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  return (
    <div>
      <h1 className="text-3xl text-forest">Pesanan / Request</h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {[{ value: "all", label: "Semua" }, ...ORDER_STATUSES].map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value as OrderStatus | "all")}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              filter === s.value ? "border-forest bg-forest text-cream" : "border-forest/25 text-forest"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>}

      <div className="mt-6 space-y-4">
        {shown.length === 0 && (
          <p className="rounded-xl bg-white px-4 py-10 text-center text-ink/50 ring-1 ring-forest/10">Belum ada pesanan.</p>
        )}
        {shown.map((r) => (
          <article key={r.id} className="rounded-xl bg-white p-5 ring-1 ring-forest/10">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-forest">{r.product_name}{r.brand ? ` · ${r.brand}` : ""}</h2>
                <p className="text-sm text-ink/60">
                  {r.customer_name} · {r.event_name} · {new Date(r.created_at).toLocaleString("id-ID")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="sr-only" htmlFor={`st-${r.id}`}>Status pesanan</label>
                <select
                  id={`st-${r.id}`}
                  value={r.status}
                  onChange={(e) => setStatus(r.id, e.target.value as OrderStatus)}
                  className="field !w-auto !py-2"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button onClick={() => remove(r.id)} className="text-sm text-red-700 underline">Hapus</button>
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
              <div><dt className="text-ink/50">Ukuran/Shade</dt><dd>{r.variant || "–"}</dd></div>
              <div><dt className="text-ink/50">Jumlah</dt><dd>{r.quantity}</dd></div>
              <div><dt className="text-ink/50">Anggaran</dt><dd>{formatRupiah(r.budget)}</dd></div>
              <div><dt className="text-ink/50">Catatan</dt><dd>{r.notes || "–"}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </div>
  );
}
