import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { deviceAuthService } from '@/services/deviceAuthService';
import { toast } from 'sonner';

interface QuickLoginProfileProps {
  onQuickLogin: () => void;
  onSwitchAccount: () => void;
}

const QuickLoginProfile: React.FC<QuickLoginProfileProps> = ({ 
  onQuickLogin, 
  onSwitchAccount 
}) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // Get profile from current auth or stored data
  const [displayProfile, setDisplayProfile] = React.useState<any>(null);

  React.useEffect(() => {
    if (userProfile) {
      setDisplayProfile(userProfile);
    } else {
      // Try to get stored profile for quick login display
      const storedProfile = localStorage.getItem('shqipet_last_profile');
      if (storedProfile) {
        try {
          const profileData = JSON.parse(storedProfile);
          setDisplayProfile(profileData);
        } catch (error) {
          console.error('Error parsing stored profile:', error);
        }
      }
    }
  }, [userProfile]);

  const handleQuickLogin = async () => {
    try {
      const result = await deviceAuthService.attemptAutoLogin();
      if (result.success) {
        toast.success("Hyrja e shpejtë u krye me sukses!");
        navigate('/profile');
        onQuickLogin();
      } else {
        toast.error("Hyrja e shpejtë dështoi. Ju lutemi identifikohuni përsëri.");
        onSwitchAccount();
      }
    } catch (error) {
      console.error('Quick login error:', error);
      toast.error("Gabim në hyrjen e shpejtë");
      onSwitchAccount();
    }
  };

  if (!displayProfile) return null;

  const displayName = displayProfile.first_name && displayProfile.last_name 
    ? `${displayProfile.first_name} ${displayProfile.last_name}`
    : displayProfile.first_name || displayProfile.email || 'Përdorues';

  const initials = displayProfile.first_name && displayProfile.last_name
    ? `${displayProfile.first_name[0]}${displayProfile.last_name[0]}`.toUpperCase()
    : displayProfile.first_name 
      ? displayProfile.first_name[0].toUpperCase()
      : displayProfile.email 
        ? displayProfile.email[0].toUpperCase()
        : 'P';

  return (
    <div className="text-center space-y-4 mb-6">
      <div className="flex flex-col items-center space-y-3">
        <Avatar className="w-20 h-20 border-4 border-red-200 cursor-pointer hover:border-red-300 transition-colors">
          <AvatarImage src={displayProfile.profile_image_url || undefined} />
          <AvatarFallback className="text-xl font-bold bg-red-50 text-red-600">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">{displayName}</h3>
          <p className="text-sm text-gray-600">{displayProfile.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          onClick={handleQuickLogin}
          className="w-full bg-red-400 hover:bg-red-500 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Vazhdo si {displayProfile.first_name || 'Përdorues'}
        </Button>
        
        <Button 
          onClick={onSwitchAccount}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Ndërro llogari
        </Button>
      </div>
    </div>
  );
};

export default QuickLoginProfile;