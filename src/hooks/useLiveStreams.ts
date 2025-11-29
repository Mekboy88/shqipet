import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveVideo } from '@/components/live/types';

export const useLiveStreams = () => {
  const [liveStreams, setLiveStreams] = useState<LiveVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveStreams = async () => {
    try {
      // Fetch profiles with their personal introductions and photos
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          display_name,
          avatar_url,
          personal_introduction (
            cover_photo_url
          )
        `)
        .limit(16);

      if (error) throw error;

      // Transform profiles into LiveVideo format
      const streams: LiveVideo[] = (profiles || []).map((profile, index) => ({
        id: profile.user_id,
        title: `Live Stream ${index + 1}`,
        host: `@${profile.display_name || 'User'}`,
        thumbnail: profile.personal_introduction?.[0]?.cover_photo_url || profile.avatar_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        views: Math.floor(Math.random() * 5000) + 100,
        isLive: true
      }));

      setLiveStreams(streams);
    } catch (error) {
      console.error('Error fetching live streams:', error);
      setLiveStreams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveStreams();

    // Real-time subscription to profile and photo updates
    const channel = supabase
      .channel('live-streams-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('🔄 Live streams: profile update detected, refreshing...');
          fetchLiveStreams();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'personal_introduction'
        },
        () => {
          console.log('🔄 Live streams: cover photo update detected, refreshing...');
          fetchLiveStreams();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_photos'
        },
        () => {
          console.log('🔄 Live streams: user photo update detected, refreshing...');
          fetchLiveStreams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { liveStreams, loading, refetch: fetchLiveStreams };
};
