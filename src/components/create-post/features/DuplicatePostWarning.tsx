import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDuplicatePostDetection } from '../hooks/useDuplicatePostDetection';

interface DuplicatePostWarningProps {
  content: string;
}

const DuplicatePostWarning: React.FC<DuplicatePostWarningProps> = ({ content }) => {
  const { isDuplicate, duplicates, similarityScore, isChecking } = useDuplicatePostDetection(content);

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-3 h-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
        <span>Checking for similar posts...</span>
      </div>
    );
  }

  if (!isDuplicate || duplicates.length === 0) return null;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  return (
    <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <span className="text-sm font-medium text-yellow-800">
          Similar post detected ({Math.round(similarityScore * 100)}% match)
        </span>
      </div>
      
      <div className="space-y-2">
        {duplicates.slice(0, 2).map((duplicate) => (
          <div key={duplicate.id} className="bg-white rounded p-2 text-sm">
            <p className="text-gray-700 line-clamp-2 mb-1">
              "{duplicate.content}"
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Posted {formatTimeAgo(duplicate.createdAt)}</span>
              <span>• {Math.round(duplicate.similarity * 100)}% similar</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Edit Post
        </Button>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Post Anyway
        </Button>
      </div>
    </div>
  );
};

export default DuplicatePostWarning;