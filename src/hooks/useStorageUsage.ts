import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface StorageUsage {
  totalStorage: string;
  images: string;
  videos: string;
  documents: string;
  audio: string;
}

export const useStorageUsage = () => {
  const [usage, setUsage] = useState<StorageUsage>({
    totalStorage: '0 B',
    images: '0 B',
    videos: '0 B',
    documents: '0 B',
    audio: '0 B'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
    return `${value} ${sizes[i]}`;
  };

  const fetchStorageUsage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get storage usage from Supabase Storage
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw bucketsError;
      }

      let totalSize = 0;
      let imageSize = 0;
      let videoSize = 0;
      let documentSize = 0;
      let audioSize = 0;

      // Calculate storage usage for each bucket
      for (const bucket of buckets) {
        try {
          const { data: files, error: filesError } = await supabase.storage
            .from(bucket.id)
            .list('', { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });
          
          if (filesError) {
            console.warn(`Error fetching files from bucket ${bucket.id}:`, filesError);
            continue;
          }

          if (files) {
            for (const file of files) {
              const size = file.metadata?.size || 0;
              totalSize += size;

              // Categorize by file type
              const fileName = file.name.toLowerCase();
              if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/)) {
                imageSize += size;
              } else if (fileName.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/)) {
                videoSize += size;
              } else if (fileName.match(/\.(mp3|wav|ogg|flac|aac|m4a)$/)) {
                audioSize += size;
              } else if (fileName.match(/\.(pdf|doc|docx|txt|xls|xlsx|ppt|pptx)$/)) {
                documentSize += size;
              }
            }
          }
        } catch (bucketError) {
          console.warn(`Error processing bucket ${bucket.id}:`, bucketError);
        }
      }

      setUsage({
        totalStorage: formatBytes(totalSize),
        images: formatBytes(imageSize),
        videos: formatBytes(videoSize),
        documents: formatBytes(documentSize),
        audio: formatBytes(audioSize)
      });
    } catch (err) {
      console.error('Error fetching storage usage:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch storage usage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStorageUsage();
    
    // Set up real-time subscription for storage changes
    const storageChannel = supabase
      .channel('storage-usage-monitor')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'storage',
          table: 'objects'
        },
        (payload) => {
          console.log('🔄 Real-time storage update:', payload);
          fetchStorageUsage();
        }
      )
      .subscribe();

    // Also refresh every 5 minutes as backup for storage API changes
    const interval = setInterval(fetchStorageUsage, 300000);
    
    return () => {
      supabase.removeChannel(storageChannel);
      clearInterval(interval);
    };
  }, []);

  return {
    usage,
    loading,
    error,
    refetch: fetchStorageUsage
  };
};