-- ============================================================
-- JASTONE – schema, RLS, storage, seed
-- Jalankan di Supabase Dashboard -> SQL Editor (sekali).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Tabel admin ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Kategori ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Event ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  location text not null,
  start_date date,
  end_date date,
  description text,
  image_url text,
  status text not null default 'upcoming' check (status in ('open','upcoming','closed')),
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Produk ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  event_id uuid references public.events(id) on delete set null,
  reference_price numeric(14,0) not null default 0 check (reference_price >= 0),
  description text,
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_event_idx on public.products(event_id);

-- ---------- Testimoni ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  content text not null,
  rating int not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Banner ----------
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text,
  cta_label text,
  cta_href text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Permintaan / pesanan ----------
create table if not exists public.order_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  event_name text not null check (char_length(event_name) between 2 and 120),
  product_name text not null check (char_length(product_name) between 2 and 160),
  brand text check (brand is null or char_length(brand) <= 80),
  variant text check (variant is null or char_length(variant) <= 80),
  quantity int not null default 1 check (quantity between 1 and 99),
  budget numeric(14,0) check (budget is null or budget >= 0),
  notes text check (notes is null or char_length(notes) <= 500),
  status text not null default 'new'
    check (status in ('new','contacted','purchasing','shipped','done','cancelled')),
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.events enable row level security;
alter table public.products enable row level security;
alter table public.testimonials enable row level security;
alter table public.banners enable row level security;
alter table public.order_requests enable row level security;

-- admins: hanya admin yang boleh melihat daftar admin
drop policy if exists "admins read" on public.admins;
create policy "admins read" on public.admins
  for select to authenticated using (public.is_admin());

