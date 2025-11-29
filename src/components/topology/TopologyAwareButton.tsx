import React, { useEffect } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { registerAction, trackAction, AppKind } from '@/shared/topology';

interface TopologyAwareButtonProps extends ButtonProps {
  id: string;
  app: AppKind;
  pageId: string;
  section?: string;
  title?: string;
  onClick?: () => void | Promise<void>;
}

/**
 * Topology-aware Button component that automatically registers 
 * and tracks actions for health monitoring
 */
export const TopologyAwareButton: React.FC<TopologyAwareButtonProps> = ({
  id,
  app,
  pageId,
  section,
  title,
  onClick,
  children,
  ...buttonProps
}) => {
  // Register action on mount
  useEffect(() => {
    registerAction(id, { app, pageId, section, title });
  }, [id, app, pageId, section, title]);

  // Wrap onClick with tracking
  const wrappedOnClick = onClick ? trackAction(id, onClick) : undefined;

  return (
    <Button onClick={wrappedOnClick} {...buttonProps}>
      {children}
    </Button>
  );
};