
import React from 'react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { Pencil, UserPlus, ChevronDown } from 'lucide-react';
import { useUniversalUser } from '@/hooks/useUniversalUser';

// Camera Icon from uploaded image
const Camera = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
};

interface ProfileInfoProps {
  userProfile: {
    name: string;
    profileImage: string;
    stats: {
      friends: number;
    };
  };
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ userProfile }) => {
  // Use the global avatar system for 100% synchronization - no loading
  const { avatarUrl, initials, displayName, firstName, lastName } = useUniversalUser();


  console.log('🔍 ProfileInfo Avatar Debug:', {
    firstName,
    lastName,
    displayName,
    initials,
    avatarUrl
  });

  return (
    <div className="relative px-8 pb-4 mt-[-80px]">
      {/* Profile Picture */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end mb-4">
        <Avatar
          className="w-[168px] h-[168px] border-4"
          size="xl"
        />

        {/* Avatar Edit Button - Middle of Avatar Circle */}
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute left-[130px] top-[100px] sm:left-[130px] sm:top-[110px] bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8"
        >
          <Camera className="h-4 w-4 text-black" />
        </Button>
        
        <div className="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{displayName || userProfile.name}</h1>
          <Button 
            variant="outline" 
            className="mt-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm"
          >
            Professional presentation
          </Button>
          <p className="text-sm text-gray-500 mt-2">{userProfile.stats.friends} friends</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add to story
        </Button>
        
        <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200">
          <Pencil className="w-4 h-4 mr-2" />
          Edit profile
        </Button>
        
        <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200 px-2">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileInfo;
