import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Image, Download, Share2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ShareMediaHandlerProps {
  content: {
    text?: string;
    images?: string[];
    videoUrl?: string;
  };
  postType?: 'text' | 'image' | 'video' | 'reshare';
  onShare?: (platform: string) => void;
}

const ShareMediaHandler: React.FC<ShareMediaHandlerProps> = ({
  content,
  postType,
  onShare
}) => {
  const hasMedia = (content.images && content.images.length > 0) || content.videoUrl;

  const handleMediaShare = (platform: string) => {
    if (!hasMedia) {
      toast.error('Nuk ka media për tu ndarë');
      return;
    }

    if (onShare) {
      onShare(platform);
    }
  };

  const downloadMedia = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('Media u shkarkua me sukses');
    } catch (error) {
      console.error('Error downloading media:', error);
      toast.error('Nuk u arrit të shkarkohej media');
    }
  };

  const copyMediaLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Lidhja e media-s u kopjua');
    } catch (error) {
      console.error('Error copying media link:', error);
      toast.error('Nuk u arrit të kopjohej lidhja');
    }
  };

  if (!hasMedia) {
    return (
      <Card className="p-3 bg-muted/30">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Share2 className="w-4 h-4" />
          <span>Ky postim përmban vetëm tekst</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        {postType === 'video' ? (
          <Video className="w-4 h-4 text-blue-600" />
        ) : (
          <Image className="w-4 h-4 text-green-600" />
        )}
        <span>
          Media në postim: {content.videoUrl ? '1 video' : `${content.images?.length || 0} foto`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Video Sharing */}
        {content.videoUrl && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyMediaLink(content.videoUrl!)}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              Kopjo lidhjen
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadMedia(content.videoUrl!, 'video.mp4')}
              className="flex items-center gap-2"
            >
              <Download className="w-3 h-3" />
              Shkarko
            </Button>
          </>
        )}

        {/* Image Sharing */}
        {content.images && content.images.length > 0 && (
          <>
            {content.images.map((image, index) => (
              <div key={index} className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyMediaLink(image)}
                  className="flex items-center gap-1 flex-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Link {index + 1}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadMedia(image, `image-${index + 1}.jpg`)}
                  className="flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Platform-specific sharing buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMediaShare('facebook')}
          className="text-xs"
        >
          FB Media
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMediaShare('whatsapp')}
          className="text-xs"
        >
          WA Media
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMediaShare('telegram')}
          className="text-xs"
        >
          TG Media
        </Button>
      </div>
    </Card>
  );
};

export default ShareMediaHandler;