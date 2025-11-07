# NodeBB Guest Access Control Plugin

NodeBB v4.x.x için misafir erişim kontrol plugin'i. Forumunuza kayıt olmayan kullanıcıların erişimini kontrol edin.

## Özellikler

- Zorunlu kayıt modu: Misafir kullanıcıları otomatik olarak kayıt sayfasına yönlendirir
- Özelleştirilebilir mesajlar
- Whitelist sistemi: Belirli sayfaları misafir erişimine açık tutabilirsiniz
- Kolay yapılandırma
- NodeBB 4.x.x ile tam uyumlu

## Kurulum

### GitHub'dan Kurulum

\`\`\`bash
cd /path/to/nodebb/node_modules
git clone https://github.com/FORSTLAND/nodebb-plugin-guest-access-control.git
cd ../..
./nodebb build
./nodebb restart
\`\`\`

### NPM'den Kurulum

\`\`\`bash
npm install nodebb-plugin-guest-access-control
./nodebb build
./nodebb restart
\`\`\`

## Aktivasyon

1. NodeBB Admin Panel → Extend → Plugins
2. "Guest Access Control" plugin'ini bulun ve Activate butonuna tıklayın
3. NodeBB'yi yeniden başlatın
4. Admin Panel → Plugins → Guest Access Control ile ayarlara erişin

## Yapılandırma

### Ana Ayarlar

**Plugin'i Etkinleştir**: Plugin'in tüm özelliklerini aktif/deaktif eder

**Zorunlu Kayıt Modu**: Aktif edildiğinde misafir kullanıcılar foruma erişemez

**Özel Mesaj**: Misafir kullanıcılara gösterilecek bilgilendirme mesajı

**Yönlendirme URL**: Varsayılan: `/register` (kayıt sayfası) veya `/login` (giriş sayfası)

**İzin Verilen Yollar**: Misafir kullanıcıların erişebileceği yollar (virgülle ayrılmış)

Örnek whitelist:
\`\`\`
/login,/register,/reset,/api,/assets,/plugins,/sounds,/language,/static
\`\`\`

## Nasıl Çalışır?

1. Her sayfa yüklemesinde kullanıcının giriş yapıp yapmadığı kontrol edilir
2. İstek yapılan yol whitelist'te var mı kontrol edilir
3. Erişim reddedilirse kullanıcı belirlenen sayfaya yönlendirilir
4. Giriş sonrası kullanıcı istediği sayfaya otomatik yönlendirilir

## Lisans

MIT License - FORSTLAND tarafından geliştirilmiştir.

## Destek

GitHub Issues: https://github.com/FORSTLAND/nodebb-plugin-guest-access-control/issues

---

**Developed by FORSTLAND**
