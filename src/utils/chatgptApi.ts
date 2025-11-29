// ChatGPT API utility functions for Luna AI integration

interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatGPTResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface LunaContext {
  currentPath: string;
  currentSection: string;
  domElements: Array<{
    tag: string;
    text: string;
    attributes: Record<string, string>;
  }>;
  performanceMetrics?: {
    loadTime: number;
    domContentLoaded: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
  };
  accessibility?: {
    missingAltTags: number;
    headingStructure: boolean;
    colorContrast: string;
    focusableElements: number;
  };
  responsiveDesign?: {
    viewport: string;
    breakpoints: string[];
    mediaQueries: number;
  };
  security?: {
    httpsEnabled: boolean;
    mixedContent: boolean;
    cspHeaders: boolean;
  };
  timestamp: string;
}

const analyzePerformance = () => {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  return {
    loadTime: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
    largestContentfulPaint: paint.find(p => p.name === 'largest-contentful-paint')?.startTime || 0
  };
};

const analyzeAccessibility = () => {
  const images = document.querySelectorAll('img');
  const missingAltTags = Array.from(images).filter(img => !img.alt).length;
  
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingStructure = headings.length > 0;
  
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]').length;
  
  return {
    missingAltTags,
    headingStructure,
    colorContrast: 'Good', // Basic assumption - would need more complex analysis
    focusableElements
  };
};

const analyzeResponsiveDesign = () => {
  const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || 'Not set';
  const mediaQueries = Array.from(document.styleSheets).reduce((count, sheet) => {
    try {
      return count + Array.from(sheet.cssRules).filter(rule => rule.type === CSSRule.MEDIA_RULE).length;
    } catch {
      return count;
    }
  }, 0);
  
  return {
    viewport,
    breakpoints: ['mobile', 'tablet', 'desktop'], // Standard breakpoints
    mediaQueries
  };
};

const analyzeSecurity = () => {
  return {
    httpsEnabled: window.location.protocol === 'https:',
    mixedContent: false, // Would need more complex detection
    cspHeaders: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]')
  };
};

export const getCurrentPageContext = (): LunaContext => {
  const path = window.location.pathname;
  const section = path.split('/').pop() || 'dashboard';
  
  // Get relevant DOM elements for context
  const domElements: Array<{
    tag: string;
    text: string;
    attributes: Record<string, string>;
  }> = [];
  
  // Capture key elements like headers, buttons, forms
  const relevantSelectors = ['h1', 'h2', 'h3', '[data-testid]', 'button[class*="primary"]', 'form'];
  relevantSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (index < 5) { // Limit to 5 elements per selector
        const element = el as HTMLElement;
        domElements.push({
          tag: element.tagName.toLowerCase(),
          text: element.textContent?.trim().substring(0, 100) || '',
          attributes: {
            class: element.className || '',
            id: element.id || '',
            'data-testid': element.getAttribute('data-testid') || ''
          }
        });
      }
    });
  });

  return {
    currentPath: path,
    currentSection: section,
    domElements,
    performanceMetrics: analyzePerformance(),
    accessibility: analyzeAccessibility(),
    responsiveDesign: analyzeResponsiveDesign(),
    security: analyzeSecurity(),
    timestamp: new Date().toISOString()
  };
};

export const callChatGPT = async (
  userMessage: string,
  context?: any // Accept Luna's enhanced context
): Promise<string> => {
  const config = getLunaConfig();
  
  if (!config.apiKey) {
    throw new Error('ChatGPT API key not configured. Please set up your API key in the ChatGPT integration settings.');
  }

  // Enhanced system message that understands Luna's page scanning
  const systemMessage = `You are Luna, Andi's intelligent AI assistant. You are integrated into their admin dashboard to help with website development and analysis.

IMPORTANT PERSONALITY TRAITS:
- Always address the user as "Andi"
- Be conversational and helpful, like a human assistant
- Never repeat Andi's question back to them
- Give direct, actionable answers
- Show enthusiasm when you can actually help

CURRENT CONTEXT:
${context ? `
- Current page: ${context.page || context.currentPath}
- Page section: ${context.title || context.currentSection}

REAL PAGE COMPONENTS DETECTED BY LUNA:
${context.components ? `
- Buttons found: ${Object.keys(context.components.buttons || {}).length} (${Object.keys(context.components.buttons || {}).slice(0, 8).join(', ')})
- Forms found: ${Object.keys(context.components.forms || {}).length}
- Input fields: ${Object.keys(context.components.inputs || {}).length} (${Object.keys(context.components.inputs || {}).slice(0, 5).join(', ')})
- Issues detected: ${context.suggestions?.length || 0}
- Suggestions: ${context.suggestions?.slice(0, 3).join(', ') || 'None'}
` : ''}

PERFORMANCE DATA:
${context.performance ? `- Load Time: ${context.performance.loadTime}ms, FCP: ${context.performance.firstContentfulPaint}ms` : '- No performance data available'}

ACCESSIBILITY DATA:
${context.accessibility ? `- Missing Alt Tags: ${context.accessibility.missingAltTags}, Focusable Elements: ${context.accessibility.focusableElements}` : '- No accessibility data available'}

SECURITY STATUS:
${context.security ? `- HTTPS: ${context.security.httpsEnabled ? 'Enabled' : 'Disabled'}, CSP Headers: ${context.security.cspHeaders ? 'Present' : 'Missing'}` : '- No security data available'}
` : 'No specific context provided'}

You have REAL access to Andi's page components and can see exactly what's on their ${context?.page || 'current page'}. Analyze this real data and provide specific, actionable insights. Don't make assumptions - use the actual component data Luna found.`;

  const messages: ChatGPTMessage[] = [
    { role: 'system', content: systemMessage },
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      model: config.model || 'gpt-5-2025-08-07',
        messages,
        max_completion_tokens: 2000,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Request failed'}`);
    }

    const data: ChatGPTResponse = await response.json();
    
    // Log usage for tracking
    if (data.usage) {
      const log = {
        timestamp: new Date().toISOString(),
        prompt: userMessage,
        response: data.choices[0]?.message?.content || 'No response',
        tokens: data.usage.total_tokens,
        model: config.model,
        context: context?.page || context?.currentSection || 'Unknown'
      };
      
      // Store in localStorage for the integration page to show
      const existingLogs = JSON.parse(localStorage.getItem('chatgpt_api_logs') || '[]');
      existingLogs.unshift(log);
      localStorage.setItem('chatgpt_api_logs', JSON.stringify(existingLogs.slice(0, 50))); // Keep last 50
    }

    return data.choices[0]?.message?.content || 'Sorry, I didn\'t receive a proper response.';
    
  } catch (error) {
    console.error('ChatGPT API call failed:', error);
    throw error;
  }
};

export const isLunaEnabled = (): boolean => {
  const storedConfig = localStorage.getItem('chatgpt_config');
  if (!storedConfig) return false;
  
  const config = JSON.parse(storedConfig);
  return config.lunaEnabled === true && config.enabled === true;
};

export const getLunaConfig = () => {
  const storedKey = localStorage.getItem('openai_api_key');
  const storedConfig = localStorage.getItem('chatgpt_config');
  
  if (!storedKey || !storedConfig) {
    return { apiKey: null, enabled: false };
  }
  
  const config = JSON.parse(storedConfig);
  return {
    apiKey: storedKey,
    model: config.model || 'gpt-5-2025-08-07',
    enabled: config.enabled === true,
    lunaEnabled: config.lunaEnabled === true
  };
};