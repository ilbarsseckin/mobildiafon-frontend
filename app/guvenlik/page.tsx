"use client";

import { useState, useEffect } from "react";

const API = "/api";

type Resident = { name: string; phone: string; photoUrl: string | null };
type Flat = { apartmentId: string; flatNo: string; listingStatus: string; residents: Resident[] };
type Building = { id: string; buildingName: string; siteName: string | null; blockName: string | null; flatCount: number; flats: Flat[] };
type Note = { id: string; fromRole: string; fromName: string | null; text: string; isRead: boolean; createdAt: string };

function buildingLabel(b: Building): string {
  if (b.siteName && b.blockName) return `${b.siteName} — ${b.blockName} Blok`;
  if (b.blockName) return `${b.buildingName} — ${b.blockName}`;
  return b.buildingName;
}
function photoSrc(url: string | null): string | null {
  if (!url) return null;
  const i = url.indexOf("/uploads/");
  return i >= 0 ? url.substring(i) : url;
}

export default function GuvenlikPanel() {
  const [step, setStep] = useState<"phone" | "otp" | "panel">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const [isSecurity, setIsSecurity] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [openBuilding, setOpenBuilding] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Not modalı
  const [noteFlat, setNoteFlat] = useState<{ apartmentId: string; label: string } | null>(null);
  const [noteText, setNoteText] = useState("");
  const [flatNotes, setFlatNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("md_sec_token");
      if (saved) { setToken(saved); setStep("panel"); }
    }
  }, []);
  useEffect(() => { if (token && step === "panel") loadOverview(token); }, [token, step]);

  async function sendOtp() {
    setError("");
    if (!phone.trim()) { setError("Telefon numarası girin"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: phone.trim() }) });
      if (!res.ok) throw new Error("Giriş başlatılamadı");
      setStep("otp");
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }
  async function verifyOtp() {
    setError("");
    if (!code.trim()) { setError("Kodu girin"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone: phone.trim(), code: code.trim() }) });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.message || "Kod hatalı");
      setToken(data.token);
      sessionStorage.setItem("md_sec_token", data.token);
      setStep("panel");
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }
  async function loadOverview(tk: string) {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/security-overview`, { headers: { Authorization: `Bearer ${tk}` } });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setIsSecurity(!!data.isSecurity);
      const bs: Building[] = data.buildings || [];
      setBuildings(bs);
      if (bs.length > 0 && !openBuilding) setOpenBuilding(bs[0].id);
    } catch { setError("Liste yüklenemedi"); } finally { setLoading(false); }
  }

  async function openNotes(apartmentId: string, label: string) {
    setNoteFlat({ apartmentId, label }); setNoteText(""); setFlatNotes([]);
    try {
      const res = await fetch(`${API}/buildings/flat-notes?apartmentId=${apartmentId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setFlatNotes(data.notes || []);
    } catch { /* sessiz */ }
  }
  async function sendNote() {
    if (!noteFlat || !noteText.trim() || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/add-note`, {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ apartmentId: noteFlat.apartmentId, text: noteText.trim(), fromRole: "guvenlik" }),
      });
      const data = await res.json();
      if (data.success) { setNoteText(""); setInfo("Not gönderildi."); openNotes(noteFlat.apartmentId, noteFlat.label); }
      else setError(data.message || "Gönderilemedi");
    } catch { setError("Gönderilemedi"); } finally { setLoading(false); }
  }

  function logout() {
    setToken(null); setStep("phone"); setPhone(""); setCode("");
    setBuildings([]); setIsSecurity(false); setNoteFlat(null);
    sessionStorage.removeItem("md_sec_token");
  }

  const q = search.trim().toLowerCase();
  function flatMatches(f: Flat): boolean {
    if (!q) return true;
    if (f.flatNo.toLowerCase().includes(q)) return true;
    return f.residents.some((r) => (r.name || "").toLowerCase().includes(q) || (r.phone || "").includes(q));
  }

  return (
    <div className="adm-root">
      <div className={step === "panel" ? "adm-card adm-card-wide" : "adm-card"}>
        <div className="adm-brand">
          <span className="m">Mobil</span><span className="d">Diafon</span>
          <span className="adm-tag" style={{ background: "#e3f0ff", color: "#1a5fc2" }}>Güvenlik</span>
          {step === "panel" && <button className="adm-logout" onClick={logout}>Çıkış</button>}
        </div>

        {step === "phone" && (
          <div className="adm-form">
            <h1>Güvenlik Girişi</h1>
            <p className="adm-desc">Güvenlik görevlisi telefon numaranızla giriş yapın.</p>
            <input className="adm-input" type="tel" placeholder="05XX XXX XX XX" value={phone}
              onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendOtp()} />
            {error && <div className="adm-error">{error}</div>}
            <button className="adm-btn" onClick={sendOtp} disabled={loading}>{loading ? "Gönderiliyor..." : "Kod Gönder"}</button>
          </div>
        )}

        {step === "otp" && (
          <div className="adm-form">
            <h1>Doğrulama</h1>
            <p className="adm-desc">{phone} numarasına gönderilen kodu girin.</p>
            <input className="adm-input" type="text" inputMode="numeric" placeholder="6 haneli kod" value={code}
              onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && verifyOtp()} />
            {error && <div className="adm-error">{error}</div>}
            <button className="adm-btn" onClick={verifyOtp} disabled={loading}>{loading ? "Doğrulanıyor..." : "Giriş Yap"}</button>
            <button className="adm-link" onClick={() => { setStep("phone"); setError(""); }}>← Numarayı değiştir</button>
          </div>
        )}

        {step === "panel" && (
          <div className="adm-panel">
            {loading && buildings.length === 0 && <div className="adm-muted">Yükleniyor...</div>}
            {!loading && !isSecurity && (
              <div className="adm-empty">
                <p>Bu hesap bir güvenlik görevlisi olarak tanımlı değil.</p>
                <p className="adm-muted">Site yöneticisi sizi güvenlik olarak eklemelidir.</p>
              </div>
            )}
            {isSecurity && (
              <>
                {info && <div className="adm-info">{info}</div>}
                {error && <div className="adm-error">{error}</div>}

                <input className="adm-input" placeholder="Daire no veya isim ara..." value={search}
                  onChange={(e) => setSearch(e.target.value)} style={{ marginBottom: 18 }} />

                <div className="adm-buildings-list">
                  {buildings.map((b) => {
                    const visibleFlats = b.flats.filter(flatMatches);
                    if (q && visibleFlats.length === 0) return null;
                    return (
                      <div key={b.id} className="adm-bld">
                        <button className="adm-bld-head" onClick={() => setOpenBuilding(openBuilding === b.id ? null : b.id)}>
                          <div>
                            <div className="adm-bld-name">{buildingLabel(b)}</div>
                            <div className="adm-bld-sub">{b.flatCount} daire</div>
                          </div>
                          <span className="adm-chevron">{openBuilding === b.id || q ? "−" : "+"}</span>
                        </button>
                        {(openBuilding === b.id || q) && (
                          <div className="adm-flats">
                            {visibleFlats.map((f) => (
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
                                    {f.residents.map((r, i) => (
                                      <div key={i} className="adm-res">
                                        <div className="adm-res-info">
                                          <span className="adm-res-name">{r.name || "İsimsiz"}</span>
                                          <span className="adm-res-phone">{r.phone}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button className="adm-note-btn" onClick={() => openNotes(f.apartmentId, `Daire ${f.flatNo}`)} disabled={loading}>
                                  Not bırak
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button className="adm-refresh" onClick={() => token && loadOverview(token)} disabled={loading}>Yenile</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* NOT MODALI */}
      {noteFlat && (
        <div className="adm-modal-overlay" onClick={() => setNoteFlat(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <h3>{noteFlat.label} — Not</h3>
              <button className="adm-modal-close" onClick={() => setNoteFlat(null)}>✕</button>
            </div>
            <div className="adm-note-list">
              {flatNotes.length === 0 ? (
                <div className="adm-muted" style={{ textAlign: "center", padding: 16 }}>Henüz not yok.</div>
              ) : (
                flatNotes.map((n) => (
                  <div key={n.id} className="adm-note-item">
                    <div className="adm-note-meta">{n.fromRole === "guvenlik" ? "Güvenlik" : n.fromRole === "yonetici" ? "Yönetici" : n.fromName || "—"} · {new Date(n.createdAt).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</div>
                    <div className="adm-note-text">{n.text}</div>
                  </div>
                ))
              )}
            </div>
            <div className="adm-note-compose">
              <input className="adm-input" placeholder="Örn: Kargonuz güvenlikte" value={noteText}
                onChange={(e) => setNoteText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendNote()} />
              <button className="adm-btn" onClick={sendNote} disabled={loading || !noteText.trim()}>Gönder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}