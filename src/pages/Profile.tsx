
import React from 'react';
import ProfilePage from '@/components/profile/ProfilePage';
import ProfileScrollContainer from '@/components/profile/layout/ProfileScrollContainer';

const Profile = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full max-w-none mx-auto">
        <ProfileScrollContainer>
          <ProfilePage />
        </ProfileScrollContainer>
      </div>
    </div>
  );
};

export default Profile;
