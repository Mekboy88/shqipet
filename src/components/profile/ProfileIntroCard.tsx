
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { School, Briefcase, Home, Heart, Calendar, MapPin } from 'lucide-react';
import { useProfileSettings } from '@/hooks/useProfileSettings';

interface ProfileIntroCardProps {
  // No longer need userDetails prop - we'll get data from useProfileSettings
}

const ProfileIntroCard: React.FC<ProfileIntroCardProps> = () => {
  const { userInfo } = useProfileSettings();
  
  // Build display data from profile settings
  const displayData = {
    bio: userInfo.bio || '',
    school: userInfo.school || '',
    company: userInfo.company || '',
    profession: userInfo.profession || '',
    location: userInfo.location || '',
    city_location: userInfo.city_location || '',
    relationship_status: userInfo.relationship_status || '',
    website: userInfo.website || ''
  };

  // Show joined date (can be enhanced later)
  const joinedDate = 'January 2024';
  return (
    <Card className="p-4 shadow-sm mb-4 bg-white border border-gray-200">
      <h2 className="text-xl font-semibold mb-3">Intro</h2>
      
      <div className="space-y-4">
        {/* Add bio button as shown in the screenshot */}
        <Button variant="outline" className="w-full bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800 py-2 h-auto font-medium">
          Add bio
        </Button>
        
        <div className="space-y-3 text-sm">
          {/* Bio/About */}
          {displayData.bio && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm leading-relaxed">{displayData.bio}</p>
            </div>
          )}

          {/* Education */}
          {displayData.school && (
            <div className="flex items-start space-x-3">
              <School className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>Studies at <b>{displayData.school}</b></span>
            </div>
          )}
          
          {/* Work */}
          {(displayData.profession || displayData.company) && (
            <div className="flex items-start space-x-3">
              <Briefcase className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>
                {displayData.profession && displayData.company 
                  ? `${displayData.profession} at `
                  : displayData.profession 
                    ? `Works as `
                    : `Works at `
                }
                <b>{displayData.company || displayData.profession}</b>
              </span>
            </div>
          )}
          
          {/* Location */}
          {displayData.location && (
            <div className="flex items-start space-x-3">
              <Home className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>Lives in <b>{displayData.location}</b></span>
            </div>
          )}
          
          {/* Home town */}
          {displayData.city_location && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span>From <b>{displayData.city_location}</b></span>
            </div>
          )}
          
          {/* Relationship */}
          {displayData.relationship_status && (
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <span><b>{displayData.relationship_status}</b></span>
            </div>
          )}

          {/* Website */}
          {displayData.website && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <a href={displayData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                <b>{displayData.website}</b>
              </a>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
            <span>Joined <b>{joinedDate}</b></span>
          </div>
        </div>
        
        <Button variant="outline" className="w-full bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800 py-2 h-auto font-medium">
          Edit details
        </Button>
      </div>
    </Card>
  );
};

export default ProfileIntroCard;
