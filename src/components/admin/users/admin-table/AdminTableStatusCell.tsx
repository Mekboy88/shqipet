
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AdminTableStatusCellProps {
  status: string | null;
}

export function AdminTableStatusCell({ status }: AdminTableStatusCellProps) {
  switch(status) {
    case 'active':
      return <Badge className="bg-green-500">Active ✅</Badge>;
    case 'deactivated':
      return <Badge className="bg-yellow-500">Deactivated ⚠️</Badge>;
    case 'suspended':
      return <Badge className="bg-red-500">Suspended 🚫</Badge>;
    case 'pending':
      return <Badge className="bg-blue-500">Pending ⏳</Badge>;
    default:
      return <Badge className="bg-gray-500">Unknown</Badge>;
  }
}
