// SHQIPET PLATFORM VIDEO SECURITY PROTECTION
// This file provides security measures to ensure only platform videos are played

// Global notification callback for blocked videos
let notificationCallback: ((url: string) => void) | null = null;

/**
 * Set notification callback for blocked videos
 * @param callback - Function to call when a video is blocked
 */
export const setVideoSecurityNotificationCallback = (callback: (url: string) => void) => {
  notificationCallback = callback;
};

// APPROVED VIDEO SOURCES - Only these domains/sources are allowed
const APPROVED_VIDEO_SOURCES = [
  // Supabase storage for Shqipet platform
  'supabase.co',
  'supabasecdn.com',
  
  // Wasabi storage for Shqipet platform  
  's3.wasabisys.com',
  'wasabisys.com',
  
  // Local development and testing
  'localhost',
  '127.0.0.1',
  
  // Platform specific domains (add your actual domain here)
  'shqipet.com',
  'shqipet.net',
  'shqipet.org',
  
  // Lovable sandbox domains for development
  'sandbox.lovable.dev',
  'lovable.dev',
  
  // Blob URLs for local file uploads
  'blob:'
];

// BLOCKED EXTERNAL SOURCES - Explicitly block these common external video sources
const BLOCKED_EXTERNAL_SOURCES = [
  'youtube.com',
  'youtu.be',
  'vimeo.com',
  'dailymotion.com',
  'tiktok.com',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'twitch.tv',
  'streamable.com',
  'imgur.com',
  'giphy.com',
  'gfycat.com',
  'tenor.com'
];

/**
 * SECURITY CHECK: Validate if a video URL is from approved Shqipet platform sources
 * @param url - Video URL to validate
 * @returns boolean - true if approved, false if blocked
 */
export const isApprovedVideoSource = (url: string): boolean => {
  if (!url) {
    console.warn('🚫 SECURITY: Empty video URL blocked');
    return false;
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check against blocked external sources first
    const isBlocked = BLOCKED_EXTERNAL_SOURCES.some(blocked => 
      hostname.includes(blocked.toLowerCase())
    );
    
    if (isBlocked) {
      console.error('🚫 SECURITY ALERT: Blocked external video source detected:', hostname);
      console.error('🚫 Full URL blocked:', url);
      
      // Notify the UI about blocked video
      if (notificationCallback) {
        notificationCallback(url);
      }
      
      return false;
    }
    
    // Check if source is in approved list
    const isApproved = APPROVED_VIDEO_SOURCES.some(approved => 
      hostname.includes(approved.toLowerCase()) || url.startsWith(approved)
    );
    
    if (!isApproved) {
      console.error('🚫 SECURITY ALERT: Unapproved video source detected:', hostname);
      console.error('🚫 Full URL blocked:', url);
      
      // Notify the UI about blocked video
      if (notificationCallback) {
        notificationCallback(url);
      }
      
      return false;
    }
    
    console.log('✅ SECURITY: Approved video source verified:', hostname);
    return true;
    
  } catch (error) {
    // If URL parsing fails, it might be a relative URL or blob
    if (url.startsWith('blob:') || 
        url.startsWith('/') || 
        url.startsWith('./') ||
        url.startsWith('uploads/') || // Shqipet platform uploads
        url.includes('/uploads/')) { // Alternative upload path format
      console.log('✅ SECURITY: Platform upload URL approved:', url.substring(0, 50) + '...');
      return true;
    }
    
    console.error('🚫 SECURITY ALERT: Invalid video URL blocked:', url);
    
    // Notify the UI about blocked video
    if (notificationCallback) {
      notificationCallback(url);
    }
    
    return false;
  }
};

/**
 * ENHANCED VIDEO FILE DETECTION with SECURITY VALIDATION
 * Only detects videos from approved Shqipet platform sources
 * @param url - URL to check
 * @returns boolean - true if valid platform video, false otherwise
 */
export const isSecureVideoFile = (url: string): boolean => {
  if (!url) return false;
  
  // FIRST: Security check - must pass security validation
  if (!isApprovedVideoSource(url)) {
    console.error('🚫 SECURITY: Video blocked by security validation:', url);
    
    // Notify the UI about blocked video
    if (notificationCallback) {
      notificationCallback(url);
    }
    
    return false;
  }
  
  // SECOND: File type validation
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.3gp', '.ogg', '.ogv'];
  const lowerUrl = url.toLowerCase();
  
  const hasVideoExtension = videoExtensions.some(ext => lowerUrl.includes(ext));
  const hasVideoIndicator = lowerUrl.includes('video') || lowerUrl.includes('mp4');
  const isSupabaseVideo = url.includes('supabase') && (lowerUrl.includes('mp4') || lowerUrl.includes('video') || lowerUrl.includes('webm'));
  const hasMimeType = lowerUrl.includes('video/');
  
  const isValidVideoFile = hasVideoExtension || hasVideoIndicator || isSupabaseVideo || hasMimeType;
  
  if (isValidVideoFile) {
    console.log('✅ SECURITY: Approved platform video detected:', url.substring(0, 100) + '...');
    return true;
  }
  
  return false;
};

/**
 * VALIDATE VIDEO BEFORE PLAYBACK - Last line of defense
 * Call this before any video starts playing
 * @param videoElement - HTML video element
 * @returns boolean - true if safe to play, false if should be blocked
 */
export const validateVideoBeforePlayback = (videoElement: HTMLVideoElement): boolean => {
  if (!videoElement || !videoElement.src) {
    console.warn('🚫 SECURITY: No video source found');
    return false;
  }
  
  const isSecure = isApprovedVideoSource(videoElement.src);
  
  if (!isSecure) {
    console.error('🚫 SECURITY CRITICAL: Blocking video playback for unauthorized source:', videoElement.src);
    
    // CRITICAL: Remove the source and stop playback
    videoElement.pause();
    videoElement.removeAttribute('src');
    videoElement.load(); // Reset the video element
    
    return false;
  }
  
  console.log('✅ SECURITY: Video playback authorized for platform source');
  return true;
};

/**
 * ADD NEW APPROVED SOURCE (for admin use)
 * @param domain - New domain to approve
 */
export const addApprovedSource = (domain: string): void => {
  if (!APPROVED_VIDEO_SOURCES.includes(domain)) {
    APPROVED_VIDEO_SOURCES.push(domain);
    console.log('✅ SECURITY: Added new approved video source:', domain);
  }
};

/**
 * GET CURRENT APPROVED SOURCES (for debugging)
 */
export const getApprovedSources = (): string[] => {
  return [...APPROVED_VIDEO_SOURCES];
};

export default {
  isApprovedVideoSource,
  isSecureVideoFile,
  validateVideoBeforePlayback,
  addApprovedSource,
  getApprovedSources,
  setVideoSecurityNotificationCallback
};