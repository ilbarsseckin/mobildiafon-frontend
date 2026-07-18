"use client";
import { useState, useEffect } from "react";

const API = "https://mobildiafon.com/api";

type Loc = {
  id: string; name: string; type: string; address: string | null;
  ownerName: string | null; ownerPhone: string | null;
  blockCount: number; unitCount: number;
  blocks: { id: string; name: string }[];
  subscription: { status: string; daysLeft: number; monthlyPrice: number } | null;
  unpaidInvoices: number;
  createdAt: string;
};

type Order = {
  id: string; buyerName: string; buyerPhone: string; amount: number;
  status: string; shipStatus: string; trackingNo: string | null;
  shipCity: string; shipDistrict: string | null;
  refund?: { canCancel: boolean; canRefund: boolean; amount: number; reason: string };
};

export default function SuperAdmin2() {
  const [token, setToken] = useState("");
  const [pass, setPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState("bugun");
  const [locs, setLocs] = useState<Loc[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invForm, setInvForm] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vSummary, setVSummary] = useState<any>({});
  const [genForm, setGenForm] = useState<any>(null);
  const [genResult, setGenResult] = useState<any[] | null>(null);
  const [vFilter, setVFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [trackInputs, setTrackInputs] = useState<Record<string, string>>({});
  const [locFilter, setLocFilter] = useState("all");
  const [detail, setDetail] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("sa2_token");
    if (t) { setToken(t); }
  }, []);

  useEffect(() => { if (token) loadAll(); }, [token]);

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  async function login() {
    setLoginErr("");
    try {
      const res = await fetch(`${API}/superadmin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      const d = await res.json();
      if (d.token) {
        sessionStorage.setItem("sa2_token", d.token);
        setToken(d.token);
      } else setLoginErr(d.message || "Giris basarisiz");
    } catch { setLoginErr("Baglanti hatasi"); }
  }

  function logout() { sessionStorage.removeItem("sa2_token"); setToken(""); }

  async function loadAll() {
    setLoading(true);
    try {
      const [lr, or_, ow, iv, vh] = await Promise.all([
        fetch(`${API}/superadmin/locations`, { headers: authHeader() }),
        fetch(`${API}/superadmin/vehicle-orders`, { headers: authHeader() }),
        fetch(`${API}/superadmin/owners`, { headers: authHeader() }),
        fetch(`${API}/superadmin/invoices`, { headers: authHeader() }),
        fetch(`${API}/superadmin/vehicles`, { headers: authHeader() }),
      ]);
      if (lr.status === 401 || or_.status === 401) { logout(); return; }
      const ld = await lr.json();
      const od = await or_.json();
      const wd = await ow.json();
      setLocs(Array.isArray(ld) ? ld : []);
      setOrders(Array.isArray(od) ? od : []);
      setOwners(Array.isArray(wd) ? wd : []);
      const id_ = await iv.json();
      setInvoices(id_?.invoices || []);
      const vd = await vh.json();
      setVehicles(vd?.vehicles || []);
      setVSummary(vd?.summary || {});
    } catch {}
    finally { setLoading(false); }
  }

  async function markShipped(id: string) {
    await fetch(`${API}/superadmin/vehicle-orders/ship`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ id, trackingNo: trackInputs[id] || "" }),
    });
    await loadAll();
  }

  async function openDetail(id: string) {
    setDetailLoading(true);
    setDetail({ id });
    try {
      const res = await fetch(`${API}/superadmin/locations/${id}`, { headers: authHeader() });
      if (res.status === 401) { logout(); return; }
      const d = await res.json();
      setDetail(d.success ? d : null);
    } catch { setDetail(null); }
    finally { setDetailLoading(false); }
  }

  async function createInvoice() {
    if (!invForm?.ownerUserId) { alert("Musteri secin"); return; }
    const res = await fetch(`${API}/superadmin/invoices/create`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerUserId: invForm.ownerUserId,
        title: invForm.title || "",
        amount: Number(invForm.amount) || 0,
      }),
    });
    const d = await res.json();
    if (d.success) { setInvForm(null); await loadAll(); }
    else alert(d.message || "Fatura olusturulamadi");
  }

  async function toggleInvoicePaid(id: string, paid: boolean) {
    await fetch(`${API}/superadmin/invoices/mark-paid`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ id, paid }),
    });
    await loadAll();
  }

  async function sendInvoice(id: string) {
    if (!confirm("Fatura maili gonderilsin mi?")) return;
    const res = await fetch(`${API}/superadmin/invoices/send`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const d = await res.json();
    alert(d.success ? "Mail gonderildi" : (d.message || "Gonderilemedi"));
    await loadAll();
  }

  async function generateCards() {
    const n = Number(genForm?.count) || 0;
    if (n < 1 || n > 500) { alert("1-500 arasi bir sayi girin"); return; }
    const res = await fetch(`${API}/superadmin/vehicles/generate`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ count: n }),
    });
    const d = await res.json();
    const cards = d.cards || d.vehicles || [];
    if (cards.length) { setGenResult(cards); setGenForm(null); await loadAll(); }
    else alert(d.message || "Kart uretilemedi");
  }

  async function downloadLabels(cards: any[], format: string) {
    const res = await fetch(`${API}/superadmin/vehicles/labels`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ cards, format }),
    });
    if (!res.ok) { alert("PDF olusturulamadi"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `etiketler-${Date.now()}.pdf`; a.click();
    URL.revokeObjectURL(url);
  }

  async function setCardStatus(code: string, status: string) {
    const msg = status === "burned"
      ? `${code} yakilacak. Bu kart bir daha aktive edilemez. Emin misiniz?`
      : `${code} stoga geri alinacak. Devam?`;
    if (!confirm(msg)) return;
    const res = await fetch(`${API}/superadmin/vehicles/set-status`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ code, status }),
    });
    const d = await res.json();
    if (!d.success) alert(d.message || "Islem basarisiz");
    await loadAll();
  }

  async function setCardStatus(code: string, status: string) {
    const msg = status === "burned"
      ? `${code} yakilacak. Bu kart bir daha aktive edilemez. Emin misiniz?`
      : `${code} stoga geri alinacak. Devam?`;
    if (!confirm(msg)) return;
    const res = await fetch(`${API}/superadmin/vehicles/set-status`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ code, status }),
    });
    const d = await res.json();
    if (!d.success) alert(d.message || "Islem basarisiz");
    await loadAll();
  }

  async function downloadQr(code: string) {
    const res = await fetch(`${API}/superadmin/vehicles/${code}/qr`, { headers: authHeader() });
    if (!res.ok) { alert("QR olusturulamadi"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${code}.png`; a.click();
    URL.revokeObjectURL(url);
  }

  // --- Turetilmis veriler ---
  const kargoBekleyen = orders.filter((o) => o.status === "paid" && o.shipStatus !== "shipped");
  const iadePenceresi = orders.filter((o) => o.refund?.canRefund);
  const bitenAbonelik = locs.filter((l) => l.subscription && l.subscription.daysLeft <= 7 && l.subscription.daysLeft > 0);
  const odenmemis = locs.filter((l) => l.unpaidInvoices > 0);
  const toplamIs = kargoBekleyen.length + bitenAbonelik.length + odenmemis.length;

  const filtered = locs.filter((l) =>
    locFilter === "all" ? true :
    locFilter === "business" ? l.type === "business" : l.type !== "business"
  );

  if (!token) {
    return (
      <div style={S.loginWrap}>
        <div style={S.loginBox}>
          <h1 style={{ fontSize: 20, marginBottom: 4 }}>MobilDiafon</h1>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>Yonetim Paneli</p>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Sifre" style={S.input} />
          {loginErr && <div style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{loginErr}</div>}
          <button onClick={login} style={{ ...S.btnPrimary, width: "100%", marginTop: 12 }}>Giris</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.shell}>
      {/* SOL MENU */}
      <aside style={S.side}>
        <div style={S.brand}>MobilDiafon</div>
        <MenuItem active={tab === "bugun"} onClick={() => setTab("bugun")} label="Bugun" badge={toplamIs || undefined} accent />
        <div style={S.group}>ARAC</div>
        <MenuItem active={tab === "siparis"} onClick={() => setTab("siparis")} label="Siparisler" badge={kargoBekleyen.length || undefined} />
        <MenuItem active={tab === "kartlar"} onClick={() => setTab("kartlar")} label="Kartlar" count={vehicles.length} />
        <div style={S.group}>MUSTERI</div>
        <MenuItem active={tab === "kisiler"} onClick={() => setTab("kisiler")} label="Kisiler" count={owners.length} />
        <div style={S.group}>PARA</div>
        <MenuItem active={tab === "fatura"} onClick={() => setTab("fatura")} label="Faturalar" badge={invoices.filter((i: any) => i.paymentStatus !== "paid").length || undefined} />
        <div style={S.group}>YAPI</div>
        <MenuItem active={tab === "lokasyon"} onClick={() => setTab("lokasyon")} label="Lokasyonlar" count={locs.length} />
        <div style={{ flex: 1 }} />
        <button onClick={logout} style={S.logout}>Cikis</button>
      </aside>

      {/* ICERIK */}
      <main style={S.main}>
        {loading && <div style={S.muted}>Yukleniyor...</div>}

        {tab === "bugun" && (
          <>
            <div style={S.head}>
              <h2 style={S.h2}>Bugun</h2>
              <span style={S.muted}>{new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })}</span>
            </div>

            {toplamIs === 0 && !loading && (
              <div style={S.card}><div style={{ color: "#64748b" }}>Bekleyen is yok.</div></div>
            )}

            {kargoBekleyen.length > 0 && (
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={{ fontWeight: 600 }}>Kargo bekleyen</span>
                  <span style={S.badgeRed}>{kargoBekleyen.length}</span>
                </div>
                {kargoBekleyen.map((o) => (
                  <div key={o.id} style={S.row}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div>{o.buyerName}</div>
                      <div style={S.sub}>{o.shipCity}{o.shipDistrict ? " / " + o.shipDistrict : ""} · {o.amount} TL</div>
                    </div>
                    <input placeholder="Takip no" value={trackInputs[o.id] || ""}
                      onChange={(e) => setTrackInputs((t) => ({ ...t, [o.id]: e.target.value }))}
                      style={{ ...S.input, width: 110, fontSize: 13, padding: "6px 8px" }} />
                    <button onClick={() => markShipped(o.id)} style={S.btnPrimary}>Kargola</button>
                  </div>
                ))}
              </div>
            )}

            {bitenAbonelik.length > 0 && (
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={{ fontWeight: 600 }}>Aboneligi bitmek uzere</span>
                  <span style={S.badgeAmber}>{bitenAbonelik.length}</span>
                </div>
                {bitenAbonelik.map((l) => (
                  <div key={l.id} style={S.row}>
                    <div style={{ flex: 1 }}>
                      <div>{l.name}</div>
                      <div style={S.sub}>{l.ownerName} · {l.subscription!.monthlyPrice} TL/ay</div>
                    </div>
                    <span style={S.badgeAmber}>{l.subscription!.daysLeft} gun</span>
                  </div>
                ))}
              </div>
            )}

            {odenmemis.length > 0 && (
              <div style={S.card}>
                <div style={S.cardHead}>
                  <span style={{ fontWeight: 600 }}>Odenmemis fatura</span>
                  <span style={S.badgeRed}>{odenmemis.length}</span>
                </div>
                {odenmemis.map((l) => (
                  <div key={l.id} style={S.row}>
                    <div style={{ flex: 1 }}>{l.name}</div>
                    <span style={S.sub}>{l.unpaidInvoices} fatura</span>
                  </div>
                ))}
              </div>
            )}

            <div style={S.metrics}>
              <Metric label="Lokasyon" value={locs.length} />
              <Metric label="Toplam birim" value={locs.reduce((a, l) => a + l.unitCount, 0)} />
              <Metric label="Aktif abonelik" value={locs.filter((l) => l.subscription?.status === "active").length} />
              <Metric label="Denemede" value={locs.filter((l) => l.subscription?.status === "trial").length} />
            </div>
          </>
        )}

        {tab === "lokasyon" && (
          <>
            <div style={S.head}><h2 style={S.h2}>Lokasyonlar</h2></div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["all", "Hepsi"], ["residential", "Apartman"], ["business", "Isletme"]].map(([k, lbl]) => (
                <button key={k} onClick={() => setLocFilter(k)}
                  style={locFilter === k ? S.chipOn : S.chip}>{lbl}</button>
              ))}
            </div>
            {filtered.length === 0 && <div style={S.card}><span style={S.muted}>Kayit yok.</span></div>}
            {filtered.map((l) => (
              <div key={l.id} style={{ ...S.card, cursor: "pointer" }} onClick={() => openDetail(l.id)}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{l.name}</span>
                  <span style={S.tag}>{l.type === "business" ? "Isletme" : "Apartman"}</span>
                  {l.subscription && <SubBadge s={l.subscription} />}
                </div>
                <div style={S.sub}>
                  {l.ownerName || "Sahipsiz"}{l.ownerPhone ? " · " + l.ownerPhone : ""}
                </div>
                <div style={S.sub}>
                  {l.blockCount > 1 ? `${l.blockCount} blok · ` : ""}{l.unitCount} birim
                  {l.subscription ? ` · ${l.subscription.monthlyPrice} TL/ay` : ""}
                </div>
                {l.blockCount > 1 && (
                  <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {l.blocks.map((b) => <span key={b.id} style={S.tag}>{b.name}</span>)}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "kisiler" && (
          <>
            <div style={S.head}><h2 style={S.h2}>Kisiler</h2></div>
            {owners.length === 0 && <div style={S.card}><span style={S.muted}>Kayit yok.</span></div>}
            {owners.map((u: any) => (
              <div key={u.id} style={S.card}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{u.name}</span>
                    <span style={{ ...S.sub, marginLeft: 8 }}>{u.phone}</span>
                  </div>
                  <span style={S.sub}>{u.monthlyTotal > 0 ? u.monthlyTotal + " TL/ay" : ""}</span>
                </div>
                {u.assets.map((a: any) => (
                  <div key={a.kind + a.id} style={S.row}>
                    <div style={{ flex: 1 }}>
                      <div>{a.name}</div>
                      <div style={S.sub}>{a.type}</div>
                    </div>
                    {a.status && <SubBadge s={{ status: a.status, daysLeft: a.daysLeft }} />}
                    {a.kind === "location" && (
                      <button onClick={() => openDetail(a.id)} style={S.btnGhost}>Detay</button>
                    )}
                  </div>
                ))}
                {u.unpaidInvoices > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <span style={S.badgeAmber}>{u.unpaidInvoices} odenmemis fatura</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {tab === "kartlar" && (
          <>
            <div style={S.head}>
              <h2 style={S.h2}>Arac Kartlari</h2>
              <button onClick={() => setGenForm({ count: "10" })} style={S.btnPrimary}>+ Kart Uret</button>
            </div>
            <div style={{ ...S.metrics, gridTemplateColumns: "repeat(4,1fr)", marginBottom: 14 }}>
              <Metric label="Uretilen" value={vSummary.produced || 0} />
              <Metric label="Stokta" value={vSummary.unsold || 0} />
              <Metric label="Satilan" value={vSummary.sold || 0} />
              <Metric label="Aktif abonelik" value={vSummary.activeSubs || 0} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              {[["all", "Hepsi"], ["unsold", "Stokta"], ["active", "Aktif"], ["burned", "Yanmis"]].map(([k, lbl]) => (
                <button key={k} onClick={() => setVFilter(k)} style={vFilter === k ? S.chipOn : S.chip}>{lbl}</button>
              ))}
            </div>
            {vehicles.length === 0 && <div style={S.card}><span style={S.muted}>Kart yok. Uretmek icin yukaridaki butonu kullanin.</span></div>}
            {vehicles
              .filter((v: any) => vFilter === "all" ? true : v.status === vFilter)
              .map((v: any) => (
                <div key={v.id || v.code} style={S.card}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{v.code}</span>
                    <span style={v.status === "burned" ? S.badgeRed : v.status === "unsold" ? S.tag : S.badgeGreen}>
                      {v.status === "unsold" ? "Stokta" : v.status === "burned" ? "Yanmis" : "Aktif"}
                    </span>
                  </div>
                  {(v.plate || v.ownerName) && (
                    <div style={{ ...S.sub, marginTop: 5 }}>
                      {v.plate || v.label || ""}{v.ownerName ? " · " + v.ownerName : ""}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {v.status !== "burned" && (
                      <button onClick={() => setCardStatus(v.code, "burned")} style={S.btnGhost}>Karti Yak</button>
                    )}
                    <button onClick={() => downloadQr(v.code)} style={S.btnGhost}>QR Indir</button>
                    {v.status === "burned" && (
                      <button onClick={() => setCardStatus(v.code, "unsold")} style={S.btnGhost}>Stoga Al</button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    {v.status !== "burned" && (
                      <button onClick={() => setCardStatus(v.code, "burned")} style={S.btnGhost}>Karti Yak</button>
                    )}
                    {v.status === "burned" && (
                      <button onClick={() => setCardStatus(v.code, "unsold")} style={S.btnGhost}>Stoga Al</button>
                    )}
                  </div>
                </div>
              ))}
          </>
        )}

        {tab === "fatura" && (
          <>
            <div style={S.head}>
              <h2 style={S.h2}>Faturalar</h2>
              <button onClick={() => setInvForm({ ownerUserId: "", title: "", amount: "" })} style={S.btnPrimary}>+ Fatura Kes</button>
            </div>
            {invoices.length === 0 && <div style={S.card}><span style={S.muted}>Fatura yok.</span></div>}
            {invoices.map((i: any) => (
              <div key={i.id} style={S.card}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{i.owner}</span>
                    <span style={{ ...S.sub, marginLeft: 8 }}>{i.title || "Baslıksiz"}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{i.amount ? i.amount + " TL" : "-"}</span>
                </div>
                <div style={S.sub}>{new Date(i.createdAt).toLocaleDateString("tr-TR")}{i.sent ? " · Mail gonderildi" : ""}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                  <span style={i.paymentStatus === "paid" ? S.badgeGreen : S.badgeAmber}>
                    {i.paymentStatus === "paid" ? "Odendi" : "Bekliyor"}
                  </span>
                  <button onClick={() => toggleInvoicePaid(i.id, i.paymentStatus !== "paid")} style={S.btnGhost}>
                    {i.paymentStatus === "paid" ? "Odenmedi yap" : "Odendi isaretle"}
                  </button>
                  <button onClick={() => sendInvoice(i.id)} style={S.btnGhost}>Mail gonder</button>
                  {i.fileUrl && <a href={i.fileUrl} target="_blank" rel="noreferrer" style={S.btnGhost}>PDF</a>}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === "siparis" && (
          <>
            <div style={S.head}><h2 style={S.h2}>Arac Siparisleri</h2></div>
            {orders.length === 0 && <div style={S.card}><span style={S.muted}>Siparis yok.</span></div>}
            {orders.map((o) => (
              <div key={o.id} style={S.card}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{o.buyerName}</span>
                  <span style={o.status === "paid" ? S.badgeGreen : S.tag}>
                    {o.status === "paid" ? "Odendi" : o.status === "refunded" ? "Iade" : o.status === "cancelled" ? "Iptal" : "Bekliyor"}
                  </span>
                  {o.shipStatus === "shipped" && <span style={S.tag}>Kargolandi</span>}
                </div>
                <div style={S.sub}>{o.buyerPhone} · {o.shipCity} · {o.amount} TL</div>
                {o.refund?.reason && <div style={{ ...S.sub, marginTop: 6 }}>{o.refund.reason}</div>}
              </div>
            ))}
          </>
        )}
      </main>

      {genForm && (
        <>
          <div onClick={() => setGenForm(null)} style={S.overlay} />
          <div style={S.drawer}>
            <button onClick={() => setGenForm(null)} style={S.drawerClose}>Kapat</button>
            <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>Kart Uret</h3>
            <p style={{ ...S.sub, marginBottom: 14 }}>Gizli kodlar sadece bir kez gosterilir. PDF indirmeden ekrani kapatmayin.</p>
            <label style={S.lbl}>Adet (1-500)</label>
            <input value={genForm.count} onChange={(e) => setGenForm({ count: e.target.value })} inputMode="numeric" style={S.input} />
            <button onClick={generateCards} style={{ ...S.btnPrimary, width: "100%", marginTop: 18, padding: 10 }}>Uret</button>
          </div>
        </>
      )}

      {genResult && (
        <>
          <div style={S.overlay} />
          <div style={S.drawer}>
            <h3 style={{ fontSize: 17, margin: "0 0 6px" }}>{genResult.length} kart uretildi</h3>
            <div style={{ background: "#fef3c7", color: "#92400e", padding: 10, borderRadius: 8, fontSize: 12.5, marginBottom: 14 }}>
              Gizli kodlar bir daha gosterilmez. PDF indirin veya kodlari kaydedin.
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <button onClick={() => downloadLabels(genResult, "a4")} style={S.btnPrimary}>A4 PDF</button>
              <button onClick={() => downloadLabels(genResult, "single")} style={S.btnGhost}>Tekli PDF</button>
            </div>
            <div style={{ maxHeight: "50vh", overflowY: "auto", fontFamily: "monospace", fontSize: 12 }}>
              {genResult.map((k: any, i: number) => (
                <div key={i} style={{ padding: "5px 0", borderBottom: "1px solid #f1f5f9" }}>
                  {k.code} <span style={{ color: "#94a3b8" }}>/</span> {k.secretCode}
                </div>
              ))}
            </div>
            <button onClick={() => setGenResult(null)} style={{ ...S.btnGhost, width: "100%", marginTop: 16, padding: 10 }}>Kapat</button>
          </div>
        </>
      )}

      {invForm && (
        <>
          <div onClick={() => setInvForm(null)} style={S.overlay} />
          <div style={S.drawer}>
            <button onClick={() => setInvForm(null)} style={S.drawerClose}>Kapat</button>
            <h3 style={{ fontSize: 17, margin: "0 0 18px" }}>Yeni Fatura</h3>
            <label style={S.lbl}>Musteri</label>
            <select value={invForm.ownerUserId} onChange={(e) => setInvForm({ ...invForm, ownerUserId: e.target.value })} style={S.input}>
              <option value="">Secin...</option>
              {owners.map((o: any) => <option key={o.id} value={o.id}>{o.name} ({o.phone})</option>)}
            </select>
            <label style={S.lbl}>Baslik</label>
            <input value={invForm.title} onChange={(e) => setInvForm({ ...invForm, title: e.target.value })} placeholder="or. Temmuz aboneligi" style={S.input} />
            <label style={S.lbl}>Tutar (TL)</label>
            <input value={invForm.amount} onChange={(e) => setInvForm({ ...invForm, amount: e.target.value })} inputMode="numeric" placeholder="1299" style={S.input} />
            <button onClick={createInvoice} style={{ ...S.btnPrimary, width: "100%", marginTop: 18, padding: "10px" }}>Fatura Olustur</button>
          </div>
        </>
      )}

      {detail && (
        <>
          <div onClick={() => setDetail(null)} style={S.overlay} />
          <div style={S.drawer}>
            <button onClick={() => setDetail(null)} style={S.drawerClose}>Kapat</button>
            {detailLoading || !detail.name ? (
              <div style={S.muted}>Yukleniyor...</div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 18, margin: 0 }}>{detail.name}</h3>
                  <span style={S.tag}>{detail.type === "business" ? "Isletme" : "Apartman"}</span>
                  {detail.subscription && <SubBadge s={detail.subscription} />}
                </div>

                <Sec title="SAHIP" />
                {detail.owner ? (
                  <>
                    <Line k="Ad" v={detail.owner.name} />
                    <Line k="Telefon" v={detail.owner.phone} />
                    <Line k="E-posta" v={detail.owner.email || "-"} />
                  </>
                ) : <div style={S.muted}>Sahipsiz</div>}

                <Sec title="YAPI" />
                <Line k="Birim" v={String(detail.unitCount)} />
                <Line k="Kayitli sakin" v={String(detail.residentCount)} />
                <Line k="Cagri" v={String(detail.callCount)} />
                <Line k="Konum" v={`${detail.latitude?.toFixed(5)}, ${detail.longitude?.toFixed(5)}`} />

                <Sec title={`BLOKLAR (${detail.blockCount})`} />
                {(detail.blocks || []).map((b: any) => (
                  <div key={b.id} style={S.blockRow}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{b.name}</div>
                      <div style={S.sub}>{b.unitCount} birim · {b.residentCount} sakin</div>
                    </div>
                    <span style={S.countTag}>{b.requireApproval ? "Onayli" : "Acik"}</span>
                  </div>
                ))}

                <Sec title="ABONELIK" />
                {detail.subscription ? (
                  <>
                    <Line k="Durum" v={detail.subscription.status} />
                    <Line k="Kalan" v={`${detail.subscription.daysLeft} gun`} />
                    <Line k="Tutar" v={`${detail.subscription.monthlyPrice} TL/ay`} />
                    <Line k="Birim" v={String(detail.subscription.flatCount)} />
                  </>
                ) : <div style={S.muted}>Abonelik kaydi yok</div>}

                <Sec title={`FATURALAR (${(detail.invoices || []).length})`} />
                {(detail.invoices || []).length === 0 && <div style={S.muted}>Fatura yok</div>}
                {(detail.invoices || []).map((i: any) => (
                  <div key={i.id} style={S.blockRow}>
                    <div>
                      <div>{i.title || "Baslıksiz"}</div>
                      <div style={S.sub}>{new Date(i.createdAt).toLocaleDateString("tr-TR")}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>{i.amount ? i.amount + " TL" : "-"}</div>
                      <span style={i.paymentStatus === "paid" ? S.badgeGreen : S.badgeAmber}>
                        {i.paymentStatus === "paid" ? "Odendi" : "Bekliyor"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Sec({ title }: { title: string }) {
  return <div style={{ fontSize: 11, color: "#94a3b8", letterSpacing: ".05em", margin: "18px 0 8px", borderTop: "1px solid #e2e8f0", paddingTop: 12 }}>{title}</div>;
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13.5 }}>
      <span style={{ color: "#64748b" }}>{k}</span>
      <span style={{ textAlign: "right" }}>{v}</span>
    </div>
  );
}

function MenuItem({ label, active, onClick, badge, count, accent }: any) {
  return (
    <button onClick={onClick} style={{
      ...S.menuItem,
      background: active ? (accent ? "#1e293b" : "#f1f5f9") : "transparent",
      color: active ? (accent ? "#fff" : "#0f172a") : "#334155",
      fontWeight: active ? 600 : 400,
    }}>
      <span>{label}</span>
      {badge !== undefined && <span style={S.badgeRed}>{badge}</span>}
      {count !== undefined && badge === undefined && <span style={S.countTag}>{count}</span>}
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div style={S.metric}>
      <div style={{ fontSize: 12, color: "#64748b" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function SubBadge({ s }: { s: { status: string; daysLeft: number } }) {
  const map: Record<string, any> = {
    active: S.badgeGreen, trial: S.badgeBlue, expired: S.badgeRed,
    pending_payment: S.badgeAmber, cancelled: S.tag,
  };
  const label: Record<string, string> = {
    active: "Aktif", trial: "Deneme", expired: "Suresi doldu",
    pending_payment: "Odeme bekliyor", cancelled: "Iptal",
  };
  return <span style={map[s.status] || S.tag}>{label[s.status] || s.status} · {s.daysLeft}g</span>;
}

const S: Record<string, any> = {
  shell: { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui, -apple-system, sans-serif", color: "#0f172a" },
  side: { width: 190, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "18px 12px", display: "flex", flexDirection: "column", gap: 2 },
  brand: { fontWeight: 700, fontSize: 15, padding: "0 8px 14px" },
  group: { fontSize: 11, color: "#94a3b8", letterSpacing: ".05em", margin: "14px 0 4px 8px" },
  menuItem: { display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 10px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13.5, textAlign: "left" },
  logout: { padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 13, color: "#64748b" },
  main: { flex: 1, padding: "22px 26px", maxWidth: 900 },
  head: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 },
  h2: { fontSize: 19, fontWeight: 600, margin: 0 },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 14, marginBottom: 10 },
  cardHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  row: { display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderTop: "1px solid #f1f5f9" },
  sub: { fontSize: 12.5, color: "#64748b" },
  muted: { fontSize: 13, color: "#94a3b8" },
  metrics: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 4 },
  metric: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 12 },
  input: { padding: "9px 11px", border: "1px solid #cbd5e1", borderRadius: 8, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" },
  btnPrimary: { padding: "7px 13px", background: "#0f172a", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" },
  lbl: { display: "block", fontSize: 12.5, color: "#64748b", margin: "14px 0 5px" },
  btnGhost: { padding: "5px 11px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", fontSize: 12.5, color: "#475569", whiteSpace: "nowrap" },
  chip: { padding: "6px 12px", border: "1px solid #e2e8f0", borderRadius: 20, background: "#fff", cursor: "pointer", fontSize: 13 },
  chipOn: { padding: "6px 12px", border: "1px solid #0f172a", borderRadius: 20, background: "#0f172a", color: "#fff", cursor: "pointer", fontSize: 13 },
  tag: { fontSize: 11.5, padding: "2px 8px", borderRadius: 20, background: "#f1f5f9", color: "#475569" },
  countTag: { fontSize: 11.5, color: "#94a3b8" },
  badgeRed: { fontSize: 11.5, padding: "2px 8px", borderRadius: 20, background: "#fee2e2", color: "#b91c1c" },
  badgeGreen: { fontSize: 11.5, padding: "2px 8px", borderRadius: 20, background: "#dcfce7", color: "#15803d" },
  badgeAmber: { fontSize: 11.5, padding: "2px 8px", borderRadius: 20, background: "#fef3c7", color: "#b45309" },
  badgeBlue: { fontSize: 11.5, padding: "2px 8px", borderRadius: 20, background: "#dbeafe", color: "#1d4ed8" },
  loginWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "system-ui, sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15,23,42,.25)", zIndex: 40 },
  drawer: { position: "fixed", top: 0, right: 0, bottom: 0, width: 380, maxWidth: "92vw", background: "#fff", borderLeft: "1px solid #e2e8f0", padding: "20px 22px", overflowY: "auto", zIndex: 50, boxSizing: "border-box" },
  drawerClose: { float: "right", padding: "5px 11px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer", fontSize: 12.5, color: "#64748b" },
  blockRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #f1f5f9", fontSize: 13.5 },
  loginBox: { background: "#fff", padding: 28, borderRadius: 14, border: "1px solid #e2e8f0", width: 300 },
};
