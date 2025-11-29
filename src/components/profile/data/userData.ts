
export interface UserData {
  name: string;
  profilePhotoUrl: string;
  coverPhotoUrl: string;
  stats: {
    friends: number;
    followers: number;
    following: number;
  };
  details: {
    workplace: string;
    education: string;
    location: string;
    hometown: string;
    relationship: string;
    phone: string;
    email: string;
    website: string;
  };
}

export interface Photo {
  id: number;
  url: string;
}

export interface Friend {
  id: number;
  name: string;
  imageUrl: string;
  mutualFriends?: string;
  work?: string;
  location?: string;
  education?: string;
  category: string[];
}

export interface Post {
  id: string;
  profilePic: string;
  name: string;
  timestamp: string;
  content: string;
  images?: string[];
  likeCount: string;
  commentCount: string;
  isPublic: boolean;
}

export interface Video {
  id: number;
  thumbnail: string;
  duration: string;
  title: string;
}

export interface Reel {
  id: number;
  thumbnail: string;
  views: string;
}

export interface CheckIn {
  id: number;
  location: string;
  area: string;
  date: string;
  imageUrl?: string;
}

export interface InterestItem {
  id: number;
  name: string;
  imageUrl: string;
  category?: string;
  members?: string;
  isPublic?: boolean;
  isPrivate?: boolean;
  review?: string;
  location?: string;
  date?: string;
  organizer?: string;
}

// Initialize default user data
export const defaultUserData: UserData = {
  name: 'Andi Lena',
  profilePhotoUrl: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200',
  coverPhotoUrl: '',
  stats: {
    friends: 1300,
    followers: 450,
    following: 280
  },
  details: {
    workplace: 'Facebook',
    education: 'Shkolla "Gjergj Fishta" Lezhe',
    location: 'London, United Kingdom',
    hometown: 'Lezhe',
    relationship: 'Married to Trita Anabel',
    phone: '+1 555-123-4567',
    email: 'andi.lena@example.com',
    website: 'andilena.com'
  }
};
