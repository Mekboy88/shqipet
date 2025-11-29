import React, { useState, useEffect, useRef, useCallback } from 'react';

interface TopAIButtonProps {
  onClick?: () => void;
  className?: string;
  onVoiceInput?: (text: string) => void;
  onOpenLunaAI?: () => void;
  adminName?: string;
  lunaModalOpen?: boolean;
  setLunaModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenAllNotifications?: () => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export default function ShqipetTopAIButton({ 
  onClick, 
  className = '', 
  onVoiceInput, 
  onOpenLunaAI,
  adminName = 'Admin',
  lunaModalOpen,
  setLunaModalOpen,
  onOpenAllNotifications
}: TopAIButtonProps) {
  // Core States
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'ai', timestamp: Date, id: string}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Advanced Audio Visualization
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(15).fill(0));
  const [pulseIntensity, setPulseIntensity] = useState(0);
  
  // Animation States
  const [buttonScale, setButtonScale] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [rippleEffect, setRippleEffect] = useState(false);
  
  // Refs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Audio visualization animation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (voiceState === 'listening') {
      interval = setInterval(() => {
        setAudioLevels(prev => prev.map(() => 0.2 + Math.random() * 0.8));
        setPulseIntensity(0.3 + Math.random() * 0.7);
        setGlowIntensity(0.4 + Math.random() * 0.6);
      }, 100);
    } else if (voiceState === 'speaking') {
      interval = setInterval(() => {
        setAudioLevels(prev => prev.map(() => 0.1 + Math.random() * 0.6));
        setPulseIntensity(0.2 + Math.random() * 0.5);
      }, 150);
    } else {
      setAudioLevels(Array(15).fill(0.1));
      setPulseIntensity(0);
      setGlowIntensity(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [voiceState]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setVoiceState('listening');
      };

      recognitionRef.current.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript.trim();
        
        if (result.isFinal && transcript.length > 0) {
          handleVoiceResult(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setVoiceState('error');
        setTimeout(() => setVoiceState('idle'), 2000);
      };

      recognitionRef.current.onend = () => {
        if (voiceState === 'listening') {
          setTimeout(() => {
            if (voiceState === 'listening' && recognitionRef.current) {
              recognitionRef.current.start();
            }
          }, 100);
        } else {
          setVoiceState('idle');
        }
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [voiceState]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleVoiceResult = (transcript: string) => {
    setVoiceState('processing');
    addMessage(transcript, 'user');
    if (onVoiceInput) onVoiceInput(transcript);
    
    setIsTyping(true);
    setTimeout(() => {
      const response = generateAIResponse(transcript);
      setIsTyping(false);
      addMessage(response, 'ai');
      speak(response);
    }, 1200);
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

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setVoiceState('speaking');
      utterance.onend = () => setVoiceState('idle');
      utterance.onerror = () => setVoiceState('error');
      
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

  const handleMainButtonClick = () => {
    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 600);
    
    if (onOpenLunaAI) onOpenLunaAI();
    if (onClick) onClick();
  };

  const toggleVoiceRecognition = () => {
    if (voiceState === 'listening') {
      recognitionRef.current?.stop();
      setVoiceState('idle');
    } else if (voiceState === 'idle') {
      // Trigger the global chat window
      window.dispatchEvent(new CustomEvent('toggleChat'));
      recognitionRef.current?.start();
    }
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

  const getStateColor = () => {
    switch (voiceState) {
      case 'listening': return 'from-blue-500 to-indigo-600';
      case 'processing': return 'from-yellow-400 to-orange-500';
      case 'speaking': return 'from-green-400 to-emerald-500';
      case 'error': return 'from-red-500 to-red-600';
      default: return 'from-purple-500 to-pink-600';
    }
  };

  const buttonWidth = voiceState === 'listening' ? 320 : 80;

  return (
    <>
      {/* Main Component */}
      <div className={`relative flex items-center gap-4 ${className}`}>
        {/* Shqipet AI Main Button */}
        <button
          onClick={handleMainButtonClick}
          onMouseEnter={() => setButtonScale(1.05)}
          onMouseLeave={() => setButtonScale(1)}
          className="group relative px-6 py-4 rounded-2xl font-bold text-base transition-all duration-500 ease-out
                     bg-gradient-to-r from-red-50 via-rose-50 to-pink-50
                     hover:from-red-100 hover:via-rose-100 hover:to-pink-100
                     border-2 border-red-200 hover:border-red-300
                     text-red-700 hover:text-red-800
                     shadow-xl hover:shadow-2xl backdrop-blur-sm"
          style={{
            transform: `scale(${buttonScale})`,
            boxShadow: `0 20px 60px rgba(239, 68, 68, 0.15)`
          }}
        >
          <div className="flex items-center gap-4">
            {/* Voice Bars for Main Button */}
            <div className="flex items-center gap-1 h-8">
              {audioLevels.slice(0, 6).map((level, index) => (
                <div
                  key={index}
                  className="w-1 bg-gradient-to-t from-red-500 via-rose-500 to-pink-500 rounded-full transition-all duration-150"
                  style={{ 
                    height: `${16 + (level * 20)}px`,
                    opacity: 0.4 + (level * 0.6)
                  }}
                />
              ))}
            </div>
            
            <span className="font-serif font-bold text-lg tracking-wide">Shqipet AI</span>
            
            {/* Status Indicator */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-lg animate-pulse" />
          </div>
          
          {/* Ripple Effect */}
          {rippleEffect && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-300 to-rose-300 opacity-40 animate-ping" />
          )}
        </button>

        {/* Voice Recognition Button */}
        <div className="relative">
          <button
            onClick={toggleVoiceRecognition}
            className="relative overflow-hidden rounded-full transition-all duration-700 ease-out
                       shadow-2xl hover:shadow-3xl border-4 border-white/30
                       backdrop-blur-2xl transform hover:scale-105 active:scale-95"
            style={{
              width: `${buttonWidth}px`,
              height: '80px',
              background: `linear-gradient(135deg, ${voiceState === 'listening' ? '#3b82f6, #6366f1' : 
                                                     voiceState === 'processing' ? '#f59e0b, #f97316' :
                                                     voiceState === 'speaking' ? '#10b981, #059669' :
                                                     voiceState === 'error' ? '#ef4444, #dc2626' : '#8b5cf6, #ec4899'})`,
              filter: `brightness(${1 + glowIntensity * 0.3}) saturate(${1 + glowIntensity * 0.5})`,
              boxShadow: `0 0 ${20 + pulseIntensity * 40}px rgba(${voiceState === 'listening' ? '59, 130, 246' : 
                                                                   voiceState === 'speaking' ? '16, 185, 129' : '139, 92, 246'}, 0.6)`
            }}
          >
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center px-4">
              {voiceState === 'listening' ? (
                /* Listening: Advanced Bars */
                <div className="flex items-center gap-1">
                  {audioLevels.map((level, index) => (
                    <div
                      key={index}
                      className="bg-white/90 rounded-full transition-all duration-100"
                      style={{
                        width: '4px',
                        height: `${12 + level * 35}px`,
                        opacity: 0.7 + level * 0.3,
                        transform: `scaleY(${0.5 + level})`,
                        filter: `hue-rotate(${level * 30}deg)`
                      }}
                    />
                  ))}
                </div>
              ) : voiceState === 'processing' ? (
                /* Processing */
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              ) : voiceState === 'speaking' ? (
                /* Speaking */
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-white/90 rounded-full animate-pulse"
                      style={{ 
                        height: `${16 + Math.sin(Date.now() * 0.01 + i) * 12}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              ) : voiceState === 'error' ? (
                /* Error */
                <div className="text-white text-2xl">⚠️</div>
              ) : (
                /* Idle: Microphone */
                <svg className="w-9 h-9 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1C10.89 1 10 1.89 10 3V9C10 10.11 10.89 11 12 11S14 10.11 14 9V3C14 1.89 13.11 1 12 1ZM12 13C8.66 13 6 10.34 6 7H4C4 11.42 7.13 15.17 11.5 15.91V19H8V21H16V19H12.5V15.91C16.87 15.17 20 11.42 20 7H18C18 10.34 15.34 13 12 13Z"/>
                </svg>
              )}
            </div>

            {/* Pulsing Ring */}
            <div className={`absolute inset-0 rounded-full border-2 border-white/40 
                           ${voiceState !== 'idle' ? 'animate-ping' : ''}`} />
          </button>

          {/* State Label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <div className={`px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg ${
              voiceState === 'listening' ? 'bg-blue-500' : 
              voiceState === 'processing' ? 'bg-yellow-500' :
              voiceState === 'speaking' ? 'bg-green-500' :
              voiceState === 'error' ? 'bg-red-500' : 'bg-purple-500'
            }`}>
              {voiceState.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}