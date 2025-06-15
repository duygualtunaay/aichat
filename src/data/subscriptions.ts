import { Subscription } from '../types';

export const subscriptions: Subscription[] = [
  {
    id: 'free',
    name: 'Ücretsiz',
    price: 0,
    currency: 'TRY',
    messageLimit: 20,
    features: [
      'Günde 20 mesaj',
      'Temel AI özellikleri',
      'Sohbet geçmişi',
      'Mobil uyumlu',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    currency: 'TRY',
    messageLimit: 'unlimited',
    popular: true,
    features: [
      'Sınırsız mesaj',
      'Sınırsız görsel üretimi',
      'Öncelikli sunucular',
      'Gelişmiş AI modelleri',
      'Sohbet dışa aktarma',
      'Premium destek',
      'Tema seçenekleri',
      'Yeni özelliklere erken erişim',
    ],
  },
];