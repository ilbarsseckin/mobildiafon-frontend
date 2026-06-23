"use client";

import { useState, useEffect, useRef, type PointerEvent } from "react";
import Link from "next/link";
import { IL_ILCE } from "./il-ilce";

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
            <a href="#bina" onClick={() => setOpen(false)}>Binanı Ekle</a>
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
   BİNANI BUL / EKLE
   ============================================================ */
type Bldg = { il: string; ilce: string; ad: string; daire: number; lat: number; lng: number };

const DEMO_MODE = true;

const REGISTERED: Bldg[] = [
  { il: "İstanbul", ilce: "Kadıköy", ad: "yıldız apartmanı", daire: 48, lat: 40.9901, lng: 29.0289 },
  { il: "İstanbul", ilce: "Kadıköy", ad: "yıldız apartmanı", daire: 30, lat: 40.9712, lng: 29.0625 },
  { il: "İstanbul", ilce: "Kadıköy", ad: "marmara residence", daire: 96, lat: 40.9785, lng: 29.0512 },
  { il: "İstanbul", ilce: "Kadıköy", ad: "bağdat sitesi", daire: 60, lat: 40.9669, lng: 29.076 },
  { il: "İstanbul", ilce: "Beşiktaş", ad: "levent apartmanı", daire: 32, lat: 41.078, lng: 29.011 },
  { il: "Ankara", ilce: "Çankaya", ad: "güneş sitesi", daire: 120, lat: 39.905, lng: 32.854 },
  { il: "Ankara", ilce: "Çankaya", ad: "çankaya konakları", daire: 40, lat: 39.892, lng: 32.861 },
  { il: "İzmir", ilce: "Bornova", ad: "deniz apartmanı", daire: 24, lat: 38.47, lng: 27.216 },
];

const bbNorm = (s: string) => (s || "").trim().toLocaleLowerCase("tr");
const bbTitle = (s: string) => s.replace(/\S+/g, (w) => w.charAt(0).toLocaleUpperCase("tr") + w.slice(1));
const bbFmt = (n: number) => n.toLocaleString("tr-TR");
const bbMap = (q: string) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
const bbRate = (n: number) => (n <= 20 ? 15 : n <= 60 ? 13 : n <= 150 ? 11 : 9);

async function bbSearch(il: string, ilce: string): Promise<Bldg[]> {
  if (DEMO_MODE) return REGISTERED.filter((r) => r.il === il && r.ilce === ilce);
  try {
    const res = await fetch(`/api/buildings/search?il=${encodeURIComponent(il)}&ilce=${encodeURIComponent(ilce)}`);
    if (!res.ok) return [];
    return (await res.json()) as Bldg[];
  } catch {
    return [];
  }
}

