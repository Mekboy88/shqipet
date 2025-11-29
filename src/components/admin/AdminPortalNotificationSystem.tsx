
import React, { useEffect } from 'react';
import { notificationManager } from '@/utils/notificationManager';
import { ExternalLink, Shield } from 'lucide-react';

export function AdminPortalNotificationSystem() {
  useEffect(() => {
    const handleNewAdminGranted = (event: CustomEvent) => {
      const { userId, userName, userEmail, newRole } = event.detail;
      const portalId = `portal-${userId}-${Date.now()}`;
      const portalUrl = `/admin/portal/${portalId}`;
      
      // Show detailed notification with portal link
      notificationManager.showNotification(
        `🎉 New Admin Portal Created! ${userName} has been granted ${newRole} access`,
        { 
          body: `Portal URL: ${portalUrl}`,
          tag: 'admin-portal',
          requireInteraction: true
        }
      );
      notificationManager.playSound('success');
      
      console.log(`🎯 Portal notification sent for ${userName} at ${portalUrl}`);
    };

    window.addEventListener('newAdminGranted', handleNewAdminGranted as EventListener);

    return () => {
      window.removeEventListener('newAdminGranted', handleNewAdminGranted as EventListener);
    };
  }, []);

  return null; // This component only handles notifications
}
