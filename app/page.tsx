"use client";

import { useState, useEffect, useRef, createContext, useContext, type PointerEvent } from "react";
import Link from "next/link";

/* ============================================================
   DİL (i18n) + TEMA
   ============================================================ */
type Lang = "tr" | "en";
type Theme = "light" | "dark";

type Plan = {
  id: string;
  name: string;
  minUnits: number;
  maxUnits: number | null;
  monthlyPrice: number;
  yearlyPrice: number;
  isActive: boolean;
  sortOrder: number;
};

const T = {
  tr: {
    tagline: "Dijital Diafon Platformu",
    trust: ["Panelsiz kurulum", "7/24 görüntülü çağrı", "KVKK uyumlu altyapı"],
    managerLogin: "Yönetici Girişi",
    securityLogin: "Güvenlik Girişi",
    nav: { add: "Binanı Ekle", how: "Nasıl Çalışır", features: "Özellikler", pricing: "Fiyatlandırma", digitalize: "Binanı Dijitalleştir" },
    callLabel: "Gelen Çağrı",
    slides: [
      { eye: "QR + Konum Tabanlı Diafon", ta: "Diafon artık binada değil, ", em: "cebinizde", tb: "", sub: "Ziyaretçi QR kodu okutur, bina doğrulanır ve doğru daireye görüntülü arama başlar. Panelsiz, hızlı ve modern bir giriş deneyimi sunar.", c1: "Binanı Dijitalleştir", c2: "Nasıl Çalışır?", b1: "QR ile bina bulma", b2: "Görüntülü arama", tlH: "Konum doğrulandı", tlTag: "120 m", tlP: "Bina çevresinde kayıtlı liste açılır", brH: "Yıldız Sitesi · A Blok", brP: "48 daire · 92 sakin", pT: "Apartman Girişi", pM: "Daire 12 aranıyor", pD: "Görüntülü çağrı başlatıldı" },
      { eye: "Apartman & Site Yönetimi", ta: "Apartman ve siteler için ", em: "panelsiz dijital diafon", tb: "", sub: "Yönetici daireleri yönetir, sakinleri onaylar, güvenlik ve çağrı süreçlerini tek panelden takip eder. Kurulum hızlı, kullanım sade, yönetim kontrollüdür.", c1: "Çözümü İncele", c2: "Özellikleri Gör", b1: "Yönetici paneli", b2: "Daire yönetimi", trH: "Yönetici Paneli", trTag: "Aktif", d1: "Daire listesi", d2: "Sakin onayı", pT: "Daire Listesi", pM: "Ziyaretçi doğru daireyi seçer", pD: "Çağrı kaydı oluşturuldu" },
      { eye: "Otel · AVM · Kampüs", ta: "Misafir doğru birime ", em: "tek dokunuşla ulaşsın", tb: "", sub: "Resepsiyon, restoran, havuz, güvenlik veya teknik servis için ayrı QR akışları oluşturun. Misafir talebini saniyeler içinde iletsin.", c1: "Kurumsal Çözümü İncele", c2: "Demo Talep Et", b1: "Kategorili birimler", b2: "Talep / sipariş notu", tlH: "Oda 312", tlTag: "QR ✓", tlP: "Misafir araması", units: "Birimler", u1: "Resepsiyon", u2: "Havuz", u3: "Restoran", pT: "Resepsiyon", pM: "Oda 312 arıyor", pD: "Oda 312'ye çay notu iletildi" },
      { eye: "Tuya Uyumlu Kapı Açma", ta: "Görüntülü görüş, ", em: "kapıyı uzaktan aç", tb: "", sub: "Tuya uyumlu röle ile kapı açma desteği sayesinde bina kapısı, bariyer ve turnike yetki kontrollü olarak tek dokunuşla yönetilebilir.", c1: "Entegrasyonları İncele", c2: "Nasıl Çalışır?", b1: "Tuya uyumlu röle", b2: "Kapı · bariyer · turnike", trH: "Akıllı Kapı Modülü", chip: "Tuya Uyumlu", d1: "Bina kapısı", d2: "Otopark bariyeri", relay: "Tuya uyumlu röle", flow1: "MobilDiafon", flow2: "Yetki kontrolü", flow3: "Röle tetikleme", pStatus: "Bağlandı · Yetki doğrulandı", pT: "Apartman Girişi", pM: "Görüntülü görüşme aktif", pD: "Kapıyı Aç" },
    ],
    bina: {
      eye: "Binanı Ekle", title: "Haritada bul, dakikada katıl",
      lead: "Konumunu aç, iğneyi binanın üstüne getir ve tara. Kayıtlıysa sakin ya da işletme olarak katılırsın; değilse ilk ekleyen sen olursun. Uygulama gerekmez.",
      startEye: "Konumdan bul", startH: "Binanı haritada bul",
      startP: "İğne hep haritanın ortasında. Haritayı sürükleyip binanı ortala, sonra tara.",
      locate: "Konumumu kullan", locating: "Konum alınıyor…", scan: "Bu konumu tara",
      findToggle: "İl / ilçe / mahalle yazarak git", findPh: "ör. Caddebostan, Kadıköy", go: "Git",
      hint: "Masaüstünde konum yaklaşık olabilir — gerekirse haritayı sürükleyip ortala.",
      loadMap: "Harita yükleniyor…", mapErr: "Harita yüklenemedi. İnternet bağlantını kontrol et.",
      noGeo: "Tarayıcı konumu desteklemiyor. Haritayı sürükle ya da adres yaz.",
      denied: "izin verilmedi", noSignal: "sinyal yok",
      locErr: (r: string) => `Konuma erişilemedi (${r}). Haritayı sürükle ya da aşağıdan adres yaz.`,
      notFoundAddr: "Adres bulunamadı, biraz daha açık yaz.",
      tagOk: "✓ Bu konumda kayıtlı bina", unitsWord: "daire/birim", single: "tek birim",
      matched: "Eşleşen adres", unresolved: "Adres çözülemedi",
      othersLbl: "Yakındaki diğer kayıtlı binalar", pick: "seç ›",
      joinResident: "Sakin olarak katıl", addCommercial: "İşletme / ticari birim olarak ekle",
      tagNo: "Burada kayıtlı bina yok", firstAdd: "İlk ekleyen sen ol", selectedLoc: "Seçilen konum",
      addApart: "Apartman / Site ekle", addVilla: "Villa / Müstakil ekle", addBiz: "İşletme / AVM ekle",
      backScan: "‹ Konumu değiştir / yeniden tara", back: "‹ Geri",
      residentTitle: (ad: string) => `${ad} — sakin katılımı`,
      yourFlat: "Dairen", flat: (n: number) => `Daire ${n}`, phone: "Telefon", phonePh: "05xx xxx xx xx",
      sendJoin: "Yöneticiye Katılma İsteği Gönder",
      joinDoneBold: "İsteğin iletildi.",
      joinDone: (ad: string) => ` ${ad} yöneticisi onayladığında bağlanacaksın. Çağrı almak için MobilDiafon uygulamasını indir — bu kayıtla otomatik bağlı geleceksin.`,
      newBuilding: "Yeni bina ekle", bldName: "Bina / Site Adı", bldNamePh: "Örn. Yıldız Apartmanı",
      bldType: "Bina Tipi", typeApart: "Apartman / Site", typeVilla: "Villa / Müstakil", typeBiz: "Otel / AVM / İşletme",
      flatStructure: "Daire Yapısı", structFlat: "Düz (1…N)", structBlock: "Bloklu (A/B/C)",
      totalFlats: "Toplam Daire Sayısı", blockCount: "Blok Sayısı", perBlock: "Her Blokta Daire",
      unitCountLbl: "Birim / Bağımsız Bölüm Sayısı",
      previewFlat: (n: number) => `Otomatik: Daire 1 … Daire ${n} (${n} daire)`,
      previewBlock: (b: number, p: number, letter: string) => `Otomatik: A-1 … ${letter}-${p} (${b}×${p}=${b * p} daire)`,
      fromMap: "Haritadan seçildi", changeOnMap: "Haritada değiştir",
      sumBuilding: "Bina", sumType: "Tip", sumUnit: "Birim", unit1: "1 birim", unitsW: "birim", flatsW: "daire",
      estAmount: "Tahmini Tutar", corpQuote: "Kurumsal Teklif", perMonth: "/ay", perYear: "/yıl",
      calcCorp: "Otel/AVM/işletme için size özel teklif.", priceFlat: "Tek birim sabit tarife",
      yearSuffix: " · 12 ay yerine 10 ay",
      billMonthly: "Aylık", billYearly: "Yıllık",
      saveYear: "Yıllık ödemede 2 ay bedava", saveAmt: (x: string) => `₺${x} tasarruf`,
      payNow: "Ödemeye Geç", reqQuote: "Teklif İste", trialNote: "14 gün ücretsiz deneme · istediğin zaman iptal",
    },
    how: { eye: "Sistem Akışı", title: "Ziyaretçi için kolay, yönetici için kontrollü.", lead: "Karmaşık donanım dili yerine sade bir kullanıcı akışı: QR okut, binayı doğrula, daireyi ara." },
    steps: [
      { no: "01", title: "QR veya konumla binayı bulun", text: "Ziyaretçi bina girişindeki QR kodu okutur ya da uygulamada konumuna yakın kayıtlı binayı seçer." },
      { no: "02", title: "Daire listesinden kişiyi arayın", text: "Yetkili daire ve sakin listesi açılır. Ziyaretçi doğru daireye tek dokunuşla görüntülü çağrı başlatır." },
      { no: "03", title: "Telefon çalar, kapı yönetilir", text: "Ev sahibi çağrıyı telefondan yanıtlar. Uygun yapılarda Tuya uyumlu röle ile kapı açma desteği devreye alınır." },
    ],
    feat: { eye: "Kurumsal Altyapı", title: "Apartman yönetimi, güvenlik ve sakinler aynı sistemde.", lead: "Marka algısını sade tutan, güven veren ve mobilde hızlı çalışan bir ürün deneyimi." },
    features: [
      { title: "Panelsiz dijital diafon", text: "Ayrı kapı paneli şartı olmadan QR, konum ve mobil arama akışıyla bina iletişimini dijitale taşır." },
      { title: "Konum kontrollü erişim", text: "Bina yöneticisi isterse konum yarıçapı tanımlar; daire listesi yalnızca bina çevresinde görünür." },
      { title: "Yönetici ve güvenlik paneli", text: "Sakin onayı, daire yönetimi, güvenlik görevlisi ekleme, çağrı kayıtları ve not bırakma ekranları hazırdır." },
      { title: "Apartman, site ve işletme uyumlu", text: "Tek bloktan çoklu site yapısına, villa, otel, AVM ve kampüs girişlerine kadar ölçeklenebilir." },
      { title: "Tuya uyumlu kapı açma", text: "Uygun yapılarda Tuya uyumlu röle ile bina kapısı, bariyer ve turnike tek dokunuşla yönetilebilir." },
      { title: "Yetki ve işlem kayıtları", text: "Kapı açma, çağrı ve yönetim işlemleri yetki kontrolüyle ilerler; kurumsal takip için kayıt altına alınır." },
    ],
    price: { eye: "Abonelik", title: "Binanıza uygun planı seçin.", lead: "Villa ve işyerinden büyük sitelere, her yapıya uygun esnek fiyatlandırma.", choose: "Planı Seç" },
    recommended: "Önerilen",
    partnersLabel: "Teknoloji Altyapımız",
    finalCta: { eye: "MobilDiafon", h2: "Binanızın dijital giriş deneyimini bugün başlatın.", p: "QR afiş, konum doğrulama, yönetici onayı, güvenlik paneli ve Tuya uyumlu kapı açma desteğiyle kurumsal bir giriş sistemi kurun.", btn: "Başvuru Oluştur" },
 footer: {
  about: "QR ve konum tabanlı dijital diafon platformu. Apartman, site ve işletmeler için modern iletişim çözümü.",
  product: "Ürün",
  panels: "Paneller",
  superadmin: "Süper Admin",
  legal: "Yasal",
  privacy: "Gizlilik Politikası",
  terms: "Kullanım Şartları",
  distanceSales: "Mesafeli Satış Sözleşmesi",
  contact: "İletişim",
  contactTitle: "İletişim",
  addrTR: "İstanbul, Türkiye",
  addrBE: "Brussels, Belgium",
  copy: "© 2026 MobilDiafon",
  slogan: "Diafon artık cebinizde.",
},
    aria: { theme: "Açık/koyu tema", menu: "Menüyü aç/kapat", prev: "Önceki", next: "Sonraki", slide: (n: number) => `${n}. slayt` },
  },

  en: {
    tagline: "Digital Intercom Platform",
    trust: ["No door panel needed", "24/7 video calling", "Privacy-first infrastructure"],
    managerLogin: "Manager Login",
    securityLogin: "Security Login",
    nav: { add: "Add Building", how: "How It Works", features: "Features", pricing: "Pricing", digitalize: "Digitalize Your Building" },
    callLabel: "Incoming Call",
    slides: [
      { eye: "QR + Location-Based Intercom", ta: "Your intercom is no longer on the wall, ", em: "it's in your phone", tb: "", sub: "Visitors scan the QR code, the building is verified, and a video call starts with the correct resident. A panel-free, modern entry experience.", c1: "Digitalize Your Building", c2: "How It Works", b1: "Find building by QR", b2: "Video calling", tlH: "Location verified", tlTag: "120 m", tlP: "Registered building list opens around the location", brH: "Star Complex · Block A", brP: "48 flats · 92 residents", pT: "Building Entrance", pM: "Calling Flat 12", pD: "Video call started" },
      { eye: "Apartment & Complex Management", ta: "A panel-free digital intercom for ", em: "apartments and complexes", tb: "", sub: "Managers control flats, approve residents, and monitor security and call flows from one panel. Fast setup, simple use, controlled management.", c1: "Explore Solution", c2: "See Features", b1: "Manager panel", b2: "Flat management", trH: "Manager Panel", trTag: "Active", d1: "Flat directory", d2: "Resident approval", pT: "Flat Directory", pM: "Visitor selects the correct flat", pD: "Call log created" },
      { eye: "Hotel · Mall · Campus", ta: "Let guests reach the right unit ", em: "in one tap", tb: "", sub: "Create separate QR flows for reception, restaurant, pool, security, or technical service. Guests send requests in seconds.", c1: "Explore Enterprise Solution", c2: "Request Demo", b1: "Categorized units", b2: "Order / request note", tlH: "Room 312", tlTag: "QR ✓", tlP: "Guest call", units: "Units", u1: "Reception", u2: "Pool", u3: "Restaurant", pT: "Reception", pM: "Room 312 calling", pD: "Tea to room 312 note sent" },
      { eye: "Tuya-Compatible Door Opening", ta: "See on video, ", em: "open the door remotely", tb: "", sub: "With Tuya-compatible relay support, building doors, parking barriers, and turnstiles can be controlled in one tap with access verification.", c1: "Explore Integrations", c2: "How It Works", b1: "Tuya-compatible relay", b2: "Door · barrier · turnstile", trH: "Smart Door Module", chip: "Tuya compatible", d1: "Building door", d2: "Parking barrier", relay: "Tuya-compatible relay", flow1: "MobilDiafon", flow2: "Access check", flow3: "Relay trigger", pStatus: "Connected · Access verified", pT: "Building Entrance", pM: "Video call active", pD: "Open Door" },
    ],
    bina: {
      eye: "Add Building", title: "Find it on the map, join in a minute",
      lead: "Enable your location, place the pin on your building and scan. If it's registered you join as a resident or business; if not, you're the first to add it. No app required.",
      startEye: "Find by location", startH: "Find your building on the map",
      startP: "The pin stays at the center of the map. Drag the map to center your building, then scan.",
      locate: "Use my location", locating: "Getting location…", scan: "Scan this location",
      findToggle: "Or type a city / district / neighborhood", findPh: "e.g. Soho, London", go: "Go",
      hint: "On desktop, location may be approximate — drag the map to center if needed.",
      loadMap: "Loading map…", mapErr: "Map failed to load. Check your internet connection.",
      noGeo: "Your browser doesn't support location. Drag the map or type an address.",
      denied: "permission denied", noSignal: "no signal",
      locErr: (r: string) => `Couldn't access location (${r}). Drag the map or type an address below.`,
      notFoundAddr: "Address not found, try being more specific.",
      tagOk: "✓ Registered building at this location", unitsWord: "units", single: "single unit",
      matched: "Matched address", unresolved: "Address not resolved",
      othersLbl: "Other registered buildings nearby", pick: "select ›",
      joinResident: "Join as resident", addCommercial: "Add as business / commercial unit",
      tagNo: "No registered building here", firstAdd: "Be the first to add it", selectedLoc: "Selected location",
      addApart: "Add Apartment / Complex", addVilla: "Add Villa / Detached", addBiz: "Add Business / Mall",
      backScan: "‹ Change location / scan again", back: "‹ Back",
      residentTitle: (ad: string) => `${ad} — resident sign-up`,
      yourFlat: "Your flat", flat: (n: number) => `Flat ${n}`, phone: "Phone", phonePh: "05xx xxx xx xx",
      sendJoin: "Send join request to manager",
      joinDoneBold: "Your request has been sent.",
      joinDone: (ad: string) => ` Once the ${ad} manager approves, you'll be connected. Install the MobilDiafon app to receive calls — you'll be linked automatically with this sign-up.`,
      newBuilding: "Add new building", bldName: "Building / Complex name", bldNamePh: "e.g. Riverside Apartments",
      bldType: "Building type", typeApart: "Apartment / Complex", typeVilla: "Villa / Detached", typeBiz: "Hotel / Mall / Business",
      flatStructure: "Flat structure", structFlat: "Flat (1…N)", structBlock: "Blocks (A/B/C)",
      totalFlats: "Total number of flats", blockCount: "Number of blocks", perBlock: "Flats per block",
      unitCountLbl: "Number of units",
      previewFlat: (n: number) => `Auto: Flat 1 … Flat ${n} (${n} flats)`,
      previewBlock: (b: number, p: number, letter: string) => `Auto: A-1 … ${letter}-${p} (${b}×${p}=${b * p} flats)`,
      fromMap: "Selected from map", changeOnMap: "Change on map",
      sumBuilding: "Building", sumType: "Type", sumUnit: "Units", unit1: "1 unit", unitsW: "units", flatsW: "flats",
      estAmount: "Estimated amount", corpQuote: "Custom Quote", perMonth: "/mo", perYear: "/yr",
      calcCorp: "Custom quote for hotels/malls/businesses.", priceFlat: "Single-unit flat rate",
      yearSuffix: " · 10 months instead of 12",
      billMonthly: "Monthly", billYearly: "Yearly",
      saveYear: "2 months free on annual billing", saveAmt: (x: string) => `₺${x} saved`,
      payNow: "Continue to payment", reqQuote: "Request quote", trialNote: "14-day free trial · cancel anytime",
    },
    how: { eye: "How It Works", title: "Easy for visitors, controlled for managers.", lead: "A simple user flow instead of complex hardware talk: scan the QR, confirm the building, call the flat." },
    steps: [
      { no: "01", title: "Find the building by QR or location", text: "The visitor scans the QR at the entrance, or picks a nearby registered building in the app." },
      { no: "02", title: "Call the right person from the list", text: "The authorized flat and resident list opens. The visitor starts a video call to the right flat in one tap." },
      { no: "03", title: "Phone rings, door is managed", text: "The resident answers from their phone. Where supported, door opening can work through a Tuya-compatible relay." },
    ],
    feat: { eye: "Enterprise Infrastructure", title: "Building management, security and residents in one system.", lead: "A product experience that keeps the brand clean, builds trust and runs fast on mobile." },
    features: [
      { title: "Panel-free digital intercom", text: "Moves building communication into the digital world with QR, location and mobile calling — no separate door panel required." },
      { title: "Location-controlled access", text: "Managers can define a location radius; the flat directory appears only around the building." },
      { title: "Manager and security panels", text: "Resident approval, flat management, security staff, call logs and request notes are ready in one platform." },
      { title: "Apartment, complex and business ready", text: "Scales from a single block to complexes, villas, hotels, malls and campus entrances." },
      { title: "Tuya-compatible door opening", text: "Where supported, Tuya-compatible relays can control building doors, barriers and turnstiles in one tap." },
      { title: "Access and activity logs", text: "Door opening, calls and management actions run through access control and can be tracked for enterprise use." },
    ],
    price: { eye: "Subscription", title: "Choose the plan that fits your building.", lead: "From single units to large complexes, flexible pricing for every structure.", choose: "Choose Plan" },
    recommended: "Recommended",
    partnersLabel: "Trusted Technology & Infrastructure Partners",
    finalCta: { eye: "MobilDiafon", h2: "Start your building's digital entry experience today.", p: "Set up an enterprise entry system with QR posters, location verification, manager approval, a security panel and Tuya-compatible door opening support.", btn: "Get Started" },
 footer: {
  about: "QR and location-based digital intercom platform. A modern communication solution for apartments, complexes and businesses.",
  product: "Product",
  panels: "Panels",
  superadmin: "Super Admin",
  legal: "Legal",
  privacy: "Privacy Policy",
  terms: "Terms of Use",
  distanceSales: "Distance Sales Agreement",
  contact: "Contact",
  contactTitle: "Contact",
  addrTR: "Istanbul, Turkey",
  addrBE: "Brussels, Belgium",
  copy: "© 2026 MobilDiafon",
  slogan: "Your intercom, now in your pocket.",
},
    aria: { theme: "Light/dark theme", menu: "Toggle menu", prev: "Previous", next: "Next", slide: (n: number) => `Slide ${n}` },
  },
};

