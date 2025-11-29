import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface OptimizationScoreProps {
  stats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    avgImpactScore: number;
  };
}

export const OptimizationScore = ({ stats }: OptimizationScoreProps) => {
  // Calculate score (100 - weighted severity penalties)
  const score = Math.max(0, Math.min(100, 
    100 - (stats.critical * 15) - (stats.high * 8) - (stats.medium * 3) - (stats.low * 1)
  ));

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Optimization Score</h3>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
              className={getScoreColor(score)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`text-sm font-medium ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Critical</span>
              <span className="font-medium text-red-500">{stats.critical}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">High</span>
              <span className="font-medium text-orange-500">{stats.high}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Medium</span>
              <span className="font-medium text-yellow-500">{stats.medium}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Low</span>
              <span className="font-medium text-blue-500">{stats.low}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