function BinaBul() {
  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [ad, setAd] = useState("");
  const [searched, setSearched] = useState(false);
  const [inDistrict, setInDistrict] = useState<Bldg[]>([]);
  const [nameMatches, setNameMatches] = useState<Bldg[]>([]);
  const [selected, setSelected] = useState<Bldg | null>(null);
  const [residentOpen, setResidentOpen] = useState(false);
  const [denyOpen, setDenyOpen] = useState(false);
  const [joinDone, setJoinDone] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);
  const [tip, setTip] = useState<"apartman" | "villa" | "isletme">("apartman");
  const [yapi, setYapi] = useState<"duz" | "blok">("duz");
  const [bill, setBill] = useState<"ay" | "yil">("ay");
  const [duzCount, setDuzCount] = useState(24);
  const [blokCount, setBlokCount] = useState(3);
  const [blokPer, setBlokPer] = useState(16);
  const [islCount, setIslCount] = useState(20);
  const [resDaire, setResDaire] = useState("1");
  const [resTel, setResTel] = useState("");

  const ilceList = il ? IL_ILCE[il] || [] : [];
  const iller = Object.keys(IL_ILCE).sort((a, b) => a.localeCompare(b, "tr"));

  function softReset() {
    setSearched(false); setSelected(null); setResidentOpen(false);
    setDenyOpen(false); setJoinDone(false); setManagerOpen(false);
  }

  async function onBul() {
    if (!il || !ilce) { window.alert("Lütfen il ve ilçe seçin."); return; }
    const list = await bbSearch(il, ilce);
    const q = bbNorm(ad);
    const matches = q.length >= 2 ? list.filter((r) => r.ad.includes(q) || q.includes(r.ad)) : [];
    setInDistrict(list); setNameMatches(matches);
    setSelected(matches.length === 1 ? matches[0] : null);
    setResidentOpen(false); setDenyOpen(false); setJoinDone(false); setManagerOpen(false);
    setSearched(true);
  }

  function pick(b: Bldg) { setSelected(b); setResDaire("1"); setResidentOpen(false); setDenyOpen(false); setJoinDone(false); }

  const unitCount =
    tip === "villa" ? 1 :
    tip === "isletme" ? Math.max(1, islCount || 0) :
    yapi === "duz" ? Math.max(1, duzCount || 0) :
    Math.max(1, blokCount || 0) * Math.max(1, blokPer || 0);

  const unitsPreview =
    yapi === "duz"
      ? `Otomatik: Daire 1 … Daire ${Math.max(1, duzCount || 0)} (${Math.max(1, duzCount || 0)} daire)`
      : `Otomatik: A-1 … ${String.fromCharCode(64 + Math.min(Math.max(1, blokCount || 0), 26))}-${Math.max(1, blokPer || 0)} (${Math.max(1, blokCount || 0)}×${Math.max(1, blokPer || 0)}=${Math.max(1, blokCount || 0) * Math.max(1, blokPer || 0)} daire)`;

  const isTeklif = tip === "isletme";
  const monthly = tip === "villa" ? 49 : unitCount * bbRate(unitCount);
  const priceLine = tip === "villa" ? "Tek birim sabit tarife" : `${bbFmt(unitCount)} daire × ₺${bbRate(unitCount)}/daire`;
  const amount = isTeklif ? "Kurumsal Teklif" : bill === "ay" ? `₺${bbFmt(monthly)}` : `₺${bbFmt(monthly * 10)}`;
  const amountUnit = isTeklif ? "" : bill === "ay" ? "/ay" : "/yıl";
  const calc = isTeklif ? "Otel/AVM/işletme için size özel teklif." : bill === "ay" ? priceLine : `${priceLine} · 12 ay yerine 10 ay`;
  const save = isTeklif ? "" : bill === "ay" ? "Yıllık ödemede 2 ay bedava" : `₺${bbFmt(monthly * 2)} tasarruf`;
  const typeName = tip === "apartman" ? "Apartman / Site" : tip === "villa" ? "Villa / Müstakil" : "Otel / AVM / İşletme";

  function onPay() {
    const p = new URLSearchParams({ tip, il, ilce, ad: ad.trim(), birim: String(unitCount), yapi, bill });
    window.location.href = `/satin-al?${p.toString()}`;
  }

  const others = inDistrict.filter((r) => !nameMatches.includes(r));
  const managerMapQ = [ad.trim(), ilce, il].filter(Boolean).join(", ");
  const multi = nameMatches.length > 1 && !selected;

  return (
    <section id="bina" className="bb-sec">
      <div className="md-wrap">
        <div className="bb-head">
          <span className="md-eyebrow">Binanı Ekle</span>
          <h2 className="md-title">Binanı bul, ekle ya da sakin olarak katıl</h2>
          <p className="md-lead md-lead-center">İl ve ilçeni seç, bina adını yaz, Bul&apos;a bas. Kayıtlıysa haritada doğrula ve katıl; değilse yeni bina olarak ekle. Mobil uygulama gerekmez.</p>
        </div>

        <div className="bb-card">
          <h3>Binanı Bul</h3>
          <p className="bb-sub">Önce bölgeni ve bina adını gir.</p>

          <div className="bb-row2">
            <div className="bb-field">
              <label>İl</label>
              <select value={il} onChange={(e) => { setIl(e.target.value); setIlce(""); softReset(); }}>
                <option value="">İl seçin</option>
                {iller.map((x) => (<option key={x} value={x}>{x}</option>))}
              </select>
            </div>
            <div className="bb-field">
              <label>İlçe</label>
              <select value={ilce} disabled={!il} onChange={(e) => { setIlce(e.target.value); softReset(); }}>
                <option value="">{il ? "İlçe seçin" : "Önce il seçin"}</option>
                {ilceList.map((x) => (<option key={x} value={x}>{x}</option>))}
              </select>
            </div>
          </div>
          <div className="bb-field">
            <label>Bina / Site Adı</label>
            <input value={ad} onChange={(e) => { setAd(e.target.value); setSearched(false); }} placeholder="Örn. Yıldız Apartmanı" autoComplete="off" />
          </div>
          <button className="btn btn-primary btn-block" onClick={onBul}>Bul</button>

          {searched && (
            <div className="bb-results">
              {selected && (
                <div className="bb-found">
                  <div className="bb-ftop">
                    <div>
                      <h4>{bbTitle(selected.ad)}</h4>
                      <div className="bb-addr">{selected.ilce} / {selected.il} · {selected.daire} daire</div>
                    </div>
                    <span className="bb-tag-ok">✓ Kayıtlı</span>
                  </div>
                  <div className="bb-mapwrap"><iframe title="harita" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={bbMap(`${selected.lat},${selected.lng}`)} /></div>
                  <div className="bb-ask">Bu senin binan mı? Sakini misin?</div>
                  <div className="bb-ask-actions">
                    <button className="btn btn-primary" onClick={() => { setResidentOpen(true); setDenyOpen(false); }}>Evet, sakinim</button>
                    <button className="btn btn-ghost" onClick={() => { setDenyOpen(true); setResidentOpen(false); }}>Hayır / bu değil</button>
                  </div>
                  {residentOpen && (
                    <div className="bb-resident">
                      {!joinDone ? (
                        <>
                          <div className="bb-row2" style={{ marginTop: 4 }}>
                            <div className="bb-field" style={{ marginBottom: 10 }}>
                              <label>Dairen</label>
                              <select value={resDaire} onChange={(e) => setResDaire(e.target.value)}>
                                {Array.from({ length: selected.daire }, (_, i) => i + 1).map((d) => (<option key={d} value={String(d)}>Daire {d}</option>))}
                              </select>
                            </div>
                            <div className="bb-field" style={{ marginBottom: 10 }}>
                              <label>Telefon</label>
                              <input value={resTel} onChange={(e) => setResTel(e.target.value)} placeholder="05xx xxx xx xx" autoComplete="off" />
                            </div>
                          </div>
                          <button className="btn btn-primary btn-block" onClick={() => setJoinDone(true)}>Yöneticiye Katılma İsteği Gönder</button>
                        </>
                      ) : (
                        <div className="bb-success"><b>İsteğin iletildi.</b> {bbTitle(selected.ad)} yöneticisi onayladığında bağlanacaksın. Çağrı almak için MobilDiafon uygulamasını indir — bu kayıtla otomatik bağlı geleceksin.</div>
                      )}
                    </div>
                  )}
                  {denyOpen && (<div className="bb-deny">Tamam — bu binayı seçmedin. Aşağıdaki listeden başka bina seçebilir ya da yeni bina ekleyebilirsin.</div>)}
                </div>
              )}

              {multi && (
                <>
                  <div className="bb-multi-note">&quot;{ad.trim()}&quot; adıyla birden fazla kayıtlı bina var. Adresine göre kendi binanı seç:</div>
                  <div className="bb-others">
                    {nameMatches.map((r, i) => (
                      <div className="bb-orow" key={i} onClick={() => pick(r)}>
                        <div><div className="bb-on">{bbTitle(r.ad)}</div><div className="bb-od">{r.ilce} / {r.il} · {r.daire} daire</div></div>
                        <span className="bb-pick">Bu benim binam ›</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {others.length > 0 && (
                <div className="bb-others">
                  <div className="bb-lbl">{selected ? "Bu bölgedeki diğer kayıtlı binalar" : nameMatches.length === 0 && bbNorm(ad).length >= 2 ? `“${ad.trim()}” bulunamadı — bu bölgedeki kayıtlı binalar:` : "Bu bölgedeki kayıtlı binalar"}</div>
                  {others.map((r, i) => (
                    <div className="bb-orow" key={i} onClick={() => pick(r)}>
                      <div><div className="bb-on">{bbTitle(r.ad)}</div><div className="bb-od">{r.daire} daire</div></div>
                      <span className="bb-pick">Bu benim binam ›</span>
                    </div>
                  ))}
                </div>
              )}

              {nameMatches.length === 0 && !selected && (
                <div className="bb-nomatch">{inDistrict.length ? "Aradığın bina listede yoksa yeni bina olarak ekleyebilirsin." : "Bu bölgede kayıtlı bina yok. İlk ekleyen sen olabilirsin."}</div>
              )}

              <button className="btn btn-ghost btn-block" onClick={() => setManagerOpen(true)}>+ Aradığım bina yok — yeni bina olarak ekle</button>

              {managerOpen && (
                <div className="bb-manager">
                  <h4>Yeni Bina Bilgileri</h4>
                  <div className="bb-field">
                    <label>Bina Tipi</label>
                    <div className="bb-seg">
                      {([["apartman", "Apartman / Site"], ["villa", "Villa / Müstakil"], ["isletme", "Otel / AVM / İşletme"]] as const).map(([v, l]) => (
                        <button key={v} className={tip === v ? "active" : ""} onClick={() => setTip(v)}>{l}</button>
                      ))}
                    </div>
                  </div>

                  {tip === "apartman" && (
                    <>
                      <div className="bb-field">
                        <label>Daire Yapısı</label>
                        <div className="bb-seg small">
                          <button className={yapi === "duz" ? "active" : ""} onClick={() => setYapi("duz")}>Düz (1…N)</button>
                          <button className={yapi === "blok" ? "active" : ""} onClick={() => setYapi("blok")}>Bloklu (A/B/C)</button>
                        </div>
                      </div>
                      {yapi === "duz" ? (
                        <div className="bb-field"><label>Toplam Daire Sayısı</label><input type="number" min={1} value={duzCount} onChange={(e) => setDuzCount(parseInt(e.target.value) || 0)} /></div>
                      ) : (
                        <div className="bb-row2">
                          <div className="bb-field"><label>Blok Sayısı</label><input type="number" min={1} value={blokCount} onChange={(e) => setBlokCount(parseInt(e.target.value) || 0)} /></div>
                          <div className="bb-field"><label>Her Blokta Daire</label><input type="number" min={1} value={blokPer} onChange={(e) => setBlokPer(parseInt(e.target.value) || 0)} /></div>
                        </div>
                      )}
                      <div className="bb-preview">{unitsPreview}</div>
                    </>
                  )}

                  {tip === "isletme" && (
                    <div className="bb-field"><label>Birim / Bağımsız Bölüm Sayısı</label><input type="number" min={1} value={islCount} onChange={(e) => setIslCount(parseInt(e.target.value) || 0)} /></div>
                  )}

                  <div className="bb-field" style={{ marginTop: 6 }}>
                    <label>Konum doğrulama (haritada gör)</label>
                    <div className="bb-mapwrap"><iframe title="konum" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={bbMap(managerMapQ || `${il} ${ilce}`)} /></div>
                    <p className="bb-hint">Adresini il/ilçe ve bina adına göre gösteriyoruz — yanlışsa mahalle/sokağı netleştir.</p>
                  </div>

                  <div className="bb-pricebox">
                    <div className="bb-summary"><span className="k">Konum</span><span className="v">{il} / {ilce}</span></div>
                    <div className="bb-summary"><span className="k">Bina</span><span className="v">{ad.trim() || "—"}</span></div>
                    <div className="bb-summary"><span className="k">Tip</span><span className="v">{typeName}</span></div>
                    <div className="bb-summary"><span className="k">Birim</span><span className="v">{tip === "villa" ? "1 birim" : `${bbFmt(unitCount)} ${tip === "isletme" ? "birim" : "daire"}`}</span></div>
                    <div className="bb-plbl" style={{ marginTop: 12 }}>Tahmini Tutar</div>
                    <div className="bb-amt">{amount} {amountUnit && <small>{amountUnit}</small>}</div>
                    <div className="bb-calc">{calc}</div>
                    {!isTeklif && (
                      <div className="bb-bill">
                        <button className={bill === "ay" ? "active" : ""} onClick={() => setBill("ay")}>Aylık</button>
                        <button className={bill === "yil" ? "active" : ""} onClick={() => setBill("yil")}>Yıllık</button>
                      </div>
                    )}
                    <div className="bb-save">{save}</div>
                  </div>

                  <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={onPay}>{isTeklif ? "Teklif İste" : "Ödemeye Geç"}</button>
                  <p className="bb-hint" style={{ textAlign: "center", marginTop: 10 }}>14 gün ücretsiz deneme · istediğin zaman iptal</p>
                </div>
              )}
            </div>
          )}
        </div>
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
      <BinaBul />

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