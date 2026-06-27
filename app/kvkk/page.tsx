export const metadata = {
  title: "KVKK Aydınlatma Metni — MobilDiafon",
  description: "MobilDiafon kişisel verilerin korunması ve işlenmesi aydınlatma metni.",
};
const css = `
.gz{max-width:820px;margin:0 auto;padding:56px 22px 90px;font-family:var(--font-body,system-ui,sans-serif);color:#1f2937;line-height:1.65}
.gz h1{font-family:var(--font-display,inherit);font-size:30px;letter-spacing:-.02em;color:#14213D;margin:0 0 6px}
.gz .gz-date{color:#6b7280;font-size:13px;margin:0 0 28px}
.gz h2{font-family:var(--font-display,inherit);font-size:19px;color:#14213D;margin:34px 0 10px}
.gz p{margin:0 0 12px;font-size:15px}
.gz ul{margin:0 0 12px;padding-left:20px}
.gz li{margin:0 0 7px;font-size:15px}
.gz a{color:#E63946;text-decoration:underline;text-underline-offset:2px}
.gz .gz-fill{background:#fff4f5;border:1px dashed #E63946;color:#9a2530;border-radius:8px;padding:2px 7px;font-size:13px;font-weight:600}
.gz .gz-foot{margin-top:36px;color:#6b7280;font-size:13px;border-top:1px solid #e6ebf2;padding-top:16px}
`;
export default function KvkkPage() {
  return (
    <main className="gz">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <h1>KVKK Aydınlatma Metni</h1>
      <p className="gz-date">Son güncelleme: <span className="gz-fill">[gg.aa.yyyy]</span></p>

      <h2>1. Veri Sorumlusu</h2>
      <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla <strong>[AD SOYAD / İŞLETME ADI]</strong> ("MobilDiafon") tarafından işlenmektedir.</p>
      <p>Adres: [AÇIK ADRES] — Vergi Dairesi/No: [VERGİ DAİRESİ VE NO] — E-posta: [İLETİŞİM E-POSTA] — Web: mobildiafon.com</p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li><strong>Kimlik/İletişim:</strong> Ad, soyad, telefon, e-posta.</li>
        <li><strong>Konum (GPS):</strong> Yakındaki binaları göstermek ve bina eklemek için, yalnızca izniniz dahilinde ve uygulama aktifken.</li>
        <li><strong>Görsel/İşitsel:</strong> Görüntülü/sesli arama için kamera ve mikrofon. Görüşme içeriği kaydedilmez. Yüklerseniz profil fotoğrafı saklanır.</li>
        <li><strong>İşlem/Kullanım:</strong> Çağrı kayıtları (içerik değil, üst veri), bina/daire/sakin ilişkileri, QR erişim kayıtları.</li>
        <li><strong>Ödeme:</strong> Kart bilgileri bizde saklanmaz; lisanslı ödeme kuruluşu (iyzico) tarafından işlenir. Bizde işlem referansı, tutar ve abonelik durumu tutulur.</li>
        <li><strong>Teknik:</strong> IP, cihaz tanımlayıcıları, bildirim token'ı, uygulama sürümü.</li>
      </ul>

      <h2>3. İşlenme Amaçları</h2>
      <p>Üyelik ve kimlik doğrulama; hizmetin sunulması (QR/konum ile bina bulma, görüntülü arama, kapı erişimi); rol yönetimi; abonelik ve ödeme; bildirim ve çağrı yönlendirme; güvenlik ve kötüye kullanımın önlenmesi; yasal yükümlülükler.</p>

      <h2>4. Hukuki Sebepler (KVKK m.5)</h2>
      <ul>
        <li>Sözleşmenin kurulması/ifası (üyelik ve abonelik),</li>
        <li>Hukuki yükümlülük (mali/yasal kayıtlar),</li>
        <li>Meşru menfaat (güvenlik, dolandırıcılık önleme, iyileştirme),</li>
        <li>Açık rıza (konum, kamera, mikrofon ve ticari elektronik ileti).</li>
      </ul>

      <h2>5. Aktarım</h2>
      <p>Verileriniz; ödeme kuruluşu (iyzico), SMS/bildirim sağlayıcıları, bulut/barındırma sağlayıcıları ve yasal talep halinde yetkili kamu kurumlarıyla, amaçla sınırlı olarak paylaşılabilir. Aynı bina/site içindeki kullanıcılar (komşu, yönetici, güvenlik), hizmetin doğası gereği adınızı ve daire bilgilerinizi görebilir; görünürlüğü uygulama ayarlarından yönetebilirsiniz.</p>

      <h2>6. Saklama Süresi</h2>
      <p>Veriler, işleme amacının gerektirdiği ve mevzuatın öngördüğü süre boyunca saklanır; süre sonunda veya talebiniz üzerine silinir, yok edilir veya anonimleştirilir.</p>

      <h2>7. Haklarınız (KVKK m.11)</h2>
      <p>İşlenip işlenmediğini öğrenme, bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, düzeltme/silme isteme, otomatik analiz sonucuna itiraz ve zararın giderilmesini talep etme haklarına sahipsiniz.</p>

      <h2>8. Başvuru</h2>
      <p>Taleplerinizi [İLETİŞİM E-POSTA] adresine veya açık adrese yazılı olarak iletebilirsiniz. Başvurunuz en geç 30 gün içinde sonuçlandırılır.</p>

      <p className="gz-foot">Bu metin bilgilendirme amaçlıdır ve mevzuata göre güncellenebilir.</p>
    </main>
  );
}
