import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Info, Puzzle, Palette, Sparkles, RotateCcw, AlertTriangle, Settings, Briefcase, Smartphone, Lock } from 'lucide-react';

const CorePlatformVisuals: React.FC = () => {
  const [activeSection, setActiveSection] = useState('objectives');

  const sections = [
    { id: 'objectives', label: 'Core Objectives', icon: Puzzle },
    { id: 'theme', label: 'Theme System', icon: Palette },
    { id: 'pro-visuals', label: 'Pro Visual Elements', icon: Sparkles },
    { id: 'animation', label: 'Animation System', icon: RotateCcw },
    { id: 'qa', label: 'Visual QA Module', icon: AlertTriangle },
    { id: 'settings', label: 'User Settings', icon: Settings },
    { id: 'admin', label: 'Admin Controls', icon: Briefcase },
    { id: 'cross-platform', label: 'Cross-Platform', icon: Smartphone },
    { id: 'security', label: 'Security & Anti-Exploit', icon: Lock }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'objectives':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor visual system leads to inconsistent user experience, reduced engagement, and inability to differentiate premium features.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objective</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🌈 Multi-theme Switching</td><td className="px-6 py-4">Dynamic theme selection with instant application</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💠 Pro-Only Visual Effects</td><td className="px-6 py-4">Exclusive UI enhancements for paid tiers</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">⚙️ Realtime UX Animation Handling</td><td className="px-6 py-4">Glitch-free transitions and micro-interaction effects</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🪞 Profile Visual Layers</td><td className="px-6 py-4">Stackable UI visuals per tier or mood</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🎯 Device Adaptive Design</td><td className="px-6 py-4">Mobile/tablet/desktop perfect syncing</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔍 Visual Testing & QA Engine</td><td className="px-6 py-4">Detect glitches or layout shifts</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧠 Emotion-Aware (Optional)</td><td className="px-6 py-4">Suggest themes based on usage/mood (for AI+ users)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'theme':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Inadequate theme system results in generic appearance, poor brand differentiation, and reduced user customization satisfaction.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔹 Available Theme Layers</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Theme Type</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tier</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Colors</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-4 py-2 font-semibold">Default Light</td><td className="px-4 py-2">All</td><td className="px-4 py-2">Sky Blue / White</td><td className="px-4 py-2">Fastest, clean UX</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Default Dark</td><td className="px-4 py-2">All</td><td className="px-4 py-2">Charcoal / Blue</td><td className="px-4 py-2">Night-safe, clean contrast</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Sapphire Pro</td><td className="px-4 py-2">Low Pro+</td><td className="px-4 py-2">Neon Sky</td><td className="px-4 py-2">Glowing UI ring, card shine</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Obsidian</td><td className="px-4 py-2">Medium Pro+</td><td className="px-4 py-2">Matte Black</td><td className="px-4 py-2">Luxury dark mode with gold accent</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Aurora Pulse</td><td className="px-4 py-2">Super Pro</td><td className="px-4 py-2">Gradient Aurora</td><td className="px-4 py-2">Animated gradient, pulsing buttons</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Solar Tech</td><td className="px-4 py-2">Super Pro+</td><td className="px-4 py-2">Plasma Yellow</td><td className="px-4 py-2">Grid-style, sharp interface lines</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Mono AI Skin</td><td className="px-4 py-2">AI+ only</td><td className="px-4 py-2">Greyscale AI</td><td className="px-4 py-2">Smooth neutral, minimal</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🧬 Key Theme Capabilities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 mb-2">🎛️ Live Preview Toggle</h4>
                  <p className="text-sm text-gray-700">Preview before applying, stored in local & server</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-gray-900 mb-2">🔄 Persisted via Supabase Profile</h4>
                  <p className="text-sm text-gray-700">Theme saved in profiles.theme_id</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-gray-900 mb-2">🔁 Instant Sync</h4>
                  <p className="text-sm text-gray-700">Updates propagate without full reload</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-gray-900 mb-2">🧪 Beta Theme Access</h4>
                  <p className="text-sm text-gray-700">Admin can release new themes only to selected users</p>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-500">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Admin-Controlled Availability</h4>
                  <p className="text-sm text-gray-700">Show/hide themes per Pro tier, holiday, or event</p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'pro-visuals':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Lack of premium visual elements reduces subscription value perception and limits revenue from visual customization features.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visual Element</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">✨ Shimmer Avatar Ring</td><td className="px-6 py-4">Medium+</td><td className="px-6 py-4">Animated avatar ring during hover</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🌟 Glow Profile Outline</td><td className="px-6 py-4">Super Pro</td><td className="px-6 py-4">Outer glow around profile cards</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧿 AI-Powered Mood Bubble</td><td className="px-6 py-4">AI+</td><td className="px-6 py-4">Bubble color changes with post emotion</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧑‍🎤 Custom Badge Designer</td><td className="px-6 py-4">Super Pro</td><td className="px-6 py-4">Design own status badge with effects</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🖼️ Theme-Responsive Banners</td><td className="px-6 py-4">All</td><td className="px-6 py-4">Headers auto-match selected theme colors</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🌀 Hover-Spin Effects</td><td className="px-6 py-4">Optional</td><td className="px-6 py-4">Subtle spin for Pro tools icons</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔊 Micro Sound Feedback</td><td className="px-6 py-4">All</td><td className="px-6 py-4">Optional hover/click UI feedback</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'animation':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor animation system causes jarring transitions, performance issues, and accessibility problems for motion-sensitive users.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌀 Transitions</h3>
                <p className="text-gray-700">Smooth, 60fps, low-GPU cost transitions between pages and modals</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🧩 Framer Motion</h3>
                <p className="text-gray-700">Used for component animations (React-native/web compatible)</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💾 Controlled via Supabase</h3>
                <p className="text-gray-700">Store animation preferences per user</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Toggle in Settings</h3>
                <p className="text-gray-700">"Reduced motion" for accessibility & battery mode</p>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">✅ Visual transitions should never introduce layout shift or z-index stacking issues.</p>
            </div>
          </div>
        );
        
      case 'qa':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Missing visual QA leads to layout bugs, broken animations, and poor user experience across different devices and browsers.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QA Feature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔍 Glitch Detection</td><td className="px-6 py-4">Track CSS animations that break UI</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💥 Animation Stress Tests</td><td className="px-6 py-4">Run visual loops 1000x per component</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📏 Pixel Grid Check</td><td className="px-6 py-4">Detect offset/misaligned buttons, borders</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧠 AI Layout Monitor (Optional)</td><td className="px-6 py-4">Auto-detect weird component overlap</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧪 Visual Snapshot Diff Tool</td><td className="px-6 py-4">Compare render before/after in CI/CD</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">✅ Integrated with Supabase Logs for real-time detection per user if visual bugs are reported.</p>
            </div>
          </div>
        );
        
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Limited user customization options reduce engagement and personalization, leading to generic user experience.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🌈 Select Theme</td><td className="px-6 py-4">Dropdown</td><td className="px-6 py-4">Choose any unlocked theme</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">✨ Enable Visual FX</td><td className="px-6 py-4">Toggle</td><td className="px-6 py-4">Turn on glow, shimmer, pulse</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🎛️ Adjust Animation</td><td className="px-6 py-4">Slider</td><td className="px-6 py-4">Speed: Slow &gt; Normal &gt; Fast</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔊 Sound Feedback</td><td className="px-6 py-4">Toggle</td><td className="px-6 py-4">On/Off for UI interaction sounds</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🖌️ Custom Palette</td><td className="px-6 py-4">Pro+</td><td className="px-6 py-4">Choose your own UI accent color</td></tr>
                </tbody>
              </table>
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
                <p className="text-blue-800 text-sm">Inadequate admin controls prevent effective theme management, bug tracking, and performance optimization across the platform.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🔒 Lock Themes by Tier</h4>
                <p className="text-sm text-gray-700">Choose who sees what themes</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧩 Add New Theme</h4>
                <p className="text-sm text-gray-700">Theme name, palette, CSS vars, asset upload</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧠 Analyze Theme Popularity</h4>
                <p className="text-sm text-gray-700">See user distribution per theme</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">💥 Report Theme Bugs</h4>
                <p className="text-sm text-gray-700">View glitch logs auto-submitted</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧪 Toggle Beta Access Theme</h4>
                <p className="text-sm text-gray-700">Enable test groups per user role</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">📊 Color Use Heatmap</h4>
                <p className="text-sm text-gray-700">What color combos users click most</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">📈 Animation Lag Reports</h4>
                <p className="text-sm text-gray-700">GPU/Render performance metrics per device type</p>
              </div>
            </div>
          </div>
        );
        
      case 'cross-platform':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor cross-platform optimization leads to inconsistent experiences, performance issues, and reduced accessibility on different devices.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">Mobile App</td><td className="px-6 py-4">Reduce animation load, prioritize native feel, theme stored locally & Supabase</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">Web App</td><td className="px-6 py-4">Full effect stack enabled</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">Tablet</td><td className="px-6 py-4">Larger layout UI switching (flex/grid auto-adapt)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">Low-power Mode</td><td className="px-6 py-4">Fall back to static themes, skip glow</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">✅ Themes and visual effects auto-scale based on device + network speed.</p>
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
                <p className="text-blue-800 text-sm">Security vulnerabilities in visual system enable CSS injection attacks, visual spoofing, and abuse of premium features.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔗 Injected Theme URL</td><td className="px-6 py-4">Strip & sanitize input</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧪 Malicious Custom CSS</td><td className="px-6 py-4">Block on render (server side)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧩 Abusive FX Combinations</td><td className="px-6 py-4">Limit CPU-heavy stacking</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🎭 Avatar Ring Spoofing</td><td className="px-6 py-4">Only Pro users can load glow assets</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🐞 Theme Overlap Glitch</td><td className="px-6 py-4">Auto reset + Supabase session sync fallback</td></tr>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ultra Super Pro Visual & Theme System</h1>
          <p className="text-lg text-gray-600">"Style meets precision. Performance meets personalization."</p>
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
        
        {/* Content Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          {renderSection()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CorePlatformVisuals;