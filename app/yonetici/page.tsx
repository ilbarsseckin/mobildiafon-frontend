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
type Flat = { apartmentId: string; flatNo: string; floor: number | null; listingStatus: string; residents: Resident[]; qrToken: string | null; qrLabel: string | null };

const LISTING_LABELS: Record<string, string> = { none: "", sale: "Satılık", rent: "Kiralık" };
type Building = {
  id: string;
  qrToken: string | null;
  buildingName: string;
  siteName: string | null;
  blockName: string | null;
  imageUrl: string | null;
  requireApproval: boolean;
  locationCheckEnabled: boolean;
  locationCheckRadius: number;
  securityMode: string;
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

const TABS: { key: "pending" | "flats" | "security" | "calls" | "subscription"; label: string }[] = [
  { key: "pending", label: "Bekleyenler" },
  { key: "flats", label: "Daireler" },
  { key: "security", label: "Güvenlik" },
  { key: "calls", label: "Çağrılar" },
  { key: "subscription", label: "Abonelik" },
];

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
  const [tab, setTab] = useState<"pending" | "flats" | "security" | "calls" | "subscription">("pending");
  const [subs, setSubs] = useState<any[]>([]);
  const [openBuilding, setOpenBuilding] = useState<string | null>(null);

  // Çağrı logları
  const [calls, setCalls] = useState<any[]>([]);

  // Güvenlik yönetimi
  const [guards, setGuards] = useState<{ id: string; phone: string; guardName: string | null; userId: string | null }[]>([]);
  const [newGuardPhone, setNewGuardPhone] = useState("");
  const [newGuardName, setNewGuardName] = useState("");

  const [doorsByBuilding, setDoorsByBuilding] = useState<Record<string, any[]>>({});

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

  useEffect(() => {
    if (token && tab === "subscription") loadSubs(token);
  }, [token, tab]);

  async function loadCalls(tk: string) {
    try {
      const res = await fetch(`${API}/buildings/call-logs`, { headers: { Authorization: `Bearer ${tk}` } });
      const data = await res.json();
      setCalls(data.calls || []);
    } catch { /* sessiz */ }
  }

  async function loadSubs(tk: string) {
    try {
      const res = await fetch(`${API}/subscription/my`, { headers: { Authorization: `Bearer ${tk}` } });
      const data = await res.json();
      setSubs(data.subscriptions || []);
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

  function printQrPoster(b: Building) {
    if (!b.qrToken) return;
    const url = "https://mobildiafon.com/web/ara.html?token=" + b.qrToken;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
    const title = buildingLabel(b);
    const w = window.open("", "_blank", "width=800,height=1000");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>QR Afis - ${title}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:40px; }
        .poster { text-align:center; border:3px solid #1a2a4a; border-radius:24px; padding:48px 40px; max-width:520px; width:100%; }
        .brand { font-size:28px; font-weight:800; color:#1a2a4a; letter-spacing:-1px; margin-bottom:6px; }
        .brand span { color:#e63946; }
        .tagline { font-size:14px; color:#888; margin-bottom:32px; }
        .bname { font-size:24px; font-weight:700; color:#1a2a4a; margin-bottom:8px; }
        .desc { font-size:16px; color:#555; margin-bottom:28px; line-height:1.5; }
        .qr { width:280px; height:280px; margin:0 auto 28px; border:1px solid #eee; border-radius:16px; padding:12px; }
        .qr img { width:100%; height:100%; }
        .steps { text-align:left; max-width:340px; margin:0 auto; }
        .step { display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; font-size:15px; color:#333; }
        .num { background:#e63946; color:#fff; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; }
        .foot { margin-top:28px; font-size:13px; color:#aaa; }
        @media print { body { padding:0; } }
      </style></head><body>
      <div class="poster">
        <div class="brand">Mobil<span>Diafon</span></div>
        <div class="tagline">Dijital Diafon - Diafon artik cebinizde</div>
        <div class="bname">${title}</div>
        <div class="desc">Ziyaretciler bu QR kodu okutarak dogru daireye goruntulu arama baslatir.</div>
        <div class="qr"><img src="${qrImg}" alt="QR"></div>
        <div class="steps">
          <div class="step"><span class="num">1</span><span>Telefon kameranizi QR koda tutun</span></div>
          <div class="step"><span class="num">2</span><span>Acilan sayfadan daire/kisi secin</span></div>
          <div class="step"><span class="num">3</span><span>Goruntulu arama baslasin</span></div>
        </div>
        <div class="foot">mobildiafon.com</div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print();},400);};</script>
      </body></html>`);
    w.document.close();
  }

  // Daire QR afisi yazdir
  function printFlatQr(b: Building, f: Flat) {
    if (!b.qrToken) return;
    const url = `https://mobildiafon.com/web/ara.html?token=${b.qrToken}&flat=${encodeURIComponent(f.flatNo)}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
    const label = f.qrLabel || `Daire ${f.flatNo}`;
    const sub = buildingLabel(b);
    const w = window.open("", "_blank", "width=800,height=1000");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>QR - ${label}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:40px; }
        .poster { text-align:center; border:3px solid #1a2a4a; border-radius:24px; padding:48px 40px; max-width:480px; width:100%; }
        .brand { font-size:24px; font-weight:800; color:#1a2a4a; letter-spacing:-1px; margin-bottom:4px; }
        .brand span { color:#e63946; }
        .sub { font-size:13px; color:#888; margin-bottom:28px; }
        .label { font-size:30px; font-weight:800; color:#1a2a4a; margin-bottom:24px; }
        .qr { width:260px; height:260px; margin:0 auto 24px; border:1px solid #eee; border-radius:16px; padding:12px; }
        .qr img { width:100%; height:100%; }
        .desc { font-size:15px; color:#555; line-height:1.5; }
        .foot { margin-top:24px; font-size:13px; color:#aaa; }
        @media print { body { padding:0; } }
      </style></head><body>
      <div class="poster">
        <div class="brand">Mobil<span>Diafon</span></div>
        <div class="sub">${sub}</div>
        <div class="label">${label}</div>
        <div class="qr"><img src="${qrImg}" alt="QR"></div>
        <div class="desc">Bu QR kodu okutarak dogrudan bu daireyi goruntulu arayabilirsiniz.</div>
        <div class="foot">mobildiafon.com</div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print();},400);};</script>
      </body></html>`);
    w.document.close();
  }

  // Birey/sakin QR afisi yazdir
  function printPersonQr(b: Building, f: Flat, r: Resident) {
    if (!b.qrToken) return;
    const url = `https://mobildiafon.com/web/ara.html?token=${b.qrToken}&flat=${encodeURIComponent(f.flatNo)}&user=${r.userId}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
    const label = r.name || "Sakin";
    const sub = `${buildingLabel(b)} · Daire ${f.flatNo}`;
    const w = window.open("", "_blank", "width=800,height=1000");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>QR - ${label}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:40px; }
        .poster { text-align:center; border:3px solid #1a2a4a; border-radius:24px; padding:48px 40px; max-width:480px; width:100%; }
        .brand { font-size:24px; font-weight:800; color:#1a2a4a; letter-spacing:-1px; margin-bottom:4px; }
        .brand span { color:#e63946; }
        .sub { font-size:13px; color:#888; margin-bottom:28px; }
        .label { font-size:30px; font-weight:800; color:#1a2a4a; margin-bottom:24px; }
        .qr { width:260px; height:260px; margin:0 auto 24px; border:1px solid #eee; border-radius:16px; padding:12px; }
        .qr img { width:100%; height:100%; }
        .desc { font-size:15px; color:#555; line-height:1.5; }
        .foot { margin-top:24px; font-size:13px; color:#aaa; }
        @media print { body { padding:0; } }
      </style></head><body>
      <div class="poster">
        <div class="brand">Mobil<span>Diafon</span></div>
        <div class="sub">${sub}</div>
        <div class="label">${label}</div>
        <div class="qr"><img src="${qrImg}" alt="QR"></div>
        <div class="desc">Bu QR kodu okutarak dogrudan ${label} kisisini goruntulu arayabilirsiniz.</div>
        <div class="foot">mobildiafon.com</div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print();},400);};</script>
      </body></html>`);
    w.document.close();
  }

  // Guvenlik QR afisi yazdir (yoneticinin ilk binasinin token'i uzerinden)
  function printGuardQr(g: { id: string; phone: string; guardName: string | null; userId: string | null }) {
    const firstWithToken = buildings.find((b) => b.qrToken);
    if (!firstWithToken || !firstWithToken.qrToken) {
      alert("QR olusturmak icin once bir bina/blok eklemelisiniz.");
      return;
    }
    const guardPart = g.userId ? `&guard=${g.userId}` : "";
    const url = `https://mobildiafon.com/web/ara.html?token=${firstWithToken.qrToken}${guardPart}`;
    const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data=${encodeURIComponent(url)}`;
    const label = g.guardName || "Güvenlik / Danışma";
    const w = window.open("", "_blank", "width=800,height=1000");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>Güvenlik QR</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, Helvetica, sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:40px; }
        .poster { text-align:center; border:3px solid #1a5fc2; border-radius:24px; padding:48px 40px; max-width:480px; width:100%; }
        .brand { font-size:24px; font-weight:800; color:#1a2a4a; letter-spacing:-1px; margin-bottom:4px; }
        .brand span { color:#e63946; }
        .sub { font-size:13px; color:#888; margin-bottom:24px; }
        .badge { display:inline-block; background:#1a5fc2; color:#fff; font-size:14px; font-weight:700; padding:6px 16px; border-radius:20px; margin-bottom:18px; }
        .label { font-size:28px; font-weight:800; color:#1a2a4a; margin-bottom:22px; }
        .qr { width:260px; height:260px; margin:0 auto 24px; border:1px solid #eee; border-radius:16px; padding:12px; }
        .qr img { width:100%; height:100%; }
        .desc { font-size:15px; color:#555; line-height:1.5; }
        .foot { margin-top:24px; font-size:13px; color:#aaa; }
        @media print { body { padding:0; } }
      </style></head><body>
      <div class="poster">
        <div class="brand">Mobil<span>Diafon</span></div>
        <div class="sub">${firstWithToken.buildingName || ""}</div>
        <div class="badge">🛡️ GÜVENLİK / DANIŞMA</div>
        <div class="label">${label}</div>
        <div class="qr"><img src="${qrImg}" alt="QR"></div>
        <div class="desc">Bu QR kodu okutarak güvenlik/danışma ile görüntülü görüşme başlatabilirsiniz.</div>
        <div class="foot">mobildiafon.com</div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print();},400);};</script>
      </body></html>`);
    w.document.close();
  }

  // Daire QR etiketini guncelle
  async function editFlatQrLabel(f: Flat) {
    const current = f.qrLabel || `Daire ${f.flatNo}`;
    const val = window.prompt("QR altinda gorunecek metin (ornek: Ahmet Yilmaz / Daire 5):", current);
    if (val === null) return;
    try {
      const res = await fetch(`${API}/buildings/set-flat-qr-label`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ apartmentId: f.apartmentId, label: val.trim() }),
      });
      const data = await res.json();
      if (data.success) { loadOverview(token!); }
      else { alert(data.message || "Guncellenemedi"); }
    } catch { alert("Baglanti hatasi"); }
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

  async function setSecurityMode(buildingId: string, mode: string, radius: number) {
    if (!token) return;
    setLoading(true); setError(""); setInfo("");
    try {
      const res = await fetch(`${API}/buildings/set-security-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ buildingId, mode, radius }),
      });
      const data = await res.json();
      if (data.success) { setInfo("Güvenlik modu güncellendi."); await loadOverview(token); }
      else setError(data.message || "Güncellenemedi");
    } catch { setError("Güncellenemedi"); } finally { setLoading(false); }
  }

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

  function subStatusLabel(s: any): { text: string; color: string } {
    if (s.status === "expired") return { text: "Süresi doldu", color: "#e63946" };
    if (s.isTrial) return { text: `Deneme — ${s.daysLeft} gün kaldı`, color: s.daysLeft <= 3 ? "#e6a23c" : "#1a8f3c" };
    if (s.status === "active") return { text: `Aktif — ${s.daysLeft} gün kaldı`, color: s.daysLeft <= 3 ? "#e6a23c" : "#1a8f3c" };
    return { text: s.status, color: "#666" };
  }

  const isLogin = step !== "panel";

  return (
    <div className="mdp">
      {/* ------------------------------------------------ GİRİŞ ------------------------------------------------ */}
      {isLogin && (
        <div className="mdp-login">
          <div className="mdp-login-card">
            <div className="mdp-logo">
              <span className="mdp-logo-mark" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" />
                  <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className="mdp-logo-text">Mobil<b>Diafon</b></span>
            </div>
            <div className="mdp-login-tag">Yönetici Paneli</div>

            {step === "phone" && (
              <>
                <h1>Giriş yapın</h1>
                <p className="mdp-desc">Bina yöneticisi telefon numaranıza tek kullanımlık kod göndereceğiz.</p>
                <label className="mdp-label" htmlFor="mdp-phone">Telefon numarası</label>
                <input id="mdp-phone" className="mdp-input" type="tel" placeholder="05XX XXX XX XX" autoComplete="tel"
                  value={phone} onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendOtp()} />
                {error && <div className="mdp-alert error">{error}</div>}
                <button className="mdp-btn primary block" onClick={sendOtp} disabled={loading}>
                  {loading ? "Gönderiliyor…" : "Kod Gönder"}
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <h1>Kodu girin</h1>
                <p className="mdp-desc"><b>{phone}</b> numarasına gönderilen 6 haneli kodu girin.</p>
                <label className="mdp-label" htmlFor="mdp-code">Doğrulama kodu</label>
                <input id="mdp-code" className="mdp-input otp" type="text" inputMode="numeric" maxLength={6} placeholder="••••••"
                  autoComplete="one-time-code"
                  value={code} onChange={(e) => setCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && verifyOtp()} />
                {error && <div className="mdp-alert error">{error}</div>}
                <button className="mdp-btn primary block" onClick={verifyOtp} disabled={loading}>
                  {loading ? "Doğrulanıyor…" : "Giriş Yap"}
                </button>
                <button className="mdp-linkbtn" onClick={() => { setStep("phone"); setError(""); }}>← Numarayı değiştir</button>
              </>
            )}
          </div>
          <div className="mdp-login-foot">mobildiafon.com</div>
        </div>
      )}

      {/* ------------------------------------------------ PANEL ------------------------------------------------ */}
      {step === "panel" && (
        <>
          <header className="mdp-header">
            <div className="mdp-header-inner">
              <div className="mdp-logo">
                <span className="mdp-logo-mark" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <span className="mdp-logo-text">Mobil<b>Diafon</b></span>
                <span className="mdp-header-tag">Yönetici</span>
              </div>
              <div className="mdp-header-actions">
                <button className="mdp-btn ghost sm" onClick={() => token && loadOverview(token)} disabled={loading}>
                  {loading ? "Yükleniyor…" : "Yenile"}
                </button>
                <button className="mdp-btn outline sm" onClick={logout}>Çıkış</button>
              </div>
            </div>
          </header>

          <main className="mdp-main">
            {loading && buildings.length === 0 && (
              <div className="mdp-empty"><div className="mdp-spinner" /><p>Panel yükleniyor…</p></div>
            )}

            {!loading && !isManager && (
              <div className="mdp-empty">
                <p><b>Bu hesap bir bina yöneticisi değil.</b></p>
                <p className="mdp-muted">Yönetici olmak için premium üyelik ve bina kurulumu gerekir.</p>
              </div>
            )}

            {isManager && (
              <>
                {/* İSTATİSTİKLER */}
                <section className="mdp-stats" aria-label="Özet">
                  <div className="mdp-stat">
                    <span className="num">{buildings.length}</span>
                    <span className="lbl">Blok / Bina</span>
                  </div>
                  <div className="mdp-stat">
                    <span className="num">{totalFlats}</span>
                    <span className="lbl">Daire</span>
                  </div>
                  <div className="mdp-stat">
                    <span className="num">{totalResidents}</span>
                    <span className="lbl">Sakin</span>
                  </div>
                  <button className={pending.length > 0 ? "mdp-stat alert clickable" : "mdp-stat clickable"} onClick={() => setTab("pending")}>
                    <span className="num">{pending.length}</span>
                    <span className="lbl">Onay Bekleyen</span>
                  </button>
                </section>

                {info && <div className="mdp-alert success">{info}</div>}
                {error && <div className="mdp-alert error">{error}</div>}

                {/* SEKMELER */}
                <nav className="mdp-tabs" aria-label="Bölümler">
                  {TABS.map((t) => (
                    <button key={t.key} className={tab === t.key ? "active" : ""} onClick={() => setTab(t.key)}>
                      {t.label}
                      {t.key === "pending" && pending.length > 0 && <span className="mdp-badge">{pending.length}</span>}
                    </button>
                  ))}
                </nav>

                {/* BEKLEYENLER */}
                {tab === "pending" && (
                  pending.length === 0 ? (
                    <div className="mdp-empty">
                      <p><b>Onay bekleyen sakin yok.</b></p>
                      <p className="mdp-muted">Yeni katılım talepleri burada görünecek.</p>
                    </div>
                  ) : (
                    <div className="mdp-list">
                      {pending.map(({ r, flatNo, label }) => (
                        <div key={r.residentId} className="mdp-row">
                          <div className="mdp-avatar">
                            {photoSrc(r.photoUrl)
                              ? <img src={photoSrc(r.photoUrl)!} alt={r.name} />
                              : <span>{(r.name || "?").charAt(0).toUpperCase()}</span>}
                          </div>
                          <div className="mdp-row-info">
                            <div className="mdp-row-title">{r.name || "İsimsiz"}</div>
                            <div className="mdp-row-sub">{label} · Daire {flatNo} · {r.phone}</div>
                          </div>
                          <div className="mdp-row-actions">
                            <button className="mdp-btn success sm" onClick={() => approve(r.residentId)} disabled={loading}>Onayla</button>
                            <button className="mdp-btn danger-outline sm" onClick={() => reject(r.residentId, r.name)} disabled={loading}>Reddet</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* DAİRELER */}
                {tab === "flats" && (
                  <div className="mdp-buildings">
                    {buildings.map((b) => (
                      <section key={b.id} className="mdp-bld">
                        <button
                          className="mdp-bld-head"
                          aria-expanded={openBuilding === b.id}
                          onClick={() => { const willOpen = openBuilding !== b.id; setOpenBuilding(willOpen ? b.id : null); if (willOpen) loadDoors(b.id); }}
                        >
                          <div className="mdp-bld-headleft">
                            <span className="mdp-bld-icon" aria-hidden>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 8h3a1 1 0 0 1 1 1v12" /><path d="M2 21h20" />
                                <path d="M8 7h2M8 11h2M8 15h2" />
                              </svg>
                            </span>
                            <div>
                              <div className="mdp-bld-name">{buildingLabel(b)}</div>
                              <div className="mdp-bld-sub">{b.flatCount} daire · {b.residentCount} sakin</div>
                            </div>
                          </div>
                          <span className={openBuilding === b.id ? "mdp-chevron open" : "mdp-chevron"} aria-hidden>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m6 9 6 6 6-6" /></svg>
                          </span>
                        </button>

                        {openBuilding === b.id && (
                          <div className="mdp-bld-body">
                            {/* Bina görseli */}
                            <div className="mdp-bld-image-row">
                              {b.imageUrl && (
                                <img src={b.imageUrl.startsWith("/uploads/") ? b.imageUrl : b.imageUrl} alt={buildingLabel(b)} className="mdp-bld-image" />
                              )}
                              <button className="mdp-btn ghost sm" onClick={() => uploadBuildingImage(b.id)} disabled={loading}>
                                {b.imageUrl ? "Resmi Değiştir" : "Bina Resmi Yükle"}
                              </button>
                            </div>

                            {/* QR kart */}
                            <div className="mdp-panelcard">
                              <div className="mdp-panelcard-title">Bina QR Kodu</div>
                              <p className="mdp-panelcard-desc">
                                Ziyaretçiler bu kodu okutarak {buildingLabel(b)} binasına ulaşır. Çıktısını alıp bina girişine asın.
                              </p>
                              {b.qrToken ? (
                                <div className="mdp-qr-row">
                                  <img
                                    className="mdp-qr-img"
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent("https://mobildiafon.com/web/ara.html?token=" + b.qrToken)}`}
                                    alt="Bina QR kodu" width={132} height={132}
                                  />
                                  <div className="mdp-qr-actions">
                                    <a
                                      className="mdp-btn primary sm"
                                      href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&data=${encodeURIComponent("https://mobildiafon.com/web/ara.html?token=" + b.qrToken)}`}
                                      download={`qr-${b.qrToken}.png`}
                                      target="_blank" rel="noopener noreferrer"
                                    >PNG İndir</a>
                                    <button className="mdp-btn navy sm" onClick={() => printQrPoster(b)}>Afiş Yazdır (PDF)</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="mdp-muted sm">QR token bulunamadı.</div>
                              )}
                            </div>

                            {/* Güvenlik modu */}
                            <div className="mdp-panelcard">
                              <div className="mdp-panelcard-title">Güvenlik Modu</div>
                              <div className="mdp-segment">
                                {[
                                  { key: "qr", label: "Sadece QR" },
                                  { key: "location", label: "Sadece Konum" },
                                  { key: "both", label: "QR + Konum" },
                                ].map((m) => {
                                  const active = (b.securityMode || "qr") === m.key;
                                  return (
                                    <button key={m.key} className={active ? "active" : ""}
                                      onClick={() => setSecurityMode(b.id, m.key, b.locationCheckRadius)}
                                      disabled={loading}>
                                      {m.label}
                                    </button>
                                  );
                                })}
                              </div>
                              <p className="mdp-panelcard-desc">
                                {(b.securityMode || "qr") === "qr" && "Bina yakındakiler listesinde görünmez. Ziyaretçi sadece QR okutarak arar."}
                                {(b.securityMode || "qr") === "location" && "Bina yakındakiler listesinde görünür. Ziyaretçi yakındaysa QR'sız arayabilir."}
                                {(b.securityMode || "qr") === "both" && "Bina listede görünür ama aramak için QR okutmak gerekir (en güvenli)."}
                              </p>
                              {((b.securityMode || "qr") === "location" || (b.securityMode || "qr") === "both") && (
                                <div className="mdp-radius">
                                  <span>Görünme mesafesi</span>
                                  <input type="number" min={20} max={2000} step={10} defaultValue={b.locationCheckRadius}
                                    onBlur={(e) => { const v = Number(e.target.value); if (v >= 20 && v <= 2000 && v !== b.locationCheckRadius) setSecurityMode(b.id, b.securityMode || "qr", v); }}
                                    disabled={loading} />
                                  <span className="mdp-muted sm">metre</span>
                                </div>
                              )}
                            </div>

                            {/* Kapılar */}
                            <div className="mdp-panelcard">
                              <div className="mdp-panelcard-title">Kapılar (Tuya)</div>
                              <p className="mdp-panelcard-desc">
                                Kapı açma için Tuya röle cihazının device ID'sini ekleyin. Bir blokta birden çok kapı olabilir.
                              </p>
                              {(doorsByBuilding[b.id] || []).map((d: any) => (
                                <div key={d.id} className="mdp-door">
                                  <div>
                                    <div className="mdp-door-name">{d.name}</div>
                                    <div className="mdp-door-id">{d.deviceId}</div>
                                  </div>
                                  <button className="mdp-btn danger-outline sm" onClick={() => deleteDoor(d.id, b.id)} disabled={loading}>Sil</button>
                                </div>
                              ))}
                              <button className="mdp-btn blue sm" onClick={() => addDoor(b.id)} disabled={loading}>+ Kapı Ekle</button>
                            </div>

                            {/* Daireler grid */}
                            <div className="mdp-flats">
                              {b.flats.map((f) => (
                                <div key={f.apartmentId} className={f.residents.length ? "mdp-flat occupied" : "mdp-flat"}>
                                  <div className="mdp-flat-head">
                                    <span className="mdp-flat-no">Daire {f.flatNo}</span>
                                    {f.listingStatus === "sale" && <span className="mdp-chip sale">Satılık</span>}
                                    {f.listingStatus === "rent" && <span className="mdp-chip rent">Kiralık</span>}
                                  </div>

                                  {f.qrToken && (
                                    <div className="mdp-flat-qr">
                                      <button className="mdp-btn ghost xs" onClick={() => printFlatQr(b, f)} title="Daire QR afişi yazdır">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v6h-6v-2h4v-4Z" /></svg>
                                        QR Afiş
                                      </button>
                                      <button className="mdp-btn ghost xs" onClick={() => editFlatQrLabel(f)} title="QR altı metni düzenle">
                                        {f.qrLabel ? `"${f.qrLabel}"` : "Etiket ekle"}
                                      </button>
                                    </div>
                                  )}

                                  {f.residents.length === 0 ? (
                                    <div className="mdp-flat-empty">Boş</div>
                                  ) : (
                                    <div className="mdp-flat-residents">
                                      {f.residents.map((r) => (
                                        <div key={r.residentId} className="mdp-res">
                                          <div className="mdp-res-info">
                                            <span className="mdp-res-name">{r.name || "İsimsiz"}</span>
                                            {!r.approved && <span className="mdp-chip pending">beklemede</span>}
                                            <span className="mdp-res-phone">{r.phone}</span>
                                          </div>
                                          <div className="mdp-res-actions">
                                            {!r.approved && <button className="mdp-btn success xs" onClick={() => approve(r.residentId)} disabled={loading}>Onayla</button>}
                                            {r.approved && <button className="mdp-btn navy xs" onClick={() => printPersonQr(b, f, r)} disabled={loading} title="Kişiye özel QR afişi">QR</button>}
                                            <button className="mdp-btn danger-outline xs" onClick={() => remove(r.residentId, r.name)} disabled={loading} title="Çıkar">Çıkar</button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <div className="mdp-segment sm">
                                    <button className={f.listingStatus === "none" ? "active" : ""} onClick={() => setListing(f.apartmentId, "none")} disabled={loading}>Normal</button>
                                    <button className={f.listingStatus === "sale" ? "active sale" : ""} onClick={() => setListing(f.apartmentId, "sale")} disabled={loading}>Satılık</button>
                                    <button className={f.listingStatus === "rent" ? "active rent" : ""} onClick={() => setListing(f.apartmentId, "rent")} disabled={loading}>Kiralık</button>
                                  </div>

                                  {f.residents.length === 0 && (
                                    <button className="mdp-flat-delete" onClick={() => deleteFlat(f.apartmentId, f.flatNo)} disabled={loading}>Daireyi Sil</button>
                                  )}
                                </div>
                              ))}
                              <button className="mdp-flat-add" onClick={() => !loading && addFlat(b.id)}>+ Daire Ekle</button>
                            </div>
                          </div>
                        )}
                      </section>
                    ))}
                    {buildings.length > 0 && (
                      <button className="mdp-btn outline block" onClick={() => addBlock(buildings[0].id)} disabled={loading}>
                        + Yeni Blok Ekle
                      </button>
                    )}
                  </div>
                )}

                {/* GÜVENLİK */}
                {tab === "security" && (
                  <div>
                    <p className="mdp-muted section-desc">
                      Güvenlik görevlileri sitenizin tüm bloklarını görür, dairelere not bırakabilir (örn. "kargonuz geldi").
                    </p>
                    <div className="mdp-guard-add">
                      <input className="mdp-input" placeholder="Güvenlik telefonu (05XX…)" value={newGuardPhone} onChange={(e) => setNewGuardPhone(e.target.value)} />
                      <input className="mdp-input" placeholder="İsim (opsiyonel)" value={newGuardName} onChange={(e) => setNewGuardName(e.target.value)} />
                      <button className="mdp-btn primary" onClick={addGuard} disabled={loading || !newGuardPhone.trim()}>Ekle</button>
                    </div>
                    {guards.length === 0 ? (
                      <div className="mdp-empty">
                        <p><b>Henüz güvenlik eklenmemiş.</b></p>
                        <p className="mdp-muted">Yukarıdan telefon numarasıyla ekleyin.</p>
                      </div>
                    ) : (
                      <div className="mdp-list">
                        {guards.map((g) => (
                          <div key={g.id} className="mdp-row">
                            <div className="mdp-avatar guard" aria-hidden>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /></svg>
                            </div>
                            <div className="mdp-row-info">
                              <div className="mdp-row-title">{g.guardName || "Güvenlik"}</div>
                              <div className="mdp-row-sub">{g.phone}</div>
                            </div>
                            <div className="mdp-row-actions">
                              <button className="mdp-btn navy sm" onClick={() => printGuardQr(g)} disabled={loading} title="Güvenlik QR afişi">QR</button>
                              <button className="mdp-btn danger-outline sm" onClick={() => removeGuard(g.id, g.guardName || "")} disabled={loading}>Çıkar</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ÇAĞRILAR */}
                {tab === "calls" && (
                  <div>
                    {calls.length === 0 ? (
                      <div className="mdp-empty">
                        <p><b>Henüz çağrı kaydı yok.</b></p>
                        <p className="mdp-muted">Binanızda görüşme yapıldıkça burada listelenir.</p>
                      </div>
                    ) : (
                      <div className="mdp-list">
                        {calls.map((c) => (
                          <div key={c.id} className="mdp-row">
                            <div className={c.status === "ENDED" ? "mdp-callicon ended" : "mdp-callicon missed"} aria-hidden>
                              {c.status === "ENDED" ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                              ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                              )}
                            </div>
                            <div className="mdp-row-info">
                              <div className="mdp-row-title">
                                {c.callerName || c.callerPhone || "Ziyaretçi"} <span className="mdp-arrow">→</span> {c.receiverName || "Sakin"}
                              </div>
                              <div className="mdp-row-sub">
                                {c.buildingLabel}{c.flatNo ? ` · Daire ${c.flatNo}` : ""} · {new Date(c.startedAt).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                            <div className="mdp-call-dur">
                              {c.status === "ENDED" && c.duration != null ? `${c.duration} sn` : (c.status === "MISSED" ? "Cevapsız" : c.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ABONELİK */}
                {tab === "subscription" && (
                  <div>
                    <p className="mdp-muted section-desc">
                      Site ve birimlerinizin abonelik durumu. Deneme süreniz bitince ödeme ile devam edebilirsiniz.
                    </p>
                    {subs.length === 0 ? (
                      <div className="mdp-empty"><p><b>Abonelik bilgisi yok.</b></p></div>
                    ) : (
                      <div className="mdp-subs">
                        {subs.map((s) => {
                          const st = subStatusLabel(s);
                          return (
                            <div key={s.id} className="mdp-panelcard sub">
                              <div className="mdp-sub-head">
                                <div className="mdp-sub-title">{s.label}</div>
                                <span className="mdp-chip" style={{ color: st.color, background: st.color + "18" }}>{st.text}</span>
                              </div>
                              <dl className="mdp-sub-details">
                                <div><dt>Tür</dt><dd>{s.scopeType === "site" ? "Site (toplu)" : "Bireysel birim"}</dd></div>
                                <div><dt>Daire sayısı</dt><dd>{s.flatCount}</dd></div>
                                <div><dt>Aylık tutar</dt><dd><b>{s.monthlyPrice} ₺</b></dd></div>
                                {s.periodEnd && <div><dt>Bitiş</dt><dd>{new Date(s.periodEnd).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}</dd></div>}
                              </dl>
                              <button className="mdp-btn success block" disabled>Ödeme ile Devam Et (yakında)</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </main>
        </>
      )}

      {/* ------------------------------------------------ STİLLER ------------------------------------------------ */}
      <style jsx global>{`
        .mdp {
          /* Tokenlar */
          --ink: #16213a;
          --ink-soft: #4a5570;
          --muted: #8a93a8;
          --line: #e4e8f0;
          --bg: #eef1f6;
          --surface: #ffffff;
          --surface-2: #f7f9fc;
          --red: #e63946;
          --red-soft: #fdeef0;
          --navy: #1a2a4a;
          --blue: #1a5fc2;
          --blue-soft: #eef4fc;
          --green: #1a8f3c;
          --green-soft: #e9f6ee;
          --amber: #e6a23c;
          --radius: 14px;
          --radius-sm: 10px;
          --shadow: 0 1px 2px rgba(22, 33, 58, 0.05), 0 4px 16px rgba(22, 33, 58, 0.06);

          min-height: 100vh;
          background: var(--bg);
          color: var(--ink);
          font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 15px;
          line-height: 1.45;
          -webkit-font-smoothing: antialiased;
        }
        .mdp *, .mdp *::before, .mdp *::after { box-sizing: border-box; }
        .mdp button { font: inherit; cursor: pointer; }
        .mdp button:disabled { cursor: not-allowed; opacity: 0.55; }
        .mdp :focus-visible { outline: 2px solid var(--blue); outline-offset: 2px; border-radius: 4px; }

        /* ---------- Logo ---------- */
        .mdp-logo { display: inline-flex; align-items: center; gap: 8px; }
        .mdp-logo-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 10px;
          background: var(--navy); color: #fff;
        }
        .mdp-logo-text { font-size: 19px; font-weight: 700; letter-spacing: -0.4px; color: var(--navy); }
        .mdp-logo-text b { color: var(--red); font-weight: 800; }

        /* ---------- Giriş ---------- */
        .mdp-login {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 24px;
          background:
            radial-gradient(600px 300px at 15% 0%, rgba(230, 57, 70, 0.06), transparent 60%),
            radial-gradient(700px 350px at 90% 100%, rgba(26, 42, 74, 0.08), transparent 60%),
            var(--bg);
        }
        .mdp-login-card {
          width: 100%; max-width: 400px; background: var(--surface);
          border: 1px solid var(--line); border-radius: 20px;
          box-shadow: var(--shadow); padding: 32px 28px;
        }
        .mdp-login-tag {
          display: inline-block; margin: 14px 0 20px; padding: 4px 10px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.4px;
          color: var(--red); background: var(--red-soft); border-radius: 20px;
        }
        .mdp-login-card h1 { margin: 0 0 6px; font-size: 22px; font-weight: 800; letter-spacing: -0.4px; }
        .mdp-desc { margin: 0 0 20px; font-size: 14px; color: var(--ink-soft); }
        .mdp-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
        .mdp-login-foot { margin-top: 20px; font-size: 12px; color: var(--muted); }

        /* ---------- Girdiler ---------- */
        .mdp-input {
          width: 100%; padding: 12px 14px; margin-bottom: 14px;
          font: inherit; color: var(--ink);
          background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .mdp-input::placeholder { color: var(--muted); }
        .mdp-input:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(26, 42, 74, 0.1); }
        .mdp-input.otp { text-align: center; font-size: 22px; letter-spacing: 10px; font-weight: 700; }

        /* ---------- Butonlar ---------- */
        .mdp-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 10px 18px; border-radius: var(--radius-sm); border: 1px solid transparent;
          font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap;
          transition: background 0.15s, border-color 0.15s, transform 0.05s;
        }
        .mdp-btn:active { transform: translateY(1px); }
        .mdp-btn.block { width: 100%; }
        .mdp-btn.sm { padding: 7px 13px; font-size: 13px; }
        .mdp-btn.xs { padding: 4px 9px; font-size: 12px; border-radius: 8px; }
        .mdp-btn.primary { background: var(--red); color: #fff; }
        .mdp-btn.primary:hover:not(:disabled) { background: #d02c39; }
        .mdp-btn.navy { background: var(--navy); color: #fff; }
        .mdp-btn.navy:hover:not(:disabled) { background: #12203a; }
        .mdp-btn.blue { background: var(--blue); color: #fff; }
        .mdp-btn.blue:hover:not(:disabled) { background: #144e9f; }
        .mdp-btn.success { background: var(--green); color: #fff; }
        .mdp-btn.success:hover:not(:disabled) { background: #157a32; }
        .mdp-btn.outline { background: var(--surface); color: var(--ink); border-color: var(--line); }
        .mdp-btn.outline:hover:not(:disabled) { border-color: var(--ink-soft); }
        .mdp-btn.ghost { background: var(--surface-2); color: var(--ink); border-color: var(--line); }
        .mdp-btn.ghost:hover:not(:disabled) { background: #eef1f7; }
        .mdp-btn.danger-outline { background: var(--surface); color: var(--red); border-color: #f3c2c7; }
        .mdp-btn.danger-outline:hover:not(:disabled) { background: var(--red-soft); border-color: var(--red); }
        .mdp-linkbtn {
          display: block; margin: 12px auto 0; background: none; border: none;
          color: var(--ink-soft); font-size: 13px; font-weight: 600;
        }
        .mdp-linkbtn:hover { color: var(--ink); }

        /* ---------- Header ---------- */
        .mdp-header {
          position: sticky; top: 0; z-index: 20;
          background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(8px);
          border-bottom: 1px solid var(--line);
        }
        .mdp-header-inner {
          max-width: 1060px; margin: 0 auto; padding: 12px 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
        }
        .mdp-header-tag {
          margin-left: 6px; padding: 3px 9px; font-size: 11px; font-weight: 700;
          letter-spacing: 0.4px; text-transform: uppercase;
          color: var(--red); background: var(--red-soft); border-radius: 20px;
        }
        .mdp-header-actions { display: flex; gap: 8px; }

        /* ---------- Ana içerik ---------- */
        .mdp-main { max-width: 1060px; margin: 0 auto; padding: 24px 20px 60px; }
        .mdp-muted { color: var(--muted); }
        .mdp-muted.sm { font-size: 13px; }
        .section-desc { margin: 0 0 16px; font-size: 14px; }

        /* ---------- İstatistikler ---------- */
        .mdp-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 18px;
        }
        .mdp-stat {
          display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
          padding: 16px 18px; background: var(--surface);
          border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);
          text-align: left;
        }
        .mdp-stat .num { font-size: 26px; font-weight: 800; letter-spacing: -0.6px; line-height: 1.1; }
        .mdp-stat .lbl { font-size: 12.5px; font-weight: 600; color: var(--muted); }
        .mdp-stat.clickable:hover { border-color: var(--ink-soft); }
        .mdp-stat.alert { border-color: var(--red); background: var(--red-soft); }
        .mdp-stat.alert .num, .mdp-stat.alert .lbl { color: var(--red); }

        /* ---------- Uyarılar ---------- */
        .mdp-alert {
          padding: 10px 14px; margin-bottom: 14px; border-radius: var(--radius-sm);
          font-size: 14px; font-weight: 500;
        }
        .mdp-alert.error { background: var(--red-soft); color: #b3202c; border: 1px solid #f3c2c7; }
        .mdp-alert.success { background: var(--green-soft); color: #14672c; border: 1px solid #bfe5cc; }

        /* ---------- Sekmeler ---------- */
        .mdp-tabs {
          display: flex; gap: 4px; padding: 4px; margin-bottom: 20px;
          background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); overflow-x: auto; scrollbar-width: none;
        }
        .mdp-tabs::-webkit-scrollbar { display: none; }
        .mdp-tabs button {
          flex: 1 0 auto; display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 9px 14px; border: none; border-radius: var(--radius-sm);
          background: transparent; color: var(--ink-soft); font-size: 14px; font-weight: 600;
          transition: background 0.15s, color 0.15s;
        }
        .mdp-tabs button:hover { color: var(--ink); }
        .mdp-tabs button.active { background: var(--navy); color: #fff; }
        .mdp-badge {
          min-width: 19px; height: 19px; padding: 0 5px;
          display: inline-flex; align-items: center; justify-content: center;
          background: var(--red); color: #fff; font-size: 11.5px; font-weight: 700; border-radius: 10px;
        }

        /* ---------- Liste satırları ---------- */
        .mdp-list { display: flex; flex-direction: column; gap: 10px; }
        .mdp-row {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; background: var(--surface);
          border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);
        }
        .mdp-avatar {
          width: 42px; height: 42px; flex-shrink: 0; border-radius: 50%; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          background: var(--surface-2); border: 1px solid var(--line);
          color: var(--ink-soft); font-weight: 700; font-size: 16px;
        }
        .mdp-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .mdp-avatar.guard { background: var(--blue-soft); color: var(--blue); border-color: #cddff5; }
        .mdp-row-info { flex: 1; min-width: 0; }
        .mdp-row-title { font-weight: 700; font-size: 14.5px; }
        .mdp-row-sub { font-size: 13px; color: var(--muted); }
        .mdp-row-actions { display: flex; gap: 6px; flex-shrink: 0; }
        .mdp-arrow { color: var(--muted); font-weight: 400; }
        .mdp-call-dur { font-size: 13px; font-weight: 600; color: var(--ink-soft); white-space: nowrap; }
        .mdp-callicon {
          width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .mdp-callicon.ended { background: var(--green-soft); color: var(--green); }
        .mdp-callicon.missed { background: var(--red-soft); color: var(--red); }

        /* ---------- Boş durumlar ---------- */
        .mdp-empty {
          padding: 40px 20px; text-align: center;
          background: var(--surface); border: 1px dashed var(--line); border-radius: var(--radius);
        }
        .mdp-empty p { margin: 0 0 4px; }
        .mdp-spinner {
          width: 26px; height: 26px; margin: 0 auto 12px;
          border: 3px solid var(--line); border-top-color: var(--red); border-radius: 50%;
          animation: mdp-spin 0.8s linear infinite;
        }
        @keyframes mdp-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .mdp-spinner { animation-duration: 2s; }
          .mdp-btn:active { transform: none; }
        }

        /* ---------- Bina akordeonu ---------- */
        .mdp-buildings { display: flex; flex-direction: column; gap: 12px; }
        .mdp-bld {
          background: var(--surface); border: 1px solid var(--line);
          border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden;
        }
        .mdp-bld-head {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 16px; background: none; border: none; text-align: left;
        }
        .mdp-bld-head:hover { background: var(--surface-2); }
        .mdp-bld-headleft { display: flex; align-items: center; gap: 12px; }
        .mdp-bld-icon {
          width: 38px; height: 38px; border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          background: var(--navy); color: #fff; flex-shrink: 0;
        }
        .mdp-bld-name { font-weight: 700; font-size: 15.5px; }
        .mdp-bld-sub { font-size: 13px; color: var(--muted); }
        .mdp-chevron { color: var(--muted); transition: transform 0.2s; display: inline-flex; }
        .mdp-chevron.open { transform: rotate(180deg); }
        .mdp-bld-body { padding: 0 16px 16px; border-top: 1px solid var(--line); }
        .mdp-bld-image-row { display: flex; align-items: center; gap: 12px; padding: 14px 0; flex-wrap: wrap; }
        .mdp-bld-image { width: 120px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--line); }

        /* ---------- Panel içi kartlar ---------- */
        .mdp-panelcard {
          padding: 14px 16px; margin-bottom: 12px;
          background: var(--surface-2); border: 1px solid var(--line); border-radius: var(--radius-sm);
        }
        .mdp-panelcard-title { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
        .mdp-panelcard-desc { margin: 0 0 12px; font-size: 13px; color: var(--ink-soft); }
        .mdp-qr-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .mdp-qr-img { border-radius: var(--radius-sm); border: 1px solid var(--line); background: #fff; }
        .mdp-qr-actions { display: flex; flex-direction: column; gap: 8px; }

        /* ---------- Segment (güvenlik modu / ilan durumu) ---------- */
        .mdp-segment { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
        .mdp-segment button {
          flex: 1 1 auto; min-width: 90px; padding: 9px 10px;
          background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm);
          font-size: 13px; font-weight: 600; color: var(--ink-soft);
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .mdp-segment button:hover:not(:disabled) { border-color: var(--ink-soft); }
        .mdp-segment button.active { border-color: var(--red); background: var(--red-soft); color: #c0283a; font-weight: 700; }
        .mdp-segment button.active.sale { border-color: var(--amber); background: #fdf4e5; color: #a8720f; }
        .mdp-segment button.active.rent { border-color: var(--blue); background: var(--blue-soft); color: var(--blue); }
        .mdp-segment.sm { margin: 10px 0 0; }
        .mdp-segment.sm button { min-width: 0; padding: 6px 8px; font-size: 12px; }
        .mdp-radius { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
        .mdp-radius input {
          width: 88px; padding: 7px 9px; font: inherit;
          border: 1px solid var(--line); border-radius: 8px; background: var(--surface);
        }

        /* ---------- Kapılar ---------- */
        .mdp-door {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 9px 12px; margin-bottom: 8px;
          background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm);
        }
        .mdp-door-name { font-weight: 700; font-size: 13.5px; }
        .mdp-door-id { font-size: 12px; color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

        /* ---------- Daireler grid ---------- */
        .mdp-flats {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px;
        }
        .mdp-flat {
          display: flex; flex-direction: column; gap: 8px;
          padding: 12px; background: var(--surface);
          border: 1px solid var(--line); border-radius: var(--radius-sm);
        }
        .mdp-flat.occupied { border-color: #cfd8e8; background: #fdfefe; }
        .mdp-flat-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .mdp-flat-no { font-weight: 800; font-size: 14px; }
        .mdp-flat-empty { font-size: 13px; color: var(--muted); font-style: italic; }
        .mdp-flat-qr { display: flex; gap: 6px; flex-wrap: wrap; }
        .mdp-flat-residents { display: flex; flex-direction: column; gap: 6px; }
        .mdp-res {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 7px 9px; background: var(--surface-2); border-radius: 8px;
        }
        .mdp-res-info { display: flex; flex-direction: column; min-width: 0; }
        .mdp-res-name { font-weight: 700; font-size: 13px; }
        .mdp-res-phone { font-size: 12px; color: var(--muted); }
        .mdp-res-actions { display: flex; gap: 4px; flex-shrink: 0; }
        .mdp-flat-delete {
          background: none; border: none; padding: 4px 0;
          font-size: 12.5px; font-weight: 600; color: var(--red); text-align: left;
        }
        .mdp-flat-delete:hover:not(:disabled) { text-decoration: underline; }
        .mdp-flat-add {
          display: flex; align-items: center; justify-content: center; min-height: 90px;
          background: none; border: 2px dashed var(--line); border-radius: var(--radius-sm);
          font-size: 14px; font-weight: 700; color: var(--muted);
          transition: border-color 0.15s, color 0.15s;
        }
        .mdp-flat-add:hover { border-color: var(--red); color: var(--red); }

        /* ---------- Chipler ---------- */
        .mdp-chip {
          display: inline-flex; align-items: center; padding: 2px 8px;
          font-size: 11.5px; font-weight: 700; border-radius: 20px; white-space: nowrap;
        }
        .mdp-chip.sale { background: #fdf4e5; color: #a8720f; }
        .mdp-chip.rent { background: var(--blue-soft); color: var(--blue); }
        .mdp-chip.pending { background: #fdf4e5; color: #a8720f; }

        /* ---------- Güvenlik ekleme formu ---------- */
        .mdp-guard-add { display: flex; gap: 8px; flex-wrap: wrap; }
        .mdp-guard-add .mdp-input { flex: 1 1 200px; margin-bottom: 0; }
        .mdp-guard-add + .mdp-empty, .mdp-guard-add + .mdp-list { margin-top: 16px; }

        /* ---------- Abonelik ---------- */
        .mdp-subs { display: flex; flex-direction: column; gap: 12px; }
        .mdp-panelcard.sub { background: var(--surface); box-shadow: var(--shadow); }
        .mdp-sub-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
        .mdp-sub-title { font-weight: 800; font-size: 15.5px; }
        .mdp-sub-details { margin: 0 0 14px; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 8px; }
        .mdp-sub-details div { display: flex; flex-direction: column; }
        .mdp-sub-details dt { font-size: 12px; color: var(--muted); font-weight: 600; }
        .mdp-sub-details dd { margin: 0; font-size: 14px; }

        /* ---------- Mobil ---------- */
        @media (max-width: 640px) {
          .mdp-stats { grid-template-columns: repeat(2, 1fr); }
          .mdp-row { flex-wrap: wrap; }
          .mdp-row-actions { width: 100%; justify-content: flex-end; }
          .mdp-flats { grid-template-columns: 1fr; }
          .mdp-header-inner { padding: 10px 14px; }
          .mdp-main { padding: 16px 14px 48px; }
          .mdp-logo-text { font-size: 17px; }
        }
      `}</style>
    </div>
  );
}