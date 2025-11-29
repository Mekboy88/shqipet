
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AdminTableRoleCellProps {
  role: string | null;
}

export function AdminTableRoleCell({ role }: AdminTableRoleCellProps) {
  const getRoleBadge = (roleCode: string | null) => {
    switch(roleCode) {
      case 'platform_owner_root':
        return <Badge className="bg-[#7C2D12] text-white">Platform Owner</Badge>;
      case 'super_admin':
        return <Badge className="bg-[#E17B7B] text-white">Super Admin</Badge>;
      case 'org_admin':
        return <Badge className="bg-[#DC2626] text-white">Org Admin</Badge>;
      case 'access_admin':
        return <Badge className="bg-[#EA580C] text-white">Access Admin</Badge>;
      case 'security_admin':
        return <Badge className="bg-[#D97706] text-white">Security Admin</Badge>;
      case 'global_content_moderator':
        return <Badge className="bg-[#059669] text-white">Global Moderator</Badge>;
      case 'posts_moderator':
      case 'comments_moderator':
      case 'media_moderator':
        return <Badge className="bg-[#0891B2] text-white">Content Moderator</Badge>;
      case 'user_directory_admin':
        return <Badge className="bg-[#7C3AED] text-white">User Admin</Badge>;
      case 'api_admin':
        return <Badge className="bg-[#2563EB] text-white">API Admin</Badge>;
      case 'database_admin':
        return <Badge className="bg-[#1D4ED8] text-white">Database Admin</Badge>;
      case 'read_only_global_admin':
        return <Badge className="bg-[#64748B] text-white">Read-Only Admin</Badge>;
      case 'user':
        return <Badge className="bg-blue-300 text-blue-800">User</Badge>;
      default:
        // Format any other role codes nicely
        if (roleCode) {
          const formatted = roleCode.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          return <Badge className="bg-gray-500 text-white">{formatted}</Badge>;
        }
        return <Badge className="bg-blue-300 text-blue-800">User</Badge>;
    }
  };

  return getRoleBadge(role);
}
