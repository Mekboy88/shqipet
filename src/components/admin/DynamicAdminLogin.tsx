
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notificationManager } from '@/utils/notificationManager';
// Database integration removed - placeholder for future Cloud integration
import AdminLoginFactory from './AdminLoginFactory';
import { GlobalSkeleton } from '@/components/ui/GlobalSkeleton';
import { Shield, AlertTriangle, Crown, Users, Headphones, Code } from 'lucide-react';

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
  icon: React.ReactNode;
}

export default function DynamicAdminLogin() {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const [portal, setPortal] = useState<AdminPortal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const securityCheck = () => {
      console.log('🔒 SECURITY: DynamicAdminLogin blocking all portal access');
      
      // CRITICAL: Clear any existing insecure admin portals
      localStorage.removeItem('adminPortals');
      localStorage.removeItem('adminPortalNotificationShown');
      localStorage.removeItem('adminPortalInitializerNotificationShown');
      
      // Clear insecure global routes
      if (window.adminPortalRoutes) {
        window.adminPortalRoutes = {};
      }
      
      console.log('🛡️ SECURITY: All admin portal data cleared - no portals available');
      setLoading(false);
      
      // Force redirect to secure message
      setTimeout(() => {
        notificationManager.showNotification('🔒 Admin portals disabled for security review', { tag: 'security' });
        navigate('/admin/login');
      }, 2000);
    };

    securityCheck();
  }, [portalId, navigate]);

  if (loading) {
    return <GlobalSkeleton />;
  }

  if (!portal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-800 mb-2">🔒 Admin Access Secured</h1>
          <p className="text-gray-600 mb-4">All admin portals have been disabled for security review.</p>
          <p className="text-sm text-gray-500">Redirecting to secure admin login...</p>
        </div>
      </div>
    );
  }

  // SECURITY: Block all portal access
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">🔒 Portal Access Disabled</h1>
        <p className="text-gray-600 mb-4">Admin portal access has been temporarily disabled for security purposes.</p>
        <p className="text-sm text-gray-500">Contact your system administrator for assistance.</p>
      </div>
    </div>
  );
}
