"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API = "/api";
// DEMO_MODE=true: ödeme/sipariş ucu olmadan akışı simüle eder (anında demo).
// Gerçek backend hazır olunca false yapın; POST /api/orders/start çağrılır.
const DEMO_MODE = true;

type PlanId = "baslangic" | "profesyonel" | "kurumsal";

const PLANS: Record<PlanId, { name: string; monthly: number; tagline: string; flats: string; features: string[] }> = {
  baslangic: {
    name: "Başlangıç",
    monthly: 499,
    tagline: "Küçük apartmanlar",
    flats: "30 daireye kadar",
    features: ["Tek bina / blok", "QR ve konum ile erişim", "Yönetici paneli", "Görüntülü arama"],
  },
  profesyonel: {
    name: "Profesyonel",
    monthly: 1299,
    tagline: "Siteler ve çok bloklu yapılar",
    flats: "150 daireye kadar",
    features: ["Çoklu blok / bina", "Tuya kapı açma", "Güvenlik paneli & çağrı kayıtları", "Öncelikli destek"],
  },
  kurumsal: {
    name: "Kurumsal",
    monthly: 0,
    tagline: "Çoklu site, otel ve işletmeler",
    flats: "Sınırsız daire",
    features: ["Özel entegrasyonlar", "Çoklu yönetici & rol", "SLA & adanmış destek", "Kurumsal raporlama"],
  },
};

const fmt = (n: number) => "₺" + n.toLocaleString("tr-TR");

