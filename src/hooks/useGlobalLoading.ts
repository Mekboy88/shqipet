export const useGlobalLoading = () => {
  // Always return false for instant loading - no delays
  return { isLoading: false, isInitialLoad: false };
};