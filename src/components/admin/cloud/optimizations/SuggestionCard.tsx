import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  DollarSign, 
  Zap, 
  HardDrive, 
  Shield,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { OptimizationSuggestion } from '@/hooks/useOptimizationSuggestions';

interface SuggestionCardProps {
  suggestion: OptimizationSuggestion;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
  onViewDetails: (suggestion: OptimizationSuggestion) => void;
}

export const SuggestionCard = ({ 
  suggestion, 
  onApply, 
  onDismiss, 
  onViewDetails 
}: SuggestionCardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/5';
      case 'high': return 'border-orange-500 bg-orange-500/5';
      case 'medium': return 'border-yellow-500 bg-yellow-500/5';
      case 'low': return 'border-blue-500 bg-blue-500/5';
      default: return 'border-muted';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cost': return <DollarSign className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'storage': return <HardDrive className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`p-5 border-l-4 ${getSeverityColor(suggestion.severity)} hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getSeverityBadge(suggestion.severity)}
          <Badge variant="outline" className="flex items-center gap-1">
            {getTypeIcon(suggestion.suggestion_type)}
            <span className="capitalize">{suggestion.suggestion_type}</span>
          </Badge>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {suggestion.impact_score}
        </Badge>
      </div>

      <h3 className="text-lg font-semibold mb-2">{suggestion.title}</h3>
      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>

      {(suggestion.potential_savings || suggestion.potential_improvement) && (
        <div className="flex flex-wrap gap-3 mb-4">
          {suggestion.potential_savings && (
            <div className="flex items-center gap-1.5 text-sm">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-medium text-green-500">
                ${suggestion.potential_savings.toFixed(2)}/mo
              </span>
            </div>
          )}
          {suggestion.potential_improvement && (
            <div className="flex items-center gap-1.5 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-yellow-500">
                {suggestion.potential_improvement}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm">{suggestion.recommendation}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {suggestion.auto_applicable && (
          <Button 
            size="sm" 
            onClick={() => onApply(suggestion.id)}
            className="flex-1"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Apply Fix
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onViewDetails(suggestion)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-1" />
          Details
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onDismiss(suggestion.id)}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>

      {suggestion.affected_service && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            Affected: <span className="font-medium">{suggestion.affected_service}</span>
          </span>
        </div>
      )}
    </Card>
  );
};
