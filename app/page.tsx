"use client";

import { useState } from "react";
import Link from "next/link";

// Logo kaynağı: yerelde /public/logo.png, canlıda R2'deki webp.
// R2'ye geçince koda dokunma — sadece .env'e şunu ekle:
//   NEXT_PUBLIC_LOGO_URL=https://<r2-domain>/logo.webp
const LOGO_URL = process.env.NEXT_PUBLIC_LOGO_URL || "/logo.png";
// Footer (lacivert zemin) için açık renkli logo. R2'de: .../logo-light.webp
const LOGO_LIGHT_URL = process.env.NEXT_PUBLIC_LOGO_LIGHT_URL || "/logo-light.png";

const FAQS: [string, string][] = [
  [
    "Donanım veya panel kurmam gerekiyor mu?",
    "Hayır. MobilDiafon tamamen donanımsız çalışır. Kapıya fiziksel diafon paneli, kablolama veya zil tesisatı kurmanıza gerek yoktur. Tek ihtiyaç, girişe yapıştırılan bir QR kod ya da binanın konum bilgisidir.",
  ],
  [
    "Ziyaretçinin uygulama indirmesi gerekiyor mu?",
    "Hayır. Ziyaretçi, kapıdaki QR kodu telefon kamerasıyla okutur veya binanın konumuna geldiğinde sistemi tarayıcıdan açar. Hiçbir uygulama kurmadan daire listesini görür ve görüntülü arama başlatır.",
  ],
  [
    "Kapıyı nasıl açıyoruz?",
    "Tuya akıllı kilit ve röle cihazlarıyla entegre çalışır. Daire sakini görüntülü görüşme sırasında tek dokunuşla kapıyı, bariyeri veya turnikeyi uzaktan açabilir.",
  ],
  [
    "Sistemi kim yönetiyor?",
    "Bina yöneticisi, yönetici panelinden daireleri tanımlar, sakinleri onaylar ve güvenlik görevlilerini ekler. Sakinler ise kendi telefonlarından çağrı alır. Yetkilendirme daire bazlıdır.",
  ],
  [
    "Verilerimiz nerede tutuluyor?",
    "Tüm sistem güçlü bir bulut altyapısı üzerinde çalışır. Kayıt, onay ve çağrı süreçleri yönetici kontrolündedir; erişim daire ve role göre sınırlandırılır.",
  ],
];

