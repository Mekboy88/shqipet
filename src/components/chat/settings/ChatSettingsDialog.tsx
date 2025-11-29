import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Palette,
  Bell,
  Shield,
  Volume2,
  Download,
  Trash2,
  Eye,
  Lock,
  Globe,
  MessageSquare,
  X
} from 'lucide-react';

import ChatThemeSettings from './ChatThemeSettings';
import ChatAppearanceSettings from './ChatAppearanceSettings';
import ChatNotificationSettings from './ChatNotificationSettings';
import ChatPrivacySettings from './ChatPrivacySettings';
import ChatBehaviorSettings from './ChatBehaviorSettings';

interface ChatSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SettingsSection {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
  badge?: string;
}

const settingsSections: SettingsSection[] = [
  {
    id: 'theme',
    name: 'Theme & Colors',
    description: 'Customize your chat appearance and theme preferences',
    icon: Palette,
    component: ChatThemeSettings,
    badge: 'Popular'
  },
  {
    id: 'appearance',
    name: 'Chat Appearance',
    description: 'Message bubbles, fonts, spacing, and visual layout',
    icon: Eye,
    component: ChatAppearanceSettings
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Sound alerts, desktop notifications, and message previews',
    icon: Bell,
    component: ChatNotificationSettings
  },
  {
    id: 'behavior',
    name: 'Chat Behavior',
    description: 'Auto-scroll, typing indicators, read receipts',
    icon: MessageSquare,
    component: ChatBehaviorSettings
  },
  {
    id: 'privacy',
    name: 'Privacy & Security',
    description: 'Message encryption, data retention, and privacy controls',
    icon: Shield,
    component: ChatPrivacySettings,
    badge: 'New'
  }
];

const ChatSettingsDialog: React.FC<ChatSettingsDialogProps> = ({
  isOpen,
  onOpenChange
}) => {
  const [activeSection, setActiveSection] = useState('theme');

  const currentSection = settingsSections.find(s => s.id === activeSection);
  const Component = currentSection?.component;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] h-fit p-0 bg-background/95 backdrop-blur-xl border border-primary/20 m-4">
        <div className="flex h-full max-h-[85vh]">
          {/* Sidebar */}
          <div className="w-80 border-primary/10 bg-background/50">
            <DialogHeader className="p-6 border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Chat Settings
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Customize your chat experience
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <ScrollArea className="h-[calc(100%-120px)]">
              <div className="p-4 space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant="ghost"
                      className={`w-full h-auto p-4 justify-start text-left ${
                        activeSection === section.id
                          ? 'bg-black/5 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]'
                          : 'hover:bg-black/80 hover:text-white'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Icon className={`h-5 w-5 mt-0.5 ${
                          activeSection === section.id ? 'text-black' : 'text-muted-foreground'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm truncate ${
                              activeSection === section.id ? 'text-black' : ''
                            }`}>
                              {section.name}
                            </span>
                            {section.badge && (
                              <Badge 
                                variant="secondary" 
                                className="h-4 px-1.5 text-xs bg-gradient-to-r from-primary/20 to-secondary/20"
                              >
                                {section.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2 break-words">
                            {section.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t border-primary/10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Settings className="h-3 w-3" />
                <span>Settings are saved automatically</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-primary/10">
              <h2 className="text-lg font-semibold text-foreground">
                {currentSection?.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {currentSection?.description}
              </p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ scrollBehavior: 'smooth' }}>
                {Component && <Component />}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatSettingsDialog;