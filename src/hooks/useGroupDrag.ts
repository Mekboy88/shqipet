import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Translate {
  translateX: number;
  translateY: number;
}

interface UseGroupDragProps {
  userId: string | undefined;
}

type CacheKey = `photo-text-transform-${string}` | 'photo-text-transform-last';

export const useGroupDrag = ({ userId }: UseGroupDragProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const hadCacheRef = useRef(false);

  // Load cached transform immediately to avoid flicker
  const getCached = (): Translate => {
    try {
      let raw: string | null = null;
      if (userId) raw = localStorage.getItem(`photo-text-transform-${userId}` as CacheKey);
      if (!raw) raw = localStorage.getItem('photo-text-transform-last');
      if (raw) {
        hadCacheRef.current = true;
        return JSON.parse(raw) as Translate;
      }
    } catch {}
    hadCacheRef.current = false;
    return { translateX: 0, translateY: 0 };
  };

  const [transform, setTransform] = useState<Translate>(getCached());
  const persistedRef = useRef<Translate>(transform);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Load saved transform
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('photo_text_transform')
          .eq('id', userId)
          .maybeSingle();
        if (!error && data?.photo_text_transform) {
          const db = data.photo_text_transform as Translate;
          setTransform(db);
          persistedRef.current = db;
          localStorage.setItem(`photo-text-transform-${userId}` as CacheKey, JSON.stringify(db));
          localStorage.setItem('photo-text-transform-last', JSON.stringify(db));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - transform.translateX,
      y: e.clientY - transform.translateY,
    };
  }, [transform]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const translateX = e.clientX - dragStartRef.current.x;
    const translateY = e.clientY - dragStartRef.current.y;
    const max = 2000;
    setTransform({
      translateX: Math.max(-max, Math.min(max, translateX)),
      translateY: Math.max(-max, Math.min(max, translateY)),
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const save = useCallback(async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ photo_text_transform: transform })
        .eq('id', userId);
      if (error) throw error;
      persistedRef.current = transform;
      localStorage.setItem(`photo-text-transform-${userId}` as CacheKey, JSON.stringify(transform));
      localStorage.setItem('photo-text-transform-last', JSON.stringify(transform));
      toast.success('Text position saved');
      setIsEditMode(false);
    } catch (e) {
      console.error(e);
      toast.error('Failed to save text position');
    } finally {
      setIsSaving(false);
    }
  }, [userId, transform]);

  const cancel = useCallback(() => {
    setTransform(persistedRef.current);
    setIsEditMode(false);
  }, []);

  const reset = useCallback(() => {
    setTransform({ translateX: 0, translateY: 0 });
  }, []);

  const setPosition = useCallback((t: Translate) => {
    setTransform(t);
  }, []);

  return {
    isEditMode,
    setIsEditMode,
    isDragging,
    isSaving,
    isLoading,
    hadCache: hadCacheRef.current,
    transform,
    handleDragStart,
    save,
    cancel,
    reset,
    setPosition,
  };
};
