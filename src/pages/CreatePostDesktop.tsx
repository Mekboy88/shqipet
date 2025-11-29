import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CollapsibleAIChat from '@/components/create-post/ai-chat/CollapsibleAIChat';
import FloatingAIButton from '@/components/create-post/FloatingAIButton';
import PostIntentSection from '@/components/create-post/PostIntentSection';
import PostInsightsPanel from '@/components/create-post/PostInsightsPanel';
import AISmartSummary from '@/components/create-post/AISmartSummary';
import CreatePostFilePreview from '@/components/create-post/CreatePostFilePreview';
import AnonymousIcon from '@/components/icons/AnonymousIcon';
import OnlyMeIcon from '@/components/icons/OnlyMeIcon';
import FollowersIcon from '@/components/icons/FollowersIcon';
import FriendsIcon from '@/components/icons/FriendsIcon';
import PublicIcon from '@/components/icons/PublicIcon';
import PhotoIcon from '@/components/icons/PhotoIcon';
import VideoIcon from '@/components/icons/VideoIcon';
import { Mic, MapPin, BarChart3, Tag, Link2, Palette, Heart, Share2, Shield, Clock, Globe, Settings2, ChevronDown, Sparkles, Brain, Lightbulb, TrendingUp, Calendar, Languages, Info, Save, Eye, Send, X, Mic2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AnonymousSwitch } from '@/components/create-post/AnonymousSwitch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import SchedulingSlidingWindow from '@/components/create-post/sliding-windows/SchedulingSlidingWindow';
const CreatePostDesktop: React.FC = () => {
  const {
    displayName
  } = useUniversalUser();
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [postContent, setPostContent] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [previousVisibility, setPreviousVisibility] = useState('public');
  const [autoSave, setAutoSave] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [allowReactions, setAllowReactions] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);
  const [autoTranslate, setAutoTranslate] = useState(false);
  const [autoAI, setAutoAI] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [expiration, setExpiration] = useState('permanent');
  const [tone, setTone] = useState('friendly');
  const [contentWarning, setContentWarning] = useState(false);
  const [aiScan, setAiScan] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [postIntent, setPostIntent] = useState('emotion');
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [crosspostMarketplace, setCrosspostMarketplace] = useState(false);
  const [crosspostGroups, setCrosspostGroups] = useState(false);
  const [crosspostPages, setCrosspostPages] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (showTip) {
      const timer = setTimeout(() => setShowTip(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showTip]);
  useEffect(() => {
    if (autoSave && postContent) {
      const timer = setTimeout(() => {
        console.log('Auto-saving draft...');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [postContent, autoSave]);
  
  // Sync anonymous switch with visibility dropdown
  useEffect(() => {
    if (isAnonymous) {
      // Save current visibility before switching to anonymous
      if (visibility !== 'anonymous') {
        setPreviousVisibility(visibility);
      }
      setVisibility('anonymous');
    } else {
      // Restore previous visibility when turning off anonymous
      if (visibility === 'anonymous') {
        setVisibility(previousVisibility);
      }
    }
  }, [isAnonymous]);
  
  // Sync visibility dropdown with anonymous switch
  useEffect(() => {
    if (visibility === 'anonymous') {
      setIsAnonymous(true);
    } else {
      setIsAnonymous(false);
    }
  }, [visibility]);
  
  const charCount = postContent.length;
  const isOptimal = charCount > 0 && charCount <= 150;
  const handlePublish = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Error",
        description: "Please write something before publishing.",
        variant: "destructive"
      });
      return;
    }
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to publish posts.",
        variant: "destructive"
      });
      return;
    }
    setIsPublishing(true);
    try {
      const {
        data,
        error
      } = await supabase.from('posts').insert({
        user_id: user.id,
        content: {
          text: postContent,
          tone,
          contentWarning
        },
        visibility,
        post_type: 'regular',
        is_sponsored: false,
        is_anonymous: isAnonymous
      }).select().single();
      if (error) throw error;
      toast({
        title: "Post Published!",
        description: "Your post has been shared successfully."
      });
      setPostContent('');
      setShowPreview(false);
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleSchedule = (date: Date, time: string) => {
    toast({
      title: "Post Scheduled",
      description: `Your post will be published on ${date.toLocaleDateString()} at ${time}.`
    });
    console.log('Scheduled for:', date, time);
  };
  
  const handlePhotoClick = () => {
    console.log('📸 Photo button clicked');
    photoInputRef.current?.click();
  };

  const handleVideoClick = () => {
    console.log('🎥 Video button clicked');
    videoInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('📸 Photos selected:', files.length, files);
    setSelectedFiles(prev => {
      const newFiles = [...prev, ...files];
      console.log('📸 Total files after adding photos:', newFiles.length);
      return newFiles;
    });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('🎥 Videos selected:', files.length, files);
    setSelectedFiles(prev => {
      const newFiles = [...prev, ...files];
      console.log('🎥 Total files after adding videos:', newFiles.length);
      return newFiles;
    });
  };

  const handleRemoveFile = (index: number) => {
    console.log('🗑️ Removing file at index:', index);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const mediaTools = [{
    icon: PhotoIcon,
    label: 'Photo',
    color: 'text-blue-500',
    onClick: handlePhotoClick
  }, {
    icon: VideoIcon,
    label: 'Video',
    color: 'text-purple-500',
    onClick: handleVideoClick
  }, {
    icon: Mic,
    label: 'Audio',
    color: 'text-red-500'
  }, {
    icon: MapPin,
    label: 'Location',
    color: 'text-green-500'
  }, {
    icon: BarChart3,
    label: 'Poll',
    color: 'text-orange-500'
  }, {
    icon: Tag,
    label: 'Tag',
    color: 'text-pink-500'
  }, {
    icon: Link2,
    label: 'Link',
    color: 'text-indigo-500'
  }, {
    icon: Palette,
    label: 'Background',
    color: 'text-yellow-500'
  }, {
    icon: () => <AnonymousIcon />,
    label: 'Anonymous',
    color: 'text-gray-500'
  }];
  const aiFeatures = [{
    icon: Sparkles,
    label: 'Improve Writing',
    action: () => toast({
      title: "✨ Improving writing..."
    })
  }, {
    icon: Brain,
    label: 'Fix Grammar & Spelling',
    action: () => toast({
      title: "🧠 Checking grammar..."
    })
  }, {
    icon: Lightbulb,
    label: 'Generate Captions',
    action: () => toast({
      title: "💡 Generating captions..."
    })
  }, {
    icon: Tag,
    label: 'Suggest Hashtags',
    action: () => toast({
      title: "🔥 Finding hashtags..."
    })
  }, {
    icon: TrendingUp,
    label: 'Optimize Engagement',
    action: () => toast({
      title: "🎯 Analyzing engagement..."
    })
  }, {
    icon: Clock,
    label: 'Best Time to Post',
    action: () => toast({
      title: "🕓 Calculating best time..."
    })
  }, {
    icon: Shield,
    label: 'Detect Sensitive/Duplicate',
    action: () => toast({
      title: "🚫 Scanning content..."
    })
  }, {
    icon: Globe,
    label: 'Translate Automatically',
    action: () => toast({
      title: "🌍 Translating..."
    })
  }, {
    icon: Eye,
    label: 'Convert to Story',
    action: () => toast({
      title: "🧩 Converting to story..."
    })
  }, {
    icon: Mic2,
    label: 'Voice-Over Preview',
    action: () => toast({
      title: "🗣️ Generating voice-over..."
    })
  }];
  return <div className="min-h-screen w-full bg-background pt-14">
      <Helmet>
        <title>Create Post | Shqipet</title>
        <meta name="description" content="Compose a new Shqipet post with media, AI assistance, and privacy settings." />
        <link rel="canonical" href="/create-post" />
      </Helmet>
      <h1 className="sr-only">Create Post – Shqipet</h1>

      {/* Main 2-Column Layout (Left Sidebar + Center) */}
      <div className="w-full min-h-[calc(100vh-56px)] flex flex-col lg:grid lg:grid-cols-[280px_1fr] xl:pr-[420px] gap-4 p-2 sm:p-4">
        {/* Left Sidebar - Post Settings */}
        <motion.div initial={{
        opacity: 0,
        x: -40
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.4
      }} className="bg-card/80 backdrop-blur-xl shadow-md rounded-3xl border border-border p-4 sm:p-6 overflow-y-auto max-h-[600px] lg:max-h-none">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-foreground">Post Settings</h2>
          
          <div className="space-y-3 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none [&_*:focus]:ring-0 [&_*:focus-visible]:ring-0 [&_*:focus]:ring-offset-0 [&_*:focus-visible]:ring-offset-0 [&_*:focus]:shadow-none [&_*:focus-visible]:shadow-none [&_button:focus]:outline-none [&_button:focus-visible]:outline-none">
            {/* Comments & Privacy */}
            <Collapsible>
              <CollapsibleTrigger className="w-full focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-accent transition-all focus:outline-none focus-visible:outline-none">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                      <path d="M12 4V4C8.22876 4 6.34315 4 5.17157 5.17157C4 6.34315 4 8.22876 4 12V18C4 18.9428 4 19.4142 4.29289 19.7071C4.58579 20 5.05719 20 6 20H12C15.7712 20 17.6569 20 18.8284 18.8284C20 17.6569 20 15.7712 20 12V12" stroke="#4b5563" strokeWidth="2"></path>
                      <path d="M9 10L15 10" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M9 14H12" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M19 8L19 2M16 5H22" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <span className="font-medium text-sm">Comments & Privacy</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Allow Comments</span>
                  <Switch checked={allowComments} onCheckedChange={setAllowComments} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm flex items-center gap-0.5">
                    Allow Reactions
                    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" preserveAspectRatio="xMidYMid meet">
                      <path d="M93.99 8.97c-21.91 0-29.96 22.39-29.96 22.39s-7.94-22.39-30-22.39c-16.58 0-35.48 13.14-28.5 43.01c6.98 29.87 58.56 67.08 58.56 67.08s51.39-37.21 58.38-67.08c6.98-29.87-10.56-43.01-28.48-43.01z" fill="#f44336"/>
                      <g fill="#c33">
                        <path d="M30.65 11.2c17.2 0 25.74 18.49 28.5 25.98c.39 1.07 1.88 1.1 2.33.06L64 31.35C60.45 20.01 50.69 8.97 34.03 8.97c-6.9 0-14.19 2.28-19.86 7.09c5.01-3.29 10.88-4.86 16.48-4.86z"/>
                        <path d="M93.99 8.97c-5.29 0-10.11 1.15-13.87 3.47c2.64-1.02 5.91-1.24 9.15-1.24c16.21 0 30.72 12.29 24.17 40.7c-5.62 24.39-38.46 53.98-48.49 65.27c-.64.72-.86 1.88-.86 1.88s51.39-37.21 58.38-67.08c6.98-29.86-10.53-43-28.48-43z"/>
                      </g>
                      <path d="M17.04 24.82c3.75-4.68 10.45-8.55 16.13-4.09c3.07 2.41 1.73 7.35-1.02 9.43c-4 3.04-7.48 4.87-9.92 9.63c-1.46 2.86-2.34 5.99-2.79 9.18c-.18 1.26-1.83 1.57-2.45.46c-4.22-7.48-5.42-17.78.05-24.61z" fill="#ff8a80"/>
                      <path d="M77.16 34.66c-1.76 0-3-1.7-2.36-3.34c1.19-3.02 2.73-5.94 4.58-8.54c2.74-3.84 7.95-6.08 11.25-3.75c3.38 2.38 2.94 7.14.57 9.44c-5.09 4.93-11.51 6.19-14.04 6.19z" fill="#ff8a80"/>
                    </svg>
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" transform="matrix(-1, 0, 0, 1, 0, 0)">
                      <path d="M99.921936 529.985948c-45.564403-1.598751-81.5363-39.968774-80.736924-85.533177 1.598751-43.965652 36.771272-79.138173 80.736924-80.736924H448.449649s-41.567525-75.141296-43.166277-151.081967-3.197502-63.950039-3.197502-139.091335 123.903201-84.733802 127.900078 8.79313c4.796253 110.313817 48.761905 288.574551 295.768931 411.678377 0 171.066354 4.796253 359.71897 0 378.903981-66.348165 75.141296-160.674473 127.900078-270.98829 128.699453s-363.715847 4.796253-363.715847 4.796253c-44.765027-1.598751-79.937549-39.169399-78.338798-83.13505 1.598751-42.366901 35.971897-76.740047 78.338798-78.338798" fill="#FFD7C4"/>
                      <path d="M191.050742 1024c-54.357533-1.598751-95.925059-46.363778-94.326308-99.921936 1.598751-51.160031 43.166276-91.928181 93.526932-93.526932 8.79313-0.799375 15.98751 6.395004 16.786885 15.188134 0 8.79313-6.395004 15.98751-15.188134 16.786885-34.373146 0.799375-61.551913 28.777518-63.150663 63.150664-0.799375 35.971897 27.178767 65.54879 63.150663 67.147541 1.598751 0 254.201405-3.996877 362.916472-4.796253 95.925059-0.799375 187.053864-43.166276 255.800156-119.906323 2.398126-19.984387 0.799375-103.119438 0-184.655738-0.799375-55.156909-1.598751-117.508197-1.598751-177.461358-185.455113-95.125683-287.775176-240.612022-295.768931-420.471507-1.598751-39.169399-28.777518-52.758782-50.360656-51.959407-21.583138 0.799375-45.564403 14.388759-45.564402 42.366901 0 48.761905 0.799375 60.752537 1.598751 83.934427 0.799375 12.790008 0.799375 27.978142 1.598751 54.357533 1.598751 71.144418 40.76815 143.088212 41.567525 143.887588l12.790008 23.981264h-375.70648c-35.172521 0.799375-63.150664 29.576893-64.749414 64.749415-0.799375 36.771272 27.978142 67.946916 64.749414 68.746292 8.79313 0 15.98751 7.993755 15.188135 16.786885 0 8.79313-7.993755 15.98751-16.786885 15.188134-54.357533-1.598751-97.52381-47.163154-95.925059-102.320062 1.598751-51.959407 43.965652-94.326308 95.925059-95.925059h322.947697c-12.790008-28.777518-32.774395-80.736924-33.573771-134.295082-0.799375-25.580016-1.598751-41.567525-1.598751-53.558157-0.799375-23.981265-1.598751-35.971897-1.598751-85.533178 0-47.163154 39.169399-73.542545 76.740047-74.34192 38.370023-0.799375 80.736924 24.78064 83.135051 83.135051 7.993755 173.464481 104.718189 306.960187 286.9758 398.088993l8.79313 4.796253v7.993754c0 63.150664 0.799375 128.699454 1.598751 187.053865 1.598751 131.896956 1.598751 183.056987-1.598751 195.846994l-0.799375 3.996878-2.398127 3.197502c-75.141296 85.533177-175.862607 133.495706-282.978922 134.295082-107.116315 0-359.71897 3.996877-362.117096 3.996877z" fill="#191919"/>
                      <path d="M146.285714 692.259173c-47.163154 7.194379-93.526932-36.771272-93.526932-80.736925 0-47.962529 24.78064-76.740047 47.163154-80.736924" fill="#FFD7C4"/>
                      <path d="M135.893833 709.046058c-22.382514 0-44.765027-8.79313-63.150664-24.78064-22.382514-19.185012-35.971897-46.363778-35.971897-73.542545 0-55.956284 30.376269-91.128806 59.953162-96.724434 8.79313-1.598751 16.786885 3.996877 18.385636 12.790008 1.598751 8.79313-3.996877 16.786885-12.790008 18.385636-13.589383 2.398126-34.373146 24.78064-34.373146 65.54879 0 17.586261 9.592506 35.172521 24.780641 48.761905 15.188134 12.790008 33.57377 19.185012 50.360655 15.987509 8.79313-1.598751 16.786885 4.796253 18.385637 13.589384 1.598751 8.79313-4.796253 16.786885-13.589384 18.385636-3.197502 0.799375-7.993755 1.598751-11.990632 1.598751z" fill="#191919"/>
                      <path d="M191.050742 845.739266c-55.156909 4.796253-105.517564-21.583138-107.915691-72.743169-2.398126-39.169399 24.78064-74.34192 63.950039-80.736924" fill="#FFD7C4"/>
                      <path d="M177.461358 862.526151c-31.97502 0-61.551913-9.592506-81.536299-27.178766-18.385636-15.98751-27.978142-36.771272-29.576894-61.551913-3.197502-47.163154 30.376269-89.530055 77.539423-97.523809 8.79313-1.598751 16.786885 3.996877 18.385636 12.790008 1.598751 8.79313-4.796253 16.786885-12.790008 18.385636-31.175644 5.595628-52.758782 32.774395-50.360656 63.950039 0.799375 15.98751 7.194379 28.777518 18.385637 39.169399 16.786885 14.388759 43.166276 21.583138 71.943794 19.185011 8.79313-0.799375 16.786885 5.595628 17.58626 14.388759s-5.595628 16.786885-14.388758 17.586261c-5.595628 0.799375-10.391881 0.799375-15.188135 0.799375z" fill="#191919"/>
                      <path d="M840.943013 413.277127h139.890711c14.388759 0 26.379391 11.990632 26.379391 26.379391v541.976581c0 14.388759-11.990632 26.379391-26.379391 26.379391h-139.890711c-14.388759 0-26.379391-11.990632-26.379391-26.379391V439.656518c0-14.388759 11.990632-26.379391 26.379391-26.379391z" fill="#FFFFFF"/>
                      <path d="M980.833724 1024h-139.890711c-23.181889 0-42.366901-19.185012-42.366901-42.366901V439.656518c0-23.181889 19.185012-42.366901 42.366901-42.366901h139.890711c23.181889 0 42.366901 19.185012 42.366901 42.366901v541.976581c-0.799375 23.181889-19.185012 42.366901-42.366901 42.366901z m-139.890711-594.735363c-5.595628 0-10.391881 4.796253-10.391881 10.391881v541.976581c0 5.595628 4.796253 10.391881 10.391881 10.391881h139.890711c5.595628 0 10.391881-4.796253 10.391881-10.391881V439.656518c0-5.595628-4.796253-10.391881-10.391881-10.391881h-139.890711z" fill="#191919"/>
                      <path d="M913.686183 912.087432m-29.576893 0a29.576893 29.576893 0 1 0 59.153786 0 29.576893 29.576893 0 1 0-59.153786 0Z" fill="#709CD5"/>
                      <path d="M913.686183 957.651835c-24.78064 0-45.564403-20.783763-45.564403-45.564403s20.783763-45.564403 45.564403-45.564403 45.564403 20.783763 45.564402 45.564403c-0.799375 25.580016-20.783763 45.564403-45.564402 45.564403z m0-58.354411c-7.194379 0-13.589383 6.395004-13.589384 13.589383s6.395004 13.589383 13.589384 13.589383 13.589383-6.395004 13.589383-13.589383-6.395004-13.589383-13.589383-13.589383z" fill="#191919"/>
                      <path d="M942.4637 836.14676c-8.79313 0-15.98751-7.194379-15.98751-15.987509V472.430913c0-8.79313 7.194379-15.98751 15.98751-15.987509s15.98751 7.194379 15.98751 15.987509v347.728338c0 8.79313-7.194379 15.98751-15.98751 15.987509z" fill="#191919"/>
                      <path d="M278.18267 543.575332h-72.74317c-8.79313 0-15.98751-7.194379-15.987509-15.98751s7.194379-15.98751 15.987509-15.98751h72.74317c8.79313 0 15.98751 7.194379 15.98751 15.98751s-7.194379 15.98751-15.98751 15.98751z" fill="#191919"/>
                      <path d="M307.759563 705.848556h-72.74317c-8.79313 0-15.98751-7.194379-15.987509-15.98751s7.194379-15.98751 15.987509-15.98751h72.74317c8.79313 0 15.98751 7.194379 15.98751 15.98751s-7.194379 15.98751-15.98751 15.98751z" fill="#191919"/>
                      <path d="M339.734582 864.124902h-72.743169c-8.79313 0-15.98751-7.194379-15.98751-15.987509s7.194379-15.98751 15.98751-15.98751h72.743169c8.79313 0 15.98751 7.194379 15.98751 15.98751s-7.194379 15.98751-15.98751 15.987509z" fill="#191919"/>
                    </svg>
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block">
                      <circle fill="#FDDF6D" cx="227.939" cy="267.03" r="227.939"/>
                      <ellipse transform="matrix(0.2723 -0.9622 0.9622 0.2723 92.9429 358.6932)" fill="#FCEB88" cx="283.616" cy="117.899" rx="26.582" ry="47.6"/>
                      <path fill="#FCC56B" d="M276.783,461.311c-125.887,0-227.937-102.051-227.937-227.937c0-67.256,29.135-127.7,75.466-169.422 C50.518,101.684,0,178.453,0,267.025c0,125.887,102.051,227.937,227.937,227.937c58.63,0,112.084-22.144,152.471-58.514 C349.319,452.344,314.099,461.311,276.783,461.311z"/>
                      <g>
                        <path fill="#F9A880" d="M129.983,270.292c-16.927,0-30.65,13.723-30.65,30.65h61.301 C160.634,284.015,146.911,270.292,129.983,270.292z"/>
                        <path fill="#F9A880" d="M397.333,270.292c-16.927,0-30.651,13.723-30.651,30.65h61.301 C427.984,284.015,414.261,270.292,397.333,270.292z"/>
                      </g>
                      <g>
                        <path fill="#FD4DD7" d="M192.342,17.698c-28.554,4.158-49.48,25.855-54.504,51.965c-0.445,2.314-2.204,4.149-4.503,4.67l0,0 c-2.298,0.521-4.676-0.378-6.076-2.274c-15.772-21.379-43.972-31.943-71.51-23.431C25.307,58.04,6.063,88.891,10.964,120.374 c3.001,19.28,14.025,35.012,28.966,44.642h-0.001l105.694,73.14c15.824,10.951,37.633,6.003,47.18-10.706l62.54-109.438 c10.454-15.581,14.18-35.624,8.108-55.346C254.136,32.411,223.668,13.137,192.342,17.698z"/>
                        <path fill="#FD4DD7" d="M473.599,74.061c-22.035-5.592-43.811,3.881-55.349,21.366c-1.022,1.549-2.856,2.354-4.686,2.04l0,0 c-1.83-0.315-3.289-1.686-3.735-3.489c-5.025-20.319-22.357-36.518-44.967-38.633c-24.993-2.339-48.31,14.304-54.246,38.694 c-3.635,14.935-0.361,29.711,7.606,41.229h-0.001l54.841,85.127c8.211,12.746,25.574,15.727,37.566,6.449l78.542-60.765 c12.309-8.184,21.072-21.644,22.605-37.831C514.128,103.418,497.773,80.197,473.599,74.061z"/>
                      </g>
                      <g>
                        <path fill="#E54190" d="M193.66,214.253l-105.694-73.14h0.001c-14.94-9.63-25.965-25.362-28.966-44.642 c-2.888-18.554,2.615-36.884,13.849-50.74c-5.651,0.198-11.388,1.131-17.1,2.897C25.309,58.04,6.063,88.891,10.964,120.374 c3.001,19.28,14.025,35.012,28.966,44.642h-0.001l105.694,73.14c15.824,10.951,37.632,6.003,47.18-10.706l5.904-10.331 C196.976,216.326,195.285,215.377,193.66,214.253z"/>
                        <path fill="#E54190" d="M421.099,196.489l-54.841-85.127h0.001c-7.966-11.518-11.241-26.293-7.606-41.229 c1.299-5.34,3.432-10.309,6.234-14.788c-0.009-0.001-0.016-0.002-0.025-0.002c-24.993-2.339-48.31,14.304-54.246,38.694 c-3.635,14.937-0.361,29.711,7.606,41.229h-0.001l54.841,85.127c8.211,12.746,25.574,15.727,37.566,6.449l25.173-19.474 C429.966,205.721,424.667,202.029,421.099,196.489z"/>
                      </g>
                      <path fill="#7F184C" d="M280.205,421.312L280.205,421.312c-50.956,0-92.265-41.309-92.265-92.265l0,0H372.47l0,0 C372.47,380.004,331.161,421.312,280.205,421.312z"/>
                      <path fill="#F2F2F2" d="M210.452,329.047v14.403c0,6.073,4.923,10.995,10.995,10.995h117.514 c6.073,0,10.995-4.923,10.995-10.995v-14.403H210.452z"/>
                      <path fill="#FC4C59" d="M282.141,383.034c-24.94-11.587-52.617-9.903-75.059,2.114c16.864,21.98,43.384,36.164,73.229,36.164 l0,0c13.153,0,25.651-2.771,36.974-7.73C308.979,400.729,297.068,389.969,282.141,383.034z"/>
                    </svg>
                    <svg viewBox="0 0 511.999 511.999" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block">
                      <circle fill="#FDDF6D" cx="255.999" cy="236.276" r="236.276"/>
                      <path fill="#FCC56B" d="M306.632,437.67c-130.491,0-236.275-105.783-236.275-236.275c0-69.717,30.201-132.372,78.226-175.619 C72.091,64.886,19.725,144.465,19.725,236.275c0,130.491,105.783,236.275,236.275,236.275c60.775,0,116.184-22.953,158.048-60.654 C381.821,428.373,345.313,437.67,306.632,437.67z"/>
                      <circle fill="#FFFFFF" cx="381.366" cy="163.135" r="53.38"/>
                      <g>
                        <path fill="#F9A880" d="M156.328,220.652c-17.546,0-31.772,14.225-31.772,31.771h63.543 C188.1,234.877,173.874,220.652,156.328,220.652z"/>
                        <path fill="#F9A880" d="M433.458,216.396c-17.546,0-31.772,14.225-31.772,31.772h63.543 C465.229,230.62,451.004,216.396,433.458,216.396z"/>
                      </g>
                      <g>
                        <circle fill="#7F184C" cx="390.337" cy="163.135" r="19.224"/>
                        <path fill="#7F184C" d="M245.308,189.482c-3.374,0.001-6.648-1.779-8.406-4.937c-6.167-11.07-17.859-17.948-30.516-17.948 c-12.343,0-24.194,6.978-30.93,18.213c-2.73,4.554-8.634,6.03-13.186,3.301c-4.554-2.73-6.031-8.633-3.301-13.186 c10.189-16.995,28.358-27.552,47.418-27.552c19.625,0,37.753,10.658,47.31,27.817c2.584,4.637,0.918,10.491-3.719,13.074 C248.497,189.091,246.891,189.482,245.308,189.482z"/>
                        <path fill="#7F184C" d="M301.896,400.607L301.896,400.607c-52.82,0-95.64-42.82-95.64-95.64l0,0h191.279l0,0 C397.536,357.787,354.717,400.607,301.896,400.607z"/>
                      </g>
                      <path fill="#F2F2F2" d="M229.592,304.967v14.929c0,6.295,5.103,11.397,11.397,11.397h121.812 c6.295,0,11.397-5.103,11.397-11.397v-14.929H229.592z"/>
                      <path fill="#FC4C59" d="M330.285,352.788H263.08v0.112c-12.979,0.623-25.627,4.142-36.981,10.222 c6.739,8.783,14.967,16.361,24.306,22.36c7.836,5.034,12.676,13.609,12.676,22.923v49.926c0,29.641,24.029,53.668,53.668,53.668l0,0 c29.641,0,53.668-24.029,53.668-53.668v-65.41C370.418,370.756,352.45,352.788,330.285,352.788z"/>
                      <path fill="#BC3B4A" d="M316.541,490.438c-5.308,0-9.612-4.302-9.612-9.612v-91.332c0-1.069-2.506-3.687-4.788-5.002 c-4.645-2.571-6.293-8.401-3.722-13.045c2.571-4.645,8.453-6.307,13.098-3.737c1.498,0.829,14.635,8.483,14.635,21.785v91.332 C326.153,486.136,321.849,490.438,316.541,490.438z"/>
                      <ellipse transform="matrix(0.2723 -0.9622 0.9622 0.2723 132.4376 317.1604)" fill="#FCEB88" cx="275.905" cy="71.021" rx="27.554" ry="49.341"/>
                    </svg>
                  </span>
                  <Switch checked={allowReactions} onCheckedChange={setAllowReactions} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Allow Sharing/Repost</span>
                  <Switch checked={allowSharing} onCheckedChange={setAllowSharing} />
                </div>
                <div>
                  <label className="text-sm font-medium">Allow to comment</label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger className="w-full mt-1 h-9 text-sm focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0">
                      {visibility === 'public' ? (
                        <div className="flex items-center gap-2">
                          <PublicIcon className="w-4 h-4 text-gray-600" />
                          <span>Everyone</span>
                        </div>
                      ) : visibility === 'anonymous' ? (
                        <div className="flex items-center gap-2">
                          <AnonymousIcon className="w-4 h-4 text-gray-600" />
                          <span>Anonymous</span>
                        </div>
                      ) : visibility === 'onlyme' ? (
                        <div className="flex items-center gap-2">
                          <OnlyMeIcon className="w-4 h-4 text-gray-600" />
                          <span>Only Me</span>
                        </div>
                      ) : visibility === 'followers' ? (
                        <div className="flex items-center gap-2">
                          <FollowersIcon className="w-4 h-4 text-gray-600" />
                          <span>Followers</span>
                        </div>
                      ) : visibility === 'friends' ? (
                        <div className="flex items-center gap-2">
                          <FriendsIcon className="w-4 h-4 text-gray-600" />
                          <span>Friends</span>
                        </div>
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border shadow-lg z-50">
                      <SelectItem value="public" icon={<PublicIcon className="w-4 h-4 text-gray-600" />}>Everyone</SelectItem>
                      <SelectItem value="friends" icon={<FriendsIcon className="w-4 h-4 text-gray-600" />}>Friends</SelectItem>
                      <SelectItem value="followers" icon={<FollowersIcon className="w-4 h-4 text-gray-600" />}>Followers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Publishing Options */}
            <Collapsible>
              <CollapsibleTrigger className="w-full focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-accent transition-all focus:outline-none focus-visible:outline-none">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600">
                      <path d="M16 15.2V16.8875L16.9 17.9M15 2.5V6.5M9 2.5V6.5M9 11.5H3.51733M3.51733 11.5C3.50563 11.8208 3.5 12.154 3.5 12.5C3.5 17.4094 4.64094 19.7517 8 20.6041M3.51733 11.5C3.7256 5.79277 5.84596 4 12 4C17.3679 4 19.6668 5.36399 20.3048 9.5M20.5 17C20.5 19.4853 18.4853 21.5 16 21.5C13.5147 21.5 11.5 19.4853 11.5 17C11.5 14.5147 13.5147 12.5 16 12.5C18.4853 12.5 20.5 14.5147 20.5 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-medium text-sm">Publishing Options</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsScheduleOpen(true)}
                  >
                    Schedule
                  </Button>
                </div>
                <div>
                  <label className="text-sm font-medium">Expiration</label>
                  <Select value={expiration} onValueChange={setExpiration}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24h (Story Mode)</SelectItem>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cross-post to</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Marketplace</span>
                      <Switch checked={crosspostMarketplace} onCheckedChange={setCrosspostMarketplace} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Groups</span>
                      <Switch checked={crosspostGroups} onCheckedChange={setCrosspostGroups} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pages</span>
                      <Switch checked={crosspostPages} onCheckedChange={setCrosspostPages} />
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Language & AI Tone */}
            <Collapsible>
              <CollapsibleTrigger className="w-full focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-accent transition-all focus:outline-none focus-visible:outline-none">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600">
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.5 2.5V2C5.5 1.17157 6.17157 0.5 7 0.5C7.82843 0.5 8.5 1.17157 8.5 2V2.5H9.9742C9.9901 2.49975 10.0061 2.49974 10.0221 2.5H12C12.8284 2.5 13.5 3.17157 13.5 4C13.5 4.82843 12.8284 5.5 12 5.5H11.2512C10.7379 7.82318 9.75127 9.98263 8.30067 11.9736C9.27943 12.9992 10.4353 13.9118 11.7719 14.7138C12.4823 15.14 12.7126 16.0614 12.2864 16.7717C11.8602 17.4821 10.9388 17.7125 10.2284 17.2862C8.75981 16.4051 7.46579 15.399 6.34922 14.2699C5.33326 15.3069 4.1736 16.2908 2.87186 17.2206C2.19774 17.7021 1.26091 17.546 0.7794 16.8719C0.297886 16.1977 0.454024 15.2609 1.12814 14.7794C2.38555 13.8813 3.48271 12.9379 4.42182 11.9481C3.69705 10.8985 3.09174 9.76779 2.60746 8.55709C2.29979 7.78791 2.67391 6.91496 3.44309 6.60729C4.21226 6.29961 5.08522 6.67374 5.39289 7.44291C5.67512 8.14848 6.00658 8.8209 6.38782 9.46053C7.19463 8.20649 7.78489 6.88692 8.16216 5.5H2C1.17157 5.5 0.5 4.82843 0.5 4C0.5 3.17157 1.17157 2.5 2 2.5H5.5ZM16.4912 16.5H18.5088L17.5 13.5856L16.4912 16.5ZM15.4527 19.5L14.4175 22.4907C14.1465 23.2735 13.2922 23.6885 12.5093 23.4175C11.7265 23.1465 11.3115 22.2922 11.5825 21.5093L16.0825 8.50933C16.5484 7.16356 18.4516 7.16356 18.9175 8.50933L23.4175 21.5093C23.6885 22.2922 23.2735 23.1465 22.4907 23.4175C21.7078 23.6885 20.8535 23.2735 20.5825 22.4907L19.5473 19.5H15.4527Z" fill="currentColor"/>
                    </svg>
                    <span className="font-medium text-sm">Language & AI Tone</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Translate</span>
                  <Switch checked={autoTranslate} onCheckedChange={setAutoTranslate} />
                </div>
                <div>
                  <label className="text-sm font-medium">Tone</label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="informative">Informative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Moderation & Security */}
            <Collapsible>
              <CollapsibleTrigger className="w-full focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-accent transition-all focus:outline-none focus-visible:outline-none">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="currentColor">
                      <path d="M498.892,344.739l-79.386-137.504c-0.322-0.558-0.687-1.076-1.088-1.553L342.891,74.868 c-8.492-16.974-21.672-30.973-38.135-40.503c-14.783-8.56-31.583-13.084-48.582-13.084c-34.582,0-66.817,18.566-84.129,48.463 l-79.387,137.49c-0.321,0.557-0.59,1.137-0.805,1.733L17.689,337.439C6.115,353.886,0,373.221,0,393.394 c0,53.665,43.659,97.325,97.322,97.325h317.531c0.761,0,1.505-0.079,2.222-0.229c16.263-0.359,32.278-4.855,46.445-13.059 c22.444-12.995,38.482-33.958,45.164-59.026C515.361,393.336,511.884,367.17,498.892,344.739z M487.868,412.857 c-5.198,19.509-17.679,35.822-35.142,45.934c-11.504,6.662-24.562,10.184-37.86,10.184c-0.711,0.004-1.419,0.069-2.111,0.206 H97.322c-41.787,0-75.783-33.998-75.783-75.786c0-15.845,4.842-31.024,14.003-43.895c0.198-0.278,0.381-0.565,0.554-0.86 l75.189-130.248l0.121-0.206c0.349-0.59,0.639-1.209,0.868-1.845L190.69,80.527c13.469-23.258,38.561-37.706,65.484-37.706 c13.214,0,26.281,3.523,37.791,10.186c12.889,7.46,23.188,18.438,29.787,31.745c0.101,0.204,0.208,0.404,0.322,0.601 l76.638,132.737c0.322,0.558,0.687,1.076,1.088,1.554l78.449,135.879C490.361,372.985,493.067,393.348,487.868,412.857z"/>
                      <path d="M167.012,186.926c-5.141-2.99-11.734-1.247-14.723,3.896L83.633,308.887c-2.989,5.141-1.245,11.734,3.896,14.723 c1.703,0.991,3.566,1.461,5.404,1.461c3.709,0,7.321-1.919,9.319-5.358l68.656-118.064 C173.898,196.508,172.155,189.916,167.012,186.926z"/>
                      <path d="M83.413,330.662c-5.146-2.984-11.735-1.232-14.719,3.915l-0.254,0.438c-2.983,5.146-1.231,11.736,3.915,14.719 c1.702,0.985,3.559,1.454,5.393,1.454c3.714,0,7.329-1.924,9.326-5.369l0.253-0.438 C90.311,340.235,88.559,333.645,83.413,330.662z"/>
                      <path d="M407.796,426.312c-51.358-0.063-62.716-0.037-78.437,0l-2.665,0.005c-5.948,0.014-10.759,4.846-10.746,10.793 c0.014,5.94,4.832,10.746,10.769,10.746c0.009,0,0.017,0,0.025,0l2.668-0.006c15.698-0.036,27.04-0.062,78.36,0 c0.005,0,0.01,0,0.015,0c5.94,0,10.761-4.814,10.768-10.757C418.559,431.148,413.743,426.32,407.796,426.312z"/>
                      <path d="M431.309,421.911l-0.236,0.137c-5.21,2.868-7.111,9.417-4.243,14.627c1.96,3.565,5.643,5.58,9.445,5.58 c1.754,0,3.534-0.43,5.181-1.335c0.246-0.136,0.493-0.279,0.739-0.423c5.133-3.006,6.856-9.604,3.849-14.736 C443.038,420.629,436.44,418.905,431.309,421.911z"/>
                      <path d="M255.965,313.249c19.807,0,35.922-16.114,35.922-35.921V168.577c0-19.806-16.116-35.921-35.924-35.921 c-19.807,0-35.921,16.114-35.921,35.921v108.75C220.042,297.135,236.157,313.249,255.965,313.249z M241.58,168.577h0.001 c0-7.93,6.452-14.382,14.383-14.382c7.93,0,14.383,6.451,14.383,14.382v108.75c0,7.93-6.452,14.382-14.383,14.382h-0.002 c-7.93,0-14.382-6.452-14.382-14.382V168.577z"/>
                      <path d="M255.965,333.502c-19.807,0-35.921,16.115-35.921,35.923c0,19.807,16.114,35.921,35.921,35.921 c19.809,0,35.923-16.114,35.923-35.921C291.888,349.616,275.772,333.502,255.965,333.502z M255.965,383.807 c-7.93,0-14.382-6.452-14.382-14.382c0-7.931,6.451-14.384,14.382-14.384c7.931,0,14.384,6.453,14.384,14.384 C270.349,377.355,263.896,383.807,255.965,383.807z"/>
                    </svg>
                    <span className="font-medium text-sm">Moderation & Security</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Content Warning</span>
                  <Switch checked={contentWarning} onCheckedChange={setContentWarning} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Content Scan</span>
                  <Switch checked={aiScan} onCheckedChange={setAiScan} />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Draft & Auto-Save */}
            <Collapsible>
              <CollapsibleTrigger className="w-full focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-accent transition-all focus:outline-none focus-visible:outline-none">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none">
                      <path d="M4,9V4A1,1,0,0,1,5,3H16l4,4V20a1,1,0,0,1-1,1H8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      <path d="M8,7h2m6,8H8v6h8ZM4,16V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                      <line x1="4.05" y1="20.5" x2="3.95" y2="20.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/>
                    </svg>
                    <span className="font-medium text-sm">Draft & Auto-Save</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Save</span>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Restore Draft
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* Engagement Analytics */}
            <Collapsible>
              <CollapsibleTrigger className="w-full focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-accent transition-all focus:outline-none focus-visible:outline-none">
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600" fill="none">
                      <path d="M4,18.9999905 L7.75407946,11.491832 C7.8680565,11.2638231 8.06482016,11.0879651 8.30413884,11.0001847 C9.11356935,10.7032911 9.60000359,10.8000012 9.76344156,11.2903152 L11.1190224,15.3570574 C11.1996482,15.5988744 11.3695623,15.8007859 11.5940587,15.9215227 C12.3533352,16.3298705 12.8485386,16.3029137 13.079669,15.8406525 L18,5.99999082 M13,6.46409237 L17.2774408,5.31795559 C17.4347269,5.27579637 17.5999292,5.27269863 17.7586883,5.30891799 C18.3183612,5.43660193 18.6397719,5.65560146 18.7229204,5.96591657 L19.9282036,10.4640923" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="font-medium text-sm">Engagement Analytics</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 space-y-3 p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Predicted Reach</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-3/4"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Hashtag Effectiveness</p>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-2/3"></div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </motion.div>

        {/* Center Column - Editor */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.96,
        y: 40
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.1
      }} className="bg-card/80 backdrop-blur-xl shadow-md rounded-3xl border border-border focus-within:border-red-400/80 transition-all p-8 overflow-y-auto flex flex-col">
          {/* Header with Avatar & Visibility */}
          <div className="flex items-center gap-4 mb-6">
            {isAnonymous ? (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <AnonymousIcon className="w-7 h-7 text-gray-600" />
              </div>
            ) : (
              <Avatar size="lg" />
            )}
            <div className="flex-1">
              <p className="font-semibold text-lg">{isAnonymous ? "Anonymous" : (displayName || "User")}</p>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="w-48 h-8 text-sm border-red-200/40 hover:border-red-300/50 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus-visible:ring-offset-0 focus:shadow-none focus-visible:shadow-none transition-all duration-200">
                  {visibility === 'public' ? (
                    <div className="flex items-center gap-2">
                      <PublicIcon className="w-4 h-4 text-gray-600" />
                      <span>Public</span>
                    </div>
                  ) : visibility === 'anonymous' ? (
                    <div className="flex items-center gap-2">
                      <AnonymousIcon className="w-4 h-4 text-gray-600" />
                      <span>Anonymous</span>
                    </div>
                  ) : visibility === 'onlyme' ? (
                    <div className="flex items-center gap-2">
                      <OnlyMeIcon className="w-4 h-4 text-gray-600" />
                      <span>Only Me</span>
                    </div>
                  ) : visibility === 'followers' ? (
                    <div className="flex items-center gap-2">
                      <FollowersIcon className="w-4 h-4 text-gray-600" />
                      <span>Followers</span>
                    </div>
                  ) : visibility === 'friends' ? (
                    <div className="flex items-center gap-2">
                      <FriendsIcon className="w-4 h-4 text-gray-600" />
                      <span>Friends</span>
                    </div>
                  ) : (
                    <SelectValue />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public" icon={<PublicIcon className="w-4 h-4 text-gray-600" />}>
                    <span>Public</span>
                  </SelectItem>
                  <SelectItem value="friends" icon={<FriendsIcon className="w-4 h-4 text-gray-600" />}>
                    <span>Friends</span>
                  </SelectItem>
                  <SelectItem value="followers" icon={<FollowersIcon className="w-4 h-4 text-gray-600" />}>
                    <span>Followers</span>
                  </SelectItem>
                  <SelectItem value="onlyme" icon={<OnlyMeIcon className="w-4 h-4 text-gray-600" />}>
                    <span>Only Me</span>
                  </SelectItem>
                  <SelectItem value="anonymous" icon={<AnonymousIcon className="w-4 h-4 text-gray-600" />}>
                    <span>Anonymous</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col items-center gap-2">
              <AnonymousSwitch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                onIcon={<AnonymousIcon className="w-5 h-5 text-gray-600" />}
                offIcon={
                  visibility === 'public' ? (
                    <PublicIcon className="w-5 h-5 text-gray-600" />
                  ) : visibility === 'friends' ? (
                    <FriendsIcon className="w-5 h-5 text-gray-600" />
                  ) : visibility === 'followers' ? (
                    <FollowersIcon className="w-5 h-5 text-gray-600" />
                  ) : visibility === 'onlyme' ? (
                    <OnlyMeIcon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <PublicIcon className="w-5 h-5 text-gray-600" />
                  )
                }
              />
              <span className="text-sm text-muted-foreground"> Anonymous</span>
            </div>
          </div>

          {/* Text Editor */}
          <div className="flex-1 mb-6 relative">
            {!postContent && <div className="absolute left-4 top-1 flex items-center gap-2 pointer-events-none text-lg text-muted-foreground leading-tight z-10">
                <span>{isAnonymous ? "Edhe vetë platforma Shqipet nuk e di botuesin" : "Çdo moment është një fillim i ri"}</span>
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-gray-600 flex-shrink-0">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                  <path d="M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434z"></path>
                </svg>
              </div>}
            <div className="relative">
              {/* Anonymous watermark inside textarea boundaries */}
              {isAnonymous && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden rounded-[14px]">
                  <AnonymousIcon className="w-48 h-48 text-gray-400 opacity-10" />
                </div>
              )}
              <Textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="" className="min-h-[200px] text-lg resize-none border border-red-200/55 rounded-[14px] px-4 transition-all duration-200 ease-out hover:border-red-300/60 focus-visible:border-red-300/70 focus-visible:ring-0 focus-visible:shadow-[0_0_20px_rgba(239,68,68,0.08)] relative z-10 bg-transparent" style={{
              backgroundImage: `repeating-linear-gradient(
                    to bottom,
                    transparent 0px,
                    transparent 25px,
                    rgba(239, 68, 68, 0.10) 25px,
                    rgba(239, 68, 68, 0.10) 26px
                  )`,
              lineHeight: '26px',
              paddingTop: '4px',
              paddingBottom: '4px',
              caretColor: 'rgba(239, 68, 68, 0.6)',
              verticalAlign: 'baseline'
            }} />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">
                {charCount} characters {isOptimal && <span className="text-green-600 font-medium">✓ Optimal</span>}
              </span>
              <Button variant="ghost" size="sm">
                <Mic2 className="w-4 h-4 mr-2" />
                Voice Input
              </Button>
            </div>
          </div>

          {/* AI Buttons Row */}
          <div className="flex items-center justify-center gap-4 -mt-4 mb-4">
            <FloatingAIButton />
            <PostIntentSection selectedIntent={postIntent} onSelectIntent={setPostIntent} />
            
            {/* AI Chat Toggle Button */}
            {!showAIChat && <motion.button onClick={() => setShowAIChat(true)} className="relative group" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                {/* Pulsing Glow Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-200 to-purple-300 opacity-75 blur-md animate-pulse" />
                
                {/* Main Button */}
                <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-200 to-purple-300 rounded-full shadow-lg">
                  <MessageSquare className="w-5 h-5 text-foreground animate-pulse" />
                  <span className="font-semibold text-foreground text-sm">Shqipet AI</span>
                </div>
              </motion.button>}
          </div>

          {/* AI Smart Summary */}
          <AISmartSummary content={postContent} />

          {/* File Preview */}
          {selectedFiles.length > 0 && (
            <div className="mb-6">
              <div className="text-xs text-muted-foreground mb-2">
                📎 {selectedFiles.length} file(s) attached
              </div>
              <CreatePostFilePreview 
                files={selectedFiles} 
                onRemoveFile={handleRemoveFile} 
              />
            </div>
          )}
          
          {/* Debug info */}
          {selectedFiles.length === 0 && (
            <div className="text-xs text-muted-foreground mb-2">
              No files selected yet
            </div>
          )}

          {/* Media Toolbar */}
          <div className="border-t border-border pt-4 mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Add to your post</p>
            <div className="flex flex-wrap gap-3">
              {mediaTools.map((tool, idx) => <motion.button key={idx} onClick={tool.onClick} whileHover={{
              scale: 1.1
            }} whileTap={{
              scale: 0.95
            }} className={`flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-accent transition-all ${tool.color}`}>
                  <tool.icon className="w-6 h-6" />
                  <span className="text-xs text-muted-foreground">{tool.label}</span>
                </motion.button>)}
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif"
            multiple
            className="hidden"
            onChange={handlePhotoChange}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            multiple
            className="hidden"
            onChange={handleVideoChange}
          />

          {/* Preview Button */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mb-4">
                <svg className="w-64 h-64" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                  <path d="M64.32 103.32c-34.03 0-53.56-33.13-56.94-39.38c3.07-6.27 20.91-39.26 56.94-39.26s53.87 32.98 56.94 39.26c-3.38 6.25-22.92 39.38-56.94 39.38z" fill="#fafafa" />
                  <path d="M64.32 27.12c15.81 0 29.84 6.42 41.7 19.09c6.63 7.08 10.73 14.26 12.49 17.67c-4.51 7.99-23.05 36.99-54.19 36.99c-14.88 0-28.63-6.45-40.89-19.17c-6.89-7.15-11.37-14.41-13.3-17.82c1.75-3.41 5.86-10.6 12.49-17.67c11.86-12.67 25.89-19.09 41.7-19.09m0-4.88C22.56 22.24 4.66 64 4.66 64s20.25 41.76 59.66 41.76S123.97 64 123.97 64s-17.9-41.76-59.65-41.76z" fill="#b0bec5" />
                  <path d="M64.32 37c26.97 0 45.47 16.51 53.66 27.71c.96 1.31 1.99-4.99 1.12-6.36c-7.84-12.26-25.41-32.91-54.77-32.91S17.38 46.1 9.54 58.36c-.88 1.37.3 6.83 1.41 5.64c8.54-9.17 26.39-27 53.37-27z" fill="#b0bec5" />
                  <circle cx="64.32" cy="60.79" r="33.15" fill="#9c7a63" />
                  <path d="M64.32 37c10.87 0 20.36 2.68 28.36 6.62c-5.81-9.58-16.34-15.97-28.36-15.97c-12.28 0-23 6.69-28.72 16.61C43.61 40.04 53.18 37 64.32 37z" fill="#806451" />
                  <circle cx="64.32" cy="60.79" r="15.43" fill="#212121" />
                  <circle cx="88.86" cy="59.37" r="7.72" fill="#d9baa5" />
                  <path d="M7.21 67.21c-.52 0-1.05-.13-1.54-.4a3.207 3.207 0 0 1-1.27-4.35c.85-1.55 21.28-40.21 59.92-40.21s58.47 37.89 59.29 39.41c.84 1.56.27 3.5-1.29 4.35c-1.56.84-3.5.27-4.35-1.29c-.18-.34-18.88-33.86-53.66-33.86c-34.79 0-54.11 34.34-54.3 34.69a3.185 3.185 0 0 1-2.8 1.66z" fill="#616161" />
                </svg>
                Preview Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
              <DialogHeader>
                <DialogTitle>Post Preview</DialogTitle>
              </DialogHeader>
              
              {/* Render post exactly as it would appear in feed */}
              <div className="bg-card rounded-lg shadow-sm border border-border animate-fade-in">
                {/* Post Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isAnonymous ? (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <AnonymousIcon className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <Avatar size="md" />
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{isAnonymous ? "Anonymous" : displayName}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M350.907,241.75c-0.016,0-0.04,0-0.056,0l-67.206,0.322c-6.068-13.137-20.863-20.33-35.218-16.25 c-3.678,1.048-6.952,2.79-9.827,4.968l-105.782-92.774c-2.548-2.25-6.492-2-8.734,0.573c-2.258,2.572-2,6.484,0.572,8.742 l105.788,92.782c-3.692,6.67-4.857,14.742-2.609,22.653c0.774,2.718,2.006,5.162,3.423,7.452l-73.587,81.065 c-3.064,3.371-2.814,8.597,0.565,11.661c1.58,1.436,3.564,2.145,5.548,2.145c2.242,0,4.484-0.911,6.113-2.71l73.572-81.04 c6.404,3.145,13.901,4.121,21.302,2.016c8.815-2.508,15.452-8.766,18.956-16.508l67.234-0.323 c6.847-0.032,12.363-5.605,12.331-12.443C363.262,247.258,357.722,241.75,350.907,241.75z"></path>
                            <path d="M256,0C114.839,0,0,114.847,0,256c0,141.161,114.839,256,256,256s256-114.839,256-256 C512,114.847,397.161,0,256,0z M411.611,342.814c-1.26,2.266-2.57,4.492-3.913,6.67l26.645,16.484 c-17.686,28.573-42.028,52.597-70.865,69.895l-16.044-26.887c-2.226,1.33-4.478,2.605-6.762,3.838l14.865,27.597 C325.907,456.468,292,465.597,256,465.597c-37.008,0-71.782-9.678-101.992-26.581l15.182-27.403 c-2.234-1.25-4.436-2.54-6.603-3.863l-16.397,26.686c-28.595-17.662-52.643-41.984-69.964-70.815l26.863-16.088 c-1.327-2.218-2.605-4.468-3.831-6.742l-27.593,14.895C55.558,326.024,46.403,292.064,46.403,256 c0-36.758,9.542-71.322,26.238-101.395l8.51,4.186l18.871,11.048l0.698-1.242c1.125-1.992,2.276-3.952,3.462-5.879l-26.696-16.403 c17.643-28.613,41.956-52.677,70.768-70.016l16.081,26.863c2.226-1.33,4.486-2.613,6.762-3.855L156.18,71.734 c29.696-16.145,63.706-25.331,99.82-25.331c36.905,0,71.593,9.621,101.746,26.444l-4.843,8.548l-10.089,19 c2.166,1.21,4.29,2.452,6.391,3.734l16.339-26.734c28.631,17.621,52.722,41.927,70.089,70.734l-26.861,16.097 c1.345,2.234,2.629,4.492,3.865,6.774l27.55-14.96c16.202,29.726,25.417,63.79,25.417,99.96c0,36.831-9.581,71.444-26.331,101.548 L411.611,342.814z"></path>
                          </svg>
                          <span>Just now</span>
                          <span>•</span>
                          {visibility === 'public' && <PublicIcon className="w-3 h-3" />}
                          {visibility === 'anonymous' && <AnonymousIcon className="w-3 h-3" />}
                          {visibility === 'onlyme' && <OnlyMeIcon className="w-3 h-3" />}
                          {visibility === 'followers' && <FollowersIcon className="w-3 h-3" />}
                          {visibility === 'friends' && <FriendsIcon className="w-3 h-3" />}
                          <span className="capitalize">{visibility}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Text Content */}
                {postContent && (
                  <div className="px-4 pb-4">
                    <p className="text-foreground whitespace-pre-wrap">{postContent}</p>
                  </div>
                )}

                {/* Post Media */}
                {selectedFiles.length > 0 && (
                  <div className="w-full">
                    <CreatePostFilePreview 
                      files={selectedFiles}
                      onRemoveFile={() => {}}
                    />
                  </div>
                )}

                {/* Placeholder if no content */}
                {!postContent && selectedFiles.length === 0 && (
                  <div className="px-4 pb-4">
                    <p className="text-muted-foreground italic">No content yet...</p>
                  </div>
                )}

                {/* Separator */}
                <div className="px-4">
                  <div className="border-t border-border" />
                </div>

                {/* Post Actions (Like, Comment, Share) - Exact match to feed */}
                <div className="px-4 py-3">
                  <div className="flex justify-around">
                    {/* Like Button */}
                    <button className="flex items-center justify-between rounded-md p-2 w-full transition-colors duration-200 text-gray-600 hover:text-red-600 hover:bg-gray-100">
                      <div className="flex items-center space-x-2">
                        <svg 
                          className="w-6 h-6"
                          viewBox="0 0 489.543 489.543" 
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                        >
                          <path d="M270.024,0c-22.6,0-15,48.3-15,48.3s-48.3,133.2-94.5,168.7c-9.9,10.4-16.1,21.9-20,31.3l0,0l0,0 c-0.9,2.3-1.7,4.5-2.4,6.5c-3.1,6.3-9.7,16-23.8,24.5l46.2,200.9c0,0,71.5,9.3,143.2,7.8c28.7,2.3,59.1,2.5,83.3-2.7 c82.2-17.5,61.6-74.8,61.6-74.8c44.3-33.3,19.1-74.9,19.1-74.9c39.4-41.1,0.7-75.6,0.7-75.6s21.3-33.2-6.2-58.3 c-34.3-31.4-127.4-10.5-127.4-10.5l0,0c-6.5,1.1-13.4,2.5-20.8,4.3c0,0-32.2,15,0-82.7C346.324,15.1,292.624,0,270.024,0z"/>
                          <path d="M127.324,465.7l-35-166.3c-2-9.5-11.6-17.3-21.3-17.3h-66.8l-0.1,200.8h109.1C123.024,483,129.324,475.2,127.324,465.7z"/>
                        </svg>
                        <span className="font-medium text-sm">Pëlqej</span>
                      </div>
                    </button>

                    {/* Comment Button */}
                    {allowComments && (
                      <button className="flex items-center justify-between text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md p-2 w-full transition-colors duration-200">
                        <div className="flex items-center space-x-2">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path d="M4.32698 6.63803L5.21799 7.09202L4.32698 6.63803ZM4.7682 20.2318L4.06109 19.5247H4.06109L4.7682 20.2318ZM18.362 16.673L18.816 17.564L18.816 17.564L18.362 16.673ZM19.673 15.362L20.564 15.816L20.564 15.816L19.673 15.362ZM19.673 6.63803L20.564 6.18404L20.564 6.18404L19.673 6.63803ZM18.362 5.32698L18.816 4.43597L18.816 4.43597L18.362 5.32698ZM5.63803 5.32698L6.09202 6.21799L5.63803 5.32698ZM7.70711 17.2929L7 16.5858L7.70711 17.2929ZM5 9.8C5 8.94342 5.00078 8.36113 5.03755 7.91104C5.07337 7.47262 5.1383 7.24842 5.21799 7.09202L3.43597 6.18404C3.18868 6.66937 3.09012 7.18608 3.04419 7.74817C2.99922 8.2986 3 8.97642 3 9.8H5ZM5 12V9.8H3V12H5ZM3 12V17H5V12H3ZM3 17V19.9136H5V17H3ZM3 19.9136C3 21.2054 4.56185 21.8524 5.4753 20.9389L4.06109 19.5247C4.40757 19.1782 5 19.4236 5 19.9136H3ZM5.4753 20.9389L8.41421 18L7 16.5858L4.06109 19.5247L5.4753 20.9389ZM15.2 16H8.41421V18H15.2V16ZM17.908 15.782C17.7516 15.8617 17.5274 15.9266 17.089 15.9624C16.6389 15.9992 16.0566 16 15.2 16V18C16.0236 18 16.7014 18.0008 17.2518 17.9558C17.8139 17.9099 18.3306 17.8113 18.816 17.564L17.908 15.782ZM18.782 14.908C18.5903 15.2843 18.2843 15.5903 17.908 15.782L18.816 17.564C19.5686 17.1805 20.1805 16.5686 20.564 15.816L18.782 14.908ZM19 12.2C19 13.0566 18.9992 13.6389 18.9624 14.089C18.9266 14.5274 18.8617 14.7516 18.782 14.908L20.564 15.816C20.8113 15.3306 20.9099 14.8139 20.9558 14.2518C21.0008 13.7014 21 13.0236 21 12.2H19ZM19 9.8V12.2H21V9.8H19ZM18.782 7.09202C18.8617 7.24842 18.9266 7.47262 18.9624 7.91104C18.9992 8.36113 19 8.94342 19 9.8H21C21 8.97642 21.0008 8.2986 20.9558 7.74817C20.9099 7.18608 20.8113 6.66937 20.564 6.18404L18.782 7.09202ZM17.908 6.21799C18.2843 6.40973 18.5903 6.71569 18.782 7.09202L20.564 6.18404C20.1805 5.43139 19.5686 4.81947 18.816 4.43597L17.908 6.21799ZM15.2 6C16.0566 6 16.6389 6.00078 17.089 6.03755C17.5274 6.07337 17.7516 6.1383 17.908 6.21799L18.816 4.43597C18.3306 4.18868 17.8139 4.09012 17.2518 4.04419C16.7014 3.99922 16.0236 4 15.2 4V6ZM8.8 6H15.2V4H8.8V6ZM6.09202 6.21799C6.24842 6.1383 6.47262 6.07337 6.91104 6.03755C7.36113 6.00078 7.94342 6 8.8 6V4C7.97642 4 7.2986 3.99922 6.74817 4.04419C6.18608 4.09012 5.66937 4.18868 5.18404 4.43597L6.09202 6.21799ZM5.21799 7.09202C5.40973 6.71569 5.71569 6.40973 6.09202 6.21799L5.18404 4.43597C4.43139 4.81947 3.81947 5.43139 3.43597 6.18404L5.21799 7.09202ZM8.41421 18V16C7.88378 16 7.37507 16.2107 7 16.5858L8.41421 18Z" fill="currentColor"></path>
                              <path d="M8 9L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M8 13L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                          </svg>
                          <span className="font-medium text-sm">Komentoni</span>
                        </div>
                      </button>
                    )}

                    {/* Share Button */}
                    {allowSharing && (
                      <button className="flex items-center justify-between text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md p-2 w-full transition-colors duration-200">
                        <div className="flex items-center space-x-2">
                          <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve" className="w-6 h-6">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                              <g>
                                <path d="M41,15.9h7.8c0.4,0,0.7-0.5,0.4-0.9l-8.3-8.3c-0.4-0.3-0.9,0-0.9,0.4v7.8C40,15.5,40.4,15.9,41,15.9z M49,19.9H38c-1.1,0-2-0.9-2-2v-11c0-0.6-0.4-1-1-1H21.5c-0.8,0-1.5,0.7-1.5,1.5v4c0,0.4,0.2,0.8,0.4,1.1l5.6,5.6 c0.8,0.8,1.4,1.9,1.6,3.1c0.2,1.6-0.3,3.1-1.4,4.3L24.6,27c-0.5,0.5-1,0.8-1.6,1.1c0.7,0.3,1.5,0.5,2.3,0.6 c2.6,0.2,4.7,2.4,4.7,5.1V36c0,1.4-0.7,2.8-1.7,3.7c-1,1-2.5,1.4-3.9,1.3c-1.1-0.1-2.1-0.3-3.2-0.5c-0.6-0.2-1.2,0.3-1.2,1v3.1 c0,0.8,0.7,1.5,1.5,1.5h27c0.8,0,1.5-0.7,1.5-1.5V21C50,20.4,49.6,20,49,19.9z M26,35.8v-2.2c0-0.6-0.5-1-1.1-1.1 c-5.4-0.5-9.9-5.1-9.9-10.8v-1.2c0-0.6,0.8-1,1.2-0.5l4,4c0.4,0.4,1.1,0.4,1.5,0l1.5-1.5c0.4-0.4,0.4-1.1,0-1.5l-9.7-9.7 c-0.4-0.4-1.1-0.4-1.5,0l-9.7,9.7c-0.4,0.4-0.4,1.1,0,1.5l1.5,1.5c0.4,0.4,1.1,0.5,1.5,0.1l4.2-4c0.5-0.5,1.4-0.1,1.4,0.5v1.9 c0,7.2,6.3,13.8,13.9,14.4C25.5,36.9,26,36.4,26,35.8z"></path>
                              </g>
                            </g>
                          </svg>
                          <span className="font-medium text-sm">Shpërndaj</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>Edit Again</Button>
                <Button onClick={handlePublish} className="bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500/50 text-foreground font-semibold">
                  <Send className="w-4 h-4 mr-2" />
                  Publish Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Publish Button */}
          <Button onClick={handlePublish} disabled={isPublishing || !postContent.trim()} size="lg" className="w-full bg-red-500/10 hover:bg-red-500/20 border-2 border-red-500/30 hover:border-red-500/50 text-foreground font-semibold text-lg h-14 rounded-xl shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-xl">
            <Send className="w-5 h-5 mr-2" />
            {isPublishing ? 'Publishing...' : 'Publish Post'}
          </Button>
        </motion.div>
      </div>

      {/* Collapsible AI Chat Sidebar */}
      <CollapsibleAIChat onUseText={text => setPostContent(prev => prev ? prev + '\n' + text : text)} hideToggleButton={true} isExpanded={showAIChat} onToggleChange={setShowAIChat} />

      {/* Post Insights Panel - Shows when AI is closed */}
      <PostInsightsPanel isVisible={!showAIChat} />
      
      {/* Scheduling Sliding Window */}
      <SchedulingSlidingWindow
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSchedule={handleSchedule}
        icon={<Clock className="w-4 h-4" />}
      />
    </div>;
};
export default CreatePostDesktop;