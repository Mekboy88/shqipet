import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  onUseText?: (text: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, onUseText }) => {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium text-gray-600">Shqipet AI</span>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gray-100 text-gray-800'
              : 'bg-gradient-to-br from-red-50 to-white border border-red-100'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{content}</p>
        </div>

        {!isUser && onUseText && (
          <Button
            onClick={() => onUseText(content)}
            variant="ghost"
            size="sm"
            className="mt-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Use This Text
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
