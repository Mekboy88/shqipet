
interface TabsListStyles {
  transparent: boolean;
  justifyContent: string;
  overflow: string;
  borderWidth: number;
  maxWidth: number;
}

interface Window {
  changeCoverHeight?: (height: number) => void;
  changeCoverGradient?: (gradient: string) => void;
  adjustGradientStrength?: (intensity: number) => void;
  editTabsList?: (options: {
    borderWidth?: number;
    maxWidth?: number;
    transparent?: boolean;
    justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    overflow?: 'auto' | 'hidden' | 'visible';
  }) => void;
  
  editBorderLine?: (options: {
    borderColor?: string;
    borderWidth?: string;
    borderStyle?: string;
    marginTop?: string;
    width?: string;
    maxWidth?: string;
    marginLeft?: string;
    marginRight?: string;
    position?: 'left' | 'right' | 'center';
    moveLeft?: number;
    moveRight?: number;
  }) => void;

  editNavigationBorderLine?: (options: {
    borderColor?: string;
    borderWidth?: string;
    marginTop?: string;
    width?: string;
    maxWidth?: string;
    borderStyle?: string;
    marginLeft?: string;
    marginRight?: string;
    position?: 'left' | 'right' | 'center';
    moveLeft?: number;
    moveRight?: number;
    moveUp?: number;
    moveDown?: number;
    verticalPosition?: number;
    top?: string;
    bottom?: string;
    height?: string;
    backgroundColor?: string;
    display?: 'block' | 'none' | 'flex';
    opacity?: number;
  }) => void;
  
  editProfileTabs?: (options: Partial<TabsListStyles>) => void;

  editSponsoredImages?: (options: {
    width?: number | string;
    height?: number | string;
    borderRadius?: string;
    margin?: string;
    borderWidth?: string;
    borderColor?: string;
    backgroundColor?: string;
  }) => void;

  editProfileSidebar?: (options: {
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingX?: number;
    paddingY?: number;
    width?: number | string;
    maxWidth?: number | string;
    height?: number | string;
    scale?: number;
    scaleX?: number;
    scaleY?: number;
    zIndex?: number;
    opacity?: number;
    backgroundColor?: string;
    borderRadius?: string;
    boxShadow?: string;
    transform?: string;
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
  }) => void;

  moveSidebarUp?: (pixels?: number) => void;
  moveSidebarDown?: (pixels?: number) => void;
  makeSidebarBigger?: (scale?: number) => void;
  makeSidebarSmaller?: (scale?: number) => void;
  makeSidebarWider?: (scaleX?: number) => void;
  makeSidebarNarrower?: (scaleX?: number) => void;
  setSidebarHorizontalSize?: (percentage: number) => void;
  resetSidebar?: () => void;

  // Navigation Container editing functions
  editNavigationContainer?: (options: {
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
  }) => void;

  loadNavigationStyles?: () => void;
  resetNavigationContainer?: () => void;
  centerNavigation?: () => void;
  narrowNavigation?: () => void;
  wideNavigation?: () => void;

  // Cover Photo editing functions
  editCoverPhoto?: (options: {
    width?: string;
    maxWidth?: string;
    scaleX?: number;
    scale?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingLeft?: number;
    paddingRight?: number;
    transform?: string;
    backgroundColor?: string;
    borderRadius?: string;
    height?: string;
  }) => void;

  makeCoverPhotoNarrower?: (scaleX?: number) => void;
  makeCoverPhotoWider?: (scaleX?: number) => void;
  setCoverPhotoHorizontalSize?: (percentage: number) => void;
  resetCoverPhoto?: () => void;

  // Profile Header editing functions
  editProfileHeader?: (options: {
    marginTop?: number;
    marginBottom?: number;
    paddingTop?: number;
    paddingBottom?: number;
    height?: string;
    backgroundColor?: string;
    borderRadius?: string;
    position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
    zIndex?: number;
    opacity?: number;
    transform?: string;
    scale?: number;
    scaleY?: number;
  }) => void;

  loadProfileHeaderStyles?: () => void;
  resetProfileHeader?: () => void;

  // Feed positioning functions
  moveFeedToRight?: (pixels?: number) => void;
  moveFeedToLeft?: (pixels?: number) => void;
  centerFeed?: () => void;
  adjustFeedPosition?: (options: {
    marginLeft?: string | number;
    marginRight?: string | number;
    transform?: string;
    position?: 'relative' | 'absolute' | 'fixed';
    left?: string | number;
    right?: string | number;
    width?: string | number;
    maxWidth?: string | number;
  }) => void;
  resetFeedPosition?: () => void;

  // Left Sidebar positioning functions
  moveLeftSidebarRight?: (pixels?: number) => void;
  moveLeftSidebarLeft?: (pixels?: number) => void;
  resetLeftSidebarPosition?: () => void;
  adjustLeftSidebarPosition?: (options: {
    left?: string | number;
    marginLeft?: string | number;
    transform?: string;
    width?: string | number;
    zIndex?: number;
    opacity?: number;
    backgroundColor?: string;
    borderRadius?: string;
    boxShadow?: string;
  }) => void;

  // Enhanced Search Bar positioning functions
  moveSearchBar?: (direction: 'left' | 'right', amount?: number) => void;
  moveSearchBarLeft?: (amount?: number) => void;
  moveSearchBarRight?: (amount?: number) => void;
  moveSearchBarRightTiny?: (amount?: number) => void;
  moveSearchBarLeftTiny?: (amount?: number) => void;
  moveSearchBarLeftBig?: (amount?: number) => void;
  moveSearchBarRightBig?: (amount?: number) => void;
  resetSearchBarPosition?: () => void;
  setSearchBarPosition?: (pixels: number) => void;
  getSearchBarPosition?: () => number;
  setSearchBarCSS?: (cssProperties: Record<string, string>) => void;
  clearSearchBarStyles?: () => void;

  // Feed PiP handler
  feedPipHandler?: (videoUrl: string, post: any) => void;
}
