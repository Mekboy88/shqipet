import React from 'react';
import Avatar from "@/components/Avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import { getRoleBadgeConfig } from '@/components/admin/factory/AdminRoleUtils';

const AdminSidebarUserInfo: React.FC = () => {
  const { user, userRole } = useAuth();
  const { open } = useSidebar();
  
  // SECURITY FIX: Use database-driven role check instead of hardcoded email
  const isPlatformOwner = userRole === 'platform_owner_root';
  
  // Use the centralized role data
  const effectiveRole = userRole || 'user';
  const roleText = getRoleBadgeConfig(effectiveRole).text;
  const roleColor = getRoleBadgeConfig(effectiveRole).color;
  
  // Mask email for platform owner only if role is platform_owner_root
  const displayEmail = isPlatformOwner && user?.email 
    ? `********${user.email.substring(user.email.lastIndexOf('.'))}`
    : user?.email;
  
  console.log('🔐 [SECURITY] Sidebar role detection:', { 
    email: user?.email, 
    userRole, 
    effectiveRole, 
    roleText 
  });
  if (!open) {
    return (
      <div className="fixed bottom-4 left-2 z-10">
        <Avatar userId={user?.id} size="sm" className="h-8 w-8 border-2 border-gray-200" />
      </div>
    );
  }
  return <div className="mt-auto mb-4 py-2 slide-in-userinfo px-[2px]">
      <div className="flex items-center space-x-3 relative">
        {/* User Avatar */}
        <div className="relative">
          <Avatar userId={user?.id} size="md" className="h-10 w-10 border-2 border-gray-200" />
        </div>
        
        {/* User Info */}
        <div className="flex-grow">
          <div className="p-2 rounded-lg bg-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800 slide-text truncate">{displayEmail}</p>
                <p className="text-xs slide-text" style={{ color: roleColor }}>{roleText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default AdminSidebarUserInfo;