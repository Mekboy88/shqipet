
import React from 'react';
import { format } from 'date-fns';
import { Eye } from 'lucide-react';
import { UserAction } from '@/types/admin-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ActionsTableProps {
  actions: UserAction[];
  onViewDetails: (action: UserAction) => void;
}

export function ActionsTable({ actions, onViewDetails }: ActionsTableProps) {
  // Helper function to render status badge
  const renderStatusBadge = (status: 'success' | 'warning' | 'failed') => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Success</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" /> Warning</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Action ID</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Affected User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions && actions.length > 0 ? (
            actions.map((action: UserAction) => (
              <TableRow key={action.id}>
                <TableCell className="font-mono text-xs">
                  {action.id.substring(0, 8)}...
                </TableCell>
                <TableCell>
                  {action.timestamp ? format(new Date(action.timestamp), 'MMM dd, yyyy HH:mm') : 'Unknown'}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{action.username}</div>
                  <div className="text-xs text-gray-500">{action.email}</div>
                </TableCell>
                <TableCell>{action.action_type}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {action.action_description}
                </TableCell>
                <TableCell>
                  {action.target_username || 'N/A'}
                </TableCell>
                <TableCell>
                  {renderStatusBadge(action.action_status)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(action)}
                  >
                    <Eye size={16} className="mr-1" /> View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                No user actions found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
