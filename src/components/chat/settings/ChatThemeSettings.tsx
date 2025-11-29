import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useChatTheme } from '@/contexts/ChatThemeContext';
import { useChatSettings } from '@/contexts/ChatSettingsContext';
import CustomThemeCreator from './CustomThemeCreator';
import WallpaperSettings from './WallpaperSettings';
import {
  Palette,
  Sun,
  Sparkles,
  Check,
  Coffee,
  Snowflake,
  Flame,
  Droplets,
  Star,
  AlertTriangle
} from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  emoji: string;
  colors: string[];
  gradientClass: string;
  textColor: string;
  isWarning?: boolean;
}

const themeOptions: ThemeOption[] = [
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    emoji: '🪸',
    colors: ['#fef7f4', '#fed7d2', '#fb9883', '#7c2d12'],
    gradientClass: 'bg-gradient-to-br from-orange-50 to-red-200',
    textColor: 'text-orange-900'
  },
  {
    id: 'sage-green',
    name: 'Sage Green',
    emoji: '🌿',
    colors: ['#f7fdf7', '#d1fae5', '#86efac', '#166534'],
    gradientClass: 'bg-gradient-to-br from-green-50 to-green-200',
    textColor: 'text-green-900'
  },
  {
    id: 'amethyst',
    name: 'Amethyst',
    emoji: '💎',
    colors: ['#faf5ff', '#e9d5ff', '#c084fc', '#581c87'],
    gradientClass: 'bg-gradient-to-br from-purple-50 to-purple-200',
    textColor: 'text-purple-900'
  },
  {
    id: 'peach-cream',
    name: 'Peach Cream',
    emoji: '🍑',
    colors: ['#fffbeb', '#fed7aa', '#fb923c', '#9a3412'],
    gradientClass: 'bg-gradient-to-br from-amber-50 to-orange-200',
    textColor: 'text-orange-900'
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    emoji: '🌸',
    colors: ['#fdf2f8', '#fce7f3', '#f472b6', '#be185d'],
    gradientClass: 'bg-gradient-to-br from-pink-50 to-pink-200',
    textColor: 'text-pink-900'
  },
  {
    id: 'seafoam',
    name: 'Seafoam',
    emoji: '🌊',
    colors: ['#f0fdfa', '#a7f3d0', '#34d399', '#065f46'],
    gradientClass: 'bg-gradient-to-br from-emerald-50 to-emerald-200',
    textColor: 'text-emerald-900'
  },
  {
    id: 'honey-amber',
    name: 'Honey Amber',
    emoji: '🍯',
    colors: ['#fffef7', '#fde68a', '#f59e0b', '#92400e'],
    gradientClass: 'bg-gradient-to-br from-yellow-50 to-yellow-200',
    textColor: 'text-yellow-900'
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    emoji: '⚡',
    colors: ['#f8fafc', '#cbd5e1', '#64748b', '#1e293b'],
    gradientClass: 'bg-gradient-to-br from-slate-50 to-slate-300',
    textColor: 'text-slate-800'
  },
  {
    id: 'snow-white',
    name: 'Snow White',
    emoji: '❄️',
    colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#1f2937'],
    gradientClass: 'bg-gradient-to-br from-white to-slate-100',
    textColor: 'text-gray-800'
  },
  {
    id: 'warning-red',
    name: 'Warning Red',
    emoji: '🚨',
    colors: ['#ffffff', '#fecaca', '#ef4444', '#1f2937'],
    gradientClass: 'bg-gradient-to-br from-white to-red-50',
    textColor: 'text-red-800',
    isWarning: true
  },
  {
    id: 'twilight-indigo',
    name: 'Twilight Indigo',
    emoji: '🌙',
    colors: ['#f8faff', '#ddd6fe', '#8b5cf6', '#3730a3'],
    gradientClass: 'bg-gradient-to-br from-indigo-50 to-indigo-200',
    textColor: 'text-indigo-900'
  },
  {
    id: 'notification-clean',
    name: 'Light Black',
    emoji: '🖤',
    colors: ['#ffffff', '#f8fafc', '#e5e7eb', '#1f2937'],
    gradientClass: 'bg-gradient-to-br from-white to-gray-100',
    textColor: 'text-gray-900'
  },
  {
    id: 'crimson-feed',
    name: 'Crimson Feed',
    emoji: '📰',
    colors: ['#ffffff', '#fecaca', '#ef4444', '#1f2937'],
    gradientClass: 'bg-gradient-to-r from-red-500/10 to-gray-800/10',
    textColor: 'text-gray-800'
  }
];

