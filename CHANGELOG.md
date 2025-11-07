# Changelog

Bu dosya, NodeBB Guest Access Control Plugin için yapılan tüm önemli değişiklikleri belgeler.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardına dayanır,
ve bu proje [Semantic Versioning](https://semver.org/spec/v2.0.0.html) kullanır.

## [1.0.0] - 2025-01-XX

### Eklenen
- ✅ Zorunlu kayıt modu - Misafir kullanıcıları otomatik kayıt sayfasına yönlendirir
- 🔒 Kategori koruması - Belirli kategorileri misafir kullanıcılardan gizler
- 🎨 Özelleştirilebilir mesajlar - Misafir kullanıcılara özel karşılama ve bilgilendirme mesajları
- 🔄 Akıllı yönlendirme - Kayıt/giriş sonrası kullanıcıyı istediği sayfaya yönlendirir
- 📊 Detaylı analitik - Engellenen denemeler ve benzersiz ziyaretçi takibi
- 🛡️ Rate limiting - IP bazlı hız sınırlaması ile brute force koruması
- 🔐 API erişim kontrolü - Misafir kullanıcıların API erişimini engelleyebilme
- ⚡ Whitelist sistemi - Belirli sayfaların misafir erişimine açık kalması
- 🎯 Performans odaklı - Senkron çalışan, optimize edilmiş kod yapısı
- 📱 Responsive admin panel - Modern ve kullanıcı dostu arayüz
- 🌐 Türkçe dil desteği - Tüm mesajlar ve arayüz Türkçe
- 🔄 Otomatik istatistik güncelleme - Her 30 saniyede bir güncellenir
- 💾 In-memory storage - Veritabanı yükü olmadan hızlı erişim
- 🧹 Otomatik temizleme - Rate limit kayıtlarının otomatik silinmesi
- 🎨 Özelleştirilebilir CSS - Tema entegrasyonu için hazır

### Güvenlik
- XSS koruması - Input sanitization
- Rate limiting - Brute force saldırılarına karşı koruma
- IP tracking - Kötü niyetli kullanıcı takibi
- API access control - Yetkisiz API erişimini engelleme
- Session management - Güvenli oturum yönetimi

### Teknik Detaylar
- NodeBB 4.x.x uyumluluğu
- Node.js 18.0.0+ desteği
- ES6+ JavaScript syntax
- Async/await pattern kullanımı
- Error handling ve logging
- Memory efficient implementation
- Zero database queries for rate limiting
- Hook-based architecture

### Performans
- Minimal hook kullanımı
- Verimli whitelist kontrolü
- In-memory caching
- Otomatik garbage collection
- Optimize edilmiş regex işlemleri

---

## Gelecek Sürümler

### [1.1.0] - Planlanan
- Multi-language support (English, Deutsch, Español)
- Database-backed analytics (persistent storage)
- Customizable rate limit messages
- Advanced whitelist patterns (regex support)
- Email notifications for admins
- Export analytics to CSV
- Integration with NodeBB's user groups

### [1.2.0] - Planlanan
- OAuth integration for guest preview
- Time-based access restrictions
- Country-based blocking/allowing
- Custom hooks for developers
- REST API for external integrations
- Webhook support
- Advanced reporting dashboard

---

**Versiyon Notları:**

[1.0.0]: https://github.com/FORSTLAND/nodebb-plugin-guest-access-control/releases/tag/v1.0.0
