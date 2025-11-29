import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart3, Search, Activity, FileText, DollarSign, Globe, Brain, Settings, Download } from 'lucide-react';

const CorePlatformAnalytics: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'realtime', label: 'Real-Time Tracking', icon: Search },
    { id: 'features', label: 'Feature Stats', icon: Activity },
    { id: 'posts', label: 'Post Analytics', icon: FileText },
    { id: 'monetization', label: 'Monetization', icon: DollarSign },
    { id: 'geographic', label: 'Geographic', icon: Globe },
    { id: 'ai', label: 'AI Insights', icon: Brain },
    { id: 'admin', label: 'Admin Dashboard', icon: Settings },
    { id: 'exports', label: 'Exports & Sharing', icon: Download }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Ultimate Analytics System</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without comprehensive analytics, you're flying blind - losing 40% potential revenue and missing critical user behavior insights that drive growth.</p>
                  <p className="text-gray-600 italic">"Measure what matters, track what converts, visualize what performs."</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Layer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Scope</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">User Group</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧑‍💼 Admin Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Full platform-wide metrics</td>
                      <td className="border border-gray-300 px-4 py-2">Admin-only</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📈 Creator Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Personal content + revenue data</td>
                      <td className="border border-gray-300 px-4 py-2">Super Pro + Medium Pro</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🎯 Module Analytics</td>
                      <td className="border border-gray-300 px-4 py-2">Per-feature module stats</td>
                      <td className="border border-gray-300 px-4 py-2">Admin + DevOps</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧠 AI Engagement Engine</td>
                      <td className="border border-gray-300 px-4 py-2">Real-time recommendation data</td>
                      <td className="border border-gray-300 px-4 py-2">Internal engine</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'realtime':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔍 Real-Time Usage Tracking</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without real-time tracking, you miss critical moments to engage users, optimize performance, and prevent churn in the moment it happens.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">👤 Active Users</h4>
                  <p className="text-sm text-gray-600">Users online now (segmented by region, platform, Pro tier)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⏱️ Session Duration</h4>
                  <p className="text-sm text-gray-600">How long users stay on average (vs bounce rates)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📱 Device + Platform Mix</h4>
                  <p className="text-sm text-gray-600">iOS, Android, Web, Desktop</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧭 Navigation Paths</h4>
                  <p className="text-sm text-gray-600">Which paths users take from homepage → destination</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Integration:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                  <li>Supabase real-time realtime.subscription tracking</li>
                  <li>Edge Function logs</li>
                  <li>last_active + device_id in profiles</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Feature-Specific Stats (Heatmaps & Trends)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without feature-specific analytics, you can't optimize individual modules, leading to poor user experience and wasted development resources.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Feature</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Metrics Tracked</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🛍️ Marketplace</td>
                      <td className="border border-gray-300 px-4 py-2">Views, clicks, conversions, bounce, most sold category</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🎥 Reels</td>
                      <td className="border border-gray-300 px-4 py-2">Views, average watch time, drop-off point, top tags</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📸 Stories</td>
                      <td className="border border-gray-300 px-4 py-2">Skip rate, tap-backs, shares</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">💬 Comments</td>
                      <td className="border border-gray-300 px-4 py-2">Most liked, reply chains, spam flags</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">💼 Pro Modules</td>
                      <td className="border border-gray-300 px-4 py-2">Usage by tier, feature retention, upgrade triggers</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Heatmaps with:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
                  <li>Engagement zones (where people pause/click)</li>
                  <li>Scroll-depth vs content type</li>
                  <li>AI-generated "dead zones" (low performing content)</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🪞 Post Analytics (Per User, Creator, and Global)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor post analytics prevent creators from optimizing content strategy, reducing engagement by 50% and limiting viral potential.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">View Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔍 Individual Post</td>
                      <td className="border border-gray-300 px-4 py-2">Views, likes, shares, saves, engagement rate, CTR</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📚 Post Type View</td>
                      <td className="border border-gray-300 px-4 py-2">Which formats perform best (text, photo, video, etc.)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧠 AI Quality Score</td>
                      <td className="border border-gray-300 px-4 py-2">AI gives 0–100 score based on engagement + structure</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📈 Historical Trend</td>
                      <td className="border border-gray-300 px-4 py-2">See if a post is rising or declining in engagement over time</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✅ View as:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    <li>Chart, graph, heatmap</li>
                    <li>Overlay on post timeline</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✨ Bonus:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    <li>Engagement Forecast (next 24h)</li>
                    <li>Compare to past similar posts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'monetization':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-red-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">💰 Monetization & Sales Analytics</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without monetization analytics, creators miss revenue optimization opportunities, reducing earnings by up to 60% and failing to scale their income.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Area</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🏪 Storefront</td>
                      <td className="border border-gray-300 px-4 py-2">Views → adds → buys → repeat purchases</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📚 Course Access</td>
                      <td className="border border-gray-300 px-4 py-2">Start vs complete rate, drop-off %</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📤 Affiliate Links</td>
                      <td className="border border-gray-300 px-4 py-2">Clicks, conversions, top earners</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🪙 Tips & Donations</td>
                      <td className="border border-gray-300 px-4 py-2">Who donated, trends, loyal patrons</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🎁 Boost Token ROI</td>
                      <td className="border border-gray-300 px-4 py-2">How many views per token used? Conversion impact?</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Super Pro users can:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>Export reports</li>
                  <li>Connect Stripe for deep transaction stats</li>
                  <li>Track revenue vs content type</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'geographic':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🌐 Geographic & Demographic Breakdown</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Missing geographic insights prevents targeted content strategy, reduces local engagement, and limits market expansion opportunities.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🌍 Geo Heatmap</h4>
                  <p className="text-sm text-gray-600">Albania, UK, Germany, diaspora insights</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧑 Age Stats</h4>
                  <p className="text-sm text-gray-600">Age 16–24: 45% // Age 25–34: 32%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧑‍🤝‍🧑 Gender Split</h4>
                  <p className="text-sm text-gray-600">Male 52%, Female 47%, Other 1%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📱 Platform</h4>
                  <p className="text-sm text-gray-600">iOS 40%, Android 55%, Web 5%</p>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Used for:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-indigo-700">
                  <li>Creator targeting</li>
                  <li>Feature placement optimization</li>
                  <li>Pro tier targeting suggestions</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 AI-Enhanced Analytics Insights</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without AI insights, you miss predictive opportunities, fail to optimize content timing, and can't provide personalized recommendations that boost engagement.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Viral Score Engine</h4>
                  <p className="text-sm text-gray-600">AI predicts likelihood a post will go viral</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⏱️ Best Time to Post</h4>
                  <p className="text-sm text-gray-600">Based on past user engagement + timezone</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧩 Content Clustering</h4>
                  <p className="text-sm text-gray-600">Groups content by category & performance</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📌 Personalized Dashboard</h4>
                  <p className="text-sm text-gray-600">"What You Should Post Next" suggestions</p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ AI works on:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                  <li>Engagement history</li>
                  <li>Creator type (informative, entertaining, professional)</li>
                  <li>Audience pattern learning</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-teal-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧑‍💼 Admin Dashboard — Security + Usage</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Inadequate admin analytics blind you to security threats, performance issues, and system failures that can cause complete platform downtime.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Module</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Metrics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🛡️ Login & Session Stats</td>
                      <td className="border border-gray-300 px-4 py-2">Avg session duration, failed logins, device swaps</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧪 Feature Health</td>
                      <td className="border border-gray-300 px-4 py-2">Reels load time, Dating module crash logs</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📦 API Consumption</td>
                      <td className="border border-gray-300 px-4 py-2">By user type, per minute, errors</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🎯 Upgrade Triggers</td>
                      <td className="border border-gray-300 px-4 py-2">Pages that led to Pro conversions</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📊 Uptime + SLA Tracking</td>
                      <td className="border border-gray-300 px-4 py-2">Avg uptime, downtime alerts, realtime alerts (email/SMS/Discord)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">💬 Bonus Tools:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-teal-700">
                  <li>Send alerts when a feature drops below threshold</li>
                  <li>Auto-rollbacks for unstable feature usage spikes</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'exports':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-pink-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📥 Exports, Embeds, and Sharing</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without export capabilities, users can't share insights, make data-driven decisions, or provide transparency to stakeholders and investors.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tool</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Functionality</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📄 PDF/CSV Export</td>
                      <td className="border border-gray-300 px-4 py-2">Creators can download post or revenue reports</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧬 Embed Charts</td>
                      <td className="border border-gray-300 px-4 py-2">Show analytics on external blogs or pages</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔗 Share Reports</td>
                      <td className="border border-gray-300 px-4 py-2">Admins can generate private links for financial/investor analytics</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-pink-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">📊 Tech Stack for Real-Time Analytics:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>🧠</span>
                    <span>Supabase Edge Functions + RLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📡</span>
                    <span>PostHog or Plausible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>Firebase or Stream</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💹</span>
                    <span>Chart.js + D3.js</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🌍</span>
                    <span>GeoLite2 DB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ultimate Analytics System</h1>
          <p className="text-gray-600">Comprehensive platform analytics with real-time tracking, AI insights, and advanced reporting capabilities.</p>
        </div>

        {/* Section Navigation */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-wrap gap-3">
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
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border shadow-md hover:shadow-lg hover:scale-105 ${
                    activeSection === section.id
                      ? `${activeColorScheme} border-2`
                      : colorScheme
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {renderContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CorePlatformAnalytics;