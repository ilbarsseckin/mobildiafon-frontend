"use client";

import { useState, useEffect, useRef, type PointerEvent } from "react";
import Link from "next/link";

/* ============================================================
   DATA
   ============================================================ */
const steps = [
  { no: "01", title: "QR veya konumla binayı bulun", text: "Ziyaretçi bina girişindeki QR kodu okutur ya da uygulamada konumuna yakın kayıtlı binayı seçer." },
  { no: "02", title: "Daire listesinden kişiyi arayın", text: "Yetkili daire ve sakin listesi açılır. Ziyaretçi doğru daireye tek dokunuşla görüntülü çağrı başlatır." },
  { no: "03", title: "Telefon çalar, kapı yönetilir", text: "Ev sahibi çağrıyı telefondan yanıtlar. Uygun yapılarda Tuya entegrasyonu ile kapı açma desteklenir." },
];

const features = [
  { title: "Panelsiz dijital diafon", text: "Ayrı kapı paneli şartı olmadan QR ve mobil arama akışıyla bina iletişimini dijitale taşır." },
  { title: "Konum kontrollü erişim", text: "Bina yöneticisi isterse konum yarıçapı tanımlar; liste yalnızca bina çevresinde görünür." },
  { title: "Yönetici ve güvenlik paneli", text: "Sakin onayı, daire yönetimi, güvenlik görevlisi ekleme, çağrı kayıtları ve not bırakma ekranları hazırdır." },
  { title: "Apartman, site ve işletme uyumlu", text: "Tek bloktan çoklu site yapısına kadar ölçeklenebilir. Villa, ofis ve işletme girişleri için de uygundur." },
  { title: "QR ile hızlı kurulum", text: "Her bina için QR kod üretilebilir; apartman girişine asılan afiş üzerinden hızlı erişim sağlanır." },
  { title: "Kurumsal abonelik altyapısı", text: "Başlangıç, profesyonel ve kurumsal planlarla satış, deneme ve yönetim süreci sadeleşir." },
];

const plans = [
  { name: "Başlangıç", price: "₺499/ay", detail: "30 daireye kadar", href: "/satin-al?plan=baslangic" },
  { name: "Profesyonel", price: "₺1.299/ay", detail: "150 daireye kadar", href: "/satin-al?plan=profesyonel", featured: true },
  { name: "Kurumsal", price: "Teklif", detail: "Çoklu site ve işletmeler", href: "/satin-al?plan=kurumsal" },
];

/* ============================================================
   ICONS
   ============================================================ */
