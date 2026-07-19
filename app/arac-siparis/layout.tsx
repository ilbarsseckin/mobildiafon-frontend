import type { Metadata } from "next";

const BASLIK = "Araç QR Etiketi | MobilDiafon Auto";
const ACIKLAMA =
  "Aracınızın camına yapıştırın, telefon numaranız gizli kalsın. QR kodu okutan kişi size doğrudan ulaşsın. Uygulama gerektirmez, 1 yıl kullanım dahil.";
const URL = "https://mobildiafon.com/arac-siparis";
const GORSEL = "https://cdn.mobildiafon.com/org/og-arac.png";

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: [
    "araç qr etiketi",
    "araba cam etiketi",
    "araç sahibine ulaş",
    "numara gizleme etiketi",
    "yanlış park iletişim",
    "qr ile araç sahibine ulaşma",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: BASLIK,
    description: ACIKLAMA,
    url: URL,
    type: "website",
    locale: "tr_TR",
    images: [{ url: GORSEL, width: 1200, height: 630, alt: "MobilDiafon Auto araç QR etiketi" }],
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
            "@type": "Product",
            name: "MobilDiafon Auto — Araç QR Etiketi",
            description: ACIKLAMA,
            image: GORSEL,
            brand: { "@type": "Brand", name: "MobilDiafon" },
            category: "Araç Aksesuarı",
            offers: {
              "@type": "Offer",
              url: URL,
              priceCurrency: "TRY",
              price: "790",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "TR" },
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "TR",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 14,
                returnMethod: "https://schema.org/ReturnByMail",
                returnFees: "https://schema.org/ReturnShippingFees",
              },
            },
          }),
        }}
      />
      {children}
    </>
  );
}
