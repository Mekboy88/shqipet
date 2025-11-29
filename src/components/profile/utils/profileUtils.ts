
import { Photo, Friend } from "../data/userData";

// Helper function to transform string array images to Photo objects
export const transformPostImagesToPics = (images?: string[]): Photo[] => {
  if (!images || images.length === 0) return [];
  return images.map((url, index) => ({
    id: index + 1,
    url
  }));
};

// Helper function to format friend data
export const transformFriendsData = (friends: Friend[], count: number = 6): Friend[] => {
  return friends.slice(0, count);
};

// Helper function to convert photo IDs from number to string format
export const convertPhotoIdsToString = (photos: Photo[]): { id: string; url: string; }[] => {
  return photos.map(photo => ({
    id: photo.id.toString(),
    url: photo.url
  }));
};

// Window property types
export interface WindowWithProfileUtils extends Window {
  adjustProfileSectionWidth: (width: string | number) => void;
  moveSidebar: (marginLeft: number) => void;
}

// Define typings for window object
declare global {
  interface Window {
    adjustProfileSectionWidth: (width: string | number) => void;
    moveSidebar: (marginLeft: number) => void;
  }
}

// Setup window utilities
export const setupWindowUtils = (
  setSectionsMaxWidth: (width: string) => void,
  setSidebarMarginLeft: (margin: number) => void
) => {
  if (typeof window !== 'undefined') {
    // Define console function to edit section widths
    window.adjustProfileSectionWidth = (width: string | number) => {
      // Convert number to string with px if needed
      const formattedWidth = typeof width === 'number' ? `${width}px` : width;

      // Update the state with the new width
      setSectionsMaxWidth(formattedWidth);

      // Log the change for user feedback
      console.log(`Profile sections width updated to: ${formattedWidth}`);

      // Optional: Store in localStorage for persistence across refreshes
      localStorage.setItem('profileSectionsWidth', formattedWidth);
    };
    
    // Add console function to move sidebar left and right
    window.moveSidebar = (marginLeft: number) => {
      setSidebarMarginLeft(marginLeft);
      console.log(`Sidebar margin-left updated to: ${marginLeft}px`);
      localStorage.setItem('sidebarMarginLeft', marginLeft.toString());
    };
  }
};

// Cleanup window utilities
export const cleanupWindowUtils = () => {
  if (typeof window !== 'undefined') {
    if ('adjustProfileSectionWidth' in window) {
      delete window.adjustProfileSectionWidth;
    }
    if ('moveSidebar' in window) {
      delete window.moveSidebar;
    }
  }
};

// Load saved preferences from localStorage
export const loadSavedPreferences = (
  setSectionsMaxWidth: (width: string) => void,
  setSidebarMarginLeft: (margin: number) => void
) => {
  if (typeof window !== 'undefined') {
    // Check for saved width in localStorage on component mount
    const savedWidth = localStorage.getItem('profileSectionsWidth');
    if (savedWidth) {
      setSectionsMaxWidth(savedWidth);
    }
    
    // Check for saved margin in localStorage
    const savedMargin = localStorage.getItem('sidebarMarginLeft');
    if (savedMargin) {
      setSidebarMarginLeft(parseInt(savedMargin, 10));
    }
  }
};
