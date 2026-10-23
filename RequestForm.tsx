"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  requestSchema,
  type RequestInput,
} from "@/lib/whatsapp";

type Errors = Partial<Record<keyof RequestInput, string>>;

export default function RequestForm({
  eventNames,
  defaultEvent = "",
}: {
  eventNames: string[];
  defaultEvent?: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
  const [saveWarning, setSaveWarning] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = requestSchema.safeParse(raw);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RequestInput;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    setBusy(true);
    const v = parsed.data;
    const url = buildWhatsAppUrl(buildWhatsAppMessage(v));

    // Buka tab segera (dalam gesture klik) agar tidak diblokir popup blocker.
    const win = window.open("", "_blank");

    try {
      const sb = createClient();
      const { error } = await sb.from("order_requests").insert({
        customer_name: v.customer_name,
        event_name: v.event_name,
        product_name: v.product_name,
        brand: v.brand || null,
        variant: v.variant || null,
        quantity: v.quantity,
        budget: v.budget === "" || v.budget == null ? null : Number(v.budget),
        notes: v.notes || null,
      });
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setSaveWarning(true); // WhatsApp tetap dibuka; pesanan tetap bisa dikirim manual.
    }

    if (win) win.location.href = url;
    setWaUrl(url);
    setBusy(false);
  }

  const err = (k: keyof RequestInput) =>
    errors[k] ? (
      <p id={`${k}-err`} role="alert" className="mt-1 text-xs text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof RequestInput) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  if (waUrl) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-forest/10" role="status">
        <p className="font-serif text-2xl text-forest">Request siap dikirim</p>
        <p className="mt-3 text-sm text-ink/70">
          WhatsApp seharusnya sudah terbuka dengan pesan terisi otomatis. Tekan kirim di WhatsApp untuk
          menyelesaikan. Jika tidak terbuka, gunakan tombol di bawah.
        </p>
        {saveWarning && (
          <p className="mt-3 text-xs text-amber-700">
            Catatan: permintaan belum tersimpan di sistem kami, tetapi tetap bisa dikirim lewat WhatsApp.
          </p>
        )}
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-6">
          Buka WhatsApp
        </a>
        <button type="button" onClick={() => { setWaUrl(null); setSaveWarning(false); }} className="btn-outline ml-3 mt-6">
          Buat request baru
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-2xl bg-white p-6 ring-1 ring-forest/10 sm:grid-cols-2 sm:p-8">
      <div>
        <label className="label" htmlFor="customer_name">Nama pelanggan *</label>
        <input id="customer_name" name="customer_name" className="field" autoComplete="name" {...aria("customer_name")} />
        {err("customer_name")}
      </div>
      <div>
        <label className="label" htmlFor="event_name">Event *</label>
        <input id="event_name" name="event_name" list="event-list" defaultValue={defaultEvent} className="field" placeholder="Pilih atau ketik nama event" {...aria("event_name")} />
        <datalist id="event-list">
          {eventNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        {err("event_name")}
      </div>
      <div>
        <label className="label" htmlFor="product_name">Nama produk *</label>
        <input id="product_name" name="product_name" className="field" {...aria("product_name")} />
        {err("product_name")}
      </div>
      <div>
        <label className="label" htmlFor="brand">Merek</label>
        <input id="brand" name="brand" className="field" {...aria("brand")} />
        {err("brand")}
      </div>
      <div>
        <label className="label" htmlFor="variant">Ukuran / shade</label>
        <input id="variant" name="variant" className="field" placeholder="mis. 42 atau Nude 03" {...aria("variant")} />
        {err("variant")}
      </div>
      <div>
        <label className="label" htmlFor="quantity">Jumlah *</label>
        <input id="quantity" name="quantity" type="number" min={1} max={99} defaultValue={1} inputMode="numeric" className="field" {...aria("quantity")} />
        {err("quantity")}
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="budget">Anggaran (Rp)</label>
        <input id="budget" name="budget" type="number" min={0} inputMode="numeric" className="field" placeholder="Opsional" {...aria("budget")} />
        {err("budget")}
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="notes">Catatan tambahan</label>
        <textarea id="notes" name="notes" rows={4} maxLength={500} className="field" placeholder="Warna alternatif, link referensi, dll." {...aria("notes")} />
        {err("notes")}
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
          {busy ? "Memproses…" : "Kirim via WhatsApp"}
        </button>
        <p className="mt-3 text-xs text-ink/50">
          Setelah divalidasi, WhatsApp terbuka dengan pesan otomatis. Tidak ada pembayaran di tahap ini.
        </p>
      </div>
    </form>
  );
}
