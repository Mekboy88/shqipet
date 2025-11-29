
import { MenuItem, ColorVariant } from './types';
import { coreMenuItems } from './coreMenuItems';
import { usersAccessMenuItems } from './usersAccessMenuItems';
import { contentMenuItems } from './contentMenuItems';
import { aiSmartMenuItems } from './aiSmartMenuItems';
import { securityLogsMenuItems } from './securityLogsMenuItems';
import { businessMenuItems } from './businessMenuItems';
import { revenueMenuItems } from './revenueMenuItems';
import { advancedMenuItems } from './advancedMenuItems';
import { devToolsMenuItems } from './devToolsMenuItems';
import { systemMenuItems } from './systemMenuItems';
import { colorVariants } from './colorVariants';

export type { MenuItem, ColorVariant };

// Combine all menu items from different categories
export const menuItems: MenuItem[] = [
  ...coreMenuItems,
  ...usersAccessMenuItems, 
  ...contentMenuItems,
  ...aiSmartMenuItems,
  ...securityLogsMenuItems,
  ...businessMenuItems,
  ...revenueMenuItems,
  ...advancedMenuItems,
  ...devToolsMenuItems,
  ...systemMenuItems
];

export { colorVariants };

// Re-export for backward compatibility
export const menuColorVariants = colorVariants;
