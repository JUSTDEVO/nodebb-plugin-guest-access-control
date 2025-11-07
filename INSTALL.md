# Kurulum Rehberi - NodeBB Guest Access Control Plugin

Bu rehber, NodeBB Guest Access Control Plugin'ini NodeBB 4.x.x forumunuza kurmanız için adım adım talimatlar içerir.

## Ön Gereksinimler

- NodeBB 4.x.x veya üzeri
- Node.js 18.0.0 veya üzeri
- npm veya yarn paket yöneticisi
- NodeBB admin erişimi

## Kurulum Adımları

### 1. Plugin Dosyalarını İndirme

#### Yöntem A: Git ile Klonlama (Önerilen)

\`\`\`bash
cd /path/to/nodebb/node_modules
git clone https://github.com/FORSTLAND/nodebb-plugin-guest-access-control.git
cd nodebb-plugin-guest-access-control
npm install
\`\`\`

#### Yöntem B: Zip Dosyası İndirme

1. GitHub'dan zip dosyasını indirin
2. İçeriği `node_modules/nodebb-plugin-guest-access-control` klasörüne çıkarın
3. Terminal'de plugin klasörüne gidin ve `npm install` komutunu çalıştırın

#### Yöntem C: NPM Registry (Yakında)

\`\`\`bash
npm install nodebb-plugin-guest-access-control
\`\`\`

### 2. NodeBB'yi Yeniden Başlatma

\`\`\`bash
cd /path/to/nodebb
./nodebb restart
\`\`\`

veya NodeBB Admin Panel üzerinden:
- Admin Panel → Advanced → Restart → Restart NodeBB

### 3. Plugin'i Aktifleştirme

1. NodeBB Admin Panel'e giriş yapın
2. **Extend** → **Plugins** bölümüne gidin
3. "Guest Access Control" plugin'ini bulun
4. **Activate** butonuna tıklayın
5. Gerekirse NodeBB'yi tekrar başlatın

### 4. Plugin Ayarlarını Yapılandırma

1. Admin Panel → **Plugins** → **Guest Access Control**
2. Ayarları ihtiyacınıza göre düzenleyin
3. **Kaydet** butonuna tıklayın

## İlk Yapılandırma

### Temel Ayarlar

1. **Plugin'i Etkinleştir** - Checkbox'ı işaretleyin
2. **Zorunlu Kayıt Modu** - Misafir kullanıcıları engellemek için işaretleyin
3. **Kaydet** butonuna tıklayın

### İzin Verilen Yollar

Varsayılan olarak şu yollar beyaz listede bulunur:
\`\`\`
/login,/register,/reset,/api,/assets,/plugins,/sounds,/language,/static
\`\`\`

Gerekirse bu listeyi düzenleyebilirsiniz.

### Kategori Koruması (Opsiyonel)

Belirli kategorileri misafir kullanıcılardan gizlemek için:
1. Admin Panel → **Manage** → **Categories**
2. Kategori ID'lerini not edin (URL'de görünür)
3. Plugin ayarlarında "Korunan Kategori ID'leri" alanına virgülle ayrılmış olarak girin

Örnek: `1,2,3`

## Doğrulama

Plugin'in doğru çalıştığını kontrol etmek için:

1. **Çıkış Yapın** - Forumdan çıkış yapın
2. **Forum Ana Sayfasını Ziyaret Edin** - Misafir olarak erişmeyi deneyin
3. **Kayıt Sayfasına Yönlendirme** - Otomatik olarak kayıt/giriş sayfasına yönlendirilmelisiniz
4. **İstatistikleri Kontrol Edin** - Admin panel'de istatistikler güncellenmelidir

## Sorun Giderme

### Plugin Görünmüyor

\`\`\`bash
cd /path/to/nodebb/node_modules/nodebb-plugin-guest-access-control
npm install
cd ../..
./nodebb build
./nodebb restart
\`\`\`

### Ayarlar Kaydedilmiyor

1. NodeBB loglarını kontrol edin:
\`\`\`bash
./nodebb log
\`\`\`

2. Database bağlantısını doğrulayın
3. NodeBB'nin yazma izinlerine sahip olduğundan emin olun

### Plugin Aktif Ama Çalışmıyor

1. Plugin ayarlarında "Plugin'i Etkinleştir" ve "Zorunlu Kayıt Modu" seçeneklerinin işaretli olduğundan emin olun
2. NodeBB'yi yeniden başlatın:
\`\`\`bash
./nodebb restart
\`\`\`
3. Browser cache'ini temizleyin
4. Farklı bir browser ile test edin

### Beyaz Liste Çalışmıyor

Yolların doğru formatta olduğundan emin olun:
- Başında `/` olmalı
- Virgülle ayrılmalı
- Wildcard için `*` kullanın

Örnek: `/login,/register,/api/*,/assets/*`

## Güncelleme

### Git ile Güncelleme

\`\`\`bash
cd /path/to/nodebb/node_modules/nodebb-plugin-guest-access-control
git pull origin main
npm install
cd ../..
./nodebb build
./nodebb restart
\`\`\`

### Manuel Güncelleme

1. Mevcut plugin klasörünü yedekleyin
2. Yeni dosyaları indirin ve üzerine yazın
3. `npm install` komutunu çalıştırın
4. NodeBB'yi yeniden başlatın

## Destek

Sorunlarla karşılaşırsanız:
- [GitHub Issues](https://github.com/FORSTLAND/nodebb-plugin-guest-access-control/issues)
- [GitHub Discussions](https://github.com/FORSTLAND/nodebb-plugin-guest-access-control/discussions)

## Yararlı Komutlar

\`\`\`bash
# NodeBB loglarını görüntüleme
./nodebb log

# NodeBB'yi debug mode'da başlatma
./nodebb dev

# Plugin'leri yeniden yükleme
./nodebb build

# NodeBB durumunu kontrol etme
./nodebb status

# NodeBB'yi durdurma
./nodebb stop

# NodeBB'yi başlatma
./nodebb start
\`\`\`

---

**Başarılı kurulumlar dileriz!**
