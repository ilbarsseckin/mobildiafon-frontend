export const metadata = {
  title: "İletişim — MobilDiafon",
  description: "MobilDiafon iletişim bilgileri ve destek.",
};
const css = `
.gz{max-width:820px;margin:0 auto;padding:56px 22px 90px;font-family:var(--font-body,system-ui,sans-serif);color:#1f2937;line-height:1.65}
.gz h1{font-family:var(--font-display,inherit);font-size:30px;letter-spacing:-.02em;color:#14213D;margin:0 0 6px}
.gz .gz-date{color:#6b7280;font-size:13px;margin:0 0 28px}
.gz h2{font-family:var(--font-display,inherit);font-size:19px;color:#14213D;margin:34px 0 10px}
.gz p{margin:0 0 12px;font-size:15px}
.gz a{color:#E63946;text-decoration:underline;text-underline-offset:2px}
.gz .gz-fill{background:#fff4f5;border:1px dashed #E63946;color:#9a2530;border-radius:8px;padding:2px 7px;font-size:13px;font-weight:600}
.gz .gz-card{background:#f6f8fb;border:1px solid #e6ebf2;border-radius:14px;padding:22px 24px;margin:0 0 18px}
.gz .gz-row{display:flex;gap:10px;align-items:center;margin:0 0 12px;font-size:15px}
.gz .gz-row b{color:#14213D;min-width:90px}
.gz .gz-foot{margin-top:36px;color:#6b7280;font-size:13px;border-top:1px solid #e6ebf2;padding-top:16px}
`;
export default function IletisimPage() {
  return (
    <main className="gz">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <h1>İletişim</h1>
      <p className="gz-date">Sorularınız ve destek talepleriniz için bize ulaşın.</p>

      <div className="gz-card">
        <div className="gz-row"><b>Unvan</b><span>[AD SOYAD / İŞLETME ADI]</span></div>
        <div className="gz-row"><b>E-posta</b><a href="mailto:[İLETİŞİM E-POSTA]">[İLETİŞİM E-POSTA]</a></div>
        <div className="gz-row"><b>Telefon</b><span>[TELEFON]</span></div>
        <div className="gz-row"><b>Adres</b><span>[AÇIK ADRES]</span></div>
        <div className="gz-row"><b>Web</b><a href="https://mobildiafon.com">mobildiafon.com</a></div>
      </div>

      <h2>Destek</h2>
      <p>Teknik destek, abonelik ve hesap işlemleriyle ilgili sorularınız için <a href="mailto:[İLETİŞİM E-POSTA]">[İLETİŞİM E-POSTA]</a> adresine e-posta gönderebilirsiniz. Talebiniz en kısa sürede yanıtlanacaktır.</p>

      <h2>Yasal Belgeler</h2>
      <p>
        <a href="/kullanim-sartlari">Kullanım Şartları</a> ·{" "}
        <a href="/mesafeli-satis">Mesafeli Satış Sözleşmesi</a> ·{" "}
        <a href="/kvkk">KVKK Aydınlatma Metni</a> ·{" "}
        <a href="/gizlilik">Gizlilik Politikası</a>
      </p>

      <p className="gz-foot">MobilDiafon — Kapınızı dijitalleştirin.</p>
    </main>
  );
}
