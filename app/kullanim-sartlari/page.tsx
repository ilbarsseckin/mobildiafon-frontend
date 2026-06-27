export const metadata = {
  title: "Kullanım Şartları — MobilDiafon",
  description: "MobilDiafon kullanım şartları ve üyelik sözleşmesi.",
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
export default function KullanimSartlariPage() {
  return (
    <main className="gz">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <h1>Kullanım Şartları ve Üyelik Sözleşmesi</h1>
      <p className="gz-date">Son güncelleme: <span className="gz-fill">[gg.aa.yyyy]</span></p>

      <h2>1. Taraflar ve Kapsam</h2>
      <p>İşbu Kullanım Şartları, <strong>[AD SOYAD / İŞLETME ADI]</strong> ("MobilDiafon", "Hizmet Sağlayıcı") ile mobildiafon.com web sitesini ve MobilDiafon mobil uygulamasını ("Platform") kullanan kişi ("Kullanıcı") arasındaki kullanım koşullarını düzenler. Platformu kullanarak bu Sözleşme'yi kabul etmiş sayılırsınız.</p>

      <h2>2. Hizmetin Tanımı</h2>
      <p>MobilDiafon; apartman, site, villa ve işyerleri için QR kod ve konum tabanlı dijital diafon (kapı/zil interkom) hizmeti sunan bir yazılım platformudur. Ziyaretçiler QR okutarak veya konum üzerinden ilgili daire/kişiyle görüntülü/sesli görüşme başlatabilir; yöneticiler binalarını ve sakinlerini yönetebilir.</p>
      <p>MobilDiafon bir yazılım hizmetidir; internet bağlantısı ve uyumlu bir cihaz gerektirir.</p>

      <h2>3. Üyelik ve Hesap Güvenliği</h2>
      <ul>
        <li>Üyelik, telefon numarası ve SMS doğrulama (OTP) ile oluşturulur.</li>
        <li>Kullanıcı, verdiği bilgilerin doğru ve güncel olduğunu taahhüt eder.</li>
        <li>Hesap güvenliğinden ve hesabı üzerinden yapılan işlemlerden Kullanıcı sorumludur.</li>
        <li>18 yaşından küçükler, veli/vasi izni olmaksızın üye olamaz ve ödeme yapamaz.</li>
      </ul>

      <h2>4. Kullanım Kuralları</h2>
      <p>Kullanıcı; yürürlükteki mevzuata uyacağını, başkalarının haklarını ihlal etmeyeceğini, taciz/tehdit amaçlı arama yapmayacağını, sahte bina/daire/kimlik tanımlamayacağını, Platformun güvenliğini tehlikeye atacak işlemler yapmayacağını ve görüşmelerde karşı tarafın rızası olmadan kayıt/yayın yapmayacağını kabul eder. Aksi halde hesap askıya alınabilir veya kapatılabilir.</p>

      <h2>5. Bina Yöneticisi Sorumlulukları</h2>
      <p>Bir binayı/işyerini kaydeden Kullanıcı; kayıt yapmaya yetkili olduğunu, sakin/güvenlik bilgilerini hukuka uygun ekleyeceğini ve ilgili kişileri bilgilendireceğini, QR kodların kullanımından sorumlu olduğunu kabul eder. MobilDiafon, girilen verilerin doğruluğundan sorumlu değildir.</p>

      <h2>6. Abonelik ve Deneme</h2>
      <ul>
        <li>Platform, ücretsiz deneme süresi ve ücretli abonelik planları içerir. Güncel fiyatlar Platform üzerinde ilan edilir.</li>
        <li>Ücretsiz deneme her kullanıcıya bir kez tanınır; süresi dolan kullanıcı ücretli aboneliğe geçmelidir.</li>
        <li>Ödemeler, lisanslı ödeme kuruluşu (iyzico) altyapısı üzerinden alınır.</li>
        <li>Abonelik, cayma ve iptal koşulları <a href="/mesafeli-satis">Mesafeli Satış Sözleşmesi</a>'nde düzenlenir.</li>
      </ul>

      <h2>7. Fikri Mülkiyet</h2>
      <p>Platform'a ait tüm yazılım, tasarım, marka, logo ve içerikler MobilDiafon'a veya lisans verenlerine aittir. Kullanıcıya yalnızca Platformu bu Sözleşme kapsamında kullanma hakkı tanınır.</p>

      <h2>8. Sorumluluğun Sınırlandırılması</h2>
      <p>Platform "olduğu gibi" sunulur; kesintisiz veya hatasız çalışma garanti edilmez. İnternet, cihaz veya üçüncü taraf servis kaynaklı aksaklıklardan MobilDiafon sorumlu tutulamaz. MobilDiafon'un toplam sorumluluğu, Kullanıcı'nın son 12 ayda ödediği abonelik bedeli ile sınırlıdır. Bu madde, kanunen sınırlandırılamayacak sorumlulukları kapsamaz.</p>

      <h2>9. Hesabın Feshi</h2>
      <p>Kullanıcı dilediği zaman hesabını silebilir. MobilDiafon, Sözleşme ihlali halinde hesabı askıya alabilir veya feshedebilir. Fesih halinde iade koşulları Mesafeli Satış Sözleşmesi'ne tabidir.</p>

      <h2>10. Uygulanacak Hukuk ve Yetki</h2>
      <p>Bu Sözleşme Türkiye Cumhuriyeti hukukuna tabidir. Tüketici işlemlerinde, tüketicinin yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>

      <h2>11. İletişim</h2>
      <p><strong>[AD SOYAD / İŞLETME ADI]</strong><br/>Adres: [AÇIK ADRES]<br/>E-posta: [İLETİŞİM E-POSTA]<br/>Web: mobildiafon.com</p>

      <p className="gz-foot">Bu metin bilgilendirme amaçlı bir taslaktır; yürürlüğe almadan önce hukuki danışmanlık alınması önerilir.</p>
    </main>
  );
}
