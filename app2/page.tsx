<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MobilDiafon — Görsel Giriş (v2)</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  :root{
    --navy:#1B2A4A; --navy-deep:#14213D; --red:#E63946; --red-dark:#CC2F3C;
    --red-soft:#FDEEF0; --ink:#1A1A2E; --gray:#5A6478; --line:#E6E9F0; --soft:#F7F9FC;
    --display:"Sora",-apple-system,Segoe UI,Roboto,sans-serif;
    --body:"Inter",-apple-system,Segoe UI,Roboto,sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:var(--body);color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased}
  a{text-decoration:none;color:inherit}
  .wrap{width:min(1160px,calc(100% - 40px));margin:0 auto}

  /* ---------- HEADER ---------- */
  .hdr{position:sticky;top:0;z-index:60;background:rgba(255,255,255,.82);
       backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
  .nav{height:74px;display:flex;align-items:center;justify-content:space-between;gap:20px}
  .logo{font-family:var(--display);font-size:23px;font-weight:800;letter-spacing:-.03em;color:var(--navy)}
  .logo b{color:var(--red);font-weight:800}
  .links{display:flex;align-items:center;gap:30px}
  .links a{color:var(--gray);font-weight:600;font-size:15px;transition:color .2s}
  .links a:hover{color:var(--navy)}
  .nav-right{display:flex;align-items:center;gap:12px}
  .login{display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
         border-radius:10px;padding:9px 14px;font:600 14px var(--body);color:var(--navy);cursor:pointer;transition:border-color .2s}
  .login:hover{border-color:var(--navy)}
  .menu{display:none;background:none;border:none;font-size:26px;color:var(--navy);cursor:pointer}

  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:11px;
       font:700 15px var(--body);cursor:pointer;transition:all .2s;border:1px solid transparent;padding:11px 20px}
  .btn.lg{padding:15px 26px;font-size:16px}
  .btn.primary{background:var(--red);color:#fff}
  .btn.primary:hover{background:var(--red-dark);transform:translateY(-2px);box-shadow:0 14px 30px -12px rgba(230,57,70,.6)}
  .btn.ghost{background:#fff;color:var(--navy);border-color:var(--line)}
  .btn.ghost:hover{border-color:var(--navy)}

  /* ---------- HERO ---------- */
  .hero{position:relative;overflow:hidden;background:linear-gradient(180deg,#fff 0%,var(--soft) 100%)}
  /* depth: layered glows + dot grid */
  .hero::before{content:"";position:absolute;inset:0;
    background:
      radial-gradient(620px 420px at 88% -8%, rgba(27,42,74,.10), transparent 60%),
      radial-gradient(520px 420px at 78% 78%, rgba(230,57,70,.09), transparent 60%);
    pointer-events:none}
  .hero::after{content:"";position:absolute;inset:0;opacity:.5;pointer-events:none;
    background-image:radial-gradient(rgba(27,42,74,.07) 1px,transparent 1px);
    background-size:22px 22px;
    -webkit-mask-image:linear-gradient(180deg,#000,transparent 70%);
            mask-image:linear-gradient(180deg,#000,transparent 70%)}
  .hero-grid{position:relative;z-index:1;display:grid;grid-template-columns:1.05fr .95fr;
             gap:48px;align-items:center;padding:78px 0 90px}

  .eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);
           border-radius:30px;padding:7px 13px 7px 11px;font-weight:700;font-size:12.5px;letter-spacing:.04em;
           color:var(--navy);box-shadow:0 6px 18px -12px rgba(27,42,74,.4)}
  .eyebrow .dot{width:7px;height:7px;border-radius:50%;background:var(--red);box-shadow:0 0 0 0 rgba(230,57,70,.5);
                animation:pulse 1.9s infinite}
  @keyframes pulse{70%{box-shadow:0 0 0 7px rgba(230,57,70,0)}100%{box-shadow:0 0 0 0 rgba(230,57,70,0)}}

  h1{font-family:var(--display);margin:18px 0 0;font-size:clamp(38px,5.2vw,60px);line-height:1.03;
     letter-spacing:-.035em;color:var(--navy-deep);font-weight:800;animation:up .6s ease both}
  h1 .accent{color:var(--red)}
  .lead{margin:22px 0 0;max-width:540px;font-size:clamp(16px,1.5vw,18.5px);color:var(--gray);
        line-height:1.65;animation:up .6s .08s ease both}
  .actions{display:flex;gap:14px;margin-top:32px;flex-wrap:wrap;animation:up .6s .16s ease both}
  .trust{list-style:none;display:flex;flex-wrap:wrap;gap:22px;margin-top:32px;animation:up .6s .24s ease both}
  .trust li{position:relative;padding-left:22px;color:var(--navy);font-weight:600;font-size:14.5px}
  .trust li::before{content:"";position:absolute;left:0;top:50%;transform:translateY(-50%);
                    width:8px;height:8px;border-radius:50%;background:var(--red)}
  @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

  /* ---------- SIGNATURE VISUAL: ping → signal → ring → açıldı ---------- */
  .stage{position:relative;min-height:460px;display:flex;align-items:center;justify-content:center}

  /* building / QR node (left) */
  .node{position:absolute;left:2%;top:20%;width:118px;border-radius:18px;background:#fff;
         border:1px solid var(--line);box-shadow:0 24px 50px -22px rgba(27,42,74,.5);padding:14px;z-index:3}
  .node-cam{height:60px;border-radius:12px;background:var(--navy-deep);display:flex;align-items:center;justify-content:center;color:#fff}
  .node-qr{margin-top:10px;height:54px;border-radius:10px;
           background:
             linear-gradient(90deg,var(--ink) 2px,transparent 0) 0 0/12px 12px,
             linear-gradient(var(--ink) 2px,transparent 0) 0 0/12px 12px,#fff;
           border:1px solid var(--line);opacity:.9}
  .node-label{margin-top:9px;text-align:center;font-size:11px;font-weight:700;color:var(--gray);letter-spacing:.02em}

  /* ping rings emitting from node */
  .pings{position:absolute;left:calc(2% + 59px);top:calc(20% + 46px);transform:translate(-50%,-50%);z-index:1}
  .pings span{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.4);
              border:1.5px solid rgba(230,57,70,.30);border-radius:50%;animation:ping 3s ease-out infinite}
  .pings .p1{width:150px;height:150px;animation-delay:0s}
  .pings .p2{width:260px;height:260px;animation-delay:.7s}
  .pings .p3{width:380px;height:380px;animation-delay:1.4s}
  @keyframes ping{0%{opacity:.65;transform:translate(-50%,-50%) scale(.4)}100%{opacity:0;transform:translate(-50%,-50%) scale(1)}}

  /* signal arc connecting node → phone */
  .signal{position:absolute;inset:0;z-index:2;pointer-events:none}
  .signal path{fill:none;stroke:var(--red);stroke-width:2.2;stroke-linecap:round;
               stroke-dasharray:7 11;opacity:.55;animation:flow 1.1s linear infinite}
  @keyframes flow{to{stroke-dashoffset:-36}}

  /* phone (right) */
  .phone{position:relative;z-index:4;width:246px;height:418px;background:var(--navy-deep);border-radius:38px;
         padding:11px;box-shadow:0 44px 90px -30px rgba(27,42,74,.6);margin-left:auto;animation:float 5s ease-in-out infinite}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
  .screen{width:100%;height:100%;border-radius:28px;overflow:hidden;position:relative;
          background:linear-gradient(168deg,#243d68 0%,#1b2a4a 60%,#14213d 100%);
          display:flex;flex-direction:column;align-items:center;padding:26px 20px}
  .notch{position:absolute;top:11px;left:50%;transform:translateX(-50%);width:74px;height:6px;border-radius:6px;background:rgba(255,255,255,.18)}
  .scr-top{margin-top:14px;color:#9FB3D6;font-size:11.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}
  .bell{width:78px;height:78px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;
        margin-top:24px;animation:ring 1.8s infinite}
  .bell svg{animation:shake 1.8s infinite;transform-origin:50% 12%}
  @keyframes ring{0%{box-shadow:0 0 0 0 rgba(230,57,70,.5)}70%{box-shadow:0 0 0 22px rgba(230,57,70,0)}100%{box-shadow:0 0 0 0 rgba(230,57,70,0)}}
  @keyframes shake{0%,30%,100%{transform:rotate(0)}5%,15%,25%{transform:rotate(11deg)}10%,20%{transform:rotate(-11deg)}}
  .who{color:#fff;font-family:var(--display);font-weight:700;font-size:18px;margin-top:20px}
  .sub{color:#9FB3D6;font-size:13px;margin-top:3px}
  .call-actions{display:flex;gap:26px;margin-top:22px}
  .ca{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff}
  .ca.red{background:#E63946}.ca.green{background:#2BB673}
  .door{margin-top:auto;display:inline-flex;align-items:center;gap:7px;background:rgba(255,255,255,.12);color:#fff;
        border:1px solid rgba(255,255,255,.18);border-radius:30px;padding:9px 15px;font-size:12.5px;font-weight:600}

  /* "Kapı açıldı" toast */
  .opened{position:absolute;right:-6px;bottom:64px;z-index:5;display:inline-flex;align-items:center;gap:8px;
          background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px 14px;font-weight:700;font-size:13px;
          color:var(--navy-deep);box-shadow:0 22px 50px -20px rgba(27,42,74,.5);
          opacity:0;animation:toast 6s ease-in-out infinite}
  .opened .ok{width:22px;height:22px;border-radius:50%;background:#2BB673;display:flex;align-items:center;justify-content:center;color:#fff}
  @keyframes toast{0%,55%{opacity:0;transform:translateY(8px)}65%,90%{opacity:1;transform:none}100%{opacity:0;transform:translateY(8px)}}

  /* ---------- RESPONSIVE ---------- */
  @media (max-width:920px){
    .links,.nav-right .login{display:none}
    .menu{display:block}
    .hero-grid{grid-template-columns:1fr;text-align:center;padding:54px 0 64px;gap:36px}
    .lead{margin-left:auto;margin-right:auto}
    .actions,.trust{justify-content:center}
    .stage{min-height:420px;margin-top:8px}
    .node{left:0}
    .pings{left:59px}
  }
  @media (prefers-reduced-motion:reduce){
    *{animation:none!important}
    .opened{opacity:1}
  }
</style>
</head>
<body>

<header class="hdr">
  <div class="wrap nav">
    <a href="#" class="logo">Mobil<b>Diafon</b></a>
    <nav class="links">
      <a href="#how">Nasıl Çalışır?</a>
      <a href="#features">Özellikler</a>
      <a href="#pricing">Fiyatlandırma</a>
      <a href="#faq">SSS</a>
    </nav>
    <div class="nav-right">
      <button class="login">
        Giriş Yap
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none"><path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <a href="#" class="btn primary">14 Gün Ücretsiz Dene</a>
    </div>
    <button class="menu" aria-label="Menü">☰</button>
  </div>
</header>

<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <span class="eyebrow"><span class="dot"></span>Donanım gerektirmeyen mobil diafon</span>
      <h1>Diafonu duvardan kaldırdık,<br><span class="accent">telefonunuza taşıdık.</span></h1>
      <p class="lead">
        MobilDiafon; panel, kablolama ve özel donanım gerektirmeyen, QR ve konum
        tabanlı görüntülü kapı iletişim sistemidir. Ziyaretçi uygulama indirmeden
        sizi arar, Tuya entegrasyonuyla kapınızı uzaktan açarsınız.
      </p>
      <div class="actions">
        <a href="#" class="btn primary lg">
          14 Gün Ücretsiz Dene
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <a href="#how" class="btn ghost lg">Nasıl çalışır?</a>
      </div>
      <ul class="trust">
        <li>Donanım ve panel yok</li>
        <li>Güçlü bulut altyapısı</li>
        <li>Tuya ile kapı açma</li>
      </ul>
    </div>

    <div class="stage">
      <!-- ping rings -->
      <div class="pings"><span class="p1"></span><span class="p2"></span><span class="p3"></span></div>

      <!-- building / QR node -->
      <div class="node">
        <div class="node-cam">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none"><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" stroke="#fff" stroke-width="1.6"/><circle cx="12" cy="13" r="3.4" stroke="#fff" stroke-width="1.6"/></svg>
        </div>
        <div class="node-qr"></div>
        <div class="node-label">Apartman Girişi</div>
      </div>

      <!-- signal arc -->
      <svg class="signal" viewBox="0 0 440 460" preserveAspectRatio="none">
        <path d="M70 150 C 180 130, 200 250, 320 250" />
      </svg>

      <!-- phone -->
      <div class="phone">
        <div class="screen">
          <div class="notch"></div>
          <div class="scr-top">Gelen görüntülü çağrı</div>
          <div class="bell">
            <svg viewBox="0 0 24 24" width="34" height="34" fill="#fff"><path d="M12 2a6 6 0 0 0-6 6v3.6L4.3 15a1 1 0 0 0 .9 1.5h13.6a1 1 0 0 0 .9-1.5L18 11.6V8a6 6 0 0 0-6-6Zm0 20a2.6 2.6 0 0 0 2.5-2h-5A2.6 2.6 0 0 0 12 22Z"/></svg>
          </div>
          <div class="who">Apartman Girişi</div>
          <div class="sub">Daire 12 · Ziyaretçi</div>
          <div class="call-actions">
            <span class="ca red"><svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M21 15.5c-1.2 0-2.4-.2-3.6-.6a1 1 0 0 0-1 .2l-1.5 1.5a14 14 0 0 1-6-6l1.5-1.5a1 1 0 0 0 .2-1A11 11 0 0 1 9.5 3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1A17 17 0 0 0 21 21a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z" transform="rotate(135 12 12)"/></svg></span>
            <span class="ca green"><svg viewBox="0 0 24 24" width="20" height="20" fill="#fff"><path d="M21 15.5c-1.2 0-2.4-.2-3.6-.6a1 1 0 0 0-1 .2l-1.5 1.5a14 14 0 0 1-6-6l1.5-1.5a1 1 0 0 0 .2-1A11 11 0 0 1 9.5 3a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1A17 17 0 0 0 21 21a1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1Z"/></svg></span>
          </div>
          <div class="door">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none"><path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M5 21h12M5 21H3m13 0h2m-6-9h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Tuya ile kapıyı aç
          </div>
        </div>
      </div>

      <!-- opened toast -->
      <div class="opened"><span class="ok"><svg viewBox="0 0 20 20" width="13" height="13" fill="none"><path d="M5 10.5l3 3 7-7" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Kapı açıldı</div>
    </div>
  </div>
</section>

</body>
</html>