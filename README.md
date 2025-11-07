# NodeBB Guest Access Control Plugin

**NodeBB v4.x.x** için gelişmiş misafir erişim kontrol plugin'i. Forumunuzda misafir kullanıcıların erişimini yönetmenizi, zorunlu kayıt sistemi oluşturmanızı ve ziyaretçi analitiği yapmanızı sağlar.

## 🚀 Özellikler

### Ana Özellikler
- ✅ **Zorunlu Kayıt Modu**: Misafir kullanıcıları otomatik olarak kayıt sayfasına yönlendirir
- 🔒 **Kategori Koruması**: Belirli kategorileri misafir kullanıcılardan gizler
- 🎨 **Özelleştirilebilir Mesajlar**: Misafir kullanıcılara özel karşılama ve bilgilendirme mesajları
- 🔄 **Akıllı Yönlendirme**: Kayıt/giriş sonrası kullanıcıyı istediği sayfaya yönlendirir
- 📊 **Detaylı Analitik**: Engellenen denemeler ve benzersiz ziyaretçi takibi
- 🛡️ **Rate Limiting**: IP bazlı hız sınırlaması ile brute force koruması
- 🔐 **API Erişim Kontrolü**: Misafir kullanıcıların API erişimini engelleyebilme
- ⚡ **Whitelist Sistemi**: Belirli sayfaların misafir erişimine açık kalması
- 🎯 **Performans Odaklı**: Senkron çalışan, optimize edilmiş kod yapısı

## 📦 Kurulum

