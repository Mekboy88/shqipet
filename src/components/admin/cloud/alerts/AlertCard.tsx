import { motion } from 'framer-motion';
import { Bell, Shield, AlertTriangle, Settings, Ban, Check, X, Eye, Copy, ExternalLink } from 'lucide-react';
import { UnifiedAlert } from '@/hooks/useRealtimeAlerts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  alert: UnifiedAlert;
  onResolve: (alert: UnifiedAlert) => void;
  onDismiss: (alert: UnifiedAlert) => void;
  onViewDetails: (alert: UnifiedAlert) => void;
}

export const AlertCard = ({ alert, onResolve, onDismiss, onViewDetails }: AlertCardProps) => {
  const getSourceIcon = () => {
    switch (alert.source) {
      case 'admin_notifications': return <Bell className="w-4 h-4" />;
      case 'security_events': return <Shield className="w-4 h-4" />;
      case 'system_issues': return <AlertTriangle className="w-4 h-4" />;
      case 'brute_force_alerts': return <Ban className="w-4 h-4" />;
      case 'notifications': return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = () => {
    switch (alert.severity) {
      case 'critical': return 'border-red-500 bg-red-500/10';
      case 'high': return 'border-orange-500 bg-orange-500/10';
      case 'medium': return 'border-yellow-500 bg-yellow-500/10';
      case 'low': return 'border-blue-500 bg-blue-500/10';
      default: return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getSeverityBadgeColor = () => {
    switch (alert.severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const copyAlertId = () => {
    navigator.clipboard.writeText(alert.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        "relative p-4 rounded-xl border-l-4 backdrop-blur-sm bg-card/50 hover:bg-card/70 transition-all duration-200",
        getSeverityColor()
      )}
    >
      {/* Clear/Dismiss button - always visible in top-right */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (alert.status === 'open') {
                  if (alert.source === 'admin_notifications' || alert.source === 'notifications') {
                    onDismiss(alert);
                  } else {
                    onResolve(alert);
                  }
                }
              }}
              disabled={alert.status !== 'open'}
              className={cn(
                "absolute top-2 right-2 h-7 w-7 p-0 transition-colors",
                alert.status === 'open'
                  ? "text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                  : "text-muted-foreground/30 cursor-not-allowed"
              )}
            >
              <X className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {alert.status !== 'open' 
                ? 'Alert already resolved' 
                : (alert.source === 'admin_notifications' || alert.source === 'notifications')
                ? 'Dismiss alert'
                : 'Resolve alert'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-start justify-between gap-4 pr-8">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1 text-primary">
            {getSourceIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{alert.title}</h3>
              <Badge variant="outline" className={cn("text-xs", getSeverityBadgeColor())}>
                {alert.severity.toUpperCase()}
              </Badge>
              {alert.status === 'resolved' && (
                <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                  <Check className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="capitalize">{alert.source.replace(/_/g, ' ')}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
              {alert.metadata?.ip_address && (
                <>
                  <span>•</span>
                  <span className="font-mono">{alert.metadata.ip_address}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {alert.status === 'open' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onResolve(alert)}
              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={copyAlertId}
            className="text-muted-foreground hover:text-foreground"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(alert)}
            className="text-primary hover:text-primary/80"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
