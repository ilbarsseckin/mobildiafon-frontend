"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="md-root">
      <header className="md-header">
        <div className="md-wrap md-nav">
          <div className="md-logo">
            <span>Mobil</span>
            <b>Diafon</b>
          </div>

          <nav className={`md-links ${menuOpen ? "open" : ""}`}>
            <a href="#how">Nasıl Çalışır?</a>
            <a href="#features">Kurumsal Avantajlar</a>
            <a href="#business">Kullanım Alanları</a>
            <a href="#download">İletişim</a>
          </nav>

          <button className="md-menu" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
      </header>

      <section className="md-hero">
        <div className="md-wrap md-hero-grid">
          <div className="md-hero-text">
            <span className="md-badge">Kurumsal Kapı İletişim Çözümü</span>

            <h1>
              Apartman ve Siteler İçin <br />
              <strong>QR Tabanlı Mobil Diafon Sistemi</strong>
            </h1>

            <p>
              MobilDiafon, ziyaretçilerin uygulama yüklemeden QR kod ile daire
              sakinlerine görüntülü ulaşmasını sağlayan modern, güvenli ve
              yönetilebilir kapı iletişim altyapısıdır.
            </p>

            <div className="md-actions">
              <a href="#download" className="md-btn primary">
                Demo Talep Et
              </a>
              <a href="#how" className="md-btn secondary">
                Sistemi İncele
              </a>
            </div>

            <div className="md-trust">
              <span>Yönetici onaylı kullanım</span>
              <span>Daire bazlı yetkilendirme</span>
              <span>Uygulamasız ziyaretçi deneyimi</span>
            </div>
          </div>

          <div className="md-panel-area">
            <div className="md-panel">
              <div className="md-panel-head">
                <div>
                  <small>MobilDiafon Panel</small>
                  <h3>Bina Giriş Yönetimi</h3>
                </div>
                <span>Aktif</span>
              </div>

              <div className="md-panel-row">
                <div>
                  <strong>Daire 5</strong>
                  <p>Ziyaretçi araması bekleniyor</p>
                </div>
                <button>Görüntülü</button>
              </div>

              <div className="md-panel-row">
                <div>
                  <strong>Daire 12</strong>
                  <p>2 sakin kayıtlı</p>
                </div>
                <button>Onaylı</button>
              </div>

              <div className="md-panel-box">
                <span>QR Kod Durumu</span>
                <strong>Kapı girişi için aktif</strong>
              </div>

              <div className="md-panel-stats">
                <div>
                  <strong>48</strong>
                  <span>Daire</span>
                </div>
                <div>
                  <strong>126</strong>
                  <span>Sakin</span>
                </div>
                <div>
                  <strong>7/24</strong>
                  <span>Erişim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="md-section">
        <div className="md-wrap md-center">
          <span className="md-label">Nasıl Çalışır?</span>
          <h2>Basit, hızlı ve yönetilebilir kurulum</h2>
          <p>
            MobilDiafon, bina girişlerine yerleştirilen QR kod üzerinden çalışır.
            Ziyaretçiler herhangi bir uygulama indirmeden daire sakinlerine
            görüntülü ulaşabilir.
          </p>
        </div>

        <div className="md-wrap md-steps">
          {[
            [
              "01",
              "QR Kod Tanımlanır",
              "Bina veya site için özel QR kod oluşturulur ve giriş alanına yerleştirilir.",
            ],
            [
              "02",
              "Daireler Sisteme Eklenir",
              "Yönetici panelinden daireler ve daire sakinleri güvenli şekilde tanımlanır.",
            ],
            [
              "03",
              "Ziyaretçi Görüntülü Arar",
              "Ziyaretçi QR kodu okutur, daireyi seçer ve görüntülü arama başlatır.",
            ],
          ].map(([n, title, desc]) => (
            <div className="md-card" key={n}>
              <div className="md-num">{n}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="md-section md-soft">
        <div className="md-wrap md-center">
          <span className="md-label">Kurumsal Avantajlar</span>
          <h2>Modern bina yönetimi için güçlü altyapı</h2>
        </div>

        <div className="md-wrap md-features">
          {[
            [
              "Panelsiz Kullanım",
              "Fiziksel diafon paneli veya ek kablolama ihtiyacını azaltır.",
            ],
            [
              "Yönetici Kontrollü Kayıt",
              "Bina yöneticisi sakinleri onaylar ve kayıt sürecini kontrol eder.",
            ],
            [
              "Daire Bazlı Yetkilendirme",
              "Her daire için birden fazla kullanıcı güvenli şekilde tanımlanabilir.",
            ],
            [
              "Uygulamasız Ziyaretçi Deneyimi",
              "Misafir, kurye veya ziyaretçi sadece QR kod ile arama başlatabilir.",
            ],
            [
              "Bulut Tabanlı Altyapı",
              "Sistem internet üzerinden yönetilir ve güncel kalır.",
            ],
            [
              "Uzaktan Görüntülü Yanıtlama",
              "Daire sakini evde olmasa bile gelen ziyaretçiyi yanıtlayabilir.",
            ],
          ].map(([title, desc]) => (
            <div className="md-feature" key={title}>
              <div className="md-line" />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="business" className="md-section">
        <div className="md-wrap md-center">
          <span className="md-label">Kullanım Alanları</span>
          <h2>Farklı yapı tipleri için tek çözüm</h2>
          <p>
            Apartmanlardan sitelere, ofislerden villalara kadar birçok giriş
            noktasında kolayca uygulanabilir.
          </p>

          <div className="md-chips">
            {["Apartman", "Site", "Villa", "Ofis", "Otel", "Klinik", "İşletme"].map(
              (item) => (
                <span key={item}>{item}</span>
              )
            )}
          </div>
        </div>
      </section>

      <section id="download" className="md-cta-section">
        <div className="md-wrap md-cta-box">
          <div>
            <span className="md-label light">MobilDiafon</span>
            <h2>Binanız için dijital kapı iletişimini başlatın</h2>
            <p>
              MobilDiafon ile binanıza özel QR kod oluşturabilir, daireleri
              tanımlayabilir ve ziyaretçi iletişimini daha güvenli hale
              getirebilirsiniz.
            </p>
          </div>

          <div className="md-store-buttons">
            <a href="mailto:info@mobildiafon.com">Demo Talep Et</a>
            <a href="https://wa.me/905555555555">WhatsApp ile Görüş</a>
          </div>
        </div>
      </section>

      <footer className="md-footer">
        <div className="md-wrap md-footer-grid">
          <div>
            <div className="md-logo footer">
              <span>Mobil</span>
              <b>Diafon</b>
            </div>
            <p>
              QR tabanlı, panelsiz ve kurumsal mobil diafon çözümü.
            </p>
          </div>

          <div>
            <h4>Bağlantılar</h4>
            <a href="#how">Nasıl Çalışır?</a>
            <a href="#features">Kurumsal Avantajlar</a>
            <a href="#business">Kullanım Alanları</a>
          </div>

          <div>
            <h4>İletişim</h4>
            <a href="mailto:info@mobildiafon.com">info@mobildiafon.com</a>
            <a href="https://wa.me/905555555555">WhatsApp ile yazın</a>
          </div>
        </div>

        <div className="md-copy">
          © 2026 MobilDiafon. Tüm hakları saklıdır.
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --navy: #101b33;
          --navy-soft: #172642;
          --red: #c73a45;
          --red-dark: #a62d38;
          --red-soft: #f7e8ea;
          --soft: #f6f7f9;
          --text: #1f2937;
          --muted: #667085;
          --border: #e5e7eb;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #fff;
          color: var(--text);
        }

        .md-wrap {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .md-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
        }

        .md-nav {
          height: 78px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .md-logo {
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .md-logo span {
          color: var(--navy);
        }

        .md-logo b {
          color: var(--red);
        }

        .md-links {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .md-links a {
          text-decoration: none;
          color: var(--navy);
          font-weight: 600;
          font-size: 15px;
        }

        .md-menu {
          display: none;
          background: transparent;
          border: 0;
          color: var(--navy);
          font-size: 28px;
        }

        .md-hero {
          padding: 96px 0 108px;
          background: linear-gradient(180deg, #ffffff 0%, #f6f7f9 100%);
          border-bottom: 1px solid var(--border);
        }

        .md-hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 70px;
          align-items: center;
        }

        .md-badge,
        .md-label {
          display: inline-flex;
          padding: 9px 14px;
          border-radius: 8px;
          background: var(--red-soft);
          color: var(--red);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .md-hero h1 {
          margin: 0 0 24px;
          color: var(--navy);
          font-size: clamp(40px, 5vw, 64px);
          line-height: 1.08;
          letter-spacing: -2.4px;
          font-weight: 800;
        }

        .md-hero h1 strong {
          color: var(--navy);
          font-weight: 800;
        }

        .md-hero p {
          max-width: 640px;
          margin: 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.75;
        }

        .md-actions {
          display: flex;
          gap: 14px;
          margin-top: 34px;
          flex-wrap: wrap;
        }

        .md-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 23px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 700;
          transition: 0.2s ease;
        }

        .md-btn.primary {
          background: var(--red);
          color: #fff;
        }

        .md-btn.primary:hover {
          background: var(--red-dark);
        }

        .md-btn.secondary {
          background: #fff;
          color: var(--navy);
          border: 1px solid var(--border);
        }

        .md-trust {
          display: grid;
          gap: 10px;
          margin-top: 34px;
          color: var(--navy);
          font-weight: 600;
          font-size: 15px;
        }

        .md-trust span {
          position: relative;
          padding-left: 18px;
        }

        .md-trust span::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
        }

        .md-panel-area {
          display: flex;
          justify-content: center;
        }

        .md-panel {
          width: min(100%, 430px);
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 22px;
          padding: 28px;
          box-shadow: 0 24px 60px rgba(16, 27, 51, 0.09);
        }

        .md-panel-head {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-start;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 20px;
        }

        .md-panel-head small {
          color: var(--muted);
          font-weight: 600;
        }

        .md-panel-head h3 {
          color: var(--navy);
          margin: 7px 0 0;
          font-size: 24px;
        }

        .md-panel-head span {
          background: #eef8f1;
          color: #15803d;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 13px;
          font-weight: 700;
        }

        .md-panel-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid var(--border);
        }

        .md-panel-row strong {
          color: var(--navy);
        }

        .md-panel-row p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 14px;
        }

        .md-panel-row button {
          border: 1px solid var(--border);
          background: #fff;
          color: var(--navy);
          border-radius: 8px;
          padding: 8px 10px;
          font-weight: 700;
        }

        .md-panel-box {
          margin-top: 20px;
          background: var(--soft);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 18px;
        }

        .md-panel-box span {
          display: block;
          color: var(--muted);
          font-size: 14px;
          margin-bottom: 6px;
        }

        .md-panel-box strong {
          color: var(--navy);
        }

        .md-panel-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 18px;
        }

        .md-panel-stats div {
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 15px 10px;
          text-align: center;
        }

        .md-panel-stats strong {
          display: block;
          color: var(--red);
          font-size: 22px;
          margin-bottom: 4px;
        }

        .md-panel-stats span {
          color: var(--muted);
          font-size: 13px;
        }

        .md-section {
          padding: 92px 0;
        }

        .md-soft {
          background: var(--soft);
        }

        .md-center {
          text-align: center;
        }

        .md-center h2,
        .md-cta-box h2 {
          margin: 0 0 16px;
          color: var(--navy);
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.16;
          letter-spacing: -1.5px;
        }

        .md-center p {
          max-width: 760px;
          margin: 0 auto;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.75;
        }

        .md-steps,
        .md-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 46px;
        }

        .md-card,
        .md-feature {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 30px;
          box-shadow: none;
          transition: 0.2s ease;
        }

        .md-card:hover,
        .md-feature:hover {
          box-shadow: 0 14px 30px rgba(16, 27, 51, 0.07);
        }

        .md-num {
          color: var(--red);
          font-size: 30px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .md-card h3,
        .md-feature h3 {
          color: var(--navy);
          margin: 0 0 11px;
          font-size: 20px;
        }

        .md-card p,
        .md-feature p {
          color: var(--muted);
          line-height: 1.7;
          margin: 0;
        }

        .md-line {
          width: 34px;
          height: 3px;
          border-radius: 999px;
          background: var(--red);
          margin-bottom: 18px;
        }

        .md-chips {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 34px;
        }

        .md-chips span {
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 13px 18px;
          background: #fff;
          color: var(--navy);
          font-weight: 700;
        }

        .md-cta-section {
          padding: 84px 0;
          background: #fff;
        }

        .md-cta-box {
          background: var(--navy);
          color: #fff;
          border-radius: 22px;
          padding: 52px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 34px;
          align-items: center;
        }

        .md-label.light {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .md-cta-box h2 {
          color: #fff;
        }

        .md-cta-box p {
          max-width: 650px;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.75;
          font-size: 17px;
          margin: 0;
        }

        .md-store-buttons {
          display: grid;
          gap: 12px;
          min-width: 220px;
        }

        .md-store-buttons a {
          background: var(--red);
          color: #fff;
          text-decoration: none;
          text-align: center;
          border-radius: 8px;
          padding: 15px 20px;
          font-weight: 800;
        }

        .md-store-buttons a:last-child {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.22);
        }

        .md-footer {
          background: #0d172d;
          color: #fff;
          padding: 58px 0 24px;
        }

        .md-footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr;
          gap: 42px;
        }

        .md-logo.footer span {
          color: #fff;
        }

        .md-footer p {
          color: rgba(255, 255, 255, 0.66);
          line-height: 1.7;
        }

        .md-footer h4 {
          margin: 0 0 16px;
          color: #fff;
        }

        .md-footer a {
          display: block;
          color: rgba(255, 255, 255, 0.68);
          text-decoration: none;
          margin-bottom: 10px;
        }

        .md-copy {
          margin-top: 38px;
          padding-top: 22px;
          border-top: 1px solid rgba(255, 255, 255, 0.11);
          text-align: center;
          color: rgba(255, 255, 255, 0.48);
          font-size: 14px;
        }

        @media (max-width: 900px) {
          .md-hero-grid,
          .md-cta-box,
          .md-footer-grid {
            grid-template-columns: 1fr;
          }

          .md-steps,
          .md-features {
            grid-template-columns: 1fr;
          }

          .md-links {
            display: none;
            position: absolute;
            top: 78px;
            left: 0;
            right: 0;
            background: #fff;
            padding: 22px;
            border-bottom: 1px solid var(--border);
          }

          .md-links.open {
            display: grid;
          }

          .md-menu {
            display: block;
          }

          .md-hero {
            padding: 64px 0 78px;
          }

          .md-panel {
            margin-top: 10px;
          }

          .md-cta-box {
            padding: 34px;
          }
        }
      `}</style>
    </main>
  );
}