
/**
 * Toast Helper Documentation
 * 
 * This file provides guidance on how to properly use toast notifications throughout the app.
 * 
 * Import from sonner directly for simple toasts:
 * - import { toast } from 'sonner';
 * 
 * Usage examples:
 * - Simple toast: toast('Message here');
 * - Success toast: toast.success('Success message');
 * - Error toast: toast.error('Error message');
 * - With description: toast('Title', { description: 'Longer description here' });
 * 
 * For more advanced toast features, import from our custom hook:
 * - import { useToast } from '@/hooks/use-toast';
 * - const { toast } = useToast();
 * 
 * For UI components, you can also import the Toast components directly:
 * - import { Toast, ToastDescription } from '@/components/ui/toast';
 */

// Re-export for convenience
export { toast } from 'sonner';
export { useToast } from '@/hooks/use-toast';
