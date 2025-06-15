import React, { useState, useRef, useEffect } from 'react';
import { Send, Menu, Image, Sparkles, Crown, AlertTriangle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useGuest } from '../../context/GuestContext';
import { MessageBubble } from './MessageBubble';
import { GuestUpgradeModal } from './GuestUpgradeModal';

interface ChatInterfaceProps {
  onToggleSidebar: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onToggleSidebar }) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { 
    currentChat, 
    sendMessage, 
    canSendMessage, 
    canGenerateImage,
    dailyUsage, 
    messageLimit, 
    remainingMessages,
    isLoading,
    showUpgradeModal,
    setShowUpgradeModal
  } = useChat();
  const { user, isAuthenticated } = useAuth();
  const { 
    guestMessagesUsed, 
    guestMessageLimit, 
    showGuestUpgradeModal, 
    setShowGuestUpgradeModal,
    isGuestLimitReached
  } = useGuest();

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleSubmit = async (e: React.FormEvent, imagePrompt: boolean = false) => {
    e.preventDefault();
    if (!message.trim() || isLoading || isComposing) return;

    const messageToSend = message.trim();
    setMessage('');
    
    // Add send animation
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLElement;
    if (submitButton) {
      submitButton.style.transform = 'scale(0.95)';
      setTimeout(() => {
        submitButton.style.transform = 'scale(1)';
      }, 150);
    }
    
    await sendMessage(messageToSend, imagePrompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isPro = user?.plan === 'pro';
  const currentUsage = isAuthenticated ? dailyUsage : guestMessagesUsed;
  const currentLimit = isAuthenticated ? messageLimit : guestMessageLimit;

  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <Menu className="w-5 h-5 text-gray-500" />
            </button>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentChat?.title || 'S-AI Chat'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isAuthenticated ? 'Yapay zeka asistanınız' : 'Ücretsiz deneme'}
              </p>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              isPro ? (
                <span className="text-purple-600 dark:text-purple-400 flex items-center animate-pulse-gentle">
                  <Crown className="w-4 h-4 mr-1" />
                  Pro • Sınırsız
                </span>
              ) : (
                <span className={`flex items-center transition-colors duration-300 ${remainingMessages <= 5 ? 'text-orange-600 dark:text-orange-400' : ''}`}>
                  {remainingMessages <= 5 && <AlertTriangle className="w-4 h-4 mr-1 animate-bounce-gentle" />}
                  {remainingMessages} mesaj kaldı
                </span>
              )
            ) : (
              <span className={`flex items-center transition-colors duration-300 ${remainingMessages <= 1 ? 'text-orange-600 dark:text-orange-400' : ''}`}>
                {remainingMessages <= 1 && <AlertTriangle className="w-4 h-4 mr-1 animate-bounce-gentle" />}
                {remainingMessages} deneme kaldı
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Guest Trial Warning */}
      {!isAuthenticated && remainingMessages <= 1 && remainingMessages > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-800 p-4 animate-slide-down" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Son deneme mesajınız!
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Sohbete devam etmek için ücretsiz hesap oluşturun.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowGuestUpgradeModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Hesap Oluştur
            </button>
          </div>
        </div>
      )}

      {/* Daily Limit Warning for Authenticated Users */}
      {isAuthenticated && !isPro && remainingMessages <= 5 && remainingMessages > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-b border-orange-200 dark:border-orange-800 p-4 animate-slide-down" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Günlük limitinize yaklaşıyorsunuz
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  {remainingMessages} mesaj hakkınız kaldı. Pro'ya geçerek sınırsız mesaj gönderin.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Pro'ya Geç
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {!currentChat?.messages.length ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md animate-fade-in-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                S-AI Chat'e Hoş Geldiniz
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {isAuthenticated 
                  ? 'Türkçe yapay zeka asistanınızla sohbet etmeye başlayın.'
                  : 'Yapay zeka asistanımızı ücretsiz deneyin! 2 mesaj hakkınız var.'
                }
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg animate-fade-in-up hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
                  <p className="font-medium text-gray-900 dark:text-white">💬 Soru Sorun</p>
                  <p className="text-gray-600 dark:text-gray-400">Merak ettiğiniz konular hakkında</p>
                </div>
                <div className={`bg-gray-50 dark:bg-gray-800 p-3 rounded-lg animate-fade-in-up hover:scale-105 transition-transform duration-300 ${!canGenerateImage ? 'opacity-50' : ''}`} style={{ animationDelay: '0.4s' }}>
                  <p className="font-medium text-gray-900 dark:text-white">
                    🎨 Görsel Oluşturun {!canGenerateImage && '(Pro)'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">AI ile yaratıcı görseller</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {isAuthenticated ? (
                    isPro
                      ? '🎉 Pro kullanıcı olarak sınırsız mesaj ve görsel üretimi hakkınız var!'
                      : `Günde ${messageLimit} mesaj ücretsiz! Kalan: ${remainingMessages}`
                  ) : (
                    `🚀 ${guestMessageLimit} ücretsiz deneme mesajı! Kalan: ${remainingMessages}`
                  )}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {currentChat.messages.map((msg, index) => (
              <div key={msg.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <MessageBubble message={msg} />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">Düşünüyor...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 animate-slide-up">
        {!canSendMessage && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-shake">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                <div>
                  <p className="text-red-800 dark:text-red-200 font-medium">
                    {isAuthenticated ? 'Günlük mesaj limitiniz doldu!' : 'Ücretsiz deneme süresi doldu!'}
                  </p>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    {isAuthenticated 
                      ? 'Pro plana geçerek sınırsız mesaj hakkı kazanın.'
                      : 'Sohbete devam etmek için hesap oluşturun.'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={() => isAuthenticated ? setShowUpgradeModal(true) : setShowGuestUpgradeModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                {isAuthenticated ? 'Pro\'ya Geç' : 'Hesap Oluştur'}
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={(e) => handleSubmit(e)} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={
                canSendMessage 
                  ? "Mesajınızı yazın..." 
                  : isAuthenticated 
                    ? "Mesaj göndermek için Pro plana geçin"
                    : "Devam etmek için hesap oluşturun"
              }
              disabled={isLoading || !canSendMessage}
              className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 focus:scale-[1.02]"
              rows={1}
              style={{ minHeight: '44px' }}
            />
          </div>
          
          {/* Image generation button */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={!message.trim() || isLoading || !canSendMessage}
            className={`flex-shrink-0 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 ${
              canGenerateImage 
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 hover:shadow-lg' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            title={canGenerateImage ? "Görsel oluştur" : "Görsel oluşturma sadece Pro üyelerde"}
          >
            <Image className="h-5 w-5" />
          </button>
          
          {/* Text message button */}
          <button
            type="submit"
            disabled={!message.trim() || isLoading || !canSendMessage}
            className="flex-shrink-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>

      {/* Upgrade Modal for Authenticated Users */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center animate-float">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Pro'ya Geçin
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {!canSendMessage 
                  ? 'Günlük mesaj limitiniz doldu. Pro plana geçerek sınırsız mesaj gönderin.'
                  : 'Görsel üretimi sadece Pro üyelerde mevcuttur.'
                }
              </p>
              
              {/* Pro Benefits */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Pro Avantajları:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 text-left">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Sınırsız mesaj gönderimi
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Sınırsız görsel üretimi
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Öncelikli destek
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Gelişmiş AI modelleri
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    window.location.href = '/payment?plan=monthly';
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Pro'ya Geç - ₺199/ay
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest Upgrade Modal */}
      <GuestUpgradeModal
        isOpen={showGuestUpgradeModal}
        onClose={() => setShowGuestUpgradeModal(false)}
        messagesUsed={guestMessagesUsed}
        messageLimit={guestMessageLimit}
      />
    </div>
  );
};