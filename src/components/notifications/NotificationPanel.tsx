import React, { useState, useMemo, useEffect } from 'react';
import { useNotifications } from '@/hooks/security/use-notifications';
import { useNotificationSettings } from '@/contexts/NotificationSettingsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Filter, 
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Trash2,
  Clock,
  Settings,
  AtSign,
  MessageSquare,
  UserPlus,
  MessageCircle,
  Heart,
  Share2,
  Users,
  Calendar,
  ShoppingBag,
  Shield,
  Check,
  Eye,
  EyeOff,
  Flag,
  Bookmark,
  Volume2,
  VolumeX,
  ChevronDown,
  Wifi,
  WifiOff
} from 'lucide-react';
import NotificationSettingsDialog from './NotificationSettingsDialog';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false);

  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const { settings, updateSettings, isInQuietHours } = useNotificationSettings();

  // Simulate connection monitoring
  useEffect(() => {
    const checkConnection = setInterval(() => {
      setIsConnected(navigator.onLine);
    }, 5000);
    
    const handleOnline = () => setIsConnected(true);
    const handleOffline = () => setIsConnected(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(checkConnection);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Group similar notifications
  const groupedNotifications = useMemo(() => {
    if (!notifications) return [];
    
    const groups: { [key: string]: any[] } = {};
    const ungrouped: any[] = [];
    
    notifications.forEach(notif => {
      // Group by type and linked_module
      const groupKey = `${notif.type}_${notif.linked_module || 'none'}`;
      
      // Only group certain types
      if (['like', 'reaction', 'follow', 'mention'].includes(notif.type)) {
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(notif);
      } else {
        ungrouped.push(notif);
      }
    });
    
    // Convert groups to array format
    const result: any[] = [];
    
    Object.entries(groups).forEach(([key, items]) => {
      if (items.length > 1) {
        result.push({
          isGroup: true,
          groupKey: key,
          type: items[0].type,
          count: items.length,
          items: items,
          created_at: items[0].created_at,
          status: items.some(i => i.status === 'unread') ? 'unread' : 'read'
        });
      } else {
        result.push(items[0]);
      }
    });
    
    return [...result, ...ungrouped].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [notifications]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications?.filter(n => n.status === 'unread').length || 0;
  }, [notifications]);

  // Filter notifications based on search and filters
  const filteredNotifications = useMemo(() => {
    return groupedNotifications.filter(notification => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        (notification.isGroup ? 
          notification.items.some((item: any) => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          ) :
          notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      // Unread filter
      const matchesUnread = !showUnreadOnly || notification.status === 'unread';
      
      // Priority filter
      const matchesPriority = !showPriorityOnly || notification.priority === 'critical' || notification.priority === 'high';
      
      // Tab filter
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'mentions' && notification.type === 'mention') ||
        (activeTab === 'messages' && notification.type === 'message') ||
        (activeTab === 'follows' && (notification.type === 'follow' || notification.type === 'request')) ||
        (activeTab === 'comments' && (notification.type === 'comment' || notification.type === 'reply')) ||
        (activeTab === 'reactions' && (notification.type === 'like' || notification.type === 'reaction')) ||
        (activeTab === 'shares' && notification.type === 'share') ||
        (activeTab === 'groups' && (notification.type === 'group' || notification.type === 'page')) ||
        (activeTab === 'events' && notification.type === 'event') ||
        (activeTab === 'marketplace' && notification.type === 'marketplace') ||
        (activeTab === 'system' && (notification.type === 'system' || notification.type === 'security'));
      
      return matchesSearch && matchesUnread && matchesPriority && matchesTab;
    });
  }, [groupedNotifications, searchQuery, showUnreadOnly, showPriorityOnly, activeTab]);

  // Unread count respecting current filters/tabs
  const unreadFilteredCount = useMemo(() => {
    return filteredNotifications.filter((n: any) => n.status === 'unread').length;
  }, [filteredNotifications]);

  // Priority count for current tab
  const priorityCount = useMemo(() => {
    return groupedNotifications.filter(notification => {
      const isPriority = notification.priority === 'critical' || notification.priority === 'high';
      // Apply tab filter
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'mentions' && notification.type === 'mention') ||
        (activeTab === 'messages' && notification.type === 'message') ||
        (activeTab === 'follows' && (notification.type === 'follow' || notification.type === 'request')) ||
        (activeTab === 'comments' && (notification.type === 'comment' || notification.type === 'reply')) ||
        (activeTab === 'reactions' && (notification.type === 'like' || notification.type === 'reaction')) ||
        (activeTab === 'shares' && notification.type === 'share') ||
        (activeTab === 'groups' && (notification.type === 'group' || notification.type === 'page')) ||
        (activeTab === 'events' && notification.type === 'event') ||
        (activeTab === 'marketplace' && notification.type === 'marketplace') ||
        (activeTab === 'system' && (notification.type === 'system' || notification.type === 'security'));
      
      return isPriority && matchesTab;
    }).length;
  }, [groupedNotifications, activeTab]);

  // Handle selection
  const toggleSelection = (id: string, index: number, shiftKey: boolean) => {
    if (shiftKey && lastSelectedIndex !== null) {
      // Shift-click: select range
      const start = Math.min(lastSelectedIndex, index);
      const end = Math.max(lastSelectedIndex, index);
      const newSelected = new Set(selectedItems);
      
      for (let i = start; i <= end; i++) {
        if (filteredNotifications[i]) {
          const notifId = filteredNotifications[i].isGroup ? 
            filteredNotifications[i].groupKey : 
            filteredNotifications[i].id;
          newSelected.add(notifId);
        }
      }
      setSelectedItems(newSelected);
    } else {
      // Regular click: toggle single item
      const newSelected = new Set(selectedItems);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedItems(newSelected);
      setLastSelectedIndex(index);
    }
  };

  const handleMarkSelectedAsRead = () => {
    selectedItems.forEach(id => {
      const notification = notifications?.find(n => n.id === id);
      if (notification && notification.status === 'unread') {
        markAsRead.mutate(id);
      }
    });
    setSelectedItems(new Set());
    setBulkSelectMode(false);
  };

  const handleClearSelected = () => {
    // In a real app, this would delete notifications
    setSelectedItems(new Set());
    setBulkSelectMode(false);
  };

  const toggleGroupExpansion = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mention':
        return <AtSign className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case 'follow':
      case 'request':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="h-5 w-5 text-indigo-500" />;
      case 'like':
      case 'reaction':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'share':
        return <Share2 className="h-5 w-5 text-cyan-500" />;
      case 'group':
      case 'page':
        return <Users className="h-5 w-5 text-orange-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-teal-500" />;
      case 'marketplace':
        return <ShoppingBag className="h-5 w-5 text-amber-500" />;
      case 'security':
      case 'system':
      case 'critical':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40" 
        onClick={onClose} 
      />
      
      {/* Notification Panel */}
      <div className="fixed top-14 right-4 w-[465px] max-h-[calc(100vh-80px)] bg-background border border-border rounded-lg shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5" viewBox="0 0 1800 1800" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <g>
                <path d="M942.432,362.391c28.336,0,78.253,16.538,120.884,52.848c33.173,28.25,72.71,77.44,72.71,151.333 c0,17.307,14.031,31.336,31.336,31.336c17.312,0,31.336-14.029,31.336-31.336c0-175.203-166.831-266.854-256.266-266.854 c-17.304,0-31.336,14.028-31.336,31.336C911.096,348.362,925.128,362.391,942.432,362.391z"/>
                <path d="M1555.292,1240.33c-11.603-18.885-24.035-39.138-36.538-60.862c-1.408-5.24-4.108-9.945-7.79-13.722 c-49.513-88.479-97.741-200.637-97.741-344.862c0-339.747-187.438-622.592-438.45-681.168 c7.458-12.796,11.813-27.633,11.813-43.511c0-47.816-38.768-86.576-86.583-86.576c-47.813,0-86.581,38.759-86.581,86.576 c0,15.878,4.35,30.715,11.813,43.511c-251.011,58.576-438.455,341.421-438.455,681.168c0,188.204-82.117,321.858-142.074,419.446 c-47.275,76.945-81.431,132.54-53.413,182.688c34.706,62.133,150.24,84.154,527.356,89.08 c-11.577,25.247-18.085,53.287-18.085,82.834c0,109.974,89.466,199.439,199.438,199.439c109.971,0,199.432-89.466,199.432-199.439 c0-29.547-6.505-57.587-18.09-82.834c377.126-4.926,492.65-26.947,527.361-89.08 C1636.728,1372.87,1602.566,1317.275,1555.292,1240.33z M900.002,1731.698c-75.415,0-136.767-61.352-136.767-136.767 c0-30.793,10.234-59.236,27.477-82.121c34.47,0.25,70.82,0.385,109.26,0.424c0.021,0,0.039,0,0.061,0 c38.438-0.039,74.783-0.174,109.26-0.424c17.231,22.885,27.471,51.328,27.471,82.121 C1036.763,1670.347,975.412,1731.698,900.002,1731.698z M1553.997,1392.455c-5.909,10.575-33.067,30.156-148.601,42.466 c-80.962,8.635-194.844,13.343-368.712,14.981c-41.952,0.395-87.355,0.612-136.683,0.66c-49.33-0.048-94.734-0.266-136.688-0.66 c-173.864-1.639-287.75-6.347-368.713-14.981c-115.524-12.31-142.686-31.891-148.596-42.466 c-10.098-18.081,20.114-67.255,52.102-119.314c10.208-16.613,21.303-34.704,32.686-54.227h131.308 c17.307,0,31.335-14.029,31.335-31.336c0-17.309-14.029-31.337-31.335-31.337H365.03c44.478-87.962,84.421-199.001,84.421-335.357 c0-165.03,47.721-321.097,134.371-439.463c84.238-115.071,196.471-182.333,316.179-189.546 c119.712,7.213,231.939,74.476,316.182,189.546c86.646,118.366,134.367,274.434,134.367,439.463 c0,136.356,39.939,247.396,84.424,335.357H598.516c-17.308,0-31.336,14.028-31.336,31.337c0,17.307,14.028,31.336,31.336,31.336 h870.699c11.375,19.522,22.479,37.609,32.683,54.221C1533.88,1325.2,1564.098,1374.374,1553.997,1392.455z"/>
              </g>
            </svg>
            <h2 className="text-xl font-bold text-gray-600">Notifications</h2>
            {!isConnected && (
              <Badge variant="destructive" className="gap-1">
                <WifiOff className="h-3 w-3" />
                Reconnecting...
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBulkSelectMode(!bulkSelectMode)}
              className="h-8 px-2"
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quiet Mode Banner */}
        {isInQuietHours() && (
          <div className="bg-amber-50 border-b border-amber-200 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-amber-800">
              <VolumeX className="h-4 w-4" />
              <span>Do Not Disturb is active until {settings.dnd.endTime}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-amber-800"
              onClick={() => updateSettings({ dnd: { ...settings.dnd, enabled: false } })}
            >
              End now
            </Button>
          </div>
        )}

        {/* Search and Filters */}
        <div className="p-3 space-y-2 border-b border-border">
          {/* Search */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-800 dark:text-white" fill="currentColor" stroke="currentColor" strokeWidth="0.5" version="1.1" viewBox="0 0 41.551 41.55" xmlns="http://www.w3.org/2000/svg">
                <g>
                  <g>
                    <path d="M23.839,12.646c-1.976,0-3.51,2.168-3.791,5.181H5.29c-0.552,0-1,0.447-1,1c0,0.553,0.448,1,1,1h1.757v2.175 c0,0.553,0.448,1,1,1c0.552,0,1-0.447,1-1v-2.175h1.844v2.593c0,0.553,0.448,1,1,1c0.552,0,1-0.447,1-1v-2.593h7.158 c0.281,3.013,1.814,5.181,3.791,5.181c2.189,0,3.841-2.656,3.841-6.181S26.027,12.646,23.839,12.646z M23.839,23.006 c-0.75,0-1.841-1.629-1.841-4.181c0-2.552,1.09-4.181,1.841-4.181s1.841,1.629,1.841,4.181 C25.68,21.377,24.589,23.006,23.839,23.006z"></path>
                    <path d="M16.152,2.673C7.246,2.673,0,9.919,0,18.826s7.246,16.152,16.152,16.152c4.803,0,9.11-2.119,12.072-5.459l11.712,9.146 c0.182,0.143,0.399,0.212,0.614,0.212c0.297,0,0.591-0.132,0.789-0.385c0.34-0.435,0.263-1.063-0.172-1.403l-11.701-9.137 c1.788-2.6,2.839-5.741,2.839-9.127C32.304,9.919,25.058,2.673,16.152,2.673z M16.152,32.978C8.348,32.978,2,26.629,2,18.827 C2,11.023,8.349,4.674,16.152,4.674s14.152,6.349,14.152,14.152C30.304,26.629,23.956,32.978,16.152,32.978z"></path>
                  </g>
                </g>
              </svg>
            </div>
            <Input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 border border-gray-300 focus:ring-0 focus:border-gray-400 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-gray-400 transition-colors bg-white"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {bulkSelectMode && selectedItems.size > 0 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkSelectedAsRead}
                  className="h-8 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark Selected Read ({selectedItems.size})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelected}
                  className="h-8 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear Selected
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedItems(new Set());
                    setBulkSelectMode(false);
                  }}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsRead.mutate()}
                  disabled={!notifications?.some(n => n.status === 'unread')}
                  className="h-8 text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                  className={`h-8 text-xs ${showUnreadOnly ? 'bg-primary/10' : ''} relative`}
                >
                  <svg className="h-3 w-3 mr-1 text-gray-600" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M8.964 15a3.115 3.115 0 0 1-1.63-.462l-7.32-4.482V17a1 1 0 0 0 1 1H16.92a1 1 0 0 0 1-1v-6.944l-7.32 4.48A3.116 3.116 0 0 1 8.964 15z"/>
                    <path d="M17.73 6.31l-1.8-1.91V1.04A1.043 1.043 0 0 0 14.89 0H3.036A1.044 1.044 0 0 0 2 1.04v3.42L.268 6.31a.95.95 0 0 0-.26.79.34.34 0 0 0 .01.1 1.07 1.07 0 0 0 .52.84l7.833 4.79a1.15 1.15 0 0 0 .6.17 1.14 1.14 0 0 0 .588-.17l7.832-4.79a1.078 1.078 0 0 0 .41-.44 1 1 0 0 0-.07-1.29zM10.95 8H4.987a1 1 0 0 1 0-2h5.963a1 1 0 0 1 0 2zm1.99-3.99H4.987a1.01 1.01 0 0 1 0-2.02h7.953a1.01 1.01 0 0 1 0 2.02z"/>
                  </svg>
                  Unread
                  <Badge variant="destructive" className="ml-1 h-4 min-w-[1rem] px-1 text-[10px] leading-4">
                    {unreadFilteredCount}
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPriorityOnly(!showPriorityOnly)}
                  className={`h-8 text-xs ${showPriorityOnly ? 'bg-primary/10' : ''}`}
                >
                  <svg className="h-3 w-3 mr-1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M452.266667 955.733333l-384-384c-34.133333-34.133333-34.133333-87.466667 0-121.6l384-384c34.133333-34.133333 87.466667-34.133333 121.6 0l384 384c34.133333 34.133333 34.133333 87.466667 0 121.6l-384 384c-34.133333 34.133333-89.6 34.133333-121.6 0z" fill="#F44336"/>
                    <path d="M460.8 697.6c0-6.4 2.133333-12.8 4.266667-19.2 2.133333-6.4 6.4-10.666667 10.666666-14.933333 4.266667-4.266667 10.666667-8.533333 17.066667-10.666667s12.8-4.266667 21.333333-4.266667 14.933333 2.133333 21.333334 4.266667c6.4 2.133333 12.8 6.4 17.066666 10.666667 4.266667 4.266667 8.533333 8.533333 10.666667 14.933333 2.133333 6.4 4.266667 12.8 4.266667 19.2s-2.133333 12.8-4.266667 19.2-6.4 10.666667-10.666667 14.933333c-4.266667 4.266667-10.666667 8.533333-17.066666 10.666667-6.4 2.133333-12.8 4.266667-21.333334 4.266667s-14.933333-2.133333-21.333333-4.266667-10.666667-6.4-17.066667-10.666667c-4.266667-4.266667-8.533333-8.533333-10.666666-14.933333s-4.266667-10.666667-4.266667-19.2z m89.6-98.133333h-76.8L462.933333 277.333333h98.133334l-10.666667 322.133334z" fill="#FFFFFF"/>
                  </svg>
                  Priority
                  <Badge variant="destructive" className="ml-1 h-4 min-w-[1rem] px-1 text-[10px] leading-4">
                    {priorityCount}
                  </Badge>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border overflow-x-auto">
            <TabsList className="w-full justify-start h-auto p-1 bg-transparent rounded-none">
              <TabsTrigger value="all" className="text-xs px-2 py-1.5">All</TabsTrigger>
              <TabsTrigger value="mentions" className="text-xs px-2 py-1.5">@Mentions</TabsTrigger>
              <TabsTrigger value="messages" className="text-xs px-2 py-1.5">Messages</TabsTrigger>
              <TabsTrigger value="follows" className="text-xs px-2 py-1.5">Follows</TabsTrigger>
              <TabsTrigger value="comments" className="text-xs px-2 py-1.5">Comments</TabsTrigger>
              <TabsTrigger value="reactions" className="text-xs px-2 py-1.5">Reactions</TabsTrigger>
              <TabsTrigger value="shares" className="text-xs px-2 py-1.5">Shares</TabsTrigger>
              <TabsTrigger value="groups" className="text-xs px-2 py-1.5">Groups</TabsTrigger>
              <TabsTrigger value="events" className="text-xs px-2 py-1.5">Events</TabsTrigger>
              <TabsTrigger value="marketplace" className="text-xs px-2 py-1.5">Market</TabsTrigger>
              <TabsTrigger value="system" className="text-xs px-2 py-1.5">System</TabsTrigger>
            </TabsList>
          </div>

          {/* Notifications List */}
          <TabsContent value={activeTab} className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-[calc(100vh-340px)]">
              <div className="p-3 space-y-2">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading notifications...
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications found
                  </div>
                ) : (
                  filteredNotifications.map((notification, index) => {
                    const notifId = notification.isGroup ? notification.groupKey : notification.id;
                    const isSelected = selectedItems.has(notifId);
                    const isExpanded = expandedGroups.has(notifId);
                    
                    if (notification.isGroup) {
                      return (
                        <div key={notifId} className="space-y-1">
                          <div
                            className={`p-3 rounded-lg border transition-all ${
                              notification.status === 'unread'
                                ? 'bg-primary/5 border-primary/20'
                                : 'bg-background border-border'
                            } hover:shadow-sm ${isSelected ? 'ring-2 ring-primary' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              {bulkSelectMode && (
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSelection(notifId, index, false)}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(notifId, index, (e as any).shiftKey);
                                  }}
                                  className="mt-1"
                                />
                              )}
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-sm">
                                      {notification.count} new {notification.type}s
                                    </h3>
                                    {notification.status === 'unread' && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {getTimeAgo(notification.created_at)}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleGroupExpansion(notifId)}
                                  className="h-6 px-2 text-xs"
                                >
                                  <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  {isExpanded ? 'Hide' : 'Show'} all
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="ml-8 space-y-1">
                              {notification.items.map((item: any) => (
                                <div
                                  key={item.id}
                                  className="p-2 rounded-lg border border-border bg-background/50 hover:shadow-sm text-xs"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p className="font-medium">{item.title}</p>
                                      {item.description && (
                                        <p className="text-muted-foreground text-xs mt-0.5">{item.description}</p>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                      {getTimeAgo(item.created_at)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-all ${
                          notification.status === 'unread'
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-background border-border'
                        } hover:shadow-sm ${isSelected ? 'ring-2 ring-primary' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          {bulkSelectMode && (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSelection(notifId, index, false)}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSelection(notifId, index, (e as any).shiftKey);
                              }}
                              className="mt-1"
                            />
                          )}
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm">{notification.title}</h3>
                                {notification.status === 'unread' && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {getTimeAgo(notification.created_at)}
                              </span>
                            </div>
                            {notification.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.description}
                              </p>
                            )}
                            
                            {/* Inline Actions */}
                            <div className="flex items-center gap-1 flex-wrap mt-2">
                              {notification.status === 'unread' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead.mutate(notification.id);
                                  }}
                                  className="h-7 px-2 text-xs"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Mark Read
                                </Button>
                              )}
                              {['follow', 'request'].includes(notification.type) && (
                                <>
                                  <Button variant="default" size="sm" className="h-7 px-2 text-xs">
                                    Accept
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                    Decline
                                  </Button>
                                </>
                              )}
                              {['comment', 'message'].includes(notification.type) && (
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                  Reply
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                <Bookmark className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                <VolumeX className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive">
                                <Flag className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {/* Pagination */}
                {filteredNotifications.length > 0 && (
                  <div className="pt-3 text-center">
                    <Button variant="outline" size="sm" className="text-xs">
                      See older notifications
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      
      <NotificationSettingsDialog 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export default NotificationPanel;
