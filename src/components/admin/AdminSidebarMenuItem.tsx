
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { menuColorVariants } from './menu';
import { MenuItem } from './menu';

interface AdminSidebarMenuItemProps {
  item: MenuItem;
  index: number;
  openMenus: Record<string, boolean>;
  toggleMenu: (id: string) => void;
  selectedItems: Record<string, boolean>;
  onItemSelect: (id: string) => void;
}

const AdminSidebarMenuItemComponent: React.FC<AdminSidebarMenuItemProps> = ({
  item,
  index,
  openMenus,
  toggleMenu,
  selectedItems,
  onItemSelect
}) => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const colorVariant = menuColorVariants[item.colorVariant];
  const IconComponent = item.icon;
  const isSelected = selectedItems[item.id];
  const buttonNumber = index + 1;

  const handleItemClick = (e: React.MouseEvent) => {
    // Prevent sidebar from closing when interacting with menu items
    e.preventDefault();
    e.stopPropagation();
    
    // If sidebar is closed, open it first
    if (!open) {
      setOpen(true);
      return;
    }
    
    // Always handle selection for individual button state
    onItemSelect(item.id);
    
    // Only handle menu toggle if item has submenu
    if (item.submenu) {
      toggleMenu(item.id);
    }
  };

  // For items with submenu
  if (item.submenu) {
    return (
      <SidebarMenuItem key={item.id} className="sidebar-menu-item mb-2">
        <Collapsible open={openMenus[item.id]} onOpenChange={() => toggleMenu(item.id)}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton 
              className={`${colorVariant} justify-between bg-white hover:bg-green-100 sidebar-button user-info-circle-container rounded-full honey-smoke-effect px-2 py-2 min-h-[36px] w-full transition-all duration-300 ease-out hover:scale-[1.02] select-none ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' : ''
              }`} 
              tooltip={!open ? item.label : undefined}
              onClick={handleItemClick}
            >
              <div className="flex items-center min-w-0 flex-1">
                {!open ? (
                  <div className="flex items-center justify-center w-full">
                    <span className="text-lg">{item.label.split(' ')[0]}</span>
                  </div>
                ) : (
                  <span className="sidebar-text truncate text-xs pointer-events-none">{item.label}</span>
                )}
              </div>
              {open && (
                <div className="flex-shrink-0 ml-1 w-5 flex justify-center">
                  {openMenus[item.id] ? (
                    <ChevronDown className="h-3 w-3 user-info-circle-container rounded-full p-0.5 transition-all duration-300 ease-out hover:scale-[1.1] green-smoke-effect pointer-events-none" />
                  ) : (
                    <ChevronRight className="h-3 w-3 user-info-circle-container rounded-full p-0.5 transition-all duration-300 ease-out hover:scale-[1.1] green-smoke-effect pointer-events-none" />
                  )}
                </div>
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-1 sidebar-content">
            {open && item.submenu?.map(subitem => {
              console.log(`🔧 [SUBMENU-DEBUG] Rendering submenu item for ${item.label}: ${subitem.label} -> ${subitem.href}`);
              return (
                <Link 
                  key={subitem.id} 
                  to={subitem.href} 
                  className={`pl-6 py-1 text-xs flex items-center hover:bg-green-100 sidebar-submenu-item user-info-circle-container rounded-full ml-1 mb-1 honey-smoke-effect transition-all duration-300 ease-out hover:scale-[1.02]
                    ${location.pathname === subitem.href ? 'font-medium text-green-500 bg-blue-50' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent sidebar from closing
                    console.log(`🔧 [SUBMENU-CLICK] Clicked submenu: ${subitem.label} -> ${subitem.href}`);
                  }}
                >
                  <span className="pointer-events-none">{subitem.label}</span>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  // For items without submenu
  return (
    <SidebarMenuItem key={item.id} className="sidebar-menu-item mb-2">
      <SidebarMenuButton 
        asChild 
        className={`${colorVariant} bg-white hover:bg-green-100 sidebar-button user-info-circle-container rounded-full honey-smoke-effect px-2 py-2 min-h-[36px] w-full transition-all duration-300 ease-out hover:scale-[1.02] select-none ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' : ''
        }`} 
        isActive={location.pathname === item.href} 
        tooltip={!open ? item.label : undefined}
      >
        <Link 
          to={item.href || '#'} 
          className="flex items-center w-full"
          onClick={(e) => {
            if (!open) {
              e.preventDefault();
              setOpen(true);
              return;
            }
            handleItemClick(e);
          }}
        >
          {!open ? (
            <div className="flex items-center justify-center w-full">
              <span className="text-lg">{item.label.split(' ')[0]}</span>
            </div>
          ) : (
            <span className={`sidebar-text text-xs truncate pointer-events-none ${location.pathname === item.href ? 'text-green-500 font-medium' : ''}`}>{item.label}</span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AdminSidebarMenuItemComponent;
