import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GuestContextType {
  guestMessagesUsed: number;
  guestMessageLimit: number;
  canSendGuestMessage: boolean;
  incrementGuestUsage: () => void;
  showGuestUpgradeModal: boolean;
  setShowGuestUpgradeModal: (show: boolean) => void;
  isGuestLimitReached: boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};

interface GuestProviderProps {
  children: ReactNode;
}

export const GuestProvider: React.FC<GuestProviderProps> = ({ children }) => {
  const [guestMessagesUsed, setGuestMessagesUsed] = useState(0);
  const [showGuestUpgradeModal, setShowGuestUpgradeModal] = useState(false);
  const guestMessageLimit = 2;

  useEffect(() => {
    checkGuestUsage();
  }, []);

  const checkGuestUsage = async () => {
    try {
      // Get user's IP and check usage
      const response = await fetch('/api/guest-usage', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setGuestMessagesUsed(data.messagesUsed || 0);
      } else {
        // Fallback to localStorage if API fails
        const localUsage = localStorage.getItem('guestMessagesUsed');
        const lastReset = localStorage.getItem('guestLastReset');
        const today = new Date().toDateString();

        if (lastReset !== today) {
          // Reset daily usage
          localStorage.setItem('guestMessagesUsed', '0');
          localStorage.setItem('guestLastReset', today);
          setGuestMessagesUsed(0);
        } else {
          setGuestMessagesUsed(parseInt(localUsage || '0', 10));
        }
      }
    } catch (error) {
      console.error('Error checking guest usage:', error);
      // Fallback to localStorage
      const localUsage = localStorage.getItem('guestMessagesUsed');
      setGuestMessagesUsed(parseInt(localUsage || '0', 10));
    }
  };

  const incrementGuestUsage = async () => {
    const newUsage = guestMessagesUsed + 1;
    setGuestMessagesUsed(newUsage);

    try {
      // Update server-side IP tracking
      await fetch('/api/guest-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: true }),
      });
    } catch (error) {
      console.error('Error updating guest usage:', error);
      // Fallback to localStorage
      localStorage.setItem('guestMessagesUsed', newUsage.toString());
      localStorage.setItem('guestLastReset', new Date().toDateString());
    }
  };

  const canSendGuestMessage = guestMessagesUsed < guestMessageLimit;
  const isGuestLimitReached = guestMessagesUsed >= guestMessageLimit;

  const value = {
    guestMessagesUsed,
    guestMessageLimit,
    canSendGuestMessage,
    incrementGuestUsage,
    showGuestUpgradeModal,
    setShowGuestUpgradeModal,
    isGuestLimitReached,
  };

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
};