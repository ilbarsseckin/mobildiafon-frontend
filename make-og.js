const fs = require('fs');
const sharp = require('sharp');

// Logo'yu base64'e cevir (koyu zemin icin acik logo)
const logoPath = 'public/logo-light.png';
const logoB64 = fs.readFileSync(logoPath).toString('base64');
const logoUri = `data:image/png;base64,${logoB64}`;

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#14213D"/>
      <stop offset="55%" stop-color="#0c1830"/>
      <stop offset="100%" stop-color="#0a1326"/>
    </linearGradient>
    <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2c4e"/>
      <stop offset="100%" stop-color="#0e1c38"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E63946" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#E63946" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E63946" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#E63946" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g stroke="#2a3d63" stroke-width="1" opacity="0.25">
    <line x1="0" y1="105" x2="1200" y2="105"/><line x1="0" y1="210" x2="1200" y2="210"/>
    <line x1="0" y1="315" x2="1200" y2="315"/><line x1="0" y1="420" x2="1200" y2="420"/>
    <line x1="0" y1="525" x2="1200" y2="525"/>
    <line x1="150" y1="0" x2="150" y2="630"/><line x1="300" y1="0" x2="300" y2="630"/>
    <line x1="450" y1="0" x2="450" y2="630"/><line x1="600" y1="0" x2="600" y2="630"/>
    <line x1="750" y1="0" x2="750" y2="630"/><line x1="900" y1="0" x2="900" y2="630"/>
    <line x1="1050" y1="0" x2="1050" y2="630"/>
  </g>
  <circle cx="920" cy="315" r="280" fill="url(#glow)"/>

  <!-- GERCEK LOGO -->
  <image x="80" y="78" width="340" height="auto" xlink:href="${logoUri}"/>

  <text x="80" y="280" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#ffffff">Diafon Artık</text>
  <text x="80" y="360" font-family="Arial, sans-serif" font-size="68" font-weight="800" fill="#E63946">Cebinizde</text>
  <text x="80" y="430" font-family="Arial, sans-serif" font-size="27" fill="#9fb3d4">QR ve Konum Tabanlı Dijital Diafon</text>
  <g font-family="Arial, sans-serif" font-size="20" font-weight="600">
    <rect x="80" y="478" width="180" height="46" rx="23" fill="#1d2b4a"/><text x="110" y="507" fill="#cdd9ef">QR ile Bul</text>
    <rect x="276" y="478" width="220" height="46" rx="23" fill="#1d2b4a"/><text x="306" y="507" fill="#cdd9ef">Görüntülü Arama</text>
    <rect x="512" y="478" width="160" height="46" rx="23" fill="#1d2b4a"/><text x="542" y="507" fill="#cdd9ef">Kapı Aç</text>
  </g>

  <g transform="translate(820,150)">
    <rect x="0" y="0" width="230" height="340" rx="32" fill="#0a1326" stroke="#2a3d63" stroke-width="3"/>
    <rect x="12" y="14" width="206" height="312" rx="24" fill="url(#phoneScreen)"/>
    <rect x="88" y="28" width="54" height="8" rx="4" fill="#2a3d63"/>
    <text x="115" y="72" text-anchor="middle" font-family="Arial" font-size="15" font-weight="700" fill="#E63946">● MobilDiafon</text>
    <g transform="translate(62,95)">
      <rect x="0" y="0" width="106" height="106" rx="12" fill="#0c1830" stroke="#2a3d63" stroke-width="2"/>
      <g fill="#cdd9ef">
        <rect x="14" y="14" width="26" height="26" rx="3"/><rect x="66" y="14" width="26" height="26" rx="3"/>
        <rect x="14" y="66" width="26" height="26" rx="3"/>
        <rect x="20" y="20" width="14" height="14" fill="#0c1830"/><rect x="72" y="20" width="14" height="14" fill="#0c1830"/>
        <rect x="20" y="72" width="14" height="14" fill="#0c1830"/>
        <rect x="56" y="56" width="9" height="9"/><rect x="70" y="56" width="9" height="9"/>
        <rect x="84" y="68" width="9" height="9"/><rect x="56" y="82" width="9" height="9"/><rect x="70" y="82" width="9" height="9"/>
      </g>
      <path d="M-8 20 L-8 -8 L20 -8 M86 -8 L114 -8 L114 20 M114 86 L114 114 L86 114 M20 114 L-8 114 L-8 86" stroke="#E63946" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
    <text x="115" y="240" text-anchor="middle" font-family="Arial" font-size="14" fill="#9fb3d4">Kapıdaki kodu okutun</text>
    <g transform="translate(115,275)">
      <circle cx="0" cy="0" r="22" fill="url(#pinGlow)"/><circle cx="0" cy="0" r="14" fill="#1fc77d"/>
      <path d="M-6 0 l4 4 l8 -9" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="115" y="318" text-anchor="middle" font-family="Arial" font-size="14" font-weight="700" fill="#5fd38a">Bağlandı</text>
  </g>
  <g transform="translate(770,180)">
    <circle cx="0" cy="0" r="44" fill="url(#pinGlow)"/>
    <path d="M0 -26 C14 -26 24 -15 24 -2 C24 14 0 30 0 30 C0 30 -24 14 -24 -2 C-24 -15 -14 -26 0 -26 Z" fill="#E63946"/>
    <circle cx="0" cy="-2" r="9" fill="#fff"/>
  </g>
  <text x="80" y="585" font-family="Arial, sans-serif" font-size="24" font-weight="600" fill="#6b80a8">mobildiafon.com</text>
</svg>`;

sharp(Buffer.from(svg)).png().toFile('public/og-image.png')
  .then(() => console.log('og-image.png OLUSTU'))
  .catch(e => console.error('HATA:', e.message));
