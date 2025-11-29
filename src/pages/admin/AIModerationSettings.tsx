import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, Save, Key, Brain, Image, MessageSquare, FileText, CreditCard, Shield, Activity, Eye, EyeOff, Video, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AIModerationSettings = () => {
  // OpenAI Settings
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini');
  
  // Replicate Settings
  const [replicateModel, setReplicateModel] = useState('black-forest-labs/flux-schnell');
  const [replicateApiToken, setReplicateApiToken] = useState('');
  const [numInferenceSteps, setNumInferenceSteps] = useState('20');
  const [guidanceScale, setGuidanceScale] = useState('7');
  const [seed, setSeed] = useState('');
  
  // AI System Toggles
  const [aiImagesSystem, setAiImagesSystem] = useState(true);
  const [aiPostSystem, setAiPostSystem] = useState(true);
  const [aiBlogSystem, setAiBlogSystem] = useState(true);
  const [aiTextCreditSystem, setAiTextCreditSystem] = useState(true);
  const [aiImagesCreditSystem, setAiImagesCreditSystem] = useState(true);
  
  // AI Moderation Settings
  const [moderatePosts, setModeratePosts] = useState(true);
  const [moderateImages, setModerateImages] = useState(true);
  const [moderateVideos, setModerateVideos] = useState(true);
  const [toxicityThreshold, setToxicityThreshold] = useState([0.7]);
  const [contentAction, setContentAction] = useState('queue');
  const [moderationProvider, setModerationProvider] = useState('OpenAI');
  
  // Credit Settings
  const [creditPrice, setCreditPrice] = useState('100');
  const [generatedImagePrice, setGeneratedImagePrice] = useState('10');
  const [generatedWordPrice, setGeneratedWordPrice] = useState('1');
  
  // API Dropdowns
  const [aiImagesApi, setAiImagesApi] = useState('OpenAI');
  const [aiPostsApi, setAiPostsApi] = useState('OpenAI');
  const [aiBlogApi, setAiBlogApi] = useState('OpenAI');

  // Mock usage log data
  const usageLog = [
    {
      id: 1,
      user: 'john@example.com',
      action: 'Generated Image',
      content: 'Sunset landscape with mountains',
      credits: 10,
      status: 'Approved',
      timestamp: '2024-01-20 14:30',
    },
    {
      id: 2,
      user: 'sarah@example.com',
      action: 'Generated Post',
      content: 'AI-written blog about technology trends',
      credits: 5,
      status: 'Under Review',
      timestamp: '2024-01-20 13:15',
    },
    {
      id: 3,
      user: 'mike@example.com',
      action: 'Generated Image',
      content: 'Profile avatar illustration',
      credits: 8,
      status: 'Flagged',
      timestamp: '2024-01-20 12:45',
    },
  ];

  const handleSave = () => {
    toast.success('AI Settings saved successfully!', {
      description: 'All AI moderation and automation settings have been updated.'
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Settings & Moderation</h1>
          <p className="text-gray-600">Configure AI generation, moderation, and usage tracking</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* OpenAI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">
              This secret key is not showing due security reasons, you can still overwrite the current one.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={openaiApiKey}
                onChange={(e) => setOpenaiApiKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="openai-model">OpenAI Text Model</Label>
              <Select value={openaiModel} onValueChange={setOpenaiModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                  <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                  <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Replicate AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Replicate AI Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="replicate-model">Replicate Model</Label>
              <Select value={replicateModel} onValueChange={setReplicateModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black-forest-labs/flux-schnell">black-forest-labs/flux-schnell</SelectItem>
                  <SelectItem value="stability-ai/stable-diffusion">stability-ai/stable-diffusion</SelectItem>
                  <SelectItem value="prompthero/openjourney">prompthero/openjourney</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="replicate-token">Replicate API Token</Label>
              <Input
                id="replicate-token"
                type="password"
                value={replicateApiToken}
                onChange={(e) => setReplicateApiToken(e.target.value)}
                placeholder="Replicate API Token"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inference-steps">num_inference_steps</Label>
              <Input
                id="inference-steps"
                value={numInferenceSteps}
                onChange={(e) => setNumInferenceSteps(e.target.value)}
                placeholder="20"
              />
              <p className="text-xs text-gray-500">Number of denoising steps (minimum: 1, maximum: 500)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guidance-scale">guidance_scale</Label>
              <Input
                id="guidance-scale"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(e.target.value)}
                placeholder="7"
              />
              <p className="text-xs text-gray-500">Scale for classifier-free guidance (minimum: 1, maximum: 20)</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seed">seed</Label>
              <Input
                id="seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="Random seed. Leave blank to randomize the seed"
              />
              <p className="text-xs text-gray-500">Random seed. Leave blank to randomize the seed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Generation Systems */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Generation Systems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Images System */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Image className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">AI Images System</h4>
                <p className="text-sm text-gray-500">Allow AI to generate images.</p>
              </div>
            </div>
            <Switch checked={aiImagesSystem} onCheckedChange={setAiImagesSystem} />
          </div>
          
          {aiImagesSystem && (
            <div className="ml-12 space-y-2">
              <Label>AI Images API</Label>
              <Select value={aiImagesApi} onValueChange={setAiImagesApi}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Replicate">Replicate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* AI Post System */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">AI Post System</h4>
                <p className="text-sm text-gray-500">Allow AI to generate posts.</p>
              </div>
            </div>
            <Switch checked={aiPostSystem} onCheckedChange={setAiPostSystem} />
          </div>
          
          {aiPostSystem && (
            <div className="ml-12 space-y-2">
              <Label>AI Posts API</Label>
              <Select value={aiPostsApi} onValueChange={setAiPostsApi}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Replicate">Replicate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* AI Blog System */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">AI Blog System</h4>
                <p className="text-sm text-gray-500">Allow AI to generate articles.</p>
              </div>
            </div>
            <Switch checked={aiBlogSystem} onCheckedChange={setAiBlogSystem} />
          </div>
          
          {aiBlogSystem && (
            <div className="ml-12 space-y-2">
              <Label>AI Blog API</Label>
              <Select value={aiBlogApi} onValueChange={setAiBlogApi}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Replicate">Replicate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Moderation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            AI Moderation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Moderation Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium">Moderate Posts</h4>
                  <p className="text-sm text-gray-500">AI moderation for text posts and comments</p>
                </div>
              </div>
              <Switch checked={moderatePosts} onCheckedChange={setModeratePosts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Image className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium">Moderate Images</h4>
                  <p className="text-sm text-gray-500">AI moderation for uploaded images</p>
                </div>
              </div>
              <Switch checked={moderateImages} onCheckedChange={setModerateImages} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Video className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-medium">Moderate Videos</h4>
                  <p className="text-sm text-gray-500">AI moderation for uploaded videos</p>
                </div>
              </div>
              <Switch checked={moderateVideos} onCheckedChange={setModerateVideos} />
            </div>
          </div>

          <Separator />

          {/* Toxicity Threshold */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Toxicity Threshold</Label>
              <p className="text-sm text-gray-500 mb-4">
                Content with toxicity score above this threshold will be flagged (0 = very lenient, 1 = very strict)
              </p>
              <div className="px-4">
                <Slider
                  value={toxicityThreshold}
                  onValueChange={setToxicityThreshold}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0.0 (Lenient)</span>
                  <span className="font-medium">Current: {toxicityThreshold[0]}</span>
                  <span>1.0 (Strict)</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Moderation Action Options */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Moderation Action Options</Label>
              <p className="text-sm text-gray-500 mb-4">Configure additional actions when content is flagged</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action for Flagged Content</Label>
                <Select value={contentAction} onValueChange={setContentAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="queue">Queue for Review</SelectItem>
                    <SelectItem value="hide">Auto-Hide Content</SelectItem>
                    <SelectItem value="warn">Warn User Only</SelectItem>
                    <SelectItem value="mute">Mute User Temporarily</SelectItem>
                    <SelectItem value="shadowban">Shadowban Post</SelectItem>
                    <SelectItem value="restrict_comments">Auto-Restrict Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>AI Moderation Provider</Label>
                <Select value={moderationProvider} onValueChange={setModerationProvider}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                    <SelectItem value="Perspective">Google Perspective API</SelectItem>
                    <SelectItem value="Azure">Azure Content Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Comment Intelligence */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Comment Intelligence</Label>
              <p className="text-sm text-gray-500 mb-4">AI-powered comment analysis and moderation</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Comment Tone Analysis</h4>
                    <p className="text-sm text-gray-500">Detect toxic, angry, or off-topic comments</p>
                  </div>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Auto-Moderate Comment Spam</h4>
                    <p className="text-sm text-gray-500">Detect repetitive links, emojis, and spam patterns</p>
                  </div>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Report Types */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Report Types Configuration</Label>
              <p className="text-sm text-gray-500 mb-4">Available report categories for users</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="spam" defaultChecked className="rounded" />
                <label htmlFor="spam" className="text-sm font-medium">Spam</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="harassment" defaultChecked className="rounded" />
                <label htmlFor="harassment" className="text-sm font-medium">Harassment</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="misinformation" defaultChecked className="rounded" />
                <label htmlFor="misinformation" className="text-sm font-medium">Misinformation</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="graphic" defaultChecked className="rounded" />
                <label htmlFor="graphic" className="text-sm font-medium">Graphic Content</label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moderation Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Moderation Action History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">View recent moderation actions by administrators</p>
              <Button variant="outline" size="sm">View Full Log</Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moderator</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm">admin@example.com</td>
                    <td className="px-4 py-3 text-sm">Hide Post</td>
                    <td className="px-4 py-3 text-sm">Spam content detected</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Hidden
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">2024-01-20 15:30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">moderator@example.com</td>
                    <td className="px-4 py-3 text-sm">Warn User</td>
                    <td className="px-4 py-3 text-sm">Inappropriate language</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Warning Sent
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">2024-01-20 14:15</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">admin@example.com</td>
                    <td className="px-4 py-3 text-sm">Approve Post</td>
                    <td className="px-4 py-3 text-sm">Community guideline review</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">2024-01-20 13:45</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Credit Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            AI Credit Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credit-price">Credit Price</Label>
              <Input
                id="credit-price"
                value={creditPrice}
                onChange={(e) => setCreditPrice(e.target.value)}
              />
              <p className="text-xs text-gray-500">Credit Price Ex: $1 = 10 credits</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image-price">Generated Image Price</Label>
              <Input
                id="image-price"
                value={generatedImagePrice}
                onChange={(e) => setGeneratedImagePrice(e.target.value)}
              />
              <p className="text-xs text-gray-500">Credits per generated image</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="word-price">Generated Word Price</Label>
              <Input
                id="word-price"
                value={generatedWordPrice}
                onChange={(e) => setGeneratedWordPrice(e.target.value)}
              />
              <p className="text-xs text-gray-500">Credits per generated word</p>
            </div>
          </div>

          <Separator />

          {/* AI Credit System Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AI Images Credit System</h4>
                <p className="text-sm text-gray-500">Charge credits for AI image generation</p>
              </div>
              <Switch checked={aiImagesCreditSystem} onCheckedChange={setAiImagesCreditSystem} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">AI Text Credit System</h4>
                <p className="text-sm text-gray-500">Charge credits for AI text generation</p>
              </div>
              <Switch checked={aiTextCreditSystem} onCheckedChange={setAiTextCreditSystem} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Usage Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI Usage Log
          </CardTitle>
          <p className="text-sm text-gray-500">Track AI usage, credit consumption, and moderation status</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-left py-3 px-2">Action</th>
                  <th className="text-left py-3 px-2">Content</th>
                  <th className="text-left py-3 px-2">Credits</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {usageLog.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{entry.user}</td>
                    <td className="py-3 px-2">{entry.action}</td>
                    <td className="py-3 px-2 max-w-xs truncate">{entry.content}</td>
                    <td className="py-3 px-2">{entry.credits}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'Approved'
                            ? 'bg-green-100 text-green-800'
                            : entry.status === 'Under Review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {entry.status === 'Approved' && <Eye className="w-3 h-3 mr-1" />}
                        {entry.status === 'Under Review' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {entry.status === 'Flagged' && <EyeOff className="w-3 h-3 mr-1" />}
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">{entry.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Showing 3 of 125 total entries</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModerationSettings;