
import React from 'react';
import { Button } from '@/components/ui/button';
import FriendsList from '../friends/FriendsList';
import PhotosTab from '../photos/PhotosTab';
import VideosTab from '../videos/VideosTab';
import ReelsTab from '../reels/ReelsTab';
import CheckInsTab from '../checkins/CheckInsTab';
import SportsTab from '../interests/SportsTab';
import MusicTab from '../interests/MusicTab';
import MoviesTab from '../interests/MoviesTab';
import TVShowsTab from '../interests/TVShowsTab';
import BooksTab from '../interests/BooksTab';
import AppsGamesTab from '../interests/AppsGamesTab';
import LikesTab from '../interests/LikesTab';
import EventsTab from '../interests/EventsTab';
import ReviewsTab from '../interests/ReviewsTab';
import GroupsTab from '../interests/GroupsTab';

import { 
  friends, 
  photos, 
  videos, 
  checkIns,
  reels,
  sportsData,
  musicData,
  moviesData,
  tvShowsData,
  booksData,
  appsGamesData,
  likesData,
  eventsData,
  reviewsData,
  groupsData
} from '../data/sampleData';

interface AboutTabSectionsProps {
  sectionsMaxWidth: string;
  activeFriendCategory: string;
  setActiveFriendCategory: (category: string) => void;
  activePhotoTab: string;
  setActivePhotoTab: (tab: string) => void;
  activeVideoTab: string;
  setActiveVideoTab: (tab: string) => void;
  activeReelsTab: string;
  setActiveReelsTab: (tab: string) => void;
  activeCheckInsTab: string;
  setActiveCheckInsTab: (tab: string) => void;
  activeSportsTab: string;
  setActiveSportsTab: (tab: string) => void;
  activeMusicTab: string;
  setActiveMusicTab: (tab: string) => void;
  activeMovieTab: string;
  setActiveMovieTab: (tab: string) => void;
  activeShowTab: string;
  setActiveShowTab: (tab: string) => void;
  activeBookTab: string;
  setActiveBookTab: (tab: string) => void;
  activeAppTab: string;
  setActiveAppTab: (tab: string) => void;
  activeLikeTab: string;
  setActiveLikeTab: (tab: string) => void;
  activeEventTab: string;
  setActiveEventTab: (tab: string) => void;
  activeReviewTab: string;
  setActiveReviewTab: (tab: string) => void;
  activeGroupTab: string;
  setActiveGroupTab: (tab: string) => void;
}

