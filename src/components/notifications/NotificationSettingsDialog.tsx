import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNotificationSettings, type CategoryChannelSettings, type PriorityLevel } from '@/contexts/NotificationSettingsContext';
import { 
  Bell, 
  Mail, 
  Smartphone,
  MessageSquare,
  Shield, 
  Clock,
  Volume2,
  Eye,
  Trash2,
  RotateCcw,
  Settings,
  CheckCircle2,
  AlertCircle,
  Globe,
  Download,
  AtSign,
  MessageCircle,
  Heart,
  Share2,
  UserPlus,
  Users,
  Calendar,
  ShoppingBag,
  Lightbulb,
  Lock,
  Zap,
  Moon,
  Vibrate,
  Type
} from 'lucide-react';

interface NotificationSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettingsDialog: React.FC<NotificationSettingsDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, resetSettings } = useNotificationSettings();
  const [activeTab, setActiveTab] = useState('channels');

  const updateCategoryChannel = (category: keyof typeof settings.categories, channel: keyof CategoryChannelSettings, value: boolean) => {
    updateSettings({
      categories: {
        ...settings.categories,
        [category]: {
          ...settings.categories[category],
          [channel]: value
        }
      }
    });
  };

  const categoryInfo = [
    { key: 'directMessages', label: 'Direct Messages', icon: MessageSquare, critical: true },
    { key: 'mentions', label: '@Mentions / Replies', icon: AtSign, critical: false },
    { key: 'comments', label: 'Comments on My Posts', icon: MessageCircle, critical: false },
    { key: 'reactions', label: 'Reactions/Likes', icon: Heart, critical: false },
    { key: 'shares', label: 'Shares/Reposts', icon: Share2, critical: false },
    { key: 'follows', label: 'Follows & Friend Requests', icon: UserPlus, critical: false },
    { key: 'groups', label: 'Group/Page Invites', icon: Users, critical: false },
    { key: 'events', label: 'Event Invites & Reminders', icon: Calendar, critical: false },
    { key: 'marketplace', label: 'Marketplace Updates', icon: ShoppingBag, critical: false },
    { key: 'recommendations', label: 'Recommendations', icon: Lightbulb, critical: false },
    { key: 'security', label: 'System & Security', icon: Shield, critical: true },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <svg className="h-5 w-5" viewBox="0 0 1800 1800" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <g>
                <path d="M942.432,362.391c28.336,0,78.253,16.538,120.884,52.848c33.173,28.25,72.71,77.44,72.71,151.333 c0,17.307,14.031,31.336,31.336,31.336c17.312,0,31.336-14.029,31.336-31.336c0-175.203-166.831-266.854-256.266-266.854 c-17.304,0-31.336,14.028-31.336,31.336C911.096,348.362,925.128,362.391,942.432,362.391z"/>
                <path d="M1555.292,1240.33c-11.603-18.885-24.035-39.138-36.538-60.862c-1.408-5.24-4.108-9.945-7.79-13.722 c-49.513-88.479-97.741-200.637-97.741-344.862c0-339.747-187.438-622.592-438.45-681.168 c7.458-12.796,11.813-27.633,11.813-43.511c0-47.816-38.768-86.576-86.583-86.576c-47.813,0-86.581,38.759-86.581,86.576 c0,15.878,4.35,30.715,11.813,43.511c-251.011,58.576-438.455,341.421-438.455,681.168c0,188.204-82.117,321.858-142.074,419.446 c-47.275,76.945-81.431,132.54-53.413,182.688c34.706,62.133,150.24,84.154,527.356,89.08 c-11.577,25.247-18.085,53.287-18.085,82.834c0,109.974,89.466,199.439,199.438,199.439c109.971,0,199.432-89.466,199.432-199.439 c0-29.547-6.505-57.587-18.09-82.834c377.126-4.926,492.65-26.947,527.361-89.08 C1636.728,1372.87,1602.566,1317.275,1555.292,1240.33z M900.002,1731.698c-75.415,0-136.767-61.352-136.767-136.767 c0-30.793,10.234-59.236,27.477-82.121c34.47,0.25,70.82,0.385,109.26,0.424c0.021,0,0.039,0,0.061,0 c38.438-0.039,74.783-0.174,109.26-0.424c17.231,22.885,27.471,51.328,27.471,82.121 C1036.763,1670.347,975.412,1731.698,900.002,1731.698z M1553.997,1392.455c-5.909,10.575-33.067,30.156-148.601,42.466 c-80.962,8.635-194.844,13.343-368.712,14.981c-41.952,0.395-87.355,0.612-136.683,0.66c-49.33-0.048-94.734-0.266-136.688-0.66 c-173.864-1.639-287.75-6.347-368.713-14.981c-115.524-12.31-142.686-31.891-148.596-42.466 c-10.098-18.081,20.114-67.255,52.102-119.314c10.208-16.613,21.303-34.704,32.686-54.227h131.308 c17.307,0,31.335-14.029,31.335-31.336c0-17.309-14.029-31.337-31.335-31.337H365.03c44.478-87.962,84.421-199.001,84.421-335.357 c0-165.03,47.721-321.097,134.371-439.463c84.238-115.071,196.471-182.333,316.179-189.546 c119.712,7.213,231.939,74.476,316.182,189.546c86.646,118.366,134.367,274.434,134.367,439.463 c0,136.356,39.939,247.396,84.424,335.357H598.516c-17.308,0-31.336,14.028-31.336,31.337c0,17.307,14.028,31.336,31.336,31.336 h870.699c11.375,19.522,22.479,37.609,32.683,54.221C1533.88,1325.2,1564.098,1374.374,1553.997,1392.455z"/>
              </g>
            </svg>
            <span>Notification Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="channels">Channels</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[500px] pr-4">
            {/* CHANNELS TAB */}
            <TabsContent value="channels" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notification Channels</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label>In-App Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.channels.inApp}
                      onCheckedChange={(checked) => updateSettings({ channels: { ...settings.channels, inApp: checked } })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <Label>Push Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.channels.push}
                      onCheckedChange={(checked) => updateSettings({ channels: { ...settings.channels, push: checked } })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <Label>Email Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.channels.email}
                      onCheckedChange={(checked) => updateSettings({ channels: { ...settings.channels, email: checked } })}
                    />
                  </div>
                  
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Delivery Frequency</CardTitle>
                  <CardDescription>Control when and how often you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Notification Frequency</Label>
                    <Select value={settings.frequency} onValueChange={(value: any) => updateSettings({ frequency: value })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="smart_digest_hourly">Smart Digest (Hourly)</SelectItem>
                        <SelectItem value="smart_digest_daily">Smart Digest (Daily)</SelectItem>
                        <SelectItem value="smart_digest_weekly">Smart Digest (Weekly)</SelectItem>
                        <SelectItem value="only_offline">Only When Offline</SelectItem>
                        <SelectItem value="mentions_only">Mentions Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Rate Limit</Label>
                      <span className="text-sm text-muted-foreground">{settings.rateLimit}/hour</span>
                    </div>
                    <Slider
                      value={[settings.rateLimit]}
                      onValueChange={([value]) => updateSettings({ rateLimit: value })}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Maximum notifications per hour</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* CATEGORIES TAB */}
            <TabsContent value="categories" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Event Categories</CardTitle>
                  <CardDescription>Configure channels for each type of notification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
                      <div className="col-span-1">Category</div>
                      <div className="text-center">In-App</div>
                      <div className="text-center">Push</div>
                      <div className="text-center">Email</div>
                    </div>

                    {categoryInfo.map(({ key, label, icon: Icon, critical }) => (
                      <div key={key} className="grid grid-cols-4 gap-2 items-center">
                        <div className="col-span-1 flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{label}</span>
                          {critical && <Lock className="h-3 w-3 text-amber-500" />}
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={settings.categories[key as keyof typeof settings.categories].inApp}
                            onCheckedChange={(checked) => updateCategoryChannel(key as keyof typeof settings.categories, 'inApp', checked)}
                            disabled={critical}
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={settings.categories[key as keyof typeof settings.categories].push}
                            onCheckedChange={(checked) => updateCategoryChannel(key as keyof typeof settings.categories, 'push', checked)}
                          />
                        </div>
                        <div className="flex justify-center">
                          <Switch
                            checked={settings.categories[key as keyof typeof settings.categories].email}
                            onCheckedChange={(checked) => updateCategoryChannel(key as keyof typeof settings.categories, 'email', checked)}
                            disabled={critical && !settings.categories[key as keyof typeof settings.categories].email}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                    <Lock className="h-3 w-3" />
                    Critical security alerts cannot be fully disabled
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PRIORITY TAB */}
            <TabsContent value="priority" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Priority Levels</CardTitle>
                  <CardDescription>Assign priority levels to notification categories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Show High Priority at Top</Label>
                    <Switch
                      checked={settings.prioritySettings.showHighAtTop}
                      onCheckedChange={(checked) => updateSettings({ prioritySettings: { ...settings.prioritySettings, showHighAtTop: checked } })}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {Object.entries(settings.prioritySettings.categories).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        <Select
                          value={value}
                          onValueChange={(newValue: PriorityLevel) => updateSettings({
                            prioritySettings: {
                              ...settings.prioritySettings,
                              categories: {
                                ...settings.prioritySettings.categories,
                                [key]: newValue
                              }
                            }
                          })}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">
                              <span className="flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-red-500" />
                                High
                              </span>
                            </SelectItem>
                            <SelectItem value="normal">
                              <span className="flex items-center gap-2">
                                <Bell className="h-3 w-3 text-blue-500" />
                                Normal
                              </span>
                            </SelectItem>
                            <SelectItem value="low">
                              <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-gray-400" />
                                Low
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SCHEDULE TAB */}
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Do Not Disturb
                  </CardTitle>
                  <CardDescription>Schedule quiet hours when notifications are paused</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Do Not Disturb</Label>
                    <Switch
                      checked={settings.dnd.enabled}
                      onCheckedChange={(checked) => updateSettings({ dnd: { ...settings.dnd, enabled: checked } })}
                    />
                  </div>

                  {settings.dnd.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Start Time</Label>
                          <Select 
                            value={settings.dnd.startTime} 
                            onValueChange={(value) => updateSettings({ dnd: { ...settings.dnd, startTime: value } })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</SelectItem>;
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>End Time</Label>
                          <Select 
                            value={settings.dnd.endTime} 
                            onValueChange={(value) => updateSettings({ dnd: { ...settings.dnd, endTime: value } })}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 24 }, (_, i) => {
                                const hour = i.toString().padStart(2, '0');
                                return <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</SelectItem>;
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Active Days</Label>
                        <div className="flex gap-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                            <Button
                              key={day}
                              variant={settings.dnd.days[i] ? 'default' : 'outline'}
                              size="sm"
                              className="w-12"
                              onClick={() => {
                                const newDays = [...settings.dnd.days];
                                newDays[i] = !newDays[i];
                                updateSettings({ dnd: { ...settings.dnd, days: newDays } });
                              }}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Label>Allow Priority Through</Label>
                        <Switch
                          checked={settings.dnd.allowPriority}
                          onCheckedChange={(checked) => updateSettings({ dnd: { ...settings.dnd, allowPriority: checked } })}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Digests & Summaries</CardTitle>
                  <CardDescription>Receive periodic summaries of your notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Daily Recap</Label>
                    <Switch
                      checked={settings.digest.dailyRecap}
                      onCheckedChange={(checked) => updateSettings({ digest: { ...settings.digest, dailyRecap: checked } })}
                    />
                  </div>

                  {settings.digest.dailyRecap && (
                    <div>
                      <Label>Time</Label>
                      <Select 
                        value={settings.digest.dailyTime}
                        onValueChange={(value) => updateSettings({ digest: { ...settings.digest, dailyTime: value } })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</SelectItem>;
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Label>Weekly Summary</Label>
                    <Switch
                      checked={settings.digest.weeklySummary}
                      onCheckedChange={(checked) => updateSettings({ digest: { ...settings.digest, weeklySummary: checked } })}
                    />
                  </div>

                  {settings.digest.weeklySummary && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Day</Label>
                        <Select 
                          value={settings.digest.weeklyDay.toString()}
                          onValueChange={(value) => updateSettings({ digest: { ...settings.digest, weeklyDay: parseInt(value) } })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                              <SelectItem key={i} value={i.toString()}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Time</Label>
                        <Select 
                          value={settings.digest.weeklyTime}
                          onValueChange={(value) => updateSettings({ digest: { ...settings.digest, weeklyTime: value } })}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, '0');
                              return <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{hour}:00</SelectItem>;
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Include in Digest:</Label>
                    {[
                      { key: 'includeTopMentions', label: 'Top Mentions' },
                      { key: 'includeTrendingPosts', label: 'Trending Posts You Follow' },
                      { key: 'includeUnresolvedRequests', label: 'Unresolved Requests' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label className="font-normal">{label}</Label>
                        <Switch
                          checked={settings.digest[key as keyof typeof settings.digest] as boolean}
                          onCheckedChange={(checked) => updateSettings({ digest: { ...settings.digest, [key]: checked } })}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ADVANCED TAB */}
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security & Login Alerts</CardTitle>
                  <CardDescription>Critical security notifications (cannot be fully disabled)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { key: 'newLogin', label: 'New Device/Location Login', icon: Shield },
                    { key: 'passwordChange', label: 'Password/MFA Changes', icon: Lock },
                    { key: 'sessionExpired', label: 'Session Expired', icon: Clock }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <Label>{label}</Label>
                      </div>
                      <Switch
                        checked={settings.security[key as keyof typeof settings.security]}
                        onCheckedChange={(checked) => updateSettings({ security: { ...settings.security, [key]: checked } })}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Privacy & Read Receipts</CardTitle>
                  <CardDescription>Control what others can see about your activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Read Receipts</Label>
                      <p className="text-xs text-muted-foreground">Let senders know when you've read notifications</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showReadReceipts}
                      onCheckedChange={(checked) => updateSettings({ privacy: { ...settings.privacy, showReadReceipts: checked } })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Active Status</Label>
                      <p className="text-xs text-muted-foreground">Show when you're active to senders</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showActiveStatus}
                      onCheckedChange={(checked) => updateSettings({ privacy: { ...settings.privacy, showActiveStatus: checked } })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Accessibility</CardTitle>
                  <CardDescription>Customize notification appearance and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <Label>Sound Alerts</Label>
                    </div>
                    <Switch
                      checked={settings.accessibility.sound}
                      onCheckedChange={(checked) => updateSettings({ accessibility: { ...settings.accessibility, sound: checked } })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vibrate className="h-4 w-4" />
                      <Label>Vibration</Label>
                    </div>
                    <Switch
                      checked={settings.accessibility.vibration}
                      onCheckedChange={(checked) => updateSettings({ accessibility: { ...settings.accessibility, vibration: checked } })}
                    />
                  </div>

                  {settings.accessibility.vibration && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Vibration Intensity</Label>
                        <span className="text-sm text-muted-foreground">{settings.accessibility.vibrationIntensity}/3</span>
                      </div>
                      <Slider
                        value={[settings.accessibility.vibrationIntensity]}
                        onValueChange={([value]) => updateSettings({ accessibility: { ...settings.accessibility, vibrationIntensity: value } })}
                        min={1}
                        max={3}
                        step={1}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label>Badge Count</Label>
                    </div>
                    <Switch
                      checked={settings.accessibility.badgeCount}
                      onCheckedChange={(checked) => updateSettings({ accessibility: { ...settings.accessibility, badgeCount: checked } })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      <Label>Large Notification Text</Label>
                    </div>
                    <Switch
                      checked={settings.accessibility.largeText}
                      onCheckedChange={(checked) => updateSettings({ accessibility: { ...settings.accessibility, largeText: checked } })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Data & Retention</CardTitle>
                  <CardDescription>Manage your notification history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Keep notifications for</Label>
                    <Select 
                      value={settings.retention.keepDays.toString()}
                      onValueChange={(value) => updateSettings({ retention: { keepDays: parseInt(value) } })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">365 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Notification History
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear History (Non-Critical)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Localization
                  </CardTitle>
                  <CardDescription>Language and time preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Language</Label>
                    <Select 
                      value={settings.localization.language}
                      onValueChange={(value) => updateSettings({ localization: { ...settings.localization, language: value } })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="sq">Shqip (Albanian)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Time Format</Label>
                    <Select 
                      value={settings.localization.timeFormat}
                      onValueChange={(value: '12h' | '24h') => updateSettings({ localization: { ...settings.localization, timeFormat: value } })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <Button variant="ghost" onClick={resetSettings} className="text-xs">
            <RotateCcw className="h-3 w-3 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettingsDialog;
