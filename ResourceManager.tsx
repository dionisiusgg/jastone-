"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import ImageUpload from "./ImageUpload";

export type Option = { value: string; label: string };

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox" | "date" | "image" | "rating";
  required?: boolean;
  options?: Option[];
  hint?: string;
  full?: boolean;
};

export type Column = {
  key: string;
  label: string;
  kind?: "text" | "image" | "bool" | "money" | "select" | "date";
};

type Row = Record<string, unknown> & { id: string };

type Props = {
  table: string;
  title: string;
  singular: string;
  fields: Field[];
  columns: Column[];
  initialRows: Row[];
  orderBy: { column: string; ascending?: boolean };
  slugFrom?: string; // nama field sumber slug (mis. "name")
  imageFolder: string;
  defaults?: Record<string, unknown>;
};

function cell(row: Row, col: Column, fields: Field[]) {
  const v = row[col.key];
  switch (col.kind) {
    case "image":
      return v ? (
        <div className="relative h-12 w-12 overflow-hidden rounded bg-cream-dark">
          <Image src={String(v)} alt="" fill sizes="48px" className="object-cover" unoptimized />
        </div>
      ) : (
        <span className="text-ink/30">–</span>
      );
    case "bool":
      return v ? <span className="text-green-700">Ya</span> : <span className="text-ink/40">Tidak</span>;
    case "money":
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(v ?? 0));
    case "select": {
      const f = fields.find((x) => x.name === col.key);
      return f?.options?.find((o) => o.value === v)?.label ?? (v ? String(v) : "–");
    }
    case "date":
      return v ? new Date(String(v)).toLocaleDateString("id-ID") : "–";
    default:
      return v == null || v === "" ? "–" : String(v);
  }
}

export default function ResourceManager({
  table,
  title,
  singular,
  fields,
  columns,
  initialRows,
  orderBy,
  slugFrom,
  imageFolder,
  defaults = {},
}: Props) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const sb = useMemo(() => createClient(), []);

  async function reload() {
    const { data, error } = await sb
      .from(table)
      .select("*")
      .order(orderBy.column, { ascending: orderBy.ascending ?? true });
    if (error) setError(error.message);
    else setRows((data ?? []) as Row[]);
  }

  function openNew() {
    const init: Record<string, unknown> = { ...defaults };
    for (const f of fields) {
      if (init[f.name] !== undefined) continue;
      init[f.name] = f.type === "checkbox" ? false : f.type === "rating" ? 5 : f.type === "number" ? 0 : f.type === "image" ? null : "";
    }
    setForm(init);
    setError(null);
    setEditing("new");
  }

  function openEdit(row: Row) {
    setForm({ ...row });
    setError(null);
    setEditing(row);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    for (const f of fields) {
      if (f.required && (form[f.name] === "" || form[f.name] == null)) {
        return setError(`${f.label} wajib diisi.`);
      }
    }

    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      let v = form[f.name];
      if (f.type === "number" || f.type === "rating") v = v === "" || v == null ? null : Number(v);
      else if (f.type === "checkbox") v = Boolean(v);
      else if (typeof v === "string") v = v.trim() === "" ? null : v.trim();
      payload[f.name] = v;
    }
    if (slugFrom) {
      const base = slugify(String(form[slugFrom] ?? ""));
      if (!base) return setError("Nama tidak valid untuk membuat slug.");
      if (editing === "new") payload.slug = base;
      // saat edit, slug dipertahankan agar tautan lama tidak rusak
    }

    setBusy(true);
    let res;
    if (editing === "new") {
      res = await sb.from(table).insert(payload);
      if (res.error?.code === "23505" && slugFrom) {
        payload.slug = `${payload.slug}-${Math.random().toString(36).slice(2, 6)}`;
        res = await sb.from(table).insert(payload);
      }
    } else if (editing) {
      res = await sb.from(table).update(payload).eq("id", editing.id);
    }
    setBusy(false);

    if (res?.error) return setError(res.error.message);
    setEditing(null);
    setNotice(`${singular} berhasil disimpan.`);
    await reload();
  }

  async function onDelete(row: Row) {
    if (!window.confirm(`Hapus ${singular.toLowerCase()} ini? Tindakan tidak bisa dibatalkan.`)) return;
    const { error } = await sb.from(table).delete().eq("id", row.id);
    if (error) return setError(error.message);
    setNotice(`${singular} dihapus.`);
    await reload();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl text-forest">{title}</h1>
        <button onClick={openNew} className="btn-primary">+ Tambah {singular}</button>
      </div>

      {notice && <p role="status" className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">{notice}</p>}
      {error && !editing && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl bg-white ring-1 ring-forest/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-dark/60 text-xs uppercase tracking-wider text-forest">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 font-medium">{c.label}</th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forest/10">
            {rows.length === 0 && (
              <tr><td colSpan={columns.length + 1} className="px-4 py-10 text-center text-ink/50">Belum ada data.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                {columns.map((c) => (
                  <td key={c.key} className="max-w-[260px] truncate px-4 py-3">{cell(r, c, fields)}</td>
                ))}
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button onClick={() => openEdit(r)} className="mr-3 text-forest underline">Edit</button>
                  <button onClick={() => onDelete(r)} className="text-red-700 underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-dark/60 p-4" role="dialog" aria-modal="true" aria-label={`Form ${singular}`}>
          <form onSubmit={onSubmit} className="my-8 w-full max-w-2xl rounded-2xl bg-cream p-6 shadow-2xl sm:p-8">
            <h2 className="text-2xl text-forest">{editing === "new" ? `Tambah ${singular}` : `Edit ${singular}`}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {fields.map((f) => {
                const id = `f-${f.name}`;
                const wide = f.full || f.type === "textarea" || f.type === "image";
                const val = form[f.name];
                return (
                  <div key={f.name} className={wide ? "sm:col-span-2" : ""}>
                    {f.type !== "checkbox" && (
                      <label htmlFor={id} className="label">{f.label}{f.required && " *"}</label>
                    )}
                    {f.type === "textarea" && (
                      <textarea id={id} rows={4} className="field" value={String(val ?? "")} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
                    )}
                    {(f.type === "text" || f.type === "number" || f.type === "date") && (
                      <input
                        id={id}
                        type={f.type}
                        min={f.type === "number" ? 0 : undefined}
                        className="field"
                        value={String(val ?? "")}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                      />
                    )}
                    {f.type === "rating" && (
                      <select id={id} className="field" value={String(val ?? 5)} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} bintang</option>
                        ))}
                      </select>
                    )}
                    {f.type === "select" && (
                      <select id={id} className="field" value={String(val ?? "")} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                        {!f.required && <option value="">— Tidak ada —</option>}
                        {f.options?.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    )}
                    {f.type === "checkbox" && (
                      <label className="flex items-center gap-2 pt-6 text-sm">
                        <input id={id} type="checkbox" className="h-4 w-4 accent-forest" checked={Boolean(val)} onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })} />
                        {f.label}
                      </label>
                    )}
                    {f.type === "image" && (
                      <ImageUpload value={(val as string | null) ?? null} folder={imageFolder} onChange={(url) => setForm({ ...form, [f.name]: url })} />
                    )}
                    {f.hint && <p className="mt-1 text-xs text-ink/50">{f.hint}</p>}
                  </div>
                );
              })}
            </div>
            {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-800">{error}</p>}
            <div className="mt-8 flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">Batal</button>
              <button type="submit" disabled={busy} className="btn-primary">{busy ? "Menyimpan…" : "Simpan"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
