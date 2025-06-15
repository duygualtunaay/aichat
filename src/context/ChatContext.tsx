import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Chat, Message } from '../types';
import { useAuth } from './AuthContext';
import { useGuest } from './GuestContext';
import { generateAIResponse, generateImage } from '../services/openai';

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  createNewChat: () => string;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string, imagePrompt?: boolean) => Promise<void>;
  deleteChat: (chatId: string) => void;
  updateChatTitle: (chatId: string, title: string) => void;
  canSendMessage: boolean;
  canGenerateImage: boolean;
  dailyUsage: number;
  messageLimit: number;
  isLoading: boolean;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  remainingMessages: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { user, incrementUsage, isAuthenticated } = useAuth();
  const { 
    guestMessagesUsed, 
    guestMessageLimit, 
    canSendGuestMessage, 
    incrementGuestUsage,
    setShowGuestUpgradeModal,
    isGuestLimitReached
  } = useGuest();

  const dailyUsage = user?.dailyUsage || 0;
  const messageLimit = 20; // Daily limit for free users
  const remainingMessages = isAuthenticated 
    ? Math.max(0, messageLimit - dailyUsage)
    : Math.max(0, guestMessageLimit - guestMessagesUsed);

  // Determine if user can send messages
  const canSendMessage = isAuthenticated 
    ? (user?.plan === 'pro' || dailyUsage < messageLimit)
    : canSendGuestMessage;

  const canGenerateImage = isAuthenticated && user?.plan === 'pro';

  const createNewChat = (): string => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentChat(newChat);
    return newChat.id;
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const sendMessage = async (content: string, imagePrompt: boolean = false) => {
    if (!currentChat) return;

    // Check if user can send message
    if (!canSendMessage) {
      if (isAuthenticated) {
        setShowUpgradeModal(true);
      } else {
        setShowGuestUpgradeModal(true);
      }
      return;
    }

    // Check if user can generate image
    if (imagePrompt && !canGenerateImage) {
      if (isAuthenticated) {
        setShowUpgradeModal(true);
      } else {
        setShowGuestUpgradeModal(true);
      }
      return;
    }

    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    // Update current chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updatedAt: new Date(),
      title: currentChat.messages.length === 0 ? content.slice(0, 30) + '...' : currentChat.title,
    };

    setCurrentChat(updatedChat);
    setChats(prev => prev.map(c => c.id === updatedChat.id ? updatedChat : c));

    // Increment usage
    if (isAuthenticated && user?.plan === 'free') {
      await incrementUsage();
    } else if (!isAuthenticated) {
      incrementGuestUsage();
    }

    try {
      let aiResponse: string;
      let imageUrl: string | undefined;

      if (imagePrompt) {
        // Generate image
        imageUrl = await generateImage(content);
        aiResponse = `Görsel başarıyla oluşturuldu: "${content}"`;
      } else {
        // Generate text response
        const chatHistory = updatedChat.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
        aiResponse = await generateAIResponse(chatHistory);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        imageUrl,
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
        updatedAt: new Date(),
      };

      setCurrentChat(finalChat);
      setChats(prev => prev.map(c => c.id === finalChat.id ? finalChat : c));
    } catch (error) {
      console.error('AI response error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.',
        role: 'assistant',
        timestamp: new Date(),
      };

      const errorChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage],
        updatedAt: new Date(),
      };

      setCurrentChat(errorChat);
      setChats(prev => prev.map(c => c.id === errorChat.id ? errorChat : c));
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const updateChatTitle = (chatId: string, title: string) => {
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, title, updatedAt: new Date() } : c
    ));
    if (currentChat?.id === chatId) {
      setCurrentChat(prev => prev ? { ...prev, title } : null);
    }
  };

  const value = {
    chats,
    currentChat,
    createNewChat,
    selectChat,
    sendMessage,
    deleteChat,
    updateChatTitle,
    canSendMessage,
    canGenerateImage,
    dailyUsage: isAuthenticated ? dailyUsage : guestMessagesUsed,
    messageLimit: isAuthenticated ? messageLimit : guestMessageLimit,
    isLoading,
    showUpgradeModal,
    setShowUpgradeModal,
    remainingMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};