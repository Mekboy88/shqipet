
import React from 'react';
import { Card } from '@/components/ui/card';
import Avatar from '@/components/Avatar';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useGlobalAvatar } from '@/hooks/useGlobalAvatar';
import { processWasabiUrl } from '@/services/media/LegacyMediaService';

interface StoryProps {
  id: number;
  user: {
    name: string;
    image: string;
  };
  image: string;
  viewed: boolean;
}

const stories: StoryProps[] = [
  {
    id: 1,
    user: {
      name: 'Create Story',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    },
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    viewed: false,
  },
  {
    id: 2,
    user: {
      name: 'Emily Wilson',
      image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    },
    image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04',
    viewed: false,
  },
  {
    id: 3,
    user: {
      name: 'David Miller',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    },
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    viewed: true,
  },
  {
    id: 4,
    user: {
      name: 'Jessica Brown',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    viewed: false,
  },
  {
    id: 5,
    user: {
      name: 'Robert Garcia',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    },
    image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    viewed: false,
  },
];

const StoryCard: React.FC<{ story: StoryProps; isCreate?: boolean }> = ({ story, isCreate }) => {
  // Use global avatar hook for the current user's "Create Story" card
  const { avatarUrl } = useGlobalAvatar();

  // Resolve Wasabi keys for the Create Story background (prevents corrupt image)
  const [createBgUrl, setCreateBgUrl] = React.useState<string>(story.image);
  React.useEffect(() => {
    let canceled = false;
    const resolve = async () => {
      try {
        const candidate = avatarUrl;
        let url = story.image;
        if (candidate) {
          if (candidate.startsWith('http') || candidate.startsWith('blob:') || candidate.startsWith('data:')) {
            url = candidate;
          } else {
            url = await processWasabiUrl(candidate);
          }
        }
        if (!canceled) setCreateBgUrl(url);
      } catch (e) {
        console.warn('Story create background resolve failed:', e);
        if (!canceled) setCreateBgUrl(story.image);
      }
    };
    resolve();
    return () => { canceled = true; };
  }, [avatarUrl, story.image]);

  return (
    <div className="relative min-w-[112px] h-[200px] rounded-lg overflow-hidden shadow-sm group cursor-pointer">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${isCreate ? createBgUrl : story.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
      </div>
      
      {isCreate ? (
        <>
          {/* Show the same circular profile avatar as the profile header */}
          <div 
            className="absolute top-3 left-3 h-10 w-10 rounded-full border-4 border-facebook-primary relative"
          >
            <Avatar size="sm" className="h-full w-full" />
            {/* Small plus badge */}
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-facebook-primary text-white flex items-center justify-center text-xs font-bold border-2 border-white">+</div>
          </div>
          <div className="absolute bottom-0 w-full p-3">
            <p className="text-white text-sm font-medium">Create Story</p>
          </div>
        </>
      ) : (
        <>
          <div 
            className={`absolute top-3 left-3 h-10 w-10 rounded-full border-4 ${
              story.viewed ? 'border-gray-400' : 'border-facebook-primary'
            }`}
          >
            <Avatar
              className="h-full w-full"
            />
          </div>
          
          <div className="absolute bottom-0 w-full p-3">
            <p className="text-white text-sm font-medium">{story.user.name}</p>
          </div>
        </>
      )}
    </div>
  );
};

const StoryCards: React.FC = () => {
  const { scrollProps } = useHorizontalScroll({ 
    scrollMultiplier: 1, 
    preventVerticalScroll: true 
  });

  return (
    <Card className="p-4 mb-4 shadow-sm bg-card">
      <div 
        data-horizontal-scroll="true" 
        className="overflow-x-auto pb-4 -mx-1 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
          overscrollBehaviorY: 'none'
        }}
        {...scrollProps}
      >
        <div className="flex space-x-2">
          <StoryCard story={stories[0]} isCreate />
          {stories.slice(1).map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StoryCards;
