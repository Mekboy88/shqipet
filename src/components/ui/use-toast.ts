
// Re-export toast hooks from Sonner
import { toast } from "sonner";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Export both the sonner toast function and our custom hook
export const useToast = useHookToast;
export { toast };
