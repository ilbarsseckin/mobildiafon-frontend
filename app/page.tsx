"use client";

import { useState, useEffect, useRef, createContext, useContext, type PointerEvent } from "react";
import Link from "next/link";

/* ============================================================
   DİL (i18n) + TEMA
   ============================================================ */
type Lang = "tr" | "en";
type Theme = "light" | "dark";

const T = {
  tr: {
    tagline: "Dijital Diafon Platformu",
    trust: ["Panelsiz kurulum", "7/24 görüntülü çağrı", "KVKK uyumlu altyapı"],
    managerLogin: "Yönetici Girişi",
    securityLogin: "Güvenlik Girişi",
    nav: { add: "Binanı Ekle", how: "Nasıl Çalışır", features: "Özellikler", pricing: "Fiyatlandırma", digitalize: "Binanı Dijitalleştir" },
    callLabel: "Gelen Çağrı",
    slides: [
      { eye: "QR + Konum tabanlı diafon", ta: "Diafonu binadan çıkarıp ", em: "telefonunuza taşıyoruz", tb: "", sub: "Apartman, site ve işletmeler için panelsiz, görüntülü kapı iletişimi. Ziyaretçi QR’ı okutur, siz neredeyseniz oradan açarsınız.", c1: "Binanı Dijitalleştir", c2: "▷ Nasıl çalışır?", b1: "QR ile bina bulma", b2: "Görüntülü arama", tlH: "Konum alanı", tlTag: "120 m", tlP: "Bina çevresinde liste açılır", brH: "Yıldız Sitesi · A Blok", brP: "48 daire · 92 sakin", pT: "Apartman Girişi", pM: "Daire 12 · Ziyaretçi", pD: "🔓 Tuya ile kapıyı aç" },
      { eye: "Villa & müstakil", ta: "Villanızın kapısı artık ", em: "cebinizde", tb: "", sub: "Tek birim, dakikalar içinde kurulum. Bahçe kapısındaki QR’ı okutan ziyaretçiyi görüntülü karşılayın, kapıyı uzaktan açın.", c1: "Hemen Başla", c2: "Örneği gör", b1: "Panelsiz, kablosuz", b2: "Uzaktan kapı açma", trH: "Villa QR", trTag: "✓ Doğrulandı", pT: "Bahçe Kapısı", pM: "Ziyaretçi geldi", pD: "🔓 Kapıyı aç" },
      { eye: "Otel · AVM · Kampüs", ta: "Oda QR’ından ", em: "doğru birime tek dokunuş", tb: "", sub: "Resepsiyon, havuz, restoran… her birim kendi QR’ıyla. Misafir aradığı yere saniyeler içinde ulaşır, talebini iletir.", c1: "Çözümü İncele", c2: "Demo iste", b1: "Kategorili birimler", b2: "Sipariş / talep notu", tlH: "Oda 312", tlTag: "QR ✓", tlP: "Misafir araması", units: "Birimler", u1: "Resepsiyon", u2: "Havuz", u3: "Restoran", pT: "Resepsiyon", pM: "Oda 312 arıyor", pD: "📝 “Oda 312’ye çay” notu" },
      { eye: "Akıllı kapı", ta: "Görüntülü gör, ", em: "uzaktan kapıyı aç", tb: "", sub: "Tuya ve Zigbee entegrasyonu ile kapı, bariyer ve turnikeyi tek dokunuşla açın. Anahtara, panele, kabloya son.", c1: "Binanı Dijitalleştir", c2: "Entegrasyonlar", b1: "Tuya / Zigbee", b2: "Kapı · bariyer · turnike", trH: "Akıllı Cihazlar", d1: "Bina kapısı", d2: "Otopark bariyeri", pStatus: "Bağlandı · 00:12", pT: "Apartman Girişi", pM: "Görüntülü görüşme", pD: "🔓 Kapıyı Aç" },
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
      priceLine: (n: string, r: number) => `${n} daire × ₺${r}/daire`,
      yearSuffix: " · 12 ay yerine 10 ay",
      billMonthly: "Aylık", billYearly: "Yıllık",
      saveYear: "Yıllık ödemede 2 ay bedava", saveAmt: (x: string) => `₺${x} tasarruf`,
      payNow: "Ödemeye Geç", reqQuote: "Teklif İste", trialNote: "14 gün ücretsiz deneme · istediğin zaman iptal",
    },
    how: { eye: "Sistem Akışı", title: "Ziyaretçi için kolay, yönetici için kontrollü.", lead: "Karmaşık donanım dili yerine sade bir kullanıcı akışı: QR okut, binayı doğrula, daireyi ara." },
    steps: [
      { no: "01", title: "QR veya konumla binayı bulun", text: "Ziyaretçi bina girişindeki QR kodu okutur ya da uygulamada konumuna yakın kayıtlı binayı seçer." },
      { no: "02", title: "Daire listesinden kişiyi arayın", text: "Yetkili daire ve sakin listesi açılır. Ziyaretçi doğru daireye tek dokunuşla görüntülü çağrı başlatır." },
      { no: "03", title: "Telefon çalar, kapı yönetilir", text: "Ev sahibi çağrıyı telefondan yanıtlar. Uygun yapılarda Tuya entegrasyonu ile kapı açma desteklenir." },
    ],
    feat: { eye: "Kurumsal Altyapı", title: "Apartman yönetimi, güvenlik ve sakinler aynı sistemde.", lead: "Marka algısını sade tutan, güven veren ve mobilde hızlı çalışan bir ürün deneyimi." },
    features: [
      { title: "Panelsiz dijital diafon", text: "Ayrı kapı paneli şartı olmadan QR ve mobil arama akışıyla bina iletişimini dijitale taşır." },
      { title: "Konum kontrollü erişim", text: "Bina yöneticisi isterse konum yarıçapı tanımlar; liste yalnızca bina çevresinde görünür." },
      { title: "Yönetici ve güvenlik paneli", text: "Sakin onayı, daire yönetimi, güvenlik görevlisi ekleme, çağrı kayıtları ve not bırakma ekranları hazırdır." },
      { title: "Apartman, site ve işletme uyumlu", text: "Tek bloktan çoklu site yapısına kadar ölçeklenebilir. Villa, ofis ve işletme girişleri için de uygundur." },
      { title: "QR ile hızlı kurulum", text: "Her bina için QR kod üretilebilir; apartman girişine asılan afiş üzerinden hızlı erişim sağlanır." },
      { title: "Kurumsal abonelik altyapısı", text: "Başlangıç, profesyonel ve kurumsal planlarla satış, deneme ve yönetim süreci sadeleşir." },
    ],
    price: { eye: "Abonelik", title: "Binanıza uygun planı seçin.", lead: "Başlangıç için hızlı deneme, büyüyen siteler için profesyonel yönetim, büyük yapılar için kurumsal teklif.", choose: "Planı Seç" },
    plans: [
      { name: "Başlangıç", price: "₺499/ay", detail: "30 daireye kadar", href: "/satin-al?plan=baslangic", featured: false },
      { name: "Profesyonel", price: "₺1.299/ay", detail: "150 daireye kadar", href: "/satin-al?plan=profesyonel", featured: true },
      { name: "Kurumsal", price: "Teklif", detail: "Çoklu site ve işletmeler", href: "/satin-al?plan=kurumsal", featured: false },
    ],
    recommended: "Önerilen",
    finalCta: { eye: "MobilDiafon", h2: "Binanızın dijital giriş deneyimini bugün başlatın.", p: "QR afiş, konum doğrulama, yönetici onayı ve güvenlik paneliyle kurumsal bir kapı iletişim sistemi kurun.", btn: "Başvuru Oluştur" },
    footer: { about: "QR ve konum tabanlı dijital diafon platformu. Apartman, site ve işletmeler için modern iletişim çözümü.", product: "Ürün", panels: "Paneller", superadmin: "Süper Admin", copy: "© 2026 MobilDiafon", slogan: "Diafon artık cebinizde." },
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
      { eye: "QR + location-based intercom", ta: "We move the intercom off the wall ", em: "and into your phone", tb: "", sub: "Panel-free video door communication for apartments, complexes and businesses. Visitors scan the QR; you answer from wherever you are.", c1: "Digitalize Your Building", c2: "▷ How it works", b1: "Find building by QR", b2: "Video calling", tlH: "Location zone", tlTag: "120 m", tlP: "List opens around the building", brH: "Star Complex · Block A", brP: "48 flats · 92 residents", pT: "Building Entrance", pM: "Flat 12 · Visitor", pD: "🔓 Open door via Tuya" },
      { eye: "Villas & detached homes", ta: "Your villa’s gate is now ", em: "in your pocket", tb: "", sub: "Single unit, set up in minutes. Greet the visitor scanning the gate QR over video and open the gate remotely.", c1: "Get Started", c2: "See example", b1: "Panel-free, wireless", b2: "Remote door opening", trH: "Villa QR", trTag: "✓ Verified", pT: "Garden Gate", pM: "Visitor arrived", pD: "🔓 Open gate" },
      { eye: "Hotel · Mall · Campus", ta: "From the room QR ", em: "to the right unit in one tap", tb: "", sub: "Reception, pool, restaurant… each unit with its own QR. Guests reach the right place in seconds and send their request.", c1: "Explore Solution", c2: "Request demo", b1: "Categorized units", b2: "Order / request note", tlH: "Room 312", tlTag: "QR ✓", tlP: "Guest call", units: "Units", u1: "Reception", u2: "Pool", u3: "Restaurant", pT: "Reception", pM: "Room 312 calling", pD: "📝 “Tea to room 312” note" },
      { eye: "Smart door", ta: "See on video, ", em: "open the door remotely", tb: "", sub: "Open doors, barriers and turnstiles in one tap with Tuya and Zigbee integration. No keys, no panels, no wiring.", c1: "Digitalize Your Building", c2: "Integrations", b1: "Tuya / Zigbee", b2: "Door · barrier · turnstile", trH: "Smart Devices", d1: "Building door", d2: "Parking barrier", pStatus: "Connected · 00:12", pT: "Building Entrance", pM: "Video call", pD: "🔓 Open Door" },
    ],
    bina: {
      eye: "Add Building", title: "Find it on the map, join in a minute",
      lead: "Enable your location, place the pin on your building and scan. If it’s registered you join as a resident or business; if not, you’re the first to add it. No app required.",
      startEye: "Find by location", startH: "Find your building on the map",
      startP: "The pin stays at the center of the map. Drag the map to center your building, then scan.",
      locate: "Use my location", locating: "Getting location…", scan: "Scan this location",
      findToggle: "Or type a city / district / neighborhood", findPh: "e.g. Soho, London", go: "Go",
      hint: "On desktop, location may be approximate — drag the map to center if needed.",
      loadMap: "Loading map…", mapErr: "Map failed to load. Check your internet connection.",
      noGeo: "Your browser doesn’t support location. Drag the map or type an address.",
      denied: "permission denied", noSignal: "no signal",
      locErr: (r: string) => `Couldn’t access location (${r}). Drag the map or type an address below.`,
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
      joinDone: (ad: string) => ` Once the ${ad} manager approves, you’ll be connected. Install the MobilDiafon app to receive calls — you’ll be linked automatically with this sign-up.`,
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
      priceLine: (n: string, r: number) => `${n} flats × ₺${r}/flat`,
      yearSuffix: " · 10 months instead of 12",
      billMonthly: "Monthly", billYearly: "Yearly",
      saveYear: "2 months free on annual billing", saveAmt: (x: string) => `₺${x} saved`,
      payNow: "Continue to payment", reqQuote: "Request quote", trialNote: "14-day free trial · cancel anytime",
    },
    how: { eye: "How It Works", title: "Easy for visitors, controlled for managers.", lead: "A simple user flow instead of complex hardware talk: scan the QR, confirm the building, call the flat." },
    steps: [
      { no: "01", title: "Find the building by QR or location", text: "The visitor scans the QR at the entrance, or picks a nearby registered building in the app." },
      { no: "02", title: "Call the right person from the list", text: "The authorized flat and resident list opens. The visitor starts a video call to the right flat in one tap." },
      { no: "03", title: "Phone rings, door is managed", text: "The resident answers from their phone. Where supported, door opening works via Tuya integration." },
    ],
    feat: { eye: "Enterprise Infrastructure", title: "Building management, security and residents in one system.", lead: "A product experience that keeps the brand clean, builds trust and runs fast on mobile." },
    features: [
      { title: "Panel-free digital intercom", text: "Brings building communication into the digital world via QR and mobile calling — no separate door panel required." },
      { title: "Location-controlled access", text: "The manager can define a location radius; the list appears only around the building." },
      { title: "Manager and security panels", text: "Resident approval, flat management, adding security staff, call logs and note-leaving screens are ready." },
      { title: "Apartment, complex and business ready", text: "Scales from a single block to multi-building complexes. Suitable for villas, offices and businesses too." },
      { title: "Quick setup with QR", text: "A QR code can be generated per building; a poster at the entrance provides quick access." },
      { title: "Built-in subscription system", text: "Sales, trial and management are streamlined with starter, professional and enterprise plans." },
    ],
    price: { eye: "Subscription", title: "Choose the plan that fits your building.", lead: "A quick trial to start, professional management for growing complexes, an enterprise quote for large structures.", choose: "Choose Plan" },
    plans: [
      { name: "Starter", price: "₺499/mo", detail: "Up to 30 flats", href: "/satin-al?plan=baslangic", featured: false },
      { name: "Professional", price: "₺1,299/mo", detail: "Up to 150 flats", href: "/satin-al?plan=profesyonel", featured: true },
      { name: "Enterprise", price: "Quote", detail: "Multi-complex and businesses", href: "/satin-al?plan=kurumsal", featured: false },
    ],
    recommended: "Recommended",
    finalCta: { eye: "MobilDiafon", h2: "Start your building’s digital entry experience today.", p: "Set up an enterprise door-communication system with QR posters, location verification, manager approval and a security panel.", btn: "Get Started" },
    footer: { about: "QR and location-based digital intercom platform. A modern communication solution for apartments, complexes and businesses.", product: "Product", panels: "Panels", superadmin: "Super Admin", copy: "© 2026 MobilDiafon", slogan: "Your intercom, now in your pocket." },
    aria: { theme: "Light/dark theme", menu: "Toggle menu", prev: "Previous", next: "Next", slide: (n: number) => `Slide ${n}` },
  },
};

