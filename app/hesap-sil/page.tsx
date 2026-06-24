// Kaydet: app/hesap-sil/page.tsx  →  yayınlanınca URL: https://mobildiafon.com/hesap-sil
// Bu URL'yi Play Console "Veri güvenliği → Hesap silme URL'si" alanına gir.
// Google'ın istediği 3 şart bu sayfada karşılanır: (1) uygulama/geliştirici adına atıf,
// (2) silme adımlarının net anlatımı, (3) silinen/saklanan veriler ve süreler.
// [DOLDUR] alanlarını gerçek bilgilerle değiştir.

export const metadata = {
  title: "Hesap ve Veri Silme — MobilDiafon",
  description:
    "MobilDiafon / Diafon hesabınızı ve ilişkili verilerinizi nasıl silebileceğinizi açıklar.",
};

const css = `
.hs{max-width:820px;margin:0 auto;padding:56px 22px 90px;font-family:var(--font-body,system-ui,sans-serif);color:#1f2937;line-height:1.65}
.hs h1{font-family:var(--font-display,inherit);font-size:30px;letter-spacing:-.02em;color:#14213D;margin:0 0 6px}
.hs .hs-sub{color:#6b7280;font-size:14px;margin:0 0 28px}
.hs h2{font-family:var(--font-display,inherit);font-size:19px;color:#14213D;margin:32px 0 10px}
.hs p{margin:0 0 12px;font-size:15px}
.hs ol,.hs ul{margin:0 0 14px;padding-left:22px}
.hs li{margin:0 0 8px;font-size:15px}
.hs a{color:#E63946;text-decoration:underline;text-underline-offset:2px}
.hs .hs-fill{background:#fff4f5;border:1px dashed #E63946;color:#9a2530;border-radius:8px;padding:2px 7px;font-size:13px;font-weight:600}
.hs .hs-box{background:#f6f8fb;border:1px solid #e6ebf2;border-radius:12px;padding:16px 18px;margin:0 0 18px}
.hs table{width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px}
.hs th,.hs td{border:1px solid #e6ebf2;padding:9px 11px;text-align:left;vertical-align:top}
.hs th{background:#f6f8fb;color:#14213D;font-weight:700}
.hs .hs-foot{margin-top:36px;color:#6b7280;font-size:13px;border-top:1px solid #e6ebf2;padding-top:16px}
`;

export default function HesapSilPage() {
  return (
    <main className="hs">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <h1>Hesap ve Veri Silme</h1>
      <p className="hs-sub">
        <strong>MobilDiafon</strong> markası altında sunulan <strong>Diafon</strong> uygulaması ·
        Geliştirici: <span className="hs-fill">[DOLDUR: geliştirici/yasal ad]</span>
      </p>

      <p>
        Diafon hesabınızı ve hesabınızla ilişkili kişisel verilerinizi dilediğiniz zaman
        silebilirsiniz. Aşağıda nasıl yapacağınız ve hangi verilerin silindiği açıklanmıştır.
      </p>

      <h2>Hesabınızı uygulama içinden silme</h2>
      <ol>
        <li>Diafon uygulamasını açın ve telefon numaranızla giriş yapın.</li>
        <li><strong>Ayarlar</strong> ekranına gidin.</li>
        <li><strong>Hesabı Sil</strong> seçeneğine dokunun.</li>
        <li>Onay adımını tamamlayın. Hesabınız ve ilişkili verileriniz silinir.</li>
      </ol>
      <p className="hs-fill">
        [DOLDUR: Uygulamada bu adımlar henüz yoksa, Ayarlar ekranına bir &quot;Hesabı Sil&quot;
        akışı ekle; ya da bu bölümü kaldırıp yalnızca aşağıdaki e-posta yöntemini bırak.]
      </p>

      <h2>E-posta ile silme talebi</h2>
      <div className="hs-box">
        Silme talebinizi <span className="hs-fill">[DOLDUR: ör. destek@mobildiafon.com]</span>{" "}
        adresine, hesabınıza kayıtlı telefon numaranızı belirterek gönderebilirsiniz. Talebiniz
        en geç <span className="hs-fill">[DOLDUR: ör. 30]</span> gün içinde sonuçlandırılır ve
        e-posta ile bilgilendirilirsiniz.
      </div>

      <h2>Silinen veriler</h2>
      <p>Talebiniz üzerine aşağıdaki veriler kalıcı olarak silinir:</p>
      <ul>
        <li>Telefon numaranız ve hesap bilgileriniz</li>
        <li>Bina / daire ilişkileriniz ve sakin kayıtlarınız</li>
        <li>Bildirim (push) jetonunuz ve cihaz tanımlayıcılarınız</li>
        <li>Çağrı geçmişiniz</li>
      </ul>

      <h2>Saklanan veriler ve süreler</h2>
      <p>
        Yasal yükümlülükler veya meşru menfaat gereği bazı veriler sınırlı bir süre daha
        saklanabilir; süre dolduğunda silinir veya anonimleştirilir:
      </p>
      <table>
        <thead>
          <tr><th>Veri</th><th>Saklama nedeni</th><th>Süre</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Fatura / ödeme kayıtları (varsa)</td>
            <td>Mevzuat (vergi vb.) gereği</td>
            <td><span className="hs-fill">[DOLDUR: ör. 10 yıl]</span></td>
          </tr>
          <tr>
            <td>Güvenlik / kötüye kullanım kayıtları</td>
            <td>Sistem güvenliği</td>
            <td><span className="hs-fill">[DOLDUR: ör. 90 gün]</span></td>
          </tr>
        </tbody>
      </table>
      <p className="hs-fill">
        [DOLDUR: Gerçekte saklamadığın bir veri varsa satırını sil; süreleri kendi politikana
        göre düzelt. Hiçbir şey saklamıyorsan bu tabloyu kaldırıp &quot;tüm veriler silinir&quot;
        yazabilirsin.]
      </p>

      <h2>İletişim</h2>
      <p>
        Sorularınız için: <span className="hs-fill">[DOLDUR: iletişim e-postası]</span> · Ayrıca{" "}
        <a href="/gizlilik">Gizlilik Politikası</a> sayfasına bakabilirsiniz.
      </p>

      <p className="hs-foot">MobilDiafon / Diafon — Hesap ve veri silme bilgilendirmesi.</p>
    </main>
  );
}
