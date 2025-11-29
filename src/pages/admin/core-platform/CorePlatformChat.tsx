import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Info, Brain, Link, Archive, RotateCcw, Search, Users, FolderOpen, Filter, MessageCircle, Sparkles, BarChart3, Globe, Lock } from 'lucide-react';

const CorePlatformChat: React.FC = () => {
  const [activeSection, setActiveSection] = useState('goals');

  const sections = [
    { id: 'goals', label: 'System Goals', icon: Brain },
    { id: 'infrastructure', label: 'Infrastructure', icon: Link },
    { id: 'database', label: 'Database Structure', icon: Archive },
    { id: 'delivery', label: 'Delivery Pipeline', icon: RotateCcw },
    { id: 'status', label: 'Message Status', icon: Search },
    { id: 'presence', label: 'Presence & Live Status', icon: Users },
    { id: 'media', label: 'Media & Files', icon: FolderOpen },
    { id: 'safety', label: 'Abuse Filtering', icon: Filter },
    { id: 'types', label: 'Message Types', icon: MessageCircle },
    { id: 'features', label: 'UX Features', icon: Sparkles },
    { id: 'admin', label: 'Admin Panel', icon: BarChart3 },
    { id: 'integration', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security & Privacy', icon: Lock }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'goals':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Failure to implement secure real-time messaging leads to user abandonment, privacy breaches, and platform credibility loss.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-emerald-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧑‍🤝‍🧑 Real-Time, Cross-Device</h3>
                <p className="text-gray-700">Messages instantly sync across web/mobile platforms with guaranteed delivery.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Private & Secure</h3>
                <p className="text-gray-700">End-to-end delivery with optional encryption for sensitive communications.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🪄 Fast, Elegant UX</h3>
                <p className="text-gray-700">Light, smooth animations with modern chat interface design.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧼 Clean & Safe</h3>
                <p className="text-gray-700">Auto-moderation and comprehensive abuse protection systems.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-pink-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📤 Media-Ready</h3>
                <p className="text-gray-700">Seamless support for images, videos, audio files, and documents.</p>
              </div>
            </div>
          </div>
        );
        
      case 'infrastructure':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor infrastructure choices result in message delays, failed deliveries, and scalability issues as user base grows.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📡 Supabase Realtime</td><td className="px-6 py-4">Live presence + message sync</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧩 Supabase Tables</td><td className="px-6 py-4">Store messages, threads, metadata</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📦 Supabase Storage</td><td className="px-6 py-4">Securely host media files</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧠 Edge Functions</td><td className="px-6 py-4">Handle abuse reports, moderation, delivery logic</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🎛️ Redis/Presence Engine</td><td className="px-6 py-4">Track who's online (if scaling beyond 1k+)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📲 Push Notification API</td><td className="px-6 py-4">Alert users of new messages</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔐 Supabase RLS + JWT</td><td className="px-6 py-4">Lock chats to participants only</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'database':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poorly designed database structure leads to data inconsistencies, performance bottlenecks, and message corruption.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">chats</td><td className="px-6 py-4">1-to-1 and group thread metadata</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">chat_members</td><td className="px-6 py-4">User–chat relationships (roles, mute status)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">messages</td><td className="px-6 py-4">Actual chat content: text, media, reactions</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">message_status</td><td className="px-6 py-4">Per-user read/seen/delivered tracking</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">blocked_users</td><td className="px-6 py-4">Track who blocked whom</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">abuse_reports</td><td className="px-6 py-4">Auto-flagging and manual report logs</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">message_media</td><td className="px-6 py-4">Media metadata (file URL, thumbnail, etc.)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'delivery':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Unreliable delivery pipeline results in lost messages, frustrated users, and broken conversations.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ultra Pro Delivery Flow</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">User sends message</h4>
                    <p className="text-sm text-gray-600">Message initiated by user action</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Message saved in Supabase DB</h4>
                    <p className="text-sm text-gray-600">Persistent storage with metadata</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Trigger Supabase Realtime</h4>
                    <p className="text-sm text-gray-600">Real-time event broadcast</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Show message instantly to receiver</h4>
                    <p className="text-sm text-gray-600">Live UI update for online users</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold">Send Push/SMS/Toast notification</h4>
                    <p className="text-sm text-gray-600">If app closed or user offline</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold">Log delivery + seen status</h4>
                    <p className="text-sm text-gray-600">Track in message_status table</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800 font-medium">✅ Delivery is guaranteed — even if user switches devices or goes offline temporarily.</p>
              </div>
            </div>
          </div>
        );
        
      case 'status':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Unclear message status leads to user confusion, duplicate sends, and poor communication experience.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🕒 Sent</td><td className="px-6 py-4">Gray clock</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📤 Delivered</td><td className="px-6 py-4">Single gray check</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">✅ Read</td><td className="px-6 py-4">Double blue check</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📴 Failed</td><td className="px-6 py-4">Red dot, retry available</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔁 Re-sent (Offline)</td><td className="px-6 py-4">Auto-retries when back online</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">✅ All statuses stored and updated in message_status table.</p>
            </div>
          </div>
        );
        
      case 'presence':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor presence tracking results in unnecessary notifications and degraded real-time communication experience.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🟢 Online/Offline</td><td className="px-6 py-4">presence_map via Supabase Realtime</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">⌨️ Typing Indicator</td><td className="px-6 py-4">Temp state in local DB or Redis</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">👀 "Seen" Status</td><td className="px-6 py-4">Timestamped in message_status</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">⏰ Last Seen Tracking</td><td className="px-6 py-4">Per user → updated only if not invisible mode</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'media':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Inadequate media support limits user expression and engagement, reducing platform appeal and usage.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📷 Images</td><td className="px-6 py-4">JPG, PNG, GIF (10MB)</td><td className="px-6 py-4">Live preview</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🎥 Videos</td><td className="px-6 py-4">MP4, MOV (100MB HD)</td><td className="px-6 py-4">Auto-thumbnail</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔊 Voice Notes</td><td className="px-6 py-4">AAC, MP3 (2 mins)</td><td className="px-6 py-4">Tap & hold to record</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📁 Files</td><td className="px-6 py-4">PDF, DOCX, ZIP (25MB)</td><td className="px-6 py-4">Secure storage</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">✅ Stored in Supabase Storage with signed URLs + expiry</p>
            </div>
          </div>
        );
        
      case 'safety':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Weak abuse filtering leads to harassment, spam proliferation, and platform reputation damage.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-red-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 Profanity & Hate Detection</h3>
                <p className="text-gray-700">Edge function + AI NLP flagging</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛑 Anti-Spam Logic</h3>
                <p className="text-gray-700">Rate-limit messages: e.g. max 3/min</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-gray-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔇 Mute Threads / Users</h3>
                <p className="text-gray-700">Local + DB toggle</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Block User System</h3>
                <p className="text-gray-700">Blocks all future DMs</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Report Message Flow</h3>
                <p className="text-gray-700">Tap → Report → Reason → Logs stored in abuse_reports</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧑‍⚖️ Admin Flag Inbox</h3>
                <p className="text-gray-700">All flagged messages visible to moderators</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">✅ AI models like OpenAI Moderation API can be used optionally</p>
            </div>
          </div>
        );
        
      case 'types':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Limited messaging types restrict communication flexibility and reduce user engagement opportunities.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 One-to-One DM</h3>
                <p className="text-gray-700">Secure, private between 2 users</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Group Chat</h3>
                <p className="text-gray-700">Up to 100 members with roles (admin, member, muted)</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Secret Chat</h3>
                <p className="text-gray-700">Optional encrypted self-destructing messages</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧑‍💼 Pro Business Chat</h3>
                <p className="text-gray-700">Integrated into profiles with storefronts</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-gray-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ System Chat</h3>
                <p className="text-gray-700">For receiving admin messages, system alerts</p>
              </div>
            </div>
          </div>
        );
        
      case 'features':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Basic messaging features lead to user switching to competing platforms with richer communication tools.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">📜 Message Threads & Replies</h4>
                <p className="text-sm text-gray-700">Nested replies like X/Twitter</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">😄 Emoji Reactions</h4>
                <p className="text-sm text-gray-700">React with quick emoji + reactions count</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧵 Save as Draft</h4>
                <p className="text-sm text-gray-700">Message saved if not sent yet</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🔁 Edit & Delete Messages</h4>
                <p className="text-sm text-gray-700">Within a time window (e.g., 5 minutes)</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">📌 Pin Messages</h4>
                <p className="text-sm text-gray-700">Highlight key messages inside chat</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🔗 Link Previews</h4>
                <p className="text-sm text-gray-700">Auto-fetch title/image when pasting URL</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">📍 Location Sharing</h4>
                <p className="text-sm text-gray-700">Google Maps + safety toggle</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-cyan-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">👤 Verified DM Badges</h4>
                <p className="text-sm text-gray-700">Verified creators, brands, admins</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🎨 Theme Customization</h4>
                <p className="text-sm text-gray-700">Per-chat themes (e.g., dark, Albanian flag theme)</p>
              </div>
            </div>
          </div>
        );
        
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Inadequate admin tools prevent effective moderation and lead to uncontrolled spam and abuse on the platform.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">👁️ Monitor Flagged Messages</td><td className="px-6 py-4">From abuse_reports table</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📊 Message Volume Charts</td><td className="px-6 py-4">See per hour/day by chat type</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧑‍⚖️ Manual Ban/Freeze User</td><td className="px-6 py-4">If user spams across chats</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📈 Group Engagement Stats</td><td className="px-6 py-4">See who speaks the most</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔄 Real-Time Chat Monitor</td><td className="px-6 py-4">Live log of all chats (admin only view)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📂 Media Storage Summary</td><td className="px-6 py-4">Total files & space used</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'integration':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Missing integrations limit platform connectivity and reduce business value for professional users.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Phone Integration Sync</h3>
                <p className="text-gray-700">Mirror DMs to verified WhatsApp (read-only or reply too)</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 CRM Export</h3>
                <p className="text-gray-700">For business DMs (Super Pro only)</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🛎️ Notification Bridge</h3>
                <p className="text-gray-700">New messages alert to Email/SMS if user offline</p>
              </div>
            </div>
          </div>
        );
        
      case 'security':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Weak security measures lead to data breaches, privacy violations, and complete loss of user trust.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔐 Role-Based Access</td><td className="px-6 py-4">RLS: only chat participants can query messages</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">⛔ Private Threads</td><td className="px-6 py-4">Hidden from all but sender/receiver</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔒 End-to-End Option</td><td className="px-6 py-4">Future: encrypted mode for sensitive chats</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">👻 Ghost Detection</td><td className="px-6 py-4">Warn admins if "ghost" bot users initiate chats</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      default:
        return <div>Select a section to view its content</div>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Next-Generation Messaging System</h1>
          <p className="text-lg text-gray-600">"Secure. Scalable. Real-time. Social-ready."</p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="mb-8">
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
                'bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200',
                'bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 border-pink-200',
                'bg-gradient-to-r from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200 text-violet-700 border-violet-200',
                'bg-gradient-to-r from-lime-50 to-lime-100 hover:from-lime-100 hover:to-lime-200 text-lime-700 border-lime-200',
                'bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 text-sky-700 border-sky-200'
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
                'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300',
                'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300',
                'bg-gradient-to-r from-violet-100 to-violet-200 text-violet-800 border-violet-300',
                'bg-gradient-to-r from-lime-100 to-lime-200 text-lime-800 border-lime-300',
                'bg-gradient-to-r from-sky-100 to-sky-200 text-sky-800 border-sky-300'
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
        
        {/* Content Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          {renderSection()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CorePlatformChat;