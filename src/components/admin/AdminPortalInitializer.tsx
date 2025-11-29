import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// Database integration removed - placeholder for future Cloud integration
import { notificationManager } from '@/utils/notificationManager';

const AdminPortalInitializer: React.FC = () => {
  const { user, userProfile } = useAuth();

  useEffect(() => {
    console.log('🚀 AdminPortalInitializer started - SECURITY: No auto-admin creation');
    
    // SECURITY FIX: Remove automatic admin portal creation
    // Admin portals should ONLY be created through proper authentication flows
    // with database role verification, not by email matching
    
    const securityCleanup = () => {
      // Clear any existing insecure admin portals
      localStorage.removeItem('adminPortals');
      localStorage.removeItem('adminPortalInitializerNotificationShown');
      
      // Clear insecure global routes
      if (window.adminPortalRoutes) {
        window.adminPortalRoutes = {};
      }
      
      console.log('🔒 SECURITY: Cleared insecure admin portal data');
    };

    // Always run security cleanup
    securityCleanup();
    
  }, [user, userProfile]);

  useEffect(() => {
    console.log('🔒 AdminPortalInitializer mounted - Security mode active');
  }, []);

  return (
    <div style={{ display: 'none' }}>
      Security Portal Monitor Active
    </div>
  );
};

export default AdminPortalInitializer;