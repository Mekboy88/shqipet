import React, { useState, useCallback, useEffect } from 'react';
import { SidebarMenu } from '@/components/ui/sidebar';
import { menuItems as originalMenuItems } from './menu';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useHoldProgress } from './hooks/useHoldProgress';
import { useMenuInteractions } from './hooks/useMenuInteractions';
import { DragIndicators } from './components/DragIndicators';
import { DraggableMenuItem } from './components/DraggableMenuItem';

const AdminSidebarMenuComponent: React.FC = () => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [menuItems, setMenuItems] = useState(() => originalMenuItems);
  
  // Sync with original menu items if they change
  useEffect(() => {
    setMenuItems(originalMenuItems);
  }, [originalMenuItems]);
  
  const toggleMenu = (id: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleItemSelect = (id: string) => {
    setSelectedItems(prev => {
      // If this item is already selected, deselect it
      if (prev[id]) {
        return {};
      }
      // Otherwise, select only this item (clear all others)
      return { [id]: true };
    });
  };

  const persistMenuOrder = useCallback(async (newMenuItems: typeof menuItems) => {
    try {
      localStorage.setItem('admin-sidebar-order', JSON.stringify(newMenuItems.map(item => item.id)));
      console.log('Menu order persisted successfully:', newMenuItems.map(item => ({ id: item.id, label: item.label })));
    } catch (error) {
      console.error('Failed to persist menu order:', error);
    }
  }, []);

  const {
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
  } = useDragAndDrop(menuItems, setMenuItems, persistMenuOrder);

  const {
    isHolding,
    setIsHolding,
    holdProgress,
    holdTimeoutRef,
    startHoldProgress,
    stopHoldProgress,
    clearHoldTimeout
  } = useHoldProgress();

  const { handleMouseDown, handleTouchStart } = useMenuInteractions({
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
  });

  return (
    <SidebarMenu className="slide-in-menu relative" ref={menuContainerRef}>
      {menuItems.map((item, index) => {
        const isDragged = draggedItemId === item.id;
        const isHoldingThis = isHolding === item.id;
        const transform = getItemTransform(index, item.id);
        
        return (
          <DraggableMenuItem
            key={item.id}
            item={item}
            index={index}
            isDragged={isDragged}
            isHoldingThis={isHoldingThis}
            transform={transform}
            holdProgress={holdProgress}
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            selectedItems={selectedItems}
            onItemSelect={handleItemSelect}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          />
        );
      })}
      
      <DragIndicators
        isHolding={isHolding}
        holdProgress={holdProgress}
        isDraggingActive={isDraggingActive}
        insertionIndex={insertionIndex}
      />
    </SidebarMenu>
  );
};

export default AdminSidebarMenuComponent;
