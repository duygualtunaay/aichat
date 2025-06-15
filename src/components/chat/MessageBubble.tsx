import React, { useState, useEffect } from 'react';
import { Copy, User, Bot, Check } from 'lucide-react';
import { Message } from '../../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isUser 
              ? 'bg-blue-600 animate-pulse-gentle' 
              : 'bg-gradient-to-br from-green-500 to-green-600 animate-float'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Message content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`relative rounded-2xl px-4 py-3 max-w-none transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-md animate-slide-in-right'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md animate-slide-in-left'
          }`}>
            {/* Image if present */}
            {message.imageUrl && (
              <div className="mb-3">
                <img 
                  src={message.imageUrl} 
                  alt="Generated image"
                  className="max-w-sm rounded-lg shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  onClick={() => window.open(message.imageUrl, '_blank')}
                />
              </div>
            )}
            
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
            
            {/* Message actions */}
            <div className={`absolute top-full mt-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
              isUser ? 'right-0' : 'left-0'
            }`}>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-110 active:scale-95"
                title="Kopyala"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600 animate-bounce" />
                ) : (
                  <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 opacity-0 group-hover:opacity-100 ${
            isUser ? 'text-right' : 'text-left'
          }`}>
            {format(message.timestamp, 'HH:mm', { locale: tr })}
          </div>
        </div>
      </div>
    </div>
  );
};