-- Konten publik: semua orang membaca, hanya admin menulis
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "events public read" on public.events;
create policy "events public read" on public.events for select using (true);
drop policy if exists "events admin write" on public.events;
create policy "events admin write" on public.events
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products
  for select using (is_active or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials
  for select using (is_published or public.is_admin());
drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "banners public read" on public.banners;
create policy "banners public read" on public.banners
  for select using (is_active or public.is_admin());
drop policy if exists "banners admin write" on public.banners;
create policy "banners admin write" on public.banners
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Permintaan: pengunjung boleh MENGIRIM (insert) saja; hanya admin yang membaca/mengubah
drop policy if exists "orders public insert" on public.order_requests;
create policy "orders public insert" on public.order_requests
  for insert to anon, authenticated
  with check (status = 'new');
drop policy if exists "orders admin read" on public.order_requests;
create policy "orders admin read" on public.order_requests
  for select to authenticated using (public.is_admin());
drop policy if exists "orders admin update" on public.order_requests;
create policy "orders admin update" on public.order_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders admin delete" on public.order_requests;
create policy "orders admin delete" on public.order_requests
  for delete to authenticated using (public.is_admin());

-- ============================================================
-- Storage (bucket gambar publik, tulis hanya admin)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('images', 'images', true, 5242880,
        array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif'];

drop policy if exists "images public read" on storage.objects;
create policy "images public read" on storage.objects
  for select using (bucket_id = 'images');
drop policy if exists "images admin insert" on storage.objects;
create policy "images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'images' and public.is_admin());
drop policy if exists "images admin update" on storage.objects;
create policy "images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'images' and public.is_admin());
drop policy if exists "images admin delete" on storage.objects;
create policy "images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'images' and public.is_admin());

-- ============================================================
-- Seed data contoh (aman dihapus / diubah lewat admin)
-- ============================================================
insert into public.categories (name, slug, description, image_url, sort_order) values
 ('Shoes','shoes','Sneakers dan sepatu pilihan dari outlet resmi.','https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',1),
 ('Fashion','fashion','Pakaian dan busana dari brand sale besar.','https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80',2),
 ('Bags & Accessories','bags-accessories','Tas, dompet, dan aksesori.','https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',3),
 ('Beauty & Makeup','beauty-makeup','Makeup dan produk kecantikan dari beauty event.','https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',4),
 ('Skincare','skincare','Skincare favorit dengan harga event.','https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',5)
on conflict (slug) do nothing;

insert into public.events (name, slug, location, start_date, end_date, description, image_url, status, is_featured) values
 ('Grand Outlet Sale','grand-outlet-sale','Jakarta Convention Center, Jakarta','2026-11-06','2026-11-15','Ratusan brand sepatu, fashion, dan tas dengan diskon hingga 70%. Kirim daftar incaranmu, kami yang antre.','https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80','open',true),
 ('Beauty Fest Indonesia','beauty-fest-indonesia','ICE BSD, Tangerang','2026-11-20','2026-11-23','Pameran kecantikan dengan brand makeup dan skincare lokal serta internasional.','https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80','upcoming',true),
 ('Brand Warehouse Sale','brand-warehouse-sale','Gudang Brand, Bandung','2026-12-04','2026-12-07','Cuci gudang brand fashion ternama dengan harga spesial.','https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80','upcoming',false)
on conflict (slug) do nothing;

insert into public.products (name, brand, slug, category_id, event_id, reference_price, description, image_url, is_featured)
select 'Court Classic Sneakers','Everlane Studio','court-classic-sneakers', c.id, e.id, 749000,
  'Sneakers kulit putih bersih, nyaman untuk harian.',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=80', true
from public.categories c, public.events e where c.slug='shoes' and e.slug='grand-outlet-sale'
on conflict (slug) do nothing;

insert into public.products (name, brand, slug, category_id, event_id, reference_price, description, image_url, is_featured)
select 'Runner Pro Lightweight','Stride','runner-pro-lightweight', c.id, e.id, 899000,
  'Sepatu lari ringan dengan bantalan responsif.',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', true
from public.categories c, public.events e where c.slug='shoes' and e.slug='grand-outlet-sale'
on conflict (slug) do nothing;

insert into public.products (name, brand, slug, category_id, event_id, reference_price, description, image_url, is_featured)
select 'Linen Relaxed Blazer','Maison Verde','linen-relaxed-blazer', c.id, e.id, 599000,
  'Blazer linen potongan santai untuk kerja maupun akhir pekan.',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80', false
from public.categories c, public.events e where c.slug='fashion' and e.slug='brand-warehouse-sale'
on conflict (slug) do nothing;

insert into public.products (name, brand, slug, category_id, event_id, reference_price, description, image_url, is_featured)
select 'Structured Leather Tote','Atelier Nord','structured-leather-tote', c.id, e.id, 1250000,
  'Tote berstruktur dari kulit dengan kompartemen laptop.',
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80', true
from public.categories c, public.events e where c.slug='bags-accessories' and e.slug='grand-outlet-sale'
on conflict (slug) do nothing;

insert into public.products (name, brand, slug, category_id, event_id, reference_price, description, image_url, is_featured)
select 'Velvet Matte Lipstick','Rosewell','velvet-matte-lipstick', c.id, e.id, 189000,
  'Lipstik matte tahan lama, tersedia banyak shade.',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80', true
from public.categories c, public.events e where c.slug='beauty-makeup' and e.slug='beauty-fest-indonesia'
on conflict (slug) do nothing;

insert into public.products (name, brand, slug, category_id, event_id, reference_price, description, image_url, is_featured)
select 'Hydra Barrier Serum','Dewlab','hydra-barrier-serum', c.id, e.id, 259000,
  'Serum pelembap untuk memperkuat skin barrier.',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80', true
from public.categories c, public.events e where c.slug='skincare' and e.slug='beauty-fest-indonesia'
on conflict (slug) do nothing;

insert into public.testimonials (customer_name, content, rating) values
 ('Nadia R.','Pesanan sneakers saya dibelikan tepat ukuran dan dikabari tiap tahap. Praktis banget, tidak perlu antre berjam-jam.',5),
 ('Putri A.','Admin responsif, foto bukti pembelian jelas. Sudah tiga kali titip di beauty fest dan selalu aman.',5),
 ('Rizky M.','Harga transparan, fee jelas di awal. Tas yang saya incar berhasil didapat saat sale.',5);

insert into public.banners (title, subtitle, image_url, cta_label, cta_href, sort_order) values
 ('Belanja event tanpa antre','Titip produk incaranmu dari Grand Outlet dan beauty fest. Kami yang berburu, kamu terima beres.','https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80','Request Jastip','/request',1);

-- ============================================================
-- SETELAH membuat user admin di Authentication -> Users, jalankan:
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'EMAIL-ADMIN-ANDA';
-- ============================================================
