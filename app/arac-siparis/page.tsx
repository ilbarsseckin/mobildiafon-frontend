"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://mobildiafon.com/api";
const PRICE = 790;

function SiparisInner() {
  const params = useSearchParams();
  const durum = params.get("durum");

  const [form, setForm] = useState({
    buyerName: "", buyerPhone: "", buyerEmail: "",
    shipCity: "", shipDistrict: "", shipAddress: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setErr("");
    if (!form.buyerName.trim() || !form.buyerPhone.trim() || !form.shipCity.trim() || !form.shipAddress.trim()) {
      setErr("Lütfen ad, telefon, il ve açık adres alanlarını doldurun.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/vehicle-orders/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success && data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
      } else {
        setErr(data.message || "Ödeme başlatılamadı, lütfen tekrar deneyin.");
        setLoading(false);
      }
    } catch (e) {
      setErr("Bağlantı hatası. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  }

  if (durum === "basarili") {
    return (
      <div className="as-wrap">
        <div className="as-card as-center">
          <div className="as-ok">✓</div>
          <h1>Siparişiniz alındı!</h1>
          <p>Ödemeniz başarıyla tamamlandı. MobilDiafon Auto QR etiketiniz en kısa sürede adresinize kargolanacak. Kartınız elinize ulaştığında, üzerindeki gizli kod ile aracınızı aktive edip hemen kullanmaya başlayabilirsiniz.</p>
          <Link href="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  if (durum === "hata") {
    return (
      <div className="as-wrap">
        <div className="as-card as-center">
          <div className="as-err">!</div>
          <h1>Ödeme tamamlanamadı</h1>
          <p>Ödeme sırasında bir sorun oluştu ya da işlem iptal edildi. Dilerseniz tekrar deneyebilirsiniz.</p>
          <Link href="/arac-siparis" className="btn btn-primary">Tekrar Dene</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="as-wrap">
      <div className="as-card">
        <span className="md-eyebrow">MobilDiafon Auto</span>
        <h1>Araç QR Etiketi — Satın Al</h1>
        <p className="as-lead">Ön cama yapıştırılan QR ile numaranız gizli kalarak size ulaşılır. 1 yıllık abonelik dahildir. Kartınız adresinize kargolanır; gizli kodla aktive edip hemen kullanmaya başlarsınız.</p>

        <div className="as-price">
          <span>MobilDiafon Auto QR (1 Yıllık Abonelik Dahil)</span>
          <b>₺{PRICE.toLocaleString("tr-TR")}</b>
        </div>

        <div className="as-form">
          <label>Ad Soyad
            <input value={form.buyerName} onChange={(e) => set("buyerName", e.target.value)} placeholder="Adınız Soyadınız" autoComplete="name" />
          </label>
          <label>Telefon
            <input value={form.buyerPhone} onChange={(e) => set("buyerPhone", e.target.value)} placeholder="05xx xxx xx xx" inputMode="tel" autoComplete="tel" />
          </label>
          <label>E-posta (opsiyonel)
            <input value={form.buyerEmail} onChange={(e) => set("buyerEmail", e.target.value)} placeholder="ornek@mail.com" type="email" autoComplete="email" />
          </label>
          <div className="as-row">
            <label>İl
              <input value={form.shipCity} onChange={(e) => set("shipCity", e.target.value)} placeholder="İstanbul" />
            </label>
            <label>İlçe
              <input value={form.shipDistrict} onChange={(e) => set("shipDistrict", e.target.value)} placeholder="Kadıköy" />
            </label>
          </div>
          <label>Açık Adres
            <textarea value={form.shipAddress} onChange={(e) => set("shipAddress", e.target.value)} placeholder="Mahalle, sokak, no, daire..." rows={3} />
          </label>
        </div>

        {err && <div className="as-error">{err}</div>}

        <button className="btn btn-primary as-submit" onClick={submit} disabled={loading}>
          {loading ? "Yönlendiriliyor..." : `Ödemeye Geç — ₺${PRICE.toLocaleString("tr-TR")}`}
        </button>
        <p className="as-secure">🔒 Ödeme iyzico güvencesiyle alınır. Kart bilgileriniz bizde saklanmaz.</p>
      </div>
    </div>
  );
}

export default function AracSiparisPage() {
  return (
    <Suspense fallback={<div className="as-wrap"><div className="as-card">Yükleniyor...</div></div>}>
      <SiparisInner />
    </Suspense>
  );
}
