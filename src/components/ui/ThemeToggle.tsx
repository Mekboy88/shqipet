import React from 'react';
import { Sun, Palette, Coffee, Snowflake, Flame, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';

const themeConfig = {
  'light-blue': {
    name: 'Ocean Blue',
    icon: Sun,
    preview: 'bg-blue-500',
    description: 'Clean blue theme'
  },
  'red': {
    name: 'Red Theme', 
    icon: Flame,
    preview: 'bg-red-500',
    description: 'Bold red theme'
  },
  'milky-honey': {
    name: 'Honey Glow',
    icon: Coffee,
    preview: 'bg-amber-500',
    description: 'Warm honey colors'
  },
  'minimal-white': {
    name: 'Pure White',
    icon: Palette,
    preview: 'bg-gray-700',
    description: 'Minimal white design'
  },
  'pure-white': {
    name: 'Snow White',
    icon: Circle,
    preview: 'bg-white border border-gray-300',
    description: 'Pure white with no colors'
  }
} as const;

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const currentTheme = themeConfig[theme] || themeConfig['light-blue']; // Fallback to default theme
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full transition-all duration-200 hover:scale-105 
                     hover:bg-white/80 hover:shadow-lg hover:shadow-black/10 
                     backdrop-blur-sm border border-white/20 
                     bg-white/50 shadow-sm contain-layout will-change-transform"
          title="Switch Theme"
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {Object.entries(themeConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = theme === key;
          
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key as ThemeMode)}
              className={`flex items-center gap-3 cursor-pointer transition-all duration-100 ${
                isActive ? 'bg-primary/10 text-primary' : ''
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${config.preview}`} />
              <Icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="font-medium">{config.name}</div>
                <div className="text-xs text-muted-foreground">{config.description}</div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};