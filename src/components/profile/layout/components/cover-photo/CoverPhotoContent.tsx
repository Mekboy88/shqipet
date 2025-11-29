import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useGlobalCoverPhoto } from '@/hooks/useGlobalCoverPhoto';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import CoverPhotoOverlay from './CoverPhotoOverlay';
import CoverPhotoControls from './CoverPhotoControls';

import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';
import LoadingDots from '@/components/ui/LoadingDots';
import { toast } from 'sonner';
import UploadAnimation from '@/components/ui/UploadAnimation';
import CoverUploadAnimation from '@/components/ui/CoverUploadAnimation';
import { useCover } from '@/hooks/media/useCover';
import { mediaService } from '@/services/media/MediaService';

interface CoverPhotoContentProps {
  coverPhotoUrl: string;
  isDragMode: boolean;
  isDragging: boolean;
  isSaving?: boolean;
  coverRef: React.RefObject<HTMLDivElement>;
  buttonColor: string;
  onDragModeToggle: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
  onEditCoverClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onButtonColorChange: (color: string) => void;
  showProfileInfo?: boolean;
  containerClassName?: string;
  isOwnProfile?: boolean; // Pass down to controls
  miniMode?: boolean; // Pass down to controls
  showControls?: boolean; // Control visibility of edit buttons
  isSettingsPanelOpen?: boolean; // Track if settings panel is open
  onToggleSettingsPanel?: () => void; // Toggle settings panel
}

