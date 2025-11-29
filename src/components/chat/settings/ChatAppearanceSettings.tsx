import React from 'react';
import { useChatSettings } from '@/contexts/ChatSettingsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Type,
  Layout,
  Maximize,
  Minimize,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Smile,
  MessageCircle
} from 'lucide-react';

const ChatAppearanceSettings: React.FC = () => {
  const {
    fontSize,
    messageSpacing,
    bubbleRadius,
    chatWidth,
    fontFamily,
    messageAlignment,
    showAvatars,
    showTimestamps,
    compactMode,
    emojiSize,
    showMessageStatus,
    updateSetting
  } = useChatSettings();

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ scrollBehavior: 'smooth' }}>
      {/* Typography */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Type className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Typography</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Font Family</p>
            </div>
            <Select value={fontFamily} onValueChange={(value) => updateSetting('fontFamily', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System Default</SelectItem>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="helvetica">Helvetica</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                <SelectItem value="times">Times New Roman</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Font Size</p>
              <Badge variant="outline" className="text-xs">{fontSize}px</Badge>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={(value) => updateSetting('fontSize', value[0])}
              max={20}
              min={10}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Emoji Size</p>
              <Badge variant="outline" className="text-xs">{emojiSize}px</Badge>
            </div>
            <Slider
              value={[emojiSize]}
              onValueChange={(value) => updateSetting('emojiSize', value[0])}
              max={32}
              min={16}
              step={2}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Message Layout */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Message Layout</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Message Alignment</p>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'left', icon: AlignLeft, label: 'Left' },
                { value: 'center', icon: AlignCenter, label: 'Center' },
                { value: 'right', icon: AlignRight, label: 'Right' }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={messageAlignment === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('messageAlignment', option.value)}
                    className="flex-1"
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Message Spacing</p>
              <Badge variant="outline" className="text-xs">{messageSpacing}px</Badge>
            </div>
            <Slider
              value={[messageSpacing]}
              onValueChange={(value) => updateSetting('messageSpacing', value[0])}
              max={24}
              min={4}
              step={2}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Bubble Roundness</p>
              <Badge variant="outline" className="text-xs">{bubbleRadius}px</Badge>
            </div>
            <Slider
              value={[bubbleRadius]}
              onValueChange={(value) => updateSetting('bubbleRadius', value[0])}
              max={24}
              min={4}
              step={2}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Chat Window Width</p>
              <Badge variant="outline" className="text-xs">{chatWidth}px</Badge>
            </div>
            <Slider
              value={[chatWidth]}
              onValueChange={(value) => updateSetting('chatWidth', value[0])}
              max={1200}
              min={400}
              step={50}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Display Options */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Image className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Display Options</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show Avatars</p>
              <p className="text-xs text-muted-foreground">Display profile pictures next to messages</p>
            </div>
            <Switch checked={showAvatars} onCheckedChange={(value) => updateSetting('showAvatars', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Show Timestamps</p>
              <p className="text-xs text-muted-foreground">Display message timestamps</p>
            </div>
            <Switch checked={showTimestamps} onCheckedChange={(value) => updateSetting('showTimestamps', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Compact Mode</p>
              <p className="text-xs text-muted-foreground">Reduce spacing for more messages on screen</p>
            </div>
            <Switch checked={compactMode} onCheckedChange={(value) => updateSetting('compactMode', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Message Status Indicators</p>
              <p className="text-xs text-muted-foreground">Show sent, delivered, and read indicators</p>
            </div>
            <Switch checked={showMessageStatus} onCheckedChange={(value) => updateSetting('showMessageStatus', value)} />
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Live Preview</h3>
        </div>
        
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg" style={{ maxWidth: `${chatWidth}px` }}>
          {/* Sample messages with current settings */}
          <div className={`flex ${messageAlignment === 'right' ? 'justify-end' : messageAlignment === 'center' ? 'justify-center' : 'justify-start'}`}>
            <div className="flex items-start gap-2 max-w-xs">
              {showAvatars && messageAlignment !== 'right' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0"></div>
              )}
              <div>
                <div 
                  className="px-3 py-2 bg-primary text-primary-foreground"
                  style={{ 
                    borderRadius: `${bubbleRadius}px`,
                    fontSize: `${fontSize}px`,
                    marginBottom: compactMode ? '4px' : `${messageSpacing}px`,
                    fontFamily: fontFamily === 'system' ? 'system-ui' : fontFamily
                  }}
                >
                  Hello! How are you doing? 😊
                </div>
                {showTimestamps && (
                  <p className="text-xs text-muted-foreground mt-1">2:34 PM</p>
                )}
              </div>
              {showAvatars && messageAlignment === 'right' && (
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex-shrink-0"></div>
              )}
            </div>
          </div>
          
          <div className={`flex ${messageAlignment === 'right' ? 'justify-start' : messageAlignment === 'center' ? 'justify-center' : 'justify-end'}`}>
            <div className="flex items-start gap-2 max-w-xs">
              {showAvatars && messageAlignment !== 'left' && (
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex-shrink-0"></div>
              )}
              <div>
                <div 
                  className="px-3 py-2 bg-muted text-muted-foreground"
                  style={{ 
                    borderRadius: `${bubbleRadius}px`,
                    fontSize: `${fontSize}px`,
                    marginBottom: compactMode ? '4px' : `${messageSpacing}px`,
                    fontFamily: fontFamily === 'system' ? 'system-ui' : fontFamily
                  }}
                >
                  I'm doing great, thanks for asking!
                </div>
                {showTimestamps && (
                  <p className="text-xs text-muted-foreground mt-1">2:35 PM</p>
                )}
              </div>
              {showAvatars && messageAlignment === 'left' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0"></div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatAppearanceSettings;