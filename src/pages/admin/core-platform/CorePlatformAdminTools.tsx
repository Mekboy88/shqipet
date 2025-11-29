import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Settings, Users, DollarSign, Brain, MessageSquare, Crown, Shield, BarChart3 } from 'lucide-react';

const CorePlatformAdminTools: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'System Overview', icon: Settings },
    { id: 'modules', label: 'Admin Panel Modules', icon: Users },
    { id: 'filters', label: 'Filters & Search Intelligence', icon: BarChart3 },
    { id: 'financial', label: 'Financial Modules', icon: DollarSign },
    { id: 'ai-abuse', label: 'AI & Abuse Detection', icon: Brain },
    { id: 'communication', label: 'Communication Center', icon: MessageSquare },
    { id: 'super-pro', label: 'Super Pro Controls', icon: Crown },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'dashboard', label: 'Global Dashboard Layout', icon: BarChart3 }
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
                <CardTitle className="text-blue-800">CONSEQUENCES: System Overview Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                Centralizes all platform management capabilities with role-based access control and real-time Supabase synchronization for seamless admin operations.
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    🔍 Admin Panel Core UI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Central place to manage all platform features</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Unified Dashboard</div>
                      <div className="text-sm text-gray-600">Single interface for all administrative tasks</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Real-time Updates</div>
                      <div className="text-sm text-gray-600">Live data synchronization across all modules</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    🧑‍💼 Role-Based Access
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Super Admin, Content Admin, Finance Admin, Tech Admin</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Granular Permissions</div>
                      <div className="text-sm text-gray-600">Fine-tuned access control per admin role</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Secure Authentication</div>
                      <div className="text-sm text-gray-600">Multi-factor authentication for admin access</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    🔃 Real-Time Supabase Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Every panel action updates instantly across the system</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Live Data Streams</div>
                      <div className="text-sm text-gray-600">Real-time database listeners and updates</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Instant Propagation</div>
                      <div className="text-sm text-gray-600">Changes reflect immediately across all interfaces</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    🧠 AI Integration Ready
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">For content detection, abuse flagging, and data patterns</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Smart Analytics</div>
                      <div className="text-sm text-gray-600">AI-powered insights and pattern recognition</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">Automated Moderation</div>
                      <div className="text-sm text-gray-600">Intelligent content filtering and abuse detection</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500 bg-green-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Info className="h-4 w-4 text-green-600" />
                </div>
                <CardTitle className="text-green-800">CONSEQUENCES: Admin Panel Modules Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                Provides comprehensive user management, billing oversight, and feature control with real-time monitoring and live database synchronization.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    💼 Pro System Manager
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">📋 View All Users by Tier</div>
                        <div className="text-sm text-gray-600">Free, Low Pro, Medium Pro, Super Pro</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">🔁 Upgrade/Downgrade Users</div>
                        <div className="text-sm text-gray-600">Manual override for testing or reward</div>
                      </div>
                      <div className="p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                        <div className="font-medium">🧮 Billing History Logs</div>
                        <div className="text-sm text-gray-600">See exact payments, retries, refunds</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="font-medium">🧾 Trial Expiry Monitor</div>
                        <div className="text-sm text-gray-600">Shows users nearing end of free trials</div>
                      </div>
                      <div className="p-3 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                        <div className="font-medium">🎁 Reward System</div>
                        <div className="text-sm text-gray-600">Grant bonus boost tokens, credits, loyalty points</div>
                      </div>
                      <div className="p-3 bg-teal-50 rounded-lg border-l-4 border-teal-400">
                        <div className="font-medium">🧩 Module Access Toggle</div>
                        <div className="text-sm text-gray-600">Enable/disable modules for specific Pro levels</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    🧑‍🎤 User Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-3">
                      <div className="p-3 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                        <div className="font-medium">🧑 Full User Table</div>
                        <div className="text-sm text-gray-600">Filter by email, ID, role, join date</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
                        <div className="font-medium">📊 Behavior Insights</div>
                        <div className="text-sm text-gray-600">Posts per week, login streaks, storage used</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <div className="font-medium">🔒 Lock/Unlock Accounts</div>
                        <div className="text-sm text-gray-600">Temporarily restrict if flagged</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                        <div className="font-medium">🎯 Apply Role & Pro Status</div>
                        <div className="text-sm text-gray-600">Upgrade to Super Pro, assign mod role</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-violet-50 rounded-lg border-l-4 border-violet-400">
                        <div className="font-medium">🧾 Download User CSV</div>
                        <div className="text-sm text-gray-600">Export by filters (Pro only, high usage, inactive)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-purple-500 bg-purple-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Info className="h-4 w-4 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">CONSEQUENCES: Filters & Search Intelligence Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-purple-700">
                Enables sophisticated data querying with AI-powered suggestions and natural language processing for efficient admin operations.
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    🔍 Deep Multi-Field Filtering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">"All Medium Pro users who haven't logged in for 30 days"</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium">Complex Query Builder</div>
                      <div className="text-sm text-gray-600">Combine multiple criteria with AND/OR logic</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium">Real-time Results</div>
                      <div className="text-sm text-gray-600">Instant filtering with live data updates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    🎯 AI Query Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">"Show me all Super Pro users who used boost tokens this week"</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium">Smart Autocomplete</div>
                      <div className="text-sm text-gray-600">AI-powered query suggestions and completion</div>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <div className="font-medium">Natural Language</div>
                      <div className="text-sm text-gray-600">Convert plain English to complex database queries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    📊 Saved Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Preset filters: "High Risk," "Top Earners," "New Pro Trials"</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium">Quick Access</div>
                      <div className="text-sm text-gray-600">One-click access to frequently used filters</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="font-medium">Custom Templates</div>
                      <div className="text-sm text-gray-600">Create and share filter templates across team</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    💾 Snapshot Save
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Save filters as reports (weekly usage, revenue growth)</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-cyan-50 rounded-lg">
                      <div className="font-medium">Report Generation</div>
                      <div className="text-sm text-gray-600">Convert filtered data into scheduled reports</div>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <div className="font-medium">Historical Tracking</div>
                      <div className="text-sm text-gray-600">Compare data snapshots over time periods</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Info className="h-4 w-4 text-yellow-600" />
                </div>
                <CardTitle className="text-yellow-800">CONSEQUENCES: Financial Modules Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-yellow-700">
                Provides comprehensive financial oversight with real-time payment tracking, revenue analytics, and Stripe/PayPal integration monitoring.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    💰 Financial Control Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium">💳 Stripe/PayPal Tracker</div>
                      <div className="text-sm text-gray-600 mt-2">View active subscriptions, expired trials, refunds</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium">📈 Revenue Per Tier</div>
                      <div className="text-sm text-gray-600 mt-2">Monthly & Lifetime Revenue by plan</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-medium">🧾 Earnings Breakdown</div>
                      <div className="text-sm text-gray-600 mt-2">Boost purchases, Pro upgrades, Courses, Tips, Merch</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-medium">🎯 Revenue Goal Progress</div>
                      <div className="text-sm text-gray-600 mt-2">Track % progress toward admin-set financial targets</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                      <div className="font-medium">📊 LTV vs CAC Analysis</div>
                      <div className="text-sm text-gray-600 mt-2">Compare Lifetime Value vs. Acquisition Cost</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'ai-abuse':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-500 bg-red-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <Info className="h-4 w-4 text-red-600" />
                </div>
                <CardTitle className="text-red-800">CONSEQUENCES: AI & Abuse Detection Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-red-700">
                Implements intelligent content monitoring with automated abuse detection, spam prevention, and comprehensive risk assessment for platform safety.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    🧠 AI Detection Systems
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <div className="font-medium">🧠 Pro Feature Usage AI</div>
                        <div className="text-sm text-gray-600">Auto-warns if a user abuses boosts, uploads, or reposts</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <div className="font-medium">🕵️ Spam Detection Layer</div>
                        <div className="text-sm text-gray-600">Blocks repeating content or duplicate text (X-style spam)</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">🧱 Post Cloning Detection</div>
                        <div className="text-sm text-gray-600">Flags if a video/post/image matches another user's</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">🧪 AI Prediction Layer</div>
                        <div className="text-sm text-gray-600">Suggests users likely to churn or upgrade soon</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium">🧾 Risk Report Generator</div>
                        <div className="text-sm text-gray-600">For each flagged user, create detailed logs and severity rating</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500 bg-indigo-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-full">
                  <Info className="h-4 w-4 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-800">CONSEQUENCES: Communication Center Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-indigo-700">
                Enables targeted messaging campaigns with AI personalization, scheduling capabilities, and comprehensive analytics tracking.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    📣 Communication Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="p-3 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                        <div className="font-medium">📧 Targeted Email Blasts</div>
                        <div className="text-sm text-gray-600">"Only to Medium Pro users who posted 10+ times"</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                        <div className="font-medium">🔔 In-App Admin Alerts</div>
                        <div className="text-sm text-gray-600">Add alert box in dashboard for urgent platform news</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                        <div className="font-medium">🧠 AI-Personalized Messages</div>
                        <div className="text-sm text-gray-600">Customize copy based on user data (optional)</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <div className="font-medium">📬 Scheduled Campaigns</div>
                        <div className="text-sm text-gray-600">"Send upgrade offer after 7-day trial ends"</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <div className="font-medium">🧾 Message Analytics</div>
                        <div className="text-sm text-gray-600">Open/click rate, bounce tracking</div>
                      </div>
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
                <CardTitle className="text-pink-800">CONSEQUENCES: Super Pro Controls Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-pink-700">
                Provides exclusive management tools for Super Pro tier users including training monitoring, content vault metrics, and advanced feature rollout controls.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    🧱 Super Pro-Specific Controls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="font-medium">🎓 Training Progress Monitor</div>
                      <div className="text-sm text-gray-600 mt-2">Track badges & certification earned by Super Pro creators</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium">📦 Content Vault Metrics</div>
                      <div className="text-sm text-gray-600 mt-2">Storage used, backups, last restore</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium">📈 Heatmap Click Tracker</div>
                      <div className="text-sm text-gray-600 mt-2">Where users clicked most on pricing page</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-medium">💳 Revenue Sharing Split Editor</div>
                      <div className="text-sm text-gray-600 mt-2">Adjust payout % per user or tier</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                      <div className="font-medium">🔌 API Key Manager</div>
                      <div className="text-sm text-gray-600 mt-2">Manage issued keys, throttle abuse</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                      <div className="font-medium">🧩 Feature Rollout Phases</div>
                      <div className="text-sm text-gray-600 mt-2">Roll features to 5%, 25%, 100% of Super Pro base</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-full">
                  <Info className="h-4 w-4 text-emerald-600" />
                </div>
                <CardTitle className="text-emerald-800">CONSEQUENCES: Security & Access Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-emerald-700">
                Implements comprehensive security measures with multi-factor authentication, role-based permissions, and advanced intrusion detection systems.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    🔒 Security & Access Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-medium">🔐 2FA for Admins</div>
                      <div className="text-sm text-gray-600 mt-2">Protect access to Admin Tools</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium">🧍 Admin Role Permissions</div>
                      <div className="text-sm text-gray-600 mt-2">Fine-grained control: Content-only, Logs-only, Financial-only</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium">🧠 Admin Session Monitor</div>
                      <div className="text-sm text-gray-600 mt-2">View active admin sessions + device/browser/IP</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-medium">📊 Access Logs Export</div>
                      <div className="text-sm text-gray-600 mt-2">Full log of all admin logins, edits, flags</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-medium">🚨 Intrusion Detection Logs</div>
                      <div className="text-sm text-gray-600 mt-2">View alerts if unauthorized changes happen</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-400">
                      <div className="font-medium">🛡️ Version Control & Backup</div>
                      <div className="text-sm text-gray-600 mt-2">Rollback settings/changes made in last 30 days</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-teal-500 bg-teal-50/50">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-full">
                  <Info className="h-4 w-4 text-teal-600" />
                </div>
                <CardTitle className="text-teal-800">CONSEQUENCES: Global Dashboard Layout Implementation</CardTitle>
              </CardHeader>
              <CardContent className="text-teal-700">
                Creates a comprehensive overview interface with real-time metrics, modular system status, and centralized configuration management.
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    🌍 Global Admin Dashboard Layout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="font-medium">🏠 Admin Home Overview</div>
                      <div className="text-sm text-gray-600 mt-2">Snapshot: active users, revenue, flagged users</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-medium">📦 Feature Modules Overview</div>
                      <div className="text-sm text-gray-600 mt-2">Status of each major system module</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-medium">🧠 AI & Flagged Users</div>
                      <div className="text-sm text-gray-600 mt-2">AI-detected abuse + review queue</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                      <div className="font-medium">📊 Analytics Center</div>
                      <div className="text-sm text-gray-600 mt-2">Usage stats per region/device/time</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="font-medium">🎁 Rewards Manager</div>
                      <div className="text-sm text-gray-600 mt-2">Loyalty, unlockables, tokens</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                      <div className="font-medium">👥 Tier Manager</div>
                      <div className="text-sm text-gray-600 mt-2">View & change user Pro levels</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <div className="font-medium">🧰 System Configuration</div>
                      <div className="text-sm text-gray-600 mt-2">Platform settings (API keys, server settings, themes)</div>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            🧑‍💼 Admin Tools System
          </h1>
          <p className="text-lg text-muted-foreground">
            "The Central Command Core of Your Entire Platform."
          </p>
          <p className="text-sm text-muted-foreground max-w-4xl mx-auto">
            Designed for elite admin teams to manage Pro tiers, content, revenue, moderation, analytics, rewards, and system security — all real-time, filterable, and scalable.
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
              'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
              'bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border-teal-200',
              'bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200'
            ];
            
            const activeColorSchemes = [
              'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
              'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
              'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
              'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
              'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
              'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
              'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
              'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300',
              'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300'
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

export default CorePlatformAdminTools;