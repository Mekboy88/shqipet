
// Check if any dropdown is open by looking for global flags
export const isDropdownOpen = (): boolean => {
  return (window as any).__dropdownOpen || false;
};

// Check if chat panel is open
export const isChatPanelOpen = (): boolean => {
  return (window as any).__chatPanelOpen || false;
};

// Check if mouse is over any dropdown element, chat panel, or notification panel
export const isMouseOverNonScrollElement = (x: number, y: number): boolean => {
  const element = document.elementFromPoint(x, y);
  if (!element) return false;
  
  let current = element as HTMLElement;
  while (current && current !== document.body) {
    if (
      current.hasAttribute('data-radix-popover-content') ||
      current.closest('[data-radix-popover-content]') ||
      current.classList.contains('dropdown') ||
      current.classList.contains('popover') ||
      current.getAttribute('role') === 'dialog' ||
      current.hasAttribute('data-chat-panel') ||
      current.closest('[data-chat-panel]') ||
      current.hasAttribute('data-notification-panel') ||
      current.closest('[data-notification-panel]')
    ) {
      return true;
    }
    current = current.parentElement as HTMLElement;
  }
  return false;
};
