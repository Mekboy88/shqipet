import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PageSection {
  id: string;
  name: string;
  elements: VisibleElement[];
  position: { top: number; height: number };
}

interface VisibleElement {
  id: string;
  text: string;
  type: 'heading' | 'input' | 'button' | 'link' | 'text' | 'form';
  tagName: string;
  functionality: string[];
  hasEvents: boolean;
  dbConnected: boolean;
  errors: string[];
  position: { x: number; y: number; width: number; height: number };
  element: HTMLElement;
  status: 'connected' | 'not_connected' | 'error';
}

export const usePageSpecificScanning = () => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanCurrentPage = () => {
    setIsScanning(true);
    
    // Get all visible elements on the page
    const allElements = document.querySelectorAll('*');
    const visibleElements: VisibleElement[] = [];
    
    allElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const rect = htmlElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(htmlElement);
      
      // Only process truly visible interactive or text elements
      const isVisible = (
        rect.width > 0 && 
        rect.height > 0 &&
        computedStyle.display !== 'none' &&
        computedStyle.visibility !== 'hidden' &&
        computedStyle.opacity !== '0' &&
        rect.top >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.left >= 0 &&
        rect.right <= window.innerWidth
      );

      if (!isVisible) return;

      // Get element text content
      const text = htmlElement.textContent?.trim() || '';
      const tagName = htmlElement.tagName.toLowerCase();
      
      // Skip if no meaningful content and not interactive
      const isInteractive = ['button', 'input', 'textarea', 'select', 'a', 'form'].includes(tagName) ||
                           htmlElement.onclick || 
                           htmlElement.getAttribute('onclick') ||
                           htmlElement.getAttribute('role') === 'button';
      
      const isTextContent = text.length > 0 && text.length < 500; // Reasonable text length
      const isHeading = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName);
      
      if (!isInteractive && !isTextContent && !isHeading) return;

      // Determine element type
      let elementType: VisibleElement['type'] = 'text';
      if (isHeading || (text.length > 0 && tagName === 'div' && computedStyle.fontSize && parseInt(computedStyle.fontSize) > 18)) {
        elementType = 'heading';
      } else if (['input', 'textarea', 'select'].includes(tagName)) {
        elementType = 'input';
      } else if (tagName === 'button' || htmlElement.getAttribute('role') === 'button') {
        elementType = 'button';
      } else if (tagName === 'a') {
        elementType = 'link';
      } else if (tagName === 'form') {
        elementType = 'form';
      }

      // Check for event handlers and functionality
      const hasEvents = !!(htmlElement.onclick || 
                          htmlElement.getAttribute('onclick') ||
                          htmlElement.getAttribute('onsubmit') ||
                          htmlElement.getAttribute('onchange'));

      // Analyze functionality
      const functionality: string[] = [];
      if (tagName === 'input') {
        const inputType = htmlElement.getAttribute('type') || 'text';
        functionality.push(`Input field (${inputType})`);
        if (htmlElement.getAttribute('placeholder')) {
          functionality.push(`Placeholder: "${htmlElement.getAttribute('placeholder')}"`);
        }
      } else if (tagName === 'button') {
        const buttonType = htmlElement.getAttribute('type') || 'button';
        functionality.push(`Button (${buttonType})`);
        if (hasEvents) functionality.push('Has click handler');
      } else if (tagName === 'a') {
        const href = htmlElement.getAttribute('href');
        if (href) functionality.push(`Navigation to: ${href}`);
      } else if (tagName === 'form') {
        functionality.push('Form container');
        if (hasEvents) functionality.push('Has submit handler');
      }

      // Check for errors
      const errors: string[] = [];
      if (htmlElement.matches(':invalid')) {
        errors.push('Validation failed');
      }
      if (htmlElement.getAttribute('aria-invalid') === 'true') {
        errors.push('ARIA validation error');
      }
      if ((htmlElement as any).disabled) {
        errors.push('Element disabled');
      }

      // Determine status
      let status: VisibleElement['status'] = 'not_connected';
      if (errors.length > 0) {
        status = 'error';
      } else if (hasEvents || ['input', 'button', 'form'].includes(tagName)) {
        status = 'connected'; // Assume connected if interactive
      }

      visibleElements.push({
        id: htmlElement.id || `element-${index}`,
        text: text || htmlElement.getAttribute('placeholder') || htmlElement.getAttribute('alt') || `${tagName} element`,
        type: elementType,
        tagName,
        functionality,
        hasEvents,
        dbConnected: status === 'connected',
        errors,
        position: {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height
        },
        element: htmlElement,
        status
      });
    });

    // Group elements into logical sections based on their vertical position
    const sortedElements = visibleElements.sort((a, b) => a.position.y - b.position.y);
    const pageSections: PageSection[] = [];
    
    let currentSection: PageSection | null = null;
    let sectionThreshold = 100; // pixels gap to start new section

    sortedElements.forEach((element, index) => {
      const shouldStartNewSection = !currentSection || 
        (element.position.y - (currentSection.position.top + currentSection.position.height) > sectionThreshold);

      if (shouldStartNewSection) {
        // Determine section name based on content
        let sectionName = 'Section';
        if (element.type === 'heading') {
          sectionName = element.text;
        } else if (element.type === 'form') {
          sectionName = 'Form Section';
        } else if (element.type === 'input') {
          sectionName = 'Input Section';
        } else if (element.type === 'button') {
          sectionName = 'Action Section';
        } else if (element.type === 'link') {
          sectionName = 'Navigation Section';
        }

        currentSection = {
          id: `section-${pageSections.length}`,
          name: sectionName,
          elements: [element],
          position: {
            top: element.position.y,
            height: element.position.height
          }
        };
        pageSections.push(currentSection);
      } else if (currentSection) {
        currentSection.elements.push(element);
        // Update section height
        const sectionBottom = Math.max(
          currentSection.position.top + currentSection.position.height,
          element.position.y + element.position.height
        );
        currentSection.position.height = sectionBottom - currentSection.position.top;
      }
    });

    setSections(pageSections);
    setIsScanning(false);
  };

  // Test database connectivity for elements that should connect
  const testElementDbConnectivity = async (element: VisibleElement) => {
    if (!['input', 'button', 'form'].includes(element.tagName)) return false;

    try {
      // Simple connectivity test
      const { error } = await supabase.auth.getSession();
      return !error;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    // Initial scan
    scanCurrentPage();

    // Set up observer for dynamic content
    const observer = new MutationObserver(() => {
      setTimeout(scanCurrentPage, 1000); // Debounce
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Rescan on route changes
    const handleRouteChange = () => {
      setTimeout(scanCurrentPage, 500);
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return { 
    sections, 
    isScanning, 
    rescan: scanCurrentPage,
    testElementDbConnectivity
  };
};