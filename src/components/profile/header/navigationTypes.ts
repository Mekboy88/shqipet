
export interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userProfilePhoto?: string;
  userName?: string;
  isNavigationSticky?: boolean;
}

export interface NavigationTab {
  id: string;
  label: string;
}

export interface NavigationStyleOptions {
  marginLeft?: number;
  marginRight?: number;
  paddingLeft?: number;
  paddingRight?: number;
  maxWidth?: string;
  width?: string;
  transform?: string;
  scale?: number;
  backgroundColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: number;
  zIndex?: number;
}
