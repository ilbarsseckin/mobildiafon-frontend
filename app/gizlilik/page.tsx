// Kaydet: app/gizlilik/page.tsx  →  yayınlanınca URL: https://mobildiafon.com/gizlilik
// Bu URL'yi Play Console'da "Gizlilik Politikası" alanına gir.
// NOT: Hukuki metindir, avukat onayı önerilir. [DOLDUR] yerlerini doldurmadan yayınlama.

export const metadata = {
  title: "Gizlilik Politikası — MobilDiafon",
  description:
    "MobilDiafon / Diafon uygulaması gizlilik politikası ve KVKK aydınlatma metni.",
};

const css = `
.gz{max-width:820px;margin:0 auto;padding:56px 22px 90px;font-family:var(--font-body,system-ui,sans-serif);color:#1f2937;line-height:1.65}
.gz h1{font-family:var(--font-display,inherit);font-size:30px;letter-spacing:-.02em;color:#14213D;margin:0 0 6px}
.gz .gz-date{color:#6b7280;font-size:13px;margin:0 0 28px}
.gz h2{font-family:var(--font-display,inherit);font-size:19px;color:#14213D;margin:34px 0 10px}
.gz h3{font-size:15px;color:#14213D;margin:20px 0 6px}
.gz p{margin:0 0 12px;font-size:15px}
.gz ul{margin:0 0 12px;padding-left:20px}
.gz li{margin:0 0 7px;font-size:15px}
.gz a{color:#E63946;text-decoration:underline;text-underline-offset:2px}
.gz .gz-fill{background:#fff4f5;border:1px dashed #E63946;color:#9a2530;border-radius:8px;padding:2px 7px;font-size:13px;font-weight:600}
.gz .gz-box{background:#f6f8fb;border:1px solid #e6ebf2;border-radius:12px;padding:16px 18px;margin:0 0 16px}
.gz table{width:100%;border-collapse:collapse;margin:0 0 16px;font-size:14px}
.gz th,.gz td{border:1px solid #e6ebf2;padding:9px 11px;text-align:left;vertical-align:top}
.gz th{background:#f6f8fb;color:#14213D;font-weight:700}
.gz .gz-foot{margin-top:36px;color:#6b7280;font-size:13px;border-top:1px solid #e6ebf2;padding-top:16px}
`;

