
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { UserProfile, userRoleOptions } from '@/types/user';

interface UserRoleDisplayProps {
  user: UserProfile;
  isDarkTheme: boolean;
  labelColor: string;
}

const roleColors: { [key: string]: { dark: string, light: string } } = {
  user: { dark: 'text-white bg-transparent border-white', light: 'text-[#2C2928] bg-transparent border-[#8B7355]' },
  moderator: { dark: 'text-white bg-[#A3C4F3]', light: 'text-white bg-[#A3C4F3]' },
  admin: { dark: 'text-white bg-[#FFB3A3]', light: 'text-white bg-[#FFB3A3]' },
  super_admin: { dark: 'text-white bg-[#F5B5B5]', light: 'text-white bg-[#F5B5B5]' },
  developer: { dark: 'text-white bg-[#D4B3F0]', light: 'text-white bg-[#D4B3F0]' },
  support: { dark: 'text-white bg-[#B3E5B3]', light: 'text-white bg-[#B3E5B3]' },
};

export function UserRoleDisplay({ user, isDarkTheme, labelColor }: UserRoleDisplayProps) {
  const currentRole = user.role || 'user';
  const roleColor = isDarkTheme ? roleColors[currentRole]?.dark : roleColors[currentRole]?.light || roleColors.user.dark;

  return (
    <div className="flex justify-between items-center">
      <p className={`${labelColor} text-sm font-sans`}>Account Role</p>
      <Badge className={roleColor}>
        {userRoleOptions.find(r => r.value === currentRole)?.label || 'User'}
      </Badge>
    </div>
  );
}
