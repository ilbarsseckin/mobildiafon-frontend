"use client";

import { useState } from "react";

const content = {
  tr: {
    nav: { how: "Nasıl Çalışır", features: "Özellikler", audience: "Kimler İçin", download: "İndir" },
    hero: {
      title1: "Diafon Artık",
      title2: "Cebinizde",
      sub: "Panele gerek yok, ziyaretçinin uygulamasına gerek yok. QR kodu okutan kişi sizi telefonunuzdan görüntülü arar. Apartman, site, villa ve işletmeler için modern kapı iletişimi.",
      cta1: "Hemen Başla",
      cta2: "Nasıl Çalışır?",
      phoneTitle: "Daire 5 — Ziyaretçi",
      phoneSub: "görüntülü arıyor...",
    },
    how: {
      eyebrow: "Nasıl Çalışır",
      title: "Üç adımda kapı iletişimi",
      lead: "Kurulum yok, kablo yok, panel yok. QR kodunuzu kapıya asın, gerisi telefonda.",
      steps: [
        { n: "01", t: "QR Kodu Okut", d: "Ziyaretçi kapıdaki QR kodu telefon kamerasıyla okutur. Uygulama indirmesine gerek yoktur." },
        { n: "02", t: "Daireyi Seç", d: "Açılan sayfada binadaki daireleri görür ve aramak istediği daireyi seçer." },
        { n: "03", t: "Görüntülü Görüş", d: "Dairedeki herkesin telefonu çalar. İlk açan kişi ziyaretçiyle görüntülü konuşur." },
      ],
    },
    features: {
      eyebrow: "Özellikler",
      title: "Neden Mobil Diafon?",
      items: [
        { t: "Panel Gerektirmez", d: "Duvara monte panel, kablo tesisatı yok. Sadece bir QR kod yeterli." },
        { t: "Ziyaretçiye Uygulama Yok", d: "Kargocu, misafir, komşu — herkes tarayıcıdan arar. İndirme zorunluluğu yok." },
        { t: "Çoklu Sakin", d: "Bir dairede birden çok kişi olabilir. Çağrı hepsinde çalar, ilk açan görüşür." },
        { t: "Yönetici Onayı", d: "Site yöneticisi binayı kurar, katılan sakinleri onaylar. Sahte kayıt engellenir." },
        { t: "Her Yerden Cevapla", d: "Evde olmasanız bile kapınızı yanıtlayın. Telefonunuz nerede, kapınız orada." },
        { t: "Güvenli Görüşme", d: "Görüşmeler şifreli bağlantı üzerinden yapılır. Konum ve kimlik korunur." },
      ],
    },
    audience: {
      eyebrow: "Kimler İçin",
      title: "Her kapı için bir çözüm",
      lead: "Tek bir sistem, birçok kullanım. İhtiyacınız ne olursa olsun kapınız telefonunuzda.",
      chips: ["Apartman", "Site", "Villa", "Otel", "İşyeri"],
    },
    ai: { title: "Aklınıza takılan bir şey mi var?", sub: "Yapay zekâ asistanımıza sorun — Mobil Diafon hakkında merak ettiğiniz her şeyi anında yanıtlasın.", btn: "Asistana Sor" },
    download: { eyebrow: "İndir", title: "Mobil Diafon'u edinin", lead: "Sakin olarak katılmak için uygulamayı indirin. Ziyaretçiler uygulamasız, tarayıcıdan arar.", soon: "Yakında" },
    footer: { about: "Konum ve QR tabanlı panelsiz mobil diafon sistemi. Kapınızı her yerden, telefonunuzdan yanıtlayın.", links: "Bağlantılar", contact: "İletişim", wa: "WhatsApp ile yazın", rights: "Tüm hakları saklıdır.", privacy: "Gizlilik Politikası" },
  },
  en: {
    nav: { how: "How It Works", features: "Features", audience: "Who It's For", download: "Download" },
    hero: {
      title1: "Your Intercom Is Now",
      title2: "In Your Pocket",
      sub: "No panel needed, no app needed for visitors. Anyone who scans your QR code can video-call you on your phone. Modern door communication for apartments, complexes, villas and businesses.",
      cta1: "Get Started",
      cta2: "How It Works?",
      phoneTitle: "Flat 5 — Visitor",
      phoneSub: "video calling...",
    },
    how: {
      eyebrow: "How It Works",
      title: "Door communication in three steps",
      lead: "No installation, no wiring, no panel. Put your QR code on the door, the rest happens on your phone.",
      steps: [
        { n: "01", t: "Scan the QR Code", d: "The visitor scans the QR code at the door with their phone camera. No app download required." },
        { n: "02", t: "Choose the Flat", d: "On the page that opens, they see the flats in the building and select the one they want to call." },
        { n: "03", t: "Video Call", d: "Everyone in the flat's phone rings. The first to answer talks with the visitor over video." },
      ],
    },
    features: {
      eyebrow: "Features",
      title: "Why Mobil Diafon?",
      items: [
        { t: "No Panel Required", d: "No wall-mounted panel, no wiring. A single QR code is enough." },
        { t: "No App for Visitors", d: "Couriers, guests, neighbors — everyone calls from the browser. No download needed." },
        { t: "Multiple Residents", d: "A flat can have multiple people. The call rings on all, the first to answer talks." },
        { t: "Manager Approval", d: "The manager sets up the building and approves residents. Fake registrations are blocked." },
        { t: "Answer Anywhere", d: "Answer your door even when you're not home. Wherever your phone is, your door is too." },
        { t: "Secure Calls", d: "Calls run over an encrypted connection. Location and identity stay protected." },
      ],
    },
    audience: {
      eyebrow: "Who It's For",
      title: "A solution for every door",
      lead: "One system, many uses. Whatever your need, your door is on your phone.",
      chips: ["Apartment", "Complex", "Villa", "Hotel", "Business"],
    },
    ai: { title: "Have a question?", sub: "Ask our AI assistant — get instant answers to anything you wonder about Mobil Diafon.", btn: "Ask the Assistant" },
    download: { eyebrow: "Download", title: "Get Mobil Diafon", lead: "Download the app to join as a resident. Visitors call from the browser, no app needed.", soon: "Soon" },
    footer: { about: "Location and QR based panel-free mobile intercom system. Answer your door from anywhere, on your phone.", links: "Links", contact: "Contact", wa: "Message on WhatsApp", rights: "All rights reserved.", privacy: "Privacy Policy" },
  },
};

