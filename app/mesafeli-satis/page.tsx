export const metadata = {
  title: "Mesafeli Satış Sözleşmesi — MobilDiafon",
  description: "MobilDiafon abonelik hizmetleri mesafeli satış sözleşmesi.",
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
.gz .gz-box{background:#f6f8fb;border:1px solid #e6ebf2;border-radius:12px;padding:16px 18px;margin:0 0 16px}
.gz .gz-foot{margin-top:36px;color:#6b7280;font-size:13px;border-top:1px solid #e6ebf2;padding-top:16px}
`;
export default function MesafeliSatisPage() {
  return (
    <main className="gz">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <h1>Mesafeli Satış Sözleşmesi</h1>
      <p className="gz-date">Son güncelleme: <span className="gz-fill">[gg.aa.yyyy]</span></p>
      <p>İşbu Sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca elektronik ortamda kurulmuştur.</p>

      <h2>1. Taraflar</h2>
      <p><strong>SATICI:</strong> [AD SOYAD / İŞLETME ADI] — Adres: [AÇIK ADRES] — Vergi Dairesi/No: [VERGİ DAİRESİ VE NO] — E-posta: [İLETİŞİM E-POSTA] — Telefon: [TELEFON]</p>
      <p><strong>ALICI:</strong> Platform üzerinde abonelik işlemini gerçekleştiren ve bilgileri üyelik kayıtlarında yer alan kişi.</p>

      <h2>2. Sözleşmenin Konusu</h2>
      <p>ALICI'nın mobildiafon.com veya MobilDiafon mobil uygulaması üzerinden elektronik ortamda sipariş verdiği dijital diafon yazılım hizmeti aboneliğinin satışı ve ifasıdır.</p>

      <h2>3. Hizmetin Nitelikleri ve Fiyatı</h2>
      <ul>
        <li><strong>Hizmet:</strong> MobilDiafon dijital diafon yazılım aboneliği (seçilen plana göre).</li>
        <li><strong>Plan/Birim:</strong> Sipariş sırasında seçilen plan, daire/birim sayısı ve dönem (aylık/yıllık).</li>
        <li><strong>Bedel:</strong> Sipariş ekranında KDV dahil gösterilen tutar.</li>
        <li><strong>Ödeme:</strong> Kredi/banka kartı ile, lisanslı ödeme kuruluşu (iyzico) üzerinden.</li>
      </ul>

      <h2>4. Ücretsiz Deneme</h2>
      <p>Yeni kullanıcılara bir defaya mahsus ücretsiz deneme sunulabilir. Deneme hakkını daha önce kullanmış kullanıcılar için yeni kayıtlarda ücretsiz deneme uygulanmaz; hizmete devam ücretli aboneliğe tabidir.</p>

      <h2>5. Genel Hükümler</h2>
      <p>ALICI, abonelik bilgilerini, fiyatı ve ödeme koşullarını okuyup onayladığını kabul eder. Hizmet, ödeme onayını takiben elektronik ortamda derhal ifa edilmeye başlanır.</p>

      <h2>6. Cayma Hakkı</h2>
      <p>Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesi uyarınca, elektronik ortamda anında ifa edilen hizmetlerde, ALICI'nın açık onayı ile ifaya başlanması durumunda cayma hakkı kullanılamaz. ALICI, abonelik satın alırken hizmetin anında ifasına ve cayma hakkının ortadan kalkacağına onay verir.</p>
      <div className="gz-box">Not: Cayma hakkı istisnasının uygulanışı hizmet modelinize göre değişebilir; hukuk danışmanınızla netleştirmeniz önerilir.</div>

      <h2>7. İptal ve Yenileme</h2>
      <p>ALICI aboneliğini dilediği zaman iptal edebilir; iptal mevcut dönem sonunda yürürlüğe girer ve aksi belirtilmedikçe ödenen dönem bedeli iade edilmez. Otomatik yenileme uygulanıyorsa ALICI önceden bilgilendirilir. İptal, Platform üzerinden veya [İLETİŞİM E-POSTA] aracılığıyla yapılabilir.</p>

      <h2>8. Faturalandırma</h2>
      <p>Fatura/e-arşiv belgesi, ALICI'nın verdiği bilgilere göre düzenlenir ve elektronik ortamda iletilir.</p>

      <h2>9. Uyuşmazlıkların Çözümü</h2>
      <p>Ticaret Bakanlığı'nca ilan edilen parasal sınırlar dahilinde, ALICI'nın yerleşim yerindeki Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.</p>

      <h2>10. Yürürlük</h2>
      <p>ALICI siparişi elektronik ortamda onayladığında işbu Sözleşme yürürlüğe girer.</p>

      <p className="gz-foot">Bu metin bilgilendirme amaçlı bir taslaktır; yürürlüğe almadan önce hukuki danışmanlık alınması önerilir.</p>
    </main>
  );
}
