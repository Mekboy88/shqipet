
import React from 'react';
import { getRoleBadgeConfig } from './AdminRoleUtils';

interface AdminRoleBadgeProps {
  role: string;
}

const AdminRoleBadge: React.FC<AdminRoleBadgeProps> = ({ role }) => {
  const config = getRoleBadgeConfig(role);
  
  return (
    <span 
      className="font-bold text-lg" 
      style={{ color: config.color }}
    >
      {config.text}
    </span>
  );
};

export default AdminRoleBadge;
