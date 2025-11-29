interface ComponentStatus {
  status: 'working' | 'not working' | 'missing handler' | 'unknown';
  expected: string;
  connected: boolean;
  element?: HTMLElement;
}

interface PageContext {
  page: string;
  title: string;
  components: {
    buttons: Record<string, ComponentStatus>;
    inputs: Record<string, ComponentStatus>;
    forms: Record<string, ComponentStatus>;
    modals: Record<string, ComponentStatus>;
  };
  routes: string[];
  apiEndpoints: string[];
  errors: string[];
  suggestions: string[];
}

export class PageContextAPI {
  static getCurrentPageContext(): PageContext {
    console.log('PageContextAPI: Starting page analysis...'); // Debug log
    
    const currentPath = window.location.pathname;
    const pageTitle = document.title || 'Unknown Page';
    
    console.log('PageContextAPI: Analyzing page:', currentPath); // Debug log
    
    // Analyze buttons on the page
    const buttons = this.analyzeButtons();
    const inputs = this.analyzeInputs();
    const forms = this.analyzeForms();
    const modals = this.analyzeModals();
    
    console.log('PageContextAPI: Found components:', { 
      buttons: Object.keys(buttons).length, 
      inputs: Object.keys(inputs).length, 
      forms: Object.keys(forms).length 
    }); // Debug log
    
    // Get available routes from router
    const routes = this.getAvailableRoutes();
    
    // Check for console errors
    const errors = this.getRecentErrors();
    
    // Generate suggestions based on findings
    const suggestions = this.generateSuggestions(buttons, inputs, forms);
    
    const context = {
      page: currentPath,
      title: pageTitle,
      components: {
        buttons,
        inputs,
        forms,
        modals
      },
      routes,
      apiEndpoints: this.getApiEndpoints(),
      errors,
      suggestions
    };
    
    console.log('PageContextAPI: Final context:', context); // Debug log
    return context;
  }

  private static analyzeButtons(): Record<string, ComponentStatus> {
    const buttons: Record<string, ComponentStatus> = {};
    
    document.querySelectorAll('button').forEach((button, index) => {
      const text = button.textContent?.trim() || button.getAttribute('aria-label') || `Button ${index + 1}`;
      const hasClickHandler = this.hasEventListener(button, 'click');
      const isDisabled = button.disabled;
      const hasAction = button.getAttribute('onclick') || button.getAttribute('data-action') || hasClickHandler;
      
      let status: ComponentStatus['status'] = 'working';
      let expected = 'Should perform an action when clicked';
      
      if (isDisabled) {
        status = 'not working';
        expected = 'Button is disabled - check if this is intentional';
      } else if (!hasAction && !hasClickHandler) {
        status = 'missing handler';
        expected = 'Missing click event handler or action';
      }
      
      // Special case for buttons with generic text
      if (text.includes('Button') && !hasAction) {
        status = 'missing handler';
        expected = 'Generic button needs specific action and label';
      }
      
      buttons[text] = {
        status,
        expected,
        connected: hasClickHandler || !!hasAction,
        element: button
      };
    });
    
    return buttons;
  }

  private static analyzeInputs(): Record<string, ComponentStatus> {
    const inputs: Record<string, ComponentStatus> = {};
    
    document.querySelectorAll('input, textarea, select').forEach((input, index) => {
      const label = this.getInputLabel(input) || input.getAttribute('placeholder') || `Input ${index + 1}`;
      const hasValidation = input.hasAttribute('required') || input.hasAttribute('pattern');
      const hasChangeHandler = this.hasEventListener(input, 'change') || this.hasEventListener(input, 'input');
      const inputType = input.getAttribute('type') || 'text';
      
      let status: ComponentStatus['status'] = 'working';
      let expected = 'Should handle user input';
      
      // Check for common input issues
      if (inputType === 'password' && !hasValidation) {
        status = 'missing handler';
        expected = 'Password input should have validation';
      } else if (inputType === 'email' && !hasValidation) {
        status = 'missing handler';
        expected = 'Email input should have validation';
      } else if (!hasChangeHandler && inputType !== 'hidden') {
        status = 'missing handler';
        expected = 'Input should have change/input handler';
      }
      
      inputs[label] = {
        status,
        expected,
        connected: hasChangeHandler,
        element: input as HTMLElement
      };
    });
    
    return inputs;
  }

