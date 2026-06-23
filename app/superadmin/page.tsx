"use client";

import { useState, useEffect, useMemo } from "react";

const API = "/api";
// DEMO_MODE=true: örnek verilerle çalışır (anında demo).
// Gerçek backend hazır olunca false yapın; aşağıdaki /api/superadmin/* uçları kullanılır.
const DEMO_MODE = true;
const DEMO_PASS = "123456"; // demo girişi — backend bağlanınca gerçek doğrulamayla değiştirilecek

type PlanId = "baslangic" | "profesyonel" | "kurumsal";
type Status = "active" | "trial" | "cancelled";
type Customer = {
  id: string; name: string; city: string; plan: PlanId; status: Status;
  buildings: number; flats: number; residents: number; calls: number; mrr: number;
  since: string; lastPayment: string;
};

const PLAN_LABEL: Record<PlanId, string> = { baslangic: "Başlangıç", profesyonel: "Profesyonel", kurumsal: "Kurumsal" };
const STATUS_LABEL: Record<Status, string> = { active: "Aktif", trial: "Denemede", cancelled: "İptal" };
const fmt = (n: number) => "₺" + n.toLocaleString("tr-TR");
const fmtK = (n: number) => "₺" + (n / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + "K";

// ---- ÖRNEK VERİ ----
const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Yıldız Sitesi A Blok", city: "İstanbul", plan: "profesyonel", status: "active", buildings: 4, flats: 96, residents: 211, calls: 842, mrr: 1299, since: "2025-09-12", lastPayment: "2026-06-01" },
  { id: "c2", name: "Marmara Konutları", city: "İstanbul", plan: "kurumsal", status: "active", buildings: 12, flats: 480, residents: 1120, calls: 3960, mrr: 5800, since: "2025-07-03", lastPayment: "2026-06-01" },
  { id: "c3", name: "Çamlık Apartmanı", city: "Ankara", plan: "baslangic", status: "active", buildings: 1, flats: 24, residents: 51, calls: 188, mrr: 499, since: "2026-01-20", lastPayment: "2026-06-02" },
  { id: "c4", name: "Defne Residence", city: "İzmir", plan: "profesyonel", status: "trial", buildings: 2, flats: 64, residents: 88, calls: 96, mrr: 0, since: "2026-06-14", lastPayment: "—" },
  { id: "c5", name: "Park Vadi Evleri", city: "Bursa", plan: "kurumsal", status: "active", buildings: 8, flats: 320, residents: 760, calls: 2640, mrr: 4200, since: "2025-08-19", lastPayment: "2026-06-01" },
  { id: "c6", name: "Gümüş Sitesi", city: "Antalya", plan: "profesyonel", status: "active", buildings: 3, flats: 72, residents: 165, calls: 610, mrr: 1299, since: "2025-11-05", lastPayment: "2026-06-03" },
  { id: "c7", name: "Bahar Apartmanı", city: "Eskişehir", plan: "baslangic", status: "cancelled", buildings: 1, flats: 18, residents: 22, calls: 41, mrr: 0, since: "2025-10-11", lastPayment: "2026-03-11" },
  { id: "c8", name: "Lale Konakları", city: "İstanbul", plan: "profesyonel", status: "active", buildings: 5, flats: 110, residents: 248, calls: 980, mrr: 1299, since: "2025-12-01", lastPayment: "2026-06-01" },
  { id: "c9", name: "Deniz Manzara Sitesi", city: "İzmir", plan: "kurumsal", status: "active", buildings: 9, flats: 360, residents: 845, calls: 3120, mrr: 4800, since: "2025-06-22", lastPayment: "2026-06-01" },
  { id: "c10", name: "Mavi Göl Evleri", city: "Sakarya", plan: "baslangic", status: "trial", buildings: 1, flats: 28, residents: 19, calls: 14, mrr: 0, since: "2026-06-18", lastPayment: "—" },
  { id: "c11", name: "Akasya Sitesi", city: "Kocaeli", plan: "profesyonel", status: "active", buildings: 4, flats: 88, residents: 190, calls: 720, mrr: 1299, since: "2025-09-30", lastPayment: "2026-06-02" },
  { id: "c12", name: "Zümrüt Apartmanı", city: "Konya", plan: "baslangic", status: "active", buildings: 1, flats: 22, residents: 47, calls: 156, mrr: 499, since: "2026-02-14", lastPayment: "2026-06-01" },
  { id: "c13", name: "Panorama Towers", city: "İstanbul", plan: "kurumsal", status: "active", buildings: 6, flats: 540, residents: 1290, calls: 4510, mrr: 7200, since: "2025-05-08", lastPayment: "2026-06-01" },
  { id: "c14", name: "Güneş Sitesi", city: "Antalya", plan: "profesyonel", status: "cancelled", buildings: 2, flats: 56, residents: 70, calls: 88, mrr: 0, since: "2025-11-22", lastPayment: "2026-04-22" },
  { id: "c15", name: "Ihlamur Konutları", city: "Bursa", plan: "profesyonel", status: "active", buildings: 3, flats: 78, residents: 176, calls: 640, mrr: 1299, since: "2026-01-09", lastPayment: "2026-06-01" },
  { id: "c16", name: "Çınar Apartmanı", city: "Ankara", plan: "baslangic", status: "active", buildings: 1, flats: 26, residents: 58, calls: 201, mrr: 499, since: "2025-12-19", lastPayment: "2026-06-02" },
  { id: "c17", name: "Asya Vadisi", city: "İstanbul", plan: "kurumsal", status: "trial", buildings: 7, flats: 280, residents: 410, calls: 320, mrr: 0, since: "2026-06-10", lastPayment: "—" },
  { id: "c18", name: "Pınar Sitesi", city: "Mersin", plan: "profesyonel", status: "active", buildings: 2, flats: 60, residents: 138, calls: 502, mrr: 1299, since: "2026-03-02", lastPayment: "2026-06-01" },
];

