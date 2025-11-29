
import React from 'react';
import AdminSidebarMenuItemComponent from '../AdminSidebarMenuItem';
import { HoldProgressBar } from './HoldProgressBar';
import { MenuItem } from '../menu';

interface DraggableMenuItemProps {
  item: MenuItem;
  index: number;
  isDragged: boolean;
  isHoldingThis: boolean;
  transform: string;
  holdProgress: number;
  openMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
  selectedItems: Record<string, boolean>;
  onItemSelect: (id: string) => void;
  onMouseDown: (e: React.MouseEvent, itemId: string) => void;
  onTouchStart: (e: React.TouchEvent, itemId: string) => void;
}

export const DraggableMenuItem: React.FC<DraggableMenuItemProps> = ({
  item,
  index,
  isDragged,
  isHoldingThis,
  transform,
  holdProgress,
  openMenus,
  toggleMenu,
  selectedItems,
  onItemSelect,
  onMouseDown,
  onTouchStart
}) => {
  return (
    <div 
      key={item.id} 
      className={`w-[95%] mx-auto my-0 py-0 transition-all duration-300 ease-out ${
        isDragged ? 'z-50 shadow-2xl' : ''
      } ${isHoldingThis ? 'scale-105' : ''}`}
      style={{
        transform: isDragged 
          ? `${transform} translateZ(20px) scale(1.05)` 
          : transform,
        opacity: isDragged ? 0.95 : 1,
        zIndex: isDragged ? 1000 : isHoldingThis ? 100 : 1,
        filter: isDragged ? 'drop-shadow(0 10px 25px rgba(0,0,0,0.3))' : 'none',
        transition: isDragged ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
    >
      <AdminSidebarMenuItemComponent 
        item={item} 
        index={index}
        openMenus={openMenus} 
        toggleMenu={toggleMenu}
        selectedItems={selectedItems}
        onItemSelect={onItemSelect}
      />
      
      <HoldProgressBar 
        isHoldingThis={isHoldingThis}
        holdProgress={holdProgress}
      />
    </div>
  );
};
