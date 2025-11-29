import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '@/components/ui/card';
import ChatThemeWrapper from './ChatThemeWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Avatar from '@/components/Avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import { 
  X, 
  Minus, 
  Send, 
  Phone, 
  Video, 
  Mic, 
  MicOff,
  Smile,
  Paperclip,
  MoreVertical,
  Image,
  File,
  Camera,
  MapPin,
  Users,
  Search,
  Archive,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: Date;
  type: 'text' | 'voice' | 'video' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  audioDuration?: number;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isMuted: boolean;
  type: 'direct' | 'group';
}

interface IndividualChatWindowProps {
  conversation: Conversation;
  onClose: () => void;
  onMinimize: () => void;
  windowIndex: number;
  isMinimized?: boolean;
  minimizedIndex?: number;
  isMinimizedGroupHovered?: boolean;
  onGroupHoverEnter?: () => void;
  onGroupHoverLeave?: () => void;
}

const IndividualChatWindow: React.FC<IndividualChatWindowProps> = ({
  conversation,
  onClose,
  onMinimize,
  windowIndex,
  isMinimized = false,
  minimizedIndex = 0,
  isMinimizedGroupHovered = false,
  onGroupHoverEnter,
  onGroupHoverLeave
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! This is your conversation with ${conversation.name}`,
      sender: 'contact',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Resize state
  const [windowHeight, setWindowHeight] = useState(500);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ y: 0, startHeight: 500 });
  const rafRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      setTimeout(() => {
        const textarea = document.querySelector(`textarea[data-chat-id="${conversation.id}"]`) as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.transition = 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
          textarea.style.height = '40px';
          textarea.style.overflowY = 'hidden';
          textarea.focus();
          textarea.setSelectionRange(0, 0);
        }
      }, 0);

      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! I'm here to help.",
          sender: 'contact',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const message: Message = {
        id: Date.now().toString(),
        text: `Shared ${file.type.startsWith('image/') ? 'an image' : 'a file'}: ${file.name}`,
        sender: 'user',
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        fileUrl,
        fileName: file.name
      };
      setMessages([...messages, message]);
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Math.floor(chunks.length / 2);
        
        const message: Message = {
          id: Date.now().toString(),
          text: `🎤 Voice message (${duration}s)`,
          sender: 'user',
          timestamp: new Date(),
          type: 'voice',
          fileUrl: audioUrl,
          audioDuration: duration
        };
        
        setMessages(prev => [...prev, message]);
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
        chunks.length = 0;
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😀', '😂', '😍', '🥺', '😎', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '👏'];

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Chat cleared. How can I help you today?',
      sender: 'contact',
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  // Smooth resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    resizeStartRef.current = { y: clientY, startHeight: windowHeight };
  }, [windowHeight]);

  const handleResizeMove = useCallback((clientY: number) => {
    if (!isResizing) return;
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      const deltaY = resizeStartRef.current.y - clientY;
      const newHeight = Math.max(300, Math.min(800, resizeStartRef.current.startHeight + deltaY));
      setWindowHeight(newHeight);
    });
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => handleResizeMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleResizeMove(e.touches[0].clientY);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseup', handleResizeEnd);
    document.addEventListener('touchend', handleResizeEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchend', handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const leftPosition = 20 + (windowIndex * 400);

  // Minimized state - show compact version
  if (isMinimized) {
    // Stack vertically from bottom, overlapping by half when not hovered
    const collapsedHeight = 30; // Height of visible portion when collapsed (half of window)
    const fullHeight = 60; // Full height of minimized window
    const hoverGap = 8; // Gap between windows when hovered
    
    // Calculate offset using transform for smooth animation
    const yOffset = (isMinimizedGroupHovered
      ? minimizedIndex * (fullHeight + hoverGap)
      : minimizedIndex * collapsedHeight);

    return createPortal(
      <ChatThemeWrapper>
        <Card 
          className="fixed w-[300px] h-[60px] bg-background border border-border shadow-2xl overflow-hidden pointer-events-auto rounded-xl transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform" 
          style={{ 
            left: '20px', 
            bottom: '20px', 
            transform: `translateY(-${yOffset}px)`,
            zIndex: 9999 + minimizedIndex
          }}
          onMouseEnter={onGroupHoverEnter}
          onMouseLeave={onGroupHoverLeave}
        >
          <div className="p-3">
            <div className="flex items-center gap-2">
              <Avatar 
                size="sm"
                src={conversation.avatar || "/placeholder.svg"}
                initials={getInitials(conversation.name)}
                className="ring-2 ring-primary/30 img-locked"
              />
              <span className="text-sm font-medium text-foreground flex-1">
                {conversation.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMinimize}
                className="h-6 w-6 p-0 hover:bg-primary/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </ChatThemeWrapper>,
      document.body
    );
  }

  return createPortal(
    <ChatThemeWrapper>
      <style>{`
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
        /* Prevent scroll chaining to the page */
        .scroll-isolated {
          overscroll-behavior: contain;
          touch-action: pan-y;
        }
      `}</style>
      <Card
      className="fixed w-[380px] bg-background border border-border shadow-2xl overflow-hidden pointer-events-auto flex flex-col rounded-xl transition-all duration-150" 
      style={{ 
        left: `${leftPosition}px`, 
        bottom: '20px', 
        zIndex: 9999 + windowIndex,
        height: `${windowHeight}px`,
        cursor: isResizing ? 'ns-resize' : 'default'
      }}
    >
      {/* Drag Handle */}
      <div 
        className="absolute top-0 left-0 right-0 h-4 flex items-center justify-center cursor-ns-resize hover:bg-primary/5 active:bg-primary/10 transition-colors z-20 group"
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
      >
        <div className="flex flex-col gap-0.5 items-center justify-center py-1">
          <div className="w-8 h-0.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary/50 group-active:bg-primary transition-colors" />
          <div className="w-8 h-0.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary/50 group-active:bg-primary transition-colors" />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-0 right-0 bg-primary/10 border-b border-border p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar 
              size="md"
              src={conversation.avatar || "/placeholder.svg"}
              initials={getInitials(conversation.name)}
              className="ring-2 ring-border img-locked"
            />
            <div>
              <h3 className="font-semibold text-foreground">{conversation.name}</h3>
              <p className="text-xs text-foreground/70">Online now</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVideoCall(!isVideoCall)}
              className={`h-8 w-8 p-0 hover:bg-primary/20 ${isVideoCall ? 'bg-primary/20 text-primary' : ''}`}
            >
              <Video className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVoiceCall(!isVoiceCall)}
              className={`h-8 w-8 p-0 hover:bg-primary/20 ${isVoiceCall ? 'bg-primary/20 text-primary' : ''}`}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-8 w-8 p-0 hover:bg-secondary/20"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Call Status */}
      {(isVoiceCall || isVideoCall) && (
        <div className="bg-green-500/10 border-b border-green-500/20 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isVideoCall ? <Video className="h-4 w-4 text-green-500" /> : <Phone className="h-4 w-4 text-green-500" />}
              <span className="text-sm text-green-600 dark:text-green-400">
                {isVideoCall ? 'Video Call Active' : 'Voice Call Active'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                className={`h-8 w-8 p-0 ${isMuted ? 'bg-red-500/20 text-red-500' : 'hover:bg-green-500/20'}`}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsVoiceCall(false);
                  setIsVideoCall(false);
                }}
                className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500"
              >
                <Phone className="h-4 w-4 rotate-135" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="absolute top-[92px] left-0 right-0 bottom-[120px] overflow-y-auto no-scrollbar scroll-isolated p-4" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-3 rounded-2xl shadow-lg break-words overflow-wrap-anywhere whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-2 rounded-br-md shadow-primary/30'
                      : 'bg-muted/50 border border-border/50 mr-2 rounded-bl-md'
                  }`}
                >
                  {message.type === 'voice' && message.fileUrl && (
                    <div className="mb-2">
                      <VoiceMessagePlayer 
                        audioUrl={message.fileUrl} 
                        duration={message.audioDuration}
                      />
                    </div>
                  )}
                  {message.type === 'image' && message.fileUrl && (
                    <div className="mb-2">
                      <img 
                        src={message.fileUrl} 
                        alt={message.fileName} 
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  )}
                  {message.type === 'file' && message.fileUrl && (
                    <div className="mb-2 p-2 bg-muted/50 rounded border flex items-center gap-2">
                      <File className="h-4 w-4" />
                      <span className="text-sm">{message.fileName}</span>
                    </div>
                  )}
                  {message.type === 'text' && (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              {message.sender === 'contact' && (
                <Avatar 
                  size="sm"
                  src={conversation.avatar || "/placeholder.svg"}
                  initials={getInitials(conversation.name)}
                  className="order-1 mr-2 ring-1 ring-border img-locked"
                />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/80 p-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif,application/pdf,.doc,.docx,.txt"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-primary/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/20">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 bg-popover border-border z-[10000]">
              <div className="grid grid-cols-6 gap-2">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-lg"
                    onClick={() => addEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className={`h-8 w-8 p-0 hover:bg-primary/20 ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : ''}`}
            onClick={startRecording}
          >
            {isRecording ? (
              <div className="flex items-center justify-center">
                <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </div>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex-1" />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/20">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover border-border z-[10000]">
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <Image className="h-4 w-4 mr-2" />
                Send Photo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={clearChat}>
                <Archive className="h-4 w-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSoundEnabled(!isSoundEnabled)}>
                {isSoundEnabled ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {isSoundEnabled ? 'Mute Notifications' : 'Enable Notifications'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 items-end">
          <textarea
            data-chat-id={conversation.id}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            placeholder="Type your message..."
            className="flex-1 border border-input bg-background/50 focus:ring-2 focus:ring-primary/5 focus:outline-none focus:border-primary/8 rounded-lg resize-none no-scrollbar scroll-isolated px-3 text-sm thick-caret flex items-center text-base"
            style={{
              height: '40px',
              minHeight: '40px',
              maxHeight: '120px',
              lineHeight: '40px',
              paddingTop: '0',
              paddingBottom: '0',
              transition: 'height 0.15s ease-out',
              overflowY: 'hidden'
            } as React.CSSProperties}
            rows={1}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              const value = target.value;
              
              if (!value.trim()) {
                target.style.height = '40px';
                target.style.overflowY = 'hidden';
                return;
              }
              
              target.style.height = '40px';
              const scrollHeight = target.scrollHeight;
              const newHeight = Math.min(Math.max(scrollHeight, 40), 120);
              target.style.height = newHeight + 'px';
              target.style.overflowY = newHeight >= 120 ? 'auto' : 'hidden';
            }}
          />
          <Button 
            onClick={sendMessage}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 rounded-full w-10 h-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
    </ChatThemeWrapper>,
    document.body
  );
};

export default IndividualChatWindow;
