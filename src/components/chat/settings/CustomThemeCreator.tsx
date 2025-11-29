import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTheme, CustomTheme } from '@/contexts/ThemeContext';
import {
  Palette,
  Save,
  Shuffle,
  Eye,
  Copy,
  Download,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, description }) => {
  const [hue, setHue] = useState(parseInt(value.split(' ')[0]) || 0);
  const [saturation, setSaturation] = useState(parseInt(value.split(' ')[1].replace('%', '')) || 0);
  const [lightness, setLightness] = useState(parseInt(value.split(' ')[2].replace('%', '')) || 0);

  const updateColor = useCallback((h: number, s: number, l: number) => {
    const hslValue = `${h} ${s}% ${l}%`;
    onChange(hslValue);
  }, [onChange]);

  const handleHueChange = useCallback((values: number[]) => {
    const newHue = values[0];
    setHue(newHue);
    updateColor(newHue, saturation, lightness);
  }, [saturation, lightness, updateColor]);

  const handleSaturationChange = useCallback((values: number[]) => {
    const newSaturation = values[0];
    setSaturation(newSaturation);
    updateColor(hue, newSaturation, lightness);
  }, [hue, lightness, updateColor]);

  const handleLightnessChange = useCallback((values: number[]) => {
    const newLightness = values[0];
    setLightness(newLightness);
    updateColor(hue, saturation, newLightness);
  }, [hue, saturation, updateColor]);

  return (
    <div className="space-y-4 p-4 border border-border/50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <Label className="font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div 
          className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
          style={{ backgroundColor: `hsl(${value})` }}
        />
      </div>
      
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Hue: {hue}°</Label>
          <Slider 
            value={[hue]} 
            onValueChange={handleHueChange}
            max={360}
            step={1}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Saturation: {saturation}%</Label>
          <Slider 
            value={[saturation]} 
            onValueChange={handleSaturationChange}
            max={100}
            step={1}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs">Lightness: {lightness}%</Label>
          <Slider 
            value={[lightness]} 
            onValueChange={handleLightnessChange}
            max={100}
            step={1}
            className="mt-1"
          />
        </div>
      </div>
      
      <Input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0 0% 0%"
        className="text-xs font-mono"
      />
    </div>
  );
};