const MONTHS = ["Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara", "Oca", "Şub", "Mar", "Nis", "May", "Haz"];
const REVENUE = [9.6, 14.4, 21.2, 26.4, 31.1, 35.8, 38.9, 41.2, 43.0, 44.3, 45.6, 47.6]; // bin ₺ (MRR)
const SIGNUPS = [3, 2, 3, 2, 3, 2, 4, 1, 3, 0, 0, 4];

// ---- SVG GRAFİKLER ----
function AreaChart({ data }: { data: number[] }) {
  const W = 560, H = 200, pad = 28;
  const max = Math.max(...data) * 1.12;
  const stepX = (W - pad * 2) / (data.length - 1);
  const pts = data.map((v, i) => [pad + i * stepX, H - pad - (v / max) * (H - pad * 2)] as [number, number]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${pts[pts.length - 1][0].toFixed(1)} ${H - pad} L ${pad} ${H - pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sa-svg" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sa-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(230,57,70,.22)" />
          <stop offset="100%" stopColor="rgba(230,57,70,0)" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="#eef1f6" strokeWidth="1" />
      ))}
      <path d={area} fill="url(#sa-grad)" />
      <path d={line} fill="none" stroke="#e63946" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#fff" stroke="#e63946" strokeWidth="2" />)}
    </svg>
  );
}

function BarChart({ data }: { data: number[] }) {
  const W = 560, H = 200, pad = 28;
  const max = Math.max(...data, 1) * 1.2;
  const bw = (W - pad * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sa-svg" preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * (H - pad * 2);
        return <rect key={i} x={pad + i * bw + bw * 0.22} y={H - pad - h} width={bw * 0.56} height={h} rx="4" fill="#1b2a4a" opacity={0.55 + (v / max) * 0.45} />;
      })}
    </svg>
  );
}

