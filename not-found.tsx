import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-screen flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl text-forest">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-ink/70">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link href="/" className="btn-primary mt-8">Kembali ke beranda</Link>
    </div>
  );
}
