import React from 'react';
import { useChatSettings } from '@/contexts/ChatSettingsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Clock,
  User,
  Users,
  MessageSquare
} from 'lucide-react';

const ChatNotificationSettings: React.FC = () => {
  const {
    desktopNotifications,
    mobileNotifications,
    soundEnabled,
    soundVolume,
    notificationSound,
    showPreviews,
    quietHours,
    quietStart,
    quietEnd,
    directMessages,
    groupMessages,
    mentionsOnly,
    updateSetting
  } = useChatSettings();

  const soundOptions = [
    { value: 'default', name: 'Default Chime' },
    { value: 'subtle', name: 'Subtle Pop' },
    { value: 'modern', name: 'Modern Ding' },
    { value: 'classic', name: 'Classic Beep' },
    { value: 'gentle', name: 'Gentle Bell' },
    { value: 'none', name: 'No Sound' }
  ];

  const testNotification = () => {
    if ('Notification' in window) {
      new Notification('Test Notification', {
        body: 'This is how your notifications will appear!',
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ scrollBehavior: 'smooth' }}>
      {/* General Notifications */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">General Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Desktop Notifications</p>
                <p className="text-xs text-muted-foreground">Show notifications on your desktop</p>
              </div>
            </div>
            <Switch checked={desktopNotifications} onCheckedChange={(value) => updateSetting('desktopNotifications', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Mobile Notifications</p>
                <p className="text-xs text-muted-foreground">Push notifications on mobile devices</p>
              </div>
            </div>
            <Switch checked={mobileNotifications} onCheckedChange={(value) => updateSetting('mobileNotifications', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show Message Preview</p>
              <p className="text-xs text-muted-foreground">Display message content in notifications</p>
            </div>
            <Switch checked={showPreviews} onCheckedChange={(value) => updateSetting('showPreviews', value)} />
          </div>
          
          {desktopNotifications && (
            <>
              <Separator className="bg-primary/10" />
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testNotification}
                  className="w-full"
                >
                  Test Desktop Notification
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Sound Settings */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Volume2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Sound Settings</h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Enable Sounds</p>
              <p className="text-xs text-muted-foreground">Play notification sounds</p>
            </div>
            <Switch checked={soundEnabled} onCheckedChange={(value) => updateSetting('soundEnabled', value)} />
          </div>
          
          {soundEnabled && (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Notification Sound</p>
                </div>
                <Select value={notificationSound} onValueChange={(value) => updateSetting('notificationSound', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soundOptions.map((sound) => (
                      <SelectItem key={sound.value} value={sound.value}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">Volume</p>
                  <Badge variant="outline" className="text-xs">{soundVolume}%</Badge>
                </div>
                <Slider
                  value={[soundVolume]}
                  onValueChange={(value) => updateSetting('soundVolume', value[0])}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Message Type Notifications */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Message Types</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Direct Messages</p>
                <p className="text-xs text-muted-foreground">Notifications for one-on-one conversations</p>
              </div>
            </div>
            <Switch checked={directMessages} onCheckedChange={(value) => updateSetting('directMessages', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Group Messages</p>
                <p className="text-xs text-muted-foreground">Notifications for group conversations</p>
              </div>
            </div>
            <Switch checked={groupMessages} onCheckedChange={(value) => updateSetting('groupMessages', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Mentions Only</p>
              <p className="text-xs text-muted-foreground">Only notify when you're mentioned in groups</p>
            </div>
            <Switch checked={mentionsOnly} onCheckedChange={(value) => updateSetting('mentionsOnly', value)} />
          </div>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quiet Hours</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Enable Quiet Hours</p>
              <p className="text-xs text-muted-foreground">Disable notifications during specified hours</p>
            </div>
            <Switch checked={quietHours} onCheckedChange={(value) => updateSetting('quietHours', value)} />
          </div>
          
          {quietHours && (
            <>
              <Separator className="bg-primary/10" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-sm mb-2">Start Time</p>
                  <Select value={quietStart} onValueChange={(value) => updateSetting('quietStart', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="font-medium text-sm mb-2">End Time</p>
                  <Select value={quietEnd} onValueChange={(value) => updateSetting('quietEnd', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0');
                        return (
                          <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Notification Preview */}
      <Card className="p-6 border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Notification Preview</h3>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-background rounded-lg border border-primary/20 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">John Doe</p>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {showPreviews ? "Hey, are we still meeting today?" : "New message"}
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            This is how notifications will appear with current settings
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatNotificationSettings;