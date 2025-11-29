
import { useState, useRef, useCallback } from 'react';
import { MenuItem } from '../menu';

export const useDragAndDrop = (
  menuItems: MenuItem[],
  setMenuItems: (items: MenuItem[]) => void,
  persistMenuOrder: (items: MenuItem[]) => Promise<void>
) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState<number>(0);
  const [dragCurrentY, setDragCurrentY] = useState<number>(0);
  const [isDraggingActive, setIsDraggingActive] = useState(false);
  const [insertionIndex, setInsertionIndex] = useState<number>(-1);
  const [draggedFromIndex, setDraggedFromIndex] = useState<number>(-1);
  const menuContainerRef = useRef<HTMLUListElement | null>(null);

  const calculateInsertionIndex = useCallback((clientY: number) => {
    if (!menuContainerRef.current) return -1;
    
    const containerRect = menuContainerRef.current.getBoundingClientRect();
    const relativeY = clientY - containerRect.top;
    const itemHeight = 60;
    
    // Calculate which slot we're closest to
    const rawIndex = relativeY / itemHeight;
    let insertionPoint = Math.round(rawIndex);
    
    // Clamp between 0 and menuItems.length
    insertionPoint = Math.max(0, Math.min(menuItems.length, insertionPoint));
    
    console.log('📍 Insertion calculation:', {
      clientY,
      containerTop: containerRect.top,
      relativeY,
      rawIndex,
      insertionPoint,
      totalItems: menuItems.length,
      draggedFromIndex
    });
    
    return insertionPoint;
  }, [menuItems.length, draggedFromIndex]);

  const getItemTransform = useCallback((itemIndex: number, itemId: string) => {
    const isDragged = draggedItemId === itemId;
    
    if (isDragged) {
      // The dragged item follows the mouse
      const deltaY = dragCurrentY - dragStartY;
      return `translateY(${deltaY}px)`;
    }
    
    if (!isDraggingActive || insertionIndex === -1 || draggedFromIndex === -1) {
      return 'translateY(0px)';
    }
    
    // Direction-aware space allocation
    const itemHeight = 60;
    let shouldMove = false;
    let direction = 0; // -1 for up, 1 for down
    
    if (insertionIndex > draggedFromIndex) {
      // Dragging down: items between original and target move up
      if (itemIndex > draggedFromIndex && itemIndex < insertionIndex) {
        shouldMove = true;
        direction = -1; // Move up
      }
    } else if (insertionIndex < draggedFromIndex) {
      // Dragging up: items between target and original move down
      if (itemIndex >= insertionIndex && itemIndex < draggedFromIndex) {
        shouldMove = true;
        direction = 1; // Move down
      }
    }
    
    const translateY = shouldMove ? direction * itemHeight : 0;
    
    console.log(`🔄 Item ${itemIndex} (${itemId.substring(0, 8)}):`, {
      shouldMove,
      direction: direction === -1 ? 'up' : direction === 1 ? 'down' : 'none',
      translateY,
      insertionIndex,
      draggedFromIndex
    });
    
    return `translateY(${translateY}px)`;
  }, [isDraggingActive, insertionIndex, draggedFromIndex, draggedItemId, dragCurrentY, dragStartY]);

  const handleDrop = useCallback(() => {
    if (isDraggingActive && draggedItemId) {
      const draggedIndex = menuItems.findIndex(item => item.id === draggedItemId);
      const targetIndex = insertionIndex;
      
      console.log('🎯 Dropping item:', { 
        draggedIndex, 
        targetIndex, 
        draggedItemId,
        totalItems: menuItems.length 
      });
      
      // Only update if position actually changed
      if (targetIndex !== draggedIndex && targetIndex >= 0 && targetIndex <= menuItems.length) {
        const newMenuItems = [...menuItems];
        const draggedItem = newMenuItems.splice(draggedIndex, 1)[0];
        
        // Insert at the new position
        const finalIndex = targetIndex > draggedIndex ? targetIndex - 1 : targetIndex;
        newMenuItems.splice(finalIndex, 0, draggedItem);
        
        setMenuItems(newMenuItems);
        persistMenuOrder(newMenuItems);
        console.log('✅ New menu order applied:', newMenuItems.map(item => item.label));
      }
    }
    
    // Reset all drag states
    setDraggedItemId(null);
    setIsDraggingActive(false);
    setInsertionIndex(-1);
    setDraggedFromIndex(-1);
    setDragStartY(0);
    setDragCurrentY(0);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [isDraggingActive, draggedItemId, menuItems, insertionIndex, setMenuItems, persistMenuOrder]);

  const resetDragState = useCallback(() => {
    setDraggedItemId(null);
    setIsDraggingActive(false);
    setInsertionIndex(-1);
    setDraggedFromIndex(-1);
    setDragStartY(0);
    setDragCurrentY(0);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  return {
    draggedItemId,
    setDraggedItemId,
    dragStartY,
    setDragStartY,
    dragCurrentY,
    setDragCurrentY,
    isDraggingActive,
    setIsDraggingActive,
    insertionIndex,
    setInsertionIndex,
    draggedFromIndex,
    setDraggedFromIndex,
    menuContainerRef,
    calculateInsertionIndex,
    getItemTransform,
    handleDrop,
    resetDragState
  };
};
