import React, { useState, useEffect } from 'react';
import { processWasabiUrl, isWasabiKey } from '@/services/media/LegacyMediaService';

interface WasabiImageDisplayProps {
  url: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
  onClick?: () => void;
  onLoaded?: () => void;
}

export const WasabiImageDisplay: React.FC<WasabiImageDisplayProps> = ({
  url,
  alt = '',
  className = '',
  aspectRatio = 'aspect-[16/9]',
  onClick,
  onLoaded
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false); // Disabled - no loading states to prevent layout shifts
  const [showIframe, setShowIframe] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Generate presigned URL if needed
  useEffect(() => {
    let isMounted = true;

    const generateUrl = async () => {
      try {
        console.log('🔗 Processing URL:', url);
        
        if (isWasabiKey(url)) {
          console.log('📋 Detected Wasabi key, generating presigned URL...');
          const processedUrl = await processWasabiUrl(url, 900); // 15 minutes
          
          if (isMounted) {
            setSignedUrl(processedUrl);
            console.log('✅ Presigned URL generated successfully');
          }
        } else {
          // It's already a full URL, use as-is
          setSignedUrl(url);
          console.log('🔄 Using URL as-is (not a Wasabi key)');
        }
      } catch (error) {
        console.error('❌ Failed to generate presigned URL:', error);
        if (isMounted) {
          setUrlError(error instanceof Error ? error.message : 'Failed to generate URL');
          setSignedUrl(url); // Fallback to original URL
        }
      }
    };

    generateUrl();

    return () => {
      isMounted = false;
    };
  }, [url]);

  // Clean URLs (legacy support)
  const cleanUrl = React.useMemo(() => {
    const urlToClean = signedUrl || url;
    let cleanedUrl = urlToClean;
    
    if (cleanedUrl.includes('undefined/')) {
      cleanedUrl = cleanedUrl.replace('undefined/', '');
    }
    
    if (cleanedUrl.startsWith('//')) {
      cleanedUrl = `https:${cleanedUrl}`;
    }
    
    return cleanedUrl;
  }, [signedUrl, url]);

  const handleImageError = (e: any) => {
    console.log('🚨 IMG tag failed for photo grid, showing error placeholder:', cleanUrl);
    setImageError(true);
    setLoading(false);
    // Don't fallback to iframe for photo grids as it causes corruption
  };

  const handleImageLoad = () => {
    console.log('✅ IMG tag loaded successfully:', cleanUrl);
    setLoading(false);
  };

  // Show content immediately - no loading states
  if (!signedUrl && !urlError) {
    return null; // Let skeleton handle loading
  }

  // Show error if URL generation failed
  if (urlError && !signedUrl) {
    return (
      <div className={`${aspectRatio} ${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 mb-2">Failed to load image</p>
          <p className="text-xs text-red-500">{urlError}</p>
        </div>
      </div>
    );
  }

  if (showIframe) {
    return (
      <div 
        className={`${aspectRatio} ${className} relative overflow-hidden bg-gray-100 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <iframe
          src={cleanUrl}
          className="w-full h-full border-0"
          title={alt}
          onLoad={() => {
            console.log('✅ Iframe loaded:', cleanUrl);
            setLoading(false);
          }}
          onError={() => {
            console.log('❌ Iframe also failed:', cleanUrl);
          }}
        />
      </div>
    );
  }

  if (imageError && !showIframe) {
    return (
      <div className={`${aspectRatio} ${className} bg-muted/20 flex items-center justify-center rounded`}>
        <div className="text-center p-2">
          <p className="text-xs text-muted-foreground">Image failed to load</p>
        </div>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <img
        src={cleanUrl}
        alt={alt}
        className="w-full h-full object-contain"
        onError={handleImageError}
        onLoad={() => {
          handleImageLoad();
          onLoaded?.();
        }}
        style={{ opacity: '1' }} // Always visible - no loading transitions
      />
    </div>
  );
};