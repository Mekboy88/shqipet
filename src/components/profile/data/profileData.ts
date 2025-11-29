
// Sample data for user profile with demo details
export const userProfile = {
  id: 1,
  name: 'Sarah Johnson',
  profileImage: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
  coverImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
  bio: 'Digital Artist | Travel Enthusiast | Coffee Lover',
  details: {
    location: 'San Francisco, California',
    workplace: 'Creative Studio',
    education: 'Art Institute of California',
    relationship: 'Married to David Parker',
    joined: 'March 2018',
    hometown: 'Portland, Oregon'
  },
  stats: {
    friends: 1335,
    followers: 486,
    following: 217
  }
};

// Sample posts for the profile
export const profilePosts = [{
  id: 1,
  user: {
    name: userProfile.name,
    image: userProfile.profileImage
  },
  content: 'Just finished a new digital art piece! So excited to share it with everyone. What do you think?',
  timestamp: '2 days ago',
  likes: 47,
  comments: [{
    id: 101,
    user: {
      name: 'Emily Wilson',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    },
    content: 'This is absolutely stunning! Love the colors you used!',
    timestamp: '2 days ago',
    likes: 5
  }]
}, {
  id: 2,
  user: {
    name: userProfile.name,
    image: userProfile.profileImage
  },
  content: 'Beautiful evening with friends at the local art gallery opening.',
  image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  timestamp: '1 week ago',
  likes: 83,
  comments: [{
    id: 201,
    user: {
      name: 'David Parker',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    },
    content: 'Had an amazing time! Let\'s go again next month!',
    timestamp: '1 week ago',
    likes: 6
  }, {
    id: 202,
    user: {
      name: 'Jessica Brown',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    },
    content: 'The exhibition was incredible. Thanks for inviting us!',
    timestamp: '6 days ago',
    likes: 4
  }]
}];

// Friend suggestions - demo names
export const friendSuggestions = [{
  id: 1,
  name: 'Emma Wilson',
  image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  mutualFriends: 15
}, {
  id: 2,
  name: 'Thomas Garcia',
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  mutualFriends: 8
}, {
  id: 3,
  name: 'Alex Chen',
  image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  mutualFriends: 12
}, {
  id: 4,
  name: 'Maria Lopez',
  image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
  mutualFriends: 6
}, {
  id: 5,
  name: 'James Martin',
  image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
  mutualFriends: 9
}, {
  id: 6,
  name: 'Sophia Lee',
  image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
  mutualFriends: 11
}];

// Photo grid items with demo photos
export const photoItems = [{
  id: 1,
  image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
}, {
  id: 2,
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
}, {
  id: 3,
  image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
}, {
  id: 4,
  image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
}, {
  id: 5,
  image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
}, {
  id: 6,
  image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
}, {
  id: 7,
  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
}, {
  id: 8,
  image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
}, {
  id: 9,
  image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
}];
