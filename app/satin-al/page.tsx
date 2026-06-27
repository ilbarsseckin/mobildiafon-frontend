"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://mobildiafon.com/api";
const DEMO_MODE = false;

type Plan = {
  id: string;
  name: string;
  minUnits: number;
  maxUnits: number | null;
  monthlyPrice: number;
  yearlyPrice: number;
  isActive: boolean;
  sortOrder: number;
};

const fmt = (n: number) => "₺" + n.toLocaleString("tr-TR");

const PLAN_FEATURES: Record<string, string[]> = {
  Tekil:     ["1 bina / birim", "QR ve konum ile erişim", "Görüntülü arama", "Yönetici paneli"],
  Mini:      ["2-5 daire", "QR ve konum ile erişim", "Görüntülü arama", "Yönetici paneli"],
  Küçük:    ["6-20 daire", "QR ve konum ile erişim", "Görüntülü arama", "Yönetici paneli"],
  Orta:      ["21-50 daire", "Çoklu blok desteği", "Tuya kapı açma", "Güvenlik paneli"],
  Büyük:    ["51-150 daire", "Çoklu blok desteği", "Tuya kapı açma", "Öncelikli destek"],
  Kurumsal:  ["150+ daire", "Özel entegrasyonlar", "Çoklu yönetici & rol", "SLA & adanmış destek"],
};

const PLAN_TAGLINES: Record<string, string> = {
  Tekil:    "Villa, iş yeri, muayenehane",
  Mini:     "Küçük apartmanlar",
  Küçük:   "Orta büyüklükte apartmanlar",
  Orta:     "Siteler ve çok bloklu yapılar",
  Büyük:   "Büyük siteler",
  Kurumsal: "Çoklu site, otel ve işletmeler",
};

