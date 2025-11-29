
import React from 'react';
import { useLocation } from 'react-router-dom';

const UnderConstruction: React.FC = () => {
  const location = useLocation();

  // Get page name from pathname
  const getPageName = (pathname: string) => {
    console.log('🚨 [DEBUG] UnderConstruction component rendering for route:', pathname);
    
    const pathSegments = pathname.split('/').filter(Boolean);
    console.log('🚨 [DEBUG] Route mapping result:', {
      pathname,
      pageName: pathSegments[pathSegments.length - 1] || 'undefined'
    });
    
    // Only handle non-website settings routes
    if (pathname.startsWith('/admin/website/')) {
      return 'Website Settings'; // Should not reach here with proper routing
    }
    
    const pageMap: { [key: string]: string } = {
      // Main pages
      'dashboard': 'Dashboard',
      'users': 'Users Management',
      
      // Features
      'toggle': 'Feature Toggle',
      'settings': 'Feature Settings',
      
      // Authentication
      'login': 'Login Settings',
      'registration': 'Registration Settings',
      '2fa': 'Two-Factor Authentication',
      'passwords': 'Password Settings',
      
      // Users & Roles
      'permissions': 'Permissions Management',
      'roles': 'Roles Management',
      'access': 'Access Control',
      
      // Team Management
      'members': 'Team Members',
      'logs': 'Activity Logs',
      
      // Content Management
      'pages': 'Pages Management',
      'media': 'Media Library',
      'seo': 'SEO Settings',
      
      // Messaging
      'email': 'Email Templates',
      'push': 'Push Notifications',
      'sms': 'SMS Settings',
      
      // Storage
      'files': 'File Management',
      'cdn': 'CDN Settings',
      'backup': 'Backup Management',
      
      // Payments
      'gateways': 'Payment Gateways',
      'plans': 'Subscription Plans',
      'billing': 'Billing Management'
    };

    const lastSegment = pathSegments[pathSegments.length - 1];
    return pageMap[lastSegment] || 'Admin Panel';
  };

  const pageName = getPageName(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🚧 Under Construction</h1>
          <p className="text-gray-600 mb-6">
            {pageName} is currently being developed and will be available soon.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-900">Development Progress</span>
            <span className="text-sm text-gray-500">65%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        <div className="text-left space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            UI/UX Design Complete
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Backend API Integration
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <svg className="h-4 w-4 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" />
            </svg>
            Frontend Components (In Progress)
          </div>
          <div className="flex items-center text-sm text-gray-400">
            <svg className="h-4 w-4 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="10" />
            </svg>
            Testing & Quality Assurance
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;
