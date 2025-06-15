import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';

export const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan');

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎉 Tebrikler!
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {planId === 'yearly' ? 'Yıllık' : 'Aylık'} Pro planına başarıyla geçtiniz
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          Artık S-AI Chat'in tüm özelliklerinden sınırsız yararlanabilirsiniz
        </p>

        {/* Pro Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full mb-8">
          <Crown className="w-5 h-5" />
          <span className="font-semibold">Pro Üye</span>
        </div>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Artık Kullanabileceğiniz Özellikler:
          </h3>
          
          <ul className="space-y-3 text-left">
            <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              Sınırsız mesaj gönderimi
            </li>
            <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              Sınırsız görsel üretimi
            </li>
            <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              Öncelikli destek
            </li>
            <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              Gelişmiş AI modelleri
            </li>
            <li className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
              Sohbet geçmişi dışa aktarma
            </li>
          </ul>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-4"
        >
          <span>S-AI Chat'e Dön</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          10 saniye içinde otomatik olarak yönlendirileceksiniz
        </p>

        {/* Support */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Sorun mu yaşıyorsunuz?{' '}
            <a 
              href="mailto:info@saimediaworks.com.tr" 
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
            >
              Destek ekibimizle iletişime geçin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};