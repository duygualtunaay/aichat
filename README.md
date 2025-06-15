# S-AI Chat - Yapay Zeka Sohbet Platformu

## Özellikler

- ✅ E-posta ve şifre ile giriş/kayıt
- ✅ Google ile giriş
- ✅ Telefon ile giriş (demo)
- ✅ Ücretsiz plan (günde 20 mesaj)
- ✅ Pro plan (sınırsız mesaj)
- ✅ Yapay zeka sohbet
- ✅ Görsel üretimi
- ✅ Karanlık/Açık tema
- ✅ Admin panel
- ✅ Stripe entegrasyonu (demo)

## Kurulum

1. Projeyi klonlayın
2. `npm install` komutu ile bağımlılıkları yükleyin
3. `.env` dosyasını oluşturun ve gerekli API anahtarlarını ekleyin
4. `npm run dev` komutu ile geliştirme sunucusunu başlatın

## Gerekli API Anahtarları

- OpenAI API Key (yapay zeka için)
- Firebase yapılandırması (kimlik doğrulama için)
- Stripe API Key (ödeme için)

## Kullanım

1. Ana sayfada "Hemen Başlayın" butonuna tıklayın
2. E-posta ile kayıt olun veya giriş yapın
3. Yapay zeka ile sohbet etmeye başlayın
4. Görsel üretmek için mor renkli butonu kullanın
5. Pro plana geçmek için abonelik sayfasını ziyaret edin

## Admin Panel

Firebase'de kullanıcı belgesinde `isAdmin: true` olarak ayarlanmış kullanıcılar admin paneline `/admin` adresinden erişebilir.

## Teknik Detaylar

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Firebase (Auth + Firestore)
- **AI:** OpenAI GPT-3.5 + DALL-E 3
- **Ödeme:** Stripe
- **Hosting:** Netlify/Vercel uyumlu

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.