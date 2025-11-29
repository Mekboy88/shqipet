import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Avatar from '@/components/Avatar';
import { Share2, Play } from 'lucide-react';
import FeedVideoPlayer from '@/components/watch/FeedVideoPlayer';
import { formatTimeAgo } from '@/lib/utils/timeUtils';

interface SharedPostCardProps {
  originalPost: {
    id: string;
    user_id: string;
    user_name: string;
    user_image?: string;
    user_verified?: boolean;
    content_text?: string;
    content_images?: string[];
    created_at: string;
  };
  sharedBy: {
    name: string;
    id: string;
  };
  shareText?: string;
  sharedAt: string;
}

const SharedPostCard: React.FC<SharedPostCardProps> = ({
  originalPost,
  sharedBy,
  shareText,
  sharedAt
}) => {
  // Enhanced video file detection
  const isVideoFile = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.ogg', '.ogv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('video/') || 
           (url.includes('supabase') && (lowerUrl.includes('mp4') || lowerUrl.includes('webm')));
  };

  const hasVideo = originalPost.content_images?.some(url => isVideoFile(url));
  const videoUrl = originalPost.content_images?.find(url => isVideoFile(url));
  const imageUrls = originalPost.content_images?.filter(url => !isVideoFile(url)) || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      {/* Shared By Header */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar userId={sharedBy.id} size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{sharedBy.name}</span>
            <Share2 className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">shared {formatTimeAgo(sharedAt)}</span>
          </div>
          {shareText && (
            <p className="text-sm text-gray-700 mt-1">{shareText}</p>
          )}
        </div>
      </div>

      {/* Original Post Card */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          {/* Original Author */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar userId={originalPost.user_id} size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{originalPost.user_name}</span>
                {originalPost.user_verified && (
                  <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 0L12.39 7.61L20 10L12.39 12.39L10 20L7.61 12.39L0 10L7.61 7.61L10 0Z"/>
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-500">{formatTimeAgo(originalPost.created_at)}</span>
            </div>
          </div>

          {/* Original Content */}
          {originalPost.content_text && (
            <p className="text-gray-800 mb-3">{originalPost.content_text}</p>
          )}

          {/* Video Content */}
          {hasVideo && videoUrl && (
            <div className="mb-3">
              <FeedVideoPlayer
                src={videoUrl}
                className="w-full rounded-lg"
                onPictureInPicture={() => {
                  if (window.feedPipHandler) {
                    window.feedPipHandler(videoUrl, originalPost);
                  }
                }}
              />
            </div>
          )}

          {/* Image Content */}
          {imageUrls.length > 0 && (
            <div className={`mb-3 grid gap-2 ${
              imageUrls.length === 1 ? 'grid-cols-1' :
              imageUrls.length === 2 ? 'grid-cols-2' :
              imageUrls.length === 3 ? 'grid-cols-2' :
              'grid-cols-2'
            }`}>
              {imageUrls.slice(0, 4).map((image, index) => (
                <div 
                  key={index} 
                  className={`relative ${
                    imageUrls.length === 3 && index === 0 ? 'row-span-2' : ''
                  } ${
                    imageUrls.length > 4 && index === 3 ? 'relative' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Shared content ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    style={{ 
                      aspectRatio: imageUrls.length === 1 ? '16/9' : '1/1',
                      minHeight: '200px',
                      maxHeight: imageUrls.length === 1 ? '400px' : '250px'
                    }}
                  />
                  {imageUrls.length > 4 && index === 3 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                      <span className="text-white text-lg font-semibold">
                        +{imageUrls.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SharedPostCard;