const AboutTabSections: React.FC<AboutTabSectionsProps> = (props) => {
  // Destructure props
  const {
    sectionsMaxWidth,
    activeFriendCategory, setActiveFriendCategory,
    activePhotoTab, setActivePhotoTab,
    activeVideoTab, setActiveVideoTab,
    activeReelsTab, setActiveReelsTab,
    activeCheckInsTab, setActiveCheckInsTab,
    activeSportsTab, setActiveSportsTab,
    activeMusicTab, setActiveMusicTab,
    activeMovieTab, setActiveMovieTab,
    activeShowTab, setActiveShowTab,
    activeBookTab, setActiveBookTab,
    activeAppTab, setActiveAppTab,
    activeLikeTab, setActiveLikeTab,
    activeEventTab, setActiveEventTab,
    activeReviewTab, setActiveReviewTab,
    activeGroupTab, setActiveGroupTab
  } = props;

  const sectionStyle = {
    maxWidth: sectionsMaxWidth
  };

  // Define type-safe events data by filtering out items that don't have required properties
  const typeCheckedEvents = eventsData.filter(
    (item): item is typeof item & { location: string; date: string } => 
    !!item.location && !!item.date
  );

  // Define type-safe reviews data by filtering out items that don't have required properties
  const typeCheckedReviews = reviewsData.filter(
    (item): item is typeof item & { review: string } => 
    !!item.review
  );

  // Define type-safe groups data by filtering out items that don't have required properties
  const typeCheckedGroups = groupsData.filter(
    (item): item is typeof item & { members: string } => 
    !!item.members
  );

  return (
    <div className="w-full">
      <div className="w-full pl-[120px] pr-[20px]">
        {/* Overview/Intro Section with proper spacing */}
        <div className="w-full mb-6 mt-8">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Overview</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Edit details</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-gray-700">Lives in London, United Kingdom</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-gray-700">From Lezhë</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
                </svg>
                <span className="text-gray-700">Married to Trita Anabel</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <span className="text-gray-700">Joined June 2021</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Friends Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Friends</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Friend requests</Button>
                <Button variant="outline" size="sm" className="text-blue-600">Find Friends</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <FriendsList 
              friends={friends} 
              activeFriendCategory={activeFriendCategory} 
              setActiveFriendCategory={setActiveFriendCategory} 
            />
          </div>
        </div>
        
        {/* Photos Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Photos</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add photos/video</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <PhotosTab 
              photos={photos} 
              activeTab={activePhotoTab} 
              setActiveTab={setActivePhotoTab} 
            />
          </div>
        </div>
        
        {/* Videos Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Videos</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add video</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <VideosTab 
              videos={videos} 
              activeTab={activeVideoTab} 
              setActiveTab={setActiveVideoTab} 
            />
          </div>
        </div>
      
        {/* Reels Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reels</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Create reel</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <ReelsTab 
              reels={reels} 
              activeTab={activeReelsTab} 
              setActiveTab={setActiveReelsTab} 
            />
          </div>
        </div>
      
        {/* Check-ins Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Check-ins</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add check-in</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <CheckInsTab 
              checkIns={checkIns} 
              activeTab={activeCheckInsTab} 
              setActiveTab={setActiveCheckInsTab} 
            />
          </div>
        </div>

        {/* Sports Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Sports</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add sports</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <SportsTab 
              sports={sportsData} 
              activeTab={activeSportsTab} 
              setActiveTab={setActiveSportsTab} 
            />
          </div>
        </div>

        {/* Music Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Music</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add music</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <MusicTab 
              music={musicData} 
              activeTab={activeMusicTab} 
              setActiveTab={setActiveMusicTab} 
            />
          </div>
        </div>
      
        {/* Movies Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Movies</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add movies</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <MoviesTab 
              movies={moviesData} 
              activeTab={activeMovieTab} 
              setActiveTab={setActiveMovieTab} 
            />
          </div>
        </div>
      
        {/* TV Shows Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">TV Shows</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add TV shows</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <TVShowsTab 
              shows={tvShowsData} 
              activeTab={activeShowTab} 
              setActiveTab={setActiveShowTab} 
            />
          </div>
        </div>
      
        {/* Books Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Books</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add books</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <BooksTab 
              books={booksData} 
              activeTab={activeBookTab} 
              setActiveTab={setActiveBookTab} 
            />
          </div>
        </div>
      
        {/* Apps and Games Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Apps and Games</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Add apps/games</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <AppsGamesTab 
              apps={appsGamesData} 
              activeTab={activeAppTab} 
              setActiveTab={setActiveAppTab} 
            />
          </div>
        </div>
      
        {/* Likes Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Likes</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Manage likes</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <LikesTab 
              likes={likesData} 
              activeTab={activeLikeTab} 
              setActiveTab={setActiveLikeTab} 
            />
          </div>
        </div>
      
        {/* Events Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Events</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Create event</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <EventsTab 
              events={typeCheckedEvents} 
              activeTab={activeEventTab} 
              setActiveTab={setActiveEventTab} 
            />
          </div>
        </div>
      
        {/* Reviews Section */}
        <div className="w-full mb-4">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reviews Given</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-blue-600">Write review</Button>
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <ReviewsTab 
              reviews={typeCheckedReviews} 
              activeTab={activeReviewTab} 
              setActiveTab={setActiveReviewTab} 
            />
          </div>
        </div>
      
        {/* Groups Section */}
        <div className="w-full mb-20">
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Groups</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <GroupsTab 
              groups={typeCheckedGroups} 
              activeTab={activeGroupTab} 
              setActiveTab={setActiveGroupTab} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTabSections;
