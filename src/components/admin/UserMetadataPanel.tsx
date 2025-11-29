import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Clock, 
  Smartphone, 
  Monitor, 
  Globe,
  AlertTriangle,
  TrendingUp,
  Settings,
  Ban,
  UserMinus,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface UserMetadataPanelProps {
  user: any;
  threadDetails: any;
  onAction: (action: string) => void;
}

const UserMetadataPanel: React.FC<UserMetadataPanelProps> = ({
  user,
  threadDetails,
  onAction
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'thread' | 'actions'>('user');

  const getRiskScore = () => {
    // Mock risk scoring
    const score = Math.floor(Math.random() * 100);
    if (score > 70) return { score, color: 'text-red-400', bg: 'bg-red-500/20', trend: 'up' };
    if (score > 40) return { score, color: 'text-yellow-400', bg: 'bg-yellow-500/20', trend: 'stable' };
    return { score, color: 'text-green-400', bg: 'bg-green-500/20', trend: 'down' };
  };

  const riskData = getRiskScore();

  const tabs = [
    { id: 'user', label: 'User', icon: User },
    { id: 'thread', label: 'Thread', icon: Settings },
    { id: 'actions', label: 'Actions', icon: Zap }
  ];

  return (
    <div className="w-[320px] border-l border-[#272C30] bg-[#181C20] flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#272C30]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 p-3 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[#517DF3] border-b-2 border-[#517DF3] bg-[#517DF3]/5'
                : 'text-gray-400 hover:text-[#F4F5F6]'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <tab.icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'user' && (
          <>
            {/* User Profile */}
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#272C30] text-[#F4F5F6] text-lg">
                  {user?.user?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-[#F4F5F6] mb-1">{user?.user || 'Unknown User'}</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm">{user?.country || '🌍'}</span>
                {user?.type === 'pro' && (
                  <Badge className="bg-gradient-to-r from-[#517DF3] to-[#B077FF] text-white text-xs">
                    💎 Pro Member
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online now</span>
              </div>
            </div>

            <Separator className="bg-[#272C30]" />

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Status
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Email</span>
                  <Badge variant="outline" className="text-xs border-green-500 text-green-500">✅ Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Phone</span>
                  <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">📱 Pending</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">WhatsApp</span>
                  <Badge variant="outline" className="text-xs border-green-500 text-green-500">✅ Active</Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-[#272C30]" />

            {/* Risk Assessment */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Risk Score
              </h4>
              <div className={`p-3 rounded-lg ${riskData.bg} border border-current/20`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${riskData.color}`}>
                    {riskData.score}/100
                  </span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className={`h-3 w-3 ${riskData.color}`} />
                    <span className={`text-xs ${riskData.color}`}>{riskData.trend}</span>
                  </div>
                </div>
                <Progress value={riskData.score} className="h-2" />
                <p className="text-xs text-gray-400 mt-2">
                  Based on account age, activity patterns, and reported issues
                </p>
              </div>
            </div>

            <Separator className="bg-[#272C30]" />

            {/* Active Sessions */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Active Sessions
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-[#272C30] rounded-lg">
                  <Monitor className="h-4 w-4 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-xs text-[#F4F5F6]">Chrome on Windows</p>
                    <p className="text-xs text-gray-400">192.168.1.100 • 2m ago</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-[#272C30] rounded-lg">
                  <Smartphone className="h-4 w-4 text-green-400" />
                  <div className="flex-1">
                    <p className="text-xs text-[#F4F5F6]">Mobile App iOS</p>
                    <p className="text-xs text-gray-400">10.0.0.1 • 1h ago</p>
                  </div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'thread' && (
          <>
            {/* Thread Information */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3">Thread Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Type</span>
                  <Badge className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {threadDetails?.type || 'Support'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Status</span>
                  <Badge className="text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    {threadDetails?.status || 'Open'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Priority</span>
                  <Badge className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    {threadDetails?.priority || 'Medium'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Assigned</span>
                  <span className="text-xs text-[#F4F5F6]">Admin Sarah</span>
                </div>
              </div>
            </div>

            <Separator className="bg-[#272C30]" />

            {/* SLA Timer for Pro Users */}
            {user?.type === 'pro' && (
              <>
                <div>
                  <h4 className="text-sm font-medium text-[#F4F5F6] mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    SLA Timer
                  </h4>
                  <div className="p-3 bg-gradient-to-r from-[#517DF3]/10 to-[#B077FF]/10 border border-[#517DF3]/30 rounded-lg">
                    <div className="text-center mb-2">
                      <div className="text-2xl font-bold text-[#517DF3]">18:42</div>
                      <div className="text-xs text-gray-400">remaining for first response</div>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Pro SLA: 24 hours for first response
                    </p>
                  </div>
                </div>
                <Separator className="bg-[#272C30]" />
              </>
            )}

            {/* Thread Analytics */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3">Analytics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Messages</span>
                  <span className="text-xs text-[#F4F5F6]">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Duration</span>
                  <span className="text-xs text-[#F4F5F6]">2h 15m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Response Time</span>
                  <span className="text-xs text-green-400">2.3m avg</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'actions' && (
          <>
            {/* Quick Actions */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3">Thread Actions</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => onAction('flag')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Flag Thread
                </Button>
                <Button 
                  onClick={() => onAction('archive')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button 
                  onClick={() => onAction('escalate')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Escalate to Manager
                </Button>
              </div>
            </div>

            <Separator className="bg-[#272C30]" />

            {/* User Actions */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3">User Actions</h4>
              <div className="space-y-2">
                <Button 
                  onClick={() => onAction('mute')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-orange-400 border-orange-500/30 hover:bg-orange-500/10"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Mute User (24h)
                </Button>
                <Button 
                  onClick={() => onAction('ban')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-red-400 border-red-500/30 hover:bg-red-500/10"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User
                </Button>
                <Button 
                  onClick={() => onAction('diagnostic')}
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-green-400 border-green-500/30 hover:bg-green-500/10"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Send Diagnostic
                </Button>
              </div>
            </div>

            <Separator className="bg-[#272C30]" />

            {/* Assignment */}
            <div>
              <h4 className="text-sm font-medium text-[#F4F5F6] mb-3">Assignment</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-[#F4F5F6] border-[#272C30] hover:bg-white/5"
                >
                  <User className="h-4 w-4 mr-2" />
                  Assign to Admin
                </Button>
                <div className="text-xs text-gray-400 p-2 bg-[#272C30] rounded">
                  Currently assigned to: <span className="text-[#F4F5F6]">Admin Sarah</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserMetadataPanel;