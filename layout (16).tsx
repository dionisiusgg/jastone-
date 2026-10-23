import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "JASTONE – Personal Shopper untuk Event & Sale",
    template: "%s | JASTONE",
  },
  description:
    "JASTONE membantu kamu membeli sepatu, fashion, tas, makeup, dan skincare dari Grand Outlet, beauty event, dan pameran besar tanpa harus datang langsung.",
  openGraph: {
    title: "JASTONE – Personal Shopper untuk Event & Sale",
    description:
      "Titip belanja dari event dan sale besar. Kami yang antre, kamu terima beres.",
    type: "website",
    locale: "id_ID",
  },
};

export const viewport: Viewport = {
  themeColor: "#14382B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
