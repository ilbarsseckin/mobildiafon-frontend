"use client";

import { useState } from "react";
import Link from "next/link";

const steps = [
  {
    no: "01",
    title: "QR veya konumla binayı bulun",
    text: "Ziyaretçi bina girişindeki QR kodu okutur ya da uygulamada konumuna yakın kayıtlı binayı seçer.",
  },
  {
    no: "02",
    title: "Daire listesinden kişiyi arayın",
    text: "Yetkili daire ve sakin listesi açılır. Ziyaretçi doğru daireye tek dokunuşla görüntülü çağrı başlatır.",
  },
  {
    no: "03",
    title: "Telefon çalar, kapı yönetilir",
    text: "Ev sahibi çağrıyı telefondan yanıtlar. Uygun yapılarda Tuya entegrasyonu ile kapı açma desteklenir.",
  },
];

const features = [
  {
    title: "Panelsiz dijital diafon",
    text: "Ayrı kapı paneli şartı olmadan QR ve mobil arama akışıyla bina iletişimini dijitale taşır.",
  },
  {
    title: "Konum kontrollü erişim",
    text: "Bina yöneticisi isterse konum yarıçapı tanımlar; liste yalnızca bina çevresinde görünür.",
  },
  {
    title: "Yönetici ve güvenlik paneli",
    text: "Sakin onayı, daire yönetimi, güvenlik görevlisi ekleme, çağrı kayıtları ve not bırakma ekranları hazırdır.",
  },
  {
    title: "Apartman, site ve işletme uyumlu",
    text: "Tek bloktan çoklu site yapısına kadar ölçeklenebilir. Villa, ofis ve işletme girişleri için de uygundur.",
  },
  {
    title: "QR ile hızlı kurulum",
    text: "Her bina için QR kod üretilebilir; apartman girişine asılan afiş üzerinden hızlı erişim sağlanır.",
  },
  {
    title: "Kurumsal abonelik altyapısı",
    text: "Başlangıç, profesyonel ve kurumsal planlarla satış, deneme ve yönetim süreci sadeleşir.",
  },
];

const plans = [
  { name: "Başlangıç", price: "₺499/ay", detail: "30 daireye kadar", href: "/satin-al?plan=baslangic" },
  { name: "Profesyonel", price: "₺1.299/ay", detail: "150 daireye kadar", href: "/satin-al?plan=profesyonel", featured: true },
  { name: "Kurumsal", price: "Teklif", detail: "Çoklu site ve işletmeler", href: "/satin-al?plan=kurumsal" },
];

