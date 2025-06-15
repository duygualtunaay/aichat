import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle, 
  signOutUser,
  getUserDocument,
  updateUserDocument,
  incrementUserUsage,
  resetUserDailyUsage,
  handleRedirectResult,
  createUserDocument
} from '../services/firebase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        console.log('🔄 Uygulama yüklenirken yönlendirme sonucu kontrol ediliyor...');
        const firebaseUser = await handleRedirectResult();
        if (firebaseUser) {

          console.log('✅ Yönlendirme sonucu işlendi, kullanıcı:', firebaseUser.uid);
        }
      } catch (error) {
        console.error('❌ Yönlendirme sonucu işlenirken hata:', error);
      }
    };

    checkRedirect();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Auth state changed:', firebaseUser?.uid);
      
      try {
        if (firebaseUser) {
          console.log('✅ User is signed in, checking user document...');
          let userData = await getUserDocument(firebaseUser.uid);

          // EĞER KULLANICI BELGESİ YOKSA OLUŞTUR
          if (!userData) {
            console.log('📄 User document not found, creating one...');
            await createUserDocument(firebaseUser, {
              name: firebaseUser.displayName || 'Yeni Kullanıcı',
              email: firebaseUser.email
            });
            // Belgeyi oluşturduktan sonra tekrar çekiyoruz.
            userData = await getUserDocument(firebaseUser.uid);
          }

          if (userData) {
            console.log('📄 User document found:', userData);

            // Check if daily usage needs reset
            const today = new Date().toDateString();
            if (userData.lastUsageReset !== today) {
              await resetUserDailyUsage(firebaseUser.uid);
              userData.dailyUsage = 0;
              userData.lastUsageReset = today;
            }

            // Check subscription status
            if (userData.subscriptionEndDate && new Date() > userData.subscriptionEndDate) {
              // Subscription expired, downgrade to free
              await updateUserDocument(firebaseUser.uid, {
                plan: 'free',
                subscriptionStatus: 'inactive'
              });
              userData.plan = 'free';
              userData.subscriptionStatus = 'inactive';
            }

            console.log('🎯 Setting user data and marking as authenticated');
            setUser(userData);
          } else {
            // Bu blok artık teorik olarak çalışmamalı, ama bir güvenlik önlemi olarak kalabilir.
            console.log('❌ Critical error: Could not find or create user document.');
            setUser(null);
          }
        } else {
          // User is signed out
          console.log('🚪 User signed out');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth state change error:', error);
        setUser(null);
      } finally {
        console.log('⏰ Setting loading to false');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const firebaseUser = await signInWithEmail(email, password);
      console.log('✅ Login successful for:', firebaseUser.uid);
      
      // Don't set loading to false here - let onAuthStateChanged handle it
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      const firebaseUser = await signUpWithEmail(email, password, name);
      console.log('✅ Registration successful for:', firebaseUser.uid);
      
      // Don't set loading to false here - let onAuthStateChanged handle it
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('🔍 Google ile giriş deneniyor, yönlendiriliyor...');
      // Bu fonksiyon sadece yönlendirmeyi başlatır. await'e gerek yok
      // ama hata yakalamak için yine de async/await yapısında tutabiliriz.
      await signInWithGoogle();
      // Yönlendirme başladığı için bu satırdan sonrası çalışmayacaktır.
    } catch (error) {
      console.error('❌ Google ile giriş başlatılırken hata:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out user');
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  const updateUserPlan = async (plan: 'free' | 'pro') => {
    if (user) {
      try {
        console.log('💎 Updating user plan to:', plan);
        await updateUserDocument(user.id, { plan });
        setUser({ ...user, plan });
      } catch (error) {
        console.error('❌ Update user plan error:', error);
        throw error;
      }
    }
  };

  const incrementUsage = async () => {
    if (user && user.plan === 'free') {
      try {
        await incrementUserUsage(user.id);
        setUser({ ...user, dailyUsage: user.dailyUsage + 1 });
      } catch (error) {
        console.error('❌ Increment usage error:', error);
      }
    }
  };

  const resetDailyUsage = async () => {
    if (user) {
      try {
        await resetUserDailyUsage(user.id);
        setUser({ ...user, dailyUsage: 0 });
      } catch (error) {
        console.error('❌ Reset daily usage error:', error);
      }
    }
  };

  const isAuthenticated = !!user && !loading;

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUserPlan,
    incrementUsage,
    resetDailyUsage,
  };

  console.log('🎯 Auth context state:', { 
    hasUser: !!user, 
    isAuthenticated, 
    loading,
    userId: user?.id 
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};