// Replacement for toast system - converts all toast calls to notifications
import { notificationManager } from '@/utils/notificationManager';

// Create a callable function with methods
function createToast(message: string, options?: any) {
  notificationManager.showNotification(message, { tag: 'info' });
  notificationManager.playSound('default');
}

// Add methods to the function
createToast.success = (message: string, options?: any) => {
  notificationManager.showNotification(message, { tag: 'success' });
  notificationManager.playSound('success');
};

createToast.error = (message: string, options?: any) => {
  notificationManager.showNotification(message, { tag: 'error' });
  notificationManager.playSound('alert');
};

createToast.info = (message: string, options?: any) => {
  notificationManager.showNotification(message, { tag: 'info' });
  notificationManager.playSound('default');
};

createToast.warning = (message: string, options?: any) => {
  notificationManager.showNotification(message, { tag: 'warning' });
  notificationManager.playSound('warning');
};

export const toast = createToast;

// For compatibility with shadcn useToast hook pattern
export const useToast = () => ({ toast });

export default createToast;