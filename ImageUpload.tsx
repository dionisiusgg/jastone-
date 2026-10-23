"use client";

import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function pathFromUrl(url: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

export default function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    if (!ALLOWED.includes(file.type)) return setError("Format harus JPG, PNG, WebP, atau AVIF.");
    if (file.size > MAX_BYTES) return setError("Ukuran maksimal 5 MB.");

    setBusy(true);
    const sb = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await sb.storage.from(BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
    });
    if (upErr) {
      setBusy(false);
      return setError(`Upload gagal: ${upErr.message}`);
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(path);

    // Hapus gambar lama di storage (best effort) saat diganti.
    if (value) {
      const old = pathFromUrl(value);
      if (old) await sb.storage.from(BUCKET).remove([old]);
    }
    onChange(data.publicUrl);
    setBusy(false);
  }

  async function remove() {
    if (value) {
      const old = pathFromUrl(value);
      if (old) await createClient().storage.from(BUCKET).remove([old]);
    }
    onChange(null);
  }

  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-dark ring-1 ring-forest/15">
          {value ? (
            <Image src={value} alt="Pratinjau gambar" fill sizes="96px" className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink/40">Kosong</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="btn-outline cursor-pointer !px-4 !py-2 text-xs">
            {busy ? "Mengunggah…" : value ? "Ganti gambar" : "Unggah gambar"}
            <input type="file" accept={ALLOWED.join(",")} onChange={onFile} disabled={busy} className="sr-only" />
          </label>
          {value && (
            <button type="button" onClick={remove} className="block text-xs text-red-700 underline">
              Hapus gambar
            </button>
          )}
        </div>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
}
