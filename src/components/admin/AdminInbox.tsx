import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Maximize2, Minimize2, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConversationsList from './ConversationsList';
import ThreadView from './ThreadView';
import UserMetadataPanel from './UserMetadataPanel';
import AdminInboxSettings from './AdminInboxSettings';
import { cn } from '@/lib/utils';

interface AdminInboxProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'bubble' | 'compact' | 'sidebar' | 'fullscreen';
}

interface AdminInboxBubbleProps {
  onClick: () => void;
  unreadCount: number;
}

export const AdminInboxBubble: React.FC<AdminInboxBubbleProps> = ({ onClick, unreadCount }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="relative">
        <button
          onClick={onClick}
          className="bg-primary hover:bg-primary/90 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 relative overflow-hidden"
        >
          <MessageCircle className="w-6 h-6 relative z-10" />
          {unreadCount > 0 && (
            <>
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center z-20 animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const AdminInbox: React.FC<AdminInboxProps> = ({ 
  isOpen, 
  onClose, 
  mode = 'bubble' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThread, setSelectedThread] = useState<number | null>(1);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMode, setCurrentMode] = useState(mode);
  const [theme, setTheme] = useState('dark');
  const [isMinimized, setIsMinimized] = useState(false);

  // Sample data
  const conversations = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
      lastMessage: "I need help with my Pro subscription billing",
      timestamp: "2 min ago",
      unread: true,
      type: "pro" as const,
      country: "🇺🇸",
      status: "open" as const,
      priority: "high" as const
    },
    {
      id: 2,
      user: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      lastMessage: "System error when uploading files",
      timestamp: "15 min ago",
      unread: true,
      type: "system" as const,
      country: "🇬🇧",
      status: "flagged" as const,
      priority: "high" as const
    },
    {
      id: 3,
      user: "Ana Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      lastMessage: "Thank you for resolving my issue!",
      timestamp: "1 hour ago",
      unread: false,
      type: "support" as const,
      country: "🇪🇸",
      status: "resolved" as const,
      priority: "low" as const
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hi, I'm having trouble with my Pro subscription billing. The payment failed but I was still charged.",
      timestamp: "2:34 PM",
      isAdmin: false,
      type: "text" as const
    },
    {
      id: 2,
      sender: "Admin Support",
      content: "Hello Sarah! I can help you with that. Let me check your billing history right away.",
      timestamp: "2:35 PM",
      isAdmin: true,
      type: "text" as const
    }
  ];

  const handleSendMessage = (content: string) => {
    console.log('Sending message:', content);
  };

  const handleAction = (action: string) => {
    console.log('Performing action:', action);
  };

  const getThemeColors = (themeName: string) => {
    const themes = {
      dark: { bg: 'hsl(var(--background))', border: 'hsl(var(--border))', accent: 'hsl(var(--primary))' },
      midnight: { bg: '#0F172A', border: '#1E293B', accent: '#3B82F6' },
      forest: { bg: '#064E3B', border: '#065F46', accent: '#10B981' },
      burgundy: { bg: '#7C2D12', border: '#92400E', accent: '#F59E0B' }
    };
    return themes[themeName as keyof typeof themes] || themes.dark;
  };

  const handleExpand = () => {
    console.log('Current mode before expand:', currentMode);
    console.log('Window dimensions:', { width: window.innerWidth, height: window.innerHeight });
    
    if (currentMode === 'compact') {
      console.log('Changing to sidebar mode');
      setCurrentMode('sidebar');
    } else if (currentMode === 'sidebar') {
      console.log('Changing to fullscreen mode');
      setCurrentMode('fullscreen');
    } else {
      console.log('Changing to compact mode');
      setCurrentMode('compact');
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const currentUser = conversations.find(c => c.id === selectedThread);
  const threadDetails = {
    type: currentUser?.type || 'support',
    status: currentUser?.status || 'open',
    priority: currentUser?.priority || 'medium'
  };

  const unreadCount = conversations.filter(c => c.unread).length;

  // Render bubble if mode is bubble and not open
  if (currentMode === 'bubble' && !isOpen) {
    return <AdminInboxBubble onClick={() => {
      setCurrentMode('compact');
      // Trigger the opening via parent component
    }} unreadCount={unreadCount} />;
  }

  // Don't render if not open
  if (!isOpen) return null;

  // Get container classes based on mode with proper viewport constraints
  const getContainerClasses = () => {
    console.log('Getting container classes for mode:', currentMode);
    
    // Use much higher z-index to ensure it's above everything
    const baseClasses = "fixed bg-background border shadow-2xl overflow-hidden transition-all duration-300 ease-in-out";
    
    switch (currentMode) {
      case 'compact':
        const compactClasses = cn(
          baseClasses,
          "rounded-xl border-border z-[99999]",
          // Start from a safe position that's always visible
          "top-16 right-4",
          "w-[420px] h-[600px]",
          // Ensure it stays within bounds
          "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5rem)]",
          isMinimized ? "!h-12" : ""
        );
        console.log('Compact classes:', compactClasses);
        return compactClasses;
        
      case 'sidebar':
        const sidebarClasses = cn(
          baseClasses,
          "border-l border-border z-[99999]",
          // Ensure it starts below any header
          "top-0 right-0 h-screen",
          "w-[600px]"
        );
        console.log('Sidebar classes:', sidebarClasses);
        return sidebarClasses;
        
      case 'fullscreen':
        // Large sidebar that fits all content without scrolling
        const fullscreenClasses = cn(
          "fixed top-0 right-0 h-screen w-[1200px] max-w-[75vw] bg-[#181C20] z-[50] border-l border-[#272C30] shadow-2xl overflow-hidden"
        );
        console.log('Fullscreen classes:', fullscreenClasses);
        return fullscreenClasses;
        
      default:
        return cn(
          baseClasses, 
          "top-16 right-4 rounded-xl border-border z-[99999]",
          "w-[420px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5rem)]"
        );
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-primary" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
          )}
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">Admin Inbox</h2>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">{unreadCount} unread messages</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {currentMode !== 'fullscreen' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isMinimized) return null;

    if (currentMode === 'fullscreen') {
      return (
        <>
          {/* Header for fullscreen */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card h-16 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MessageCircle className="w-5 h-5 text-primary" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Admin Inbox</h2>
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">{unreadCount} unread messages</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpand}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content for fullscreen */}
          <div className="flex flex-1 h-[calc(100vh-4rem)] min-h-0 overflow-hidden">
            <div className="w-80 flex-shrink-0 bg-[#181C20]">
              <ConversationsList
                conversations={conversations}
                selectedThread={selectedThread}
                onSelectThread={setSelectedThread}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                mode="fullscreen"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <ThreadView
                selectedThread={selectedThread}
                messages={messages}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onFlagThread={() => handleAction('flag')}
                onArchiveThread={() => handleAction('archive')}
              />
            </div>
            
            {selectedThread && (
              <div className="w-80 flex-shrink-0 border-l border-[#272C30] bg-[#181C20]">
                <UserMetadataPanel
                  user={currentUser}
                  threadDetails={threadDetails}
                  onAction={handleAction}
                />
              </div>
            )}
          </div>
        </>
      );
    }

    if (currentMode === 'sidebar') {
      return (
        <div className="flex flex-1 h-full">
          <div className="w-64 border-border">\
            <ConversationsList
              conversations={conversations}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              mode="compact"
            />
          </div>
          
          <div className="flex-1">
            <ThreadView
              selectedThread={selectedThread}
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onFlagThread={() => handleAction('flag')}
              onArchiveThread={() => handleAction('archive')}
            />
          </div>
        </div>
      );
    }

    // Compact mode
    return (
      <div className="flex flex-col flex-1 h-full">
        {!selectedThread ? (
          <ConversationsList
            conversations={conversations}
            selectedThread={selectedThread}
            onSelectThread={setSelectedThread}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            mode="compact"
          />
        ) : (
          <ThreadView
            selectedThread={selectedThread}
            messages={messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            onFlagThread={() => handleAction('flag')}
            onArchiveThread={() => handleAction('archive')}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className={getContainerClasses()}>
        {currentMode === 'fullscreen' ? (
          <div className="flex flex-col h-full w-full">
            {renderContent()}
          </div>
        ) : (
          <div className="flex flex-col h-full w-full">
            {renderHeader()}
            <div className="flex-1 min-h-0">
              {renderContent()}
            </div>
          </div>
        )}
      </div>

      {/* Settings panel rendered outside main container to avoid stacking context issues */}
      <AdminInboxSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </>
  );
};

export default AdminInbox;