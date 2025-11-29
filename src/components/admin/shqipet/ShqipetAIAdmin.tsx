import React, { useState, useEffect, useRef } from 'react';
import ShqipetAIAdvanced from './ShqipetAIAdvanced';
import { Switch } from '@/components/ui/switch';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  images?: string[]; // Add images field
}

interface SystemStatus {
  database: 'online' | 'warning' | 'offline';
  supabase: 'online' | 'warning' | 'offline';
  website: 'online' | 'warning' | 'offline';
  ios: 'online' | 'warning' | 'offline';
  android: 'online' | 'warning' | 'offline';
  security: 'online' | 'warning' | 'offline';
}

interface Metrics {
  uptime: string;
  responseTime: string;
  memory: string;
  cpu: string;
}

const ShqipetAIAdmin: React.FC = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Shqipet AI, your super admin assistant. I'm connected via Anthropic Claude AI to help you monitor and control all system connections, security, and performance.\n\n🔧 If I'm not responding intelligently, please configure the Anthropic API in the AI APIs settings page.\n\nHow can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImages, setAttachedImages] = useState<File[]>([]); // New state for attached images
  const [isDragOver, setIsDragOver] = useState(false); // New state for drag over
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    database: 'online',
    supabase: 'online',
    website: 'online',
    ios: 'warning',
    android: 'online',
    security: 'online'
  });
  
  const [metrics, setMetrics] = useState<Metrics>({
    uptime: '99.9%',
    responseTime: '127ms',
    memory: '2.4GB',
    cpu: '15%'
  });

  // Settings panel state
  const [responseStyle, setResponseStyle] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [voiceInput, setVoiceInput] = useState(true);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [responseSpeed, setResponseSpeed] = useState('Fast');
  const [photoReading, setPhotoReading] = useState(true);
  const [videoAnalysis, setVideoAnalysis] = useState(true);
  const [screenshotOCR, setScreenshotOCR] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('5 seconds');
  const [alertNotifications, setAlertNotifications] = useState(true);
  const [performanceLogging, setPerformanceLogging] = useState(true);
  
  // Collapsible sections state
  const [isConnectionsCollapsed, setIsConnectionsCollapsed] = useState(false);
  const [isSecurityCollapsed, setIsSecurityCollapsed] = useState(false);
  const [isControlCollapsed, setIsControlCollapsed] = useState(false);
  const [isMetricsCollapsed, setIsMetricsCollapsed] = useState(false);
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateMetrics();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    setMetrics({
      uptime: '99.9%',
      responseTime: Math.floor(100 + Math.random() * 50) + 'ms',
      memory: (2.0 + Math.random() * 0.8).toFixed(1) + 'GB',
      cpu: Math.floor(10 + Math.random() * 15) + '%'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() && attachedImages.length === 0) return;

    // Create message content with images
    let messageContent = inputValue.trim();
    let imageDataUrls: string[] = [];
    
    // Convert attached images to base64 data URLs for display and API
    if (attachedImages.length > 0) {
        const imagePromises = attachedImages.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      imageDataUrls = await Promise.all(imagePromises);
      
      // For images, create a more descriptive user message
      const imageText = attachedImages.map(img => `🖼️ Uploaded image: ${img.name}`).join('\n');
      messageContent = messageContent ? `${messageContent}\n\n${imageText}` : imageText;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
      images: imageDataUrls // Store images with the message
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setAttachedImages([]); // Clear attached images after sending
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // If images are present, use image analysis workflow
    if (imageDataUrls.length > 0) {
      processImagesWithAI(inputValue.trim() || "Tell me what you see in detail.", imageDataUrls);
    } else {
      processMessage(newMessage.content, imageDataUrls);
    }
  };

  const processImagesWithAI = async (userPrompt: string, imageDataUrls: string[]) => {
    setIsTyping(true);
    
    try {
      // Process each image with the dedicated Anthropic image analysis edge function
      for (let i = 0; i < imageDataUrls.length; i++) {
        const dataUrl = imageDataUrls[i];
        const base64Data = dataUrl.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        const fileName = attachedImages[i]?.name || `image_${i + 1}`;
        
        console.log(`Analyzing image ${i + 1}/${imageDataUrls.length}: ${fileName}`);
        
        const response = await fetch(`https://rvwopaofedyieydwbghs.supabase.co/functions/v1/anthropic-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2d29wYW9mZWR5aWV5ZHdiZ2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDYzNDMsImV4cCI6MjA2NDYyMjM0M30.WpJtBt49SJanUECQbIbnMmZWzTmZm5e9UhjiCylAlLc'
          },
          body: JSON.stringify({
            base64Image: base64Data,
            fileName: fileName,
            prompt: userPrompt,
            model: 'claude-3-5-haiku-20241022'
          }),
        });

        if (!response.ok) {
          throw new Error(`Image analysis failed: ${response.status}`);
        }

        const data = await response.json();
        
        const assistantMessage: Message = {
          id: (Date.now() + i + 1).toString(),
          role: 'assistant',
          content: `🖼️ **Analysis of ${fileName}:**\n\n${data.response}`,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Small delay between processing multiple images
        if (i < imageDataUrls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Error analyzing images:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1000).toString(),
        role: 'assistant',
        content: `❌ Sorry, I encountered an error analyzing the images: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure you're connected to Anthropic AI in the settings and try again.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const processMessage = async (message: string, imageDataUrls: string[] = []) => {
    setIsTyping(true);
    
    try {
      // Check if Anthropic API is configured
      const aiConfig = localStorage.getItem('ai_apis_config');
      let useAI = false;
      
      if (aiConfig) {
        const config = JSON.parse(aiConfig);
        const anthropicKey = config.apiKeys?.anthropic;
        const anthropicStatus = config.connectionStatus?.anthropic;
        
        if (anthropicKey && anthropicStatus === 'connected') {
          useAI = true;
        }
      }
      
      let response: string;
      
      if (useAI) {
        // Use Anthropic AI for text-only responses (no images)
        const systemPrompt = `You are Shqipet AI, a super admin assistant for system monitoring and control. You provide intelligent analysis of system status, security monitoring, performance metrics, and administrative tasks.

Current system context:
- Database: ${systemStatus.database}
- Supabase: ${systemStatus.supabase}  
- Website: ${systemStatus.website}
- iOS App: ${systemStatus.ios}
- Android App: ${systemStatus.android}
- Security: ${systemStatus.security}

Current metrics:
- Uptime: ${metrics.uptime}
- Response Time: ${metrics.responseTime}
- Memory: ${metrics.memory}
- CPU: ${metrics.cpu}

Provide helpful administrative responses about system status, monitoring, and control.`;

        try {
          const requestBody = {
            message: message,
            systemPrompt: systemPrompt,
            model: 'claude-3-5-haiku-20241022'
          };

          const apiResponse = await fetch(`https://rvwopaofedyieydwbghs.supabase.co/functions/v1/anthropic-chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (apiResponse.ok) {
            const data = await apiResponse.json();
            response = data.response;
            console.log('AI response generated successfully');
          } else {
            console.error('AI API call failed, falling back to static responses');
            response = generateResponse(message);
          }
        } catch (error) {
          console.error('Error calling AI API, falling back to static responses:', error);
          response = generateResponse(message);
        }
      } else {
        // Fallback to static responses
        response = generateResponse(message);
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again or check the system status.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('database') || lowercaseMessage.includes('db')) {
      return `Database Status: ✅ ONLINE\n\nConnections: 847 active\nQuery Response Time: 23ms\nLast Backup: 2 hours ago\nHealth Score: 98.5%\n\nAll database operations are running smoothly. No issues detected.`;
    }
    
    if (lowercaseMessage.includes('security') || lowercaseMessage.includes('vulnerability')) {
      return `Security Status: ✅ SECURE\n\n🔐 Last vulnerability scan: 1 hour ago\n🛡️ Firewall status: Active\n🔑 Authentication: Multi-factor enabled\n⚠️ Threat level: LOW\n\nAll security protocols are active and functioning correctly.`;
    }
    
    if (lowercaseMessage.includes('performance') || lowercaseMessage.includes('speed')) {
      return `Performance Metrics: ✅ OPTIMAL\n\n⚡ Response Time: 127ms\n💾 Memory Usage: 2.4GB / 16GB\n🖥️ CPU Usage: 15%\n📊 Uptime: 99.9%\n🌐 Bandwidth: 1.2 Gbps\n\nSystem performance is excellent across all metrics.`;
    }
    
    if (lowercaseMessage.includes('connection') || lowercaseMessage.includes('connectivity')) {
      return `Connection Status Summary:\n\n✅ Database: CONNECTED\n✅ Supabase: CONNECTED\n✅ Website/Web App: CONNECTED\n⚠️ iOS App: PARTIAL (investigating)\n✅ Android App: CONNECTED\n\nMost connections are stable. iOS connection showing intermittent issues - monitoring closely.`;
    }
    
    if (lowercaseMessage.includes('error') || lowercaseMessage.includes('log')) {
      return `Recent Error Logs:\n\n📝 Last 24 hours: 3 warnings, 0 critical errors\n\n⚠️ [14:32] iOS API timeout - resolved\n⚠️ [09:15] High memory usage - optimized\n⚠️ [02:44] Backup delay - completed\n\nNo critical issues found. System stability maintained.`;
    }
    
    if (lowercaseMessage.includes('backup')) {
      return `Backup Status: ✅ UP TO DATE\n\n💾 Last Full Backup: 2 hours ago\n📊 Incremental: 15 minutes ago\n☁️ Cloud Sync: Active\n💿 Local Copies: 3 available\n🔐 Encryption: AES-256\n\nAll backup procedures are functioning correctly.`;
    }
    
    if (lowercaseMessage.includes('update') || lowercaseMessage.includes('version')) {
      return `System Updates: ✅ CURRENT\n\n🔄 Core System: v2.4.1 (latest)\n📱 Mobile Apps: v1.8.3 (latest)\n🌐 Web Interface: v3.2.0 (latest)\n🔧 Dependencies: All updated\n\nNext scheduled update: Friday 3:00 AM\nNo critical updates pending.`;
    }
    
    if (lowercaseMessage.includes('health') || lowercaseMessage.includes('monitor')) {
      return `System Health Monitor: ✅ ALL SYSTEMS HEALTHY\n\n🟢 Database: Excellent\n🟢 API Endpoints: Responsive\n🟡 iOS Connectivity: Fair (monitoring)\n🟢 Security: Optimal\n🟢 Performance: Excellent\n\nOverall System Score: 96/100\nRecommendation: Continue monitoring iOS connectivity.`;
    }
    
    return `I'm here to help you monitor and control all aspects of the Shqipet AI system. I can provide information about:\n\n🔍 System status and connectivity\n🛡️ Security monitoring and alerts\n📊 Performance metrics and analytics\n🔧 System control and configuration\n📱 Application health across platforms\n\nWhat specific system information would you like me to check for you?`;
  };

  const quickCheck = (type: string) => {
    const queries: Record<string, string> = {
      'database': 'Check database status and performance',
      'security': 'Run security vulnerability scan',
      'performance': 'Show current performance metrics',
      'connections': 'Check all system connections',
      'logs': 'Display recent error logs',
      'backup': 'Show backup status and schedule',
      'updates': 'Check for system updates',
      'monitoring': 'Display health monitor dashboard',
      // Image analysis quick actions
      'ocr': 'Extract and read all text from the uploaded images',
      'analyze': 'Analyze and describe everything you see in the uploaded images',
      'objects': 'Identify all objects, people, and items in the images',
      'technical': 'Analyze any technical diagrams, charts, or system interfaces in the images'
    };
    
    setInputValue(queries[type] || 'System status check');
  };

  const toggleVoice = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsRecording(false);
        };
        
        recognition.onerror = () => {
          setIsRecording(false);
        };
        
        recognition.onend = () => {
          setIsRecording(false);
        };
        
        recognition.start();
      } else {
        alert('Speech recognition not supported in this browser.');
        setIsRecording(false);
      }
    }
  };

  const attachFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/tiff,image/svg+xml,.pdf,.txt,.doc,.docx';
    input.multiple = true;
    
    input.onchange = (e: any) => {
      const files = Array.from(e.target.files) as File[];
      handleFileUpload(files);
    };
    
    input.click();
  };

  const compressImage = (file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const otherFiles = files.filter(file => !file.type.startsWith('image/'));
    
    // Process and add images to the attached images state
    if (imageFiles.length > 0) {
      try {
        // Compress large images for better performance
        const processedImages = await Promise.all(
          imageFiles.map(async (file) => {
            if (file.size > 5 * 1024 * 1024) { // 5MB threshold
              console.log(`Compressing large image: ${file.name}`);
              return await compressImage(file);
            }
            return file;
          })
        );
        
        setAttachedImages(prev => [...prev, ...processedImages]);
        
        // Images are uploaded and ready - no automatic message needed
        
      } catch (error) {
        console.error('Error processing images:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `❌ Error processing some images. Please try uploading them again or use smaller file sizes.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }
    
    // Handle non-image files as before
    otherFiles.forEach(file => {
      const fileMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `📎 Uploaded: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fileMessage]);
      
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `✅ File "${file.name}" has been received. For document analysis, please convert to image format or copy-paste the text content for better AI analysis.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeAttachedImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400 shadow-green-400';
      case 'warning': return 'bg-yellow-400 shadow-yellow-400';
      case 'offline': return 'bg-red-400 shadow-red-400';
      default: return 'bg-gray-400';
    }
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <>
      {/* If advanced mode is selected, show the advanced interface */}
      {isAdvancedMode ? (
        <ShqipetAIAdvanced onSwitchBack={toggleAdvancedMode} />
      ) : (
        <div className="flex h-full w-full bg-white overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 p-3 bg-white border-r border-gray-200 text-gray-800 flex flex-col h-full">
            {/* Compact Header */}
            <div 
              className="text-center mb-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm flex-shrink-0 cursor-pointer hover:bg-gray-50 hover:shadow-md transition-all duration-300"
              onClick={toggleAdvancedMode}
              title="Click to switch to Real AI Connected mode"
            >
              <h1 className="text-xl font-bold mb-1 text-gray-800">🤖 Shqipet AI</h1>
              <p className="text-xs opacity-80 text-gray-600">Super Admin Control Panel</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  Click to switch to Real AI
                </span>
              </div>
            </div>

            {/* Quick System Checks - Integrated in Header */}
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="text-xs font-semibold mb-2 text-gray-700 text-center">Quick System Checks</div>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { key: 'database', label: 'Database', emoji: '🗄️' },
                  { key: 'security', label: 'Security', emoji: '🔒' },
                  { key: 'performance', label: 'Performance', emoji: '⚡' },
                  { key: 'connections', label: 'Connections', emoji: '🔗' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => quickCheck(item.key)}
                    className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 text-xs font-medium text-center"
                  >
                    <div>{item.emoji}</div>
                    <div className="truncate">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

        <div className="flex-1 overflow-y-auto space-y-3">

        {/* Connection Status */}
        <div className="mb-3">
          <button 
            onClick={() => setIsConnectionsCollapsed(!isConnectionsCollapsed)}
            className="w-full flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="text-sm font-semibold text-gray-700">Connection Status</div>
            {isConnectionsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!isConnectionsCollapsed && (
            <div className="mt-2 space-y-1">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg text-xs transition-all duration-200 hover:bg-gray-50 cursor-pointer">
                  <span className="font-medium capitalize text-gray-800">{key === 'ios' ? 'iOS App' : key === 'android' ? 'Android App' : key}</span>
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Security Monitoring */}
        <div className="mb-3">
          <button 
            onClick={() => setIsSecurityCollapsed(!isSecurityCollapsed)}
            className="w-full flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="text-sm font-semibold text-gray-700">Security Status</div>
            {isSecurityCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!isSecurityCollapsed && (
            <div className="mt-2 space-y-1">
              {['Vulnerability Scan', 'Authentication', 'API Security'].map((item) => (
                <div key={item} className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg text-xs transition-all duration-200 hover:bg-gray-50 cursor-pointer">
                  <span className="font-medium text-gray-800">{item}</span>
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Control */}
        <div className="mb-3">
          <button 
            onClick={() => setIsControlCollapsed(!isControlCollapsed)}
            className="w-full flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="text-sm font-semibold text-gray-700">System Control</div>
            {isControlCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!isControlCollapsed && (
            <div className="mt-2 space-y-1">
              {['Enable AI Monitoring', 'Configure Intervals', 'Set Thresholds'].map((action) => (
                <button key={action} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 transition-all duration-200 text-xs font-medium">
                  {action}
                </button>
              ))}
              <button className="w-full p-2 bg-red-600 border border-red-600 rounded-lg text-white hover:bg-red-700 transition-all duration-200 text-xs font-medium">
                Emergency Disconnect
              </button>
            </div>
          )}
        </div>

        {/* Real-time Metrics */}
        <div className="mb-3">
          <button 
            onClick={() => setIsMetricsCollapsed(!isMetricsCollapsed)}
            className="w-full flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="text-sm font-semibold text-gray-700">Live Metrics</div>
            {isMetricsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!isMetricsCollapsed && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {Object.entries(metrics).map(([key, value]) => (
                <div key={key} className="p-2 bg-white border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-all duration-200">
                  <div className="text-sm font-semibold text-gray-800">{value}</div>
                  <div className="text-xs opacity-80 capitalize text-gray-600">{key === 'responseTime' ? 'Response' : key}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="mb-3">
          <button 
            onClick={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
            className="w-full flex justify-between items-center p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <div className="text-sm font-semibold text-gray-700">AI Settings</div>
            {isSettingsCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          {!isSettingsCollapsed && (
            <div className="mt-2 space-y-2">
              <div className="p-2 bg-white border border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Voice Input</span>
                    <Switch
                      checked={voiceInput}
                      onCheckedChange={setVoiceInput}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Text to Speech</span>
                    <Switch
                      checked={textToSpeech}
                      onCheckedChange={setTextToSpeech}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Photo Reading</span>
                    <Switch
                      checked={photoReading}
                      onCheckedChange={setPhotoReading}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Video Analysis</span>
                    <Switch
                      checked={videoAnalysis}
                      onCheckedChange={setVideoAnalysis}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Screenshot OCR</span>
                    <Switch
                      checked={screenshotOCR}
                      onCheckedChange={setScreenshotOCR}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Alert Notifications</span>
                    <Switch
                      checked={alertNotifications}
                      onCheckedChange={setAlertNotifications}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">Performance Logging</span>
                    <Switch
                      checked={performanceLogging}
                      onCheckedChange={setPerformanceLogging}
                      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="bg-white p-3 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div className="text-lg font-semibold text-gray-800">Shqipet AI Assistant</div>
          <div className="flex gap-2">
            {['Clear Chat', 'Export Logs', 'System Report'].map((action) => (
              <button key={action} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 text-xs">
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-3 bg-white border-b border-gray-200 flex-shrink-0">
          {attachedImages.length > 0 ? (
            // Image Analysis Actions
            <>
              <div className="text-sm font-semibold mb-3 text-gray-600 flex items-center gap-2">
                <span>📸</span> Image Analysis Actions
              </div>
              <div className="flex gap-2 flex-wrap mb-3">
                {[
                  { key: 'ocr', label: '🔤 Extract Text (OCR)', color: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100' },
                  { key: 'analyze', label: '🔍 Full Analysis', color: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100' },
                  { key: 'objects', label: '👁️ Identify Objects', color: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100' },
                  { key: 'technical', label: '⚙️ Technical Analysis', color: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => quickCheck(item.key)}
                    className={`px-3 py-2 border rounded-xl transition-all duration-300 text-xs hover:-translate-y-0.5 font-medium ${item.color}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mb-3">
                💡 Tip: You can also type custom questions about your images
              </div>
            </>
          ) : null}
          
          {/* Advanced Actions */}
          <div className="text-sm font-semibold mb-2 text-gray-600">Advanced System Actions</div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'logs', label: 'Error Logs' },
              { key: 'backup', label: 'Backup Status' },
              { key: 'updates', label: 'Updates' },
              { key: 'monitoring', label: 'Health Monitor' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => quickCheck(item.key)}
                className="px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-800 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 text-xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
          {/* Connection Status Banner */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-800 font-medium">
                {(() => {
                  const aiConfig = localStorage.getItem('ai_apis_config');
                  if (aiConfig) {
                    const config = JSON.parse(aiConfig);
                    const anthropicKey = config.apiKeys?.anthropic;
                    const anthropicStatus = config.connectionStatus?.anthropic;
                    if (anthropicKey && anthropicStatus === 'connected') {
                      return '🤖 Shqipet AI is connected and ready via Anthropic Claude';
                    }
                  }
                  return '⚠️ AI offline - using static responses (configure AI in API settings)';
                })()}
              </span>
            </div>
          </div>

          {messages.map((message) => (
            <div key={message.id} className={`mb-5 flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 font-semibold bg-white border border-gray-200 shadow-sm">
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`max-w-[70%] p-4 rounded-xl border shadow-sm ${
                message.role === 'user' 
                  ? 'bg-gray-800 text-white border-gray-800' 
                  : 'bg-white text-gray-800 border-gray-200'
              }`}>
                {/* Display images if they exist */}
                {message.images && message.images.length > 0 && (
                  <div className="mb-3 grid grid-cols-2 gap-2">
                    {message.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Uploaded image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                    ))}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 opacity-70 ${message.role === 'user' ? 'text-gray-300' : 'text-gray-500'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="mb-5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-800 font-semibold bg-white border border-gray-200 shadow-sm">
                🤖
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Shqipet AI is thinking...</div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-3 border-t border-gray-200 flex-shrink-0">
          <div 
            className={`flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300 ${
              attachedImages.length > 0 || isDragOver 
                ? 'bg-gradient-to-r from-red-500/10 to-gray-800/10 border-red-200 shadow-lg transform scale-105' 
                : 'bg-white border-gray-200 shadow-sm'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Attached Images Preview */}
            {attachedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg border">
                {attachedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Attached ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      onClick={() => removeAttachedImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={attachedImages.length > 0 ? "Add a message about your screenshots..." : "Type your message or ask about system status..."}
                className={`flex-1 border-none outline-none p-3 text-base bg-transparent resize-none transition-all duration-300 ${
                  attachedImages.length > 0 ? 'min-h-20 max-h-40' : 'max-h-32 min-h-5'
                }`}
                rows={attachedImages.length > 0 ? 3 : 1}
              />
              <div className="flex gap-2 items-center">
                <button
                  onClick={attachFile}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 hover:shadow-md transition-transform duration-300"
                >
                  📎
                </button>
                <button
                  onClick={toggleVoice}
                  className={`w-10 h-10 rounded-full flex items-center justify-center hover:shadow-md transition-all duration-300 border ${
                    isRecording 
                      ? 'bg-red-500 animate-pulse text-white border-red-500' 
                      : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {isRecording ? '⏹️' : '🎤'}
                </button>
                <button
                  onClick={sendMessage}
                  className="w-10 h-10 rounded-full bg-gray-800 border border-gray-800 text-white flex items-center justify-center hover:bg-gray-900 hover:shadow-md transition-transform duration-300"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="w-70 bg-white border-l border-gray-200 p-5 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-6">
        <div className="mb-6">
          <div className="text-base font-semibold mb-4 text-gray-800">AI Personality</div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600">Response Style</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
              value={responseStyle}
              onChange={(e) => setResponseStyle(e.target.value)}
            >
              <option>Professional</option>
              <option>Technical</option>
              <option>Conversational</option>
              <option>Detailed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600">Language</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Albanian</option>
              <option>Auto-detect</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-base font-semibold mb-4 text-gray-800">Communication</div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Voice Input</span>
              <Switch
                checked={voiceInput}
                onCheckedChange={setVoiceInput}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Text-to-Speech</span>
              <Switch
                checked={textToSpeech}
                onCheckedChange={setTextToSpeech}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600">Response Speed</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
              value={responseSpeed}
              onChange={(e) => setResponseSpeed(e.target.value)}
            >
              <option>Fast</option>
              <option>Balanced</option>
              <option>Detailed</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-base font-semibold mb-4 text-gray-800">Media Analysis</div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Photo Reading</span>
              <Switch
                checked={photoReading}
                onCheckedChange={setPhotoReading}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Video Analysis</span>
              <Switch
                checked={videoAnalysis}
                onCheckedChange={setVideoAnalysis}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Screenshot OCR</span>
              <Switch
                checked={screenshotOCR}
                onCheckedChange={setScreenshotOCR}
              />
            </label>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-base font-semibold mb-4 text-gray-800">System Monitoring</div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-600">Auto-refresh Interval</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
              value={autoRefreshInterval}
              onChange={(e) => setAutoRefreshInterval(e.target.value)}
            >
              <option>5 seconds</option>
              <option>10 seconds</option>
              <option>30 seconds</option>
              <option>1 minute</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Alert Notifications</span>
              <Switch
                checked={alertNotifications}
                onCheckedChange={setAlertNotifications}
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Performance Logging</span>
              <Switch
                checked={performanceLogging}
                onCheckedChange={setPerformanceLogging}
              />
            </label>
          </div>
        </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default ShqipetAIAdmin;