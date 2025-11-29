
import { useEffect } from 'react';
import { GlobalElasticOptions } from './types';
import { ElasticState } from './types';
import { createTouchHandlers } from './touchHandler';
import { createWheelHandler } from './wheelHandler';
import { createScrollHandler } from './scrollHandler';

export const useGlobalElasticScrolling = ({
  enabled = true,
  maxElasticDistance = 450,
  elasticityMultiplier = 16,
  indicatorEnabled = true,
  resistanceCurve = 'soft'
}: GlobalElasticOptions = {}) => {
  useEffect(() => {
    if (!enabled) return;

    console.log('✅ Elastic bounce active: maxDistance=' + maxElasticDistance + 'px, multiplier=' + elasticityMultiplier);

    // Create elastic state with config
    const state: ElasticState = {
      startX: 0,
      startY: 0,
      currentStretchX: 0,
      currentStretchY: 0,
      isElasticActive: false,
      isScrolling: false,
      animationFrame: null,
      scrollTimeout: null,
      lastTransformEl: null,
      lastScrollEl: null,
      scrollSpeed: 0,
      lastScrollTime: 0,
      config: {
        enabled,
        maxElasticDistance,
        elasticityMultiplier,
        indicatorEnabled,
        resistanceCurve
      }
    };

    // Create handlers
    const touchHandlers = createTouchHandlers(state);
    const wheelHandler = createWheelHandler(state);
    const scrollHandler = createScrollHandler(state);

    // Attach event listeners
    document.addEventListener('touchstart', touchHandlers.handleTouchStart, { passive: true });
    document.addEventListener('touchmove', touchHandlers.handleTouchMove, { passive: false });
    document.addEventListener('touchend', touchHandlers.handleTouchEnd, { passive: true });
    document.addEventListener('wheel', wheelHandler.handleWheel, { passive: false });
    window.addEventListener('scroll', scrollHandler.handleScroll, { passive: true });

    console.log('✅ Elastic bounce handlers attached globally');

    // Cleanup
    return () => {
      document.removeEventListener('touchstart', touchHandlers.handleTouchStart);
      document.removeEventListener('touchmove', touchHandlers.handleTouchMove);
      document.removeEventListener('touchend', touchHandlers.handleTouchEnd);
      document.removeEventListener('wheel', wheelHandler.handleWheel);
      window.removeEventListener('scroll', scrollHandler.handleScroll);
      
      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
      }
      if (state.scrollTimeout) {
        clearTimeout(state.scrollTimeout);
      }
      
      console.log('✅ Elastic bounce handlers removed');
    };
  }, [enabled, maxElasticDistance, elasticityMultiplier, indicatorEnabled, resistanceCurve]);
};
