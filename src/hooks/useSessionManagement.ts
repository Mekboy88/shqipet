import { useSessions } from '@/contexts/SessionsContext';

// Re-export the global sessions context as useSessionManagement
// This maintains backward compatibility with existing code
export const useSessionManagement = useSessions;
