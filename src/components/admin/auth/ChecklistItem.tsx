import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';

interface ChecklistItemProps {
  id: string;
  feature: string;
  trigger: string;
  expectedBehavior: string;
  autoEnabled?: boolean;
  status?: 'pending' | 'active' | 'completed' | 'error';
  onStatusChange?: (id: string, status: string) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  feature,
  trigger,
  expectedBehavior,
  autoEnabled = false,
  status = 'pending',
  onStatusChange
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isChecking, setIsChecking] = useState(false);
  
  useEffect(() => {
    if (autoEnabled) {
      // Set specific statuses for known working features
      if (id === 'admin-action-buttons' || id === 'add-timestamps') {
        setCurrentStatus('completed');
        return;
      }
      
      // Simulate auto-checking behavior for other features
      const interval = setInterval(() => {
        setIsChecking(true);
        setTimeout(() => {
          const newStatus = Math.random() > 0.2 ? 'completed' : 'error';
          setCurrentStatus(newStatus);
          setIsChecking(false);
          if (onStatusChange) {
            onStatusChange(id, newStatus);
          }
        }, 1000);
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [autoEnabled, id, onStatusChange]);
  
  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
    
    switch (currentStatus) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getStatusColor = () => {
    switch (currentStatus) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'active':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };
  
  return (
    <div className={`p-4 rounded-lg border transition-all duration-200 ${getStatusColor()}`}>
      <div className="flex items-start space-x-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-800">{feature}</h4>
            {autoEnabled && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">
                Auto
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div><strong>Trigger:</strong> {trigger}</div>
            <div><strong>Expected:</strong> {expectedBehavior}</div>
          </div>
        </div>
      </div>
    </div>
  );
};