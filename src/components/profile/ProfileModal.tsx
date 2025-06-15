import React from 'react';
import { X, User, Calendar, Crown, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { dailyUsage, messageLimit } = useChat();

  if (!isOpen) return null;

  const isPro = user?.plan === 'pro';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profil Bilgileri
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.name || 'Kullanıcı'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isPro ? 'Pro Üye' : 'Ücretsiz Üye'}
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3">
            {user?.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    E-posta
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Plan info */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mevcut Plan
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isPro 
                  ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
                  : 'text-gray-600 bg-gray-100 dark:bg-gray-800'
              }`}>
                <Crown className="w-4 h-4 inline mr-1" />
                {isPro ? 'Pro' : 'Ücretsiz'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Günlük Kullanım
                </span>
                <span className="text-gray-900 dark:text-white">
                  {isPro ? 'Sınırsız' : `${dailyUsage}/${messageLimit}`}
                </span>
              </div>
              
              {!isPro && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700"
                    style={{ width: `${(dailyUsage / messageLimit) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Account details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Hesap Oluşturma
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {user?.createdAt ? format(user.createdAt, 'dd MMMM yyyy HH:mm', { locale: tr }) : 'Bilinmiyor'}
                </p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Ayarlar
            </h4>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Karanlık Tema
              </span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Pro upgrade info */}
          {!isPro && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Pro'ya Geçin
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Sınırsız mesaj ve görsel üretimi için Pro plana geçin.
                </p>
                <button
                  onClick={() => window.location.href = '/payment?plan=monthly'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Pro'ya Geç - ₺199/ay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};