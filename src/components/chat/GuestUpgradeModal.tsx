import React, { useEffect, useState } from 'react';
import { X, Crown, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GuestUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagesUsed: number;
  messageLimit: number;
}

export const GuestUpgradeModal: React.FC<GuestUpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  messagesUsed, 
  messageLimit 
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleLogin = () => {
    navigate('/auth');
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 transition-all duration-500 transform ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white animate-fade-in-up">
            Ücretsiz Deneme Süresi Doldu
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {messagesUsed}/{messageLimit} ücretsiz mesajınızı kullandınız. 
            Sohbete devam etmek için hesap oluşturun veya giriş yapın.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Ücretsiz Hesap Avantajları:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
              <li className="animate-slide-in-left" style={{ animationDelay: '0.3s' }}>• Günde 20 ücretsiz mesaj</li>
              <li className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>• Sohbet geçmişi kaydetme</li>
              <li className="animate-slide-in-left" style={{ animationDelay: '0.5s' }}>• Kişiselleştirilmiş deneyim</li>
              <li className="animate-slide-in-left" style={{ animationDelay: '0.6s' }}>• Güvenli veri saklama</li>
            </ul>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            <div className="flex items-center justify-center mb-2">
              <Crown className="w-5 h-5 text-purple-600 mr-2 animate-pulse-gentle" />
              <h4 className="font-medium text-purple-900 dark:text-purple-100">
                Pro Üyelik Avantajları:
              </h4>
            </div>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1 text-left">
              <li className="animate-slide-in-left" style={{ animationDelay: '0.8s' }}>• Sınırsız mesaj gönderimi</li>
              <li className="animate-slide-in-left" style={{ animationDelay: '0.9s' }}>• Sınırsız görsel üretimi</li>
              <li className="animate-slide-in-left" style={{ animationDelay: '1.0s' }}>• Öncelikli destek</li>
              <li className="animate-slide-in-left" style={{ animationDelay: '1.1s' }}>• Gelişmiş AI modelleri</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up"
            style={{ animationDelay: '1.2s' }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Ücretsiz Hesap Oluştur</span>
          </button>
          
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
            style={{ animationDelay: '1.3s' }}
          >
            <LogIn className="w-4 h-4" />
            <span>Mevcut Hesabımla Giriş Yap</span>
          </button>
        </div>

        <div className="mt-6 text-center animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Hesap oluşturarak{' '}
            <a href="/legal/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
              Kullanım Şartları
            </a>{' '}
            ve{' '}
            <a href="/legal/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
              Gizlilik Sözleşmesi
            </a>
            'ni kabul etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
};