type Dict = typeof T["tr"];

const UICtx = createContext<{ lang: Lang; theme: Theme; setLang: (l: Lang) => void; setTheme: (t: Theme) => void; t: Dict }>({
  lang: "tr", theme: "light", setLang: () => {}, setTheme: () => {}, t: T.tr,
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
          </nav>
          <div className="nav-cta">
            <button className="ui-icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t.aria.theme}>
              {theme === "dark" ? <IconSun /> : <IconMoon />}
            </button>
            <div className="ui-lang" role="group" aria-label="Language">
              <button className={lang === "tr" ? "on" : ""} onClick={() => setLang("tr")}>TR</button>
              <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            </div>
            <Link href="/satin-al?plan=profesyonel" className="btn btn-primary btn-sm">{t.nav.digitalize}</Link>
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

  const cls = (n: number) => `hc-slide ${index === n ? "is-active" : ""}`;

  return (
    <section className={`hero ${paused ? "paused" : ""}`} aria-label="Hero"
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
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=profesyonel" className="btn btn-primary">{s[0].c1}</Link>
                  <a href="#nasil" className="btn btn-ghost">{s[0].c2}</a>
                </div>
                <div className="badges anim">
                  <span><IconQr /> {s[0].b1}</span>
                  <span><IconVideo /> {s[0].b2}</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tl"><h5>{s[0].tlH} <span className="tag">{s[0].tlTag}</span></h5><p>{s[0].tlP}</p></div>
                <div className="fcard f-br"><h5>{s[0].brH}</h5><p>{s[0].brP}</p></div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">{t.callLabel}</span>
                  <div className="ring">12</div>
                  <h4>{s[0].pT}</h4><span className="meta">{s[0].pM}</span>
                  <CallActions />
                  <span className="door">{s[0].pD}</span>
                </div></div>
              </div>
            </div>
          </div>

          <div className={cls(1)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[1].eye}</span>
                <h1 className="h1 anim">{s[1].ta}<em>{s[1].em}</em>{s[1].tb}</h1>
                <p className="sub anim">{s[1].sub}</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=baslangic" className="btn btn-primary">{s[1].c1}</Link>
                  <a href="#nasil" className="btn btn-ghost">{s[1].c2}</a>
                </div>
                <div className="badges anim">
                  <span><IconHome /> {s[1].b1}</span>
                  <span><IconGear /> {s[1].b2}</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tr"><h5>{s[1].trH} <span className="tag">{s[1].trTag}</span></h5><div className="qrbox" /></div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">{t.callLabel}</span>
                  <div className="ring">🏡</div>
                  <h4>{s[1].pT}</h4><span className="meta">{s[1].pM}</span>
                  <CallActions />
                  <span className="door">{s[1].pD}</span>
                </div></div>
              </div>
            </div>
          </div>

          <div className={cls(2)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[2].eye}</span>
                <h1 className="h1 anim">{s[2].ta}<em>{s[2].em}</em>{s[2].tb}</h1>
                <p className="sub anim">{s[2].sub}</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=kurumsal" className="btn btn-primary">{s[2].c1}</Link>
                  <a href="#fiyat" className="btn btn-ghost">{s[2].c2}</a>
                </div>
                <div className="badges anim">
                  <span><IconGrid /> {s[2].b1}</span>
                  <span><IconLines /> {s[2].b2}</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tl"><h5>{s[2].tlH} <span className="tag">{s[2].tlTag}</span></h5><p>{s[2].tlP}</p></div>
                <div className="fcard f-br" style={{ width: 218 }}>
                  <h5 style={{ marginBottom: 6 }}>{s[2].units}</h5>
                  <div className="mini"><span className="ic">🛎️</span><b>{s[2].u1}</b></div>
                  <div className="mini"><span className="ic">🏊</span><b>{s[2].u2}</b></div>
                  <div className="mini"><span className="ic">🍽️</span><b>{s[2].u3}</b></div>
                </div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">{t.callLabel}</span>
                  <div className="ring">🛎️</div>
                  <h4>{s[2].pT}</h4><span className="meta">{s[2].pM}</span>
                  <CallActions />
                  <span className="door">{s[2].pD}</span>
                </div></div>
              </div>
            </div>
          </div>

          <div className={cls(3)}>
            <div className="wrap hc-grid">
              <div>
                <span className="eyebrow anim"><i /> {s[3].eye}</span>
                <h1 className="h1 anim">{s[3].ta}<em>{s[3].em}</em>{s[3].tb}</h1>
                <p className="sub anim">{s[3].sub}</p>
                <div className="cta-row anim">
                  <Link href="/satin-al?plan=profesyonel" className="btn btn-primary">{s[3].c1}</Link>
                  <a href="#ozellikler" className="btn btn-ghost">{s[3].c2}</a>
                </div>
                <div className="badges anim">
                  <span><IconLock /> {s[3].b1}</span>
                  <span><IconArrows /> {s[3].b2}</span>
                </div>
              </div>
              <div className="stage anim" aria-hidden="true">
                <div className="fcard f-tr"><h5>{s[3].trH}</h5>
                  <div className="mini"><span className="ic">🚪</span><b>{s[3].d1}</b></div>
                  <div className="mini"><span className="ic">🚧</span><b>{s[3].d2}</b></div>
                </div>
                <div className="phone"><div className="phone-notch" /><div className="screen">
                  <span className="label">{s[3].pStatus}</span>
                  <div className="ring green">🔓</div>
                  <h4>{s[3].pT}</h4><span className="meta">{s[3].pM}</span>
                  <span className="door open">{s[3].pD}</span>
                </div></div>
              </div>
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
   BİNANI BUL — veri + harita yardımcıları
   ============================================================ */
type Bldg = { il: string; ilce: string; ad: string; daire: number; lat: number; lng: number };

const DEMO_MODE = true;

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
const bbRate = (n: number) => (n <= 20 ? 15 : n <= 60 ? 13 : n <= 150 ? 11 : 9);

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
  } catch { /* yoksay */ }
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
    const res = await fetch(`/api/buildings/near?lat=${center.lat}&lng=${center.lng}&r=${FOUND_RADIUS}`);
    if (!res.ok) return [];
    return (await res.json()) as Bldg[];
  } catch { return []; }
}

