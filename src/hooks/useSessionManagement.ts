// Stub for frontend compatibility
export const useSessionManagement = () => {
  return {
    sessions: [],
    loading: false,
    error: null,
    currentDeviceId: null,
    refreshSessions: () => {},
    terminateSession: async (_id?: string) => {},
    revokeSession: async (_id: string) => {},
    trustDevice: async (_id: string) => {},
    revokeAllOtherDevices: async () => {}
  };
};
