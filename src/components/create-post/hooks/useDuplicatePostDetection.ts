import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface DuplicatePost {
  id: string;
  content: string;
  similarity: number;
  createdAt: string;
}

interface DuplicatePostDetectionResult {
  isDuplicate: boolean;
  duplicates: DuplicatePost[];
  similarityScore: number;
}

export const useDuplicatePostDetection = (content: string) => {
  const [result, setResult] = useState<DuplicatePostDetectionResult>({
    isDuplicate: false,
    duplicates: [],
    similarityScore: 0
  });
  const [isChecking, setIsChecking] = useState(false);
  const { user } = useAuth();

  // Simple similarity calculation (Jaccard similarity for demonstration)
  const calculateSimilarity = (text1: string, text2: string): number => {
    if (!text1 || !text2) return 0;
    
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  };

  // Mock function to get recent posts (in real app, would query database)
  const getRecentUserPosts = async (): Promise<Array<{id: string, content: string, createdAt: string}>> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock recent posts for demonstration
    return [
      {
        id: '1',
        content: 'Just had an amazing day at the beach! The weather was perfect and the sunset was incredible.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        id: '2', 
        content: 'Working on some exciting new projects today. Can\'t wait to share more details soon!',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: '3',
        content: 'Coffee and coding session this morning. Productivity levels are through the roof!',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      }
    ];
  };

  useEffect(() => {
    const checkForDuplicates = async () => {
      if (!content.trim() || content.length < 20 || !user) {
        setResult({ isDuplicate: false, duplicates: [], similarityScore: 0 });
        return;
      }

      setIsChecking(true);

      try {
        const recentPosts = await getRecentUserPosts();
        const duplicates: DuplicatePost[] = [];
        let maxSimilarity = 0;

        for (const post of recentPosts) {
          const similarity = calculateSimilarity(content, post.content);
          
          if (similarity > 0.7) { // 70% similarity threshold
            duplicates.push({
              id: post.id,
              content: post.content,
              similarity,
              createdAt: post.createdAt
            });
          }
          
          maxSimilarity = Math.max(maxSimilarity, similarity);
        }

        setResult({
          isDuplicate: duplicates.length > 0,
          duplicates: duplicates.sort((a, b) => b.similarity - a.similarity),
          similarityScore: maxSimilarity
        });
      } catch (error) {
        console.error('Error checking for duplicates:', error);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkForDuplicates, 1000);
    return () => clearTimeout(timeoutId);
  }, [content, user]);

  return {
    ...result,
    isChecking
  };
};