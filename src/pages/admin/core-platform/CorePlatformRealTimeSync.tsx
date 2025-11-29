import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PostsCommentsRealtime } from '@/components/admin/realtime/PostsCommentsRealtime';
import { MessagingChatRealtime } from '@/components/admin/realtime/MessagingChatRealtime';
import { UserPresenceRealtime } from '@/components/admin/realtime/UserPresenceRealtime';
import { AdminDashboardRealtime } from '@/components/admin/realtime/AdminDashboardRealtime';
import { MarketplaceDatingRealtime } from '@/components/admin/realtime/MarketplaceDatingRealtime';
import { NotificationsRealtime } from '@/components/admin/realtime/NotificationsRealtime';
import { AdminControlsRealtime } from '@/components/admin/realtime/AdminControlsRealtime';
import { AnalyticsUsageRealtime } from '@/components/admin/realtime/AnalyticsUsageRealtime';
import { DatabaseChanges } from '@/components/admin/realtime/sync-definitions/DatabaseChanges';
import { RealtimeBroadcastChannels } from '@/components/admin/realtime/sync-definitions/RealtimeBroadcastChannels';
import { PresenceSystem } from '@/components/admin/realtime/sync-definitions/PresenceSystem';
import { SyncBufferLayer } from '@/components/admin/realtime/sync-definitions/SyncBufferLayer';
import { MobileListenerSync } from '@/components/admin/realtime/sync-definitions/MobileListenerSync';
import { RetryEngine } from '@/components/admin/realtime/sync-definitions/RetryEngine';

