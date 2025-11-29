import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Video, FileText, Users } from 'lucide-react';
import UniversalPhotoGrid from '@/components/shared/UniversalPhotoGrid';
import { isSecureVideoFile } from '@/utils/videoSecurity';

interface MediaPreviewProps {
  content: {
    text?: string;
    images?: string[];
    videoUrl?: string;
  };
  postType?: 'text' | 'image' | 'video' | 'reshare';
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ content, postType }) => {
  const getPreviewIcon = () => {
    switch (postType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'reshare':
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getPostTypeLabel = () => {
    switch (postType) {
      case 'image':
        return 'Postim me foto';
      case 'video':
        return 'Postim me video';
      case 'reshare':
        return 'Postim i ri-ndarë';
      default:
        return 'Postim me tekst';
    }
  };

  return (
    <Card className="p-4 bg-muted/50">
      <div className="space-y-3">
        {/* Post Type Badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {getPreviewIcon()}
            <span className="ml-1">{getPostTypeLabel()}</span>
          </Badge>
        </div>

        {/* Text Content Preview */}
        {content.text && (
          <div className="text-sm text-muted-foreground">
            <p className="line-clamp-3">
              {content.text.length > 150 
                ? `${content.text.substring(0, 150)}...` 
                : content.text
              }
            </p>
          </div>
        )}

        {/* Media Preview - Using same component as posts */}
        {(content.images && content.images.length > 0) || content.videoUrl ? (
          <div className="w-full">
            <UniversalPhotoGrid 
              media={(() => {
                const allMedia = [];
                if (content.images) {
                  allMedia.push(...content.images);
                }
                if (content.videoUrl) {
                  allMedia.push(content.videoUrl);
                }
                return allMedia;
              })()}
              videos={content.videoUrl ? [content.videoUrl] : []}
              className="w-full"
            />
          </div>
        ) : content.text && (
          <div className="flex items-center justify-center h-24 bg-gray-100 rounded border-2 border-dashed border-gray-300">
            <div className="text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Text only post</p>
            </div>
          </div>
        )}

        {/* Media Count Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {content.images && content.images.length > 0 && (
            <span className="flex items-center gap-1">
              <Image className="w-3 h-3" />
              {content.images.length} foto
            </span>
          )}
          {content.videoUrl && (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              1 video
            </span>
          )}
          {content.text && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {content.text.length} karaktere
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MediaPreview;