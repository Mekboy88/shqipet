import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Bot, CheckCircle, XCircle, Loader2, Lock, Copy, Trash2, Info, Settings, ExternalLink, RefreshCw, Download, Send, ChevronDown, ChevronUp, BarChart3, AlertTriangle } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShqipetSystemIntegration from '@/components/admin/ShqipetSystemIntegration';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface ApiLog {
  timestamp: string;
  prompt: string;
  response: string;
  tokens: number;
  model: string;
  cost?: number;
}

const ChatGPTIntegration: React.FC = () => {
  // Core API states
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const [lastTestTime, setLastTestTime] = useState('Never');
  const [currentEndpoint, setCurrentEndpoint] = useState('https://api.openai.com/v1/chat/completions');
  
  // Model and settings states
  const [selectedModel, setSelectedModel] = useState('gpt-5-2025-08-07');
  const [isIntegrationEnabled, setIsIntegrationEnabled] = useState(true);
  const [messageDelay, setMessageDelay] = useState(1000);
  const [systemInstructions, setSystemInstructions] = useState('You are Luna AI, a helpful and intelligent assistant.');
  const [retryOnFail, setRetryOnFail] = useState(true);
  const [lunaEnabled, setLunaEnabled] = useState(true);
  
  // Test prompt states
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTestingPrompt, setIsTestingPrompt] = useState(false);
  
  // Usage tracking states
  const [dailyTokens, setDailyTokens] = useState(0);
  const [monthlyQuota] = useState(100000);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  
  // UI states
  const [showOptionalSettings, setShowOptionalSettings] = useState(false);
  const [showApiLogs, setShowApiLogs] = useState(false);
  const [showResponseDebug, setShowResponseDebug] = useState(false);

  const { toast } = useToast();

  const models = [
    { value: 'gpt-5-2025-08-07', label: 'GPT-5', description: 'The flagship model - best for coding and agentic tasks across domains' },
    { value: 'gpt-5-mini-2025-08-07', label: 'GPT-5 Mini', description: 'A faster, cost-efficient version of GPT-5 for well-defined tasks' },
    { value: 'gpt-5-nano-2025-08-07', label: 'GPT-5 Nano', description: 'Fastest, most cost-effective version of GPT-5' },
    { value: 'gpt-4.1-2025-04-14', label: 'GPT-4.1', description: 'Flagship GPT-4 model for reliable results' },
    { value: 'o3-2025-04-16', label: 'O3', description: 'Very powerful reasoning model for multi-step problems' },
    { value: 'o4-mini-2025-04-16', label: 'O4 Mini', description: 'Fast reasoning model optimized for coding and visual tasks' }
  ];

  useEffect(() => {
    checkExistingConnection();
    loadUsageStats();
  }, []);

  const validateApiKey = (key: string): boolean => {
    // Real OpenAI key validation - sk-proj- (new format) or sk- (legacy) with proper length
    const isNewFormat = /^sk-proj-[a-zA-Z0-9-_]{48,}$/.test(key);
    const isLegacyFormat = /^sk-[a-zA-Z0-9]{48,}$/.test(key);
    return isNewFormat || isLegacyFormat;
  };

  const checkExistingConnection = async () => {
    try {
      // Check localStorage for existing key and config
      const storedKey = localStorage.getItem('openai_api_key');
      const storedConfig = localStorage.getItem('chatgpt_config');
      
      if (storedKey && storedConfig) {
        const config = JSON.parse(storedConfig);
        setApiKey('sk-••••••••••••••••••••••••••••••••••••••••••••••••••');
        setSelectedModel(config.model || 'gpt-4.1-2025-04-14');
        setIsIntegrationEnabled(config.enabled || false);
        setMessageDelay(config.messageDelay || 1000);
        setSystemInstructions(config.systemInstructions || 'You are Luna AI, a helpful and intelligent assistant.');
        setLunaEnabled(config.lunaEnabled || false);
        setRetryOnFail(config.retryOnFail || true);
        setIsApiKeySaved(true);
        
        // Test the stored key
        await testStoredKey(storedKey);
      }
    } catch (error) {
      console.error('Failed to check existing connection:', error);
    }
  };

  const testStoredKey = async (key: string) => {
    try {
      // Store the key temporarily to test with edge function
      const originalKey = localStorage.getItem('openai_api_key');
      localStorage.setItem('openai_api_key', key);
      
      // Test using our edge function
      const { supabase } = await import('@/integrations/supabase/client');
      const response = await supabase.functions.invoke('chat-gpt', {
        body: {
          message: 'Test connection',
          context: 'API key validation test'
        }
      });

      if (!response.error) {
        setConnectionStatus('connected');
        setLastTestTime(new Date().toLocaleString());
      } else {
        setConnectionStatus('disconnected');
        // Clear invalid stored key
        localStorage.removeItem('openai_api_key');
        localStorage.removeItem('chatgpt_config');
        setIsApiKeySaved(false);
        
        // Restore original key if there was one
        if (originalKey && originalKey !== key) {
          localStorage.setItem('openai_api_key', originalKey);
        }
      }
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    if (!validateApiKey(apiKey)) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key (sk-proj-... or sk-...)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store the key temporarily to test with edge function
      localStorage.setItem('openai_api_key', apiKey);
      
      // Test using our edge function
      const { supabase } = await import('@/integrations/supabase/client');
      const testResponse = await supabase.functions.invoke('chat-gpt', {
        body: {
          message: 'API key validation test',
          context: 'Testing API key configuration'
        }
      });

      if (testResponse.error) {
        throw new Error(`Authentication failed: ${testResponse.error.message || 'Invalid API key'}`);
      }

      // Store in localStorage (in production, use secure server-side storage)
      localStorage.setItem('openai_api_key', apiKey);
      localStorage.setItem('chatgpt_config', JSON.stringify({
        model: selectedModel,
        enabled: isIntegrationEnabled,
        messageDelay,
        systemInstructions,
        lunaEnabled: lunaEnabled,
        retryOnFail: retryOnFail
      }));

      toast({
        title: "Success",
        description: "API key validated and saved successfully",
      });
      
      setConnectionStatus('connected');
      setIsApiKeySaved(true);
      setLastTestTime(new Date().toLocaleString());
      setApiKey('sk-••••••••••••••••••••••••••••••••••••••••••••••••••');
    } catch (error) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApi = async () => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (!storedKey) {
      toast({
        title: "Error",
        description: "Please save an API key first",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setConnectionStatus('testing');
    
    try {
      // Use Supabase edge function for testing
      const { supabase } = await import('@/integrations/supabase/client');
      const response = await supabase.functions.invoke('chat-gpt', {
        body: {
          message: 'Say "API test successful" if you can read this.',
          context: 'Connection test'
        }
      });

      if (!response.error && response.data) {
        setConnectionStatus('connected');
        setLastTestTime(new Date().toLocaleString());
        setCurrentEndpoint('ChatGPT Edge Function');
        
        // Log the response for debugging
        console.log('✅ ChatGPT Test Response:', response.data);
        
        toast({
          title: "Connection Successful",
          description: `API test passed! Response received from ChatGPT.`,
        });
        
        // Store usage info if available
        if (response.data.usage) {
          const newLog: ApiLog = {
            timestamp: new Date().toISOString(),
            prompt: 'API Connection Test',
            response: response.data.response || 'Test successful',
            tokens: response.data.usage.total_tokens || 0,
            model: response.data.model || selectedModel,
            cost: calculateCost(response.data.usage.total_tokens || 0, response.data.model || selectedModel)
          };
          setApiLogs(prev => [...prev, newLog]);
          setDailyTokens(prev => prev + (response.data.usage.total_tokens || 0));
        }
      } else {
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Failed",
          description: `API Error: ${response.error?.message || 'Connection failed'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('disconnected');
      toast({
        title: "Connection Failed",
        description: `Test failed: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendTestPrompt = async () => {
    if (!testPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test prompt",
        variant: "destructive",
      });
      return;
    }

    if (connectionStatus !== 'connected') {
      toast({
        title: "Error",
        description: "Please connect to OpenAI API first",
        variant: "destructive",
      });
      return;
    }

    const storedKey = localStorage.getItem('openai_api_key');
    if (!storedKey) {
      toast({
        title: "Error",
        description: "API key not found",
        variant: "destructive",
      });
      return;
    }

    setIsTestingPrompt(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const response = await supabase.functions.invoke('chat-gpt', {
        body: {
          message: testPrompt,
          context: systemInstructions || 'You are Luna AI, a helpful and intelligent assistant.'
        }
      });

      if (!response.error && response.data) {
        const responseText = response.data.response || 'No response generated';
        setTestResponse(responseText);
        
        // Add to logs
        const newLog: ApiLog = {
          timestamp: new Date().toISOString(),
          prompt: testPrompt,
          response: responseText,
          tokens: response.data.usage?.total_tokens || 0,
          model: response.data.model || selectedModel,
          cost: calculateCost(response.data.usage?.total_tokens || 0, response.data.model || selectedModel)
        };
        setApiLogs(prev => [...prev, newLog]);
        
        // Update usage stats
        setDailyTokens(prev => prev + (response.data.usage?.total_tokens || 0));
        
        toast({
          title: "Success",
          description: "Test prompt sent successfully",
        });
      } else {
        toast({
          title: "Request Failed",
          description: `API Error: ${response.error?.message || 'Request failed'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to send test prompt: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsTestingPrompt(false);
    }
  };

  const calculateCost = (tokens: number, model: string): number => {
    // Approximate costs per 1K tokens (as of 2025)
    const costs: Record<string, number> = {
      'gpt-5-2025-08-07': 0.01,
      'gpt-5-mini-2025-08-07': 0.003,
      'gpt-5-nano-2025-08-07': 0.001,
      'gpt-4.1-2025-04-14': 0.005,
      'o3-2025-04-16': 0.015,
      'o4-mini-2025-04-16': 0.007
    };
    return (tokens / 1000) * (costs[model] || 0.003);
  };

  const loadUsageStats = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('openai_usage_stats');
    if (saved) {
      const stats = JSON.parse(saved);
      setDailyTokens(stats.dailyTokens || 0);
      setMonthlyUsage(stats.monthlyUsage || 0);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    setConnectionStatus('disconnected');
    setIsApiKeySaved(false);
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('chatgpt_config');
    toast({
      title: "Cleared",
      description: "API key and configuration cleared",
    });
  };

  const handleCopyApiKey = () => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      navigator.clipboard.writeText(storedKey);
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      });
    }
  };

  const handleResetForm = () => {
    setApiKey('');
    setSelectedModel('gpt-4.1-2025-04-14');
    setIsIntegrationEnabled(true);
    setLunaEnabled(true);
    setMessageDelay(1000);
    setSystemInstructions('You are Luna AI, a helpful and intelligent assistant.');
    setRetryOnFail(true);
    setTestPrompt('');
    setTestResponse('');
    setConnectionStatus('disconnected');
    setIsApiKeySaved(false);
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('chatgpt_config');
  };

  const handleExportSettings = () => {
    const settings = {
      model: selectedModel,
      integrationEnabled: isIntegrationEnabled,
      lunaEnabled,
      messageDelay,
      systemInstructions,
      retryOnFail,
      apiLogs: apiLogs.slice(-10), // Last 10 logs
      dailyTokens,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatgpt-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <TooltipProvider>
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Bot className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">ChatGPT API Integration</h1>
              <p className="text-muted-foreground">Configure OpenAI's ChatGPT API for Luna AI Assistant</p>
            </div>
          </div>

          {/* Connection Status Banner */}
          {connectionStatus === 'disconnected' && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-destructive mr-2" />
                <p className="text-destructive font-medium">⚠️ Not connected to OpenAI</p>
              </div>
              <p className="text-destructive/80 text-sm mt-1">Please configure and test your API key to enable real ChatGPT integration.</p>
            </div>
          )}

          {connectionStatus === 'connected' && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800 font-medium">✅ Connected to OpenAI API</p>
              </div>
              <p className="text-green-700 text-sm mt-1">ChatGPT integration is active and ready to use.</p>
            </div>
          )}

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="integration">Luna Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Configuration - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* 1. Secure API Key Input Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    API Key Configuration
                  </CardTitle>
                  <CardDescription>
                    Enter your OpenAI API key to enable real ChatGPT integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key" className="flex items-center gap-2">
                      OpenAI API Key
                      <Lock className="w-3 h-3 text-muted-foreground" />
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="api-key"
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="sk-proj-... or sk-..."
                          className="pr-24"
                        />
                        <div className="absolute right-1 top-1 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleCopyApiKey}
                            disabled={!isApiKeySaved}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={handleClearApiKey}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        onClick={handleSaveApiKey} 
                        disabled={isLoading || !apiKey || apiKey.startsWith('sk-••••')}
                        className="whitespace-nowrap"
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Key
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="enable-integration"
                        checked={isIntegrationEnabled}
                        onCheckedChange={setIsIntegrationEnabled}
                      />
                      <Label htmlFor="enable-integration">Enable ChatGPT Integration</Label>
                    </div>
                    <Button 
                      onClick={handleTestApi}
                      disabled={!isApiKeySaved || isTesting}
                      variant="outline"
                      size="sm"
                    >
                      {isTesting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      🧪 Test API
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 2. Model Selection Dropdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🧰 Model Selection
                  </CardTitle>
                  <CardDescription>
                    Choose the OpenAI model for your integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select OpenAI Model</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{model.label}</span>
                              <span className="text-xs text-muted-foreground">{model.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Current Model Features:</p>
                        <ul className="text-xs space-y-1 mt-1">
                          <li>• <strong>GPT-4o Mini:</strong> Fast, efficient, and cost-effective</li>
                          <li>• <strong>GPT-4o:</strong> Most capable with vision support</li>
                          <li>• <strong>GPT-4 Turbo:</strong> Previous generation, still powerful</li>
                          <li>• <strong>GPT-3.5 Turbo:</strong> Fastest and cheapest option</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 3. Live Connection Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📊 Live Connection Status
                    {connectionStatus === 'connected' ? (
                      <Badge variant="default" className="bg-green-500 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connected
                      </Badge>
                    ) : connectionStatus === 'testing' ? (
                      <Badge variant="secondary" className="bg-yellow-500 text-white">
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Testing
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-500 text-white">
                        <XCircle className="w-4 h-4 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className={`font-medium ${
                        connectionStatus === 'connected' ? 'text-green-600' : 
                        connectionStatus === 'testing' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {connectionStatus === 'connected' ? '✅ Connected' : 
                         connectionStatus === 'testing' ? '🔄 Testing' : '❌ Disconnected'}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Endpoint:</span>
                      <p className="font-medium text-xs">{currentEndpoint}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Test:</span>
                      <p className="font-medium">🕒 {lastTestTime}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Model:</span>
                      <p className="font-medium">⚡ {models.find(m => m.value === selectedModel)?.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 4. API Usage & Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>🔁 Real-Time API Usage</CardTitle>
                  <CardDescription>Monitor your OpenAI API usage and costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Tokens Used Today</Label>
                      <div className="text-2xl font-bold">
                        {dailyTokens.toLocaleString()}
                        {connectionStatus === 'connected' && (
                          <span className="text-xs ml-2 text-green-500">● Live</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Monthly Quota</Label>
                      <div className="text-2xl font-bold">
                        {monthlyQuota.toLocaleString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Usage %</Label>
                      <div className="text-2xl font-bold">
                        {((dailyTokens / monthlyQuota) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* API Logs Button */}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowApiLogs(!showApiLogs)}
                      className="w-full"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      {showApiLogs ? 'Hide' : 'Show'} API Request Logs ({apiLogs.length})
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 5. Smart Prompts Sandbox Panel */}
              <Card>
                <CardHeader>
                  <CardTitle>💡 Test Prompt Sandbox</CardTitle>
                  <CardDescription>
                    Test real ChatGPT responses with your current configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Test Message</Label>
                    <Textarea
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      placeholder="Type your test prompt here..."
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleSendTestPrompt}
                    disabled={!testPrompt.trim() || connectionStatus !== 'connected' || isTestingPrompt}
                    className="w-full"
                  >
                    {isTestingPrompt && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Send className="w-4 h-4 mr-2" />
                    Send Test Prompt
                  </Button>

                  {testResponse && (
                    <div className="mt-4 space-y-4">
                      <div className="p-4 bg-secondary rounded-lg">
                        <Label className="text-sm font-medium mb-2 block">ChatGPT Response:</Label>
                        <div className="text-sm whitespace-pre-wrap">{testResponse}</div>
                      </div>
                      
                      {/* Response Debug Toggle */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowResponseDebug(!showResponseDebug)}
                      >
                        {showResponseDebug ? 'Hide' : 'Show'} Response Debug Info
                      </Button>
                      
                      {showResponseDebug && apiLogs.length > 0 && (
                        <div className="p-4 bg-muted rounded-lg">
                          <Label className="text-sm font-medium mb-2 block">Latest API Call Debug:</Label>
                          <pre className="text-xs overflow-auto max-h-40">
                            {JSON.stringify(apiLogs[apiLogs.length - 1], null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {connectionStatus !== 'connected' && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 text-sm">
                        ⚠️ Connect to OpenAI API first to test prompts with real responses.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Instructions Panel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📋 How to Connect OpenAI API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="font-medium">Create OpenAI Account</p>
                        <p className="text-muted-foreground text-xs">Go to platform.openai.com and sign up</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="font-medium">Navigate to API Keys</p>
                        <p className="text-muted-foreground text-xs">Find the API Keys section in your dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="font-medium">Create New Key</p>
                        <p className="text-muted-foreground text-xs">Generate a new secret key for this integration</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <p className="font-medium">Paste & Test</p>
                        <p className="text-muted-foreground text-xs">Enter your key above and click "Test API"</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" className="w-full">
                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open OpenAI Dashboard
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Optional Settings Panel */}
              <Card>
                <CardHeader>
                  <CardTitle 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setShowOptionalSettings(!showOptionalSettings)}
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Optional Settings
                    </span>
                    {showOptionalSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </CardTitle>
                </CardHeader>
                {showOptionalSettings && (
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="luna-enabled" className="text-sm">Enable Luna AI Integration</Label>
                      <Switch
                        id="luna-enabled"
                        checked={lunaEnabled}
                        onCheckedChange={setLunaEnabled}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">Message Delay (ms)</Label>
                      <Input
                        type="number"
                        value={messageDelay}
                        onChange={(e) => setMessageDelay(Number(e.target.value))}
                        min="0"
                        max="5000"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm">System Instructions</Label>
                      <Textarea
                        value={systemInstructions}
                        onChange={(e) => setSystemInstructions(e.target.value)}
                        placeholder="Custom instructions for the AI..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="retry-fail" className="text-sm">Retry on Failure</Label>
                      <Switch
                        id="retry-fail"
                        checked={retryOnFail}
                        onCheckedChange={setRetryOnFail}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Footer Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>🔧 Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleResetForm} variant="outline" className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Configuration
                  </Button>
                  <Button onClick={handleExportSettings} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>
                </CardContent>
              </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="integration" className="space-y-6">
              <ShqipetSystemIntegration />
            </TabsContent>
          </Tabs>
          
          {/* API Logs Panel */}
          {showApiLogs && (
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Real API Call Logs & Analytics
                  </CardTitle>
                  <CardDescription>
                    Live tracking of all OpenAI API requests and responses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {apiLogs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No API calls recorded yet.</p>
                      <p className="text-sm">Send a test prompt or test your API connection to see real-time logs.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {apiLogs.slice().reverse().map((log, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2 bg-muted/30">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                            <div className="flex gap-4 text-muted-foreground">
                              <span>Model: <strong>{log.model}</strong></span>
                              <span>Tokens: <strong>{log.tokens}</strong></span>
                              {log.cost && <span>Cost: <strong>${log.cost.toFixed(4)}</strong></span>}
                            </div>
                          </div>
                          <div className="text-sm">
                            <strong className="text-blue-600">Prompt:</strong> {log.prompt}
                          </div>
                          <div className="text-sm">
                            <strong className="text-green-600">Response:</strong> {log.response}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </AdminLayout>
    </TooltipProvider>
  );
};

export default ChatGPTIntegration;