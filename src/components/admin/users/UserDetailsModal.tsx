import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Calendar, Shield, Settings, Edit3, MapPin, Building, Clock, CheckCircle, XCircle, AlertCircle, Key, RefreshCw, Lock, Smartphone, MessageSquare, HelpCircle, DollarSign, CreditCard, Gift, Wallet, Users, TrendingUp, Download, Calculator, FileText } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFlagDropdown, setShowFlagDropdown] = useState(false);
  const [adminComments, setAdminComments] = useState('');
  const [caseNumbers, setCaseNumbers] = useState('CASE-2025-047, SEC-2025-012');
  const [ticketRefs, setTicketRefs] = useState('#SUP-2025-189, #COMP-456');
  const [complianceFlags, setComplianceFlags] = useState(['GDPR', 'COPPA', 'DMCA', 'VERIFIED']);
  const [modalHeight, setModalHeight] = useState(85);
  const [isResizing, setIsResizing] = useState(false);
  
  // Sample user data
  const userData = {
    id: 'USR-001',
    name: 'Andil Mekrizivani',
    email: 'a.mekrizivani@hotmail.com',
    phone: '+44 7888586667',
    avatar: 'AM',
    status: 'active',
    role: 'super_admin',
    joinDate: '20/07/2025',
    lastLogin: '2 hours ago',
    department: 'Marketing',
    location: 'London, UK',
    permissions: ['Read', 'Write', 'Comment', 'Download', 'Delete', 'Ban Users', 'Manage Content', 'Admin Panel'],
    stats: {
      photos: 247,
      videos: 89,
      marketplaceSales: 12,
      dating: 3,
      friends: 156,
      posts: 324,
      pages: 8
    }
  };

  // UPDATED TABS ARRAY WITH FINANCIALS
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'recovery', label: 'Recovery', icon: RefreshCw },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const windowHeight = window.innerHeight;
    const mouseY = e.clientY;
    const newHeight = Math.min(95, Math.max(50, (mouseY / windowHeight) * 100));
    setModalHeight(newHeight);
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Effect for resize event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  // Administrative handlers
  const handleCreateCase = () => {
    const newCaseNumber = `CASE-2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setCaseNumbers(prev => prev ? `${prev}, ${newCaseNumber}` : newCaseNumber);
    alert(`New case created: ${newCaseNumber}`);
  };

  const handleCreateTicket = () => {
    const newTicketNumber = `#SUP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    setTicketRefs(prev => prev ? `${prev}, ${newTicketNumber}` : newTicketNumber);
    alert(`New support ticket created: ${newTicketNumber}`);
  };

  const handleSaveComment = () => {
    if (adminComments.trim()) {
      const timestamp = new Date().toLocaleString();
      alert(`Comment saved at ${timestamp}:\n"${adminComments}"`);
      setAdminComments('');
    } else {
      alert('Please enter a comment before saving.');
    }
  };

  const handleRemoveFlag = (flagToRemove: string) => {
    setComplianceFlags(prev => prev.filter(flag => flag !== flagToRemove));
    alert(`Removed compliance flag: ${flagToRemove}`);
  };

  const handleAddFlag = (newFlag: string) => {
    if (!complianceFlags.includes(newFlag)) {
      setComplianceFlags(prev => [...prev, newFlag]);
      alert(`Added compliance flag: ${newFlag}`);
    }
    setShowFlagDropdown(false);
  };

  const handleExportNotes = () => {
    alert('Exporting administrative notes as PDF...\n\nThis would download a PDF file with all comments and timestamps.');
  };

  const handleComplianceReport = () => {
    alert('Generating compliance report...\n\nThis would create a detailed compliance status report for legal/audit purposes.');
  };

  // Financial handlers
  const handleDownloadPayslip = (month: string, year: string) => {
    alert(`📄 Downloading Payslip\n\nGenerating detailed payslip for ${month} ${year}...\n\n📊 Contents Include:\n• Gross Earnings: $2,847.50\n• Tax Deductions: $427.13\n• Net Earnings: $2,420.37\n• Affiliate Commissions: $156.80\n• Points Value: $23.45\n• Wallet Transactions: $89.12\n\n🔒 Security Features:\n• Digital signature\n• Tax authority compliant\n• Audit trail included\n\nDownloading: "Payslip_${month}_${year}_Andil_Mekrizivani.pdf"`);
  };

  const handleDownloadTaxReport = () => {
    alert('📋 Annual Tax Report\n\nGenerating comprehensive tax report for 2025...\n\n💰 EARNINGS SUMMARY:\n• Total Gross Income: $34,170.00\n• Total Tax Paid: $5,125.50\n• Net Income: $29,044.50\n• Affiliate Earnings: $1,881.60\n• Points Redemption: $281.40\n\n📊 TAX BREAKDOWN:\n• Federal Tax (15%): $5,125.50\n• State Tax (0%): $0.00\n• Social Security: $2,118.54\n• Medicare: $495.47\n\n📄 DOCUMENTS INCLUDED:\n• Form 1099-MISC\n• Quarterly statements\n• Deduction summaries\n• Audit trail logs\n\nDownloading: "Tax_Report_2025_Andil_Mekrizivani.pdf"');
  };

  const handleAddCredits = () => {
    const amount = prompt('💳 Add Credits to Wallet\n\nEnter amount to add (USD):');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      alert(`✅ Credits Added Successfully!\n\n💰 Transaction Details:\n• Amount: $${amount}\n• Processing Fee: $${(Number(amount) * 0.03).toFixed(2)} (3%)\n• Net Added: $${(Number(amount) * 0.97).toFixed(2)}\n• New Balance: $${(847.23 + parseFloat((Number(amount) * 0.97).toString())).toFixed(2)}\n• Transaction ID: TXN-${Date.now()}\n\nCredits will be available immediately.`);
    }
  };

  const handleWithdrawFunds = () => {
    alert('💸 Withdraw Funds\n\n💰 Available Balance: $847.23\n\n🏦 Withdrawal Options:\n• Bank Transfer (2-3 days): $0 fee\n• PayPal (Instant): 2.9% fee\n• Crypto (1 hour): 1% fee\n• Check (7-10 days): $5 fee\n\n📋 Requirements:\n• Minimum withdrawal: $25\n• Identity verification required\n• Tax forms may be needed\n\nSelect withdrawal method to continue...');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default: return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* Personal Information */}
            <div className="flex-1 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Full Name</label>
                  <p className="text-sm text-gray-900 font-medium">{userData.name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">User ID</label>
                  <p className="text-xs text-gray-700 font-mono">{userData.id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Email Address</label>
                  <p className="text-sm text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Phone Number</label>
                  <p className="text-sm text-gray-900">{userData.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Department</label>
                  <p className="text-sm text-gray-900">{userData.department}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Location</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    {userData.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="flex-1 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-500" />
                Account Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(userData.status)}
                    <span className="capitalize text-sm font-medium text-gray-900">{userData.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Role</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {userData.role}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Join Date</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    {userData.joinDate}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Last Login</label>
                  <p className="text-sm text-gray-900">{userData.lastLogin}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-7 gap-2">
              <div className="flex-1 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-200 text-center">
                <div className="text-lg font-bold text-emerald-700">{userData.stats.photos}</div>
                <div className="text-xs text-emerald-600 font-medium">Photos</div>
              </div>
              <div className="flex-1 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-200 text-center">
                <div className="text-lg font-bold text-blue-700">{userData.stats.videos}</div>
                <div className="text-xs text-blue-600 font-medium">Videos</div>
              </div>
              <div className="flex-1 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-200 text-center">
                <div className="text-lg font-bold text-purple-700">{userData.stats.marketplaceSales}</div>
                <div className="text-xs text-purple-600 font-medium">Sales</div>
              </div>
              <div className="flex-1 p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-200 text-center">
                <div className="text-lg font-bold text-red-700">{userData.stats.dating}</div>
                <div className="text-xs text-red-600 font-medium">Dating</div>
              </div>
              <div className="flex-1 p-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-lg border border-amber-200 text-center">
                <div className="text-lg font-bold text-amber-700">{userData.stats.friends}</div>
                <div className="text-xs text-amber-600 font-medium">Friends</div>
              </div>
              <div className="flex-1 p-3 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-lg border border-indigo-200 text-center">
                <div className="text-lg font-bold text-indigo-700">{userData.stats.posts}</div>
                <div className="text-xs text-indigo-600 font-medium">Posts</div>
              </div>
              <div className="flex-1 p-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg border border-teal-200 text-center">
                <div className="text-lg font-bold text-teal-700">{userData.stats.pages}</div>
                <div className="text-xs text-teal-600 font-medium">Pages</div>
              </div>
            </div>
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-4">
            <div className="flex-1 p-4 bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-xl border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {[
                  { action: 'Logged in to dashboard', time: '2 hours ago', type: 'login' },
                  { action: 'Updated profile information', time: '1 day ago', type: 'update' },
                  { action: 'Completed project milestone', time: '3 days ago', type: 'complete' },
                  { action: 'Joined new team workspace', time: '1 week ago', type: 'join' },
                  { action: 'Downloaded report file', time: '2 weeks ago', type: 'download' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/80 rounded-lg border border-gray-100">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'login' ? 'bg-green-400' :
                      activity.type === 'update' ? 'bg-blue-400' :
                      activity.type === 'complete' ? 'bg-purple-400' :
                      activity.type === 'download' ? 'bg-orange-400' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'permissions':
        const getAllPermissionsByRole = (userRole: string) => {
          const roleHierarchy: Record<string, string[]> = {
            'user': ['Read', 'Write', 'Comment'],
            'content_moderator': ['Read', 'Write', 'Comment', 'Moderate Posts', 'Review Content'],
            'photo_moderator': ['Read', 'Write', 'Comment', 'Moderate Photos', 'Delete Photos'],
            'video_moderator': ['Read', 'Write', 'Comment', 'Moderate Videos', 'Delete Videos'],
            'chat_moderator': ['Read', 'Write', 'Comment', 'Moderate Chat', 'Mute Users'],
            'marketplace_moderator': ['Read', 'Write', 'Comment', 'Moderate Sales', 'Review Products'],
            'dating_moderator': ['Read', 'Write', 'Comment', 'Moderate Dating', 'Review Profiles'],
            'forum_moderator': ['Read', 'Write', 'Comment', 'Moderate Forums', 'Pin Posts'],
            'event_moderator': ['Read', 'Write', 'Comment', 'Moderate Events', 'Create Events'],
            'group_moderator': ['Read', 'Write', 'Comment', 'Moderate Groups', 'Manage Groups'],
            'page_moderator': ['Read', 'Write', 'Comment', 'Moderate Pages', 'Edit Pages'],
            'live_moderator': ['Read', 'Write', 'Comment', 'Moderate Live', 'Control Streams'],
            'story_moderator': ['Read', 'Write', 'Comment', 'Moderate Stories', 'Delete Stories'],
            'news_moderator': ['Read', 'Write', 'Comment', 'Moderate News', 'Publish News'],
            'ad_moderator': ['Read', 'Write', 'Comment', 'Moderate Ads', 'Approve Ads'],
            'report_moderator': ['Read', 'Write', 'Comment', 'Review Reports', 'Handle Appeals'],
            'spam_moderator': ['Read', 'Write', 'Comment', 'Detect Spam', 'Auto-Delete Spam'],
            'security_moderator': ['Read', 'Write', 'Comment', 'Security Review', 'IP Blocking'],
            'community_moderator': ['Read', 'Write', 'Comment', 'Community Guidelines', 'User Education'],
            'senior_moderator': ['Read', 'Write', 'Comment', 'Delete', 'Ban Users', 'Manage Content', 'Supervise Mods'],
            'moderator': ['Read', 'Write', 'Comment', 'Delete', 'Ban Users', 'Manage Content'],
            'admin': ['Read', 'Write', 'Comment', 'Delete', 'Ban Users', 'Manage Content', 'Admin Panel', 'User Management'],
            'super_admin': ['Read', 'Write', 'Comment', 'Delete', 'Ban Users', 'Manage Content', 'Admin Panel', 'User Management', 'System Settings', 'Full Access']
          };
          return roleHierarchy[userRole] || roleHierarchy['user'];
        };

        const userPermissions = getAllPermissionsByRole(userData.role);
        
        return (
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-2 pr-2">
            <div className="p-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded border border-green-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-1">Role-Based Permissions</h4>
              
              {/* Current Role Display */}
              <div className="mb-1 p-1 bg-blue-50/80 rounded border border-blue-200">
                <div className="flex items-center gap-1 mb-0.5">
                  <Shield className="w-2.5 h-2.5 text-blue-500" />
                  <p className="text-xs font-medium text-gray-900">Current Role: {userData.role.replace('_', ' ').toUpperCase()}</p>
                </div>
                <p className="text-xs text-gray-600">This user has {userData.role.replace('_', ' ')} level access</p>
              </div>

              {/* Permissions List */}
              <div className="space-y-0.5 mb-1">
                {userPermissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2 p-1 bg-white/80 rounded border border-gray-100">
                    <CheckCircle className="w-2.5 h-2.5 text-green-500" />
                    <span className="text-xs text-gray-900">{permission}</span>
                  </div>
                ))}
              </div>

              {/* Role Hierarchy Plan */}
              <div className="p-1.5 bg-gray-50/80 rounded border border-gray-200">
                <h5 className="text-xs font-semibold text-gray-900 mb-1">📋 Complete Role Hierarchy Plan</h5>
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p><strong>👤 User:</strong> Basic read, write, comment permissions</p>
                  <p><strong>📝 Content Moderator:</strong> Moderate posts and review content</p>
                  <p><strong>📸 Photo Moderator:</strong> Moderate and delete photos</p>
                  <p><strong>🎥 Video Moderator:</strong> Moderate and delete videos</p>
                  <p><strong>💬 Chat Moderator:</strong> Moderate chat and mute users</p>
                  <p><strong>🛒 Marketplace Moderator:</strong> Moderate sales and review products</p>
                  <p><strong>💕 Dating Moderator:</strong> Moderate dating and review profiles</p>
                  <p><strong>🗣️ Forum Moderator:</strong> Moderate forums and pin posts</p>
                  <p><strong>🎉 Event Moderator:</strong> Moderate and create events</p>
                  <p><strong>👥 Group Moderator:</strong> Moderate and manage groups</p>
                  <p><strong>📄 Page Moderator:</strong> Moderate and edit pages</p>
                  <p><strong>🔴 Live Moderator:</strong> Moderate live streams and control streams</p>
                  <p><strong>📖 Story Moderator:</strong> Moderate and delete stories</p>
                  <p><strong>📰 News Moderator:</strong> Moderate and publish news</p>
                  <p><strong>📢 Ad Moderator:</strong> Moderate and approve advertisements</p>
                  <p><strong>🚨 Report Moderator:</strong> Review reports and handle appeals</p>
                  <p><strong>🛡️ Spam Moderator:</strong> Detect and auto-delete spam</p>
                  <p><strong>🔒 Security Moderator:</strong> Security review and IP blocking</p>
                  <p><strong>🌟 Community Moderator:</strong> Community guidelines and user education</p>
                  <p><strong>⭐ Senior Moderator:</strong> Supervise other moderators + full moderation</p>
                  <p><strong>🛠️ Moderator:</strong> Full content moderation and user management</p>
                  <p><strong>👑 Admin:</strong> Full moderation + admin panel + user management</p>
                  <p><strong>🔥 Super Admin:</strong> Complete system access + all permissions</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'financials':
        return (
          <div className="space-y-4">
            {/* My Earnings */}
            <div className="flex-1 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                My Earnings
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600">This Month</p>
                  <p className="text-xl font-bold text-green-700">$2,847.50</p>
                  <p className="text-xs text-green-600">+12.3% from last month</p>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600">Total Earned</p>
                  <p className="text-xl font-bold text-green-700">$34,170.00</p>
                  <p className="text-xs text-green-600">Lifetime earnings</p>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600">Tax Withheld</p>
                  <p className="text-lg font-bold text-orange-700">$5,125.50</p>
                  <p className="text-xs text-orange-600">15% federal rate</p>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600">Net Income</p>
                  <p className="text-lg font-bold text-blue-700">$29,044.50</p>
                  <p className="text-xs text-blue-600">After taxes</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => handleDownloadPayslip('September', '2025')}
                  className="px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download Payslip
                </button>
                <button 
                  onClick={handleDownloadTaxReport}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  Tax Report
                </button>
              </div>
            </div>

            {/* My Affiliates */}
            <div className="flex-1 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                My Affiliates
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100 text-center">
                  <p className="text-lg font-bold text-purple-700">47</p>
                  <p className="text-xs text-purple-600">Active Referrals</p>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100 text-center">
                  <p className="text-lg font-bold text-purple-700">$1,881.60</p>
                  <p className="text-xs text-purple-600">Commission Earned</p>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100 text-center">
                  <p className="text-lg font-bold text-purple-700">8.5%</p>
                  <p className="text-xs text-purple-600">Commission Rate</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-gray-600 mb-2">Top Performing Referrals:</div>
                <div className="space-y-1">
                  {['Sarah J. - $284.50', 'Mike R. - $192.30', 'Lisa K. - $156.80'].map((ref, i) => (
                    <div key={i} className="flex justify-between p-2 bg-white/60 rounded text-xs">
                      <span>{ref}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* My Points & Wallet */}
            <div className="grid grid-cols-2 gap-4">
              {/* My Points */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-amber-500" />
                  My Points
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Current Balance</p>
                    <p className="text-lg font-bold text-amber-700">12,847 pts</p>
                  </div>
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Points Value</p>
                    <p className="text-sm font-bold text-amber-700">$281.40</p>
                    <p className="text-xs text-amber-600">($0.022 per point)</p>
                  </div>
                  <button className="w-full px-3 py-2 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                    Redeem Points
                  </button>
                </div>
              </div>

              {/* Wallet & Credits */}
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-blue-500" />
                  Wallet & Credits
                </h4>
                <div className="space-y-2">
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Available Balance</p>
                    <p className="text-lg font-bold text-blue-700">$847.23</p>
                  </div>
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Pending Credits</p>
                    <p className="text-sm font-bold text-orange-700">$156.80</p>
                    <p className="text-xs text-orange-600">Processing</p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={handleAddCredits}
                      className="flex-1 px-2 py-2 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <CreditCard className="w-3 h-3" />
                      Add
                    </button>
                    <button 
                      onClick={handleWithdrawFunds}
                      className="flex-1 px-2 py-2 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Calculations */}
            <div className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl border border-red-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-red-500" />
                Tax Calculations & Reports
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Quarterly Tax Due</p>
                    <p className="text-lg font-bold text-red-700">$1,281.25</p>
                    <p className="text-xs text-red-600">Due: Dec 15, 2025</p>
                  </div>
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Annual Tax Estimate</p>
                    <p className="text-lg font-bold text-orange-700">$5,125.50</p>
                    <p className="text-xs text-orange-600">15% rate applied</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Deductions Available</p>
                    <p className="text-lg font-bold text-green-700">$1,247.80</p>
                    <p className="text-xs text-green-600">Business expenses</p>
                  </div>
                  <div className="p-2 bg-white/80 rounded border border-gray-100">
                    <p className="text-xs text-gray-600">Effective Tax Rate</p>
                    <p className="text-lg font-bold text-blue-700">12.8%</p>
                    <p className="text-xs text-blue-600">After deductions</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button 
                  onClick={() => alert('📊 Tax Calculator\n\nOpening interactive tax calculator...\n\n🧮 Features:\n• Real-time tax estimation\n• Deduction optimization\n• Quarterly payment planner\n• Tax bracket analysis\n• State tax calculations\n\nThis would open a detailed tax planning tool.')}
                  className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <Calculator className="w-3 h-3" />
                  Tax Calculator
                </button>
                <button 
                  onClick={() => alert('📋 Download All Tax Documents\n\nPreparing comprehensive tax package...\n\n📄 Documents Included:\n• Form 1099-MISC\n• Quarterly statements (Q1-Q4)\n• Annual earning summary\n• Deduction details\n• Payment history\n• Affiliate commission reports\n\n🔒 Security:\n• Password protected ZIP\n• Digital signatures\n• Audit trail included\n\nDownloading: "Tax_Documents_2025_Complete.zip"')}
                  className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download All
                </button>
                <button 
                  onClick={() => alert('📧 Email Tax Documents\n\nSending tax documents to registered email...\n\n📮 Email Details:\n• To: a.mekrizivani@hotmail.com\n• Subject: Your 2025 Tax Documents\n• Attachments: 8 files (PDF format)\n• Security: Password protected\n\n📄 Documents Sent:\n• Complete tax package\n• Payment receipts\n• Deduction summaries\n• Quarterly reports\n\nEmail sent successfully! Check your inbox.')}
                  className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Email Docs
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="flex-1 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-xl border border-red-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Key className="w-4 h-4 text-red-500" />
                Two-Factor Authentication
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">2FA Status</p>
                    <p className="text-xs text-gray-600">Currently disabled</p>
                  </div>
                  <button className="w-11 h-6 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform" />
                  </button>
                </div>
                
                {/* Albanian Language Suggestions */}
                <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-medium text-gray-900">Suggestions</p>
                  </div>
                  <p className="text-xs text-gray-700 mb-2">
                    Hey, Google, Microsoft dhe Twilio janë perfekte për të vendosur shtresën shtesë të sigurisë
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Enforce 2FA
                    </button>
                    <button className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Send Notification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recovery':
        return (
          <div className="space-y-4">
            <div className="flex-1 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-500" />
                Account Recovery Plan
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <p className="text-sm font-medium text-gray-900">Password Recovery</p>
                  </div>
                  <button className="w-full px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Send Password Reset Link
                  </button>
                </div>

                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <p className="text-sm font-medium text-gray-900">One-Time Password</p>
                  </div>
                  <button className="w-full px-3 py-2 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    Generate OTP Login
                  </button>
                </div>

                <div className="p-3 bg-white/80 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-medium text-gray-900">Quick Account Actions</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                      Freeze Account
                    </button>
                    <button className="flex-1 px-3 py-2 text-xs bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                      Suspend Access
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 space-y-2 pr-2">
            {/* Administrative Controls */}
            <div className="p-1.5 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded border border-red-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-red-500" />
                Administrative Controls
              </h4>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Override Privacy Settings</p>
                    <p className="text-xs text-gray-600">Admin view bypass user privacy</p>
                  </div>
                  <button className="w-7 h-3.5 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Bypass User Restrictions</p>
                    <p className="text-xs text-gray-600">Ignore user's blocking/restrictions</p>
                  </div>
                  <button className="w-7 h-3.5 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <p className="text-xs font-medium text-gray-900 mb-0.5">Administrative Notes</p>
                  <textarea 
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    className="w-full h-6 text-xs border border-gray-200 rounded p-0.5 resize-none"
                    placeholder="Internal notes about this user..."
                  />
                </div>
                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <p className="text-xs font-medium text-gray-900 mb-0.5">Internal Tags/Labels</p>
                  <input 
                    className="w-full text-xs border border-gray-200 rounded p-0.5"
                    placeholder="VIP, Problematic, Review Required..."
                  />
                </div>
              </div>
            </div>

            {/* Monitoring & Tracking */}
            <div className="p-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded border border-blue-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-1">
                <Settings className="w-2.5 h-2.5 text-blue-500" />
                Monitoring & Tracking
              </h4>
              <div className="space-y-0.5">
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Enhanced Logging</p>
                    <p className="text-xs text-gray-600">Track all user activities</p>
                  </div>
                  <button className="w-7 h-3.5 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Flag for Manual Review</p>
                    <p className="text-xs text-gray-600">Require admin approval</p>
                  </div>
                  <button className="w-7 h-3.5 bg-amber-500 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Content Approval Required</p>
                    <p className="text-xs text-gray-600">All content needs pre-approval</p>
                  </div>
                  <button className="w-7 h-3.5 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Special Monitoring Alerts</p>
                    <p className="text-xs text-gray-600">Send alerts for activities</p>
                  </div>
                  <button className="w-7 h-3.5 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Moderation Controls */}
            <div className="p-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded border border-amber-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-amber-500" />
                Moderation Controls
              </h4>
              <div className="space-y-0.5">
                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <p className="text-xs font-medium text-gray-900 mb-0.5">Posting Limits</p>
                  <div className="grid grid-cols-2 gap-0.5">
                    <input 
                      className="text-xs border border-gray-200 rounded p-0.5"
                      placeholder="Posts/day"
                      type="number"
                    />
                    <input 
                      className="text-xs border border-gray-200 rounded p-0.5"
                      placeholder="Comments/hour"
                      type="number"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-1 bg-white/80 rounded border border-gray-100">
                  <div>
                    <p className="text-xs font-medium text-gray-900">Shadow Ban Status</p>
                    <p className="text-xs text-gray-600">Hide user content</p>
                  </div>
                  <button className="w-7 h-3.5 bg-gray-300 rounded-full relative transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform" />
                  </button>
                </div>
                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <p className="text-xs font-medium text-gray-900 mb-0.5">Warning Level</p>
                  <select className="w-full text-xs border border-gray-200 rounded p-0.5">
                    <option>No Warning</option>
                    <option>Level 1 - Verbal Warning</option>
                    <option>Level 2 - Written Warning</option>
                    <option>Level 3 - Final Warning</option>
                    <option>Level 4 - Suspension Ready</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Administrative Metadata */}
            <div className="p-1.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded border border-purple-200">
              <h4 className="text-xs font-semibold text-gray-900 mb-1 flex items-center gap-1">
                <HelpCircle className="w-2.5 h-2.5 text-purple-500" />
                Administrative Metadata
              </h4>
              <div className="space-y-0.5">
                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium text-gray-900">Internal Case Numbers</p>
                    <button 
                      onClick={handleCreateCase}
                      className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      + New Case
                    </button>
                  </div>
                  <input 
                    className="w-full text-xs border border-gray-200 rounded p-0.5 mb-0.5"
                    placeholder="CASE-2025-001, TICKET-12345..."
                    value={caseNumbers}
                    onChange={(e) => setCaseNumbers(e.target.value)}
                  />
                  <div className="flex gap-0.5">
                    <button 
                      onClick={() => alert('🔗 Case Linking Interface\n\nSearching internal case management system...\n\nFound 3 related cases:\n• CASE-2024-891 - Account Security Review\n• CASE-2025-012 - Privacy Complaint\n• SEC-2024-456 - Data Access Request\n\nSelect a case to link to this user.\n\n[This would open a searchable interface to find and link existing cases from your case management system like Salesforce, ServiceNow, or Jira]')}
                      className="px-1 py-0.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Link Case
                    </button>
                    <button 
                      onClick={() => alert('📋 Case Management System\n\nOpening detailed case view...\n\nCASE-2025-047:\n• Status: In Progress\n• Priority: High\n• Assigned: John Smith\n• Created: 2025-09-05\n• Last Update: 2025-09-09\n• Description: User account security review\n• Attachments: 3 files\n• Comments: 8 entries\n\n[This would redirect to your case management system or open a detailed modal with full case information, timeline, and collaboration tools]')}
                      className="px-1 py-0.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                
                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium text-gray-900">Support Ticket References</p>
                    <button 
                      onClick={handleCreateTicket}
                      className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                    >
                      + New Ticket
                    </button>
                  </div>
                  <input 
                    className="w-full text-xs border border-gray-200 rounded p-0.5 mb-0.5"
                    placeholder="#SUP-001, #COMPLAINT-456..."
                    value={ticketRefs}
                    onChange={(e) => setTicketRefs(e.target.value)}
                  />
                </div>

                <div className="p-1 bg-white/80 rounded border border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-medium text-gray-900">Compliance Flags</p>
                    <div className="relative">
                      <button 
                        onClick={() => setShowFlagDropdown(!showFlagDropdown)}
                        className="px-1.5 py-0.5 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                      >
                        + Flag
                      </button>
                      {showFlagDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg z-10 w-32">
                          {['GDPR', 'COPPA', 'PCI-DSS', 'HIPAA', 'SOX', 'CCPA'].map((flag) => (
                            <button
                              key={flag}
                              onClick={() => handleAddFlag(flag)}
                              className="block w-full px-2 py-1 text-xs text-left hover:bg-gray-100"
                            >
                              {flag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-0.5">
                    {complianceFlags.map((flag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-1.5 py-0.5 text-xs bg-purple-100 text-purple-800 rounded cursor-pointer hover:bg-purple-200"
                        onClick={() => handleRemoveFlag(flag)}
                      >
                        {flag}
                        <X className="w-2 h-2 ml-1" />
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-0.5 mt-1">
                  <button 
                    onClick={handleSaveComment}
                    className="px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Save Comment
                  </button>
                  <button 
                    onClick={handleExportNotes}
                    className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Export
                  </button>
                  <button 
                    onClick={handleComplianceReport}
                    className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                  >
                    Compliance
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
    >
      {/* Resize Handle */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gray-400 rounded-full cursor-ns-resize opacity-60 hover:opacity-80 transition-opacity"
        onMouseDown={handleResizeStart}
        style={{ marginTop: '10px' }}
      />

      <div 
        className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[95vw] max-w-7xl relative flex flex-col"
        style={{ height: `${modalHeight}vh`, minHeight: '700px', maxHeight: '95vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userData.avatar}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-sm text-gray-600">Detailed User Management</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;