
export interface PostPhoto {
  id: number;
  url: string;
}

export interface Post {
  id: number | string;
  content: string;
  date: string;
  photos: PostPhoto[];
  user: {
    name: string;
    image: string;
  };
  privacy?: string; // Adding the privacy field
}

export interface MonthSection {
  month: string;
  year: string;
  posts: Post[];
}

export interface Photo {
  id: number;
  url: string;
}
