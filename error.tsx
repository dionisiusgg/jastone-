"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-wide flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl text-forest">Terjadi kesalahan</h1>
      <p className="mt-4 text-ink/70">Silakan coba lagi. Jika berlanjut, hubungi kami lewat WhatsApp.</p>
      <button onClick={reset} className="btn-primary mt-8">Coba lagi</button>
    </div>
  );
}
