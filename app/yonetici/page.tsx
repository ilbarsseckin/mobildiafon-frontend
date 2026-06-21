"use client";

import { useState, useEffect } from "react";

const API = "/api";

type Resident = {
  residentId: string;
  userId: string;
  name: string;
  phone: string;
  photoUrl: string | null;
  approved: boolean;
};
type Flat = { apartmentId: string; flatNo: string; floor: number | null; listingStatus: string; residents: Resident[] };

const LISTING_LABELS: Record<string, string> = { none: "", sale: "Satılık", rent: "Kiralık" };
type Building = {
  id: string;
  buildingName: string;
  siteName: string | null;
  blockName: string | null;
  requireApproval: boolean;
  flatCount: number;
  residentCount: number;
  flats: Flat[];
};

function photoSrc(url: string | null): string | null {
  if (!url) return null;
  const i = url.indexOf("/uploads/");
  if (i >= 0) return url.substring(i);
  return url;
}

function buildingLabel(b: Building): string {
  if (b.siteName && b.blockName) return `${b.siteName} — ${b.blockName} Blok`;
  if (b.blockName) return `${b.buildingName} — ${b.blockName}`;
  return b.buildingName;
}

export default function YoneticiPanel() {
  const [step, setStep] = useState<"phone" | "otp" | "panel">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [isManager, setIsManager] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [tab, setTab] = useState<"pending" | "flats">("pending");
  const [openBuilding, setOpenBuilding] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("md_admin_token");
      if (saved) { setToken(saved); setStep("panel"); }
    }
  }, []);

  useEffect(() => {
    if (token && step === "panel") loadOverview(token);
  }, [token, step]);

  async function sendOtp() {
    setError("");
    if (!phone.trim()) { setError("Telefon numarası girin"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      if (!res.ok) throw new Error("Giriş başlatılamadı");
      setStep("otp");
    } catch (e: any) { setError(e.message || "Bir hata oluştu"); }
    finally { setLoading(false); }
  }

  async function verifyOtp() {
    setError("");
    if (!code.trim()) { setError("Doğrulama kodunu girin"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.message || "Kod hatalı");
      setToken(data.token);
      sessionStorage.setItem("md_admin_token", data.token);
      setStep("panel");
    } catch (e: any) { setError(e.message || "Doğrulama başarısız"); }
    finally { setLoading(false); }
  }

  async function loadOverview(tk: string) {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/building-overview`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setIsManager(!!data.isManager);
      const bs: Building[] = data.buildings || [];
      setBuildings(bs);
      if (bs.length > 0 && !openBuilding) setOpenBuilding(bs[0].id);
    } catch { setError("Liste yüklenemedi"); }
    finally { setLoading(false); }
  }

  async function act(endpoint: string, residentId: string, okMsg: string) {
    if (!token) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ residentId }),
      });
      const data = await res.json();
      if (data.success) { setInfo(okMsg); await loadOverview(token); }
      else setError(data.message || "İşlem başarısız");
    } catch { setError("İşlem başarısız"); }
    finally { setLoading(false); }
  }

  function approve(id: string) { act("approve-resident", id, "Sakin onaylandı."); }
  function reject(id: string, name: string) {
    if (confirm(`${name || "Bu sakin"} reddedilsin mi?`)) act("reject-resident", id, "Sakin reddedildi.");
  }
  function remove(id: string, name: string) {
    if (confirm(`${name || "Bu sakin"} binadan çıkarılsın mı?`)) act("reject-resident", id, "Sakin çıkarıldı.");
  }

  async function setListing(apartmentId: string, status: string) {
    if (!token) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/set-listing`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ apartmentId, status }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Daire durumu güncellendi."); await loadOverview(token); }
      else setError(data.message || "Güncellenemedi");
    } catch { setError("Güncellenemedi"); }
    finally { setLoading(false); }
  }

  function logout() {
    setToken(null); setStep("phone"); setPhone(""); setCode("");
    setBuildings([]); setIsManager(false); setOpenBuilding(null);
    sessionStorage.removeItem("md_admin_token");
  }

  // Türetilen veriler
  const pending: { r: Resident; flatNo: string; label: string }[] = [];
  let totalFlats = 0, totalResidents = 0;
  for (const b of buildings) {
    totalFlats += b.flatCount;
    for (const f of b.flats) {
      for (const r of f.residents) {
        if (r.approved) totalResidents++;
        else pending.push({ r, flatNo: f.flatNo, label: buildingLabel(b) });
      }
    }
  }

  return (
    <div className="adm-root">
      <div className={step === "panel" ? "adm-card adm-card-wide" : "adm-card"}>
        <div className="adm-brand">
          <span className="m">Mobil</span><span className="d">Diafon</span>
          <span className="adm-tag">Yönetici</span>
          {step === "panel" && <button className="adm-logout" onClick={logout}>Çıkış</button>}
        </div>

        {step === "phone" && (
          <div className="adm-form">
            <h1>Yönetici Girişi</h1>
            <p className="adm-desc">Bina yöneticisi telefon numaranızla giriş yapın.</p>
            <input className="adm-input" type="tel" placeholder="05XX XXX XX XX"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()} />
            {error && <div className="adm-error">{error}</div>}
            <button className="adm-btn" onClick={sendOtp} disabled={loading}>
              {loading ? "Gönderiliyor..." : "Kod Gönder"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="adm-form">
            <h1>Doğrulama</h1>
            <p className="adm-desc">{phone} numarasına gönderilen kodu girin.</p>
            <input className="adm-input" type="text" inputMode="numeric" placeholder="6 haneli kod"
              value={code} onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()} />
            {error && <div className="adm-error">{error}</div>}
            <button className="adm-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Doğrulanıyor..." : "Giriş Yap"}
            </button>
            <button className="adm-link" onClick={() => { setStep("phone"); setError(""); }}>← Numarayı değiştir</button>
          </div>
        )}

        {step === "panel" && (
          <div className="adm-panel">
            {loading && buildings.length === 0 && <div className="adm-muted">Yükleniyor...</div>}

            {!loading && !isManager && (
              <div className="adm-empty">
                <p>Bu hesap bir bina yöneticisi değil.</p>
                <p className="adm-muted">Yönetici olmak için premium üyelik ve bina kurulumu gerekir.</p>
              </div>
            )}

            {isManager && (
              <>
                {/* İSTATİSTİKLER */}
                <div className="adm-stats">
                  <div className="adm-stat"><span className="num">{buildings.length}</span><span className="lbl">Blok / Bina</span></div>
                  <div className="adm-stat"><span className="num">{totalFlats}</span><span className="lbl">Daire</span></div>
                  <div className="adm-stat"><span className="num">{totalResidents}</span><span className="lbl">Sakin</span></div>
                  <div className="adm-stat highlight"><span className="num">{pending.length}</span><span className="lbl">Bekleyen</span></div>
                </div>

                {info && <div className="adm-info">{info}</div>}
                {error && <div className="adm-error">{error}</div>}

                {/* SEKMELER */}
                <div className="adm-tabs">
                  <button className={tab === "pending" ? "active" : ""} onClick={() => setTab("pending")}>
                    Bekleyenler {pending.length > 0 && <span className="badge">{pending.length}</span>}
                  </button>
                  <button className={tab === "flats" ? "active" : ""} onClick={() => setTab("flats")}>Daireler</button>
                </div>

                {/* BEKLEYENLER */}
                {tab === "pending" && (
                  pending.length === 0 ? (
                    <div className="adm-empty"><p>Onay bekleyen sakin yok.</p><p className="adm-muted">Yeni katılımlar burada görünecek.</p></div>
                  ) : (
                    <div className="adm-list">
                      {pending.map(({ r, flatNo, label }) => (
                        <div key={r.residentId} className="adm-item">
                          <div className="adm-avatar">
                            {photoSrc(r.photoUrl) ? <img src={photoSrc(r.photoUrl)!} alt={r.name} /> : <span>{(r.name || "?").charAt(0).toUpperCase()}</span>}
                          </div>
                          <div className="adm-item-info">
                            <div className="adm-item-name">{r.name || "İsimsiz"}</div>
                            <div className="adm-item-sub">{label} · Daire {flatNo} · {r.phone}</div>
                          </div>
                          <div className="adm-item-actions">
                            <button className="adm-approve" onClick={() => approve(r.residentId)} disabled={loading}>Onayla</button>
                            <button className="adm-reject" onClick={() => reject(r.residentId, r.name)} disabled={loading}>Reddet</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* DAİRELER */}
                {tab === "flats" && (
                  <div className="adm-buildings-list">
                    {buildings.map((b) => (
                      <div key={b.id} className="adm-bld">
                        <button className="adm-bld-head" onClick={() => setOpenBuilding(openBuilding === b.id ? null : b.id)}>
                          <div>
                            <div className="adm-bld-name">{buildingLabel(b)}</div>
                            <div className="adm-bld-sub">{b.flatCount} daire · {b.residentCount} sakin</div>
                          </div>
                          <span className="adm-chevron">{openBuilding === b.id ? "−" : "+"}</span>
                        </button>
                        {openBuilding === b.id && (
                          <div className="adm-flats">
                            {b.flats.map((f) => (
                              <div key={f.apartmentId} className={f.residents.length ? "adm-flat occupied" : "adm-flat"}>
                                <div className="adm-flat-no">
                                  Daire {f.flatNo}
                                  {f.listingStatus === "sale" && <span className="adm-listing sale">Satılık</span>}
                                  {f.listingStatus === "rent" && <span className="adm-listing rent">Kiralık</span>}
                                </div>
                                {f.residents.length === 0 ? (
                                  <div className="adm-flat-empty">Boş</div>
                                ) : (
                                  <div className="adm-flat-residents">
                                    {f.residents.map((r) => (
                                      <div key={r.residentId} className="adm-res">
                                        <div className="adm-res-info">
                                          <span className="adm-res-name">{r.name || "İsimsiz"}</span>
                                          {!r.approved && <span className="adm-pending-badge">beklemede</span>}
                                          <span className="adm-res-phone">{r.phone}</span>
                                        </div>
                                        <div className="adm-res-actions">
                                          {!r.approved && <button className="adm-mini-approve" onClick={() => approve(r.residentId)} disabled={loading}>Onayla</button>}
                                          <button className="adm-mini-remove" onClick={() => remove(r.residentId, r.name)} disabled={loading} title="Çıkar">Çıkar</button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <div className="adm-listing-controls">
                                  <button className={f.listingStatus === "none" ? "active" : ""} onClick={() => setListing(f.apartmentId, "none")} disabled={loading}>Normal</button>
                                  <button className={f.listingStatus === "sale" ? "active sale" : ""} onClick={() => setListing(f.apartmentId, "sale")} disabled={loading}>Satılık</button>
                                  <button className={f.listingStatus === "rent" ? "active rent" : ""} onClick={() => setListing(f.apartmentId, "rent")} disabled={loading}>Kiralık</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <button className="adm-refresh" onClick={() => token && loadOverview(token)} disabled={loading}>Yenile</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}