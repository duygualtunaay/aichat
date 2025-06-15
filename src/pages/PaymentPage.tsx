import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { paymentService } from '../services/payment';
import { useAuth } from '../context/AuthContext';

export const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUserPlan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardHolderName: ''
  });

  const planId = searchParams.get('plan') || 'monthly';
  const token = searchParams.get('token');
  const plan = paymentService.getSubscriptionPlan(planId);

  useEffect(() => {
    if (!token || !plan) {
      navigate('/');
    }
  }, [token, plan, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setCardInfo(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      handleInputChange('cardNumber', formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    setLoading(true);
    setError('');

    try {
      // Validate card info
      if (!cardInfo.cardNumber || !cardInfo.expiryMonth || !cardInfo.expiryYear || !cardInfo.cvc || !cardInfo.cardHolderName) {
        throw new Error('Lütfen tüm kart bilgilerini doldurun');
      }

      // Process payment
      const result = await paymentService.processPayment(token, cardInfo);
      
      if (result.success) {
        // Update user plan
        await updateUserPlan('pro');
        
        // Redirect to success page
        navigate('/success?plan=' + planId);
      } else {
        throw new Error('Ödeme işlemi başarısız oldu');
      }
    } catch (err: any) {
      setError(err.message || 'Ödeme işlemi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ödeme Bilgileri
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sipariş Özeti
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Plan</span>
                <span className="font-medium text-gray-900 dark:text-white">{plan.name}</span>
              </div>
              
              {plan.period === 'yearly' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Normal Fiyat</span>
                  <span className="line-through text-gray-500">₺{plan.originalPrice}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fiyat</span>
                <span className="font-medium text-gray-900 dark:text-white">₺{plan.price}</span>
              </div>
              
              {plan.period === 'yearly' && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Tasarruf</span>
                  <span className="font-medium">₺{plan.discount}</span>
                </div>
              )}
              
              <hr className="border-gray-200 dark:border-gray-700" />
              
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-gray-900 dark:text-white">Toplam</span>
                <span className="text-gray-900 dark:text-white">₺{plan.price}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Dahil Olan Özellikler:
              </h3>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-6">
              <Lock className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Güvenli Ödeme
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800 dark:text-red-200">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kart Sahibinin Adı
                </label>
                <input
                  type="text"
                  value={cardInfo.cardHolderName}
                  onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ad Soyad"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kart Numarası
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={cardInfo.cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ay
                  </label>
                  <select
                    value={cardInfo.expiryMonth}
                    onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Ay</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yıl
                  </label>
                  <select
                    value={cardInfo.expiryYear}
                    onChange={(e) => handleInputChange('expiryYear', e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Yıl</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={String(new Date().getFullYear() + i)}>
                        {new Date().getFullYear() + i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardInfo.cvc}
                    onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 3))}
                    className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="123"
                    maxLength={3}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      ₺{plan.price} Öde
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Lock className="w-4 h-4 mr-2" />
                <span>256-bit SSL şifreleme ile güvenli ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};