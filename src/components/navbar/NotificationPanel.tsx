import React, { useState, useRef, useEffect } from 'react';
import { X, Settings } from 'lucide-react';
import Avatar from '@/components/Avatar';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications = [
  {
    id: 1,
    user: "Hanife Halili Axdulli",
    action: "added to his story.",
    time: "14h",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    isNew: true,
    category: "New"
  },
  {
    id: 2,
    user: "You",
    action: "have a memory to look back on today.",
    time: "12h",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    isNew: false,
    category: "Today"
  },
  {
    id: 3,
    user: "Denisa Rekal",
    action: "'s birthday today. Help her have a great day!",
    time: "13h",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    isNew: false,
    category: "Today"
  },
  {
    id: 4,
    user: "Shqipet",
    action: "has 17 new views.",
    time: "1d",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    isNew: false,
    category: "Earlier"
  },
  {
    id: 5,
    user: "Resume watching",
    action: '"Teora e Atasimit".',
    time: "1d",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    isNew: false,
    category: "Earlier"
  }
];

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [activeTab, setActiveTab] = useState('All');
  const [pushNotificationsOff, setPushNotificationsOff] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !notificationPanelRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      
      const scrollableContent = notificationPanelRef.current?.querySelector('.overflow-y-auto');
      if (scrollableContent) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableContent;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight;
        
        if ((e.deltaY < 0 && !isAtTop) || (e.deltaY > 0 && !isAtBottom)) {
          e.preventDefault();
        }
      }
    };

    const panel = notificationPanelRef.current;
    panel.addEventListener('wheel', handleWheel, { passive: false, capture: true });

    return () => {
      panel.removeEventListener('wheel', handleWheel, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const newNotifications = notifications.filter(n => n.isNew);
  const todayNotifications = notifications.filter(n => n.category === "Today");
  const earlierNotifications = notifications.filter(n => n.category === "Earlier");

  const getNotificationIcon = (user: string, action: string) => {
    if (action.includes("story")) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 bg-white rounded"></div>
        </div>
      );
    }
    if (action.includes("birthday")) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">🎂</span>
        </div>
      );
    }
    if (action.includes("memory")) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">📷</span>
        </div>
      );
    }
    if (action.includes("views")) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">👁</span>
        </div>
      );
    }
    if (action.includes("watching")) {
      return (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">▶</span>
        </div>
      );
    }
    return null;
  };

  const renderNotificationItem = (notification: any) => (
    <div key={notification.id} className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer ${notification.isNew ? 'bg-blue-50' : ''}`}>
      <div className="relative flex-shrink-0">
        <Avatar 
          className="w-14 h-14"
        />
        {getNotificationIcon(notification.user, notification.action)}
        {notification.isNew && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-black">
              <span className="font-semibold">{notification.user}</span>
              <span className="text-gray-800"> {notification.action}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">{notification.time}</p>
          </div>
          <button className="ml-2 p-1 hover:bg-gray-200 rounded">
            <span className="text-gray-400 text-sm">•••</span>
          </button>
        </div>
      </div>
    </div>
  );

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const panelHeight = isExpanded ? 'h-[calc(100vh-80px)]' : 'h-[550px]';

  return (
    <div 
      ref={notificationPanelRef}
      className={`fixed top-14 right-4 w-[360px] ${panelHeight} bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out`}
      data-notification-panel="true"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('All')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'All' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab('Unread')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'Unread' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread
        </button>
      </div>

      {pushNotificationsOff && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">Your push notifications are off</p>
              <p className="text-xs text-gray-600 mt-1">
                Turn on notifications to stay connected
              </p>
              <div className="flex gap-2 mt-2">
                <button className="text-xs text-blue-600 font-medium hover:underline bg-blue-100 px-2 py-1 rounded">
                  Turn on
                </button>
                <button className="text-xs text-gray-600 hover:underline">
                  Not now
                </button>
              </div>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setPushNotificationsOff(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {newNotifications.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">New</h3>
              <button className="text-sm text-blue-600 hover:underline">See all</button>
            </div>
            {newNotifications.map(renderNotificationItem)}
          </div>
        )}

        {todayNotifications.length > 0 && (
          <div>
            <div className="px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-900">Today</h3>
            </div>
            {todayNotifications.map(renderNotificationItem)}
          </div>
        )}

        {earlierNotifications.length > 0 && (
          <div>
            <div className="px-4 py-2">
              <h3 className="text-sm font-semibold text-gray-900">Earlier</h3>
            </div>
            {earlierNotifications.map(renderNotificationItem)}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button 
          className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={handleExpandToggle}
        >
          {isExpanded ? 'Show less notifications' : 'See previous notifications'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
