"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    if (!email || !password) return setError("Email dan password wajib diisi.");

    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return setError("Email atau password salah.");
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-cream p-8 shadow-2xl">
        <p className="font-serif text-3xl font-bold text-forest">
          JAS<span className="text-gold">TONE</span>
        </p>
        <h1 className="mt-1 text-lg text-forest/70">Masuk Admin</h1>
        <div className="mt-6">
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" className="field" required />
        </div>
        <div className="mt-4">
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" className="field" required />
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary mt-6 w-full">
          {busy ? "Masuk…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
