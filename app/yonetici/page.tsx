"use client";

import { useState, useEffect } from "react";

const API = "/api";

type Pending = {
  residentId: string;
  userId: string;
  name: string;
  phone: string;
  photoUrl: string | null;
  flatNo: string;
  floor: number | null;
  buildingId: string;
};

type BuildingInfo = { id: string; buildingName: string; blockName: string | null };

export default function YoneticiPanel() {
  const [step, setStep] = useState<"phone" | "otp" | "panel">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isManager, setIsManager] = useState(false);
  const [buildings, setBuildings] = useState<BuildingInfo[]>([]);
  const [pending, setPending] = useState<Pending[]>([]);
  const [info, setInfo] = useState("");

  // Token'ı localStorage yerine state'te tutuyoruz (oturum bazlı)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("md_admin_token");
      if (saved) {
        setToken(saved);
        setStep("panel");
      }
    }
  }, []);

  useEffect(() => {
    if (token && step === "panel") loadPending(token);
  }, [token, step]);

  async function sendOtp() {
    setError("");
    if (!phone.trim()) { setError("Telefon numarası girin"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      if (!res.ok) throw new Error("Giriş başlatılamadı");
      setStep("otp");
    } catch (e: any) {
      setError(e.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError("");
    if (!code.trim()) { setError("Doğrulama kodunu girin"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(data.message || "Kod hatalı");
      setToken(data.token);
      sessionStorage.setItem("md_admin_token", data.token);
      setStep("panel");
    } catch (e: any) {
      setError(e.message || "Doğrulama başarısız");
    } finally {
      setLoading(false);
    }
  }

  async function loadPending(tk: string) {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/pending-residents`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setIsManager(!!data.isManager);
      setBuildings(data.buildings || []);
      setPending(data.pending || []);
    } catch (e: any) {
      setError("Liste yüklenemedi");
    } finally {
      setLoading(false);
    }
  }

  async function approve(residentId: string) {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/approve-resident`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ residentId }),
      });
      const data = await res.json();
      if (data.success) {
        setInfo("Sakin onaylandı.");
        setPending((p) => p.filter((x) => x.residentId !== residentId));
      } else {
        setError(data.message || "Onaylanamadı");
      }
    } finally {
      setLoading(false);
    }
  }

  async function reject(residentId: string) {
    if (!token) return;
    if (!confirm("Bu sakini reddetmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/buildings/reject-resident`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ residentId }),
      });
      const data = await res.json();
      if (data.success) {
        setInfo("Sakin reddedildi.");
        setPending((p) => p.filter((x) => x.residentId !== residentId));
      } else {
        setError(data.message || "İşlem başarısız");
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken(null);
    setStep("phone");
    setPhone("");
    setCode("");
    setPending([]);
    setIsManager(false);
    sessionStorage.removeItem("md_admin_token");
  }

  return (
    <div className="adm-root">
      <div className="adm-card">
        <div className="adm-brand">
          <span className="m">Mobil</span><span className="d">Diafon</span>
          <span className="adm-tag">Yönetici</span>
        </div>

        {step === "phone" && (
          <div className="adm-form">
            <h1>Yönetici Girişi</h1>
            <p className="adm-desc">Bina yöneticisi telefon numaranızla giriş yapın.</p>
            <input
              className="adm-input"
              type="tel"
              placeholder="05XX XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()}
            />
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
            <input
              className="adm-input"
              type="text"
              inputMode="numeric"
              placeholder="6 haneli kod"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
            />
            {error && <div className="adm-error">{error}</div>}
            <button className="adm-btn" onClick={verifyOtp} disabled={loading}>
              {loading ? "Doğrulanıyor..." : "Giriş Yap"}
            </button>
            <button className="adm-link" onClick={() => { setStep("phone"); setError(""); }}>
              ← Numarayı değiştir
            </button>
          </div>
        )}

        {step === "panel" && (
          <div className="adm-panel">
            <div className="adm-panel-head">
              <h1>Bekleyen Sakinler</h1>
              <button className="adm-logout" onClick={logout}>Çıkış</button>
            </div>

            {loading && <div className="adm-muted">Yükleniyor...</div>}

            {!loading && !isManager && (
              <div className="adm-empty">
                <p>Bu hesap bir bina yöneticisi değil.</p>
                <p className="adm-muted">Yönetici olmak için premium üyelik ve bina kurulumu gerekir.</p>
              </div>
            )}

            {!loading && isManager && (
              <>
                {buildings.length > 0 && (
                  <div className="adm-buildings">
                    Yönettiğiniz binalar:{" "}
                    {buildings.map((b) => b.blockName ? `${b.buildingName} - ${b.blockName}` : b.buildingName).join(", ")}
                  </div>
                )}

                {info && <div className="adm-info">{info}</div>}
                {error && <div className="adm-error">{error}</div>}

                {pending.length === 0 ? (
                  <div className="adm-empty">
                    <p>Onay bekleyen sakin yok.</p>
                    <p className="adm-muted">Yeni katılımlar burada görünecek.</p>
                  </div>
                ) : (
                  <div className="adm-list">
                    {pending.map((p) => (
                      <div key={p.residentId} className="adm-item">
                        <div className="adm-avatar">
                          {p.photoUrl ? (
                            <img src={p.photoUrl.startsWith("http") ? p.photoUrl : `${p.photoUrl}`} alt={p.name} />
                          ) : (
                            <span>{(p.name || "?").charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="adm-item-info">
                          <div className="adm-item-name">{p.name || "İsimsiz"}</div>
                          <div className="adm-item-sub">Daire {p.flatNo}{p.floor != null ? ` · ${p.floor}. kat` : ""} · {p.phone}</div>
                        </div>
                        <div className="adm-item-actions">
                          <button className="adm-approve" onClick={() => approve(p.residentId)} disabled={loading}>Onayla</button>
                          <button className="adm-reject" onClick={() => reject(p.residentId)} disabled={loading}>Reddet</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button className="adm-refresh" onClick={() => token && loadPending(token)} disabled={loading}>
                  Yenile
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}