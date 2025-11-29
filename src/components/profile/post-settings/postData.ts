
import { MonthSection } from './types';

// Sample data matching the screenshot layout exactly
export const postsByMonth: MonthSection[] = [{
  month: 'November',
  year: '2021',  // Changed from number to string
  posts: [{
    id: 1,
    user: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
    },
    date: 'November 28, 2021',
    content: '+33 več kot običajno',
    photos: [{
      id: 1,
      url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
    }, {
      id: 2,
      url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
    }],
    privacy: 'public'
  }, {
    id: 2,
    user: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    },
    date: 'November 23, 2021',
    content: '❤️❤️ Me presrečan time Me Emperin tim',
    photos: [{
      id: 1,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    }, {
      id: 2,
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    }, {
      id: 3,
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    }, {
      id: 4,
      url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
    }, {
      id: 5,
      url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952'
    }, {
      id: 6,
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    }, {
      id: 7,
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    }],
    privacy: 'public'
  }, {
    id: 3,
    user: {
      name: 'Andi Lena',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    },
    date: 'November 6, 2021',
    content: 'Andi Lena updated his Cover photo',
    photos: [{
      id: 1,
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    }],
    privacy: 'public'
  }]
}, {
  month: 'August',
  year: '2021',  // Changed from number to string
  posts: [{
    id: 4,
    user: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
    },
    date: 'August 30, 2021',
    content: '❤️🧡💛💚💙💜🤍🤎🖤',
    photos: [{
      id: 1,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    }, {
      id: 2,
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
    }, {
      id: 3,
      url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7'
    }],
    privacy: 'public'
  }, {
    id: 5,
    user: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1527576539890-dfa815648363'
    },
    date: 'August 29, 2021',
    content: 'Never stop 🙂',
    photos: [{
      id: 1,
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
    }],
    privacy: 'public'
  }]
}];
