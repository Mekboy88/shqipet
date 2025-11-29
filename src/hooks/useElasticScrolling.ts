
import { useRef } from 'react';

interface ElasticScrollingOptions {
  enabled?: boolean;
  elasticity?: number;
  damping?: number;
  maxStretch?: number;
}

export const useElasticScrolling = ({
  enabled = true,
  elasticity = 0.3,
  damping = 0.85,
  maxStretch = 100
}: ElasticScrollingOptions = {}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // This hook is now simplified to just return a ref
  // The actual elastic behavior is handled globally
  return containerRef;
};
