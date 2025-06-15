import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, CreditCard } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Gizlilik Sözleşmesi',
          icon: <Shield className="w-6 h-6" />,
          content: `
            <h2>1. Kişisel Verilerin Toplanması</h2>
            <p>S-AI Chat platformu olarak, size daha iyi hizmet verebilmek için aşağıdaki kişisel verilerinizi topluyoruz:</p>
            <ul>
              <li>Ad, soyad ve e-posta adresi</li>
              <li>Sohbet geçmişi ve mesaj içerikleri</li>
              <li>Kullanım istatistikleri ve tercihler</li>
              <li>Ödeme bilgileri (güvenli ödeme sağlayıcıları aracılığıyla)</li>
            </ul>

            <h2>2. Verilerin Kullanım Amacı</h2>
            <p>Toplanan veriler aşağıdaki amaçlarla kullanılır:</p>
            <ul>
              <li>Hizmet kalitesini artırmak</li>
              <li>Kişiselleştirilmiş deneyim sunmak</li>
              <li>Teknik destek sağlamak</li>
              <li>Yasal yükümlülükleri yerine getirmek</li>
            </ul>

            <h2>3. Veri Güvenliği</h2>
            <p>Kişisel verileriniz 256-bit SSL şifreleme ile korunur ve güvenli sunucularda saklanır. Verileriniz üçüncü taraflarla paylaşılmaz.</p>

            <h2>4. Kullanıcı Hakları</h2>
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul>
              <li>Verilerinize erişim hakkı</li>
              <li>Veri düzeltme hakkı</li>
              <li>Veri silme hakkı</li>
              <li>Veri taşınabilirlik hakkı</li>
            </ul>

            <h2>5. İletişim</h2>
            <p>Gizlilik ile ilgili sorularınız için: info@saimediaworks.com.tr</p>
          `
        };
      case 'terms':
        return {
          title: 'Kullanım Şartları',
          icon: <FileText className="w-6 h-6" />,
          content: `
            <h2>1. Hizmet Tanımı</h2>
            <p>S-AI Chat, yapay zeka destekli sohbet ve görsel üretim hizmeti sunan bir platformdur.</p>

            <h2>2. Kullanıcı Yükümlülükleri</h2>
            <ul>
              <li>Doğru ve güncel bilgi sağlamak</li>
              <li>Hizmeti kötüye kullanmamak</li>
              <li>Yasalara uygun davranmak</li>
              <li>Diğer kullanıcıların haklarına saygı göstermek</li>
            </ul>

            <h2>3. Yasak Kullanımlar</h2>
            <p>Aşağıdaki kullanımlar kesinlikle yasaktır:</p>
            <ul>
              <li>Zararlı, tehditkar veya taciz edici içerik</li>
              <li>Telif hakkı ihlali</li>
              <li>Spam veya istenmeyen mesajlar</li>
              <li>Sistemi manipüle etme girişimleri</li>
            </ul>

            <h2>4. Hizmet Kesintileri</h2>
            <p>Teknik bakım, güncelleme veya beklenmeyen durumlar nedeniyle hizmet geçici olarak kesintiye uğrayabilir.</p>

            <h2>5. Sorumluluk Sınırlaması</h2>
            <p>S-AI Chat, AI tarafından üretilen içeriklerden doğabilecek zararlardan sorumlu değildir.</p>

            <h2>6. Değişiklikler</h2>
            <p>Bu şartlar önceden bildirimde bulunularak değiştirilebilir.</p>
          `
        };
      case 'payment':
        return {
          title: 'Üyelik & Ödeme Koşulları',
          icon: <CreditCard className="w-6 h-6" />,
          content: `
            <h2>1. Üyelik Planları</h2>
            <h3>Ücretsiz Plan:</h3>
            <ul>
              <li>Günde 20 mesaj hakkı</li>
              <li>Temel AI özellikleri</li>
              <li>Sohbet geçmişi</li>
            </ul>

            <h3>Pro Plan:</h3>
            <ul>
              <li>Sınırsız mesaj</li>
              <li>Sınırsız görsel üretimi</li>
              <li>Öncelikli destek</li>
              <li>Gelişmiş AI modelleri</li>
            </ul>

            <h2>2. Ödeme Koşulları</h2>
            <ul>
              <li>Aylık Plan: 199 TL/ay</li>
              <li>Yıllık Plan: 1999 TL/yıl (%16 indirim)</li>
              <li>Ödemeler iyzico güvenli ödeme sistemi ile alınır</li>
              <li>Tüm fiyatlar KDV dahildir</li>
            </ul>

            <h2>3. Otomatik Yenileme</h2>
            <p>Pro üyelikler otomatik olarak yenilenir. İptal etmek için hesap ayarlarından aboneliği sonlandırabilirsiniz.</p>

            <h2>4. İade Politikası</h2>
            <ul>
              <li>İlk 7 gün içinde koşulsuz iade</li>
              <li>İade talepleri info@saimediaworks.com.tr adresine yapılır</li>
              <li>İade süreci 5-10 iş günü sürer</li>
            </ul>

            <h2>5. Abonelik İptali</h2>
            <p>Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar hizmet devam eder.</p>

            <h2>6. Fatura ve Destek</h2>
            <p>Fatura ve ödeme desteği için: info@saimediaworks.com.tr</p>
          `
        };
      default:
        return {
          title: 'Sayfa Bulunamadı',
          icon: <FileText className="w-6 h-6" />,
          content: '<p>Aradığınız sayfa bulunamadı.</p>'
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600">
              {content.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {content.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div 
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content.content }}
            style={{
              lineHeight: '1.7',
            }}
          />
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              © 2025 S-AI Chat - saimediaworks.com.tr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};