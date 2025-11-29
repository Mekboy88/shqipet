
import { Post } from '@/contexts/posts/types';

export type PostData = Post;

export interface MonthGroup {
  month: string;
  year: string;
  posts: PostData[];
}