function IconCheck() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function IconQr() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v6h-6v-2h4v-4Z" stroke="currentColor" strokeWidth="1.7" /></svg>); }
function IconVideo() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.8" /><path d="m16 10 4-2.5v9L16 14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>); }
function IconHome() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10v9h14v-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>); }
function IconGear() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function IconGrid() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M4 9h16M9 9v11" stroke="currentColor" strokeWidth="1.8" /></svg>); }
function IconLines() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function IconLock() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" /></svg>); }
function IconArrows() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10h12M4 10l4-4M4 10l4 4M20 14H8m12 0-4 4m4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function PhoneNo() { return (<i className="no"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M21 15.46l-5.27-.61-2.52 2.52a15.05 15.05 0 0 1-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z" /></svg></i>); }
function PhoneOk() { return (<i className="ok"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.21z" /></svg></i>); }
function CallActions() { return (<div className="call-actions"><PhoneNo /><PhoneOk /></div>); }

/* ============================================================
   HEADER (utility strip + glass nav)
   ============================================================ */
function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="util">
        <div className="wrap">
          <div className="util-trust">
            <span><IconCheck /> Panelsiz kurulum</span>
            <span><IconCheck /> 7/24 görüntülü çağrı</span>
            <span><IconCheck /> KVKK uyumlu altyapı</span>
          </div>
          <div className="util-links">
            <Link href="/yonetici">Yönetici Girişi</Link>
            <Link href="/guvenlik">Güvenlik Girişi</Link>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="wrap nav">
          <Link href="/" className="logo" aria-label="MobilDiafon ana sayfa">
            <img src="/icon-192.png" alt="MobilDiafon" width={40} height={40} />
            <span className="word"><span className="m">Mobil</span><span className="d">Diafon</span><small>Dijital Diafon Platformu</small></span>
          </Link>
          <nav className={`nav-links ${open ? "open" : ""}`}>
            <a href="#nasil" onClick={() => setOpen(false)}>Nasıl Çalışır</a>
            <a href="#ozellikler" onClick={() => setOpen(false)}>Özellikler</a>
            <a href="#fiyat" onClick={() => setOpen(false)}>Fiyatlandırma</a>
          </nav>
          <div className="nav-cta">
            <Link href="/satin-al?plan=profesyonel" className="btn btn-primary btn-sm">Binanı Dijitalleştir</Link>
            <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Menüyü aç/kapat">☰</button>
          </div>
        </div>
      </header>
    </>
  );
}

/* ============================================================
   HERO CAROUSEL
   ============================================================ */
const SLIDE_COUNT = 4;
const AUTOPLAY_MS = 7000;

function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  const go = (n: number) => setIndex((n + SLIDE_COUNT) % SLIDE_COUNT);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((v) => (v + 1) % SLIDE_COUNT), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((v) => (v + 1) % SLIDE_COUNT);
      if (e.key === "ArrowLeft") setIndex((v) => (v - 1 + SLIDE_COUNT) % SLIDE_COUNT);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onPointerDown = (e: PointerEvent) => { startX.current = e.clientX; setPaused(true); };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    setPaused(false);
  };

  const cls = (n: number) => `hc-slide ${index === n ? "is-active" : ""}`;

  return (
    <section
      className={`hero ${paused ? "paused" : ""}`}
      aria-label="Tanıtım"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <button className="hc-arrow hc-prev" onClick={prev} aria-label="Önceki">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button className="hc-arrow hc-next" onClick={next} aria-label="Sonraki">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>

      <div className="hc-viewport">
        <div className="hc-track" style={{ transform: `translateX(-${index * 100}%)` }}>

          {/* SLIDE 1 — APARTMAN / SİTE */}
          <div className={cls(0)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> QR + Konum tabanlı diafon</span>
                <h1 className="h1 anim">Diafonu binadan çıkarıp <em>telefonunuza taşıyoruz</em></h1>
                <p className="sub anim">Apartman, site ve işletmeler için panelsiz, görüntülü kapı iletişimi. Ziyaretçi QR&apos;ı okutur, siz neredeyseniz oradan açarsınız.</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=profesyonel" className="btn btn-primary">Binanı Dijitalleştir</Link>
                  <a href="#nasil" className="btn btn-ghost">▷ Nasıl çalışır?</a>
                </div>
                <div className="badges anim">
                  <span><IconQr /> QR ile bina bulma</span>
                  <span><IconVideo /> Görüntülü arama</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tl"><h5>Konum alanı <span className="tag">120 m</span></h5><p>Bina çevresinde liste açılır</p></div>
                <div className="fcard f-br"><h5>Yıldız Sitesi · A Blok</h5><p>48 daire · 92 sakin</p></div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">Gelen Çağrı</span>
                  <div className="ring">12</div>
                  <h4>Apartman Girişi</h4><span className="meta">Daire 12 · Ziyaretçi</span>
                  <CallActions />
                  <span className="door">🔓 Tuya ile kapıyı aç</span>
                </div></div>
              </div>
            </div>
          </div>

          {/* SLIDE 2 — VİLLA */}
          <div className={cls(1)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> Villa &amp; müstakil</span>
                <h1 className="h1 anim">Villanızın kapısı artık <em>cebinizde</em></h1>
                <p className="sub anim">Tek birim, dakikalar içinde kurulum. Bahçe kapısındaki QR&apos;ı okutan ziyaretçiyi görüntülü karşılayın, kapıyı uzaktan açın.</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=baslangic" className="btn btn-primary">Hemen Başla</Link>
                  <a href="#nasil" className="btn btn-ghost">Örneği gör</a>
                </div>
                <div className="badges anim">
                  <span><IconHome /> Panelsiz, kablosuz</span>
                  <span><IconGear /> Uzaktan kapı açma</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tr"><h5>Villa QR <span className="tag">✓ Doğrulandı</span></h5><div className="qrbox" /></div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">Gelen Çağrı</span>
                  <div className="ring">🏡</div>
                  <h4>Bahçe Kapısı</h4><span className="meta">Ziyaretçi geldi</span>
                  <CallActions />
                  <span className="door">🔓 Kapıyı aç</span>
                </div></div>
              </div>
            </div>
          </div>

          {/* SLIDE 3 — OTEL / AVM */}
          <div className={cls(2)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> Otel · AVM · Kampüs</span>
                <h1 className="h1 anim">Oda QR&apos;ından <em>doğru birime tek dokunuş</em></h1>
                <p className="sub anim">Resepsiyon, havuz, restoran… her birim kendi QR&apos;ıyla. Misafir aradığı yere saniyeler içinde ulaşır, talebini iletir.</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=kurumsal" className="btn btn-primary">Çözümü İncele</Link>
                  <a href="#fiyat" className="btn btn-ghost">Demo iste</a>
                </div>
                <div className="badges anim">
                  <span><IconGrid /> Kategorili birimler</span>
                  <span><IconLines /> Sipariş / talep notu</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tl"><h5>Oda 312 <span className="tag">QR ✓</span></h5><p>Misafir araması</p></div>
                <div className="fcard f-br" style={{ width: 218 }}>
                  <h5 style={{ marginBottom: 6 }}>Birimler</h5>
                  <div className="mini"><span className="ic">🛎️</span><b>Resepsiyon</b></div>
                  <div className="mini"><span className="ic">🏊</span><b>Havuz</b></div>
                  <div className="mini"><span className="ic">🍽️</span><b>Restoran</b></div>
                </div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">Gelen Çağrı</span>
                  <div className="ring">🛎️</div>
                  <h4>Resepsiyon</h4><span className="meta">Oda 312 arıyor</span>
                  <CallActions />
                  <span className="door">📝 &quot;Oda 312&apos;ye çay&quot; notu</span>
                </div></div>
              </div>
            </div>
          </div>

          {/* SLIDE 4 — AKILLI KAPI / TUYA */}
          <div className={cls(3)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> Akıllı kapı</span>
                <h1 className="h1 anim">Görüntülü gör, <em>uzaktan kapıyı aç</em></h1>
                <p className="sub anim">Tuya ve Zigbee entegrasyonu ile kapı, bariyer ve turnikeyi tek dokunuşla açın. Anahtara, panele, kabloya son.</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=profesyonel" className="btn btn-primary">Binanı Dijitalleştir</Link>
                  <a href="#ozellikler" className="btn btn-ghost">Entegrasyonlar</a>
                </div>
                <div className="badges anim">
                  <span><IconLock /> Tuya / Zigbee</span>
                  <span><IconArrows /> Kapı · bariyer · turnike</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tr"><h5>Akıllı Cihazlar</h5>
                  <div className="mini"><span className="ic">🚪</span><b>Bina kapısı</b></div>
                  <div className="mini"><span className="ic">🚧</span><b>Otopark bariyeri</b></div>
                </div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">Bağlandı · 00:12</span>
                  <div className="ring green">🔓</div>
                  <h4>Apartman Girişi</h4><span className="meta">Görüntülü görüşme</span>
                  <span className="door open">🔓 Kapıyı Aç</span>
                </div></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="hc-dots" role="tablist" aria-label="Slaytlar">
        {[0, 1, 2, 3].map((k) => (
          <button key={k} className={`hc-dot ${index === k ? "is-active" : ""}`} onClick={() => go(k)} aria-label={`${k + 1}. slayt`}>
            <span className="fill" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function HomePage() {
  return (
    <main className="md-site mdland">
      <Header />
      <HeroCarousel />

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