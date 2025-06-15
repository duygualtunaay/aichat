import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  Edit3, 
  Trash2,
  User,
  Crown,
  X,
  LogOut,
  Shield,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useGuest } from '../../context/GuestContext';
import { useTheme } from '../../context/ThemeContext';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  onShowProfile: () => void;
  onShowSubscriptions: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  onShowProfile, 
  onShowSubscriptions,
  isOpen,
  onToggle
}) => {
  const { chats, createNewChat, selectChat, deleteChat, currentChat, updateChatTitle, dailyUsage, messageLimit, remainingMessages } = useChat();
  const { user, logout, isAuthenticated } = useAuth();
  const { guestMessagesUsed, guestMessageLimit } = useGuest();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleNewChat = () => {
    createNewChat();
  };

  const handleEditTitle = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveTitle = () => {
    if (editingChatId && editTitle.trim()) {
      updateChatTitle(editingChatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  const isPro = user?.plan === 'pro';
  const currentUsage = isAuthenticated ? dailyUsage : guestMessagesUsed;
  const currentLimit = isAuthenticated ? messageLimit : guestMessageLimit;
  const currentRemaining = isAuthenticated ? remainingMessages : Math.max(0, guestMessageLimit - guestMessagesUsed);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={onToggle}
        />
      )}
      
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center animate-float">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">S-AI Chat</h1>
                {isPro && (
                  <span className="px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-full animate-pulse-gentle">
                    PRO
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Yeni Sohbet</span>
          </button>
        </div>

        {/* Usage indicator */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className={`rounded-lg p-3 transition-all duration-300 hover:scale-[1.02] ${
            isPro 
              ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'
              : currentRemaining <= 1 && !isAuthenticated
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                : currentRemaining <= 5 && isAuthenticated
                  ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                  : 'bg-gray-50 dark:bg-gray-800'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${
                isPro 
                  ? 'text-purple-700 dark:text-purple-300'
                  : currentRemaining <= 1 && !isAuthenticated
                    ? 'text-red-700 dark:text-red-300'
                    : currentRemaining <= 5 && isAuthenticated
                      ? 'text-orange-700 dark:text-orange-300'
                      : 'text-gray-600 dark:text-gray-400'
              }`}>
                {isAuthenticated 
                  ? (isPro ? 'Pro Kullanım' : 'Günlük Kullanım')
                  : 'Ücretsiz Deneme'
                }
              </span>
              <span className={`text-sm font-medium flex items-center ${
                isPro 
                  ? 'text-purple-900 dark:text-purple-100'
                  : currentRemaining <= 1 && !isAuthenticated
                    ? 'text-red-900 dark:text-red-100'
                    : currentRemaining <= 5 && isAuthenticated
                      ? 'text-orange-900 dark:text-orange-100'
                      : 'text-gray-900 dark:text-white'
              }`}>
                {((currentRemaining <= 5 && isAuthenticated) || (currentRemaining <= 1 && !isAuthenticated)) && !isPro && (
                  <AlertTriangle className="w-3 h-3 mr-1 animate-bounce-gentle" />
                )}
                {isPro ? 'Sınırsız' : `${currentRemaining} kalan`}
              </span>
            </div>
            
            {!isPro && (
              <>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                      currentRemaining <= 1 && !isAuthenticated
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : currentRemaining <= 5 && isAuthenticated
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700'
                    }`}
                    style={{ width: `${(currentUsage / currentLimit) * 100}%` }}
                  />
                </div>
                <div className={`text-xs mt-1 ${
                  currentRemaining <= 1 && !isAuthenticated
                    ? 'text-red-600 dark:text-red-400'
                    : currentRemaining <= 5 && isAuthenticated
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {currentUsage}/{currentLimit} {isAuthenticated ? 'mesaj' : 'deneme'} kullanıldı
                </div>
              </>
            )}
            
            {isPro && (
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                ✨ Sınırsız mesaj ve görsel üretimi
              </div>
            )}

            {/* Upgrade prompts */}
            {!isAuthenticated && currentRemaining <= 1 && (
              <button
                onClick={handleLogin}
                className="w-full mt-3 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Hesap Oluştur - 20 Mesaj/Gün
              </button>
            )}

            {isAuthenticated && !isPro && currentRemaining <= 5 && (
              <button
                onClick={onShowSubscriptions}
                className="w-full mt-3 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Pro'ya Geç - Sınırsız Mesaj
              </button>
            )}
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Sohbet Geçmişi
          </h3>
          <div className="space-y-2">
            {chats.length === 0 ? (
              <div className="text-center py-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3 animate-float" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Henüz sohbet yok
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Yeni sohbet başlatın
                </p>
              </div>
            ) : (
              chats.map((chat, index) => (
                <div
                  key={chat.id}
                  className={`group relative rounded-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in-up ${
                    currentChat?.id === chat.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                  }`}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  {editingChatId === chat.id ? (
                    <div className="p-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        className="w-full text-sm bg-transparent border-none outline-none text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => selectChat(chat.id)}
                      className="w-full text-left p-3 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {format(chat.updatedAt, 'dd MMM yyyy', { locale: tr })}
                          </p>
                        </div>
                        {isAuthenticated && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTitle(chat.id, chat.title);
                              }}
                              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-110"
                            >
                              <Edit3 className="w-3 h-3 text-gray-400" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.id);
                              }}
                              className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* User menu */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
          <div className="space-y-2">
            {isAuthenticated ? (
              <>
                <button
                  onClick={onShowProfile}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || 'Kullanıcı'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isPro ? 'Pro Plan' : 'Ücretsiz Plan'}
                    </p>
                  </div>
                </button>
                
                {!isPro && (
                  <button
                    onClick={onShowSubscriptions}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    <Crown className="w-5 h-5 text-gray-400 animate-pulse-gentle" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pro'ya Geç</span>
                  </button>
                )}

                {user?.isAdmin && (
                  <button
                    onClick={() => window.open('/admin', '_blank')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Admin Panel</span>
                  </button>
                )}
                
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? 'Açık Tema' : 'Karanlık Tema'}
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-red-600 dark:text-red-400 hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Çıkış Yap</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 border border-blue-200 dark:border-blue-800 hover:scale-105 hover:shadow-lg"
                >
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Hesap Oluştur
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Günde 20 ücretsiz mesaj
                    </p>
                  </div>
                </button>
                
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {theme === 'dark' ? 'Açık Tema' : 'Karanlık Tema'}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};