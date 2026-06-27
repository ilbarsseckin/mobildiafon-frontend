"use client";

import { useState, useEffect, useMemo } from "react";

const API = "/api";

type Status = "active" | "trial" | "cancelled";
type Customer = {
  id: string; name: string; owner: string; phone: string; status: Status; isFree?: boolean;
  buildings: number; flats: number; residents: number; calls: number; mrr: number; since: string;
};
type Overview = {
  kpi: { total: number; active: number; trial: number; cancelled: number; mrr: number; buildings: number; flats: number; calls: number };
  months: string[]; signups: number[]; revenue: number[]; plans: { site: number; individual: number };
};

const STATUS_LABEL: Record<Status, string> = { active: "Aktif", trial: "Denemede", cancelled: "İptal" };
const fmt = (n: number) => "₺" + n.toLocaleString("tr-TR");
const fmtK = (n: number) => "₺" + (n / 1000).toLocaleString("tr-TR", { maximumFractionDigits: 1 }) + "K";

function AreaChart({ data }: { data: number[] }) {
  const W = 560, H = 200, pad = 28;
  const max = Math.max(...data, 0.1) * 1.12;
  const stepX = (W - pad * 2) / Math.max(1, data.length - 1);
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
        <text x="70" y="84" textAnchor="middle" className="sa-donut-lbl">abonelik</text>
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
  const [ov, setOv] = useState<Overview | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sortKey, setSortKey] = useState<"mrr" | "calls" | "flats">("mrr");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("md_super_token")) setAuthed(true);
  }, []);
  useEffect(() => { if (authed) { loadData(); loadOverview(); } }, [authed]);

  async function login() {
    setError(""); setLoading(true);
    try {
      const res = await fetch(`${API}/superadmin/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      const d = await res.json();
      if (!d.success || !d.token) throw new Error(d.message || "Giriş başarısız");
      sessionStorage.setItem("md_super_token", d.token);
      setAuthed(true);
    } catch (e: any) { setError(e.message || "Giriş başarısız"); }
    finally { setLoading(false); }
  }

  function authHeader() {
    const tk = sessionStorage.getItem("md_super_token");
    return { Authorization: `Bearer ${tk}` };
  }

  async function toggleFree(ownerId: string, makeFree: boolean) {
    if (!confirm(makeFree ? "Bu hesap sınırsız ÜCRETSİZ yapılsın mı?" : "Ücretsizlik kaldırılsın mı? (14 gün deneme olur)")) return;
    try {
      const res = await fetch(`${API}/superadmin/set-free`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, free: makeFree }),
      });
      const d = await res.json();
      if (d.success) { loadData(); }
      else alert(d.message || "İşlem başarısız");
    } catch { alert("Bağlantı hatası"); }
  }

  async function loadData() {
    try {
      const res = await fetch(`${API}/superadmin/customers`, { headers: authHeader() });
      if (res.status === 401) { logout(); return; }
      const d = await res.json();
      setData(d.customers || []);
    } catch { setData([]); }
  }

  async function loadOverview() {
    try {
      const res = await fetch(`${API}/superadmin/overview`, { headers: authHeader() });
      if (res.status === 401) { logout(); return; }
      const d = await res.json();
      setOv(d);
    } catch { setOv(null); }
  }

  function logout() {
    setAuthed(false); setPass("");
    sessionStorage.removeItem("md_super_token");
  }

  const planSegs = useMemo(() => {
    if (!ov) return [];
    return [
      { label: "Site (toplu)", value: ov.plans.site, color: "#e63946" },
      { label: "Bireysel", value: ov.plans.individual, color: "#1b2a4a" },
    ];
  }, [ov]);

  const topUsage = useMemo(() => [...data].sort((a, b) => b.calls - a.calls).slice(0, 5), [data]);
  const maxCalls = topUsage[0]?.calls || 1;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return data
      .filter((c) => (statusFilter === "all" ? true : c.status === statusFilter))
      .filter((c) => (!q ? true : c.name.toLowerCase().includes(q) || (c.owner || "").toLowerCase().includes(q)))
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [data, search, statusFilter, sortKey]);

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
        </div>
        <style jsx global>{SA_CSS}</style>
      </main>
    );
  }

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

      {tab === "overview" && ov && (
        <>
          <section className="sa-kpis">
            <Kpi label="Toplam Müşteri" value={String(ov.kpi.total)} />
            <Kpi label="Aktif Abonelik" value={String(ov.kpi.active)} accent="green" />
            <Kpi label="Denemede" value={String(ov.kpi.trial)} accent="amber" />
            <Kpi label="Aylık Gelir (MRR)" value={fmt(ov.kpi.mrr)} accent="red" />
            <Kpi label="Toplam Bina" value={String(ov.kpi.buildings)} />
            <Kpi label="Toplam Daire" value={ov.kpi.flats.toLocaleString("tr-TR")} />
          </section>

          <section className="sa-charts">
            <div className="sa-card sa-span2">
              <div className="sa-card-head">
                <div><div className="sa-card-title">Aylık Gelir (MRR)</div><div className="sa-card-sub">Son 12 ay · bin ₺</div></div>
                <div className="sa-card-big">{fmtK(ov.kpi.mrr)}</div>
              </div>
              <AreaChart data={ov.revenue} />
              <div className="sa-axis">{ov.months.map((m, i) => <span key={i}>{m}</span>)}</div>
            </div>

            <div className="sa-card">
              <div className="sa-card-head"><div><div className="sa-card-title">Abonelik Türü</div><div className="sa-card-sub">Site / bireysel</div></div></div>
              <Donut segs={planSegs} />
            </div>

            <div className="sa-card sa-span2">
              <div className="sa-card-head"><div><div className="sa-card-title">Yeni Müşteriler</div><div className="sa-card-sub">Aylık kayıt sayısı</div></div></div>
              <BarChart data={ov.signups} />
              <div className="sa-axis">{ov.months.map((m, i) => <span key={i}>{m}</span>)}</div>
            </div>

            <div className="sa-card">
              <div className="sa-card-head"><div><div className="sa-card-title">En Çok Kullanan</div><div className="sa-card-sub">Çağrı sayısı</div></div></div>
              <div className="sa-usage">
                {topUsage.length === 0 && <div className="sa-empty" style={{ padding: 20 }}>Henüz veri yok</div>}
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
            <input className="sa-input search" placeholder="Müşteri veya sahip ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                  <th>Müşteri</th><th>Sahip</th><th>Durum</th>
                  <th className="num">Bina</th><th className="num">Daire</th><th className="num">Sakin</th>
                  <th className="num">Çağrı</th><th className="num">MRR</th><th>Üyelik</th><th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td><div className="sa-cust-name">{c.name}</div><div className="sa-cust-city">{c.phone}</div></td>
                    <td>{c.owner}</td>
                    <td><span className={`sa-status ${c.status}`}>{STATUS_LABEL[c.status]}</span></td>
                    <td className="num">{c.buildings}</td>
                    <td className="num">{c.flats}</td>
                    <td className="num">{c.residents}</td>
                    <td className="num">{c.calls.toLocaleString("tr-TR")}</td>
                    <td className="num strong">{c.mrr ? fmt(c.mrr) : "—"}</td>
                    <td className="muted">{new Date(c.since).toLocaleDateString("tr-TR")}</td>
                    <td>
                      {c.isFree ? (
                        <button className="sa-free-btn active" onClick={() => toggleFree(c.id, false)} title="Ücretsizliği kaldır">★ Ücretsiz</button>
                      ) : (
                        <button className="sa-free-btn" onClick={() => toggleFree(c.id, true)} title="Sınırsız ücretsiz yap">Ücretsiz Yap</button>
                      )}
                    </td>
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
.sa-login-root { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px; background:linear-gradient(160deg,#f7f9fc,#e6ebf3); }
.sa-login-card { width:100%; max-width:400px; background:#fff; border:1px solid var(--line); border-radius:18px; box-shadow:0 30px 70px -34px rgba(27,42,74,.4); padding:38px; }
.sa-login-card h1 { font-size:24px; color:var(--navy-deep); margin:24px 0 6px; }
.sa-login-desc { color:var(--gray); font-size:14.5px; margin:0 0 22px; }
.sa-input { width:100%; padding:14px 16px; border:1px solid var(--line); border-radius:12px; font-size:15px; outline:none; transition:border-color .2s; font-family:inherit; }
.sa-input:focus { border-color:var(--navy); }
.sa-error { background:#fdecee; color:#c0283a; padding:12px 14px; border-radius:10px; font-size:14px; margin:14px 0 0; font-weight:600; }
.sa-btn { display:inline-flex; align-items:center; justify-content:center; border-radius:11px; font-weight:700; font-size:15px; cursor:pointer; border:1px solid transparent; padding:13px 22px; font-family:inherit; transition:all .2s; }
.sa-btn.full { width:100%; margin-top:18px; }
.sa-btn.primary { background:var(--red); color:#fff; }
.sa-btn.primary:hover:not(:disabled) { background:#cc2f3c; }
.sa-btn.primary:disabled { opacity:.6; cursor:not-allowed; }
.sa-root { max-width:1240px; margin:0 auto; padding:0 24px 64px; }
.sa-topbar { display:flex; align-items:center; justify-content:space-between; height:72px; }
.sa-logout { background:#fff; border:1px solid var(--line); color:var(--gray); padding:9px 18px; border-radius:10px; font-size:14px; font-weight:600; cursor:pointer; transition:all .2s; }
.sa-logout:hover { border-color:var(--red); color:var(--red); }
.sa-tabs { display:flex; gap:6px; border-bottom:1px solid #dde3ee; margin-bottom:24px; }
.sa-tabs button { background:none; border:none; padding:13px 18px; font-size:15px; font-weight:600; color:var(--gray); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; display:flex; align-items:center; gap:8px; font-family:inherit; }
.sa-tabs button.active { color:var(--navy-deep); border-bottom-color:var(--red); }
.sa-tab-count { background:var(--navy); color:#fff; font-size:12px; font-weight:700; padding:1px 8px; border-radius:10px; }
.sa-kpis { display:grid; grid-template-columns:repeat(6,1fr); gap:14px; margin-bottom:18px; }
.sa-kpi { background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px; }
.sa-kpi-val { font-size:26px; font-weight:800; color:var(--navy-deep); letter-spacing:-.02em; line-height:1; }
.sa-kpi-lbl { font-size:12.5px; color:var(--gray); margin-top:8px; }
.sa-kpi.red .sa-kpi-val { color:var(--red); }
.sa-kpi.green .sa-kpi-val { color:#1c9b5e; }
.sa-kpi.amber .sa-kpi-val { color:#c98a12; }
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
.sa-donut-wrap { display:flex; align-items:center; gap:18px; padding-top:6px; }
.sa-donut { width:140px; height:140px; flex-shrink:0; }
.sa-donut-num { font-size:26px; font-weight:800; fill:var(--navy-deep); }
.sa-donut-lbl { font-size:11px; fill:var(--gray); }
.sa-legend { flex:1; display:flex; flex-direction:column; gap:10px; }
.sa-legend-row { display:flex; align-items:center; gap:9px; }
.sa-dot { width:11px; height:11px; border-radius:3px; flex-shrink:0; }
.sa-legend-name { flex:1; font-size:14px; color:var(--ink); }
.sa-legend-val { font-weight:700; color:var(--navy-deep); font-size:14px; }
.sa-usage { display:flex; flex-direction:column; gap:14px; padding-top:4px; }
.sa-usage-info { display:flex; justify-content:space-between; margin-bottom:6px; }
.sa-usage-name { font-size:13.5px; color:var(--ink); font-weight:600; }
.sa-usage-val { font-size:13px; color:var(--gray); font-weight:700; }
.sa-usage-bar { height:7px; background:var(--soft); border-radius:6px; overflow:hidden; }
.sa-usage-bar span { display:block; height:100%; background:var(--red); border-radius:6px; }
.sa-toolbar { display:flex; gap:12px; margin-bottom:16px; flex-wrap:wrap; }
.sa-input.search { flex:1; min-width:220px; }
.sa-filters { display:flex; gap:6px; background:#fff; border:1px solid var(--line); border-radius:11px; padding:4px; }
.sa-filters button { background:none; border:none; padding:9px 14px; font-size:13.5px; font-weight:600; color:var(--gray); border-radius:8px; cursor:pointer; font-family:inherit; }
.sa-filters button.active { background:var(--navy); color:#fff; }
.sa-sort { border:1px solid var(--line); border-radius:11px; padding:0 14px; font-size:14px; font-weight:600; color:var(--navy); background:#fff; font-family:inherit; cursor:pointer; }
.sa-table-scroll { background:#fff; border:1px solid var(--line); border-radius:16px; overflow-x:auto; }
.sa-table { width:100%; border-collapse:collapse; min-width:820px; }
.sa-table th { text-align:left; font-size:12px; font-weight:700; color:var(--gray); text-transform:uppercase; letter-spacing:.04em; padding:14px 16px; border-bottom:1px solid var(--line); white-space:nowrap; }
.sa-table th.num, .sa-table td.num { text-align:right; }
.sa-table td { padding:14px 16px; border-bottom:1px solid #f0f2f7; font-size:14px; white-space:nowrap; }
.sa-table tr:last-child td { border-bottom:none; }
.sa-cust-name { font-weight:700; color:var(--navy-deep); }
.sa-cust-city { font-size:12.5px; color:var(--gray); margin-top:2px; }
.sa-free-btn { font-size:12px; font-weight:700; padding:6px 12px; border-radius:8px; border:1px solid #e63946; background:#fff; color:#e63946; cursor:pointer; white-space:nowrap; transition:all .15s; }
.sa-free-btn:hover { background:#e63946; color:#fff; }
.sa-free-btn.active { background:#1a8a4a; border-color:#1a8a4a; color:#fff; }
.sa-free-btn.active:hover { background:#fff; color:#1a8a4a; }
.sa-table td.strong { font-weight:700; color:var(--navy-deep); }
.sa-table td.muted { color:var(--gray); font-size:13px; }
.sa-status { font-size:12px; font-weight:700; padding:4px 10px; border-radius:20px; }
.sa-status.active { background:#e6f6ed; color:#1c9b5e; }
.sa-status.trial { background:#fff4d9; color:#b8860b; }
.sa-status.cancelled { background:#f1f3f7; color:#8a93a5; }
.sa-empty { text-align:center; color:var(--gray); padding:40px; }
@media (max-width:1080px) { .sa-kpis { grid-template-columns:repeat(3,1fr); } .sa-charts { grid-template-columns:1fr; } }
@media (max-width:560px) { .sa-kpis { grid-template-columns:repeat(2,1fr); } .sa-donut-wrap { flex-direction:column; } }
`;