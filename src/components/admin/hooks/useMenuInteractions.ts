
import { useCallback } from 'react';
import { MenuItem } from '../menu';

interface UseMenuInteractionsProps {
  menuItems: MenuItem[];
  draggedItemId: string | null;
  isDraggingActive: boolean;
  insertionIndex: number;
  setDragStartY: (y: number) => void;
  setDragCurrentY: (y: number) => void;
  setIsHolding: (id: string | null) => void;
  setDraggedFromIndex: (index: number) => void;
  setDraggedItemId: (id: string | null) => void;
  setIsDraggingActive: (active: boolean) => void;
  setInsertionIndex: (index: number) => void;
  calculateInsertionIndex: (clientY: number) => number;
  startHoldProgress: (itemId: string) => void;
  stopHoldProgress: () => void;
  clearHoldTimeout: () => void;
  holdTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  handleDrop: () => void;
}

export const useMenuInteractions = ({
  menuItems,
  draggedItemId,
  isDraggingActive,
  insertionIndex,
  setDragStartY,
  setDragCurrentY,
  setIsHolding,
  setDraggedFromIndex,
  setDraggedItemId,
  setIsDraggingActive,
  setInsertionIndex,
  calculateInsertionIndex,
  startHoldProgress,
  stopHoldProgress,
  clearHoldTimeout,
  holdTimeoutRef,
  handleDrop
}: UseMenuInteractionsProps) => {
  const handleMouseDown = useCallback((e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    const startY = e.clientY;
    setDragStartY(startY);
    setDragCurrentY(startY);
    setIsHolding(itemId);
    
    const currentIndex = menuItems.findIndex(item => item.id === itemId);
    setDraggedFromIndex(currentIndex);
    
    startHoldProgress(itemId);
    
    holdTimeoutRef.current = setTimeout(() => {
      setDraggedItemId(itemId);
      setIsDraggingActive(true);
      setIsHolding(null);
      stopHoldProgress();
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      // Set initial insertion index to current position
      setInsertionIndex(currentIndex);
      
      console.log('🎯 Started dragging:', { 
        itemId, 
        currentIndex, 
        itemLabel: menuItems[currentIndex]?.label 
      });
    }, 3000);
    
    const handleMouseMove = (e: MouseEvent) => {
      setDragCurrentY(e.clientY);
      
      if (isDraggingActive && draggedItemId === itemId) {
        const newInsertionIndex = calculateInsertionIndex(e.clientY);
        setInsertionIndex(newInsertionIndex);
      }
    };
    
    const handleMouseUp = () => {
      clearHoldTimeout();
      stopHoldProgress();
      setIsHolding(null);
      handleDrop();
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isDraggingActive, draggedItemId, menuItems, insertionIndex, calculateInsertionIndex, startHoldProgress, stopHoldProgress, clearHoldTimeout, holdTimeoutRef, handleDrop, setDragStartY, setDragCurrentY, setIsHolding, setDraggedFromIndex, setDraggedItemId, setIsDraggingActive, setInsertionIndex]);

  const handleTouchStart = useCallback((e: React.TouchEvent, itemId: string) => {
    e.preventDefault();
    const touch = e.touches[0];
    const startY = touch.clientY;
    setDragStartY(startY);
    setDragCurrentY(startY);
    setIsHolding(itemId);
    
    const currentIndex = menuItems.findIndex(item => item.id === itemId);
    setDraggedFromIndex(currentIndex);
    
    startHoldProgress(itemId);
    
    holdTimeoutRef.current = setTimeout(() => {
      setDraggedItemId(itemId);
      setIsDraggingActive(true);
      setIsHolding(null);
      stopHoldProgress();
      document.body.style.userSelect = 'none';
      
      setInsertionIndex(currentIndex);
    }, 3000);
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        setDragCurrentY(e.touches[0].clientY);
        
        if (isDraggingActive && draggedItemId === itemId) {
          const newInsertionIndex = calculateInsertionIndex(e.touches[0].clientY);
          setInsertionIndex(newInsertionIndex);
        }
      }
    };
    
    const handleTouchEnd = () => {
      clearHoldTimeout();
      stopHoldProgress();
      setIsHolding(null);
      handleDrop();
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [isDraggingActive, draggedItemId, menuItems, insertionIndex, calculateInsertionIndex, startHoldProgress, stopHoldProgress, clearHoldTimeout, holdTimeoutRef, handleDrop, setDragStartY, setDragCurrentY, setIsHolding, setDraggedFromIndex, setDraggedItemId, setIsDraggingActive, setInsertionIndex]);

  return {
    handleMouseDown,
    handleTouchStart
  };
};
