
import React, { useState } from 'react';
import { usePosts } from '@/contexts/PostsContext';
import LeftSidebarContainer from './left/LeftSidebarContainer';

const LeftNavigationSidebar: React.FC = () => {
  const [showReelsViewer, setShowReelsViewer] = useState(false);
  const { posts } = usePosts();

  // Enhanced video file detection
  const isVideoFile = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.ogg', '.ogv'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           lowerUrl.includes('video') || 
           lowerUrl.includes('.mp4') || 
           (url.includes('supabase') && (lowerUrl.includes('mp4') || lowerUrl.includes('video')));
  };

  // Get real video reels from posts, sorted by newest first
  const realReels = posts
    .filter(post => post.content.images?.some(url => isVideoFile(url)))
    
    .map(post => ({
      id: post.id,
      videoUrl: post.content.images?.find(url => isVideoFile(url)) || '',
      thumbnail: post.content.images?.find(url => isVideoFile(url)) || '',
      creator: post.user.name,
      views: `${Math.floor(Math.random() * 10)}K`,
      title: post.content.text || 'Video Reel',
      caption: post.content.text || 'Amazing content! 🎥'
    }));


  const reels = realReels.slice(0, 6);

  return (
    <LeftSidebarContainer
      showReelsViewer={showReelsViewer}
      onCloseReelsViewer={() => setShowReelsViewer(false)}
      reels={reels}
    />
  );
};

export default LeftNavigationSidebar;
