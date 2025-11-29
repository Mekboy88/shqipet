import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Facebook, MessageCircle, Share2, Copy, Instagram, 
  Linkedin, Send, QrCode, Smartphone, Users, Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import MediaPreview from './MediaPreview';
import PlatformShareButton from './PlatformShareButton';
import ShareMediaHandler from './ShareMediaHandler';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  content: {
    text?: string;
    images?: string[];
    videoUrl?: string;
  };
  postType?: 'text' | 'image' | 'video' | 'reshare';
}

interface ShareHistory {
  id: string;
  platform: string;
  shared_at: string;
  custom_text?: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  postId,
  content,
  postType = 'text'
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('share');
  const [customText, setCustomText] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareHistory, setShareHistory] = useState<ShareHistory[]>([]);

  // Fetch share history
  useEffect(() => {
      const fetchShareHistory = async () => {
        if (!user || !isOpen) return;
        
        try {
          const { data, error } = await supabase
            .from('shares')
            .select('id, share_type, created_at, custom_text')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          
          if (error) {
            console.error('Error fetching share history:', error);
            return;
          }
          
          if (data) {
            setShareHistory(data.map(share => ({
              id: share.id,
              platform: share.share_type,
              shared_at: share.created_at,
              custom_text: share.custom_text
            })));
          }
        } catch (error) {
          console.error('Error fetching share history:', error);
        }
      };

    fetchShareHistory();
  }, [user, postId, isOpen]);

  const handleShare = async (platform: string) => {
    if (!user) {
      toast.error('Duhet të jeni të kyçur për të ndarë postime');
      return;
    }

    setIsSharing(true);
    const shareUrl = `${window.location.origin}/post/${postId}`;
    const fullText = customText || content.text || '';
    const title = shareTitle || 'Shiko këtë postim interesant!';

    try {
      // Record share in database
      const { error } = await supabase
        .from('shares')
        .insert({
          post_id: postId,
          user_id: user.id,
          share_type: platform,
          custom_text: customText || null
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

      // Platform-specific sharing logic
      switch (platform) {
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

        case 'sms':
          window.open(
            `sms:?body=${encodeURIComponent(`${fullText} ${shareUrl}`)}`,
            '_blank'
          );
          break;

        case 'email':
          window.open(
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${fullText}\n\n${shareUrl}`)}`,
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
      }

      toast.success(`Postimi u nda me sukses në ${platform}`);
      onClose();
      
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Ndodhi një gabim gjatë ndarjes së postimit');
    } finally {
      setIsSharing(false);
    }
  };

  const handleReshare = async () => {
    if (!user) {
      toast.error('Duhet të jeni të kyçur për të ri-ndarë postime');
      return;
    }

    setIsSharing(true);

    try {
      // Get original post data
      const { data: originalPost, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (postError || !originalPost) {
        toast.error('Nuk u gjet postimi origjinal');
        return;
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
          original_post_id: postId
        })
        .select()
        .single();

      if (createError) throw createError;

      // Record the reshare
      await supabase
        .from('shares')
        .insert({
          post_id: postId,
          user_id: user.id,
          share_type: 'reshare',
          shared_post_id: newPost.id,
          custom_text: customText || null
        });

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

      toast.success('Postimi u ri-nda me sukses në profilin tuaj');
      onClose();

    } catch (error) {
      console.error('Error resharing:', error);
      toast.error('Ndodhi një gabim gjatë ri-ndarjes së postimit');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto w-[650px]" 
        style={{ 
          position: 'fixed',
          left: '48.5%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '700px',
          width: '650px',
          height: '700px'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Nda postimin
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="share">Nda</TabsTrigger>
            <TabsTrigger value="compose">Shkruaj</TabsTrigger>
            <TabsTrigger value="history">Historiku</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            {/* Media Preview */}
            <MediaPreview 
              content={content}
              postType={postType}
            />

            {/* Media Handler for Direct Sharing */}
            <ShareMediaHandler 
              content={content}
              postType={postType}
              onShare={(platform) => handleShare(platform)}
            />

            {/* Platform Sharing Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <PlatformShareButton
                platform="facebook"
                icon={Facebook}
                label="Facebook"
                onClick={() => handleShare('facebook')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="twitter"
                icon={MessageCircle}
                label="Twitter/X"
                onClick={() => handleShare('twitter')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="linkedin"
                icon={Linkedin}
                label="LinkedIn"
                onClick={() => handleShare('linkedin')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="whatsapp"
                icon={MessageCircle}
                label="WhatsApp"
                onClick={() => handleShare('whatsapp')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="telegram"
                icon={Send}
                label="Telegram"
                onClick={() => handleShare('telegram')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="sms"
                icon={Smartphone}
                label="SMS"
                onClick={() => handleShare('sms')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="email"
                icon={MessageCircle}
                label="Email"
                onClick={() => handleShare('email')}
                disabled={isSharing}
              />
              <PlatformShareButton
                platform="copy"
                icon={Copy}
                label="Kopjo lidhjen"
                onClick={() => handleShare('copy')}
                disabled={isSharing}
              />
              {navigator.share && (
                <PlatformShareButton
                  platform="native"
                  icon={Share2}
                  label="Nda..."
                  onClick={() => handleShare('native')}
                  disabled={isSharing}
                />
              )}
            </div>

            <Separator />

            {/* Reshare Option */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Ose ri-nda në profilin tuaj:</Label>
              <Button 
                onClick={handleReshare}
                disabled={isSharing}
                variant="outline"
                className="w-full"
              >
                <Users className="w-4 h-4 mr-2" />
                Ri-nda në profilin tim
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="compose" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="shareTitle">Titulli (opsional)</Label>
                <Input
                  id="shareTitle"
                  value={shareTitle}
                  onChange={(e) => setShareTitle(e.target.value)}
                  placeholder="Shto një titull për postimin..."
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="customText">Mesazhi juaj</Label>
                <Textarea
                  id="customText"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Shkruani diçka për këtë postim..."
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {customText.length}/500 karaktere
                </div>
              </div>

              <MediaPreview 
                content={content}
                postType={postType}
              />

              <Button 
                onClick={() => setActiveTab('share')}
                className="w-full"
              >
                Vazhdo me ndarjen
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Ndarja e fundit:</Label>
              {shareHistory.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {shareHistory.map((share) => (
                    <div key={share.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{share.platform}</Badge>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {new Date(share.shared_at).toLocaleDateString()}
                          </p>
                          {share.custom_text && (
                            <p className="text-xs text-muted-foreground mt-1">
                              "{share.custom_text.substring(0, 50)}..."
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8 border rounded-lg bg-muted/20">
                  <p>Nuk keni ndarë akoma këtë postim</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;