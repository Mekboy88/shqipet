
import React from 'react';
import { Shield, Lock } from 'lucide-react';

interface PermissionStatusDisplayProps {
  isSuperAdmin: boolean;
  isRegularAdmin: boolean;
  isTargetUserProtected: boolean;
  isViewingOwnSuperProfile: boolean;
  isDarkTheme: boolean;
}

export function PermissionStatusDisplay({
  isSuperAdmin,
  isRegularAdmin,
  isTargetUserProtected,
  isViewingOwnSuperProfile,
  isDarkTheme
}: PermissionStatusDisplayProps) {
  return (
    <>
      {/* Enhanced permission status display */}
      {isSuperAdmin && (
        <div className="bg-[#F5B5B5]/10 border border-[#F5B5B5]/30 rounded-lg p-3 mb-4">
          <p className="text-[#F5B5B5] text-sm font-bold">
            🔥 SUPER ADMIN MODE - UNLIMITED ACCESS - CAN MODIFY ANY USER 🔥
          </p>
        </div>
      )}
      
      {isRegularAdmin && (
        <div className="bg-[#FFB3A3]/10 border border-[#FFB3A3]/30 rounded-lg p-3 mb-4">
          <p className="text-[#FFB3A3] text-sm font-bold">
            🛡️ ADMIN MODE - CAN ASSIGN USER/MODERATOR/ADMIN ROLES
          </p>
        </div>
      )}

      {isTargetUserProtected && !isSuperAdmin && (
        <div className="bg-[#F5B5B5]/20 border-2 border-[#F5B5B5] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-[#F5B5B5]" />
            <Lock className="h-5 w-5 text-[#F5B5B5]" />
            <p className="text-[#F5B5B5] text-sm font-bold">
              🔒 SUPER ADMIN - ABSOLUTE PROTECTION
            </p>
          </div>
          <p className="text-[#F5B5B5] text-xs font-medium">
            This role is PERMANENT and CANNOT be changed. Only ONE Super Admin exists in the system.
          </p>
        </div>
      )}

      {isViewingOwnSuperProfile && (
        <div className="pt-2 border-t-2 border-[#F5B5B5] bg-[#F5B5B5]/10 p-4 rounded">
          <div className="flex items-center justify-center gap-2 text-[#F5B5B5] text-sm font-bold mb-2">
            <Shield className="h-4 w-4" />
            🔥 YOUR SUPER ADMIN ROLE IS PERMANENT
          </div>
          <p className="text-[#F5B5B5] text-xs text-center font-medium">
            As the Super Admin, your role cannot be changed - not even by yourself.
            This ensures maximum security and prevents accidental role changes.
          </p>
        </div>
      )}
    </>
  );
}
