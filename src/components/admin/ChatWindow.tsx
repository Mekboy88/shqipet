import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ChatMessage {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  id: string;
}

const ChatWindow: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<any>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Listen for chat toggle events
  useEffect(() => {
    const handleToggleChat = () => {
      setShowChat(true);
      if (chatMessages.length === 0) {
        setTimeout(() => {
          const welcomeMsg = "Hello! I'm Shqipet AI. How can I help you today?";
          addMessage(welcomeMsg, 'ai');
          speak(welcomeMsg);
        }, 500);
      }
    };

    window.addEventListener('toggleChat', handleToggleChat);
    return () => window.removeEventListener('toggleChat', handleToggleChat);
  }, [chatMessages.length]);

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      synthRef.current.speak(utterance);
    }
  }, []);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage = {
      text,
      sender,
      timestamp: new Date(),
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const generateAIResponse = (input: string): string => {
    const responses = [
      `I understand your request about "${input.slice(0, 30)}...". Let me help you with that.`,
      "That's a great question! Here's what I think about that...",
      "I'm processing your request now. Here's my response...",
      "Perfect! Let me provide you with a comprehensive answer...",
      "Excellent point! Based on what you've said, here's my analysis..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = () => {
    if (currentMessage.trim()) {
      addMessage(currentMessage, 'user');
      const userMsg = currentMessage;
      setCurrentMessage('');
      
      setIsTyping(true);
      setTimeout(() => {
        const response = generateAIResponse(userMsg);
        setIsTyping(false);
        addMessage(response, 'ai');
        speak(response);
      }, 1000);
    }
  };

  if (!showChat) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white/95 backdrop-blur-3xl border-2 border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden animate-slide-up z-50">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-red-500/20 to-rose-500/20 border-b border-gray-200/30">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-2xl text-gray-800">Shqipet AI</h3>
            <p className="text-sm text-gray-600 font-medium">Premium Assistant</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-500 font-medium">Connected</span>
            </div>
          </div>
          <button 
            onClick={() => setShowChat(false)}
            className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 
                     text-red-600 hover:text-red-700 transition-all duration-200
                     flex items-center justify-center font-bold text-xl"
          >
            ×
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={chatScrollRef}
        className="h-80 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50"
      >
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm font-medium shadow-lg
                           transition-all duration-300 hover:scale-105 ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white' 
                : 'bg-white text-gray-700 border border-gray-200'
            }`}>
              <div>{msg.text}</div>
              <div className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-gradient-to-r from-red-400 to-rose-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-medium">Shqipet is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200/30 bg-white/80">
        <div className="flex gap-3">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-2xl border border-gray-300 
                     focus:border-red-400 focus:ring-2 focus:ring-red-400/20 
                     bg-white/90 backdrop-blur-sm outline-none text-sm
                     placeholder-gray-500 font-medium transition-all duration-200"
          />
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 
                     text-white rounded-2xl font-bold text-sm
                     hover:from-red-600 hover:to-rose-600 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg
                     hover:shadow-xl transform hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;