import { useState, useEffect, useCallback } from 'react';
import { avatarStore, AvatarV2State } from '@/services/avatar/AvatarStore';
import { supabase } from '@/integrations/supabase/client';
import { mediaService } from '@/services/media/MediaService';

// Hook for avatar management
export const useAvatar = (userId: string) => {
  const [state, setState] = useState<AvatarV2State>(() => avatarStore.getState(userId));

  useEffect(() => {
    const unsubscribe = avatarStore.subscribe(userId, setState);
    
    if (!state.loading && !state.url && !state.error) {
      avatarStore.load(userId);
    }

    return unsubscribe;
  }, [userId]);

  const upload = useCallback(async (file: File) => {
    return avatarStore.upload(userId, file);
  }, [userId]);

  const refresh = useCallback(() => {
    return avatarStore.refresh(userId);
  }, [userId]);

  const cancelUpload = useCallback(() => {
    avatarStore.cancelUpload(userId);
  }, [userId]);

  return {
    ...state,
    upload,
    refresh,
    cancelUpload,
  };
};

// Simple Avatar Display
interface AvatarProps {
  userId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUpload?: boolean;
  className?: string;
  onUploadComplete?: (key: string) => void;
  onError?: (error: string) => void;
  // Legacy props for compatibility
  onCameraClick?: () => void;
  onSeeProfilePicture?: () => void;
  onChooseProfilePicture?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  userId,
  size = 'md',
  showUpload = false,
  className = '',
  onUploadComplete,
  onError,
  onCameraClick,
  onSeeProfilePicture,
  onChooseProfilePicture,
}) => {
  const [currentUserId, setCurrentUserId] = useState<string>(userId || '');
  
  // Auto-fetch current user if no userId provided
  useEffect(() => {
    if (!userId) {
      const getCurrentUser = async () => {
        try {
          const { getCachedAuthUser } = await import('@/lib/authCache');
          const { data: { user } } = await getCachedAuthUser();
          if (user) {
            setCurrentUserId(user.id);
          }
        } catch (error) {
          console.warn('Failed to get current user:', error);
        }
      };
      getCurrentUser();
    } else {
      setCurrentUserId(userId);
    }
  }, [userId]);

  const { url, uploading, uploadProgress, error, upload, cancelUpload } = useAvatar(currentUserId);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const input = url;
    if (!input) {
      setResolvedUrl(null);
      return;
    }
    if (/^(https?:|blob:|data:)/i.test(input)) {
      setResolvedUrl(input);
      return;
    }
    if (/^(uploads|avatars|covers)\//i.test(input)) {
      mediaService.getUrl(input)
        .then((u) => { if (!cancelled) setResolvedUrl(u); })
        .catch(() => { if (!cancelled) setResolvedUrl(null); });
      return () => { cancelled = true; };
    }
    setResolvedUrl(input);
    return () => { cancelled = true; };
  }, [url]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const handleFileSelect = async (file: File) => {
    if (!currentUserId) {
      onError?.('User not authenticated');
      return;
    }
    try {
      const key = await upload(file);
      onUploadComplete?.(key);
    } catch (err: any) {
      const errorMsg = err.message || 'Upload failed';
      onError?.(errorMsg);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle legacy camera click - trigger file input or call legacy handler
  const handleCameraClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      document.getElementById(`avatar-upload-${currentUserId}`)?.click();
    }
  };

  // Handle legacy profile picture view
  const handleProfilePictureClick = () => {
    if (onSeeProfilePicture) {
      onSeeProfilePicture();
    }
  };

  // Handle legacy choose profile picture
  const handleChooseProfilePicture = () => {
    if (onChooseProfilePicture) {
      onChooseProfilePicture();
    } else {
      document.getElementById(`avatar-upload-${currentUserId}`)?.click();
    }
  };

  // Show loading if no userId yet
  if (!currentUserId) {
    // Show loading if no userId yet
  if (!currentUserId) {
    return (
      <div className={`border-2 border-dashed border-gray-200 rounded-lg p-8 text-center animate-pulse ${className}`}>
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>
    );
  }

  return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 animate-pulse ${className}`}></div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Image */}
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer`}
        onClick={handleProfilePictureClick}
      >
    {resolvedUrl ? (
      <img
        src={resolvedUrl}
        alt="Avatar"
        className="w-full h-full object-cover"
        onError={() => console.warn('Avatar image failed to load:', resolvedUrl)}
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        <span className="text-white font-semibold text-lg">
          {currentUserId.charAt(0).toUpperCase()}
        </span>
      </div>
    )}
        
        {/* Upload Progress */}
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 mb-1 relative">
                <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                <div 
                  className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"
                  style={{ animation: 'spin 1s linear infinite' }}
                ></div>
              </div>
              <span className="text-xs text-white font-medium">
                {Math.round(uploadProgress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      {showUpload && !uploading && (
        <>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
            onChange={handleFileInput}
            className="hidden"
            id={`avatar-upload-${currentUserId}`}
          />
          <button
            onClick={handleCameraClick}
            className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </>
      )}

      {/* Legacy compatibility: if onChooseProfilePicture exists, show additional button */}
      {onChooseProfilePicture && !uploading && (
        <button
          onClick={handleChooseProfilePicture}
          className="absolute -top-1 -right-1 bg-green-500 hover:bg-green-600 text-white rounded-full p-1 cursor-pointer shadow-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {/* Cancel Upload Button */}
      {uploading && (
        <button
          onClick={cancelUpload}
          className="absolute -bottom-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
};

//  for compatibility with existing ProfileAvatar usage
interface AvatarUploadZoneProps {
  userId?: string;
  onUploadComplete?: (key: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const AvatarUploadZone: React.FC<AvatarUploadZoneProps> = ({
  userId,
  onUploadComplete,
  onError,
  className = '',
}) => {
  const [currentUserId, setCurrentUserId] = useState<string>(userId || '');
  const [dragOver, setDragOver] = useState(false);

  // Auto-fetch current user if no userId provided
  useEffect(() => {
    if (!userId) {
      const getCurrentUser = async () => {
        try {
          const { getCachedAuthUser } = await import('@/lib/authCache');
          const { data: { user } } = await getCachedAuthUser();
          if (user) {
            setCurrentUserId(user.id);
          }
        } catch (error) {
          console.warn('Failed to get current user:', error);
        }
      };
      getCurrentUser();
    } else {
      setCurrentUserId(userId);
    }
  }, [userId]);

  const { url, uploading, uploadProgress, error, upload } = useAvatar(currentUserId);
  const [resolvedUrl2, setResolvedUrl2] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const input = url;
    if (!input) {
      setResolvedUrl2(null);
      return;
    }
    if (/^(https?:|blob:|data:)/i.test(input)) {
      setResolvedUrl2(input);
      return;
    }
    if (/^(uploads|avatars|covers)\//i.test(input)) {
      mediaService.getUrl(input)
        .then((u) => { if (!cancelled) setResolvedUrl2(u); })
        .catch(() => { if (!cancelled) setResolvedUrl2(null); });
      return () => { cancelled = true; };
    }
    setResolvedUrl2(input);
    return () => { cancelled = true; };
  }, [url]);

  const handleFileSelect = async (file: File) => {
    if (!currentUserId) {
      onError?.('User not authenticated');
      return;
    }
    try {
      const key = await upload(file);
      onUploadComplete?.(key);
    } catch (err: any) {
      const errorMsg = err.message || 'Upload failed';
      onError?.(errorMsg);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}
          ${uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
          transition-colors
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById(`avatar-file-${currentUserId}`)?.click()}
      >
        {url && !uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <img src={url} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
            <p className="text-sm text-gray-600">Click or drag to change avatar</p>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Uploading avatar...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Upload an avatar</p>
              <p className="text-xs text-gray-500">JPG, PNG, WEBP, AVIF, HEIC up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
        onChange={handleFileInput}
        className="hidden"
        id={`avatar-file-${currentUserId}`}
      />

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
};

// Default export for compatibility
export default Avatar;