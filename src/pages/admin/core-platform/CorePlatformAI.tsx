import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Brain, Globe, BookOpen, Activity, Crown, Settings } from 'lucide-react';

const CorePlatformAI: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'AI Systems Overview', icon: Brain },
    { id: 'post-suggestion', label: 'Post Suggestion Engine', icon: Brain },
    { id: 'translation', label: 'Auto-Translation Engine', icon: Globe },
    { id: 'digest', label: 'Digest Summary Engine', icon: BookOpen },
    { id: 'health', label: 'AI Load Health & Smart Limit', icon: Activity },
    { id: 'super-pro', label: 'AI Extras for Super Pro', icon: Crown },
    { id: 'admin-control', label: 'Admin Control Panel', icon: Settings }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">CONSEQUENCES: AI Systems Overview Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                Implements a comprehensive AI engine that is predictive, personal, and strategic for Super Pro and Admin layers with real-time content optimization.
              </CardContent>
            </Card>

            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🧠 AI Feature Systems Overview
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                The AI engine at the core of Shqipet.com (for Super Pro and Admin layers) is not just reactive — it is predictive, personal, and strategic.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-l-4 border-l-purple-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Brain className="h-5 w-5" />
                    🚀 Speed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Suggest faster than typing with real-time contextual AI assistance</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Brain className="h-5 w-5" />
                    🎯 Precision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Target right audience & language with intelligent optimization</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Brain className="h-5 w-5" />
                    📈 Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Data-based strategy for creators with predictive analytics</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Brain className="h-5 w-5" />
                    💬 Fluency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Smooth content across borders with intelligent translation</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <Brain className="h-5 w-5" />
                    🛡️ Resilience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Never breaks or overloads with smart failover systems</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-indigo-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-indigo-700">
                    <Brain className="h-5 w-5" />
                    🧠 Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Fine-tuned models based on Super Pro behavior and metrics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'post-suggestion':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Info className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">CONSEQUENCES: AI Post Suggestion Engine Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-700">
                Provides real-time contextual suggestions, engagement prediction, and smart content optimization for enhanced user productivity and content quality.
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">🧬 AI Post Suggestion Engine</h2>
              <p className="text-lg text-muted-foreground">"Help me write better, faster, and smarter."</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Suggestion Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">✍️ Contextual Suggestions</div>
                        <div className="text-sm text-gray-600 mt-2">When a user starts typing, AI suggests full sentences based on tone, mood, and topic (in real-time).</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium">📊 Engagement Prediction</div>
                        <div className="text-sm text-gray-600 mt-2">Before publishing, the AI shows predicted engagement score (likes, shares, saves).</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">💡 Smart Caption Generator</div>
                        <div className="text-sm text-gray-600 mt-2">Based on image/video context, location, or audience. Can generate in multiple styles (serious, funny, poetic, news-style).</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="font-medium">🏷️ Hashtag Smart Picker</div>
                        <div className="text-sm text-gray-600 mt-2">Chooses relevant trending hashtags per region, interest, and user history.</div>
                      </div>
                      <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                        <div className="font-medium">🔁 Post Rewrite Options</div>
                        <div className="text-sm text-gray-600 mt-2">AI gives 2–3 tone variants of your draft: ✨ Casual • 📢 Promotional • 🎓 Educational.</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Powered by fine-tuned models based on Super Pro behavior & top-performing post metrics.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500 bg-green-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Info className="h-4 w-4 text-green-600" />
                </div>
                <CardTitle className="text-green-800">CONSEQUENCES: Auto-Translation Engine Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                Enables real-time multilingual content delivery with cultural adaptation and voice synchronization for global audience reach.
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">🌍 Auto-Translation Engine (AI Localization)</h2>
              <p className="text-lg text-muted-foreground">"Your posts. Every language. Instantly."</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Translation Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">🌐 Instant Post Translation</div>
                        <div className="text-sm text-gray-600 mt-2">All public posts are translated in real-time into the viewer's preferred language (if different from author's).</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">🎭 Tone & Cultural Adaptation</div>
                        <div className="text-sm text-gray-600 mt-2">Text, emojis, and idioms adjusted to local norms — not just language translation.</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium">🧠 Audience Language Mapping</div>
                        <div className="text-sm text-gray-600 mt-2">Learns top languages of user's followers to pre-fill language settings.</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="font-medium">🎤 Voice & Subtitle Sync</div>
                        <div className="text-sm text-gray-600 mt-2">For videos: generates voice-over or subtitle tracks in multiple languages.</div>
                      </div>
                      <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                        <div className="font-medium">🔄 Region-Based Auto-Post Cloning</div>
                        <div className="text-sm text-gray-600 mt-2">Replicates the post per language and optimizes per timezone.</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Optional toggle: "Auto-Translate for Engagement" (boosts reach).</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'digest':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Info className="h-4 w-4 text-orange-600" />
                </div>
                <CardTitle className="text-orange-800">CONSEQUENCES: Digest Summary Engine Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-orange-700">
                Delivers intelligent performance analytics with actionable insights and multi-channel digest delivery for informed content strategy decisions.
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">📬 Digest Summary Engine (AI Weekly Digest)</h2>
              <p className="text-lg text-muted-foreground">"Tell me how I did this week. In a way I can understand and act on."</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Digest Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">📊 Weekly Performance Digest</div>
                        <div className="text-sm text-gray-600 mt-2">Sends a breakdown of user's best content, trends, followers gained, and actions to take next.</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium">🚀 What Worked Report</div>
                        <div className="text-sm text-gray-600 mt-2">Explains why specific posts did well: format, time, tone, topic, or visual.</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">🔍 Audience Shift Insights</div>
                        <div className="text-sm text-gray-600 mt-2">Detects new segments: "You've gained 12 crypto-focused followers" or "2x increase in global reach."</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="font-medium">🧭 Next Week Forecast</div>
                        <div className="text-sm text-gray-600 mt-2">AI suggests focus topics and timing based on current trends and past results.</div>
                      </div>
                      <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                        <div className="font-medium">📤 Multichannel Format</div>
                        <div className="text-sm text-gray-600 mt-2">Digest sent via in-app card, downloadable PDF, email, and SMS.</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Option: Creator can choose daily, weekly, or monthly summaries.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-500 bg-red-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Info className="h-4 w-4 text-red-600" />
                </div>
                <CardTitle className="text-red-800">CONSEQUENCES: AI Load Health & Smart Limit System Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-red-700">
                Ensures system stability with intelligent load balancing, request optimization, and comprehensive monitoring to prevent crashes and maintain performance.
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">🧪 AI Load Health & Smart Limit System</h2>
              <p className="text-lg text-muted-foreground">"Never crash. Always adapt. Monitor AI system health in real time."</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Health & Monitoring Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">📉 Usage Load Balancer</div>
                        <div className="text-sm text-gray-600 mt-2">Smartly queues non-urgent AI actions during high CPU/DB usage (e.g. post suggestions wait if video is being processed).</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium">🧠 AI Request Optimizer</div>
                        <div className="text-sm text-gray-600 mt-2">Uses Supabase metadata + frontend telemetry to delay/suspend AI actions when connection is weak or edge function errors are seen.</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">🔐 Rate Guard Logic</div>
                        <div className="text-sm text-gray-600 mt-2">Detects spammy users calling AI APIs too often and automatically limits them (with soft cooldown warnings).</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="font-medium">🩺 Health Dashboard (Admin)</div>
                        <div className="text-sm text-gray-600 mt-2">Admin sees all AI usage metrics: spike warnings, error rates, fallback triggers, retry success rate.</div>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <div className="font-medium">⚠️ Failover System</div>
                        <div className="text-sm text-gray-600 mt-2">If AI fails, it gracefully shows the last good response or simplified UX fallback (e.g. default caption box).</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Optional: Admin panel receives alerts if AI usage is high or models return &gt;5% error rate.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'super-pro':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-pink-500 bg-pink-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-full">
                  <Info className="h-4 w-4 text-pink-600" />
                </div>
                <CardTitle className="text-pink-800">CONSEQUENCES: AI Extras for Super Pro Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-pink-700">
                Provides exclusive AI-powered tools for Super Pro users including advanced scheduling, course creation, and audience targeting capabilities.
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">🧠 Optional AI Extras for Super Pro Users</h2>
              <p className="text-lg text-muted-foreground">Exclusive AI features for premium tier subscribers</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Super Pro AI Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium">📅 AI-Powered Scheduler</div>
                      <div className="text-sm text-gray-600 mt-2">Suggests exact day/time to post based on follower activity and timezone.</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium">📋 AI-Powered Course Creator</div>
                      <div className="text-sm text-gray-600 mt-2">Turns post ideas + bullet points into a fully structured, monetizable course with sections.</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-medium">🎯 AI Audience Targeting Engine</div>
                      <div className="text-sm text-gray-600 mt-2">Suggests which follower groups (crypto, design, teachers, etc.) a post fits best.</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-medium">🧩 Prompt Templates</div>
                      <div className="text-sm text-gray-600 mt-2">For faster post generation: "Make it inspiring," "Make it a story," "Make it a question," etc.</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                      <div className="font-medium">📤 AI Uploader for Videos</div>
                      <div className="text-sm text-gray-600 mt-2">Suggests best title, description, and hashtags for video uploads — auto-fills based on content.</div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">All features come with clear fallback modes, tooltips for beginners, and developer metrics for usage.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'admin-control':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Info className="h-4 w-4 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-800">CONSEQUENCES: Admin Control Panel Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-indigo-700">
                Provides comprehensive AI system management with usage monitoring, feature controls, and model version management for administrative oversight.
              </CardContent>
            </Card>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">🔐 Admin Control Panel — AI Systems</h2>
              <p className="text-lg text-muted-foreground">Complete administrative control over AI features and monitoring</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin AI Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium">📊 AI Usage Stats Panel</div>
                      <div className="text-sm text-gray-600 mt-2">See per-user and total AI requests, completions, and errors</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium">📈 Trend Prediction Tester</div>
                      <div className="text-sm text-gray-600 mt-2">Try the forecast engine manually before releasing</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-medium">🔧 Feature Toggle Manager</div>
                      <div className="text-sm text-gray-600 mt-2">Turn off certain AI features for region, Pro level, or abuse cases</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-medium">📜 Rate Limit Policy Editor</div>
                      <div className="text-sm text-gray-600 mt-2">Adjust thresholds for users, guests, or bots</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-medium">⚠️ AI Debug View</div>
                      <div className="text-sm text-gray-600 mt-2">View token usage, logs, and model confidence level for each AI request</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                      <div className="font-medium">🤖 Model Version Manager</div>
                      <div className="text-sm text-gray-600 mt-2">Swap or update the model version without redeploying the frontend</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🧠 AI Feature Systems
          </h1>
          <p className="text-lg text-muted-foreground">
            Predictive, Personal, and Strategic AI Engine
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-3 justify-center">
          {sections.map((section, index) => {
            const Icon = section.icon;
            
            // Define different color schemes for each button
            const colorSchemes = [
              'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
              'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
              'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
              'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
              'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
              'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
              'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200'
            ];
            
            const activeColorSchemes = [
              'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
              'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
              'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
              'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
              'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
              'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
              'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300'
            ];

            const colorScheme = colorSchemes[index % colorSchemes.length];
            const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 ${
                  activeSection === section.id
                    ? `${activeColorScheme} border-2`
                    : colorScheme
                }`}
              >
                <Icon className="h-4 w-4" />
                {section.label}
              </Button>
            );
          })}
        </div>

        {/* Content */}
        {renderSection()}
      </div>
    </AdminLayout>
  );
};

export default CorePlatformAI;