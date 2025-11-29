import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface KPIBadge {
  label: string;
  value: number | string;
  variant: 'default' | 'destructive' | 'secondary' | 'outline';
  tooltip?: string;
}

export interface KPICardData {
  id: string;
  title: string;
  primaryValue: string | number;
  primarySuffix?: string;
  secondaryMetrics: {
    label: string;
    value: string | number;
    suffix?: string;
  }[];
  trend: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  badges?: KPIBadge[];
  sparklineData?: number[];
  timeWindow: '1h' | '24h' | '7d' | '30d';
  onTimeWindowChange: (window: '1h' | '24h' | '7d' | '30d') => void;
  lastUpdated: Date;
  ctaLabel: string;
  onCtaClick: () => void;
  realtimeStatus: 'connected' | 'connecting' | 'disconnected';
  healthStatus?: 'healthy' | 'warning' | 'critical';
}

interface KPICardProps {
  data: KPICardData;
  className?: string;
}

const Sparkline: React.FC<{ data: number[]; trend: 'up' | 'down' | 'stable' }> = ({ 
  data, 
  trend 
}) => {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const trendColor = trend === 'up' ? 'stroke-emerald-500' : 
                    trend === 'down' ? 'stroke-red-500' : 
                    'stroke-blue-500';

  return (
    <div className="h-8 w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polyline
          fill="none"
          strokeWidth="2"
          className={cn('transition-colors', trendColor)}
          points={points}
        />
      </svg>
    </div>
  );
};

const StatusIndicator: React.FC<{ 
  status: 'connected' | 'connecting' | 'disconnected' | 'healthy' | 'warning' | 'critical';
  size?: 'sm' | 'md';
}> = ({ status, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  switch (status) {
    case 'connected':
    case 'healthy':
      return <CheckCircle className={cn(iconSize, 'text-emerald-500')} />;
    case 'connecting':
    case 'warning':
      return <AlertTriangle className={cn(iconSize, 'text-amber-500')} />;
    case 'disconnected':
    case 'critical':
      return <XCircle className={cn(iconSize, 'text-red-500')} />;
    default:
      return <Minus className={cn(iconSize, 'text-gray-500')} />;
  }
};

export const KPICard: React.FC<KPICardProps> = ({ data, className }) => {
  const {
    title,
    primaryValue,
    primarySuffix,
    secondaryMetrics,
    trend,
    badges,
    sparklineData,
    timeWindow,
    onTimeWindowChange,
    lastUpdated,
    ctaLabel,
    onCtaClick,
    realtimeStatus,
    healthStatus
  } = data;

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card className={cn('relative overflow-hidden transition-all hover:shadow-lg', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">{title}</h3>
            <StatusIndicator status={realtimeStatus} />
            {healthStatus && <StatusIndicator status={healthStatus} />}
          </div>
          <Select value={timeWindow} onValueChange={onTimeWindowChange}>
            <SelectTrigger className="w-16 h-7 text-xs border-0 shadow-none bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1h</SelectItem>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Metric */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">
              {typeof primaryValue === 'number' ? primaryValue.toLocaleString() : primaryValue}
            </span>
            {primarySuffix && (
              <span className="text-sm text-muted-foreground">{primarySuffix}</span>
            )}
          </div>
          
          {/* Trend Indicator */}
          <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
            {getTrendIcon()}
            <span>{trend.percentage > 0 ? '+' : ''}{trend.percentage}%</span>
            <span className="text-muted-foreground">vs {trend.period}</span>
          </div>
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="py-2">
            <Sparkline data={sparklineData} trend={trend.direction} />
          </div>
        )}

        {/* Secondary Metrics */}
        {secondaryMetrics.length > 0 && (
          <div className="grid grid-cols-1 gap-2 text-xs">
            {secondaryMetrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-medium">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                  {metric.suffix}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant={badge.variant} 
                className="text-xs px-2 py-0.5"
                title={badge.tooltip}
              >
                {badge.label}: {badge.value}
              </Badge>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(lastUpdated)}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCtaClick}
            className="h-7 px-2 text-xs"
          >
            {ctaLabel}
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};