function Donut({ segs }: { segs: { label: string; value: number; color: string }[] }) {
  const total = segs.reduce((s, x) => s + x.value, 0) || 1;
  const R = 56, C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="sa-donut-wrap">
      <svg viewBox="0 0 140 140" className="sa-donut">
        <g transform="rotate(-90 70 70)">
          {segs.map((s, i) => {
            const len = (s.value / total) * C;
            const el = <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />;
            offset += len;
            return el;
          })}
        </g>
        <text x="70" y="66" textAnchor="middle" className="sa-donut-num">{total}</text>
        <text x="70" y="84" textAnchor="middle" className="sa-donut-lbl">müşteri</text>
      </svg>
      <div className="sa-legend">
        {segs.map((s) => (
          <div className="sa-legend-row" key={s.label}>
            <span className="sa-dot" style={{ background: s.color }} />
            <span className="sa-legend-name">{s.label}</span>
            <span className="sa-legend-val">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SuperAdmin() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"overview" | "customers">("overview");

  const [data, setData] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sortKey, setSortKey] = useState<"mrr" | "calls" | "flats">("mrr");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("md_super_ok") === "1") setAuthed(true);
  }, []);
  useEffect(() => { if (authed) loadData(); }, [authed]);

  async function login() {
    setError(""); setLoading(true);
    try {
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 500));
        if (pass !== DEMO_PASS) throw new Error("Şifre hatalı.");
      } else {
        const res = await fetch(`${API}/superadmin/login`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pass }),
        });
        const d = await res.json();
        if (!res.ok || !d.token) throw new Error(d.message || "Giriş başarısız");
        sessionStorage.setItem("md_super_token", d.token);
      }
      sessionStorage.setItem("md_super_ok", "1");
      setAuthed(true);
    } catch (e: any) { setError(e.message || "Giriş başarısız"); }
    finally { setLoading(false); }
  }

  async function loadData() {
    if (DEMO_MODE) { setData(CUSTOMERS); return; }
    try {
      const tk = sessionStorage.getItem("md_super_token");
      const res = await fetch(`${API}/superadmin/customers`, { headers: { Authorization: `Bearer ${tk}` } });
      const d = await res.json();
      setData(d.customers || []);
    } catch { setData([]); }
  }

  function logout() {
    setAuthed(false); setPass("");
    sessionStorage.removeItem("md_super_ok");
    sessionStorage.removeItem("md_super_token");
  }

  // ---- TÜRETİLEN METRİKLER ----
  const k = useMemo(() => {
    const active = data.filter((c) => c.status === "active");
    return {
      total: data.length,
      active: active.length,
      trial: data.filter((c) => c.status === "trial").length,
      cancelled: data.filter((c) => c.status === "cancelled").length,
      mrr: active.reduce((s, c) => s + c.mrr, 0),
      buildings: data.reduce((s, c) => s + c.buildings, 0),
      flats: data.reduce((s, c) => s + c.flats, 0),
      residents: data.reduce((s, c) => s + c.residents, 0),
      calls: data.reduce((s, c) => s + c.calls, 0),
    };
  }, [data]);

  const planSegs = useMemo(() => {
    const by = (p: PlanId) => data.filter((c) => c.plan === p).length;
    return [
      { label: "Profesyonel", value: by("profesyonel"), color: "#e63946" },
      { label: "Kurumsal", value: by("kurumsal"), color: "#1b2a4a" },
      { label: "Başlangıç", value: by("baslangic"), color: "#7c8aa5" },
    ];
  }, [data]);

  const topUsage = useMemo(() => [...data].sort((a, b) => b.calls - a.calls).slice(0, 5), [data]);
  const maxCalls = topUsage[0]?.calls || 1;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data
      .filter((c) => (statusFilter === "all" ? true : c.status === statusFilter))
      .filter((c) => (!q ? true : c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)))
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [data, search, statusFilter, sortKey]);

  // ---- GİRİŞ EKRANI ----
  if (!authed) {
    return (
      <main className="sa-login-root">
        <div className="sa-login-card">
          <div className="sa-brand">Mobil<b>Diafon</b><span className="sa-brand-tag">Süper Admin</span></div>
          <h1>Yönetim Girişi</h1>
          <p className="sa-login-desc">Bu panel yalnızca platform yöneticileri içindir.</p>
          <input className="sa-input" type="password" placeholder="Şifre" value={pass}
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          {error && <div className="sa-error">{error}</div>}
          <button className="sa-btn primary full" onClick={login} disabled={loading}>{loading ? "Kontrol ediliyor..." : "Giriş Yap"}</button>
          {DEMO_MODE && <div className="sa-demo-hint">Demo şifresi: <code>{DEMO_PASS}</code></div>}
        </div>
        <style jsx global>{SA_CSS}</style>
      </main>
    );
  }

  // ---- PANEL ----
  return (
    <main className="sa-root">
      <header className="sa-topbar">
        <div className="sa-brand">Mobil<b>Diafon</b><span className="sa-brand-tag">Süper Admin</span></div>
        <button className="sa-logout" onClick={logout}>Çıkış</button>
      </header>

      <div className="sa-tabs">
        <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Genel Bakış</button>
        <button className={tab === "customers" ? "active" : ""} onClick={() => setTab("customers")}>Müşteriler <span className="sa-tab-count">{data.length}</span></button>
      </div>

      {tab === "overview" && (
        <>
          {/* KPI */}
          <section className="sa-kpis">
            <Kpi label="Toplam Müşteri" value={String(k.total)} />
            <Kpi label="Aktif Abonelik" value={String(k.active)} accent="green" />
            <Kpi label="Denemede" value={String(k.trial)} accent="amber" />
            <Kpi label="Aylık Gelir (MRR)" value={fmt(k.mrr)} accent="red" />
            <Kpi label="Toplam Bina" value={String(k.buildings)} />
            <Kpi label="Bu Ay Çağrı" value={k.calls.toLocaleString("tr-TR")} />
          </section>

          {/* GRAFİKLER */}
          <section className="sa-charts">
            <div className="sa-card sa-span2">
              <div className="sa-card-head">
                <div><div className="sa-card-title">Aylık Gelir (MRR)</div><div className="sa-card-sub">Son 12 ay · bin ₺</div></div>
                <div className="sa-card-big">{fmtK(REVENUE[REVENUE.length - 1] * 1000)}</div>
              </div>
              <AreaChart data={REVENUE} />
              <div className="sa-axis">{MONTHS.map((m) => <span key={m}>{m}</span>)}</div>
            </div>

            <div className="sa-card">
              <div className="sa-card-head"><div><div className="sa-card-title">Plan Dağılımı</div><div className="sa-card-sub">Aktif + deneme</div></div></div>
              <Donut segs={planSegs} />
            </div>

            <div className="sa-card sa-span2">
              <div className="sa-card-head"><div><div className="sa-card-title">Yeni Müşteriler</div><div className="sa-card-sub">Aylık kayıt sayısı</div></div></div>
              <BarChart data={SIGNUPS} />
              <div className="sa-axis">{MONTHS.map((m) => <span key={m}>{m}</span>)}</div>
            </div>

            <div className="sa-card">
              <div className="sa-card-head"><div><div className="sa-card-title">En Çok Kullanan</div><div className="sa-card-sub">Bu ayki çağrı</div></div></div>
              <div className="sa-usage">
                {topUsage.map((c) => (
                  <div className="sa-usage-row" key={c.id}>
                    <div className="sa-usage-info">
                      <span className="sa-usage-name">{c.name}</span>
                      <span className="sa-usage-val">{c.calls.toLocaleString("tr-TR")}</span>
                    </div>
                    <div className="sa-usage-bar"><span style={{ width: `${(c.calls / maxCalls) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "customers" && (
        <section className="sa-customers">
          <div className="sa-toolbar">
            <input className="sa-input search" placeholder="Müşteri veya şehir ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="sa-filters">
              {(["all", "active", "trial", "cancelled"] as const).map((s) => (
                <button key={s} className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
                  {s === "all" ? "Tümü" : STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <select className="sa-sort" value={sortKey} onChange={(e) => setSortKey(e.target.value as any)}>
              <option value="mrr">Gelire göre</option>
              <option value="calls">Kullanıma göre</option>
              <option value="flats">Daireye göre</option>
            </select>
          </div>

          <div className="sa-table-scroll">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Müşteri</th><th>Plan</th><th>Durum</th>
                  <th className="num">Bina</th><th className="num">Daire</th><th className="num">Sakin</th>
                  <th className="num">Çağrı (ay)</th><th className="num">MRR</th><th>Üyelik</th><th>Son Ödeme</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td><div className="sa-cust-name">{c.name}</div><div className="sa-cust-city">{c.city}</div></td>
                    <td><span className={`sa-plan ${c.plan}`}>{PLAN_LABEL[c.plan]}</span></td>
                    <td><span className={`sa-status ${c.status}`}>{STATUS_LABEL[c.status]}</span></td>
                    <td className="num">{c.buildings}</td>
                    <td className="num">{c.flats}</td>
                    <td className="num">{c.residents}</td>
                    <td className="num">{c.calls.toLocaleString("tr-TR")}</td>
                    <td className="num strong">{c.mrr ? fmt(c.mrr) : "—"}</td>
                    <td className="muted">{new Date(c.since).toLocaleDateString("tr-TR")}</td>
                    <td className="muted">{c.lastPayment === "—" ? "—" : new Date(c.lastPayment).toLocaleDateString("tr-TR")}</td>
                  </tr>
                ))}
                {rows.length === 0 && <tr><td colSpan={10} className="sa-empty">Sonuç bulunamadı.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <style jsx global>{SA_CSS}</style>
    </main>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: "red" | "green" | "amber" }) {
  return (
    <div className={`sa-kpi ${accent || ""}`}>
      <div className="sa-kpi-val">{value}</div>
      <div className="sa-kpi-lbl">{label}</div>
    </div>
  );
}

const SA_CSS = `
:root { --navy:#1b2a4a; --navy-deep:#14213d; --red:#e63946; --gray:#5a6478; --line:#e6e9f0; --soft:#f7f9fc; --ink:#1a1a2e; }
* { box-sizing: border-box; }
body { margin:0; font-family: Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; background:#eef2f8; color:var(--ink); -webkit-font-smoothing:antialiased; }
.sa-brand { font-size:21px; font-weight:800; letter-spacing:-.03em; color:var(--navy); display:flex; align-items:center; gap:8px; }
.sa-brand b { color:var(--red); }
.sa-brand-tag { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--navy); background:var(--soft); border:1px solid var(--line); padding:4px 10px; border-radius:20px; }

/* LOGIN */
.sa-login-root { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:linear-gradient(160deg,#f7f9fc,#e6ebf3); }
.sa-login-card { width:100%; max-width:400px; background:#fff; border:1px solid var(--line); border-radius:18px; box-shadow:0 30px 70px -34px rgba(27,42,74,.4); padding:38px; }
.sa-login-card h1 { font-size:24px; color:var(--navy-deep); margin:24px 0 6px; }
.sa-login-desc { color:var(--gray); font-size:14.5px; margin:0 0 22px; }
.sa-input { width:100%; padding:14px 16px; border:1px solid var(--line); border-radius:12px; font-size:15px; outline:none; transition:border-color .2s; font-family:inherit; }
.sa-input:focus { border-color:var(--navy); }
.sa-error { background:#fdecee; color:#c0283a; padding:12px 14px; border-radius:10px; font-size:14px; margin:14px 0 0; font-weight:600; }
.sa-demo-hint { margin-top:16px; text-align:center; color:var(--gray); font-size:13px; }
.sa-demo-hint code { background:var(--soft); padding:3px 8px; border-radius:6px; color:var(--navy); }
.sa-btn { display:inline-flex; align-items:center; justify-content:center; border-radius:11px; font-weight:700; font-size:15px; cursor:pointer; border:1px solid transparent; padding:13px 22px; font-family:inherit; transition:all .2s; }
.sa-btn.full { width:100%; margin-top:18px; }
.sa-btn.primary { background:var(--red); color:#fff; }
.sa-btn.primary:hover:not(:disabled) { background:#cc2f3c; }
.sa-btn.primary:disabled { opacity:.6; cursor:not-allowed; }

/* PANEL */
.sa-root { max-width:1240px; margin:0 auto; padding:0 24px 64px; }
.sa-topbar { display:flex; align-items:center; justify-content:space-between; height:72px; }
.sa-logout { background:#fff; border:1px solid var(--line); color:var(--gray); padding:9px 18px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; }
.sa-logout:hover { border-color:var(--red); color:var(--red); }
.sa-tabs { display:flex; gap:6px; border-bottom:1px solid #dde3ee; margin-bottom:24px; }
.sa-tabs button { background:none; border:none; padding:13px 18px; font-size:15px; font-weight:600; color:var(--gray); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; display:flex; align-items:center; gap:8px; font-family:inherit; }
.sa-tabs button.active { color:var(--navy-deep); border-bottom-color:var(--red); }
.sa-tab-count { background:var(--navy); color:#fff; font-size:12px; font-weight:700; padding:1px 8px; border-radius:10px; }

/* KPI */
.sa-kpis { display:grid; grid-template-columns:repeat(6,1fr); gap:14px; margin-bottom:18px; }
.sa-kpi { background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px; }
.sa-kpi-val { font-size:26px; font-weight:800; color:var(--navy-deep); letter-spacing:-.02em; line-height:1; }
.sa-kpi-lbl { font-size:12.5px; color:var(--gray); margin-top:8px; }
.sa-kpi.red .sa-kpi-val { color:var(--red); }
.sa-kpi.green .sa-kpi-val { color:#1c9b5e; }
.sa-kpi.amber .sa-kpi-val { color:#c98a12; }

/* CHARTS */
.sa-charts { display:grid; grid-template-columns:2fr 1fr; gap:16px; }
.sa-card { background:#fff; border:1px solid var(--line); border-radius:16px; padding:22px; }
.sa-span2 { grid-column:span 1; }
.sa-charts > .sa-span2:nth-of-type(1) { grid-column:1; }
.sa-card-head { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; }
.sa-card-title { font-size:16px; font-weight:700; color:var(--navy-deep); }
.sa-card-sub { font-size:12.5px; color:var(--gray); margin-top:3px; }
.sa-card-big { font-size:22px; font-weight:800; color:var(--navy-deep); }
.sa-svg { width:100%; height:200px; display:block; }
.sa-axis { display:flex; justify-content:space-between; padding:8px 24px 0; }
.sa-axis span { font-size:11px; color:var(--gray); }

/* DONUT */
.sa-donut-wrap { display:flex; align-items:center; gap:18px; padding-top:6px; }
.sa-donut { width:140px; height:140px; flex-shrink:0; }
.sa-donut-num { font-size:26px; font-weight:800; fill:var(--navy-deep); }
.sa-donut-lbl { font-size:11px; fill:var(--gray); }
.sa-legend { flex:1; display:flex; flex-direction:column; gap:10px; }
.sa-legend-row { display:flex; align-items:center; gap:9px; }
.sa-dot { width:11px; height:11px; border-radius:3px; flex-shrink:0; }
.sa-legend-name { flex:1; font-size:14px; color:var(--ink); }
.sa-legend-val { font-weight:700; color:var(--navy-deep); font-size:14px; }

/* USAGE */
.sa-usage { display:flex; flex-direction:column; gap:14px; padding-top:4px; }
.sa-usage-info { display:flex; justify-content:space-between; margin-bottom:6px; }
.sa-usage-name { font-size:13.5px; color:var(--ink); font-weight:600; }
.sa-usage-val { font-size:13px; color:var(--gray); font-weight:700; }
.sa-usage-bar { height:7px; background:var(--soft); border-radius:6px; overflow:hidden; }
.sa-usage-bar span { display:block; height:100%; background:var(--red); border-radius:6px; }

/* CUSTOMERS */
.sa-toolbar { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
.sa-input.search { flex:1; min-width:220px; }
.sa-filters { display:flex; gap:6px; background:#fff; border:1px solid var(--line); border-radius:11px; padding:4px; }
.sa-filters button { background:none; border:none; padding:9px 14px; font-size:13.5px; font-weight:600; color:var(--gray); border-radius:8px; cursor:pointer; font-family:inherit; }
.sa-filters button.active { background:var(--navy); color:#fff; }
.sa-sort { border:1px solid var(--line); border-radius:11px; padding:0 14px; font-size:14px; font-weight:600; color:var(--navy); background:#fff; font-family:inherit; cursor:pointer; }

.sa-table-scroll { background:#fff; border:1px solid var(--line); border-radius:16px; overflow-x:auto; }
.sa-table { width:100%; border-collapse:collapse; min-width:880px; }
.sa-table th { text-align:left; font-size:12px; font-weight:700; color:var(--gray); text-transform:uppercase; letter-spacing:.04em; padding:14px 16px; border-bottom:1px solid var(--line); white-space:nowrap; }
.sa-table th.num, .sa-table td.num { text-align:right; }
.sa-table td { padding:14px 16px; border-bottom:1px solid #f0f2f7; font-size:14px; white-space:nowrap; }
.sa-table tr:last-child td { border-bottom:none; }
.sa-cust-name { font-weight:700; color:var(--navy-deep); }
.sa-cust-city { font-size:12.5px; color:var(--gray); margin-top:2px; }
.sa-table td.strong { font-weight:700; color:var(--navy-deep); }
.sa-table td.muted { color:var(--gray); font-size:13px; }
.sa-plan { font-size:12px; font-weight:700; padding:4px 10px; border-radius:20px; }
.sa-plan.profesyonel { background:#fdeef0; color:#c0283a; }
.sa-plan.kurumsal { background:#e9edf5; color:var(--navy); }
.sa-plan.baslangic { background:#eef1f6; color:#5a6478; }
.sa-status { font-size:12px; font-weight:700; padding:4px 10px; border-radius:20px; }
.sa-status.active { background:#e6f6ed; color:#1c9b5e; }
.sa-status.trial { background:#fff4d9; color:#b8860b; }
.sa-status.cancelled { background:#f1f3f7; color:#8a93a5; }
.sa-empty { text-align:center; color:var(--gray); padding:40px; }

@media (max-width:1080px) {
  .sa-kpis { grid-template-columns:repeat(3,1fr); }
  .sa-charts { grid-template-columns:1fr; }
}
@media (max-width:560px) {
  .sa-kpis { grid-template-columns:repeat(2,1fr); }
  .sa-donut-wrap { flex-direction:column; }
}
`;