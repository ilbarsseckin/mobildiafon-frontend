import type { Metadata } from "next";

const BASLIK = "Satın Al | Apartman ve İşletme için Dijital Diafon";
const ACIKLAMA =
  "Apartmanınız, siteniz veya işletmeniz için MobilDiafon aboneliği. QR ve konum tabanlı kapı iletişimi, görüntülü arama, yönetici paneli. 14 gün ücretsiz deneme.";
const URL = "https://mobildiafon.com/satin-al";
const GORSEL = "https://cdn.mobildiafon.com/org/og-image.png";

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: [
    "apartman diafon sistemi",
    "dijital diafon",
    "site yönetim uygulaması",
    "kablosuz diafon",
    "qr kapı zili",
    "işletme diafon çözümü",
    "apartman zil sistemi fiyat",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: BASLIK,
    description: ACIKLAMA,
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: GORSEL, width: 1200, height: 630, alt: "MobilDiafon dijital diafon platformu" }],
  },
  twitter: {
    card: "summary_large_image",
    title: BASLIK,
    description: ACIKLAMA,
    images: [GORSEL],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Dijital diafon ve kapı iletişim sistemi",
            name: "MobilDiafon Abonelik",
            description: ACIKLAMA,
            image: GORSEL,
            provider: {
              "@type": "Organization",
              name: "MobilDiafon",
              url: "https://mobildiafon.com",
              logo: "https://mobildiafon.com/logo.png",
            },
            areaServed: { "@type": "Country", name: "Türkiye" },
            audience: {
              "@type": "Audience",
              audienceType: "Apartman yönetimi, site yönetimi, işletmeler",
            },
            offers: {
              "@type": "Offer",
              url: URL,
              priceCurrency: "TRY",
              availability: "https://schema.org/InStock",
              eligibleRegion: { "@type": "Country", name: "Türkiye" },
            },
          }),
        }}
      />
      {children}
    </>
  );
}
