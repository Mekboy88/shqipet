import React from 'react';
import { Button } from "@/components/ui/button";
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LiveTopologyButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
}

const LiveTopologyButton: React.FC<LiveTopologyButtonProps> = ({ 
  className = "", 
  variant = "outline" 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/admin/core-platform/live-connection-topology');
  };

  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Activity className="w-4 h-4" />
      Live Topology
    </Button>
  );
};

export default LiveTopologyButton;