export default function Home() {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [menuOpen, setMenuOpen] = useState(false);
  const t = content[lang];

  return (
    <div className="md-root">
      {/* HEADER */}
      <header className="md-header">
        <div className="md-wrap md-nav">
          <div className="md-logo">
            <span className="m">Mobil</span><span className="d">Diafon</span>
          </div>
          <nav className={`md-nav-links ${menuOpen ? "open" : ""}`}>
            <a href="#how" onClick={() => setMenuOpen(false)}>{t.nav.how}</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>{t.nav.features}</a>
            <a href="#audience" onClick={() => setMenuOpen(false)}>{t.nav.audience}</a>
            <a href="#download" onClick={() => setMenuOpen(false)}>{t.nav.download}</a>
            <button className="md-lang" onClick={() => setLang(lang === "tr" ? "en" : "tr")}>
              {lang === "tr" ? "EN" : "TR"}
            </button>
          </nav>
          <button className="md-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1B2A4A" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="md-hero">
        <div className="md-wrap md-hero-inner">
          <div>
            <h1 className="md-h1">{t.hero.title1}<br /><span className="accent">{t.hero.title2}</span></h1>
            <p className="md-sub">{t.hero.sub}</p>
            <div className="md-cta">
              <a href="#download" className="md-btn md-btn-primary">{t.hero.cta1}</a>
              <a href="#how" className="md-btn md-btn-ghost">{t.hero.cta2}</a>
            </div>
          </div>
          <div className="md-visual">
            <div className="md-wave w1"></div>
            <div className="md-wave w2"></div>
            <div className="md-phone">
              <div className="md-screen">
                <div className="md-bell">
                  <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 2a6 6 0 00-6 6c0 7-3 9-3 9h18s-3-2-3-9a6 6 0 00-6-6zm0 20a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22z"/></svg>
                </div>
                <div className="md-ptxt">{t.hero.phoneTitle}</div>
                <div className="md-psub">{t.hero.phoneSub}</div>
                <div className="md-pactions">
                  <div className="pa redb"><svg viewBox="0 0 24 24" fill="#fff"><path d="M21 15.46l-5.27-.61-2.52 2.52a15.05 15.05 0 01-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z"/></svg></div>
                  <div className="pa green"><svg viewBox="0 0 24 24" fill="#fff"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z"/></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="md-section">
        <div className="md-wrap md-center">
          <div className="md-eyebrow">{t.how.eyebrow}</div>
          <h2 className="md-title">{t.how.title}</h2>
          <p className="md-lead md-lead-center">{t.how.lead}</p>
        </div>
        <div className="md-wrap md-steps">
          {t.how.steps.map((s, i) => (
            <div key={i} className="md-step">
              <div className="md-step-num">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="md-section md-features-sec">
        <div className="md-wrap md-center">
          <div className="md-eyebrow">{t.features.eyebrow}</div>
          <h2 className="md-title">{t.features.title}</h2>
        </div>
        <div className="md-wrap md-features">
          {t.features.items.map((f, i) => (
            <div key={i} className="md-feature">
              <h3>{f.t}</h3>
              <p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AUDIENCE */}
      <section id="audience" className="md-section">
        <div className="md-wrap md-center">
          <div className="md-eyebrow">{t.audience.eyebrow}</div>
          <h2 className="md-title">{t.audience.title}</h2>
          <p className="md-lead md-lead-center">{t.audience.lead}</p>
          <div className="md-audience">
            {t.audience.chips.map((c, i) => (
              <div key={i} className="md-chip">{c}</div>
            ))}
          </div>
        </div>
      </section>

      {/* AI BAND */}
      <section className="md-section" style={{ paddingTop: 0 }}>
        <div className="md-wrap">
          <div className="md-ai">
            <div>
              <h3>{t.ai.title}</h3>
              <p>{t.ai.sub}</p>
            </div>
            <button className="md-btn md-btn-primary" onClick={() => alert(lang === "tr" ? "Yapay zekâ asistanı çok yakında!" : "AI assistant coming soon!")}>{t.ai.btn}</button>
          </div>
        </div>
      </section>

      {/* DOWNLOAD */}
      <section id="download" className="md-section md-center">
        <div className="md-wrap">
          <div className="md-eyebrow">{t.download.eyebrow}</div>
          <h2 className="md-title">{t.download.title}</h2>
          <p className="md-lead md-lead-center">{t.download.lead}</p>
          <div className="md-stores">
            <a href="#" className="md-store">
              <span><span className="st-small">{t.download.soon}</span><span className="st-big">Google Play</span></span>
            </a>
            <a href="#" className="md-store">
              <span><span className="st-small">{t.download.soon}</span><span className="st-big">App Store</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="md-footer">
        <div className="md-wrap">
          <div className="md-foot-grid">
            <div>
              <div className="md-foot-logo">Mobil<span className="d">Diafon</span></div>
              <p className="md-foot-about">{t.footer.about}</p>
            </div>
            <div className="md-foot-col">
              <h4>{t.footer.links}</h4>
              <a href="#how">{t.nav.how}</a>
              <a href="#features">{t.nav.features}</a>
              <a href="#audience">{t.nav.audience}</a>
              <a href="#download">{t.nav.download}</a>
            </div>
            <div className="md-foot-col">
              <h4>{t.footer.contact}</h4>
              <a href="mailto:info@mobildiafon.com">info@mobildiafon.com</a>
              <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer">{t.footer.wa}</a>
            </div>
          </div>
          <div className="md-foot-bottom">
            <span>© 2026 Mobil Diafon. {t.footer.rights}</span>
            <a href="#">{t.footer.privacy}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
