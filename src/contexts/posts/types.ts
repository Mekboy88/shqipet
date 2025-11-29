
export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters?: string[]; // user IDs who voted for this option
}

export interface PollData {
  question: string;
  options: PollOption[];
  duration: number; // in hours
  allowMultiple: boolean;
  showResults: 'after_vote' | 'after_end' | 'always';
  createdAt: string;
  endDate: string;
  totalVotes: number;
  hasVoted?: boolean;
  userVotes?: string[]; // option IDs the current user voted for
}

export interface LocationData {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  placeType: string;
}

export interface Post {
  id: string;
  user_id: string;
  user: {
    name: string;
    image: string;
    verified?: boolean;
  };
  time: string;
  visibility?: string;
  isSponsored?: boolean;
  postType?: string; // Add postType to distinguish between regular, reel, video_post, and poll
  content: {
    text?: string;
    image?: string;
    images?: string[];
    poll?: PollData;
    location?: LocationData;
  };
  reactions: {
    count: number;
    types: string[];
  };
  comments: number;
  shares: number;
}

export interface PostsContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  addPost: (post: Omit<Post, 'id' | 'user_id' | 'reactions' | 'comments' | 'shares'>) => Promise<void>;
  isLoading: boolean;
}
