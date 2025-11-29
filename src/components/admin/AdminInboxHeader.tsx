import React from 'react';
import { X, Search, Settings, RefreshCw, Maximize2, Filter, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface AdminInboxHeaderProps {
  mode: 'compact' | 'fullscreen';
  onClose: () => void;
  onExpand: () => void;
  unreadCount: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSettingsClick: () => void;
}

const AdminInboxHeader: React.FC<AdminInboxHeaderProps> = ({
  mode,
  onClose,
  onExpand,
  unreadCount,
  searchTerm,
  onSearchChange,
  onSettingsClick
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#272C30] bg-gradient-to-r from-[#181C20] to-[#1A1E22]">
      <div className="flex items-center gap-3">
        {mode === 'compact' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <h2 className="text-lg font-semibold text-[#F4F5F6]">Admin Inbox</h2>
        
        {unreadCount > 0 && (
          <Badge className="bg-gradient-to-r from-[#517DF3] to-[#B077FF] text-white text-xs animate-pulse">
            {unreadCount} unread
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        {mode === 'compact' && (
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-48 bg-[#272C30] border-none text-[#F4F5F6] placeholder:text-gray-400 h-8"
            />
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5"
        >
          <Filter className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5"
        >
          <MessageSquarePlus className="h-4 w-4" />
        </Button>

        {mode === 'compact' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onExpand}
            className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onSettingsClick}
          className="h-8 w-8 text-[#F4F5F6] hover:bg-white/5"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdminInboxHeader;