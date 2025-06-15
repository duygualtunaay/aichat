import { iyzicoConfig, subscriptionPlans } from '../config/iyzico';
import { PaymentRequest } from '../types';

// Demo payment service - In production, this should be handled by your backend
export class PaymentService {
  private static instance: PaymentService;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPaymentRequest(request: PaymentRequest): Promise<{ paymentPageUrl: string; token: string }> {
    try {
      // In production, this would make an API call to your backend
      // which would then communicate with Iyzico
      
      console.log('Creating payment request:', request);
      
      // Simulate payment page creation
      const token = `demo_token_${Date.now()}`;
      const paymentPageUrl = `${window.location.origin}/payment?token=${token}&plan=${request.planId}`;
      
      // Store payment request in localStorage for demo
      localStorage.setItem(`payment_${token}`, JSON.stringify(request));
      
      return {
        paymentPageUrl,
        token
      };
    } catch (error) {
      console.error('Payment request error:', error);
      throw new Error('Ödeme işlemi başlatılırken bir hata oluştu');
    }
  }

  async processPayment(token: string, cardInfo: any): Promise<{ success: boolean; subscriptionId?: string }> {
    try {
      // In production, this would validate the payment with Iyzico
      console.log('Processing payment:', { token, cardInfo });
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const subscriptionId = `sub_${Date.now()}`;
      
      return {
        success: true,
        subscriptionId
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      throw new Error('Ödeme işlemi sırasında bir hata oluştu');
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      // In production, this would cancel the subscription via Iyzico API
      console.log('Cancelling subscription:', subscriptionId);
      
      // Simulate cancellation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Subscription cancellation error:', error);
      throw new Error('Abonelik iptal edilirken bir hata oluştu');
    }
  }

  getSubscriptionPlan(planId: string) {
    return subscriptionPlans[planId as keyof typeof subscriptionPlans];
  }

  getAllPlans() {
    return Object.values(subscriptionPlans);
  }
}

export const paymentService = PaymentService.getInstance();