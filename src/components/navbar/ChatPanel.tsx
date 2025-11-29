
import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreHorizontal, VideoIcon, Phone, Minimize2, X } from 'lucide-react';
import Avatar from '@/components/Avatar';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const contacts = [
  { 
    name: "Elvis Nači", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "ta çkrova e ruinon për Fundinn ITI...",
    time: "3d",
    isOnline: true
  },
  { 
    name: "Jola Jola", 
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "You sent a sticker",
    time: "5d",
    hasNewMessage: true
  },
  { 
    name: "Meta AI", 
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Meta AI sent a photo",
    time: "1w",
    isBot: true
  },
  { 
    name: "PureGym", 
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Dite Gym, Fundinn",
    time: "13w"
  },
  { 
    name: "Besmir Rada", 
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Messages and calls are secured wi...",
    time: "16w"
  },
  { 
    name: "Cute bby", 
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Kapet Rossa Baxho left the group",
    time: "20w"
  },
  { 
    name: "Nuredini Amdi", 
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Messages and calls are secured wi...",
    time: "21w"
  },
  { 
    name: "Fathbarth Mehmetaj", 
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Messages and calls are secured wi...",
    time: "21w"
  },
  { 
    name: "Marketplace", 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "",
    time: ""
  },
  { 
    name: "Samir Dervishi", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "Messages and calls are secured wi...",
    time: "23w"
  },
  { 
    name: "Clio Marian", 
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "You: Brush kaoo",
    time: "30w"
  },
  { 
    name: "Albert Demaj", 
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=120&h=120&q=80",
    lastMessage: "",
    time: ""
  }
];

const ChatPanel = ({ isOpen, onClose }: ChatPanelProps) => {
  const [activeTab, setActiveTab] = useState('Inbox');
  const [searchTerm, setSearchTerm] = useState('');
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const contactsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const chatPanel = chatPanelRef.current;
    if (!chatPanel) return;

    // Set global flag to indicate chat panel is open
    (window as any).__chatPanelOpen = true;

    const handleWheel = (e: WheelEvent) => {
      console.log('🎯 Chat panel wheel event - isolating scroll');
      
      // Check if we're scrolling within the contacts list area
      const contactsList = contactsListRef.current;
      if (contactsList && contactsList.contains(e.target as Node)) {
        // Allow natural scrolling within the contacts list
        // Only stop propagation to prevent main feed scrolling
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Let the browser handle the natural scrolling - don't prevent default
        console.log('✅ Natural scroll within contacts list');
      } else {
        // For other areas of the chat panel, block all scrolling
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('🚫 Blocked scroll outside contacts list');
      }
    };

    // Add click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (chatPanel && !chatPanel.contains(e.target as Node)) {
        onClose();
      }
    };

    // Add wheel event listener with highest priority
    chatPanel.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    
    // Add click outside listener
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      chatPanel.removeEventListener('wheel', handleWheel, true);
      document.removeEventListener('mousedown', handleClickOutside);
      // Clear global flag when chat panel closes
      (window as any).__chatPanelOpen = false;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={chatPanelRef}
      className="fixed top-14 right-4 w-[360px] h-[calc(100vh-120px)] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col"
      style={{
        overscrollBehavior: 'contain',
        touchAction: 'pan-y'
      }}
      data-chat-panel="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Chats</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <VideoIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full" onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Messenger"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('Inbox')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'Inbox' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Inbox
        </button>
        <button
          onClick={() => setActiveTab('Communities')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${
            activeTab === 'Communities' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Communities
        </button>
      </div>

      {/* Chat history missing notice */}
      <div className="p-4 bg-blue-50 border-b border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">Chat history is missing</p>
            <p className="text-xs text-blue-700 mt-1">
              Enter your PIN to restore chat history.
            </p>
            <button className="text-xs text-blue-600 font-medium mt-1 hover:underline">
              Use a one-time code instead
            </button>
          </div>
          <button className="text-blue-700 hover:text-blue-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div 
        ref={contactsListRef}
        className="flex-1 overflow-y-auto"
        style={{
          overscrollBehavior: 'contain',
          scrollBehavior: 'smooth'
        }}
      >
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
            <div className="relative">
              <Avatar 
                className="w-14 h-14"
              />
              {contact.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
              {contact.hasNewMessage && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                <span className="text-xs text-gray-500">{contact.time}</span>
              </div>
              {contact.lastMessage && (
                <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom "See all in Messenger" */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium">
          See all in Messenger
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;
