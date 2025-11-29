import React, { useState } from 'react';
import { Send, Paperclip, Smile, Flag, Archive, MoreHorizontal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  type?: 'text' | 'file' | 'voice' | 'system';
  attachments?: string[];
}

interface ThreadViewProps {
  selectedThread: number | null;
  messages: Message[];
  currentUser: any;
  onSendMessage: (content: string) => void;
  onFlagThread: () => void;
  onArchiveThread: () => void;
}

const ThreadView: React.FC<ThreadViewProps> = ({
  selectedThread,
  messages,
  currentUser,
  onSendMessage,
  onFlagThread,
  onArchiveThread
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#181C20]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#517DF3] to-[#B077FF] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-[#F4F5F6] mb-2">Select a conversation</h3>
          <p className="text-gray-400 text-sm max-w-md">
            Choose a conversation from the sidebar to start messaging with users. 
            You can manage support tickets, handle Pro user inquiries, and moderate content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#181C20] h-full">
      {/* Thread Header */}
      <div className="p-4 border-b border-[#272C30] bg-[#1A1E22] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="text-xs bg-[#272C30] text-[#F4F5F6]">
                {currentUser?.user?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-[#F4F5F6] flex items-center gap-2">
                {currentUser?.user || 'User'}
                {currentUser?.type === 'pro' && (
                  <Badge className="bg-gradient-to-r from-[#517DF3] to-[#B077FF] text-white text-xs">
                    💎 Pro
                  </Badge>
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online • {currentUser?.country || '🌍'}</span>
                {isTyping && <span className="text-[#517DF3] animate-pulse">typing...</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onFlagThread} className="h-7 w-7 text-[#F4F5F6] hover:bg-white/5">
              <Flag className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onArchiveThread} className="h-7 w-7 text-[#F4F5F6] hover:bg-white/5">
              <Archive className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#F4F5F6] hover:bg-white/5">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
          <div className="flex flex-col space-y-4">
            {/* Luna AI Suggestions */}
            <div className="flex justify-center">
              <div className="bg-[#272C30]/50 border border-[#517DF3]/30 rounded-lg p-3 max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#517DF3] to-[#B077FF] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">💡</span>
                  </div>
                  <span className="text-xs text-[#517DF3] font-medium">Luna AI Suggestion</span>
                </div>
                <p className="text-xs text-gray-300">
                  Consider offering a refund or account credit for this billing issue. This user has been a Pro member for 6 months.
                </p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" className="h-6 text-xs border-[#517DF3] text-[#517DF3]">
                    Use suggestion
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 text-xs text-gray-400">
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
            
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-lg ${
                    message.isAdmin
                      ? 'bg-gradient-to-r from-[#517DF3] to-[#B077FF] text-white'
                      : 'bg-[#272C30] text-[#F4F5F6] border border-[#3A3F44]'
                  } ${message.type === 'system' ? 'bg-orange-500/20 border-orange-500/30 text-orange-200' : ''}`}
                >
                  {message.type === 'system' && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-orange-300">
                      <Zap className="h-3 w-3" />
                      <span>System Message</span>
                    </div>
                  )}
                  
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-black/20 rounded">
                          <Paperclip className="h-3 w-3" />
                          <span className="text-xs truncate">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${message.isAdmin ? 'text-white/70' : 'text-gray-400'}`}>
                      {message.timestamp}
                    </p>
                    {message.isAdmin && (
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                        <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                        <span className="text-xs text-white/70 ml-1">read</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-[#272C30] bg-[#1A1E22] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message... (Press Enter to send)"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-[#272C30] border-none text-[#F4F5F6] placeholder:text-gray-400 pr-10"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-[#F4F5F6] hover:bg-white/5"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="bg-gradient-to-r from-[#517DF3] to-[#B077FF] hover:from-[#517DF3]/80 hover:to-[#B077FF]/80 text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-2">
          <Button size="sm" variant="outline" className="h-6 text-xs border-[#272C30] text-gray-400 hover:border-[#517DF3] hover:text-[#517DF3]">
            Refund
          </Button>
          <Button size="sm" variant="outline" className="h-6 text-xs border-[#272C30] text-gray-400 hover:border-[#517DF3] hover:text-[#517DF3]">
            Escalate
          </Button>
          <Button size="sm" variant="outline" className="h-6 text-xs border-[#272C30] text-gray-400 hover:border-[#517DF3] hover:text-[#517DF3]">
            Close Ticket
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThreadView;