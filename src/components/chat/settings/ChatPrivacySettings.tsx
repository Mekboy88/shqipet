import React from 'react';
import { useChatSettings } from '@/contexts/ChatSettingsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserX,
  Trash2,
  Download,
  FileX,
  Globe,
  Users,
  MessageSquare,
  Key
} from 'lucide-react';

const ChatPrivacySettings: React.FC = () => {
  const {
    endToEndEncryption,
    onlineStatus,
    lastSeen,
    privacyReadReceipts,
    messageForwarding,
    groupInvites,
    dataBackup,
    analyticsSharing,
    screenSecurity,
    disappearingMessages,
    updateSetting
  } = useChatSettings();

  const privacyLevels = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'contacts', label: 'My Contacts' },
    { value: 'nobody', label: 'Nobody' }
  ];

  const disappearingOptions = [
    { value: 'off', label: 'Off' },
    { value: '24h', label: '24 hours' },
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' }
  ];

  return (
    <div className="space-y-6 max-h-full overflow-y-auto pr-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" style={{ scrollBehavior: 'smooth' }}>
      {/* Encryption & Security */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Encryption & Security</h3>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Secure
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">End-to-End Encryption</p>
              <p className="text-xs text-muted-foreground">Messages are encrypted and only you and recipients can read them</p>
            </div>
            <Switch checked={endToEndEncryption} onCheckedChange={(value) => updateSetting('endToEndEncryption', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Screen Security</p>
              <p className="text-xs text-muted-foreground">Prevent screenshots and screen recording</p>
            </div>
            <Switch checked={screenSecurity} onCheckedChange={(value) => updateSetting('screenSecurity', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Disappearing Messages</p>
            </div>
            <Select value={disappearingMessages} onValueChange={(value) => updateSetting('disappearingMessages', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {disappearingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Messages will automatically delete after the specified time
            </p>
          </div>

          {endToEndEncryption && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Key className="h-4 w-4" />
                <span className="text-sm font-medium">Your messages are protected</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                End-to-end encryption is active. Your messages are secure and private.
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Visibility Settings */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Visibility Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Online Status</p>
              <p className="text-xs text-muted-foreground">Show when you're online to other users</p>
            </div>
            <Switch checked={onlineStatus} onCheckedChange={(value) => updateSetting('onlineStatus', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Last Seen</p>
            </div>
            <Select value={lastSeen} onValueChange={(value) => updateSetting('lastSeen', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {privacyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Who can see when you were last active
            </p>
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Read Receipts</p>
              <p className="text-xs text-muted-foreground">Show when you've read messages</p>
            </div>
            <Switch checked={privacyReadReceipts} onCheckedChange={(value) => updateSetting('privacyReadReceipts', value)} />
          </div>
        </div>
      </Card>

      {/* Communication Settings */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Communication Settings</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Message Forwarding</p>
              <p className="text-xs text-muted-foreground">Allow others to forward your messages</p>
            </div>
            <Switch checked={messageForwarding} onCheckedChange={(value) => updateSetting('messageForwarding', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">Group Invites</p>
            </div>
            <Select value={groupInvites} onValueChange={(value) => updateSetting('groupInvites', value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {privacyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Who can add you to groups
            </p>
          </div>
        </div>
      </Card>

      {/* Data & Storage */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Data & Storage</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Data Backup</p>
              <p className="text-xs text-muted-foreground">Backup chat history to cloud storage</p>
            </div>
            <Switch checked={dataBackup} onCheckedChange={(value) => updateSetting('dataBackup', value)} />
          </div>
          
          <Separator className="bg-primary/10" />
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Analytics Sharing</p>
              <p className="text-xs text-muted-foreground">Share anonymous usage data to improve the app</p>
            </div>
            <Switch checked={analyticsSharing} onCheckedChange={(value) => updateSetting('analyticsSharing', value)} />
          </div>
        </div>
      </Card>

      {/* Data Management Actions */}
      <Card className="p-6 border-primary/10">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Data Management</h3>
        </div>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Chat History
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700" size="sm">
                <FileX className="h-4 w-4 mr-2" />
                Clear All Chat History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Chat History</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your chat messages and media. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Clear All Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700" size="sm">
                <UserX className="h-4 w-4 mr-2" />
                Delete Account & All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account and all associated data including messages, contacts, and settings. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Privacy Summary */}
      <Card className="p-6 border-primary/10 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Privacy Summary</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Security Level</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${endToEndEncryption ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span>{endToEndEncryption ? 'High Security' : 'Standard Security'}</span>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Visibility</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${onlineStatus ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
              <span>{onlineStatus ? 'Public Profile' : 'Private Profile'}</span>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Data Backup</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${dataBackup ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{dataBackup ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Message Retention</p>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${disappearingMessages !== 'off' ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
              <span>{disappearingMessages !== 'off' ? 'Temporary' : 'Permanent'}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatPrivacySettings;