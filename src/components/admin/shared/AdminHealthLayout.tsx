import React from 'react';
import { cn } from '@/lib/utils';

interface AdminHealthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AdminHealthLayout: React.FC<AdminHealthLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <>
      <style>{`
        .admin-health-layout {
          --header-spacing: 16px;
          --icon-size: 20px;
          --icon-text-gap: 8px;
          --section-padding: 16px;
          --button-gap: 12px;
        }
        
        .admin-health-header {
          display: flex;
          align-items: center;
          gap: var(--icon-text-gap);
          font-size: 1.125rem;
          font-weight: 600;
          color: hsl(var(--foreground));
          margin-bottom: var(--header-spacing);
        }
        
        .admin-health-header svg,
        .admin-health-header .emoji-icon {
          width: var(--icon-size);
          height: var(--icon-size);
          flex-shrink: 0;
        }
        
        .admin-health-section {
          background: white;
          border: 1px solid hsl(var(--border));
          border-radius: 8px;
          padding: var(--section-padding);
          margin-bottom: var(--section-padding);
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }
        
        .admin-health-buttons {
          display: flex;
          align-items: center;
          gap: var(--button-gap);
          flex-wrap: wrap;
        }
        
        .admin-health-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, hsl(var(--border)), transparent);
          margin: var(--section-padding) 0;
        }
      `}</style>
      <div className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
        "admin-health-layout",
        className
      )}>
        {children}
      </div>
    </>
  );
};