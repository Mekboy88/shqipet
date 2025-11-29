
import React from 'react';
import TabContent from '@/components/profile/TabContent';
import PostsTab from './tabs/PostsTab';
import AboutTab from './tabs/AboutTab';
import FriendsTab from './tabs/FriendsTab';
import PhotosTab from './tabs/PhotosTab';
import VideosTab from './tabs/VideosTab';
import ReelsTab from './tabs/ReelsTab';
import MoreTab from './tabs/MoreTab';
import CheckInsTab from './tabs/CheckInsTab';

interface ProfileTabContentProps {
  activeTab: string;
  userProfile: any;
  profilePosts: any[];
  friendSuggestions: any[];
  photoItems: any[];
}

const ProfileTabContent: React.FC<ProfileTabContentProps> = ({
  activeTab,
  userProfile,
  profilePosts,
  friendSuggestions,
  photoItems
}) => {
  console.log('ProfileTabContent rendered with activeTab:', activeTab);
  
  return (
    <>
      <TabContent contentId="posts" active={activeTab}>
        <PostsTab userProfile={userProfile} profilePosts={profilePosts} />
      </TabContent>
      
      <TabContent contentId="about" active={activeTab}>
        <AboutTab userProfile={userProfile} />
      </TabContent>
      
      <TabContent contentId="friends" active={activeTab}>
        <FriendsTab friendSuggestions={friendSuggestions} totalCount={userProfile.stats?.friends || 0} />
      </TabContent>
      
      <TabContent contentId="photos" active={activeTab}>
        <PhotosTab photoItems={photoItems} />
      </TabContent>
      
      <TabContent contentId="videos" active={activeTab}>
        <VideosTab />
      </TabContent>
      
      <TabContent contentId="check-ins" active={activeTab}>
        <CheckInsTab />
      </TabContent>
      
      <TabContent contentId="more" active={activeTab}>
        <MoreTab />
      </TabContent>
    </>
  );
};

export default ProfileTabContent;
