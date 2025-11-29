import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Info,
  Paperclip,
  Smile,
  Mic,
  Send,
  Check,
  CheckCheck,
  Download,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Message {
  id: string;
  text?: string;
  sender: 'user' | 'contact';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  images?: { url: string; size?: string }[];
  file?: { name: string; size: string; pages: number };
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread?: number;
  online?: boolean;
  status?: string;
  typing?: boolean;
}

interface Status {
  id: string;
  name: string;
  avatar: string;
}

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [topOffset, setTopOffset] = useState(0);
  
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header, [data-app-topbar], [data-topbar], .top-bar, .app-header') as HTMLElement | null;
      let offset = 0;
      if (header) {
        const rect = header.getBoundingClientRect();
        const style = window.getComputedStyle(header);
        const isFixedLike = style.position === 'fixed' || style.position === 'sticky';
        if (isFixedLike) offset = Math.max(0, Math.round(rect.height));
      }
      setTopOffset(offset);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const [selectedContact, setSelectedContact] = useState<Contact>({
    id: '1',
    name: 'Lea',
    avatar: '/placeholder.svg',
    lastMessage: 'What are you doing',
    timestamp: '22/10/23',
    online: true
  });

  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const statuses: Status[] = [
    { id: '1', name: 'My Status', avatar: '/placeholder.svg' },
    { id: '2', name: 'Jesus ...', avatar: '/placeholder.svg' },
    { id: '3', name: 'Mari', avatar: '/placeholder.svg' },
    { id: '4', name: 'Kristin ...', avatar: '/placeholder.svg' },
    { id: '5', name: 'Lea', avatar: '/placeholder.svg' }
  ];

  const contacts: Contact[] = [
    { 
      id: '1', 
      name: 'Josephin water', 
      avatar: '/placeholder.svg', 
      lastMessage: 'Typing...', 
      timestamp: '22/10/23',
      typing: true
    },
    { 
      id: '2', 
      name: 'Mari', 
      avatar: '/placeholder.svg', 
      lastMessage: 'This is nice, I love it ❤️', 
      timestamp: 'JUST NOW',
      online: true
    },
    { 
      id: '3', 
      name: 'Lea', 
      avatar: '/placeholder.svg', 
      lastMessage: 'What are you doing', 
      timestamp: '22/10/23',
      online: true
    },
    { 
      id: '4', 
      name: 'Kristin Watson', 
      avatar: '/placeholder.svg', 
      lastMessage: 'Okay I will try it 😊', 
      timestamp: 'Yesterday'
    },
    { 
      id: '5', 
      name: '15 Rocks', 
      avatar: '/placeholder.svg', 
      lastMessage: 'You : This is COOL', 
      timestamp: '18/08/2024'
    },
    { 
      id: '6', 
      name: 'Jesus Watson', 
      avatar: '/placeholder.svg', 
      lastMessage: 'Sent you image', 
      timestamp: '14/12/24'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      text: "Hi Angelo! Let's go out",
      sender: 'contact',
      timestamp: '01:42 AM',
      status: 'read'
    },
    {
      id: '2',
      text: 'I have vacation plan in Ladakh for next week.',
      sender: 'user',
      timestamp: '01:35 AM'
    },
    {
      id: '3',
      text: 'You understand',
      sender: 'contact',
      timestamp: '01:35 AM'
    },
    {
      id: '4',
      images: [
        { url: '/placeholder.svg', size: '53 MB' },
        { url: '/placeholder.svg' },
        { url: '/placeholder.svg' },
        { url: '/placeholder.svg' }
      ],
      sender: 'contact',
      timestamp: '01:42 AM'
    },
    {
      id: '5',
      text: 'You understand',
      sender: 'contact',
      timestamp: '01:42 AM'
    },
    {
      id: '6',
      file: {
        name: 'Smitten Shah 01.pdf',
        size: '1 Page | 250 Kb',
        pages: 1
      },
      sender: 'user',
      timestamp: '01:40 AM',
      status: 'read'
    }
  ];

  return (
    <div className="flex overflow-hidden bg-white fixed left-0 right-0" style={{ top: topOffset, height: `calc(100vh - ${topOffset}px)` }}>

      {/* Left Navigation Bar */}
      <div className="w-[70px] bg-[#4682B4] flex flex-col items-center py-4 gap-6 flex-shrink-0">
        {/* Logo/Brand */}
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>

        {/* Navigation Icons */}
        <div className="flex-1 flex flex-col items-center gap-6 mt-4">
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center gap-4 mt-auto">
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M4.2 4.2l4.2 4.2m5.6 5.6l4.2 4.2M1 12h6m6 0h6M4.2 19.8l4.2-4.2m5.6-5.6l4.2-4.2" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contacts Sidebar */}
      <div className="w-[360px] bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Profile Header */}
        <div className="px-4 py-6 bg-white text-foreground border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>RS</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Rohini Sharma</h3>
                <p className="text-xs text-muted-foreground">Busy</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Status Section */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Status</h3>
            <button className="text-xs text-[#4682B4] hover:underline">View All</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {statuses.map((status) => (
              <div key={status.id} className="flex flex-col items-center gap-1 min-w-[60px]">
                <div className="relative">
                  <Avatar className="h-14 w-14 border-2 border-[#4682B4]">
                    <AvatarImage src={status.avatar} />
                    <AvatarFallback>{status.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-[10px] text-gray-600 truncate w-full text-center">
                  {status.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Message List Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Message (10)</h3>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          {/* Chat/Call/Contact Tabs */}
          <div className="flex gap-2 mb-3">
            <Button variant="ghost" size="sm" className="flex-1 h-8 bg-gray-100 text-gray-900 text-xs">
              💬 Chat
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 h-8 text-gray-600 text-xs">
              📞 Call
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 h-8 text-gray-600 text-xs">
              👥 Contact
            </Button>
          </div>

          {/* Direct/Group Tabs */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 h-8 bg-gray-100 text-gray-900 text-xs">
              Direct
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 h-8 text-gray-600 text-xs">
              Group
            </Button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedContact.id === contact.id ? 'bg-gray-50' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                {contact.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900">{contact.name}</h4>
                  <span className="text-xs text-gray-500">{contact.timestamp}</span>
                </div>
                <p className={`text-xs ${contact.typing ? 'text-green-600' : 'text-gray-600'} truncate`}>
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#e5ddd5] min-h-0">
        {/* Chat Header */}
        <div className="bg-[#E8F0F8] px-4 py-6 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedContact.avatar} />
              <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{selectedContact.name}</h3>
              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Video className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Info className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'contact' && (
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[65%] ${message.sender === 'user' ? 'ml-auto' : ''}`}>
                {message.text && (
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-[#d9fdd3] text-gray-900'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-500">{message.timestamp}</span>
                      {message.sender === 'user' && message.status === 'read' && (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                )}

                {message.images && (
                  <div className="grid grid-cols-2 gap-1 rounded-lg overflow-hidden bg-white p-1">
                    {message.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-32 object-cover rounded"
                        />
                        {idx === 0 && img.size && (
                          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                            👍 {img.size}
                          </div>
                        )}
                        {idx === 3 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold">
                            10+
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {message.file && (
                  <div className="bg-[#d9fdd3] rounded-lg p-3 flex items-center gap-3">
                    <div className="h-12 w-12 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                      PDF
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{message.file.name}</p>
                      <p className="text-xs text-gray-600">{message.file.size}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/50 rounded-full">
                      <Download className="h-4 w-4 text-gray-700" />
                    </Button>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500">{message.timestamp}</span>
                      {message.status === 'read' && (
                        <CheckCheck className="h-3 w-3 text-blue-500" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-transparent px-4 py-2 flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5 flex-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
              <Plus className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
              <ImageIcon className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
              <Smile className="h-5 w-5 text-gray-600" />
            </Button>
            
            <input
              type="text"
              placeholder="Write your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-sm px-2"
            />
            
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent">
              <Mic className="h-5 w-5 text-gray-600" />
            </Button>
            <Button size="sm" className="h-9 w-9 p-0 bg-[#4682B4] hover:bg-[#3b6fa0] text-white rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* Right Navigation Bar */}
      <div className="w-[100px] bg-[#f0f2f5] flex flex-col items-center flex-shrink-0 border-l border-gray-200 relative">
        {/* Contact Avatar - Square */}
        <div className="relative h-[88px] w-full flex items-center justify-center border-b border-gray-200">
          <div className="absolute top-1/2 -translate-y-1/2 w-16 h-16 rounded-lg overflow-hidden shadow-md">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedContact.name)}&size=160&background=4682B4&color=fff&bold=true`}
              alt={selectedContact.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Small Toggle Button - Half outside on border */}
        <button className="absolute top-1/2 -left-[12px] transform -translate-y-1/2 w-6 h-6 rounded-md bg-[#4682B4] hover:bg-[#4682B4]/90 flex items-center justify-center transition-colors shadow-lg z-10">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </button>

        <div className="flex-1 flex flex-col items-center gap-6 mt-4">
          <button className="w-10 h-10 rounded-lg hover:bg-gray-200/60 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg hover:bg-gray-200/60 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg hover:bg-gray-200/60 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg hover:bg-gray-200/60 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg hover:bg-gray-200/60 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          </button>
          
          <button className="w-10 h-10 rounded-lg hover:bg-gray-200/60 flex items-center justify-center transition-colors">
            <svg className="w-6 h-6 text-[#4682B4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <button className="w-12 h-12 rounded-full bg-[#4682B4] hover:bg-[#3b6fa0] flex items-center justify-center text-white shadow-lg transition-colors">
            <span className="text-sm font-bold">RTL</span>
          </button>
          
          <button className="w-12 h-12 rounded-full bg-[#4682B4] hover:bg-[#3b6fa0] flex items-center justify-center text-white shadow-lg transition-colors">
            <span className="text-2xl leading-none">+</span>
          </button>
          
          <button className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