const CustomThemeCreator: React.FC = () => {
  const { customThemes, saveCustomTheme, deleteCustomTheme, applyCustomTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>({
    id: '',
    name: 'My Custom Theme',
    colors: {
      background: '0 0% 100%',
      foreground: '224 71% 4%',
      card: '0 0% 100%',
      cardForeground: '224 71% 4%',
      primary: '214 100% 57%',
      primaryForeground: '0 0% 98%',
      secondary: '220 14% 96%',
      secondaryForeground: '220 39% 11%',
      muted: '220 14% 96%',
      mutedForeground: '220 9% 46%',
      accent: '220 14% 96%',
      accentForeground: '220 39% 11%',
      border: '220 13% 91%',
      ring: '214 100% 57%'
    }
  });

  const [previewMode, setPreviewMode] = useState(false);

  const handleColorChange = useCallback((colorKey: keyof CustomTheme['colors'], value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  }, []);

  const generateRandomTheme = useCallback(() => {
    const baseHue = Math.floor(Math.random() * 360);
    const complementaryHue = (baseHue + 180) % 360;
    
    setCurrentTheme(prev => ({
      ...prev,
      name: `Random Theme ${Date.now()}`,
      colors: {
        background: `${baseHue} 15% 98%`,
        foreground: `${baseHue} 45% 11%`,
        card: `${baseHue} 20% 100%`,
        cardForeground: `${baseHue} 45% 11%`,
        primary: `${baseHue} 70% 50%`,
        primaryForeground: `${baseHue} 15% 98%`,
        secondary: `${baseHue} 20% 93%`,
        secondaryForeground: `${baseHue} 45% 15%`,
        muted: `${baseHue} 20% 95%`,
        mutedForeground: `${baseHue} 25% 46%`,
        accent: `${complementaryHue} 40% 85%`,
        accentForeground: `${complementaryHue} 45% 15%`,
        border: `${baseHue} 30% 89%`,
        ring: `${baseHue} 70% 50%`
      }
    }));
  }, []);

  const handleSaveTheme = useCallback(() => {
    const themeToSave = {
      ...currentTheme,
      id: currentTheme.id || `theme-${Date.now()}`
    };
    saveCustomTheme(themeToSave);
    setCurrentTheme(prev => ({ ...prev, id: themeToSave.id }));
  }, [currentTheme, saveCustomTheme]);

  const handlePreviewTheme = useCallback(() => {
    if (previewMode) {
      // Restore original theme by removing custom styles
      const root = document.documentElement;
      Object.keys(currentTheme.colors).forEach(key => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.removeProperty(cssVar);
      });
    } else {
      applyCustomTheme(currentTheme);
    }
    setPreviewMode(!previewMode);
  }, [previewMode, currentTheme, applyCustomTheme]);

  const exportTheme = useCallback(() => {
    const dataStr = JSON.stringify(currentTheme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentTheme.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [currentTheme]);

  const importTheme = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.colors && imported.name) {
            setCurrentTheme(imported);
          }
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2">
      {/* Header */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Custom Theme Creator</h3>
            <Badge variant="secondary" className="text-xs">Pro</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateRandomTheme}
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Random
            </Button>
            <Button
              variant={previewMode ? "destructive" : "secondary"}
              size="sm"
              onClick={handlePreviewTheme}
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Stop Preview' : 'Preview'}
            </Button>
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              value={currentTheme.name}
              onChange={(e) => setCurrentTheme(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter theme name"
              className="mt-1"
            />
          </div>
          
          <div className="flex items-end gap-2">
            <Button onClick={handleSaveTheme} size="sm">
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="h-4 w-4" />
            </Button>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={importTheme}
                className="hidden"
                id="import-theme"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="import-theme" className="cursor-pointer">
                  <Upload className="h-4 w-4" />
                </label>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Color Customization */}
      <Card className="p-6 border-primary/10">
        <h4 className="text-md font-semibold mb-4">Color Customization</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Background"
            value={currentTheme.colors.background}
            onChange={(value) => handleColorChange('background', value)}
            description="Main background color"
          />
          
          <ColorPicker
            label="Foreground"
            value={currentTheme.colors.foreground}
            onChange={(value) => handleColorChange('foreground', value)}
            description="Main text color"
          />
          
          <ColorPicker
            label="Primary"
            value={currentTheme.colors.primary}
            onChange={(value) => handleColorChange('primary', value)}
            description="Brand/accent color"
          />
          
          <ColorPicker
            label="Secondary"
            value={currentTheme.colors.secondary}
            onChange={(value) => handleColorChange('secondary', value)}
            description="Secondary elements"
          />
          
          <ColorPicker
            label="Card"
            value={currentTheme.colors.card}
            onChange={(value) => handleColorChange('card', value)}
            description="Card backgrounds"
          />
          
          <ColorPicker
            label="Border"
            value={currentTheme.colors.border}
            onChange={(value) => handleColorChange('border', value)}
            description="Border color"
          />
        </div>
      </Card>

      {/* Theme Preview */}
      <Card className="p-6 border-primary/10">
        <h4 className="text-md font-semibold mb-4">Preview</h4>
        
        <div className="space-y-3">
          <div className="flex justify-end">
            <div 
              className="px-4 py-2 rounded-2xl max-w-xs text-sm"
              style={{ 
                backgroundColor: `hsl(${currentTheme.colors.primary})`,
                color: `hsl(${currentTheme.colors.primaryForeground})`
              }}
            >
              This is how your messages will look!
            </div>
          </div>
          
          <div className="flex justify-start">
            <div 
              className="px-4 py-2 rounded-2xl max-w-xs text-sm"
              style={{ 
                backgroundColor: `hsl(${currentTheme.colors.muted})`,
                color: `hsl(${currentTheme.colors.mutedForeground})`
              }}
            >
              And this is how received messages appear.
            </div>
          </div>
        </div>
      </Card>

      {/* Saved Themes */}
      {customThemes.length > 0 && (
        <Card className="p-6 border-primary/10">
          <h4 className="text-md font-semibold mb-4">Saved Custom Themes</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customThemes.map((theme) => (
              <div
                key={theme.id}
                className="p-3 border border-border/50 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-border"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <span className="font-medium text-sm">{theme.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTheme(theme)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => applyCustomTheme(theme)}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCustomTheme(theme.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CustomThemeCreator;