import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Conversation {
  id: number;
  user: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  type: "pro" | "system" | "support" | "abuse";
  country: string;
  status: "open" | "flagged" | "resolved" | "archived";
  priority: "high" | "medium" | "low";
}

interface ConversationsListProps {
  conversations: Conversation[];
  selectedThread: number | null;
  onSelectThread: (id: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  mode: 'compact' | 'fullscreen';
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  selectedThread,
  onSelectThread,
  searchTerm,
  onSearchChange,
  mode
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: 'All', count: conversations.length },
    { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unread).length },
    { id: 'flagged', label: 'Flagged', count: conversations.filter(c => c.status === 'flagged').length },
    { id: 'pro', label: 'Pro', count: conversations.filter(c => c.type === 'pro').length },
    { id: 'system', label: 'System', count: conversations.filter(c => c.type === 'system').length },
  ];

  const getStatusBadge = (type: string, status: string, priority: string) => {
    if (type === "pro") return <Badge className="bg-gradient-to-r from-[#517DF3] to-[#B077FF] text-white text-xs">💎 Pro</Badge>;
    if (status === "flagged") return <Badge variant="destructive" className="text-xs">⚠️ Flagged</Badge>;
    if (type === "system") return <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">🛠️ System</Badge>;
    if (priority === "high") return <Badge variant="destructive" className="text-xs">🔴 High</Badge>;
    return null;
  };

  const getConversationGlow = (type: string, unread: boolean) => {
    if (!unread) return '';
    if (type === 'pro') return 'shadow-[0_0_20px_rgba(81,125,243,0.3)] border-l-2 border-l-[#517DF3]';
    if (type === 'system') return 'shadow-[0_0_20px_rgba(255,165,0,0.3)] border-l-2 border-l-orange-500';
    return 'shadow-[0_0_20px_rgba(81,125,243,0.2)] border-l-2 border-l-[#517DF3]';
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'unread') return matchesSearch && conversation.unread;
    if (activeFilter === 'flagged') return matchesSearch && conversation.status === 'flagged';
    if (activeFilter === 'pro') return matchesSearch && conversation.type === 'pro';
    if (activeFilter === 'system') return matchesSearch && conversation.type === 'system';
    
    return matchesSearch;
  });

  const width = mode === 'compact' ? 'w-full' : 'w-[290px]';

  return (
    <div className={`${width} border-[#272C30] flex flex-col bg-[#181C20] h-full`}>
      {/* Search Bar for fullscreen mode */}
      {mode === 'fullscreen' && (
        <div className="p-3 border-b border-[#272C30]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-[#272C30] border-none text-[#F4F5F6] placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="p-3 border-b border-[#272C30]">
        <div className="flex flex-wrap gap-2">
          {filters.map(filter => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveFilter(filter.id)}
              className={`text-xs h-7 ${
                activeFilter === filter.id 
                  ? 'bg-gradient-to-r from-[#517DF3] to-[#B077FF] text-white' 
                  : 'text-[#F4F5F6] hover:bg-white/5'
              }`}
            >
              {filter.label}
              {filter.count > 0 && (
                <Badge className="ml-1 h-4 text-xs bg-white/20">
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto border-[#272C30]">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => onSelectThread(conversation.id)}
            className={`p-4 border-b border-[#272C30] cursor-pointer transition-all hover:bg-white/5 ${
              selectedThread === conversation.id 
                ? 'bg-gradient-to-r from-[#517DF3]/10 to-[#B077FF]/10 border-l-2 border-l-[#517DF3]' 
                : getConversationGlow(conversation.type, conversation.unread)
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.user} />
                  <AvatarFallback className="text-xs bg-[#272C30] text-[#F4F5F6]">
                    {conversation.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {conversation.unread && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#517DF3] rounded-full animate-pulse" />
                )}
                {conversation.type === 'pro' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#517DF3] to-[#B077FF] rounded-full flex items-center justify-center">
                    <span className="text-[8px] text-white">💎</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-[#F4F5F6] truncate">
                    {conversation.user}
                  </span>
                  <span className="text-xs">{conversation.country}</span>
                  {getStatusBadge(conversation.type, conversation.status, conversation.priority)}
                </div>
                <p className="text-xs text-gray-400 truncate">
                  {conversation.lastMessage}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {conversation.timestamp}
                  </p>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-[#517DF3] rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredConversations.length === 0 && (
          <div className="flex items-center justify-center p-8 text-center">
            <div>
              <div className="w-12 h-12 bg-[#272C30] rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">No conversations found</p>
              <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;