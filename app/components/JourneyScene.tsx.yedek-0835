"use client";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: "📍", label: "Kapıya geldi" },
  { icon: "📡", label: "Konum tarandı" },
  { icon: "🏢", label: "Bina bulundu" },
  { icon: "👥", label: "Sakin seçildi" },
  { icon: "📞", label: "Görüşme başladı" },
];

export default function JourneyScene() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="js-scene" aria-label="MobilDiafon nasıl çalışır animasyonu">
      <div className="js-head">
        <span className="js-eyebrow">CANLI DEMO</span>
        <h2 className="js-title">Bir ziyaretçinin yolculuğu</h2>
        <p className="js-sub">Kapıya geldi, telefonunu çıkardı, saniyeler içinde görüntülü görüşme başladı.</p>
      </div>

      <div className="js-stage">
        <svg className="js-canvas" viewBox="0 0 960 560" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="pBldFace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--js-bld-top)" />
              <stop offset="100%" stopColor="var(--js-bld-face)" />
            </linearGradient>
            <linearGradient id="pLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e63946" />
              <stop offset="100%" stopColor="#4a90d9" />
            </linearGradient>
            <radialGradient id="pGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e63946" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="pSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pGround" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--js-ground)" />
              <stop offset="100%" stopColor="var(--js-ground2)" />
            </linearGradient>
            <filter id="pSoft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <path id="pLinkPath" d="M330,300 C430,260 520,300 600,330" fill="none" />
          </defs>

          <circle className="js-orb" cx="180" cy="120" r="90" fill="url(#pSun)" />
          <circle className="js-orb" cx="780" cy="90" r="70" fill="#e63946" opacity="0.12" />

          <circle className="js-star s1" cx="120" cy="70" r="2" fill="#fff" />
          <circle className="js-star s2" cx="260" cy="50" r="1.6" fill="#fff" />
          <circle className="js-star s3" cx="640" cy="60" r="2.2" fill="#fff" />
          <circle className="js-star s4" cx="820" cy="120" r="1.6" fill="#fff" />
          <circle className="js-star s5" cx="900" cy="70" r="2" fill="#fff" />
          <circle className="js-star s2" cx="430" cy="40" r="1.4" fill="#fff" />
          <circle className="js-star s4" cx="540" cy="90" r="1.5" fill="#fff" />

          <g className="js-cloud" opacity="0.85">
            <ellipse cx="0" cy="100" rx="46" ry="20" fill="#fff" />
            <ellipse cx="34" cy="90" rx="34" ry="22" fill="#fff" />
            <ellipse cx="-30" cy="92" rx="30" ry="18" fill="#fff" />
          </g>
          <g className="js-cloud c2" opacity="0.6">
            <ellipse cx="0" cy="160" rx="38" ry="16" fill="#fff" />
            <ellipse cx="28" cy="152" rx="28" ry="18" fill="#fff" />
          </g>

          <rect x="0" y="400" width="960" height="160" fill="url(#pGround)" />
          <g stroke="var(--js-grid)" strokeWidth="1" opacity="0.3">
            <line x1="0" y1="440" x2="960" y2="440" />
            <line x1="0" y1="480" x2="960" y2="480" />
            <line x1="0" y1="525" x2="960" y2="525" />
            <line x1="120" y1="400" x2="60" y2="560" />
            <line x1="320" y1="400" x2="300" y2="560" />
            <line x1="520" y1="400" x2="540" y2="560" />
            <line x1="720" y1="400" x2="780" y2="560" />
          </g>

          {/* UZAKTAKİ ŞEHİR AĞI - soluk binalar + pinler + bağlantılar */}
          <g className="js-city" opacity="0.5">
            {/* bağlantı çizgileri */}
            <g className="js-citylinks" stroke="#e63946" strokeWidth="1.2" opacity="0.45" fill="none" strokeDasharray="3 5">
              <line x1="560" y1="350" x2="700" y2="330" />
              <line x1="700" y1="330" x2="840" y2="360" />
              <line x1="560" y1="350" x2="640" y2="390" />
              <line x1="840" y1="360" x2="900" y2="340" />
            </g>
            {/* uzak binalar */}
            <g fill="var(--js-bld-side)" opacity="0.6">
              <rect x="540" y="350" width="40" height="55" rx="2" />
              <rect x="680" y="330" width="44" height="75" rx="2" />
              <rect x="820" y="358" width="38" height="47" rx="2" />
              <rect x="884" y="338" width="42" height="67" rx="2" />
            </g>
            {/* uzak pinler */}
            <g fill="#e63946">
              <g className="js-citypin p1"><circle cx="560" cy="344" r="5" /><circle cx="560" cy="344" r="2" fill="#fff" /></g>
              <g className="js-citypin p2"><circle cx="702" cy="324" r="5" /><circle cx="702" cy="324" r="2" fill="#fff" /></g>
              <g className="js-citypin p3"><circle cx="839" cy="352" r="5" /><circle cx="839" cy="352" r="2" fill="#fff" /></g>
              <g className="js-citypin p1"><circle cx="905" cy="332" r="5" /><circle cx="905" cy="332" r="2" fill="#fff" /></g>
            </g>
          </g>

          <g transform="translate(180,150)">
            <ellipse cx="90" cy="262" rx="120" ry="18" fill="#000" opacity="0.12" filter="url(#pSoft)" />
            <path d="M150,30 L195,55 L195,250 L150,260 Z" fill="var(--js-bld-side)" />
            <rect x="20" y="30" width="130" height="230" rx="4" fill="url(#pBldFace)" />
            <path d="M20,30 L65,8 L195,8 L150,30 Z" fill="var(--js-bld-top)" />
            {/* HOLOGRAFİK ROZET - bina üstünde */}
            <g className="js-badge" transform="translate(40,-46)">
              <line x1="60" y1="40" x2="60" y2="14" stroke="#4ad9e8" strokeWidth="1" opacity="0.5" strokeDasharray="2 2" />
              <rect x="0" y="-14" width="120" height="30" rx="8" fill="#0a1f33" opacity="0.92" stroke="#4ad9e8" strokeWidth="1.2" />
              <rect x="0" y="-14" width="120" height="30" rx="8" fill="#4ad9e8" opacity="0.08" />
              {/* tik dairesi */}
              <circle cx="18" cy="1" r="9" fill="#1fc77d" />
              <path d="M13.5,1 l3,3 l5,-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {/* metin */}
              <text x="34" y="-2" fill="#cdeef2" fontSize="9.5" fontWeight="700" letterSpacing="0.3">Yıldız Apt.</text>
              <text x="34" y="9" fill="#4ad9e8" fontSize="7.5" fontWeight="600" letterSpacing="0.5">✓ MOBİLDİAFON KAYITLI</text>
            </g>
            <g>
              <rect className="js-win w1" x="36" y="52" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w3" x="70" y="52" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w5" x="104" y="52" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w2" x="36" y="92" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w4" x="70" y="92" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w6" x="104" y="92" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w3" x="36" y="132" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w5" x="70" y="132" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w1" x="104" y="132" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w4" x="36" y="172" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w2" x="70" y="172" width="24" height="26" rx="3" fill="var(--js-win-on)" />
              <rect className="js-win w6" x="104" y="172" width="24" height="26" rx="3" fill="var(--js-win-on)" />
            </g>
            <rect x="68" y="218" width="34" height="42" rx="3" fill="#0a1326" />
            <circle cx="96" cy="240" r="2" fill="var(--js-win-on)" />
            <g transform="translate(85,210)">
              <circle cx="0" cy="0" r="6" fill="#e63946" />
              <circle className="js-radar r1" cx="0" cy="0" r="14" fill="none" stroke="#e63946" strokeWidth="2.5" />
              <circle className="js-radar r2" cx="0" cy="0" r="14" fill="none" stroke="#e63946" strokeWidth="2.5" />
              <circle className="js-radar r3" cx="0" cy="0" r="14" fill="none" stroke="#e63946" strokeWidth="2.5" />
            </g>
          </g>

          <ellipse className="js-pin-shadow" cx="300" cy="405" rx="26" ry="7" fill="#000" />
          <g className="js-pin" transform="translate(300,330)">
            <circle cx="0" cy="40" r="50" fill="url(#pGlow)" />
            <path d="M0,-34 C19,-34 33,-20 33,-2 C33,20 0,44 0,44 C0,44 -33,20 -33,-2 C-33,-20 -19,-34 0,-34 Z" fill="#e63946" />
            <path d="M0,-34 C19,-34 33,-20 33,-2 C33,20 0,44 0,44 C0,44 -33,20 -33,-2 C-33,-20 -19,-34 0,-34 Z" fill="#fff" opacity="0.12" />
            <circle cx="0" cy="-2" r="12" fill="#fff" />
            <circle cx="0" cy="-2" r="5" fill="#e63946" />
          </g>

          {/* ZİYARETÇİ (insan + telefon) ve KÖPEK - bina önünde */}
          <g className="js-visitor" transform="translate(360,300)">
            {/* gölge */}
            <ellipse cx="6" cy="182" rx="46" ry="9" fill="#000" opacity="0.13" filter="url(#pSoft)" />

            {/* KÖPEK - kişinin sağında oturuyor */}
            <g transform="translate(54,120)">
              <ellipse cx="6" cy="62" rx="22" ry="5" fill="#000" opacity="0.10" />
              {/* gövde */}
              <path d="M-6,60 C-10,40 -4,30 6,30 C16,30 20,42 18,60 Z" fill="#8a5a3b" />
              {/* arka bacak */}
              <rect x="-8" y="50" width="9" height="14" rx="4" fill="#7a4d31" />
              {/* ön bacak */}
              <rect x="10" y="44" width="7" height="20" rx="3.5" fill="#8a5a3b" />
              {/* boyun + kafa */}
              <path d="M12,34 C20,22 30,22 30,34 C30,42 24,46 18,44 Z" fill="#8a5a3b" />
              <circle cx="28" cy="30" r="9" fill="#8a5a3b" />
              {/* kulak */}
              <path d="M22,22 C20,14 26,14 28,22 Z" fill="#6e4429" />
              {/* burun */}
              <circle cx="36" cy="31" r="2.2" fill="#2a1a12" />
              {/* göz */}
              <circle cx="31" cy="27" r="1.6" fill="#2a1a12" />
              {/* kuyruk (sallanan) */}
              <path className="js-tail" d="M-6,40 C-18,34 -20,46 -10,48 Z" fill="#8a5a3b" />
            </g>

            {/* İNSAN */}
            <g>
              {/* bacaklar */}
              <rect x="-12" y="110" width="13" height="68" rx="6" fill="#2c3e63" />
              <rect x="6" y="110" width="13" height="68" rx="6" fill="#34486f" />
              {/* ayakkabı */}
              <ellipse cx="-6" cy="180" rx="11" ry="5" fill="#1a1a2e" />
              <ellipse cx="13" cy="180" rx="11" ry="5" fill="#1a1a2e" />
              {/* gövde (mont) */}
              <path d="M-18,52 C-18,44 -10,40 3,40 C16,40 24,44 24,52 L22,114 L-16,114 Z" fill="#e63946" />
              {/* fermuar */}
              <line x1="3" y1="44" x2="3" y2="112" stroke="#b51d29" strokeWidth="1.5" />
              {/* sol kol (yanda) */}
              <rect x="-22" y="56" width="11" height="46" rx="5.5" fill="#cc2f3c" transform="rotate(6 -16 56)" />
              {/* sağ kol (telefon tutan, dirsekten kıvrık) */}
              <g transform="translate(22,58)">
                <rect x="-2" y="0" width="11" height="30" rx="5.5" fill="#cc2f3c" />
                <rect x="-6" y="26" width="11" height="26" rx="5.5" fill="#cc2f3c" transform="rotate(-58 0 28)" />
                {/* el + telefon */}
                <g transform="translate(-30,28)">
                  <rect x="0" y="0" width="20" height="34" rx="4" fill="#0e1830" stroke="#2a3d63" strokeWidth="1.5" />
                  <rect x="2.5" y="3" width="15" height="28" rx="2.5" fill="#16223f" />
                  {/* ekranda kırmızı pin parıltısı */}
                  <circle className="js-phone-glow" cx="10" cy="17" r="4" fill="#e63946" />
                  {/* tutan el */}
                  <ellipse cx="10" cy="34" rx="7" ry="4" fill="#e8b48c" />
                </g>
              </g>
              {/* boyun */}
              <rect x="-4" y="30" width="11" height="14" rx="4" fill="#e8b48c" />
              {/* kafa */}
              <circle cx="2" cy="20" r="15" fill="#e8b48c" />
              {/* saç */}
              <path d="M-13,16 C-13,2 17,2 17,16 C17,10 12,7 2,7 C-8,7 -13,10 -13,16 Z" fill="#2a2018" />
              {/* kulak */}
              <circle cx="-12" cy="21" r="3" fill="#e0a87e" />
            </g>
          </g>

          <use href="#pLinkPath" className="js-link" stroke="url(#pLine)" strokeWidth="3.5" strokeLinecap="round" />
          <circle r="5" fill="#e63946">
            <animateMotion dur="2.2s" repeatCount="indefinite">
              <mpath href="#pLinkPath" />
            </animateMotion>
          </circle>

          <g transform="translate(620,120)">
            <ellipse cx="100" cy="332" rx="90" ry="16" fill="#000" opacity="0.18" filter="url(#pSoft)" />
            <rect x="0" y="0" width="200" height="340" rx="30" fill="var(--js-phone-body)" stroke="var(--js-phone-edge)" strokeWidth="2.5" />
            <rect x="12" y="14" width="176" height="312" rx="20" fill="var(--js-phone-screen)" />
            <rect x="74" y="24" width="52" height="8" rx="4" fill="var(--js-phone-edge)" />
            <text x="100" y="60" textAnchor="middle" fill="#e63946" fontSize="11" fontWeight="700" letterSpacing="1">● MobilDiafon</text>
            <text x="100" y="84" textAnchor="middle" fill="var(--js-card-txt)" fontSize="12" fontWeight="600">YILDIZ APARTMANI</text>
            <g transform="translate(28,100)">
              <g className="js-res r1">
                <rect x="0" y="0" width="144" height="42" rx="11" fill="var(--js-card)" />
                <circle cx="24" cy="21" r="13" fill="#24345c" />
                <rect x="46" y="13" width="78" height="7" rx="3.5" fill="#3a4d76" />
                <rect x="46" y="25" width="50" height="6" rx="3" fill="#2a3a5e" />
              </g>
              <g className="js-res r2" transform="translate(0,52)">
                <g className="js-res-sel">
                  <rect x="0" y="0" width="144" height="42" rx="11" fill="#e63946" />
                  <circle cx="24" cy="21" r="13" fill="#fff" />
                  <path d="M24,15 a4,4 0 1,0 0.1,0 M17,29 c0,-5 14,-5 14,0" fill="#e63946" />
                  <rect x="46" y="13" width="78" height="7" rx="3.5" fill="#fff" />
                  <rect x="46" y="25" width="50" height="6" rx="3" fill="#ffd0d4" />
                </g>
              </g>
              <g className="js-res r3" transform="translate(0,104)">
                <rect x="0" y="0" width="144" height="42" rx="11" fill="var(--js-card)" />
                <circle cx="24" cy="21" r="13" fill="#24345c" />
                <rect x="46" y="13" width="78" height="7" rx="3.5" fill="#3a4d76" />
                <rect x="46" y="25" width="50" height="6" rx="3" fill="#2a3a5e" />
              </g>
            </g>
            <g className="js-wave" transform="translate(100,290)">
              <rect x="-40" y="-8" width="6" height="16" rx="3" fill="#e63946" />
              <rect x="-26" y="-16" width="6" height="32" rx="3" fill="#e63946" />
              <rect x="-12" y="-22" width="6" height="44" rx="3" fill="#e63946" />
              <rect x="6" y="-16" width="6" height="32" rx="3" fill="#e63946" />
              <rect x="20" y="-8" width="6" height="16" rx="3" fill="#e63946" />
              <rect x="34" y="-12" width="6" height="24" rx="3" fill="#e63946" />
            </g>
            <text x="100" y="318" textAnchor="middle" fill="#5fd38a" fontSize="12" fontWeight="700">● Bağlandı</text>
          </g>
        </svg>
      </div>

      <div className="js-steps">
        {STEPS.map((s, i) => (
          <div key={i} className={`js-step ${i === active ? "active" : ""} ${i < active ? "done" : ""}`}>
            <span className="js-step-dot">{s.icon}</span>
            <span className="js-step-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
