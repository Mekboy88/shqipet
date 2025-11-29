
import { Photo, Friend, Post, Video, Reel, CheckIn, InterestItem } from './userData';

// Sample featured photos data - removed demo photos, use placeholders only
export const featuredPhotos: Photo[] = [
  {
    id: 1,
    url: ''
  }, 
  {
    id: 2,
    url: ''
  }, 
  {
    id: 3,
    url: ''
  }
];

// Sample photos data - removed demo photos
export const photos: Photo[] = [
  {
    id: 1,
    url: ''
  },
  {
    id: 2,
    url: ''
  },
  {
    id: 3,
    url: ''
  },
  {
    id: 4,
    url: ''
  },
  {
    id: 5,
    url: ''
  },
  {
    id: 6,
    url: ''
  },
  {
    id: 7,
    url: ''
  },
  {
    id: 8,
    url: ''
  },
  {
    id: 9,
    url: ''
  }
];

// Sample friends data with more details - removed demo photos
export const friends: Friend[] = [
  {
    id: 1,
    name: 'Trita Anabel',
    imageUrl: '',
    mutualFriends: '0',
    work: 'Works at Branch Office Manager',
    location: '',
    category: ['all', 'work']
  },
  {
    id: 2,
    name: 'Loni Mjeshtri',
    imageUrl: '',
    mutualFriends: '13',
    category: ['all']
  },
  {
    id: 3,
    name: 'Edison Demaj',
    imageUrl: '',
    mutualFriends: '13',
    category: ['all']
  },
  {
    id: 4,
    name: 'Kleo Betsokou',
    imageUrl: '',
    mutualFriends: '0',
    location: 'London, United Kingdom',
    category: ['all', 'current']
  },
  {
    id: 5,
    name: 'Wanz Purma',
    imageUrl: '',
    mutualFriends: '0',
    category: ['all']
  },
  {
    id: 6,
    name: 'Anisa Zeneli',
    imageUrl: '',
    mutualFriends: '17',
    category: ['all']
  },
  {
    id: 7,
    name: 'Benard Bega',
    imageUrl: '',
    mutualFriends: '2',
    category: ['all']
  },
  {
    id: 8,
    name: 'Maria Graceni',
    imageUrl: '',
    mutualFriends: '0',
    education: 'American University in Bulgaria - AUBG',
    category: ['all']
  }
];

// Sample posts data - removed demo photos
export const originalPosts = [
  {
    id: 1,
    author: 'Andi Lena',
    authorImage: '',
    time: '2 hours ago',
    content: 'Just had an amazing day at the beach!',
    image: '',
    likes: 120,
    comments: 45,
    shares: 12
  }, 
  {
    id: 2,
    author: 'Andi Lena',
    authorImage: '',
    time: '1 day ago',
    content: 'Exploring the city with friends.',
    image: '',
    likes: 85,
    comments: 23,
    shares: 7
  }
];

// Transform posts to match PostData interface
export const posts: Post[] = originalPosts.map(post => ({
  id: post.id.toString(),
  profilePic: post.authorImage,
  name: post.author,
  timestamp: post.time,
  content: post.content,
  images: post.image ? [post.image] : undefined,
  likeCount: post.likes.toString(),
  commentCount: post.comments.toString(),
  isPublic: true
}));

// Sample videos data - replaced with empty thumbnails
export const videos: Video[] = [
  {
    id: 1,
    thumbnail: '',
    duration: '0:07',
    title: 'Evening out with friends'
  }, 
  {
    id: 2,
    thumbnail: '',
    duration: '1:23',
    title: 'Work presentation'
  }, 
  {
    id: 3,
    thumbnail: '',
    duration: '0:45',
    title: 'Vacation memories'
  }, 
  {
    id: 4,
    thumbnail: '',
    duration: '2:15',
    title: 'Weekend trip'
  }
];

// Sample reels data - replaced with empty thumbnails
export const reels: Reel[] = [
  {
    id: 1,
    thumbnail: "",
    views: "4.8K"
  },
  {
    id: 2,
    thumbnail: "",
    views: "7.3K"
  },
  {
    id: 3,
    thumbnail: "",
    views: "2.1K"
  },
  {
    id: 4,
    thumbnail: "",
    views: "5.4K"
  }
];

// Sample check-ins data - replaced with empty image URLs
export const checkIns: CheckIn[] = [
  {
    id: 1,
    location: "Gjakova",
    area: "Kosovo",
    date: "March 26, 2022",
    imageUrl: ""
  },
  {
    id: 2,
    location: "Gjakovë-Kosovë",
    area: "Gjakova",
    date: "December 31, 2021",
    imageUrl: ""
  },
  {
    id: 3,
    location: "Tower Bridge",
    area: "London, United Kingdom",
    date: "August 29, 2021",
    imageUrl: ""
  },
  {
    id: 4,
    location: "Ipswich, Suffolk",
    area: "England",
    date: "January 16, 2019"
  },
  {
    id: 5,
    location: "Villa Aurelia",
    area: "Rome, Italy",
    date: "May 27, 2017",
    imageUrl: ""
  }
];

