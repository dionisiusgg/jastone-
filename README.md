# JASTONE

Website jasa titip (personal shopper) untuk event, sale, dan pameran besar.
Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (Postgres, Auth, Storage).

## Fitur

- Halaman publik: Home, Events, Katalog Produk (filter kategori/event), Request Jastip, About, Testimoni & FAQ, Kontak
- Pemesanan WhatsApp (`6285176727488`) dengan pesan otomatis dan validasi form (zod); permintaan juga tersimpan di database
- Admin CMS (`/admin`): produk, kategori, event, testimoni, banner, pesanan, upload/ganti gambar
- RLS di semua tabel; hanya user di tabel `admins` yang dapat menulis. Service role key tidak dipakai.

## Instalasi lokal

```bash
npm install
cp .env.example .env.local   # isi URL & anon key Supabase
npm run dev                  # http://localhost:3000
```

## Konfigurasi Supabase

1. Buat project di [supabase.com](https://supabase.com).
2. **SQL Editor** → tempel isi `supabase/schema.sql` → Run (membuat tabel, RLS, bucket `images`, dan data contoh).
3. **Project Settings → API**: salin `Project URL` dan `anon public key` ke `.env.local`.
4. **Authentication → Providers → Email**: nonaktifkan *Allow new users to sign up* (agar tidak ada yang mendaftar sendiri).
5. **Authentication → Users → Add user**: buat akun admin (email + password).
6. Daftarkan sebagai admin di SQL Editor:

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'EMAIL-ADMIN-ANDA';
```

7. Login di `/admin/login`.

## Deployment (GitHub → Vercel)

1. `git init && git add . && git commit -m "JASTONE" ` lalu push ke repo GitHub.
2. Di [vercel.com](https://vercel.com) → **Add New Project** → import repo.
3. Tambahkan Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL` (URL produksi).
4. Deploy. Di Supabase **Authentication → URL Configuration**, set Site URL ke domain Vercel.

## Checklist pengujian manual

- [ ] `/request`: submit kosong → muncul pesan error; isi lengkap → WhatsApp terbuka dengan pesan terisi
- [ ] Baris baru muncul di `/admin/orders`
- [ ] Login admin, tambah produk + unggah foto → langsung tampil di `/products`
- [ ] Ubah status event ke "Ditutup" → tombol titip hilang di `/events`
- [ ] Akses `/admin` tanpa login → diarahkan ke `/admin/login`

## Struktur

```
src/app/(site)/      halaman publik
src/app/admin/       login + panel CMS
src/components/      UI bersama, form request, komponen admin
src/lib/             supabase client, data, whatsapp, tipe
supabase/schema.sql  skema, RLS, storage, seed
```
