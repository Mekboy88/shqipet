import { notificationManager } from "@/utils/notificationManager";

/**
 * Global hook for colored switch toast notifications
 * Shows green toast when switches are enabled, red when disabled
 * Use this for all switch components across the website
 */
export const useSwitchToast = () => {
  const showSwitchToast = (message: string, isEnabled: boolean) => {
    // Replace toast with desktop notification + sound
    notificationManager.showNotification(message, { body: isEnabled ? 'Enabled' : 'Disabled' });
    notificationManager.playSound(isEnabled ? 'success' : 'warning');
  };

  // Wrapper function that prevents default toasts and only shows colored ones
  const updateSettingWithColoredToast = (updateFunction: (key: string, value: any, type?: string) => void) => {
    return (key: string, value: any, type: string = 'general') => {
      // Call the update function
      updateFunction(key, value, type);
      
      // If it's a boolean, force show only colored toast
      if (typeof value === 'boolean') {
        const friendlyName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        showSwitchToast(`${friendlyName} ${value ? 'enabled' : 'disabled'}`, value);
      }
    };
  };

  return { showSwitchToast, updateSettingWithColoredToast };
};