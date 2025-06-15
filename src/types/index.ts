export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email?: string;
  name: string;
  plan: 'free' | 'pro';
  dailyUsage: number;
  createdAt: Date;
  subscriptionId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
  subscriptionType?: 'monthly' | 'yearly';
  subscriptionEndDate?: Date;
  isAdmin?: boolean;
  googleId?: string;
  lastUsageReset?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  amount: number;
  currency: string;
}

export interface PaymentRequest {
  planId: string;
  userId: string;
  amount: number;
  currency: string;
  callbackUrl: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserPlan: (plan: 'free' | 'pro') => Promise<void>;
  incrementUsage: () => Promise<void>;
  resetDailyUsage: () => Promise<void>;
}