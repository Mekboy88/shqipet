import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Link, Smartphone, Brain, Share, RotateCcw, BarChart3, Lock, Settings } from 'lucide-react';

const CorePlatformDeepLinking: React.FC = () => {
  const [activeSection, setActiveSection] = useState('format');

  const sections = [
    { id: 'format', label: 'Link Format', icon: Link },
    { id: 'native', label: 'Native App', icon: Smartphone },
    { id: 'routing', label: 'Smart Routing', icon: Brain },
    { id: 'sharing', label: 'QR & Social', icon: Share },
    { id: 'sync', label: 'Real-Time Sync', icon: RotateCcw },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'setup', label: 'Developer Setup', icon: Settings }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'format':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔗 Deep Link Format Strategy</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Inconsistent link formats break user experience, reduce social sharing by 60%, and cause platform fragmentation.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Example URL</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Resolves To</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🌐 Public Page</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">https://shqipet.com/watch/456</td>
                      <td className="border border-gray-300 px-4 py-2">Opens video post #456 in Watch section</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧑‍💼 Profile Link</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">https://shqipet.com/u/andi</td>
                      <td className="border border-gray-300 px-4 py-2">Opens Andi's profile, app auto-loads bio/posts</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">💬 Private Chat</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">https://shqipet.com/chat?thread=xyz123</td>
                      <td className="border border-gray-300 px-4 py-2">Securely opens chat thread, verifies session</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📸 Reels Embed</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">https://shqipet.com/reels/999</td>
                      <td className="border border-gray-300 px-4 py-2">Opens Reel #999 full-screen in-app or web</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🎉 Event Page</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">https://shqipet.com/events/2407</td>
                      <td className="border border-gray-300 px-4 py-2">Shows full event page, buttons active</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">💼 Referral Link</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">https://shqipet.com/register?ref=andi23</td>
                      <td className="border border-gray-300 px-4 py-2">Launches Register page, applies referral tag</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-blue-700">✅ All links work globally across platforms – even if user switches device or opens in browser/mobile app.</p>
              </div>
            </div>
          </div>
        );

      case 'native':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📱 Native App Deep Linking (iOS & Android)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor native app integration leads to broken user flows, reduced app retention, and 40% higher uninstall rates.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 mb-6">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Platform</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tool Used</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🍏 iOS</td>
                      <td className="border border-gray-300 px-4 py-2">Universal Links (apple-app-site-association)</td>
                      <td className="border border-gray-300 px-4 py-2">Seamlessly open in app (or Safari fallback)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🤖 Android</td>
                      <td className="border border-gray-300 px-4 py-2">Android App Links (assetlinks.json)</td>
                      <td className="border border-gray-300 px-4 py-2">Launches native app when link is tapped</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">⚡ Capacitor</td>
                      <td className="border border-gray-300 px-4 py-2">App.addListener('appUrlOpen')</td>
                      <td className="border border-gray-300 px-4 py-2">Captures deep link at launch and routes accordingly</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Example Logic (Capacitor):</h4>
                <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`App.addListener('appUrlOpen', ({ url }) => {
  if (url.includes('/reels/')) navigateTo('/reels/' + idFromURL(url))
  else if (url.includes('/u/')) navigateTo('/user/' + usernameFromURL(url))
})`}
                </pre>
              </div>
            </div>
          </div>
        );

      case 'routing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 Smart Contextual Routing Engine</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Lack of contextual routing creates security vulnerabilities, poor UX for different user types, and broken access control.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-green-500 text-lg">✅</span>
                    <h4 className="font-semibold text-gray-800">Logged-in user</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Opens deep link normally in full view</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-red-500 text-lg">🚫</span>
                    <h4 className="font-semibold text-gray-800">Not logged-in</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Prompts login → then redirects back to original deep link path</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-yellow-500 text-lg">🧑‍🎓</span>
                    <h4 className="font-semibold text-gray-800">Underage user</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Redirects to safe info or blocks access to adult content links</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-orange-500 text-lg">🔐</span>
                    <h4 className="font-semibold text-gray-800">Expired token</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">If link has token (?auth=), checks expiry before proceeding</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-blue-500 text-lg">📱</span>
                    <h4 className="font-semibold text-gray-800">App not installed</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Sends to web fallback (responsive page auto-adjusts)</p>
                </div>
              </div>

              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-700">✅ Supports fallback-to-web or fallback-to-AppStore/PlayStore based on device detection.</p>
              </div>
            </div>
          </div>
        );

      case 'sharing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🎁 QR Code and Social Sharing Integration</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor social sharing integration reduces viral growth by 70% and breaks content discovery across platforms.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🧾</span>
                    <h4 className="font-semibold text-gray-800">QR Codes</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Encodes full deep link — when scanned, routes into app or browser</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">📲</span>
                    <h4 className="font-semibold text-gray-800">WhatsApp</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Auto-unpacks preview card (title + image) + link metadata</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">📣</span>
                    <h4 className="font-semibold text-gray-800">Twitter / X</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Recognizes Open Graph tags and Twitter Cards automatically</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">📧</span>
                    <h4 className="font-semibold text-gray-800">Email / SMS</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">All URLs support UTM tracking and dynamic redirect preview</p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Bonus:</h4>
                <p className="text-sm text-yellow-700">🔖 meta og:url, og:image, og:title, twitter:card etc. ensure platform-specific previews.</p>
              </div>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔄 Real-Time Sync with Supabase</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Broken sync between deep links and database state causes 404 errors, broken user flows, and data inconsistency.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔁 Session-Aware Routing</h4>
                  <p className="text-sm text-gray-600">If Supabase session expires mid-link → auto-restore path post-login</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📦 Dynamic Module Sync</h4>
                  <p className="text-sm text-gray-600">If the user doesn't have module (e.g., Reels disabled) → auto-suggest</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧾 Deep Link Logs</h4>
                  <p className="text-sm text-gray-600">Store all deep link opens in Supabase deep_link_logs for analytics</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚫 Broken Link Fallbacks</h4>
                  <p className="text-sm text-gray-600">Supabase validates existence of ID in path (e.g., post 999 still exists?)</p>
                </div>
              </div>

              <div className="mt-6 bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Example deep link log structure:</h4>
                <pre className="text-green-400 text-sm">
{`-- Table: deep_link_logs
Columns: user_id | link | resolved_path | device_type | opened_at`}
                </pre>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-red-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Deep Link Performance Analytics</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: No analytics means missing viral growth opportunities, poor link optimization, and inability to track ROI on shared content.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Top Linked Modules</h4>
                  <p className="text-sm text-gray-600">Which routes are shared the most (e.g., Watch vs Blog)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📈 Link Open Rate (per module)</h4>
                  <p className="text-sm text-gray-600">% of users that open the deep link and convert (click CTA)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💬 Engagement After Deep Link</h4>
                  <p className="text-sm text-gray-600">Tracks what user did post-click (scroll, like, comment)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📱 Device-Specific Conversion</h4>
                  <p className="text-sm text-gray-600">Web vs iOS vs Android opens and retention post-click</p>
                </div>
              </div>

              <div className="mt-6 bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Use tools like:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span>PostHog for heatmaps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📊</span>
                    <span>Supabase Analytics with RLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔒</span>
                    <span>Privacy-friendly: Plausible / Umami</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔒 Deep Link Security & Anti-Abuse</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Insecure deep links expose private content, enable spam attacks, and create unauthorized access vulnerabilities.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🛡️ Token Validation</h4>
                  <p className="text-sm text-gray-600">If deep link includes tokens (invite, private), validates scope</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔐 Link Obfuscation</h4>
                  <p className="text-sm text-gray-600">Optional Base64 encode route data (e.g., /d/MTIz)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚧 Rate Limiting</h4>
                  <p className="text-sm text-gray-600">Prevents spamming shared deep links (100 opens/hour per IP)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⚠️ Link Expiry Timeouts</h4>
                  <p className="text-sm text-gray-600">For invite-only or private rooms (e.g., 24h expiry)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📍 Abuse Monitoring Logs</h4>
                  <p className="text-sm text-gray-600">Deep link logs are auto-flagged if repetitive bot pattern detected</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'setup':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-teal-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔧 Developer Setup Summary</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Improper setup leads to broken deep links, platform incompatibility, and poor developer experience.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Layer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tool / File</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🍏 Apple Universal Links</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">apple-app-site-association</td>
                      <td className="border border-gray-300 px-4 py-2">Deep linking iOS → app</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🤖 Android App Links</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">assetlinks.json</td>
                      <td className="border border-gray-300 px-4 py-2">Deep linking Android → app</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🌐 Web Metadata</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">&lt;meta og:...&gt; + &lt;link rel="canonical"&gt;</td>
                      <td className="border border-gray-300 px-4 py-2">Social sharing support</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧠 Capacitor + Supabase</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">App.addListener() + session check</td>
                      <td className="border border-gray-300 px-4 py-2">Capture link → verify → redirect</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🗂️ Link Management UI</td>
                      <td className="border border-gray-300 px-4 py-2">Admin panel (link list & stats)</td>
                      <td className="border border-gray-300 px-4 py-2">Track & manage shared deep links</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧾 QR Generator</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">qrcode.react or backend tool</td>
                      <td className="border border-gray-300 px-4 py-2">Create dynamic share QR links</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">🧠 Bonus Super Pro Enhancements:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-teal-800 mb-1">🎯 Audience-Aware Routing</h5>
                    <p className="text-gray-600">Smart link opens different variant based on segment (e.g., region)</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-teal-800 mb-1">🏷️ UTM Tracking + Conversion</h5>
                    <p className="text-gray-600">Built-in conversion tag analysis (e.g., utm_source=chatgpt)</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-teal-800 mb-1">🔀 Smart Invite Links</h5>
                    <p className="text-gray-600">Invite to group/event auto-adds viewer if accepted</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-teal-800 mb-1">📬 Personalized Redirect Paths</h5>
                    <p className="text-gray-600">e.g., /referral/andi → /register?ref=andi&offer=summer25</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Deep Linking System</h1>
          <p className="text-gray-600">World-Class Breakdown - Convert external/shared URLs (on web, mobile, social media, QR codes, SMS) into context-aware, seamless navigation across Shqipet.com (Website + iOS + Android App + Desktop).</p>
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

export default CorePlatformDeepLinking;
