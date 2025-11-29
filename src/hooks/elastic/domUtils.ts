
export const getMainContainer = () => {
  // Priority order for finding the elastic container - target the main content area (avoid fixed headers)
  return (
    document.querySelector('.flex.w-full.h-\\[calc\\(100vh-56px\\)\\]') ||
    document.querySelector('[data-scroll-container="true"]') ||
    document.querySelector('.profile-scroll-container') ||
    document.querySelector('main') ||
    document.querySelector('[data-elastic-container="true"]') ||
    document.body
  );
};

export const isAtBoundary = (element: Element, direction: 'top' | 'left' | 'right'): boolean => {
  const el = element as HTMLElement;
  if (direction === 'top') {
    return el.scrollTop <= 0;
  } else if (direction === 'left') {
    return el.scrollLeft <= 0;
  } else if (direction === 'right') {
    return el.scrollLeft >= (el.scrollWidth - el.clientWidth);
  }
  return false;
};

export const findScrollableParent = (element: Element): Element | null => {
  if (!element || element === document.body) return document.documentElement;

  const style = window.getComputedStyle(element);
  const overflow = style.overflow;
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;

  // Prefer vertical scroll containers only
  const hasVerticalScroll = /(auto|scroll)/.test(overflowY || overflow);
  const hasHorizontalScroll = /(auto|scroll)/.test(overflowX);

  const isVerticallyScrollable = hasVerticalScroll && (element.scrollHeight > (element as HTMLElement).clientHeight);

  if (isVerticallyScrollable) {
    return element;
  }

  return findScrollableParent((element as HTMLElement).parentElement!);
};

export const getNearestScrollContainer = (target: Element): HTMLElement | null => {
  if (!target) return null;
  const candidates = [
    '[data-scroll-container="true"]',
    '.feed-content',
    '#feed-content',
    '#feed-container',
    '.max-w-\\[756px\\]'
  ];
  for (const sel of candidates) {
    const el = (target as HTMLElement).closest(sel) as HTMLElement | null;
    if (el) return el;
  }
  return findScrollableParent(target) as HTMLElement | null;
};

export const getTransformTarget = (scrollEl: HTMLElement | null): HTMLElement | null => {
  if (!scrollEl) return null;
  // If the scroll element is <html>, use body as the transform target
  if (scrollEl === document.documentElement) return document.body as HTMLElement;
  const child = scrollEl.firstElementChild as HTMLElement | null;
  return child || scrollEl;
};
