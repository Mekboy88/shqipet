import React, { useState, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme, WallpaperSettings as WallpaperSettingsType } from '@/contexts/ThemeContext';
import {
  Image,
  Palette,
  Upload,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Layers,
  Blend
} from 'lucide-react';

interface GradientPickerProps {
  colors: string[];
  direction: string;
  onChange: (colors: string[], direction: string) => void;
}

const GradientPicker: React.FC<GradientPickerProps> = ({ colors, direction, onChange }) => {
  const addColor = useCallback(() => {
    const newColors = [...colors, '#3B82F6'];
    onChange(newColors, direction);
  }, [colors, direction, onChange]);

  const removeColor = useCallback((index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      onChange(newColors, direction);
    }
  }, [colors, direction, onChange]);

  const updateColor = useCallback((index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    onChange(newColors, direction);
  }, [colors, direction, onChange]);

  const previewGradient = `linear-gradient(${direction}, ${colors.join(', ')})`;

  return (
    <div className="space-y-4">
      <div 
        className="h-20 rounded-lg border-2 border-border"
        style={{ background: previewGradient }}
      />
      
      <div className="space-y-3">
        <div>
          <Label className="text-sm">Direction</Label>
          <Select value={direction} onValueChange={(value) => onChange(colors, value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="45deg">Diagonal ↗</SelectItem>
              <SelectItem value="90deg">Vertical ↑</SelectItem>
              <SelectItem value="0deg">Horizontal →</SelectItem>
              <SelectItem value="135deg">Diagonal ↖</SelectItem>
              <SelectItem value="180deg">Vertical ↓</SelectItem>
              <SelectItem value="270deg">Horizontal ←</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm">Colors</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addColor}
              disabled={colors.length >= 5}
            >
              <Layers className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded border-2 border-border cursor-pointer"
                  style={{ backgroundColor: color }}
                />
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="w-16 h-8 p-0 border-0"
                />
                <Input
                  value={color}
                  onChange={(e) => updateColor(index, e.target.value)}
                  className="flex-1 text-xs font-mono"
                />
                {colors.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColor(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const WallpaperSettings: React.FC = () => {
  const { wallpaper, setWallpaper } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setWallpaper({
          ...wallpaper,
          type: 'image',
          imageUrl: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }, [wallpaper, setWallpaper]);

  const handleGradientChange = useCallback((colors: string[], direction: string) => {
    setWallpaper({
      ...wallpaper,
      type: 'gradient',
      gradientColors: colors,
      gradientDirection: direction
    });
  }, [wallpaper, setWallpaper]);

  const generateRandomGradient = useCallback(() => {
    const colors = [
      `#${Math.floor(Math.random()*16777215).toString(16)}`,
      `#${Math.floor(Math.random()*16777215).toString(16)}`,
      `#${Math.floor(Math.random()*16777215).toString(16)}`
    ];
    const directions = ['45deg', '90deg', '135deg', '180deg', '270deg'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    handleGradientChange(colors, direction);
  }, [handleGradientChange]);

  const presetGradients = [
    { name: 'Ocean Sunset', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'], direction: '45deg' },
    { name: 'Purple Dreams', colors: ['#667eea', '#764ba2'], direction: '135deg' },
    { name: 'Green Forest', colors: ['#56ab2f', '#a8e6cf'], direction: '90deg' },
    { name: 'Pink Clouds', colors: ['#ffecd2', '#fcb69f'], direction: '180deg' },
    { name: 'Blue Sky', colors: ['#74b9ff', '#0984e3'], direction: '0deg' },
    { name: 'Warm Glow', colors: ['#fdcb6e', '#e17055'], direction: '270deg' }
  ];

  const handleOpacityChange = useCallback((values: number[]) => {
    setWallpaper({
      ...wallpaper,
      opacity: values[0]
    });
  }, [wallpaper, setWallpaper]);

  const handleBlurChange = useCallback((values: number[]) => {
    setWallpaper({
      ...wallpaper,
      blur: values[0]
    });
  }, [wallpaper, setWallpaper]);

  const handlePositionChange = useCallback((position: string) => {
    setWallpaper({
      ...wallpaper,
      position
    });
  }, [wallpaper, setWallpaper]);

  const clearWallpaper = useCallback(() => {
    setWallpaper({
      type: 'none',
      opacity: 100
    });
  }, [setWallpaper]);

  const togglePreview = useCallback(() => {
    setPreviewMode(!previewMode);
    // TODO: Apply preview to chat window
  }, [previewMode]);

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2">
      {/* Header */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Chat Wallpaper</h3>
            <Badge variant="secondary" className="text-xs">Custom</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode ? "destructive" : "secondary"}
              size="sm"
              onClick={togglePreview}
            >
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Stop Preview' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearWallpaper}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={wallpaper.type === 'none' ? 'default' : 'outline'}
            onClick={() => setWallpaper({ type: 'none', opacity: 100 })}
            className="h-20 flex-col"
          >
            <div className="w-full h-full bg-background border-2 border-dashed border-border rounded" />
            <span className="text-xs mt-1">None</span>
          </Button>
          
          <Button
            variant={wallpaper.type === 'image' ? 'default' : 'outline'}
            onClick={() => fileInputRef.current?.click()}
            className="h-20 flex-col"
          >
            <Upload className="h-6 w-6" />
            <span className="text-xs mt-1">Upload Image</span>
          </Button>
          
          <Button
            variant={wallpaper.type === 'gradient' ? 'default' : 'outline'}
            onClick={() => setWallpaper({ 
              type: 'gradient', 
              gradientColors: ['#3B82F6', '#8B5CF6'], 
              gradientDirection: '45deg',
              opacity: 100 
            })}
            className="h-20 flex-col"
          >
            <Palette className="h-6 w-6" />
            <span className="text-xs mt-1">Gradient</span>
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
          onChange={handleImageUpload}
          className="hidden"
        />
      </Card>

      {/* Image Settings */}
      {wallpaper.type === 'image' && wallpaper.imageUrl && (
        <Card className="p-6 border-primary/10">
          <h4 className="text-md font-semibold mb-4">Image Settings</h4>
          
          <div className="space-y-4">
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
              <img 
                src={wallpaper.imageUrl} 
                alt="Wallpaper preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <Label className="text-sm">Position</Label>
              <Select 
                value={wallpaper.position || 'cover'} 
                onValueChange={handlePositionChange}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover (fill)</SelectItem>
                  <SelectItem value="contain">Contain (fit)</SelectItem>
                  <SelectItem value="repeat">Repeat (tile)</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      )}

      {/* Gradient Settings */}
      {wallpaper.type === 'gradient' && (
        <Card className="p-6 border-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold">Gradient Settings</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={generateRandomGradient}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Random
            </Button>
          </div>
          
          <GradientPicker
            colors={wallpaper.gradientColors || ['#3B82F6', '#8B5CF6']}
            direction={wallpaper.gradientDirection || '45deg'}
            onChange={handleGradientChange}
          />
          
          <Separator className="my-4" />
          
          <div>
            <Label className="text-sm mb-2 block">Preset Gradients</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {presetGradients.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-16 p-2 flex-col"
                  onClick={() => handleGradientChange(preset.colors, preset.direction)}
                >
                  <div 
                    className="w-full h-8 rounded border"
                    style={{ 
                      background: `linear-gradient(${preset.direction}, ${preset.colors.join(', ')})` 
                    }}
                  />
                  <span className="text-xs mt-1">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Appearance Settings */}
      {wallpaper.type !== 'none' && (
        <Card className="p-6 border-primary/10">
          <h4 className="text-md font-semibold mb-4">Appearance</h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">Opacity</Label>
                <span className="text-xs text-muted-foreground">{wallpaper.opacity}%</span>
              </div>
              <Slider 
                value={[wallpaper.opacity]} 
                onValueChange={handleOpacityChange}
                min={10}
                max={100}
                step={5}
              />
            </div>
            
            {wallpaper.type === 'image' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm">Blur</Label>
                  <span className="text-xs text-muted-foreground">{wallpaper.blur || 0}px</span>
                </div>
                <Slider 
                  value={[wallpaper.blur || 0]} 
                  onValueChange={handleBlurChange}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Preview */}
      <Card className="p-6 border-primary/10">
        <h4 className="text-md font-semibold mb-4">Chat Preview</h4>
        
        <div 
          className="h-48 rounded-lg border-2 border-border p-4 relative overflow-hidden"
          style={{
            background: wallpaper.type === 'gradient' 
              ? `linear-gradient(${wallpaper.gradientDirection}, ${wallpaper.gradientColors?.join(', ')})`
              : wallpaper.type === 'image' && wallpaper.imageUrl
                ? `url(${wallpaper.imageUrl})`
                : 'hsl(var(--background))',
            backgroundSize: wallpaper.position || 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: wallpaper.position === 'repeat' ? 'repeat' : 'no-repeat',
            opacity: wallpaper.opacity / 100,
            filter: wallpaper.blur ? `blur(${wallpaper.blur}px)` : 'none'
          }}
        >
          <div className="absolute inset-0 p-4 flex flex-col justify-end space-y-2">
            <div className="flex justify-end">
              <div className="px-3 py-2 rounded-2xl max-w-xs bg-primary/80 text-primary-foreground backdrop-blur-sm text-sm">
                Your message with wallpaper!
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-2xl max-w-xs bg-background/80 text-foreground backdrop-blur-sm text-sm">
                Received message looks great too.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WallpaperSettings;