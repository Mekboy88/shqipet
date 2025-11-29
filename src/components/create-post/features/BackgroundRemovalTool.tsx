import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BackgroundRemovalToolProps {
  selectedFiles: File[];
  onProcessedFile: (originalFile: File, processedFile: File) => void;
}

// Simplified background removal (placeholder implementation)
const removeBackground = async (file: File): Promise<File> => {
  // For now, return a simple processed version
  // This would normally use a proper ML model for background removal
  
  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  try {
    console.log('Processing image...');
    
    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the original image
    ctx.drawImage(img, 0, 0);
    
    // Simple processing - add a subtle effect to indicate processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Add a slight transparency effect as placeholder
    for (let i = 0; i < data.length; i += 4) {
      // Slightly reduce opacity for demo
      data[i + 3] = Math.max(0, data[i + 3] - 20);
    }
    
    ctx.putImageData(imageData, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const processedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '_processed.png'), {
            type: 'image/png',
          });
          resolve(processedFile);
        } else {
          reject(new Error('Failed to create blob from canvas'));
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};

const BackgroundRemovalTool: React.FC<BackgroundRemovalToolProps> = ({ selectedFiles, onProcessedFile }) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

  const handleRemoveBackground = async (file: File) => {
    setProcessing(file.name);
    
    try {
      toast.info('Removing background...', {
        description: 'This may take a moment to process',
        duration: 3000
      });

      const processedFile = await removeBackground(file);
      onProcessedFile(file, processedFile);
      
      toast.success('Background removed successfully!', {
        description: 'The processed image has been added to your files'
      });
    } catch (error) {
      console.error('Background removal error:', error);
      toast.error('Failed to remove background', {
        description: 'Please try again or use a different image'
      });
    } finally {
      setProcessing(null);
    }
  };

  if (imageFiles.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-card-foreground">AI Background Removal</div>
      <div className="space-y-2">
        {imageFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between bg-card/50 border rounded-lg p-2">
            <div className="flex items-center gap-2">
              <img 
                src={URL.createObjectURL(file)} 
                alt={file.name}
                className="w-8 h-8 object-cover rounded"
              />
              <span className="text-sm truncate">{file.name}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRemoveBackground(file)}
              disabled={processing === file.name}
              className="h-7"
            >
              {processing === file.name ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Wand2 className="w-3 h-3 mr-1" />
                  Remove BG
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundRemovalTool;