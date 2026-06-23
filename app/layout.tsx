import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MobilDiafon | QR ve Konum Tabanlı Dijital Diafon",
  description:
    "MobilDiafon; QR kod, konum doğrulama, görüntülü arama, yönetici paneli ve güvenlik paneli destekli kurumsal dijital diafon platformudur.",
  keywords: [
    "mobil diafon",
    "QR diafon",
    "konum tabanlı diafon",
    "görüntülü diafon",
    "apartman diafon",
    "site yönetimi",
    "kapı arama uygulaması",
  ],
  metadataBase: new URL("https://mobildiafon.com"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "MobilDiafon | Diafon Artık Cebinizde",
    description: "QR ve konum tabanlı modern kapı iletişim platformu.",
    url: "https://mobildiafon.com",
    type: "website",
    locale: "tr_TR",
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "MobilDiafon" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://mobildiafon.com" },
};

export const viewport: Viewport = {
  themeColor: "#021E4F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${bricolage.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}