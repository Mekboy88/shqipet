import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRouteScanning } from './RouteScanner';
import { useDatabaseHealthScanning } from './DatabaseHealthScanner';

interface ComponentInfo {
  id: string;
  type: 'button' | 'input' | 'form' | 'link' | 'element';
  text: string;
  placeholder?: string;
  hasClickHandler: boolean;
  hasFormHandler: boolean;
  hasEventListeners: string[];
  actualErrors: string[];
  dbConnectionAttempts: number;
  dbConnectionSuccess: number;
  position: { x: number; y: number };
  element: HTMLElement;
  isVisible: boolean;
  functionality: string[];
  status: 'has_db_connection' | 'no_db_connection' | 'has_errors';
}

export const useRealComponentScanning = () => {
  const [realComponents, setRealComponents] = useState<ComponentInfo[]>([]);
  const [dbConnections, setDbConnections] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [networkCalls, setNetworkCalls] = useState<Record<string, any[]>>({});
  const interceptedCalls = useRef<Map<string, any[]>>(new Map());
  
  // Use route and database health scanning
  const { routes } = useRouteScanning();
  const { dbHealth, overallStatus } = useDatabaseHealthScanning();

  // Intercept network calls to track actual database connections
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      const urlString = typeof url === 'string' ? url : url.toString();
      
      try {
        const response = await originalFetch(...args);
        
        // Track network calls related to Supabase
        if (urlString.includes('supabase.co') || urlString.includes('/rest/v1/')) {
          const elementId = document.activeElement?.id || 'unknown';
          const calls = interceptedCalls.current.get(elementId) || [];
          calls.push({
            url: urlString,
            method: options?.method || 'GET',
            success: response.ok,
            status: response.status,
            timestamp: Date.now()
          });
          interceptedCalls.current.set(elementId, calls);
        }
        
        return response;
      } catch (error) {
        // Track failed calls
        const elementId = document.activeElement?.id || 'unknown';
        const calls = interceptedCalls.current.get(elementId) || [];
        calls.push({
          url: urlString,
          method: options?.method || 'GET',
          success: false,
          error: error,
          timestamp: Date.now()
        });
        interceptedCalls.current.set(elementId, calls);
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    const scanPageComponents = () => {
      const components: ComponentInfo[] = [];
      
      // Get ALL elements that can be interacted with
      const allInteractiveElements = document.querySelectorAll(`
        button, [role="button"], input, textarea, select, form, a[href], [onclick], [data-action],
        [role="link"], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]
      `);
      
      allInteractiveElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        // STRICT visibility check - element must be truly visible to user
        const isElementVisible = (
          rect.width > 0 && 
          rect.height > 0 &&
          computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden' &&
          computedStyle.opacity !== '0' &&
          rect.top < window.innerHeight &&
          rect.bottom > 0 &&
          rect.left < window.innerWidth &&
          rect.right > 0 &&
          !element.hasAttribute('hidden') &&
          !element.closest('[hidden]') &&
          !element.closest('[style*="display: none"]') &&
          !element.closest('[style*="visibility: hidden"]')
        );
        
        // ONLY process elements that are ACTUALLY VISIBLE
        if (!isElementVisible) return;
        
        // Get EXACT text as it appears to user
        const visibleText = element.textContent?.trim() || '';
        const placeholderText = element.getAttribute('placeholder') || '';
        const ariaLabel = element.getAttribute('aria-label') || '';
        const titleText = element.getAttribute('title') || '';
        
        // Use actual visible text first, then fallbacks
        const text = visibleText || 
                    ariaLabel || 
                    placeholderText || 
                    titleText || 
                    `${element.tagName.toLowerCase()}${element.id ? ` #${element.id}` : ''}`;
        
        const id = element.id || `element-${index}`;
        
        // Detect actual event listeners
        const eventListeners: string[] = [];
        const clickHandler = (element as any).onclick !== null || 
                           element.getAttribute('onclick') !== null;
        
        if (clickHandler) eventListeners.push('click');
        
        // Check for React event handlers
        const reactProps = Object.keys(element as any).filter(key => key.startsWith('__react'));
        reactProps.forEach(prop => {
          const reactInternalProps = (element as any)[prop];
          if (reactInternalProps?.memoizedProps) {
            const props = reactInternalProps.memoizedProps;
            Object.keys(props).forEach(key => {
              if (key.startsWith('on') && typeof props[key] === 'function') {
                eventListeners.push(key.substring(2).toLowerCase());
              }
            });
          }
        });
        
        // Detect actual form handling
        const hasFormHandler = element.tagName.toLowerCase() === 'form' && 
                              (element.getAttribute('onsubmit') !== null || 
                               eventListeners.includes('submit'));
        
        // Get actual errors from DOM
        const actualErrors: string[] = [];
        
        // Check for validation errors
        if (element.matches(':invalid')) {
          actualErrors.push(`Invalid ${element.tagName.toLowerCase()}`);
        }
        
        // Check for aria-invalid
        if (element.getAttribute('aria-invalid') === 'true') {
          actualErrors.push('ARIA validation failed');
        }
        
        // Check for error classes
        if (element.classList.contains('error') || element.closest('.error')) {
          actualErrors.push('Element has error styling');
        }
        
        // Check if element is disabled
        if ((element as any).disabled) {
          actualErrors.push('Element is disabled');
        }
        
        // Get network calls for this element
        const elementCalls = interceptedCalls.current.get(id) || [];
        const dbConnectionAttempts = elementCalls.length;
        const dbConnectionSuccess = elementCalls.filter(call => call.success).length;
        
        // Determine element type
        let elementType: ComponentInfo['type'] = 'element';
        const tagName = element.tagName.toLowerCase();
        
        if (tagName === 'button' || element.getAttribute('role') === 'button') {
          elementType = 'button';
        } else if (['input', 'textarea', 'select'].includes(tagName)) {
          elementType = 'input';
        } else if (tagName === 'form') {
          elementType = 'form';
        } else if (tagName === 'a' || element.getAttribute('role') === 'link') {
          elementType = 'link';
        }
        
        // Determine functionality based on actual behavior
        const functionality: string[] = [];
        
        if (eventListeners.length > 0) {
          functionality.push(`Events: ${eventListeners.join(', ')}`);
        }
        
        if (hasFormHandler) {
          functionality.push('Form handler');
        }
        
        if (element.getAttribute('type') === 'submit') {
          functionality.push('Submit button');
        }
        
        if (element.getAttribute('href')) {
          functionality.push('Navigation link');
        }
        
        if (functionality.length === 0) {
          functionality.push('Static element');
        }
        
        // Determine status based on actual behavior
        let status: ComponentInfo['status'] = 'no_db_connection';
        
        if (actualErrors.length > 0) {
          status = 'has_errors';
        } else if (dbConnectionSuccess > 0) {
          status = 'has_db_connection';
        }
        
        components.push({
          id,
          type: elementType,
          text,
          placeholder: element.getAttribute('placeholder') || undefined,
          hasClickHandler: clickHandler || eventListeners.includes('click'),
          hasFormHandler,
          hasEventListeners: eventListeners,
          actualErrors,
          dbConnectionAttempts,
          dbConnectionSuccess,
          position: { x: rect.left, y: rect.top },
          element: element as HTMLElement,
          isVisible: true, // Already filtered for visibility above
          functionality,
          status
        });
      });

      setRealComponents(components);
      setNetworkCalls(Object.fromEntries(interceptedCalls.current));
    };

    // Real-time database connectivity testing
    const testDbConnectivity = async () => {
      const connections: Record<string, any> = {};
      
      try {
        // Only test tables that actually exist and we know about
        const actualTables = ['admin_actions', 'profiles', 'user_roles'];
        
        for (const table of actualTables) {
          const startTime = Date.now();
          try {
            const { error, count } = await supabase.from(table as any).select('*', { count: 'exact', head: true }).limit(1);
            const responseTime = Date.now() - startTime;
            
            connections[table] = { 
              status: error ? 'error' : 'connected', 
              error: error?.message,
              responseTime,
              recordCount: count || 0
            };
          } catch (err) {
            connections[table] = { 
              status: 'error', 
              error: (err as Error).message,
              responseTime: Date.now() - startTime
            };
          }
        }
        
        // Test auth
        const authStartTime = Date.now();
        try {
          const { data: { session }, error: authError } = await supabase.auth.getSession();
          connections.auth = { 
            status: authError ? 'error' : 'connected', 
            session: !!session, 
            error: authError?.message,
            responseTime: Date.now() - authStartTime
          };
        } catch (err) {
          connections.auth = { 
            status: 'error', 
            error: (err as Error).message,
            responseTime: Date.now() - authStartTime
          };
        }
        
      } catch (err) {
        connections.general = { status: 'error', error: (err as Error).message };
      }
      
      setDbConnections(connections);
    };

    // Detect ACTUAL errors from DOM and validation
    const detectErrors = () => {
      const errorMap: Record<string, string[]> = {};
      
      // Find elements with actual validation errors
      const invalidElements = document.querySelectorAll(':invalid');
      invalidElements.forEach((element) => {
        const id = element.id || `invalid-${Date.now()}-${Math.random()}`;
        const validationMessage = (element as any).validationMessage;
        if (validationMessage) {
          errorMap[id] = [validationMessage];
        }
      });
      
      // Find elements with error classes or attributes
      const errorElements = document.querySelectorAll('.error, [aria-invalid="true"], .has-error, [data-error]');
      errorElements.forEach((element) => {
        const id = element.id || `error-${Date.now()}-${Math.random()}`;
        const errorText = element.getAttribute('data-error') || 
                         element.getAttribute('aria-describedby') ||
                         'Element marked as error';
        errorMap[id] = [errorText];
      });
      
      // Find disabled elements
      const disabledElements = document.querySelectorAll(':disabled');
      disabledElements.forEach((element) => {
        const id = element.id || `disabled-${Date.now()}-${Math.random()}`;
        errorMap[id] = ['Element is disabled'];
      });
      
      setErrors(errorMap);
    };

    // Debounced scan function to prevent rapid updates
    let scanTimeout: ReturnType<typeof setTimeout> | null = null;
    const debouncedScan = () => {
      if (scanTimeout) clearTimeout(scanTimeout);
      scanTimeout = setTimeout(() => {
        scanPageComponents();
        detectErrors();
      }, 1000); // Wait 1 second before scanning
    };

    // Initial scan
    scanPageComponents();
    testDbConnectivity();
    detectErrors();

    // Set up observers for dynamic content with debouncing
    const observer = new MutationObserver(() => {
      debouncedScan();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'aria-invalid', 'disabled']
    });

    // Periodic updates - reduced frequency to prevent glitching
    const interval = setInterval(() => {
      testDbConnectivity();
      detectErrors();
    }, 15000); // Increased to 15 seconds

    return () => {
      observer.disconnect();
      clearInterval(interval);
      if (scanTimeout) clearTimeout(scanTimeout);
    };
  }, []);

  return { 
    realComponents, 
    dbConnections, 
    errors, 
    routes, 
    dbHealth, 
    overallStatus,
    networkCalls
  };
};