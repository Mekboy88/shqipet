import React from 'react';
import ProfileSummaryCard from './ProfileSummaryCard';
import TrendingCard from './TrendingCard';
import ProMembersCard from './ProMembersCard';
import PeopleYouMayKnowCard from './PeopleYouMayKnowCard';
import PagesYouMayLikeCard from './PagesYouMayLikeCard';
import SuggestedGroupsCard from './SuggestedGroupsCard';
import OnlineUsersCard from './OnlineUsersCard';
import InviteFriendsCard from './InviteFriendsCard';
import LatestProductsCard from './LatestProductsCard';
import LatestActivitiesCard from './LatestActivitiesCard';
import SponsoredCard from './SponsoredCard';
import RightSidebarFooter from './RightSidebarFooter';
const RightSidebar = () => {
  return <aside className="w-full">
      <div className="flex flex-col gap-3 py-0 px-0 mx-px my-0">
        <ProfileSummaryCard />
        <TrendingCard />
        <ProMembersCard />
        <PeopleYouMayKnowCard />
        <PagesYouMayLikeCard />
        <SuggestedGroupsCard />
        <OnlineUsersCard />
        <InviteFriendsCard />
        <LatestProductsCard />
        <LatestActivitiesCard />
        {/* SponsoredCard components will be dynamically loaded from database when ads/sponsors are available */}
        <RightSidebarFooter />
      </div>
    </aside>;
};
export default RightSidebar;