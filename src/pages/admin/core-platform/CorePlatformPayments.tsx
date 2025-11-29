import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Info, Layers, Briefcase, FileText, Lightbulb, Settings, Receipt, DollarSign, CreditCard, RotateCcw, Brain, Puzzle, Wrench, Globe } from 'lucide-react';

const CorePlatformPayments: React.FC = () => {
  const [activeSection, setActiveSection] = useState('objectives');

  const sections = [
    { id: 'objectives', label: 'Core Objectives', icon: Layers },
    { id: 'architecture', label: 'System Architecture', icon: Briefcase },
    { id: 'database', label: 'Database Structure', icon: FileText },
    { id: 'configuration', label: 'Plan Configuration', icon: Lightbulb },
    { id: 'stripe', label: 'Stripe Integration', icon: Settings },
    { id: 'paypal', label: 'PayPal Integration', icon: Receipt },
    { id: 'trials', label: 'Trial Handling', icon: DollarSign },
    { id: 'refunds', label: 'Refund Flow', icon: CreditCard },
    { id: 'recovery', label: 'Auto-Retry & Recovery', icon: RotateCcw },
    { id: 'analytics', label: 'Analytics & Insights', icon: Brain },
    { id: 'access', label: 'Feature Access Control', icon: Puzzle },
    { id: 'developer', label: 'Developer Tools', icon: Wrench },
    { id: 'international', label: 'Internationalization', icon: Globe }
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
                <p className="text-blue-800 text-sm">Incomplete payment system leads to revenue loss, user frustration, and platform abandonment due to poor subscription management.</p>
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
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💰 Multi-tier Subscriptions</td><td className="px-6 py-4">Free, Low Pro, Medium Pro, Super Pro</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔁 Recurring Billing</td><td className="px-6 py-4">Auto-renewal monthly, quarterly, yearly</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💳 Multi-Payment Gateway</td><td className="px-6 py-4">Stripe, PayPal, Local methods optional</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🛂 Region & Tax Support</td><td className="px-6 py-4">VAT, currency by country</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧪 Trial & Discount Handling</td><td className="px-6 py-4">Free trial periods, promo codes</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📲 In-App & Web Sync</td><td className="px-6 py-4">Same status across all devices</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📦 Refund, Webhook, Retry Flow</td><td className="px-6 py-4">Full lifecycle support</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'architecture':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor system architecture causes payment failures, data inconsistencies, and inability to scale with growing user base.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stack / Tool</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💳 Billing Gateway</td><td className="px-6 py-4">Stripe (primary) + PayPal (backup/optional)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📦 Backend Handler</td><td className="px-6 py-4">Supabase Edge Functions + Webhooks</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📁 Subscription Tables</td><td className="px-6 py-4">user_subscriptions, subscription_plans, payment_logs</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧾 Invoice/Tax Layer</td><td className="px-6 py-4">Stripe Billing + Tax API</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔄 Real-Time Sync</td><td className="px-6 py-4">Supabase Realtime + user_roles</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔐 Role Locking Logic</td><td className="px-6 py-4">Supabase RLS policies by Pro tier</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🌍 Currency Support</td><td className="px-6 py-4">Auto-convert via Stripe multi-currency</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📬 Notification Channel</td><td className="px-6 py-4">Email, WhatsApp, in-app (on payment success/failure)</td></tr>
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
                <p className="text-blue-800 text-sm">Inadequate database structure leads to payment tracking failures, subscription state conflicts, and audit trail gaps.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-lg shadow-sm border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">subscription_plans</td><td className="px-6 py-4">Stores metadata about plans (name, tier, features, price)</td></tr>
                    <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">user_subscriptions</td><td className="px-6 py-4">One row per user's active/expired plan</td></tr>
                    <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">payment_logs</td><td className="px-6 py-4">Every Stripe or PayPal transaction</td></tr>
                    <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">refund_requests</td><td className="px-6 py-4">Tracks refund reason, approval, resolution</td></tr>
                    <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">trial_tracker</td><td className="px-6 py-4">Logs trial starts, days remaining, and usage flags</td></tr>
                    <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">feature_unlocks</td><td className="px-6 py-4">Optional: features granted per subscription (e.g., tokens)</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">✅ All tied together by user_id and subscription_id</p>
              </div>
            </div>
          </div>
        );
        
      case 'configuration':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Inflexible plan configuration prevents rapid market adaptation and competitive pricing strategies.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Configurable Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🏷️ Plan Name</td><td className="px-6 py-4">Free / Low Pro / Medium Pro / Super Pro</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💵 Price (monthly, annual)</td><td className="px-6 py-4">In any currency (Stripe auto-exchange supported)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧪 Trial Days</td><td className="px-6 py-4">Optional free trial (e.g., 7 or 14 days)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔄 Auto-renewal toggle</td><td className="px-6 py-4">On/off switch per plan</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">📦 Bonus Token Amount</td><td className="px-6 py-4">e.g., 10 Boost tokens/month</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔒 Feature Unlock Flags</td><td className="px-6 py-4">Which tools are unlocked</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💬 Visibility Scope</td><td className="px-6 py-4">Admin-only, or public page display</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'stripe':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Improper Stripe integration causes payment failures, subscription sync issues, and security vulnerabilities.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ultra-Pro Payment Flow</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">User clicks Subscribe</h4>
                    <p className="text-sm text-gray-600">Subscription flow initiated</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Frontend calls Stripe Checkout Session API</h4>
                    <p className="text-sm text-gray-600">Secure session creation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">User completes payment securely on Stripe.com</h4>
                    <p className="text-sm text-gray-600">PCI-compliant payment processing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Stripe Webhook → Supabase Edge Function</h4>
                    <p className="text-sm text-gray-600">Real-time event processing</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold">Updates user_subscriptions table</h4>
                    <p className="text-sm text-gray-600">Database synchronization</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold">Trigger in-app success, assign Pro Role, unlock features</h4>
                    <p className="text-sm text-gray-600">Feature activation</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-green-800 font-medium">✅ Verified and secured via JWT tokens + signed webhook secrets.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Stripe Events You Handle</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Event</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-4 py-2 font-semibold">checkout.session.completed</td><td className="px-4 py-2">Start subscription, assign role</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">invoice.paid</td><td className="px-4 py-2">Renew plan, grant next month's tokens</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">invoice.payment_failed</td><td className="px-4 py-2">Notify user, start retry logic</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">customer.subscription.deleted</td><td className="px-4 py-2">Downgrade plan, revoke access</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">charge.refunded</td><td className="px-4 py-2">Cancel features, update refund logs</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'paypal':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Missing PayPal integration excludes significant user base who prefer alternative payment methods.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">PayPal Integration Flow</h3>
                <p className="text-gray-700 mb-4">Same flow as Stripe, but uses PayPal SDK (JS) or server API</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Requires additional webhook URL for PayPal IPN or REST API</li>
                  <li>• Store PayPal transaction_id, refund status, plan info</li>
                  <li>• Maintain consistency with Stripe event handling</li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'trials':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor trial management results in user confusion, lost conversions, and billing disputes.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">⏳ Trial Tracker Table</td><td className="px-6 py-4">Logs start date, plan, and used features</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔄 Auto Convert After Trial</td><td className="px-6 py-4">If card on file, auto-convert to paid tier</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔔 Trial Ending Reminder</td><td className="px-6 py-4">3 days and 1 day before</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🛑 Expiry Action</td><td className="px-6 py-4">Downgrade to Free + log "Trial Ended" status</td></tr>
                </tbody>
              </table>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">✅ Fully visible in Admin Panel</p>
            </div>
          </div>
        );
        
      case 'refunds':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Inefficient refund process damages customer trust and increases manual support workload.</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Flow & Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">🙋 User Requests Refund</h4>
                    <p className="text-sm text-gray-600">Through support or settings page</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">🧾 Log Refund Reason</h4>
                    <p className="text-sm text-gray-600">Store reason & timestamp</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">🤖 Auto-Refund Eligible?</h4>
                    <p className="text-sm text-gray-600">Within 48h = auto, else pending review</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">🧑‍⚖️ Admin Manual Refund</h4>
                    <p className="text-sm text-gray-600">Via Stripe/PayPal + update payment_logs</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <h4 className="font-semibold">📉 Downgrade Plan</h4>
                    <p className="text-sm text-gray-600">Disable Pro tools, revoke roles</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                  <div>
                    <h4 className="font-semibold">✅ Send Confirmation</h4>
                    <p className="text-sm text-gray-600">Via Email + in-app</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'recovery':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Poor payment recovery leads to unnecessary subscription cancellations and revenue loss from temporary payment issues.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">❌ Payment Failed</td><td className="px-6 py-4">Stripe retry 3 times (default)</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔔 Alert User</td><td className="px-6 py-4">Notify with retry link</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔒 Feature Freeze</td><td className="px-6 py-4">After 72h: freeze access, show warning</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">✅ Payment Resolved</td><td className="px-6 py-4">Restore full Pro features</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Lack of payment analytics prevents revenue optimization and strategic business decision making.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">📊 Total MRR</h4>
                <p className="text-sm text-gray-700">Monthly Recurring Revenue (e.g., £14,200)</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧍 Active Pro Users</h4>
                <p className="text-sm text-gray-700">Per tier breakdown</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">💸 Refund Rate</h4>
                <p className="text-sm text-gray-700">% this month</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🕓 Avg Lifetime Value</h4>
                <p className="text-sm text-gray-700">e.g., £27.95/user</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🔁 Auto-Renewal %</h4>
                <p className="text-sm text-gray-700">Renewal health per plan</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-indigo-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧾 Tax Breakdown</h4>
                <p className="text-sm text-gray-700">Per region</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border-l-4 border-pink-500 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">🧠 Feature Usage vs Plan</h4>
                <p className="text-sm text-gray-700">See what features drive retention</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">✅ Full charts with PostHog / Supabase dashboard or charting tool</p>
            </div>
          </div>
        );
        
      case 'access':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Improper feature access control enables unauthorized usage and undermines subscription revenue model.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔐 RLS Policy</td><td className="px-6 py-4">Enforce plan access to pages/features</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧠 Feature Mapping</td><td className="px-6 py-4">Flags per user: canUploadHDVideo: true</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔄 Sync via Hooks</td><td className="px-6 py-4">On plan change → refresh session + unlock/lock instantly</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🪙 Token Refills</td><td className="px-6 py-4">Monthly refill logic by plan type</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧼 Auto-Cleanup</td><td className="px-6 py-4">Expired plan? → Disable access, store logs</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'developer':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Missing developer tools hinder debugging, integration testing, and payment troubleshooting capabilities.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm border">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API/Tool</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">💳 /api/subscribe</td><td className="px-6 py-4">Frontend calls this for creating checkout</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔁 /api/renew</td><td className="px-6 py-4">Manual plan renewals</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🧾 /api/payment-history</td><td className="px-6 py-4">Fetch user logs</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap font-semibold">🔧 Webhook Debugger</td><td className="px-6 py-4">Test Stripe/PayPal events via mock</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'international':
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">CONSEQUENCES:</h4>
                <p className="text-blue-800 text-sm">Limited international support restricts global expansion and compliance with regional regulations.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-green-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💱 Auto Currency Convert</h3>
                <p className="text-gray-700">Stripe supports 135+ currencies</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Country Tax Settings</h3>
                <p className="text-gray-700">Stripe Tax auto-calculates VAT/GST</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-purple-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📜 Invoice Language</h3>
                <p className="text-gray-700">Locale-based receipt options</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-orange-500 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💶 Multi-Currency UI</h3>
                <p className="text-gray-700">Show users pricing in GBP, EUR, USD etc</p>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Top-World Subscription & Payments System</h1>
          <p className="text-lg text-gray-600">"Fully automated. Ultra secure. Creator-focused. Multi-tier revenue infrastructure."</p>
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

export default CorePlatformPayments;