const CoverPhotoContent: React.FC<CoverPhotoContentProps> = ({
  coverPhotoUrl,
  isDragMode,
  isDragging,
  isSaving,
  coverRef,
  buttonColor,
  onDragModeToggle,
  onSaveChanges,
  onCancelChanges,
  onEditCoverClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onButtonColorChange,
  showProfileInfo = true,
  containerClassName,
  isOwnProfile = true,
  miniMode = false,
  showControls = true,
  isSettingsPanelOpen = false,
  onToggleSettingsPanel
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { displayName, role: userRole } = useUniversalUser(); // Get role from universal user
  const { userRole: contextRole } = useUserRole(); // Backup from context
  const { uploadAvatar, isLoading: avatarUploading, uploadProgress: avatarProgress } = useGlobalAvatar();
  const { userInfo } = useProfileSettings();
  const { coverPhotoUrl: globalCoverUrl, coverPosition, coverGradient, isLoading: coverLoading } = useGlobalCoverPhoto();
  const { resolvedUrl, lastGoodUrl, position: coverPositionV2, loading: coverLoadingV2 } = useCover();

  // Debug banner for resolver failures (enabled via ?coverDebug=1)
  const showDebug = (() => { try { const p = new URLSearchParams(window.location.search); return p.get('coverDebug') === '1'; } catch { return false; } })();
  const [resolverDown, setResolverDown] = useState(false);
  useEffect(() => {
    const handler = () => {
      setResolverDown(true);
      // Auto-hide after 10s
      const t = setTimeout(() => setResolverDown(false), 10000);
      return () => clearTimeout(t);
    };
    window.addEventListener('media-resolve-failed', handler);
    return () => window.removeEventListener('media-resolve-failed', handler);
  }, []);

  // Local avatar upload from profile header
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const triggerAvatarInput = () => avatarFileInputRef.current?.click();
  const handleAvatarFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      if (!file) return;
      // Accept broader set of safe image formats (MIME or extension), tolerate unknown mobile MIME
      const allowedMime = ['image/jpeg','image/jpg','image/pjpeg','image/jfif','image/png','image/webp','image/avif','image/heic','image/heif'];
      const allowedExt = ['jpg','jpeg','jfif','pjpeg','png','webp','avif','heic','heif'];
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      const isOk = allowedMime.includes(file.type) || allowedExt.includes(ext) || file.type === '' || file.type === 'application/octet-stream';
      if (!isOk) {
        toast.error('Unsupported format. Allowed: JPG, PNG, WEBP, AVIF, HEIC.');
        return;
      }
      await uploadAvatar(file);
      toast.success('Profile photo updated');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to update profile photo';
      toast.error(msg);
      console.error('Avatar upload error:', e);
    } finally {
      if (event.target) event.target.value = '';
    }
  };
  // Separate upload state from general loading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulated progress for cover upload - only during actual uploads
  useEffect(() => {
    if (isUploading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, [isUploading]);

  // Listen for upload events from cover hooks
  useEffect(() => {
    const handleUploadStart = () => setIsUploading(true);
    const handleUploadEnd = () => setIsUploading(false);
    
    // Listen to custom events from cover hooks
    window.addEventListener('cover-upload-start', handleUploadStart);
    window.addEventListener('cover-upload-end', handleUploadEnd);
    
    return () => {
      window.removeEventListener('cover-upload-start', handleUploadStart);
      window.removeEventListener('cover-upload-end', handleUploadEnd);
    };
  }, []);

  // Prefer full name from profile cache/auth, fallback to universal displayName; never blank
  const profileDisplayName = (() => {
    const fullFromProfile = [userInfo?.first_name, userInfo?.last_name].filter(Boolean).join(' ').trim();
    if (fullFromProfile) return fullFromProfile;
    const meta = (user as any)?.user_metadata || {};
    const fullFromAuth = [meta.first_name, meta.last_name].filter(Boolean).join(' ').trim();
    if (fullFromAuth) return fullFromAuth;
    if (displayName) return displayName;
    return '';
  })();

  // Get display role (use universal user role or fallback to context role)
  const displayRole = userRole || contextRole || 'user';
  
  // Format role for display
  const formatRole = (role: string) => {
    const roleMap: Record<string, string> = {
      'user': 'User',
      'moderator': 'Moderator',
      'admin': 'Admin',
      'super_admin': 'Super Admin',
      'platform_owner_root': 'Platform Owner'
    };
    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Choose best candidate: resolved -> lastGood -> cached(localStorage) -> global -> prop
  const cachedLast = (() => {
    try {
      const id = user?.id;
      if (!id) return null;
      const raw = localStorage.getItem(`cover:last:${id}`);
      if (!raw) return null;
      const j = JSON.parse(raw);
      return typeof j?.url === 'string' ? j.url : null;
    } catch { return null; }
  })();
  const baseCandidate = resolvedUrl || lastGoodUrl || cachedLast || globalCoverUrl || coverPhotoUrl || null;
  
  // Initialize with any direct URL immediately to prevent initial flicker
  const [displayUrl, setDisplayUrl] = useState<string | null>(() => {
    const input = baseCandidate;
    if (!input) return null;
    return /^(https?:|blob:|data:)/.test(input) ? input : null;
  });

  useEffect(() => {
    let cancelled = false;
    const input = baseCandidate;
    if (!input) {
      setDisplayUrl(null);
      return;
    }
    const isDirect = /^(https?:|blob:|data:)/.test(input);
    if (isDirect) {
      setDisplayUrl(input);
      return;
    }
    mediaService
      .getUrl(input)
      .then((url) => {
        if (!cancelled) setDisplayUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDisplayUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [baseCandidate]);
  
  // Debug logging
  console.log('🖼️ Cover Photo Debug:', { 
    globalCoverUrl,
    resolvedUrl,
    baseCandidate,
    displayUrl,
    coverPositionGlobal: coverPosition,
    coverPositionV2,
    effectivePosition: coverPositionV2 || coverPosition,
    coverLoadingCombined: coverLoading || coverLoadingV2
  });

  // Keep DOM position in sync via style prop only to avoid double writes
  useEffect(() => {
    // no-op: backgroundPosition is controlled by style with lastPositionRef
  }, [coverPosition]);

  // Refresh avatar data when user metadata changes (name updates)
  useEffect(() => {
    if (user?.user_metadata?.first_name || user?.user_metadata?.last_name) {
      // No refresh needed with global system
    }
  }, [user?.user_metadata?.first_name, user?.user_metadata?.last_name]);

  const handleCoverMouseDown = (e: React.MouseEvent) => {
    // Only handle mouse down for dragging if in drag mode and not clicking on controls
    if (isDragMode && e.target === e.currentTarget) {
      onMouseDown(e);
    }
  };

  // Normalize to vertical-only (force X to center)
  const normalizePosition = (pos?: string | null) => {
    if (!pos) return 'center center';
    const parts = pos.trim().split(/\s+/);
    const y = parts[1] ?? parts[0] ?? '50%';
    return `center ${y}`;
  };
  const effectivePosition = coverPositionV2 || coverPosition;
  const normalizedPosition = normalizePosition(effectivePosition);
  // Persist last applied position to avoid resets on remounts
  const lastPositionRef = useRef<string>(normalizedPosition);
  useEffect(() => {
    if (normalizedPosition) lastPositionRef.current = normalizedPosition;
  }, [normalizedPosition]);
  return (
    <div 
      ref={coverRef}
      className={`p-4 rounded-b-xl relative mx-auto overflow-hidden border border-border shadow-sm bg-muted ${containerClassName ?? 'h-[500px] max-w-[1200px] w-full'}`}
      style={{
        ...(displayUrl ? { backgroundImage: `url(${displayUrl})` } : {}),
        backgroundSize: 'cover',
        backgroundPosition: lastPositionRef.current,
        backgroundRepeat: 'no-repeat',
        cursor: isDragMode ? (isDragging ? 'grabbing' : 'grab') : 'default',
        transition: isDragging ? 'none' : 'cursor 0.2s ease'
      }}
      onMouseDown={handleCoverMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {showDebug && resolverDown && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 rounded-md border bg-background/90 backdrop-blur px-3 py-1 text-xs shadow">
          Media resolver failed; using fallback if available
        </div>
      )}
      <CoverPhotoOverlay isDragMode={isDragMode} />
      
      {/* Custom Cover Upload Animation - Full Screen Overlay */}
      <CoverUploadAnimation 
        isUploading={isUploading} 
        progress={uploadProgress} 
      />

      {/* Saving overlay when reposition is being saved */}
      {isSaving && (
        <LoadingDots message="Saving changes..." variant="light" size="md" />
      )}

      {/* Cover Photo Controls - only show on profile page, not in settings (miniMode) */}
      {isOwnProfile && !miniMode && showControls && (
        <CoverPhotoControls
          isDragMode={isDragMode}
          isSaving={isSaving ?? false}
          buttonColor={buttonColor}
          onDragModeToggle={onDragModeToggle}
          onSaveChanges={onSaveChanges}
          onCancelChanges={onCancelChanges}
          onEditCoverClick={onEditCoverClick}
          onMouseDown={onMouseDown}
          onButtonColorChange={onButtonColorChange}
          isOwnProfile={isOwnProfile}
          miniMode={miniMode}
        />
      )}

      {/* Settings Page Controls - Show arrow and camera buttons */}
      {isOwnProfile && miniMode && !isDragMode && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {/* Arrow button - opens settings panel */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSettingsPanel?.();
            }}
            className="bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-200 p-2"
          >
            <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
              <g>
                <path fill="#e6e6e6" d="M16 8l-3-3v2h-4v-4h2l-3-3-3 3h2v4h-4v-2l-3 3 3 3v-2h4v4h-2l3 3 3-3h-2v-4h4v2z"></path>
              </g>
            </svg>
          </button>
          
          {/* Camera button - edits cover photo */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditCoverClick();
            }}
            className="bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-200 p-2"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
              <g>
                <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M14.35 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V9" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M22.3098 3.16996L17.2098 8.26005C16.7098 8.77005 15.2098 8.99996 14.8698 8.66996C14.5298 8.33996 14.7598 6.82999 15.2698 6.31999L20.3599 1.23002C20.6171 0.964804 20.9692 0.812673 21.3386 0.807047C21.7081 0.80142 22.0646 0.942731 22.3298 1.19999C22.5951 1.45725 22.7472 1.8093 22.7529 2.17875C22.7585 2.5482 22.6171 2.90475 22.3599 3.16996H22.3098Z" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
            </svg>
          </button>
        </div>
      )}

      {/* Profile Picture - positioned at bottom left with upload animation */}
      <div className="absolute bottom-4 left-4">
        <UploadAnimation
          isUploading={avatarUploading}
          progress={avatarProgress || 0}
          type="avatar"
        >
          <div 
            className="relative cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label="Change profile photo"
            onClick={(e) => {
              e.stopPropagation();
              triggerAvatarInput();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerAvatarInput();
              }
            }}
          >
            <Avatar 
              size="2xl"
              className="shadow-lg rounded-full"
              style={{ width: 160, height: 160, minWidth: 160, minHeight: 160 }}
            />
            {/* Hover camera overlay */}
            <div 
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-20"
              role="button"
              tabIndex={0}
              aria-label="Change profile photo"
              onClick={(e) => {
                e.stopPropagation();
                triggerAvatarInput();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  triggerAvatarInput();
                }
              }}
            >
              {/* Custom camera add icon */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
                <g>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 10.25C12.4142 10.25 12.75 10.5858 12.75 11V12.25H14C14.4142 12.25 14.75 12.5858 14.75 13C14.75 13.4142 14.4142 13.75 14 13.75H12.75V15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V13.75H10C9.58579 13.75 9.25 13.4142 9.25 13C9.25 12.5858 9.58579 12.25 10 12.25H11.25V11C11.25 10.5858 11.5858 10.25 12 10.25Z" fill="currentColor"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.77778 21H14.2222C17.3433 21 18.9038 21 20.0248 20.2646C20.51 19.9462 20.9267 19.5371 21.251 19.0607C22 17.9601 22 16.4279 22 13.3636C22 10.2994 22 8.76721 21.251 7.6666C20.9267 7.19014 20.51 6.78104 20.0248 6.46268C19.3044 5.99013 18.4027 5.82123 17.022 5.76086C16.3631 5.76086 15.7959 5.27068 15.6667 4.63636C15.4728 3.68489 14.6219 3 13.6337 3H10.3663C9.37805 3 8.52715 3.68489 8.33333 4.63636C8.20412 5.27068 7.63685 5.76086 6.978 5.76086C5.59733 5.82123 4.69555 5.99013 3.97524 6.46268C3.48995 6.78104 3.07328 7.19014 2.74902 7.6666C2 8.76721 2 10.2994 2 13.3636C2 16.4279 2 17.9601 2.74902 19.0607C3.07328 19.5371 3.48995 19.9462 3.97524 20.2646C5.09624 21 6.65675 21 9.77778 21ZM16 13C16 15.2091 14.2091 17 12 17C9.79086 17 8 15.2091 8 13C8 10.7909 9.79086 9 12 9C14.2091 9 16 10.7909 16 13ZM18 9.25C17.5858 9.25 17.25 9.58579 17.25 10C17.25 10.4142 17.5858 10.75 18 10.75H19C19.4142 10.75 19.75 10.4142 19.75 10C19.75 9.58579 19.4142 9.25 19 9.25H18Z" fill="currentColor"/>
                </g>
              </svg>
            </div>
          </div>
        </UploadAnimation>
        {/* Hidden file input for avatar upload */}
        <input 
          ref={avatarFileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
          onChange={handleAvatarFileUpload}
          className="hidden"
        />
      </div>

      {/* User Info - positioned on the right side next to profile picture */}
      {(showProfileInfo || miniMode) && profileDisplayName && (
        <div className="absolute bottom-8 left-48 pt-4">
          <h1 className="font-bold text-white mb-1 text-3xl drop-shadow-lg">
            {profileDisplayName}
          </h1>
          <button 
            onClick={() => navigate('/professional-presentation')}
            className="mt-2 px-4 py-1.5 border border-white/30 text-white backdrop-blur-sm rounded-md text-sm font-medium flex items-center gap-2 hover:bg-white/20"
            style={{ backgroundColor: buttonColor, transition: 'none' }}
          >
            Prezantimi profesional
            <svg fill="currentColor" version="1.1" height="16" width="16" viewBox="0 0 256 240" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 256 240" xmlSpace="preserve" className="flex-shrink-0">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M235.813,50.5H254v36.375h-97V50.5h18.188v6.063h12.125V50.5h36.375v6.063h12.125V50.5z M254,20.188v24.25h-97v-24.25 h30.313V2h36.375v18.188H254z M194.891,20.188h21.219V9.578h-21.219V20.188z M31.002,145.014c0-2.499,1.606-4.194,4.194-4.194 s4.194,1.606,4.194,4.194V238h91.469v-92.986c0-2.499,1.606-4.194,4.194-4.194c2.499,0,4.194,1.606,4.194,4.194V238h29.092V136.625 c0-22.934-18.74-41.585-41.585-41.585h-8.388L85.17,154.336L53.401,95.04h-9.816C20.651,95.04,2,113.78,2,136.625V238h29.092 v-92.986H31.002z M86.474,83.69c-28.043,0-51.089-20.685-54.976-47.618c0.555,1.249,1.527,2.082,2.499,3.054 c6.108,6.108,16.243,6.108,22.351,0c0.972-0.972,1.805-2.082,2.499-3.054c5.553-9.718,16.104-16.382,27.766-16.382 c17.492,0,32.069,14.161,32.069,32.069S104.383,83.69,86.474,83.69z M73.17,107.04c0-6.627,5.373-12,12-12s12,5.373,12,12 s-5.373,12-12,12S73.17,113.668,73.17,107.04z"></path>
              </g>
            </svg>
          </button>
        </div>
      )}

    </div>
  );
};

export default CoverPhotoContent;