### Yöntem 1: NPM ile (Önerilen)
\`\`\`bash
npm install nodebb-plugin-guest-access-control
\`\`\`

### Yöntem 2: GitHub'dan
\`\`\`bash
cd /path/to/nodebb/node_modules
git clone https://github.com/FORSTLAND/nodebb-plugin-guest-access-control.git
cd nodebb-plugin-guest-access-control
npm install
\`\`\`

### Yöntem 3: Manuel Kurulum
1. Plugin dosyalarını `node_modules/nodebb-plugin-guest-access-control` klasörüne kopyalayın
2. NodeBB'yi yeniden başlatın

## 🔧 Aktivasyon

1. NodeBB Admin Panel → **Extend** → **Plugins** bölümüne gidin
2. "Guest Access Control" plugin'ini bulun ve **Activate** butonuna tıklayın
3. NodeBB'yi yeniden başlatın (gerekirse)
4. Admin Panel → **Plugins** → **Guest Access Control** ile ayarlara erişin

## ⚙️ Yapılandırma

### Ana Ayarlar

**Plugin'i Etkinleştir**: Plugin'in tüm özelliklerini aktif/deaktif eder

**Zorunlu Kayıt Modu**: Aktif edildiğinde misafir kullanıcılar foruma erişemez ve otomatik olarak kayıt sayfasına yönlendirilir

**Özel Başlık ve Mesaj**: Misafir kullanıcılara gösterilecek özel bilgilendirme mesajları

### Yönlendirme Ayarları

**Kayıt Sayfasına Yönlendir**: Aktif ise `/register`, değilse `/login` sayfasına yönlendirir

**Özel Yönlendirme URL**: Varsayılan yönlendirme yerine özel bir sayfa kullanabilirsiniz

**İzin Verilen Yollar**: Misafir kullanıcıların erişebileceği yollar (virgülle ayrılmış)
\`\`\`
Örnek: /login,/register,/reset,/api,/assets,/plugins
\`\`\`

**Misafir Kullanıcılara Açık Sayfalar**: Ana sayfa türleri
\`\`\`
Örnek: home,recent,popular,top
\`\`\`

### Kategori Koruması

**Korunan Kategori ID'leri**: Misafir kullanıcılardan gizlenecek kategorilerin ID'leri (virgülle ayrılmış)
\`\`\`
Örnek: 1,2,3
\`\`\`

Kategori ID'lerini öğrenmek için:
1. Admin Panel → **Manage** → **Categories**
2. Kategori URL'sinde ID'yi görürsünüz: `/admin/manage/categories/1`

### Karşılama Mesajı

**Karşılama Mesajını Göster**: Misafir kullanıcılara özel karşılama banner'ı gösterir

**Başlık ve İçerik**: Karşılama mesajının içeriğini özelleştirin

### Güvenlik Ayarları

**İstatistikleri Etkinleştir**: Engellenen denemeleri ve ziyaretçi sayısını takip eder

**API Erişimini Engelle**: Misafir kullanıcıların `/api/*` endpoint'lerine erişimini engeller

**Hız Sınırlaması**: IP bazlı rate limiting
- **Maksimum İstek Sayısı**: Zaman penceresi içinde izin verilen maksimum istek (varsayılan: 10)
- **Zaman Penceresi**: Saniye cinsinden süre (varsayılan: 60)

## 📊 İstatistikler

Admin panelinde gerçek zamanlı istatistikler görebilirsiniz:

- **Engellenen Denemeler**: Misafir kullanıcıların engellenen erişim denemeleri
- **Benzersiz Ziyaretçi**: IP bazlı benzersiz misafir ziyaretçi sayısı
- **Son Sıfırlama**: İstatistiklerin en son ne zaman sıfırlandığı

İstatistikler 30 saniyede bir otomatik olarak güncellenir.

## 🔍 Nasıl Çalışır?

1. **Misafir Kontrolü**: Her sayfa yüklemesinde kullanıcının giriş yapıp yapmadığı kontrol edilir
2. **Whitelist Kontrolü**: İstek yapılan yol whitelist'te var mı kontrol edilir
3. **Rate Limiting**: IP bazlı istek sayısı kontrol edilir
4. **Kategori Filtreleme**: Korunan kategoriler misafir kullanıcılardan gizlenir
5. **Yönlendirme**: Erişim reddedilirse kullanıcı belirlenen sayfaya yönlendirilir
6. **Giriş Sonrası**: Kullanıcı giriş yaptıktan sonra istediği sayfaya otomatik yönlendirilir

## 🛠️ Gelişmiş Kullanım

### Wildcard Yollar

Whitelist'te wildcard kullanabilirsiniz:
\`\`\`
/api/*,/assets/*,/plugins/*
\`\`\`

### Özel Tema Entegrasyonu

Plugin, template'lere `guestWelcomeMessage` değişkenini enjekte eder. Kendi temanızda kullanabilirsiniz:

\`\`\`html
<!-- IF guestWelcomeMessage.enabled -->
<div class="{guestWelcomeMessage.customClass}">
    <h3>{guestWelcomeMessage.title}</h3>
    <p>{guestWelcomeMessage.content}</p>
</div>
<!-- ENDIF guestWelcomeMessage.enabled -->
\`\`\`

## 🐛 Hata Ayıklama

Plugin logları NodeBB console'da görüntülenebilir:

\`\`\`bash
./nodebb log
\`\`\`

Plugin ile ilgili loglar `[plugin/guest-access-control]` prefix'i ile başlar.

## 🔄 Güncelleme

\`\`\`bash
cd /path/to/nodebb/node_modules/nodebb-plugin-guest-access-control
git pull
npm install
./nodebb build
./nodebb restart
\`\`\`

## 📝 Lisans

MIT License - FORSTLAND tarafından geliştirilmiştir.

## 🤝 Katkıda Bulunma

Katkılar memnuniyetle karşılanır! Lütfen pull request göndermeden önce:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 Destek

- **Issues**: [GitHub Issues](https://github.com/FORSTLAND/nodebb-plugin-guest-access-control/issues)
- **Discussions**: [GitHub Discussions](https://github.com/FORSTLAND/nodebb-plugin-guest-access-control/discussions)

## 🌟 Özellikler (Detaylı)

### Senkron Çalışma
Tüm fonksiyonlar optimize edilmiş ve senkron çalışacak şekilde tasarlanmıştır. Rate limiting ve analytics için in-memory storage kullanılır, bu sayede ekstra veritabanı sorgusu yapılmaz.

### Performans
- Minimal hook kullanımı
- Verimli whitelist kontrolü
- In-memory caching
- Otomatik garbage collection (rate limit için)

### Güvenlik
- XSS koruması (input sanitization)
- Rate limiting
- IP tracking
- API access control
- Session management

### Kullanıcı Deneyimi
- Otomatik return URL tracking
- Özelleştirilebilir mesajlar
- Responsive admin panel
- Gerçek zamanlı analytics
- Kolay yapılandırma

---

**Developed with ❤️ by FORSTLAND**