export default function SatinAl() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  // OTP / auth akisi
  const [authToken, setAuthToken] = useState<string>("");
  const [otpCode, setOtpCode] = useState<string>("");
  const [needName, setNeedName] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [payMode, setPayMode] = useState<"trial" | "paynow">("trial");
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [error, setError] = useState("");

  const [bldType, setBldType] = useState<string>("apartman");
  const [form, setForm] = useState({
    siteName: "",
    flatCount: "",
    fullName: "",
    phone: "",
    email: "",
    card: "",
    expiry: "",
    cvc: "",
    lat: "",
    lng: "",
    il: "",
    ilce: "",
  });

  useEffect(() => {
    fetch(`${API}/plans`)
      .then(r => r.json())
      .then(d => {
        const ps: Plan[] = d.plans || [];
        setPlans(ps);
        setPlansLoading(false);

        // URL'den plan seçimi
        const params = new URLSearchParams(window.location.search);
        const planParam = params.get("plan");
        const unitCount = parseInt(params.get("birim") || "0");
        // Taramadan gelen bilgileri forma aktar
        const adParam = params.get("ad") || "";
        const tipParam = params.get("tip") || "apartman";
        setBldType(tipParam);
        setForm((f) => ({
          ...f,
          siteName: adParam || f.siteName,
          flatCount: unitCount > 0 ? String(unitCount) : f.flatCount,
          lat: params.get("lat") || "",
          lng: params.get("lng") || "",
          il: params.get("il") || "",
          ilce: params.get("ilce") || "",
        }));

        if (planParam) {
          // ID ile eşleş
          const byId = ps.find(p => p.id === planParam);
          if (byId) { setSelectedPlanId(byId.id); return; }
          // İsim ile eşleş (kurumsal, profesyonel vs)
          const byName = ps.find(p => p.name.toLowerCase().includes(planParam.toLowerCase()));
          if (byName) { setSelectedPlanId(byName.id); return; }
        }

        // Daire sayısına göre otomatik seç
        if (unitCount > 0) {
          const auto = ps.find(p => p.minUnits <= unitCount && (p.maxUnits === null || p.maxUnits >= unitCount));
          if (auto) { setSelectedPlanId(auto.id); return; }
        }

        // Varsayılan: Orta plan
        const orta = ps.find(p => p.name === "Orta") || ps[2];
        if (orta) setSelectedPlanId(orta.id);
      })
      .catch(() => setPlansLoading(false));
  }, []);

  const plan = plans.find(p => p.id === selectedPlanId);
  const isEnterprise = plan?.monthlyPrice === 0;
  const yearly = billing === "yearly";
  const total = isEnterprise ? 0 : yearly ? (plan?.yearlyPrice || 0) : (plan?.monthlyPrice || 0);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validate(): string | null {
    if (!form.siteName.trim()) return "Bina / site adını girin.";
    if (!isEnterprise && !form.flatCount.trim()) return "Daire sayısını girin.";
    if (!form.fullName.trim()) return "Yetkili adını girin.";
    if (!/^0?5\d{9}$|^\+?\d{10,13}$/.test(form.phone.replace(/\s/g, ""))) return "Geçerli bir telefon numarası girin.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Geçerli bir e-posta girin.";
    return null;
  }

  async function submit(mode: "trial" | "paynow" = "trial") {
    setPayMode(mode);
    setError("");
    if (isEnterprise) {
      if (!form.siteName.trim() || !form.fullName.trim() || !form.email.trim()) {
        setError("Lütfen bina, yetkili ve e-posta alanlarını doldurun.");
        return;
      }
      setStep("success");
      return;
    }
    const v = validate();
    if (v) { setError(v); return; }
    // Telefon formatini normalize et (0 ile baslayan 11 hane)
    const normPhone = form.phone.replace(/\D/g, "").replace(/^90/, "0").replace(/^5/, "05");
    if (!/^0\d{10}$/.test(normPhone)) { setError("Telefon 05xx xxx xx xx formatinda olmali."); return; }
    setLoading(true);
    try {
      // 1) Once login dene (kayitli mi?)
      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normPhone }),
      });
      if (loginRes.ok) {
        // Kayitli -> SMS gitti
        setNeedName(false); setOtpSent(true); setStep("otp");
      } else {
        const ld = await loginRes.json();
        if ((ld.message || "").includes("kayıtlı değil") || loginRes.status === 404) {
          // Yeni kullanici -> register (isim formdan)
          const regRes = await fetch(`${API}/auth/register`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.fullName.trim(), phone: normPhone, email: form.email.trim() || undefined }),
          });
          const rd = await regRes.json();
          if (!regRes.ok) throw new Error(rd.message || "Kayit basarisiz");
          setNeedName(false); setOtpSent(true); setStep("otp");
        } else {
          throw new Error(ld.message || "Giris basarisiz");
        }
      }
    } catch (e: any) {
      setError(e.message || "Bir hata olustu");
    } finally {
      setLoading(false);
    }
  }

  // OTP dogrula -> token al -> bina olustur -> iyzico
  async function verifyAndPay() {
    setError("");
    const normPhone = form.phone.replace(/\D/g, "").replace(/^90/, "0").replace(/^5/, "05");
    if (otpCode.trim().length !== 6) { setError("6 haneli kodu girin."); return; }
    setLoading(true);
    try {
      const vRes = await fetch(`${API}/auth/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normPhone, code: otpCode.trim() }),
      });
      const vData = await vRes.json();
      if (!vRes.ok || !vData.token) throw new Error(vData.message || "Kod dogrulanamadi");
      const token = vData.token;
      setAuthToken(token);
      // Bina/isletme olustur
      const lat = parseFloat(form.lat) || 0;
      const lng = parseFloat(form.lng) || 0;
      if (!lat || !lng) throw new Error("Konum bilgisi eksik. Lutfen ana sayfadan tarayarak ekleyin.");
      let createRes;
      if (bldType === "isletme") {
        createRes = await fetch(`${API}/buildings/create-business`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            businessName: form.siteName.trim(),
            latitude: lat,
            longitude: lng,
            unitCount: Number(form.flatCount) || 1,
          }),
        });
      } else {
        const flatCount = Number(form.flatCount) || 1;
        createRes = await fetch(`${API}/buildings/create-structure`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            siteName: form.siteName.trim(),
            latitude: lat,
            longitude: lng,
            blocks: [{ flatCount }],
          }),
        });
      }
      const createData = await createRes.json();
      if (!createRes.ok || createData.success === false) {
        throw new Error(createData.message || "Bina olusturulamadi");
      }
      // Hemen satin al -> iyzico odeme formu
      if (payMode === "paynow") {
        // Kullanicinin aboneligini bul (bina olunca olusur)
        const subRes = await fetch(`${API}/subscription/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const subData = await subRes.json();
        const subs = subData.subscriptions || subData || [];
        const sub = Array.isArray(subs) ? subs[0] : null;
        if (!sub || !sub.id) throw new Error("Abonelik bulunamadi");
        const initRes = await fetch(`${API}/payment/initialize`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ subscriptionId: sub.id, period: billing === "yearly" ? "yearly" : "monthly" }),
        });
        const initData = await initRes.json();
        if (!initRes.ok || !initData.success) throw new Error(initData.message || "Odeme baslatilamadi");
        // iyzico checkout formuna yonlendir
        if (initData.paymentPageUrl) {
          window.location.href = initData.paymentPageUrl;
          return;
        }
        if (initData.checkoutFormContent) {
          // Form HTML donduyse yeni sekmede ac
          const w = window.open("", "_self");
          w?.document.write(initData.checkoutFormContent);
          return;
        }
        throw new Error("Odeme formu alinamadi");
      }
      // Deneme modu -> basari
      setStep("success");
    } catch (e: any) {
      setError(e.message || "Bir hata olustu");
    } finally {
      setLoading(false);
    }
  }

  const planFeatures = plan ? (PLAN_FEATURES[plan.name] || []) : [];
  const planTagline = plan ? (PLAN_TAGLINES[plan.name] || "") : "";

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
      ) : step === "otp" ? (
        <section className="ck-wrap ck-otp">
          <h1>Telefonunuzu doğrulayın</h1>
          <p className="ck-sub">{form.phone} numarasına gönderdiğimiz 6 haneli kodu girin.</p>
          {error && <div className="ck-error">{error}</div>}
          <div className="ck-otp-box">
            <input
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="______"
              inputMode="numeric"
              maxLength={6}
              className="ck-otp-input"
              autoFocus
            />
            <button className="ck-btn primary full" disabled={loading || otpCode.length !== 6} onClick={verifyAndPay}>
              {loading ? "Doğrulanıyor..." : "Doğrula ve Devam Et"}
            </button>
            <button className="ck-otp-back" onClick={() => { setStep("form"); setOtpCode(""); setError(""); }}>‹ Geri dön</button>
          </div>
        </section>
      ) : (
        <section className="ck-wrap ck-grid">
          {/* SOL: FORM */}
          <div className="ck-main">
            <h1>Aboneliğinizi başlatın</h1>
            <p className="ck-sub">İlk 14 gün ücretsiz. Deneme bitmeden iptal ederseniz ücret alınmaz.</p>

            {/* Plan Seçimi */}
            <div className="ck-block">
              <div className="ck-block-title">Plan Seçin</div>
              {plansLoading ? (
                <div className="ck-loading">Planlar yükleniyor...</div>
              ) : (
                <div className="ck-plan-row">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      className={`ck-plan ${selectedPlanId === p.id ? "active" : ""}`}
                      onClick={() => setSelectedPlanId(p.id)}
                    >
                      <div className="ck-plan-name">{p.name}</div>
                      <div className="ck-plan-flats">
                        {p.minUnits === p.maxUnits
                          ? `${p.minUnits} birim`
                          : p.maxUnits
                          ? `${p.minUnits}–${p.maxUnits} daire`
                          : `${p.minUnits}+ daire`}
                      </div>
                      <div className="ck-plan-price">
                        {p.monthlyPrice === 0 ? "Teklif" : `${fmt(p.monthlyPrice)}/ay`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fatura Dönemi */}
            {!isEnterprise && plan && (
              <div className="ck-block">
                <div className="ck-block-title">Fatura Dönemi</div>
                <div className="ck-billing">
                  <button className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>
                    Aylık
                  </button>
                  <button className={billing === "yearly" ? "active" : ""} onClick={() => setBilling("yearly")}>
                    Yıllık <span className="ck-save">2 ay bedava</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bina Bilgileri */}
            <div className="ck-block">
              <div className="ck-block-title">{bldType === "isletme" ? "İşletme Bilgileri" : bldType === "villa" ? "Villa Bilgileri" : "Bina Bilgileri"}</div>
              <div className="ck-fields">
                <label className="ck-field full">
                  <span>{bldType === "isletme" ? "İşletme Adı" : bldType === "villa" ? "Villa Adı" : "Bina / Site Adı"}</span>
                  <input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder={bldType === "isletme" ? "örn. Fera Life Market" : bldType === "villa" ? "örn. Yılmaz Villası" : "örn. Yıldız Apartmanı"} />
                </label>
                {!isEnterprise && (
                  <label className="ck-field full">
                    <span>{bldType === "isletme" ? "Birim Sayısı" : bldType === "villa" ? "Birim Sayısı" : "Daire / Birim Sayısı"}</span>
                    <input value={form.flatCount} onChange={(e) => set("flatCount", e.target.value)} inputMode="numeric" placeholder="örn. 24" />
                  </label>
                )}
              </div>
            </div>

            {/* Yetkili Bilgileri */}
            <div className="ck-block">
              <div className="ck-block-title">Yetkili Bilgileri</div>
              <div className="ck-fields">
                <label className="ck-field full">
                  <span>Ad Soyad</span>
                  <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Yetkili kişinin adı" autoComplete="name" />
                </label>
                <label className="ck-field">
                  <span>Telefon</span>
                  <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="05xx xxx xx xx" inputMode="tel" autoComplete="tel" />
                </label>
                <label className="ck-field">
                  <span>E-posta</span>
                  <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="ornek@mail.com" type="email" autoComplete="email" />
                </label>
              </div>
            </div>


            {error && <div className="ck-error">{error}</div>}
          </div>

          {/* SAĞ: ÖZET */}
          <aside className="ck-summary">
            <div className="ck-summary-card">
              {plan ? (
                <>
                  <div className="ck-summary-plan">
                    <span>{plan.name} Planı</span>
                    <small>{planTagline}</small>
                  </div>
                  <ul className="ck-summary-feats">
                    {planFeatures.map((f) => (
                      <li key={f}>
                        <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="M5 10.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {!isEnterprise ? (
                    <>
                      <div className="ck-summary-line">
                        <span>{yearly ? "Yıllık tutar" : "Aylık tutar"}</span>
                        <span>{fmt(total)}</span>
                      </div>
                      {yearly && (
                        <div className="ck-summary-line">
                          <span>Tasarruf</span>
                          <span style={{color: "#2bb673", fontWeight: 700}}>{fmt(plan.monthlyPrice * 2)}</span>
                        </div>
                      )}
                      <div className="ck-summary-line trial">
                        <span>İlk 14 gün</span>
                        <span>Ücretsiz</span>
                      </div>
                      <div className="ck-summary-total">
                        <span>Bugün ödenecek</span>
                        <strong>₺0</strong>
                      </div>
                      <div className="ck-summary-after">Deneme sonrası {fmt(total)}{yearly ? "/yıl" : "/ay"}</div>
                    </>
                  ) : (
                    <div className="ck-summary-enterprise">Fiyatlandırma ihtiyacınıza göre belirlenir. Talebiniz sonrası size özel teklif sunulur.</div>
                  )}
                </>
              ) : (
                <div className="ck-loading">Plan seçin...</div>
              )}

              {isEnterprise ? (
                <button className="ck-btn primary full" onClick={() => submit("trial")} disabled={loading || !plan}>
                  {loading ? "İşleniyor..." : "Teklif Al"}
                </button>
              ) : (
                <div className="ck-cta-group">
                  <button className="ck-btn primary full" onClick={() => submit("trial")} disabled={loading || !plan}>
                    {loading ? "İşleniyor..." : "14 Gün Ücretsiz Dene"}
                  </button>
                  <button className="ck-btn ghost full" onClick={() => submit("paynow")} disabled={loading || !plan}>
                    Hemen Satın Al
                  </button>
                </div>
              )}
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
        .ck-loading { color: var(--gray); font-size: 14px; padding: 12px 0; }

        .ck-plan-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .ck-plan { text-align: left; background: var(--soft); border: 2px solid var(--line); border-radius: 13px; padding: 14px; cursor: pointer; transition: all .15s; font-family: inherit; }
        .ck-plan:hover { border-color: #c3ccdd; }
        .ck-plan.active { border-color: var(--red); background: var(--red-soft); }
        .ck-plan-name { font-weight: 700; color: var(--navy-deep); font-size: 15px; }
        .ck-plan-flats { color: var(--gray); font-size: 11.5px; margin: 3px 0 8px; }
        .ck-plan-price { font-weight: 700; color: var(--navy); font-size: 13px; }

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
          .ck-plan-row { grid-template-columns: repeat(2, 1fr); }
          .ck-fields { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .ck-plan-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}