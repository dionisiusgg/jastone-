import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/admin/SignOutButton";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const sb = createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  // Middleware sudah mengarahkan non-login; ini pertahanan berlapis.
  const { data: adminRow } = user
    ? await sb.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()
    : { data: null };

  if (!user || !adminRow) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl text-forest">Akses ditolak</h1>
        <p className="mt-3 max-w-md text-ink/70">
          Akun ini belum terdaftar sebagai admin. Tambahkan user ke tabel <code>admins</code> (lihat README).
        </p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <AdminNav email={user.email ?? ""} />
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}
