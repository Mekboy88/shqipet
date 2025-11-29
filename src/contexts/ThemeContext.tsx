import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ThemeMode = 'light-blue' | 'red' | 'milky-honey' | 'minimal-white' | 'sky-light-blue' | 'pure-clean-white' | 'soft-pink' | 'warning-red-gradient' | 'pure-white' | 'coral-reef' | 'sage-green' | 'amethyst' | 'peach-cream' | 'rose-quartz' | 'seafoam' | 'honey-amber' | 'steel-blue' | 'snow-white' | 'warning-red' | 'twilight-indigo' | 'notification-clean' | 'crimson-feed' | 'custom';
export type DarkMode = 'light' | 'dark';

export interface CustomTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    border: string;
    ring: string;
  };
}

export interface WallpaperSettings {
  type: 'none' | 'image' | 'gradient';
  imageUrl?: string;
  gradientColors?: string[];
  gradientDirection?: string;
  opacity: number;
  position?: string;
  blur?: number;
}

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  darkMode: DarkMode;
  setDarkMode: (mode: DarkMode) => void;
  toggleDarkMode: () => void;
  customThemes: CustomTheme[];
  saveCustomTheme: (theme: CustomTheme) => void;
  deleteCustomTheme: (id: string) => void;
  wallpaper: WallpaperSettings;
  setWallpaper: (wallpaper: WallpaperSettings) => void;
  applyCustomTheme: (theme: CustomTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themes: Record<ThemeMode, string> = {
  'light-blue': 'theme-light-blue',
  'red': 'theme-red', 
  'milky-honey': 'theme-milky-honey',
  'minimal-white': 'theme-minimal-white',
  'sky-light-blue': 'theme-sky-light-blue',
  'pure-clean-white': 'theme-pure-clean-white',
  'soft-pink': 'theme-soft-pink',
  'warning-red-gradient': 'theme-warning-red-gradient',
  'pure-white': 'theme-pure-white',
  'coral-reef': 'theme-coral-reef',
  'sage-green': 'theme-sage-green',
  'amethyst': 'theme-amethyst',
  'peach-cream': 'theme-peach-cream',
  'rose-quartz': 'theme-rose-quartz',
  'seafoam': 'theme-seafoam',
  'honey-amber': 'theme-honey-amber',
  'steel-blue': 'theme-steel-blue',
  'snow-white': 'theme-snow-white',
  'warning-red': 'theme-warning-red',
  'twilight-indigo': 'theme-twilight-indigo',
  'notification-clean': 'theme-notification-clean',
  'crimson-feed': 'theme-crimson-feed',
  'custom': 'theme-custom'
};

const themeOrder: ThemeMode[] = ['light-blue', 'red', 'milky-honey', 'minimal-white', 'sky-light-blue', 'pure-clean-white', 'soft-pink', 'warning-red-gradient', 'pure-white'];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light-blue');
  const [darkMode, setDarkModeState] = useState<DarkMode>('light');
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [wallpaper, setWallpaperState] = useState<WallpaperSettings>({
    type: 'none',
    opacity: 100
  });

  // Load theme and custom data from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('shqipet-theme') as ThemeMode;
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }
    
    const savedDarkMode = localStorage.getItem('shqipet-dark-mode') as DarkMode;
    if (savedDarkMode) {
      setDarkModeState(savedDarkMode);
    }
    
    const savedCustomThemes = localStorage.getItem('shqipet-custom-themes');
    if (savedCustomThemes) {
      try {
        setCustomThemes(JSON.parse(savedCustomThemes));
      } catch (error) {
        console.error('Failed to load custom themes:', error);
      }
    }
    
    const savedWallpaper = localStorage.getItem('shqipet-wallpaper');
    if (savedWallpaper) {
      try {
        setWallpaperState(JSON.parse(savedWallpaper));
      } catch (error) {
        console.error('Failed to load wallpaper settings:', error);
      }
    }
  }, []);

  // Apply dark mode class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('shqipet-theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [theme, setTheme]);

  const setDarkMode = useCallback((mode: DarkMode) => {
    setDarkModeState(mode);
    localStorage.setItem('shqipet-dark-mode', mode);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(darkMode === 'light' ? 'dark' : 'light');
  }, [darkMode, setDarkMode]);

  const saveCustomTheme = useCallback((customTheme: CustomTheme) => {
    setCustomThemes(prev => {
      const newThemes = [...prev.filter(t => t.id !== customTheme.id), customTheme];
      localStorage.setItem('shqipet-custom-themes', JSON.stringify(newThemes));
      return newThemes;
    });
  }, []);

  const deleteCustomTheme = useCallback((id: string) => {
    setCustomThemes(prev => {
      const newThemes = prev.filter(t => t.id !== id);
      localStorage.setItem('shqipet-custom-themes', JSON.stringify(newThemes));
      return newThemes;
    });
  }, []);

  const setWallpaper = useCallback((newWallpaper: WallpaperSettings) => {
    setWallpaperState(newWallpaper);
    localStorage.setItem('shqipet-wallpaper', JSON.stringify(newWallpaper));
  }, []);

  const applyCustomTheme = useCallback((customTheme: CustomTheme) => {
    // Apply custom theme CSS variables to the document root
    const root = document.documentElement;
    Object.entries(customTheme.colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
    setTheme('custom');
  }, [setTheme]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      customThemes,
      saveCustomTheme,
      deleteCustomTheme,
      wallpaper,
      setWallpaper,
      applyCustomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};