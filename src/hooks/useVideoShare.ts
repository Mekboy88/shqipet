import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VideoShareOptions {
  title?: string;
  description?: string;
  platform: 'facebook' | 'twitter' | 'whatsapp' | 'native' | 'copy';
}

export const useVideoShare = () => {
  const [isSharing, setIsSharing] = useState(false);
  const { user } = useAuth();

  const shareVideo = useCallback(async (videoUrl: string, options: VideoShareOptions) => {
    if (!videoUrl) {
      toast.error('No video to share');
      return;
    }

    setIsSharing(true);
    
    try {
      const shareText = `${options.title || 'Check out this video!'}\n${options.description || ''}`;
      
      switch (options.platform) {
        case 'facebook':
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`;
          window.open(fbUrl, '_blank', 'width=600,height=400');
          break;
          
        case 'twitter':
          const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(videoUrl)}`;
          window.open(twitterUrl, '_blank', 'width=600,height=400');
          break;
          
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${videoUrl}`)}`;
          window.open(whatsappUrl, '_blank');
          break;
          
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: options.title || 'Shared Video',
              text: options.description || 'Check out this video!',
              url: videoUrl,
            });
          } else {
            // Fallback to copy
            await navigator.clipboard.writeText(`${shareText}\n${videoUrl}`);
            toast.success('Video link copied to clipboard');
          }
          break;
          
        case 'copy':
          await navigator.clipboard.writeText(videoUrl);
          toast.success('Video link copied to clipboard');
          break;
          
        default:
          throw new Error('Unsupported share platform');
      }

      // Track the share if user is logged in
      if (user && options.platform !== 'copy') {
        try {
          await supabase.from('analytics_events').insert({
            name: 'video_shared',
            user_id: user.id,
            props: {
              platform: options.platform,
              video_url: videoUrl,
              share_method: 'direct_link'
            }
          });
        } catch (error) {
          console.warn('Failed to track video share:', error);
        }
      }

      toast.success(`Video shared to ${options.platform}`);
      
    } catch (error) {
      console.error('Failed to share video:', error);
      toast.error('Failed to share video');
    } finally {
      setIsSharing(false);
    }
  }, [user]);

  return {
    shareVideo,
    isSharing
  };
};