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

/* ---------------- Grafikler ---------------- */

function AreaChart({ data }: { data: number[] }) {
  const W = 560, H = 200, pad = 28;
  const max = Math.max(...data, 0.1) * 1.12;
  const stepX = (W - pad * 2) / Math.max(1, data.length - 1);
  const pts = data.map((v, i) => [pad + i * stepX, H - pad - (v / max) * (H - pad * 2)] as [number, number]);
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = line + ` L ${pts[pts.length - 1][0].toFixed(1)} ${H - pad} L ${pad} ${H - pad} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sa-svg" role="img" aria-label="Aylık gelir grafiği">
      <defs>
        <linearGradient id="sa-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(230,57,70,.20)" />
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
    <svg viewBox={`0 0 ${W} ${H}`} className="sa-svg" role="img" aria-label="Aylık yeni müşteri grafiği">
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} stroke="#eef1f6" strokeWidth="1" />
      ))}
      {data.map((v, i) => {
        const h = (v / max) * (H - pad * 2);
        return <rect key={i} x={pad + i * bw + bw * 0.22} y={H - pad - h} width={bw * 0.56} height={h} rx="4" fill="#16213a" opacity={0.5 + (v / max) * 0.5} />;
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
      <svg viewBox="0 0 140 140" className="sa-donut" role="img" aria-label="Abonelik türü dağılımı">
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

/* ---------------- Sayfa ---------------- */

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

  function refresh() { loadData(); loadOverview(); }

  function logout() {
    setAuthed(false); setPass("");
    sessionStorage.removeItem("md_super_token");
  }

  const planSegs = useMemo(() => {
    if (!ov) return [];
    return [
      { label: "Site (toplu)", value: ov.plans.site, color: "#e63946" },
      { label: "Bireysel", value: ov.plans.individual, color: "#16213a" },
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

  const Logo = (
    <div className="sa-logo">
      <span className="sa-logo-mark" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <circle cx="12" cy="17.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="sa-logo-text">Mobil<b>Diafon</b></span>
      <span className="sa-logo-tag">Süper Admin</span>
    </div>
  );

  /* ---------------- Giriş ---------------- */
  if (!authed) {
    return (
      <main className="sa sa-login-root">
        <div className="sa-login-card">
          {Logo}
          <h1>Yönetim girişi</h1>
          <p className="sa-desc">Bu panel yalnızca platform yöneticileri içindir.</p>
          <label className="sa-label" htmlFor="sa-pass">Şifre</label>
          <input id="sa-pass" className="sa-input" type="password" placeholder="••••••••" autoComplete="current-password"
            value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          {error && <div className="sa-alert error">{error}</div>}
          <button className="sa-btn primary block" onClick={login} disabled={loading}>
            {loading ? "Kontrol ediliyor…" : "Giriş Yap"}
          </button>
        </div>
        <div className="sa-login-foot">mobildiafon.com</div>
        <style jsx global>{SA_CSS}</style>
      </main>
    );
  }

  /* ---------------- Panel ---------------- */
  return (
    <main className="sa">
      <header className="sa-header">
        <div className="sa-header-inner">
          {Logo}
          <div className="sa-header-actions">
            <button className="sa-btn ghost sm" onClick={refresh}>Yenile</button>
            <button className="sa-btn outline sm" onClick={logout}>Çıkış</button>
          </div>
        </div>
      </header>

      <div className="sa-main">
        <nav className="sa-tabs" aria-label="Bölümler">
          <button className={tab === "overview" ? "active" : ""} onClick={() => setTab("overview")}>Genel Bakış</button>
          <button className={tab === "customers" ? "active" : ""} onClick={() => setTab("customers")}>
            Müşteriler <span className="sa-badge">{data.length}</span>
          </button>
        </nav>

        {tab === "overview" && !ov && (
          <div className="sa-empty-card"><div className="sa-spinner" /><p>Veriler yükleniyor…</p></div>
        )}

        {tab === "overview" && ov && (
          <>
            <section className="sa-kpis" aria-label="Özet göstergeler">
              <Kpi label="Toplam Müşteri" value={String(ov.kpi.total)} />
              <Kpi label="Aktif Abonelik" value={String(ov.kpi.active)} accent="green" />
              <Kpi label="Denemede" value={String(ov.kpi.trial)} accent="amber" />
              <Kpi label="Aylık Gelir (MRR)" value={fmt(ov.kpi.mrr)} accent="red" />
              <Kpi label="Toplam Bina" value={String(ov.kpi.buildings)} />
              <Kpi label="Toplam Daire" value={ov.kpi.flats.toLocaleString("tr-TR")} />
            </section>

            <section className="sa-charts">
              <div className="sa-card wide">
                <div className="sa-card-head">
                  <div>
                    <div className="sa-card-title">Aylık Gelir (MRR)</div>
                    <div className="sa-card-sub">Son 12 ay</div>
                  </div>
                  <div className="sa-card-big">{fmtK(ov.kpi.mrr)}</div>
                </div>
                <AreaChart data={ov.revenue} />
                <div className="sa-axis">{ov.months.map((m, i) => <span key={i}>{m}</span>)}</div>
              </div>

              <div className="sa-card">
                <div className="sa-card-head">
                  <div>
                    <div className="sa-card-title">Abonelik Türü</div>
                    <div className="sa-card-sub">Site / bireysel</div>
                  </div>
                </div>
                <Donut segs={planSegs} />
              </div>

              <div className="sa-card wide">
                <div className="sa-card-head">
                  <div>
                    <div className="sa-card-title">Yeni Müşteriler</div>
                    <div className="sa-card-sub">Aylık kayıt sayısı</div>
                  </div>
                </div>
                <BarChart data={ov.signups} />
                <div className="sa-axis">{ov.months.map((m, i) => <span key={i}>{m}</span>)}</div>
              </div>

              <div className="sa-card">
                <div className="sa-card-head">
                  <div>
                    <div className="sa-card-title">En Çok Kullanan</div>
                    <div className="sa-card-sub">Çağrı sayısı · ilk 5</div>
                  </div>
                </div>
                <div className="sa-usage">
                  {topUsage.length === 0 && <div className="sa-empty">Henüz veri yok</div>}
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
          <section>
            <div className="sa-toolbar">
              <input className="sa-input search" placeholder="Müşteri veya sahip ara…" value={search} onChange={(e) => setSearch(e.target.value)} />
              <div className="sa-filters" role="group" aria-label="Durum filtresi">
                {(["all", "active", "trial", "cancelled"] as const).map((s) => (
                  <button key={s} className={statusFilter === s ? "active" : ""} onClick={() => setStatusFilter(s)}>
                    {s === "all" ? "Tümü" : STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
              <select className="sa-sort" value={sortKey} onChange={(e) => setSortKey(e.target.value as any)} aria-label="Sıralama">
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
                      <td>
                        <div className="sa-cust-name">{c.name}</div>
                        <div className="sa-cust-sub">{c.phone}</div>
                      </td>
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
      </div>

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

/* ---------------- Stiller — yönetici paneli (mdp) ile aynı token seti ---------------- */

const SA_CSS = `
.sa {
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
  --green: #1a8f3c;
  --green-soft: #e9f6ee;
  --amber: #c98a12;
  --amber-soft: #fdf4e5;
  --radius: 14px;
  --radius-sm: 10px;
  --shadow: 0 1px 2px rgba(22,33,58,.05), 0 4px 16px rgba(22,33,58,.06);

  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
}
.sa *, .sa *::before, .sa *::after { box-sizing: border-box; }
.sa button, .sa select, .sa input { font: inherit; }
.sa button { cursor: pointer; }
.sa button:disabled { cursor: not-allowed; opacity: .55; }
.sa :focus-visible { outline: 2px solid #1a5fc2; outline-offset: 2px; border-radius: 4px; }

/* Logo */
.sa-logo { display: inline-flex; align-items: center; gap: 8px; }
.sa-logo-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 10px; background: var(--navy); color: #fff;
}
.sa-logo-text { font-size: 19px; font-weight: 700; letter-spacing: -.4px; color: var(--navy); }
.sa-logo-text b { color: var(--red); font-weight: 800; }
.sa-logo-tag {
  margin-left: 4px; padding: 3px 9px; font-size: 11px; font-weight: 700;
  letter-spacing: .4px; text-transform: uppercase;
  color: var(--red); background: var(--red-soft); border-radius: 20px;
}

/* Giriş */
.sa-login-root {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 24px;
  background:
    radial-gradient(600px 300px at 15% 0%, rgba(230,57,70,.06), transparent 60%),
    radial-gradient(700px 350px at 90% 100%, rgba(26,42,74,.08), transparent 60%),
    var(--bg);
}
.sa-login-card {
  width: 100%; max-width: 400px; background: var(--surface);
  border: 1px solid var(--line); border-radius: 20px;
  box-shadow: var(--shadow); padding: 32px 28px;
}
.sa-login-card h1 { margin: 20px 0 6px; font-size: 22px; font-weight: 800; letter-spacing: -.4px; }
.sa-desc { margin: 0 0 20px; font-size: 14px; color: var(--ink-soft); }
.sa-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: var(--ink-soft); }
.sa-login-foot { margin-top: 20px; font-size: 12px; color: var(--muted); }