function IconQr() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm11 0h2v2h-2v-2Zm4 0h1v5h-5v-1h4v-4Zm-4 4h2v2h-2v-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 10 4-2.5v9L16 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M12 3 5.5 5.5v5.8c0 4.3 2.7 8.2 6.5 9.7 3.8-1.5 6.5-5.4 6.5-9.7V5.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const [open, setOpen] = useState(false);

  return (
    <main className="md-site">
      <header className="md-header">
        <div className="md-wrap md-nav">
          <Link href="/" className="md-logo" aria-label="MobilDiafon ana sayfa">
            <span className="m">Mobil</span><span className="d">Diafon</span>
          </Link>

          <nav className={`md-nav-links ${open ? "open" : ""}`}>
            <a href="#nasil">Nasıl çalışır?</a>
            <a href="#ozellikler">Özellikler</a>
            <a href="#fiyat">Fiyatlandırma</a>
            <Link href="/yonetici">Yönetici</Link>
            <Link href="/guvenlik">Güvenlik</Link>
          </nav>

          <div className="md-nav-actions">
            <Link href="/satin-al?plan=profesyonel" className="md-btn md-btn-primary md-btn-sm">14 Gün Dene</Link>
            <button className="md-toggle" onClick={() => setOpen((v) => !v)} aria-label="Menüyü aç/kapat">☰</button>
          </div>
        </div>
      </header>

      <section className="md-hero">
        <div className="md-wrap md-hero-inner">
          <div>
            <span className="md-eyebrow-pill"><span /> QR + Konum tabanlı mobil diafon</span>
            <h1 className="md-h1">Diafonu binadan çıkarıp <span className="accent">telefonunuza taşıyoruz.</span></h1>
            <p className="md-sub">
              MobilDiafon; apartman, site ve işletmeler için QR kod, konum doğrulama ve görüntülü arama destekli modern kapı iletişim platformudur.
            </p>
            <div className="md-cta">
              <Link href="/satin-al?plan=profesyonel" className="md-btn md-btn-primary">Ücretsiz Denemeyi Başlat</Link>
              <a href="#nasil" className="md-btn md-btn-ghost">Akışı İncele</a>
            </div>
            <div className="md-hero-badges">
              <span><IconQr /> QR ile bina bulma</span>
              <span><IconVideo /> Görüntülü arama</span>
              <span><IconShield /> Yönetici onayı</span>
            </div>
          </div>

          <div className="md-visual md-dashboard-visual" aria-hidden="true">
            <div className="md-map-card">
              <div className="md-map-top">
                <span>Konum alanı</span>
                <b>120 m</b>
              </div>
              <div className="md-map-grid">
                <span className="pin p1" />
                <span className="pin p2" />
                <span className="pin p3" />
              </div>
              <div className="md-map-footer">Bina çevresinde liste açılır</div>
            </div>

            <div className="md-phone-lite">
              <div className="md-phone-screen">
                <div className="md-phone-status">Gelen çağrı</div>
                <div className="md-call-avatar">12</div>
                <strong>Apartman Girişi</strong>
                <small>Daire 12 · Ziyaretçi</small>
                <div className="md-call-actions"><span className="decline" /><span className="accept" /></div>
                <div className="md-door-chip">Tuya ile kapıyı aç</div>
              </div>
            </div>

            <div className="md-building-card">
              <div className="md-building-icon"><IconQr /></div>
              <strong>Yıldız Sitesi A Blok</strong>
              <span>48 daire · 92 sakin</span>
              <div className="md-mini-list"><i /> <i /> <i /></div>
            </div>
          </div>
        </div>
      </section>

      <section id="nasil" className="md-section">
        <div className="md-wrap">
          <div className="md-center">
            <span className="md-eyebrow">Sistem Akışı</span>
            <h2 className="md-title">Ziyaretçi için kolay, yönetici için kontrollü.</h2>
            <p className="md-lead md-lead-center">Karmaşık donanım dili yerine sade bir kullanıcı akışı: QR okut, binayı doğrula, daireyi ara.</p>
          </div>
          <div className="md-steps">
            {steps.map((s) => (
              <article className="md-step" key={s.no}>
                <div className="md-step-num">{s.no}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="ozellikler" className="md-section md-features-sec">
        <div className="md-wrap">
          <span className="md-eyebrow">Kurumsal Altyapı</span>
          <h2 className="md-title">Apartman yönetimi, güvenlik ve sakinler aynı sistemde.</h2>
          <p className="md-lead">Marka algısını sade tutan, güven veren ve mobilde hızlı çalışan bir ürün deneyimi.</p>
          <div className="md-features md-feature-grid-6">
            {features.map((f) => (
              <article className="md-feature" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="fiyat" className="md-section">
        <div className="md-wrap">
          <div className="md-center">
            <span className="md-eyebrow">Abonelik</span>
            <h2 className="md-title">Binanıza uygun planı seçin.</h2>
            <p className="md-lead md-lead-center">Başlangıç için hızlı deneme, büyüyen siteler için profesyonel yönetim, büyük yapılar için kurumsal teklif.</p>
          </div>
          <div className="md-pricing-grid">
            {plans.map((p) => (
              <article className={`md-price-card ${p.featured ? "featured" : ""}`} key={p.name}>
                {p.featured && <span className="md-price-ribbon">Önerilen</span>}
                <h3>{p.name}</h3>
                <div className="md-price">{p.price}</div>
                <p>{p.detail}</p>
                <Link href={p.href} className={p.featured ? "md-btn md-btn-primary" : "md-btn md-btn-ghost"}>Planı Seç</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="md-wrap md-final-cta">
        <div>
          <span className="md-eyebrow">MobilDiafon</span>
          <h2>Binanızın dijital giriş deneyimini bugün başlatın.</h2>
          <p>QR afiş, konum doğrulama, yönetici onayı ve güvenlik paneliyle kurumsal bir kapı iletişim sistemi kurun.</p>
        </div>
        <Link href="/satin-al?plan=profesyonel" className="md-btn md-btn-primary">Başvuru Oluştur</Link>
      </section>

      <footer className="md-footer">
        <div className="md-wrap md-foot-grid">
          <div>
            <div className="md-foot-logo">Mobil<span className="d">Diafon</span></div>
            <p className="md-foot-about">QR ve konum tabanlı dijital diafon platformu. Apartman, site ve işletmeler için modern iletişim çözümü.</p>
          </div>
          <div className="md-foot-col">
            <h4>Ürün</h4>
            <a href="#nasil">Nasıl çalışır?</a>
            <a href="#ozellikler">Özellikler</a>
            <a href="#fiyat">Fiyatlandırma</a>
          </div>
          <div className="md-foot-col">
            <h4>Paneller</h4>
            <Link href="/yonetici">Yönetici Girişi</Link>
            <Link href="/guvenlik">Güvenlik Girişi</Link>
            <Link href="/superadmin">Süper Admin</Link>
          </div>
        </div>
        <div className="md-wrap md-foot-bottom">
          <span>© 2026 MobilDiafon</span>
          <span>Diafon artık cebinizde.</span>
        </div>
      </footer>
    </main>
  );
}
