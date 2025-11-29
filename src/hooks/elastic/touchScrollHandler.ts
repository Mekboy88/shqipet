
import { ElasticState } from './types';
import { findScrollableParent } from './domUtils';

export const createTouchScrollHandler = (state: ElasticState) => {
  const shouldScroll = (deltaX: number, deltaY: number, startX: number, startY: number): boolean => {
    // INSTANTLY favor scrolling over elastic for ANY movement to prevent interference
    const hasAnyMovement = Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5;
    if (hasAnyMovement) {
      console.log('SCROLL MODE - ANY movement detected, COMPLETELY blocking elastic');
      
      // INSTANTLY disable and reset elastic transforms to prevent ANY interference
      if (state.isElasticActive) {
        state.isElasticActive = false;
        state.currentStretchX = 0;
        state.currentStretchY = 0;
        
        const containers = [
          document.querySelector('[data-elastic-container="true"]'),
          document.querySelector('.flex.w-full.h-\\[calc\\(100vh-56px\\)\\]'),
          document.querySelector('[data-scroll-container="true"]'),
          document.querySelector('.profile-scroll-container')
        ];
        
        containers.forEach(container => {
          if (container) {
            const element = container as HTMLElement;
            element.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
            element.style.setProperty('transition', 'none', 'important');
          }
        });
      }
      
      return true;
    }
    
    return true; // Always default to scroll to prevent elastic conflicts
  };

  const handleScrollMove = (): boolean => {
    if (!state.isScrolling) return false;
    
    // INSTANTLY disable elastic and reset transforms to prevent ANY glitching
    if (state.isElasticActive) {
      console.log('SCROLL MOVE - INSTANT elastic disable and transform reset');
      state.isElasticActive = false;
      state.currentStretchX = 0;
      state.currentStretchY = 0;
      
      // Force reset transforms immediately to prevent ANY interference
      const containers = [
        document.querySelector('[data-elastic-container="true"]'),
        document.querySelector('.flex.w-full.h-\\[calc\\(100vh-56px\\)\\]'),
        document.querySelector('[data-scroll-container="true"]'),
        document.querySelector('.profile-scroll-container')
      ];
      
      containers.forEach(container => {
        if (container) {
          const element = container as HTMLElement;
          element.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
          element.style.setProperty('transition', 'none', 'important');
        }
      });
    }
    
    return true;
  };

  const startScroll = (deltaX: number, deltaY: number, startX: number, startY: number): boolean => {
    // ALWAYS prioritize scrolling with ZERO tolerance for elastic interference
    state.isScrolling = true;
    
    // INSTANTLY disable elastic and reset transforms with ZERO delay
    if (state.isElasticActive) {
      console.log('SCROLL STARTED - INSTANT elastic disable and transform reset');
      state.isElasticActive = false;
      state.currentStretchX = 0;
      state.currentStretchY = 0;
      
      // Force reset transforms immediately to prevent ANY glitching or interference
      const containers = [
        document.querySelector('[data-elastic-container="true"]'),
        document.querySelector('.flex.w-full.h-\\[calc\\(100vh-56px\\)\\]'),
        document.querySelector('[data-scroll-container="true"]'),
        document.querySelector('.profile-scroll-container')
      ];
      
      containers.forEach(container => {
        if (container) {
          const element = container as HTMLElement;
          element.style.setProperty('transform', 'translate3d(0, 0, 0)', 'important');
          element.style.setProperty('transition', 'none', 'important');
        }
      });
    }
    
    console.log('SCROLL STARTED - Elastic COMPLETELY blocked and transforms reset with ZERO interference');
    return true;
  };

  return {
    shouldScroll,
    startScroll,
    handleScrollMove
  };
};
