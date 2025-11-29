import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Lock, Ghost, Shield, Brain, Layers, Key, FileText, Zap } from 'lucide-react';

const CorePlatformSecurityModules: React.FC = () => {
  const [activeSection, setActiveSection] = useState('ratelimiting');

  const sections = [
    { id: 'ratelimiting', label: 'Rate Limiting', icon: Lock },
    { id: 'ghostdetection', label: 'Ghost Detection', icon: Ghost },
    { id: 'antispam', label: 'Anti-Spam', icon: Shield },
    { id: 'loginanomaly', label: 'Login Anomaly', icon: Brain },
    { id: 'rolebased', label: 'Role-Based Gates', icon: Layers },
    { id: 'tokensecurity', label: 'Token Security', icon: Key },
    { id: 'auditlogs', label: 'Audit Logs', icon: FileText },
    { id: 'elitefeatures', label: 'Elite Features', icon: Zap }
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'ratelimiting':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔐 Rate Limiting Engine</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Without proper rate limiting, your platform becomes vulnerable to DDoS attacks, spam floods, and resource exhaustion leading to 100% service unavailability.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Layer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Control Scope</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📤 Request-Level</td>
                      <td className="border border-gray-300 px-4 py-2">API requests, form submissions</td>
                      <td className="border border-gray-300 px-4 py-2">Throttle based on IP, user ID, route type (e.g. login)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">⏱️ Time-Based</td>
                      <td className="border border-gray-300 px-4 py-2">Per minute/hour/day</td>
                      <td className="border border-gray-300 px-4 py-2">Prevent flood attacks or abuse loops</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔑 Auth-Sensitive</td>
                      <td className="border border-gray-300 px-4 py-2">Separate limits for user types</td>
                      <td className="border border-gray-300 px-4 py-2">Different rate limits for guests vs logged-in vs verified Pro users</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">💼 Admin Override</td>
                      <td className="border border-gray-300 px-4 py-2">Admin tools bypass</td>
                      <td className="border border-gray-300 px-4 py-2">Allow certain admin tools to bypass limits</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Built with:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                  <li>Supabase Edge Functions (with per-user + per-IP rules)</li>
                  <li>Custom middlewares (in Next.js or Vite + Express)</li>
                  <li>Supabase RLS (for writes/reads rate control)</li>
                </ul>
              </div>

              <div className="mt-4 bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Example Rate Limiting (Edge Function):</h4>
                <pre className="text-green-400 text-sm overflow-x-auto">
{`if (await isRateLimited(ip, "login", 5, "minute")) {
  return Response.json({ error: "Too many attempts, please wait" }, { status: 429 });
}`}
                </pre>
              </div>
            </div>
          </div>
        );

      case 'ghostdetection':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-purple-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">👻 Ghost User Detection</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Undetected ghost users can compromise account security, enable data theft, and create unauthorized access leading to complete platform breach.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Threat Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">What to Catch</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Detection Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🕵️‍♂️ Session Spoofing</td>
                      <td className="border border-gray-300 px-4 py-2">Same user ID active from multiple devices rapidly</td>
                      <td className="border border-gray-300 px-4 py-2">Supabase session fingerprinting + device hash</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔄 Token Reuse</td>
                      <td className="border border-gray-300 px-4 py-2">Old tokens used after logout/refresh</td>
                      <td className="border border-gray-300 px-4 py-2">Token generation timestamp + versioning</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧪 AI Cloaked Patterns</td>
                      <td className="border border-gray-300 px-4 py-2">Randomized activity, repeated viewing</td>
                      <td className="border border-gray-300 px-4 py-2">AI behavior scoring (heatmap, time/location)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">🧠 Ghost Index (0–100 score):</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-green-100 p-3 rounded text-center">
                    <div className="font-medium text-green-800">0–50</div>
                    <div className="text-green-600">Normal</div>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded text-center">
                    <div className="font-medium text-yellow-800">50–75</div>
                    <div className="text-yellow-600">Suspicious</div>
                  </div>
                  <div className="bg-red-100 p-3 rounded text-center">
                    <div className="font-medium text-red-800">75+</div>
                    <div className="text-red-600">Ghost Mode (flag user)</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Logs sent to:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>/ghost_users Supabase table</li>
                  <li>Admin Dashboard &gt; Security &gt; Ghost Activity</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'antispam':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-green-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🛡️ Anti-Spam System (Full Stack)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Poor anti-spam protection leads to content degradation, user exodus, SEO penalties, and potential legal issues with content regulation.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Layer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Coverage</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📮 Input Filtering</td>
                      <td className="border border-gray-300 px-4 py-2">Comments, messages, posts</td>
                      <td className="border border-gray-300 px-4 py-2">Regex + ML spam scoring</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">⏱️ Time Analysis</td>
                      <td className="border border-gray-300 px-4 py-2">Spam burst detection</td>
                      <td className="border border-gray-300 px-4 py-2">Multiple posts in short time window</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">📍 Location Anomaly</td>
                      <td className="border border-gray-300 px-4 py-2">Unusual country/IP mismatch</td>
                      <td className="border border-gray-300 px-4 py-2">GeoIP vs profile region</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧠 AI Behavior Tracing</td>
                      <td className="border border-gray-300 px-4 py-2">Account patterns</td>
                      <td className="border border-gray-300 px-4 py-2">AI cluster maps and heat matching</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔇 Shadowban Mode</td>
                      <td className="border border-gray-300 px-4 py-2">User can still post, but content hidden</td>
                      <td className="border border-gray-300 px-4 py-2">Ideal for suspicious bot-like accounts</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Spam Flag Score:</h4>
                <p className="text-sm text-green-700 mb-2">Each activity (post, comment, message) is scored. If spam score &gt; threshold → auto-moderated, user flagged, delayed.</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-white mb-2">Table: user_spam_flags</h4>
                <pre className="text-green-400 text-sm">
{`user_id | spam_score | last_flagged | blocked | reason`}
                </pre>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Realtime actions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Auto-remove post</li>
                  <li>Show warning</li>
                  <li>Notify moderation team</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'loginanomaly':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-yellow-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 Login Anomaly Detection (Behavioral + Geographic)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Undetected login anomalies enable account takeovers, unauthorized access, and data breaches resulting in user trust loss and legal liability.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🌍</span>
                    <h4 className="font-semibold text-gray-800">GeoIP Drift</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Login from unexpected country or region</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">📱</span>
                    <h4 className="font-semibold text-gray-800">Device Change</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">New device not seen before for the user</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🕑</span>
                    <h4 className="font-semibold text-gray-800">Time Pattern Mismatch</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Unusual login hour for that user</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🔁</span>
                    <h4 className="font-semibold text-gray-800">Login Flood</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Multiple login attempts per second</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">🚫</span>
                    <h4 className="font-semibold text-gray-800">Token Tampering</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">Modified or injected token detected</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ If anomaly detected:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                  <li>🔐 Force re-authentication</li>
                  <li>✉️ Email or SMS verification (auto sent)</li>
                  <li>🚨 Admin dashboard alert</li>
                  <li>👁️ Ghost session mode for real-time review</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Bonus:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Store anomaly logs in login_anomalies table</li>
                  <li>Use Supabase Edge + GeoIP + user_agents to profile user behavior</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'rolebased':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-red-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧱 Role-Based Security Gates</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Inadequate role-based security creates privilege escalation vulnerabilities, unauthorized access to sensitive data, and compliance violations.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Role</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Gate Level</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Access Control</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">👤 Free User</td>
                      <td className="border border-gray-300 px-4 py-2">Basic permissions</td>
                      <td className="border border-gray-300 px-4 py-2">Can't access premium APIs, protected routes</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔑 Pro User</td>
                      <td className="border border-gray-300 px-4 py-2">Custom module access + AI quota</td>
                      <td className="border border-gray-300 px-4 py-2">Rate-boosted but still validated</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">👑 Admin</td>
                      <td className="border border-gray-300 px-4 py-2">Full module access</td>
                      <td className="border border-gray-300 px-4 py-2">Logged + session audited</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🧑‍💼 Moderator</td>
                      <td className="border border-gray-300 px-4 py-2">Reports, flags, bans</td>
                      <td className="border border-gray-300 px-4 py-2">Can't access billing or system data</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🚨 Suspicious</td>
                      <td className="border border-gray-300 px-4 py-2">Limited mode + AI monitoring</td>
                      <td className="border border-gray-300 px-4 py-2">Auto-triggered by behavior score or abuse flags</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Implementation:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  <li>Implemented using Supabase RLS + user_roles table</li>
                  <li>🔁 Can be updated in real-time based on anomaly scores or abuse flags</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'tokensecurity':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-indigo-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🔒 Token & Session Security</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Weak token security enables session hijacking, replay attacks, and unauthorized account access leading to complete security breach.</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔐 JWT Tokens</h4>
                  <p className="text-sm text-gray-600">Auto-expiring + IP/device lock hash</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">⛔ Token Revocation</h4>
                  <p className="text-sm text-gray-600">Active logout or reset from admin panel</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🔄 Token Refresh Rotation</h4>
                  <p className="text-sm text-gray-600">New token issued per session renewal</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧪 Tamper Detection</h4>
                  <p className="text-sm text-gray-600">Token payload mutation triggers logout</p>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ Token logs stored with:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-indigo-700">
                  <li>Issued timestamp</li>
                  <li>IP</li>
                  <li>Device hash</li>
                  <li>Session fingerprint</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'auditlogs':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-orange-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧩 Audit Logs & Moderation Control</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Missing audit trails prevent forensic analysis, compliance violations, and inability to track security incidents or malicious activities.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Logs Tracked</th>
                      <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Visible To</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🕵️‍♂️ Suspicious Logins</td>
                      <td className="border border-gray-300 px-4 py-2">Admins & System</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">🚨 Auto-flags from spam/ghost AI</td>
                      <td className="border border-gray-300 px-4 py-2">Moderators</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">🔐 Sensitive user actions (delete)</td>
                      <td className="border border-gray-300 px-4 py-2">Admins only</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">📝 Post edits + deletions</td>
                      <td className="border border-gray-300 px-4 py-2">Moderators</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">✅ All logs shown in:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                  <li>/admin/security/audit-logs</li>
                  <li>/users/flagged</li>
                  <li>Real-time feed for critical events</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'elitefeatures':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border-2 border-teal-200 p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 text-sm font-bold">i</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">🧠 Bonus (Elite Super Pro Grade)</h3>
                  <p className="text-sm text-red-600 font-medium mb-2">CONSEQUENCES: Basic security without AI enhancement leaves platforms vulnerable to sophisticated attacks, zero-day exploits, and advanced persistent threats.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧬 Behavioral Fingerprinting</h4>
                  <p className="text-sm text-gray-600">Unique behavior pattern per user (scroll, type speed, click delay)</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🛑 Real-Time Ban Wall</h4>
                  <p className="text-sm text-gray-600">Blocks all further requests when abuse confirmed</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧠 AI-Driven Policy Updates</h4>
                  <p className="text-sm text-gray-600">Adjusts spam thresholds and rate limits dynamically</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📊 Security Heatmap</h4>
                  <p className="text-sm text-gray-600">Visual map of suspicious IPs, countries, and routes</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Security Modules</h1>
          <p className="text-gray-600">Global-Grade, AI-Enhanced Security System - Protect users, admins, data, and the infrastructure in real time using a multi-layer security system built with edge detection, AI pattern recognition, Supabase rules, and platform-level awareness.</p>
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

export default CorePlatformSecurityModules;