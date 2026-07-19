import Link from "next/link";
import type { Metadata } from "next";

const URL = "https://mobildiafon.com/auto";
const GORSEL = "https://cdn.mobildiafon.com/org/og-arac.png";
const BASLIK = "MobilDiafon Auto | Numaranız Görünmeden Size Ulaşsın";
const ACIKLAMA =
  "Araç camınıza yapıştırdığınız QR etiketi sayesinde telefon numaranız gizli kalır, size ulaşmak isteyen kişi doğrudan bağlanır. 790 TL, 1 yıl kullanım dahil.";

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  keywords: [
    "araç qr etiketi", "araba cam etiketi", "numara gizleme",
    "yanlış park iletişim", "araç sahibine ulaş", "qr araç iletişim",
  ],
  alternates: { canonical: URL },
  openGraph: {
    title: BASLIK, description: ACIKLAMA, url: URL,
    type: "website", locale: "tr_TR",
    images: [{ url: GORSEL, width: 1200, height: 630, alt: "MobilDiafon Auto araç QR etiketi" }],
  },
  twitter: { card: "summary_large_image", title: BASLIK, description: ACIKLAMA, images: [GORSEL] },
};

const C = {
  kirmizi: "#E63946",
  lacivert: "#14213D",
  gri: "#64748b",
  acikGri: "#f8fafc",
  cizgi: "#e2e8f0",
};

