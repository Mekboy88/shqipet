import React, { useState, useEffect, useRef } from 'react';
import Avatar from '@/components/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Edit, 
  Trash2, 
  MessageSquare, 
  ExternalLink, 
  Pin, 
  Image, 
  Zap,
  Share2,
  Copy,
  Mail,
  Users,
  QrCode,
  Code,
  BarChart3,
  TrendingUp,
  Globe,
  Lock,
  Eye,
  Archive,
  Bell,
  BellOff,
  Settings,
  Bookmark,
  UserPlus
} from 'lucide-react';

interface PostHeaderProps {
  user: {
    name: string;
    image: string;
    verified?: boolean;
  };
  time: string;
  visibility?: string;
  isSponsored?: boolean;
  isAnonymous?: boolean;
  postId: string;
  userId?: string; // Add userId for ownership validation
  onVisibilityChange: (visibility: string) => void;
  onPostAction: (action: string) => void;
}

const PostHeader: React.FC<PostHeaderProps> = ({ 
  user,
  time,
  visibility = "public",
  isSponsored = false,
  isAnonymous = false,
  postId,
  userId,
  onVisibilityChange,
  onPostAction
}) => {
  const { user: currentUser } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMenuDropdown, setShowMenuDropdown] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Proper ownership validation
  const isOwnPost = currentUser?.id === userId;

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenuDropdown(false);
      }
    };

    if (showMenuDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenuDropdown]);

  const handleMenuAction = (action: string) => {
    console.log(`🎯 Action: ${action} for post: ${postId}`);
    
    // Close the dropdown menu
    setShowMenuDropdown(false);
    
    // Actually implement the actions
    switch(action) {
      case 'edit':
        alert('Edit post functionality - Coming soon!');
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      case 'pin':
        alert('Post pinned to your profile!');
        break;
      case 'disable-comments':
        alert('Comments have been disabled for this post!');
        break;
      case 'change-privacy':
        alert('Privacy settings - Coming soon!');
        break;
      case 'view-analytics':
        alert('Post Analytics - Coming soon!');
        break;
      case 'boost-post':
        alert('Post Boost - Coming soon!');
        break;
      case 'copy-link':
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
      case 'share-to-story':
        alert('Share to Story - Coming soon!');
        break;
      case 'add-to-highlights':
        alert('Added to Highlights!');
        break;
      case 'open-new-tab':
        window.open(window.location.href, '_blank');
        break;
      case 'turn-off-notifications':
        alert('Notifications turned off for this post!');
        break;
      case 'archive-post':
        alert('Post archived successfully!');
        break;
      case 'embed-post':
        const embedCode = `<iframe src="${window.location.href}/embed" width="500" height="300"></iframe>`;
        navigator.clipboard.writeText(embedCode).then(() => {
          alert('Embed code copied to clipboard!');
        });
        break;
      case 'save':
        alert('Post saved successfully!');
        break;
      case 'hide':
        alert('Post hidden from feed!');
        break;
      case 'report':
        alert('Post reported - Thank you for helping keep our community safe!');
        break;
      case 'block':
        if(confirm('Are you sure you want to block this user?')) {
          alert('User blocked successfully!');
        }
        break;
      default:
        alert(`${action} functionality activated!`);
    }
    onPostAction(action);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onPostAction('delete');
      toast.success('Post deleted successfully');
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {isAnonymous ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-600" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm10 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-5 7c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
                </svg>
              </div>
            ) : (
              <Avatar 
                userId={userId}
                size="md"
              />
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-gray-900 hover:underline cursor-pointer">
                {isAnonymous ? "Anonymous" : user.name}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span className="hover:underline cursor-pointer">
                {time}
              </span>
              <span>•</span>
              <span className="hover:underline cursor-pointer" title={`Visible to ${visibility}`}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 64 64" 
                  fill="currentColor" 
                  className="inline-block"
                >
                  <path d="M32,0C15.776,0,2.381,12.077,0.292,27.729c-0.002,0.016-0.004,0.031-0.006,0.047 c-0.056,0.421-0.106,0.843-0.146,1.269c-0.019,0.197-0.029,0.396-0.045,0.594c-0.021,0.28-0.044,0.56-0.058,0.842 C0.014,30.983,0,31.49,0,32c0,17.673,14.327,32,32,32s32-14.327,32-32S49.673,0,32,0z M33.362,58.502 c-0.72,0.787-1.901,1.414-2.675,0.67c-0.653-0.644-0.099-1.44,0-2.353c0.125-1.065-0.362-2.345,0.666-2.676 c0.837-0.259,1.468,0.322,2.009,1.012C34.187,56.175,34.239,57.526,33.362,58.502z M43.446,49.87 c-1.18,0.608-2.006,0.494-3.323,0.673c-2.454,0.309-4.394,1.52-6.333,0c-0.867-0.695-0.978-1.451-1.65-2.341 c-1.084-1.364-1.355-3.879-3.01-3.322c-1.058,0.356-1.026,1.415-1.654,2.335c-0.81,1.156-0.607,2.793-2.005,2.993 c-0.974,0.138-1.499-0.458-2.321-1c-0.922-0.614-1.104-1.348-2.002-1.993c-0.934-0.689-1.69-0.693-2.654-1.334 c-0.694-0.463-0.842-1.304-1.673-1.334c-0.751-0.022-1.289,0.346-1.664,0.996c-0.701,1.214-0.942,4.793-2.988,4.665 c-1.516-0.103-4.758-3.509-5.994-4.327c-0.405-0.273-0.78-0.551-1.158-0.763c-1.829-3.756-2.891-7.952-2.997-12.385 c0.614-0.515,1.239-0.769,1.819-1.493c0.927-1.13,0.481-2.507,1.673-3.335c0.886-0.604,1.602-0.507,2.669-0.658 c1.529-0.222,2.491-0.422,3.988,0c1.459,0.409,2.016,1.246,3.326,1.992c1.415,0.81,2.052,1.766,3.66,2.001 c1.166,0.165,1.966-0.901,2.988-0.337c0.824,0.458,1.406,1.066,1.341,2.001c-0.1,1.218-2.522,0.444-2.659,1.662 c-0.183,1.558,2.512-0.194,3.992,0.33c0.974,0.355,2.241,0.294,2.325,1.334c0.081,1.156-1.608,0.837-2.657,1.335 c-1.162,0.541-1.771,0.996-3.004,1.329c-1.125,0.298-2.312-0.628-2.987,0.329c-0.53,0.742-0.343,1.489,0,2.335 c0.787,1.931,3.349,1.352,5.322,0.657c1.383-0.488,1.641-1.726,2.997-2.329c1.438-0.641,2.554-1.335,3.981-0.663 c1.178,0.556,0.849,2.05,2.006,2.663c1.253,0.668,2.432-0.729,3.663,0c0.957,0.569,0.887,1.521,1.655,2.327 c0.894,0.942,1.41,1.702,2.668,2c1.286,0.299,2.072-1.071,3.327-0.671c0.965,0.315,1.755,0.68,1.987,1.672 C46.465,48.634,44.744,49.198,43.446,49.87z M45.839,33.841c-1.154,1.16-2.156,1.539-3.771,1.893c-1.433,0.315-3.443,1.438-3.772,0 c-0.251-1.148,1.029-1.558,1.893-2.359c0.959-0.895,1.854-0.983,2.826-1.892c0.87-0.802,0.756-2.031,1.893-2.359 c1.109-0.32,2.182-0.019,2.825,0.947C48.652,31.438,47.006,32.681,45.839,33.841z M59.989,29.319 c-0.492,0.508-0.462,1.044-0.965,1.542c-0.557,0.539-1.331,0.307-1.738,0.968c-0.358,0.577-0.13,1.057-0.194,1.735 c-0.041,0.387-1.924,1.256-2.313,0.385c-0.214-0.481,0.281-0.907,0-1.353c-0.263-0.401-0.555-0.195-0.899,0.181 c-0.359,0.388-0.772,0.958-1.221,1.172c-0.589,0.273-0.196-2.25-0.395-3.088c-0.146-0.663,0.01-1.08,0.198-1.736 c0.25-0.91,0.938-1.206,1.155-2.125c0.194-0.806,0.033-1.295,0-2.123c-0.039-0.906-0.015-1.427-0.188-2.314 c-0.192-0.937-0.252-1.525-0.771-2.316c-0.418-0.624-0.694-1.001-1.354-1.352c-0.16-0.088-0.31-0.146-0.452-0.191 c-0.34-0.113-0.659-0.128-1.098-0.193c-0.888-0.132-1.522,0.432-2.314,0c-0.462-0.255-0.606-0.575-0.96-0.967 c-0.404-0.434-0.511-0.789-0.967-1.158c-0.341-0.276-0.552-0.437-0.965-0.581c-0.79-0.263-1.342-0.082-2.126,0.196 c-0.77,0.268-1.058,0.707-1.739,1.155c-0.522,0.303-0.893,0.371-1.348,0.774c-0.276,0.242-1.59,1.177-2.127,1.155 c-0.544-0.021-0.851-0.343-1.338-0.382c-0.065-0.008-0.13-0.008-0.204,0c0,0,0,0-0.005,0c-0.473,0.036-0.696,0.269-1.146,0.382 c-1.107,0.276-1.812-0.115-2.905,0.197c-0.712,0.2-0.993,0.766-1.73,0.771c-0.841,0.005-1.125-0.743-1.932-0.968 c-0.442-0.118-0.702-0.129-1.157-0.19c-0.749-0.108-1.178-0.119-1.926-0.191H24.86c-0.016,0.006-0.591,0.058-0.688,0 c-0.422-0.286-0.722-0.521-1.244-0.773c-0.575-0.283-0.919-0.428-1.547-0.584l0.026-0.381c0,0,0-0.847-0.121-1.207 c-0.115-0.361-0.24-0.361,0-1.086c0.248-0.722,0.679-1.182,0.679-1.182c0.297-0.228,0.516-0.305,0.769-0.58 c0.51-0.539,0.717-0.998,0.774-1.739c0.067-0.972-1.205-1.367-0.97-2.316c0.209-0.826,0.904-0.98,1.547-1.543 c0.779-0.67,1.468-0.758,2.12-1.542c0.501-0.593,0.911-0.965,0.97-1.738c0.053-0.657-0.23-1.068-0.57-1.538 C28.356,2.175,30.157,2,32,2c14.919,0,27.29,10.893,29.605,25.158c-0.203,0.352-0.001,0.796-0.27,1.193 C60.979,28.894,60.436,28.85,59.989,29.319z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 relative">
          <div className="relative" ref={dropdownRef}>
            <button 
              className="p-3 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative z-10 outline-none focus:outline-none focus:ring-0"
              onClick={() => setShowMenuDropdown(!showMenuDropdown)}
            >
              <span className="text-gray-600 text-xl font-bold">⋯</span>
            </button>
            
            {/* Dropdown menu positioned absolutely */}
            {showMenuDropdown && (
              <div className="absolute top-full right-4 mt-1 z-50">
                {/* Vertical smoke shade reflecting from 3 dots to dropdown */}
                <div className="absolute -top-6 right-0 w-3 h-8 z-10"
                     style={{
                       background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.04) 50%, transparent 100%)',
                       filter: 'blur(1px)'
                     }}>
                </div>
                <div className="w-80 bg-white rounded-2xl max-h-[70vh] overflow-y-auto relative"
                     style={{ 
                       marginRight: '-18px',
                       filter: 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.04)) drop-shadow(0 0 12px rgba(0, 0, 0, 0.02))',
                       boxShadow: '0 0 6px rgba(0, 0, 0, 0.04), 0 0 12px rgba(0, 0, 0, 0.02), 0 0 18px rgba(0, 0, 0, 0.01)'
                     }}>
            {isOwnPost ? (
              <div className="p-2">
                <Accordion type="multiple" defaultValue={["management"]} className="w-full">
                  <AccordionItem value="management">
                    <AccordionTrigger className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                      Post Management
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-blue-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('edit')}
                        >
                          <svg viewBox="0 0 64 64" className="w-4 h-4 text-blue-600" strokeWidth="3" stroke="currentColor" fill="none">
                            <polyline points="45.56 46.83 45.56 56.26 7.94 56.26 7.94 20.6 19.9 7.74 45.56 7.74 45.56 21.29"></polyline>
                            <polyline points="19.92 7.74 19.9 20.6 7.94 20.6"></polyline>
                            <line x1="13.09" y1="47.67" x2="31.1" y2="47.67"></line>
                            <line x1="13.09" y1="41.14" x2="29.1" y2="41.14"></line>
                            <line x1="13.09" y1="35.04" x2="33.1" y2="35.04"></line>
                            <line x1="13.09" y1="28.94" x2="39.1" y2="28.94"></line>
                            <path d="M34.45,43.23l.15,4.3a.49.49,0,0,0,.62.46l4.13-1.11a.54.54,0,0,0,.34-.23L57.76,22.21a1.23,1.23,0,0,0-.26-1.72l-3.14-2.34a1.22,1.22,0,0,0-1.72.26L34.57,42.84A.67.67,0,0,0,34.45,43.23Z"></path>
                            <line x1="50.2" y1="21.7" x2="55.27" y2="25.57"></line>
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Edit Post</div>
                            <div className="text-xs text-gray-500">Modify content, text, photos, and settings.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-red-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('delete')}
                        >
                          <svg viewBox="0 0 1024 1024" className="w-4 h-4 text-red-600" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M154 260h568v700H154z" fill="#FF3B30"></path>
                              <path d="M624.428 261.076v485.956c0 57.379-46.737 103.894-104.391 103.894h-362.56v107.246h566.815V261.076h-99.864z" fill="#030504"></path>
                              <path d="M320.5 870.07c-8.218 0-14.5-6.664-14.5-14.883V438.474c0-8.218 6.282-14.883 14.5-14.883s14.5 6.664 14.5 14.883v416.713c0 8.219-6.282 14.883-14.5 14.883zM543.5 870.07c-8.218 0-14.5-6.664-14.5-14.883V438.474c0-8.218 6.282-14.883 14.5-14.883s14.5 6.664 14.5 14.883v416.713c0 8.219-6.282 14.883-14.5 14.883z" fill="#152B3C"></path>
                              <path d="M721.185 345.717v-84.641H164.437z" fill="#030504"></path>
                              <path d="M633.596 235.166l-228.054-71.773 31.55-99.3 228.055 71.773z" fill="#FF3B30"></path>
                              <path d="M847.401 324.783c-2.223 0-4.475-0.333-6.706-1.034L185.038 117.401c-11.765-3.703-18.298-16.239-14.592-27.996 3.706-11.766 16.241-18.288 27.993-14.595l655.656 206.346c11.766 3.703 18.298 16.239 14.592 27.996-2.995 9.531-11.795 15.631-21.286 15.631z" fill="#FF3B30"></path>
                            </g>
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Delete Post</div>
                            <div className="text-xs text-gray-500">Remove this post completely.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('pin')}
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z" fill="#1C274C"></path>
                            </g>
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Pin Post</div>
                            <div className="text-xs text-gray-500">Pin to top of your profile.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('disable-comments')}
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4 text-gray-600" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M4.32698 6.63803L5.21799 7.09202L4.32698 6.63803ZM4.7682 20.2318L4.06109 19.5247H4.06109L4.7682 20.2318ZM18.362 16.673L18.816 17.564L18.816 17.564L18.362 16.673ZM19.673 15.362L20.564 15.816L20.564 15.816L19.673 15.362ZM19.673 6.63803L20.564 6.18404L20.564 6.18404L19.673 6.63803ZM18.362 5.32698L18.816 4.43597L18.816 4.43597L18.362 5.32698ZM5.63803 5.32698L6.09202 6.21799L5.63803 5.32698ZM7.70711 17.2929L7 16.5858L7.70711 17.2929ZM5 9.8C5 8.94342 5.00078 8.36113 5.03755 7.91104C5.07337 7.47262 5.1383 7.24842 5.21799 7.09202L3.43597 6.18404C3.18868 6.66937 3.09012 7.18608 3.04419 7.74817C2.99922 8.2986 3 8.97642 3 9.8H5ZM5 12V9.8H3V12H5ZM3 12V17H5V12H3ZM3 17V19.9136H5V17H3ZM3 19.9136C3 21.2054 4.56185 21.8524 5.4753 20.9389L4.06109 19.5247C4.40757 19.1782 5 19.4236 5 19.9136H3ZM5.4753 20.9389L8.41421 18L7 16.5858L4.06109 19.5247L5.4753 20.9389ZM15.2 16H8.41421V18H15.2V16ZM17.908 15.782C17.7516 15.8617 17.5274 15.9266 17.089 15.9624C16.6389 15.9992 16.0566 16 15.2 16V18C16.0236 18 16.7014 18.0008 17.2518 17.9558C17.8139 17.9099 18.3306 17.8113 18.816 17.564L17.908 15.782ZM18.782 14.908C18.5903 15.2843 18.2843 15.5903 17.908 15.782L18.816 17.564C19.5686 17.1805 20.1805 16.5686 20.564 15.816L18.782 14.908ZM19 12.2C19 13.0566 18.9992 13.6389 18.9624 14.089C18.9266 14.5274 18.8617 14.7516 18.782 14.908L20.564 15.816C20.8113 15.3306 20.9099 14.8139 20.9558 14.2518C21.0008 13.7014 21 13.0236 21 12.2H19ZM19 9.8V12.2H21V9.8H19ZM18.782 7.09202C18.8617 7.24842 18.9266 7.47262 18.9624 7.91104C18.9992 8.36113 19 8.94342 19 9.8H21C21 8.97642 21.0008 8.2986 20.9558 7.74817C20.9099 7.18608 20.8113 6.66937 20.564 6.18404L18.782 7.09202ZM17.908 6.21799C18.2843 6.40973 18.5903 6.71569 18.782 7.09202L20.564 6.18404C20.1805 5.43139 19.5686 4.81947 18.816 4.43597L17.908 6.21799ZM15.2 6C16.0566 6 16.6389 6.00078 17.089 6.03755C17.5274 6.07337 17.7516 6.1383 17.908 6.21799L18.816 4.43597C18.3306 4.18868 17.8139 4.09012 17.2518 4.04419C16.7014 3.99922 16.0236 4 15.2 4V6ZM8.8 6H15.2V4H8.8V6ZM6.09202 6.21799C6.24842 6.1383 6.47262 6.07337 6.91104 6.03755C7.36113 6.00078 7.94342 6 8.8 6V4C7.97642 4 7.2986 3.99922 6.74817 4.04419C6.18608 4.09012 5.66937 4.18868 5.18404 4.43597L6.09202 6.21799ZM5.21799 7.09202C5.40973 6.71569 5.71569 6.40973 6.09202 6.21799L5.18404 4.43597C4.43139 4.81947 3.81947 5.43139 3.43597 6.18404L5.21799 7.09202ZM8.41421 18V16C7.88378 16 7.37507 16.2107 7 16.5858L8.41421 18Z" fill="currentColor"></path>
                              <path d="M8 9L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M8 13L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                          </svg>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Turn off commenting</div>
                            <div className="text-xs text-gray-500">Disable comments on this post.</div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="control">
                    <AccordionTrigger className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                      Post Control
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('change-privacy')}
                        >
                          <Globe className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Change Privacy</div>
                            <div className="text-xs text-gray-500">Control who can see this post.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-blue-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('view-analytics')}
                        >
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">View Post Analytics</div>
                            <div className="text-xs text-gray-500">See likes, shares, reach, and engagement.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-green-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('boost-post')}
                        >
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Boost Post</div>
                            <div className="text-xs text-gray-500">Promote your post to more people.</div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="sharing">
                    <AccordionTrigger className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                      Sharing & Links
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-blue-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('copy-link')}
                        >
                          <Copy className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Copy Link</div>
                            <div className="text-xs text-gray-500">Get shareable link to your post.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('share-to-story')}
                        >
                          <UserPlus className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Share to Story</div>
                            <div className="text-xs text-gray-500">Repost to your story.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('add-to-highlights')}
                        >
                          <Bookmark className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Add to Highlights</div>
                            <div className="text-xs text-gray-500">Save to profile highlights.</div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="advanced">
                    <AccordionTrigger className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                      Advanced Options
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1">
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('open-new-tab')}
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Open in New Tab</div>
                            <div className="text-xs text-gray-500">View post in separate tab.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('turn-off-notifications')}
                        >
                          <BellOff className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Turn off notifications</div>
                            <div className="text-xs text-gray-500">Stop getting notifications for this post.</div>
                          </div>
                        </div>
                        
                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('archive-post')}
                        >
                          <Archive className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Archive Post</div>
                            <div className="text-xs text-gray-500">Hide from timeline but keep saved.</div>
                          </div>
                        </div>

                        <div 
                          className="flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 cursor-pointer rounded"
                          onClick={() => handleMenuAction('embed-post')}
                        >
                          <Code className="w-4 h-4 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">Embed Post</div>
                            <div className="text-xs text-gray-500">Get HTML embed code for websites.</div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : (
              <div className="p-2">
                <div 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded"
                  onClick={() => handleMenuAction('save')}
                >
                  <div className="w-5 h-5 flex items-center justify-center">📌</div>
                  <div>
                    <div className="font-medium text-gray-900">Save Post</div>
                    <div className="text-sm text-gray-500">Save this post to view later.</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded"
                  onClick={() => handleMenuAction('hide')}
                >
                  <div className="w-5 h-5 flex items-center justify-center">👁️</div>
                  <div>
                    <div className="font-medium text-gray-900">Hide Post</div>
                    <div className="text-sm text-gray-500">Hide this post from your feed.</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded"
                  onClick={() => handleMenuAction('report')}
                >
                  <div className="w-5 h-5 flex items-center justify-center">⚠️</div>
                  <div>
                    <div className="font-medium text-gray-900">Report Post</div>
                    <div className="text-sm text-gray-500">Report this post for inappropriate content.</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer rounded"
                  onClick={() => handleMenuAction('block')}
                >
                  <div className="w-5 h-5 flex items-center justify-center">🚫</div>
                  <div>
                    <div className="font-medium text-gray-900">Block User</div>
                    <div className="text-sm text-gray-500">Block this user from seeing your posts.</div>
                  </div>
                </div>
              </div>
             )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
        
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default PostHeader;