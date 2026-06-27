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
                  <button className={tab === "subscription" ? "active" : ""} onClick={() => setTab("subscription")}>Abonelik</button>
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
                      <div className="adm-qr" style={{ gridColumn: "1 / -1", padding: "16px", background: "#fff", border: "1px solid #eee", borderRadius: "10px", marginBottom: "10px" }}>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>📱 QR Kod</div>
                              <div style={{ fontSize: "13px", color: "#666", marginBottom: 12 }}>
                                Ziyaretçiler bu QR'ı okutarak {buildingLabel(b)} binasina ulasir. Bina girisine asin.
                              </div>
                              {b.qrToken ? (
                                <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent("https://mobildiafon.com/web/ara.html?token=" + b.qrToken)}`}
                                    alt="QR"
                                    width={140} height={140}
                                    style={{ borderRadius: "8px", border: "1px solid #eee", background: "#fff" }}
                                  />
                                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    
                                      <a
                                      href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=20&data=${encodeURIComponent("https://mobildiafon.com/web/ara.html?token=" + b.qrToken)}`}
                                      download={`qr-${b.qrToken}.png`}
                                      target="_blank" rel="noopener noreferrer"
                                      style={{ padding: "9px 16px", background: "#e63946", color: "#fff", borderRadius: "8px", fontWeight: 600, fontSize: "14px", textDecoration: "none", textAlign: "center" }}
                                    >
                                      PNG Indir
                                    </a>
                                    <button
                                      onClick={() => printQrPoster(b)}
                                      style={{ padding: "9px 16px", background: "#1a2a4a", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
                                    >
                                      Afis Yazdir (PDF)
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div style={{ fontSize: "13px", color: "#999" }}>QR token bulunamadi.</div>
                              )}
                            </div>
                      <div className="adm-loccheck" style={{ gridColumn: "1 / -1", padding: "12px", background: "#f7f7f9", borderRadius: "10px", marginBottom: "10px" }}>
                              <div style={{ fontWeight: 600, marginBottom: 8 }}>🔒 Güvenlik Modu</div>
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: 8 }}>
                                {[
                                  { key: "qr", label: "Sadece QR", desc: "Listede gizli, QR ile aranır" },
                                  { key: "location", label: "Sadece Konum", desc: "Yakındakiler listesinde görünür" },
                                  { key: "both", label: "QR + Konum", desc: "Listede görünür, aramak için QR gerekir" },
                                ].map((m) => {
                                  const active = (b.securityMode || "qr") === m.key;
                                  return (
                                    <button key={m.key}
                                      onClick={() => setSecurityMode(b.id, m.key, b.locationCheckRadius)}
                                      disabled={loading}
                                      style={{
                                        flex: "1 1 30%", minWidth: 100, padding: "10px", borderRadius: "8px", cursor: "pointer",
                                        border: active ? "2px solid #e63946" : "1px solid #ccc",
                                        background: active ? "#fdeef0" : "#fff",
                                        fontWeight: active ? 700 : 500, color: active ? "#c0283a" : "#333",
                                      }}>
                                      {m.label}
                                    </button>
                                  );
                                })}
                              </div>
                              <div style={{ fontSize: "13px", color: "#666", marginBottom: 10 }}>
                                {(b.securityMode || "qr") === "qr" && "Bina yakındakiler listesinde görünmez. Ziyaretçi sadece QR okutarak arar."}
                                {(b.securityMode || "qr") === "location" && "Bina yakındakiler listesinde görünür. Ziyaretçi yakındaysa QR'sız arayabilir."}
                                {(b.securityMode || "qr") === "both" && "Bina listede görünür ama aramak için QR okutmak gerekir (en güvenli)."}
                              </div>
                              {((b.securityMode || "qr") === "location" || (b.securityMode || "qr") === "both") && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span style={{ fontSize: "13px" }}>Görünme mesafesi:</span>
                                  <input type="number" min={20} max={2000} step={10} defaultValue={b.locationCheckRadius}
                                    style={{ width: "90px", padding: "6px", borderRadius: "6px", border: "1px solid #ccc" }}
                                    onBlur={(e) => { const v = Number(e.target.value); if (v >= 20 && v <= 2000 && v !== b.locationCheckRadius) setSecurityMode(b.id, b.securityMode || "qr", v); }}
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
                                {f.qrToken && (
                                  <div className="adm-flat-qr">
                                    <button className="adm-flat-qr-btn" onClick={() => printFlatQr(b, f)} title="Daire QR afişi yazdır">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v6h-6v-2h4v-4Z"/></svg>
                                      QR Afiş
                                    </button>
                                    <button className="adm-flat-qr-btn ghost" onClick={() => editFlatQrLabel(f)} title="QR altı metni düzenle">
                                      {f.qrLabel ? `"${f.qrLabel}"` : "Etiket ekle"}
                                    </button>
                                  </div>
                                )}
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
                                          {r.approved && <button className="adm-mini-qr" onClick={() => printPersonQr(b, f, r)} disabled={loading} title="Kişiye özel QR afişi">QR</button>}
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
                              <button className="adm-mini-qr" onClick={() => printGuardQr(g)} disabled={loading} title="Güvenlik QR afişi">QR</button>
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

                {/* ABONELİK */}
                {tab === "subscription" && (
                  <div className="adm-subscription">
                    <p className="adm-muted" style={{ marginBottom: 16 }}>Site ve birimlerinizin abonelik durumu. Deneme süreniz bitince ödeme ile devam edebilirsiniz.</p>
                    {subs.length === 0 ? (
                      <div className="adm-empty"><p>Abonelik bilgisi yok.</p></div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {subs.map((s) => {
                          const st = subStatusLabel(s);
                          return (
                            <div key={s.id} style={{ border: "1px solid #eee", borderRadius: "12px", padding: "16px", background: "#fff" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: "16px" }}>{s.label}</div>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: st.color, background: st.color + "18", padding: "4px 10px", borderRadius: "20px" }}>{st.text}</span>
                              </div>
                              <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.7 }}>
                                <div>Tür: {s.scopeType === "site" ? "Site (toplu)" : "Bireysel birim"}</div>
                                <div>Daire sayısı: {s.flatCount}</div>
                                <div>Aylık tutar: <b>{s.monthlyPrice} ₺</b></div>
                                {s.periodEnd && <div>Bitiş: {new Date(s.periodEnd).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" })}</div>}
                              </div>
                              <button disabled style={{ marginTop: 12, padding: "10px 18px", background: "#1a8f3c", color: "#fff", border: "none", borderRadius: "8px", opacity: 0.6, cursor: "not-allowed", width: "100%" }}>
                                Ödeme ile Devam Et (yakında)
                              </button>
                            </div>
                          );
                        })}
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