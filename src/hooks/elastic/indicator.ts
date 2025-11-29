
export const getOrCreateIndicator = (scrollEl: HTMLElement): HTMLElement => {
  // Anchor to a safe container (viewport for document, container otherwise)
  const anchorEl = document.body;

  // Ensure the anchor can position absolute children (not needed for body/fixed)
  try {
    const cs = getComputedStyle(anchorEl);
    if (cs.position === 'static' && anchorEl !== document.body) {
      (anchorEl as HTMLElement).style.position = 'relative';
    }
  } catch {}

  let indicator = anchorEl.querySelector<HTMLElement>(`:scope > [data-elastic-indicator="true"]`);
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.setAttribute('data-elastic-indicator', 'true');
    console.debug('[elastic-indicator] create', { anchor: 'viewport' });
    // Use fixed for viewport, absolute for containers
    indicator.style.position = 'fixed';
    indicator.style.top = '0';
    indicator.style.left = '0';
    indicator.style.width = '100vw';
    indicator.style.height = '6px'; // Visible yet subtle
    indicator.style.transformOrigin = 'top center';
    indicator.style.transform = 'scaleY(1)';
    indicator.style.opacity = '0';
    indicator.style.display = 'block';
    indicator.style.zIndex = '110001';
    indicator.style.pointerEvents = 'none';
    indicator.style.willChange = 'transform, opacity';
    indicator.style.background = 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.6))';
    indicator.style.borderRadius = '3px';
    indicator.style.boxShadow = '0 2px 8px hsl(var(--primary) / 0.3)';
    indicator.style.transition = 'opacity 0.2s ease';

    // Insert at very top of the anchor element
    if (anchorEl.firstElementChild) {
      anchorEl.insertBefore(indicator, anchorEl.firstElementChild);
    } else {
      anchorEl.appendChild(indicator);
    }
  }
  return indicator;
};

export const updateIndicator = (scrollEl: HTMLElement, distance: number) => {
  if (!scrollEl) return;
  const indicator = getOrCreateIndicator(scrollEl);

  const d = Number.isFinite(distance) ? distance : 0;
  const abs = Math.abs(d);

  // Top pull (d >= 0): compress; Bottom push (d < 0): grow
  const compressScale = Math.max(0.3, 1 - abs / 60);
  const growScale = Math.min(2.5, 1 + abs / 40);
  const scale = d >= 0 ? compressScale : growScale;

  // Make it visible quickly
  const opacity = Math.min(1, 0.2 + abs / 30);

  console.debug('[elastic-indicator] update', { distance: d, scale, opacity });

  indicator.style.opacity = `${opacity}`;
  indicator.style.transition = 'none';
  indicator.style.transformOrigin = 'top center';
  indicator.style.transform = `scaleY(${scale})`;
};

export const hideIndicator = (scrollEl: HTMLElement) => {
  const anchorEl = document.body;
  const indicator = anchorEl?.querySelector<HTMLElement>(':scope > [data-elastic-indicator="true"]');
  if (!indicator) return;
  console.debug('[elastic-indicator] hide');
  indicator.style.transition = 'transform 0.4s cubic-bezier(0.25, 1.6, 0.45, 0.94), opacity 0.3s ease';
  indicator.style.transform = 'scaleY(1)';
  indicator.style.opacity = '0';
};
