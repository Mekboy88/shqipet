import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { UnifiedAlert } from '@/hooks/useRealtimeAlerts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Copy, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AlertDetailModalProps {
  alert: UnifiedAlert | null;
  open: boolean;
  onClose: () => void;
  onResolve: (alert: UnifiedAlert) => void;
  onDismiss: (alert: UnifiedAlert) => void;
}

export const AlertDetailModal = ({ alert, open, onClose, onResolve, onDismiss }: AlertDetailModalProps) => {
  if (!alert) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {alert.title}
            <Badge variant="outline" className="capitalize">
              {alert.severity}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Alert details and metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Message */}
          <div>
            <label className="text-sm font-medium mb-1 block">Message</label>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Source</label>
              <Badge variant="secondary" className="capitalize">
                {alert.source.replace(/_/g, ' ')}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Badge variant="outline" className="capitalize">
                {alert.status}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Created At</label>
              <p className="text-sm text-muted-foreground">
                {format(new Date(alert.created_at), 'PPpp')}
              </p>
            </div>
            {alert.resolved_at && (
              <div>
                <label className="text-sm font-medium mb-1 block">Resolved At</label>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(alert.resolved_at), 'PPpp')}
                </p>
              </div>
            )}
          </div>

          {/* Alert ID */}
          <div>
            <label className="text-sm font-medium mb-1 block">Alert ID</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-md bg-muted text-xs font-mono">
                {alert.id}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(alert.id, 'Alert ID')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* User ID */}
          {alert.user_id && (
            <div>
              <label className="text-sm font-medium mb-1 block">User ID</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-md bg-muted text-xs font-mono">
                  {alert.user_id}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(alert.user_id!, 'User ID')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Metadata */}
          {alert.metadata && Object.keys(alert.metadata).length > 0 && (
            <div>
              <label className="text-sm font-medium mb-1 block">Metadata</label>
              <pre className="p-3 rounded-md bg-muted text-xs overflow-x-auto">
                {JSON.stringify(alert.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            {alert.status === 'open' && (
              <>
                <Button
                  onClick={() => {
                    onResolve(alert);
                    onClose();
                  }}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark as Resolved
                </Button>
                {(alert.source === 'admin_notifications' || alert.source === 'notifications') && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onDismiss(alert);
                      onClose();
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Dismiss
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
