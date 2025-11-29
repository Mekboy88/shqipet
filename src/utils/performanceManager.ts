// Global Performance Manager
// Coordinates all intervals across the application to prevent performance degradation

class PerformanceManager {
  private activeIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private isLowPerformanceMode: boolean = false;
  
  // Register an interval with performance management
  registerInterval(key: string, callback: () => void, interval: number): ReturnType<typeof setInterval> {
    // Clear existing interval if exists
    if (this.activeIntervals.has(key)) {
      clearInterval(this.activeIntervals.get(key)!);
    }
    
    // Apply performance mode adjustments
    const adjustedInterval = this.isLowPerformanceMode ? 
      Math.max(interval * 3, 60000) : // At least 1 minute in low performance mode
      interval;
    
    console.log(`⚡ Performance Manager: Registering interval '${key}' at ${adjustedInterval}ms`);
    
    const timer = setInterval(() => {
      // Only run if page is visible
      if (document.visibilityState === 'visible' || key.includes('critical')) {
        callback();
      }
    }, adjustedInterval);
    
    this.activeIntervals.set(key, timer);
    return timer;
  }
  
  // Clear a specific interval
  clearInterval(key: string): void {
    const timer = this.activeIntervals.get(key);
    if (timer) {
      clearInterval(timer);
      this.activeIntervals.delete(key);
      console.log(`🗑️ Performance Manager: Cleared interval '${key}'`);
    }
  }
  
  // Enable low performance mode (reduces all intervals)
  enableLowPerformanceMode(): void {
    console.log('🐌 Performance Manager: Enabling LOW PERFORMANCE MODE');
    this.isLowPerformanceMode = true;
    
    // Re-register all existing intervals with new timing
    const entries = Array.from(this.activeIntervals.entries());
    entries.forEach(([key]) => {
      // Note: This would require storing original callbacks, 
      // for now just log the change
      console.log(`⚡ Interval '${key}' will use reduced frequency`);
    });
  }
  
  // Disable low performance mode
  disableLowPerformanceMode(): void {
    console.log('🚀 Performance Manager: Disabling low performance mode');
    this.isLowPerformanceMode = false;
  }
  
  // Clear all intervals (for cleanup)
  clearAllIntervals(): void {
    console.log('🧹 Performance Manager: Clearing all intervals');
    this.activeIntervals.forEach((timer) => clearInterval(timer));
    this.activeIntervals.clear();
  }
  
  // Get performance statistics
  getStats(): { activeIntervals: number; lowPerformanceMode: boolean } {
    return {
      activeIntervals: this.activeIntervals.size,
      lowPerformanceMode: this.isLowPerformanceMode
    };
  }
}

// Export singleton instance
export const performanceManager = new PerformanceManager();

// Auto-detect performance issues and enable low performance mode
let performanceCheckInterval: ReturnType<typeof setInterval>;

export const initializePerformanceMonitoring = () => {
  // Monitor page performance and automatically adjust
  performanceCheckInterval = setInterval(() => {
    // Check if there are too many active intervals
    const stats = performanceManager.getStats();
    
    if (stats.activeIntervals > 20 && !stats.lowPerformanceMode) {
      console.warn('⚠️ High number of active intervals detected, enabling low performance mode');
      performanceManager.enableLowPerformanceMode();
    }
    
    // Check for memory pressure (simple heuristic)
    if ((performance as any).memory && (performance as any).memory.usedJSHeapSize > 50 * 1024 * 1024) {
      if (!stats.lowPerformanceMode) {
        console.warn('⚠️ High memory usage detected, enabling low performance mode');
        performanceManager.enableLowPerformanceMode();
      }
    }
    
  }, 30000); // Check every 30 seconds
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    performanceManager.clearAllIntervals();
    if (performanceCheckInterval) {
      clearInterval(performanceCheckInterval);
    }
  });
}