export default function GizlilikPage() {
  return (
    <main className="gz">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <h1>Gizlilik Politikası</h1>
      <p className="gz-date">Son güncelleme: <span className="gz-fill">[DOLDUR: gg.aa.yyyy]</span></p>

      <p>
        Bu gizlilik politikası, <strong>MobilDiafon</strong> markası altında sunulan{" "}
        <strong>Diafon</strong> mobil uygulaması ve <strong>mobildiafon.com</strong> web
        sitesi (birlikte &quot;Uygulama&quot;) aracılığıyla işlenen kişisel verilere ilişkin
        olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında
        sizi bilgilendirmek amacıyla hazırlanmıştır.
      </p>

      <div className="gz-box">
        <strong>Veri Sorumlusu:</strong> <span className="gz-fill">[DOLDUR: yasal ad / unvan]</span>
        <br />
        <strong>Adres:</strong> <span className="gz-fill">[DOLDUR: iş adresi]</span>
        <br />
        <strong>İletişim / Başvuru e-postası:</strong> <span className="gz-fill">[DOLDUR: ör. destek@mobildiafon.com]</span>
      </div>

      <h2>1. Hangi verileri topluyoruz?</h2>
      <p>Uygulamanın çalışması için yalnızca gerekli olan verileri işliyoruz:</p>
      <table>
        <thead>
          <tr><th>Veri</th><th>Amaç</th></tr>
        </thead>
        <tbody>
          <tr><td>Telefon numarası</td><td>Hesap oluşturma ve SMS/OTP ile kimlik doğrulama</td></tr>
          <tr><td>Konum bilgisi (GPS)</td><td>Yakındaki kayıtlı binayı bulma ve ziyaretçi konum doğrulaması (kopyalanan QR ile rahatsız etmeyi önleme). Konum yalnızca siz uygulamayı kullanırken ve izin verdiğinizde alınır.</td></tr>
          <tr><td>Kamera ve mikrofon</td><td>Ziyaretçi ile sakin arasında gerçek zamanlı görüntülü/sesli kapı görüşmesi. Görüşme akışı yalnızca arama süresince taraflar arasında iletilir. <span className="gz-fill">[DOLDUR: görüşmeler kaydedilmiyorsa &quot;ve kaydedilmez&quot; diye belirt; kaydediliyorsa nasıl/ne kadar saklandığını yaz]</span></td></tr>
          <tr><td>Cihaz bilgisi ve bildirim (push) jetonu</td><td>Gelen çağrı ve bildirimlerin doğru cihaza iletilmesi (Firebase Cloud Messaging)</td></tr>
          <tr><td>Bina / daire ilişkisi ve çağrı kayıtları</td><td>Hizmetin sunulması, sakin onayı, çağrı geçmişi ve destek</td></tr>
        </tbody>
      </table>
      <p>
        Uygulama; reklam kimliği toplamaz ve verilerinizi reklam amacıyla üçüncü taraflara
        satmaz. <span className="gz-fill">[DOLDUR: doğru değilse düzelt]</span>
      </p>

      <h2>2. İşleme amaçları ve hukuki sebep</h2>
      <p>
        Verileriniz; hizmetin sunulması, kimlik doğrulama, görüntülü iletişim ve
        bildirimlerin iletilmesi amacıyla, KVKK m.5/2 kapsamında bir sözleşmenin kurulması/ifası
        için gerekli olması ve meşru menfaat hukuki sebeplerine; konum ile kamera/mikrofon gibi
        açık rıza gerektiren işlemlerde ise <strong>açık rızanıza</strong> dayanılarak işlenir.
        İzni dilediğiniz zaman cihaz ayarlarından geri alabilirsiniz.
      </p>

      <h2>3. Verilerin paylaşımı ve yurt dışına aktarım</h2>
      <p>Verileriniz yalnızca aşağıdaki sınırlı hallerde paylaşılır:</p>
      <ul>
        <li><strong>Hizmet sağlayıcılar:</strong> Bildirim iletimi için Google Firebase Cloud Messaging; barındırma için sunucu altyapısı sağlayıcımız.</li>
        <li><strong>Yasal yükümlülükler:</strong> Mevzuat gereği yetkili kurum/kuruluşlardan gelen taleplerde.</li>
      </ul>
      <p>
        Bildirim altyapısı (Google) verileri yurt dışındaki sunucularda işleyebilir; bu aktarım
        açık rızanıza ve/veya KVKK&apos;daki yurt dışı aktarım kurallarına uygun olarak yapılır.
      </p>

      <h2>4. Saklama süresi</h2>
      <p>
        Kişisel verileriniz, ilgili amaç için gerekli olduğu sürece ve mevzuatta öngörülen
        süreler boyunca saklanır; süre dolduğunda silinir, yok edilir veya anonim hale getirilir.
        Hesabınızı sildiğinizde ilişkili verileriniz makul süre içinde silinir.{" "}
        <span className="gz-fill">[DOLDUR: somut saklama süreleri / hesap silme süreci varsa ekle]</span>
      </p>

      <h2>5. Hesabını ve verilerini silme</h2>
      <p>
        Hesabınızı ve ilişkili kişisel verilerinizi silmek için uygulama içinden veya{" "}
        <span className="gz-fill">[DOLDUR: başvuru e-postası]</span> adresine talep göndererek
        başvurabilirsiniz. (Google Play, veri silme talebi için erişilebilir bir yol istemektedir.)
      </p>

      <h2>6. Güvenlik</h2>
      <p>
        Verilerinizi korumak için iletişimde şifreleme (HTTPS/TLS) ve erişim kontrolü dahil
        makul teknik ve idari tedbirleri uygularız.
      </p>

      <h2>7. KVKK kapsamındaki haklarınız</h2>
      <p>
        KVKK m.11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme,
        amacına uygun kullanılıp kullanılmadığını öğrenme, eksik/yanlış işlenmişse düzeltilmesini,
        şartlar oluştuğunda silinmesini isteme ve işlemeye itiraz etme haklarına sahipsiniz.
        Taleplerinizi <span className="gz-fill">[DOLDUR: başvuru e-postası]</span> üzerinden iletebilirsiniz.
      </p>

      <h2>8. Çocukların gizliliği</h2>
      <p>
        Uygulama, çocuklara yönelik değildir ve bilerek 18 yaş altı kullanıcılardan veri
        toplamaz.
      </p>

      <h2>9. İzinlerin açıklaması</h2>
      <ul>
        <li><strong>Kamera & mikrofon:</strong> yalnızca görüntülü/sesli kapı görüşmesi sırasında kullanılır.</li>
        <li><strong>Konum:</strong> yakındaki binayı bulmak ve ziyaretçi konum doğrulaması için, yalnızca uygulama açıkken ve izin verdiğinizde.</li>
        <li><strong>Bildirim:</strong> gelen çağrı ve mesajları iletmek için.</li>
      </ul>

      <h2>10. Değişiklikler</h2>
      <p>
        Bu politika zaman zaman güncellenebilir. Güncellemeler bu sayfada yayımlanır ve
        &quot;Son güncelleme&quot; tarihi değiştirilir.
      </p>

      <h2>11. İletişim</h2>
      <p>
        Sorularınız için: <span className="gz-fill">[DOLDUR: iletişim e-postası]</span>
      </p>

      <p className="gz-foot">
        MobilDiafon / Diafon — bu metin bilgilendirme amaçlıdır ve hukuki danışmanlık yerine
        geçmez. Yayımlamadan önce tüm [DOLDUR] alanlarını tamamlayın.
      </p>
    </main>
  );
}