
export interface RoleBadgeConfig {
  text: string;
  color: string;
  accessLevel: string;
}

export const getRoleBadgeConfig = (role: string): RoleBadgeConfig => {
  switch(role) {
    case 'platform_owner_root':
      return {
        text: 'Platform Owner',
        color: '#7C2D12',
        accessLevel: 'Ultimate System Authority'
      };
    case 'super_admin':
      return {
        text: 'Super Admin',
        color: '#E17B7B',
        accessLevel: 'Advanced System Access & Management'
      };
    case 'org_admin':
      return {
        text: 'Org Admin',
        color: '#DC2626',
        accessLevel: 'Organizational Management'
      };
    case 'access_admin':
      return {
        text: 'Access Admin',
        color: '#EA580C',
        accessLevel: 'Role & Permission Management'
      };
    case 'security_admin':
      return {
        text: 'Security Admin',
        color: '#D97706',
        accessLevel: 'Security Policy Management'
      };
    case 'global_content_moderator':
      return {
        text: 'Global Moderator',
        color: '#059669',
        accessLevel: 'Global Content Moderation'
      };
    case 'posts_moderator':
    case 'comments_moderator':
    case 'media_moderator':
      return {
        text: 'Content Moderator',
        color: '#0891B2',
        accessLevel: 'Content Moderation & Review'
      };
    case 'user_directory_admin':
      return {
        text: 'User Admin',
        color: '#7C3AED',
        accessLevel: 'User Management & Directory'
      };
    case 'api_admin':
      return {
        text: 'API Admin',
        color: '#2563EB',
        accessLevel: 'API & Integration Management'
      };
    case 'database_admin':
      return {
        text: 'Database Admin',
        color: '#1D4ED8',
        accessLevel: 'Database Operations'
      };
    case 'read_only_global_admin':
      return {
        text: 'Read-Only Admin',
        color: '#64748B',
        accessLevel: 'Global Read Access'
      };
    case 'user':
      return {
        text: 'User',
        color: '#6B7280',
        accessLevel: 'Standard User Access'
      };
    default:
      // Handle any other role codes
      const formattedRole = role.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return {
        text: formattedRole,
        color: '#6B7280',
        accessLevel: 'Administrative Access'
      };
  }
};
