"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://mobildiafon.com/api";

function birimFiyat(adet: number) {
  if (adet >= 10) return 590;
  if (adet >= 3) return 650;
  if (adet >= 2) return 700;
  return 790;
}
function kargoUcreti(adet: number) {
  return adet >= 2 ? 0 : 120;
}
const tl = (n: number) => n.toLocaleString("tr-TR") + " ₺";

function SiparisInner() {
  const params = useSearchParams();
  const durum = params.get("durum");

  const [adet, setAdet] = useState(1);
  const [form, setForm] = useState({
    buyerName: "", buyerPhone: "", buyerEmail: "",
    shipCity: "", shipDistrict: "", shipAddress: "",
  });
  const [onay, setOnay] = useState({ kvkk: false, mesafeli: false });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const birim = birimFiyat(adet);
  const araToplam = birim * adet;
  const kargo = kargoUcreti(adet);
  const toplam = araToplam + kargo;

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    setErr("");
    if (!form.buyerName.trim() || !form.buyerPhone.trim() || !form.shipCity.trim() || !form.shipAddress.trim()) {
      setErr("Lütfen ad, telefon, il ve açık adres alanlarını doldurun.");
      return;
    }
    if (!/^0?5\d{9}$/.test(form.buyerPhone.replace(/\s/g, ""))) {
      setErr("Geçerli bir cep telefonu numarası girin.");
      return;
    }
    if (!onay.kvkk || !onay.mesafeli) {
      setErr("Devam etmek için sözleşmeleri onaylamanız gerekir.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/vehicle-orders/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity: adet }),
      });
      const data = await res.json();
      if (data.success && data.paymentPageUrl) {
        window.location.href = data.paymentPageUrl;
      } else {
        setErr(data.message || "Ödeme başlatılamadı, lütfen tekrar deneyin.");
        setLoading(false);
      }
    } catch {
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
          <p>Ödemeniz başarıyla tamamlandı. MobilDiafon Auto QR etiketiniz 2 iş günü içinde kargoya verilecek. Kartınız elinize ulaştığında üzerindeki gizli kod ile aracınızı aktive edip hemen kullanmaya başlayabilirsiniz.</p>
          <Link href="/" className="btn btn-primary">Ana Sayfaya Dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={S.wrap}>
      <div style={S.grid}>
        {/* SOL: FORM */}
        <form onSubmit={submit} style={S.col}>
          <Link href="/auto" style={S.geri}>← Ürün sayfası</Link>
          <h1 style={S.h1}>Siparişi tamamla</h1>

          {/* ADET */}
          <div style={S.blok}>
            <div style={S.blokBaslik}>Kaç araç için?</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button type="button" onClick={() => setAdet((a) => Math.max(1, a - 1))} style={S.adetBtn} aria-label="Azalt">−</button>
              <span style={{ fontSize: 26, fontWeight: 800, minWidth: 44, textAlign: "center" }}>{adet}</span>
              <button type="button" onClick={() => setAdet((a) => Math.min(24, a + 1))} style={S.adetBtn} aria-label="Artır">+</button>
              <span style={{ fontSize: 13.5, color: "#64748b", marginLeft: 6 }}>
                araç başına {tl(birim)}
              </span>
            </div>
            {adet === 1 && (
              <div style={S.ipucu}>2 araç alırsanız araç başına 700 ₺ ve kargo ücretsiz.</div>
            )}
            {adet >= 24 && (
              <div style={S.ipucu}>25 ve üzeri için <Link href="/iletisim" style={{ color: "#E63946" }}>teklif alın</Link>.</div>
            )}
          </div>

          {/* ILETISIM */}
          <div style={S.blok}>
            <div style={S.blokBaslik}>İletişim bilgileri</div>
            <label style={S.lbl} htmlFor="ad">Ad Soyad *</label>
            <input id="ad" name="name" autoComplete="name" required value={form.buyerName}
              onChange={(e) => set("buyerName", e.target.value)} placeholder="Adınız ve soyadınız" style={S.input} />

            <label style={S.lbl} htmlFor="tel">Cep Telefonu *</label>
            <input id="tel" name="tel" type="tel" inputMode="numeric" autoComplete="tel" required
              value={form.buyerPhone} onChange={(e) => set("buyerPhone", e.target.value)}
              placeholder="05xx xxx xx xx" style={S.input} />

            <label style={S.lbl} htmlFor="mail">E-posta</label>
            <input id="mail" name="email" type="email" autoComplete="email"
              value={form.buyerEmail} onChange={(e) => set("buyerEmail", e.target.value)}
              placeholder="ornek@mail.com" style={S.input} />
            <div style={S.notKucuk}>Sipariş ve kargo bilgilendirmesi için kullanılır.</div>
          </div>

          {/* ADRES */}
          <div style={S.blok}>
            <div style={S.blokBaslik}>Teslimat adresi</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={S.lbl} htmlFor="il">İl *</label>
                <input id="il" name="address-level1" autoComplete="address-level1" required
                  value={form.shipCity} onChange={(e) => set("shipCity", e.target.value)}
                  placeholder="İstanbul" style={S.input} />
              </div>
              <div>
                <label style={S.lbl} htmlFor="ilce">İlçe</label>
                <input id="ilce" name="address-level2" autoComplete="address-level2"
                  value={form.shipDistrict} onChange={(e) => set("shipDistrict", e.target.value)}
                  placeholder="Kadıköy" style={S.input} />
              </div>
            </div>
            <label style={S.lbl} htmlFor="adres">Açık Adres *</label>
            <textarea id="adres" name="street-address" autoComplete="street-address" required rows={3}
              value={form.shipAddress} onChange={(e) => set("shipAddress", e.target.value)}
              placeholder="Mahalle, cadde, sokak, bina ve daire no" style={{ ...S.input, resize: "vertical" }} />
          </div>

          {/* ONAYLAR */}
          <div style={S.blok}>
            <label style={S.onayRow}>
              <input type="checkbox" checked={onay.mesafeli} onChange={(e) => setOnay((o) => ({ ...o, mesafeli: e.target.checked }))} style={S.cb} />
              <span><Link href="/mesafeli-satis" target="_blank" style={S.link}>Mesafeli Satış Sözleşmesi</Link>&apos;ni okudum, onaylıyorum.</span>
            </label>
            <label style={S.onayRow}>
              <input type="checkbox" checked={onay.kvkk} onChange={(e) => setOnay((o) => ({ ...o, kvkk: e.target.checked }))} style={S.cb} />
              <span><Link href="/kvkk" target="_blank" style={S.link}>KVKK Aydınlatma Metni</Link> ve <Link href="/gizlilik" target="_blank" style={S.link}>Gizlilik Politikası</Link>&apos;nı okudum.</span>
            </label>
          </div>

          {err && <div style={S.hata}>{err}</div>}

          <button type="submit" disabled={loading} style={{ ...S.odemeBtn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Yönlendiriliyor..." : `${tl(toplam)} — Ödemeye Geç`}
          </button>
          <div style={S.guvenNot}>256-bit SSL · iyzico güvenli ödeme altyapısı</div>
        </form>

        {/* SAG: OZET */}
        <aside style={S.col}>
          <div style={{ ...S.blok, position: "sticky", top: 20 }}>
            <div style={S.blokBaslik}>Sipariş özeti</div>

            <div style={S.ozetRow}>
              <span>MobilDiafon Auto × {adet}</span>
              <b>{tl(araToplam)}</b>
            </div>
            <div style={S.ozetRow}>
              <span>Kargo</span>
              <b style={{ color: kargo === 0 ? "#15803d" : undefined }}>{kargo === 0 ? "Ücretsiz" : tl(kargo)}</b>
            </div>
            <div style={{ ...S.ozetRow, borderTop: "1px solid #e2e8f0", paddingTop: 12, marginTop: 6, fontSize: 18 }}>
              <span style={{ fontWeight: 700 }}>Toplam</span>
              <b style={{ fontSize: 22 }}>{tl(toplam)}</b>
            </div>
            <div style={S.notKucuk}>KDV dahildir.</div>

            <div style={S.ayrac} />
            <div style={S.altBaslik}>Kutuda ne var?</div>
            <ul style={S.liste}>
              <li>{adet * 2} adet QR sticker</li>
              <li>{adet} adet aktivasyon kartı</li>
              <li>Kurulum kılavuzu</li>
            </ul>

            <div style={S.ayrac} />
            <div style={S.altBaslik}>Teslimat</div>
            <p style={S.altMetin}>Siparişiniz 2 iş günü içinde kargoya verilir. Teslimat süresi bulunduğunuz ile göre değişir.</p>

            <div style={S.ayrac} />
            <div style={S.altBaslik}>Abonelik</div>
            <p style={S.altMetin}>
              Fiyata 1 yıl kullanım dahildir. Abonelik otomatik yenilenmez; süre dolmadan önce bilgilendirilirsiniz ve dilerseniz güncel ücretle uzatabilirsiniz. Yenilemezseniz QR kodunuz pasif olur, istediğiniz zaman tekrar aktive edebilirsiniz.
            </p>

            <div style={S.ayrac} />
            <div style={S.altBaslik}>İade</div>
            <p style={S.altMetin}>
              Teslimattan itibaren 14 gün içinde iade edebilirsiniz. Etiket size ulaştıysa adet başına 190 ₺ etiket bedeli düşülür.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

const S: Record<string, any> = {
  wrap: { maxWidth: 1000, margin: "0 auto", padding: "26px 18px 60px", fontFamily: "system-ui, -apple-system, sans-serif", color: "#14213D" },
  grid: { display: "grid", gridTemplateColumns: "minmax(0,1.35fr) minmax(0,1fr)", gap: 22, alignItems: "start" },
  col: { minWidth: 0 },
  geri: { fontSize: 13.5, color: "#64748b", textDecoration: "none" },
  h1: { fontSize: 26, margin: "10px 0 18px", fontWeight: 800 },
  blok: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 18, marginBottom: 14 },
  blokBaslik: { fontSize: 15.5, fontWeight: 700, marginBottom: 14 },
  lbl: { display: "block", fontSize: 13, color: "#64748b", margin: "12px 0 5px" },
  input: { width: "100%", padding: "11px 12px", border: "1px solid #cbd5e1", borderRadius: 9, fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  adetBtn: { width: 40, height: 40, borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", fontSize: 20, cursor: "pointer", lineHeight: 1 },
  ipucu: { fontSize: 13, color: "#64748b", marginTop: 12, background: "#f8fafc", padding: "9px 12px", borderRadius: 8 },
  onayRow: { display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13.5, lineHeight: 1.5, marginBottom: 11, cursor: "pointer" },
  cb: { marginTop: 2, width: 17, height: 17, flexShrink: 0, cursor: "pointer" },
  link: { color: "#E63946" },
  hata: { background: "#fee2e2", color: "#b91c1c", padding: "11px 14px", borderRadius: 9, fontSize: 14, marginBottom: 12 },
  odemeBtn: { width: "100%", padding: "15px", background: "#E63946", color: "#fff", border: "none", borderRadius: 11, fontSize: 16.5, fontWeight: 700, cursor: "pointer" },
  guvenNot: { textAlign: "center", fontSize: 12.5, color: "#94a3b8", marginTop: 10 },
  ozetRow: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14.5, padding: "6px 0" },
  ayrac: { height: 1, background: "#e2e8f0", margin: "16px 0" },
  altBaslik: { fontSize: 13.5, fontWeight: 700, marginBottom: 6 },
  altMetin: { fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: 0 },
  liste: { fontSize: 13, color: "#64748b", lineHeight: 1.8, margin: 0, paddingLeft: 18 },
  notKucuk: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Yükleniyor…</div>}>
      <SiparisInner />
    </Suspense>
  );
}