const PLANS = [
  {
    id: "baslangic",
    name: "Başlangıç",
    price: "₺499",
    period: "/ay",
    tagline: "Küçük apartmanlar için",
    features: [
      "Tek bina / blok",
      "30 daireye kadar",
      "QR ve konum ile erişim",
      "Yönetici paneli",
      "Görüntülü arama",
    ],
    highlight: false,
  },
  {
    id: "profesyonel",
    name: "Profesyonel",
    price: "₺1.299",
    period: "/ay",
    tagline: "Siteler ve çok bloklu yapılar",
    features: [
      "Çoklu blok / bina",
      "150 daireye kadar",
      "Tuya kapı açma entegrasyonu",
      "Güvenlik paneli & çağrı kayıtları",
      "Öncelikli destek",
    ],
    highlight: true,
  },
  {
    id: "kurumsal",
    name: "Kurumsal",
    price: "Teklif",
    period: "",
    tagline: "Çoklu site, otel ve işletmeler",
    features: [
      "Sınırsız bina / daire",
      "Özel entegrasyonlar",
      "Çoklu yönetici & rol yönetimi",
      "SLA & adanmış destek",
      "Kurumsal raporlama",
    ],
    highlight: false,
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  return (
    <main className="lp">
      {/* ---------- HEADER ---------- */}
      <header className="lp-header">
        <div className="lp-wrap lp-nav">
          <Link href="/" className="lp-logo-img" aria-label="MobilDiafon">
            <img src={LOGO_URL} alt="MobilDiafon" />
          </Link>

          <nav className={`lp-links ${menuOpen ? "open" : ""}`}>
            <a href="#how" onClick={() => setMenuOpen(false)}>Nasıl Çalışır?</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Özellikler</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Fiyatlandırma</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>SSS</a>

            <div className="lp-mobile-cta">
              <Link href="/yonetici" className="lp-link-plain">Yönetici Girişi</Link>
              <Link href="/guvenlik" className="lp-link-plain">Güvenlik Girişi</Link>
              <Link href="/satin-al" className="lp-btn primary sm">14 Gün Ücretsiz Dene</Link>
            </div>
          </nav>

          <div className="lp-nav-right">
            <div className="lp-login" onMouseLeave={() => setLoginOpen(false)}>
              <button className="lp-login-btn" onClick={() => setLoginOpen((v) => !v)}>
                Giriş Yap
                <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {loginOpen && (
                <div className="lp-login-menu">
                  <Link href="/yonetici">Yönetici Paneli</Link>
                  <Link href="/guvenlik">Güvenlik Paneli</Link>
                  <Link href="/superadmin">Süper Admin</Link>
                </div>
              )}
            </div>
            <Link href="/satin-al" className="lp-btn primary">14 Gün Ücretsiz Dene</Link>
          </div>

          <button className="lp-menu" onClick={() => setMenuOpen((v) => !v)} aria-label="Menü">☰</button>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="lp-hero">
        <div className="lp-wrap lp-hero-grid">
          <div className="lp-hero-text">
            <span className="lp-eyebrow">Donanım gerektirmeyen mobil diafon</span>
            <h1>
              Diafonu duvardan kaldırdık,
              <br />
              <span className="accent">telefonunuza taşıdık.</span>
            </h1>
            <p>
              MobilDiafon; panel, kablolama ve özel donanım gerektirmeyen, QR ve
              konum tabanlı görüntülü kapı iletişim sistemidir. Ziyaretçi uygulama
              indirmeden sizi arar, Tuya entegrasyonuyla kapınızı uzaktan açarsınız.
            </p>

            <div className="lp-actions">
              <Link href="/satin-al" className="lp-btn primary lg">
                14 Gün Ücretsiz Dene
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a href="#how" className="lp-btn ghost lg">Nasıl çalışır?</a>
            </div>

            <ul className="lp-trust">
              <li>Donanım ve panel yok</li>
              <li>Güçlü bulut altyapısı</li>
              <li>Tuya ile kapı açma</li>
            </ul>
          </div>

          {/* SİGNATURE VİSUAL: ziyaretçi binayı "pingliyor" → telefon çalıyor */}
          <div className="lp-hero-visual">
            <div className="lp-radar">
              <span className="ring r1" />
              <span className="ring r2" />
              <span className="ring r3" />
              <div className="lp-target">
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                  <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="15" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="3" y="15" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M15 15h2v2m4 4v-6h-6v2m4 4h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            <div className="lp-phone">
              <div className="lp-phone-screen">
                <div className="lp-call-top">Gelen görüntülü çağrı</div>
                <div className="lp-bell">
                  <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff">
                    <path d="M12 2a6 6 0 0 0-6 6v3.6L4.3 15a1 1 0 0 0 .9 1.5h13.6a1 1 0 0 0 .9-1.5L18 11.6V8a6 6 0 0 0-6-6Zm0 20a2.6 2.6 0 0 0 2.5-2h-5A2.6 2.6 0 0 0 12 22Z" />
                  </svg>
                </div>
                <div className="lp-call-name">Apartman Girişi</div>
                <div className="lp-call-sub">Daire 12 · Ziyaretçi</div>
                <div className="lp-call-actions">
                  <span className="ca red">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M21 15.5c-1.2 0-2.4-.2-3.6-.6a1 1 0 0 0-1 .2l-1.5 1.5a14 14 0 0 1-6-6l1.5-1.5a1 1 0 0 0 .2-1A11 11 0 0 1 9.5 3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1A17 17 0 0 0 21 21a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" transform="rotate(135 12 12)" /></svg>
                  </span>
                  <span className="ca green">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M21 15.5c-1.2 0-2.4-.2-3.6-.6a1 1 0 0 0-1 .2l-1.5 1.5a14 14 0 0 1-6-6l1.5-1.5a1 1 0 0 0 .2-1A11 11 0 0 1 9.5 3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1A17 17 0 0 0 21 21a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" /></svg>
                  </span>
                </div>
                <div className="lp-door-pill">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M5 21h12M5 21H3m13 0h2m-6-9h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Tuya ile kapıyı aç
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DONANIMSIZ: QR + KONUM ---------- */}
      <section className="lp-modes">
        <div className="lp-wrap">
          <div className="lp-mode-grid">
            <div className="lp-mode-head">
              <span className="lp-eyebrow">İki yol, sıfır donanım</span>
              <h2>Ziyaretçi sizi nasıl bulur?</h2>
              <p>Kapıda fiziksel bir cihaz aramaya gerek yok. İki yöntemden biri yeterli.</p>
            </div>
            <div className="lp-mode">
              <div className="lp-mode-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><path d="M14 14h3v3m4 4v-7h-3m3 7h-4v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
              <h3>QR kod ile</h3>
              <p>Girişe yapıştırılan QR kodu telefon kamerasıyla okutur. Saniyeler içinde binanın daire listesi açılır.</p>
            </div>
            <div className="lp-mode">
              <div className="lp-mode-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" /></svg>
              </div>
              <h3>Konum ile</h3>
              <p>QR yoksa sorun değil. Ziyaretçi binanın konumuna geldiğinde sistem doğru binayı otomatik bulur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- NASIL ÇALIŞIR (ZİYARETÇİ AKIŞI) ---------- */}
      <section id="how" className="lp-section">
        <div className="lp-wrap lp-center">
          <span className="lp-eyebrow">Nasıl çalışır?</span>
          <h2>Kapıdan kapı açmaya, dört adımda</h2>
          <p className="lp-lead">
            Ziyaretçi geldiğinde başlayan ve kapının açılmasıyla biten, baştan
            sona yönetilebilir bir akış.
          </p>
        </div>

        <div className="lp-wrap lp-steps">
          {[
            ["Ziyaretçi kapıya gelir", "QR kodu okutur ya da konumuyla binayı bulur. Uygulama indirmesi gerekmez."],
            ["Daire listesini görür", "Binadaki daireleri ve sakinleri görür, aramak istediği daireyi seçer."],
            ["Görüntülü arar", "Sakini telefonundan görüntülü arar. Sakin evde olmasa bile çağrıyı yanıtlar."],
            ["Kapı açılır", "Sakin, Tuya entegrasyonuyla kapıyı, bariyeri veya turnikeyi uzaktan açar."],
          ].map(([title, desc], i) => (
            <div className="lp-step" key={i}>
              <div className="lp-step-num">{String(i + 1).padStart(2, "0")}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ÖZELLİKLER ---------- */}
      <section id="features" className="lp-section soft">
        <div className="lp-wrap lp-center">
          <span className="lp-eyebrow">Özellikler</span>
          <h2>Modern bina iletişimi için eksiksiz altyapı</h2>
        </div>

        <div className="lp-wrap lp-features">
          {[
            ["Donanımsız kurulum", "Panel, kablo ve zil tesisatı yok. Kurulum dakikalar sürer, bakım maliyeti neredeyse sıfırdır.", "M12 2 3 7v6c0 5 3.8 8.5 9 9 5.2-.5 9-4 9-9V7l-9-5Z"],
            ["Güçlü bulut altyapısı", "Sistem internet üzerinden çalışır, otomatik güncellenir ve her zaman erişilebilir kalır.", "M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 17 18H7Z"],
            ["Tuya kapı açma", "Akıllı kilit ve röle entegrasyonuyla kapıyı, bariyeri ve turnikeyi telefondan açın.", "M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M12 12h.01"],
            ["QR + konum erişimi", "Ziyaretçi ister QR okutur ister konumuyla bulunur. İki yöntem de uygulamasız çalışır.", "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM16 16h2m-2 4h4v-4"],
            ["Yönetici & güvenlik panelleri", "Yönetici daireleri ve sakinleri yönetir; güvenlik görevlisi giriş kontrolünü sağlar.", "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"],
            ["Çağrı kayıtları & 7/24 erişim", "Tüm görüntülü çağrılar kayıt altında. Daire sakini nerede olursa olsun kapısını görür.", "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"],
          ].map(([title, desc, path], i) => (
            <div className="lp-feature" key={i}>
              <div className="lp-feature-icon">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <path d={path} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- TUYA BANDI ---------- */}
      <section className="lp-section">
        <div className="lp-wrap">
          <div className="lp-band">
            <div className="lp-band-text">
              <span className="lp-eyebrow light">Akıllı kilit entegrasyonu</span>
              <h2>Kapınızı görüşme sırasında, telefondan açın</h2>
              <p>
                MobilDiafon Tuya ekosistemiyle entegre çalışır. Görüntülü görüşme
                sırasında tek dokunuşla akıllı kilidi, kapıyı veya bahçe bariyerini
                uzaktan açabilir; ziyaretçiyi içeri kabul edebilirsiniz.
              </p>
              <Link href="/satin-al" className="lp-btn primary">Hemen başla</Link>
            </div>
            <div className="lp-band-visual">
              <div className="lp-lock">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="15.5" r="1.4" fill="currentColor" /></svg>
                <span className="lp-lock-dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- KULLANIM ALANLARI ---------- */}
      <section className="lp-section soft">
        <div className="lp-wrap lp-center">
          <span className="lp-eyebrow">Kullanım alanları</span>
          <h2>Tek sistem, her tür yapı</h2>
          <div className="lp-chips">
            {["Apartman", "Site", "Villa", "Ofis", "Otel", "İş Merkezi", "Klinik", "Fabrika"].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FİYATLANDIRMA ---------- */}
      <section id="pricing" className="lp-section">
        <div className="lp-wrap lp-center">
          <span className="lp-eyebrow">Fiyatlandırma</span>
          <h2>14 gün ücretsiz, sonra size uygun plan</h2>
          <p className="lp-lead">Kart bilgisi olmadan başlayın. İstediğiniz zaman planı yükseltin.</p>
        </div>

        <div className="lp-wrap lp-plans">
          {PLANS.map((p) => (
            <div className={`lp-plan ${p.highlight ? "featured" : ""}`} key={p.id}>
              {p.highlight && <span className="lp-plan-tag">En çok tercih edilen</span>}
              <h3>{p.name}</h3>
              <div className="lp-plan-tagline">{p.tagline}</div>
              <div className="lp-plan-price">
                <strong>{p.price}</strong>
                <span>{p.period}</span>
              </div>
              <ul className="lp-plan-features">
                {p.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 20 20" width="16" height="16" fill="none"><path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={`/satin-al?plan=${p.id}`} className={`lp-btn ${p.highlight ? "primary" : "ghost"} full`}>
                {p.id === "kurumsal" ? "Teklif Al" : "Denemeyi Başlat"}
              </Link>
            </div>
          ))}
        </div>
        <p className="lp-price-note">Fiyatlar örnek niteliğindedir, KDV hariçtir.</p>
      </section>

      {/* ---------- SSS ---------- */}
      <section id="faq" className="lp-section soft">
        <div className="lp-wrap lp-faq-wrap">
          <div className="lp-center">
            <span className="lp-eyebrow">Sıkça sorulan sorular</span>
            <h2>Merak edilenler</h2>
          </div>
          <div className="lp-faq">
            {FAQS.map(([q, a], i) => (
              <div className={`lp-faq-item ${faqOpen === i ? "open" : ""}`} key={i}>
                <button className="lp-faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{q}</span>
                  <span className="lp-faq-icon">{faqOpen === i ? "−" : "+"}</span>
                </button>
                {faqOpen === i && <div className="lp-faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SON CTA ---------- */}
      <section className="lp-cta-section">
        <div className="lp-wrap">
          <div className="lp-cta">
            <h2>Binanız için diafonu bugün cebe taşıyın</h2>
            <p>14 gün boyunca tüm özellikleri ücretsiz deneyin. Kurulum donanım gerektirmez.</p>
            <div className="lp-cta-actions">
              <Link href="/satin-al" className="lp-btn white lg">14 Gün Ücretsiz Dene</Link>
              <a href="https://wa.me/905555555555" className="lp-btn outline-white lg">WhatsApp ile görüş</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-grid">
          <div className="lp-footer-brand">
            <Link href="/" className="lp-logo-img footer" aria-label="MobilDiafon">
              <img src={LOGO_LIGHT_URL} alt="MobilDiafon" />
            </Link>
            <p>QR ve konum tabanlı, donanımsız ve kurumsal mobil diafon çözümü.</p>
          </div>
          <div className="lp-footer-col">
            <h4>Ürün</h4>
            <a href="#how">Nasıl Çalışır?</a>
            <a href="#features">Özellikler</a>
            <a href="#pricing">Fiyatlandırma</a>
          </div>
          <div className="lp-footer-col">
            <h4>Giriş</h4>
            <Link href="/yonetici">Yönetici Paneli</Link>
            <Link href="/guvenlik">Güvenlik Paneli</Link>
            <Link href="/superadmin">Süper Admin</Link>
          </div>
          <div className="lp-footer-col">
            <h4>İletişim</h4>
            <a href="mailto:info@mobildiafon.com">info@mobildiafon.com</a>
            <a href="https://wa.me/905555555555">WhatsApp</a>
          </div>
        </div>
        <div className="lp-copy">© 2026 MobilDiafon. Tüm hakları saklıdır.</div>
      </footer>

      {/* ---------- STİL ---------- */}
      <style jsx global>{`
        :root {
          --navy: #1b2a4a;
          --navy-deep: #14213d;
          --red: #e63946;
          --red-dark: #cc2f3c;
          --red-soft: #fdeef0;
          --ink: #1a1a2e;
          --gray: #5a6478;
          --line: #e6e9f0;
          --soft: #f7f9fc;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: var(--ink); background: #fff; -webkit-font-smoothing: antialiased; }
        .lp a { text-decoration: none; }
        .lp-wrap { width: min(1160px, calc(100% - 40px)); margin: 0 auto; }

        /* HEADER */
        .lp-header { position: sticky; top: 0; z-index: 60; background: rgba(255,255,255,0.85); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
        .lp-nav { height: 74px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .lp-logo { font-size: 24px; font-weight: 800; letter-spacing: -0.03em; color: var(--navy); }
        .lp-logo b { color: var(--red); }
        .lp-logo-img { display: inline-flex; align-items: center; }
        .lp-logo-img img { height: 38px; width: auto; display: block; }
        .lp-logo-img.footer img { height: 34px; }
        .lp-links { display: flex; align-items: center; gap: 30px; }
        .lp-links > a { color: var(--gray); font-weight: 600; font-size: 15px; transition: color .2s; }
        .lp-links > a:hover { color: var(--navy); }
        .lp-mobile-cta { display: none; }
        .lp-nav-right { display: flex; align-items: center; gap: 12px; }
        .lp-login { position: relative; }
        .lp-login-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: 1px solid var(--line); border-radius: 10px; padding: 9px 14px; font-size: 14px; font-weight: 600; color: var(--navy); cursor: pointer; transition: border-color .2s; font-family: inherit; }
        .lp-login-btn:hover { border-color: var(--navy); }
        .lp-login-menu { position: absolute; top: calc(100% + 8px); right: 0; background: #fff; border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 20px 50px -20px rgba(27,42,74,.4); padding: 6px; min-width: 190px; }
        .lp-login-menu a { display: block; padding: 11px 14px; border-radius: 8px; font-size: 14px; font-weight: 600; color: var(--navy); }
        .lp-login-menu a:hover { background: var(--soft); }
        .lp-menu { display: none; background: none; border: none; font-size: 26px; color: var(--navy); cursor: pointer; }

        /* BUTTONS */
        .lp-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 11px; font-weight: 700; font-size: 15px; cursor: pointer; transition: all .2s; border: 1px solid transparent; padding: 11px 20px; font-family: inherit; }
        .lp-btn.lg { padding: 15px 26px; font-size: 16px; }
        .lp-btn.sm { padding: 10px 16px; font-size: 14px; }
        .lp-btn.full { width: 100%; }
        .lp-btn.primary { background: var(--red); color: #fff; }
        .lp-btn.primary:hover { background: var(--red-dark); transform: translateY(-2px); box-shadow: 0 14px 30px -12px rgba(230,57,70,.6); }
        .lp-btn.ghost { background: #fff; color: var(--navy); border-color: var(--line); }
        .lp-btn.ghost:hover { border-color: var(--navy); }
        .lp-btn.white { background: #fff; color: var(--navy); }
        .lp-btn.white:hover { transform: translateY(-2px); }
        .lp-btn.outline-white { background: transparent; color: #fff; border-color: rgba(255,255,255,.3); }
        .lp-btn.outline-white:hover { border-color: #fff; }

        /* HERO */
        .lp-hero { background: linear-gradient(180deg, #fff 0%, var(--soft) 100%); overflow: hidden; }
        .lp-hero-grid { display: grid; grid-template-columns: 1.08fr 0.92fr; gap: 56px; align-items: center; padding: 84px 0 92px; }
        .lp-eyebrow { display: inline-block; color: var(--red); font-weight: 700; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; }
        .lp-eyebrow.light { color: #ff9aa3; }
        .lp-hero-text h1 { margin: 16px 0 0; font-size: clamp(38px, 5.4vw, 62px); line-height: 1.04; letter-spacing: -0.03em; color: var(--navy-deep); font-weight: 800; animation: lp-up .6s ease both; }
        .lp-hero-text h1 .accent { color: var(--red); }
        .lp-hero-text p { margin: 22px 0 0; max-width: 540px; font-size: clamp(16px, 2vw, 19px); color: var(--gray); line-height: 1.65; animation: lp-up .6s .08s ease both; }
        .lp-actions { display: flex; gap: 14px; margin-top: 34px; flex-wrap: wrap; animation: lp-up .6s .16s ease both; }
        .lp-trust { list-style: none; padding: 0; margin: 34px 0 0; display: flex; flex-wrap: wrap; gap: 22px; animation: lp-up .6s .24s ease both; }
        .lp-trust li { position: relative; padding-left: 22px; color: var(--navy); font-weight: 600; font-size: 14.5px; }
        .lp-trust li::before { content: ""; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 8px; height: 8px; border-radius: 50%; background: var(--red); }
        @keyframes lp-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

        /* HERO VISUAL */
        .lp-hero-visual { position: relative; display: flex; align-items: center; justify-content: center; min-height: 440px; }
        .lp-radar { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .lp-radar .ring { position: absolute; border-radius: 50%; border: 1.5px solid rgba(230,57,70,.22); animation: lp-ping 3s ease-out infinite; }
        .lp-radar .ring.r1 { width: 200px; height: 200px; animation-delay: 0s; }
        .lp-radar .ring.r2 { width: 320px; height: 320px; animation-delay: .6s; }
        .lp-radar .ring.r3 { width: 440px; height: 440px; animation-delay: 1.2s; }
        @keyframes lp-ping { 0% { opacity: .7; transform: scale(.6); } 100% { opacity: 0; transform: scale(1); } }
        .lp-target { width: 64px; height: 64px; border-radius: 18px; background: var(--navy-deep); color: #fff; display: flex; align-items: center; justify-content: center; position: absolute; left: 8%; top: 14%; box-shadow: 0 16px 40px -14px rgba(27,42,74,.6); }
        .lp-phone { width: 248px; height: 420px; background: var(--navy-deep); border-radius: 38px; padding: 11px; box-shadow: 0 40px 80px -28px rgba(27,42,74,.5); position: relative; z-index: 2; }
        .lp-phone-screen { width: 100%; height: 100%; background: linear-gradient(165deg, #243d68 0%, #1b2a4a 100%); border-radius: 28px; display: flex; flex-direction: column; align-items: center; padding: 30px 22px; gap: 8px; }
        .lp-call-top { color: #9fb3d6; font-size: 12px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
        .lp-bell { width: 78px; height: 78px; border-radius: 50%; background: var(--red); display: flex; align-items: center; justify-content: center; margin-top: 26px; animation: lp-ring 1.8s infinite; }
        @keyframes lp-ring { 0% { box-shadow: 0 0 0 0 rgba(230,57,70,.5); } 70% { box-shadow: 0 0 0 24px rgba(230,57,70,0); } 100% { box-shadow: 0 0 0 0 rgba(230,57,70,0); } }
        .lp-call-name { color: #fff; font-weight: 700; font-size: 19px; margin-top: 22px; }
        .lp-call-sub { color: #9fb3d6; font-size: 13.5px; }
        .lp-call-actions { display: flex; gap: 26px; margin-top: 22px; }
        .ca { width: 54px; height: 54px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .ca.red { background: #e63946; } .ca.green { background: #2bb673; }
        .lp-door-pill { margin-top: auto; display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,.12); color: #fff; border: 1px solid rgba(255,255,255,.18); border-radius: 30px; padding: 9px 16px; font-size: 13px; font-weight: 600; }

        /* MODES (QR + KONUM) */
        .lp-modes { padding: 64px 0; border-bottom: 1px solid var(--line); }
        .lp-mode-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 28px; align-items: center; }
        .lp-mode-head h2 { margin: 12px 0 8px; font-size: clamp(24px, 3vw, 32px); letter-spacing: -.02em; color: var(--navy-deep); }
        .lp-mode-head p { color: var(--gray); margin: 0; font-size: 16px; }
        .lp-mode { background: var(--soft); border: 1px solid var(--line); border-radius: 16px; padding: 28px; }
        .lp-mode-icon { width: 50px; height: 50px; border-radius: 13px; background: #fff; border: 1px solid var(--line); color: var(--red); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .lp-mode h3 { margin: 0 0 8px; color: var(--navy-deep); font-size: 19px; }
        .lp-mode p { margin: 0; color: var(--gray); font-size: 14.5px; line-height: 1.6; }

        /* SECTIONS */
        .lp-section { padding: 88px 0; }
        .lp-section.soft { background: var(--soft); }
        .lp-center { text-align: center; }
        .lp-section h2, .lp-mode-head h2 { font-weight: 800; }
        .lp-center h2 { font-size: clamp(28px, 4vw, 42px); letter-spacing: -.025em; color: var(--navy-deep); margin: 12px 0 0; }
        .lp-lead { max-width: 620px; margin: 16px auto 0; color: var(--gray); font-size: 18px; line-height: 1.6; }

        /* STEPS */
        .lp-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin-top: 54px; }
        .lp-step { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 28px 24px; position: relative; transition: transform .2s, box-shadow .2s; }
        .lp-step:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -22px rgba(27,42,74,.35); }
        .lp-step-num { font-size: 14px; font-weight: 800; color: var(--red); letter-spacing: .08em; margin-bottom: 16px; }
        .lp-step h3 { margin: 0 0 8px; font-size: 18px; color: var(--navy-deep); }
        .lp-step p { margin: 0; color: var(--gray); font-size: 14.5px; line-height: 1.6; }

        /* FEATURES */
        .lp-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 54px; }
        .lp-feature { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 30px; transition: transform .2s, box-shadow .2s; }
        .lp-feature:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -22px rgba(27,42,74,.3); }
        .lp-feature-icon { width: 50px; height: 50px; border-radius: 13px; background: var(--red-soft); color: var(--red); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
        .lp-feature h3 { margin: 0 0 9px; font-size: 18.5px; color: var(--navy-deep); }
        .lp-feature p { margin: 0; color: var(--gray); font-size: 14.5px; line-height: 1.62; }

        /* TUYA BAND */
        .lp-band { background: linear-gradient(135deg, var(--navy-deep), var(--navy)); border-radius: 24px; padding: 56px; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 32px; align-items: center; overflow: hidden; }
        .lp-band-text h2 { color: #fff; margin: 12px 0 14px; font-size: clamp(26px, 3.4vw, 36px); letter-spacing: -.02em; }
        .lp-band-text p { color: #aebfdc; margin: 0 0 26px; max-width: 480px; line-height: 1.65; font-size: 16px; }
        .lp-band-visual { display: flex; justify-content: center; }
        .lp-lock { position: relative; width: 120px; height: 120px; border-radius: 30px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: #fff; display: flex; align-items: center; justify-content: center; }
        .lp-lock-dot { position: absolute; top: 16px; right: 16px; width: 12px; height: 12px; border-radius: 50%; background: #2bb673; box-shadow: 0 0 0 0 rgba(43,182,115,.6); animation: lp-dot 2s infinite; }
        @keyframes lp-dot { 0% { box-shadow: 0 0 0 0 rgba(43,182,115,.6); } 70% { box-shadow: 0 0 0 12px rgba(43,182,115,0); } 100% { box-shadow: 0 0 0 0 rgba(43,182,115,0); } }

        /* CHIPS */
        .lp-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 40px; }
        .lp-chips span { background: #fff; border: 1px solid var(--line); border-radius: 30px; padding: 12px 22px; font-weight: 600; color: var(--navy); font-size: 15px; }

        /* PRICING */
        .lp-plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 54px; align-items: stretch; }
        .lp-plan { background: #fff; border: 1px solid var(--line); border-radius: 18px; padding: 32px 28px; display: flex; flex-direction: column; position: relative; }
        .lp-plan.featured { border-color: var(--red); box-shadow: 0 24px 60px -28px rgba(230,57,70,.45); transform: translateY(-8px); }
        .lp-plan-tag { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--red); color: #fff; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; white-space: nowrap; }
        .lp-plan h3 { margin: 0; font-size: 21px; color: var(--navy-deep); }
        .lp-plan-tagline { color: var(--gray); font-size: 14px; margin-top: 4px; }
        .lp-plan-price { margin: 20px 0; }
        .lp-plan-price strong { font-size: 38px; color: var(--navy-deep); font-weight: 800; letter-spacing: -.02em; }
        .lp-plan-price span { color: var(--gray); font-size: 15px; }
        .lp-plan-features { list-style: none; padding: 0; margin: 0 0 26px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .lp-plan-features li { display: flex; align-items: center; gap: 10px; color: var(--ink); font-size: 14.5px; }
        .lp-plan-features svg { color: var(--red); flex-shrink: 0; }
        .lp-price-note { text-align: center; color: var(--gray); font-size: 13px; margin-top: 22px; }

        /* FAQ */
        .lp-faq-wrap { max-width: 820px; }
        .lp-faq { margin-top: 44px; display: flex; flex-direction: column; gap: 12px; }
        .lp-faq-item { background: #fff; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; transition: border-color .2s; }
        .lp-faq-item.open { border-color: var(--navy); }
        .lp-faq-q { width: 100%; background: none; border: none; padding: 20px 22px; display: flex; align-items: center; justify-content: space-between; gap: 16px; cursor: pointer; text-align: left; font-size: 16px; font-weight: 700; color: var(--navy-deep); font-family: inherit; }
        .lp-faq-icon { font-size: 22px; color: var(--red); flex-shrink: 0; }
        .lp-faq-a { padding: 0 22px 20px; color: var(--gray); font-size: 15px; line-height: 1.65; }

        /* CTA */
        .lp-cta-section { padding: 0 0 88px; }
        .lp-cta { background: linear-gradient(135deg, var(--red), var(--red-dark)); border-radius: 24px; padding: 60px; text-align: center; }
        .lp-cta h2 { color: #fff; margin: 0 0 12px; font-size: clamp(26px, 3.6vw, 38px); font-weight: 800; letter-spacing: -.02em; }
        .lp-cta p { color: rgba(255,255,255,.9); margin: 0 0 28px; font-size: 17px; }
        .lp-cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        .lp-footer { background: var(--navy-deep); color: #fff; padding: 60px 0 28px; }
        .lp-footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 36px; }
        .lp-logo.footer { font-size: 22px; }
        .lp-logo.footer { color: #fff; }
        .lp-footer-brand p { color: #93a4c4; margin: 14px 0 0; max-width: 280px; font-size: 14.5px; line-height: 1.6; }
        .lp-footer-col h4 { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: #cdd8ee; margin: 0 0 16px; }
        .lp-footer-col a { display: block; color: #93a4c4; font-size: 14.5px; margin-bottom: 11px; transition: color .2s; }
        .lp-footer-col a:hover { color: #fff; }
        .lp-copy { border-top: 1px solid rgba(255,255,255,.1); margin-top: 44px; padding-top: 24px; text-align: center; color: #7f90b0; font-size: 13.5px; }

        /* RESPONSIVE */
        @media (max-width: 920px) {
          .lp-hero-grid { grid-template-columns: 1fr; text-align: center; padding: 60px 0 70px; }
          .lp-hero-text p { margin-left: auto; margin-right: auto; }
          .lp-actions, .lp-trust { justify-content: center; }
          .lp-hero-visual { margin-top: 40px; min-height: 380px; }
          .lp-mode-grid, .lp-steps, .lp-features { grid-template-columns: 1fr; }
          .lp-plans { grid-template-columns: 1fr; }
          .lp-plan.featured { transform: none; }
          .lp-band { grid-template-columns: 1fr; text-align: center; padding: 40px 28px; }
          .lp-band-text p { margin-left: auto; margin-right: auto; }
          .lp-band-visual { margin-top: 24px; }
          .lp-footer-grid { grid-template-columns: 1fr 1fr; }
          .lp-nav-right { display: none; }
          .lp-menu { display: block; }
          .lp-links { display: none; position: absolute; top: 74px; left: 0; right: 0; background: #fff; flex-direction: column; align-items: flex-start; gap: 16px; padding: 22px 24px; border-bottom: 1px solid var(--line); }
          .lp-links.open { display: flex; }
          .lp-mobile-cta { display: flex; flex-direction: column; gap: 12px; width: 100%; margin-top: 6px; }
          .lp-link-plain { color: var(--navy); font-weight: 600; font-size: 15px; }
        }
        @media (max-width: 520px) {
          .lp-footer-grid { grid-template-columns: 1fr; }
          .lp-cta, .lp-band { padding: 36px 22px; }
        }
      `}</style>
    </main>
  );
}