/* ============================================================
   BİNANI BUL — harita-önce akış
   ============================================================ */
function BinaBul() {
  const { t } = useUI();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  function openManager(tp: "apartman" | "villa" | "isletme") { setTip(tp); setManagerOpen(true); setResidentOpen(false); }

  const unitCount = tip === "villa" ? 1 : tip === "isletme" ? Math.max(1, islCount || 0) : yapi === "duz" ? Math.max(1, duzCount || 0) : Math.max(1, blokCount || 0) * Math.max(1, blokPer || 0);
  const blockLetter = String.fromCharCode(64 + Math.min(Math.max(1, blokCount || 0), 26));
  const unitsPreview = yapi === "duz" ? tb.previewFlat(Math.max(1, duzCount || 0)) : tb.previewBlock(Math.max(1, blokCount || 0), Math.max(1, blokPer || 0), blockLetter);

  const isTeklif = tip === "isletme";
  const monthly = tip === "villa" ? 49 : unitCount * bbRate(unitCount);
  const priceLine = tip === "villa" ? tb.priceFlat : tb.priceLine(bbFmt(unitCount), bbRate(unitCount));
  const amount = isTeklif ? tb.corpQuote : bill === "ay" ? `₺${bbFmt(monthly)}` : `₺${bbFmt(monthly * 10)}`;
  const amountUnit = isTeklif ? "" : bill === "ay" ? tb.perMonth : tb.perYear;
  const calc = isTeklif ? tb.calcCorp : bill === "ay" ? priceLine : `${priceLine}${tb.yearSuffix}`;
  const save = isTeklif ? "" : bill === "ay" ? tb.saveYear : tb.saveAmt(bbFmt(monthly * 2));
  const typeName = tip === "apartman" ? tb.typeApart : tip === "villa" ? tb.typeVilla : tb.typeBiz;
  const coordTxt = scanCenter ? `${scanCenter.lat.toFixed(6)}, ${scanCenter.lng.toFixed(6)}` : "";

  function onPay() {
    const fields: Record<string, string> = { tip, il, ilce, ad: ad.trim(), birim: String(unitCount), yapi, bill };
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
                    <select value={resDaire} onChange={(e) => setResDaire(e.target.value)}>
                      {Array.from({ length: found?.daire || 1 }, (_, i) => i + 1).map((d) => (<option key={d} value={String(d)}>{tb.flat(d)}</option>))}
                    </select>
                  </div>
                  <div className="bb-field"><label>{tb.phone}</label><input value={resTel} onChange={(e) => setResTel(e.target.value)} placeholder={tb.phonePh} autoComplete="off" /></div>
                  <button className="btn btn-primary btn-block" onClick={() => setJoinDone(true)}>{tb.sendJoin}</button>
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

  useEffect(() => {
    try {
      const sl = localStorage.getItem("md_lang") as Lang | null;
      const st = localStorage.getItem("md_theme") as Theme | null;
      if (sl === "tr" || sl === "en") setLang(sl);
      if (st === "light" || st === "dark") setTheme(st);
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    } catch { /* yoksay */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("md_lang", lang); } catch {} }, [lang]);
  useEffect(() => { try { localStorage.setItem("md_theme", theme); } catch {} }, [theme]);

  const t = T[lang];

  return (
    <UICtx.Provider value={{ lang, theme, setLang, setTheme, t }}>
      <main className={`md-site mdland${theme === "dark" ? " dark" : ""}`}>
        <Header />
        <HeroCarousel />
        <BinaBul />

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
              {t.plans.map((p) => (
                <article className={`md-price-card ${p.featured ? "featured" : ""}`} key={p.name}>
                  {p.featured && <span className="md-price-ribbon">{t.recommended}</span>}
                  <h3>{p.name}</h3>
                  <div className="md-price">{p.price}</div>
                  <p>{p.detail}</p>
                  <Link href={p.href} className={p.featured ? "md-btn md-btn-primary" : "md-btn md-btn-ghost"}>{t.price.choose}</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="md-wrap md-final-cta">
          <div>
            <span className="md-eyebrow">{t.finalCta.eye}</span>
            <h2>{t.finalCta.h2}</h2>
            <p>{t.finalCta.p}</p>
          </div>
          <Link href="/satin-al?plan=profesyonel" className="md-btn md-btn-primary">{t.finalCta.btn}</Link>
        </section>

        <footer className="md-footer">
          <div className="md-wrap md-foot-grid">
            <div>
              <div className="md-foot-logo">Mobil<span className="d">Diafon</span></div>
              <p className="md-foot-about">{t.footer.about}</p>
            </div>
            <div className="md-foot-col">
              <h4>{t.footer.product}</h4>
              <a href="#nasil">{t.nav.how}</a>
              <a href="#ozellikler">{t.nav.features}</a>
              <a href="#fiyat">{t.nav.pricing}</a>
            </div>
            <div className="md-foot-col">
              <h4>{t.footer.panels}</h4>
              <Link href="/yonetici">{t.managerLogin}</Link>
              <Link href="/guvenlik">{t.securityLogin}</Link>
              <Link href="/superadmin">{t.footer.superadmin}</Link>
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