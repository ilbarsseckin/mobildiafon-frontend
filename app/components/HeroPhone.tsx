"use client";
import { useEffect, useState } from "react";

const SCENES = [
  { key: "scan", tag: "QR okutuluyor" },
  { key: "list", tag: "Daireler listelendi" },
  { key: "call", tag: "Görüntülü görüşme" },
  { key: "door", tag: "Kapı açıldı" },
];

export default function HeroPhone() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const d = [2400, 2600, 3000, 2200];
    let idx = 0;
    let t: any;
    const tick = () => { idx = (idx + 1) % SCENES.length; setI(idx); t = setTimeout(tick, d[idx]); };
    t = setTimeout(tick, d[0]);
    return () => clearTimeout(t);
  }, []);
  const sc = SCENES[i].key;

  return (
    <div className="hp-wrap" aria-hidden="true">
      {/* arka parlama */}
      <div className="hp-glow" />
      <svg className="hp-svg" viewBox="0 0 320 460" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="hpScreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#142544" />
            <stop offset="100%" stopColor="#0c1830" />
          </linearGradient>
          <linearGradient id="hpBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e63946" stopOpacity="0" />
            <stop offset="50%" stopColor="#e63946" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hpPin" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e63946" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* telefon gövdesi */}
        <rect x="40" y="20" width="240" height="420" rx="38" fill="#0a1326" stroke="#243a63" strokeWidth="3" />
        <rect x="52" y="32" width="216" height="396" rx="28" fill="url(#hpScreen)" />
        <rect x="128" y="44" width="64" height="9" rx="4.5" fill="#243a63" />

        {/* üst başlık */}
        <text x="160" y="84" textAnchor="middle" fill="#e63946" fontSize="13" fontWeight="800" letterSpacing="1">● MobilDiafon</text>

        {/* SAHNE: QR TARAMA */}
        {sc === "scan" && (
          <g>
            <text x="160" y="120" textAnchor="middle" fill="#9fb3d4" fontSize="12">Kapıdaki kodu okutun</text>
            <g transform="translate(110,150)">
              <rect x="0" y="0" width="100" height="100" rx="10" fill="#0c1830" stroke="#243a63" strokeWidth="2" />
              {/* QR desen */}
              <g fill="#cdd9ef">
                <rect x="12" y="12" width="24" height="24" rx="3" />
                <rect x="64" y="12" width="24" height="24" rx="3" />
                <rect x="12" y="64" width="24" height="24" rx="3" />
                <rect x="18" y="18" width="12" height="12" fill="#0c1830" />
                <rect x="70" y="18" width="12" height="12" fill="#0c1830" />
                <rect x="18" y="70" width="12" height="12" fill="#0c1830" />
                <rect x="52" y="52" width="8" height="8" /><rect x="64" y="52" width="8" height="8" />
                <rect x="76" y="64" width="8" height="8" /><rect x="52" y="76" width="8" height="8" />
                <rect x="64" y="76" width="8" height="8" />
              </g>
              {/* köşe çerçeve */}
              <path d="M-6,18 L-6,-6 L18,-6 M82,-6 L106,-6 L106,18 M106,82 L106,106 L82,106 M18,106 L-6,106 L-6,82"
                stroke="#e63946" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* tarama ışını */}
              <rect className="hp-beam" x="0" y="0" width="100" height="14" fill="url(#hpBeam)" />
            </g>
            <text x="160" y="290" textAnchor="middle" fill="#5fd38a" fontSize="12" fontWeight="700">Bina doğrulanıyor…</text>
          </g>
        )}

        {/* SAHNE: DAIRE LISTESI */}
        {sc === "list" && (
          <g transform="translate(72,104)">
            <text x="0" y="0" fill="#9fb3d4" fontSize="11" fontWeight="600">YILDIZ APARTMANI</text>
            {["A Blok · D:3", "A Blok · D:7", "B Blok · D:12", "Güvenlik"].map((r, k) => (
              <g key={r} className="hp-row" style={{ animationDelay: `${k * 0.14}s` }} transform={`translate(0,${16 + k * 50})`}>
                <rect x="0" y="0" width="176" height="42" rx="11" fill="#16223f" />
                <circle cx="24" cy="21" r="13" fill="#273a61" />
                <rect x="46" y="13" width="92" height="7" rx="3.5" fill="#3a4d76" />
                <rect x="46" y="26" width="60" height="6" rx="3" fill="#2a3a5e" />
                <circle cx="160" cy="21" r="10" fill="#1fc77d" opacity="0.9" />
              </g>
            ))}
          </g>
        )}

        {/* SAHNE: GORUNTULU ARAMA */}
        {sc === "call" && (
          <g>
            <rect x="68" y="104" width="184" height="240" rx="16" fill="#0c1830" stroke="#243a63" strokeWidth="1.5" />
            {/* avatar */}
            <circle cx="160" cy="180" r="40" fill="#16223f" />
            <circle cx="160" cy="166" r="16" fill="#9fb3d4" />
            <path d="M134,210 C134,184 186,184 186,210 Z" fill="#9fb3d4" />
            <text x="160" y="262" textAnchor="middle" fill="#cdd9ef" fontSize="13" fontWeight="700">A Blok · Daire 7</text>
            {/* ses dalgası */}
            <g className="hp-wave" transform="translate(160,290)">
              <rect x="-36" y="-7" width="6" height="14" rx="3" fill="#e63946" />
              <rect x="-22" y="-14" width="6" height="28" rx="3" fill="#e63946" />
              <rect x="-8" y="-20" width="6" height="40" rx="3" fill="#e63946" />
              <rect x="8" y="-14" width="6" height="28" rx="3" fill="#e63946" />
              <rect x="22" y="-7" width="6" height="14" rx="3" fill="#e63946" />
            </g>
            <text x="160" y="330" textAnchor="middle" fill="#5fd38a" fontSize="12" fontWeight="700">● Bağlandı</text>
          </g>
        )}

        {/* SAHNE: KAPI ACILDI */}
        {sc === "door" && (
          <g transform="translate(160,210)">
            <circle className="hp-doorglow" cx="0" cy="0" r="70" fill="url(#hpPin)" />
            <circle cx="0" cy="0" r="46" fill="#1fc77d" />
            <path className="hp-check" d="M-20,2 l13,13 l26,-30" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="0" y="92" textAnchor="middle" fill="#5fd38a" fontSize="15" fontWeight="800">Kapı Açıldı</text>
          </g>
        )}

        {/* alt durum şeridi */}
        <text x="160" y="412" textAnchor="middle" fill="#6b80a8" fontSize="11">{SCENES[i].tag}</text>
      </svg>
    </div>
  );
}
