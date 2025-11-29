
// SHQIPET PLATFORM SECURE VIDEO DETECTION
import { isSecureVideoFile } from '@/utils/videoSecurity';

// DEPRECATED: Use isSecureVideoFile instead for security
// This function is kept for compatibility but now uses secure validation
export const isVideoFile = (url: string) => {
  console.warn('⚠️ DEPRECATION: Use isSecureVideoFile for enhanced security');
  return isSecureVideoFile(url);
};

// SECURE VIDEO DETECTION - Primary function to use
export { isSecureVideoFile };
