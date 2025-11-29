
import React from 'react';
import { format } from 'date-fns';
import { UserAction } from '@/types/admin-actions';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogClose, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ActionDetailsDialogProps {
  action: UserAction | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ActionDetailsDialog({ action, isOpen, onClose }: ActionDetailsDialogProps) {
  if (!action) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Action Details</DialogTitle>
          <DialogDescription>
            Complete information about this user action
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic action info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Action ID</h3>
              <p className="mt-1 font-mono text-sm">{action.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Timestamp</h3>
              <p className="mt-1">{format(new Date(action.timestamp), 'PPpp')}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Action Type</h3>
              <p className="mt-1">{action.action_type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <div className="mt-1">{renderStatusBadge(action.action_status)}</div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-sm">{action.action_description}</p>
          </div>
          
          {/* User information */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">User Information</h3>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <p className="font-medium">{action.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">User ID</p>
                  <p className="font-medium font-mono">{action.user_id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{action.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Technical details */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Technical Details</h3>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">IP Address</p>
                  <p className="font-medium">{action.ip_address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{action.location}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Device</p>
                  <p className="font-medium">{action.device_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Browser & OS</p>
                  <p className="font-medium">{action.browser_os}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional data if available */}
          {action.additional_data && Object.keys(action.additional_data).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Additional Data</h3>
              <pre className="mt-1 p-3 bg-gray-50 rounded-md overflow-x-auto text-xs">
                {JSON.stringify(action.additional_data, null, 2)}
              </pre>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
