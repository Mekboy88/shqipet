import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, ChevronDown, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  connected: boolean;
}

interface CrossPlatformSharingProps {
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
}

const CrossPlatformSharing: React.FC<CrossPlatformSharingProps> = ({ selectedPlatforms, onPlatformsChange }) => {
  const platforms: Platform[] = [
    { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: 'text-blue-500', connected: true },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', connected: true },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', connected: true },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', connected: false }
  ];

  const togglePlatform = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform?.connected) return;

    const newPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    onPlatformsChange(newPlatforms);
  };

  const connectedPlatforms = platforms.filter(p => p.connected);
  const selectedCount = selectedPlatforms.filter(id => 
    platforms.find(p => p.id === id)?.connected
  ).length;

  return (
    <div className="space-y-2">
      {selectedPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedPlatforms.map(platformId => {
            const platform = platforms.find(p => p.id === platformId);
            if (!platform?.connected) return null;
            
            const Icon = platform.icon;
            return (
              <span
                key={platformId}
                className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-1 rounded-full text-xs"
              >
                <Icon className={`w-3 h-3 ${platform.color}`} />
                {platform.name}
                <button 
                  onClick={() => togglePlatform(platformId)}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      {selectedPlatforms.filter(id => platforms.find(p => p.id === id)?.connected).length === 0 && (
        <div className="text-sm text-muted-foreground">
          No platforms selected for cross-posting
        </div>
      )}

      {connectedPlatforms.length === 0 && (
        <div className="text-xs text-muted-foreground">
          Connect your social accounts in settings to cross-post
        </div>
      )}
    </div>
  );
};

export default CrossPlatformSharing;