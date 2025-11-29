import { useState, useEffect } from 'react';
import { getVideoThumbnailWithFallback } from '@/utils/videoThumbnails';

export const useVideoThumbnail = (videoUrl: string) => {
  const [thumbnail, setThumbnail] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoUrl) return;

    const generateThumbnail = async () => {
      setIsGenerating(true);
      setError(null);
      
      try {
        const thumbnailDataUrl = await getVideoThumbnailWithFallback(videoUrl);
        setThumbnail(thumbnailDataUrl);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate thumbnail';
        console.error('Thumbnail generation error:', errorMessage);
        setError(errorMessage);
        setThumbnail(''); // Fallback to no poster
      } finally {
        setIsGenerating(false);
      }
    };

    generateThumbnail();
  }, [videoUrl]);

  return {
    thumbnail,
    isGenerating,
    error,
    regenerate: () => {
      if (videoUrl) {
        setThumbnail('');
        setError(null);
        // Trigger regeneration by changing the effect dependency
        setTimeout(() => {
          const generateThumbnail = async () => {
            setIsGenerating(true);
            try {
              const thumbnailDataUrl = await getVideoThumbnailWithFallback(videoUrl);
              setThumbnail(thumbnailDataUrl);
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'Failed to generate thumbnail';
              setError(errorMessage);
            } finally {
              setIsGenerating(false);
            }
          };
          generateThumbnail();
        }, 100);
      }
    }
  };
};