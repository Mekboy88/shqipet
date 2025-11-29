
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminRoleBadge from './AdminRoleBadge';
import { getRoleBadgeConfig } from './AdminRoleUtils';

interface AdminProfileSectionProps {
  adminProfile: any;
  adminEmail: string;
  allowedRole: string;
  isLoggedOut: boolean;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
  };
}

const AdminProfileSection: React.FC<AdminProfileSectionProps> = ({
  adminProfile,
  adminEmail,
  allowedRole,
  isLoggedOut,
  colorScheme
}) => {
  const roleConfig = getRoleBadgeConfig(allowedRole);

  // Function to mask email with stars, showing only .com
  const maskEmail = (email: string) => {
    if (!email) return '';
    
    // Find the last dot to preserve .com extension
    const lastDotIndex = email.lastIndexOf('.');
    if (lastDotIndex === -1) {
      // No extension found, mask everything except last 4 chars
      return '*'.repeat(Math.max(0, email.length - 4)) + email.slice(-4);
    }
    
    // Extract the extension (.com, .org, etc.)
    const extension = email.substring(lastDotIndex);
    // Mask everything before the extension
    const beforeExtension = email.substring(0, lastDotIndex);
    const maskedPart = '*'.repeat(beforeExtension.length);
    
    return maskedPart + extension;
  };

  const currentEmail = adminProfile?.email || adminEmail;
  const maskedEmail = maskEmail(currentEmail);

  return (
    <div className="flex items-start mb-4">
      <Avatar className="h-24 w-24 mr-4 border-3 shadow-lg" style={{ borderColor: colorScheme.primary }}>
        {(adminProfile?.avatar_url || adminProfile?.profile_image_url) && (
          <AvatarImage src={adminProfile.avatar_url || adminProfile.profile_image_url} alt="Admin Avatar" />
        )}
        <AvatarFallback className="bg-gray-200 text-gray-600 text-3xl font-bold">
          {adminProfile?.first_name?.[0]?.toUpperCase() || 'A'}{adminProfile?.last_name?.[0]?.toUpperCase() || 'D'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="mb-2">
          <p className="font-bold text-gray-800 text-lg">{maskedEmail}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Role:</span>
            <AdminRoleBadge role={allowedRole} />
          </div>
          {adminProfile?.first_name && adminProfile?.last_name && (
            <p className="text-base text-gray-800 font-bold">
              {adminProfile.first_name} {adminProfile.last_name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSection;
