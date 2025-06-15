export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  features: string[];
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_STPgmMnQ3XUFzT',
    priceId: 'price_1RYSqmD2rl8dUey5Ohs2p8Lb',
    name: 'Pro',
    description: 'Sınırsız mesaj ve görsel üretimi ile S-AI Chat\'in tüm özelliklerinden yararlanın',
    mode: 'subscription',
    price: 199,
    currency: 'TRY',
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

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.id === id);
};