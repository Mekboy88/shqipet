/**
 * Secure Storage Utility
 * SECURITY: Guidelines for safe localStorage/sessionStorage usage
 */

/**
 * SECURITY POLICY FOR CLIENT-SIDE STORAGE
 * 
 * NEVER STORE:
 * - Authentication tokens (handled by Supabase SDK)
 * - Passwords or password hashes
 * - Personal Identifiable Information (PII)
 * - API keys or secrets
 * - Payment information
 * - Security questions/answers
 * 
 * SAFE TO STORE:
 * - UI preferences (theme, language)
 * - Non-sensitive user settings
 * - Temporary form data (with user consent)
 * - Cache keys (non-sensitive)
 */

interface StorageOptions {
  encrypt?: boolean;
  expiryMinutes?: number;
}

// List of keys that are explicitly allowed for security reasons
const ALLOWED_STORAGE_KEYS = [
  'theme',
  'language',
  'ui-preferences',
  'sidebar-collapsed',
  'recent-searches', // non-sensitive only
] as const;

/**
 * Check if a storage key is approved for use
 */
export const isStorageKeyAllowed = (key: string): boolean => {
  // Check if key starts with any allowed prefix
  return ALLOWED_STORAGE_KEYS.some(allowed => key.startsWith(allowed));
};

/**
 * Safe localStorage setter with validation
 */
export const setSecureItem = (
  key: string, 
  value: string, 
  options: StorageOptions = {}
): boolean => {
  try {
    if (!isStorageKeyAllowed(key)) {
      console.warn(`⚠️ SECURITY: Storage key "${key}" is not in the approved list`);
      return false;
    }

    const data = {
      value,
      timestamp: Date.now(),
      ...(options.expiryMinutes && { 
        expiresAt: Date.now() + (options.expiryMinutes * 60 * 1000) 
      })
    };

    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to set storage item:', error);
    return false;
  }
};

/**
 * Safe localStorage getter with expiry check
 */
export const getSecureItem = (key: string): string | null => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const data = JSON.parse(stored);
    
    // Check expiry
    if (data.expiresAt && Date.now() > data.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return data.value || null;
  } catch (error) {
    console.error('Failed to get storage item:', error);
    return null;
  }
};

/**
 * Clear all non-essential storage items
 */
export const clearNonEssentialStorage = (): void => {
  const keysToKeep = ['theme', 'language'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('🧹 Non-essential storage cleared');
};

/**
 * Session storage helper for temporary data only
 */
export const setSessionItem = (key: string, value: string): void => {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      value,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to set session item:', error);
  }
};

export const getSessionItem = (key: string): string | null => {
  try {
    const stored = sessionStorage.getItem(key);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return data.value || null;
  } catch (error) {
    console.error('Failed to get session item:', error);
    return null;
  }
};

export default {
  setSecureItem,
  getSecureItem,
  clearNonEssentialStorage,
  setSessionItem,
  getSessionItem,
  isStorageKeyAllowed
};
