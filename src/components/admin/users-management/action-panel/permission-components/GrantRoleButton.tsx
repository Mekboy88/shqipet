
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Shield } from 'lucide-react';

interface GrantRoleButtonProps {
  canGrantRoles: boolean;
  isTargetUserProtected: boolean;
  onClick: () => void;
  isSuperAdmin: boolean;
  isRegularAdmin: boolean;
  labelColor: string;
}

export function GrantRoleButton({
  canGrantRoles,
  isTargetUserProtected,
  onClick,
  isSuperAdmin,
  isRegularAdmin,
  labelColor
}: GrantRoleButtonProps) {
  if (!canGrantRoles || isTargetUserProtected) {
    return null;
  }

  return (
    <div className="pt-2 border-t border-gray-200">
      <Button
        onClick={onClick}
        className="w-full flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-4 text-lg"
        variant="default"
      >
        <Plus className="h-5 w-5" />
        <Shield className="h-5 w-5" />
        🚀 Grant Premium Role Access
      </Button>
      <p className={`text-xs ${labelColor} mt-2 text-center`}>
        {isSuperAdmin && "Grant any role with secure login credentials"}
        {isRegularAdmin && "Grant user, moderator, or admin roles with login"}
      </p>
    </div>
  );
}
