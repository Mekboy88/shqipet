/**
 * LegacyMediaService - Backward compatibility layer
 * Provides same API as old wasabiUrlGenerator for existing components
 */

import { mediaService } from './MediaService';

/**
 * Legacy function for backward compatibility
 */
export const processWasabiUrl = async (urlOrKey: string, expires: number = 900): Promise<string> => {
  return mediaService.getUrl(urlOrKey);
};

/**
 * Legacy function for backward compatibility  
 */
export const getWasabiProxyObjectUrl = async (keyOrUrl: string): Promise<string> => {
  return mediaService.getUrl(keyOrUrl);
};

/**
 * Legacy function for backward compatibility
 */
export const isWasabiKey = (url: string): boolean => {
  return !url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:');
};