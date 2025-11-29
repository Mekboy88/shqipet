import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertStatsProps {
  stats: {
    total: number;
    critical: number;
    open: number;
    resolved: number;
    resolutionRate: number;
  };
}

export const AlertStats = ({ stats }: AlertStatsProps) => {
  const statCards = [
    {
      label: 'Total Alerts',
      value: stats.total,
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Critical Alerts',
      value: stats.critical,
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
    },
    {
      label: 'Open Alerts',
      value: stats.open,
      icon: AlertTriangle,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Resolution Rate',
      value: `${stats.resolutionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