  private static analyzeForms(): Record<string, ComponentStatus> {
    const forms: Record<string, ComponentStatus> = {};
    
    document.querySelectorAll('form').forEach((form, index) => {
      const formName = form.getAttribute('name') || `Form ${index + 1}`;
      const hasSubmitHandler = this.hasEventListener(form, 'submit');
      
      forms[formName] = {
        status: hasSubmitHandler ? 'working' : 'missing handler',
        expected: 'Should handle form submission',
        connected: hasSubmitHandler,
        element: form
      };
    });
    
    return forms;
  }

  private static analyzeModals(): Record<string, ComponentStatus> {
    const modals: Record<string, ComponentStatus> = {};
    
    // Look for common modal patterns
    document.querySelectorAll('[data-modal], .modal, [role="dialog"]').forEach((modal, index) => {
      const modalName = modal.getAttribute('data-modal') || modal.getAttribute('aria-label') || `Modal ${index + 1}`;
      const isVisible = this.isElementVisible(modal as HTMLElement);
      
      modals[modalName] = {
        status: 'working',
        expected: 'Should show/hide on trigger',
        connected: true,
        element: modal as HTMLElement
      };
    });
    
    return modals;
  }

  private static hasEventListener(element: Element, eventType: string): boolean {
    // Check for React event handlers - most common in React apps
    const reactProps = Object.keys(element).find(key => 
      key.startsWith('__reactProps') || 
      key.startsWith('__reactInternalInstance') ||
      key.startsWith('_reactInternalFiber')
    );
    
    if (reactProps) {
      const props = (element as any)[reactProps];
      if (props && props.children && props.children.props) {
        const childProps = props.children.props;
        if (childProps[`on${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`]) {
          return true;
        }
      }
      if (props && props[`on${eventType.charAt(0).toUpperCase() + eventType.slice(1)}`]) {
        return true;
      }
    }
    
    // Check for traditional event listeners
    if (element.getAttribute(`on${eventType}`) !== null) {
      return true;
    }
    
    // Check for data attributes that suggest interactivity
    if (element.hasAttribute('data-action') || 
        element.hasAttribute('data-click') ||
        element.classList.contains('cursor-pointer') ||
        element.classList.contains('btn') ||
        element.classList.contains('button')) {
      return true;
    }
    
    return false;
  }

  private static getInputLabel(input: Element): string | null {
    // Try to find associated label
    const id = input.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }
    
    // Try parent label
    const parentLabel = input.closest('label');
    if (parentLabel) return parentLabel.textContent?.trim() || null;
    
    // Try placeholder or name
    return input.getAttribute('placeholder') || input.getAttribute('name') || null;
  }

  private static isElementVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  private static getAvailableRoutes(): string[] {
    // Extract routes from current router setup
    const routes = [
      '/admin',
      '/admin/core-platform',
      '/admin/core-platform/authentication',
      '/admin/core-platform/database',
      '/admin/core-platform/api-integration'
    ];
    return routes;
  }

  private static getApiEndpoints(): string[] {
    // Common API endpoints for the platform
    return [
      '/api/auth',
      '/api/users',
      '/api/config',
      '/api/health'
    ];
  }

  private static getRecentErrors(): string[] {
    // This would ideally capture recent console errors
    // For now, return empty array - can be enhanced with error tracking
    return [];
  }

  private static generateSuggestions(
    buttons: Record<string, ComponentStatus>,
    inputs: Record<string, ComponentStatus>,
    forms: Record<string, ComponentStatus>
  ): string[] {
    const suggestions: string[] = [];
    
    // Check for missing handlers
    Object.entries(buttons).forEach(([name, status]) => {
      if (status.status === 'missing handler') {
        suggestions.push(`Add click handler for "${name}" button`);
      }
    });
    
    Object.entries(forms).forEach(([name, status]) => {
      if (status.status === 'missing handler') {
        suggestions.push(`Add submit handler for "${name}" form`);
      }
    });
    
    // Check for accessibility
    const buttonsWithoutText = Object.keys(buttons).filter(name => name.startsWith('Button '));
    if (buttonsWithoutText.length > 0) {
      suggestions.push('Add descriptive text to buttons for better accessibility');
    }
    
    return suggestions;
  }
}