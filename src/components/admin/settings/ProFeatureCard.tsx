import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface ProFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tooltip: string;
  tooltipType?: 'info' | 'warning' | 'danger';
  children?: React.ReactNode;
  enabled?: boolean;
  onToggle?: (value: boolean) => void;
  badge?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const InfoTooltip = ({ children, content, type = 'info' }: { 
  children: React.ReactNode, 
  content: string, 
  type?: 'info' | 'warning' | 'danger' 
}) => {
  const iconColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500';
  
  const formatContent = (text: string) => {
    const parts = text.split('CONSEQUENCES:');
    if (parts.length === 1) return <p className="text-sm">{text}</p>;
    
    return (
      <div>
        <p className="text-sm">{parts[0]}</p>
        <p className="text-sm"><span className="text-red-500 font-semibold">CONSEQUENCES:</span>{parts[1]}</p>
      </div>
    );
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {children}
            <Info className={`h-4 w-4 ${iconColor} cursor-help`} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-2">
            {formatContent(content)}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const ProFeatureCard: React.FC<ProFeatureCardProps> = ({
  icon,
  title,
  description,
  tooltip,
  tooltipType = 'info',
  children,
  enabled,
  onToggle,
  badge,
  action
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <InfoTooltip 
        content={tooltip}
        type={tooltipType}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <label className="font-medium">{title}</label>
            {badge && <Badge variant="outline">{badge}</Badge>}
          </div>
          <p className="text-sm text-gray-500">{description}</p>
          {children}
        </div>
      </InfoTooltip>
      <div className="flex items-center gap-2">
        {onToggle && (
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
          />
        )}
        {action && (
          <Button variant="outline" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};