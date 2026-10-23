import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { generalWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi JASTONE lewat WhatsApp untuk pertanyaan dan pemesanan jasa titip.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Kontak" title="Mari ngobrol soal incaranmu" subtitle="Cara tercepat menghubungi kami adalah lewat WhatsApp." />
      <div className="container-wide max-w-3xl py-16">
        <div className="rounded-2xl bg-white p-8 ring-1 ring-forest/10">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">WhatsApp</dt>
              <dd className="mt-2 font-serif text-2xl text-forest">0851-7672-7488</dd>
            </div>
            <div>
              <dt className="eyebrow">Respons</dt>
              <dd className="mt-2 text-ink/80">Umumnya dalam hitungan jam pada hari dan jam kerja.</dd>
            </div>
          </dl>
          <a href={generalWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-gold mt-8">
            Chat via WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
