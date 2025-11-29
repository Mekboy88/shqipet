
import React, { useState, useEffect } from 'react';
import '@/components/ui/skeleton-shimmer.css';
import { useLocation } from 'react-router-dom';
import ProfilePageHeader from './layout/ProfilePageHeader';
import ProfileContent from './ProfileContent';
import CoverPhotoDialog from './dialogs/CoverPhotoDialog';
import ProfileStyles from './layout/ProfileStyles';
import { featuredPhotos, photos, posts as samplePosts, friends } from './data/sampleData';
import { transformPostImagesToPics } from './utils/profileUtils';
import { useProfileState } from '@/hooks/useProfileState';
import { useProfileRefs } from './hooks/useProfileRefs';
import ProfileSettings from '@/pages/ProfileSettings';
import ProfileSettingsContext from '@/contexts/ProfileSettingsContext';
import { usePostsData } from '@/contexts/posts/usePostsData';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileSettings } from '@/hooks/useProfileSettings';
import { useGlobalCoverPhoto } from '@/hooks/useGlobalCoverPhoto';
import { useCover } from '@/hooks/media/useCover';
import { ProfileContentSkeleton } from './skeletons/ProfileSkeleton';
import { useUserPhotos } from '@/hooks/useUserPhotos';
const ProfilePage = React.memo(() => {
  // Use custom hooks to manage state and refs
  const profileState = useProfileState();
  const profileRefs = useProfileRefs();
  const { user } = useAuth();
  const { posts: allPosts, isLoading: postsLoading, fetchPosts } = usePostsData();
  const { userInfo: profileSettings } = useProfileSettings();
  const { getPhotosForDisplay } = useUserPhotos(user?.id);
  const location = useLocation();
  
  // Check if viewing own profile or someone else's
  const uidParam = (() => { 
    try { 
      return new URLSearchParams(location.search).get('uid'); 
    } catch { 
      return null; 
    } 
  })();
  const isOwnProfile = !uidParam || uidParam === user?.id;
  
  // Load posts when component mounts - no loading state for profile
  useEffect(() => {
    fetchPosts(false); // Don't show loading spinner for smooth UX
  }, [fetchPosts]);
  const { coverPhotoUrl: globalCoverUrl } = useGlobalCoverPhoto();
  // Also load via new cover system to ensure persistence across refresh
  const { resolvedUrl: coverResolvedUrl } = useCover();
  
  const posts = allPosts.filter(p => p.user_id === user?.id);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState('general');
  const [activeTab, setActiveTab] = useState('timeline');

  // Check if we're on the settings route and open settings accordingly
  useEffect(() => {
    const isSettingsRoute = location.pathname.includes('/settings');
    const searchParams = new URLSearchParams(location.search);
    const sectionFromUrl = searchParams.get('section');
    
    if (isSettingsRoute) {
      setIsSettingsOpen(true);
      if (sectionFromUrl) {
        setActiveSettingsSection(sectionFromUrl);
      }
    } else {
      // Do not auto-open settings on /profile based on query params; preserve page on refresh
      setIsSettingsOpen(false);
    }
  }, [location.pathname, location.search]);

  // Use resolved cover URL first, then global legacy, else empty
  const userCoverPhotoUrl = coverResolvedUrl || globalCoverUrl || '';

  const handleCompletionItemClick = (sectionId: string) => {
    setActiveSettingsSection(sectionId);
    setIsSettingsOpen(true);
  };

  const openSettings = (sectionId: string = 'general') => {
    setActiveSettingsSection(sectionId);
    setIsSettingsOpen(true);
  };

  const handleCoverPhotoUpdate = (newUrl: string) => {
    profileState.setCoverPhotoUrl(newUrl);
  };

  const contextValue = {
    isSettingsOpen,
    setIsSettingsOpen,
    activeSection: activeSettingsSection,
    setActiveSection: setActiveSettingsSection,
    openSettings,
    userInfo: profileSettings,
    setUserInfo: () => {}, // This is now handled by the hook
  };

  // Media helpers and transformers (robust across legacy and new fields)
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.ogg', '.ogv', '.flv', '.wmv'];
  const photoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tiff', '.ico'];

  const isVideoFile = (u?: string) => {
    if (!u || typeof u !== 'string') return false;
    const s = u.toLowerCase();
    return (
      videoExtensions.some(ext => s.endsWith(ext) || s.includes(ext + '?')) ||
      s.includes('video/') || s.includes('/video/') || s.includes('video-')
    );
  };

  const isPhotoFile = (u?: string) => {
    if (!u || typeof u !== 'string') return false;
    const s = u.toLowerCase();
    if (isVideoFile(s)) return false;
    return (
      photoExtensions.some(ext => s.endsWith(ext) || s.includes(ext + '?')) ||
      s.includes('image/') || s.includes('/image/') || s.includes('image-')
    );
  };

  const getAllMediaUrls = (post: any): string[] => {
    const urls: string[] = [];
    const pushAll = (arr?: any) => {
      if (!arr) return;
      if (Array.isArray(arr)) {
        arr.forEach((item) => {
          if (typeof item === 'string') urls.push(item);
          else if (item?.url) urls.push(item.url);
        });
      }
    };

    // Known locations across schemas
    pushAll(post.content_images);
    pushAll(post.content?.images);
    if (typeof post.content?.image === 'string') urls.push(post.content.image);
    pushAll(post.images);
    pushAll(post.media_urls);
    pushAll(post.attachments);
    if (typeof post.media_url === 'string') urls.push(post.media_url);

    // Deduplicate
    return Array.from(new Set(urls));
  };

  // Transform data for components - get photos and videos from posts
  const transformedPhotos = posts.flatMap(post => getAllMediaUrls(post).filter(isPhotoFile));

  // Also include photos saved in user_photos (profile, cover, gallery)
  const dbPhotos = getPhotosForDisplay();
  // Convert post photos to objects for consistency
  const postPhotoObjects = transformedPhotos.map(url => ({ url, photoId: null, type: 'post' }));
  // Combine with proper photo objects that have IDs
  const combinedPhotos = [...postPhotoObjects, ...dbPhotos];
  
  const transformedVideos = posts.flatMap(post => {
    const type = (((post as any).post_type) || post.postType || '').toLowerCase();
    const urls = getAllMediaUrls(post);
    const videosFromUrls = urls.filter(isVideoFile);
  
    if (['video', 'video_post', 'reel'].includes(type)) {
      // If type marks as video but detection failed, still fallback to first media
      return videosFromUrls.length ? videosFromUrls : (urls.length ? [urls[0]] : []);
    }
  
    return videosFromUrls;
  });

  console.log('🖼️ Profile media transformation debug:', {
    totalPosts: posts.length,
    postsWithImages: posts.filter(p => p.content?.images?.length > 0).length,
    allImages: posts.flatMap(p => p.content?.images || []),
    transformedPhotos: transformedPhotos.length,
    transformedVideos: transformedVideos.length,
    samplePosts: posts.slice(0, 3).map(p => ({
      id: p.id,
      postType: p.postType,
      contentImages: p.content?.images,
      hasImages: !!p.content?.images?.length
    }))
  });
  const transformedFriends = samplePosts.map((post, index) => ({
    id: index + 1,
    name: post.name,
    imageUrl: post.profilePic,
    category: ['all']
  }));

  return (
    <ProfileSettingsContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background border-r border-border">
        <ProfilePageHeader 
          headerRef={profileRefs.headerRef} 
          userData={profileState.userData} 
          coverPhotoUrl={userCoverPhotoUrl} 
          onEditCoverClick={() => profileState.setIsEditingCover(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOwnProfile={isOwnProfile}
        />

        <ProfileContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={profileSettings}
          profilePosts={posts}
          friendSuggestions={transformedFriends}
          photoItems={combinedPhotos}
          videoItems={transformedVideos}
          isMobile={false}
          onCompletionItemClick={handleCompletionItemClick}
        />

        <CoverPhotoDialog 
          isOpen={profileState.isEditingCover} 
          coverPhotoUrl={userCoverPhotoUrl} 
          onClose={() => profileState.setIsEditingCover(false)} 
          onCoverPhotoChange={profileState.handleCoverPhotoChange}
          onCoverPhotoUpdate={handleCoverPhotoUpdate}
        />

        <ProfileStyles />
      </div>
      
      {/* Render settings outside main container to prevent scroll interference */}
      {isSettingsOpen && <ProfileSettings />}
    </ProfileSettingsContext.Provider>
  );
});

ProfilePage.displayName = 'ProfilePage';

export default ProfilePage;