export default function AutoPage() {
  return (
    <main style={{ fontFamily: "system-ui, -apple-system, sans-serif", color: C.lacivert }}>
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
            offers: [
              {
                "@type": "Offer", name: "Tek araç", url: URL,
                priceCurrency: "TRY", price: "790",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer", name: "İki araç (kargo bedava)", url: URL,
                priceCurrency: "TRY", price: "1400",
                availability: "https://schema.org/InStock",
              },
            ],
            hasMerchantReturnPolicy: {
              "@type": "MerchantReturnPolicy",
              applicableCountry: "TR",
              returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
              merchantReturnDays: 14,
              returnMethod: "https://schema.org/ReturnByMail",
            },
          }),
        }}
      />

      {/* HERO */}
      <section style={{ padding: "56px 20px 44px", textAlign: "center", background: "linear-gradient(180deg,#fff 0%,#f8fafc 100%)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "#FDECEE", color: C.kirmizi, padding: "5px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 18 }}>
            MobilDiafon Auto
          </span>
          <h1 style={{ fontSize: "clamp(28px,5vw,44px)", lineHeight: 1.15, margin: "0 0 16px", fontWeight: 800 }}>
            Numaranız görünmeden<br />size ulaşılsın
          </h1>
          <p style={{ fontSize: 17, color: C.gri, lineHeight: 1.6, margin: "0 0 28px" }}>
            Aracınızın camındaki QR kodu okutan kişi size doğrudan ulaşır.
            Telefon numaranız hiçbir zaman görünmez. Karşı tarafın uygulama indirmesi gerekmez.
          </p>
          <img
            src="https://cdn.mobildiafon.com/org/arac-sticker.webp"
            alt="Araç camına yapıştırılmış MobilDiafon Auto QR etiketi"
            style={{ width: "100%", maxWidth: 460, borderRadius: 16, margin: "0 auto 28px", display: "block" }}
          />
          <Link href="/arac-siparis" style={{ display: "inline-block", background: C.kirmizi, color: "#fff", padding: "15px 38px", borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: "none" }}>
            Hemen Satın Al — 790 ₺
          </Link>
          <div style={{ fontSize: 13.5, color: C.gri, marginTop: 12 }}>
            1 yıl kullanım dahil · 2 iş günü içinde kargo · 14 gün iade hakkı
          </div>
        </div>
      </section>

      {/* NASIL CALISIR */}
      <section style={{ padding: "48px 20px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, textAlign: "center", marginBottom: 34 }}>Nasıl çalışır?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 22 }}>
          {[
            ["1", "Etiketi yapıştırın", "Kutudan çıkan sticker'ı aracınızın ön camına yapıştırın."],
            ["2", "Uygulamadan aktive edin", "Kutudaki aktivasyon kodunu MobilDiafon uygulamasına girin."],
            ["3", "Ulaşılabilir olun", "QR'ı okutan kişi size bağlanır, numaranız gizli kalır."],
          ].map(([no, baslik, metin]) => (
            <div key={no} style={{ background: "#fff", border: `1px solid ${C.cizgi}`, borderRadius: 14, padding: 22 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.kirmizi, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 14 }}>{no}</div>
              <h3 style={{ fontSize: 17, margin: "0 0 7px" }}>{baslik}</h3>
              <p style={{ fontSize: 14.5, color: C.gri, lineHeight: 1.55, margin: 0 }}>{metin}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NE ISE YARAR */}
      <section style={{ padding: "44px 20px", background: C.acikGri }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, textAlign: "center", marginBottom: 30 }}>Hangi durumlarda işe yarar?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {[
              ["Yanlış park", "Aracınız birinin çıkışını kapattığında hemen haberiniz olur."],
              ["Kaza ve çizik", "Bir sorun olduğunda size ulaşılabilir, not bırakmaya gerek kalmaz."],
              ["Çekici ve otopark", "Aracınız taşınmadan önce sizinle iletişime geçilebilir."],
              ["Farlar açık kaldı", "Küçük uyarılar için bile kolayca ulaşılırsınız."],
            ].map(([b, m]) => (
              <div key={b} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: `1px solid ${C.cizgi}` }}>
                <h3 style={{ fontSize: 16, margin: "0 0 6px" }}>{b}</h3>
                <p style={{ fontSize: 14, color: C.gri, margin: 0, lineHeight: 1.5 }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIYAT */}
      <section style={{ padding: "50px 20px", maxWidth: 860, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, textAlign: "center", marginBottom: 10 }}>Fiyat</h2>
        <p style={{ textAlign: "center", color: C.gri, fontSize: 15, marginBottom: 30 }}>
          Ne kadar çok araç, o kadar uygun birim fiyat.
        </p>

        <div style={{ border: `1px solid ${C.cizgi}`, borderRadius: 16, overflow: "hidden", background: "#fff" }}>
          {[
            ["1 araç", "790 ₺", "790 ₺ + 120 ₺ kargo", false],
            ["2 araç", "700 ₺", "1.400 ₺ · kargo ücretsiz", true],
            ["3–9 araç", "650 ₺", "kargo ücretsiz", false],
            ["10–24 araç", "590 ₺", "kargo ücretsiz", false],
          ].map(([adet, birim, not, one], idx) => (
            <div key={adet as string} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px", gap: 12,
              borderTop: idx === 0 ? "none" : `1px solid ${C.cizgi}`,
              background: one ? "#FDF3F4" : "#fff",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>
                  {adet}
                  {one ? <span style={{ marginLeft: 8, background: C.kirmizi, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 }}>POPÜLER</span> : null}
                </div>
                <div style={{ fontSize: 13.5, color: C.gri, marginTop: 3 }}>{not}</div>
              </div>
              <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{birim}</div>
                <div style={{ fontSize: 12, color: C.gri }}>araç başına</div>
              </div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", gap: 12, borderTop: `1px solid ${C.cizgi}`, background: C.acikGri }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>25 araç ve üzeri</div>
              <div style={{ fontSize: 13.5, color: C.gri, marginTop: 3 }}>Filo, otopark, rezidans ve kurumsal kullanım</div>
            </div>
            <Link href="/iletisim" style={{ background: C.lacivert, color: "#fff", padding: "9px 20px", borderRadius: 9, fontSize: 14, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
              Teklif Al
            </Link>
          </div>
        </div>

        <p style={{ fontSize: 13.5, color: C.gri, textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
          Fiyatlara KDV dahildir. Her karta 1 yıl kullanım dahildir.<br />
          Siparişiniz 2 iş günü içinde kargoya verilir.
        </p>
      </section>

      {/* KUTU ICERIGI */}
      <section style={{ padding: "44px 20px", background: C.acikGri }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h2 style={{ fontSize: 26, textAlign: "center", marginBottom: 26 }}>Kutunun içinde ne var?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {[
              ["2 adet QR sticker", "Biri araç camına, biri yedek."],
              ["Aktivasyon kartı", "Uygulamada kullanacağınız gizli kod."],
              ["Kurulum kılavuzu", "Adım adım yapıştırma ve aktivasyon."],
            ].map(([b, m]) => (
              <div key={b} style={{ background: "#fff", borderRadius: 12, padding: 18, border: `1px solid ${C.cizgi}` }}>
                <h3 style={{ fontSize: 15.5, margin: "0 0 5px" }}>{b}</h3>
                <p style={{ fontSize: 13.5, color: C.gri, margin: 0 }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SSS */}
      <section style={{ padding: "48px 20px", maxWidth: 780, margin: "0 auto" }}>
        <h2 style={{ fontSize: 26, textAlign: "center", marginBottom: 26 }}>Sık sorulan sorular</h2>
        {[
          ["Telefon numaram görünüyor mu?", "Hayır. QR kodu okutan kişi sizinle iletişime geçebilir ancak numaranızı hiçbir aşamada göremez."],
          ["Karşı tarafın uygulama indirmesi gerekiyor mu?", "Hayır. QR kodu okutulduğunda tarayıcıda açılan sayfa üzerinden size ulaşılır."],
          ["Kargo ne zaman gelir?", "Siparişiniz 2 iş günü içinde kargoya verilir. Teslimat süresi bulunduğunuz ile göre değişir."],
          ["İade edebilir miyim?", "Evet. Teslimattan itibaren 14 gün içinde iade edebilirsiniz. Etiket size ulaştıysa 190 ₺ etiket bedeli düşülür."],
          ["Aracımı satarsam ne olur?", "Uygulamadan aracı hesabınızdan çıkarabilir, etiketi yeni sahibine devretmek yerine imha etmenizi öneririz."],
          ["Aynı karta eşimi de ekleyebilir miyim?", "Evet. Bir araca birden fazla kullanıcı tanımlayabilirsiniz, bildirim hepsine gider."],
        ].map(([s, c]) => (
          <details key={s} style={{ borderBottom: `1px solid ${C.cizgi}`, padding: "15px 0" }}>
            <summary style={{ fontSize: 16, fontWeight: 600, cursor: "pointer" }}>{s}</summary>
            <p style={{ fontSize: 14.5, color: C.gri, lineHeight: 1.6, margin: "10px 0 0" }}>{c}</p>
          </details>
        ))}
      </section>

      {/* GUVEN */}
      <section style={{ padding: "36px 20px", background: C.acikGri }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, textAlign: "center" }}>
          {[
            ["Numaranız gizli", "Hiçbir zaman paylaşılmaz"],
            ["Güvenli ödeme", "iyzico altyapısı"],
            ["14 gün iade", "Koşulsuz cayma hakkı"],
            ["KVKK uyumlu", "Verileriniz korunur"],
          ].map(([b, m]) => (
            <div key={b}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{b}</div>
              <div style={{ fontSize: 13, color: C.gri, marginTop: 3 }}>{m}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SON CTA */}
      <section style={{ padding: "50px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 24, marginBottom: 14 }}>Aracınız için hazır mısınız?</h2>
        <Link href="/arac-siparis" style={{ display: "inline-block", background: C.kirmizi, color: "#fff", padding: "15px 38px", borderRadius: 12, fontSize: 17, fontWeight: 700, textDecoration: "none" }}>
          Hemen Satın Al — 790 ₺
        </Link>
      </section>

      {/* SABIT ALT BAR (mobil) */}
      <div style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: `1px solid ${C.cizgi}`, padding: "11px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, boxShadow: "0 -2px 12px rgba(0,0,0,.06)" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.1 }}>790 ₺</div>
          <div style={{ fontSize: 12, color: C.gri }}>1 yıl kullanım dahil</div>
        </div>
        <Link href="/arac-siparis" style={{ background: C.kirmizi, color: "#fff", padding: "11px 26px", borderRadius: 10, fontSize: 15.5, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
          Satın Al
        </Link>
      </div>
    </main>
  );
}
