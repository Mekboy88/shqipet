import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const CorePlatformNavigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('sidebar');

  const sections = [
    { id: 'sidebar', label: '🧭 Smart Sidebar', icon: '🧭' },
    { id: 'protection', label: '🔐 Protection Layer', icon: '🔐' },
    { id: 'redirects', label: '🚀 Redirect Engine', icon: '🚀' },
    { id: 'detection', label: '❌ Dead Route Detection', icon: '❌' },
    { id: 'deeplinking', label: '📎 Deep Linking', icon: '📎' },
    { id: 'sync', label: '🔁 Real-Time Sync', icon: '🔁' }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'sidebar':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧭 Smart Sidebar Navigation System</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor sidebar UX leads to 40% reduced user engagement and increased bounce rates on complex platforms.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧩 Dynamic Module Injection</h4>
                  <p className="text-sm text-gray-600">Only loads sidebar items based on user roles (Admin, Pro, Guest)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Context-Aware Menus</h4>
                  <p className="text-sm text-gray-600">Highlights current section, adjusts labels/icons based on device</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🪄 Smooth Animated Transitions</h4>
                  <p className="text-sm text-gray-600">Uses Framer Motion or SwiftUI/Jetpack animation for sidebar reveal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧪 Sticky Mini-State</h4>
                  <p className="text-sm text-gray-600">Sidebar collapses to icons on mobile or scroll, auto-expands on hover</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📌 Pinned Sections</h4>
                  <p className="text-sm text-gray-600">Let users pin modules (e.g., Reels, Watch, Dating) to top of sidebar</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🗂️ Grouped Navigation</h4>
                  <p className="text-sm text-gray-600">Sections grouped by type: Social, Business, Creator, Admin, etc.</p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">✅ Example Layout Grouping:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-blue-600 mb-1">🧠 Core</div>
                    <div className="text-gray-600">Home, Feed, Reels, Watch</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-green-600 mb-1">🛍️ Commerce</div>
                    <div className="text-gray-600">Marketplace, Offers, Jobs, Store</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-purple-600 mb-1">👥 Social</div>
                    <div className="text-gray-600">Dating, Friends, Groups</div>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <div className="font-medium text-orange-600 mb-1">📈 Business</div>
                    <div className="text-gray-600">Pro Dashboard, Monetization</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'protection':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-red-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔐 Routing Protection Layer</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Weak routing security exposes sensitive admin areas and allows unauthorized access to premium features.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✅ Auth Gate</h4>
                  <p className="text-sm text-gray-600">Only allows access if auth.session is valid (real-time Supabase check)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚧 Role-Based Routes</h4>
                  <p className="text-sm text-gray-600">Users with role !== 'admin' can't open /admin/* or /pro-control/*</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔄 Real-Time Block</h4>
                  <p className="text-sm text-gray-600">If user gets downgraded or suspended, session is instantly blocked</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧠 Smart Redirect</h4>
                  <p className="text-sm text-gray-600">Redirects banned or underage users to warning page</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Path Injection Guard</h4>
                  <p className="text-sm text-gray-600">Prevents malicious paths like /admin&lt;script&gt;.js</p>
                </div>
              </div>

              <div className="mt-6 bg-red-50 rounded-lg p-4">
                <p className="text-sm font-medium text-red-700">🔐 Bonus: Adds header signature + Supabase RLS validation before any route is rendered. Helps prevent URL spoofing, brute-force guessing, or anonymous redirection.</p>
              </div>
            </div>
          </div>
        );

      case 'redirects':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 Advanced Redirect Engine</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor redirect handling causes user frustration, broken flows, and up to 25% conversion loss in critical funnels.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💼 Plan-Based Redirects</h4>
                  <p className="text-sm text-gray-600">Users on Free Plan → redirected from Pro features to Upgrade Page</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧑‍💼 Profile-Completion Redirects</h4>
                  <p className="text-sm text-gray-600">Users with incomplete profile → taken to CompleteProfilePage</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔥 Real-Time Failure Retry</h4>
                  <p className="text-sm text-gray-600">If a module fails (e.g., Reels crashes), auto-redirect to fallback feed</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧭 DeepLink Recovery</h4>
                  <p className="text-sm text-gray-600">If shared a link to a deleted post → redirect to parent post, category, or 404</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔁 Auto-Login Redirects</h4>
                  <p className="text-sm text-gray-600">If session expired → re-login → return to original destination</p>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700">🧠 Redirect History Tracking: Logs user redirection flow in analytics (from &gt; to &gt; reason).</p>
              </div>
            </div>
          </div>
        );

      case 'detection':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">❌ Broken Link & Dead Route Detection</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Broken links damage SEO rankings, create poor user experience, and increase support ticket volume by 60%.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 URL Scanner</h4>
                  <p className="text-sm text-gray-600">Crawls all frontend links every 24h and flags 404 or empty pages</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧱 Fallback Routes</h4>
                  <p className="text-sm text-gray-600">Every module (e.g., /reels/:id) falls back to /reels or /feed</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 Broken Link Analytics</h4>
                  <p className="text-sm text-gray-600">Detects % of 404s, top broken pages, and referring source</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📬 Auto Email Alerts (Admin)</h4>
                  <p className="text-sm text-gray-600">Sends admin alert if a critical route fails repeatedly (e.g., 500 errors)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔗 Redirect Chain Checker</h4>
                  <p className="text-sm text-gray-600">Flags circular redirects or chained loops (e.g., A → B → A)</p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <p className="text-sm font-medium text-yellow-700">🧠 Uses PostHog, Supabase Edge Logs, or custom /logs/route-failures route for internal auditing.</p>
              </div>
            </div>
          </div>
        );

      case 'deeplinking':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📎 Deep Linking (Cross-Platform)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor deep linking reduces social sharing by 45% and breaks referral tracking, impacting viral growth.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔗 Universal Links</h4>
                  <p className="text-sm text-gray-600">Clicking a shared post opens native app (if installed), else web fallback</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧠 Smart Deep Links</h4>
                  <p className="text-sm text-gray-600">App opens directly to post/group/page inside mobile app</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧾 Deep Link Parser (Mobile)</h4>
                  <p className="text-sm text-gray-600">Captures incoming links like shqipet.com/reels/xyz → auto-parses inside app</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧭 Referral Deep Links</h4>
                  <p className="text-sm text-gray-600">Handles deep links with referral tracking: ?ref=andi123</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💡 QR Code Generator</h4>
                  <p className="text-sm text-gray-600">Share deep links as QR codes for scanning/posting offline</p>
                </div>
              </div>

              <div className="mt-6 bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-medium text-purple-700">✅ Enabled via Capacitor + Supabase or Branch.io for mobile → web redirection bridges.</p>
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔁 Real-Time Routing Sync (Multi-Device)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor multi-device sync creates confusion, duplicate sessions, and breaks continuity in user workflows across platforms.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🌐 Multi-Device Session Sync</h4>
                  <p className="text-sm text-gray-600">Route stays in sync if user opens app on mobile & desktop simultaneously</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💬 Notification-to-Route</h4>
                  <p className="text-sm text-gray-600">If user clicks push notification, they're redirected to proper context</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⏪ Session Resume</h4>
                  <p className="text-sm text-gray-600">If user logs out in the middle of a task → logs back in → resumes same view</p>
                </div>
              </div>

              <div className="mt-6 bg-indigo-50 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-700">🔄 Powered by real-time Supabase subscriptions and WebSocket connections for instant cross-device synchronization.</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📍 Routing & Navigation System</h1>
          <p className="text-gray-600">Enterprise-Level Setup for Shqipet.com & App - Ensuring flawless user experience, maximum speed, security-level navigation, and instant page access across web and mobile platforms.</p>
        </div>

        {/* Section Navigation */}
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex flex-wrap gap-3">
            {sections.map((section, index) => {
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
                  className={`px-4 py-2 text-sm font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 ${
                    activeSection === section.id
                      ? `${activeColorScheme} border-2`
                      : colorScheme
                  }`}
                >
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

export default CorePlatformNavigation;