import React, { useState, useEffect, useRef, useCallback } from 'react';

const GlobalScrollIndicator: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [thumbSizePct, setThumbSizePct] = useState(0);
  const [thumbTopPct, setThumbTopPct] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasBlockingModal, setHasBlockingModal] = useState(false);

  const scrollElRef = useRef<HTMLElement | null>(null);
  const isWindowRef = useRef(true);
  const rafId = useRef<number | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkForModals = useCallback(() => {
    const modalExists =
      document.body.style.overflow === 'hidden' ||
      document.documentElement.classList.contains('overflow-hidden') ||
      !!document.querySelector('[aria-modal="true"], [role="dialog"][data-state="open"], .radix-dialog-content[data-state="open"], .fixed.inset-0, [data-radix-dialog-overlay], [data-radix-popover-content]');
    
    setHasBlockingModal(modalExists);
    return modalExists;
  }, []);

  const computeAndSet = useCallback((sourceEl?: HTMLElement | Window | Document) => {
    const modalExists = checkForModals();
    
    // Don't update or show indicator when modal is present
    if (modalExists) {
      setIsScrolling(false);
      return;
    }

    let scrollTop = 0;
    let maxScroll = 0;
    let contentHeight = 0;
    let viewportHeight = 0;

    const useWindow = (el: unknown): el is Window | Document => el === window || el === document;

    if (sourceEl && sourceEl instanceof HTMLElement) {
      scrollTop = sourceEl.scrollTop;
      contentHeight = sourceEl.scrollHeight;
      viewportHeight = sourceEl.clientHeight;
      maxScroll = Math.max(contentHeight - viewportHeight, 0);
    } else if (sourceEl && useWindow(sourceEl)) {
      const docEl = document.documentElement;
      const body = document.body;
      scrollTop = window.pageYOffset || docEl.scrollTop || 0;
      contentHeight = Math.max(docEl.scrollHeight, body?.scrollHeight || 0);
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(contentHeight - viewportHeight, 0);
    } else if (isWindowRef.current) {
      const docEl = document.documentElement;
      const body = document.body;
      scrollTop = window.pageYOffset || docEl.scrollTop || 0;
      contentHeight = Math.max(docEl.scrollHeight, body?.scrollHeight || 0);
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(contentHeight - viewportHeight, 0);
    } else {
      const el = scrollElRef.current;
      if (el) {
        scrollTop = el.scrollTop;
        contentHeight = el.scrollHeight;
        viewportHeight = el.clientHeight;
        maxScroll = Math.max(contentHeight - viewportHeight, 0);
      }
    }

    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;

    const sizePct = contentHeight > 0 ? (viewportHeight / contentHeight) * 100 : 0;
    const clampedSize = Math.max(4, Math.min(100, sizePct));
    const topPct = progress * (100 - clampedSize);
    setScrollPercentage(progress * 100);
    setThumbSizePct(clampedSize);
    setThumbTopPct(topPct);
  }, [checkForModals]);

  const scheduleCompute = useCallback(() => {
    if (rafId.current != null) return;
    
    // Check if modal is open first
    const modalExists = checkForModals();
    if (modalExists) {
      setIsScrolling(false);
      return;
    }
    
    // Show indicator when scrolling main content
    setIsScrolling(true);
    
    // Clear existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      computeAndSet();
      
      // Hide indicator after scrolling stops (800ms delay)
      hideTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        hideTimeoutRef.current = null;
      }, 800);
    });
  }, [computeAndSet, checkForModals]);

  const findBestScrollContainer = useCallback(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const hasWindowScroll =
      (docEl.scrollHeight - window.innerHeight) > 1 ||
      ((body?.scrollHeight || 0) - window.innerHeight) > 1;

    if (hasWindowScroll) {
      scrollElRef.current = null;
      isWindowRef.current = true;
      return;
    }

    const selectors = [
      '[data-scroll-container]',
      '[data-radix-scroll-area-viewport]',
      'main[role="main"]',
      'main',
      '#root',
      '.app-scroll',
      '.scroll-container',
      '.overflow-y-auto',
      '.overflow-auto',
    ];

    let best: HTMLElement | null = null;
    let bestDelta = 0;

    for (const sel of selectors) {
      const nodes = document.querySelectorAll<HTMLElement>(sel);
      nodes.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.height < 100 || rect.width < 100) return;
        const delta = el.scrollHeight - el.clientHeight;
        if (delta > bestDelta) {
          bestDelta = delta;
          best = el;
        }
      });
      if (bestDelta > 0) break;
    }

    if (best) {
      scrollElRef.current = best;
      isWindowRef.current = false;
    } else {
      scrollElRef.current = null;
      isWindowRef.current = true;
    }
  }, []);

  useEffect(() => {
    findBestScrollContainer();

    const onAnyScrollCapture = (e: Event) => {
      const t = e.target as EventTarget | null;
      if (t && t instanceof HTMLElement) {
        // Use the element that is actually scrolling
        scrollElRef.current = t;
        isWindowRef.current = false;
      } else {
        isWindowRef.current = true;
      }
      scheduleCompute();
    };

    const onScroll = () => scheduleCompute();
    const onResize = () => {
      findBestScrollContainer();
      scheduleCompute();
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize);
    document.addEventListener('scroll', onAnyScrollCapture, { passive: true, capture: true });

    if (isWindowRef.current) {
      window.addEventListener('scroll', onScroll, { passive: true });
    } else {
      scrollElRef.current?.addEventListener('scroll', onScroll, { passive: true } as AddEventListenerOptions);
    }

    const ro = new ResizeObserver(() => onResize());
    ro.observe(document.documentElement);
    if (document.body) ro.observe(document.body);
    if (scrollElRef.current) ro.observe(scrollElRef.current);

    scheduleCompute();

    return () => {
      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      document.removeEventListener('scroll', onAnyScrollCapture, true);
      if (isWindowRef.current) {
        window.removeEventListener('scroll', onScroll);
      } else {
        scrollElRef.current?.removeEventListener('scroll', onScroll as EventListener);
      }
      ro.disconnect();
    };
  }, [findBestScrollContainer, scheduleCompute, computeAndSet]);

  return (
    <>
      {/* Background track - invisible */}
      <div
        className="fixed right-px top-0 w-2 h-full pointer-events-none"
        style={{ zIndex: 10000 }}
        aria-hidden="true"
      />
      {/* Progress bar - only visible when scrolling main content and no modals */}
      <div
        className={`fixed right-0.5 top-0 w-1.5 bg-muted-foreground/50 shadow-sm transition-all duration-300 ease-out pointer-events-none rounded ${
          isScrolling && !hasBlockingModal ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          height: `${thumbSizePct}%`,
          top: `${thumbTopPct}%`,
          zIndex: 10001,
          minHeight: '16px',
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default GlobalScrollIndicator;