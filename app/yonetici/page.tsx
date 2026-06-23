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
imageUrl: string | null;
  requireApproval: boolean;
  locationCheckEnabled: boolean;
  locationCheckRadius: number;
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
  const [tab, setTab] = useState<"pending" | "flats" | "security" | "calls">("pending");
  const [openBuilding, setOpenBuilding] = useState<string | null>(null);

  // Çağrı logları
  const [calls, setCalls] = useState<any[]>([]);

  // Güvenlik yönetimi
  const [guards, setGuards] = useState<{ id: string; phone: string; guardName: string | null }[]>([]);
  const [newGuardPhone, setNewGuardPhone] = useState("");
  const [newGuardName, setNewGuardName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("md_admin_token");
      if (saved) { setToken(saved); setStep("panel"); }
    }
  }, []);

  useEffect(() => {
    if (token && step === "panel") loadOverview(token);
  }, [token, step]);

  useEffect(() => {
    if (token && tab === "security") loadGuards(token);
  }, [token, tab]);

  useEffect(() => {
    if (token && tab === "calls") loadCalls(token);
  }, [token, tab]);

  async function loadCalls(tk: string) {
    try {
      const res = await fetch(`${API}/buildings/call-logs`, { headers: { Authorization: `Bearer ${tk}` } });
      const data = await res.json();
      setCalls(data.calls || []);
    } catch { /* sessiz */ }
  }

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

  async function addFlat(buildingId: string) {
    if (!token) return;
    const flatNo = prompt("Yeni daire no:");
    if (!flatNo || !flatNo.trim()) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/add-flat`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ buildingId, flatNo: flatNo.trim() }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Daire eklendi."); await loadOverview(token); }
      else setError(data.message || "Eklenemedi");
    } catch { setError("Eklenemedi"); } finally { setLoading(false); }
  }

  async function deleteFlat(apartmentId: string, flatNo: string) {
    if (!token) return;
    if (!confirm(`Daire ${flatNo} silinsin mi? (Sadece boş daire silinebilir)`)) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/delete-flat`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ apartmentId }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Daire silindi."); await loadOverview(token); }
      else setError(data.message || "Silinemedi");
    } catch { setError("Silinemedi"); } finally { setLoading(false); }
  }

  async function addBlock(fromBuildingId: string) {
    if (!token) return;
    const blockName = prompt("Yeni blok adı (örn: C):");
    if (!blockName || !blockName.trim()) return;
    const flatCountStr = prompt("Daire sayısı:");
    const flatCount = Number(flatCountStr);
    if (!flatCount || flatCount < 1) { setError("Geçerli daire sayısı girin"); return; }
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/add-block`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fromBuildingId, blockName: blockName.trim(), flatCount }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Blok eklendi."); await loadOverview(token); }
      else setError(data.message || "Eklenemedi");
    } catch { setError("Eklenemedi"); } finally { setLoading(false); }
  }

  function logout() {
    setToken(null); setStep("phone"); setPhone(""); setCode("");
    setBuildings([]); setIsManager(false); setOpenBuilding(null);
    sessionStorage.removeItem("md_admin_token");
  }

  async function setLocationCheck(buildingId: string, enabled: boolean, radius: number) {
    if (!token) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/set-location-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ buildingId, enabled, radius }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Konum doğrulama güncellendi."); await loadOverview(token); }
      else setError(data.message || "Güncellenemedi");
    } catch { setError("Güncellenemedi"); } finally { setLoading(false); }
  }
const [doorsByBuilding, setDoorsByBuilding] = useState<Record<string, any[]>>({});

  async function loadDoors(buildingId: string) {
    if (!token) return;
    try {
      const res = await fetch(`${API}/buildings/manage-doors/${buildingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setDoorsByBuilding((prev) => ({ ...prev, [buildingId]: data.doors || [] }));
    } catch { /* sessiz */ }
  }

  async function addDoor(buildingId: string) {
    if (!token) return;
    const name = prompt("Kapı adı (örn: Ana Giriş):");
    if (!name || !name.trim()) return;
    const deviceId = prompt("Tuya cihaz ID (device_id):");
    if (!deviceId || !deviceId.trim()) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/add-door`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ buildingId, name: name.trim(), deviceId: deviceId.trim() }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Kapı eklendi."); loadDoors(buildingId); }
      else setError(data.message || "Eklenemedi");
    } catch { setError("Eklenemedi"); } finally { setLoading(false); }
  }

  async function deleteDoor(doorId: string, buildingId: string) {
    if (!token) return;
    if (!confirm("Kapı silinsin mi?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/delete-door`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ doorId }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Kapı silindi."); loadDoors(buildingId); }
      else setError(data.message || "Silinemedi");
    } catch { setError("Silinemedi"); } finally { setLoading(false); }
  }
  function uploadBuildingImage(buildingId: string) {
    if (!token) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        // Resmi canvas ile küçült (max 1000px, JPEG %70) — sunucuda yer tasarrufu
        const img = new Image();
        img.onload = async () => {
          const maxW = 1000;
          const scale = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { setError("Resim işlenemedi"); return; }
          ctx.drawImage(img, 0, 0, w, h);
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          setLoading(true); setError(""); setInfo("");
          try {
            const res = await fetch(`${API}/buildings/set-building-image`, {
              method: "POST",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ buildingId, photo: base64 }),
            });
            const data = await res.json();
            if (data.success) { setInfo("Bina resmi güncellendi."); await loadOverview(token); }
            else setError(data.message || "Yüklenemedi");
          } catch { setError("Yüklenemedi"); } finally { setLoading(false); }
        };
        img.onerror = () => setError("Resim okunamadı");
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  async function loadGuards(tk: string) {
    try {
      const res = await fetch(`${API}/buildings/list-security`, { headers: { Authorization: `Bearer ${tk}` } });
      const data = await res.json();
      setGuards(data.guards || []);
    } catch { /* sessiz */ }
  }
  async function addGuard() {
    if (!token || !newGuardPhone.trim()) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/add-security`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: newGuardPhone.trim(), guardName: newGuardName.trim() || undefined }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Güvenlik eklendi."); setNewGuardPhone(""); setNewGuardName(""); loadGuards(token); }
      else setError(data.message || "Eklenemedi");
    } catch { setError("Eklenemedi"); } finally { setLoading(false); }
  }
  async function removeGuard(id: string, name: string) {
    if (!token) return;
    if (!confirm(`${name || "Bu güvenlik"} çıkarılsın mı?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/remove-security`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Güvenlik çıkarıldı."); loadGuards(token); }
      else setError(data.message || "İşlem başarısız");
    } catch { setError("İşlem başarısız"); } finally { setLoading(false); }
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
                  <button className={tab === "security" ? "active" : ""} onClick={() => setTab("security")}>Güvenlik</button>
                  <button className={tab === "calls" ? "active" : ""} onClick={() => setTab("calls")}>Çağrılar</button>
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
                        <button className="adm-bld-head" onClick={() => { const willOpen = openBuilding !== b.id; setOpenBuilding(willOpen ? b.id : null); if (willOpen) loadDoors(b.id); }}>
                          <div>
                            <div className="adm-bld-name">{buildingLabel(b)}</div>
                            <div className="adm-bld-sub">{b.flatCount} daire · {b.residentCount} sakin</div>
                          </div>
                          <span className="adm-chevron">{openBuilding === b.id ? "−" : "+"}</span>
                        </button>
                        {openBuilding === b.id && (
                          <div className="adm-flats">
                            <div className="adm-bld-image-row" style={{ gridColumn: "1 / -1" }}>
                              {b.imageUrl && (
                                <img src={b.imageUrl.startsWith("/uploads/") ? b.imageUrl : b.imageUrl} alt={buildingLabel(b)} className="adm-bld-image" />
                              )}
              <button className="adm-bld-image-btn" onClick={() => uploadBuildingImage(b.id)} disabled={loading}>
                                {b.imageUrl ? "Resmi Değiştir" : "Bina Resmi Yükle"}
                              </button>
                            </div>
                            <div className="adm-loccheck" style={{ gridColumn: "1 / -1", padding: "12px", background: "#f7f7f9", borderRadius: "10px", marginBottom: "10px" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: 600 }}>
                                <input type="checkbox" checked={b.locationCheckEnabled}
                                  onChange={(e) => setLocationCheck(b.id, e.target.checked, b.locationCheckRadius)}
                                  disabled={loading} />
                                Konum doğrulama {b.locationCheckEnabled ? "açık" : "kapalı"}
                              </label>
                              <div style={{ fontSize: "13px", color: "#666", margin: "6px 0 10px" }}>
                                Açıkken ziyaretçi yalnızca binanın yakınındayken arayabilir (taciz önleme). Kapalıyken QR yeterli.
                              </div>
                              {b.locationCheckEnabled && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "13px" }}>Mesafe:</span>
                                  <input type="number" min={20} max={2000} step={10} defaultValue={b.locationCheckRadius}
                                    style={{ width: "90px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    onBlur={(e) => { const v = Number(e.target.value); if (v >= 20 && v <= 2000 && v !== b.locationCheckRadius) setLocationCheck(b.id, true, v); }}
                                    disabled={loading} />
                                  <span style={{ fontSize: "13px", color: "#666" }}>metre</span>
                                </div>
                              )}
                            </div>
                            <div className="adm-doors" style={{ gridColumn: "1 / -1", padding: "12px", background: "#f0f7ff", borderRadius: "10px", marginBottom: "10px" }}>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>🚪 Kapılar (Tuya)</div>
                              <div style={{ fontSize: "13px", color: "#666", marginBottom: 10 }}>
                                Kapı açma için Tuya röle cihazının device ID'sini ekleyin. Bir blokta birden çok kapı olabilir.
                              </div>
                              {(doorsByBuilding[b.id] || []).map((d: any) => (
                                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#fff", borderRadius: "8px", marginBottom: 6 }}>
                                  <div>
                                    <div style={{ fontWeight: 600 }}>{d.name}</div>
                                    <div style={{ fontSize: "12px", color: "#999" }}>{d.deviceId}</div>
                                  </div>
                                  <button onClick={() => deleteDoor(d.id, b.id)} disabled={loading}
                                    style={{ color: "#e63946", background: "none", border: "1px solid #e63946", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}>Sil</button>
                                </div>
                              ))}
                              <button onClick={() => addDoor(b.id)} disabled={loading}
                                style={{ marginTop: 4, padding: "8px 14px", background: "#1a5fc2", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>+ Kapı Ekle</button>
                            </div>
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
                                {f.residents.length === 0 && (
                                  <button className="adm-flat-delete" onClick={() => deleteFlat(f.apartmentId, f.flatNo)} disabled={loading}>Daireyi Sil</button>
                                )}
                              </div>
                            ))}
                            <div className="adm-flat-add" onClick={() => !loading && addFlat(b.id)}>
                              + Daire Ekle
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {buildings.length > 0 && (
                      <button className="adm-add-block" onClick={() => addBlock(buildings[0].id)} disabled={loading}>
                        + Yeni Blok Ekle
                      </button>
                    )}
                  </div>
                )}

                {/* GÜVENLİK */}
                {tab === "security" && (
                  <div className="adm-security">
                    <p className="adm-muted" style={{ marginBottom: 16 }}>Güvenlik görevlileri sitenizin tüm bloklarını görür, dairelere not bırakabilir (örn. "kargonuz geldi").</p>
                    <div className="adm-guard-add">
                      <input className="adm-input" placeholder="Güvenlik telefonu (05XX...)" value={newGuardPhone} onChange={(e) => setNewGuardPhone(e.target.value)} />
                      <input className="adm-input" placeholder="İsim (opsiyonel)" value={newGuardName} onChange={(e) => setNewGuardName(e.target.value)} />
                      <button className="adm-btn" onClick={addGuard} disabled={loading || !newGuardPhone.trim()}>Ekle</button>
                    </div>
                    {guards.length === 0 ? (
                      <div className="adm-empty"><p>Henüz güvenlik eklenmemiş.</p><p className="adm-muted">Yukarıdan telefon numarasıyla ekleyin.</p></div>
                    ) : (
                      <div className="adm-list" style={{ marginTop: 18 }}>
                        {guards.map((g) => (
                          <div key={g.id} className="adm-item">
                            <div className="adm-avatar" style={{ background: "#1a5fc2" }}>🛡️</div>
                            <div className="adm-item-info">
                              <div className="adm-item-name">{g.guardName || "Güvenlik"}</div>
                              <div className="adm-item-sub">{g.phone}</div>
                            </div>
                            <div className="adm-item-actions">
                              <button className="adm-reject" onClick={() => removeGuard(g.id, g.guardName || "")} disabled={loading}>Çıkar</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ÇAĞRILAR */}
                {tab === "calls" && (
                  <div className="adm-calls">
                    {calls.length === 0 ? (
                      <div className="adm-empty"><p>Henüz çağrı kaydı yok.</p><p className="adm-muted">Binanızda görüşme yapıldıkça burada listelenir.</p></div>
                    ) : (
                      <div className="adm-call-list">
                        {calls.map((c) => (
                          <div key={c.id} className="adm-call-item">
                            <div className={c.status === "ENDED" ? "adm-call-icon ended" : "adm-call-icon missed"}>
                              {c.status === "ENDED" ? "✓" : "✕"}
                            </div>
                            <div className="adm-call-info">
                              <div className="adm-call-main">
                                {c.callerName || c.callerPhone || "Ziyaretçi"} → {c.receiverName || "Sakin"}
                              </div>
                              <div className="adm-call-sub">
                                {c.buildingLabel}{c.flatNo ? ` · Daire ${c.flatNo}` : ""} · {new Date(c.startedAt).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                            <div className="adm-call-dur">
                              {c.status === "ENDED" && c.duration != null ? `${c.duration}sn` : (c.status === "MISSED" ? "Cevapsız" : c.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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