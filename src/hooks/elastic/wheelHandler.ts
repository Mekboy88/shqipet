
import { ElasticState } from './types';
import { findScrollableParent, getNearestScrollContainer, getTransformTarget } from './domUtils';
import { updateIndicator, hideIndicator } from './indicator';

export const createWheelHandler = (state: ElasticState) => {
  let resetTimeout: ReturnType<typeof setTimeout> | null = null;
  
  const handleWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Skip if elastic is disabled on this element
    if (target.closest('[data-elastic-disabled="true"]')) return;

    // Ignore horizontal scrollers and horizontal-dominant wheels
    if (target.closest('[data-horizontal-scroll="true"]')) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    // Prefer data-scroll-container, fallback to nearest scrollable
    const scrollEl = (getNearestScrollContainer(target) as HTMLElement) || document.documentElement;
    if (!scrollEl) return;

    // Direction and boundaries
    const deltaY = -e.deltaY;
    const atTop = scrollEl.scrollTop <= 0;
    const atBottom = Math.ceil(scrollEl.scrollTop + scrollEl.clientHeight) >= scrollEl.scrollHeight;

    // Engage elastic when attempting to scroll past boundaries (no fast threshold)
    const pullingDownAtTop = deltaY > 0 && atTop;
    const pushingUpAtBottom = e.deltaY > 0 && atBottom;

    if (!pullingDownAtTop && !pushingUpAtBottom) {
      return; // allow natural scrolling
    }

    e.preventDefault();

    const { maxElasticDistance, elasticityMultiplier } = state.config;

    if (pullingDownAtTop) {
      const elasticDelta = deltaY * elasticityMultiplier * 0.4; // positive
      state.currentStretchY = Math.min(state.currentStretchY + elasticDelta, maxElasticDistance);
    } else if (pushingUpAtBottom) {
      const downwardDelta = e.deltaY * elasticityMultiplier * 0.4; // positive
      state.currentStretchY = Math.max(state.currentStretchY - downwardDelta, -maxElasticDistance); // negative stretch
    }

    // Get transform target (ensure we don't pick the indicator itself)
    let container = getTransformTarget(scrollEl) as HTMLElement | null;
    const indicatorEl = scrollEl.querySelector(':scope > [data-elastic-indicator="true"]') as HTMLElement | null;
    if (indicatorEl && container === indicatorEl) {
      container = (indicatorEl.nextElementSibling as HTMLElement) || container;
    }
    if (!container) return;

    state.lastTransformEl = container;
    state.lastScrollEl = scrollEl;

    // Apply transform immediately - transition:none only set once at stretch start
    if (!state.isElasticActive) {
      container.style.willChange = 'transform';
      container.style.transition = 'none';
    }

    state.isElasticActive = true;
    container.style.transform = `translate3d(0, ${state.currentStretchY}px, 0)`;

    // Update indicator (use negative distance for bottom to compress)
  if (state.config.indicatorEnabled && state.lastScrollEl) {
    console.debug('[elastic-indicator] wheel', { atTop, atBottom, distance: state.currentStretchY });
    updateIndicator(state.lastScrollEl, state.currentStretchY);
  }

    // Snap-back after 180ms idle
    if (resetTimeout) clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      if (container) {
        container.style.transition = 'transform 0.42s cubic-bezier(0.25, 1.6, 0.45, 0.94)';
        container.style.transform = 'translate3d(0, 0, 0)';

        setTimeout(() => {
          container.style.transition = '';
          container.style.willChange = '';
        }, 460);
      }

      // Hide indicator
      if (state.config.indicatorEnabled && state.lastScrollEl) {
        hideIndicator(state.lastScrollEl);
      }

      state.isElasticActive = false;
      state.currentStretchY = 0;
      state.scrollSpeed = 0;
      state.lastTransformEl = null;
      state.lastScrollEl = null;
      resetTimeout = null;
    }, 180);
  };

  return { handleWheel };
};
