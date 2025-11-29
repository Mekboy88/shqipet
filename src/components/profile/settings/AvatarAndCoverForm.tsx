/**
 * AvatarAndCoverForm – fixed persistence + smooth loading (Vite version)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { useGlobalCoverPhoto } from '@/hooks/useGlobalCoverPhoto';
import { useCoverPhotoDrag } from '@/components/profile/layout/components/cover-photo/hooks/useCoverPhotoDrag';
import CoverPhotoContent from '@/components/profile/layout/components/cover-photo/CoverPhotoContent';
import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';
import UploadAnimation from '@/components/ui/UploadAnimation';
import CoverUploadAnimation from '@/components/ui/CoverUploadAnimation';
import { useCover } from '@/hooks/media/useCover';
import {
  Avatar as UIAvatar,
  AvatarImage as UIAvatarImage,
  AvatarFallback as UIAvatarFallback,
} from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { supabase } from '@/integrations/supabase/client';
import { mediaService } from '@/services/media/MediaService';
import { useAuth } from '@/contexts/AuthContext';
import CoverSettingsPanel from './CoverSettingsPanel';
import { useCoverControlsPreference } from '@/hooks/useCoverControlsPreference';

/* --------------------------- helpers & utilities -------------------------- */

// SUPABASE_URL not needed here; mediaService handles URL resolution

// Proxy URL removed; using mediaService.getUrl for keys

function extractKeyFromAnyUrl(u?: string | null): string | null {
  if (!u) return null;
  // never treat blob/data/http(s) as keys
  if (/^(blob:|data:|https?:)/.test(u)) return null;
  try {
    const url = new URL(u);
    const k = url.searchParams.get('key');
    if (k) return k;
    if (url.hostname.includes('wasabisys.com')) {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length >= 2) return parts.slice(1).join('/');
    }
  } catch {
    // If it's not a full URL and not a known scheme, assume it's a Wasabi key
    return u;
  }
  return null;
}

function useSmoothProgress(active: boolean) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = t - last;
      last = t;
      setProgress((p) => Math.min(90, p + (p < 70 ? dt * 0.12 : dt * 0.05)));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const finish = () => {
    setProgress(100);
    setTimeout(() => setProgress(0), 350);
  };
  return { progress: Math.round(progress), finish };
}

/* --------------------------------- main ---------------------------------- */

const AvatarAndCoverForm: React.FC = () => {
  const { user } = useAuth();
  const {
    coverPhotoUrl: globalCoverUrl,
    coverPosition,
    isLoading: globalCoverLoading,
  } = useGlobalCoverPhoto();

  const { value: showCoverControls, setValue: setShowCoverControls } = useCoverControlsPreference();
  
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);

const { resolvedUrl: coverResolvedUrl, updateCover: updateCoverV2, refresh: refreshCoverV2 } = useCover();

  const {
    avatarUrl,
    uploadAvatar,
    isLoading: avatarLoading,
    uploadProgress: avatarProgress,
  } = useGlobalAvatar();

  const {
    isDragging,
    isDragMode,
    isSaving,
    coverRef,
    buttonColor,
    handleDragModeToggle,
    handleSaveChanges,
    handleCancelChanges,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleButtonColorChange
  } = useCoverPhotoDrag();

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const triggerAvatarInput = () => avatarFileInputRef.current?.click();
  const triggerCoverInput = () => coverFileInputRef.current?.click();

  const [coverUploading, setCoverUploading] = useState(false);
  const { progress: coverProgress, finish: finishCoverProgress } = useSmoothProgress(coverUploading);

  // Listen for upload events to show custom animation
  useEffect(() => {
    const handleUploadStart = () => setCoverUploading(true);
    const handleUploadEnd = () => setCoverUploading(false);
    
    window.addEventListener('cover-upload-start', handleUploadStart);
    window.addEventListener('cover-upload-end', handleUploadEnd);
    
    return () => {
      window.removeEventListener('cover-upload-start', handleUploadStart);
      window.removeEventListener('cover-upload-end', handleUploadEnd);
    };
  }, []);

  const [displayedUrl, setDisplayedUrl] = useState<string>('');

// coverKey no longer needed; display URL resolves directly via mediaService


