import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Mail, Bell, Target, Settings, Lock, Archive, Download, BarChart3, Brain } from 'lucide-react';

const CorePlatformNotifications: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Mail },
    { id: 'types', label: 'Notification Types', icon: Bell },
    { id: 'objectives', label: 'System Objectives', icon: Target },
    { id: 'techstack', label: 'Tech Stack', icon: Settings },
    { id: 'security', label: 'Security & Delivery', icon: Lock },
    { id: 'categories', label: 'Categories', icon: Archive },
    { id: 'fallback', label: 'Delivery Flow', icon: Download },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI Personalization', icon: Brain }
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📬 Next-Generation Notification System</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor notification systems lead to 70% user disengagement, missed critical updates, and complete loss of user retention and trust.</p>
                  <p className="text-gray-600 italic">"Instant, intelligent, multi-channel notifications with guaranteed delivery & fallback"</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'types':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔔 Notification Types</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Limited notification channels reduce user engagement by 50% and create single points of failure in critical communications.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Channels</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Use Cases</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔄 Real-Time Toasts</td>
                      <td className="border border-gray-300 px-4 py-2">In-app popups</td>
                      <td className="border border-gray-300 px-4 py-2">Likes, comments, follows, live activity</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📧 Emails</td>
                      <td className="border border-gray-300 px-4 py-2">Transactional & digest</td>
                      <td className="border border-gray-300 px-4 py-2">Verification, receipts, feature news</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📱 SMS</td>
                      <td className="border border-gray-300 px-4 py-2">Fast mobile delivery</td>
                      <td className="border border-gray-300 px-4 py-2">Security alerts, login codes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">💬 WhatsApp</td>
                      <td className="border border-gray-300 px-4 py-2">Verified business line</td>
                      <td className="border border-gray-300 px-4 py-2">Deep links, reminders, content alerts</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔔 Push Notifications</td>
                      <td className="border border-gray-300 px-4 py-2">Mobile (Android/iOS)</td>
                      <td className="border border-gray-300 px-4 py-2">App engagement, creator updates</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 System Objectives</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without smart routing and fallback systems, 30% of critical notifications fail to reach users, causing security vulnerabilities and user frustration.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">💡 Smart Channel Fallback</h4>
                  <p className="text-sm text-gray-600">If email fails → try SMS → WhatsApp → push</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧠 Context-Aware Routing</h4>
                  <p className="text-sm text-gray-600">E.g., "urgent security alert" = SMS only</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⏱️ Delayed & Queued Delivery</h4>
                  <p className="text-sm text-gray-600">Prevent spamming, group alerts intelligently</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔁 Retry & Bounce Logic</h4>
                  <p className="text-sm text-gray-600">Retry up to 3x with logs if failed (e.g. inbox full)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📬 Read Receipts</h4>
                  <p className="text-sm text-gray-600">Check if user opened / saw the message</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⚠️ Delivery Heatmap</h4>
                  <p className="text-sm text-gray-600">Admin analytics: which channels deliver best</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'techstack':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">⚙️ Tech Stack Integration</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor tech stack integration creates notification failures, vendor lock-in, and inability to scale notification volume efficiently.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Tech</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧱 Supabase Functions</td>
                      <td className="border border-gray-300 px-4 py-2">Notification triggers, fallback logic, logging</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">💌 Resend / SendGrid</td>
                      <td className="border border-gray-300 px-4 py-2">Email dispatch with rich templating</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📲 Twilio API</td>
                      <td className="border border-gray-300 px-4 py-2">SMS + WhatsApp sending with status tracking</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔔 OneSignal / Firebase</td>
                      <td className="border border-gray-300 px-4 py-2">Mobile push notifications</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📦 Supabase notifications table</td>
                      <td className="border border-gray-300 px-4 py-2">Stores message meta, read status, user prefs</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📡 Edge Function Queue</td>
                      <td className="border border-gray-300 px-4 py-2">Ensures async delivery and retry logic</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-red-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔐 Security + Delivery</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Insecure notifications expose user data, enable phishing attacks, and create compliance violations leading to legal issues and user trust loss.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔐 Token Signed URLs</h4>
                  <p className="text-sm text-gray-600">Email / WhatsApp links use short-living tokens</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔎 Role-Scoped Alerts</h4>
                  <p className="text-sm text-gray-600">Only admins see certain system alerts</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚫 Spam Protection</h4>
                  <p className="text-sm text-gray-600">Limits per minute/hour/day to avoid abuse</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">👁️ Visibility Rules</h4>
                  <p className="text-sm text-gray-600">Toasts disappear unless user interacts OR marked "persistent"</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🗃️ Notification Types by Category</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poorly categorized notifications overwhelm users, reduce engagement, and cause important messages to be ignored or missed completely.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Behavioral Triggers */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">🧠 Behavioral Triggers (In-App / Toast)</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Event</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Message Preview</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">👍 Post Liked</td>
                          <td className="border border-gray-300 px-4 py-2">"@ella liked your post: 'Amazing view in Tropojë'"</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">💬 New Comment</td>
                          <td className="border border-gray-300 px-4 py-2">"You've got 3 new comments"</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">👥 Followed</td>
                          <td className="border border-gray-300 px-4 py-2">"@besart just followed you!"</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">🔔 Mention</td>
                          <td className="border border-gray-300 px-4 py-2">"You were mentioned in a story"</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">🗓️ Reminder</td>
                          <td className="border border-gray-300 px-4 py-2">"Don't forget to publish your scheduled post"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Transactional Emails */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📧 Transactional Emails</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Template Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">🔑 Email Verification</td>
                          <td className="border border-gray-300 px-4 py-2">Logo, CTA button, auto-expire token</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">💸 Subscription Receipts</td>
                          <td className="border border-gray-300 px-4 py-2">Plan name, amount, billing cycle, support link</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">🛠️ System Update</td>
                          <td className="border border-gray-300 px-4 py-2">What's new in the platform with visuals</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">🎓 Training Progress</td>
                          <td className="border border-gray-300 px-4 py-2">"You've unlocked 3/5 courses in Creator Academy"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SMS / WhatsApp */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">📱 SMS / WhatsApp</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Message</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Channel</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Use Case</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">🔐 Login Code</td>
                          <td className="border border-gray-300 px-4 py-2">SMS / WhatsApp</td>
                          <td className="border border-gray-300 px-4 py-2">Verification flow</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">🚨 Security Alert</td>
                          <td className="border border-gray-300 px-4 py-2">SMS</td>
                          <td className="border border-gray-300 px-4 py-2">Login from new device</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 font-medium">📢 New Feature Alert</td>
                          <td className="border border-gray-300 px-4 py-2">WhatsApp</td>
                          <td className="border border-gray-300 px-4 py-2">"🔥 Super Pro now includes Cross-Platform Scheduling!"</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-medium">🧠 Boost Reminder</td>
                          <td className="border border-gray-300 px-4 py-2">WhatsApp</td>
                          <td className="border border-gray-300 px-4 py-2">"Last chance to use your free boost tokens this month!"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-sm text-indigo-700 font-medium">
                    ✅ Verified Business Account setup recommended for WhatsApp branding.
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'fallback':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📥 Delivery & Fallback Flow (Smart Logic)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without intelligent fallback systems, single channel failures result in 100% notification loss and complete communication breakdown with users.</p>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 text-white mb-6">
                <h4 className="font-semibold mb-4">Smart Delivery Flow:</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs">1</div>
                    <span>Trigger Notification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Check Preferred Channel Available?</span>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs">3a</div>
                    <span>YES → Send on Preferred Channel</span>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">3b</div>
                    <span>NO → Try Secondary Channel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs">4</div>
                    <span>Check Delivered?</span>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs">5a</div>
                    <span>YES → Mark as Delivered</span>
                  </div>
                  <div className="flex items-center gap-3 ml-6">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs">5b</div>
                    <span>NO → Queue Retry (Max 3x)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📝 Logging:</h4>
                  <p className="text-sm text-orange-700">All attempts logged in notifications_logs</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔄 Fallback:</h4>
                  <p className="text-sm text-orange-700">Toast fallback for failed mobile push or inbox-only users</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-teal-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Analytics & Admin Dashboard</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: No notification analytics means inability to optimize delivery, wasted resources, and missed opportunities to improve user engagement by 80%.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📤 Sent Volume</h4>
                  <p className="text-sm text-gray-600">Total per channel & per day</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✅ Delivery Rate</h4>
                  <p className="text-sm text-gray-600">% successfully delivered</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📬 Open Rate (email/WhatsApp)</h4>
                  <p className="text-sm text-gray-600">User read rate</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧪 A/B Message Testing</h4>
                  <p className="text-sm text-gray-600">Try different titles/designs</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📈 Peak Notification Time</h4>
                  <p className="text-sm text-gray-600">When most alerts get seen</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📍 Geo-based Delivery Heatmap</h4>
                  <p className="text-sm text-gray-600">Where messages are opened most</p>
                </div>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <p className="text-sm text-teal-700">✅ Filter by user type (Super Pro, Free, Admin), feature module, or delivery type.</p>
              </div>
            </div>
          </div>
        );

      case 'ai':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-pink-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 AI + Personalization</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without AI personalization, notification relevance drops by 60%, leading to user fatigue, unsubscribes, and reduced platform engagement.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✍️ Smart Subject Lines</h4>
                  <p className="text-sm text-gray-600">Auto-adapted based on user behavior (e.g. "Boost now, @andi!")</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🕒 Best Time Detection</h4>
                  <p className="text-sm text-gray-600">AI detects best delivery time per user</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">✨ Style Match</h4>
                  <p className="text-sm text-gray-600">Emojis, language tone matched to user personality</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⏩ Auto-Frequency Reduction</h4>
                  <p className="text-sm text-gray-600">If user skips 3 emails in a row → slow frequency</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔮 Predictive Suggestions</h4>
                  <p className="text-sm text-gray-600">"Users like Andi usually respond to SMS better than Email"</p>
                </div>
              </div>

              <div className="bg-pink-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">✅ AI works on:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-pink-700">
                  <li>Engagement history</li>
                  <li>Creator type (informative, entertaining, professional)</li>
                  <li>Audience pattern learning</li>
                </ul>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">✅ User Preferences Panel</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                  <div>
                    <strong className="text-blue-400">Channels:</strong>
                    <br />Enable/disable Email, SMS, WhatsApp, Push
                  </div>
                  <div>
                    <strong className="text-green-400">Frequency:</strong>
                    <br />Real-time, Daily Digest, Weekly Summary
                  </div>
                  <div>
                    <strong className="text-yellow-400">Notification Types:</strong>
                    <br />Only Security / All / Mentions Only
                  </div>
                  <div>
                    <strong className="text-purple-400">Language:</strong>
                    <br />Customize per user language
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  🔗 users_notifications_prefs table powers this logic.
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Next-Generation Notification System</h1>
          <p className="text-gray-600">Instant, intelligent, multi-channel notifications with guaranteed delivery & fallback systems.</p>
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

export default CorePlatformNotifications;