export default function SatinAl() {
  const [plan, setPlan] = useState<PlanId>("profesyonel");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    siteName: "",
    flatCount: "",
    fullName: "",
    phone: "",
    email: "",
    card: "",
    expiry: "",
    cvc: "",
  });

  // URL'den plan seçimi (?plan=profesyonel)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p === "baslangic" || p === "profesyonel" || p === "kurumsal") setPlan(p);
  }, []);

  const p = PLANS[plan];
  const isEnterprise = plan === "kurumsal";
  const yearly = billing === "yearly";
  const monthlyPrice = p.monthly;
  const total = isEnterprise ? 0 : yearly ? monthlyPrice * 10 : monthlyPrice; // yıllık: 2 ay bedava
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate(): string | null {
    if (!form.siteName.trim()) return "Bina / site adını girin.";
    if (!isEnterprise && !form.flatCount.trim()) return "Daire sayısını girin.";
    if (!form.fullName.trim()) return "Yetkili adını girin.";
    if (!/^0?5\d{9}$|^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ""))) return "Geçerli bir telefon numarası girin.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Geçerli bir e-posta girin.";
    if (!isEnterprise && form.card.replace(/\s/g, "").length < 12) return "Kart numarasını kontrol edin.";
    return null;
  }

  async function submit() {
    setError("");
    if (isEnterprise) {
      // Kurumsal: ödeme yok, teklif talebi
      if (!form.siteName.trim() || !form.fullName.trim() || !form.email.trim()) {
        setError("Lütfen bina, yetkili ve e-posta alanlarını doldurun.");
        return;
      }
      setStep("success");
      return;
    }
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 900));
      } else {
        const res = await fetch(`${API}/orders/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan, billing,
            siteName: form.siteName.trim(),
            flatCount: Number(form.flatCount) || null,
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            // Kart bilgisi backend'e gönderilmez; ödeme sağlayıcı (iyzico/Stripe) token'ı kullanılır.
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Sipariş başlatılamadı");
      }
      setStep("success");
    } catch (e: any) {
      setError(e.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ck">
      <header className="ck-top">
        <div className="ck-wrap ck-top-inner">
          <Link href="/" className="ck-logo">Mobil<b>Diafon</b></Link>
          <Link href="/" className="ck-back">← Ana sayfa</Link>
        </div>
      </header>

      {step === "success" ? (
        <section className="ck-wrap ck-success">
          <div className="ck-success-icon">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <h1>{isEnterprise ? "Teklif talebiniz alındı" : "14 günlük denemeniz başladı"}</h1>
          <p>
            {isEnterprise
              ? "Kurumsal ekibimiz en kısa sürede sizinle iletişime geçecek."
              : `${form.email} adresine kurulum bağlantınızı gönderdik. Yönetici panelinden binanızı tanımlayarak hemen başlayabilirsiniz.`}
          </p>
          <div className="ck-success-actions">
            {!isEnterprise && <Link href="/yonetici" className="ck-btn primary">Yönetici Paneline Git</Link>}
            <Link href="/" className="ck-btn ghost">Ana sayfa</Link>
          </div>
        </section>
      ) : (
        <section className="ck-wrap ck-grid">
          {/* SOL: FORM */}
          <div className="ck-main">
            <h1>Aboneliğinizi başlatın</h1>
            <p className="ck-sub">İlk 14 gün ücretsiz. Deneme bitmeden iptal ederseniz ücret alınmaz.</p>

            {/* Plan seçimi */}
            <div className="ck-block">
              <div className="ck-block-title">1. Plan seçin</div>
              <div className="ck-plan-row">
                {(Object.keys(PLANS) as PlanId[]).map((id) => (
                  <button key={id} className={`ck-plan ${plan === id ? "active" : ""}`} onClick={() => setPlan(id)}>
                    <div className="ck-plan-name">{PLANS[id].name}</div>
                    <div className="ck-plan-flats">{PLANS[id].flats}</div>
                    <div className="ck-plan-price">{PLANS[id].monthly ? fmt(PLANS[id].monthly) + "/ay" : "Teklif"}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Faturalama */}
            {!isEnterprise && (
              <div className="ck-block">
                <div className="ck-block-title">2. Faturalama döngüsü</div>
                <div className="ck-billing">
                  <button className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>Aylık</button>
                  <button className={billing === "yearly" ? "active" : ""} onClick={() => setBilling("yearly")}>
                    Yıllık <span className="ck-save">2 ay bedava</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bina bilgisi */}
            <div className="ck-block">
              <div className="ck-block-title">{isEnterprise ? "2." : "3."} Bina bilgileri</div>
              <div className="ck-fields">
                <label className="ck-field full">
                  <span>Bina / Site adı</span>
                  <input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="Örn: Yıldız Sitesi A Blok" />
                </label>
                {!isEnterprise && (
                  <label className="ck-field">
                    <span>Daire sayısı</span>
                    <input value={form.flatCount} onChange={(e) => set("flatCount", e.target.value)} inputMode="numeric" placeholder="48" />
                  </label>
                )}
                <label className="ck-field">
                  <span>Yetkili ad soyad</span>
                  <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Ad Soyad" />
                </label>
                <label className="ck-field">
                  <span>Telefon</span>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" placeholder="05XX XXX XX XX" />
                </label>
                <label className="ck-field">
                  <span>E-posta</span>
                  <input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" placeholder="ornek@site.com" />
                </label>
              </div>
            </div>

            {/* Ödeme */}
            {!isEnterprise && (
              <div className="ck-block">
                <div className="ck-block-title">4. Ödeme yöntemi</div>
                <div className="ck-pay-note">
                  Deneme süresince ücret alınmaz. Kart bilgileriniz güvenli ödeme sağlayıcısı üzerinden saklanır.
                </div>
                <div className="ck-fields">
                  <label className="ck-field full">
                    <span>Kart numarası</span>
                    <input value={form.card} onChange={(e) => set("card", e.target.value)} inputMode="numeric" placeholder="0000 0000 0000 0000" />
                  </label>
                  <label className="ck-field">
                    <span>Son kullanma</span>
                    <input value={form.expiry} onChange={(e) => set("expiry", e.target.value)} placeholder="AA/YY" />
                  </label>
                  <label className="ck-field">
                    <span>CVC</span>
                    <input value={form.cvc} onChange={(e) => set("cvc", e.target.value)} inputMode="numeric" placeholder="123" />
                  </label>
                </div>
              </div>
            )}

            {error && <div className="ck-error">{error}</div>}
          </div>

          {/* SAĞ: ÖZET */}
          <aside className="ck-summary">
            <div className="ck-summary-card">
              <div className="ck-summary-plan">
                <span>{p.name} planı</span>
                <small>{p.tagline}</small>
              </div>
              <ul className="ck-summary-feats">
                {p.features.map((f) => (
                  <li key={f}>
                    <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {f}
                  </li>
                ))}
              </ul>

              {!isEnterprise ? (
                <>
                  <div className="ck-summary-line"><span>{yearly ? "Yıllık tutar" : "Aylık tutar"}</span><span>{fmt(total)}</span></div>
                  <div className="ck-summary-line trial"><span>İlk 14 gün</span><span>Ücretsiz</span></div>
                  <div className="ck-summary-total">
                    <span>Bugün ödenecek</span>
                    <strong>₺0</strong>
                  </div>
                  <div className="ck-summary-after">Deneme sonrası {fmt(total)}{yearly ? "/yıl" : "/ay"}</div>
                </>
              ) : (
                <div className="ck-summary-enterprise">Fiyatlandırma ihtiyacınıza göre belirlenir. Talebiniz sonrası size özel teklif sunulur.</div>
              )}

              <button className="ck-btn primary full" onClick={submit} disabled={loading}>
                {loading ? "İşleniyor..." : isEnterprise ? "Teklif Al" : "Denemeyi Başlat"}
              </button>
              <div className="ck-secure">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" /></svg>
                256-bit SSL ile korunur
              </div>
            </div>
          </aside>
        </section>
      )}

      <style jsx global>{`
        :root {
          --navy: #1b2a4a; --navy-deep: #14213d; --red: #e63946; --red-dark: #cc2f3c;
          --red-soft: #fdeef0; --ink: #1a1a2e; --gray: #5a6478; --line: #e6e9f0; --soft: #f7f9fc;
        }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: var(--ink); background: var(--soft); -webkit-font-smoothing: antialiased; }
        .ck a { text-decoration: none; }
        .ck-wrap { width: min(1080px, calc(100% - 40px)); margin: 0 auto; }

        .ck-top { background: #fff; border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 20; }
        .ck-top-inner { height: 66px; display: flex; align-items: center; justify-content: space-between; }
        .ck-logo { font-size: 22px; font-weight: 800; letter-spacing: -.03em; color: var(--navy); }
        .ck-logo b { color: var(--red); }
        .ck-back { color: var(--gray); font-weight: 600; font-size: 14px; }
        .ck-back:hover { color: var(--navy); }

        .ck-grid { display: grid; grid-template-columns: 1.5fr 0.85fr; gap: 32px; padding: 48px 0 72px; align-items: start; }
        .ck-main h1 { margin: 0; font-size: 30px; color: var(--navy-deep); letter-spacing: -.02em; }
        .ck-sub { color: var(--gray); margin: 8px 0 0; font-size: 15.5px; }

        .ck-block { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 24px; margin-top: 18px; }
        .ck-block-title { font-size: 15px; font-weight: 700; color: var(--navy-deep); margin-bottom: 16px; }

        .ck-plan-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .ck-plan { text-align: left; background: var(--soft); border: 2px solid var(--line); border-radius: 13px; padding: 16px; cursor: pointer; transition: all .15s; font-family: inherit; }
        .ck-plan:hover { border-color: #c3ccdd; }
        .ck-plan.active { border-color: var(--red); background: var(--red-soft); }
        .ck-plan-name { font-weight: 700; color: var(--navy-deep); font-size: 16px; }
        .ck-plan-flats { color: var(--gray); font-size: 12.5px; margin: 3px 0 8px; }
        .ck-plan-price { font-weight: 700; color: var(--navy); font-size: 14px; }

        .ck-billing { display: flex; gap: 10px; }
        .ck-billing button { flex: 1; padding: 14px; border: 2px solid var(--line); background: var(--soft); border-radius: 12px; font-weight: 700; color: var(--gray); cursor: pointer; font-family: inherit; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .15s; }
        .ck-billing button.active { border-color: var(--navy); color: var(--navy-deep); background: #fff; }
        .ck-save { background: #2bb673; color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 12px; font-weight: 700; }

        .ck-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .ck-field { display: flex; flex-direction: column; gap: 7px; }
        .ck-field.full { grid-column: 1 / -1; }
        .ck-field span { font-size: 13px; font-weight: 600; color: var(--gray); }
        .ck-field input { padding: 13px 15px; border: 1px solid var(--line); border-radius: 11px; font-size: 15px; outline: none; transition: border-color .2s; font-family: inherit; }
        .ck-field input:focus { border-color: var(--navy); }
        .ck-pay-note { background: var(--soft); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: var(--gray); margin-bottom: 16px; }

        .ck-error { background: #fdecee; color: #c0283a; padding: 13px 16px; border-radius: 11px; font-size: 14px; margin-top: 18px; font-weight: 600; }

        .ck-summary { position: sticky; top: 90px; }
        .ck-summary-card { background: #fff; border: 1px solid var(--line); border-radius: 16px; padding: 26px; }
        .ck-summary-plan { padding-bottom: 18px; border-bottom: 1px solid var(--line); }
        .ck-summary-plan span { font-weight: 800; color: var(--navy-deep); font-size: 19px; display: block; }
        .ck-summary-plan small { color: var(--gray); font-size: 13.5px; }
        .ck-summary-feats { list-style: none; padding: 18px 0; margin: 0; border-bottom: 1px solid var(--line); display: flex; flex-direction: column; gap: 11px; }
        .ck-summary-feats li { display: flex; align-items: center; gap: 9px; font-size: 14px; color: var(--ink); }
        .ck-summary-feats svg { color: var(--red); flex-shrink: 0; }
        .ck-summary-line { display: flex; justify-content: space-between; padding: 10px 0 0; font-size: 14.5px; color: var(--gray); }
        .ck-summary-line.trial span:last-child { color: #2bb673; font-weight: 700; }
        .ck-summary-total { display: flex; justify-content: space-between; align-items: baseline; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); }
        .ck-summary-total span { font-weight: 700; color: var(--navy-deep); }
        .ck-summary-total strong { font-size: 30px; color: var(--navy-deep); letter-spacing: -.02em; }
        .ck-summary-after { color: var(--gray); font-size: 12.5px; margin-top: 4px; text-align: right; }
        .ck-summary-enterprise { color: var(--gray); font-size: 14px; line-height: 1.6; padding: 16px 0; }

        .ck-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 11px; font-weight: 700; font-size: 15px; cursor: pointer; border: 1px solid transparent; padding: 13px 22px; font-family: inherit; transition: all .2s; }
        .ck-btn.full { width: 100%; margin-top: 20px; }
        .ck-btn.primary { background: var(--red); color: #fff; }
        .ck-btn.primary:hover:not(:disabled) { background: var(--red-dark); }
        .ck-btn.primary:disabled { opacity: .6; cursor: not-allowed; }
        .ck-btn.ghost { background: #fff; color: var(--navy); border-color: var(--line); }
        .ck-btn.ghost:hover { border-color: var(--navy); }
        .ck-secure { display: flex; align-items: center; justify-content: center; gap: 6px; color: var(--gray); font-size: 12.5px; margin-top: 14px; }

        .ck-success { text-align: center; padding: 90px 0; max-width: 540px; }
        .ck-success-icon { width: 72px; height: 72px; border-radius: 50%; background: #e8f6ee; color: #1c7a47; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .ck-success h1 { margin: 0 0 12px; font-size: 30px; color: var(--navy-deep); letter-spacing: -.02em; }
        .ck-success p { color: var(--gray); font-size: 16px; line-height: 1.6; margin: 0 0 28px; }
        .ck-success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        @media (max-width: 880px) {
          .ck-grid { grid-template-columns: 1fr; }
          .ck-summary { position: static; }
          .ck-plan-row { grid-template-columns: 1fr; }
          .ck-fields { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}