useEffect(() => {
    const candidate = coverResolvedUrl || globalCoverUrl || null;
    if (!candidate) { setDisplayedUrl(''); return; }
    const isDirect = /^(https?:|blob:|data:)/.test(candidate);
    if (isDirect) { setDisplayedUrl(candidate); return; }
    let cancelled = false;
    const key = extractKeyFromAnyUrl(candidate) || candidate;
    mediaService.getUrl(key)
      .then((url) => { if (!cancelled) setDisplayedUrl(url); })
      .catch(() => { if (!cancelled) setDisplayedUrl(''); });
    return () => { cancelled = true; };
  }, [globalCoverUrl, coverResolvedUrl]);


  useEffect(() => {
    if (coverRef.current && coverPosition) {
      coverRef.current.style.backgroundPosition = coverPosition;
    }
  }, [coverPosition, coverRef]);

  function normalizeUploadResultToKey(result: any, fallbackUrl?: string | null): string {
    if (!result && fallbackUrl) {
      const k = extractKeyFromAnyUrl(fallbackUrl);
      if (k) return k;
    }
    if (typeof result === 'string') return extractKeyFromAnyUrl(result) || result;
    if (result?.key) return result.key;
    if (result?.fileKey) return result.fileKey;
    if (result?.url) {
      const k = extractKeyFromAnyUrl(result.url);
      if (k) return k;
    }
    if (fallbackUrl) {
      const k = extractKeyFromAnyUrl(fallbackUrl);
      if (k) return k;
    }
    throw new Error('Could not determine cover_key from upload result');
  }

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAvatar(file);
      toast.success('Profile photo updated successfully');
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error('Failed to upload profile photo');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Use unified cover hook which handles persistence internally
      const result = await updateCoverV2(file);

      // Resolve key just for optimistic display
      const newKey = normalizeUploadResultToKey(result, coverResolvedUrl || globalCoverUrl);

      // Optimistic show (the hook already persisted the key)
      const url = await mediaService.getUrl(newKey);
      const img = new Image();
      img.src = url;
      img.onload = () => setDisplayedUrl(url);
      setDisplayedUrl(url);

      // Refresh hook state
      try { await refreshCoverV2?.(); } catch {}

      toast.success('Cover photo updated successfully');
    } catch (err: any) {
      console.error('Cover upload error:', err);
      toast.error(err?.message || 'Failed to upload cover photo');
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleCoverMouseDown = (ev: React.MouseEvent) => {
    if (isDragMode && ev.target === ev.currentTarget) handleMouseDown(ev);
  };

  const handleToggleCoverControls = (checked: boolean) => {
    setShowCoverControls(checked);
    toast.success(checked ? 'Cover controls enabled' : 'Cover controls hidden');
  };

  const isCoverLoading = coverUploading;

  return (
    <div className="space-y-6 p-6">
      {/* Custom Cover Upload Animation - Full Screen Overlay */}
      <CoverUploadAnimation 
        isUploading={isCoverLoading} 
        progress={isCoverLoading ? coverProgress : 0} 
      />
      
      <CoverPhotoContent
          coverPhotoUrl={displayedUrl || ''}
          isDragMode={isDragMode}
          isDragging={isDragging}
          isSaving={isSaving}
          coverRef={coverRef}
          buttonColor={buttonColor}
          onDragModeToggle={handleDragModeToggle}
          onSaveChanges={handleSaveChanges}
          onCancelChanges={handleCancelChanges}
          onEditCoverClick={triggerCoverInput}
          onMouseDown={handleCoverMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onButtonColorChange={handleButtonColorChange}
          showProfileInfo={false}
          containerClassName="!h-auto aspect-[12/5] w-full max-w-[1200px]"
          isOwnProfile={true}
          miniMode={true}
          showControls={showCoverControls}
          isSettingsPanelOpen={isSettingsPanelOpen}
          onToggleSettingsPanel={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
        />

      {/* Cover Settings Panel */}
      <CoverSettingsPanel
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        buttonColor={buttonColor}
        onButtonColorChange={handleButtonColorChange}
        isDragMode={isDragMode}
        onDragModeToggle={handleDragModeToggle}
        onSaveChanges={handleSaveChanges}
        onCancelChanges={handleCancelChanges}
        isSaving={isSaving}
      />

      {/* Cover Controls Toggle - with smooth transition */}
      <div className={`flex items-center justify-between p-4 border border-border rounded-lg bg-card transition-all duration-500 ${
        isSettingsPanelOpen ? 'mt-6' : 'mt-0'
      }`}>
        <div className="space-y-2">
          <Label htmlFor="cover-controls-toggle" className="text-sm font-medium">
            Show Cover Photo Controls
          </Label>
          <p className="text-xs text-muted-foreground">
            When turned off, the{' '}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline w-3.5 h-3.5 mx-0.5 -mt-0.5">
              <g>
                <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M14.35 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M22.3098 3.16996L17.2098 8.26005C16.7098 8.77005 15.2098 8.99996 14.8698 8.66996C14.5298 8.33996 14.7598 6.82999 15.2698 6.31999L20.3599 1.23002C20.6171 0.964804 20.9692 0.812673 21.3386 0.807047C21.7081 0.80142 22.0646 0.942731 22.3298 1.19999C22.5951 1.45725 22.7472 1.8093 22.7529 2.17875C22.7585 2.5482 22.6171 2.90475 22.3599 3.16996H22.3098Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </g>
            </svg>{' '}
            edit,{' '}
            <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" className="inline w-3.5 h-3.5 mx-0.5 -mt-0.5">
              <g>
                <path fill="currentColor" d="M16 8l-3-3v2h-4v-4h2l-3-3-3 3h2v4h-4v-2l-3 3 3 3v-2h4v4h-2l3 3 3-3h-2v-4h4v2z"></path>
              </g>
            </svg>{' '}
            reposition, and{' '}
            <svg viewBox="0 0 1024 1024" className="inline w-3.5 h-3.5 mx-0.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg">
              <path d="M539.4 550.9m-164.7 0a164.7 164.7 0 1 0 329.4 0 164.7 164.7 0 1 0-329.4 0Z" fill="currentColor"/>
              <path d="M679.3 405.4c-8.9-14-27.4-18.2-41.4-9.3-14 8.9-18.2 27.4-9.3 41.4 14 22.1 21.4 47.7 21.4 74 0 16.6 13.4 30 30 30s30-13.4 30-30c0-37.7-10.6-74.4-30.7-106.1z" fill="currentColor"/>
              <path d="M607.4 611.4c-25.9 24.9-60 38.6-96 38.6-76.4 0-138.5-62.1-138.5-138.5S435 373 511.4 373c22.9 0 44.7 5.4 64.8 16 14.6 7.8 32.8 2.2 40.6-12.5 7.8-14.6 2.2-32.8-12.5-40.6-28.4-15.1-60.5-23-92.9-23-109.5 0-198.5 89.1-198.5 198.5C312.9 620.9 402 710 511.5 710c51.5 0 100.4-19.7 137.5-55.4 11.9-11.5 12.3-30.5 0.8-42.4-11.4-11.9-30.4-12.3-42.4-0.8z" fill="currentColor"/>
              <path d="M853.7 370.4c-17.4-42.2-14.2-90.5 7.7-138.6a448.25 448.25 0 0 0-68.7-69c-48.2 21.8-96.6 24.9-138.8 7.4-42.3-17.6-74.3-54.2-92.8-104-16.4-1.8-33-2.7-49.8-2.7-15.9 0-31.6 0.8-47.1 2.5-18.7 49.8-50.7 86.4-93.1 104-42.5 17.6-91.2 14.1-139.7-8.2-25.2 20.2-48.1 43-68.4 68.1 22.3 48.6 25.6 97.3 7.9 139.9-17.7 42.6-54.6 74.6-104.9 93.1-1.7 16-2.6 32.3-2.6 48.7 0 16.1 0.9 32 2.5 47.6 50.2 18.6 87.1 50.8 104.7 93.4 17.6 42.6 14.1 91.3-8.2 139.9 20.2 25.1 43.1 48 68.3 68.3 48.6-22.2 97.3-25.5 139.8-7.8 42.4 17.6 74.3 54.3 92.9 104.2 15.8 1.7 31.9 2.6 48.2 2.6 16.5 0 32.7-0.9 48.7-2.6 18.7-49.8 50.7-86.3 93.1-103.8 42.2-17.4 90.6-14.2 138.8 7.7 25.4-20.4 48.5-43.5 68.9-68.9-21.8-48.2-24.9-96.5-7.3-138.7 17.5-42.1 53.9-74 103.3-92.5 1.8-16.2 2.7-32.7 2.7-49.3 0-16.3-0.9-32.4-2.6-48.2-49.8-19-86-50.9-103.5-93.1zM798 630.3c-21.8 52.5-21 110.8 0.6 168.3-57.5-21.7-115.8-22.7-168.3-1-52.6 21.7-93.2 63.5-118.6 119.4-25.3-56-65.8-97.9-118.3-119.7-25.8-10.7-53.1-16-80.9-16-28.8 0-58.2 5.6-87.4 16.6 21.7-57.5 22.7-115.8 1-168.3-21.7-52.6-63.5-93.2-119.4-118.6 56-25.3 97.9-65.8 119.7-118.3 21.8-52.5 21-110.8-0.6-168.3 29.4 11.1 59 16.8 87.9 16.8 27.7 0 54.7-5.2 80.4-15.8 52.6-21.7 93.2-63.5 118.6-119.4 25.3 56 65.8 97.9 118.3 119.7 52.5 21.8 110.8 21 168.3-0.6-21.7 57.5-22.7 115.8-1 168.3C820 446 861.8 486.6 917.7 512c-56 25.2-97.9 65.7-119.7 118.3z" fill="currentColor"/>
            </svg>{' '}
            color picker buttons will be hidden from your profile cover photo. 
            This gives you a cleaner look when viewing your profile. You can turn them back on anytime from this settings page.
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            Note: These controls are only visible to you on your own profile. Other users never see these buttons.
          </p>
        </div>
          <Switch
            id="cover-controls-toggle"
            checked={showCoverControls}
            onCheckedChange={handleToggleCoverControls}
            className="cursor-pointer pointer-events-auto"
          />
      </div>

      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
        onChange={handleAvatarFileUpload}
        className="hidden"
      />
      <input
        ref={coverFileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
        onChange={handleCoverFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default AvatarAndCoverForm;
