import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useCover } from '@/hooks/media/useCover';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCoverPhotoDrag = () => {
  const { user } = useAuth();
  const { position, updatePosition, isPositionChanging, isPositionSaving } = useCover(user?.id);
  
  const userId = user?.id;
  
  // Get cached button color for instant display
  const getCachedButtonColor = useCallback(() => {
    if (!userId) return 'rgba(255, 255, 255, 0.1)';
    try {
      const cached = localStorage.getItem(`button_color_${userId}`);
      return cached || 'rgba(255, 255, 255, 0.1)';
    } catch {
      return 'rgba(255, 255, 255, 0.1)';
    }
  }, [userId]);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [initialY, setInitialY] = useState(50);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [buttonColor, setButtonColor] = useState(() => getCachedButtonColor());
  const [originalButtonColor, setOriginalButtonColor] = useState(() => getCachedButtonColor());
  const [isSavingColor, setIsSavingColor] = useState(false);
  const coverRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const lastMouseYRef = useRef(0);
  
  // Extract Y percentage from position string
  const getCurrentY = useCallback(() => {
    const match = /center\s+(-?\d+(?:\.\d+)?)%/.exec(position);
    return match ? parseFloat(match[1]) : 50;
  }, [position]);
  
  const currentY = getCurrentY();

  // Simplified position application - no complex DOM watching
  const applyPositionToDOM = useCallback((positionStr: string) => {
    const target = coverRef.current;
    if (!target) return;
    
    // Apply position smoothly without transitions during drag
    if (isDragging) {
      target.style.transition = 'none';
      target.style.backgroundPosition = positionStr;
    } else {
      target.style.transition = 'background-position 0.3s ease';
      target.style.backgroundPosition = positionStr;
    }
  }, [isDragging]);

  // Apply position to DOM when position changes from useCover
  useEffect(() => {
    applyPositionToDOM(position);
  }, [position, applyPositionToDOM]);

  // Initialize drag Y from current position
  useEffect(() => {
    setInitialY(currentY);
  }, [currentY]);

  // Load button color from database on mount - only update if changed
  useEffect(() => {
    if (!userId) return;
    
    const loadButtonColor = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('professional_button_color')
        .eq('id', userId)
        .single();
      
      if (data?.professional_button_color && !error) {
        const dbColor = data.professional_button_color;
        
        // Only update if color actually changed
        if (dbColor !== buttonColor) {
          setButtonColor(dbColor);
          setOriginalButtonColor(dbColor);
          
          // Update cache
          localStorage.setItem(`button_color_${userId}`, dbColor);
        }
      }
    };
    
    loadButtonColor();

    // Listen for color changes from other components
    const handleColorChange = (e: CustomEvent) => {
      if (e.detail?.color && e.detail?.userId === userId) {
        const newColor = e.detail.color;
        setButtonColor(newColor);
        
        // Update cache
        localStorage.setItem(`button_color_${userId}`, newColor);
      }
    };

    window.addEventListener('button-color-changed', handleColorChange as EventListener);
    
    // Real-time subscription for database changes
    const channel = supabase
      .channel(`button-color-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload: any) => {
          const newColor = payload.new?.professional_button_color;
          if (newColor && newColor !== buttonColor) {
            setButtonColor(newColor);
            setOriginalButtonColor(newColor);
            localStorage.setItem(`button_color_${userId}`, newColor);
          }
        }
      )
      .subscribe();
    
    return () => {
      window.removeEventListener('button-color-changed', handleColorChange as EventListener);
      supabase.removeChannel(channel);
    };
  }, [userId, buttonColor]);

  // Save button color to database
  const saveButtonColor = async (color: string) => {
    if (!userId || isSavingColor) return;
    
    setIsSavingColor(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ professional_button_color: color })
        .eq('id', userId);
      
      if (error) {
        console.error('Error saving button color:', error);
        toast.error('Failed to save color');
      } else {
        // Update cache immediately
        localStorage.setItem(`button_color_${userId}`, color);
        
        // Broadcast color change to other components
        window.dispatchEvent(new CustomEvent('button-color-changed', { 
          detail: { color, userId } 
        }));
        
        toast.success('Color saved automatically', {
          duration: 2000,
        });
      }
    } catch (err) {
      console.error('Error saving button color:', err);
      toast.error('Failed to save color');
    } finally {
      setIsSavingColor(false);
    }
  };

  // Drag handlers
  const handleDragModeToggle = () => {
    if (!isPositionChanging) {
      setIsDragMode(true);
      setHasUnsavedChanges(false);
      setOriginalButtonColor(buttonColor);
      toast.info("Drag mode activated!");
    }
  };

  const handleCancelChanges = () => {
    setIsDragMode(false);
    setIsDragging(false);
    setDragStart(null);
    setHasUnsavedChanges(false);
    setButtonColor(originalButtonColor);
    
    // Reset to original position (current position from useCover)
    toast.info("Changes cancelled");
  };

  const handleButtonColorChange = async (color: string) => {
    setButtonColor(color);
    setHasUnsavedChanges(true);
    
    // Auto-save the color to database
    await saveButtonColor(color);
  };

  const handleSaveChanges = async () => {
    if (!userId || !hasUnsavedChanges) {
      setIsDragMode(false);
      setIsDragging(false);
      setDragStart(null);
      return;
    }
    
    const positionToSave = `center ${currentY}%`;
    
    try {
      const success = await updatePosition(positionToSave, true);
      
      if (success) {
        setHasUnsavedChanges(false);
        toast.success('Position saved!');
      } else {
        toast.error('Failed to save position');
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save');
    } finally {
      setIsDragMode(false);
      setIsDragging(false);
      setDragStart(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDragMode || isPositionChanging) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setInitialY(currentY);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    lastMouseYRef.current = e.clientY;
    
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = () => {};

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      document.body.style.userSelect = '';
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    }
  };

  // Global drag handling
  useEffect(() => {
    if (!isDragging || !dragStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseYRef.current = e.clientY;
      
      if (rafId.current) return;
      
      rafId.current = requestAnimationFrame(() => {
        if (!isDragging || !dragStart || !coverRef.current) {
          rafId.current = null;
          return;
        }
        
        const deltaY = lastMouseYRef.current - dragStart.y;
        const sensitivity = 0.15;
        const newY = Math.max(0, Math.min(100, initialY - (deltaY * sensitivity)));
        
        if (Math.abs(newY - currentY) > 0.1) {
          const newPosition = `center ${newY}%`;
          setHasUnsavedChanges(Math.abs(newY - initialY) > 0.5);
          
          // Update position immediately via useCover (optimistic update)
          updatePosition(newPosition, false);
        }
        
        rafId.current = null;
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragStart(null);
      document.body.style.userSelect = '';
      
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialY, currentY, userId]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      document.body.style.userSelect = '';
    };
  }, []);

  return {
    isDragging,
    isDragMode,
    isSaving: isPositionSaving,
    hasUnsavedChanges,
    coverRef,
    buttonColor,
    handleDragModeToggle,
    handleSaveChanges,
    handleCancelChanges,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleButtonColorChange
  };
};