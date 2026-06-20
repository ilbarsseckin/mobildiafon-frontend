import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mobil Diafon — Diafon Artık Cebinizde",
  description:
    "Panelsiz mobil diafon sistemi. Ziyaretçiler QR okutup sizi görüntülü arar, uygulama gerekmez. Apartman, site, villa ve işletmeler için modern kapı iletişimi.",
  keywords: [
    "mobil diafon",
    "panelsiz diafon",
    "görüntülü diafon",
    "QR diafon",
    "akıllı diafon",
    "apartman diafon",
    "kapı zili uygulaması",
  ],
  metadataBase: new URL("https://mobildiafon.com"),
  openGraph: {
    title: "Mobil Diafon — Diafon Artık Cebinizde",
    description: "Panelsiz mobil diafon. QR okut, görüntülü görüş. Uygulama gerekmez.",
    url: "https://mobildiafon.com",
    type: "website",
    locale: "tr_TR",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://mobildiafon.com" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
