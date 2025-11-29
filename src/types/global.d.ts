import type { ReactNode } from 'react';

interface AdminPortal {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  portalId: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
  icon: ReactNode;
}

declare global {
  interface Window {
    adminPortalRoutes: { [key: string]: AdminPortal };
  }
}

export {};
