import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Copy, RefreshCw, Wand2, TrendingUp, Heart, MessageCircle, Lightbulb, PenTool, Users, Target, Star, Zap, X } from 'lucide-react';
import { toast } from 'sonner';
import { callChatGPT } from '@/utils/chatgptApi';
interface ShqipetAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertContent: (content: string) => void;
  currentContent: string;
}
interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
interface PostTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  prompt: string;
  category: 'engagement' | 'business' | 'creative' | 'personal';
}
const postTemplates: PostTemplate[] = [{
  id: 'engaging-story',
  name: 'Engaging Story',
  icon: <Heart className="h-4 w-4" />,
  description: 'Create a compelling personal or brand story',
  prompt: 'Write an engaging social media story that connects with the audience emotionally. Include a hook, personal touch, and call-to-action.',
  category: 'engagement'
}, {
  id: 'viral-content',
  name: 'Viral Content',
  icon: <TrendingUp className="h-4 w-4" />,
  description: 'Generate trending, shareable content',
  prompt: 'Create viral-worthy social media content that encourages sharing and engagement. Use current trends and relatable themes.',
  category: 'engagement'
}, {
  id: 'business-update',
  name: 'Business Update',
  icon: <Target className="h-4 w-4" />,
  description: 'Professional business announcements',
  prompt: 'Write a professional business update post that informs followers about company news, achievements, or developments.',
  category: 'business'
}, {
  id: 'tips-advice',
  name: 'Tips & Advice',
  icon: <Lightbulb className="h-4 w-4" />,
  description: 'Share valuable insights and tips',
  prompt: 'Create an informative post sharing valuable tips or advice in your expertise area. Make it actionable and helpful.',
  category: 'business'
}, {
  id: 'creative-post',
  name: 'Creative Content',
  icon: <PenTool className="h-4 w-4" />,
  description: 'Artistic and creative expressions',
  prompt: 'Generate creative social media content that showcases artistic expression, creativity, or unique perspectives.',
  category: 'creative'
}, {
  id: 'question-engagement',
  name: 'Question & Poll',
  icon: <MessageCircle className="h-4 w-4" />,
  description: 'Interactive questions to boost engagement',
  prompt: 'Create an engaging question or poll post that encourages followers to comment and share their opinions.',
  category: 'engagement'
}, {
  id: 'personal-milestone',
  name: 'Personal Milestone',
  icon: <Star className="h-4 w-4" />,
  description: 'Celebrate achievements and milestones',
  prompt: 'Write a celebratory post about a personal or professional milestone, achievement, or special moment.',
  category: 'personal'
}, {
  id: 'community-building',
  name: 'Community Building',
  icon: <Users className="h-4 w-4" />,
  description: 'Build and engage your community',
  prompt: 'Create content that builds community, encourages interaction, and strengthens relationships with your audience.',
  category: 'engagement'
}];
const ShqipetAIAssistant: React.FC<ShqipetAIAssistantProps> = ({
  isOpen,
  onClose,
  onInsertContent,
  currentContent
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'chat'>('templates');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    setIsGenerating(true);
    const userMessage: AIMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    try {
      const context = {
        currentContent: currentContent || '',
        postType: 'social_media_post',
        platform: 'shqipet',
        purpose: 'content_creation'
      };
      const aiResponse = await callChatGPT(message, context);
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response. Please try again.');
      console.error('AI Assistant Error:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  const handleTemplateSelect = async (template: PostTemplate) => {
    setActiveTab('chat');
    const enhancedPrompt = `${template.prompt}\n\nContext: ${currentContent ? `Current content: "${currentContent}"` : 'Creating new post'}. Make it engaging and optimized for social media.`;
    await handleSendMessage(enhancedPrompt);
  };
  const handleImproveContent = async () => {
    if (!currentContent.trim()) {
      toast.error('Please write some content first to improve it.');
      return;
    }
    setActiveTab('chat');
    const improvePrompt = `Please improve and enhance this social media post content to make it more engaging, readable, and likely to get better engagement: "${currentContent}"`;
    await handleSendMessage(improvePrompt);
  };
  const handleCopyToPost = (content: string) => {
    onInsertContent(content);
    toast.success('Content added to your post!');
  };
  const renderTemplates = () => <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500/10 to-gray-800/10 rounded-full mb-3">
          <Sparkles className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Shqipet AI Assistant</h3>
        <p className="text-sm text-muted-foreground">Choose a template or describe what you want to create</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {postTemplates.map(template => <div key={template.id} onClick={() => handleTemplateSelect(template)} className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-gray-800/10 rounded-xl border border-red-200 cursor-pointer transition-all group">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                {template.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">{template.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{template.description}</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {template.category}
                </Badge>
              </div>
            </div>
          </div>)}
      </div>

      {currentContent && <div className="mt-6 pt-4 border-t border-border">
          <Button onClick={handleImproveContent} variant="outline" className="w-full">
            <Wand2 className="h-4 w-4 mr-2" />
            Improve Current Content
          </Button>
        </div>}
    </div>;
  const renderChat = () => <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.length === 0 ? <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Start a conversation with Shqipet AI</p>
            </div> : messages.map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && <div className="flex items-center space-x-2 mt-2">
                      <Button size="sm" variant="ghost" onClick={() => handleCopyToPost(message.content)} className="h-6 px-2 text-xs">
                        <Copy className="h-3 w-3 mr-1" />
                        Use
                      </Button>
                    </div>}
                </div>
              </div>)}
          {isGenerating && <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-red-500" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>;
  return <>
      {isOpen && <>
          <div className="fixed w-[500px] h-[680px] bg-white shadow-2xl border border-gray-200 z-[100] rounded-xl" style={{
        left: 'calc(50% - 860px - 220px)',
        top: '62px',
        animation: 'slideInFromRight 0.3s ease-out'
      }}>
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-black/90 rounded-lg flex items-center justify-center">
                    <span className="bg-gradient-to-br from-red-500 to-red-600 bg-clip-text text-transparent font-bold font-cinzel text-3xl">S</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">Shqipet AI Assistant</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex border-b border-gray-200">
              <Button variant={activeTab === 'templates' ? 'default' : 'ghost'} onClick={() => setActiveTab('templates')} className={`rounded-none border-r border-gray-200 ${activeTab === 'templates' ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-red-50'}`}>
                <Lightbulb className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button variant={activeTab === 'chat' ? 'default' : 'ghost'} onClick={() => setActiveTab('chat')} className={`rounded-none ${activeTab === 'chat' ? 'bg-red-500 text-white hover:bg-red-600' : 'hover:bg-red-50'}`}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
            </div>

            <div className="p-6 h-[calc(100%-180px)] overflow-y-auto">
              {activeTab === 'templates' && renderTemplates()}
              {activeTab === 'chat' && renderChat()}
            </div>

            {/* Fixed input area at bottom - only visible in chat tab */}
            {activeTab === 'chat' && <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                <div className="flex items-center space-x-2">
                  <Textarea value={inputMessage} onChange={e => setInputMessage(e.target.value)} placeholder="Describe what kind of post you want to create..." className="min-h-[40px] max-h-[80px] resize-none" onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }
            }} />
                  <Button onClick={() => handleSendMessage(inputMessage)} disabled={!inputMessage.trim() || isGenerating} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>}
          </div>
        </>}
    </>;
};
export default ShqipetAIAssistant;