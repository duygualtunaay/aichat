import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ödeme İptal Edildi
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          Ödeme işleminiz iptal edildi
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Herhangi bir ücret tahsil edilmedi. İstediğiniz zaman tekrar deneyebilirsiniz.
        </p>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Pro Planın Avantajları:
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 text-left">
            <li>• Sınırsız mesaj ve görsel üretimi</li>
            <li>• Öncelikli destek</li>
            <li>• Gelişmiş AI modelleri</li>
            <li>• Sohbet geçmişi dışa aktarma</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tekrar Dene</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ana Sayfaya Dön</span>
          </button>
        </div>

        {/* Support */}
        <div className="mt-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Yardıma mı ihtiyacınız var?{' '}
            <a 
              href="mailto:info@saimediaworks.com.tr" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Destek ekibimizle iletişime geçin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};