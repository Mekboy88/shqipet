import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ShareData {
  postId: string;
  content: {
    text?: string;
    images?: string[];
    videoUrl?: string;
  };
  postType?: 'text' | 'image' | 'video' | 'reshare';
}

export interface ShareOptions {
  platform: string;
  customText?: string;
  title?: string;
  includeMedia?: boolean;
}

export interface ShareAnalytics {
  totalShares: number;
  platformBreakdown: { [platform: string]: number };
  recentShares: Array<{
    platform: string;
    shared_at: string;
    custom_text?: string;
  }>;
}

export const useEnhancedSharing = () => {
  const { user } = useAuth();
  const [isSharing, setIsSharing] = useState(false);
  const [shareHistory, setShareHistory] = useState<any[]>([]);

  const recordShare = useCallback(async (
    postId: string, 
    platform: string, 
    customText?: string,
    sharedPostId?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('shares')
        .insert({
          post_id: postId,
          user_id: user.id,
          share_type: platform,
          custom_text: customText || null,
          shared_post_id: sharedPostId || null
        });

      if (error) throw error;

      // Update shares count
      const { data: currentPost } = await supabase
        .from('posts')
        .select('shares_count')
        .eq('id', postId)
        .single();

      if (currentPost) {
        await supabase
          .from('posts')
          .update({ shares_count: (currentPost.shares_count || 0) + 1 })
          .eq('id', postId);
      }

      // Track analytics
      await supabase.from('analytics_events').insert({
        name: 'post_shared',
        user_id: user.id,
        props: {
          post_id: postId,
          platform,
          has_custom_text: !!customText,
          share_method: 'enhanced_modal'
        }
      });

    } catch (error) {
      console.error('Error recording share:', error);
    }
  }, [user]);

  const shareToExternalPlatform = useCallback(async (
    shareData: ShareData,
    options: ShareOptions
  ) => {
    setIsSharing(true);

    try {
      const shareUrl = `${window.location.origin}/post/${shareData.postId}`;
      const fullText = options.customText || shareData.content.text || '';
      const title = options.title || 'Shiko këtë postim interesant!';

      switch (options.platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullText)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${fullText} ${shareUrl}`)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(fullText)}`,
            '_blank',
            'width=600,height=400'
          );
          break;

        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${fullText} ${shareUrl}`)}`,
            '_blank'
          );
          break;

        case 'telegram':
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fullText)}`,
            '_blank'
          );
          break;

        case 'instagram':
          // Instagram doesn't support direct URL sharing, copy to clipboard instead
          await navigator.clipboard.writeText(`${fullText}\n\n${shareUrl}`);
          toast.success('Teksti u kopjua! Ngjiteni në Instagram Stories ose Posts.');
          break;

        case 'discord':
          await navigator.clipboard.writeText(`${fullText}\n\n${shareUrl}`);
          toast.success('Lidhja u kopjua! Ngjiteni në Discord.');
          break;

        case 'email':
          window.open(
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${fullText}\n\n${shareUrl}`)}`,
            '_blank'
          );
          break;

        case 'sms':
          window.open(
            `sms:?body=${encodeURIComponent(`${fullText} ${shareUrl}`)}`,
            '_blank'
          );
          break;

        case 'copy':
          await navigator.clipboard.writeText(`${fullText}\n\n${shareUrl}`);
          toast.success('Lidhja u kopjua në clipboard');
          break;

        case 'native':
          if (navigator.share) {
            await navigator.share({
              title,
              text: fullText,
              url: shareUrl
            });
          } else {
            await navigator.clipboard.writeText(`${fullText}\n\n${shareUrl}`);
            toast.success('Lidhja u kopjua në clipboard');
          }
          break;

        default:
          throw new Error(`Unsupported platform: ${options.platform}`);
      }

      await recordShare(shareData.postId, options.platform, options.customText);
      toast.success(`Postimi u nda me sukses në ${options.platform}`);

    } catch (error) {
      console.error('Error sharing to platform:', error);
      toast.error('Ndodhi një gabim gjatë ndarjes së postimit');
    } finally {
      setIsSharing(false);
    }
  }, [recordShare]);

  const createReshare = useCallback(async (
    shareData: ShareData,
    customText?: string
  ) => {
    if (!user) {
      toast.error('Duhet të jeni të kyçur për të ri-ndarë postime');
      return null;
    }

    setIsSharing(true);

    try {
      // Get original post data
      const { data: originalPost, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', shareData.postId)
        .single();

      if (postError || !originalPost) {
        toast.error('Nuk u gjet postimi origjinal');
        return null;
      }

      // Create reshare post
      const { data: newPost, error: createError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          user_name: user.user_metadata?.display_name || 'User',
          user_image: user.user_metadata?.avatar_url || '',
          content_text: customText || `Reshared: ${originalPost.content_text || ''}`,
          content_images: originalPost.content_images,
          post_type: 'reshare',
          visibility: 'public',
          original_post_id: shareData.postId
        })
        .select()
        .single();

      if (createError) throw createError;

      await recordShare(shareData.postId, 'reshare', customText, newPost.id);
      toast.success('Postimi u ri-nda me sukses në profilin tuaj');

      return newPost;

    } catch (error) {
      console.error('Error creating reshare:', error);
      toast.error('Ndodhi një gabim gjatë ri-ndarjes së postimit');
      return null;
    } finally {
      setIsSharing(false);
    }
  }, [user, recordShare]);

  const getShareAnalytics = useCallback(async (postId: string): Promise<ShareAnalytics | null> => {
    try {
      const { data: shares, error } = await supabase
        .from('shares')
        .select('share_type, created_at, custom_text')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching share analytics:', error);
        return null;
      }

      if (!shares) return null;

      const platformBreakdown = shares.reduce((acc, share) => {
        acc[share.share_type] = (acc[share.share_type] || 0) + 1;
        return acc;
      }, {} as { [platform: string]: number });

      return {
        totalShares: shares.length,
        platformBreakdown,
        recentShares: shares.slice(0, 10).map(share => ({
          platform: share.share_type,
          shared_at: share.created_at,
          custom_text: share.custom_text
        }))
      };

    } catch (error) {
      console.error('Error fetching share analytics:', error);
      return null;
    }
  }, []);

  const getShareHistory = useCallback(async (userId: string, limit: number = 20) => {
    try {
      const { data: history, error } = await supabase
        .from('shares')
        .select(`
          id, share_type, created_at, custom_text,
          posts (id, content)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching share history:', error);
        return [];
      }

      setShareHistory(history || []);
      return history || [];

    } catch (error) {
      console.error('Error fetching share history:', error);
      return [];
    }
  }, []);

  return {
    isSharing,
    shareHistory,
    shareToExternalPlatform,
    createReshare,
    getShareAnalytics,
    getShareHistory,
    recordShare
  };
};