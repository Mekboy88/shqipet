// Safe auto-refresh prevention - avoids readonly property overrides
export const preventAutoRefresh = () => {
  console.log('🚫 Safe auto-refresh prevention activated!');
  
  // Track if refresh is user-initiated
  let isUserInitiated = false;
  
  // Listen for user interactions that should allow refresh
  ['keydown', 'click'].forEach(event => {
    document.addEventListener(event, (e) => {
      if (event === 'keydown') {
        const ke = e as KeyboardEvent;
        if (ke.key === 'F5' || (ke.ctrlKey && ke.key === 'r')) {
          isUserInitiated = true;
          setTimeout(() => isUserInitiated = false, 100);
        }
      }
    }, true);
  });
  
  // Instead of overriding readonly properties, use beforeunload to prevent unwanted refreshes
  window.addEventListener('beforeunload', (e) => {
    // Only show confirmation if it's not user-initiated
    if (!isUserInitiated) {
      console.log('🚫 Automatic refresh attempt detected and prevented');
      e.preventDefault();
      e.returnValue = ''; // Required for some browsers
      return '';
    }
    console.log('✅ User-initiated refresh allowed');
  });
  
  // Prevent form submissions that would reload page
  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    const isAllowed = form.getAttribute('data-allow-submit') === 'true';
    
    if (!isAllowed && !e.defaultPrevented && !isUserInitiated) {
      const hasAction = form.action && form.action !== window.location.href;
      if (!hasAction) {
        console.log('🚫 Programmatic form reload prevented');
        e.preventDefault();
        return false;
      }
    }
  }, true);
  
  // Prevent programmatic navigation to same page
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(state, title, url) {
    if (url === window.location.pathname && !isUserInitiated) {
      console.log('🚫 Programmatic same-page navigation prevented');
      return;
    }
    return originalPushState.call(this, state, title, url);
  };
  
  history.replaceState = function(state, title, url) {
    if (url === window.location.pathname && !isUserInitiated) {
      console.log('🚫 Programmatic same-page replace prevented');
      return;
    }
    return originalReplaceState.call(this, state, title, url);
  };
  
  console.log('✅ Safe auto-refresh prevention active');
};

// Apply prevention on load
export const initializeAutoRefreshPrevention = () => {
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preventAutoRefresh);
    } else {
      preventAutoRefresh();
    }
  }
};