/* Girdiler */
.sa-input {
  width: 100%; padding: 12px 14px; margin-bottom: 14px; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm);
  transition: border-color .15s, box-shadow .15s;
}
.sa-input::placeholder { color: var(--muted); }
.sa-input:focus { outline: none; border-color: var(--navy); box-shadow: 0 0 0 3px rgba(26,42,74,.1); }

/* Butonlar */
.sa-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px 18px; border-radius: var(--radius-sm); border: 1px solid transparent;
  font-size: 14px; font-weight: 600; white-space: nowrap;
  transition: background .15s, border-color .15s, transform .05s;
}
.sa-btn:active { transform: translateY(1px); }
.sa-btn.block { width: 100%; }
.sa-btn.sm { padding: 7px 13px; font-size: 13px; }
.sa-btn.primary { background: var(--red); color: #fff; }
.sa-btn.primary:hover:not(:disabled) { background: #d02c39; }
.sa-btn.outline { background: var(--surface); color: var(--ink); border-color: var(--line); }
.sa-btn.outline:hover:not(:disabled) { border-color: var(--ink-soft); }
.sa-btn.ghost { background: var(--surface-2); color: var(--ink); border-color: var(--line); }
.sa-btn.ghost:hover:not(:disabled) { background: #eef1f7; }

/* Uyarılar */
.sa-alert { padding: 10px 14px; margin-bottom: 14px; border-radius: var(--radius-sm); font-size: 14px; font-weight: 500; }
.sa-alert.error { background: var(--red-soft); color: #b3202c; border: 1px solid #f3c2c7; }

/* Header */
.sa-header {
  position: sticky; top: 0; z-index: 20;
  background: rgba(255,255,255,.92); backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}
.sa-header-inner {
  max-width: 1240px; margin: 0 auto; padding: 12px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.sa-header-actions { display: flex; gap: 8px; }
.sa-main { max-width: 1240px; margin: 0 auto; padding: 24px 20px 64px; }

/* Sekmeler */
.sa-tabs {
  display: inline-flex; gap: 4px; padding: 4px; margin-bottom: 20px;
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
}
.sa-tabs button {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 9px 16px; border: none; border-radius: var(--radius-sm);
  background: transparent; color: var(--ink-soft); font-size: 14px; font-weight: 600;
  transition: background .15s, color .15s;
}
.sa-tabs button:hover { color: var(--ink); }
.sa-tabs button.active { background: var(--navy); color: #fff; }
.sa-badge {
  min-width: 19px; height: 19px; padding: 0 6px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--red); color: #fff; font-size: 11.5px; font-weight: 700; border-radius: 10px;
}
.sa-tabs button.active .sa-badge { background: rgba(255,255,255,.2); }

/* KPI kartları */
.sa-kpis { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 16px; }
.sa-kpi {
  padding: 16px 18px; background: var(--surface);
  border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);
}
.sa-kpi-val { font-size: 25px; font-weight: 800; letter-spacing: -.6px; line-height: 1.1; color: var(--ink); }
.sa-kpi-lbl { margin-top: 6px; font-size: 12.5px; font-weight: 600; color: var(--muted); }
.sa-kpi.red .sa-kpi-val { color: var(--red); }
.sa-kpi.green .sa-kpi-val { color: var(--green); }
.sa-kpi.amber .sa-kpi-val { color: var(--amber); }

/* Grafik kartları */
.sa-charts { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
.sa-card {
  padding: 20px; background: var(--surface);
  border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow);
  min-width: 0;
}
.sa-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.sa-card-title { font-size: 15.5px; font-weight: 700; }
.sa-card-sub { margin-top: 2px; font-size: 12.5px; color: var(--muted); }
.sa-card-big { font-size: 21px; font-weight: 800; letter-spacing: -.4px; }
.sa-svg { width: 100%; height: auto; display: block; }
.sa-axis { display: flex; justify-content: space-between; padding: 8px 24px 0; }
.sa-axis span { font-size: 10.5px; color: var(--muted); }

/* Donut */
.sa-donut-wrap { display: flex; align-items: center; gap: 18px; padding-top: 4px; }
.sa-donut { width: 136px; height: 136px; flex-shrink: 0; }
.sa-donut-num { font-size: 26px; font-weight: 800; fill: var(--ink); }
.sa-donut-lbl { font-size: 11px; fill: var(--muted); }
.sa-legend { flex: 1; display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.sa-legend-row { display: flex; align-items: center; gap: 9px; }
.sa-dot { width: 11px; height: 11px; border-radius: 3px; flex-shrink: 0; }
.sa-legend-name { flex: 1; font-size: 13.5px; }
.sa-legend-val { font-size: 14px; font-weight: 700; }

/* Kullanım listesi */
.sa-usage { display: flex; flex-direction: column; gap: 13px; padding-top: 2px; }
.sa-usage-info { display: flex; justify-content: space-between; margin-bottom: 5px; }
.sa-usage-name { font-size: 13.5px; font-weight: 600; }
.sa-usage-val { font-size: 13px; font-weight: 700; color: var(--muted); }
.sa-usage-bar { height: 7px; background: var(--surface-2); border-radius: 6px; overflow: hidden; }
.sa-usage-bar span { display: block; height: 100%; background: var(--red); border-radius: 6px; }

/* Boş / yükleniyor */
.sa-empty { text-align: center; color: var(--muted); padding: 32px 16px; }
.sa-empty-card {
  padding: 48px 20px; text-align: center; color: var(--muted);
  background: var(--surface); border: 1px dashed var(--line); border-radius: var(--radius);
}
.sa-spinner {
  width: 26px; height: 26px; margin: 0 auto 12px;
  border: 3px solid var(--line); border-top-color: var(--red); border-radius: 50%;
  animation: sa-spin .8s linear infinite;
}
@keyframes sa-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .sa-spinner { animation-duration: 2s; }
  .sa-btn:active { transform: none; }
}

/* Müşteriler — araç çubuğu */
.sa-toolbar { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.sa-input.search { flex: 1 1 220px; margin-bottom: 0; }
.sa-filters {
  display: flex; gap: 4px; padding: 4px;
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-sm);
}
.sa-filters button {
  padding: 7px 13px; border: none; border-radius: 7px;
  background: transparent; color: var(--ink-soft); font-size: 13.5px; font-weight: 600;
}
.sa-filters button:hover { color: var(--ink); }
.sa-filters button.active { background: var(--navy); color: #fff; }
.sa-sort {
  padding: 0 14px; border: 1px solid var(--line); border-radius: var(--radius-sm);
  background: var(--surface); color: var(--ink); font-size: 14px; font-weight: 600; cursor: pointer;
}

/* Tablo */
.sa-table-scroll {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  box-shadow: var(--shadow); overflow-x: auto;
}
.sa-table { width: 100%; border-collapse: collapse; min-width: 860px; }
.sa-table th {
  position: sticky; top: 0; z-index: 1;
  text-align: left; padding: 13px 16px;
  font-size: 11.5px; font-weight: 700; letter-spacing: .05em; text-transform: uppercase;
  color: var(--muted); background: var(--surface-2); border-bottom: 1px solid var(--line);
  white-space: nowrap;
}
.sa-table th.num, .sa-table td.num { text-align: right; font-variant-numeric: tabular-nums; }
.sa-table td { padding: 13px 16px; border-bottom: 1px solid #f0f2f7; font-size: 14px; white-space: nowrap; }
.sa-table tbody tr:hover td { background: var(--surface-2); }
.sa-table tr:last-child td { border-bottom: none; }
.sa-cust-name { font-weight: 700; }
.sa-cust-sub { margin-top: 2px; font-size: 12.5px; color: var(--muted); }
.sa-table td.strong { font-weight: 700; }
.sa-table td.muted { color: var(--muted); font-size: 13px; }

/* Durum ve işlem */
.sa-status { display: inline-flex; padding: 3px 10px; font-size: 12px; font-weight: 700; border-radius: 20px; }
.sa-status.active { background: var(--green-soft); color: var(--green); }
.sa-status.trial { background: var(--amber-soft); color: var(--amber); }
.sa-status.cancelled { background: #f1f3f7; color: var(--muted); }
.sa-free-btn {
  padding: 6px 12px; font-size: 12px; font-weight: 700; white-space: nowrap;
  border: 1px solid var(--red); border-radius: 8px; background: var(--surface); color: var(--red);
  transition: background .15s, color .15s;
}
.sa-free-btn:hover { background: var(--red); color: #fff; }
.sa-free-btn.active { background: var(--green); border-color: var(--green); color: #fff; }
.sa-free-btn.active:hover { background: var(--surface); color: var(--green); }

/* Mobil */
@media (max-width: 1080px) {
  .sa-kpis { grid-template-columns: repeat(3, 1fr); }
  .sa-charts { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .sa-kpis { grid-template-columns: repeat(2, 1fr); }
  .sa-donut-wrap { flex-direction: column; }
  .sa-main { padding: 16px 14px 48px; }
  .sa-header-inner { padding: 10px 14px; }
  .sa-logo-text { font-size: 17px; }
  .sa-logo-tag { display: none; }
}
`;