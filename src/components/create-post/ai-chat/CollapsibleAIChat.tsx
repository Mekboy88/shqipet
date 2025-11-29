import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatMessage from './ChatMessage';
import ChatTypingBar from './ChatTypingBar';
import TypingIndicator from './TypingIndicator';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface CollapsibleAIChatProps {
  onUseText?: (text: string) => void;
  hideToggleButton?: boolean;
  isExpanded?: boolean;
  onToggleChange?: (isExpanded: boolean) => void;
}

const CollapsibleAIChat: React.FC<CollapsibleAIChatProps> = ({ 
  onUseText, 
  hideToggleButton = false, 
  isExpanded: controlledIsExpanded,
  onToggleChange 
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);
  const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m Shqipet AI, your creative assistant. I can help you improve your writing, generate captions, suggest hashtags, and more. How can I help you today?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastTouchYRef = useRef<number | null>(null);
  const { toast } = useToast();

  const handleWheelCapture = (e: React.WheelEvent<HTMLDivElement>) => {
    const el = messagesContainerRef.current;
    if (!el) return;
    e.stopPropagation();
    e.preventDefault();
    el.scrollTop += e.deltaY;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    lastTouchYRef.current = e.touches[0].clientY;
  };

  const handleTouchMoveCapture = (e: React.TouchEvent<HTMLDivElement>) => {
    const el = messagesContainerRef.current;
    const lastY = lastTouchYRef.current;
    if (!el || lastY == null) return;
    const currentY = e.touches[0].clientY;
    const delta = lastY - currentY;
    e.stopPropagation();
    e.preventDefault();
    el.scrollTop += delta;
    lastTouchYRef.current = currentY;
  };

  const handleTouchEnd = () => { lastTouchYRef.current = null; };

  const toggleExpanded = (value: boolean) => {
    if (controlledIsExpanded === undefined) {
      setInternalIsExpanded(value);
    }
    onToggleChange?.(value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Lock background scroll when chat is open and prevent scroll chaining to the page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isExpanded) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;

      const prevHtmlOverflow = html.style.overflow;
      const prevBodyOverflow = body.style.overflow;
      const prevHtmlOSB = html.style.overscrollBehavior as string;
      const prevBodyOSB = body.style.overscrollBehavior as string;
      const prevBodyPaddingRight = body.style.paddingRight;

      html.style.overscrollBehavior = 'none';
      body.style.overscrollBehavior = 'none';
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      if (sbw > 0) body.style.paddingRight = `${sbw}px`;

      return () => {
        html.style.overscrollBehavior = prevHtmlOSB;
        body.style.overscrollBehavior = prevBodyOSB;
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
        body.style.paddingRight = prevBodyPaddingRight;
      };
    } else {
      html.style.overscrollBehavior = '';
      body.style.overscrollBehavior = '';
      html.style.overflow = '';
      body.style.overflow = '';
      body.style.paddingRight = '';
    }
  }, [isExpanded]);
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(content)
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return 'Here\'s an improved version of your text:\n\n"Experience the extraordinary journey through life\'s most meaningful moments. Share your story with authenticity and passion."\n\nThis version is more engaging and emotionally resonant.';
    } else if (lowerMessage.includes('hashtag')) {
      return 'Here are some trending hashtags for your post:\n\n#Inspiration #LifeGoals #Motivation #Success #DailyVibes #AuthenticLiving #ShareYourStory';
    } else if (lowerMessage.includes('caption') || lowerMessage.includes('generate')) {
      return 'Here\'s a creative caption for you:\n\n"Every moment is a story waiting to be told. Today, I\'m sharing mine. 🌟 What\'s yours?"';
    } else {
      return 'I\'m here to help! You can ask me to:\n\n• Improve your writing\n• Generate captions\n• Suggest hashtags\n• Check grammar\n• Translate text\n• Optimize engagement\n\nWhat would you like me to help you with?';
    }
  };

  const handleUseText = (text: string) => {
    if (onUseText) {
      onUseText(text);
      toast({
        title: 'Text Applied',
        description: 'The text has been added to your post.',
      });
    }
  };

  return (
    <>
      <style>{`
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { width: 0; height: 0; display: none; }
        .scroll-isolated { overscroll-behavior: contain; touch-action: pan-y; }
        .scroll-lock { overscroll-behavior: none; }
        .scroll-capture { touch-action: none; }
      `}</style>
      {/* Toggle Button (visible when collapsed) */}
      {!hideToggleButton && (
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed right-4 top-24 z-50"
            >
              <Button
                onClick={() => toggleExpanded(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">💬 Shqipet AI</span>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: 40 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-2 sm:right-4 top-[72px] h-[calc(100vh-88px)] w-full sm:w-[90vw] md:w-[400px] max-w-[400px] bg-white/70 backdrop-blur-xl shadow-lg border border-gray-200/60 z-50 flex flex-col rounded-3xl scroll-lock"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/60">
              <div className="flex items-center gap-2">
                <svg height="20px" width="20px" viewBox="0 0 503.467 503.467" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(1 1)">
                    <path fill="#ECF4F7" d="M429.933,259.267v102.4c0,18.773-15.36,34.133-34.133,34.133H105.667 c-18.773,0-34.133-15.36-34.133-34.133v-102.4v-85.333c0-18.773,15.36-34.133,34.133-34.133h68.267h8.533H319h76.8 c18.773,0,34.133,15.36,34.133,34.133V259.267z M327.533,139.8h-153.6c0-37.547,34.133-68.267,76.8-68.267 S327.533,102.253,327.533,139.8z M165.4,395.8h170.667l-25.6,102.4H191L165.4,395.8z"/>
                    <path fill="#FF7474" d="M250.733,3.267c9.387,0,17.067,7.68,17.067,17.067S260.12,37.4,250.733,37.4 c-9.387,0-17.067-7.68-17.067-17.067S241.347,3.267,250.733,3.267z M20.333,242.2c9.387,0,17.067,7.68,17.067,17.067 c0,9.387-7.68,17.067-17.067,17.067s-17.067-7.68-17.067-17.067C3.267,249.88,10.947,242.2,20.333,242.2z M481.133,242.2 c9.387,0,17.067,7.68,17.067,17.067c0,9.387-7.68,17.067-17.067,17.067s-17.067-7.68-17.067-17.067 C464.067,249.88,471.747,242.2,481.133,242.2z"/>
                    <polygon fill="#FFE079" points="173.933,344.6 327.533,344.6 327.533,310.467 173.933,310.467"/>
                    <path fill="#7EE1E6" d="M156.867,208.067c9.387,0,17.067,7.68,17.067,17.067s-7.68,17.067-17.067,17.067 s-17.067-7.68-17.067-17.067S147.48,208.067,156.867,208.067z M344.6,208.067c9.387,0,17.067,7.68,17.067,17.067 S353.987,242.2,344.6,242.2s-17.067-7.68-17.067-17.067S335.213,208.067,344.6,208.067z"/>
                  </g>
                  <path fill="#51565F" d="M311.467,503.467H192c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267h119.467 c2.56,0,4.267,1.707,4.267,4.267C315.733,501.76,314.027,503.467,311.467,503.467z M311.467,469.333H192 c-2.56,0-4.267-1.707-4.267-4.267c0-2.56,1.707-4.267,4.267-4.267h119.467c2.56,0,4.267,1.707,4.267,4.267 C315.733,467.627,314.027,469.333,311.467,469.333z M328.533,435.2h-153.6c-2.56,0-4.267-1.707-4.267-4.267 c0-2.56,1.707-4.267,4.267-4.267h153.6c2.56,0,4.267,1.707,4.267,4.267C332.8,433.493,331.093,435.2,328.533,435.2z M396.8,401.067 H106.667c-21.333,0-38.4-17.067-38.4-38.4V294.4c0-2.56,1.707-4.267,4.267-4.267c2.56,0,4.267,1.707,4.267,4.267v68.267 c0,16.213,13.653,29.867,29.867,29.867H396.8c16.213,0,29.867-13.653,29.867-29.867V294.4c0-2.56,1.707-4.267,4.267-4.267 s4.267,1.707,4.267,4.267v68.267C435.2,384,418.133,401.067,396.8,401.067z M328.533,349.867h-153.6 c-2.56,0-4.267-1.707-4.267-4.267v-34.133c0-2.56,1.707-4.267,4.267-4.267h153.6c2.56,0,4.267,1.707,4.267,4.267V345.6 C332.8,348.16,331.093,349.867,328.533,349.867z M281.6,341.333h42.667v-25.6H281.6V341.333z M230.4,341.333h42.667v-25.6H230.4 V341.333z M179.2,341.333h42.667v-25.6H179.2V341.333z M482.133,281.6c-10.24,0-18.773-7.68-21.333-17.067h-29.867 c-2.56,0-4.267-1.707-4.267-4.267v-85.333c0-16.213-13.653-29.867-29.867-29.867H209.067c-2.56,0-4.267-1.707-4.267-4.267 c0-2.56,1.707-4.267,4.267-4.267H396.8c21.333,0,38.4,17.067,38.4,38.4V256h25.6c1.707-9.387,10.24-17.067,21.333-17.067 c11.947,0,21.333,9.387,21.333,21.333C503.467,272.213,494.08,281.6,482.133,281.6z M482.133,247.467c-6.827,0-12.8,5.973-12.8,12.8 c0,6.827,5.973,12.8,12.8,12.8s12.8-5.973,12.8-12.8C494.933,253.44,488.96,247.467,482.133,247.467z M21.333,281.6 C9.387,281.6,0,272.213,0,260.267c0-11.947,9.387-21.333,21.333-21.333c10.24,0,18.773,7.68,20.48,17.067h26.453v-81.067 c0-21.333,17.067-38.4,38.4-38.4h64c2.56-37.547,40.96-65.707,76.8-68.267V41.813c-9.387-1.707-17.067-10.24-17.067-20.48 C230.4,9.387,239.787,0,251.733,0c11.947,0,21.333,9.387,21.333,21.333c0,10.24-7.68,18.773-17.067,20.48v26.453 c25.6,1.707,50.347,15.36,64.853,35.84c1.707,1.707,0.853,4.267-0.853,5.973c-1.707,1.707-4.267,0.853-5.973-0.853 C300.373,89.6,275.627,76.8,251.733,76.8c-34.133,0-72.533,27.307-72.533,64c0,2.56-1.707,4.267-4.267,4.267h-68.267 c-16.213,0-29.867,13.653-29.867,29.867v85.333c0,2.56-1.707,4.267-4.267,4.267h-30.72C40.107,273.92,31.573,281.6,21.333,281.6z M21.333,247.467c-6.827,0-12.8,5.973-12.8,12.8c0,6.827,5.973,12.8,12.8,12.8s12.8-5.973,12.8-12.8 C34.133,253.44,28.16,247.467,21.333,247.467z M251.733,8.533c-6.827,0-12.8,5.973-12.8,12.8s5.973,12.8,12.8,12.8 c6.827,0,12.8-5.973,12.8-12.8S258.56,8.533,251.733,8.533z M345.6,247.467c-11.947,0-21.333-9.387-21.333-21.333 S333.653,204.8,345.6,204.8c11.947,0,21.333,9.387,21.333,21.333S357.547,247.467,345.6,247.467z M345.6,213.333 c-6.827,0-12.8,5.973-12.8,12.8s5.973,12.8,12.8,12.8s12.8-5.973,12.8-12.8S352.427,213.333,345.6,213.333z M157.867,247.467 c-11.947,0-21.333-9.387-21.333-21.333s9.387-21.333,21.333-21.333c11.947,0,21.333,9.387,21.333,21.333 S169.813,247.467,157.867,247.467z M157.867,213.333c-6.827,0-12.8,5.973-12.8,12.8s5.973,12.8,12.8,12.8 c6.827,0,12.8-5.973,12.8-12.8S164.693,213.333,157.867,213.333z"/>
                </svg>
                <div>
                  <h3 className="font-bold text-gray-800">Shqipet AI</h3>
                  <p className="text-xs text-gray-600">Creative Assistant</p>
                </div>
              </div>
              <Button
                onClick={() => toggleExpanded(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-600 hover:text-[#e60000] hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages Area */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto no-scrollbar scroll-isolated scroll-lock scroll-capture p-6 space-y-4"
              onWheelCapture={handleWheelCapture}
              onTouchStart={handleTouchStart}
              onTouchMoveCapture={handleTouchMoveCapture}
              onTouchEnd={handleTouchEnd}
            >
              {messages.map(message => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  onUseText={message.role === 'assistant' ? handleUseText : undefined}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing Bar */}
            <div className="p-6 border-t border-gray-200/60">
              <ChatTypingBar onSendMessage={handleSendMessage} disabled={isTyping} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollapsibleAIChat;
