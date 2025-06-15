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
  createUserDocument // Belge oluşturma fonksiyonunu import ediyoruz
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Auth state changed. User UID:', firebaseUser?.uid);

      try {
        if (firebaseUser) {
          console.log('✅ User is signed in. Checking for user document...');
          let userData = await getUserDocument(firebaseUser.uid);

          // EĞER KULLANICI BELGESİ VERİTABANINDA YOKSA, HEMEN OLUŞTUR.
          // Bu, hem eski kullanıcıları hem de herhangi bir nedenle belgesi olmayanları kurtarır.
          if (!userData) {
            console.log('📄 User document not found, creating one...');
            // Not: Google ile giriş yapanların displayName'i burada hazır gelir.
            // E-posta ile kaydolanlar için ise signUpWithEmail içinde displayName zaten atanmıştı.
            await createUserDocument(firebaseUser, {
              name: firebaseUser.displayName || 'Yeni Kullanıcı',
              email: firebaseUser.email
            });
            // Belgeyi oluşturduktan sonra en güncel halini tekrar çekiyoruz.
            userData = await getUserDocument(firebaseUser.uid);
          }

          if (userData) {
            console.log('📄 User document found:', userData);

            // Gerekli günlük kontrolleri yap (kullanım sıfırlama, abonelik durumu vs.)
            const today = new Date().toDateString();
            if (userData.lastUsageReset !== today) {
              console.log('🔄 Resetting daily usage for new day.');
              await resetUserDailyUsage(firebaseUser.uid);
              userData.dailyUsage = 0;
              userData.lastUsageReset = today;
            }

            if (userData.subscriptionEndDate && new Date() > userData.subscriptionEndDate) {
              console.log('🚫 Subscription expired. Downgrading to free plan.');
              await updateUserDocument(firebaseUser.uid, {
                plan: 'free',
                subscriptionStatus: 'inactive'
              });
              userData.plan = 'free';
              userData.subscriptionStatus = 'inactive';
            }

            console.log('🎯 Setting final user data and marking as authenticated.');
            setUser(userData);
          } else {
            // Bu blok, belge oluşturma ve çekme işlemi de başarısız olursa çalışır.
            console.error('❌ CRITICAL: Could not find or create user document. Signing out for safety.');
            await signOutUser();
            setUser(null);
          }
        } else {
          // Kullanıcı çıkış yaptı veya hiç giriş yapmamış.
          console.log('🚪 User signed out or not authenticated.');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ An error occurred in onAuthStateChanged:', error);
        setUser(null);
      } finally {
        // Tüm işlemler bittikten sonra yükleme ekranını kapat.
        console.log('⏰ Auth check finished. Setting loading to false.');
        setLoading(false);
      }
    });

    // Component kaldırıldığında listener'ı temizle.
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // onAuthStateChanged durumu yöneteceğinden burada sadece giriş yapılır.
    await signInWithEmail(email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    // onAuthStateChanged durumu yöneteceğinden burada sadece kayıt yapılır.
    await signUpWithEmail(email, password, name);
  };

  const loginWithGoogle = async () => {
    try {
      console.log('🔍 Attempting Google login with popup...');
      // Bu fonksiyon artık doğrudan firebaseUser nesnesini döndürecek.
      // onAuthStateChanged'in tetiklenmesini beklememize gerek kalmayacak,
      // çünkü belge oluşturma işlemini de içinde hallediyor.
      await signInWithGoogle();
      // Başarılı girişten sonra onAuthStateChanged zaten en güncel veriyi alıp state'i ayarlayacak.
    } catch (error) {
      console.error('❌ Google login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    await signOutUser();
    setUser(null); // State'i anında temizle
  };

  const updateUserPlan = async (plan: 'free' | 'pro') => {
    if (user) {
      await updateUserDocument(user.id, { plan });
      setUser({ ...user, plan });
    }
  };

  const incrementUsage = async () => {
    if (user && user.plan === 'free') {
      await incrementUserUsage(user.id);
      setUser({ ...user, dailyUsage: user.dailyUsage + 1 });
    }
  };

  const resetDailyUsage = async () => {
    if (user) {
      await resetUserDailyUsage(user.id);
      setUser({ ...user, dailyUsage: 0 });
    }
  };

  // isAuthenticated'i hesaplarken artık sadece user'ın varlığına bakmak yeterli.
  // loading state'i, App.tsx'te genel bir yükleme ekranı göstermek için kullanılacak.
  const isAuthenticated = !!user;

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
