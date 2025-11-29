export const generateVideoThumbnail = async (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true; // Ensure no audio plays during thumbnail generation
    
    video.onloadedmetadata = () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 480;
      canvas.height = video.videoHeight || 270;
      
      // Seek to a small time to get a proper frame (avoid black first frame)
      video.currentTime = 0.5;
    };
    
    video.onseeked = () => {
      try {
        // Draw the video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to data URL
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        
        // Clean up
        video.remove();
        canvas.remove();
        
        resolve(thumbnailDataUrl);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        reject(error);
      }
    };
    
    video.onerror = (error) => {
      console.error('Video load error for thumbnail:', error);
      video.remove();
      canvas.remove();
      reject(new Error('Failed to load video for thumbnail'));
    };
    
    // Handle timeout via setTimeout instead of ontimeout
    
    // Set a timeout to prevent hanging
    setTimeout(() => {
      if (video.readyState < 1) {
        video.remove();
        canvas.remove();
        reject(new Error('Thumbnail generation timeout'));
      }
    }, 10000);
    
    video.src = videoUrl;
  });
};

export const getVideoThumbnailWithFallback = async (videoUrl: string): Promise<string> => {
  try {
    const thumbnail = await generateVideoThumbnail(videoUrl);
    return thumbnail;
  } catch (error) {
    console.warn('Thumbnail generation failed, using fallback:', error);
    // Return a data URL for a simple gradient placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = 480;
      canvas.height = 270;
      
      // Create a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#1a1a1a');
      gradient.addColorStop(1, '#2a2a2a');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add play icon
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 30, canvas.height / 2 - 20);
      ctx.lineTo(canvas.width / 2 + 20, canvas.height / 2);
      ctx.lineTo(canvas.width / 2 - 30, canvas.height / 2 + 20);
      ctx.closePath();
      ctx.fill();
      
      const fallbackDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      canvas.remove();
      return fallbackDataUrl;
    }
    
    // Ultimate fallback - return empty string to let browser handle
    return '';
  }
};