// Sample sports data - replaced with empty image URLs
export const sportsData: InterestItem[] = [
  {
    id: 1,
    name: "Shprenije frymëzuese",
    imageUrl: ""
  },
  {
    id: 2,
    name: "Europa Prishtinë",
    imageUrl: ""
  },
  {
    id: 3,
    name: "Juventus",
    imageUrl: ""
  },
  {
    id: 4,
    name: "Kosova",
    imageUrl: ""
  },
  {
    id: 5,
    name: "TIFOZAT SHQODRAN KUQ E BLU 4EVER",
    imageUrl: ""
  },
  {
    id: 6,
    name: "Unë Jam Interist",
    imageUrl: ""
  },
  {
    id: 7,
    name: "Stresi",
    imageUrl: ""
  }
];

// Sample music data - replaced with empty image URLs
export const musicData: InterestItem[] = [
  {
    id: 1,
    name: "Kay Music",
    imageUrl: ""
  },
  {
    id: 2,
    name: "Justin Bieber",
    imageUrl: ""
  },
  {
    id: 3,
    name: "EWEA",
    imageUrl: ""
  },
  {
    id: 4,
    name: "Angara Rings",
    imageUrl: ""
  },
  {
    id: 5,
    name: "Stela Kraja",
    imageUrl: ""
  },
  {
    id: 6,
    name: "Antre",
    imageUrl: ""
  },
  {
    id: 7,
    name: "Jozefin Marku",
    imageUrl: ""
  },
  {
    id: 8,
    name: "Diamond Girl",
    imageUrl: ""
  }
];

// Sample movies data - replaced with empty image URLs
export const moviesData: InterestItem[] = [
  {
    id: 1,
    name: "The Matrix",
    imageUrl: ""
  },
  {
    id: 2,
    name: "Inception",
    imageUrl: ""
  }
];

// Sample TV shows data - replaced with empty image URLs
export const tvShowsData: InterestItem[] = [
  {
    id: 1,
    name: "Breaking Bad",
    imageUrl: ""
  },
  {
    id: 2,
    name: "Game of Thrones",
    imageUrl: ""
  }
];

// Sample books data - replaced with empty image URLs
export const booksData: InterestItem[] = [
  {
    id: 1,
    name: "1984",
    imageUrl: ""
  },
  {
    id: 2,
    name: "To Kill a Mockingbird",
    imageUrl: ""
  }
];

// Sample apps and games data - replaced with empty image URLs
export const appsGamesData: InterestItem[] = [
  {
    id: 1,
    name: "Candy Crush",
    imageUrl: ""
  },
  {
    id: 2,
    name: "Minecraft",
    imageUrl: ""
  }
];

// Sample likes data - replaced with empty image URLs
export const likesData: InterestItem[] = [
  {
    id: 1,
    name: "Europa Prishtinë",
    imageUrl: "",
    category: "sports"
  },
  {
    id: 2,
    name: "Monopoly Travel",
    imageUrl: "",
    category: "games"
  },
  {
    id: 3,
    name: "Money Music",
    imageUrl: "",
    category: "music"
  },
  {
    id: 4,
    name: "The Albanian Times",
    imageUrl: "",
    category: "news"
  }
];

// Sample events data - replaced with empty image URLs
export const eventsData: InterestItem[] = [
  {
    id: 1,
    name: "Manchester Jobs Fair",
    location: "Old Trafford, Manchester",
    date: "Fri, Apr 8, 2022",
    imageUrl: "",
    organizer: "The Bridge"
  },
  {
    id: 2,
    name: "Momenti iconici - Iconic Turns",
    location: "Santa Maria della Pace, Roma",
    date: "Tue, Nov 14, 2017",
    imageUrl: "",
    organizer: "Davor DJalto"
  }
];

// Sample reviews data - replaced with empty image URLs
export const reviewsData: InterestItem[] = [
  {
    id: 1,
    name: "Kafe Aroma",
    review: "Nice very nice iz my Koli Me pelqen nje qoc aty por smunf tja them",
    imageUrl: "",
    isPrivate: true
  }
];

// Sample groups data - replaced with empty image URLs
export const groupsData: InterestItem[] = [
  {
    id: 1,
    name: "Italiani ad Amburgo",
    members: "25.6k members",
    imageUrl: "",
    isPublic: true
  },
  {
    id: 2,
    name: "Shqiptaret ne dusseldorf-Dortmund-Koln",
    members: "9.9k members",
    imageUrl: "",
    isPublic: true
  },
  {
    id: 3,
    name: "Young Freemasons of England",
    members: "4.9k members",
    imageUrl: "",
    isPublic: true
  }
];
