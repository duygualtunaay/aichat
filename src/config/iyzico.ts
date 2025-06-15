export const iyzicoConfig = {
  apiKey: import.meta.env.VITE_IYZICO_API_KEY || 'sandbox-your-api-key',
  secretKey: import.meta.env.VITE_IYZICO_SECRET_KEY || 'sandbox-your-secret-key',
  uri: import.meta.env.VITE_IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
};

export const subscriptionPlans = {
  monthly: {
    id: 'monthly-pro',
    name: 'Aylık Pro',
    price: 199,
    currency: 'TRY',
    period: 'monthly',
    features: [
      'Sınırsız mesaj',
      'Sınırsız görsel üretimi',
      'Öncelikli destek',
      'Gelişmiş AI modelleri',
      'Sohbet geçmişi dışa aktarma'
    ]
  },
  yearly: {
    id: 'yearly-pro',
    name: 'Yıllık Pro',
    price: 1999,
    currency: 'TRY',
    period: 'yearly',
    originalPrice: 2388, // 199 * 12
    discount: 389,
    features: [
      'Sınırsız mesaj',
      'Sınırsız görsel üretimi',
      'Öncelikli destek',
      'Gelişmiş AI modelleri',
      'Sohbet geçmişi dışa aktarma',
      '16% indirim (389 TL tasarruf)',
      'Avantajlı yıllık üyelik'
    ]
  }
};