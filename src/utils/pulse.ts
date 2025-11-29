/**
 * Convert latency (ms) to CSS animation duration for pulse effects
 */
export const latencyToPulse = (ms: number): string => {
  if (!Number.isFinite(ms) || ms <= 0) return "2.2s";
  
  // Faster latency = faster pulse (more responsive feel)
  if (ms < 40)  return "0.6s";  // Very fast
  if (ms < 80)  return "0.9s";  // Fast  
  if (ms < 150) return "1.2s";  // Normal
  if (ms < 300) return "1.6s";  // Slow
  return "2.0s";                // Very slow
};

/**
 * Get status color based on online state and latency
 */
export const statusColor = (online: boolean, ms: number): string => {
  if (!online) return "#ef4444"; // red-500
  if (ms < 120) return "#22c55e"; // green-500 - excellent
  if (ms < 300) return "#f59e0b"; // amber-500 - degraded
  return "#ef4444";              // red-500 - poor
};

/**
 * Get status text description
 */
export const statusText = (online: boolean, ms: number): string => {
  if (!online) return "Offline";
  if (ms < 120) return "Excellent";
  if (ms < 300) return "Degraded";
  return "Poor";
};

/**
 * Get Tailwind CSS classes for status
 */
export const statusClasses = (online: boolean, ms: number): string => {
  if (!online) return "text-red-500";
  if (ms < 120) return "text-green-500";
  if (ms < 300) return "text-yellow-500";
  return "text-red-500";
};

/**
 * Calculate average latency between two nodes
 */
export const averageLatency = (node1Ms: number, node2Ms: number): number => {
  return Math.round((node1Ms + node2Ms) / 2);
};

/**
 * Generate CSS custom properties for dynamic animation
 */
export const generatePulseStyle = (ms: number): React.CSSProperties => {
  return {
    '--pulse-duration': latencyToPulse(ms),
    '--pulse-color': statusColor(true, ms),
  } as React.CSSProperties;
};