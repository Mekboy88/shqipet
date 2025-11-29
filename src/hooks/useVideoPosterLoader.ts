import { useEffect, useRef, useState } from "react";

/**
 * Robust loader for video posters/first frame.
 * - succeeds on onLoadedData/onCanPlay OR poster onload
 * - 8s timeout + up to 2 retries for poster URL
 */
export function useVideoPosterLoader(posterUrl?: string) {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Try to pre-load poster (optional but helps show shimmer consistently)
  useEffect(() => {
    if (!posterUrl) return;

    let cancelled = false;
    const img = new Image();
    img.loading = "eager";
    img.referrerPolicy = "no-referrer";
    img.decoding = "async";
    img.onload = () => {
      if (!cancelled) {
        // Mark ready immediately when poster loads - don't wait for video
        setLoading(false);
      }
    };
    img.onerror = () => {
      // retry up to 2 times with cache-buster
      if (!cancelled && attempt < 2) {
        setAttempt((a) => a + 1);
      } else if (!cancelled) {
        // Fail poster but we still wait for video events/timeout
      }
    };
    img.src = attempt === 0 ? posterUrl : `${posterUrl}${posterUrl.includes("?") ? "&" : "?"}r=${Date.now()}`;

    return () => { cancelled = true; };
  }, [posterUrl, attempt]);

  // Global safety timeout to avoid infinite shimmer (15s)
  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      setLoading(false);
    }, 15000) as unknown as number;
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const markReady = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setLoading(false);
  };

  const markError = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setErrored(true);
    setLoading(false);
  };

  return { loading, errored, markReady, markError };
}