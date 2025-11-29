import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Package, Heart, Play, Video, ShoppingCart, Zap, Settings, Users } from 'lucide-react';

const CorePlatformFeatureModules: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview Panel', icon: Package },
    { id: 'dating', label: 'Dating+ Module', icon: Heart },
    { id: 'watch', label: 'Watch Module', icon: Play },
    { id: 'reels', label: 'Reels Module', icon: Video },
    { id: 'marketplace', label: 'Marketplace Module', icon: ShoppingCart },
    { id: 'api-health', label: 'API Health Monitor', icon: Zap },
    { id: 'elite-features', label: 'Elite Features Panel', icon: Settings },
    { id: 'admin-access', label: 'Admin Access & Controls', icon: Users },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Real-Time Dashboard Panel
                </CardTitle>
                <CardDescription>
                  Track, validate, and secure the health and configuration of every feature-based module on your platform with millisecond precision.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Module</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">API Health</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Errors Today</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Uptime %</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Last Deployment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">🧡 Dating+</td>
                        <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅ Live</Badge></td>
                        <td className="border border-gray-300 px-4 py-2">100%</td>
                        <td className="border border-gray-300 px-4 py-2">0</td>
                        <td className="border border-gray-300 px-4 py-2">99.98%</td>
                        <td className="border border-gray-300 px-4 py-2">2025-07-22</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">📺 Watch</td>
                        <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-yellow-600 border-yellow-600">⚠️ Degraded</Badge></td>
                        <td className="border border-gray-300 px-4 py-2">92%</td>
                        <td className="border border-gray-300 px-4 py-2">12</td>
                        <td className="border border-gray-300 px-4 py-2">96.45%</td>
                        <td className="border border-gray-300 px-4 py-2">2025-07-20</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">📱 Reels</td>
                        <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅ Healthy</Badge></td>
                        <td className="border border-gray-300 px-4 py-2">99%</td>
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2">99.99%</td>
                        <td className="border border-gray-300 px-4 py-2">2025-07-24</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">🛍️ Marketplace</td>
                        <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅ Live</Badge></td>
                        <td className="border border-gray-300 px-4 py-2">100%</td>
                        <td className="border border-gray-300 px-4 py-2">0</td>
                        <td className="border border-gray-300 px-4 py-2">100%</td>
                        <td className="border border-gray-300 px-4 py-2">2025-07-24</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">🔌 API Core</td>
                        <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅ Stable</Badge></td>
                        <td className="border border-gray-300 px-4 py-2">100%</td>
                        <td className="border border-gray-300 px-4 py-2">0</td>
                        <td className="border border-gray-300 px-4 py-2">99.99%</td>
                        <td className="border border-gray-300 px-4 py-2">2025-07-24</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm text-blue-800">
                    <strong>CONSEQUENCES:</strong> Each row links to a full diagnostics page for that feature. Real-time monitoring ensures instant detection of module failures, preventing cascading system issues and maintaining user experience quality.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'dating':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  🧡 Dating+ Module (Real-Time Check)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800">💑 Active Sessions</h4>
                    <p className="text-2xl font-bold text-green-600">1,274</p>
                    <p className="text-sm text-green-700">live sessions</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800">💬 Messages Sent (24h)</h4>
                    <p className="text-2xl font-bold text-blue-600">68,905</p>
                    <p className="text-sm text-blue-700">messages today</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800">👤 Match Rate</h4>
                    <p className="text-2xl font-bold text-purple-600">34%</p>
                    <p className="text-sm text-purple-700">success rate</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>📡 API Health:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">✅ 100%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🛡️ Verification Check:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">✅ Face check, video validation, age filter</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🚨 Abuse Rate (Last 7d):</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">0.01%</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Admin Tools:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">Block by IP/Country</Button>
                    <Button variant="outline" className="w-full justify-start">Real-time match visibility override</Button>
                    <Button variant="outline" className="w-full justify-start">Ghost user tracer</Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                  <Info className="h-4 w-4 text-pink-600 flex-shrink-0" />
                  <span className="text-sm text-pink-800">
                    <strong>CONSEQUENCES:</strong> Real-time monitoring of dating interactions ensures user safety, prevents abuse, and maintains high-quality matching experiences. Instant verification checks protect against fraud and fake profiles.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'watch':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  📺 Watch Module (Video Streaming)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800">📥 Total Videos Uploaded</h4>
                    <p className="text-2xl font-bold text-blue-600">543,020</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800">📈 Top Video Bandwidth</h4>
                    <p className="text-2xl font-bold text-green-600">1.3TB/day</p>
                  </div>
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800">🎥 Live Streams Online</h4>
                    <p className="text-2xl font-bold text-purple-600">87</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🎞️ CDN Sync Health:</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">⚠️ Minor lag on edge nodes (UK West)</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🎬 Encoding Queues:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">3 (under 2s delay)</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🔐 DRM Status:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">✅ Enforced</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>👁️ Playback Failures (24h):</span>
                    <Badge variant="outline" className="text-red-600 border-red-600">12 errors flagged</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Admin Panel Includes:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">Stream throttling by region</Button>
                    <Button variant="outline" className="w-full justify-start">Video spam flagging AI</Button>
                    <Button variant="outline" className="w-full justify-start">View logs with token replay trace</Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Info className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="text-sm text-red-800">
                    <strong>CONSEQUENCES:</strong> Video streaming health directly impacts user engagement and retention. CDN issues can cause buffering, poor user experience, and increased churn. Real-time monitoring prevents revenue loss from streaming failures.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'reels':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  📱 Reels Module (Short Video)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="font-semibold text-orange-800">📸 Uploads (Today)</h4>
                    <p className="text-2xl font-bold text-orange-600">7,208</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800">🔥 Trending Sound Usage</h4>
                    <p className="text-2xl font-bold text-red-600">1,290</p>
                    <p className="text-sm text-red-700">reels</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800">⚙️ Processing Time (avg)</h4>
                    <p className="text-2xl font-bold text-blue-600">2.1s</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>📡 Feed API Ping:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">✅ 99.9% stable</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🧠 Smart Tags:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>📛 Reported Content Rate:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">0.04%</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Bonus Features:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">Motion detection for abuse prevention</Button>
                    <Button variant="outline" className="w-full justify-start">Auto-cropping monitor</Button>
                    <Button variant="outline" className="w-full justify-start">Reels-to-Story bridge tracker</Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <Info className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span className="text-sm text-orange-800">
                    <strong>CONSEQUENCES:</strong> Reels are high-engagement content that drives platform growth. Fast processing times ensure viral content spreads quickly, while abuse detection protects platform reputation and user safety.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'marketplace':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  🛍️ Marketplace Module
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800">🛒 Active Listings</h4>
                    <p className="text-2xl font-bold text-green-600">148,402</p>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800">📦 Items Sold (Last 7d)</h4>
                    <p className="text-2xl font-bold text-blue-600">23,110</p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800">📉 Cart Abandonment Rate</h4>
                    <p className="text-2xl font-bold text-red-600">15.2%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">💰 Payment Gateways Status:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Stripe:</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">✅</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>PayPal:</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">✅</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>🔐 Buyer Protection Mode:</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Admin Features:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">Monitor dispute resolution times</Button>
                    <Button variant="outline" className="w-full justify-start">Fake review detector (AI)</Button>
                    <Button variant="outline" className="w-full justify-start">Refund rate tracker</Button>
                    <Button variant="outline" className="w-full justify-start">Fee adjustment tester</Button>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Info className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-800">
                    <strong>CONSEQUENCES:</strong> Marketplace health directly impacts revenue and user trust. Payment gateway failures result in lost sales, while high cart abandonment indicates UX issues that need immediate attention.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'api-health':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  🔌 API Health per Module
                </CardTitle>
                <CardDescription>
                  Real-Time API Monitor Grid - Every module is monitored through comprehensive health checks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Module</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Authenticated Route</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Avg Latency</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Error Rate</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Timeout Retry</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Dating</td>
                        <td className="border border-gray-300 px-4 py-2">/api/dating/match</td>
                        <td className="border border-gray-300 px-4 py-2">134ms</td>
                        <td className="border border-gray-300 px-4 py-2">0.2%</td>
                        <td className="border border-gray-300 px-4 py-2">1 retry max</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Watch</td>
                        <td className="border border-gray-300 px-4 py-2">/api/watch/stream</td>
                        <td className="border border-gray-300 px-4 py-2">212ms</td>
                        <td className="border border-gray-300 px-4 py-2">0.4%</td>
                        <td className="border border-gray-300 px-4 py-2">2 retry max</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Reels</td>
                        <td className="border border-gray-300 px-4 py-2">/api/reels/feed</td>
                        <td className="border border-gray-300 px-4 py-2">97ms</td>
                        <td className="border border-gray-300 px-4 py-2">0.1%</td>
                        <td className="border border-gray-300 px-4 py-2">Auto-resolve</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">Marketplace</td>
                        <td className="border border-gray-300 px-4 py-2">/api/market/data</td>
                        <td className="border border-gray-300 px-4 py-2">85ms</td>
                        <td className="border border-gray-300 px-4 py-2">0%</td>
                        <td className="border border-gray-300 px-4 py-2">🔁 real-time</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">API Core</td>
                        <td className="border border-gray-300 px-4 py-2">/api/token/verify</td>
                        <td className="border border-gray-300 px-4 py-2">62ms</td>
                        <td className="border border-gray-300 px-4 py-2">0%</td>
                        <td className="border border-gray-300 px-4 py-2">🔁 yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Tools Used:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800">Supabase Edge Logs</h5>
                      <p className="text-sm text-blue-700">Real-time API monitoring</p>
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800">Cloudflare CDN Analytics</h5>
                      <p className="text-sm text-green-700">Global performance tracking</p>
                    </div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <h5 className="font-medium text-purple-800">Status Page Monitors</h5>
                      <p className="text-sm text-purple-700">Uptime Kuma / Freshping</p>
                    </div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <h5 className="font-medium text-orange-800">Real-Time SQL Logs</h5>
                      <p className="text-sm text-orange-700">Supabase role validation</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Info className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <span className="text-sm text-yellow-800">
                    <strong>CONSEQUENCES:</strong> API health monitoring prevents cascading failures across modules. High latency or error rates in core APIs can bring down entire platform functionality, making real-time monitoring critical for uptime.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'elite-features':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  🧠 Elite Features Panel (Super Pro Only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Beta Modules Access */}
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">🧪 1. Access to Beta Modules</h4>
                    <p className="text-sm text-purple-700 mb-4">Let Super Pro users opt-in to test and preview experimental modules before public release.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm">🎯 Controlled Rollout</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm">🧪 A/B Test Variants</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm">🔐 Feedback-Linked Access</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-medium text-purple-800">Beta Modules Available:</h5>
                        <ul className="text-sm text-purple-700 space-y-1">
                          <li>• AI Studio 2.0</li>
                          <li>• Smart Monetization Widgets</li>
                          <li>• AR Filter Builder</li>
                          <li>• 3D Profile Skins</li>
                          <li>• Voice Captioning Auto Tool</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Regional Controls */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">🔧 2. Toggle Modules by Region</h4>
                    <p className="text-sm text-blue-700 mb-4">Dynamically activate or deactivate features based on user location or language.</p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-2 py-1 text-left">Region/Country</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Module</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">🇬🇧 UK</td>
                            <td className="border border-gray-300 px-2 py-1">Marketplace</td>
                            <td className="border border-gray-300 px-2 py-1"><Badge variant="outline" className="text-green-600 border-green-600">✅ Enabled</Badge></td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">🇫🇷 France</td>
                            <td className="border border-gray-300 px-2 py-1">Dating+</td>
                            <td className="border border-gray-300 px-2 py-1"><Badge variant="outline" className="text-red-600 border-red-600">❌ Disabled</Badge></td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">🇯🇵 Japan</td>
                            <td className="border border-gray-300 px-2 py-1">Reels</td>
                            <td className="border border-gray-300 px-2 py-1"><Badge variant="outline" className="text-green-600 border-green-600">✅ Enabled</Badge></td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">🌍 Global</td>
                            <td className="border border-gray-300 px-2 py-1">AI Studio</td>
                            <td className="border border-gray-300 px-2 py-1"><Badge variant="outline" className="text-yellow-600 border-yellow-600">✅ Partial</Badge></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* API Limits */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">🎛️ 3. Custom API Limit per Module</h4>
                    <p className="text-sm text-green-700 mb-4">Grant advanced creators or agencies API traffic control for each feature module they use.</p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300 text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-2 py-1 text-left">API Endpoint</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Default Limit</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Super Pro Tier</th>
                            <th className="border border-gray-300 px-2 py-1 text-left">Custom Limit</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">/api/reels/upload</td>
                            <td className="border border-gray-300 px-2 py-1">50/day</td>
                            <td className="border border-gray-300 px-2 py-1">Super Pro</td>
                            <td className="border border-gray-300 px-2 py-1">500/day</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">/api/storefront/sale</td>
                            <td className="border border-gray-300 px-2 py-1">100/day</td>
                            <td className="border border-gray-300 px-2 py-1">Super Pro</td>
                            <td className="border border-gray-300 px-2 py-1">Unlimited</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-2 py-1">/api/ai/generate-post</td>
                            <td className="border border-gray-300 px-2 py-1">25/hour</td>
                            <td className="border border-gray-300 px-2 py-1">Super Pro</td>
                            <td className="border border-gray-300 px-2 py-1">100/hour</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <Info className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm text-purple-800">
                    <strong>CONSEQUENCES:</strong> Elite features generate premium revenue and provide competitive advantages. Beta access creates user loyalty while regional controls ensure compliance with local regulations and cultural preferences.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'admin-access':
        return (
          <div className="space-y-6">
            <Card className="border-l-4 border-l-gray-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  🔁 Placement & Admin Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Access Level</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">View/Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Super Pro</td>
                          <td className="border border-gray-300 px-4 py-2">View and toggle beta + regional modules</td>
                          <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅</Badge></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Admin L2+</td>
                          <td className="border border-gray-300 px-4 py-2">View, edit, set API limits, toggle by region</td>
                          <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅</Badge></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">DevOps Team</td>
                          <td className="border border-gray-300 px-4 py-2">Monitor graphs, alerts, analytics integrations</td>
                          <td className="border border-gray-300 px-4 py-2"><Badge variant="outline" className="text-green-600 border-green-600">✅</Badge></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">⚙️ Page Locations:</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-800">Admin Panel Access</h5>
                        <p className="text-sm text-blue-700">Admin Panel → Pro System → Elite Module Controls</p>
                      </div>
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-800">User Panel Access</h5>
                        <p className="text-sm text-green-700">User Panel → Super Pro Settings → Experimental Tools</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Additional Features:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="font-medium text-yellow-800">📊 4. Feature Heatmaps</h5>
                        <p className="text-sm text-yellow-700">Live tracking and visual mapping of feature usage patterns</p>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-medium text-purple-800">🔁 5. Feature Dependency Graph</h5>
                        <p className="text-sm text-purple-700">AI-generated network diagram showing feature relationships</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <Info className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-gray-800">
                    <strong>CONSEQUENCES:</strong> Proper access control ensures feature security while enabling power users to maximize platform capabilities. Role-based permissions prevent unauthorized changes that could disrupt platform stability.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 Feature Modules – Ultra Super Pro Diagnostics System</h1>
          <p className="text-gray-600">Track, validate, and secure the health and configuration of every feature-based module on your platform with millisecond precision.</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            
            // Define different color schemes for each button
            const colorSchemes = [
              'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
              'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
              'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
              'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
              'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
              'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
              'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
              'bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border-teal-200'
            ];
            
            const activeColorSchemes = [
              'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
              'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
              'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
              'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
              'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
              'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
              'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
              'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300'
            ];

            const colorScheme = colorSchemes[index % colorSchemes.length];
            const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

            return (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "outline"}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 ${
                  activeSection === section.id
                    ? `${activeColorScheme} border-2`
                    : colorScheme
                }`}
              >
                <IconComponent className="h-4 w-4" />
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

export default CorePlatformFeatureModules;