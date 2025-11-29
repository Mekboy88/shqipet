import React, { useState } from 'react';

interface SimpleImageDisplayProps {
  url: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export const SimpleImageDisplay: React.FC<SimpleImageDisplayProps> = ({
  url,
  alt = '',
  className = '',
  aspectRatio = 'aspect-[16/9]'
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Clean Wasabi URLs and ensure they're properly formatted
  const cleanUrl = React.useMemo(() => {
    let cleanedUrl = url;
    
    // Remove 'undefined/' if present
    if (cleanedUrl.includes('undefined/')) {
      cleanedUrl = cleanedUrl.replace('undefined/', '');
    }
    
    // Add protocol if missing
    if (cleanedUrl.startsWith('//')) {
      cleanedUrl = `https:${cleanedUrl}`;
    }
    
    // For Wasabi URLs with query parameters, use them as-is (they're presigned URLs)
    return cleanedUrl;
  }, [url]);

  const handleError = (e: any) => {
    console.log('🚨 Simple image failed to load:', cleanUrl);
    console.log('🚨 Error details:', e);
    
    // Try to fetch the image to see what the actual error is
    fetch(cleanUrl, { method: 'HEAD', mode: 'no-cors' })
      .then(() => console.log('✅ Image exists but CORS might be blocking it'))
      .catch(err => console.log('❌ Image fetch failed:', err));
    
    setImageError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    console.log('✅ Simple image loaded successfully:', cleanUrl);
    setLoading(false);
  };

  if (imageError) {
    return (
      <div className={`${aspectRatio} ${className} bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300`}>
        <div className="text-center p-4">
          <p className="text-sm text-gray-500 mb-2">Image unavailable</p>
          <button 
            onClick={() => window.open(cleanUrl, '_blank')}
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            View in new tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${aspectRatio} ${className} relative overflow-hidden`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
      )}
      <img
        src={cleanUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
};