const ChatThemeSettings: React.FC = () => {
  const { chatTheme, setChatTheme } = useChatTheme();
  const {
    autoTheme,
    highContrast,
    animatedBubbles,
    gradientMessages,
    updateSetting
  } = useChatSettings();

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2">
      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">Preset Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Creator</TabsTrigger>
          <TabsTrigger value="wallpaper">Wallpapers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="presets" className="space-y-6 mt-6">
          {/* Theme Selection */}
          <Card className="p-6 border-primary/10">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Choose Theme</h3>
              <Badge variant="secondary" className="text-xs">13 Themes</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {themeOptions.map((option) => {
                const isActive = chatTheme === option.id;
                
                return (
                  <Card
                    key={option.id}
                    className={`p-5 cursor-pointer transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg rounded-xl ${option.gradientClass} ${option.textColor} ${
                      isActive 
                        ? 'transform -translate-y-1 shadow-xl ring-3 ring-blue-400' 
                        : 'shadow-md'
                    } ${option.isWarning ? 'border-2 border-red-300' : ''}`}
                    onClick={() => setChatTheme(option.id as any)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{option.emoji}</span>
                        <span className="font-semibold text-lg capitalize">{option.name}</span>
                        {isActive && (
                          <span className="text-green-600 font-bold">✅ Selected!</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {option.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-lg border-2 border-white/80 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {/* Chat Preview */}
                    <div className="bg-white/80 rounded-lg p-3 mt-2 border border-black/10">
                      <div className="space-y-2">
                        <div className="bg-white/90 p-2 rounded-md mr-5 text-sm border border-black/10">
                          Welcome! I'm your AI assistant.
                        </div>
                        <div className="bg-black/5 p-2 rounded-md ml-5 text-sm">
                          How does this theme look?
                        </div>
                        <div className="bg-white/90 p-2 rounded-md mr-5 text-sm border border-black/10">
                          Beautiful {option.name.toLowerCase()} colors! {option.emoji}
                        </div>
                        <div className="mt-2 p-2 rounded-md border border-black/20 text-sm bg-white/90 text-gray-600">
                          Type your message here...
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>

          {/* Advanced Theme Options */}
          <Card className="p-6 border-primary/10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Advanced Options</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Auto Theme</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically switch based on system preference
                  </p>
                </div>
                <Switch
                  checked={autoTheme}
                  onCheckedChange={(value) => updateSetting('autoTheme', value)}
                />
              </div>
              
              <Separator className="bg-primary/10" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">High Contrast</p>
                  <p className="text-xs text-muted-foreground">
                    Better accessibility and readability
                  </p>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={(value) => updateSetting('highContrast', value)}
                />
              </div>
              
              <Separator className="bg-primary/10" />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Animated Bubbles</p>
                  <p className="text-xs text-muted-foreground">
                    Smooth message animations
                  </p>
                </div>
                <Switch
                  checked={animatedBubbles}
                  onCheckedChange={(value) => updateSetting('animatedBubbles', value)}
                />
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="p-6 border-primary/10">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Preview</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="px-4 py-2 rounded-2xl max-w-xs bg-primary text-primary-foreground">
                  <p className="text-sm">Your messages look like this!</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl max-w-xs bg-muted text-muted-foreground">
                  <p className="text-sm">Received messages appear like this.</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <CustomThemeCreator />
        </TabsContent>
        
        <TabsContent value="wallpaper" className="mt-6">
          <WallpaperSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatThemeSettings;