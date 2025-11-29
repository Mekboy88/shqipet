import React from 'react';
import { Button } from "@/components/ui/button";
import { Activity, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopologyButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  showIcon?: boolean;
  showText?: boolean;
  external?: boolean;
}

const TopologyButton: React.FC<TopologyButtonProps> = ({ 
  className = "",
  variant = "outline",
  size = "sm",
  showIcon = true,
  showText = true,
  external = false
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (external) {
      window.open('/admin/core-platform/live-connection-topology', '_blank');
    } else {
      navigate('/admin/core-platform/live-connection-topology');
    }
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      {showIcon && <Activity className="w-4 h-4" />}
      {showText && "Live Topology"}
      {external && <ExternalLink className="w-3 h-3" />}
    </Button>
  );
};

export default TopologyButton;