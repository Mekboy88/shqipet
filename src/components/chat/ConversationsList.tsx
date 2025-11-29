import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Avatar from '@/components/Avatar';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Search, 
  MessageCircle, 
  Pin, 
  MoreVertical,
  Archive,
  Trash2,
  Bell,
  BellOff,
  Settings,
  Phone,
  User,
  Radio
} from 'lucide-react';
import ChatSettingsDialog from './settings/ChatSettingsDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

interface ConversationsListProps {
  conversations: Conversation[];
  archivedConversations?: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onStartNewChat: () => void;
  onPinConversation?: (conversationId: string) => void;
  onMuteConversation?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  archivedConversations = [],
  onSelectConversation,
  onStartNewChat,
  onPinConversation,
  onMuteConversation,
  onArchiveConversation,
  onDeleteConversation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'pinned' | 'archived'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Get user initials
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter conversations
  const allConversations = activeFilter === 'archived' ? archivedConversations : conversations;
  const filteredConversations = allConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'unread') {
      matchesFilter = conv.unreadCount > 0;
    } else if (activeFilter === 'pinned') {
      matchesFilter = conv.isPinned;
    } else if (activeFilter === 'archived') {
      matchesFilter = true; // All archived conversations
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort conversations (pinned first, then by timestamp)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  // Handle delete confirmation
  const handleDeleteClick = (conversation: Conversation) => {
    setConversationToDelete(conversation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (conversationToDelete) {
      onDeleteConversation?.(conversationToDelete.id);
      toast.success(`Conversation with ${conversationToDelete.name} deleted`);
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
    }
  };

  const handleArchive = (conversationId: string, conversationName: string) => {
    onArchiveConversation?.(conversationId);
    toast.success(`Conversation with ${conversationName} archived`);
  };

  const handlePin = (conversationId: string, conversationName: string, isPinned: boolean) => {
    onPinConversation?.(conversationId);
    toast.success(`Conversation with ${conversationName} ${isPinned ? 'unpinned' : 'pinned'}`);
  };

  const handleMute = (conversationId: string, conversationName: string, isMuted: boolean) => {
    onMuteConversation?.(conversationId);
    toast.success(`Notifications ${isMuted ? 'enabled' : 'muted'} for ${conversationName}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Messages
          </h2>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSettingsOpen(true);
            }}
            type="button"
            size="sm"
            variant="outline"
            className="border-border hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 border-border/30 bg-background focus:ring-2 focus:ring-border/50 focus:border-border"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-3">
          {(['all', 'unread', 'pinned', 'archived'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className={`text-xs ${
                activeFilter === filter 
                  ? 'bg-primary text-primary-foreground' 
                  : 'border-border/40 hover:bg-muted/50 text-foreground'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter === 'unread' && conversations.filter(c => c.unreadCount > 0).length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {conversations.filter(c => c.unreadCount > 0).length}
                </Badge>
              )}
              {filter === 'pinned' && conversations.filter(c => c.isPinned).length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {conversations.filter(c => c.isPinned).length}
                </Badge>
              )}
              {filter === 'archived' && archivedConversations.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                  {archivedConversations.length}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sortedConversations.length > 0 ? (
            <div className="space-y-1">
              {sortedConversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="p-3 cursor-pointer hover:bg-primary/5 transition-all duration-200 border-primary/10 hover:border-primary/20 hover:shadow-md"
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar 
                        size="lg"
                        src={conversation.avatar}
                        initials={getInitials(conversation.name)}
                        className="ring-2 ring-primary/20 img-locked"
                      />
                      {conversation.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">
                            {conversation.name}
                          </h3>
                          {conversation.isPinned && (
                            <Pin className="h-3 w-3 text-foreground" />
                          )}
                          {conversation.isMuted && (
                            <BellOff className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(conversation.timestamp)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-primary/20"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePin(conversation.id, conversation.name, conversation.isPinned);
                                }}
                              >
                                <Pin className="h-4 w-4 mr-2 text-foreground" />
                                {conversation.isPinned ? 'Unpin' : 'Pin'} Chat
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMute(conversation.id, conversation.name, conversation.isMuted);
                                }}
                              >
                                {conversation.isMuted ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
                                {conversation.isMuted ? 'Unmute' : 'Mute'} Notifications
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchive(conversation.id, conversation.name);
                                }}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive Chat
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(conversation);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Chat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate flex-1">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge 
                            variant="default" 
                            className="ml-2 h-5 min-w-5 px-1.5 text-xs bg-gradient-to-r from-primary to-secondary"
                          >
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-muted-foreground mb-2">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="text-sm text-muted-foreground/70 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Start a new conversation to get chatting'
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={onStartNewChat}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Start New Chat
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Menu Bar */}
      <div className="border-t border-primary/20 bg-background">
        <div className="flex items-center justify-around p-3">
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-primary/10 transition-colors"
          >
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium text-foreground">Message</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-primary/10 transition-colors"
          >
            <Radio className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Status</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 hover:bg-primary/10 transition-colors"
          >
            <svg viewBox="0 0 60 60" className="!h-16 !w-16" xmlns="http://www.w3.org/2000/svg">
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
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-primary/10 transition-colors"
          >
            <Phone className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Call</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-4 hover:bg-primary/10 transition-colors"
          >
            <User className="h-5 w-5 text-foreground" />
            <span className="text-xs font-medium text-foreground">Profile</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border border-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your conversation with{' '}
              <span className="font-semibold text-primary">{conversationToDelete?.name}</span>?
              This action cannot be undone and all messages will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Chat Settings Dialog */}
      <ChatSettingsDialog 
        isOpen={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </div>
  );
};

export default ConversationsList;