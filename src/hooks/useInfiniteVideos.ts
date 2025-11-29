import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isSecureVideoFile } from '@/utils/videoSecurity';
import { processWasabiUrl } from '@/services/media/LegacyMediaService';

interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnail: string;
  creator: string;
  caption: string;
  viewsCount: number;
  views: string; // For ReelsViewer compatibility
  title: string;
  timestamp: number;
  isShortVideo: boolean;
}

interface UseInfiniteVideosResult {
  videos: VideoItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  retry: () => void;
}

const ITEMS_PER_PAGE = 24;
const POSTS_CHUNK = 50; // fetch posts in chunks until we accumulate 24 videos
const MAX_CONCURRENT_REQUESTS = 6;

const MIN_DURATION_SECONDS = 5;
const MAX_DURATION_SECONDS = 120; // 2 minutes

export function useInfiniteVideos(): UseInfiniteVideosResult {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [cursorCreatedAt, setCursorCreatedAt] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const concurrencySlots = useRef<Set<string>>(new Set());

  // Load video metadata and capture a first-frame poster (if CORS allows)
  const getDurationAndPoster = useCallback(
    async (url: string, signal: AbortSignal): Promise<{ duration: number; poster?: string } | null> => {
      return new Promise((resolve) => {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          video.playsInline = true;
          video.crossOrigin = 'anonymous';

          let timeoutId: number | null = null;
          const cleanup = () => {
            if (timeoutId) window.clearTimeout(timeoutId);
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('seeked', onSeeked);
            video.removeEventListener('error', onError);
          };

          const onError = () => { cleanup(); resolve({ duration: Number.NaN }); };

          const onSeeked = () => {
            try {
              const canvas = document.createElement('canvas');
              const targetW = 320;
              const ratio = video.videoWidth ? targetW / video.videoWidth : 1;
              canvas.width = targetW;
              canvas.height = Math.max(1, Math.floor((video.videoHeight || targetW) * ratio));
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const poster = canvas.toDataURL('image/jpeg', 0.7);
                cleanup();
                resolve({ duration: video.duration, poster });
                return;
              }
            } catch (e) {
              // Likely CORS-tainted canvas; fallback without poster
            }
            cleanup();
            resolve({ duration: video.duration });
          };

          const onLoadedMetadata = () => {
            if (signal.aborted) { cleanup(); resolve({ duration: Number.NaN }); return; }
            const d = video.duration;
            if (!isFinite(d)) { cleanup(); resolve({ duration: Number.NaN }); return; }
            // If out of range, return duration (so caller can filter out)
            if (d < MIN_DURATION_SECONDS || d > MAX_DURATION_SECONDS) {
              cleanup();
              resolve({ duration: d });
              return;
            }
            // Seek a tiny bit to ensure we have a frame ready
            try {
              video.currentTime = Math.min(0.1, Math.max(0, d - 0.1));
            } catch {
              // If seeking fails, just resolve with duration
              cleanup();
              resolve({ duration: d });
            }
          };

          video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
          video.addEventListener('seeked', onSeeked, { once: true });
          video.addEventListener('error', onError, { once: true });

          if ((signal as any)?.addEventListener) {
            signal.addEventListener('abort', () => { cleanup(); resolve({ duration: Number.NaN }); }, { once: true });
          }

          timeoutId = window.setTimeout(() => { cleanup(); resolve({ duration: Number.NaN }); }, 12000) as unknown as number;
          video.src = url;
        } catch {
          resolve({ duration: Number.NaN });
        }
      });
    },
    []
  );

  const fetchPostsChunk = useCallback(async (cursor: string | null, signal: AbortSignal) => {
    let query = supabase
      .from('posts')
      .select(
        `id,user_id,user_name,content_text,content_images,created_at,updated_at,post_type`
      )
      .not('created_at', 'is', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(POSTS_CHUNK);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return { posts: [], nextCursor: null as string | null };

    const nextCursor = data.length > 0 ? data[data.length - 1].created_at : null;
    return { posts: data, nextCursor };
  }, []);

  const collectVideosFromPosts = useCallback(
    async (posts: any[], signal: AbortSignal): Promise<VideoItem[]> => {
      const results: (VideoItem | null)[] = await Promise.all(
        posts.map(async (post) => {
          // Respect abort
          if (signal.aborted) return null;

          const images = post.content_images || [];
          const single = (post as any).content?.image ? [(post as any).content.image] : [];
          const sources = [...images, ...single];
          
          // STRICT: Only process posts that have videos AND no photos at all
          const hasVideo = sources.some((url: string) => isSecureVideoFile(url));
          const hasPhoto = sources.some((url: string) => !isSecureVideoFile(url) && url && url.trim() !== '');
          
          // Skip posts that have photos mixed with videos - videos only
          if (!hasVideo || hasPhoto) return null;
          
          const raw = sources.find((url: string) => isSecureVideoFile(url));
          if (!raw) return null;

          // Concurrency gate
          while (concurrencySlots.current.size >= MAX_CONCURRENT_REQUESTS) {
            await new Promise((r) => setTimeout(r, 40));
            if (signal.aborted) return null;
          }
          const slotId = Math.random().toString(36);
          concurrencySlots.current.add(slotId);
          try {
            const url = await processWasabiUrl(raw).catch(() => raw);

            // Read duration and capture first-frame poster
            const meta = await getDurationAndPoster(url, signal);
            // Filter by duration only if we have a finite duration value
            if (meta && Number.isFinite(meta.duration) && (meta.duration < MIN_DURATION_SECONDS || meta.duration > MAX_DURATION_SECONDS)) {
              return null;
            }

            const viewsCount = Number((post as any).views ?? (post as any).viewCount ?? 0) || 0;
            return {
              id: post.id,
              videoUrl: url,
              thumbnail: (meta && meta.poster) ? meta.poster : url,
              creator: post.user_name || 'Përdorues',
              caption: post.content_text || 'Video e shkurtër interesante',
              viewsCount,
              views: `${viewsCount}`,
              title: post.content_text || 'Video e Shkurtër',
              timestamp: new Date(post.created_at).getTime(),
              isShortVideo: true,
            } as VideoItem;
          } catch (e) {
            console.warn('Failed to process video', post.id, e);
            return null;
          } finally {
            concurrencySlots.current.delete(slotId);
          }
        })
      );

      return results.filter((v): v is VideoItem => !!v);
    },
    [getDurationAndPoster]
  );

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    try {
      const signal = abortControllerRef.current.signal;
      const collected: VideoItem[] = [];
      let localCursor = cursorCreatedAt;
      let more = true;

      while (collected.length < ITEMS_PER_PAGE && more && !signal.aborted) {
        const { posts, nextCursor } = await fetchPostsChunk(localCursor, signal);
        if (signal.aborted) break;
        if (posts.length === 0) {
          more = false;
          break;
        }

        const videosFromChunk = await collectVideosFromPosts(posts, signal);
        for (const v of videosFromChunk) {
          if (collected.length < ITEMS_PER_PAGE) collected.push(v);
        }

        localCursor = nextCursor;
        // If chunk size < POSTS_CHUNK, we've reached the end
        if (!nextCursor || posts.length < POSTS_CHUNK) {
          more = false;
        }
      }

      if (!signal.aborted) {
        setVideos((prev) => (page === 0 ? collected : [...prev, ...collected]));
        setPage((p) => p + 1);
        setCursorCreatedAt(localCursor ?? null);
        setHasMore(!!localCursor);
      }
    } catch (err: any) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Failed to load videos:', err?.message || err);
        setError('S’u ngarkuan videot. Provo përsëri.');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, cursorCreatedAt, fetchPostsChunk, collectVideosFromPosts]);

  const retry = useCallback(() => {
    setError(null);
    setVideos([]);
    setPage(0);
    setHasMore(true);
    setCursorCreatedAt(null);
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (videos.length === 0 && !loading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  return { videos, loading, error, hasMore, loadMore, retry };
}
