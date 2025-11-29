
export interface AdminSearchHistoryItem {
  id: string;
  text: string;
  isNew?: boolean;
  image?: string;
}

// Demo search history for admin area - can include sensitive/admin-specific content
export const ADMIN_MOCK_SEARCH_HISTORY: AdminSearchHistoryItem[] = [
  { id: '1', text: 'Admin settings', isNew: true },
  { id: '2', text: 'User permissions', isNew: true },
  { id: '3', text: 'Content moderation', image: '/lovable-uploads/b056092e-532c-4013-a7f8-ed706a4d9e70.png' },
  { id: '4', text: 'System logs' },
  { id: '5', text: 'API access tokens', isNew: true },
  { id: '6', text: 'Security alerts' },
  { id: '7', text: 'Database backups' },
  { id: '8', text: 'Admin users', image: '/lovable-uploads/b056092e-532c-4013-a7f8-ed706a4d9e70.png' },
];
