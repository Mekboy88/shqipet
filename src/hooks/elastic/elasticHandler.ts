
import { ElasticState } from './types';
import { findScrollableParent, isAtBoundary } from './domUtils';
import { applyElasticTransform } from './elasticTransform';

export const createElasticHandler = (state: ElasticState) => {
  const canStartElastic = (startX: number, startY: number): boolean => {
    // Allow elastic only when not actively scrolling
    if (state.isScrolling) {
      return false;
    }
    
    return true;
  };

  const handleElasticMove = (deltaY: number, e: TouchEvent): boolean => {
    // Allow subtle elastic movement
    if (!state.isElasticActive) {
      return false;
    }
    
    const resistance = 0.35; // Lower = more elastic (reduced from default)
    const targetStretchY = deltaY * resistance;
    
    const { currentStretchY } = applyElasticTransform(
      0,
      targetStretchY,
      state.currentStretchX,
      state.currentStretchY
    );
    
    state.currentStretchY = currentStretchY;
    return true;
  };

  const startElastic = (deltaY: number, e: TouchEvent): boolean => {
    state.isElasticActive = true;
    return true;
  };

  return {
    canStartElastic,
    startElastic,
    handleElasticMove
  };
};
