
// Cache for video durations to avoid repeated checks
const durationCache = new Map<string, number>();

// Utility to get video duration with caching and timeout
export const getVideoDuration = (videoUrl: string): Promise<number> => {
  // Check cache first
  if (durationCache.has(videoUrl)) {
    return Promise.resolve(durationCache.get(videoUrl)!);
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true; // Ensure no audio to speed up loading
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      resolve(0);
    }, 3000); // 3 second timeout
    
    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      const duration = video.duration;
      durationCache.set(videoUrl, duration); // Cache the result
      resolve(duration);
    };
    
    video.onerror = () => {
      clearTimeout(timeout);
      durationCache.set(videoUrl, 0); // Cache error result
      resolve(0);
    };
    
    video.src = videoUrl;
  });
};

// Check if video is suitable for reels (5 seconds to 2 minutes) with optimistic approach
export const isReelsSuitable = async (videoUrl: string): Promise<boolean> => {
  try {
    const duration = await getVideoDuration(videoUrl);
    return duration >= 5 && duration <= 120; // 5 seconds to 2 minutes for reels
  } catch (error) {
    console.error('Error checking video duration:', error);
    return false;
  }
};

// Batch process video suitability checks for better performance
export const batchCheckReelsSuitability = async (videoUrls: string[]): Promise<boolean[]> => {
  const promises = videoUrls.map(url => isReelsSuitable(url));
  return Promise.all(promises);
};