type Dict = typeof T["tr"];

const UICtx = createContext<{ lang: Lang; theme: Theme; setLang: (l: Lang) => void; setTheme: (t: Theme) => void; t: Dict; plans: Plan[] }>({
  lang: "tr", theme: "light", setLang: () => {}, setTheme: () => {}, t: T.tr, plans: [],
});
function useUI() { return useContext(UICtx); }

/* ============================================================
   ICONS
   ============================================================ */
function IconCheck() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function IconQr() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h2v2h-2v-2Zm4 0h2v6h-6v-2h4v-4Z" stroke="currentColor" strokeWidth="1.7" /></svg>); }
function IconVideo() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h7A2.5 2.5 0 0 1 16 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 16.5v-9Z" stroke="currentColor" strokeWidth="1.8" /><path d="m16 10 4-2.5v9L16 14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>); }
function IconHome() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 10v9h14v-9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>); }
function IconGear() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function IconGrid() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M4 9h16M9 9v11" stroke="currentColor" strokeWidth="1.8" /></svg>); }
function IconLines() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>); }
function IconLock() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" /></svg>); }
function IconArrows() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 10h12M4 10l4-4M4 10l4 4M20 14H8m12 0-4 4m4-4-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function IconDoorLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 21h10V3H7v18Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 12h.01" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/></svg>); }
function IconBarrierLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h16M7 20V9m10 11v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M6 9h14l-2 4H4l2-4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>); }
function IconRelayLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="6" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M8 10h8M8 14h5M9 3v3m6-3v3M9 18v3m6-3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function IconReceptionLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 18h16M7 18v-3a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 9a3 3 0 1 1 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function IconPoolLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 17c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1M4 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1M8 13V5a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function IconRestaurantLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3v8m3-8v8M5 3v5a4 4 0 0 0 8 0V3M9 11v10m8-18v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function IconApartmentLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 21V4h14v17M9 8h2m2 0h2M9 12h2m2 0h2M9 16h2m2 0h2M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconUserCheckLine() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 19a6 6 0 0 0-12 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="9" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="m16 12 2 2 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function IconUnlockLine() { return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.9"/><path d="M8 10V7a4 4 0 0 1 7.7-1.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/><path d="M12 14v2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>); }
function IconSun() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>); }
function IconMoon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>); }
function PhoneNo() { return (<i className="no"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M21 15.46l-5.27-.61-2.52 2.52a15.05 15.05 0 0 1-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97v-5.51z" /></svg></i>); }
function PhoneOk() { return (<i className="ok"><svg width="22" height="22" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.21z" /></svg></i>); }
function CallActions() { return (<div className="call-actions"><PhoneNo /><PhoneOk /></div>); }

/* ============================================================
   HEADER
   ============================================================ */
function Header() {
  const { t, lang, setLang, theme, setTheme } = useUI();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="util">
        <div className="wrap">
          <div className="util-trust">
            {t.trust.map((x, i) => (<span key={i}><IconCheck /> {x}</span>))}
          </div>
          <div className="util-links">
            <Link href="/yonetici">{t.managerLogin}</Link>
            <Link href="/guvenlik">{t.securityLogin}</Link>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="wrap nav">
          <Link href="/" className="logo" aria-label="MobilDiafon">
            <img src="/icon-192.png" alt="MobilDiafon" width={40} height={40} />
            <span className="word"><span className="m">Mobil</span><span className="d">Diafon</span><small>{t.tagline}</small></span>
          </Link>
          <nav className={`nav-links ${open ? "open" : ""}`}>
            <a href="#bina" onClick={() => setOpen(false)}>{t.nav.add}</a>
            <a href="#nasil" onClick={() => setOpen(false)}>{t.nav.how}</a>
            <a href="#ozellikler" onClick={() => setOpen(false)}>{t.nav.features}</a>
            <a href="#fiyat" onClick={() => setOpen(false)}>{t.nav.pricing}</a>
            <a href="/blog" onClick={() => setOpen(false)}>Blog</a>
          </nav>
          <div className="nav-cta">
            <button className="ui-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t.aria.theme}>
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <div className="ui-lang" role="group" aria-label="Language">
              <button className={lang === "tr" ? "on" : ""} onClick={() => setLang("tr")}>TR</button>
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            <Link href="/satin-al" className="btn btn-primary btn-sm">{t.nav.digitalize}</Link>
            <button className="burger" onClick={() => setOpen((v) => !v)} aria-label={t.aria.menu}>☰</button>
          </div>
        </div>
      </header>
    </>
  );
}

/* ============================================================
   HERO CAROUSEL
   ============================================================ */
const SLIDE_COUNT = 4;
const AUTOPLAY_MS = 7000;

function HeroCarousel() {
  const { t } = useUI();
  const s = t.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);

  // Konum bulma durumu
  const [locating, setLocating] = useState(false);
  const [locResult, setLocResult] = useState<{ type: "found" | "none" | "error"; text: string } | null>(null);

  const go = (n: number) => setIndex((n + SLIDE_COUNT) % SLIDE_COUNT);
  const next = () => go(index + 1);
  const prev = () => go(index - 1);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tm = setTimeout(() => setIndex((v) => (v + 1) % SLIDE_COUNT), AUTOPLAY_MS);
    return () => clearTimeout(tm);
  }, [index, paused]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((v) => (v + 1) % SLIDE_COUNT);
      if (e.key === "ArrowLeft") setIndex((v) => (v - 1 + SLIDE_COUNT) % SLIDE_COUNT);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const onPointerDown = (e: PointerEvent) => { startX.current = e.clientX; setPaused(true); };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    setPaused(false);
  };

  // Konumumu kullan: konum al → backend'e sor → #bina'ya kaydır
  function scrollToBina(lat?: number, lng?: number) {
    if (lat != null && lng != null) {
      try {
        window.dispatchEvent(new CustomEvent("md:locate", { detail: { lat, lng } }));
      } catch {}
    }
    const el = document.getElementById("bina");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function useMyLocation() {
    setLocResult(null);
    if (!navigator.geolocation) {
      setLocResult({ type: "error", text: t.heroLoc.noGeo });
      setTimeout(() => scrollToBina(), 600);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`https://mobildiafon.com/api/buildings/nearby-list?lat=${lat}&lng=${lng}`);
          const arr = res.ok ? await res.json() : [];
          if (Array.isArray(arr) && arr.length > 0) {
            const name = arr[0].buildingName || t.heroLoc.aBuilding;
            setLocResult({ type: "found", text: t.heroLoc.found(name) });
          } else {
            setLocResult({ type: "none", text: t.heroLoc.none });
          }
        } catch {
          setLocResult({ type: "none", text: t.heroLoc.none });
        } finally {
          setLocating(false);
          setTimeout(() => scrollToBina(lat, lng), 900);
        }
      },
      () => {
        setLocating(false);
        setLocResult({ type: "error", text: t.heroLoc.denied });
        setTimeout(() => scrollToBina(), 900);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }

  const cls = (n: number) => `hc-slide ${index === n ? "is-active" : ""}`;

  // Her slaytın CTA bloğu (konum butonu + ikinci link + sonuç)
  const ctaBlock = (secondHref: string, secondLabel: string) => (
    <>
      <div className="cta-row anim">
        <button className="btn btn-primary" onClick={useMyLocation} disabled={locating}>
          {locating ? (
            <span className="hc-loc-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ marginRight: 8, verticalAlign: -3 }}>
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="8" />
            </svg>
          )}
          {locating ? t.heroLoc.locating : t.heroLoc.cta}
        </button>
        <a href={secondHref} className="btn btn-ghost">{secondLabel}</a>
      </div>
      {locResult && (
        <div className={`hc-loc-result ${locResult.type}`}>
          {locResult.type === "found" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          {locResult.type === "none" && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M12 8v5M12 16h.01" strokeLinecap="round" /><circle cx="12" cy="12" r="9" /></svg>}
          <span>{locResult.text}</span>
        </div>
      )}
    </>
  );

  // Sağ taraf: gerçek fotoğraf (placeholder)
  const photo = (n: number, label: string) => (
    <div className="hc-photo anim" aria-hidden="true">
      <img src={`/hero-${n + 1}.jpg`} alt="" className="hc-photo-img" loading={n === 0 ? "eager" : "lazy"} />
      <div className="hc-photo-ph">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
        <span>{label}</span>
      </div>
    </div>
  );

  return (
    <section className={`hero hero-pro ${paused ? "paused" : ""}`} aria-label="Hero"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      <button className="hc-arrow hc-prev" onClick={prev} aria-label={t.aria.prev}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button className="hc-arrow hc-next" onClick={next} aria-label={t.aria.next}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="hc-viewport">
        <div className="hc-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          <div className={cls(0)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[0].eye}</span>
                <h1 className="h1 anim">{s[0].ta}<em>{s[0].em}</em>{s[0].tb}</h1>
                <p className="sub anim">{s[0].sub}</p>
                {ctaBlock("#nasil", s[0].c2)}
                <div className="badges anim">
                  <span><IconQr /> {s[0].b1}</span>
                  <span><IconVideo /> {s[0].b2}</span>
                </div>
              </div>
              {photo(0, s[0].pT)}
            </div>
          </div>
          <div className={cls(1)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[1].eye}</span>
                <h1 className="h1 anim">{s[1].ta}<em>{s[1].em}</em>{s[1].tb}</h1>
                <p className="sub anim">{s[1].sub}</p>
                {ctaBlock("#nasil", s[1].c2)}
                <div className="badges anim">
                  <span><IconHome /> {s[1].b1}</span>
                  <span><IconGear /> {s[1].b2}</span>
                </div>
              </div>
              {photo(1, s[1].pT)}
            </div>
          </div>
          <div className={cls(2)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[2].eye}</span>
                <h1 className="h1 anim">{s[2].ta}<em>{s[2].em}</em>{s[2].tb}</h1>
                <p className="sub anim">{s[2].sub}</p>
                {ctaBlock("#fiyat", s[2].c2)}
                <div className="badges anim">
                  <span><IconGrid /> {s[2].b1}</span>
                  <span><IconLines /> {s[2].b2}</span>
                </div>
              </div>
              {photo(2, s[2].pT)}
            </div>
          </div>
          <div className={cls(3)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[3].eye}</span>
                <h1 className="h1 anim">{s[3].ta}<em>{s[3].em}</em>{s[3].tb}</h1>
                <p className="sub anim">{s[3].sub}</p>
                {ctaBlock("#ozellikler", s[3].c2)}
                <div className="badges anim">
                  <span><IconLock /> {s[3].b1}</span>
                  <span><IconArrows /> {s[3].b2}</span>
                </div>
              </div>
              {photo(3, s[3].pT)}
            </div>
          </div>
        </div>
      </div>
      <div className="hc-dots" role="tablist" aria-label="Slides">
        {[0, 1, 2, 3].map((k) => (
          <button key={k} className={`hc-dot ${index === k ? "is-active" : ""}`} onClick={() => go(k)} aria-label={t.aria.slide(k + 1)}>
            <span className="fill" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   BİNANI BUL — yardımcılar
   ============================================================ */
type Bldg = { il: string; ilce: string; ad: string; daire: number; lat: number; lng: number; id?: string };

const DEMO_MODE = false;

const REGISTERED: Bldg[] = [
  { il: "İstanbul", ilce: "Kadıköy", ad: "yıldız apartmanı", daire: 48, lat: 40.9901, lng: 29.0289 },
  { il: "İstanbul", ilce: "Kadıköy", ad: "yıldız apartmanı", daire: 30, lat: 40.9712, lng: 29.0625 },
  { il: "İstanbul", ilce: "Kadıköy", ad: "marmara residence", daire: 96, lat: 40.9785, lng: 29.0512 },
  { il: "İstanbul", ilce: "Kadıköy", ad: "bağdat sitesi", daire: 60, lat: 40.9669, lng: 29.076 },
  { il: "İstanbul", ilce: "Beşiktaş", ad: "levent apartmanı", daire: 32, lat: 41.078, lng: 29.011 },
  { il: "Ankara", ilce: "Çankaya", ad: "güneş sitesi", daire: 120, lat: 39.905, lng: 32.854 },
  { il: "Ankara", ilce: "Çankaya", ad: "çankaya konakları", daire: 40, lat: 39.892, lng: 32.861 },
  { il: "İzmir", ilce: "Bornova", ad: "deniz apartmanı", daire: 24, lat: 38.47, lng: 27.216 },
];

const bbTitle = (s: string) => s.replace(/\S+/g, (w) => w.charAt(0).toLocaleUpperCase("tr") + w.slice(1));
const bbFmt = (n: number) => n.toLocaleString("tr-TR");

type LatLng = { lat: number; lng: number };

let _leafletPromise: Promise<any> | null = null;
function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  const w = window as any;
  if (w.L) return Promise.resolve(w.L);
  if (_leafletPromise) return _leafletPromise;
  _leafletPromise = new Promise((resolve, reject) => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    const sc = document.createElement("script");
    sc.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    sc.async = true;
    sc.onload = () => resolve((window as any).L);
    sc.onerror = () => reject(new Error("Leaflet yüklenemedi"));
    document.body.appendChild(sc);
  });
  return _leafletPromise;
}

async function reverseGeocode(lat: number, lng: number): Promise<{ display: string; il: string; ilce: string }> {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=tr`);
    const d: any = await r.json();
    const a = (d && d.address) || {};
    const il = a.province || a.state || a.city || "";
    const ilce = a.county || a.town || a.district || a.city_district || a.suburb || "";
    return { display: (d && d.display_name) || "", il, ilce };
  } catch {
    return { display: "", il: "", ilce: "" };
  }
}

async function forwardGeocode(q: string): Promise<LatLng | null> {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=tr&q=${encodeURIComponent(q)}`);
    const d: any = await r.json();
    if (d && d[0]) return { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon) };
  } catch { }
  return null;
}

function haversine(a: LatLng, b: LatLng): number {
  const R = 6371000, t = Math.PI / 180;
  const dLat = (b.lat - a.lat) * t, dLng = (b.lng - a.lng) * t;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * t) * Math.cos(b.lat * t) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const FOUND_RADIUS = 280;
async function searchNear(center: LatLng): Promise<Bldg[]> {
  if (DEMO_MODE) {
    return [...REGISTERED].map((b) => ({ b, d: haversine(center, b) })).filter((x) => x.d <= FOUND_RADIUS).sort((x, y) => x.d - y.d).map((x) => x.b);
  }
  try {
    const res = await fetch(`https://mobildiafon.com/api/buildings/nearby-list?lat=${center.lat}&lng=${center.lng}`);
    if (!res.ok) return [];
    const arr = await res.json();
    return (Array.isArray(arr) ? arr : []).map((b: any) => ({
      il: b.il || "", ilce: b.ilce || "", ad: b.buildingName ?? "Bina",
      daire: b.unitCount ?? b.daire ?? 0, lat: b.latitude ?? center.lat,
      lng: b.longitude ?? center.lng, id: b.id,
    }));
  } catch { return []; }
}

/* ============================================================
   BİNANI BUL — bileşen
   ============================================================ */
function BinaBul() {
  const { t, plans } = useUI();
  const tb = t.bina;
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanCenter, setScanCenter] = useState<LatLng | null>(null);
  const [scanAddr, setScanAddr] = useState("");
  const [found, setFound] = useState<Bldg | null>(null);
  const [foundList, setFoundList] = useState<Bldg[]>([]);
  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState("");
  const [findOpen, setFindOpen] = useState(false);
  const [findText, setFindText] = useState("");
  const [il, setIl] = useState("");
  const [ilce, setIlce] = useState("");
  const [residentOpen, setResidentOpen] = useState(false);
  const [joinDone, setJoinDone] = useState(false);
  const [resDaire, setResDaire] = useState("1");
  const [resTel, setResTel] = useState("");
  const [managerOpen, setManagerOpen] = useState(false);
  const [ad, setAd] = useState("");
  const [tip, setTip] = useState<"apartman" | "villa" | "isletme">("apartman");
  const [yapi, setYapi] = useState<"duz" | "blok">("duz");
  const [bill, setBill] = useState<"ay" | "yil">("ay");
  const [duzCount, setDuzCount] = useState(24);
  const [blokCount, setBlokCount] = useState(3);
  const [blokPer, setBlokPer] = useState(16);
  const [islCount, setIslCount] = useState(20);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L: any) => {
      if (cancelled || !mapEl.current || mapRef.current) return;
      const init = DEMO_MODE ? { lat: 40.9785, lng: 29.0512, z: 16 } : { lat: 41.0102, lng: 28.9784, z: 13 };
      const map = L.map(mapEl.current, { zoomControl: false, scrollWheelZoom: false }).setView([init.lat, init.lng], init.z);
      L.control.zoom({ position: "topright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" }).addTo(map);
      map.on("movestart", () => setDragging(true));
      map.on("moveend", () => setDragging(false));
      mapRef.current = map;
      setMapReady(true);
      setTimeout(() => map.invalidateSize(), 150);
    }).catch(() => { if (!cancelled) setLocateMsg(tb.mapErr); });
    const onResize = () => { if (mapRef.current) mapRef.current.invalidateSize(); };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, []);

  async function doScan() {
    if (!mapRef.current) return;
    setLocateMsg(""); setScanning(true);
    const c = mapRef.current.getCenter();
    const center: LatLng = { lat: c.lat, lng: c.lng };
    const [rev, list] = await Promise.all([reverseGeocode(center.lat, center.lng), searchNear(center)]);
    await new Promise((r) => setTimeout(r, 650));
    setScanCenter(center); setScanAddr(rev.display); setIl(rev.il); setIlce(rev.ilce);
    setFoundList(list); setFound(list[0] || null);
    setResidentOpen(false); setManagerOpen(false); setJoinDone(false);
    setScanned(true); setScanning(false);
  }

  function doLocate() {
    setLocateMsg("");
    if (!navigator.geolocation) { setLocateMsg(tb.noGeo); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { if (mapRef.current) mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 17); setLocating(false); setTimeout(doScan, 350); },
      (err) => { setLocating(false); setLocateMsg(tb.locErr(err.code === 1 ? tb.denied : tb.noSignal)); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  }

  async function doFind() {
    const q = findText.trim();
    if (!q) return;
    setLocateMsg("");
    const p = await forwardGeocode(q + ", Türkiye");
    if (p && mapRef.current) mapRef.current.setView([p.lat, p.lng], 16);
    else setLocateMsg(tb.notFoundAddr);
  }

  function backToMap() { setScanned(false); setFound(null); setFoundList([]); setResidentOpen(false); setManagerOpen(false); setJoinDone(false); }
  function backFromSub() { setResidentOpen(false); setManagerOpen(false); setJoinDone(false); }
  function openResident() { setResidentOpen(true); setManagerOpen(false); setResDaire("1"); setJoinDone(false); }
  const [joinError, setJoinError] = useState("");
  const [joining, setJoining] = useState(false);
  async function sendWebJoin() {
    setJoinError("");
    const phone = resTel.replace(/\s/g, "");
    if (!/^0?5\d{9}$/.test(phone)) { setJoinError("Geçerli bir telefon numarası girin."); return; }
    if (!found?.id) { setJoinError("Bina seçimi geçersiz."); return; }
    setJoining(true);
    try {
      const res = await fetch("https://mobildiafon.com/api/buildings/web-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildingId: found.id, flatNo: resDaire, phone }),
      });
      const data = await res.json();
      if (data.success) { setJoinDone(true); }
      else { setJoinError(data.message || "İstek gönderilemedi."); }
    } catch {
      setJoinError("Bağlantı hatası. Tekrar deneyin.");
    } finally {
      setJoining(false);
    }
  }
  function openManager(tp: "apartman" | "villa" | "isletme") { setTip(tp); setManagerOpen(true); setResidentOpen(false); }

  const unitCount = tip === "villa" ? 1 : tip === "isletme" ? Math.max(1, islCount || 0) : yapi === "duz" ? Math.max(1, duzCount || 0) : Math.max(1, blokCount || 0) * Math.max(1, blokPer || 0);
  const blockLetter = String.fromCharCode(64 + Math.min(Math.max(1, blokCount || 0), 26));
  const unitsPreview = yapi === "duz" ? tb.previewFlat(Math.max(1, duzCount || 0)) : tb.previewBlock(Math.max(1, blokCount || 0), Math.max(1, blokPer || 0), blockLetter);
  const coordTxt = scanCenter ? `${scanCenter.lat.toFixed(6)}, ${scanCenter.lng.toFixed(6)}` : "";
  const typeName = tip === "apartman" ? tb.typeApart : tip === "villa" ? tb.typeVilla : tb.typeBiz;

  // Backend planlardan fiyat hesabı
  const matchedPlan = plans.find(p => p.minUnits <= unitCount && (p.maxUnits === null || p.maxUnits >= unitCount));
  const isTeklif = tip === "isletme" || !matchedPlan || matchedPlan.monthlyPrice === 0;
  const monthly = matchedPlan?.monthlyPrice || 0;
  const yearly = matchedPlan?.yearlyPrice || 0;
  const amount = isTeklif ? tb.corpQuote : bill === "ay" ? `₺${bbFmt(monthly)}` : `₺${bbFmt(yearly)}`;
  const amountUnit = isTeklif ? "" : bill === "ay" ? tb.perMonth : tb.perYear;
  const calc = isTeklif ? tb.calcCorp : bill === "ay"
    ? `${matchedPlan?.name} Planı`
    : `${matchedPlan?.name} Planı${tb.yearSuffix}`;
  const save = isTeklif ? "" : bill === "ay" ? tb.saveYear : tb.saveAmt(bbFmt(monthly * 2));

  function onPay() {
    const fields: Record<string, string> = { tip, il, ilce, ad: ad.trim(), birim: String(unitCount), yapi, bill };
    if (matchedPlan) fields.plan = matchedPlan.id;
    if (scanCenter) { fields.lat = scanCenter.lat.toFixed(6); fields.lng = scanCenter.lng.toFixed(6); }
    const p = new URLSearchParams(fields);
    window.location.href = `/satin-al?${p.toString()}`;
  }

  return (
    <section id="bina" className="bb2">
      <div className="bb2-head">
        <span className="md-eyebrow">{tb.eye}</span>
        <h2 className="md-title">{tb.title}</h2>
        <p className="md-lead md-lead-center">{tb.lead}</p>
      </div>
      <div className="bb2-wrap">
        <div className={`bb2-stage${scanning ? " scanning" : ""}${dragging ? " dragging" : ""}`}>
          <div ref={mapEl} className="bb2-map" />
          <div className="bb2-radar" />
          <div className="bb2-pin" aria-hidden="true">
            <svg width="34" height="46" viewBox="0 0 34 46" fill="none">
              <path d="M17 0C7.6 0 0 7.5 0 16.8 0 29 17 46 17 46s17-17 17-29.2C34 7.5 26.4 0 17 0z" fill="#E63946" />
              <circle cx="17" cy="16.5" r="6" fill="#fff" />
            </svg>
            <span className="bb2-pin-shadow" />
          </div>
          {!mapReady && <div className="bb2-load">{tb.loadMap}</div>}
        </div>
        <aside className="bb2-panel">
          {managerOpen ? (
            <>
              <button className="bb2-link" onClick={backFromSub}>{tb.back}</button>
              <h3 className="bb2-h">{tb.newBuilding}</h3>
              <div className="bb-field"><label>{tb.bldName}</label>
                <input value={ad} onChange={(e) => setAd(e.target.value)} placeholder={tb.bldNamePh} autoComplete="off" />
              </div>
              <div className="bb-field"><label>{tb.bldType}</label>
                <div className="bb-seg">
                  {([["apartman", tb.typeApart], ["villa", tb.typeVilla], ["isletme", tb.typeBiz]] as const).map(([v, l]) => (
                    <button key={v} className={tip === v ? "active" : ""} onClick={() => setTip(v as "apartman" | "villa" | "isletme")}>{l}</button>
                  ))}
                </div>
              </div>
              {tip === "apartman" && (
                <>
                  <div className="bb-field"><label>{tb.flatStructure}</label>
                    <div className="bb-seg small">
                      <button className={yapi === "duz" ? "active" : ""} onClick={() => setYapi("duz")}>{tb.structFlat}</button>
                      <button className={yapi === "blok" ? "active" : ""} onClick={() => setYapi("blok")}>{tb.structBlock}</button>
                    </div>
                  </div>
                  {yapi === "duz" ? (
                    <div className="bb-field"><label>{tb.totalFlats}</label><input type="number" min={1} value={duzCount} onChange={(e) => setDuzCount(parseInt(e.target.value) || 0)} /></div>
                  ) : (
                    <div className="bb-row2">
                      <div className="bb-field"><label>{tb.blockCount}</label><input type="number" min={1} value={blokCount} onChange={(e) => setBlokCount(parseInt(e.target.value) || 0)} /></div>
                      <div className="bb-field"><label>{tb.perBlock}</label><input type="number" min={1} value={blokPer} onChange={(e) => setBlokPer(parseInt(e.target.value) || 0)} /></div>
                    </div>
                  )}
                  <div className="bb-preview">{unitsPreview}</div>
                </>
              )}
              {tip === "isletme" && (
                <div className="bb-field"><label>{tb.unitCountLbl}</label><input type="number" min={1} value={islCount} onChange={(e) => setIslCount(parseInt(e.target.value) || 0)} /></div>
              )}
              <div className="bb2-loc">
                <div className="bb2-loc-t">{tb.selectedLoc}</div>
                <div className="bb2-loc-s">{scanAddr || (il && ilce ? `${ilce} / ${il}` : tb.fromMap)}</div>
                {coordTxt && <div className="bb2-loc-c">{coordTxt}</div>}
                <button className="bb2-link" onClick={backToMap}>{tb.changeOnMap}</button>
              </div>
              <div className="bb-pricebox">
                <div className="bb-summary"><span className="k">{tb.sumBuilding}</span><span className="v">{ad.trim() || "—"}</span></div>
                <div className="bb-summary"><span className="k">{tb.sumType}</span><span className="v">{typeName}</span></div>
                <div className="bb-summary"><span className="k">{tb.sumUnit}</span><span className="v">{tip === "villa" ? tb.unit1 : `${bbFmt(unitCount)} ${tip === "isletme" ? tb.unitsW : tb.flatsW}`}</span></div>
                {matchedPlan && !isTeklif && (
                  <div className="bb-summary"><span className="k">Plan</span><span className="v">{matchedPlan.name}</span></div>
                )}
                <div className="bb-plbl" style={{ marginTop: 12 }}>{tb.estAmount}</div>
                <div className="bb-amt">{amount} {amountUnit && <small>{amountUnit}</small>}</div>
                <div className="bb-calc">{calc}</div>
                {!isTeklif && (
                  <div className="bb-bill">
                    <button className={bill === "ay" ? "active" : ""} onClick={() => setBill("ay")}>{tb.billMonthly}</button>
                    <button className={bill === "yil" ? "active" : ""} onClick={() => setBill("yil")}>{tb.billYearly}</button>
                  </div>
                )}
                <div className="bb-save">{save}</div>
              </div>
              <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={onPay}>{isTeklif ? tb.reqQuote : tb.payNow}</button>
              <p className="bb-hint" style={{ textAlign: "center", marginTop: 10 }}>{tb.trialNote}</p>
            </>
          ) : residentOpen ? (
            <>
              <button className="bb2-link" onClick={backFromSub}>{tb.back}</button>
              <h3 className="bb2-h">{tb.residentTitle(bbTitle(found?.ad || ""))}</h3>
              {!joinDone ? (
                <>
                  <div className="bb-field"><label>{tb.yourFlat}</label>
                    {(found?.daire || 0) > 0 ? (
                      <select value={resDaire} onChange={(e) => setResDaire(e.target.value)}>
                        {Array.from({ length: found?.daire || 1 }, (_, i) => i + 1).map((d) => (<option key={d} value={String(d)}>{tb.flat(d)}</option>))}
                      </select>
                    ) : (
                      <input value={resDaire} onChange={(e) => setResDaire(e.target.value)} placeholder={tb.flat(1)} autoComplete="off" />
                    )}
                  </div>
                  <div className="bb-field"><label>{tb.phone}</label><input value={resTel} onChange={(e) => setResTel(e.target.value)} placeholder={tb.phonePh} autoComplete="off" /></div>
                  {joinError && <div className="bb2-note">{joinError}</div>}
                  <button className="btn btn-primary btn-block" onClick={sendWebJoin} disabled={joining}>{joining ? "Gönderiliyor..." : tb.sendJoin}</button>
                </>
              ) : (
                <div className="bb-success"><b>{tb.joinDoneBold}</b>{tb.joinDone(bbTitle(found?.ad || ""))}</div>
              )}
            </>
          ) : scanned ? (
            <>
              {found ? (
                <>
                  <span className="bb2-tag ok">{tb.tagOk}</span>
                  <h3 className="bb2-found">{bbTitle(found.ad)}</h3>
                  <div className="bb2-meta">{[found.ilce, found.il].filter(Boolean).join(" / ")} · {found.daire > 1 ? `${bbFmt(found.daire)} ${tb.unitsWord}` : tb.single}</div>
                  <div className="bb2-addr"><span className="mk ok">✓</span><div><div className="t">{tb.matched}</div><div className="s">{scanAddr || tb.unresolved}</div><div className="c">{coordTxt}</div></div></div>
                  {foundList.length > 1 && (
                    <div className="bb2-others">
                      <div className="bb2-olbl">{tb.othersLbl}</div>
                      {foundList.slice(1).map((r, i) => (
                        <button className="bb2-orow" key={i} onClick={() => setFound(r)}><span>{bbTitle(r.ad)}</span><b>{tb.pick}</b></button>
                      ))}
                    </div>
                  )}
                  <div className="bb2-stack">
                    <button className="btn btn-primary btn-block" onClick={openResident}>{tb.joinResident}</button>
                    <button className="btn btn-soft btn-block" onClick={() => openManager("isletme")}>{tb.addCommercial}</button>
                  </div>
                </>
              ) : (
                <>
                  <span className="bb2-tag no">{tb.tagNo}</span>
                  <h3 className="bb2-found sm">{tb.firstAdd}</h3>
                  <div className="bb2-addr"><span className="mk no">+</span><div><div className="t">{tb.selectedLoc}</div><div className="s">{scanAddr || tb.unresolved}</div><div className="c">{coordTxt}</div></div></div>
                  <div className="bb2-stack">
                    <button className="btn btn-dark btn-block" onClick={() => openManager("apartman")}>{tb.addApart}</button>
                    <button className="btn btn-soft btn-block" onClick={() => openManager("villa")}>{tb.addVilla}</button>
                    <button className="btn btn-soft btn-block" onClick={() => openManager("isletme")}>{tb.addBiz}</button>
                  </div>
                </>
              )}
              <button className="bb2-link center" onClick={backToMap}>{tb.backScan}</button>
            </>
          ) : (
            <>
              <span className="bb2-eyebrow"><i />{tb.startEye}</span>
              <h3 className="bb2-h">{tb.startH}</h3>
              <p className="bb2-p">{tb.startP}</p>
              <div className="bb2-stack">
                <button className="btn btn-dark btn-block" onClick={doLocate} disabled={locating}>
                  <svg className="bb2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="8" /></svg>
                  {locating ? tb.locating : tb.locate}
                </button>
                <button className="btn btn-primary btn-block" onClick={doScan}>
                  <svg className="bb2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 21l-4.3-4.3" /><circle cx="11" cy="11" r="7" /></svg>
                  {tb.scan}
                </button>
              </div>
              <button className="bb2-link" onClick={() => setFindOpen((v) => !v)}>{tb.findToggle}</button>
              {findOpen && (
                <div className="bb2-find">
                  <input value={findText} onChange={(e) => setFindText(e.target.value)} placeholder={tb.findPh} onKeyDown={(e) => { if (e.key === "Enter") doFind(); }} />
                  <button className="btn btn-soft" onClick={doFind}>{tb.go}</button>
                </div>
              )}
              {locateMsg && <div className="bb2-note">{locateMsg}</div>}
              <p className="bb2-hint">{tb.hint}</p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function HomePage() {
  const [lang, setLang] = useState<Lang>("tr");
  const [theme, setTheme] = useState<Theme>("light");
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    try {
      const sl = localStorage.getItem("md_lang") as Lang | null;
      const st = localStorage.getItem("md_theme") as Theme | null;
      if (sl === "tr" || sl === "en") setLang(sl);
      if (st === "light" || st === "dark") setTheme(st);
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    } catch { }
  }, []);

  useEffect(() => { try { localStorage.setItem("md_lang", lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem("md_theme", theme); } catch {} }, [theme]);

  useEffect(() => {
    fetch("https://mobildiafon.com/api/plans")
      .then(r => r.json())
      .then(d => setPlans(d.plans || []))
      .catch(() => {});
  }, []);

  const t = T[lang];

  // Önerilen plan: Orta veya ortadaki plan
  const featuredPlan = plans.find(p => p.name === "Orta") || plans[Math.floor(plans.length / 2)];

  return (
    <UICtx.Provider value={{ lang, theme, setLang, setTheme, t, plans }}>
      <main className={`md-site mdland${theme === "dark" ? " dark" : ""}`}>
        <Header />
        <HeroCarousel />
        <BinaBul />
<section className="md-partners">
  <div className="md-wrap">
    <p className="md-partners-label">{t.partnersLabel}</p>
    <div className="md-partners-logos">
    <img src="/tuya-logo.svg" alt="Tuya uyumlu" className="md-partner-logo" />
<img src="/iyzico-logo.svg" alt="iyzico ile güvenli ödeme" className="md-partner-logo" />
<img src="/hetzner-logo.svg" alt="Hetzner Cloud" className="md-partner-logo" />
<img src="/aws-logo.svg" alt="Amazon Web Services" className="md-partner-logo" />
    </div>
  </div>
</section>
        <section id="nasil" className="md-section">
          <div className="md-wrap">
            <div className="md-center">
              <span className="md-eyebrow">{t.how.eye}</span>
              <h2 className="md-title">{t.how.title}</h2>
              <p className="md-lead md-lead-center">{t.how.lead}</p>
            </div>
            <div className="md-steps">
              {t.steps.map((s) => (
                <article className="md-step" key={s.no}>
                  <div className="md-step-num">{s.no}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ozellikler" className="md-section md-features-sec">
          <div className="md-wrap">
            <span className="md-eyebrow">{t.feat.eye}</span>
            <h2 className="md-title">{t.feat.title}</h2>
            <p className="md-lead">{t.feat.lead}</p>
            <div className="md-features md-feature-grid-6">
              {t.features.map((f) => (
                <article className="md-feature" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="fiyat" className="md-section">
          <div className="md-wrap">
            <div className="md-center">
              <span className="md-eyebrow">{t.price.eye}</span>
              <h2 className="md-title">{t.price.title}</h2>
              <p className="md-lead md-lead-center">{t.price.lead}</p>
            </div>
            <div className="md-pricing-grid">
              {plans.length === 0 ? (
                <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#888", padding: "40px 0" }}>Planlar yükleniyor...</div>
              ) : plans.map((p) => {
                const isFeatured = p.id === featuredPlan?.id;
                const isFree = p.monthlyPrice === 0;
                const detailText = p.minUnits === p.maxUnits
                  ? `${p.minUnits} birim`
                  : p.maxUnits
                  ? `${p.minUnits}–${p.maxUnits} daire`
                  : `${p.minUnits}+ daire`;
                return (
                  <article className={`md-price-card ${isFeatured ? "featured" : ""}`} key={p.id}>
                    {isFeatured && <span className="md-price-ribbon">{t.recommended}</span>}
                    <h3>{p.name}</h3>
                    <div className="md-price">
                      {isFree ? t.price.choose === "Choose Plan" ? "Quote" : "Teklif" : `₺${bbFmt(p.monthlyPrice)}/ay`}
                    </div>
                    <p>{detailText}</p>
                    <Link
                      href={`/satin-al?plan=${p.id}`}
                      className={isFeatured ? "md-btn md-btn-primary" : "md-btn md-btn-ghost"}
                    >
                      {t.price.choose}
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="md-wrap md-final-cta">
          <div>
            <span className="md-eyebrow">{t.finalCta.eye}</span>
            <h2>{t.finalCta.h2}</h2>
            <p>{t.finalCta.p}</p>
          </div>
          <Link href="/satin-al" className="md-btn md-btn-primary">{t.finalCta.btn}</Link>
        </section>

  {/* ====== FOOTER ====== */}
<footer className="md-footer">
  <div className="md-wrap md-foot-grid">
    {/* Marka + açıklama + sosyal */}
    <div className="md-foot-brand">
      <div className="md-foot-logo">Mobil<span className="d">Diafon</span></div>
      <p className="md-foot-about">{t.footer.about}</p>
      <div className="md-foot-social">
        <a href="#" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="2" width="20" height="20" rx="5.5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a href="#" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18V10H5.67v8h2.67zM7 8.8a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zM18.34 18v-4.4c0-2.36-1.26-3.46-2.94-3.46-1.36 0-1.96.75-2.3 1.28V10h-2.67v8h2.67v-4.42c0-.23.02-.47.09-.64.18-.47.61-.96 1.33-.96.94 0 1.32.72 1.32 1.77V18h2.5z" />
          </svg>
        </a>
      </div>
    </div>

    {/* Ürün */}
    <div className="md-foot-col">
      <h4>{t.footer.product}</h4>
      <a href="#nasil">{t.nav.how}</a>
      <a href="#ozellikler">{t.nav.features}</a>
      <a href="#fiyat">{t.nav.pricing}</a>
      <a href="#bina">{t.nav.add}</a>
      <a href="/blog">Blog</a>
    </div>

    {/* Paneller */}
    <div className="md-foot-col">
      <h4>{t.footer.panels}</h4>
      <Link href="/yonetici">{t.managerLogin}</Link>
      <Link href="/guvenlik">{t.securityLogin}</Link>
      <Link href="/superadmin">{t.footer.superadmin}</Link>
    </div>

    {/* Yasal */}
    <div className="md-foot-col">
      <h4>{t.footer.legal}</h4>
      <Link href="/gizlilik">{t.footer.privacy}</Link>
      <Link href="/kullanim-sartlari">{t.footer.terms}</Link>
      <Link href="/mesafeli-satis">{t.footer.distanceSales}</Link>
      <Link href="/iletisim">{t.footer.contact}</Link>
    </div>

    {/* İletişim + mağazalar */}
    <div className="md-foot-col md-foot-contact">
      <h4>{t.footer.contactTitle}</h4>
      <a href="mailto:info@mobildiafon.com" className="md-foot-mail">info@mobildiafon.com</a>
      <div className="md-foot-addr">
        <strong>Türkiye</strong>
        <span>{t.footer.addrTR}</span>
      </div>
      <div className="md-foot-addr">
        <strong>Belçika</strong>
        <span>{t.footer.addrBE}</span>
      </div>
      <div className="md-foot-stores">
        <a href="#" aria-label="App Store" className="md-store">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.02-2.05 1.68-3.03 1.76-3.08-.96-1.4-2.45-1.59-2.98-1.61-1.27-.13-2.48.75-3.12.75-.64 0-1.64-.73-2.69-.71-1.38.02-2.66.8-3.37 2.04-1.44 2.49-.37 6.17 1.03 8.19.69.99 1.51 2.1 2.58 2.06 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.61.67 2.71.65 1.12-.02 1.83-1 2.51-2 .79-1.15 1.12-2.26 1.13-2.32-.03-.01-2.17-.83-2.19-3.3l.01.01zM15.1 6.07c.57-.69.95-1.65.85-2.6-.82.03-1.81.54-2.4 1.23-.53.61-.99 1.59-.86 2.52.91.07 1.84-.46 2.41-1.15z" /></svg>
          <div><small>İndir</small><b>App Store</b></div>
        </a>
        <a href="#" aria-label="Google Play" className="md-store">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 2.3c-.3.3-.5.7-.5 1.3v16.8c0 .6.2 1 .5 1.3l.1.1L13 12.6v-.2L3.7 2.2l-.1.1zM16.3 15.9l-3-3v-.2l3-3 .1.1 3.6 2c1 .6 1 1.5 0 2.1l-3.6 2-.1.1zM14.8 14.4l-3.1-3.1L4.3 18.7c.3.4.9.4 1.5.1l9-5.1-.1.7zM5.8 5.2c-.6-.3-1.2-.3-1.5.1l7.4 7.4 3.1-3.1-9-5.1z" /></svg>
          <div><small>İndir</small><b>Google Play</b></div>
        </a>
      </div>
    </div>
  </div>

  <div className="md-wrap md-foot-bottom">
    <span>{t.footer.copy}</span>
    <span>{t.footer.slogan}</span>
  </div>
</footer>
      </main>
    </UICtx.Provider>
  );
}