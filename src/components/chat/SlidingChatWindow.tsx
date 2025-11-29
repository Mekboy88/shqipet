import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Avatar from '@/components/Avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { ChatSettingsProvider } from '@/contexts/ChatSettingsContext';
import { ChatThemeProvider } from '@/contexts/ChatThemeContext';
import VoiceMessagePlayer from './VoiceMessagePlayer';
import ConversationsList from './ConversationsList';
import ChatThemeWrapper from './ChatThemeWrapper';
import IndividualChatWindow from './IndividualChatWindow';
import { 
  X, 
  Minus, 
  Send, 
  Phone, 
  Video, 
  Mic, 
  MicOff,
  Settings,
  Smile,
  Paperclip,
  MoreVertical,
  Image,
  File,
  Camera,
  MapPin,
  Calendar,
  Users,
  Search,
  Archive,
  Volume2,
  VolumeX,
  MessageCircle,
  Radio,
  User
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

interface SlidingChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
  onMaximize: () => void;
}

const SlidingChatWindow: React.FC<SlidingChatWindowProps> = ({
  isOpen,
  onClose,
  onMinimize,
  isMinimized,
  onMaximize
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { displayName, avatarUrl } = useUniversalUser(user?.id);
  
  // View state - now manages multiple open chats
  const [openChats, setOpenChats] = useState<Conversation[]>([]);
  const [minimizedChats, setMinimizedChats] = useState<Set<string>>(new Set());
  const [isMinimizedGroupHovered, setIsMinimizedGroupHovered] = useState(false);
  const [showOptionsPopup, setShowOptionsPopup] = useState(false);
  const hoverTimerRef = useRef<number | null>(null);
  const handleGroupHoverEnter = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setIsMinimizedGroupHovered(true);
  };
  const handleGroupHoverLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setIsMinimizedGroupHovered(false);
      hoverTimerRef.current = null;
    }, 150);
  };
  
  // Sample conversations data
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'John Doe',
      avatar: '/placeholder.svg',
      lastMessage: 'Hey, how are you doing?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      isMuted: false,
      type: 'direct'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      lastMessage: 'Can we schedule a meeting tomorrow?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      isMuted: false,
      type: 'direct'
    },
    {
      id: '3',
      name: 'Team Group',
      lastMessage: 'Great work on the project!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unreadCount: 5,
      isOnline: true,
      isPinned: false,
      isMuted: true,
      type: 'group'
    }
  ]);
  
  // Archived conversations
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([
    {
      id: '4',
      name: 'Mike Johnson',
      lastMessage: 'Thanks for the help yesterday',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      type: 'direct'
    }
  ]);
  
  // Get user initials
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'contact',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [inputExpanded, setInputExpanded] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
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

  // Reset window height to default when closed
  useEffect(() => {
    if (!isOpen) {
      setWindowHeight(500);
    }
  }, [isOpen]);

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
      
      // Smoothly reset textarea height and cursor position
      setTimeout(() => {
        const textarea = document.querySelector('textarea[placeholder="Type your message..."]') as HTMLTextAreaElement;
        if (textarea) {
          // Enable transition for smooth reset
          textarea.style.transition = 'height 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
          textarea.style.height = '40px';
          textarea.style.overflowY = 'hidden';
          textarea.focus();
          textarea.setSelectionRange(0, 0);
        }
      }, 0);

      // Simulate response
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
      // Stop recording
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      return;
    }

    // Start recording
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
        
        // Calculate approximate duration (you could get actual duration with audio element)
        const duration = Math.floor(chunks.length / 2); // Rough estimate
        
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
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        chunks.length = 0;
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setAudioChunks([]);
      
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

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'Chat cleared. How can I help you today?',
      sender: 'contact',
      timestamp: new Date(),
      type: 'text'
    }]);
  };

  // Handle conversation selection - open in new window
  const handleSelectConversation = (conversation: Conversation) => {
    // Check if this conversation is already open
    if (!openChats.find(c => c.id === conversation.id)) {
      setOpenChats(prev => [...prev, conversation]);
    }
  };

  // Handle close individual chat window
  const handleCloseChat = (conversationId: string) => {
    setOpenChats(prev => prev.filter(c => c.id !== conversationId));
    setMinimizedChats(prev => {
      const newSet = new Set(prev);
      newSet.delete(conversationId);
      return newSet;
    });
  };

  // Handle minimize individual chat window
  const handleMinimizeChat = (conversationId: string) => {
    setMinimizedChats(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId);
      } else {
        newSet.add(conversationId);
      }
      return newSet;
    });
  };

  // Handle start new chat
  const handleStartNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      isMuted: false,
      type: 'direct'
    };
    setOpenChats(prev => [...prev, newConversation]);
  };

  // Handle conversation actions
  const handlePinConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ));
  };

  const handleMuteConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isMuted: !conv.isMuted }
        : conv
    ));
  };

  const handleArchiveConversation = (conversationId: string) => {
    const conversationToArchive = conversations.find(conv => conv.id === conversationId);
    if (conversationToArchive) {
      // Move to archived
      setArchivedConversations(prev => [...prev, conversationToArchive]);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    }
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    // Also close the chat window if it's open
    handleCloseChat(conversationId);
  };

  // Minimized state - floating input at bottom
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
        <Card className="w-80 bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/20">
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Avatar 
                size="sm"
                src={avatarUrl || "/placeholder.svg"}
                initials={getInitials(displayName || "User")}
                className="ring-2 ring-primary/30 img-locked"
              />
              <span className="text-sm font-medium text-primary">
                {displayName || "User"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMaximize}
                className="ml-auto h-6 w-6 p-0 hover:bg-primary/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </Button>
            </div>
            
            {/* Bottom Menu Bar */}
            <div className="border-t border-primary/20 mt-2">
              <div className="flex items-center justify-around pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/messages')}
                  className="flex flex-col items-center gap-1 h-auto py-1 px-2 hover:bg-primary/10 transition-colors"
                  title="Open here"
                >
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span className="text-[10px] font-medium text-foreground">Message</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-1 px-2 hover:bg-primary/10 transition-colors"
                >
                  <Radio className="h-4 w-4 text-foreground" />
                  <span className="text-[10px] font-medium text-foreground">Status</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`${window.location.origin}/messages/standalone`, '_blank', 'noopener,noreferrer')}
                  className="flex flex-col items-center gap-0 h-auto py-1 px-1 hover:bg-primary/10 transition-colors"
                  title="Open in new page"
                >
                  <svg viewBox="0 0 60 60" className="!h-10 !w-10" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <style>{`.cls-1 { fill: #699f4c; } .cls-1, .cls-2 { fill-rule: evenodd; } .cls-2 { fill: #a5c594; }`}</style>
                    </defs>
                    <path className="cls-1" d="M257.875,246a12,12,0,1,1-12,12A12,12,0,0,1,257.875,246ZM252,260h4v4a2,2,0,0,0,4,0v-4h4a2,2,0,0,0,0-4h-4v-4a2,2,0,0,0-4,0v4h-4A2,2,0,0,0,252,260Z" transform="translate(-210 -210.031)"></path>
                    <path className="cls-2" d="M268.109,243.107A18,18,0,0,0,240,258c0,0.388.034,0.768,0.058,1.151l-0.058,0c-1.16,0-4.375-.536-5.358-0.166a5.046,5.046,0,0,0-.847.546c-0.912.91-8.24,10.53-13.295,10.49-0.31,0-2.485.251-2.5-2,0.006-1.352,1.122-1.8,2.433-6.909a20.624,20.624,0,0,0,.532-6.341,2.958,2.958,0,0,0-1.059-1.948c-6.082-4.495-9.906-11-9.906-18.236,0-13.568,13.431-24.566,30-24.566s30,11,30,24.566A20.571,20.571,0,0,1,268.109,243.107Z" transform="translate(-210 -210.031)"></path>
                  </svg>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-1 px-2 hover:bg-primary/10 transition-colors"
                >
                  <Phone className="h-4 w-4 text-foreground" />
                  <span className="text-[10px] font-medium text-foreground">Call</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-1 px-2 hover:bg-primary/10 transition-colors"
                >
                  <User className="h-4 w-4 text-foreground" />
                  <span className="text-[10px] font-medium text-foreground">Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Full chat window
  if (!isOpen) return null;

  return createPortal(
    <ChatSettingsProvider>
      <ChatThemeProvider>
        <div className="fixed inset-0 z-50 pointer-events-none">
          <ChatThemeWrapper>
            {/* Main Conversations Window - Right Side */}
            <Card 
              className="fixed w-[380px] bg-background border border-border shadow-2xl animate-slide-in-right overflow-hidden pointer-events-auto flex flex-col rounded-xl transition-all duration-150" 
              style={{ 
                right: '20px', 
                bottom: '20px', 
                zIndex: 9999,
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
                      src={avatarUrl || "/placeholder.svg"}
                      initials={getInitials(displayName || "User")}
                      className="ring-2 ring-border img-locked"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {displayName || "Messages"}
                      </h3>
                      <p className="text-xs text-foreground/70">
                        {conversations.length} conversations
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 relative">
                    <button
                      onClick={() => setShowOptionsPopup(!showOptionsPopup)}
                      className="hover:opacity-70 transition-opacity cursor-pointer p-1 rounded"
                    >
                      <svg viewBox="0 0 50 50" enableBackground="new 0 0 50 50" className="h-6 w-6" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M46.44694,32.83104H16.74721c-1.41,0-2.55303-1.14303-2.55303-2.55303V6.77378 c0-1.41,1.14303-2.55303,2.55303-2.55303h29.69972c1.41,0,2.55303,1.14303,2.55303,2.55303v23.50423 C48.99997,31.68801,47.85693,32.83104,46.44694,32.83104z" fill="#D2D2D2"></path> <path d="M48.99997,9.31562V6.77377c0-1.41002-1.14302-2.55305-2.55301-2.55305H16.7472 c-1.40998,0-2.55301,1.14303-2.55301,2.55305v2.54184H48.99997z" fill="#53B1E2"></path> <path d="M25.84299,9.78525h-9.14655V7.81336c0-0.48983,0.39709-0.88692,0.88692-0.88692h7.37272 c0.48983,0,0.88692,0.39709,0.88692,0.88692V9.78525z" fill="#D2D2D2"></path> <path d="M34.98955,9.31562h-9.14656V7.81336c0-0.48983,0.39709-0.88692,0.88692-0.88692h7.37272 c0.48983,0,0.88692,0.39709,0.88692,0.88692V9.31562z" fill="#BBBBBB"></path> <circle cx="45.76987" cy="6.98715" fill="#E7E3E6" r="0.97859"></circle> <circle cx="42.78568" cy="6.98715" fill="#E7E3E6" r="0.97859"></circle> <circle cx="39.80148" cy="6.98715" fill="#E7E3E6" r="0.97859"></circle> <g> <rect fill="#85BD57" height="17.93192" width="10.02372" x="17.29741" y="11.53711"></rect> <rect fill="#EC6E62" height="6.96728" width="17.28085" x="29.25823" y="11.53711"></rect> <rect fill="#BBBBBB" height="2.04096" width="17.28085" x="29.25823" y="20.40004"></rect> <rect fill="#BBBBBB" height="2.04096" width="17.28085" x="29.25823" y="23.91406"></rect> <rect fill="#BBBBBB" height="2.04096" width="17.28085" x="29.25823" y="27.42809"></rect> </g> </g> <g> <path d="M33.25272,45.77927H3.553c-1.41,0-2.55303-1.14303-2.55303-2.55303V19.72201 c0-1.41,1.14303-2.55303,2.55303-2.55303h29.69972c1.41,0,2.55303,1.14303,2.55303,2.55303v23.50423 C35.80575,44.63625,34.66272,45.77927,33.25272,45.77927z" fill="#E7E3E6"></path> <path d="M35.80576,22.26385v-2.54184c0-1.41002-1.14303-2.55305-2.55301-2.55305H3.55299 c-1.40998,0-2.55301,1.14303-2.55301,2.55305v2.54184H35.80576z" fill="#53B1E2"></path> <path d="M12.64878,22.73349H3.50222V20.7616c0-0.48983,0.39709-0.88692,0.88692-0.88692h7.37272 c0.48983,0,0.88692,0.39709,0.88692,0.88692V22.73349z" fill="#E7E3E6"></path> <path d="M21.79534,22.26385h-9.14656V20.7616c0-0.48983,0.39709-0.88692,0.88692-0.88692h7.37272 c0.48983,0,0.88692,0.39709,0.88692,0.88692V22.26385z" fill="#D2D2D2"></path> <circle cx="32.57565" cy="19.93539" fill="#E7E3E6" r="0.97859"></circle> <circle cx="29.59146" cy="19.93539" fill="#E7E3E6" r="0.97859"></circle> <circle cx="26.60727" cy="19.93539" fill="#E7E3E6" r="0.97859"></circle> <g> <rect fill="#9A7CA8" height="17.93192" width="10.02372" x="4.10319" y="24.48535"></rect> <rect fill="#BA8C5C" height="6.96728" width="17.28085" x="16.06401" y="24.48536"></rect> <rect fill="#D2D2D2" height="2.04096" width="17.28085" x="16.06401" y="33.34827"></rect> <rect fill="#D2D2D2" height="2.04096" width="17.28085" x="16.06401" y="36.86229"></rect> <rect fill="#D2D2D2" height="2.04096" width="17.28085" x="16.06401" y="40.37631"></rect> </g> </g> </g> <path d="M46.02722,38.98783v0.82645c0,0.3572-0.28957,0.64677-0.64677,0.64677h-2.30318v2.30324 c0,0.3572-0.28957,0.64677-0.64677,0.64677h-0.82645c-0.3572,0-0.64677-0.28957-0.64677-0.64677v-2.30324h-2.30324 c-0.3572,0-0.64677-0.28957-0.64677-0.64677v-0.82645c0-0.3572,0.28957-0.64677,0.64677-0.64677h2.30324v-2.30318 c0-0.3572,0.28957-0.64677,0.64677-0.64677h0.82645c0.3572,0,0.64677,0.28957,0.64677,0.64677v2.30318h2.30318 C45.73765,38.34106,46.02722,38.63063,46.02722,38.98783z" fill="#FFC966"></path> <path d="M10.49373,10.29321v0.82645c0,0.3572-0.28957,0.64677-0.64677,0.64677H7.54378v2.30324 c0,0.3572-0.28957,0.64677-0.64677,0.64677H6.07056c-0.3572,0-0.64677-0.28957-0.64677-0.64677v-2.30324H3.12054 c-0.3572,0-0.64677-0.28957-0.64677-0.64677v-0.82645c0-0.3572,0.28957-0.64678,0.64677-0.64678h2.30324V7.34326 c0-0.3572,0.28957-0.64677,0.64677-0.64677H6.897c0.3572,0,0.64677,0.28957,0.64677,0.64677v2.30318h2.30318 C10.20416,9.64643,10.49373,9.936,10.49373,10.29321z" fill="#EC6E62"></path> </g> </g></svg>
                    </button>
                    
                    {/* Options Popup */}
                    {showOptionsPopup && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-[9998]"
                          onClick={() => setShowOptionsPopup(false)}
                        />
                        
                        {/* Popup Menu */}
                        <div 
                          className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden animate-scale-in z-[9999]"
                          style={{
                            animation: 'scale-in 0.2s ease-out'
                          }}
                        >
                          <button
                            onClick={() => {
                              window.open(`${window.location.origin}/messages/standalone`, '_blank', 'noopener,noreferrer');
                              setShowOptionsPopup(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                          >
                            <span>Open in new page</span>
                          </button>
                          <div className="border-t border-border" />
                          <button
                            onClick={() => {
                              navigate('/messages');
                              setShowOptionsPopup(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
                          >
                            <span>Open here</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
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

              {/* Conversations List */}
              <div className="absolute top-[92px] left-0 right-0 bottom-0 overflow-hidden">
                <ConversationsList
                  conversations={conversations}
                  archivedConversations={archivedConversations}
                  onSelectConversation={handleSelectConversation}
                  onStartNewChat={handleStartNewChat}
                  onPinConversation={handlePinConversation}
                  onMuteConversation={handleMuteConversation}
                  onArchiveConversation={handleArchiveConversation}
                  onDeleteConversation={handleDeleteConversation}
                />
              </div>
            </Card>

            {/* Individual Chat Windows - Left Side */}
            {(() => {
              const minimizedList = openChats.filter(c => minimizedChats.has(c.id));
              const collapsedHeight = 30;
              const fullHeight = 60;
              const hoverGap = 8;
              const expandedHeight = minimizedList.length > 0
                ? (fullHeight + hoverGap) * minimizedList.length - hoverGap
                : 0;

              return (
                <>
                  {minimizedList.length > 0 && (
                    <div
                      className="fixed pointer-events-auto"
                      style={{
                        left: '20px',
                        bottom: '20px',
                        width: '360px',
                        height: `${expandedHeight}px`,
                        zIndex: 9998
                      }}
                      onMouseEnter={handleGroupHoverEnter}
                      onMouseLeave={handleGroupHoverLeave}
                    />
                  )}

                  {openChats.map((chat, index) => {
                    const minimizedIndex = minimizedList.findIndex(c => c.id === chat.id);
                    return (
                      <IndividualChatWindow
                        key={chat.id}
                        conversation={chat}
                        onClose={() => handleCloseChat(chat.id)}
                        onMinimize={() => handleMinimizeChat(chat.id)}
                        windowIndex={index}
                        isMinimized={minimizedChats.has(chat.id)}
                        minimizedIndex={minimizedIndex}
                        isMinimizedGroupHovered={isMinimizedGroupHovered}
                        onGroupHoverEnter={handleGroupHoverEnter}
                        onGroupHoverLeave={handleGroupHoverLeave}
                      />
                    );
                  })}
                </>
              );
            })()}

          </ChatThemeWrapper>
        </div>
      </ChatThemeProvider>
    </ChatSettingsProvider>,
    document.body
  );
};

export default SlidingChatWindow;