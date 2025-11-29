/**
 * LoadingDots - Smooth animated loading indicator
 * Used for avatar and cover photo loading states
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingDotsProps {
  className?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  className,
  message,
  size = 'md',
  variant = 'light'
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2', 
    lg: 'w-3 h-3'
  };

  const dotColorClasses = {
    light: 'bg-white/80',
    dark: 'bg-muted-foreground'
  };

  const textColorClasses = {
    light: 'text-white',
    dark: 'text-muted-foreground'
  };

  const bgClasses = {
    light: 'bg-black/40 backdrop-blur-sm',
    dark: 'bg-white/80 backdrop-blur-sm'
  };

  return (
    <div className={cn(
      'absolute inset-0 flex flex-col items-center justify-center rounded-lg transition-all duration-300',
      bgClasses[variant],
      className
    )}>
      {message && (
        <div className={cn('text-sm font-medium mb-3', textColorClasses[variant])}>
          {message}
        </div>
      )}
      
      <div className="flex space-x-1">
        <div 
          className={cn(
            sizeClasses[size], 
            dotColorClasses[variant],
            'rounded-full animate-bounce'
          )}
          style={{ animationDelay: '0s', animationDuration: '900ms' }}
        />
        <div 
          className={cn(
            sizeClasses[size], 
            dotColorClasses[variant],
            'rounded-full animate-bounce'
          )}
          style={{ animationDelay: '150ms', animationDuration: '900ms' }}
        />
        <div 
          className={cn(
            sizeClasses[size], 
            dotColorClasses[variant],
            'rounded-full animate-bounce'
          )}
          style={{ animationDelay: '300ms', animationDuration: '900ms' }}
        />
      </div>
    </div>
  );
};

export default LoadingDots;