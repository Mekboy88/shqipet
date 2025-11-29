import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OptimizationSuggestion } from '@/hooks/useOptimizationSuggestions';
import { 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Zap,
  Calendar,
  Tag,
  AlertCircle,
  Info
} from 'lucide-react';

interface SuggestionDetailModalProps {
  suggestion: OptimizationSuggestion | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const SuggestionDetailModal = ({
  suggestion,
  isOpen,
  onClose,
  onApply,
  onDismiss
}: SuggestionDetailModalProps) => {
  if (!suggestion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant={suggestion.severity === 'critical' ? 'destructive' : 'default'}
              className="capitalize"
            >
              {suggestion.severity}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {suggestion.suggestion_type}
            </Badge>
            <Badge variant="secondary">
              Impact: {suggestion.impact_score}
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{suggestion.title}</DialogTitle>
          <DialogDescription className="text-base">
            {suggestion.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Impact Metrics */}
          {(suggestion.potential_savings || suggestion.potential_improvement) && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Expected Impact
              </h4>
              <div className="space-y-2">
                {suggestion.potential_savings && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Savings</span>
                    <span className="font-semibold text-green-500 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {suggestion.potential_savings.toFixed(2)}
                    </span>
                  </div>
                )}
                {suggestion.potential_improvement && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Improvement</span>
                    <span className="font-semibold text-yellow-500">
                      {suggestion.potential_improvement}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendation */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Recommended Action
            </h4>
            <p className="text-sm">{suggestion.recommendation}</p>
          </div>

          {/* Metadata */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Info className="w-4 h-4" />
              Additional Information
            </h4>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{suggestion.category}</span>
              </div>
              
              {suggestion.affected_service && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{suggestion.affected_service}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {new Date(suggestion.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Auto-fix:</span>
                <span className="font-medium">
                  {suggestion.auto_applicable ? 'Available' : 'Manual'}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata JSON */}
          {suggestion.metadata && Object.keys(suggestion.metadata).length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Technical Details</h4>
              <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">
                {JSON.stringify(suggestion.metadata, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {suggestion.auto_applicable && (
              <Button 
                onClick={() => {
                  onApply(suggestion.id);
                  onClose();
                }}
                className="flex-1"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Apply Fix
              </Button>
            )}
            <Button 
              variant="outline"
              onClick={() => {
                onDismiss(suggestion.id);
                onClose();
              }}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
