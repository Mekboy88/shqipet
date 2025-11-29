// Mock API responses for ChatGPT integration
// This simulates the backend API endpoints until they are implemented

export const mockChatGPTApi = {
  async checkStatus() {
    // Simulate checking existing connection
    const savedKey = localStorage.getItem('chatgpt_api_key');
    return {
      connected: !!savedKey,
      message: savedKey ? 'API key is configured' : 'No API key configured'
    };
  },

  async saveApiKey(apiKey: string) {
    // Simulate saving API key securely
    if (!apiKey || !apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }
    
    // In a real implementation, this would be saved securely on the server
    localStorage.setItem('chatgpt_api_key', apiKey);
    localStorage.setItem('chatgpt_connected', 'true');
    
    return {
      success: true,
      message: 'API key saved successfully'
    };
  },

  async testConnection() {
    // Simulate testing the API connection
    const savedKey = localStorage.getItem('chatgpt_api_key');
    
    if (!savedKey) {
      throw new Error('No API key configured');
    }

    // Mock API test (in real implementation, this would call OpenAI's API)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Simulate different response scenarios
    const isValidKey = savedKey.length > 20; // Simple validation mock
    
    if (!isValidKey) {
      throw new Error('Invalid API key or insufficient permissions');
    }

    return {
      success: true,
      message: 'Connection successful! ChatGPT API is working.',
      quota: 4850, // Mock quota remaining
      model: 'gpt-4-turbo',
      organization: 'Your Organization'
    };
  }
};

// Mock fetch handlers for the API endpoints
export const setupMockApiHandlers = () => {
  // Intercept fetch requests and provide mock responses
  const originalFetch = window.fetch;
  
  window.fetch = async (url: string | Request, options?: RequestInit) => {
    const urlString = typeof url === 'string' ? url : url.url;
    
    // Handle ChatGPT API status check
    if (urlString.includes('/api/admin/chatgpt/status')) {
      const result = await mockChatGPTApi.checkStatus();
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Handle ChatGPT API key save
    if (urlString.includes('/api/admin/chatgpt/save-key') && options?.method === 'POST') {
      try {
        const body = JSON.parse(options.body as string);
        const result = await mockChatGPTApi.saveApiKey(body.apiKey);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Handle ChatGPT API test
    if (urlString.includes('/api/admin/chatgpt/test') && options?.method === 'POST') {
      try {
        const result = await mockChatGPTApi.testConnection();
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Fall back to original fetch for other requests
    return originalFetch(url, options);
  };
};

// Initialize mock handlers when the module is loaded
if (typeof window !== 'undefined') {
  setupMockApiHandlers();
}