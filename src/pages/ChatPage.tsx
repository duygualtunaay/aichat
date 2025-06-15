import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatInterface } from '../components/chat/ChatInterface';
import { ProfileModal } from '../components/profile/ProfileModal';
import { SubscriptionModal } from '../components/subscription/SubscriptionModal';
import { useChat } from '../context/ChatContext';

export const ChatPage: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentChat, createNewChat } = useChat();

  // Create initial chat if none exists
  useEffect(() => {
    if (!currentChat) {
      createNewChat();
    }
  }, [currentChat, createNewChat]);

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        onShowProfile={() => setShowProfile(true)}
        onShowSubscriptions={() => setShowSubscriptions(true)}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Modals */}
      <ProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
      />
      <SubscriptionModal 
        isOpen={showSubscriptions} 
        onClose={() => setShowSubscriptions(false)} 
      />
    </div>
  );
};