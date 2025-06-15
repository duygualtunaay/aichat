import React, { useState } from 'react';
import { X, Check, Crown, CreditCard, Loader, AlertCircle } from 'lucide-react';
import { subscriptionPlans } from '../../config/iyzico';
import { paymentService } from '../../services/payment';
import { useAuth } from '../../context/AuthContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      setError('Lütfen önce giriş yapın');
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);
    setError(null);

    try {
      const plan = paymentService.getSubscriptionPlan(planId);
      if (!plan) {
        throw new Error('Plan bulunamadı');
      }

      // Create payment request
      const paymentRequest = await paymentService.createPaymentRequest({
        planId,
        userId: user.id,
        amount: plan.price,
        currency: plan.currency,
        callbackUrl: `${window.location.origin}/success`
      });

      // Redirect to payment page
      window.location.href = paymentRequest.paymentPageUrl;
    } catch (error: any) {
      console.error('Subscription error:', error);
      setError(error.message || 'Abonelik işlemi başlatılırken bir hata oluştu');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  const plans = Object.values(subscriptionPlans);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Pro Plana Geçin
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              S-AI Chat'in tüm özelliklerinden sınırsız yararlanın
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <span className="text-red-800 dark:text-red-200">{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-xl border-2 p-6 transition-all duration-200 ${
                  plan.period === 'yearly'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                }`}
              >
                {plan.period === 'yearly' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Avantajlı Yıllık Üyelik
                    </span>
                  </div>
                )}

                {/* Plan header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-purple-100 dark:bg-purple-900/20 text-purple-600">
                    <Crown className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ₺{plan.price}
                    <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                      /{plan.period === 'monthly' ? 'ay' : 'yıl'}
                    </span>
                  </div>
                  {plan.period === 'yearly' && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 line-through">₺{plan.originalPrice}</span>
                      <span className="text-sm text-green-600 ml-2 font-medium">
                        ₺{plan.discount} tasarruf
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    plan.period === 'yearly'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                  } disabled:opacity-50`}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>İşleniyor...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>₺{plan.price} - Hemen Başla</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Güvenli Ödeme
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Ödemeleriniz iyzico güvenli ödeme sistemi ile 256-bit SSL şifreleme ile korunur. 
              Kredi kartı bilgileriniz saklanmaz.
            </p>
          </div>

          {/* Additional info */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Önemli Bilgiler
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Pro plan otomatik olarak yenilenir</li>
              <li>• İstediğiniz zaman planınızı iptal edebilirsiniz</li>
              <li>• İptal sonrası mevcut dönem sonuna kadar Pro özellikler aktif kalır</li>
              <li>• Fatura ve destek için: info@saimediaworks.com.tr</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};