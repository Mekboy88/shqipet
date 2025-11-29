import React, { useState, useEffect } from 'react';
import { Settings, Key, Globe, Zap, Brain, Bot, CheckCircle, XCircle, Eye, EyeOff, Save, TestTube, RefreshCw, Link, Server } from 'lucide-react';
import AdminLayout from './AdminLayout';
import AITestChat from './AITestChat';

const AIAPIsConnection = () => {
  const [activeTab, setActiveTab] = useState('openai');
  const [showApiKeys, setShowApiKeys] = useState({});
  const [connectionStatus, setConnectionStatus] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    google: '',
    cohere: '',
    xai: '',
    groq: '',
    mistral: '',
    perplexity: '',
    deepseek: '',
    meta: ''
  });

  const [apiSettings, setApiSettings] = useState({
    openai: {
      model: 'gpt-5',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0
    },
    anthropic: {
      model: 'claude-3-5-haiku-20241022',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    },
    google: {
      model: 'gemini-2.5-pro',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1,
      topK: 40
    },
    cohere: {
      model: 'command-a',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1,
      topK: 0
    },
    xai: {
      model: 'grok-4',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    },
    groq: {
      model: 'llama-4-70b-chat',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    },
    mistral: {
      model: 'mistral-large-2',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    },
    perplexity: {
      model: 'llama-3.3-sonar-large-128k-online',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    },
    deepseek: {
      model: 'deepseek-r1',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    },
    meta: {
      model: 'llama-4-405b-instruct',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 1
    }
  });

  const aiProviders = [
    {
      id: 'openai',
      name: 'OpenAI',
      icon: <Bot className="w-5 h-5 text-white" />,
      description: 'GPT-5, GPT-4.1, o3 reasoning models',
      endpoint: 'https://api.openai.com/v1',
      models: ['gpt-5', 'gpt-4.1', 'gpt-4o', 'o3-pro', 'o3-mini'],
      color: 'bg-emerald-500'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: <Brain className="w-5 h-5 text-white" />,
      description: 'Claude 3.5 Haiku, Claude 3 Opus - Working models',
      endpoint: 'https://api.anthropic.com/v1',
      models: ['claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
      color: 'bg-orange-500'
    },
    {
      id: 'google',
      name: 'Google AI',
      icon: <Globe className="w-5 h-5 text-white" />,
      description: 'Gemini 2.5 Pro with 1M context, multimodal',
      endpoint: 'https://generativelanguage.googleapis.com/v1',
      models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-exp-1206', 'gemini-pro-vision'],
      color: 'bg-blue-500'
    },
    {
      id: 'cohere',
      name: 'Cohere',
      icon: <Zap className="w-5 h-5 text-white" />,
      description: 'Command A, Vision, Reasoning models',
      endpoint: 'https://api.cohere.ai/v1',
      models: ['command-a', 'command-a-vision', 'command-a-reasoning', 'command-a-translate'],
      color: 'bg-purple-500'
    },
    {
      id: 'xai',
      name: 'xAI Grok',
      icon: <Brain className="w-5 h-5 text-white" />,
      description: 'Grok 4, Grok Heavy with real-time search',
      endpoint: 'https://api.x.ai/v1',
      models: ['grok-4', 'grok-4-heavy', 'grok-3', 'grok-code-fast-1'],
      color: 'bg-gray-800'
    },
    {
      id: 'groq',
      name: 'Groq',
      icon: <Zap className="w-5 h-5 text-white" />,
      description: 'Ultra-fast LPU inference with latest models',
      endpoint: 'https://api.groq.com/openai/v1',
      models: ['llama-4-70b-chat', 'llama-3.3-70b-versatile', 'qwq-32b-preview', 'gemma2-9b-it'],
      color: 'bg-pink-500'
    },
    {
      id: 'mistral',
      name: 'Mistral AI',
      icon: <Bot className="w-5 h-5 text-white" />,
      description: 'Mistral Large 2, Codestral for coding',
      endpoint: 'https://api.mistral.ai/v1',
      models: ['mistral-large-2', 'mistral-medium', 'codestral-latest', 'pixtral-12b'],
      color: 'bg-red-500'
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      icon: <Globe className="w-5 h-5 text-white" />,
      description: 'Sonar models with real-time web search',
      endpoint: 'https://api.perplexity.ai',
      models: ['llama-3.3-sonar-large-128k-online', 'llama-3.3-sonar-small-128k-online', 'sonar-pro'],
      color: 'bg-teal-500'
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      icon: <Brain className="w-5 h-5 text-white" />,
      description: 'DeepSeek R1 reasoning, cost-effective models',
      endpoint: 'https://api.deepseek.com/v1',
      models: ['deepseek-r1', 'deepseek-v3', 'deepseek-coder-v2', 'deepseek-chat'],
      color: 'bg-indigo-600'
    },
    {
      id: 'meta',
      name: 'Meta Llama',
      icon: <Bot className="w-5 h-5 text-white" />,
      description: 'Llama 4 models, open-source leadership',
      endpoint: 'https://api.together.xyz/v1',
      models: ['llama-4-405b-instruct', 'llama-4-70b-instruct', 'llama-3.3-70b-instruct', 'llama-guard-3-8b'],
      color: 'bg-blue-600'
    }
  ];

  const toggleApiKeyVisibility = (provider) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleApiKeyChange = (provider, value) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const handleSettingChange = (provider, setting, value) => {
    setApiSettings(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [setting]: value
      }
    }));
  };

  const getEdgeFunctionName = (provider) => {
    const functionMap = {
      'openai': 'openai-chat',
      'anthropic': 'anthropic-chat',
      'google': 'google-chat',
      'perplexity': 'perplexity-chat',
      'cohere': 'cohere-chat',
      'xai': 'xai-chat',
      'groq': 'groq-chat',
      'mistral': 'mistral-chat',
      'deepseek': 'deepseek-chat',
      'meta': 'meta-chat'
    };
    return functionMap[provider] || `${provider}-chat`;
  };

  const testApiConnection = async (provider) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      if (!apiKeys[provider] || apiKeys[provider].length < 10) {
        setConnectionStatus(prev => ({
          ...prev,
          [provider]: 'error'
        }));
        setIsLoading(prev => ({ ...prev, [provider]: false }));
        return;
      }

      // Test API connection with actual API call
      const functionName = getEdgeFunctionName(provider);
      throw new Error('Backend disabled');

    } catch (error) {
      console.error(`API test failed for ${provider}:`, error);
      setConnectionStatus(prev => ({
        ...prev,
        [provider]: 'error'
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const getCurrentProviderModels = (provider) => {
    const providerData = aiProviders.find(p => p.id === provider);
    return providerData?.models || [];
  };

  const saveApiConnections = () => {
    // Save to localStorage for Lovable compatibility
    const config = {
      apiKeys,
      apiSettings,
      connectionStatus,
      lastUpdated: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('ai_apis_config', JSON.stringify(config));
      // Show success message without blocking alert
      console.log('AI API connections saved successfully!');
      
      // Optional: You could add a toast notification here instead of alert
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      successMsg.textContent = 'AI API connections saved successfully!';
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
      
    } catch (error) {
      console.error('Error saving AI API connections:', error);
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      errorMsg.textContent = 'Error saving AI API connections. Please try again.';
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    }
  };

  const loadApiConnections = () => {
    try {
      const savedConfig = localStorage.getItem('ai_apis_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        // Merge with existing state instead of overwriting
        if (config.apiKeys) {
          setApiKeys(prev => ({ ...prev, ...config.apiKeys }));
        }
        if (config.apiSettings) {
          setApiSettings(prev => ({ ...prev, ...config.apiSettings }));
        }
        if (config.connectionStatus) {
          setConnectionStatus(prev => ({ ...prev, ...config.connectionStatus }));
        }
        
        console.log('AI API configuration loaded successfully:', config.lastUpdated);
      }
    } catch (error) {
      console.error('Error loading AI APIs configuration:', error);
    }
  };

  // Auto-save whenever apiKeys, apiSettings, or connectionStatus change
  useEffect(() => {
    const saveConfig = () => {
      const config = {
        apiKeys,
        apiSettings,
        connectionStatus,
        lastUpdated: new Date().toISOString()
      };
      
      try {
        localStorage.setItem('ai_apis_config', JSON.stringify(config));
        console.log('AI API configuration auto-saved');
      } catch (error) {
        console.error('Error auto-saving AI API configuration:', error);
      }
    };

    // Only save if we have some data (avoid saving empty initial state)
    const hasData = Object.values(apiKeys).some(key => key.length > 0) || 
                   Object.values(connectionStatus).some(status => status);
    
    if (hasData) {
      const timeoutId = setTimeout(saveConfig, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [apiKeys, apiSettings, connectionStatus]);

  useEffect(() => {
    loadApiConnections();
  }, []);

  const currentProvider = aiProviders.find(p => p.id === activeTab);

  return (
    <AdminLayout title="AI APIs Connection" subtitle="Connect and manage your AI API providers for Shqipet AI - Latest 2025 models">
      <div className="text-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-blue-600">
                AI APIs
              </h1>
            </div>
            <p className="text-gray-600 text-lg">Connect and manage your AI API providers for Shqipet AI - Latest 2025 models</p>
          </div>

        {/* Provider Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {aiProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => setActiveTab(provider.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 border ${
                activeTab === provider.id
                  ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              {provider.icon}
              <span className="font-medium">{provider.name}</span>
              {connectionStatus[provider.id] === 'connected' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {connectionStatus[provider.id] === 'error' && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Main API Connection Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
          {currentProvider && (
            <>
              {/* Provider Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 ${currentProvider.color} rounded-xl shadow-md`}>
                  {currentProvider.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentProvider.name} API</h2>
                  <p className="text-gray-600">{currentProvider.description}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Link className="w-4 h-4" />
                    {currentProvider.endpoint}
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* API Connection Setup */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                    <Key className="w-5 h-5 text-blue-600" />
                    API Connection Setup
                  </h3>

                  {/* API Key Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys[activeTab] ? 'text' : 'password'}
                        value={apiKeys[activeTab] || ''}
                        onChange={(e) => handleApiKeyChange(activeTab, e.target.value)}
                        placeholder="Enter your API key..."
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleApiKeyVisibility(activeTab)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showApiKeys[activeTab] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Model
                    </label>
                    <select
                      value={apiSettings[activeTab]?.model || ''}
                      onChange={(e) => handleSettingChange(activeTab, 'model', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    >
                      {currentProvider.models.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  {/* Test API Connection */}
                  <button
                    onClick={() => testApiConnection(activeTab)}
                    disabled={!apiKeys[activeTab] || isLoading[activeTab]}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                  >
                    {isLoading[activeTab] ? (
                      <RefreshCw className="w-5 h-5 animate-[spin_1s_linear_infinite]" />
                    ) : (
                      <TestTube className="w-5 h-5" />
                    )}
                    {isLoading[activeTab] ? 'Testing API Connection...' : 'Test API Connection'}
                  </button>

                  {/* API Connection Status Indicator */}
                  {connectionStatus[activeTab] && (
                    <div className={`mt-4 p-4 rounded-lg border ${
                      connectionStatus[activeTab] === 'connected' 
                        ? 'bg-green-50 border-green-200 text-green-800' 
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        {connectionStatus[activeTab] === 'connected' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="font-medium">
                          {connectionStatus[activeTab] === 'connected' 
                            ? `${currentProvider.name} API connected successfully! ${activeTab === 'anthropic' ? 'Ready for Shqipet AI integration.' : ''}`
                            : `${currentProvider.name} API connection failed. Please check your API key.`
                          }
                        </span>
                      </div>
                    </div>
                  )}

                  {/* AI Test Chat Interface - Always show if API key is provided */}
                  {apiKeys[activeTab] && apiKeys[activeTab].length > 0 && (
                    <AITestChat 
                      provider={activeTab}
                      model={apiSettings[activeTab]?.model || getCurrentProviderModels(activeTab)[0]}
                      apiKey={apiKeys[activeTab]}
                      isConnected={connectionStatus[activeTab] === 'connected'}
                    />
                  )}
                </div>

                {/* API Parameters */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                    <Settings className="w-5 h-5 text-blue-600" />
                    API Parameters
                  </h3>

                  {/* Temperature */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Temperature: {apiSettings[activeTab]?.temperature || 0.7}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={apiSettings[activeTab]?.temperature || 0.7}
                      onChange={(e) => handleSettingChange(activeTab, 'temperature', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      value={apiSettings[activeTab]?.maxTokens || 4000}
                      onChange={(e) => handleSettingChange(activeTab, 'maxTokens', parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                      max="1000000"
                    />
                  </div>

                  {/* Top P */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Top P: {apiSettings[activeTab]?.topP || 1}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={apiSettings[activeTab]?.topP || 1}
                      onChange={(e) => handleSettingChange(activeTab, 'topP', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  {/* Provider-specific parameters */}
                  {activeTab === 'openai' && (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Frequency Penalty: {apiSettings[activeTab]?.frequencyPenalty || 0}
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={apiSettings[activeTab]?.frequencyPenalty || 0}
                          onChange={(e) => handleSettingChange(activeTab, 'frequencyPenalty', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Presence Penalty: {apiSettings[activeTab]?.presencePenalty || 0}
                        </label>
                        <input
                          type="range"
                          min="-2"
                          max="2"
                          step="0.1"
                          value={apiSettings[activeTab]?.presencePenalty || 0}
                          onChange={(e) => handleSettingChange(activeTab, 'presencePenalty', parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </>
                  )}

                  {(activeTab === 'google' || activeTab === 'cohere') && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Top K
                      </label>
                      <input
                        type="number"
                        value={apiSettings[activeTab]?.topK || 40}
                        onChange={(e) => handleSettingChange(activeTab, 'topK', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  )}

                  {(activeTab === 'xai' || activeTab === 'perplexity') && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        ✨ Real-time Search API
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        This API supports real-time web search capabilities
                      </p>
                    </div>
                  )}

                  {activeTab === 'groq' && (
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <p className="text-sm text-pink-700 font-medium">
                        ⚡ Ultra-Fast API
                      </p>
                      <p className="text-xs text-pink-600 mt-1">
                        Powered by LPU technology for lightning-fast API responses
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* API Connection Status Overview */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">API Connection Status Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {aiProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 ${provider.color} rounded-lg shadow-sm`}>
                  {provider.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-gray-900">{provider.name}</p>
                  <div className="flex items-center gap-1">
                    {connectionStatus[provider.id] === 'connected' ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600">Connected</span>
                      </>
                    ) : connectionStatus[provider.id] === 'error' ? (
                      <>
                        <XCircle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-600">Error</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-500">Not connected</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest API Updates Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <h3 className="text-xl font-semibold mb-4 text-blue-900">🆕 2025 API Updates</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">OpenAI API</h4>
              <p className="text-blue-600">GPT-5 API with enhanced reasoning and multimodal capabilities</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <h4 className="font-semibold text-orange-800 mb-2">Claude API</h4>
              <p className="text-orange-600">Claude 4 API with extended thinking mode and 200K context</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Gemini API</h4>
              <p className="text-blue-600">Gemini 2.5 Pro API with 1M token context and multi-agent reasoning</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-2">Grok API</h4>
              <p className="text-gray-600">Grok 4 API with real-time search and enhanced reasoning</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <h4 className="font-semibold text-indigo-800 mb-2">DeepSeek API</h4>
              <p className="text-indigo-600">DeepSeek R1 API with cost-effective reasoning models</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-semibold text-blue-800 mb-2">Llama API</h4>
              <p className="text-blue-600">Llama 4 API with 405B parameters and native multimodal</p>
            </div>
          </div>
        </div>

        {/* Save API Connections */}
        <div className="mt-8 text-center">
          <button
            onClick={saveApiConnections}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg"
          >
            <Save className="w-6 h-6" />
            Manual Save (Auto-save Active)
          </button>
          <p className="text-gray-600 text-sm mt-2">
            ✅ API connections auto-save when you enter keys or test connections<br/>
            They will persist across browser refreshes and sessions
          </p>
         </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AIAPIsConnection;