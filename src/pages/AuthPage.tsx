import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Lock, User, Eye, EyeOff, Loader, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register, loginWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔍 AuthPage useEffect - checking auth status:', { isAuthenticated, authLoading });
    
    if (!authLoading && isAuthenticated) {
      console.log('✅ User is authenticated, redirecting to home');
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        console.log('🔐 Starting login process...');
        await login(email, password);
        console.log('✅ Login completed successfully');
        // Navigation will be handled by the useEffect above when auth state changes
      } else {
        if (password.length < 6) {
          setError('Şifre en az 6 karakter olmalıdır');
          setIsLoading(false);
          return;
        }
        console.log('📝 Starting registration process...');
        await register(email, password, name);
        console.log('✅ Registration completed successfully');
        // Navigation will be handled by the useEffect above when auth state changes
      }
    } catch (err: any) {
      console.error('❌ Auth error:', err);
      setError(err.message || 'Bir hata oluştu, lütfen tekrar deneyin');
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      console.log('🔍 Starting Google login process...');
      await loginWithGoogle();
      console.log('✅ Google login completed successfully');
      // Navigation will be handled by the useEffect above when auth state changes
    } catch (err: any) {
      console.error('❌ Google auth error:', err);
      setError(err.message || 'Google ile giriş yapılırken hata oluştu');
      setIsLoading(false);
    }
  };

  // Don't render if we're still checking auth or if user is authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">S-AI Chat</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yapay Zeka Sohbet Platformu</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {mode === 'login' ? 'Tekrar Hoş Geldiniz' : 'S-AI Chat\'e Katılın'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {mode === 'login' 
                ? 'Hesabınıza giriş yapın ve sohbete devam edin'
                : 'Türkiye\'nin en gelişmiş yapay zeka sohbet platformuna katılın'
              }
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-xl sm:px-10">
            {/* Security Notice */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Üyelik Avantajları
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    • Günde 20 ücretsiz mesaj hakkı<br/>
                    • Pro üyelikle sınırsız mesaj ve görsel üretimi<br/>
                    • Güvenli ve hızlı sohbet deneyimi
                  </p>
                </div>
              </div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                {isLoading ? 'İşleniyor...' : 'Google ile devam et'}
              </span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">veya</span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Adınız ve soyadınız"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="ornek@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={mode === 'register' ? 'En az 6 karakter' : 'Şifrenizi girin'}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : mode === 'login' ? (
                  'Giriş Yap'
                ) : (
                  'Hesap Oluştur'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Switch modes */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                disabled={isLoading}
              >
                {mode === 'login' 
                  ? 'Hesabınız yok mu? Kayıt olun' 
                  : 'Hesabınız var mı? Giriş yapın'
                }
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Neden S-AI Chat?
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Günde 20 ücretsiz mesaj hakkı
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Pro üyelikle sınırsız kullanım
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Görsel üretimi (sadece Pro)
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                Güvenli ve hızlı sohbet
              </li>
            </ul>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 S-AI Chat. Tüm hakları saklıdır.
            </p>
            <div className="mt-2 space-x-4 text-xs text-gray-500 dark:text-gray-500">
              <Link to="/legal/privacy" className="hover:text-blue-600">Gizlilik Sözleşmesi</Link>
              <Link to="/legal/terms" className="hover:text-blue-600">Kullanım Şartları</Link>
              <Link to="/legal/payment" className="hover:text-blue-600">Ödeme Koşulları</Link>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              saimediaworks.com.tr
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};