const CorePlatformRealTimeSync: React.FC = () => {
  const [activeSection, setActiveSection] = useState('posts-comments');
  const [activeSyncDefinition, setActiveSyncDefinition] = useState('postgres-changes');

  const informationalSections = [
    { id: 'definitions', label: '🔁 Sync Definitions', icon: '📝' },
    { id: 'technologies', label: '⚙️ Core Technologies', icon: '⚡' },
    { id: 'monitoring', label: '📊 Health Monitor', icon: '📡' },
    { id: 'diagnostics', label: '🧠 Advanced Diagnostics', icon: '🔍' },
    { id: 'failure-resistance', label: '🛡️ Failure Resistance', icon: '🔄' },
    { id: 'presence', label: '👥 User Presence', icon: '🧍‍♂️' },
    { id: 'security', label: '🔐 Security Checks', icon: '🚫' },
    { id: 'pro-features', label: '🧠 Pro Features', icon: '📈' }
  ];

  const realtimeSections = [
    { id: 'posts-comments', label: '📝 Posts / Comments', icon: '💬' },
    { id: 'messaging-chat', label: '💬 Messaging / Chat', icon: '📨' },
    { id: 'user-presence', label: '👤 User Presence', icon: '🟢' },
    { id: 'admin-dashboard', label: '📍 Admin Dashboards', icon: '🔧' },
    { id: 'marketplace-dating', label: '📦 Marketplace / Dating', icon: '❤️' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
    { id: 'admin-controls', label: '🛠️ Admin Controls', icon: '⚙️' },
    { id: 'analytics-usage', label: '📊 Analytics / Usage', icon: '📈' }
  ];

  const syncDefinitions = [
    { id: 'postgres-changes', label: '⚡ Supabase postgres_changes', icon: '⚡' },
    { id: 'broadcast-channels', label: '📡 Broadcast Channels', icon: '📡' },
    { id: 'presence-system', label: '👥 Presence System', icon: '👥' },
    { id: 'sync-buffer', label: '🔄 Sync Buffer Layer', icon: '🔄' },
    { id: 'mobile-sync', label: '📲 Mobile Listener Sync', icon: '📲' },
    { id: 'retry-engine', label: '🔁 Retry Engine', icon: '🔁' }
  ];

  const InfoIcon = ({ consequences }: { consequences: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium cursor-help ml-2">
            i
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p><strong>CONSEQUENCES:</strong> {consequences}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const StatusBadge = ({ status, type }: { status: string; type: 'success' | 'warning' | 'error' | 'info' }) => {
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      info: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors[type]}`}>
        {status}
      </span>
    );
  };

  const renderDefinitionsSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-blue-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🔁 What "Real-Time Sync" Means for Your Platform
          <InfoIcon consequences="Without proper real-time sync definitions, features become inconsistent, user experience degrades, and platform reliability suffers across all modules." />
        </h3>
        
        <div className="grid gap-4">
          {[
            { area: '📝 Posts / Comments', use: 'Instant updates without refresh (e.g., like/dislike, thread replies)' },
            { area: '💬 Messaging / Chat', use: 'Typing indicators, seen status, new message delivery' },
            { area: '👤 User Presence', use: 'Show who is online, active in chat, or viewing same content' },
            { area: '📍 Admin Dashboards', use: 'Live system health metrics, security logs, or user sessions' },
            { area: '📦 Marketplace / Dating', use: 'Live bidding, offer updates, swipe results, reactions' },
            { area: '🔔 Notifications', use: 'Live alerts: new follower, comment, tag, like, boost result' },
            { area: '🛠️ Admin Controls', use: 'Apply Pro role, ban user, or revoke access = reflected instantly' },
            { area: '📊 Analytics / Usage', use: 'View module usage or boost analytics as they happen' }
          ].map((item, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <StatusBadge status="Active" type="info" />
              <div>
                <h4 className="font-medium text-blue-800">{item.area}</h4>
                <p className="text-sm text-blue-700 mt-1">{item.use}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTechnologiesSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          ⚙️ Core Real-Time Technologies You Must Monitor
          <InfoIcon consequences="Failure to monitor core technologies leads to silent failures, degraded performance, lost messages, and broken user experiences across the platform." />
        </h3>
        
        {/* Sync Definitions Interactive Buttons */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">🔁 Interactive Sync Definitions</h4>
          <div className="flex flex-wrap gap-3 mb-4">
            {syncDefinitions.map((def, index) => {
              const colorSchemes = [
                'bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 text-yellow-700 border-yellow-200',
                'bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 border-pink-200',
                'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
                'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200',
                'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
                'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-200'
              ];
              const activeColorSchemes = [
                'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300',
                'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300',
                'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
                'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
                'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
                'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300'
              ];
              const colorScheme = colorSchemes[index % colorSchemes.length];
              const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];
              return (
                <button
                  key={def.id}
                  onClick={() => setActiveSyncDefinition(def.id)}
                  className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-all duration-300 border shadow-md hover:shadow-lg rounded-xl hover:scale-105 ${
                    activeSyncDefinition === def.id ? `${activeColorScheme} border-2` : colorScheme
                  }`}
                >
                  <span>{def.icon}</span>
                  <span>{def.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Sync Definition Components */}
          <div className="mb-6">
            {activeSyncDefinition === 'postgres-changes' && <DatabaseChanges />}
            {activeSyncDefinition === 'broadcast-channels' && <RealtimeBroadcastChannels />}
            {activeSyncDefinition === 'presence-system' && <PresenceSystem />}
            {activeSyncDefinition === 'sync-buffer' && <SyncBufferLayer />}
            {activeSyncDefinition === 'mobile-sync' && <MobileListenerSync />}
            {activeSyncDefinition === 'retry-engine' && <RetryEngine />}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoringSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-purple-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          📊 Real-Time Sync Health Monitoring (Display in Admin Panel)
          <InfoIcon consequences="Without health monitoring, sync failures go undetected, causing data inconsistencies, lost updates, and frustrated users experiencing stale information." />
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50">
                <th className="text-left p-3 font-medium text-purple-800">Component</th>
                <th className="text-left p-3 font-medium text-purple-800">Status</th>
                <th className="text-left p-3 font-medium text-purple-800">What to Monitor</th>
              </tr>
            </thead>
            <tbody>
              {[
                { component: '🔌 Socket Connection', status: '✅ Live / ⚠️ Reconnecting / ❌ Failed', monitor: 'Socket.IO or Supabase ws connection uptime' },
                { component: '📡 Presence Status', status: '✅ Online / Idle / Inactive', monitor: 'Update on profile view, chatroom, or post' },
                { component: '📶 Sync Delay (ms)', status: 'e.g. 50–200ms avg', monitor: 'Show median sync latency from server to client' },
                { component: '🔁 Event Retries', status: '0–X queued', monitor: 'How many real-time updates failed and retried' },
                { component: '⏳ Out-of-Sync Users', status: '0 (ideal)', monitor: 'Detect who hasn\'t synced latest comment or post' },
                { component: '🧪 Version Mismatch', status: '⚠️ Yes/No', monitor: 'Detect if user frontend isn\'t running latest code' },
                { component: '📍 Channel Traffic', status: 'e.g. 500 subs', monitor: 'Number of current real-time channel participants' }
              ].map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-3 font-medium text-purple-800">{item.component}</td>
                  <td className="p-3 text-gray-600">{item.status}</td>
                  <td className="p-3 text-gray-800">{item.monitor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDiagnosticsSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-orange-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🧠 Advanced Diagnostic Checks
          <InfoIcon consequences="Missing advanced diagnostics prevents early detection of performance bottlenecks, sync storms, and cascading failures that can bring down the entire real-time system." />
        </h3>
        
        <div className="grid gap-4">
          {[
            { metric: '⚡ Channel Subscriptions', output: '38 active channels, 5 high-traffic (e.g. /feed, /admin, /chat/user:123)' },
            { metric: '🔁 Missed Events Log', output: 'User#555 missed 4 comments during offline, replayed via buffer ✅' },
            { metric: '❌ Stuck Listener Alert', output: '"StoryBoostSuccess" listener didn\'t respond – restart event hook' },
            { metric: '🕒 Sync Lag Spike Alert', output: 'Post sync delay jumped to 900ms for 20 users on mobile data' },
            { metric: '📈 Throughput Analytics', output: '15,800 events/min synced during peak (6 PM–7 PM GMT)' }
          ].map((item, index) => (
            <div key={index} className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <h4 className="font-medium text-orange-800 mb-2">{item.metric}</h4>
              <p className="text-sm text-orange-700 font-mono bg-orange-100 p-2 rounded">{item.output}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFailureResistanceSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🛡️ Failure-Resistant Sync Logic (Best Practice Strategy)
          <InfoIcon consequences="Without failure resistance, network interruptions cause permanent data loss, unsent messages, missed notifications, and broken user workflows that cannot recover." />
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { layer: '💾 Local Cache', redundancy: 'Cache unsynced updates in client storage (e.g. localForage, IndexedDB)' },
            { layer: '🔄 Delta Resync', redundancy: 'If client goes offline >1 minute, pull updated feed delta on reconnect' },
            { layer: '📶 Low-Bandwidth Mode', redundancy: 'Strip visuals / reduce presence pings to reduce payload' },
            { layer: '🧪 Heartbeat Ping', redundancy: 'Ping server every 15–30s to confirm user still connected' },
            { layer: '🔄 Fallback Polling', redundancy: 'If socket fails, switch to polling (/changes/check) every 5s' },
            { layer: '📤 Upload Retry Buffer', redundancy: 'Posts/replies made offline get auto-synced when online again' }
          ].map((item, index) => (
            <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h4 className="font-medium text-red-800 mb-2">{item.layer}</h4>
              <p className="text-sm text-red-700">{item.redundancy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPresenceSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-cyan-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          👥 User Presence Map System
          <InfoIcon consequences="Poor presence tracking creates confusion about who's online, breaks collaboration features, and reduces engagement by hiding active community members." />
        </h3>
        
        <div className="grid gap-4">
          {[
            { feature: '🧍‍♂️ User Tracker', purpose: '"You + 4 others are viewing this post"' },
            { feature: '🗺️ Geo Presence', purpose: '"50 users in Albania browsing /Marketplace"' },
            { feature: '💬 Typing Indicator', purpose: 'Real-time per chatroom or comment reply' },
            { feature: '👁️ Viewers on Story', purpose: '"Alex + 13 others viewed this story"' },
            { feature: '🔧 Toggle for Stealth Mode', purpose: '(If privacy enabled — appear offline)' }
          ].map((item, index) => (
            <div key={index} className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
              <h4 className="font-medium text-cyan-800 mb-2">{item.feature}</h4>
              <p className="text-sm text-cyan-700">{item.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-pink-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🔐 Security and Abuse Checks
          <InfoIcon consequences="Inadequate security checks allow real-time channel hijacking, DDoS attacks, unauthorized presence spoofing, and data breaches through socket manipulation." />
        </h3>
        
        <div className="grid gap-4">
          {[
            { check: '🚫 Rate Throttle', desc: 'Prevent 100+ realtime writes/sec (anti-DDoS)' },
            { check: '📛 Fake Presence Blocker', desc: 'Confirm presence session must be backed by valid session token' },
            { check: '🧬 Channel Isolation', desc: 'Authenticated users only join allowed channel (e.g. only /chat:123 if they belong to it)' },
            { check: '⛔ Socket Hijack Protection', desc: 'Socket payloads contain JWT + user ID match' },
            { check: '👨‍💻 Admin Channel Lock', desc: 'Only admin role allowed to connect to /admin channel' }
          ].map((item, index) => (
            <div key={index} className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <h4 className="font-medium text-pink-800 mb-2">{item.check}</h4>
              <p className="text-sm text-pink-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProFeaturesSection = () => (
    <div className="space-y-6">
      <div className="bg-white border-l-4 border-indigo-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🧠 Bonus Pro-Level Features
          <InfoIcon consequences="Missing pro-level features limits scalability, prevents advanced debugging, reduces system reliability, and creates maintenance overhead during critical incidents." />
        </h3>
        
        <div className="grid gap-4">
          {[
            { feature: '📈 Sync Stress Simulator', desc: 'Test 10,000 event spike to see how system handles live sync under pressure' },
            { feature: '💾 Offline Mode Support', desc: 'Allow drafts/posts/comments to queue offline and sync after reconnect' },
            { feature: '🧠 AI Retry Optimizer', desc: 'AI decides when to retry sync (instantly vs batched vs background)' },
            { feature: '🔧 Realtime Inspector Tool', desc: 'Admins can view who\'s connected where, what they\'re syncing, and test latency per user' },
            { feature: '🧪 Versioned Event Stream', desc: 'Store latest 20 synced events per user to validate delivery and audit problems' }
          ].map((item, index) => (
            <div key={index} className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h4 className="font-medium text-indigo-800 mb-2">{item.feature}</h4>
              <p className="text-sm text-indigo-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    // Check if this is a real-time section that should show buttons + content
    const realtimeSection = realtimeSections.find(section => section.id === activeSection);
    
    if (realtimeSection) {
      // Show buttons + selected real-time component
      return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">⚡ Live Real-Time Features</h2>
            <div className="flex flex-wrap gap-3">
              {realtimeSections.map((section, index) => {
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
                    className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-all duration-300 border shadow-md hover:shadow-lg rounded-xl hover:scale-105 ${
                      activeSection === section.id
                        ? `${activeColorScheme} border-2`
                        : colorScheme
                    }`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          
          {/* Show selected real-time component content */}
          <div className="mt-8">
            {activeSection === 'posts-comments' && <PostsCommentsRealtime />}
            {activeSection === 'messaging-chat' && <MessagingChatRealtime />}
            {activeSection === 'user-presence' && <UserPresenceRealtime />}
            {activeSection === 'admin-dashboard' && <AdminDashboardRealtime />}
            {activeSection === 'marketplace-dating' && <MarketplaceDatingRealtime />}
            {activeSection === 'notifications' && <NotificationsRealtime />}
            {activeSection === 'admin-controls' && <AdminControlsRealtime />}
            {activeSection === 'analytics-usage' && <AnalyticsUsageRealtime />}
          </div>

          {/* Sync Definition Components */}
          <div className="mt-8">
            {activeSyncDefinition === 'postgres-changes' && <DatabaseChanges />}
            {activeSyncDefinition === 'broadcast-channels' && <RealtimeBroadcastChannels />}
            {activeSyncDefinition === 'presence-system' && <PresenceSystem />}
            {activeSyncDefinition === 'sync-buffer' && <SyncBufferLayer />}
            {activeSyncDefinition === 'mobile-sync' && <MobileListenerSync />}
            {activeSyncDefinition === 'retry-engine' && <RetryEngine />}
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'definitions': return (
        <div className="space-y-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">⚡ Live Real-Time Features</h2>
            <div className="flex flex-wrap gap-3">
              {realtimeSections.map((section, index) => {
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
                    className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-all duration-300 border shadow-md hover:shadow-lg rounded-xl hover:scale-105 ${colorScheme}`}
                  >
                    <span>{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          
          {/* Show Posts/Comments component by default for reference */}
          <div className="mt-8">
            <PostsCommentsRealtime />
          </div>
        </div>
      );
      case 'technologies': return renderTechnologiesSection();
      case 'monitoring': return renderMonitoringSection();
      case 'diagnostics': return renderDiagnosticsSection();
      case 'failure-resistance': return renderFailureResistanceSection();
      case 'presence': return renderPresenceSection();
      case 'security': return renderSecuritySection();
      case 'pro-features': return renderProFeaturesSection();
      
      default: return renderDefinitionsSection();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🌐 REAL-TIME SYNC SYSTEM – ULTRA SUPER PRO ENTERPRISE DIAGNOSTIC
          </h1>
          <p className="text-gray-600">
            Ensure instant updates, seamless presence tracking, and resilient multi-device communication — across posts, chats, user status, admin dashboards, and mobile/web platforms.
          </p>
        </div>

        {/* Informational Section Navigation */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">📋 System Information & Diagnostics</h2>
          <div className="flex flex-wrap gap-2">
            {informationalSections.map((section, index) => {
              const colorSchemes = [
                'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
                'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
                'bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 border-green-200',
                'bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200',
                'bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 border-red-200',
                'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
                'bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 border-pink-200',
                'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200'
              ];
              
              const activeColorSchemes = [
                'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-300',
                'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300',
                'bg-gradient-to-r from-zinc-100 to-zinc-200 text-zinc-800 border-zinc-300',
                'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 border-neutral-300',
                'bg-gradient-to-r from-stone-100 to-stone-200 text-stone-800 border-stone-300',
                'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300',
                'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300',
                'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300'
              ];

              const colorScheme = colorSchemes[index % colorSchemes.length];
              const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 font-medium text-xs transition-all duration-300 border shadow-sm hover:shadow-md rounded-lg hover:scale-105 ${
                    activeSection === section.id
                      ? `${activeColorScheme} border-2`
                      : colorScheme
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>


        {/* Section Content */}
        <div className="min-h-96">
          {renderSection()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CorePlatformRealTimeSync;