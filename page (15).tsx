import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Profil JASTONE, keunggulan layanan, proses pemesanan, dan ketentuan jasa titip.",
};

const strengths = [
  { t: "Transparan", d: "Harga produk, fee jasa, dan ongkir dirinci sebelum kamu membayar." },
  { t: "Bukti pembelian", d: "Foto produk dan struk dikirim setiap kali barang berhasil didapat." },
  { t: "Teliti memilih", d: "Ukuran, shade, dan kondisi barang dicek langsung sebelum dibeli." },
  { t: "Update berkala", d: "Kamu dikabari lewat WhatsApp di setiap tahap pemesanan." },
];

const process = [
  "Kirim request lewat formulir atau WhatsApp.",
  "Kami konfirmasi ketersediaan, harga, dan fee jasa.",
  "Kamu menyetujui rincian dan melakukan pembayaran.",
  "Kami membeli di event dan mengirim bukti pembelian.",
  "Barang dikemas dan dikirim, resi diberikan.",
];

const terms = [
  "Harga di katalog adalah referensi; harga final mengikuti harga di event saat pembelian.",
  "Pembayaran dilakukan setelah rincian harga dan fee disetujui.",
  "Jika barang habis atau tidak sesuai, kami mengabari dan menawarkan alternatif atau pengembalian dana sesuai kesepakatan.",
  "Barang yang sudah dibeli sesuai permintaan tidak dapat dibatalkan, kecuali ada cacat produksi.",
  "Kami tidak menjamin ketersediaan stok karena bergantung pada kondisi di lokasi event.",
  "Pengiriman mengikuti kebijakan ekspedisi; asuransi pengiriman tersedia atas permintaan.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Tentang JASTONE"
        title="Personal shopper untuk event yang tak sempat kamu datangi"
        subtitle="JASTONE lahir dari kebiasaan berburu sale. Kami membantu kamu mendapatkan barang incaran dari Grand Outlet, beauty event, dan pameran besar tanpa harus antre."
      />
      <div className="container-wide py-20">
        <SectionHeading eyebrow="Keunggulan" title="Mengapa menitip di JASTONE" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {strengths.map((s) => (
            <div key={s.t} className="rounded-2xl bg-white p-6 ring-1 ring-forest/10">
              <h3 className="text-xl text-forest">{s.t}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-2">
          <section>
            <h2 className="text-3xl text-forest">Proses pemesanan</h2>
            <ol className="mt-6 space-y-4">
              {process.map((p, i) => (
                <li key={p} className="flex gap-4">
                  <span className="font-serif text-2xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pt-1 text-ink/80">{p}</span>
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-3xl text-forest">Ketentuan jasa titip</h2>
            <ul className="mt-6 list-disc space-y-3 pl-5 text-ink/80 marker:text-gold">
              {terms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-20 text-center">
          <Link href="/request" className="btn-primary">Mulai Request Jastip</Link>
        </div>
      </div>
    </>
  );
}
