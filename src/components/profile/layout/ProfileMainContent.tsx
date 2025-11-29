
import React from 'react';
import PostsSection from '../content/PostsSection';

interface ProfileMainContentProps {
  posts: any[];
  profilePic: string;
}

const ProfileMainContent: React.FC<ProfileMainContentProps> = ({
  posts,
  profilePic
}) => {
  return (
    <div className="flex-1 min-w-0">
      <div className="h-screen overflow-y-auto">
        <PostsSection />
      </div>
    </div>
  );
};

export default ProfileMainContent;
